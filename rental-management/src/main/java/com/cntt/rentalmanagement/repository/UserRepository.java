package com.cntt.rentalmanagement.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cntt.rentalmanagement.domain.models.User;
import com.cntt.rentalmanagement.domain.enums.RoleName;

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

    Optional<User> findById(Long id);
    
    Page<User> findByRoles_Name(RoleName roleName, Pageable pageable);
    
    Page<User> findByNameContainingIgnoreCaseAndRoles_Name(String name, RoleName roleName, Pageable pageable);
    
    Optional<User> findByIdAndRoles_Name(Long id, RoleName roleName);

}
