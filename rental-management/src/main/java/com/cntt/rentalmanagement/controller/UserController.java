package com.cntt.rentalmanagement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.cntt.rentalmanagement.domain.models.User;
import com.cntt.rentalmanagement.domain.enums.RoleName;
import com.cntt.rentalmanagement.exception.ResourceNotFoundException;
import com.cntt.rentalmanagement.repository.UserRepository;
import com.cntt.rentalmanagement.secruity.CurrentUser;
import com.cntt.rentalmanagement.secruity.UserPrincipal;
import com.cntt.rentalmanagement.services.impl.FileStorageServiceImpl;
import com.cntt.rentalmanagement.services.impl.UserServiceImpl;

@RestController
public class UserController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private FileStorageServiceImpl fileStorageServiceImpl;
    
    @Autowired
    private UserServiceImpl userServiceImpl;

    @GetMapping("/user/me")
    @PreAuthorize("hasRole('USER')")
    public User getCurrentUser(@CurrentUser UserPrincipal userPrincipal) {
        return userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));
    }

    @GetMapping("/landlord/me")
    @PreAuthorize("hasRole('LANDLORD')")
    public User getRecruiter(@CurrentUser UserPrincipal userPrincipal) {
        return userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));
    }

    @GetMapping("/admin/me")
    @PreAuthorize("hasRole('ADMIN')")
    public User getAdmin(@CurrentUser UserPrincipal userPrincipal) {
        return userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));
    }
    

    @PostMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> updateImage(@CurrentUser UserPrincipal userPrincipal, @ModelAttribute MultipartFile image){
    	String path = fileStorageServiceImpl.storeFile(image);
        String result = userServiceImpl.updateImageUser(userPrincipal.getId(), path);
        return new ResponseEntity<String>(result, result.equals("Cập nhật hình ảnh thất bại!!!") == true ? HttpStatus.BAD_REQUEST : HttpStatus.OK);
    }
    
    @PutMapping("/user/update")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> updateInforUser(@CurrentUser UserPrincipal userPrincipal, @RequestBody User user){
    	String result = userServiceImpl.updateUser(user);
    	System.out.println(user.getEmail());
    	System.out.println(user.getName());
    	System.out.println(result);
        return new ResponseEntity<String>(result, result.equals("Cập nhật thông tin thành công!!!")? HttpStatus.OK : HttpStatus.BAD_GATEWAY);
    }

    @GetMapping("/users/search")
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<?> searchRenters(
            @RequestParam(defaultValue = "") String query,
            @RequestParam(required = true) String role,
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize) {
        try {
            if (!role.equals(RoleName.ROLE_USER.getValue().trim())) {
                return new ResponseEntity<>("Invalid role parameter", HttpStatus.BAD_REQUEST);
            }

            Pageable pageable = PageRequest.of(pageNo, pageSize);
            Page<User> users;

            if (query.trim().isEmpty()) {
                users = userRepository.findByRoles_Name(RoleName.ROLE_USER, pageable);
            } else {
                users = userRepository.findByNameContainingIgnoreCaseAndRoles_Name(query, RoleName.ROLE_USER, pageable);
            }

            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error occurred while searching users", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/users/{id}")
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<?> getRenterById(@PathVariable Long id) {
        try {
            User user = userRepository.findByIdAndRoles_Name(id, RoleName.ROLE_USER)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Error occurred while fetching user", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
