package com.cntt.rentalmanagement.domain.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AreaRange {
    private Double minArea;
    private Double maxArea;
    private String label;
} 