package com.cntt.rentalmanagement.repository;

import com.cntt.rentalmanagement.domain.models.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ContractRepository extends JpaRepository<Contract, Long>, ContractRepositoryCustom {
    @Query(value = "SELECT sum(c.numOfPeople) from Contract c ")
    long sumNumOfPeople();

    @Query(value = "SELECT sum(c.numOfPeople) from Contract c INNER JOIN c.room r WHERE r.user.id = :userId AND c.deadlineContract > CURRENT_TIMESTAMP")
    Long sumNumOfPeopleByLandlord(@Param("userId") Long userId);
}
