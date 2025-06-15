package com.cntt.rentalmanagement.services;

import com.cntt.rentalmanagement.domain.payload.response.RoomResponse;
import org.springframework.data.domain.Page;

import java.math.BigDecimal;

public interface BlogService {
    Page<RoomResponse> getAllRoomForAdmin(String title, Boolean approve, Integer pageNo, Integer pageSize);

    Page<RoomResponse> getAllRoomForCustomer(
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
    );
}
