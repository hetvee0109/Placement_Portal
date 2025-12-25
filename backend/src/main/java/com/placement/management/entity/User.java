package com.placement.management.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    private String mobile;
    private String password;
    private String role; // STUDENT or TPO
    private Double cpi;

    // Constructors
    public User() {}
    public User(String name, String email, String mobile, String password, String role, Double cpi) {
        this.name = name;
        this.email = email;
        this.mobile = mobile;
        this.password = password;
        this.role = role;
        this.cpi = cpi;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Double getCpi() { return cpi; }
    public void setCpi(Double cpi) { this.cpi = cpi; }
}
