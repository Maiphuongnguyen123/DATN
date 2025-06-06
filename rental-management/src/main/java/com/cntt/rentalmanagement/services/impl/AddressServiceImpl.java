package com.cntt.rentalmanagement.services.impl;

import com.cntt.rentalmanagement.domain.models.Province;
import com.cntt.rentalmanagement.domain.models.District;
import com.cntt.rentalmanagement.domain.models.Ward;
import com.cntt.rentalmanagement.services.AddressService;

import com.cntt.rentalmanagement.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import java.util.List;

@Service
@Slf4j
public class AddressServiceImpl implements AddressService {
    
    @Autowired
    private VietnamAddressApiService vietnamAddressApiService;
    
    @Override
    public List<Province> getProvinces() {
        return vietnamAddressApiService.getProvinces();
    }
    
    @Override
    public List<District> getDistricts(String provinceCode) {
        return vietnamAddressApiService.getDistricts(provinceCode);
    }
    
    @Override
    public List<Ward> getWards(String districtCode) {
        return vietnamAddressApiService.getWards(districtCode);
    }
    
    @Override
    public Province getProvinceByCode(String code) {
        return vietnamAddressApiService.getProvinceByCode(code);
    }
    
    @Override
    public District getDistrictByCode(String code) {
        return vietnamAddressApiService.getDistrictByCode(code);
    }
    
    @Override
    public Ward getWardByCode(String code) {
        return vietnamAddressApiService.getWardByCode(code);
    }

    @Override
    public Ward getWardByCode(String wardCode, String districtCode) {
        return vietnamAddressApiService.getWardByCode(wardCode, districtCode);
    }
} 