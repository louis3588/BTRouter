import React, { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Typography,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Paper
} from "@mui/material";
import { styled } from "@mui/system";
import Sidebar from "../Navigation/Sidebar";
import useAuth from "../Auth/useAuth";

const MainContainer = styled(Box)({
    display: "flex",
    minHeight: "100vh",
    background: "linear-gradient(to bottom right, #f7f3fc 0%, #ece6f4 100%)",
});

const ContentArea = styled(Box)({
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
});

const FormWrapper = styled(Paper)({
    width: "100%",
    maxWidth: "600px",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
});

const StyledButton = styled(Button)({
    background: "linear-gradient(135deg, #5f00a7, #9b42c3)",
    color: "#fff",
    padding: "10px",
    fontSize: "16px",
    fontWeight: "bold",
    marginTop: "16px",
    "&:hover": {
        background: "linear-gradient(135deg, #4b0082, #8a2be2)",
    },
});

const CheckboxColumn = styled(Box)({
    display: "flex",
    flexDirection: "column",
    gap: "6px",
});

const RouterForm = () => {
    const { userRole, activeTab, setActiveTab } = useAuth();
    const [routers, setRouters] = useState([]);
    const [selectedRouter, setSelectedRouter] = useState(null);
    const [outsideConnections, setOutsideConnections] = useState([]);
    const [insideConnections, setInsideConnections] = useState([]);
    const [ethernetPorts, setEthernetPorts] = useState("");
    const [serialPorts, setSerialPorts] = useState("");

    useEffect(() => {
        fetch("http://localhost:8080/api/routers")
            .then((response) => response.json())
            .then((data) => setRouters(data))
            .catch((error) => console.error("Error fetching routers:", error));
    }, []);

    // If drop-down box selection is changed...
    const handleRouterChange = (event) => {
        const selectedId = parseInt(event.target.value, 10);
        const router = routers.find((r) => r.routerID === selectedId);
        setSelectedRouter(router || null);

        if (router) {
            setOutsideConnections(router.outsideConnectionTypes?.split(", ") || []);
            setInsideConnections(router.insideConnectionTypes?.split(", ") || []);
            setEthernetPorts(router.ethernetPorts || "");
            setSerialPorts(router.serialPorts || "");
        } else {
            setOutsideConnections([]);
            setInsideConnections([]);
            setEthernetPorts("");
            setSerialPorts("");
        }
    };

    // ...change the selected checkboxes appropriately.
    const handleCheckboxChange = (type, checked, isOutside) => {
        if (isOutside) {
            setOutsideConnections((prev) =>
                checked ? [...prev, type] : prev.filter((item) => item !== type)
            );
        } else {
            setInsideConnections((prev) =>
                checked ? [...prev, type] : prev.filter((item) => item !== type)
            );
        }
    };

    // Fixed outside connections for the moment, will work fine for the project.
    const outsideOptions = [
        "Mobile Radio - Roaming Sim",
        "Mobile Radio - UK SIM",
        "SOGEA - Private Broadband",
        "FTTP - Private Broadband",
        "FTTP - Internet",
        "VSAT Satellite - Internet",
        "ADSL - Private Broadband",
        "ADSL - Internet",
    ];

    return (
        <MainContainer>
            {/* Sidebar. */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} />

            {/* Form Content. */}
            <ContentArea>
                <FormWrapper elevation={3}>
                    <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", mb: 2 }}>
                        Configure Router
                    </Typography>

                    {/* Router Selection. */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Select a Router</InputLabel>
                        <Select onChange={handleRouterChange} value={selectedRouter?.routerID || ""}>
                            <MenuItem value="">Select a router...</MenuItem>
                            {routers.map((router) => (
                                <MenuItem key={router.routerID} value={router.routerID}>
                                    {router.routerName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Outside Connections. */}
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Outside Connection Types
                    </Typography>
                    <CheckboxColumn>
                        {outsideOptions.map((type) => (
                            <FormControlLabel
                                key={type}
                                control={
                                    <Checkbox
                                        checked={outsideConnections.includes(type)}
                                        onChange={(e) => handleCheckboxChange(type, e.target.checked, true)}
                                    />
                                }
                                label={type}
                            />
                        ))}
                    </CheckboxColumn>

                    {/* Inside Connections. */}
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Inside Connection Types
                    </Typography>
                    <CheckboxColumn>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={insideConnections.includes("Ethernet")}
                                    onChange={(e) => handleCheckboxChange("Ethernet", e.target.checked, false)}
                                />
                            }
                            label="Ethernet"
                        />
                        {insideConnections.includes("Ethernet") && (
                            <TextField
                                fullWidth
                                label="Maximum Ethernet Ports"
                                type="number"
                                value={ethernetPorts}
                                sx={{ mt: 1, mb: 2 }}
                                disabled
                            />
                        )}

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={insideConnections.includes("Serial")}
                                    onChange={(e) => handleCheckboxChange("Serial", e.target.checked, false)}
                                />
                            }
                            label="Serial"
                        />
                        {insideConnections.includes("Serial") && (
                            <TextField
                                fullWidth
                                label="Maximum Serial Ports"
                                type="number"
                                value={serialPorts}
                                sx={{ mt: 1, mb: 2 }}
                                disabled
                            />
                        )}
                    </CheckboxColumn>

                    {/* Save Button. */}
                    <StyledButton fullWidth variant="contained">
                        Save
                    </StyledButton>
                </FormWrapper>
            </ContentArea>
        </MainContainer>
    );
};

export default RouterForm;
