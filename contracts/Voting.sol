// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }
    Candidate[] public candidates;
    address owner;
    mapping(address => bool) public voters;

    uint256 public voteStart;
    uint256 public voteEnd;

    constructor(string[] memory _candidateNames, uint256 _durationMinutes) {
        for (uint256 i = 0; i < _candidateNames.length; i++) {
            candidates.push(Candidate({name: _candidateNames[i], voteCount: 0}));
        }

        owner = msg.sender;
        voteStart = block.timestamp;
        voteEnd = block.timestamp + (_durationMinutes * 1 minutes);
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function addCandidate(string memory _name) public onlyOwner {
        candidates.push(Candidate({name: _name, voteCount: 0}));
    }

    function vote(uint256 _candidateIndex) public {
        require(!voters[msg.sender], "You Have already voted");
        require(_candidateIndex < candidates.length, "Invalid Candidate Index");

        candidates[_candidateIndex].voteCount++;
        voters[msg.sender] = true;
    }

    function getAllVotes() public view returns (Candidate[] memory) {
        return candidates;
    }

    function getVotingStatus() public view returns (bool) {
        return (block.timestamp >= voteStart && block.timestamp < voteEnd);
    }

    function getRemainigTime() public view returns (uint256) {
        require(block.timestamp >= voteStart, "Voting has not started");
        if (block.timestamp >= voteEnd) {
            return 0;
        }
        return voteEnd - block.timestamp;
    }
}
