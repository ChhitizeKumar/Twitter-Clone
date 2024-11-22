package com.twitter.TweetMS.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;


import com.twitter.TweetMS.dto.TweetDTO;
import com.twitter.TweetMS.entity.Tweet;
import com.twitter.TweetMS.exception.TweetException;
import com.twitter.TweetMS.repository.TweetRepository;
import com.twitter.TweetMS.utility.MultipartInputStreamFileResource;

@Service(value="tweetService")
@Transactional
public class TweetServiceImpl implements TweetService{

	@Autowired
	private TweetRepository tweetRepository;
	
	@Autowired
	private WebClient webClient;



	
	@Override
	public List<TweetDTO> findTweets(Integer userId) throws TweetException {
		
		List<Tweet> all =  (List<Tweet>)tweetRepository.findAll();
		
		System.out.println(all);
		
		List<Tweet> tweets = tweetRepository.findByUserId(userId);
		
		
		System.out.println(tweets);
		
		if(tweets.isEmpty()) {
			throw new TweetException("Tweet.NOT_FOUND");
		}
		
		List<TweetDTO> tweetDTO = new ArrayList<>();
		ModelMapper mp = new ModelMapper();
		
		tweets.forEach(tweet->{
			TweetDTO tdto = new TweetDTO();
			 tdto.setContent(tweet.getContent());
			 tdto.setLikes(tweet.getLikes());
			 tdto.setMediaIds(tweet.getMediaIds());
			 tdto.setTweetId(tweet.getTweetId());
			 tdto.setUserId(tweet.getUserId());
			 tweetDTO.add(tdto);
		});
		
		return tweetDTO;
	}

	@Override
	public Integer deleteTweet(Integer tweetId) throws TweetException {
		
		Optional<Tweet> op = tweetRepository.findById(tweetId);
		
		if(op.isEmpty()) {
			throw new TweetException("Tweet.NOT_FOUND");
		}
		
		tweetRepository.deleteById(tweetId);
		
		return tweetId;
	}
	
	@Override
	public Integer addTweet(TweetDTO tweetDTO, List<MultipartFile> mediaFiles) throws TweetException{
		
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        for (MultipartFile file : mediaFiles) {
            try {
				body.add("files", new MultipartInputStreamFileResource(file.getInputStream(), file.getOriginalFilename()));
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
        }

        
        List<String> mediaId1 = webClient
                .post()
                .uri("http://localhost:9004/api/media/upload")  // Use the manually configured MediaMS URL
                .body(BodyInserters.fromMultipartData(body))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<String>>() {})
                .block();  // Blocking for simplicity, consider using async calls for better performance

        System.out.println(mediaId1);

//        List<Integer> mediaIds = List.of(1,2,3);
		
		Tweet tweet = new Tweet();
//		ModelMapper mp = new ModelMapper();
//		mp.map(tweetDTO, tweet);
		
		tweet.setContent(tweetDTO.getContent());
		tweet.setLikes(tweetDTO.getLikes());
		tweet.setMediaIds(mediaId1);
		tweet.setUserId(tweetDTO.getUserId());
		
		Tweet t = tweetRepository.save(tweet);
		
		System.out.print(t.getMediaIds());
         
		return t.getTweetId();
		
	}

	@Override
	public Integer likeTweet(Integer tweetId) throws TweetException {
		
		Optional<Tweet> op = tweetRepository.findById(tweetId);
		
		if(op.isEmpty()) {
			throw new TweetException("Tweet.NOT_FOUND");
		}
		
		Tweet tweet = op.get();
		Integer likes = tweet.getLikes();

		tweet.setLikes(likes+1);

		return tweet.getLikes();
	}

	@Override
	public Integer unlikeTweet(Integer tweetId) throws TweetException {
		Optional<Tweet> op = tweetRepository.findById(tweetId);
		
		if(op.isEmpty()) {
			throw new TweetException("Tweet.NOT_FOUND");
		}
		
		Tweet tweet = op.get();
		Integer likes = tweet.getLikes();
		
		tweet.setLikes(likes-1);
		
		return tweet.getLikes();
		
	}

	@Override
	public List<TweetDTO> getTweetsByUserIds(List<Integer> userIds) {
		List<Tweet> tweets = tweetRepository.findByUserIdIn(userIds);
		// Convert the list of Tweet entities to TweetDTOs
		return tweets.stream()
				.map(this::convertToDTO)
				.collect(Collectors.toList());
	}

	private TweetDTO convertToDTO(Tweet tweet) {
		TweetDTO dto = new TweetDTO();
		dto.setTweetId(tweet.getTweetId());
		dto.setUserId(tweet.getUserId());
		dto.setContent(tweet.getContent());
		dto.setLikes(tweet.getLikes());
		dto.setMediaIds(tweet.getMediaIds());
		return dto;
	}

}
