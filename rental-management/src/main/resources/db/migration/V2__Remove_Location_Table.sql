-- Xóa foreign key từ bảng room đến location
ALTER TABLE room DROP FOREIGN KEY fk_room_location;

-- Xóa cột location_id từ bảng room
ALTER TABLE room DROP COLUMN location_id;

-- Xóa bảng location
DROP TABLE location; 