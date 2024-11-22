package com.twitter.service;

import com.twitter.dto.*;
import com.twitter.entity.User;
import com.twitter.exception.UserException;

import java.util.List;

public interface UserService {

    public User registerUser(RegisterRequestDTO request);
    public Integer loginUser(LoginRequestDTO loginRequest) throws UserException;

    public GetResponse getUserById(Integer id);

    public void updateProfilePhoto(Integer userId, String mediaId);

    public List<FollowFollowerResponse> getFollowings(Integer userId);

    public List<FollowFollowerResponse> getFollowers(Integer userId);

    public List<FollowFollowerResponse> getAllUsersExceptCurrentAndFollowings(Integer currentUserId);
}
