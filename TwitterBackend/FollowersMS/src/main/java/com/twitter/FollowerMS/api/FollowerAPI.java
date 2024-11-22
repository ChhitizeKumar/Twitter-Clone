package com.twitter.FollowerMS.api;

import com.twitter.FollowerMS.exception.FollowerException;
import com.twitter.FollowerMS.service.FollowerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api")
@CrossOrigin
public class FollowerAPI {

    @Autowired
    Environment environment;

    @Autowired
    FollowerService followerService;

    @PostMapping(value = "/follow")
        public ResponseEntity<String> followUser(@RequestParam Integer followerId, @RequestParam Integer followingId) throws FollowerException {
        followerService.followUser(followerId, followingId);

        String successRes = environment.getProperty("FollowerAPI.USER_FOLLOWED_SUCCESS") + ":" + followingId;

        return new ResponseEntity<>(successRes, HttpStatus.CREATED);
    }

    @DeleteMapping(value = "/unfollow")
    public ResponseEntity<String> unFollowUser(@RequestParam Integer followerId, @RequestParam Integer followingId) throws FollowerException {
        followerService.unFollowUser(followerId, followingId);

        String successRes = environment.getProperty("FollowerAPI.USER_FOLLOWED_SUCCESS") + ":" + followingId;

        return new ResponseEntity<>(successRes, HttpStatus.OK);
    }

    @GetMapping("/followings/{userId}")
    public ResponseEntity<List<Integer>> getFollowings(@PathVariable Integer userId) throws FollowerException {
        List<Integer> followings = followerService.getAllFollowings(userId);

        return new ResponseEntity<>(followings, HttpStatus.OK);
    }

    @GetMapping("/followers/{userId}")
    public ResponseEntity<List<Integer>> getFollowers(@PathVariable Integer userId) throws FollowerException {
        List<Integer> followings = followerService.getAllFollowers(userId);

        return new ResponseEntity<>(followings, HttpStatus.OK);
    }


    @GetMapping("/follow/already-follows")
    public ResponseEntity<Boolean> userAlreadyFollws(@RequestParam Integer followerId, @RequestParam Integer followingId)
    {
        Boolean result = followerService.checkFollowerExists(followerId, followingId);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
