package com.cntt.rentalmanagement.services.impl;

import com.cntt.rentalmanagement.domain.enums.RoomStatus;
import com.cntt.rentalmanagement.domain.models.Contract;
import com.cntt.rentalmanagement.domain.models.Room;
import com.cntt.rentalmanagement.domain.models.User;
import com.cntt.rentalmanagement.domain.payload.request.TotalNumberRequest;
import com.cntt.rentalmanagement.domain.payload.response.CostResponse;
import com.cntt.rentalmanagement.domain.payload.response.RevenueResponse;
import com.cntt.rentalmanagement.domain.payload.response.TotalNumberResponse;
import com.cntt.rentalmanagement.exception.BadRequestException;
import com.cntt.rentalmanagement.repository.ContractRepository;
import com.cntt.rentalmanagement.repository.MaintenanceRepository;
import com.cntt.rentalmanagement.repository.RoomRepository;
import com.cntt.rentalmanagement.repository.UserRepository;
import com.cntt.rentalmanagement.services.BaseService;
import com.cntt.rentalmanagement.services.StatisticalService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StatisticalServiceImpl extends BaseService implements StatisticalService {

    private final ContractRepository contractRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final MaintenanceRepository maintenanceRepository;

    @Override
    public TotalNumberRequest getNumberOflandlordForStatistical() {
        User user = userRepository.findById(getUserId()).orElseThrow(() -> new BadRequestException("Tài khoản không tồn tại"));
        int total = 0;
        for (Contract contract : contractRepository.getAllContract(getUserId())) {
            Duration duration = Duration.between(contract.getCreatedAt(), contract.getDeadlineContract());
            long months = duration.toMinutes() / (60 * 24 * 30);
            total += months * (contract.getRoom().getPrice().intValue() + contract.getRoom().getWaterCost().intValue() + contract.getRoom().getPublicElectricCost().intValue() + contract.getRoom().getInternetCost().intValue());
        }


        TotalNumberRequest totalNumberRequest = new TotalNumberRequest();
        totalNumberRequest.setNumberOfRoom((int) roomRepository.countAllByUser(user));
        totalNumberRequest.setNumberOfEmptyRoom((int) roomRepository.countAllByStatusAndUser(RoomStatus.ROOM_RENT,user) + (int) roomRepository.countAllByStatusAndUser(RoomStatus.CHECKED_OUT,user));
        totalNumberRequest.setNumberOfPeople((int) (contractRepository.sumNumOfPeopleByLandlord(getUserId()) != null ? contractRepository.sumNumOfPeopleByLandlord(getUserId()) : 0));
        totalNumberRequest.setRevenue(BigDecimal.valueOf(total));
        return totalNumberRequest;
    }

    @Override
    public TotalNumberResponse getStatisticalNumberOfAdmin() {
        TotalNumberResponse totalNumberResponse = new TotalNumberResponse();
        totalNumberResponse.setNumberOfAccount((int) userRepository.count());
        totalNumberResponse.setNumberOfApprove((int) roomRepository.countByIsApprove(true));
        totalNumberResponse.setNumberOfApproving((int) roomRepository.countByIsApprove(false));
        totalNumberResponse.setNumberOfAccountLocked((int) roomRepository.count());
        return totalNumberResponse;
    }

    @Override
    // public Page<RevenueResponse> getByMonth() {
    //     List<RevenueResponse> list = new ArrayList<>();

    //     Map<YearMonth, Integer> monthTotalMap = new HashMap<>(); // Sử dụng Map để theo dõi tổng theo từng tháng

    //     for (Contract contract : contractRepository.getAllContract(getUserId())) {
    //         LocalDateTime endDate = contract.getCreatedAt().withMonth(12).withDayOfMonth(31);

    //         YearMonth currentMonth = YearMonth.from(contract.getCreatedAt());
    //         YearMonth endMonth = YearMonth.from(endDate);

    //         while (currentMonth.isBefore(endMonth) || currentMonth.equals(endMonth)) {
    //             int months = (int) currentMonth.until(endMonth, ChronoUnit.MONTHS);

    //             Integer total = monthTotalMap.get(currentMonth);
    //             if (total == null) {
    //                 total = 0;
    //             }

    //             total += months * contract.getRoom().getPrice().intValue();
    //             monthTotalMap.put(currentMonth, total);

    //             currentMonth = currentMonth.plusMonths(1);
    //         }
    //     }

    //     for (Map.Entry<YearMonth, Integer> entry : monthTotalMap.entrySet()) {
    //         RevenueResponse response = new RevenueResponse();
    //         response.setMonth(entry.getKey().getMonthValue());
    //         response.setRevenue(BigDecimal.valueOf(entry.getValue()));
    //         list.add(response);
    //     }

    //     return new PageImpl<>(list);
    // }
    public Page<RevenueResponse> getByMonth() {
        List<RevenueResponse> list = new ArrayList<>();
    
        // Sử dụng Map để theo dõi tổng theo từng tháng và chi phí khác
        Map<YearMonth, RevenueDetails> monthTotalMap = new HashMap<>();
    
        for (Contract contract : contractRepository.getAllContract(getUserId())) {
            LocalDateTime endDate = contract.getCreatedAt().withMonth(12).withDayOfMonth(31);
    
            YearMonth currentMonth = YearMonth.from(contract.getCreatedAt());
            YearMonth endMonth = YearMonth.from(endDate);
    
            while (currentMonth.isBefore(endMonth) || currentMonth.equals(endMonth)) {
                RevenueDetails details = monthTotalMap.getOrDefault(currentMonth, new RevenueDetails());
            
                int months = (int) currentMonth.until(endMonth, ChronoUnit.MONTHS);
            
                details.revenue +=   contract.getRoom().getPrice().intValue();
                // Check for null and use 0 if null
                // details.waterCost += (contract.getRoom().getWaterCost() != null) ? contract.getRoom().getWaterCost().intValue() : 0;
                // details.publicElectricCost += (contract.getRoom().getPublicElectricCost() != null) ? contract.getRoom().getPublicElectricCost().intValue() : 0;
                // details.internetCost += (contract.getRoom().getInternetCost() != null) ? contract.getRoom().getInternetCost().intValue() : 0;
                details.waterCost +=   contract.getRoom().getWaterCost().intValue();
                details.publicElectricCost +=   contract.getRoom().getPublicElectricCost().intValue();
                details.internetCost +=   contract.getRoom().getInternetCost().intValue();
            
                monthTotalMap.put(currentMonth, details);
            
                currentMonth = currentMonth.plusMonths(1);
            }
        }
    
        for (Map.Entry<YearMonth, RevenueDetails> entry : monthTotalMap.entrySet()) {
            RevenueResponse response = new RevenueResponse();
            response.setMonth(entry.getKey().getMonthValue());
            RevenueDetails details = entry.getValue();
            response.setRevenue(BigDecimal.valueOf(details.revenue));
            response.setWaterCost(BigDecimal.valueOf(details.waterCost));
            response.setPublicElectricCost(BigDecimal.valueOf(details.publicElectricCost));
            response.setInternetCost(BigDecimal.valueOf(details.internetCost));
            list.add(response);
        }
    
        return new PageImpl<>(list);
    }
    
    // Class để theo dõi chi tiết doanh thu và chi phí
    class RevenueDetails {
        int revenue = 0;
        int waterCost = 0;
        int publicElectricCost = 0;
        int internetCost = 0;
    }

    @Override
    public Page<CostResponse> getByCost() {
        int total = 0;
        for (Contract contract : contractRepository.getAllContract(getUserId())) {
            Duration duration = Duration.between(contract.getCreatedAt(), contract.getDeadlineContract());
            long months = duration.toMinutes() / (60 * 24 * 30);
            total += months * contract.getRoom().getPrice().intValue();
        }

        List<CostResponse> costResponses = new ArrayList<>();
        CostResponse costResponse1 = new CostResponse();
        costResponse1.setName("Doanh thu");
        costResponse1.setCost(BigDecimal.valueOf(total));

        CostResponse costResponse2 = new CostResponse();
        costResponse2.setCost(maintenanceRepository.sumPriceOfMaintenance(getUserId()));
        costResponse2.setName("Bảo trì");

        costResponses.add(costResponse1);
        costResponses.add(costResponse2);
        return new PageImpl<>(costResponses);
    }
}
