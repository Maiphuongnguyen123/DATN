package com.cntt.rentalmanagement.domain.payload.request;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.cntt.rentalmanagement.domain.enums.RoomStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomRequest {
    private String title;
    private String description;
    private BigDecimal price;
    private Double latitude;
    private Double longitude;
    private String address;
    private Long categoryId;
    private RoomStatus status;
    private List<AssetRequest> assets;
    private List<ServiceRequest> services;
    private List<MultipartFile> files;

    // Thông tin địa chỉ
    private String cityCode;
    private String districtCode;
    private String wardCode;
    private String street;
    private String addressDetail;

    private BigDecimal waterCost = BigDecimal.ZERO;
    private BigDecimal publicElectricCost = BigDecimal.ZERO;
    private BigDecimal internetCost = BigDecimal.ZERO;
}
