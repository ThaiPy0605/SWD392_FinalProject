package com.swd392.finalproject.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "discounts")
public class Discount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code", unique = true, length = 50)
    private String code;

    @Column(name = "percent")
    private Integer percent;

    @Column(name = "expiry")
    private LocalDate expiry;

    @Column(name = "min_spend", precision = 12, scale = 2)
    private BigDecimal minSpend;

    @OneToMany(mappedBy = "discount", fetch = FetchType.LAZY)
    private List<Order> orders = new ArrayList<>();
}
