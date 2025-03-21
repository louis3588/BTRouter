package cf.ac.uk.btrouter.service;

import cf.ac.uk.btrouter.model.News;
import cf.ac.uk.btrouter.repository.NewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class NewsService {

    @Autowired
    private NewsRepository newsRepository;

    public News createPost(String title, String description, String author) {
        News news = News.builder()
                .title(title)
                .description(description)
                .author(author)
                .createdAt(LocalDateTime.now())
                .build();
        return newsRepository.save(news);
    }

    public List<News> getAllPosts() {
        return newsRepository.findAll();
    }
}
