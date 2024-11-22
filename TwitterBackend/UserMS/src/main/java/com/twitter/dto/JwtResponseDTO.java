package com.twitter.dto;

import jakarta.persistence.criteria.CriteriaBuilder;

import java.security.PrivilegedAction;

public class JwtResponseDTO {


//    private String accessToken;
//    private String type = "Bearer";
    private Integer userId;

    private String msg;

    public JwtResponseDTO(Integer userId, String msg) {
        this.userId = userId;
        this.msg = msg;
    }

    public JwtResponseDTO() {
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
