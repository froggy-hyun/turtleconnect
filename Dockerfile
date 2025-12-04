# 1) Build stage
FROM eclipse-temurin:17-jdk AS build

WORKDIR /app

# Copy build scripts
COPY gradlew .
COPY gradle gradle
COPY build.gradle settings.gradle ./

# Download dependencies
RUN chmod +x ./gradlew
RUN ./gradlew dependencies --no-daemon

# Copy source and build
COPY src src
RUN ./gradlew bootJar -x test --no-daemon

# 2) Run stage
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy jar
COPY --from=build /app/build/libs/*.jar app.jar

# 환경은 docker-compose에서 주입 (SPRING_PROFILES_ACTIVE 등)
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]