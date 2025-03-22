package cf.ac.uk.btrouter.controller;

import cf.ac.uk.btrouter.model.News;
import cf.ac.uk.btrouter.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/news")
@CrossOrigin(origins = "*")
public class NewsController {

    @Autowired
    private NewsService newsService;

    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody Map<String, String> payload) {
        try {
            String title = payload.get("title");
            String description = payload.get("description");
            String author = payload.getOrDefault("author", "Admin");

            News news = newsService.createPost(title, description, author);

            return ResponseEntity.ok(news);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to create news post");
        }
    }

    @GetMapping
    public ResponseEntity<List<News>> getAllPosts() {
        return ResponseEntity.ok(newsService.getAllPosts());
    }
}
