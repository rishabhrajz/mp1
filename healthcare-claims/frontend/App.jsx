import React, { useState } from "react";
import PatientTab from "./components/PatientTab";
import ProviderTab from "./components/ProviderTab";
import InsurerTab from "./components/InsurerTab";

function App() {
  const [tab, setTab] = useState("provider");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Decentralized Health Insurance Claims</h1>
      <div className="flex justify-center gap-4 mb-4">
        <button onClick={() => setTab("patient")} className="px-4 py-2 bg-blue-200 rounded">Patient</button>
        <button onClick={() => setTab("provider")} className="px-4 py-2 bg-green-200 rounded">Provider</button>
        <button onClick={() => setTab("insurer")} className="px-4 py-2 bg-yellow-200 rounded">Insurer</button>
      </div>
      {tab === "patient" && <PatientTab />}
      {tab === "provider" && <ProviderTab />}
      {tab === "insurer" && <InsurerTab />}
    </div>
  );
}

export default App;