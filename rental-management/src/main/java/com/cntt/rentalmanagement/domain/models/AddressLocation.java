package com.cntt.rentalmanagement.domain.models;

import com.cntt.rentalmanagement.domain.models.audit.DateAudit;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "address_locations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddressLocation extends DateAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "city_code", nullable = false)
    private String cityCode;      // Mã tỉnh/thành phố (VD: 10)

    @Column(name = "city_name", nullable = false)
    private String cityName;      // Tên tỉnh/thành phố (VD: Tỉnh Lào Cai)
    
    @Column(name = "district_code", nullable = false)
    private String districtCode;  // Mã quận/huyện (VD: 083)

    @Column(name = "district_name", nullable = false)
    private String districtName;  // Tên quận/huyện (VD: Huyện Mường Khương)
    
    @Column(name = "ward_code", nullable = false)
    private String wardCode;      // Mã phường/xã (VD: 02761)

    @Column(name = "ward_name", nullable = false)
    private String wardName;      // Tên phường/xã (VD: Thị trấn Mường Khương)
    
    @Column(nullable = false)
    private String street;        // Tên đường (VD: Bach Mai)

    @Column(name = "address_detail")
    private String addressDetail; // Chi tiết (VD: NGÕ 10)
    
    @Column(name = "full_address", nullable = false)
    private String fullAddress;   // Địa chỉ đầy đủ

    @OneToMany(mappedBy = "addressLocation")
    private List<Room> rooms;

    // Constructor cho việc tạo mới
    public AddressLocation(
            String cityCode, String cityName,
            String districtCode, String districtName,
            String wardCode, String wardName,
            String street, String addressDetail) {
        this.cityCode = cityCode;
        this.cityName = cityName;
        this.districtCode = districtCode;
        this.districtName = districtName;
        this.wardCode = wardCode;
        this.wardName = wardName;
        this.street = street;
        this.addressDetail = addressDetail;
        this.fullAddress = generateFullAddress();
    }

    private String generateFullAddress() {
        return String.format("%s, %s, %s, %s, %s",
            this.addressDetail,
            this.street,
            this.wardName,
            this.districtName,
            this.cityName
        );
    }
} 