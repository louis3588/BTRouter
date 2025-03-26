FROM maven:3.9.0-eclipse-temurin-17 AS backend-build
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
COPY wait-for-it.sh .
RUN mvn clean package -DskipTests
RUN chmod +x wait-for-it.sh
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=backend-build /app/target/*.jar app.jar
COPY --from=backend-build /app/wait-for-it.sh .
ENTRYPOINT ["./wait-for-it.sh", "mysql-db:3306", "--", "java", "-jar", "app.jar"]