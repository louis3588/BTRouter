import { useEffect, useState } from "react";
import {
    Container,
    Typography,
    TextField,
    FormControlLabel,
    Checkbox,
    Button,
    Select,
    MenuItem,
    Paper,
    Divider,
    Grid,
    Switch,
} from "@mui/material";
import { styled } from "@mui/system";

const SettingsContainer = styled(Paper)({
    maxWidth: "800px",
    margin: "auto",
    padding: "30px",
    marginTop: "40px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
});

const SectionTitle = styled(Typography)({
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "8px",
});

const UserSettingsPage = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        businessType: "",
        vatNumber: "",
        billingAddress: "",
        twoFactorAuth: false,
        orderUpdates: false,
        billingNotifications: false,
        marketingEmails: false,
    });

    useEffect(() => {
        fetch("/api/user/settings", { credentials: "include" })
            .then((res) => res.json())
            .then((data) => setFormData(data))
            .catch((err) => console.error("Error fetching user settings:", err));
    }, []);

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("/api/user/settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(formData),
        })
            .then((res) => res.json())
            .then((data) => console.log("Settings updated:", data))
            .catch((err) => console.error("Error updating settings:", err));
    };

    return (
        <Container>
            <SettingsContainer>
                <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
                    SETTINGS
                </Typography>
                <Typography variant="body2" sx={{ marginBottom: "20px" }}>
                    Manage your account, preferences, and security settings.
                </Typography>

                <Divider sx={{ marginBottom: "20px" }} />

                <form onSubmit={handleSubmit}>
                    {/* Account Settings */}
                    <SectionTitle>ACCOUNT SETTINGS</SectionTitle>
                    <TextField
                        label="Full Name / Company Name"
                        fullWidth
                        margin="normal"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Email Address"
                        fullWidth
                        margin="normal"
                        name="email"
                        value={formData.email}
                        disabled
                    />
                    <TextField
                        label="Phone Number"
                        fullWidth
                        margin="normal"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                    />

                    <Divider sx={{ margin: "20px 0" }} />

                    {/* Business & Billing */}
                    <SectionTitle>BUSINESS & BILLING</SectionTitle>
                    <Select
                        fullWidth
                        displayEmpty
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleChange}
                    >
                        <MenuItem value="">Select Business Type</MenuItem>
                        <MenuItem value="Small Business">Small Business</MenuItem>
                        <MenuItem value="Enterprise">Enterprise</MenuItem>
                    </Select>
                    <TextField
                        label="VAT Number (Optional)"
                        fullWidth
                        margin="normal"
                        name="vatNumber"
                        value={formData.vatNumber}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Billing Address"
                        fullWidth
                        margin="normal"
                        name="billingAddress"
                        value={formData.billingAddress}
                        onChange={handleChange}
                    />

                    <Divider sx={{ margin: "20px 0" }} />

                    {/* Security & Access */}
                    <SectionTitle>SECURITY & ACCESS</SectionTitle>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: "#600d87", color: "white", marginBottom: "10px" }}
                    >
                        Change Password
                    </Button>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.twoFactorAuth}
                                onChange={handleChange}
                                name="twoFactorAuth"
                            />
                        }
                        label="Enable Two-Factor Authentication"
                    />

                    <Divider sx={{ margin: "20px 0" }} />

                    {/* Notification Preferences */}
                    <SectionTitle>NOTIFICATION PREFERENCES</SectionTitle>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.orderUpdates}
                                onChange={handleChange}
                                name="orderUpdates"
                            />
                        }
                        label="Order Updates"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.billingNotifications}
                                onChange={handleChange}
                                name="billingNotifications"
                            />
                        }
                        label="Billing Notifications"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.marketingEmails}
                                onChange={handleChange}
                                name="marketingEmails"
                            />
                        }
                        label="Marketing Emails"
                    />

                    <Divider sx={{ margin: "20px 0" }} />

                    {/* Account Management */}
                    <SectionTitle>ACCOUNT MANAGEMENT</SectionTitle>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Button variant="contained" sx={{ backgroundColor: "red", color: "white" }} fullWidth>
                                Delete Account
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button variant="contained" sx={{ backgroundColor: "#600d87", color: "white" }} fullWidth>
                                Request Data Export
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </SettingsContainer>
        </Container>
    );
};

export default UserSettingsPage;
