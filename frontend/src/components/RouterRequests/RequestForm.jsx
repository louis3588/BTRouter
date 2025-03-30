import React, { useEffect, useState } from "react";
import {
  TextField, Button, Typography, Box, Container, Snackbar, MenuItem, Select,
  FormControl, InputLabel, CircularProgress, Divider, Fade, Stepper, Step,
  StepLabel, Checkbox, FormControlLabel, Grid, Toolbar
} from "@mui/material";
import { useNavigate } from "react-router";
import { styled } from "@mui/system";
import {
  StyledSwitch,
} from "../../styles/PageStyles";

import Sidebar from "../Navigation/Sidebar";
import useAuth from "../Auth/useAuth";

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
const MainContainer = styled(Box)({
  display: 'flex',
  minHeight: '100vh',
  background: "linear-gradient(to bottom right, #f7f3fc 0%, #ece6f4 100%)",
  position: "relative",
  overflow: "hidden"
});

const ContentContainer = styled(Box)({
  flexGrow: 1,
  height: '100vh',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column'
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
  const { activeTab, setActiveTab } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [routerPresets, setRouterPresets] = useState([]);
  const [filteredPresets, setFilteredPresets] = useState([]);
  const [routers, setRouters] = useState([]);

  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    customerID: "",
    routerType: "",
    routerPresetID: "",
    primaryOutsideConnection: "",
    primaryOutsidePorts: "",
    secondaryOutsideConnection: "",
    secondaryOutsidePorts: "",
    insideConnections: [],
    ethernetPorts: "",
    serialPorts: "",
    vlans: "",
    dhcp: false,
    numRouters: 1,
    siteName: "",
    siteAddress: "",
    sitePostcode: "",
    sitePrimaryEmail: "",
    siteSecondaryEmail: "",
    sitePhone: "",
    siteContactName: "",
    priorityLevel: "",
    addAnotherRouter: false,
    additionalInformation: ""
  });

  useEffect(() => {
    fetch("http://localhost:8080/api/customers")
        .then(res => res.json())
        .then(setCustomers)
        .catch(console.error);
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/routers")
        .then((res) => res.json())
        .then(setRouters)
        .catch(console.error);
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/router-presets")
        .then(res => res.json())
        .then(setRouterPresets)
        .catch(console.error);
  }, []);

  useEffect(() => {
    const customerPresets = routerPresets.filter(p => p.customer?.customerID === formData.customerID);
    setFilteredPresets(customerPresets);
  }, [formData.customerID, routerPresets]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "routerPresetID") {
      const preset = routerPresets.find(p => p.routerPresetID === Number(value));
      if (preset) {
        const hasEthernet = preset.insideConnections?.includes("ETHERNET");
        const hasSerial = preset.insideConnections?.includes("SERIAL");

        setFormData(prev => ({
          ...prev,
          routerPresetID: preset.routerPresetID,
          routerType: preset.router?.routerName || "",
          primaryOutsideConnection: preset.primaryOutsideConnections || "",
          secondaryOutsideConnection: preset.secondaryOutsideConnections || "",
          insideConnections: preset.insideConnections?.split(", ") || [],
          ethernetPorts: hasEthernet ? preset.numberOfEthernetPorts || "" : "",
          serialPorts: hasSerial ? preset.numberOfSerialPorts || "" : "",
          vlans: preset.vlans || "",
          dhcp: !!preset.dhcp,
          additionalInformation: preset.additionalInformation || ""
        }));
      }
      return; // Exit early so we don't overwrite anything below
    }

    if (name === "routerType") {
      setFormData(prev => ({
        ...prev,
        routerType: value,
        routerPresetID: "" // Clear preset when router type is manually selected
      }));
      return;
    }

    // Default case for all other fields
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleInsideConnectionToggle = (type, checked) => {
    setFormData(prev => {
      const updated = checked
          ? [...prev.insideConnections, type]
          : prev.insideConnections.filter(c => c !== type);

      return {
        ...prev,
        insideConnections: updated,
        vlans: updated.includes("ETHERNET") ? prev.vlans : "",
        dhcp: updated.includes("ETHERNET") && prev.vlans === "OPEN_TRUNK" ? prev.dhcp : false
      };
    });
  };

  const formatEnumLabel = (value) =>
      value.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers,
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Failed to submit order.");
      const saved = await res.json();

      const trackingRes = await fetch("/api/order-tracking/create", {
        method: "POST",
        headers,
        body: JSON.stringify({ orderId: saved.id })
      });

      if (!trackingRes.ok) throw new Error("Failed to create tracking.");
      const tracking = await trackingRes.json();

      setMessage(`Order submitted! Reference: ${tracking.referenceNumber}`);
      setFormData({
        customerID: "", routerType: "", routerPresetID: "", primaryOutsideConnection: "",
        primaryOutsidePorts: "", secondaryOutsideConnection: "", secondaryOutsidePorts: "",
        insideConnections: [], ethernetPorts: "", serialPorts: "", vlans: "", dhcp: false,
        numRouters: 1, siteName: "", siteAddress: "", sitePostcode: "", sitePrimaryEmail: "",
        siteSecondaryEmail: "", sitePhone: "", siteContactName: "", priorityLevel: "",
        addAnotherRouter: false, additionalInformation: ""
      });
      setActiveStep(0);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setIsLoading(false);
      setOpenSnackbar(true);
    }
  };

  const steps = [
    "Customer",
    "Router",
    "Outside Connection",
    "Inside Connection",
    "Routers & Site Info",
    "Priority & Extras"
  ];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
            <FormControl fullWidth margin="normal">
              <InputLabel>Customer</InputLabel>
              <Select name="customerID" value={formData.customerID} onChange={handleChange} required>
                <MenuItem value="" disabled>Select a customer...</MenuItem>
                {customers.sort((a, b) => a.customerName.localeCompare(b.customerName)).map(c => (
                    <MenuItem key={c.customerID} value={c.customerID}>{c.customerName}</MenuItem>
                ))}
              </Select>
            </FormControl>
        );
      case 1:
        return (
            <>
              <FormControl fullWidth margin="normal">
                <InputLabel>Router Preset</InputLabel>
                <Select
                    name="routerPresetID"
                    value={formData.routerPresetID}
                    onChange={(e) =>
                        handleChange({ target: { name: "routerPresetID", value: e.target.value } })
                    }
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {filteredPresets.sort((a, b) =>
                      a.routerPresetName.localeCompare(b.routerPresetName)
                  ).map(preset => (
                      <MenuItem key={preset.routerPresetID} value={preset.routerPresetID}>
                        {preset.routerPresetName}
                      </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Router Type</InputLabel>
                <Select
                    name="routerType"
                    value={formData.routerType}
                    onChange={handleChange}
                    required
                >
                  <MenuItem value="" disabled>Select a router...</MenuItem>
                  {[...routers]
                      .sort((a, b) => a.routerName.localeCompare(b.routerName))
                      .map((router) => (
                          <MenuItem key={router.routerID} value={router.routerName}>
                            {router.routerName}
                          </MenuItem>
                      ))}
                </Select>
              </FormControl>
            </>
        );
      case 2:
        return (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={8}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Primary Outside Connection</InputLabel>
                  <Select
                      name="primaryOutsideConnection"
                      value={formData.primaryOutsideConnection}
                      onChange={handleChange}
                      required
                  >
                    {["Radio", "Customer Ethernet", "FTTP", "VDSL", "Customer Serial"].map((opt, i) => (
                        <MenuItem key={i} value={opt}>{opt}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <StyledTextField
                    fullWidth
                    margin="normal"
                    label="Ports"
                    name="primaryOutsidePorts"
                    type="number"
                    value={formData.primaryOutsidePorts}
                    onChange={handleChange}
                    required
                />
              </Grid>
            </Grid>
        );
      case 3:
        return (
            <Box>
              <FormControlLabel
                  control={
                    <StyledSwitch
                        checked={formData.insideConnections.includes("ETHERNET")}
                        onChange={(e) => handleInsideConnectionToggle("ETHERNET", e.target.checked)}
                    />
                  }
                  label="Ethernet"
              />
              {formData.insideConnections.includes("ETHERNET") && (
                  <StyledTextField
                      fullWidth
                      margin="normal"
                      label="Ethernet Ports"
                      name="ethernetPorts"
                      type="number"
                      value={formData.ethernetPorts}
                      onChange={handleChange}
                      required
                  />
              )}
              <FormControlLabel
                  control={
                    <StyledSwitch
                        checked={formData.insideConnections.includes("SERIAL")}
                        onChange={(e) => handleInsideConnectionToggle("SERIAL", e.target.checked)}
                    />
                  }
                  label="Serial"
              />
              {formData.insideConnections.includes("SERIAL") && (
                  <StyledTextField
                      fullWidth
                      margin="normal"
                      label="Serial Ports"
                      name="serialPorts"
                      type="number"
                      value={formData.serialPorts}
                      onChange={handleChange}
                      required
                  />
              )}
              {formData.insideConnections.includes("ETHERNET") && (
                  <FormControl fullWidth margin="normal">
                    <InputLabel>VLANs</InputLabel>
                    <Select name="vlans" value={formData.vlans} onChange={handleChange} required>
                      <MenuItem value="" disabled><em>Required</em></MenuItem>
                      {["UNSPECIFIED", "SPECIFIED", "OPEN_TRUNK"].map(opt => (
                          <MenuItem key={opt} value={opt}>{formatEnumLabel(opt)}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
              )}
              <FormControlLabel
                  control={
                    <StyledSwitch
                        checked={formData.dhcp}
                        onChange={(e) => setFormData(prev => ({ ...prev, dhcp: e.target.checked }))}
                        disabled={formData.vlans !== "OPEN_TRUNK"}
                    />
                  }
                  label="DHCP"
              />
            </Box>
        );
      case 4:
        return (
            <>
              <StyledTextField fullWidth label="Site Name" name="siteName" value={formData.siteName} onChange={handleChange} required />
              <StyledTextField fullWidth label="Address" name="siteAddress" value={formData.siteAddress} onChange={handleChange} required />
              <StyledTextField fullWidth label="Postcode" name="sitePostcode" value={formData.sitePostcode} onChange={handleChange} required />
              <StyledTextField fullWidth label="Primary Email" name="sitePrimaryEmail" value={formData.sitePrimaryEmail} onChange={handleChange} required />
              <StyledTextField fullWidth label="Phone" name="sitePhone" value={formData.sitePhone} onChange={handleChange} required />
              <StyledTextField fullWidth label="Contact Name" name="siteContactName" value={formData.siteContactName} onChange={handleChange} required />
              <StyledTextField fullWidth label="Secondary Email" name="siteSecondaryEmail" value={formData.siteSecondaryEmail} onChange={handleChange} />
            </>
        );
      case 5:
        return (
            <>
              <FormControl fullWidth margin="normal">
                <InputLabel>Priority Level</InputLabel>
                <Select name="priorityLevel" value={formData.priorityLevel} onChange={handleChange} required>
                  {["Critical", "Urgent", "High", "Medium", "Low"].map((opt, i) => (
                      <MenuItem key={i} value={opt}>{opt}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <StyledTextField
                  fullWidth
                  margin="normal"
                  label="Additional Information"
                  name="additionalInformation"
                  value={formData.additionalInformation}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  inputProps={{ maxLength: 500 }}
                  helperText={`${formData.additionalInformation.length}/500 characters`}
              />
              <FormControlLabel
                  control={
                    <Checkbox
                        name="addAnotherRouter"
                        checked={formData.addAnotherRouter}
                        onChange={handleChange}
                    />
                  }
                  label="Add another router?"
              />
            </>
        );
      default:
        return <Typography>Unknown Step</Typography>;
    }
  };

  return (
      <MainContainer>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <ContentContainer>
          <TopBar>
            <Toolbar>
              <Typography variant="h5" fontWeight="bold">BT IoT Router Services - Router Request Form</Typography>
            </Toolbar>
          </TopBar>
          <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3 }}>
            <Container maxWidth="md" sx={{ zIndex: 2 }}>
              <Fade in timeout={600}>
                <FlowCard>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>Request a Router</Typography>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Complete the form steps below to submit your router request.
                  </Typography>
                  <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                    {steps.map((label, idx) => <Step key={idx}><StepLabel>{label}</StepLabel></Step>)}
                  </Stepper>
                  <form onSubmit={handleSubmit}>
                    {getStepContent(activeStep)}
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                      {activeStep > 0 && (
                          <GradientButton onClick={() => setActiveStep(prev => prev - 1)}>Back</GradientButton>
                      )}
                      {activeStep < steps.length - 1 ? (
                          <GradientButton onClick={() => handleNext()}>Next</GradientButton>
                      ) : (
                          <GradientButton type="submit" disabled={isLoading}>
                            {isLoading ? <CircularProgress size={20} /> : "Submit"}
                          </GradientButton>
                      )}
                    </Box>
                  </form>
                </FlowCard>
              </Fade>
              <Footer>
                <Typography variant="caption">© 2025 BT IoT Router Services. All rights reserved.</Typography>
              </Footer>
            </Container>
          </Box>
        </ContentContainer>
        <Snackbar
            open={openSnackbar}
            autoHideDuration={4000}
            onClose={() => setOpenSnackbar(false)}
            message={message}
        />
      </MainContainer>
  );
};

export default RequestForm;