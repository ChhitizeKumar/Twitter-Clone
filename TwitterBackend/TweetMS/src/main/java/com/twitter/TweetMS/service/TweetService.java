package com.twitter.TweetMS.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.twitter.TweetMS.dto.TweetDTO;
import com.twitter.TweetMS.exception.TweetException;

public interface TweetService {
     
	public List<TweetDTO> findTweets(Integer userId) throws TweetException;
	public Integer deleteTweet(Integer tweetId) throws TweetException;
	public Integer addTweet(TweetDTO tweetDTO, List<MultipartFile> mediaFiles)  throws TweetException;
	
	public Integer likeTweet(Integer tweetId) throws TweetException;
	public Integer unlikeTweet(Integer tweetId) throws TweetException;

	List<TweetDTO> getTweetsByUserIds(List<Integer> followings);
}
