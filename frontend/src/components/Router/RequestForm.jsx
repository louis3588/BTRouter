import React, { useState } from "react";
import {
  TextField, Button, Typography, Box, Container, Snackbar, MenuItem,
  Select, FormControl, InputLabel, CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";

const routerOptions = [
  "Virtual Access - GW1042M",
  "Virtual Access - GW1400M",
  "Virtual Access - GW6650V",
  "Westermo Merlin 4708"
];

const StyledContainer = styled(Box)({
  display: "flex",
  minHeight: "100vh",
  backgroundColor: "#f4f4f9"
});

const Sidebar = styled(Box)({
  width: 280,
  background: "linear-gradient(135deg, #6200aa, #8e24aa)",
  color: "white",
  padding: 24,
  minHeight: "100vh",
  boxShadow: 4,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between"
});

const FormCard = styled(Box)({
  padding: 32,
  background: "white",
  borderRadius: 16,
  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
  transition: "transform 0.2s",
  textAlign: "center",
  "&:hover": {
    transform: "scale(1.02)"
  }
});

const RequestForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    routerType: "",
    numRouters: 1,
    siteName: "",
    siteAddress: "",
    city: "",
    postcode: "",
    email: "",
    phone: "",
    additionalInfo: ""
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    for (const key in formData) {
      if (formData[key] === "" && key !== "additionalInfo") {
        setMessage(`Please fill in the ${key} field.`);
        setIsLoading(false);
        setOpenSnackbar(true);
        return;
      }
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/orders";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Failed to submit order.");
      }

      setMessage("Order submitted successfully!");
      setFormData({
        routerType: "",
        numRouters: 1,
        siteName: "",
        siteAddress: "",
        city: "",
        postcode: "",
        email: "",
        phone: "",
        additionalInfo: ""
      });
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
      setOpenSnackbar(true);
    }
  };

  return (
    <StyledContainer>
      <Sidebar>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 4 }}>
          BT SERVICES
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Manage your router requests efficiently.
        </Typography>
        <Box sx={{ mt: "auto" }}>
          <Button
            variant="outlined"
            fullWidth
            sx={{ color: "white", borderColor: "rgba(255, 255, 255, 0.5)", "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" } }}
            onClick={() => navigate("/home")}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Sidebar>

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        <Box sx={{ width: "100%", backgroundColor: "#6200aa", padding: 3, boxShadow: 3 }}>
          <Typography variant="h5" sx={{ color: "white", textAlign: "center", fontWeight: "bold", letterSpacing: "1px" }}>
            Router Request Form
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", width: "100%", mt: 6 }}>
          <Container maxWidth="sm">
            <FormCard>
              <Typography variant="h4" gutterBottom fontWeight="bold">
                Request a Router
              </Typography>
              <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Router Type</InputLabel>
                  <Select name="routerType" value={formData.routerType} onChange={handleChange} required>
                    {routerOptions.map((router, index) => (
                      <MenuItem key={index} value={router}>{router}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField fullWidth margin="normal" label="Number of Routers" type="number" name="numRouters" value={formData.numRouters} onChange={handleChange} required />
                <TextField fullWidth margin="normal" label="Site Name" name="siteName" value={formData.siteName} onChange={handleChange} required />
                <TextField fullWidth margin="normal" label="Address" name="siteAddress" value={formData.siteAddress} onChange={handleChange} required />
                <TextField fullWidth margin="normal" label="City" name="city" value={formData.city} onChange={handleChange} required />
                <TextField fullWidth margin="normal" label="Postcode" name="postcode" value={formData.postcode} onChange={handleChange} required />
                <TextField fullWidth margin="normal" label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
                <TextField fullWidth margin="normal" label="Phone" name="phone" value={formData.phone} onChange={handleChange} required />
                <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, bgcolor: "#6200aa", "&:hover": { bgcolor: "#8e24aa" } }}>
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
                </Button>
              </form>
            </FormCard>
          </Container>
        </Box>
      </Box>
      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)} message={message} />
    </StyledContainer>
  );
};

export default RequestForm;
