// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.3;

contract Auction {
    address public seller;

    string public name;
    uint256 public timeoutPeriod;
    uint256 public auctionEnd;
    bool public auctionEnded;

    address public highBidder;
    mapping(address => uint256) public balanceOf;

    event Bid(address highBidder, uint256 highBid);

    constructor(string memory _name, uint256 _timeoutPeriod) {
        require(bytes(_name).length > 10, "Poor description");
        name = _name;
        timeoutPeriod = _timeoutPeriod;
        seller = msg.sender;
        auctionEnd = block.timestamp + timeoutPeriod;
    }

    function bid(uint256 amount) public payable {
        require(block.timestamp < auctionEnd, "Auction is ended");
        require(
            amount >= balanceOf[highBidder],
            "Bid amount does not reach highest bid"
        );

        balanceOf[msg.sender] += msg.value;
        //require(
        //    balanceOf[msg.sender] == amount,
        //    "Escrowed amount is different of bid"
        //);

        highBidder = msg.sender;

        auctionEnd = block.timestamp + timeoutPeriod;

        emit Bid(highBidder, amount);
    }

    function withdraw() public returns (bool) {
        uint256 amount = balanceOf[msg.sender];
        if (amount > 0) {
            // It is important to set this to zero because the recipient
            // can call this function again as part of the receiving call
            // before `send` returns.
            balanceOf[msg.sender] = 0;

            if (!payable(msg.sender).send(amount)) {
                // No need to call throw here, just reset the amount owing
                balanceOf[msg.sender] = amount;
                return false;
            }
        }
        return true;
    }

    function endAuction() public {
        require(block.timestamp >= auctionEnd, "Auction not yet ended.");
        require(!auctionEnded, "auctionEnd has already been called.");

        auctionEnded = true;

        payable(seller).transfer(balanceOf[highBidder]);
    }
}
