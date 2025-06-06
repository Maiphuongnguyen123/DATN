package com.cntt.rentalmanagement.repository;

import com.cntt.rentalmanagement.domain.models.Room;
import com.cntt.rentalmanagement.domain.models.ServiceRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceRepository extends JpaRepository<ServiceRoom, Long> {
    void deleteAllByRoom(Room room);
} 