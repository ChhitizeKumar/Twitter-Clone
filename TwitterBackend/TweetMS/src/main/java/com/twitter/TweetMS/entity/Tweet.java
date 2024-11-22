package com.twitter.TweetMS.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name="tweets")
public class Tweet {

	 @Id
	 @GeneratedValue(strategy = GenerationType.IDENTITY)
	 private Integer tweetId;
       
	 private String content;
	 
	 private Integer userId;
	  
		
	 
	@ElementCollection
	@CollectionTable(name="tweet_media_ids",joinColumns = @JoinColumn(name="tweet_id"))
	@Column(name="media_id")
	private List<String> mediaIds = new ArrayList<>();  
		
	private Integer likes=0;

	public Integer getTweetId() {
		return tweetId;
	}

	public void setTweetId(Integer tweetId) {
		this.tweetId = tweetId;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	public List<String> getMediaIds() {
		return mediaIds;
	}

	public void setMediaIds(List<String> mediaIds) {
		this.mediaIds = mediaIds;
	}

	public Integer getLikes() {
		return likes;
	}

	public void setLikes(Integer likes) {
		this.likes = likes;
	}
}
