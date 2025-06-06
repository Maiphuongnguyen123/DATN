package com.cntt.rentalmanagement.model.request;

import lombok.Data;
import java.util.List;

@Data
public class RentRequest {
    private Long roomId;
    private Double roomPrice;
    private Double discount;
    private List<RentServiceRequest> services;
    private Double totalAmount;
}

@Data
class RentServiceRequest {
    private Long id;
    private String name;
    private Double quantity;
    private Double price;
    private Double total;
    private String note;
} 