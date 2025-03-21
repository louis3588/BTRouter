import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Badge,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  InputAdornment,
  CircularProgress,
  Button,
  Paper,
  Fade,
  Container
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TopBar = styled(Box)({
  width: '100%',
  background: 'linear-gradient(135deg, #5f00a7, #9b42c3)',
  color: '#fff',
  padding: '16px',
  textAlign: 'center',
  boxShadow: '0px 4px 10px rgba(0,0,0,0.1)'
});

const StyledContainer = styled(Box)({
  display: 'flex',
  minHeight: '100vh',
  background: 'linear-gradient(to bottom right, #f7f3fc 0%, #ece6f4 100%)',
  paddingTop: '60px',
  paddingBottom: '20px',
  justifyContent: 'center'
});

const FlowCard = styled(Box)({
  background: '#ffffff',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: '900px'
});

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadIds, setUnreadIds] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/news')
      .then((res) => {
        setNews(res.data);
        const read = JSON.parse(localStorage.getItem('readNews') || '[]');
        const unread = res.data.filter((n) => !read.includes(n.id)).map((n) => n.id);
        setUnreadIds(new Set(unread));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const markAsRead = (id) => {
    const updated = new Set(unreadIds);
    updated.delete(id);
    setUnreadIds(updated);
    const read = JSON.parse(localStorage.getItem('readNews') || '[]');
    if (!read.includes(id)) {
      read.push(id);
      localStorage.setItem('readNews', JSON.stringify(read));
    }
  };

  const markAllAsRead = () => {
    const read = [...new Set([...JSON.parse(localStorage.getItem('readNews') || '[]'), ...news.map(n => n.id)])];
    localStorage.setItem('readNews', JSON.stringify(read));
    setUnreadIds(new Set());
  };

  const filteredNews = news.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <TopBar>
        <Typography variant="h5" fontWeight="bold">
          BT IoT Router Services - News & Updates
        </Typography>
      </TopBar>

      <StyledContainer>
        <Container maxWidth="md">
          <Fade in timeout={600}>
            <FlowCard>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    Latest News
                  </Typography>
                  <IconButton>
                    <Badge badgeContent={unreadIds.size} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                </Box>
                <Button
                  variant="outlined"
                  onClick={markAllAsRead}
                  disabled={unreadIds.size === 0}
                  sx={{ borderRadius: 3 }}
                >
                  Mark all as read
                </Button>
              </Box>

              <TextField
                fullWidth
                placeholder="Search news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  )
                }}
                sx={{ mb: 3, borderRadius: 2 }}
              />

              {loading ? (
                <Box mt={4} textAlign="center">
                  <CircularProgress color="primary" />
                </Box>
              ) : (
                <Paper elevation={0} sx={{ mt: 1 }}>
                  <List>
                    {filteredNews.length === 0 ? (
                      <ListItem>
                        <ListItemText primary="No news found." />
                      </ListItem>
                    ) : (
                      filteredNews.map((post) => (
                        <React.Fragment key={post.id}>
                          <ListItem
                            onClick={() => markAsRead(post.id)}
                            sx={{
                              cursor: 'pointer',
                              transition: 'background-color 0.2s',
                              backgroundColor: unreadIds.has(post.id) ? '#f3f0ff' : 'transparent',
                              '&:hover': { backgroundColor: '#f1f1f1' },
                              borderRadius: 2,
                              my: 1,
                              px: 2
                            }}
                          >
                            <ListItemText
                              primary={
                                <Typography variant="h6" fontWeight={unreadIds.has(post.id) ? 'bold' : 'medium'}>
                                  {post.title}
                                </Typography>
                              }
                              secondary={`${post.description.slice(0, 120)}...`}
                            />
                            {unreadIds.has(post.id) && (
                              <Badge color="primary" variant="dot" sx={{ ml: 2 }} />
                            )}
                          </ListItem>
                          <Divider />
                        </React.Fragment>
                      ))
                    )}
                  </List>
                </Paper>
              )}
              <Box mt={4} textAlign="center">
                <Button onClick={() => navigate('/home')} variant="text">
                  ⬅ Back to Dashboard
                </Button>
              </Box>
            </FlowCard>
          </Fade>
        </Container>
      </StyledContainer>
    </>
  );
};

export default NewsPage;