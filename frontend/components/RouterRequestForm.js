import React, { useState } from "react";

const RouterRequestForm = () => {
  const [formData, setFormData] = useState({
    routerType: "",
    numRouters: 1,
    siteName: "",
    siteAddress: "",
    city: "",
    postcode: "",
    email: "",
    phone: "",
    priority: "Low",
    additionalInfo: "",
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePreview = () => {
    setPreviewData(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    // Validate mandatory fields
    for (const key in formData) {
      if (formData[key] === "" && key !== "additionalInfo") {
        setMessage(`Please fill in the ${key} field.`);
        setIsLoading(false);
        return;
      }
    }

    try {
      // ✅ Fix: Ensure no trailing dots in API URL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/orders";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to submit order.");
      }

      setMessage("Order submitted successfully!");
      setFormData({
        routerType: "",
        numRouters: 1,
        siteName: "",
        siteAddress: "",
        city: "",
        postcode: "",
        email: "",
        phone: "",
        priority: "Low",
        additionalInfo: "",
      });
      setPreviewData(null);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
      console.error("Network Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Router Request Form</h2>
      <form onSubmit={handleSubmit}>
        <label>Router Type:</label>
        <input
          type="text"
          name="routerType"
          value={formData.routerType}
          onChange={handleChange}
          required
        />

        <label>Number of Routers:</label>
        <input
          type="number"
          name="numRouters"
          value={formData.numRouters}
          onChange={handleChange}
          min="1"
          required
        />

        <label>Site Name:</label>
        <input
          type="text"
          name="siteName"
          value={formData.siteName}
          onChange={handleChange}
          required
        />

        <label>Address:</label>
        <input
          type="text"
          name="siteAddress"
          value={formData.siteAddress}
          onChange={handleChange}
          required
        />

        <label>City:</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
        />

        <label>Postcode:</label>
        <input
          type="text"
          name="postcode"
          value={formData.postcode}
          onChange={handleChange}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Phone:</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <label>Priority Level:</label>
        <select name="priority" value={formData.priority} onChange={handleChange}>
          <option value="Critical">Critical</option>
          <option value="Urgent">Urgent</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <label>Additional Information:</label>
        <textarea
          name="additionalInfo"
          value={formData.additionalInfo}
          onChange={handleChange}
        ></textarea>

        <button type="button" onClick={handlePreview}>
          Preview
        </button>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {previewData && (
        <div>
          <h3>Preview Order Details</h3>
          <pre>{JSON.stringify(previewData, null, 2)}</pre>
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default RouterRequestForm;
