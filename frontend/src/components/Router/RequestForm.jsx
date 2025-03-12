import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  Snackbar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Divider,
  InputAdornment,
  Fade
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";

// ICONS
import RouterIcon from "@mui/icons-material/Router";
import SettingsInputAntennaIcon from "@mui/icons-material/SettingsInputAntenna";

// Router and Connection Options (Unchanged)
const routerOptions = [
  "Virtual Access - GW1042M",
  "Virtual Access - GW1400M",
  "Virtual Access - GW6650V",
  "Westermo Merlin 4708"
];

const outsideConnectionOptions = [
  "Mobile Radio – Roaming SIM",
  "Mobile Radio – UK SIM",
  "SOGEA – Private Broadband",
  "FTTP – Private Broadband",
  "FTTP – Internet",
  "VSAT Satellite – Internet",
  "ADSL – Private Broadband",
  "ADSL – Internet"
];

/* 
  OPTIONAL TOP BAR 
*/
const TopBar = styled(Box)({
  width: "100%",
  background: "linear-gradient(135deg, #5f00a7, #9b42c3)",
  color: "#fff",
  padding: "16px",
  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  zIndex: 2
});

/* MAIN CONTAINER */
const StyledContainer = styled(Box)({
  display: "flex",
  minHeight: "100vh",
  background: "linear-gradient(to bottom right, #f7f3fc 0%, #ece6f4 100%)",
  position: "relative",
  overflow: "hidden"
});

/* DECORATIVE RADIAL BACKGROUNDS */
const BackgroundDecorationTop = styled("div")({
  position: "absolute",
  top: "-80px",
  left: "-80px",
  width: "300px",
  height: "300px",
  borderRadius: "50%",
  background:
    "radial-gradient(circle at center, rgba(98,0,170,0.25), transparent 70%)",
  zIndex: 0
});

const BackgroundDecorationBottom = styled("div")({
  position: "absolute",
  bottom: "-80px",
  right: "-80px",
  width: "300px",
  height: "300px",
  borderRadius: "50%",
  background:
    "radial-gradient(circle at center, rgba(142,36,170,0.25), transparent 70%)",
  zIndex: 0
});

/* SIDEBAR */
const Sidebar = styled(Box)({
  width: 280,
  background: "linear-gradient(135deg, #6200aa, #8e24aa)",
  color: "white",
  padding: 24,
  minHeight: "100vh",
  boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  zIndex: 1
});

/* ENHANCED FLOW CARD */
const FlowCard = styled(Box)(({ theme }) => ({
  position: "relative",
  padding: "40px 50px",
  background: "#ffffff",
  borderRadius: "24px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  transition: "transform 0.3s, box-shadow 0.3s",
  textAlign: "left",
  border: "1px solid #e0e0e0",
  zIndex: 2,
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 15px 45px rgba(0,0,0,0.15)"
  }
}));

/* CARD HEADER FOR A PROFESSIONAL TOUCH */
const CardHeader = styled(Box)({
  marginBottom: "20px",
  paddingBottom: "10px",
  borderBottom: "1px solid #ececec",
  textAlign: "center"
});

/* CUSTOM TEXTFIELD WITH ACCENT COLORS */
const StyledTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#6200aa"
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#6200aa"
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#ccc"
    },
    "&:hover fieldset": {
      borderColor: "#6200aa"
    },
    "&.Mui-focused fieldset": {
      borderColor: "#6200aa"
    }
  }
});

/* GRADIENT BUTTON */
const GradientButton = styled(Button)({
  background: "linear-gradient(45deg, #6200aa 30%, #8e24aa 90%)",
  color: "#fff",
  fontWeight: "bold",
  "&:hover": {
    background: "linear-gradient(45deg, #5a0099 30%, #7e1e9e 90%)"
  }
});

/* OPTIONAL FOOTER */
const Footer = styled(Box)({
  textAlign: "center",
  color: "#888",
  marginTop: 24
});

const RequestForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    routerType: "",
    outsideConnection: "",
    numRouters: 1,
    siteName: "",
    siteAddress: "",
    city: "",
    postcode: "",
    email: "",
    phone: "",
    configurationDetails: ""
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

    // Validation (excluding configurationDetails)
    for (const key in formData) {
      if (formData[key] === "" && key !== "configurationDetails") {
        setMessage(`Please fill in the ${key} field.`);
        setIsLoading(false);
        setOpenSnackbar(true);
        return;
      }
    }

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/orders";
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
        outsideConnection: "",
        numRouters: 1,
        siteName: "",
        siteAddress: "",
        city: "",
        postcode: "",
        email: "",
        phone: "",
        configurationDetails: ""
      });
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
      setOpenSnackbar(true);
    }
  };

  return (
    <>
      {/* TOP BAR */}
      <TopBar>
        <Typography variant="h6" fontWeight="bold">
          BT Router Services
        </Typography>
      </TopBar>

      <StyledContainer>
        {/* DECORATIVE RADIAL BACKGROUNDS */}
        <BackgroundDecorationTop />
        <BackgroundDecorationBottom />

        {/* SIDEBAR */}
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
        </Sidebar>

        {/* MAIN CONTENT AREA */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            py: 4,
            zIndex: 1
          }}
        >
          <Container maxWidth="sm">
            {/* FADE-IN ANIMATION FOR THE CARD */}
            <Fade in={true} timeout={600}>
              <FlowCard>
                <CardHeader>
                  <Typography variant="h4" fontWeight="bold">
                    Request a Router
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Please fill in all the required details below.
                  </Typography>
                </CardHeader>
                <Divider sx={{ mb: 3 }} />

                <form onSubmit={handleSubmit}>
                  {/* ROUTER TYPE SELECT */}
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Router Type</InputLabel>
                    <Select
                      name="routerType"
                      value={formData.routerType}
                      onChange={handleChange}
                      required
                      startAdornment={
                        <InputAdornment position="start">
                          <RouterIcon />
                        </InputAdornment>
                      }
                    >
                      {routerOptions.map((router, index) => (
                        <MenuItem key={index} value={router}>
                          {router}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* OUTSIDE CONNECTION SELECT */}
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Outside Connection</InputLabel>
                    <Select
                      name="outsideConnection"
                      value={formData.outsideConnection}
                      onChange={handleChange}
                      required
                      startAdornment={
                        <InputAdornment position="start">
                          <SettingsInputAntennaIcon />
                        </InputAdornment>
                      }
                    >
                      {outsideConnectionOptions.map((conn, index) => (
                        <MenuItem key={index} value={conn}>
                          {conn}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* NUMBER OF ROUTERS */}
                  <StyledTextField
                    fullWidth
                    margin="normal"
                    label="Number of Routers"
                    type="number"
                    name="numRouters"
                    value={formData.numRouters}
                    onChange={handleChange}
                    required
                    helperText="Specify how many routers you need."
                  />

                  {/* SITE NAME */}
                  <StyledTextField
                    fullWidth
                    margin="normal"
                    label="Site Name"
                    name="siteName"
                    value={formData.siteName}
                    onChange={handleChange}
                    required
                    helperText="Enter the name of the site or location."
                  />

                  {/* ADDRESS */}
                  <StyledTextField
                    fullWidth
                    margin="normal"
                    label="Address"
                    name="siteAddress"
                    value={formData.siteAddress}
                    onChange={handleChange}
                    required
                    helperText="Street address or building details."
                  />

                  {/* CITY */}
                  <StyledTextField
                    fullWidth
                    margin="normal"
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />

                  {/* POSTCODE */}
                  <StyledTextField
                    fullWidth
                    margin="normal"
                    label="Postcode"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleChange}
                    required
                  />

                  {/* EMAIL */}
                  <StyledTextField
                    fullWidth
                    margin="normal"
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    helperText="We'll send your confirmation here."
                  />

                  {/* PHONE */}
                  <StyledTextField
                    fullWidth
                    margin="normal"
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    helperText="A valid phone number for contact."
                  />

               

                  {/* SUBMIT BUTTON */}
                  <GradientButton
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 3 }}
                    startIcon={
                      isLoading ? <CircularProgress size={20} /> : null
                    }
                    disabled={isLoading}
                  >
                    {isLoading ? "Submitting..." : "Submit"}
                  </GradientButton>
                </form>
              </FlowCard>
            </Fade>

            {/* SNACKBAR FOR MESSAGES */}
            <Snackbar
              open={openSnackbar}
              autoHideDuration={4000}
              onClose={() => setOpenSnackbar(false)}
              message={message}
            />

       
            <Footer>
              <Typography variant="caption">
                © 2025 BT IoT Router Services. All rights reserved.
              </Typography>
            </Footer>
          </Container>
        </Box>
      </StyledContainer>
    </>
  );
};

export default RequestForm;
