package com.cntt.rentalmanagement.controller;

import com.cntt.rentalmanagement.model.request.RentRequest;
import com.cntt.rentalmanagement.service.RentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rent")
@RequiredArgsConstructor
public class RentController {

    private final RentService rentService;

    @PostMapping
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<?> saveRentData(@RequestBody RentRequest request) {
        return ResponseEntity.ok(rentService.saveRentData(request));
    }
} 