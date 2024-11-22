package com.twitter.dto;



public class FollowFollowerResponse {

    private String userName;
    private String fullName;
    private String imageUrl;

    private Integer id;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public FollowFollowerResponse(Integer id, String userName, String fullName, String imageUrl) {
        this.id = id;
        this.userName = userName;
        this.fullName = fullName;
        this.imageUrl = imageUrl;
    }



    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}