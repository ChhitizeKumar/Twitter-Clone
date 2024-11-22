package com.twitter;

//import com.twitter.security.MyUserDetailsService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.reactive.function.client.WebClient;

@SpringBootApplication
public class UserMsApplication {

	@Bean
	public WebClient.Builder webClientBuilder() {
		return WebClient.builder();
	}


	public static void main(String[] args) {
		SpringApplication.run(UserMsApplication.class, args);
	}

}
