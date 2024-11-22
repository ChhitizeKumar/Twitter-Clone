 package com.twitter.SearchAndDiscoveryMS.service;

import java.util.List;

import com.twitter.SearchAndDiscoveryMS.dto.SearchDTO;
import com.twitter.SearchAndDiscoveryMS.dto.UserDTO;
import com.twitter.SearchAndDiscoveryMS.exception.SearchException;

public interface SearchService {
	
	
	 Integer addEntry(UserDTO udto) throws SearchException;
	 
	 List<SearchDTO> findAllUsers(String name) throws SearchException;
	 
}
