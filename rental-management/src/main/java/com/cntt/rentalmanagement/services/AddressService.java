package com.cntt.rentalmanagement.services;

import com.cntt.rentalmanagement.domain.models.Province;
import com.cntt.rentalmanagement.domain.models.District;
import com.cntt.rentalmanagement.domain.models.Ward;

import java.util.List;

public interface AddressService {
    List<Province> getProvinces();
    List<District> getDistricts(String provinceCode);
    List<Ward> getWards(String districtCode);
    
    Province getProvinceByCode(String code);
    District getDistrictByCode(String code);
    Ward getWardByCode(String code);
    Ward getWardByCode(String wardCode, String districtCode);
} 