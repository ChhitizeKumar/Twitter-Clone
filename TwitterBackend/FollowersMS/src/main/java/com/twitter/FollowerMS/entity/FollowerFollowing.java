package com.twitter.FollowerMS.entity;

import jakarta.persistence.*;

import java.util.Objects;

@Entity
@Table(name = "follows")
public class FollowerFollowing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer followerFollowingId;
    private Integer followerId;
    private Integer followingId;

    public FollowerFollowing() {
    }

    public FollowerFollowing(Integer followerFollowingId, Integer followerId, Integer followingId) {
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
        return "FollowerFollowing{" +
                "followerFollowingId=" + followerFollowingId +
                ", followerId=" + followerId +
                ", followingId=" + followingId +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof FollowerFollowing follower)) return false;
        return Objects.equals(getFollowerFollowingId(), follower.getFollowerFollowingId()) && Objects.equals(getFollowerId(), follower.getFollowerId()) && Objects.equals(getFollowingId(), follower.getFollowingId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getFollowerFollowingId(), getFollowerId(), getFollowingId());
    }
}
