package com.cntt.rentalmanagement.domain.payload.request;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomFilterRequest {
    // Search query từ input search
    private String searchQuery;
    
    // Category từ dropdown
    private Long categoryId;
    
    // Price range từ modal price
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    
    // Area range từ modal area 
    private Double minArea;
    private Double maxArea;
    
    // Location từ modal location
    private String cityCode;
    private String districtCode; 
    private String wardCode;
    private String cityName;
    private String districtName;
    private String wardName;
    
    // Pagination params
    private Integer pageNo = 1;
    private Integer pageSize = 6;
    
    // Sort params
    private String sortBy = "createdAt";
    private String sortDirection = "desc";

    // Status filters
    private Boolean isApprove = true;
    private Boolean isRemove = false;
} 