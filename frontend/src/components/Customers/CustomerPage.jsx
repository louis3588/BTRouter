import React, { useState, useEffect } from "react";
import {
    TextField,
    Typography,
    FormControl,
    InputLabel,
    MenuItem,
    Checkbox,
    FormControlLabel
} from "@mui/material";
import {
    StyledSelect,
    StyledTextField,
    MainContainer,
    ContentArea,
    FormWrapper,
    RouterNameContainer,
    ToggleRouterNameButton,
    CheckboxColumn,
    ButtonContainer,
    SaveButton,
    DeleteButton,
} from "../../styles/RouterFormStyles";
import Sidebar from "../Navigation/Sidebar";
import useAuth from "../Auth/useAuth";

const CustomerPage = () => {
    const {userRole, activeTab, setActiveTab} = useAuth();
    const [customers, setCustomers] = useState([]);
    const [isAddingNewCustomer, setIsAddingNewCustomer] = useState(false);
    const [newCustomerName, setNewCustomerName] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8080/api/customers")
            .then((response) => response.json())
            .then((data) => setCustomers(data))
            .catch((error) => console.error("Error fetching customers:", error));
    }, []);

    /* Form Handlers. */
    const handleCustomerChange = (event) => {
        const selectedId = parseInt(event.target.value, 10);
        const customer = customers.find((r) => r.customerID === selectedId);
        setSelectedCustomer(customer || null);
    };

    /* Button Handlers. */
    const handleSave = () => {
        const customerName = isAddingNewCustomer ? newCustomerName : selectedCustomer?.customerName;

        if (!customerName?.trim()) {
            alert("Please enter a customer name before saving.");
            return;
        }

        const customerData = {
            customerID: isAddingNewCustomer ? null : selectedCustomer?.customerID,
            customerName: customerName,
        };

        fetch("http://localhost:8080/api/customers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(customerData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to save customer.");
                }
                return response.json();
            })
            .then((data) => {
                alert("Customer saved successfully!");
                setCustomers((prev) => {
                    const existingCustomerIndex = prev.findIndex((r) => r.customerID === data.customerID);
                    if (existingCustomerIndex !== -1) {
                        const updatedCustomers = [...prev];
                        updatedCustomers[existingCustomerIndex] = data;
                        return updatedCustomers;
                    }
                    return [...prev, data];
                });

                setSelectedCustomer(data);
            })
            .catch((error) => {
                console.error("Error saving customer:", error);
                alert("Error saving customer.");
            });
    };

    const handleDelete = () => {
        if (!selectedCustomer || !selectedCustomer.customerID) {
            alert("Please select a customer to delete.");
            return;
        }

        if (window.confirm(`Are you sure you want to delete ${selectedCustomer.customerName}?`)) {
            fetch(`http://localhost:8080/api/customers/${selectedCustomer.customerID}`, {
                method: "DELETE",
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to delete customer.");
                    }
                })
                .then(() => {
                    alert("Customer deleted successfully!");
                    // Update the list of customers in the drop-down box.
                    setCustomers(prev => prev.filter(r => r.customerID !== selectedCustomer.customerID));

                    // Clear the form.
                    setSelectedCustomer(null);
                })
                .catch(error => {
                    console.error("Delete error:", error);
                    alert("Error deleting customer.");
                });
        }
    };

    return (
        <MainContainer>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} />

            <ContentArea>
                <FormWrapper elevation={3}>
                    <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", mb: 2 }}>
                        Customers
                    </Typography>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        {!isAddingNewCustomer && (
                            <InputLabel sx={{ backgroundColor: "white", px: 0.5 }}>
                                Select a customer...
                            </InputLabel>
                        )}
                        <RouterNameContainer>
                            {isAddingNewCustomer ? (
                                <StyledTextField
                                    fullWidth
                                    label="New Customer Name"
                                    value={newCustomerName}
                                    onChange={(e) => setNewCustomerName(e.target.value)}
                                    autoFocus
                                />
                            ) : (
                                <StyledSelect
                                    onChange={handleCustomerChange}
                                    value={selectedCustomer?.customerID || ""}
                                    fullWidth
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>
                                        Select a customer...
                                    </MenuItem>
                                    {customers.map((customer) => (
                                        <MenuItem key={customer.customerID} value={customer.customerID}>
                                            {customer.customerName}
                                        </MenuItem>
                                    ))}
                                </StyledSelect>
                            )}
                            <ToggleRouterNameButton
                                onClick={() => {
                                    setIsAddingNewCustomer(!isAddingNewCustomer);

                                    // Clears all form fields.
                                    setNewCustomerName("");
                                    setSelectedCustomer(null);
                                }}
                                className={isAddingNewCustomer ? "close-mode" : ""}
                            />
                        </RouterNameContainer>
                    </FormControl>

                    <ButtonContainer>
                        <SaveButton onClick={handleSave}>Save</SaveButton>
                        <DeleteButton onClick={handleDelete}>Delete</DeleteButton>
                    </ButtonContainer>
                </FormWrapper>
            </ContentArea>
        </MainContainer>
    );
};

export default CustomerPage;
