import React, { useRef, useState, useEffect } from "react";
import {
    InputLabel,
    MenuItem,
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
    ButtonContainer,
    SaveButton,
    DeleteButton
} from "../../styles/PageStyles";
import Sidebar from "../Navigation/Sidebar";
import useAuth from "../Auth/useAuth";
import RouterPresetForm from "../RouterPresets/RouterPresetsForm";

const CustomerPage = () => {
    const {userRole, activeTab, setActiveTab} = useAuth();
    const [customers, setCustomers] = useState([]);
    const [isAddingNewCustomer, setIsAddingNewCustomer] = useState(false);
    const [newCustomerName, setNewCustomerName] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [routers, setRouters] = useState([]);
    const [routerPresets, setRouterPresets] = useState([]);

    /* Lifecycle Effects. */
    useEffect(() => {
        fetch("http://localhost:8080/api/customers")
            .then((response) => response.json())
            .then((data) => setCustomers(data))
            .catch((error) => console.error("Error fetching customers:", error));
    }, []);

    useEffect(() => {
        fetch("http://localhost:8080/api/routers")
            .then((res) => res.json())
            .then((data) => setRouters(data))
            .catch((err) => console.error("Error fetching routers:", err));
    }, []);

    useEffect(() => {
        if (selectedCustomer) {
            fetch(`http://localhost:8080/api/router-presets/customer/${selectedCustomer.customerID}`)
                .then((res) => res.json())
                .then((data) => setRouterPresets(data))
                .catch((err) => console.error("Error fetching router presets:", err));
        } else {
            setRouterPresets([]);
        }
    }, [selectedCustomer]);

    // CustomerPage is parent of RouterPresetsForm, declaring the reference.
    const routerPresetFormRef = useRef();

    /* Form Handlers. */
    // Resets all form fields to their default (empty) values.
    const clearForm = () => {
        setNewCustomerName("");
        setSelectedCustomer(null);

        // Clears the child forms.
        routerPresetFormRef.current?.clearForm();
    };

    // Updates the form fields when a different selection in the drop-down box is made.
    const handleCustomerChange = (event) => {
        const selectedId = parseInt(event.target.value, 10);
        const customer = customers.find((r) => r.customerID === selectedId);
        setSelectedCustomer(customer || null);
    };

    /* Button Handlers. */
    // Saves the customer details to the database if the customer exists; adds the new customer if not.
    const handleSave = () => {
        const customerName = isAddingNewCustomer ? newCustomerName : selectedCustomer?.customerName;

        if (!customerName?.trim()) {
            alert("Please enter a customer name before saving.");
            return;
        }

        // Creates the customerData object with all relevant fields from the customer form.
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

    // Deletes a customer from the database.
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
                    clearForm();
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

                    <StyledFormControl fullWidth sx={{ mb: 2 }}>
                        {!isAddingNewCustomer && (
                            <InputLabel sx={{ backgroundColor: "white", px: 0.5 }}>
                                Customer
                            </InputLabel>
                        )}
                        <NameContainer>
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
                                        <em>Required</em>
                                    </MenuItem>
                                    {customers.map((customer) => (
                                        <MenuItem key={customer.customerID} value={customer.customerID}>
                                            {customer.customerName}
                                        </MenuItem>
                                    ))}
                                </StyledSelect>
                            )}
                            <ToggleNameButton
                                onClick={() => {
                                    setIsAddingNewCustomer(!isAddingNewCustomer);
                                    clearForm();
                                }}
                                className={isAddingNewCustomer ? "close-mode" : ""}
                            />
                        </NameContainer>
                    </StyledFormControl>

                    <ButtonContainer>
                        <SaveButton onClick={handleSave}>Save Customer</SaveButton>
                        <DeleteButton onClick={handleDelete}>Delete Customer</DeleteButton>
                    </ButtonContainer>

                    <RouterPresetForm
                        ref={routerPresetFormRef}
                        customer={selectedCustomer}
                        routers={routers}
                        routerPresets={routerPresets}
                        setRouterPresets={setRouterPresets}
                    />

                </FormWrapper>
            </ContentArea>
        </MainContainer>
    );
};

export default CustomerPage;
