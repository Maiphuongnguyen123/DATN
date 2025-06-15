package com.cntt.rentalmanagement.controller;

import com.cntt.rentalmanagement.services.BlogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequiredArgsConstructor
public class BlogController {
    private final BlogService blogService;

    @GetMapping("/room/all")
    private ResponseEntity<?> getAllRoom(
        @RequestParam(required = false) String title,
        @RequestParam(required = false) Boolean approve,
        @RequestParam Integer pageNo,
        @RequestParam Integer pageSize
    ) {
        return ResponseEntity.ok(blogService.getAllRoomForAdmin(title, approve, pageNo, pageSize));
    }

    @GetMapping("/customer/room")
    private ResponseEntity<?> getAllRoomForCustomer(
        @RequestParam(required = false) String title,
        @RequestParam(required = false) BigDecimal minPrice,
        @RequestParam(required = false) BigDecimal maxPrice,
        @RequestParam(required = false) BigDecimal minArea,
        @RequestParam(required = false) BigDecimal maxArea,
        @RequestParam(required = false) Long categoryId,
        @RequestParam(required = false) String provinceCode,
        @RequestParam(required = false) String districtCode,
        @RequestParam(required = false) String wardCode,
        @RequestParam Integer pageNo,
        @RequestParam Integer pageSize
    ) {
        return ResponseEntity.ok(blogService.getAllRoomForCustomer(
            title, minPrice, maxPrice, minArea, maxArea, categoryId,
            provinceCode, districtCode, wardCode, pageNo, pageSize
        ));
    }
}
