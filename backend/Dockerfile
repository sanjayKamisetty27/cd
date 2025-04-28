# Use an OpenJDK image as the base
FROM openjdk:17-jdk

# Set the working directory
WORKDIR /app

# Copy the built JAR file (Update `your-app.jar` with actual JAR name)
COPY target/project-0.0.1-SNAPSHOT.jar /app/app.jar


# Expose the port Spring Boot runs on
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
