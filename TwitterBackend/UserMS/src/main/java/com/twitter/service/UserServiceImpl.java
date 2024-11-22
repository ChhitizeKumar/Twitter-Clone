package com.twitter.service;

import com.twitter.dto.*;
import com.twitter.entity.User;
import com.twitter.exception.UserException;
import com.twitter.repository.UserRepository;
//import com.twitter.security.JwtUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService{
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    WebClient.Builder webClientBuilder;


//    @Autowired
//    private JwtUtil jwtUtil;

    @Override
    public User registerUser(RegisterRequestDTO request) {

        System.out.println(request);

//        return new User();
//        System.out.println(request.getEmail(), );
        User user = new User();
        user.setFullName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Encrypt password
        user.setUsername(request.getUsername());
        userRepository.save(user);

        SearchUserDTO searchUserDTO = new SearchUserDTO(user.getUserId(), user.getUsername(), user.getFullName());

        webClientBuilder.build()
                .post()
                .uri("http://localhost:9003/api/search/")
                .body(Mono.just(searchUserDTO), SearchUserDTO.class)
                .retrieve()
                .bodyToMono(String.class)
                .doOnError(e -> {
                    // Handle the error, possibly logging it
                    System.err.println("Error sending data to Search microservice: " + e.getMessage());
                })
                .subscribe();

        return user;
    }

    @Override
    public Integer loginUser(LoginRequestDTO loginRequest) throws UserException {
        Optional<User> user = userRepository.findByEmail(loginRequest.getEmail());
        if (user.isPresent() && passwordEncoder.matches(loginRequest.getPassword(), user.get().getPassword())) {

            return user.get().getUserId();

        }
        throw new UserException("Invalid credentials");
    }

    @Override
    public GetResponse getUserById(Integer id) {
        Optional<User> user = userRepository.findById(id);



        return new GetResponse(user.get().getUsername(), user.get().getFullName(), user.get().getProfileImageMediaId());
    }


    @Override
    public void updateProfilePhoto(Integer userId, String mediaId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setProfileImageMediaId(mediaId);
        userRepository.save(user);
    }

    @Override
    public List<FollowFollowerResponse> getFollowings(Integer userId) {

        List<Integer> followings = webClientBuilder.build()
                .get()
                .uri("http://localhost:9005/api/followings/{userId}", userId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Integer>>() {})
                .block();

        return getUserDetails(followings);
    }

    @Override
    public List<FollowFollowerResponse> getFollowers(Integer userId) {
        WebClient webClient = webClientBuilder.build();

        List<Integer> followers = webClient
                .get()
                .uri("http://localhost:9005/api/followers/{userId}", userId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Integer>>() {})
                .block();

        return getUserDetails(followers);
    }

    private List<FollowFollowerResponse> getUserDetails(List<Integer> userIds) {
        List<User> users = (List<User>) userRepository.findAllById(userIds); // Assuming this method exists


        return users.stream()
                .map(user -> new FollowFollowerResponse(user.getUserId(), user.getUsername(), user.getFullName(), user.getProfileImageMediaId()))
                .collect(Collectors.toList());
    }

    public List<FollowFollowerResponse> getAllUsersExceptCurrentAndFollowings(Integer currentUserId) {
        // Fetch the list of user IDs that the current user follows
        List<Integer> followings = webClientBuilder.build()
                .get()
                .uri("http://localhost:9005/api/followings/{currentUserId}", currentUserId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Integer>>() {})
                .block();

        // Add the current user's ID to the list of excluded IDs
        followings.add(currentUserId);
        System.out.println(followings);

        // Fetch all users from the repository
        List<User> allUsers = (List<User>) userRepository.findAll();

        // Filter out the users who are in the list of followings or the current user
        List<FollowFollowerResponse> result = allUsers.stream()
                .filter(user -> !followings.contains(user.getUserId()))
                .map(user -> new FollowFollowerResponse(user.getUserId(), user.getUsername(), user.getFullName(), user.getProfileImageMediaId()))
                .collect(Collectors.toList());

        return result;
    }

}
