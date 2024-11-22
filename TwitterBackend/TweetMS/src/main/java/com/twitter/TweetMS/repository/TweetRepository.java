package com.twitter.TweetMS.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.twitter.TweetMS.entity.Tweet;

public interface TweetRepository extends CrudRepository<Tweet, Integer>{

	 List<Tweet> findByUserId(Integer userId);

	List<Tweet> findByUserIdIn(List<Integer> userIds);
  
	
}
