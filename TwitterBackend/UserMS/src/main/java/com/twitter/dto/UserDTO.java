package com.twitter.dto;

import jakarta.persistence.Column;

public class UserDTO {

    Integer userId;// Primary Key for MySQL

    private String email;

    private String fullName;
    private String password; // Encrypted password

    private String username;
    private String profileImageMediaId; // Media ID reference for profile image

    // Constructors, Getters, Setters


    public UserDTO() {
    }

    public UserDTO(String email, String fullName, String password, String username) {

        this.email = email;
        this.fullName = fullName;
        this.username = username;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getProfileImageMediaId() {
        return profileImageMediaId;
    }

    public void setProfileImageMediaId(String profileImageMediaId) {
        this.profileImageMediaId = profileImageMediaId;
    }
}
