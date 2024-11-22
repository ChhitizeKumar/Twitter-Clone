package com.twitter.api;

import com.twitter.dto.*;
import com.twitter.entity.User;
import com.twitter.exception.UserException;
import com.twitter.service.UserService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.core.ParameterizedTypeReference;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(value = "/api/user")
@CrossOrigin
@Validated
public class UserApi {

    @Autowired
    WebClient.Builder webClientBuilder;

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequestDTO registerRequest) {
        User user = userService.registerUser(registerRequest);
        return ResponseEntity.ok("Registration Success");
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponseDTO> login(@RequestBody LoginRequestDTO loginRequest) throws UserException {
//        String token = userService.loginUser(loginRequest);
//        HttpHeaders headers = new HttpHeaders();
//        headers.add(HttpHeaders.AUTHORIZATION, "Bearer " + token);
//
//        System.out.println(token);
//
//        // Return response with the JWT token in the header
////        return new ResponseEntity<>("Login Successful", headers , HttpStatus.OK);

        Integer id = userService.loginUser(loginRequest);
        JwtResponseDTO jwtResponseDTO = new JwtResponseDTO();
        jwtResponseDTO.setUserId(id);
        jwtResponseDTO.setMsg("Login Successful");
        return new ResponseEntity<>(jwtResponseDTO, HttpStatus.OK);

    }

    @PostMapping("/uploadProfilePhoto/{userId}")
    public ResponseEntity<String> uploadProfilePhoto(@PathVariable Integer userId, @RequestParam("file") MultipartFile file) {
        try {
            // Call Media microservice to upload the file
            String mediaId = uploadToMediaService(file).getFirst();

            if (mediaId != null) {
                // Save mediaId in User entity
                userService.updateProfilePhoto(userId, mediaId);
                return ResponseEntity.ok("Profile photo updated successfully");
            } else {
                return ResponseEntity.status(500).body("Failed to upload profile photo");
            }
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error uploading profile photo");
        }
    }

    private List<String> uploadToMediaService(MultipartFile file) throws IOException {

        // Send POST request to Media microservice

        return webClientBuilder.build()
                .post()
                .uri("http://localhost:9004/api/media/upload") // Update with actual Media microservice URL
                .body(BodyInserters.fromMultipartData(
                        "files", file.getResource())) // Correctly form the multipart request
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<String>>() {})
                .block();
    }

    @GetMapping("/{id}")
    public ResponseEntity<GetResponse> getUserById(@PathVariable Integer id) {

        System.out.println(id);

        GetResponse userDTO = userService.getUserById(id);

        return new ResponseEntity<>(userDTO, HttpStatus.OK);
    }


    @GetMapping("/followings/{userId}")
    public ResponseEntity<List<FollowFollowerResponse>> getFollowings(@PathVariable Integer userId) {
        List<FollowFollowerResponse> followings = userService.getFollowings(userId);
        return ResponseEntity.ok(followings);
    }

    @GetMapping("/followers/{userId}")
    public ResponseEntity<List<FollowFollowerResponse>> getFollowers(@PathVariable Integer userId) {
        List<FollowFollowerResponse> followers = userService.getFollowers(userId);
        return ResponseEntity.ok(followers);
    }

    @GetMapping("/others/{currentUserId}")
    public ResponseEntity<List<FollowFollowerResponse>> getAllUsersExceptCurrentAndFollowings(@PathVariable Integer currentUserId) {
        List<FollowFollowerResponse> users = userService.getAllUsersExceptCurrentAndFollowings(currentUserId);
        return ResponseEntity.ok(users);
    }

}






