import React, { useEffect, useState } from "react";
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
    LabeledDivider,
    ToggleNameButton,
    CheckboxColumn,
    ButtonContainer,
    SaveButton,
    DeleteButton,
    NameContainer
} from "../../styles/PageStyles";

const RouterPresetForm = ({ customer, routers, routerPresets, setRouterPresets }) => {
    const [isAddingNewPreset, setIsAddingNewPreset] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState(null);
    const [presetName, setPresetName] = useState("");
    const [selectedRouterName, setSelectedRouterName] = useState("");
    const [primaryOutside, setPrimaryOutside] = useState("");
    const [secondaryOutside, setSecondaryOutside] = useState("");
    const [insideConnections, setInsideConnections] = useState([]);
    const [ethernetPorts, setEthernetPorts] = useState(null);
    const [serialPorts, setSerialPorts] = useState(null);
    const [vlans, setVlans] = useState("");
    const [dhcp, setDhcp] = useState(false);

    /* Lifecycle Effects. */
    useEffect(() => {
        if (!customer) {
            setSelectedPreset(null);
            setIsAddingNewPreset(false);
        }
    }, [customer]);

    /* Form Handlers. */
    // Resets all form fields to their default (empty) values.
    const clearForm = () => {
        setSelectedPreset(null);
        setPresetName("");
        setSelectedRouterName("");
        setPrimaryOutside("");
        setSecondaryOutside("");
        setInsideConnections([]);
        setEthernetPorts(null);
        setSerialPorts(null);
        setVlans("");
        setDhcp(false);
    };

    // Updates the form fields when a different selection in the drop-down box is made.
    const handlePresetChange = (e) => {
        const selectedId = parseInt(e.target.value);
        const routerPreset = routerPresets.find(p => p.routerPresetID === selectedId);
        if (routerPreset) {
            setSelectedPreset(routerPreset);
            setPresetName(routerPreset.routerPresetName);
            setSelectedRouterName(routerPreset.routerName);
            setPrimaryOutside(routerPreset.primaryOutsideConnections || "");
            setSecondaryOutside(routerPreset.secondaryOutsideConnections || "");
            setInsideConnections(routerPreset.insideConnections ? [routerPreset.insideConnections] : []);
            setEthernetPorts(routerPreset.numberOfEthernetPorts || null);
            setSerialPorts(routerPreset.numberOfSerialPorts || null);
            setVlans(routerPreset.vlans || "");
            setDhcp(routerPreset.dhcp || false);
        }
    };

    // Toggles connection types based on checkbox state. Triggers display of relevant fields.
    const handleCheckboxChange = (type, checked) => {
        setInsideConnections(prev =>
            checked ? [...prev, type] : prev.filter(item => item !== type)
        );
    };

    /* Button Handlers. */
    // Saves the router preset details to the database if the router preset exists; adds the new router preset if not.
    const handleSave = () => {
        if (!presetName || !selectedRouterName || !primaryOutside || insideConnections.length === 0 || !vlans) {
            alert("Please complete all required fields.");
            return;
        }

        const router = routers.find(r => r.routerName === selectedRouterName);
        if (!router) {
            alert("Selected router is invalid.");
            return;
        }

        // Determine combined insideConnection string
        let insideConnectionString = insideConnections.includes("ETHERNET") && insideConnections.includes("SERIAL")
            ? "ETHERNET_SERIAL"
            : insideConnections[0];

        // Creates the presetData object with all relevant fields from the router preset form.
        const presetData = {
            routerPresetID: isAddingNewPreset ? null : selectedPreset?.routerPresetID,
            routerPresetName: presetName,
            routerName: selectedRouterName,
            customerName: customer.customerName,
            primaryOutsideConnections: primaryOutside,
            secondaryOutsideConnections: secondaryOutside,
            insideConnections: insideConnectionString,
            numberOfEthernetPorts: insideConnections.includes("ETHERNET") ? ethernetPorts : null,
            numberOfSerialPorts: insideConnections.includes("SERIAL") ? serialPorts : null,
            vlans,
            dhcp
        };

        fetch("http://localhost:8080/api/router-presets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(presetData),
        })
            .then(res => res.json())
            .then(saved => {
                alert("Preset saved.");
                setRouterPresets(prev => {
                    const exists = prev.find(p => p.routerPresetID === saved.routerPresetID);
                    if (exists) {
                        return prev.map(p => p.routerPresetID === saved.routerPresetID ? saved : p);
                    }
                    return [...prev, saved];
                });
                setSelectedPreset(saved);
                setIsAddingNewPreset(false);
            })
            .catch(err => {
                console.error("Save error:", err);
                alert("Error saving preset.");
            });
    };

    // Deletes a router preset from the database.
    const handleDelete = () => {
        if (!selectedPreset) return;
        if (!window.confirm(`Delete ${selectedPreset.routerPresetName}?`)) return;

        fetch(`http://localhost:8080/api/router-presets/${selectedPreset.routerPresetID}`, {
            method: "DELETE"
        })
            .then(() => {
                alert("Preset deleted.");
                setRouterPresets(prev => prev.filter(p => p.routerPresetID !== selectedPreset.routerPresetID));
                clearForm();
            })
            .catch(err => {
                console.error("Delete error:", err);
                alert("Error deleting preset.");
            });
    };

    /* Form State Helpers. */
    // Drop-down options.
    const vlanOptions = ["UNSPECIFIED", "SPECIFIED", "OPEN_TRUNK"];

    // Retrieves the full router object from the selected router name.
    const selectedRouter = routers.find(r => r.routerName === selectedRouterName);

    // Determines maximum port limits from selected router.
    const maxEthernet = selectedRouter?.ethernetPorts ?? 0;
    const maxSerial = selectedRouter?.serialPorts ?? 0;

    // Extracts available outside connection options from selected router.
    const outsideOptions = (selectedRouter?.outsideConnectionTypes || "")
        .split(", ")
        .filter((opt) => typeof opt === "string" && opt.trim() !== "");

    // Filters out primary connection to populate secondary outside connection drop-down.
    const secondaryOptions = outsideOptions.filter(opt => opt !== primaryOutside);

    /* Validation Logic. */
    // If serial is the only inside connection, VLAN must be "UNSPECIFIED".
    const vlanWarning =
        insideConnections.length === 1 &&
        insideConnections.includes("SERIAL") &&
        vlans !== "UNSPECIFIED";

    // If VLAN is not "OPEN_TRUNK", DHCP must be disabled.
    const dhcpWarning = vlans !== "OPEN_TRUNK" && dhcp;

    return (
        <>
            <LabeledDivider>Router Presets</LabeledDivider>

            <StyledFormControl fullWidth sx={{ mb: 2 }}>
                {!isAddingNewPreset && (
                    <InputLabel sx={{ backgroundColor: "white", px: 0.5 }}>
                        Select a preset...
                    </InputLabel>
                )}
                <NameContainer>
                    {isAddingNewPreset ? (
                        <StyledTextField
                            label="New Preset Name"
                            value={presetName}
                            onChange={(e) => setPresetName(e.target.value)}
                            disabled={!customer}
                        />
                    ) : (
                        <StyledSelect
                            value={selectedPreset?.routerPresetID || ""}
                            onChange={handlePresetChange}
                            displayEmpty
                            fullWidth
                            disabled={!customer}
                        >
                            <MenuItem value="" disabled>Select a preset...</MenuItem>
                            {routerPresets.map(p => (
                                <MenuItem key={p.routerPresetID} value={p.routerPresetID}>
                                    {p.routerPresetName}
                                </MenuItem>
                            ))}
                        </StyledSelect>
                    )}
                    <ToggleNameButton
                        onClick={() => {
                            setIsAddingNewPreset(prev => !prev);
                            clearForm();
                        }}
                        className={isAddingNewPreset ? "close-mode" : ""}
                        disabled={!customer}
                    />
                </NameContainer>
            </StyledFormControl>

            <StyledFormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel sx={{ backgroundColor: "white", px: 0.5 }}>
                        Select a router...
                </InputLabel>
                <StyledSelect
                    fullWidth
                    value={selectedRouterName}
                    onChange={(e) => setSelectedRouterName(e.target.value)}
                    displayEmpty
                    disabled={!customer}
                >
                    <MenuItem value="" disabled>Select a router...</MenuItem>
                    {routers.map(r => (
                        <MenuItem key={r.routerID} value={r.routerName}>
                            {r.routerName}
                        </MenuItem>
                    ))}
                </StyledSelect>
            </StyledFormControl>

            <Typography variant="h6" sx={{ mt: 2 }}>Outside Connection Types</Typography>
            <StyledFormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Primary Outside Connection</InputLabel>
                <StyledSelect
                    value={primaryOutside}
                    onChange={(e) => setPrimaryOutside(e.target.value)}
                    label="Primary Outside Connection"
                    disabled={!customer || outsideOptions.length === 0}
                >
                    {outsideOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </StyledSelect>
            </StyledFormControl>

            <StyledFormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Secondary Outside Connection</InputLabel>
                <StyledSelect
                    value={secondaryOutside}
                    onChange={(e) => setSecondaryOutside(e.target.value)}
                    label="Secondary Outside Connection"
                    disabled={!customer || secondaryOptions.length === 0}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {secondaryOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </StyledSelect>
            </StyledFormControl>

            <Typography variant="h6" sx={{ mt: 2 }}>Inside Connection Types</Typography>
            <CheckboxColumn>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={insideConnections.includes("ETHERNET")}
                            onChange={(e) => handleCheckboxChange("ETHERNET", e.target.checked)}
                            disabled={!customer || maxEthernet === 0}
                        />
                    }
                    label="Ethernet"
                />
                {insideConnections.includes("ETHERNET") && (
                    <TextField
                        fullWidth
                        type="number"
                        label="Ethernet Ports"
                        value={ethernetPorts || ""}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            if (value === null || (value >= 0 && value <= maxEthernet)) {
                                setEthernetPorts(value === null ? null : value);
                            }
                        }}
                        sx={{ mt: 1 }}
                        disabled={!customer}
                    />
                )}

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={insideConnections.includes("SERIAL")}
                            onChange={(e) => handleCheckboxChange("SERIAL", e.target.checked)}
                            disabled={!customer || maxSerial === 0}
                        />
                    }
                    label="Serial"
                />
                {insideConnections.includes("SERIAL") && (
                    <TextField
                        fullWidth
                        type="number"
                        label="Serial Ports"
                        value={serialPorts || ""}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            if (value === null || (value >= 0 && value <= maxSerial)) {
                                setSerialPorts(value === null ? null : value);
                            }
                        }}
                        sx={{ mt: 1 }}
                        disabled={!customer}
                    />
                )}
            </CheckboxColumn>

            <StyledSelect
                fullWidth
                label="VLANs"
                value={vlans}
                onChange={(e) => setVlans(e.target.value)}
                sx={{ mt: 2 }}
                disabled={!customer}
            >
                {vlanOptions.map(vlan => (
                    <MenuItem key={vlan} value={vlan}>
                        {vlan.replace("_", " ")}
                    </MenuItem>
                ))}
            </StyledSelect>

            {vlanWarning && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    VLANs must be "UNSPECIFIED" when inside connection is "SERIAL"
                </Typography>
            )}

            <FormControlLabel
                control={
                    <Checkbox
                        checked={dhcp}
                        onChange={(e) => setDhcp(e.target.checked)}
                        disabled={!customer || vlans !== "OPEN_TRUNK"}
                    />
                }
                label="DHCP Enabled"
                sx={{ mt: 2 }}
            />

            {dhcpWarning && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    DHCP can only be enabled when VLANs is set to "OPEN_TRUNK"
                </Typography>
            )}

            <ButtonContainer>
                <SaveButton onClick={handleSave} disabled={!customer}>Save Preset</SaveButton>
                <DeleteButton onClick={handleDelete} disabled={!customer || !selectedPreset}>Delete Preset</DeleteButton>
            </ButtonContainer>
        </>
    );
};

export default RouterPresetForm;
