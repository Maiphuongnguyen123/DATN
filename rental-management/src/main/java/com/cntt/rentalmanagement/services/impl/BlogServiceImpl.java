package com.cntt.rentalmanagement.services.impl;

import com.cntt.rentalmanagement.domain.payload.response.RoomResponse;
import com.cntt.rentalmanagement.repository.RoomRepository;
import com.cntt.rentalmanagement.services.BlogService;
import com.cntt.rentalmanagement.utils.MapperUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class BlogServiceImpl implements BlogService {

    private final RoomRepository roomRepository;
    private final MapperUtils mapperUtils;
    @Override
    public Page<RoomResponse> getAllRoomForAdmin(String title, Boolean approve, Integer pageNo, Integer pageSize) {
        int page = pageNo == 0 ? pageNo : pageNo - 1;
        Pageable pageable = PageRequest.of(page, pageSize);
        return mapperUtils.convertToResponsePage(roomRepository.searchingRoomForAdmin(title, approve, pageable), RoomResponse.class, pageable);
    }

    @Override
    public Page<RoomResponse> getAllRoomForCustomer(
        String title, 
        BigDecimal minPrice, 
        BigDecimal maxPrice, 
        BigDecimal minArea,
        BigDecimal maxArea, 
        Long categoryId,
        String provinceCode,
        String districtCode,
        String wardCode,
        Integer pageNo, 
        Integer pageSize
    ) {
        int page = pageNo == 0 ? pageNo : pageNo - 1;
        Pageable pageable = PageRequest.of(page, pageSize);
        return mapperUtils.convertToResponsePage(
            roomRepository.searchingRoomForCustomer(
                title, 
                minPrice, 
                maxPrice, 
                minArea,
                maxArea, 
                categoryId,
                provinceCode,
                districtCode,
                wardCode,
                null, // userId
                pageable
            ),
            RoomResponse.class,
            pageable
        );
    }
}
