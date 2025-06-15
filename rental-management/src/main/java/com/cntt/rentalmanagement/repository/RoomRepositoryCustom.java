package com.cntt.rentalmanagement.repository;

import com.cntt.rentalmanagement.domain.enums.RoomStatus;
import com.cntt.rentalmanagement.domain.models.Room;
import com.cntt.rentalmanagement.domain.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.cntt.rentalmanagement.domain.payload.request.RoomFilterRequest;

import java.math.BigDecimal;
import java.util.List;

public interface RoomRepositoryCustom {
    Page<Room> searchingRoom(String title, Long userId, Pageable pageable);

    Page<Room> searchingRoomForAdmin(String title, Boolean approve, Pageable pageable);

    Page<Room> searchingRoomForCustomer(
        String title, 
        BigDecimal minPrice, 
        BigDecimal maxPrice, 
        BigDecimal minArea,
        BigDecimal maxArea, 
        Long categoryId,
        String provinceCode,
        String districtCode,
        String wardCode,
        Long userId, 
        Pageable pageable
    );

    Page<Room> getAllRentOfHome(Long userId, Pageable pageable);

    Page<Room> findRoomsWithFilters(RoomFilterRequest filter);
}
