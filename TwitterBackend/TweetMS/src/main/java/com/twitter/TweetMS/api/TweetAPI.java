package com.twitter.TweetMS.api;

import com.twitter.TweetMS.dto.CombinedTweetDTO;
import com.twitter.TweetMS.dto.UserDTO;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.twitter.TweetMS.dto.TweetDTO;
import com.twitter.TweetMS.exception.TweetException;
import com.twitter.TweetMS.service.TweetService;

import org.springframework.web.reactive.function.client.WebClient;

@RestController
@RequestMapping(value="/api/tweet")
@Validated
@CrossOrigin
public class TweetAPI {
	
	@Autowired
	private TweetService tweetService;

	@Autowired
	Environment environment;

	@Autowired
	WebClient webClientBuilder;
	
	@PostMapping("/")
    public ResponseEntity<String> addTweet(
            @RequestPart("tweetDTO") String tweetDTOJson,
            @RequestPart("mediaFiles") List<MultipartFile> mediaFiles) throws TweetException {
        
        // Convert JSON string to TweetDTO
        ObjectMapper mapper = new ObjectMapper();
        TweetDTO tweetDTO = new TweetDTO();
		try {
			tweetDTO = mapper.readValue(tweetDTOJson, TweetDTO.class);
		} catch (JsonMappingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JsonProcessingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

        // Call service to save tweet
        Integer tweetId = tweetService.addTweet(tweetDTO, mediaFiles);

        return new ResponseEntity<>("Tweet added successfully: " + tweetId, HttpStatus.CREATED);
    }
	
	@PostMapping("/testing")
	public ResponseEntity<String> addTweet(TweetDTO tdto) throws TweetException {
	
//		Integer tweetId = tweetService.addTweet(tweetDTO,mediaFiles);
//		String message = environment.getProperty("Tweet.ADD_SUCCESS") +": "+tweetId;
		return new ResponseEntity<>("testing", HttpStatus.CREATED);
		
	}
//	
	
	@GetMapping("/{userid}")
	public ResponseEntity<List<TweetDTO>> getAllTweet(@PathVariable Integer userid) throws TweetException{
		List<TweetDTO> tweets = tweetService.findTweets(userid);
		
		return new ResponseEntity<>(tweets,HttpStatus.OK);
	}
	
	@DeleteMapping("/{tweetid}")
	public ResponseEntity<String> deleteTweet(@PathVariable Integer tweetid) throws TweetException{
		
		tweetService.deleteTweet(tweetid);
		String message = environment.getProperty("Tweet.DELETE_SUCCESS");
		return new ResponseEntity<>(message, HttpStatus.OK);
	}
	
	@PutMapping("/like/{tweetid}")
	public ResponseEntity<Integer> likeTweet(@PathVariable Integer tweetid) throws TweetException
	{
		Integer likes = tweetService.likeTweet(tweetid);
		
		return new ResponseEntity<>(likes, HttpStatus.OK);
	}
	
	@PutMapping("/unlike/{tweetid}")
	public ResponseEntity<Integer> unlikeTweet(@PathVariable Integer tweetid) throws TweetException
	{
		Integer likes = tweetService.unlikeTweet(tweetid);
		
		return new ResponseEntity<>(likes, HttpStatus.OK);
	}

	@GetMapping("/userTweets/{userId}")
	public ResponseEntity<List<CombinedTweetDTO>> getUserAndFollowingsTweets(@PathVariable Integer userId) {
		// Step 1: Get the list of followings from Follower microservice
		List<Integer> followings;
		try {
			followings = webClientBuilder
					.get()
					.uri("http://localhost:9005/api/followings/" + userId)
					.retrieve()
					.bodyToMono(new ParameterizedTypeReference<List<Integer>>() {})
					.block();
		} catch (Exception e) {
			System.out.println("Error fetching followings from Follower microservice" + e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
//		System.out.println(followings);

		if (followings == null) {
			followings = new ArrayList<>();
			System.out.println("Exc");
		}

		// Include the user itself in the list of IDs
		followings.add(userId);

		System.out.println(followings);

		// Step 2: Get tweets for all user IDs
		List<TweetDTO> tweets;
		try {
			tweets = tweetService.getTweetsByUserIds(followings);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}

		List<CombinedTweetDTO> combinedTweets = tweets.stream()
				.map(tweet -> {
					// Fetch user details for each tweet
					UserDTO userResponse;
					try {
						userResponse = webClientBuilder.get()
								.uri("http://localhost:9001/api/user/" + tweet.getUserId())
								.retrieve()
								.bodyToMono(UserDTO.class)
								.block();
					} catch (Exception e) {
						// Log and handle error for fetching user details
						return null; // Or handle as per your need
					}

					if (userResponse == null) {
						return null; // Handle as per your need
					}

					CombinedTweetDTO combinedTweet = new CombinedTweetDTO();
					combinedTweet.setTweetId(tweet.getTweetId());
					combinedTweet.setUserId(tweet.getUserId());
					combinedTweet.setContent(tweet.getContent());
					combinedTweet.setLikes(tweet.getLikes());
					combinedTweet.setMediaIds(tweet.getMediaIds());
					combinedTweet.setUserName(userResponse.getUserName());
					combinedTweet.setFullName(userResponse.getFullName());
					combinedTweet.setImgUrl(userResponse.getImgUrl());

					return combinedTweet;
				})
				.filter(Objects::nonNull)
				.collect(Collectors.toList());

		return ResponseEntity.ok(combinedTweets);
	}

}
