package com.cntt.rentalmanagement.domain.models;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

import javax.persistence.*;

@Entity
@Table(name = "serviceroom")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ServiceRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private BigDecimal price;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;
}
