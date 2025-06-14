package com.cntt.rentalmanagement.domain.models;

import com.cntt.rentalmanagement.domain.enums.LockedStatus;
import com.cntt.rentalmanagement.domain.enums.RoomStatus;
import com.cntt.rentalmanagement.domain.models.audit.DateAudit;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;
import java.util.ArrayList;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;
import org.springframework.util.StringUtils;

@Entity
@Table(name = "room")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Room extends DateAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private BigDecimal price;

    private Double latitude;

    private Double longitude;

    private String address;

    @Enumerated(EnumType.STRING)
    private RoomStatus status;

    @Enumerated(EnumType.STRING)
    private LockedStatus isLocked;

    @Column(name = "is_approve")
    private Boolean isApprove;

    @Column(name = "is_remove")
    private Boolean isRemove;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    @ManyToOne
    @JoinColumn(name = "address_location_id")
    private AddressLocation addressLocation;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "rooms")
    private List<Comment> comment;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToMany(mappedBy = "room")
    private List<Contract> contracts;

    @OneToMany(mappedBy = "room")
    private List<Asset> assets;

    @OneToMany(mappedBy = "room")
    private List<ServiceRoom> serviceRoom;

    @OneToMany(mappedBy = "room")
    private List<Request> requests;

    @OneToMany(mappedBy = "room")
    private List<Maintenance> maintenances;

    @OneToMany(mappedBy = "room")
    private List<Rate> rates;

    @OneToMany(mappedBy = "room")
    private List<RoomMedia> roomMedia;

    @OneToMany(mappedBy = "room")
    @JsonIgnore
    private List<BlogStore> stores;

    private BigDecimal waterCost = BigDecimal.ZERO;
    private BigDecimal publicElectricCost = BigDecimal.ZERO;
    private BigDecimal internetCost = BigDecimal.ZERO;


    public Room(String title, String description, BigDecimal price, Double latitude, Double longitude, String address, String createdBy, String updatedBy, Category category, User user, RoomStatus roomStatus) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.category = category;
        this.user = user;
        this.status = roomStatus;
        this.isLocked = LockedStatus.ENABLE;
        this.isApprove = Boolean.FALSE;
        this.isRemove = Boolean.FALSE;
    }

    public Room(String title, String description, BigDecimal price, Double latitude, Double longitude, 
                String address, String createdBy, String updatedBy, Category category, User user, 
                RoomStatus roomStatus, BigDecimal waterCost, BigDecimal publicElectricCost, BigDecimal internetCost) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.category = category;
        this.user = user;
        this.status = roomStatus;
        this.waterCost = waterCost;
        this.publicElectricCost = publicElectricCost;
        this.internetCost = internetCost;
        this.isLocked = LockedStatus.ENABLE;
        this.isApprove = Boolean.FALSE;
        this.isRemove = Boolean.FALSE;
    }
}
