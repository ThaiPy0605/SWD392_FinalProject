package com.swd392.finalproject.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "support_tickets")
public class SupportTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "subject", length = 255)
    private String subject;

    @Column(name = "message", columnDefinition = "text")
    private String message;

    @Column(name = "status", length = 50)
    private String status;

    @Column(name = "reply", columnDefinition = "text")
    private String reply;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
