CREATE TABLE address_locations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    city_code VARCHAR(10) NOT NULL,
    city_name VARCHAR(100) NOT NULL,
    district_code VARCHAR(10) NOT NULL,
    district_name VARCHAR(100) NOT NULL,
    ward_code VARCHAR(10) NOT NULL,
    ward_name VARCHAR(100) NOT NULL,
    street VARCHAR(255) NOT NULL,
    address_detail VARCHAR(255),
    full_address VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- Index cho tìm kiếm địa chỉ
CREATE INDEX idx_address_location_codes ON address_locations(city_code, district_code, ward_code);

-- Thêm cột address_location_id vào bảng room
ALTER TABLE room ADD COLUMN address_location_id BIGINT;
ALTER TABLE room ADD CONSTRAINT fk_room_address_location FOREIGN KEY (address_location_id) REFERENCES address_locations(id); 