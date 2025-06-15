package com.cntt.rentalmanagement.services.validation;

import com.cntt.rentalmanagement.domain.payload.request.RoomFilterRequest;
import com.cntt.rentalmanagement.exception.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;

@Service
public class RoomValidationService {

    public void validateFilterRequest(RoomFilterRequest request) {
        // Validate price range
        if (request.getMinPrice() != null && request.getMaxPrice() != null) {
            if (request.getMinPrice().compareTo(BigDecimal.ZERO) < 0) {
                throw new BadRequestException("Giá không được âm");
            }
            if (request.getMinPrice().compareTo(request.getMaxPrice()) > 0) {
                throw new BadRequestException("Giá từ không được lớn hơn giá đến");
            }
        }

        // Validate area range
        if (request.getMinArea() != null && request.getMaxArea() != null) {
            if (request.getMinArea() < 0) {
                throw new BadRequestException("Diện tích không được âm");
            }
            if (request.getMinArea() > request.getMaxArea()) {
                throw new BadRequestException("Diện tích từ không được lớn hơn diện tích đến");
            }
        }

        // Validate location hierarchy
        if (StringUtils.hasText(request.getWardCode()) && !StringUtils.hasText(request.getDistrictCode())) {
            throw new BadRequestException("Phải chọn quận/huyện trước khi chọn phường/xã");
        }
        if (StringUtils.hasText(request.getDistrictCode()) && !StringUtils.hasText(request.getCityCode())) {
            throw new BadRequestException("Phải chọn tỉnh/thành phố trước khi chọn quận/huyện");
        }

        // Validate pagination
        if (request.getPageNo() < 1) {
            throw new BadRequestException("Số trang phải lớn hơn 0");
        }
        if (request.getPageSize() < 1) {
            throw new BadRequestException("Kích thước trang phải lớn hơn 0");
        }

        // Validate sort
        if (StringUtils.hasText(request.getSortBy())) {
            if (!isValidSortField(request.getSortBy())) {
                throw new BadRequestException("Trường sắp xếp không hợp lệ");
            }
        }
    }

    private boolean isValidSortField(String field) {
        return field.matches("^(createdAt|price|area)$");
    }
} 