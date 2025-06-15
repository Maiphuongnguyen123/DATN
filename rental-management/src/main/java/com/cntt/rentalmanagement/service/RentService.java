package com.cntt.rentalmanagement.service;

import com.cntt.rentalmanagement.model.request.RentRequest;
import com.cntt.rentalmanagement.domain.payload.response.MessageResponse;
import org.springframework.data.domain.Page;
import com.cntt.rentalmanagement.domain.models.ElectricAndWater;
import com.cntt.rentalmanagement.domain.payload.response.ElectricAndWaterResponse;

public interface RentService {
    Object saveRentData(RentRequest request);
    MessageResponse updatePaymentStatus(Long id, boolean paid);
    Page<ElectricAndWaterResponse> getAllRent(int pageNo, int pageSize);
} 