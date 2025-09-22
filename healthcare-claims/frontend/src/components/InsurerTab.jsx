import React, { useState } from "react";
import { ethers } from "ethers";
import useClaimsContract from "../hooks/useClaimsContract";

export default function InsurerTab() {
  const contract = useClaimsContract();
  const [claimId, setClaimId] = useState("");
  const [status, setStatus] = useState("");
  const [claim, setClaim] = useState(null);
  const [fetchId, setFetchId] = useState("");

  const fetchClaim = async () => {
    try {
      const data = await contract.getClaim(fetchId);
      const statusMap = ["Submitted", "Approved", "Rejected"];
      setClaim({
        id: fetchId,
        patient: data.patient,
        provider: data.provider,
        amount: ethers.utils.formatEther(data.amount),
        status: statusMap[data.status] || "Unknown"
      });
      setStatus("");
    } catch (err) {
      console.error(err);
      setStatus("Error fetching claim ❌");
      setClaim(null);
    }
  };

  const approve = async () => {
    try {
      const tx = await contract.approveClaim(claimId);
      await tx.wait();
      setStatus("Claim approved ✅");
    } catch (err) {
      console.error(err);
      setStatus("Error approving ❌");
    }
  };

  const reject = async () => {
    try {
      const tx = await contract.rejectClaim(claimId);
      await tx.wait();
      setStatus("Claim rejected ❌");
    } catch (err) {
      console.error(err);
      setStatus("Error rejecting ❌");
    }
  };

  return (
    <div className="p-4 bg-yellow-50 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Review Claims (Insurer)</h2>
      <input className="border p-2 w-full mb-2" placeholder="Enter Claim ID to Fetch" value={fetchId} onChange={(e) => setFetchId(e.target.value)} />
      <button className="mb-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={fetchClaim}>Fetch Claim Details</button>
      {claim && (
        <div className="mb-4 p-4 border rounded bg-white shadow-sm">
          <p><strong>Claim ID:</strong> {claim.id}</p>
          <p><strong>Patient:</strong> {claim.patient}</p>
          <p><strong>Provider:</strong> {claim.provider}</p>
          <p><strong>Amount:</strong> {claim.amount} ETH</p>
          <p><strong>Status:</strong> {claim.status}</p>
        </div>
      )}
      <input className="border p-2 w-full mb-2" placeholder="Enter Claim ID" value={claimId} onChange={(e) => setClaimId(e.target.value)} />
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={approve}>Approve</button>
        <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={reject}>Reject</button>
      </div>
      <p className="mt-2">{status}</p>
    </div>
  );
}