package com.turtletongtong.turtleconnect;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class TurtleconnectApplication {
	@Bean
	public Dotenv dotenv() {
		// .env 파일을 읽어서 환경변수로 사용
		return Dotenv.configure().directory("./")
				.ignoreIfMissing() // .env 파일이 없어도 에러 발생 안함
				.load();
	}
	public static void main(String[] args) {
		SpringApplication.run(TurtleconnectApplication.class, args);
	}

}
