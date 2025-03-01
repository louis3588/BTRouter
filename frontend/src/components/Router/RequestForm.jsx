import React, { useState } from "react";
import { TextField, Button, Typography, Box, Container, Snackbar, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MainContainer, ScrollableContainer } from "../../styles/homeStyles";

const routerOptions = [
  "Virtual Access - GW1042M",
  "Virtual Access - GW1400M",
  "Virtual Access - GW6650V",
  "Westermo Merlin 4708"
];

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
    <MainContainer sx={{ display: "flex", backgroundColor: "#f4f4f9", minHeight: "100vh" }}>
      
      {/* Sidebar */}
      <Box
        sx={{
          width: 280,
          background: "linear-gradient(135deg, #6200aa, #8e24aa)",
          color: "white",
          padding: 3,
          minHeight: "100vh",
          boxShadow: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
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
            sx={{
              color: "white",
              borderColor: "rgba(255, 255, 255, 0.5)",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" }
            }}
            onClick={() => navigate("/home")}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        
        {/* Header */}
        <Box sx={{ width: "100%", backgroundColor: "#6200aa", padding: 3, boxShadow: 3 }}>
          <Typography
            variant="h5"
            sx={{
              color: "white",
              textAlign: "center",
              fontWeight: "bold",
              letterSpacing: "1px"
            }}
          >
            Router Request Form
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", width: "100%", mt: 6 }}>
          
          {/* Form Section */}
          <ScrollableContainer sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "40%" }}>
            <Container maxWidth="sm">
              <Box
                sx={{
                  padding: 4,
                  background: "white",
                  borderRadius: 4,
                  boxShadow: 4,
                  textAlign: "center",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.02)" }
                }}
              >
                
                {/* Welcome Message INSIDE the Form */}
                <Box sx={{ textAlign: "center", mb: 3 }}>
                  <Typography variant="h5" fontWeight="bold" color="#6200aa">
                    Welcome to Router Requests
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Fill out the form to request a router. Ensure that all required fields are completed.
                  </Typography>
                </Box>

                <Typography variant="h4" gutterBottom textAlign="center" fontWeight="bold">
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
                    {isLoading ? "Submitting..." : "Submit"}
                  </Button>
                </form>
              </Box>
            </Container>
          </ScrollableContainer>
        </Box>

        <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)} message={message} />
      </Box>
    </MainContainer>
  );
};

export default RequestForm;
