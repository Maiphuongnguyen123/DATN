package com.cntt.rentalmanagement.services.impl;


import com.cntt.rentalmanagement.config.FileStorageProperties;
import com.cntt.rentalmanagement.exception.FileStorageException;
import com.cntt.rentalmanagement.exception.MyFileNotFoundException;
import com.cntt.rentalmanagement.services.FileStorageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;

@Service
public class FileStorageServiceImpl implements FileStorageService {
    private Path fileStorageLocation;

    public FileStorageServiceImpl() {
        // TODO document why this constructor is empty
    }

    @Autowired
    public void FileStorageService(FileStorageProperties fileStorageProperties) {
        this.fileStorageLocation = Paths.get(fileStorageProperties.getUploadDir())
                .toAbsolutePath().normalize();
                System.out.println(fileStorageLocation  + "222222222");
        try {
            Files.createDirectories(this.fileStorageLocation);
            
        } catch (Exception ex) {
            throw new FileStorageException("Invalid");
        }
    }

    @Override
    public String storeFile(MultipartFile file) {
        String fileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));

        try {
            if (fileName.contains(".."))
                throw new FileStorageException("Invalid!!");

            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            file.transferTo(targetLocation.toFile());
            return fileName;
        } catch (IOException ex) {
            throw new FileStorageException("Invalid!!!");
        }
    }

    @Override
    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if(resource.exists()) {
                return resource;
            } else {
                throw new MyFileNotFoundException("Not found!!!");
            }
        } catch (MalformedURLException ex) {
            throw new MyFileNotFoundException("Not found!!!");
        }
    }
}
