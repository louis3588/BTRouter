import React, { useState, useEffect } from "react";
import {
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel
} from "@mui/material";
import {
    MainContainer,
    ContentArea,
    FormWrapper,
    ButtonContainer,
    SaveButton,
    DeleteButton,
    CheckboxColumn
} from "../../styles/RouterFormStyles";
import Sidebar from "../Navigation/Sidebar";
import useAuth from "../Auth/useAuth";

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
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} />

            <ContentArea>
                <FormWrapper elevation={3}>
                    <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", mb: 2 }}>
                        Configure Router
                    </Typography>

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

                    <Typography variant="h6" sx={{ mt: 2 }}>Outside Connection Types</Typography>
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

                    <Typography variant="h6" sx={{ mt: 2 }}>Inside Connection Types</Typography>
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
                            <TextField fullWidth label="Maximum Ethernet Ports" type="number" value={ethernetPorts} sx={{ mt: 1, mb: 2 }} disabled />
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
                            <TextField fullWidth label="Maximum Serial Ports" type="number" value={serialPorts} sx={{ mt: 1, mb: 2 }} disabled />
                        )}
                    </CheckboxColumn>

                    <ButtonContainer>
                        <SaveButton>Save</SaveButton>
                        <DeleteButton>Delete</DeleteButton>
                    </ButtonContainer>
                </FormWrapper>
            </ContentArea>
        </MainContainer>
    );
};

export default RouterForm;
