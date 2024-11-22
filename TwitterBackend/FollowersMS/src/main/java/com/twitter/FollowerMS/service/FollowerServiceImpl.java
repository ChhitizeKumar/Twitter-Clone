package com.twitter.FollowerMS.service;

import com.twitter.FollowerMS.entity.FollowerFollowing;
import com.twitter.FollowerMS.exception.FollowerException;
import com.twitter.FollowerMS.repository.FollowerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class FollowerServiceImpl implements FollowerService{

    @Autowired
    FollowerRepository followerRepository;

    @Override
    public void followUser(Integer followerId, Integer followingId) throws FollowerException {

        if(followerRepository.existsByFollowerIdAndFollowingId(followerId, followingId))
            throw new FollowerException("Service.USER_ALREADY_FOLLOWED");

        FollowerFollowing follow = new FollowerFollowing();
        follow.setFollowingId(followingId);
        follow.setFollowerId(followerId);

        followerRepository.save(follow);
    }

    @Override
    public void unFollowUser(Integer followerId, Integer followingId) {

        followerRepository.deleteByFollowerIdAndFollowingId(followerId, followingId);
        return;
    }

    @Override
    public List<Integer> getAllFollowers(Integer userId) throws FollowerException {
        return followerRepository.findByFollowingId(userId).stream()
                .map(FollowerFollowing::getFollowerId)
                .collect(Collectors.toList());
    }

    @Override
    public List<Integer> getAllFollowings(Integer userId) throws FollowerException {
        return followerRepository.findByFollowerId(userId).stream()
                .map(FollowerFollowing::getFollowingId)
                .collect(Collectors.toList());
    }

    @Override
    public Boolean checkFollowerExists(Integer followerId, Integer followingId) {
        return followerRepository.existsByFollowerIdAndFollowingId(followerId, followingId);
    }
}
