package com.twitter.MediaMS.repository;

import com.twitter.MediaMS.collection.Media;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MediaRepository extends MongoRepository<Media, ObjectId> {
//    void deleteById(String id);
//
//    Optional<Media> findById(String id);
    // Custom query methods (if needed)
}

