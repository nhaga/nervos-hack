import Web3 from 'web3'
import AuctionJSON from '../../build/contracts/Auction.json'

const DEFAULT_SEND_OPTIONS = {
    gas: 6000000
}

export class ContractWrapper {
  constructor (web3) {
    this.contract = new web3.eth.Contract(AuctionJSON.abi)
    }
  
    async deploy (auctionParams, fromAddress) {
        const contract = await this.contract
            .deploy({
                data: AuctionJSON.bytecode,
                arguments: auctionParams
            })
          .send({
              ...DEFAULT_SEND_OPTIONS,
              from: fromAddress,
              to: '0x0000000000000000000000000000000000000000'
            })

    this.useDeployed(contract.contractAddress)
    return contract._address
    
    }
  
    useDeployed(contractAddress) {
        this.address = contractAddress
        this.contract.options.address = contractAddress
    }

  
  
    async getAuctionName(fromAddress) {
      return await this.contract.methods.name()
        .call({
          ...DEFAULT_SEND_OPTIONS,
          from: fromAddress,
          to: '0x0000000000000000000000000000000000000000'
        })
    }

    async getAuctionEnd(fromAddress) {
      return await this.contract.methods.auctionEnd()
        .call({
          ...DEFAULT_SEND_OPTIONS,
          from: fromAddress
        })
    }

    async getHighBidder(fromAddress) {
      return await this.contract.methods.highBidder()
        .call({
          ...DEFAULT_SEND_OPTIONS,
          from: fromAddress
        })
    }
  
  async getLockedAmount (fromAddress) {
    return await this.contract.methods.balanceOf(fromAddress)
      .call({
        ...DEFAULT_SEND_OPTIONS,
        from: fromAddress
    })
  }
  
  async getHighBid (highBidder, fromAddress) {
    return await this.contract.methods.balanceOf(highBidder)
      .call({
        ...DEFAULT_SEND_OPTIONS,
        from: fromAddress
      })
    }

    async sendBid(bid, fromAddress) {
      const tx = await this.contract.methods.bid(bid).send({
          ...DEFAULT_SEND_OPTIONS,
          from: fromAddress,
          value: Web3.utils.toWei('2', 'ether')
        });

        return tx;
    }
  
    async withdraw(fromAddress) {
      const tx = await this.contract.methods.withdraw().send({
          ...DEFAULT_SEND_OPTIONS,
          from: fromAddress,
        });
        return tx;
    }  
  
}