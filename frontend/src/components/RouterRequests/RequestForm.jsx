import React, { useEffect, useState } from "react";
import {
  Button, Typography, Box, Container, Snackbar, MenuItem,
  InputLabel, CircularProgress, Fade, Stepper, Step,
  StepLabel, Checkbox, FormControlLabel, Tooltip, InputAdornment,
} from "@mui/material";
import {
  StyledButtonGroup,
  StyledSelect,
  StyledSlider,
  StyledSwitch,
  StyledFormControl,
  StyledTextField,
  CardContainer,
  MainContainer,
  TopDecoration,
  BottomDecoration,
  Footer
} from "../../styles/PageStyles";
import Sidebar from "../Navigation/Sidebar";
import useAuth from "../Auth/useAuth";

/* STEP TITLES */
const steps = [
  "Customer",
  "Router Model",
  "Outside Connection",
  "Inside Connection",
  "Contact Details",
  "Additional Information"
];

const RequestForm = () => {
  const { activeTab, setActiveTab } = useAuth();

  // Customer-related
  const [customers, setCustomers] = useState([]);
  const [isAddingNewCustomer, setIsAddingNewCustomer] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");

  // Router-related
  const [routers, setRouters] = useState([]);
  const [usePresetMode, setUsePresetMode] = useState(true);
  const [routerPresets, setRouterPresets] = useState([]);
  const [filteredPresets, setFilteredPresets] = useState([]);

  // Form-related
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);

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
    sitePhoneNumber: "",
    siteContactName: "",
    priorityLevel: "Low",
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

  const getSelectedRouter = () => {
    return routers.find(
        (r) =>
            r.routerName === formData.routerType ||
            r.routerID === routerPresets.find((p) => p.routerPresetID === Number(formData.routerPresetID))?.router?.routerID
    );
  };

  const getMaxPorts = () => {
    const selected = getSelectedRouter();
    return {
      maxEthernet: selected?.ethernetPorts ?? 0,
      maxSerial: selected?.serialPorts ?? 0
    };
  };


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
      return;
    }

    if (name === "routerType") {
      setFormData(prev => ({
        ...prev,
        routerType: value,
        routerPresetID: ""
      }));
      return;
    }

    const { maxEthernet, maxSerial } = getMaxPorts();
    if (name === "ethernetPorts" && Number(value) > maxEthernet) return;
    if (name === "serialPorts" && Number(value) > maxSerial) return;

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

  const getValidationErrors = () => {
    const errors = [];

    switch(activeStep) {
      case 0:
        if (!formData.customerID && !isAddingNewCustomer) errors.push("Customer selection is required.");
        if (isAddingNewCustomer && !newCustomerName.trim()) errors.push("New customer name is required.");
        break;

      case 1:
        if (usePresetMode && !formData.routerPresetID) errors.push("Router preset is required.");
        if (!usePresetMode && !formData.routerType) errors.push("Router model is required.");
        break;

      case 2:
        if (!formData.primaryOutsideConnection) errors.push("Primary outside connection is required.");
        break;

      case 3:
        if (formData.insideConnections.length === 0) errors.push("At least one inside connection type must be selected.");
        const { maxEthernet} = getMaxPorts();

        if (formData.insideConnections.includes("ETHERNET")) {
          if (!formData.ethernetPorts) errors.push("Ethernet ports required.");
          if (formData.ethernetPorts > maxEthernet) errors.push(`Ethernet ports cannot exceed ${maxEthernet}.`);
        }

        if (formData.insideConnections.includes("SERIAL") && !formData.serialPorts) {
          errors.push("Serial ports required");
        }
        break;

      case 4:
        if (!formData.siteName.trim()) errors.push("Site name is required.");
        if (!formData.siteAddress.trim()) errors.push("Address is required.");
        if (!formData.sitePostcode.trim()) errors.push("Postcode is required.");

        if (!formData.sitePrimaryEmail.trim()) {
          errors.push("Primary email is required.");
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formData.sitePrimaryEmail)) {
            errors.push("Primary email must be a valid email address.");
          }
        }

        if (!formData.sitePhoneNumber.trim()) errors.push("Phone number is required.");
        if (!formData.siteContactName.trim()) errors.push("Contact name is required.");
        break;


      case 5:
        if (!formData.priorityLevel) errors.push("Priority level is required.");
        if (formData.additionalInformation.length > 500) errors.push("Additional information must be less than 500 characters.");
        break;

      default:
        break;
    }

    return errors;
  };

  const handleNext = () => {
    const errors = getValidationErrors();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors([]);
    setActiveStep((prev) => prev + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = getValidationErrors();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

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

      if (!res.ok) {
        setMessage("Failed to submit order.");
        setOpenSnackbar(true);
        setIsLoading(false);
        return;
      }

      const saved = await res.json();

      const trackingRes = await fetch("/api/order-tracking/create", {
        method: "POST",
        headers,
        body: JSON.stringify({ orderId: saved.id })
      });

      if (!trackingRes.ok) {
        setMessage("Failed to create tracking.");
        setOpenSnackbar(true);
        setIsLoading(false);
        return;
      }

      const tracking = await trackingRes.json();

      setMessage(`Order submitted! Reference: ${tracking.referenceNumber}`);
      setFormData({
        customerID: "", routerType: "", routerPresetID: "", primaryOutsideConnection: "",
        primaryOutsidePorts: "", secondaryOutsideConnection: "", secondaryOutsidePorts: "",
        insideConnections: [], ethernetPorts: "", serialPorts: "", vlans: "", dhcp: false,
        numRouters: 1, siteName: "", siteAddress: "", sitePostcode: "", sitePrimaryEmail: "",
        siteSecondaryEmail: "", sitePhoneNumber: "", siteContactName: "", priorityLevel: "",
        addAnotherRouter: false, additionalInformation: ""
      });
      setActiveStep(0);
    } catch (err) {
      setMessage("An unexpected error occurred.");
    } finally {
      setOpenSnackbar(true);
      setIsLoading(false);
    }
  };

  const getStepContent = (step) => {
    const selectedRouterForInside = routers.find(
        r => r.routerName === formData.routerType ||
            r.routerID === routerPresets.find((p) => p.routerPresetID === Number(formData.routerPresetID))?.router?.routerID
    );

    const { maxEthernet, maxSerial } = getMaxPorts();

    switch (step) {
      case 0:
        return (
            <>
              <Tooltip title="Select an existing customer or create a new one" arrow>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <StyledButtonGroup variant="contained" disableElevation>
                    <Button
                        onClick={() => setIsAddingNewCustomer(false)}
                        variant={!isAddingNewCustomer ? "contained" : "text"}
                    >
                      Existing Customer
                    </Button>
                    <Button
                        onClick={() => setIsAddingNewCustomer(true)}
                        variant={isAddingNewCustomer ? "contained" : "text"}
                    >
                      New Customer
                    </Button>
                  </StyledButtonGroup>
                </Box>
              </Tooltip>

              {isAddingNewCustomer ? (
                  <StyledFormControl fullWidth>
                    <StyledTextField
                        fullWidth
                        label="New Customer"
                        value={newCustomerName}
                        onChange={(e) => setNewCustomerName(e.target.value)}
                        autoFocus
                        error={validationErrors.some(e => e.includes("New customer name"))}
                    />
                  </StyledFormControl>
              ) : (
                  <StyledFormControl fullWidth>
                    <InputLabel sx={{ backgroundColor: "white", px: 0.5 }}>
                      Customer
                    </InputLabel>
                    <StyledSelect
                        value={formData.customerID || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, customerID: e.target.value }))}
                        fullWidth
                        displayEmpty
                        error={validationErrors.some(e => e.includes("Customer selection"))}
                    >
                      <MenuItem value="" disabled>
                        <em>Required</em>
                      </MenuItem>
                      {customers.map((c) => (
                          <MenuItem key={c.customerID} value={c.customerID}>
                            {c.customerName}
                          </MenuItem>
                      ))}
                    </StyledSelect>
                  </StyledFormControl>
              )}

              {validationErrors.length > 0 && (
                  <Box sx={{ mt: 2, mb: 2 }}>
                    {validationErrors.map((error, idx) => (
                        <Typography key={idx} color="error" variant="body2" sx={{ mb: 0.5 }}>
                          • {error}
                        </Typography>
                    ))}
                  </Box>
              )}
            </>
        );

      case 1:
        return (
            <>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <StyledButtonGroup variant="contained" disableElevation>
                  <Button
                      onClick={() => setUsePresetMode(true)}
                      variant={usePresetMode ? "contained" : "text"}
                  >
                    Preset Configuration
                  </Button>
                  <Button
                      onClick={() => setUsePresetMode(false)}
                      variant={!usePresetMode ? "contained" : "text"}
                  >
                    New Configuration
                  </Button>
                </StyledButtonGroup>
              </Box>

              {usePresetMode ? (
                  <StyledFormControl fullWidth sx={{ mb: 0 }}>
                    <InputLabel sx={{ backgroundColor: "white", px: 0.5 }}>
                      Router Preset
                    </InputLabel>
                    <StyledSelect
                        value={formData.routerPresetID || ""}
                        onChange={(e) => handleChange({ target: { name: "routerPresetID", value: e.target.value } })}
                        fullWidth
                        displayEmpty
                        error={validationErrors.some(e => e.includes("Router preset"))}
                    >
                      <MenuItem value="" disabled>
                        <em>Required</em>
                      </MenuItem>
                      {filteredPresets.map((preset) => (
                          <MenuItem key={preset.routerPresetID} value={preset.routerPresetID}>
                            {preset.routerPresetName}
                          </MenuItem>
                      ))}
                    </StyledSelect>
                  </StyledFormControl>
              ) : (
                  <StyledFormControl fullWidth sx={{ mb: 0 }}>
                    <InputLabel sx={{ backgroundColor: "white", px: 0.5 }}>
                      Router Model
                    </InputLabel>
                    <StyledSelect
                        value={formData.routerType || ""}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          routerType: e.target.value,
                          routerPresetID: ""
                        }))}
                        fullWidth
                        displayEmpty
                        error={validationErrors.some(e => e.includes("Router type"))}
                    >
                      <MenuItem value="" disabled>
                        <em>Required</em>
                      </MenuItem>
                      {routers.map((router) => (
                          <MenuItem key={router.routerID} value={router.routerName}>
                            {router.routerName}
                          </MenuItem>
                      ))}
                    </StyledSelect>
                  </StyledFormControl>
              )}

              {validationErrors.length > 0 && (
                  <Box sx={{ mt: 2, mb: 2 }}>
                    {validationErrors.map((error, idx) => (
                        <Typography key={idx} color="error" variant="body2" sx={{ mb: 0.5 }}>
                          • {error}
                        </Typography>
                    ))}
                  </Box>
              )}
            </>
        );

      case 2:
        const selectedRouter = routers.find(
            r => r.routerName === formData.routerType ||
                r.routerID === routerPresets.find((p) => p.routerPresetID === Number(formData.routerPresetID))?.router?.routerID
        );

        const availableOutsideConnections = selectedRouter?.outsideConnectionTypes
            ? selectedRouter.outsideConnectionTypes.split(",").map((t) => t.trim())
            : [];

        return (
            <Box sx={{ width: "100%", maxWidth: 600, mx: "auto" }}>
              <StyledFormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel sx={{ backgroundColor: "white", px: 0.5 }}>
                  Primary Outside Connection
                </InputLabel>
                <StyledSelect
                    value={formData.primaryOutsideConnection || ""}
                    onChange={(e) => setFormData((prev) => ({
                      ...prev,
                      primaryOutsideConnection: e.target.value,
                      secondaryOutsideConnection:
                          e.target.value === prev.secondaryOutsideConnection ? "" : prev.secondaryOutsideConnection
                    }))}
                    fullWidth
                    displayEmpty
                    error={validationErrors.some(e => e.includes("Primary outside"))}
                >
                  <MenuItem value="" disabled>
                    <em>Required</em>
                  </MenuItem>
                  {availableOutsideConnections.map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                  ))}
                </StyledSelect>
              </StyledFormControl>

              <StyledFormControl fullWidth>
                <InputLabel sx={{ backgroundColor: "white", px: 0.5 }}>
                  Secondary Outside Connection (Optional)
                </InputLabel>
                <StyledSelect
                    value={formData.secondaryOutsideConnection || ""}
                    onChange={(e) => setFormData((prev) => ({
                      ...prev,
                      secondaryOutsideConnection: e.target.value
                    }))}
                    fullWidth
                    displayEmpty
                >
                  <MenuItem value="">
                    <em>Optional</em>
                  </MenuItem>
                  {availableOutsideConnections
                      .filter((opt) => opt !== formData.primaryOutsideConnection)
                      .map((opt) => (
                          <MenuItem key={opt} value={opt}>
                            {opt}
                          </MenuItem>
                      ))}
                </StyledSelect>
              </StyledFormControl>

              {validationErrors.length > 0 && (
                  <Box sx={{ mt: 2, mb: 2 }}>
                    {validationErrors.map((error, idx) => (
                        <Typography key={idx} color="error" variant="body2" sx={{ mb: 0.5 }}>
                          • {error}
                        </Typography>
                    ))}
                  </Box>
              )}
            </Box>
        );

      case 3:
        return (
            <>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Tooltip
                    title={
                      !selectedRouterForInside?.insideConnectionTypes?.includes("SERIAL")
                          ? <span><strong>Disabled</strong>: Ethernet is not a valid option for this router model.</span>
                          : <span>Select <strong>Ethernet</strong> as the inside connection.</span>
                    }
                    arrow
                >
                  <FormControlLabel
                      control={
                        <StyledSwitch
                            checked={formData.insideConnections.includes("ETHERNET")}
                            onChange={(e) => handleInsideConnectionToggle("ETHERNET", e.target.checked)}
                            disabled={!selectedRouterForInside?.insideConnectionTypes?.includes("ETHERNET")}
                        />
                      }
                      label="Ethernet"
                      sx={{ mb: -1 }}
                  />
                </Tooltip>

                {formData.insideConnections.includes("ETHERNET") && (
                    <Tooltip title="Number cannot exceed the maximum port configuration" arrow>
                      <StyledTextField
                          fullWidth
                          type="number"
                          label="Ethernet Ports"
                          name="ethernetPorts"
                          value={formData.ethernetPorts}
                          onChange={handleChange}
                          error={validationErrors.some(e => e.includes("Ethernet ports"))}
                          InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                          <span style={{ fontSize: "0.85em", color: "#888", whiteSpace: "nowrap" }}>
                            Maximum Ports: {maxEthernet}
                          </span>
                                </InputAdornment>
                            )
                          }}
                          disabled={!selectedRouterForInside || maxEthernet === 0}
                      />
                    </Tooltip>
                )}

                <Tooltip
                    title={
                      !selectedRouterForInside?.insideConnectionTypes?.includes("SERIAL")
                          ? <span><strong>Disabled</strong>: Serial is not a valid option for this router model.</span>
                          : <span>Select <strong>Serial</strong> as the inside connection.</span>
                    }
                    arrow
                >
                  <FormControlLabel
                      control={
                        <StyledSwitch
                            checked={formData.insideConnections.includes("SERIAL")}
                            onChange={(e) => handleInsideConnectionToggle("SERIAL", e.target.checked)}
                            disabled={!selectedRouterForInside?.insideConnectionTypes?.includes("SERIAL")}
                        />
                      }
                      label="Serial"
                      sx={{ mb: -1 }}
                  />
                </Tooltip>

                {formData.insideConnections.includes("SERIAL") && (
                    <Tooltip title="Number cannot exceed the maximum port configuration" arrow>
                      <StyledTextField
                          fullWidth
                          type="number"
                          label="Serial Ports"
                          name="serialPorts"
                          value={formData.serialPorts}
                          onChange={handleChange}
                          error={validationErrors.some(e => e.includes("Serial ports"))}
                          InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                          <span style={{ fontSize: "0.85em", color: "#888", whiteSpace: "nowrap" }}>
                            Maximum Ports: {maxSerial}
                          </span>
                                </InputAdornment>
                            )
                          }}
                          disabled={!selectedRouterForInside || maxSerial === 0}
                      />
                    </Tooltip>
                )}

                <Tooltip title={
                  <span>If <strong>Ethernet</strong> is selected, please select a VLANs configuration.
                    <hr /><strong>Unspecified</strong> (Default): No further action.
                    <br /><strong>Specified</strong>: Specify in additional information.
                    <br /><strong>Open Trunk</strong>: Choose to enable or disable DHCP.
                </span>
                } arrow enterDelay={250} leaveDelay={100}>
                  <StyledFormControl fullWidth sx={{ mb: -1 }}>
                    <InputLabel sx={{ backgroundColor: "white", px: 1 }}>
                      VLANs
                    </InputLabel>
                    <StyledSelect
                        name="vlans"
                        value={formData.vlans}
                        onChange={handleChange}
                        disabled={!formData.insideConnections.includes("ETHERNET")}
                        fullWidth
                        displayEmpty
                        error={validationErrors.some(e => e.includes("VLAN configuration"))}
                    >
                      <MenuItem value="" disabled>
                        <em>Required</em>
                      </MenuItem>
                      {["UNSPECIFIED", "SPECIFIED", "OPEN_TRUNK"].map((opt) => (
                          <MenuItem key={opt} value={opt}>
                            {formatEnumLabel(opt)}
                          </MenuItem>
                      ))}
                    </StyledSelect>
                  </StyledFormControl>
                </Tooltip>

                <Tooltip title={
                  <span>Enable or disable DHCP for this configuration.
                    <hr />Only an option if <strong>Open Trunk</strong> is selected in VLANs.
                  </span>
                  } arrow enterDelay={250} leaveDelay={100}
                >
                  <FormControlLabel
                      control={
                        <StyledSwitch
                            checked={formData.dhcp}
                            onChange={(e) => setFormData(prev => ({ ...prev, dhcp: e.target.checked }))}
                            disabled={formData.vlans !== "OPEN_TRUNK"}
                        />
                      }
                      label="DHCP"
                      sx={{ mt: 1, mb: -1 }}
                  />
                </Tooltip>
              </Box>

              {validationErrors.length > 0 && (
                  <Box sx={{ mt: 2, mb: 2 }}>
                    {validationErrors.map((error, idx) => (
                        <Typography key={idx} color="error" variant="body2" sx={{ mb: 0.5 }}>
                          • {error}
                        </Typography>
                    ))}
                  </Box>
              )}
            </>
        );

      case 4:
        return (
            <>
              <StyledTextField
                  fullWidth
                  label="Site Name"
                  name="siteName"
                  value={formData.siteName}
                  onChange={handleChange}
                  required
                  error={validationErrors.some(e => e.includes("Site name"))}
                  sx={{ mb: 2 }}
              />
              <StyledTextField
                  fullWidth
                  label="Address"
                  name="siteAddress"
                  value={formData.siteAddress}
                  onChange={handleChange}
                  required
                  error={validationErrors.some(e => e.includes("Address"))}
                  sx={{ mb: 2 }}
              />
              <StyledTextField
                  fullWidth
                  label="Postcode"
                  name="sitePostcode"
                  value={formData.sitePostcode}
                  onChange={handleChange}
                  required
                  error={validationErrors.some(e => e.includes("Postcode"))}
                  sx={{ mb: 2 }}
              />
              <StyledTextField
                  fullWidth
                  label="Primary Email"
                  name="sitePrimaryEmail"
                  value={formData.sitePrimaryEmail}
                  onChange={handleChange}
                  required
                  error={validationErrors.some(e => e.includes("Primary email"))}
                  sx={{ mb: 2 }}
              />
              <StyledTextField
                  fullWidth
                  label="Secondary Email (Optional)"
                  name="siteSecondaryEmail"
                  value={formData.siteSecondaryEmail}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
              />
              <StyledTextField
                  fullWidth
                  label="Phone Number"
                  name="sitePhoneNumber"
                  value={formData.sitePhoneNumber}
                  onChange={handleChange}
                  required
                  error={validationErrors.some(e => e.includes("Phone number"))}
                  sx={{ mb: 2 }}
              />
              <StyledTextField
                  fullWidth
                  label="Contact Name"
                  name="siteContactName"
                  value={formData.siteContactName}
                  onChange={handleChange}
                  required
                  error={validationErrors.some(e => e.includes("Contact name"))}
              />

              {validationErrors.length > 0 && (
                  <Box sx={{ mt: 2, mb: 2 }}>
                    {validationErrors.map((error, idx) => (
                        <Typography key={idx} color="error" variant="body2" sx={{ mb: 0.5 }}>
                          • {error}
                        </Typography>
                    ))}
                  </Box>
              )}
            </>
        );

      case 5:
        const priorityLabels = ["Low", "Medium", "High", "Urgent", "Critical"];
        const priorityMarks = priorityLabels.map((label, index) => ({
          value: index,
          label,
        }));
        const priorityIndex = priorityLabels.indexOf(formData.priorityLevel);

        return (
            <>
              <Tooltip title="Select the number of the configured routers the customer wants to order." arrow>
                <StyledTextField
                    fullWidth
                    type="number"
                    label="Number of Routers"
                    name="numRouters"
                    value={formData.numRouters}
                    onChange={handleChange}
                    inputProps={{ min: 1 }}
                    sx={{ mb: 2 }}
                />
              </Tooltip>

              <Tooltip title="Select the priority level for this request" arrow>
                <Box sx={{ mt: 0.5, px: 1 }}>
                  <Typography sx={{ textAlign: "center", mb: -2 }}>Priority Level</Typography>
                  <StyledSlider
                      value={priorityIndex !== -1 ? priorityIndex : 0}
                      onChange={(e, newValue) => setFormData(prev => ({
                        ...prev,
                        priorityLevel: priorityLabels[newValue],
                      }))}
                      step={1}
                      marks={priorityMarks}
                      min={0}
                      max={4}
                      valueLabelDisplay="off"
                      sx={{ mt: 2 }}
                  />
                </Box>
              </Tooltip>

              <Tooltip title="Additional configuration details (max 500 characters)" arrow>
                <StyledTextField
                    fullWidth
                    label="Additional Information"
                    name="additionalInformation"
                    value={formData.additionalInformation}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    margin="normal"
                    error={validationErrors.some(e => e.includes("Additional information"))}
                    inputProps={{
                      maxLength: 500,
                    }}
                    InputProps={{
                      endAdornment: (
                          <InputAdornment position="end">
                      <span style={{
                        position: "absolute",
                        bottom: 8,
                        right: 12,
                        fontSize: "0.85em",
                        color: validationErrors.some(e => e.includes("Additional information"))
                            ? "#d32f2f" : "#888",
                      }}>
                        {`${formData.additionalInformation.length}/500`}
                      </span>
                          </InputAdornment>
                      ),
                    }}
                />
              </Tooltip>

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

              {validationErrors.length > 0 && (
                  <Box sx={{ mt: 2, mb: 2 }}>
                    {validationErrors.map((error, idx) => (
                        <Typography key={idx} color="error" variant="body2" sx={{ mb: 0.5 }}>
                          • {error}
                        </Typography>
                    ))}
                  </Box>
              )}
            </>
        );

      default:
        return <Typography>Unknown Step</Typography>;
    }
  };

  return (
      <MainContainer>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <Container
            maxWidth="md"
            sx={{
              position: "relative",
              py: 4,
              minHeight: "100vh", // full height of viewport
              display: "flex",
              flexDirection: "column",
              justifyContent: "center", // vertical centering
              alignItems: "center",     // optional: horizontal centering
            }}
        >
          <TopDecoration />
          <BottomDecoration />
          <Fade in timeout={600}>
            <CardContainer active={true} sx={{ m: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Request a Router
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  Complete the form steps below to submit your router request.
                </Typography>
              </Box>
              <Stepper activeStep={activeStep} alternativeLabel sx={{ mt: 2, mb: 4 }}>
                {steps.map((label, idx) => (
                    <Step key={idx}>
                      <StepLabel
                          sx={{
                            '& .MuiStepIcon-root': {
                              background: "linear-gradient(90deg, #6200aa 0%, #c51688 100%)",
                              borderRadius: '50%',
                              color: 'transparent',
                            },
                            '& .MuiStepIcon-root::before': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background: "inherit",
                              borderRadius: 'inherit',
                            },
                            '& .MuiStepIcon-root.Mui-completed': {
                              color: '#fff',
                              border: '1px solid #6200aa',
                            },
                            '& .Mui-active .MuiStepIcon-root': {
                              boxShadow: '0 0 4px 2px rgba(197, 22, 136, 0.6)',
                            },
                          }}
                      >
                        {label}
                      </StepLabel>
                    </Step>
                ))}
              </Stepper>
              <form>
                {getStepContent(activeStep)}
                <Box
                    sx={{
                      display: "flex",
                      justifyContent: activeStep === 0 ? "flex-end" : "space-between",
                      mt: 4
                    }}
                >
                  {activeStep > 0 && (
                      <Button
                          onClick={() => {
                            setValidationErrors([]);
                            setActiveStep((prev) => prev - 1);
                          }}
                          sx={{
                            background: "linear-gradient(45deg, #6200aa 30%, #8e24aa 90%)",
                            color: "#fff",
                            fontWeight: "bold",
                            px: 3,
                            '&:hover': {
                              background: "linear-gradient(45deg, #5a0099 30%, #7e1e9e 90%)"
                            }
                          }}
                      >
                        Back
                      </Button>
                  )}
                  {activeStep < steps.length - 1 ? (
                      <Button
                          onClick={handleNext}
                          sx={{
                            background: "linear-gradient(45deg, #6200aa 30%, #8e24aa 90%)",
                            color: "#fff",
                            fontWeight: "bold",
                            px: 3,
                            '&:hover': {
                              background: "linear-gradient(45deg, #5a0099 30%, #7e1e9e 90%)"
                            }
                          }}
                      >
                        Next
                      </Button>
                  ) : (
                      <Button
                          onClick={handleSubmit} // only fires when user explicitly clicks Submit
                          disabled={isLoading}
                          sx={{
                            background: "linear-gradient(45deg, #6200aa 30%, #8e24aa 90%)",
                            color: "#fff",
                            fontWeight: "bold",
                            px: 3,
                            '&:hover': {
                              background: "linear-gradient(45deg, #5a0099 30%, #7e1e9e 90%)"
                            }
                          }}
                      >
                        {isLoading ? <CircularProgress size={20} /> : "Submit"}
                      </Button>
                  )}
                </Box>
              </form>
            </CardContainer>
          </Fade>
          <Footer>
            <Typography variant="caption">© 2025 BT IoT Router Services. All rights reserved.</Typography>
          </Footer>
        </Container>
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
