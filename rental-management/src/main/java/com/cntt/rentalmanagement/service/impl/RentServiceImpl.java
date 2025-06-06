package com.cntt.rentalmanagement.service.impl;

import com.cntt.rentalmanagement.model.request.RentRequest;
import com.cntt.rentalmanagement.service.RentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RentServiceImpl implements RentService {

    @Override
    public Object saveRentData(RentRequest request) {
        // TODO: Implement logic to save rent data
        // 1. Validate room exists
        // 2. Save rent information
        // 3. Save service usage
        // 4. Update room status if needed
        return null;
    }
} 