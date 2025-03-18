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
  Fade,
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  FormControlLabel,
  Grid
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";

/* TOP BAR */
const TopBar = styled(Box)({
  width: "100%",
  background: "linear-gradient(135deg, #5f00a7, #9b42c3)",
  color: "#fff",
  padding: "16px",
  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
  textAlign: "center",
  position: "relative",
  zIndex: 2
});

/* MAIN CONTAINER */
const StyledContainer = styled(Box)({
  display: "flex",
  minHeight: "100vh",
  background: "linear-gradient(to bottom right, #f7f3fc 0%, #ece6f4 100%)",
  position: "relative",
  overflow: "hidden",
  paddingTop: "80px",
  paddingBottom: "40px"
});

/* DECORATIVE BACKGROUNDS */
const BackgroundDecoration = styled("div")({
  position: "absolute",
  borderRadius: "50%",
  zIndex: 0,
  opacity: 0.2
});

const TopDecoration = styled(BackgroundDecoration)({
  top: "-100px",
  left: "-100px",
  width: "300px",
  height: "300px",
  background: "radial-gradient(circle, #6200aa, transparent)"
});

const BottomDecoration = styled(BackgroundDecoration)({
  bottom: "-100px",
  right: "-100px",
  width: "300px",
  height: "300px",
  background: "radial-gradient(circle, #8e24aa, transparent)"
});

/* FLOW CARD */
const FlowCard = styled(Box)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(4, 4),
  background: "#ffffff",
  borderRadius: "16px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  transition: "transform 0.3s, box-shadow 0.3s",
  zIndex: 2,
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 15px 45px rgba(0,0,0,0.15)"
  }
}));

/* CUSTOM TEXTFIELD */
const StyledTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#6200aa"
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
  padding: "10px 20px",
  "&:hover": {
    background: "linear-gradient(45deg, #5a0099 30%, #7e1e9e 90%)"
  }
});

/* FOOTER */
const Footer = styled(Box)({
  textAlign: "center",
  color: "#888",
  marginTop: "24px"
});

/* STEP TITLES */
const steps = [
  "Customer Type",
  "Router Type",
  "Outside Connection",
  "Inside Connection",
  "Routers & Site Info",
  "Priority & Extras"
];

const RequestForm = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");

  // Form data includes all fields from the document.
  const [formData, setFormData] = useState({
    // Step 1: Customer Type
    customerType: "",
    // Step 2: Router Type (for demo purposes, only two options shown based on customer type Water Utility 1)
    routerType: "",
    // Step 3: Outside Connection Options
    primaryOutsideConnection: "",
    primaryOutsidePorts: "",
    secondaryOutsideConnection: "",
    secondaryOutsidePorts: "",
    // Step 4: Inside Connection Selection
    primaryInsideConnection: "",
    primaryInsidePorts: "",
    vlanConfiguration: "",
    vlanAssignments: "",
    dhcpConfiguration: "",
    // Step 5: Number of Routers
    numRouters: 1,
    // Step 6: Site Information
    siteName: "",
    siteAddress: "",
    sitePostcode: "",
    sitePrimaryEmail: "",
    siteSecondaryEmail: "",
    sitePhone: "",
    siteContactName: "",
    // Step 7: Priority Level
    priorityLevel: "",
    // Step 8: Optional additional router
    addAnotherRouter: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // Navigation handlers
  const handleNext = () => {
    if (!validateStep(activeStep)) return;
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        if (!formData.customerType) {
          setMessage("Please select a customer type.");
          setOpenSnackbar(true);
          return false;
        }
        return true;
      case 1:
        if (!formData.routerType) {
          setMessage("Please select a router type.");
          setOpenSnackbar(true);
          return false;
        }
        return true;
      case 2:
        if (!formData.primaryOutsideConnection || !formData.primaryOutsidePorts) {
          setMessage("Please complete the primary outside connection details.");
          setOpenSnackbar(true);
          return false;
        }
        return true;
      case 3:
        if (!formData.primaryInsideConnection || !formData.primaryInsidePorts || !formData.vlanConfiguration || !formData.dhcpConfiguration) {
          setMessage("Please complete the primary inside connection details.");
          setOpenSnackbar(true);
          return false;
        }
        return true;
      case 4:
        if (!formData.siteName || !formData.siteAddress || !formData.sitePostcode || !formData.sitePrimaryEmail || !formData.sitePhone || !formData.siteContactName) {
          setMessage("Please complete the site information.");
          setOpenSnackbar(true);
          return false;
        }
        return true;
      case 5:
        if (!formData.priorityLevel) {
          setMessage("Please select a priority level.");
          setOpenSnackbar(true);
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    // Get JWT token from localStorage
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // Ensure required fields are filled
    for (const key in formData) {
      if (formData[key] === "" && key !== "configurationDetails") {
        setMessage(`Please fill in the ${key} field.`);
        setIsLoading(false);
        setOpenSnackbar(true);
        return;
      }
    }

    const finalData = {
      ...formData,
      numRouters: formData.numRouters || 1, // ✅ Fix: Ensure it's always sent
    };

    console.log("Submitting Data:", finalData);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit order.");
      }

      const savedOrder = await response.json();

      // Create tracking
      const trackingResponse = await fetch("/api/order-tracking/create", {
        method: "POST",
        headers: headers,  // <-- CHANGE THIS LINE TO USE THE AUTH HEADERS
        body: JSON.stringify({ orderId: savedOrder.id }),
      });

      if (!trackingResponse.ok) {
        throw new Error("Failed to create tracking.");
      }

      const trackingData = await trackingResponse.json();

      setMessage(`Order submitted! Reference number: ${trackingData.referenceNumber}. Please check your email for tracking details.`);
      setFormData({
        customerType: "",
        routerType: "",
        primaryOutsideConnection: "",
        primaryOutsidePorts: "",
        secondaryOutsideConnection: "",
        secondaryOutsidePorts: "",
        primaryInsideConnection: "",
        primaryInsidePorts: "",
        vlanConfiguration: "",
        vlanAssignments: "",
        dhcpConfiguration: "",
        numRouters: 1,
        siteName: "",
        siteAddress: "",
        sitePostcode: "",
        sitePrimaryEmail: "",
        siteSecondaryEmail: "",
        sitePhone: "",
        siteContactName: "",
        priorityLevel: "",
        addAnotherRouter: false
      });
      setActiveStep(0);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
      setOpenSnackbar(true);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
            <Box>
              <Typography variant="h6" gutterBottom>
                Step 1: Customer Type
              </Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel sx={{ backgroundColor: "white", px: 0.5 }}>
                  Customer Type
                </InputLabel>
                <Select
                    name="customerType"
                    value={formData.customerType}
                    onChange={handleChange}
                    required
                >
                  {[
                    "Water Utility 1",
                    "Water Utility 2",
                    "Water Utility 3",
                    "Industrial Signalling",
                    "Cash Machines",
                    "Other (Custom)"
                  ].map((option, index) => (
                      <MenuItem key={index} value={option}>
                        {option}
                      </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
        );
      case 1:
        return (
            <Box>
              <Typography variant="h6" gutterBottom>
                Step 2: Router Type
              </Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel sx={{ backgroundColor: "white", px: 0.5 }}>
                  Router Type
                </InputLabel>
                <Select
                    name="routerType"
                    value={formData.routerType}
                    onChange={handleChange}
                    required
                >
                  {(
                      formData.customerType === "Water Utility 1"
                          ? ["GW1042M", "Westermo Merlin 4708"]
                          : ["GW1042M", "Westermo Merlin 4708"]
                  ).map((option, index) => (
                      <MenuItem key={index} value={option}>
                        {option}
                      </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
        );
      case 2:
        return (
            <Box>
              <Typography variant="h6" gutterBottom>
                Step 3: Outside Connection Options
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel sx={{ backgroundColor: "white", px: 0.5 }}>
                      Primary Outside Connection
                    </InputLabel>
                    <Select
                        name="primaryOutsideConnection"
                        value={formData.primaryOutsideConnection}
                        onChange={handleChange}
                        required
                    >
                      {["Radio", "Customer Ethernet", "FTTP", "VDSL", "Customer Serial"].map((option, index) => (
                          <MenuItem key={index} value={option}>
                            {option}
                          </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledTextField
                      fullWidth
                      margin="normal"
                      label="Ports"
                      type="number"
                      name="primaryOutsidePorts"
                      value={formData.primaryOutsidePorts}
                      onChange={handleChange}
                      required
                  />
                </Grid>
                <Grid item xs={12} sm={8}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel sx={{ backgroundColor: "white", px: 0.5 }}>
                      Secondary Outside Connection (Optional)
                    </InputLabel>
                    <Select
                        name="secondaryOutsideConnection"
                        value={formData.secondaryOutsideConnection}
                        onChange={handleChange}
                    >
                      {["Radio", "Customer Ethernet", "FTTP", "VDSL", "Customer Serial"].map((option, index) => (
                          <MenuItem key={index} value={option}>
                            {option}
                          </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledTextField
                      fullWidth
                      margin="normal"
                      label="Ports"
                      type="number"
                      name="secondaryOutsidePorts"
                      value={formData.secondaryOutsidePorts}
                      onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </Box>
        );
      case 3:
        return (
            <Box>
              <Typography variant="h6" gutterBottom>
                Step 4: Inside Connection Selection
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel sx={{ backgroundColor: "white", px: 0.5 }}>
                      Primary Inside Connection
                    </InputLabel>
                    <Select
                        name="primaryInsideConnection"
                        value={formData.primaryInsideConnection}
                        onChange={handleChange}
                        required
                    >
                      {["Radio", "Customer Ethernet", "FTTP", "VDSL", "Customer Serial"].map((option, index) => (
                          <MenuItem key={index} value={option}>
                            {option}
                          </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledTextField
                      fullWidth
                      margin="normal"
                      label="Ports"
                      type="number"
                      name="primaryInsidePorts"
                      value={formData.primaryInsidePorts}
                      onChange={handleChange}
                      required
                  />
                </Grid>
              </Grid>
              <FormControl fullWidth margin="normal">
                <InputLabel sx={{ backgroundColor: "white", px: 0.5 }}>
                  VLAN Configuration
                </InputLabel>
                <Select
                    name="vlanConfiguration"
                    value={formData.vlanConfiguration}
                    onChange={handleChange}
                    required
                >
                  {["Specified per port", "Open Trunk"].map((option, index) => (
                      <MenuItem key={index} value={option}>
                        {option}
                      </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <StyledTextField
                  fullWidth
                  margin="normal"
                  label="VLAN Assignments"
                  name="vlanAssignments"
                  value={formData.vlanAssignments}
                  onChange={handleChange}
                  helperText="Example: Port 1: VLAN 100, Port 2: VLAN 101"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel sx={{ backgroundColor: "white", px: 0.5 }}>
                  DHCP Configuration
                </InputLabel>
                <Select
                    name="dhcpConfiguration"
                    value={formData.dhcpConfiguration.toString()} // ✅ Convert Boolean to String for UI
                    onChange={handleChange}
                    required
                >
                  <MenuItem value="true">Yes</MenuItem>
                  <MenuItem value="false">No</MenuItem>
                </Select>
              </FormControl>
            </Box>
        );
      case 4:
        return (
            <Box>
              <Typography variant="h6" gutterBottom>
                Step 5: Routers & Site Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <StyledTextField
                      fullWidth
                      margin="normal"
                      label="Number of Routers"
                      type="number"
                      name="numRouters"
                      value={formData.numRouters}
                      onChange={handleChange}
                      required
                  />
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                Site Information
              </Typography>
              <StyledTextField
                  fullWidth
                  margin="normal"
                  label="Site Name"
                  name="siteName"
                  value={formData.siteName}
                  onChange={handleChange}
                  required
              />
              <StyledTextField
                  fullWidth
                  margin="normal"
                  label="Site Address"
                  name="siteAddress"
                  value={formData.siteAddress}
                  onChange={handleChange}
                  required
              />
              <StyledTextField
                  fullWidth
                  margin="normal"
                  label="Site Postcode"
                  name="sitePostcode"
                  value={formData.sitePostcode}
                  onChange={handleChange}
                  required
              />
              <StyledTextField
                  fullWidth
                  margin="normal"
                  label="Site Primary Email"
                  type="email"
                  name="sitePrimaryEmail"
                  value={formData.sitePrimaryEmail}
                  onChange={handleChange}
                  required
              />
              <StyledTextField
                  fullWidth
                  margin="normal"
                  label="Site Secondary Email"
                  type="email"
                  name="siteSecondaryEmail"
                  value={formData.siteSecondaryEmail}
                  onChange={handleChange}
              />
              <StyledTextField
                  fullWidth
                  margin="normal"
                  label="Site Phone Number"
                  name="sitePhone"
                  value={formData.sitePhone}
                  onChange={handleChange}
                  required
              />
              <StyledTextField
                  fullWidth
                  margin="normal"
                  label="Site Contact Name"
                  name="siteContactName"
                  value={formData.siteContactName}
                  onChange={handleChange}
                  required
              />
            </Box>
        );
      case 5:
        return (
            <Box>
              <Typography variant="h6" gutterBottom>
                Step 6: Priority Level & Extras
              </Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel sx={{ backgroundColor: "white", px: 0.5 }}>
                  Priority Level
                </InputLabel>
                <Select
                    name="priorityLevel"
                    value={formData.priorityLevel}
                    onChange={handleChange}
                    required
                >
                  {["Critical", "Urgent", "High", "Medium", "Low"].map((option, index) => (
                      <MenuItem key={index} value={option}>
                        {option}
                      </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControlLabel
                  control={
                    <Checkbox
                        name="addAnotherRouter"
                        checked={formData.addAnotherRouter}
                        onChange={handleChange}
                    />
                  }
                  label="Add another router?"
                  sx={{ mt: 2 }}
              />
            </Box>
        );
      default:
        return <Typography>Unknown Step</Typography>;
    }
  };

  return (
      <>
        <TopBar>
          <Typography variant="h5" fontWeight="bold">
            BT IoT Router Services - Router Request Form
          </Typography>
        </TopBar>

        <StyledContainer>
          <TopDecoration />
          <BottomDecoration />

          <Container maxWidth="md" sx={{ zIndex: 2 }}>
            <Fade in={true} timeout={600}>
              <FlowCard>
                <Box sx={{ mb: 3, textAlign: "center" }}>
                  <Typography variant="h4" fontWeight="bold">
                    Request a Router
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Complete the form steps below to submit your router request.
                  </Typography>
                </Box>

                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                  {steps.map((label, index) => (
                      <Step key={index}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                  ))}
                </Stepper>

                <form>
                  {getStepContent(activeStep)}

                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                    {activeStep > 0 && (
                        <GradientButton onClick={handleBack} variant="contained">
                          Back
                        </GradientButton>
                    )}
                    {activeStep < steps.length - 1 ? (
                        <GradientButton onClick={handleNext} variant="contained">
                          Next
                        </GradientButton>
                    ) : (
                        <GradientButton
                            onClick={handleSubmit}
                            variant="contained"
                            disabled={isLoading}
                            startIcon={isLoading ? <CircularProgress size={20} /> : null}
                        >
                          {isLoading ? "Submitting..." : "Submit"}
                        </GradientButton>
                    )}
                  </Box>
                  <Box sx={{ mt: 2, textAlign: "center" }}>
                    <Button onClick={() => navigate("/home")} variant="text">
                      Return to Dashboard
                    </Button>
                  </Box>
                </form>
              </FlowCard>
            </Fade>
            <Footer>
              <Typography variant="caption">
                © 2025 BT IoT Router Services. All rights reserved.
              </Typography>
            </Footer>
          </Container>
        </StyledContainer>

        <Snackbar
            open={openSnackbar}
            autoHideDuration={4000}
            onClose={() => setOpenSnackbar(false)}
            message={message}
        />
      </>
  );
};

export default RequestForm;
