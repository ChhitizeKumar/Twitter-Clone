//package com.twitter.SearchAndDiscoveryMS;
//
//import java.util.ArrayList;
//import java.util.List;
//
//import org.junit.jupiter.api.Assertions;
//import static org.mockito.ArgumentMatchers.any;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.Mockito;
//import org.springframework.boot.test.context.SpringBootTest;
//
//import com.twitter.SearchAndDiscoveryMS.dto.SearchDTO;
//import com.twitter.SearchAndDiscoveryMS.dto.UserDTO;
//import com.twitter.SearchAndDiscoveryMS.entity.SearchEntity;
//import com.twitter.SearchAndDiscoveryMS.exception.SearchException;
//import com.twitter.SearchAndDiscoveryMS.repository.SearchRepository;
//import com.twitter.SearchAndDiscoveryMS.service.SearchServiceImpl;
//
//@SpringBootTest
//class SearchAndDiscoveryMsApplicationTests {
//
//              @Mock
//              private SearchRepository searchRepository;
//              
//              @InjectMocks
//              private SearchServiceImpl searchService;
//              
//              
//              @Test
//              public void addEntryTest() throws SearchException {
//                  // Arrange: Prepare the UserDTO object with test data
//                  UserDTO udto = new UserDTO();
//                  udto.setFullName("Aman");
//                  udto.setUserId(133);
//                  udto.setProfileImageMediaId("testimg.jpg");
//                  udto.setUsername("Aman@123");
//
//                  // Prepare the SearchEntity object that is expected to be saved
//                  SearchEntity search = new SearchEntity();
//                  search.setSearchId(1); // Mocked ID returned by the repository
//                  search.setName("Aman");
//                  search.setUserId(133);
//                  search.setProfile_photo("testimg.jpg"); // Ensure this matches udto.getProfileImageMediaId()
//                  search.setUsername("Aman@123");
//
//                  // Mock the repository save() method to return the correct SearchEntity
//                  Mockito.when(searchRepository.save(any(SearchEntity.class))).thenReturn(search);
//
//                  // Act: Call the service method
//                  Integer id = searchService.addEntry(udto);
//
//                  // Assert: Verify the result and interactions
//                  System.out.println(search.getSearchId() + " " + id);
//                  Assertions.assertEquals(search.getSearchId(), id); // Ensure that the returned ID matches
//              }
//
//              
//              
//              
//              @Test
//              public void testfindAllUsersFailure() throws SearchException{
//                             
//                             String name="Abcd";
//                             List<SearchEntity> list = new ArrayList<>();
//                             
//              Mockito.when(searchRepository.findByNameStartingWith(name)).thenReturn(list);
//       
//
//                             SearchException e = Assertions.assertThrows(SearchException.class, ()->searchService.findAllUsers(name));
//                  
//                             Assertions.assertEquals("Search.NOT_FOUND", e.getMessage());
//                             
//              }
//              
//              @Test
//              public void findAllUsers() throws SearchException{
//                             
//                             String name = "Guddu";
//                             List<SearchEntity> list = new ArrayList<>();
//                             SearchEntity se = new SearchEntity();
//                             se.setSearchId(10);
//                             se.setName(name);
//                             se.setUsername("Guddu@123");
//                             se.setUserId(131);
//                             se.setProfile_photo("img32.jpg");
//                             list.add(se);
//                             
//                             List<SearchDTO> list2 = new ArrayList<>();
//                             SearchDTO sedto = new SearchDTO();
//                             sedto.setSearchId(10);
//                             sedto.setName(name);
//                             sedto.setUsername("Guddu@123");
//                             sedto.setUserId(131);
//                             sedto.setProfile_photo("img32.jpg");
//                             list2.add(sedto);
//                             
//
//              Mockito.when(searchRepository.findByNameStartingWith(name)).thenReturn(list);
//                             
//                             List<SearchDTO> actual = searchService.findAllUsers(name);
//                             Assertions.assertEquals(list2,list);
//                             
//                             
//
//                             
//              }
//
//}
