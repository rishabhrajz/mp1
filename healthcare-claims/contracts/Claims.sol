// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Claims is Ownable {
    enum Status { Pending, Approved, Rejected, Settled }

    struct Claim {
        uint256 id;
        address patient;
        address provider;
        uint256 amount;
        string docHash;
        Status status;
        uint256 createdAt;
    }

    mapping(uint256 => Claim) public claims;
    uint256 public nextClaimId;

    event ClaimSubmitted(uint256 id, address patient, address provider, uint256 amount, string docHash);
    event ClaimApproved(uint256 id);
    event ClaimRejected(uint256 id);
    event ClaimSettled(uint256 id);

    function submitClaim(address patient, uint256 amount, string memory docHash) external {
        claims[nextClaimId] = Claim(nextClaimId, patient, msg.sender, amount, docHash, Status.Pending, block.timestamp);
        emit ClaimSubmitted(nextClaimId, patient, msg.sender, amount, docHash);
        nextClaimId++;
    }

    function approveClaim(uint256 claimId) external onlyOwner {
        claims[claimId].status = Status.Approved;
        emit ClaimApproved(claimId);
    }

    function rejectClaim(uint256 claimId) external onlyOwner {
        claims[claimId].status = Status.Rejected;
        emit ClaimRejected(claimId);
    }

    function settleClaim(uint256 claimId) external onlyOwner {
        claims[claimId].status = Status.Settled;
        emit ClaimSettled(claimId);
    }

    function getClaim(uint256 claimId) external view returns (Claim memory) {
        return claims[claimId];
    }
}