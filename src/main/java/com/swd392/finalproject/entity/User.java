package com.swd392.finalproject.entity;

import com.swd392.finalproject.enums.Role;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", length = 255)
    private String fullName;

    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "password_hash", length = 255)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", length = 20)
    private Role role;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Enrollment> enrollments = new ArrayList<>();

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Cart cart;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Order> orders = new ArrayList<>();

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Review> reviews = new ArrayList<>();

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<SupportTicket> supportTickets = new ArrayList<>();

    public static User register(String fullName, String email, String passwordHash) {
        User user = new User();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPasswordHash(passwordHash);
        user.setRole(Role.MEMBER);
        return user;
    }

    public boolean login(String email, String passwordHash) {
        return this.email != null
                && this.passwordHash != null
                && this.email.equals(email)
                && this.passwordHash.equals(passwordHash);
    }

    public void updateProfile(String fullName) {
        this.fullName = fullName;
    }

    public void block(User actor) {
        if (actor == null || actor.getRole() != Role.ADMIN) {
            throw new IllegalStateException("Only admin can block user");
        }
        this.role = Role.GUEST;
    }
}
