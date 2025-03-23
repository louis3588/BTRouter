import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Toolbar,
  CircularProgress,
  IconButton
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// 🎨 Styled Components
const TopBar = styled(Box)({
  width: "100%",
  background: "linear-gradient(135deg, #6200ea, #9c27b0)",
  color: "#fff",
  padding: "16px",
  textAlign: "center",
  boxShadow: "0px 4px 15px rgba(0,0,0,0.15)",
});

const PageWrapper = styled(Box)({
  minHeight: "100vh",
  background: "linear-gradient(to bottom right, #f3e5f5, #ede7f6)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingTop: "80px",
  paddingBottom: "40px",
});

const EditorWrapper = styled(Paper)({
  padding: "36px",
  borderRadius: "16px",
  backgroundColor: "#fff",
  boxShadow: "0 10px 35px rgba(0,0,0,0.15)",
  width: "100%",
  maxWidth: "800px",
});

const StyledButton = styled(Button)({
  background: "linear-gradient(135deg, #6200ea, #9c27b0)",
  color: "#fff",
  fontWeight: 600,
  padding: "12px 28px",
  borderRadius: "8px",
  boxShadow: "0 5px 12px rgba(0,0,0,0.15)",
  textTransform: "none",
  "&:hover": {
    background: "linear-gradient(135deg, #5a00d3, #8800a7)",
  },
});

// 🎨 Styled TextField with hover effect
const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#ccc",
    },
    "&:hover fieldset": {
      borderColor: "#6200ea",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#6200ea",
    },
  },
});

const NewsEditor = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      alert("⚠️ Title and description cannot be empty.");
      return;
    }
    setLoading(true);
    try {
      await axios.post("/api/news", { title, description });
      alert("✅ News post created successfully!");
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Error creating post:", err);
      alert("❌ Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🔹 Header */}
      <TopBar>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center">
            <IconButton onClick={() => navigate("/home")} sx={{ color: "#fff" }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" fontWeight="bold" sx={{ ml: 1 }}>
              Admin - News & Updates Editor
            </Typography>
          </Box>
          <StyledButton onClick={() => navigate("/home")}>⬅ Back to Dashboard</StyledButton>
        </Toolbar>
      </TopBar>

      {/* 🔹 Page Content */}
      <PageWrapper>
        <Container>
          <EditorWrapper>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              ✍️ Create a News Post
            </Typography>

            {/* 🔹 Title Field with Character Counter */}
            <StyledTextField
              fullWidth
              label="Post Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
              inputProps={{ maxLength: 100 }}
              helperText={`${title.length}/100 characters`}
            />

            {/* 🔹 Description Field with Character Counter */}
            <StyledTextField
              fullWidth
              multiline
              rows={6}
              label="Post Description"
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              margin="normal"
              inputProps={{ maxLength: 1000 }}
              helperText={`${description.length}/1000 characters`}
            />

            {/* 🔹 Submit Button with Loading State */}
            <Box mt={3} display="flex" justifyContent="flex-end">
              <StyledButton onClick={handleSubmit} disabled={loading}>
                {loading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "🚀 Publish Post"}
              </StyledButton>
            </Box>
          </EditorWrapper>
        </Container>
      </PageWrapper>
    </>
  );
};

export default NewsEditor;
