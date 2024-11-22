package com.twitter.repository;

import com.twitter.entity.User;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface UserRepository extends CrudRepository<User, Integer> {
    Optional<User> findByEmail(String email);

//    Optional<User> findByIdEquals(Integer id);
}
