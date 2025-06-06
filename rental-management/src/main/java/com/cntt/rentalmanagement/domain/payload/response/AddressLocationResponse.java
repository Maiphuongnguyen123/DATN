package com.cntt.rentalmanagement.domain.payload.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddressLocationResponse {
    private Long id;
    private String cityCode;
    private String cityName;
    private String districtCode;
    private String districtName;
    private String wardCode;
    private String wardName;
    private String street;
    private String addressDetail;
    private String fullAddress;
} 