package com.twitter.FollowerMS.dto;


import java.util.Objects;

public class FollowerFollowingDTO {
    private Integer followerFollowingId;
    private Integer followerId;
    private Integer followingId;

    public FollowerFollowingDTO() {
    }

    public FollowerFollowingDTO(Integer followerFollowingId, Integer followerId, Integer followingId) {
        this.followerFollowingId = followerFollowingId;
        this.followerId = followerId;
        this.followingId = followingId;
    }

    public Integer getFollowerFollowingId() {
        return followerFollowingId;
    }

    public void setFollowerFollowingId(Integer followerFollowingId) {
        this.followerFollowingId = followerFollowingId;
    }

    public Integer getFollowerId() {
        return followerId;
    }

    public void setFollowerId(Integer followerId) {
        this.followerId = followerId;
    }

    public Integer getFollowingId() {
        return followingId;
    }

    public void setFollowingId(Integer followingId) {
        this.followingId = followingId;
    }

    @Override
    public String toString() {
        return "FollowerFollowingDTO{" +
                "followerFollowingId=" + followerFollowingId +
                ", followerId=" + followerId +
                ", followingId=" + followingId +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof FollowerFollowingDTO that)) return false;
        return Objects.equals(getFollowerFollowingId(), that.getFollowerFollowingId()) && Objects.equals(getFollowerId(), that.getFollowerId()) && Objects.equals(getFollowingId(), that.getFollowingId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getFollowerFollowingId(), getFollowerId(), getFollowingId());
    }
}
