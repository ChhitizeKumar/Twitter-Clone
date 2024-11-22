package com.twitter.MediaMS.utility;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import com.twitter.MediaMS.exception.MediaException;




@Component
@Aspect
public class LoggingAspect {

	private static final Logger LOGGER = LogManager.getLogger(LoggingAspect.class);

	@AfterThrowing(pointcut="execution(* com.infy.service.*Impl.*(..))", throwing="exception")
	public void logServiceException(MediaException exception) {
		LOGGER.error(exception.getMessage());
	}

}