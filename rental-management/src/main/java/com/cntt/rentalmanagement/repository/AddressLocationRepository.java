package com.cntt.rentalmanagement.repository;

import com.cntt.rentalmanagement.domain.models.AddressLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AddressLocationRepository extends JpaRepository<AddressLocation, Long> {
    Optional<AddressLocation> findByCityCodeAndDistrictCodeAndWardCodeAndStreetAndAddressDetail(
        String cityCode, 
        String districtCode, 
        String wardCode,
        String street,
        String addressDetail
    );
} 