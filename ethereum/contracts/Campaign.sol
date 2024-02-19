// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CampaignFactory {
    address[] public createdCampaigns;

    constructor() {}

    function createCampaign(uint256 min) public {
        address newCampaign = address(new Campaign(min, msg.sender));
        createdCampaigns.push(newCampaign);
    }

    function getCampaigns() public view returns (address[] memory) {
        return createdCampaigns;
    }
}

contract Campaign {
    address public campaignCreator;
    uint256 public minimumContribution;
    uint256 public approversCount;

    struct Request {
        string description;
        uint256 value;
        address payable recipient;
        bool status;
        uint256 voteCount;
        mapping(address => bool) approvals;
    }
    uint256 newRequest;
    mapping(uint256 => Request) public requests;

    mapping(address => bool) public approvers;

    constructor(uint256 min, address creator) {
        campaignCreator = creator;
        minimumContribution = min;
    }

    modifier onlyCreator() {
        require(msg.sender == campaignCreator);
        _;
    }

    function createRequest(
        string memory description,
        uint256 value,
        address recipient
    ) public onlyCreator {
        Request storage request = requests[newRequest++];
        request.description = description;
        request.value = value;
        request.recipient = payable(recipient);
        request.status = false;
        request.voteCount = 0;
    }

    function contribute() public payable {
        require(msg.value >= minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }

    function vote(uint256 num) public {
        Request storage request = requests[num];
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);
        request.voteCount++;
        request.approvals[msg.sender] = true;
    }

    function finaliseRequest(uint256 num) public onlyCreator {
        Request storage request = requests[num];
        require(!request.status);
        require(request.voteCount > (approversCount / 2));
        require(request.value < address(this).balance);

        request.recipient.transfer(request.value);
        request.status = true;
    }
}
