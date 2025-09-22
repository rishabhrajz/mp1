import React, { useState } from "react";
import useClaimsContract from "../hooks/useClaimsContract";

export default function PatientTab() {
  const contract = useClaimsContract();
  const [claimId, setClaimId] = useState("");
  const [claim, setClaim] = useState(null);

  const fetchClaim = async () => {
    try {
      const data = await contract.getClaim(claimId);
      setClaim({
        id: data.id.toString(),
        patient: data.patient,
        provider: data.provider,
        amount: ethers.utils.formatEther(data.amount),
        status: ["Pending", "Approved", "Rejected", "Settled"][data.status],
        createdAt: new Date(data.createdAt * 1000).toLocaleString(),
      });
    } catch (err) {
      console.error(err);
      setClaim(null);
    }
  };

  return (
    <div className="p-4 bg-blue-50 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">My Claims (Patient)</h2>
      <input className="border p-2 w-full mb-2" placeholder="Enter Claim ID" value={claimId} onChange={(e) => setClaimId(e.target.value)} />
      <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={fetchClaim}>Fetch Claim</button>
      {claim && (
        <div className="mt-4 border p-3 rounded bg-white">
          <p><b>Claim ID:</b> {claim.id}</p>
          <p><b>Provider:</b> {claim.provider}</p>
          <p><b>Amount:</b> {claim.amount} ETH</p>
          <p><b>Status:</b> <span className="font-semibold">{claim.status}</span></p>
          <p><b>Submitted At:</b> {claim.createdAt}</p>
        </div>
      )}
    </div>
  );
}