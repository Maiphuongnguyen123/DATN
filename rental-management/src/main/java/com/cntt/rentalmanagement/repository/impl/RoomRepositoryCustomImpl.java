package com.cntt.rentalmanagement.repository.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.Query;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import com.cntt.rentalmanagement.domain.models.Room;
import com.cntt.rentalmanagement.domain.models.AddressLocation;
import com.cntt.rentalmanagement.domain.payload.request.RoomFilterRequest;
import com.cntt.rentalmanagement.repository.RoomRepositoryCustom;

@Repository
public class RoomRepositoryCustomImpl implements RoomRepositoryCustom {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Page<Room> findRoomsWithFilters(RoomFilterRequest filter) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Room> query = cb.createQuery(Room.class);
        Root<Room> room = query.from(Room.class);

        List<Predicate> predicates = new ArrayList<>();

        // Thêm điều kiện cơ bản
        predicates.add(cb.equal(room.get("isApprove"), filter.getIsApprove()));
        predicates.add(cb.equal(room.get("isRemove"), filter.getIsRemove()));

        // Tìm kiếm theo tên/mô tả
        if (StringUtils.hasText(filter.getSearchQuery())) {
            String searchPattern = "%" + filter.getSearchQuery().toLowerCase() + "%";
            Predicate titlePredicate = cb.like(cb.lower(room.get("title")), searchPattern);
            Predicate descPredicate = cb.like(cb.lower(room.get("description")), searchPattern);
            predicates.add(cb.or(titlePredicate, descPredicate));
        }

        // Lọc theo category
        if (filter.getCategoryId() != null && filter.getCategoryId() != 0) {
            predicates.add(cb.equal(room.get("category").get("id"), filter.getCategoryId()));
        }

        // Lọc theo khoảng giá
        if (filter.getMinPrice() != null) {
            predicates.add(cb.greaterThanOrEqualTo(room.get("price"), filter.getMinPrice()));
        }
        if (filter.getMaxPrice() != null) {
            predicates.add(cb.lessThanOrEqualTo(room.get("price"), filter.getMaxPrice()));
        }

        // Lọc theo khoảng diện tích
        if (filter.getMinArea() != null) {
            predicates.add(cb.greaterThanOrEqualTo(room.get("area"), filter.getMinArea()));
        }
        if (filter.getMaxArea() != null) {
            predicates.add(cb.lessThanOrEqualTo(room.get("area"), filter.getMaxArea()));
        }

        // Lọc theo địa chỉ
        if (StringUtils.hasText(filter.getCityCode())) {
            predicates.add(cb.equal(room.get("addressLocation").get("cityCode"), filter.getCityCode()));
            
            if (StringUtils.hasText(filter.getDistrictCode())) {
                predicates.add(cb.equal(room.get("addressLocation").get("districtCode"), filter.getDistrictCode()));
                
                if (StringUtils.hasText(filter.getWardCode())) {
                    predicates.add(cb.equal(room.get("addressLocation").get("wardCode"), filter.getWardCode()));
                }
            }
        }

        // Thêm điều kiện WHERE
        if (!predicates.isEmpty()) {
            query.where(predicates.toArray(new Predicate[0]));
        }

        // Thêm ORDER BY
        if ("asc".equalsIgnoreCase(filter.getSortDirection())) {
            query.orderBy(cb.asc(room.get(filter.getSortBy())));
        } else {
            query.orderBy(cb.desc(room.get(filter.getSortBy())));
        }

        // Thực hiện query với phân trang
        TypedQuery<Room> typedQuery = em.createQuery(query);
        typedQuery.setFirstResult((filter.getPageNo() - 1) * filter.getPageSize());
        typedQuery.setMaxResults(filter.getPageSize());

        // Query để đếm tổng số kết quả
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<Room> countRoot = countQuery.from(Room.class);
        countQuery.select(cb.count(countRoot));
        if (!predicates.isEmpty()) {
            countQuery.where(predicates.toArray(new Predicate[0]));
        }
        Long total = em.createQuery(countQuery).getSingleResult();

        return new PageImpl<>(typedQuery.getResultList(),
                PageRequest.of(filter.getPageNo() - 1, filter.getPageSize()),
                total);
    }

    @Override
    public Page<Room> searchingRoom(String title, Long userId, Pageable pageable) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Room> query = cb.createQuery(Room.class);
        Root<Room> room = query.from(Room.class);

        List<Predicate> predicates = new ArrayList<>();

        if (StringUtils.hasText(title)) {
            predicates.add(cb.like(cb.lower(room.get("title")), "%" + title.toLowerCase() + "%"));
        }

        if (userId != null) {
            predicates.add(cb.equal(room.get("user").get("id"), userId));
        }

        if (!predicates.isEmpty()) {
            query.where(predicates.toArray(new Predicate[0]));
        }

        TypedQuery<Room> typedQuery = em.createQuery(query);
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize());

        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<Room> countRoot = countQuery.from(Room.class);
        countQuery.select(cb.count(countRoot));
        if (!predicates.isEmpty()) {
            countQuery.where(predicates.toArray(new Predicate[0]));
        }
        Long total = em.createQuery(countQuery).getSingleResult();

        return new PageImpl<>(typedQuery.getResultList(), pageable, total);
    }

    @Override
    public Page<Room> searchingRoomForAdmin(String title, Boolean approve, Pageable pageable) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Room> query = cb.createQuery(Room.class);
        Root<Room> room = query.from(Room.class);

        List<Predicate> predicates = new ArrayList<>();

        if (StringUtils.hasText(title)) {
            predicates.add(cb.like(cb.lower(room.get("title")), "%" + title.toLowerCase() + "%"));
        }

        if (approve != null) {
            predicates.add(cb.equal(room.get("isApprove"), approve));
        }

        if (!predicates.isEmpty()) {
            query.where(predicates.toArray(new Predicate[0]));
        }

        TypedQuery<Room> typedQuery = em.createQuery(query);
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize());

        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<Room> countRoot = countQuery.from(Room.class);
        countQuery.select(cb.count(countRoot));
        if (!predicates.isEmpty()) {
            countQuery.where(predicates.toArray(new Predicate[0]));
        }
        Long total = em.createQuery(countQuery).getSingleResult();

        return new PageImpl<>(typedQuery.getResultList(), pageable, total);
    }

    @Override
    public Page<Room> searchingRoomForCustomer(
        String title, 
        BigDecimal minPrice, 
        BigDecimal maxPrice, 
        BigDecimal minArea,
        BigDecimal maxArea, 
        Long categoryId,
        String provinceCode,
        String districtCode,
        String wardCode,
        Long userId, 
        Pageable pageable
    ) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Room> query = cb.createQuery(Room.class);
        Root<Room> room = query.from(Room.class);

        List<Predicate> predicates = new ArrayList<>();

        // Add base conditions
        predicates.add(cb.equal(room.get("isApprove"), true));
        predicates.add(cb.equal(room.get("isRemove"), false));

        if (StringUtils.hasText(title)) {
            predicates.add(cb.like(cb.lower(room.get("title")), "%" + title.toLowerCase() + "%"));
        }

        // Handle price range filter
        if (minPrice != null) {
            predicates.add(cb.greaterThanOrEqualTo(room.get("price"), minPrice));
        }
        if (maxPrice != null) {
            predicates.add(cb.lessThanOrEqualTo(room.get("price"), maxPrice));
        }

        // Handle area range filter
        if (minArea != null) {
            predicates.add(cb.greaterThanOrEqualTo(room.get("area"), minArea));
        }
        if (maxArea != null) {
            predicates.add(cb.lessThanOrEqualTo(room.get("area"), maxArea));
        }

        // Handle category filter
        if (categoryId != null && categoryId != 0) {
            predicates.add(cb.equal(room.get("category").get("id"), categoryId));
        }

        // Handle address filter using codes
        Join<Room, AddressLocation> addressJoin = room.join("addressLocation", JoinType.LEFT);
        if (StringUtils.hasText(provinceCode)) {
            predicates.add(cb.equal(addressJoin.get("cityCode"), provinceCode));
            
            if (StringUtils.hasText(districtCode)) {
                predicates.add(cb.equal(addressJoin.get("districtCode"), districtCode));
                
                if (StringUtils.hasText(wardCode)) {
                    predicates.add(cb.equal(addressJoin.get("wardCode"), wardCode));
                }
            }
        }

        if (userId != null) {
            predicates.add(cb.equal(room.get("user").get("id"), userId));
        }

        // Add WHERE clause
        if (!predicates.isEmpty()) {
            query.where(predicates.toArray(new Predicate[0]));
        }

        // Execute query with pagination
        TypedQuery<Room> typedQuery = em.createQuery(query);
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize());

        // Count total results using native query
        StringBuilder countSql = new StringBuilder();
        countSql.append("SELECT COUNT(DISTINCT r.id) FROM room r ");

        // Join với address_locations nếu có filter địa chỉ
        if (StringUtils.hasText(provinceCode) || 
            StringUtils.hasText(districtCode) || 
            StringUtils.hasText(wardCode)) {
            countSql.append("LEFT JOIN address_locations al ON r.address_location_id = al.id ");
        }

        // Join với category nếu có filter category
        if (categoryId != null && categoryId != 0) {
            countSql.append("LEFT JOIN category c ON r.category_id = c.id ");
        }

        // Join với user nếu có filter user
        if (userId != null) {
            countSql.append("LEFT JOIN users u ON r.user_id = u.id ");
        }

        // Điều kiện WHERE cơ bản
        countSql.append("WHERE r.is_approve = :isApprove ");
        countSql.append("AND r.is_remove = :isRemove ");

        // Thêm điều kiện tìm kiếm theo title
        if (StringUtils.hasText(title)) {
            countSql.append("AND LOWER(r.title) LIKE :searchPattern ");
        }

        // Thêm điều kiện lọc theo giá
        if (minPrice != null) {
            countSql.append("AND r.price >= :minPrice ");
        }
        if (maxPrice != null) {
            countSql.append("AND r.price <= :maxPrice ");
        }

        // Thêm điều kiện lọc theo diện tích
        if (minArea != null) {
            countSql.append("AND r.area >= :minArea ");
        }
        if (maxArea != null) {
            countSql.append("AND r.area <= :maxArea ");
        }

        // Thêm điều kiện lọc theo category
        if (categoryId != null && categoryId != 0) {
            countSql.append("AND c.id = :categoryId ");
        }

        // Thêm điều kiện lọc theo địa chỉ
        if (StringUtils.hasText(provinceCode)) {
            countSql.append("AND al.city_code = :cityCode ");
            
            if (StringUtils.hasText(districtCode)) {
                countSql.append("AND al.district_code = :districtCode ");
                
                if (StringUtils.hasText(wardCode)) {
                    countSql.append("AND al.ward_code = :wardCode ");
                }
            }
        }

        // Thêm điều kiện lọc theo user
        if (userId != null) {
            countSql.append("AND u.id = :userId ");
        }

        // Tạo native query và set parameters
        Query nativeCountQuery = em.createNativeQuery(countSql.toString());
        
        // Set các parameter cơ bản
        nativeCountQuery.setParameter("isApprove", true);
        nativeCountQuery.setParameter("isRemove", false);

        // Set parameter tìm kiếm theo title
        if (StringUtils.hasText(title)) {
            nativeCountQuery.setParameter("searchPattern", "%" + title.toLowerCase() + "%");
        }

        // Set parameter giá
        if (minPrice != null) {
            nativeCountQuery.setParameter("minPrice", minPrice);
        }
        if (maxPrice != null) {
            nativeCountQuery.setParameter("maxPrice", maxPrice);
        }

        // Set parameter diện tích
        if (minArea != null) {
            nativeCountQuery.setParameter("minArea", minArea);
        }
        if (maxArea != null) {
            nativeCountQuery.setParameter("maxArea", maxArea);
        }

        // Set parameter category
        if (categoryId != null && categoryId != 0) {
            nativeCountQuery.setParameter("categoryId", categoryId);
        }

        // Set parameter địa chỉ
        if (StringUtils.hasText(provinceCode)) {
            nativeCountQuery.setParameter("cityCode", provinceCode);
            
            if (StringUtils.hasText(districtCode)) {
                nativeCountQuery.setParameter("districtCode", districtCode);
                
                if (StringUtils.hasText(wardCode)) {
                    nativeCountQuery.setParameter("wardCode", wardCode);
                }
            }
        }

        // Set parameter user
        if (userId != null) {
            nativeCountQuery.setParameter("userId", userId);
        }

        // Thực hiện query và lấy kết quả
        Long total = ((Number) nativeCountQuery.getSingleResult()).longValue();

        return new PageImpl<>(typedQuery.getResultList(), pageable, total);
    }

    @Override
    public Page<Room> getAllRentOfHome(Long userId, Pageable pageable) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Room> query = cb.createQuery(Room.class);
        Root<Room> room = query.from(Room.class);

        List<Predicate> predicates = new ArrayList<>();

        if (userId != null) {
            predicates.add(cb.equal(room.get("user").get("id"), userId));
        }

        predicates.add(cb.equal(room.get("isApprove"), true));
        predicates.add(cb.equal(room.get("isRemove"), false));

        if (!predicates.isEmpty()) {
            query.where(predicates.toArray(new Predicate[0]));
        }

        TypedQuery<Room> typedQuery = em.createQuery(query);
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize());

        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<Room> countRoot = countQuery.from(Room.class);
        countQuery.select(cb.count(countRoot));
        if (!predicates.isEmpty()) {
            countQuery.where(predicates.toArray(new Predicate[0]));
        }
        Long total = em.createQuery(countQuery).getSingleResult();

        return new PageImpl<>(typedQuery.getResultList(), pageable, total);
    }
}
