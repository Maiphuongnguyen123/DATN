package com.cntt.rentalmanagement.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cntt.rentalmanagement.domain.models.User;

public interface UserRepository extends JpaRepository<User, Long> , UserRepositoryCustom{

    Optional<User> findByEmail(String email);

    Optional<User> findByPhone(String phone);

    Boolean existsByEmail(String email);
    
    List<User> findByName(String name);

    long count();

    @Query("""
        SELECT u FROM User u 
        WHERE UPPER(u.name) LIKE UPPER(:pattern) 
        OR UPPER(u.email) LIKE UPPER(:pattern)
        OR UPPER(u.phone) LIKE UPPER(:pattern)
        ORDER BY 
            CASE 
                WHEN UPPER(u.name) LIKE UPPER(:pattern) THEN 0 
                ELSE 1 
            END,
            u.name ASC
        """)
    List<User> findBySearchCriteria(
        @Param("pattern") String pattern,
        Pageable pageable
    );

}
