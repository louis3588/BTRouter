"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RouterRequestForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    routerModel: "",
    siteLocation: "",
    ipAddress: "",
    configurationDetails: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.routerModel || !formData.siteLocation || !formData.ipAddress || !formData.configurationDetails) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/router-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        setError(data.message || "Failed to submit request. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Router Request Form</h2>

        {submitted ? (
          <div className="text-green-600 text-center">
            <p>Your request has been submitted successfully!</p>
            <p>Redirecting...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium">Router Model</label>
              <input type="text" name="routerModel" value={formData.routerModel} onChange={handleChange} className="w-full border rounded p-2" required />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Site Location</label>
              <input type="text" name="siteLocation" value={formData.siteLocation} onChange={handleChange} className="w-full border rounded p-2" required />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">IP Address</label>
              <input type="text" name="ipAddress" value={formData.ipAddress} onChange={handleChange} className="w-full border rounded p-2" required />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Configuration Details</label>
              <textarea name="configurationDetails" value={formData.configurationDetails} onChange={handleChange} className="w-full border rounded p-2" required />
            </div>

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded" disabled={loading}>
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
