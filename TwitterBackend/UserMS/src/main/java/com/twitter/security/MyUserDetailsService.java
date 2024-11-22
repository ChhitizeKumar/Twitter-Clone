//package com.twitter.security;
//
//import com.twitter.entity.User;
//import com.twitter.repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//
//import java.util.ArrayList;
//import java.util.Optional;
//
//@Service
//public class MyUserDetailsService implements UserDetailsService {
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//        Optional<User> user = userRepository.findByEmail(username);
//        if (user.isEmpty()) {
//            throw new UsernameNotFoundException("User not found with username: " + username);
//        }
//
//        User user1 = user.get();
//        return new org.springframework.security.core.userdetails.User(user1.getEmail(), user1.getPassword(), new ArrayList<>());
//    }
//}
