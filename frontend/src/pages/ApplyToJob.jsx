"use client";
  

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // ✅ Import useParams
import { applyForJob } from "@/services/applicationService"; // Adjust path if needed
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { jwtDecode } from "jwt-decode";
export default function ApplyToJob() {
  const navigate=useNavigate()
  const { jobId } = useParams(); // ✅ Get jobId from URL
  const [email, setEmail] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    // Validate form inputs
    if (!email || !cvFile) {
      setErrorMessage("Email and CV are required.");
      setLoading(false);
      return;
    }

    try {
      if (!jobId) {
        throw new Error("No Job ID found.");
      }

      await applyForJob({
        email,
        jobId,
        cv: cvFile,
      });

      setSuccessMessage("Application submitted successfully! An Email will be sent to you soon");
      setEmail("");
      setCvFile(null);
    } catch (error) {
      setErrorMessage(error.message || "Failed to apply.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-45 p-6 bg-white shadow-md rounded-lg ">
      <h2 className="text-2xl font-bold mb-6 text-center">Apply for this Job</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cv">Upload your CV (PDF)</Label>
          <Input
            id="cv"
            type="file"
            accept=".pdf"
            onChange={(e) => setCvFile(e.target.files[0])}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Submitting..." : "Submit Application"}
        </Button>

        {successMessage && (
          <p className="text-green-600 text-center mt-4">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="text-red-600 text-center mt-4">{errorMessage}</p>
        )}
      </form>
    </div>
  );
}
