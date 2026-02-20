# Step 1: Use an official Java runtime as a parent image
FROM eclipse-temurin:17-jdk-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the executable jar file from your target folder
# (Note: You need to run 'mvn clean package' first to generate this)
COPY target/*.jar app.jar

# Step 4: Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]