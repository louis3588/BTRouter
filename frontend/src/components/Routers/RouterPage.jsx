import React, { useState, useEffect } from "react";
import {
    Checkbox,
    FormControlLabel,
    InputLabel,
    MenuItem,
    TextField,
    Typography
} from "@mui/material";
import {
    StyledSelect,
    StyledFormControl,
    StyledTextField,
    MainContainer,
    ContentArea,
    FormWrapper,
    NameContainer,
    ToggleNameButton,
    CheckboxColumn,
    ButtonContainer,
    SaveButton,
    DeleteButton
} from "../../styles/PageStyles";
import Sidebar from "../Navigation/Sidebar";
import useAuth from "../Auth/useAuth";

const RouterPage = () => {
    const { userRole, activeTab, setActiveTab } = useAuth();
    const [routers, setRouters] = useState([]);
    const [isAddingNewRouter, setIsAddingNewRouter] = useState(false);
    const [newRouterName, setNewRouterName] = useState("");
    const [selectedRouter, setSelectedRouter] = useState(null);
    const [outsideConnections, setOutsideConnections] = useState([]);
    const [insideConnections, setInsideConnections] = useState([]);
    const [ethernetPorts, setEthernetPorts] = useState(null);
    const [serialPorts, setSerialPorts] = useState(null);

    /* Lifecycle Effects. */
    useEffect(() => {
        fetch("http://localhost:8080/api/routers")
            .then((response) => response.json())
            .then((data) => setRouters(data))
            .catch((error) => console.error("Error fetching routers:", error));
    }, []);

    /* Form Handlers. */
    // Resets all form fields to their default (empty) values.
    const clearForm = () => {
        setSelectedRouter(null);
        setOutsideConnections([]);
        setInsideConnections([]);
        setEthernetPorts("");
        setSerialPorts("");
    }

    // Updates the form fields when a different selection in the drop-down box is made.
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

    // Toggles connection types based on checkbox state. Triggers display of relevant fields.
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

    /* Button Handlers. */
    // Saves the router details to the database if the router exists; adds the new router if not.
    const handleSave = () => {
        const routerName = isAddingNewRouter ? newRouterName : selectedRouter?.routerName;

        if (!routerName?.trim()) {
            alert("Please enter a router name before saving.");
            return;
        }

        // Creates the routerData object with all relevant fields from the router form.
        const routerData = {
            routerID: isAddingNewRouter ? null : selectedRouter?.routerID,
            routerName: routerName,
            outsideConnectionTypes: outsideConnections,
            insideConnectionTypes: insideConnections,
            ethernetPorts: insideConnections.includes("ETHERNET") ? Number(ethernetPorts) : null,
            serialPorts: insideConnections.includes("SERIAL") ? Number(serialPorts) : null,
        };

        fetch("http://localhost:8080/api/routers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(routerData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to save router.");
                }
                return response.json();
            })
            .then((data) => {
                alert("Router saved successfully!");
                setRouters((prev) => {
                    const existingRouterIndex = prev.findIndex((r) => r.routerID === data.routerID);
                    if (existingRouterIndex !== -1) {
                        const updatedRouters = [...prev];
                        updatedRouters[existingRouterIndex] = data;
                        return updatedRouters;
                    }
                    return [...prev, data];
                });

                setSelectedRouter(data);
            })
            .catch((error) => {
                console.error("Error saving router:", error);
                alert("Error saving router.");
            });
    };

    // Deletes a router from the database.
    const handleDelete = () => {
        if (!selectedRouter || !selectedRouter.routerID) {
            alert("Please select a router to delete.");
            return;
        }

        if (window.confirm(`Are you sure you want to delete ${selectedRouter.routerName}?`)) {
            fetch(`http://localhost:8080/api/routers/${selectedRouter.routerID}`, {
                method: "DELETE",
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to delete router.");
                    }
                })
                .then(() => {
                    alert("Router deleted successfully!");
                    // Update the list of routers in the drop-down box.
                    setRouters(prev => prev.filter(r => r.routerID !== selectedRouter.routerID));
                    clearForm();
                })
                .catch(error => {
                    console.error("Delete error:", error);
                    alert("Error deleting router.");
                });
        }
    };

    /* Form State Helpers. */
    // Drop-down options.
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
                        Router Configurations
                    </Typography>

                    <StyledFormControl fullWidth sx={{ mb: 2 }}>
                        {!isAddingNewRouter && (
                            <InputLabel sx={{ backgroundColor: "white", px: 0.5 }}>
                                Select a router...
                            </InputLabel>
                        )}
                        <NameContainer>
                            {isAddingNewRouter ? (
                                <StyledTextField
                                    fullWidth
                                    label="New Router Name"
                                    value={newRouterName}
                                    onChange={(e) => setNewRouterName(e.target.value)}
                                    autoFocus
                                />
                            ) : (
                                <StyledSelect
                                    onChange={handleRouterChange}
                                    value={selectedRouter?.routerID || ""}
                                    fullWidth
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>
                                        Select a router...
                                    </MenuItem>
                                    {routers.map((router) => (
                                        <MenuItem key={router.routerID} value={router.routerID}>
                                            {router.routerName}
                                        </MenuItem>
                                    ))}
                                </StyledSelect>
                            )}
                            <ToggleNameButton
                                onClick={() => {
                                    setIsAddingNewRouter(!isAddingNewRouter);
                                    clearForm();
                                }}
                                className={isAddingNewRouter ? "close-mode" : ""}
                            />
                        </NameContainer>
                    </StyledFormControl>

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
                                    checked={insideConnections.includes("ETHERNET")}
                                    onChange={(e) => handleCheckboxChange("ETHERNET", e.target.checked, false)}
                                />
                            }
                            label="Ethernet"
                        />
                        {insideConnections.includes("ETHERNET") && (
                            <TextField
                                fullWidth
                                label="Maximum Ethernet Ports"
                                type="number"
                                value={ethernetPorts || ""}  // Show empty when null
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === "" || (Number(value) >= 0 && Number(value) <= 32767)) {
                                        setEthernetPorts(value === "" ? null : Number(value));
                                    }
                                }}
                                sx={{ mt: 1, mb: 2 }}
                            />
                        )}

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={insideConnections.includes("SERIAL")}
                                    onChange={(e) => handleCheckboxChange("SERIAL", e.target.checked, false)}
                                />
                            }
                            label="Serial"
                        />
                        {insideConnections.includes("SERIAL") && (
                            <TextField
                                fullWidth
                                label="Maximum Serial Ports"
                                type="number"
                                value={serialPorts || ""}  // Show empty when null
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === "" || (Number(value) >= 0 && Number(value) <= 32767)) {
                                        setSerialPorts(value === "" ? null : Number(value));
                                    }
                                }}
                                sx={{ mt: 1, mb: 2 }}
                            />
                        )}
                    </CheckboxColumn>

                    <ButtonContainer>
                        <SaveButton onClick={handleSave}>Save</SaveButton>
                        <DeleteButton onClick={handleDelete}>Delete</DeleteButton>
                    </ButtonContainer>
                </FormWrapper>
            </ContentArea>
        </MainContainer>
    );
};

export default RouterPage;
