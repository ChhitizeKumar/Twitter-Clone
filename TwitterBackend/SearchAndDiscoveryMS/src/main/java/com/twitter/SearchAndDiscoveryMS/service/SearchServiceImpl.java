package com.twitter.SearchAndDiscoveryMS.service;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.twitter.SearchAndDiscoveryMS.dto.SearchDTO;
import com.twitter.SearchAndDiscoveryMS.dto.UserDTO;
import com.twitter.SearchAndDiscoveryMS.entity.SearchEntity;
import com.twitter.SearchAndDiscoveryMS.exception.SearchException;
import com.twitter.SearchAndDiscoveryMS.repository.SearchRepository;

@Service(value="searchService")
@Transactional
public class SearchServiceImpl implements SearchService{

	@Autowired
	private SearchRepository searchRepository;
	
	@Override
	public Integer addEntry(UserDTO udto) throws SearchException {
		
		SearchEntity s = new SearchEntity();
		s.setName(udto.getFullName());
		s.setUserId(udto.getId());
		s.setUsername(udto.getUserName());
		
		return searchRepository.save(s).getSearchId();
		
	}

	@Override
	public List<SearchDTO> findAllUsers(String name) throws SearchException {
		// TODO Auto-generated method stub
		
		List<SearchEntity> list = searchRepository.findByNameStartingWith(name);
		
		if(list.isEmpty()) {
			throw new SearchException("Search.NOT_FOUND");
		}
		
		ModelMapper mp = new ModelMapper();
		List<SearchDTO> listDTO = new ArrayList<>();
		
		list.forEach(search->{
			SearchDTO sdto = new SearchDTO();
			mp.map(search, sdto);
			listDTO.add(sdto);
		});
		
		return listDTO;
	}
}
