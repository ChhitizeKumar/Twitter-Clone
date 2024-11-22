package com.twitter.TweetMS.dto;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.Size;

public class TweetDTO {
	
	private Integer tweetId;
	
	private Integer userId;
	
	@Size(min=1,max=280, message= "{Tweet.SIZE_EXCEPTION}")
	private String content;
	
	private Integer likes=0;
	
	private List<String> mediaIds = new ArrayList<>();

	public List<String> getMediaIds() {
		return mediaIds;
	}

	public void setMediaIds(List<String> mediaIds) {
		this.mediaIds = mediaIds;
	}

	public Integer getTweetId() {
		return tweetId;
	}

	public void setTweetId(Integer tweetId) {
		this.tweetId = tweetId;
	}

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}



	public Integer getLikes() {
		return likes;
	}

	public void setLikes(Integer likes) {
		this.likes = likes;
	}
	

}
