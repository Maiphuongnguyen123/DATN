INSERT IGNORE INTO rental_home.roles (name) VALUES
	 ('ROLE_ADMIN'),
	 ('ROLE_LANDLORD'),
	 ('ROLE_USER');
	 
INSERT IGNORE INTO rental_home.location(id, city_name) values (1, "Hà Nội");

INSERT IGNORE INTO rental_home.category(id,name) values(1,"Nhà nguyên căn"), (2,"Phòng trọ"), (3,"Chung cư mini")