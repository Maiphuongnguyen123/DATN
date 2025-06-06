package com.cntt.rentalmanagement.services.impl;

import com.cntt.rentalmanagement.domain.models.Province;
import com.cntt.rentalmanagement.domain.models.District;
import com.cntt.rentalmanagement.domain.models.Ward;
import com.cntt.rentalmanagement.exception.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class VietnamAddressApiService {
    private static final String API_URL = "https://provinces.open-api.vn/api";
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Autowired
    private ObjectMapper objectMapper;

    private String formatCode(String code) {
        // Remove leading zeros
        return code.replaceFirst("^0+", "");
    }

    public List<Province> getProvinces() {
        try {
            log.info("Fetching all provinces");
            JsonNode response = restTemplate.getForObject(API_URL + "/p", JsonNode.class);
            List<Province> provinces = new ArrayList<>();
            
            if (response != null && response.isArray()) {
                for (JsonNode node : response) {
                    provinces.add(new Province(
                        node.get("code").asText(),
                        node.get("name").asText()
                    ));
                }
            }
            return provinces;
        } catch (Exception e) {
            log.error("Error fetching provinces: {}", e.getMessage());
            throw new BadRequestException("Không thể lấy danh sách tỉnh/thành phố");
        }
    }

    public List<District> getDistricts(String provinceCode) {
        try {
            String formattedCode = formatCode(provinceCode);
            log.info("Fetching districts for province: {} (formatted from {})", formattedCode, provinceCode);
            JsonNode response = restTemplate.getForObject(API_URL + "/p/" + formattedCode + "?depth=2", JsonNode.class);
            List<District> districts = new ArrayList<>();
            
            if (response != null && response.has("districts")) {
                JsonNode districtsNode = response.get("districts");
                for (JsonNode node : districtsNode) {
                    districts.add(new District(
                        node.get("code").asText(),
                        node.get("name").asText(),
                        provinceCode
                    ));
                }
            }
            return districts;
        } catch (Exception e) {
            log.error("Error fetching districts: {}", e.getMessage());
            throw new BadRequestException("Không thể lấy danh sách quận/huyện");
        }
    }

    public List<Ward> getWards(String districtCode) {
        try {
            String formattedCode = formatCode(districtCode);
            log.info("Fetching wards for district: {} (formatted from {})", formattedCode, districtCode);
            JsonNode response = restTemplate.getForObject(API_URL + "/d/" + formattedCode + "?depth=2", JsonNode.class);
            List<Ward> wards = new ArrayList<>();
            
            if (response != null && response.has("wards")) {
                JsonNode wardsNode = response.get("wards");
                for (JsonNode node : wardsNode) {
                    wards.add(new Ward(
                        node.get("code").asText(),
                        node.get("name").asText(),
                        districtCode
                    ));
                }
            }
            return wards;
        } catch (Exception e) {
            log.error("Error fetching wards: {}", e.getMessage());
            throw new BadRequestException("Không thể lấy danh sách phường/xã");
        }
    }

    public Province getProvinceByCode(String code) {
        try {
            String formattedCode = formatCode(code);
            log.info("Fetching province data for code: {} (formatted from {})", formattedCode, code);
            String url = API_URL + "/p/" + formattedCode;
            JsonNode response = restTemplate.getForObject(url, JsonNode.class);
            if (response == null || response.get("code") == null) {
                throw new BadRequestException("Mã tỉnh/thành phố không hợp lệ");
            }
            return new Province(
                response.get("code").asText(),
                response.get("name").asText()
            );
        } catch (Exception e) {
            log.error("Error fetching province data: {}", e.getMessage());
            throw new BadRequestException("Mã tỉnh/thành phố không hợp lệ");
        }
    }

    public District getDistrictByCode(String code) {
        try {
            String formattedCode = formatCode(code);
            log.info("Fetching district data for code: {} (formatted from {})", formattedCode, code);
            String url = API_URL + "/d/" + formattedCode;
            JsonNode response = restTemplate.getForObject(url, JsonNode.class);
            if (response == null || response.get("code") == null) {
                throw new BadRequestException("Mã quận/huyện không hợp lệ");
            }
            return new District(
                response.get("code").asText(),
                response.get("name").asText(),
                response.get("province_code").asText()
            );
        } catch (Exception e) {
            log.error("Error fetching district data: {}", e.getMessage());
            throw new BadRequestException("Mã quận/huyện không hợp lệ");
        }
    }

    public Ward getWardByCode(String wardCode, String districtCode) {
        try {
            String formattedWardCode = formatCode(wardCode);
            String formattedDistrictCode = formatCode(districtCode);
            log.info("Fetching ward data for ward code: {} and district code: {}", formattedWardCode, formattedDistrictCode);

            // Lấy danh sách phường/xã của quận/huyện
            String wardsUrl = API_URL + "/d/" + formattedDistrictCode + "?depth=2";
            JsonNode wardsResponse = restTemplate.getForObject(wardsUrl, JsonNode.class);

            if (wardsResponse != null && wardsResponse.has("wards")) {
                JsonNode wardsNode = wardsResponse.get("wards");
                for (JsonNode ward : wardsNode) {
                    String currentWardCode = ward.get("code").asText();
                    // So sánh mã phường/xã
                    if (currentWardCode.equals(formattedWardCode)) {
                        return new Ward(
                            currentWardCode,
                            ward.get("name").asText(),
                            formattedDistrictCode
                        );
                    }
                }
            }
            throw new BadRequestException("Không tìm thấy phường/xã có mã " + wardCode + 
                " trong quận/huyện " + districtCode);
        } catch (Exception e) {
            log.error("Error fetching ward data: {}", e.getMessage());
            throw new BadRequestException("Không thể lấy thông tin phường/xã: " + e.getMessage());
        }
    }

    // Phương thức cũ giữ lại để tương thích ngược
    public Ward getWardByCode(String code) {
        try {
            String formattedCode = formatCode(code);
            log.info("Fetching ward data for code: {} (formatted from {})", formattedCode, code);

            // Lấy danh sách phường/xã của quận/huyện
            String wardsUrl = API_URL + "/d/" + formattedCode + "?depth=2";
            JsonNode wardsResponse = restTemplate.getForObject(wardsUrl, JsonNode.class);

            if (wardsResponse != null && wardsResponse.has("wards")) {
                JsonNode wardsNode = wardsResponse.get("wards");
                for (JsonNode ward : wardsNode) {
                    String wardCode = ward.get("code").asText();
                    // So sánh mã phường/xã
                    if (wardCode.equals(formattedCode)) {
                        return new Ward(
                            wardCode,
                            ward.get("name").asText(),
                            ward.get("district_code").asText()
                        );
                    }
                }
            }
            throw new BadRequestException("Không tìm thấy phường/xã với mã " + code);
        } catch (Exception e) {
            log.error("Error fetching ward data: {}", e.getMessage());
            throw new BadRequestException("Không thể lấy thông tin phường/xã: " + e.getMessage());
        }
    }
}