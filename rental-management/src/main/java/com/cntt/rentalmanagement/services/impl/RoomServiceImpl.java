package com.cntt.rentalmanagement.services.impl;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.cntt.rentalmanagement.domain.enums.LockedStatus;
import com.cntt.rentalmanagement.domain.enums.RoomStatus;
import com.cntt.rentalmanagement.domain.models.Asset;
import com.cntt.rentalmanagement.domain.models.Category;
import com.cntt.rentalmanagement.domain.models.Comment;
import com.cntt.rentalmanagement.domain.models.Rate;
import com.cntt.rentalmanagement.domain.models.Room;
import com.cntt.rentalmanagement.domain.models.RoomMedia;
import com.cntt.rentalmanagement.domain.models.ServiceRoom;
import com.cntt.rentalmanagement.domain.models.User;
import com.cntt.rentalmanagement.domain.models.AddressLocation;
import com.cntt.rentalmanagement.domain.models.Province;
import com.cntt.rentalmanagement.domain.models.District;
import com.cntt.rentalmanagement.domain.models.Ward;
import com.cntt.rentalmanagement.domain.models.DTO.CommentDTO;
import com.cntt.rentalmanagement.domain.models.DTO.MessageDTO;
import com.cntt.rentalmanagement.domain.payload.request.AssetRequest;
import com.cntt.rentalmanagement.domain.payload.request.RoomRequest;
import com.cntt.rentalmanagement.domain.payload.request.ServiceRequest;
import com.cntt.rentalmanagement.domain.payload.request.RoomFilterRequest;
import com.cntt.rentalmanagement.domain.payload.response.MessageResponse;
import com.cntt.rentalmanagement.domain.payload.response.RoomResponse;
import com.cntt.rentalmanagement.domain.payload.response.PriceRange;
import com.cntt.rentalmanagement.domain.payload.response.AreaRange;
import com.cntt.rentalmanagement.exception.BadRequestException;
import com.cntt.rentalmanagement.repository.AssetRepository;
import com.cntt.rentalmanagement.repository.CategoryRepository;
import com.cntt.rentalmanagement.repository.CommentRepository;
import com.cntt.rentalmanagement.repository.RoomMediaRepository;
import com.cntt.rentalmanagement.repository.RoomRepository;
import com.cntt.rentalmanagement.repository.ServiceRepository;
import com.cntt.rentalmanagement.repository.UserRepository;
import com.cntt.rentalmanagement.repository.AddressLocationRepository;
import com.cntt.rentalmanagement.services.BaseService;
import com.cntt.rentalmanagement.services.FileStorageService;
import com.cntt.rentalmanagement.services.RoomService;
import com.cntt.rentalmanagement.utils.MapperUtils;
import com.cntt.rentalmanagement.services.AddressService;
import com.cntt.rentalmanagement.services.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoomServiceImpl extends BaseService implements RoomService {
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final AddressLocationRepository addressLocationRepository;
    private final FileStorageService fileStorageService;
    private final RoomMediaRepository roomMediaRepository;
    private final CategoryRepository categoryRepository;
    private final AssetRepository assetRepository;
    private final ServiceRepository serviceRepository;
    private final CommentRepository commentRepository;
    private final MapperUtils mapperUtils;
    private final AddressService addressService;
    private final UserService userService;

    @Override
    public MessageResponse addNewRoom(RoomRequest roomRequest) {
        AddressLocation addressLocation = createOrGetAddressLocation(roomRequest);
        Category category = categoryRepository.findById(roomRequest.getCategoryId())
                .orElseThrow(() -> new BadRequestException("Danh mục không tồn tại"));

        Room room = new Room(
                roomRequest.getTitle(),
                roomRequest.getDescription(),
                roomRequest.getPrice(),
                roomRequest.getLatitude(),
                roomRequest.getLongitude(),
                roomRequest.getAddress(),
                getUsername(),
                getUsername(),
                category,
                getUser(),
                roomRequest.getStatus(),
                roomRequest.getWaterCost(),
                roomRequest.getPublicElectricCost(),
                roomRequest.getInternetCost());
                
        room.setAddressLocation(addressLocation);
        
        roomRepository.save(room);
        
        // Xử lý files
        if (roomRequest.getFiles() != null && !roomRequest.getFiles().isEmpty()) {
            for (MultipartFile file : roomRequest.getFiles()) {
                String fileName = fileStorageService.storeFile(file);
                RoomMedia roomMedia = new RoomMedia();
                roomMedia.setFiles(fileName);
                roomMedia.setRoom(room);
                roomMediaRepository.save(roomMedia);
            }
        }

        // Xử lý assets
        if (roomRequest.getAssets() != null && !roomRequest.getAssets().isEmpty()) {
            for (AssetRequest asset: roomRequest.getAssets()) {
                Asset a = new Asset();
                a.setRoom(room);
                a.setName(asset.getName());
                a.setNumber(asset.getNumber());
                assetRepository.save(a);
            }
        }

        // Xử lý services
        if (roomRequest.getServices() != null && !roomRequest.getServices().isEmpty()) {
            for (ServiceRequest service: roomRequest.getServices()) {
                ServiceRoom s = new ServiceRoom();
                s.setRoom(room);
                s.setName(service.getName());
                s.setPrice(service.getPrice());
                serviceRepository.save(s);
            }
        }

        return MessageResponse.builder().message("Thêm tin phòng thành công").build();
    }

    private AddressLocation createOrGetAddressLocation(RoomRequest request) {
        // Log input
        log.info("Creating/Getting AddressLocation with: city={}, district={}, ward={}, street={}, detail={}",
            request.getCityCode(), request.getDistrictCode(), request.getWardCode(), 
            request.getStreet(), request.getAddressDetail());
            
        // Tìm địa chỉ đã tồn tại
        Optional<AddressLocation> existingLocation = addressLocationRepository
            .findByCityCodeAndDistrictCodeAndWardCodeAndStreetAndAddressDetail(
                request.getCityCode(),
                request.getDistrictCode(),
                request.getWardCode(),
                request.getStreet(),
                request.getAddressDetail()
            );
            
        if (existingLocation.isPresent()) {
            log.info("Found existing AddressLocation: {}", existingLocation.get().getId());
            return existingLocation.get();
        }
        
        // Lấy thông tin tên từ code
        Province province = addressService.getProvinceByCode(request.getCityCode());
        District district = addressService.getDistrictByCode(request.getDistrictCode());
        Ward ward = addressService.getWardByCode(request.getWardCode(), request.getDistrictCode());
        
        // Tạo địa chỉ mới
        AddressLocation newLocation = new AddressLocation(
            request.getCityCode(), province.getName(),
            request.getDistrictCode(), district.getName(),
            request.getWardCode(), ward.getName(),
            request.getStreet(),
            request.getAddressDetail()
        );
        
        AddressLocation saved = addressLocationRepository.save(newLocation);
        log.info("Created new AddressLocation: {}", saved.getId());
        
        return saved;
    }

    @Override
    public Page<RoomResponse> getRoomBylandlord(String title, Integer pageNo, Integer pageSize) {
        int page = pageNo == 0 ? pageNo : pageNo - 1;
        Pageable pageable = PageRequest.of(page, pageSize);
        return mapperUtils.convertToResponsePage(roomRepository.searchingRoom(title, getUserId(), pageable), RoomResponse.class, pageable);
    }

    @Override
    public RoomResponse getRoomById(Long id) {
        return mapperUtils.convertToResponse(roomRepository.findById(id).orElseThrow(() ->
                new BadRequestException("Phòng trọ này không tồn tại.")), RoomResponse.class);
    }

    @Override
    public Room getRoom(Long id) {
        return mapperUtils.convertToEntity(roomRepository.findById(id).orElseThrow(() ->
                new BadRequestException("Phòng trọ này không tồn tại.")), Room.class);
    }

    @Override
    public MessageResponse disableRoom(Long id) {
        Room room = roomRepository.findById(id).orElseThrow(() -> new BadRequestException("Thông tin phòng không tồn tại."));
        room.setIsLocked(LockedStatus.DISABLE);
        roomRepository.save(room);
        return MessageResponse.builder().message("Bài đăng của phòng đã được ẩn đi.").build();
    }

    @Override
    @Transactional
    public MessageResponse updateRoomInfo(Long id, RoomRequest roomRequest) {
        Room room = roomRepository.findById(id).orElseThrow(() -> new BadRequestException("Thông tin phòng không tồn tại."));
        AddressLocation addressLocation = createOrGetAddressLocation(roomRequest);
        Category category = categoryRepository.findById(roomRequest.getCategoryId())
                .orElseThrow(() -> new BadRequestException("Danh mục không tồn tại"));

        room.setUpdatedBy(getUsername());
        room.setTitle(roomRequest.getTitle());
        room.setDescription(roomRequest.getDescription());
        room.setPrice(roomRequest.getPrice());
        room.setLatitude(roomRequest.getLatitude());
        room.setLongitude(roomRequest.getLongitude());
        room.setAddress(roomRequest.getAddress());
        room.setUpdatedBy(getUsername());
        room.setAddressLocation(addressLocation);
        room.setCategory(category);
        room.setStatus(roomRequest.getStatus());
        room.setWaterCost(roomRequest.getWaterCost());
        room.setPublicElectricCost(roomRequest.getPublicElectricCost());
        room.setInternetCost(roomRequest.getInternetCost());
        
        roomRepository.save(room);

        if (Objects.nonNull(roomRequest.getFiles())) {
            roomMediaRepository.deleteAllByRoom(room);
            for (MultipartFile file : roomRequest.getFiles()) {
                String fileName = fileStorageService.storeFile(file);
                RoomMedia roomMedia = new RoomMedia();
                roomMedia.setFiles(fileName);
                roomMedia.setRoom(room);
                roomMediaRepository.save(roomMedia);
            }
        }

        assetRepository.deleteAllByRoom(room);
        for (AssetRequest asset: roomRequest.getAssets()) {
            Asset a = new Asset();
            a.setRoom(room);
            a.setName(asset.getName());
            a.setNumber(asset.getNumber());
            assetRepository.save(a);
        }

        serviceRepository.deleteAllByRoom(room);
        for (ServiceRequest service: roomRequest.getServices()) {
            ServiceRoom s = new ServiceRoom();
            s.setRoom(room);
            s.setName(service.getName());
            s.setPrice(service.getPrice());
            serviceRepository.save(s);
        }

        return MessageResponse.builder().message("Cập nhật thông tin phòng thành công").build();
    }

    @Override
    public Page<RoomResponse> getRentOfHome() {
        Pageable pageable = PageRequest.of(0,100);
        return mapperUtils.convertToResponsePage(roomRepository.getAllRentOfHome( getUserId(), pageable), RoomResponse.class, pageable);
    }
    
    @Override
    public List<CommentDTO> getAllCommentRoom(Long id){
    	Room room = roomRepository.findById(id).get();
    	return mapperUtils.convertToEntityList(room.getComment(), CommentDTO.class);
    }

    @Override
    public Page<RoomResponse> getAllRoomForAdmin(String title,Boolean approve, Integer pageNo, Integer pageSize) {
        int page = pageNo == 0 ? pageNo : pageNo - 1;
        Pageable pageable = PageRequest.of(page, pageSize);
        return mapperUtils.convertToResponsePage(roomRepository.searchingRoomForAdmin(title, approve ,pageable), RoomResponse.class, pageable);
    }

    @Override
    public Page<RoomResponse> getRoomByUserId(Long userId, Integer pageNo, Integer pageSize) {
        int page = pageNo == 0 ? pageNo : pageNo - 1;
        Pageable pageable = PageRequest.of(page, pageSize);
        return mapperUtils.convertToResponsePage(
            roomRepository.searchingRoomForCustomer(
                null,   // title
                null,   // minPrice
                null,   // maxPrice
                null,   // minArea
                null,   // maxArea
                null,   // categoryId
                null,   // provinceCode
                null,   // districtCode
                null,   // wardCode
                userId, // userId
                pageable
            ), 
            RoomResponse.class, 
            pageable
        );
    }

    @Override
    public List<RoomResponse> getRoomByUser(User user) {
        return roomRepository.findByUser(user).stream().map(room -> mapperUtils.convertToResponse(room, RoomResponse.class)).toList();
    }

    @Override
    public Room updateRoom(Room room, Long id) {
        return roomRepository.findById(id)
                .map(room1 -> {
                    room1.setTitle(room.getTitle());
                    room1.setDescription(room.getDescription());
                    room1.setPrice(room.getPrice());
                    room1.setLatitude(room.getLatitude());
                    room1.setLongitude(room.getLongitude());
                    room1.setAddress(room.getAddress());
                    room1.setUpdatedBy(getUsername());
                    room1.setCategory(room.getCategory());
                    room1.setStatus(room.getStatus());
                    room1.setWaterCost(room.getWaterCost());
                    room1.setPublicElectricCost(room.getPublicElectricCost());
                    room1.setInternetCost(room.getInternetCost());
                    return roomRepository.save(room1);
                })
                .orElseThrow(() -> new BadRequestException("Phòng không tồn tại"));
    }

    private List<RoomResponse> sortRooms(List<RoomResponse> rooms, String typeSort) {
        if ("Thời gian: Mới đến cũ".equals(typeSort)) {
            rooms.sort(Comparator.comparing(RoomResponse::getCreatedAt).reversed());
        } else if ("Thời gian: Cũ đến mới".equals(typeSort)) {
            rooms.sort(Comparator.comparing(RoomResponse::getCreatedAt));
        } else if ("Giá: Thấp đến cao".equals(typeSort)) {
            rooms.sort(Comparator.comparing(RoomResponse::getPrice));
        } else if ("Giá: Cao đến thấp".equals(typeSort)) {
            rooms.sort(Comparator.comparing(RoomResponse::getPrice).reversed());
        }
        
        return rooms;
    }


    @Override
    public MessageResponse checkoutRoom(Long id) {
        Room room = roomRepository.findById(id).orElseThrow(() -> new BadRequestException("Phòng không còn tồn tại"));
        room.setStatus(RoomStatus.CHECKED_OUT);
        roomRepository.save(room);
        return MessageResponse.builder().message("Trả phòng và xuất hóa đơn thành công.").build();
    }

    @Override
    public MessageResponse isApproveRoom(Long id) {
        Room room = roomRepository.findById(id).orElseThrow(() -> new BadRequestException("Phòng không còn tồn tại"));
        if (room.getIsApprove().equals(Boolean.TRUE)) {
            throw new BadRequestException("Phòng đã được phê duyệt");
        } else {
            room.setIsApprove(Boolean.TRUE);
        }
        roomRepository.save(room);
        return MessageResponse.builder().message("Phê duyệt tin phòng thành công.").build();
    }

    @Override
    public MessageResponse removeRoom(Long id) {
        Room room = roomRepository.findById(id).orElseThrow(() -> new BadRequestException("Phòng không còn tồn tại"));
        if(Boolean.TRUE.equals(room.getIsRemove())){
            throw new BadRequestException("Bài đăng đã bị gỡ");
        }
        room.setIsRemove(Boolean.TRUE);
        roomRepository.save(room);
        return MessageResponse.builder().message("Bài đăng đã bị gỡ thành công").build();
    }

	@Override
	public String addComment(Long id, CommentDTO commentDTO) {
		try {
			Room room = roomRepository.findById(commentDTO.getRoom_id()).orElseThrow(() -> new BadRequestException("Phòng không còn tồn tại"));
			User user = userRepository.findById(id).orElseThrow(() -> new BadRequestException("Người dùng không tồn tại"));
			Rate rate = new Rate();
			rate.setRating(commentDTO.getRateRating());
			rate.setUser(user);
			rate.setRoom(room);
			Comment comment = new Comment(commentDTO.getContent(), user, room, rate);
			commentRepository.save(comment);
			return "Thêm bình luận thành công";
		} catch (Exception e) {
			return "Thêm bình luận thất bại";
		}
		
	}
	
	private User getUser() {
        return userRepository.findById(getUserId()).orElseThrow(() -> new BadRequestException("Người dùng không tồn tại"));
    }

    @Override
    public Page<RoomResponse> filterRooms(RoomFilterRequest filterRequest) {
        // Validate filter request
        validateFilterRequest(filterRequest);
        
        // Get filtered rooms using custom repository
        Page<Room> rooms = roomRepository.findRoomsWithFilters(filterRequest);
        
        // Map to response
        return rooms.map(room -> mapperUtils.convertToResponse(room, RoomResponse.class));
    }

    @Override
    public List<PriceRange> getPriceRanges() {
        return Arrays.asList(
            new PriceRange(BigDecimal.ZERO, new BigDecimal("2000000"), "Dưới 2 triệu"),
            new PriceRange(new BigDecimal("2000000"), new BigDecimal("4000000"), "2 - 4 triệu"),
            new PriceRange(new BigDecimal("4000000"), new BigDecimal("6000000"), "4 - 6 triệu"),
            new PriceRange(new BigDecimal("6000000"), null, "Trên 6 triệu")
        );
    }

    @Override
    public List<AreaRange> getAreaRanges() {
        return Arrays.asList(
            new AreaRange(0.0, 20.0, "Dưới 20m²"),
            new AreaRange(20.0, 30.0, "20 - 30m²"),
            new AreaRange(30.0, 50.0, "30 - 50m²"),
            new AreaRange(50.0, null, "Trên 50m²")
        );
    }

    private void validateFilterRequest(RoomFilterRequest filter) {
        if (filter.getMinPrice() != null && filter.getMaxPrice() != null 
            && filter.getMinPrice().compareTo(filter.getMaxPrice()) > 0) {
            throw new BadRequestException("Giá từ không được lớn hơn giá đến");
        }

        if (filter.getMinArea() != null && filter.getMaxArea() != null 
            && filter.getMinArea() > filter.getMaxArea()) {
            throw new BadRequestException("Diện tích từ không được lớn hơn diện tích đến");
        }

        if (filter.getWardCode() != null && filter.getDistrictCode() == null) {
            throw new BadRequestException("Phải chọn quận/huyện trước khi chọn phường/xã");
        }
        if (filter.getDistrictCode() != null && filter.getCityCode() == null) {
            throw new BadRequestException("Phải chọn tỉnh/thành phố trước khi chọn quận/huyện");
        }
    }

    @Override
    public List<RoomResponse> getAllRoomsNoLimit() {
        // Lấy tất cả phòng của landlord hiện tại
        List<Room> rooms = roomRepository.findByUser(userService.getUserById(getUserId()));
        
        // Convert sang RoomResponse
        return rooms.stream()
            .map(room -> mapperUtils.convertToResponse(room, RoomResponse.class))
            .collect(Collectors.toList());
    }
}
