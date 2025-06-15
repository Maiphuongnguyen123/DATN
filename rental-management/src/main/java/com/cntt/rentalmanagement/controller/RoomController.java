package com.cntt.rentalmanagement.controller;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.cntt.rentalmanagement.services.BlogService;
import com.cntt.rentalmanagement.services.RoomService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.cntt.rentalmanagement.domain.enums.RoomStatus;
import com.cntt.rentalmanagement.domain.models.DTO.CommentDTO;
import com.cntt.rentalmanagement.domain.payload.request.AssetRequest;
import com.cntt.rentalmanagement.domain.payload.request.ServiceRequest;
import com.cntt.rentalmanagement.domain.payload.request.RoomRequest;
import com.cntt.rentalmanagement.secruity.CurrentUser;
import com.cntt.rentalmanagement.secruity.UserPrincipal;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/room") 
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

//    @GetMapping("/all")
//    private ResponseEntity<?> getAllRoom(@RequestParam(required = false) String title,
//                                         @RequestParam(required = false) Boolean approve,
//                                         @RequestParam Integer pageNo,
//                                         @RequestParam Integer pageSize) {
//        return ResponseEntity.ok(blogService.getAllRoomForAdmin(title, approve, pageNo, pageSize));
//    }

    @GetMapping("/{userId}/landlord")
    public ResponseEntity<?> getAllRoomOfUserId(@PathVariable Long userId,
                                                @RequestParam Integer pageNo,
                                                @RequestParam Integer pageSize) {
        return ResponseEntity.ok(roomService.getRoomByUserId(userId, pageNo, pageSize));
    }

    @GetMapping
    public ResponseEntity<?> getRoomByLandlord(@RequestParam(required = false) String title,
                                               @RequestParam Integer pageNo,
                                               @RequestParam Integer pageSize) {
        return ResponseEntity.ok(roomService.getRoomBylandlord(title, pageNo, pageSize));
    }

    @GetMapping("/rent-home")
    public ResponseEntity<?> getRentOfHome() {
        return ResponseEntity.ok(roomService.getRentOfHome());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRoomById(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    @PostMapping("/{id}")
    public ResponseEntity<?> disableRoom(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.disableRoom(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRoomInfo(@PathVariable Long id, MultipartHttpServletRequest request) {
        return ResponseEntity.ok(roomService.updateRoomInfo(id, putRoomRequest(request)));
    }

    @PostMapping
    public ResponseEntity<?> addRoom(MultipartHttpServletRequest request) {
        return ResponseEntity.ok(roomService.addNewRoom(putRoomRequest(request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeRoom(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.removeRoom(id));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<?> isApprove(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.isApproveRoom(id));
    }

    @PostMapping("/{id}/checkout")
    public ResponseEntity<?> checkoutRoom(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.checkoutRoom(id));
    }
    
    @GetMapping("/{roomId}/comments")
    public List<CommentDTO> getAllComment(@PathVariable Long roomId) {
        return roomService.getAllCommentRoom(roomId);
    }
    
    @PostMapping("/{roomId}/comments")
    public ResponseEntity<?> addComment(@CurrentUser UserPrincipal userPrincipal, @PathVariable Long roomId,
            @RequestBody CommentDTO commentDTO) {
        System.out.println(commentDTO.getRateRating());
        return roomService.addComment(userPrincipal.getId(), commentDTO).equals("Thêm bình luận thành công")
                ? ResponseEntity.ok("Thêm bình luận thành công")
                : new ResponseEntity<String>("Thêm bình luận thất bại", HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/all-no-limit")
    public ResponseEntity<?> getAllRoomsNoLimit() {
        return ResponseEntity.ok(roomService.getAllRoomsNoLimit());
    }

    private RoomRequest putRoomRequest(MultipartHttpServletRequest request) {
        String title = request.getParameter("title");
        String description = request.getParameter("description");
        BigDecimal price = BigDecimal.valueOf(Double.valueOf(request.getParameter("price")));
        
        // Add null checks for latitude and longitude
        Double latitude = null;
        Double longitude = null;
        try {
            latitude = request.getParameter("latitude") != null ? 
                Double.valueOf(request.getParameter("latitude")) : 0.0;
            longitude = request.getParameter("longitude") != null ? 
                Double.valueOf(request.getParameter("longitude")) : 0.0;
        } catch (NumberFormatException e) {
            latitude = 0.0;
            longitude = 0.0;
        }
        
        // Xử lý thông tin địa chỉ
        String cityCode = request.getParameter("city");
        String districtCode = request.getParameter("district");
        String wardCode = request.getParameter("ward");
        String street = request.getParameter("street");
        String addressDetail = request.getParameter("addressDetail");
        String address = request.getParameter("address");
        
        Long categoryId = Long.valueOf(request.getParameter("categoryId"));
        
        // Add null checks for costs
        BigDecimal waterCost = null;
        BigDecimal publicElectricCost = null;
        BigDecimal internetCost = null;
        try {
            waterCost = request.getParameter("waterCost") != null ? 
                BigDecimal.valueOf(Double.valueOf(request.getParameter("waterCost"))) : BigDecimal.ZERO;
            publicElectricCost = request.getParameter("publicElectricCost") != null ? 
                BigDecimal.valueOf(Double.valueOf(request.getParameter("publicElectricCost"))) : BigDecimal.ZERO;
            internetCost = request.getParameter("internetCost") != null ? 
                BigDecimal.valueOf(Double.valueOf(request.getParameter("internetCost"))) : BigDecimal.ZERO;
        } catch (NumberFormatException e) {
            waterCost = BigDecimal.ZERO;
            publicElectricCost = BigDecimal.ZERO;
            internetCost = BigDecimal.ZERO;
        }

        // Xử lý assets
        List<AssetRequest> assets = new ArrayList<>();
        String assetCount = request.getParameter("asset");
        if (assetCount != null && !assetCount.isEmpty()) {
            for (int i = 0; i < Integer.valueOf(assetCount); i++) {
                String[] assetNames = request.getParameterValues("assets[" + i + "][name]");
                String[] assetNumbers = request.getParameterValues("assets[" + i + "][number]");
                if (assetNames != null && assetNames.length > 0 && assetNumbers != null && assetNumbers.length > 0) {
                    String assetName = assetNames[0];
                    Integer assetNumber = Integer.valueOf(assetNumbers[0]);
                    assets.add(new AssetRequest(assetName, assetNumber));
                }
            }
        }

        // Xử lý services
        List<ServiceRequest> services = new ArrayList<>();
        String serviceCount = request.getParameter("service");
        if (serviceCount != null && !serviceCount.isEmpty()) {
            for (int i = 0; i < Integer.valueOf(serviceCount); i++) {
                String[] serviceNames = request.getParameterValues("services[" + i + "][name]");
                String[] servicePrices = request.getParameterValues("services[" + i + "][price]");
                if (serviceNames != null && serviceNames.length > 0 && servicePrices != null && servicePrices.length > 0) {
                    String serviceName = serviceNames[0];
                    BigDecimal servicePrice = BigDecimal.valueOf(Double.valueOf(servicePrices[0]));
                    services.add(new ServiceRequest(serviceName, servicePrice));
                }
            }
        }

        List<MultipartFile> files = request.getFiles("files");
        
        return RoomRequest.builder()
            .title(title)
            .description(description)
            .price(price)
            .latitude(latitude)
            .longitude(longitude)
            .address(address)
            .cityCode(cityCode)
            .districtCode(districtCode)
            .wardCode(wardCode)
            .street(street)
            .addressDetail(addressDetail)
            .categoryId(categoryId)
            .status(RoomStatus.ROOM_RENT)
            .assets(assets)
            .services(services)
            .files(files)
            .waterCost(waterCost)
            .publicElectricCost(publicElectricCost)
            .internetCost(internetCost)
            .build();
    }

}