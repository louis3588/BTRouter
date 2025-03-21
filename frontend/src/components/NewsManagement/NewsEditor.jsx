import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Toolbar
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Styled Components
const TopBar = styled(Box)({
  width: "100%",
  background: "linear-gradient(135deg, #5f00a7, #9b42c3)",
  color: "#fff",
  padding: "16px",
  textAlign: "center",
  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
});

const PageWrapper = styled(Box)({
  minHeight: "100vh",
  background: "linear-gradient(to bottom right, #f7f3fc, #e0d4f4)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingTop: "80px",
  paddingBottom: "40px",
});

const EditorWrapper = styled(Paper)({
  padding: "32px",
  borderRadius: "16px",
  backgroundColor: "#fff",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  width: "100%",
  maxWidth: "800px",
});

const StyledButton = styled(Button)({
  background: "linear-gradient(135deg, #6a1b9a, #9c27b0)",
  color: "#fff",
  fontWeight: 600,
  padding: "10px 24px",
  borderRadius: "8px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  "&:hover": {
    background: "linear-gradient(135deg, #4a148c, #7b1fa2)",
  },
});

const NewsEditor = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await axios.post("/api/news", {
        title,
        description,
      });
      alert("✅ News post created!");
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Error creating post:", err);
      alert("❌ Failed to create post.");
    }
  };

  return (
    <>
      <TopBar>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h5" fontWeight="bold">
            Admin - News & Updates Editor
          </Typography>
          <StyledButton onClick={() => navigate("/home")}>⬅ Back to Dashboard</StyledButton>
        </Toolbar>
      </TopBar>

      <PageWrapper>
        <Container>
          <EditorWrapper>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              ✍️ Create a News Post
            </Typography>
            <TextField
              fullWidth
              label="Post Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Post Description"
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              margin="normal"
            />
            <Box mt={3} display="flex" justifyContent="flex-end">
              <StyledButton onClick={handleSubmit}>🚀 Publish Post</StyledButton>
            </Box>
          </EditorWrapper>
        </Container>
      </PageWrapper>
    </>
  );
};

export default NewsEditor;