package com.cntt.rentalmanagement.service.impl;

import com.cntt.rentalmanagement.model.request.RentRequest;
import com.cntt.rentalmanagement.service.RentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.cntt.rentalmanagement.domain.payload.response.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import com.cntt.rentalmanagement.repository.ElectricAndWaterRepository;
import com.cntt.rentalmanagement.repository.RoomRepository;
import com.cntt.rentalmanagement.domain.models.ElectricAndWater;
import com.cntt.rentalmanagement.domain.models.Room;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.PageImpl;
import java.util.List;
import java.util.stream.Collectors;
import com.cntt.rentalmanagement.domain.payload.response.ElectricAndWaterResponse;
import com.cntt.rentalmanagement.utils.MapperUtils;
import com.cntt.rentalmanagement.domain.payload.response.RoomResponse;

@Service
@RequiredArgsConstructor
public class RentServiceImpl implements RentService {

    @Autowired
    private ElectricAndWaterRepository electricAndWaterRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private MapperUtils mapperUtils;

    @Override
    public MessageResponse saveRentData(RentRequest request) {
        Room room = roomRepository.findById(request.getRoomId())
            .orElseThrow(() -> new RuntimeException("Room not found"));

        ElectricAndWater eaw = new ElectricAndWater();
        eaw.setRoom(room);
        eaw.setName(room.getTitle());
        eaw.setMonth(java.time.LocalDate.now().getMonthValue());
        eaw.setPaid(false);
        if (request.getTotalAmount() != null) {
            eaw.setTotalMoneyOfElectric(java.math.BigDecimal.valueOf(request.getTotalAmount()));
            eaw.setTotalMoneyOfWater(java.math.BigDecimal.valueOf(request.getTotalAmount()));
            eaw.setTotalAmount(java.math.BigDecimal.valueOf(request.getTotalAmount()));
        }

        electricAndWaterRepository.save(eaw);
        return MessageResponse.builder().message("Lưu thông tin tiền trọ thành công").build();
    }

    @Override
    public MessageResponse updatePaymentStatus(Long id, boolean paid) {
        ElectricAndWater eaw = electricAndWaterRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn"));
        eaw.setPaid(paid);
        electricAndWaterRepository.save(eaw);
        return MessageResponse.builder().message("Cập nhật trạng thái thanh toán thành công").build();
    }

    @Override
    public Page<ElectricAndWaterResponse> getAllRent(int pageNo, int pageSize) {
        Page<ElectricAndWater> page = electricAndWaterRepository.findAll(PageRequest.of(pageNo, pageSize));
        List<ElectricAndWaterResponse> dtos = page.getContent().stream().map(e -> {
            ElectricAndWaterResponse dto = new ElectricAndWaterResponse();
            dto.setId(e.getId());
            dto.setName(e.getName());
            dto.setMonth(e.getMonth());
            dto.setPaid(e.isPaid());
            dto.setTotalAmount(e.getTotalAmount());
            if (e.getRoom() != null) {
                RoomResponse roomResponse = mapperUtils.convertToResponse(e.getRoom(), RoomResponse.class);
                dto.setRoom(roomResponse);
            }
            // ... set các trường cần thiết khác
            return dto;
        }).collect(Collectors.toList());
        return new PageImpl<>(dtos, page.getPageable(), page.getTotalElements());
    }
} 