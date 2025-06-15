package com.cntt.rentalmanagement.domain.payload.response;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PriceRange {
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private String label;
} 