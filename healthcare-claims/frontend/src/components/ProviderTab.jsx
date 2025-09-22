import React, { useState } from "react";
import useClaimsContract from "../hooks/useClaimsContract";

export default function ProviderTab() {
  const contract = useClaimsContract();
  const [patient, setPatient] = useState("");
  const [vc, setVc] = useState("");
  const [amount, setAmount] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    try {
      setStatus("Verifying VC...");
      const verifyRes = await fetch("http://localhost:5000/vc/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issuer: "did:insurer", subject: patient })
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.valid) {
        setStatus("Invalid VC ❌");
        return;
      }

      setStatus("Uploading file...");
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();

      setStatus("Submitting claim...");
      const tx = await contract.submitClaim(patient, ethers.utils.parseEther(amount), uploadData.hash);
      await tx.wait();

      setStatus("Claim submitted ✅");
    } catch (err) {
      console.error(err);
      setStatus("Error submitting claim ❌");
    }
  };

  return (
    <div className="p-4 bg-green-50 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Submit Claim (Provider)</h2>
      <input className="border p-2 w-full mb-2" placeholder="Patient Address/DID" value={patient} onChange={(e) => setPatient(e.target.value)} />
      <textarea className="border p-2 w-full mb-2" placeholder="Paste Insurance VC" value={vc} onChange={(e) => setVc(e.target.value)} />
      <input className="border p-2 w-full mb-2" type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <input className="mb-2" type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={handleSubmit}>Submit Claim</button>
      <p className="mt-2">{status}</p>
    </div>
  );
}