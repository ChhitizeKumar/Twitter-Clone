package com.twitter.FollowerMS.repository;

import com.twitter.FollowerMS.entity.FollowerFollowing;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface FollowerRepository extends CrudRepository<FollowerFollowing, Integer> {

    // Find all following users of a particular user
    List<FollowerFollowing> findByFollowerId(Integer followerId);

    // Find all followers of a particular user
    List<FollowerFollowing> findByFollowingId(Integer followingId);

    // Check if a follow relationship exists
    boolean existsByFollowerIdAndFollowingId(Integer followerId, Integer followingId);

    void deleteByFollowerIdAndFollowingId(Integer followerId, Integer followingId);
}
