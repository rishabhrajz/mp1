import { ethers } from "ethers";
import abi from "../abi/Claims.json";

const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

export default function useClaimsContract() {
  if (!window.ethereum) throw new Error("MetaMask required");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi.abi, signer);

  return contract;
}