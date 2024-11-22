package com.twitter.SearchAndDiscoveryMS.api;


import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;



import com.twitter.SearchAndDiscoveryMS.dto.SearchDTO;
import com.twitter.SearchAndDiscoveryMS.dto.UserDTO;
import com.twitter.SearchAndDiscoveryMS.exception.SearchException;
import com.twitter.SearchAndDiscoveryMS.service.SearchService;


import jakarta.validation.Valid;

@RestController
@RequestMapping(value="/api/search")
@Validated
@CrossOrigin
public class SearchAPI {
	
	@Autowired
	private SearchService searchService;

	@Autowired
	Environment environment;
	
	@PostMapping("/")
	public ResponseEntity<String> addUserInSearch(@RequestBody @Valid UserDTO userDTO) throws SearchException {
	
		Integer searchId = searchService.addEntry(userDTO);
		String message = environment.getProperty("Search.ADDED") +": "+searchId;
		return new ResponseEntity<>(message, HttpStatus.CREATED);
	}
	
	
	@GetMapping("/{userName}")
	public ResponseEntity<List<SearchDTO>> findUsers(@PathVariable String userName) throws SearchException{
		
		List<SearchDTO> sdto = searchService.findAllUsers(userName);
		
		return new ResponseEntity<List<SearchDTO>>(sdto,HttpStatus.OK);
	}
	
	
	
}
