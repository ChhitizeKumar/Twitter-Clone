package com.twitter.SearchAndDiscoveryMS.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.twitter.SearchAndDiscoveryMS.entity.SearchEntity;

public interface SearchRepository extends CrudRepository<SearchEntity, Integer>{

	List<SearchEntity> findByNameStartingWith(String name);
		
}
