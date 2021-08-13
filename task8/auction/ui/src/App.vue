<template>
  <div class="flex items-start justify-center h-screen bg-gray-100">
    <div class="w-1/3 m-4 p-10 bg-white rounded shadow-xl">
      <AccountInfo
        :polyjuiceAccount="polyjuiceAccount"
        :account="account"
        :balance="balance"
      ></AccountInfo>

      <div class="mt-4">
        <label class="block text-sm text-gray-00"
          >Layer 2 Deposit Address on Layer 1</label
        >

        <input
          class="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded"
          v-model="layer2DepositAddress"
        />
      </div>

      <div class="mt-4 w-full flex">
        <a
          class="
            text-center
            bg-green-200
            rounded-md
            w-full
            py-2
            px-2
            select-none
            hover:bg-gray-600
            hover:text-white
            focus:outline-none
            focus:shadow-outline
          "
          target="_blank"
          :href="`https://force-bridge-test.ckbapp.dev/bridge/Ethereum/Nervos?xchain-asset=${account}`"
        >
          Open Force Bridge</a
        >
      </div>

      <div class="mt-4">
        <label class="block text-sm text-gray-00">Sudt Balance</label>

        <input
          class="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded"
          v-model="sudtBalance"
        />
      </div>
      <div class="mt-4 w-full flex">
        <a
          class="
            text-center
            bg-gray-200
            rounded-md
            w-full
            py-2
            px-2
            select-none
            hover:bg-gray-600
            hover:text-white
            focus:outline-none
            focus:shadow-outline
          "
          @click="getSudtBalance"
          >Get Balance</a
        >
      </div>

      <!-- If Contract is defined -->
      <div v-if="!contractAddress">
        <div
          class="
            flex
            items-center
            flex-wrap
            pb-4
            mb-4
            border-b-2 border-gray-100
            mt-auto
            w-full
          "
        ></div>

        <div class="font-semibold text-2xl mb-6">Contract Configuration</div>

        {{ contractAddress }}
        <div class="w-full text-center mx-auto">
          <button
            type="button"
            class="
              bg-gray-200
              rounded-md
              px-4
              py-2
              m-2
              select-none
              hover:bg-gray-600
              hover:text-white
              focus:outline-none
              focus:shadow-outline
            "
            :class="{ 'bg-gray-700 text-white': !useDeployed }"
            @click="useDeployed = false"
          >
            New contract
          </button>
          <button
            type="button"
            class="
              bg-gray-200
              rounded-md
              px-4
              py-2
              m-2
              select-none
              hover:bg-gray-600
              hover:text-white
              focus:outline-none
              focus:shadow-outline
            "
            :class="{ 'bg-gray-700 text-white': useDeployed }"
            @click="useDeployed = true"
          >
            Use Deployed
          </button>
        </div>

        <div class="mt-4" v-if="useDeployed">
          <label class="block text-sm text-gray-00"
            >Deployed contract address</label
          >
          <input
            class="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded text-sm"
            type="text"
            v-model="deployedContractAddress"
          />
        </div>

        <div v-if="!useDeployed">
          <div class="mt-6 font-semibold">Params</div>
          <div class="mt-4">
            <label class="block text-sm text-gray-00"
              >Auction Name (min 10 chars.)</label
            >
            <input
              class="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded"
              v-model="auctionName"
            />
          </div>
          <div class="mt-2">
            <label class="block text-sm text-gray-00">Timeout Period</label>
            <input
              class="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded"
              type="number"
              v-model="timeoutPriod"
            />
          </div>
        </div>

        <div class="mt-4" v-if="!useDeployed">
          <button
            class="
              px-4
              py-2
              text-white
              font-light
              tracking-wider
              bg-gray-900
              rounded-md
              w-full
            "
            @click="deployContract"
          >
            Deploy
          </button>
        </div>
        <div class="mt-4" v-else>
          <button
            class="
              px-4
              py-2
              text-white
              font-light
              tracking-wider
              bg-gray-900
              rounded-md
              w-full
            "
            @click="useContract"
          >
            Use
          </button>
        </div>
      </div>
    </div>

    <div
      class="w-1/3 m-4 p-10 bg-white rounded shadow-xl"
      v-if="contractAddress"
    >
      <div class="flex justify-between font-semibold text-2xl mb-6">
        <div>
          <span class="text-gray-500 text-lg">Auction </span>
          {{ deployedAuctionName }}
        </div>
        <div>
          <button @click="contractAddress = null" class="text-gray-700">
            x
          </button>
        </div>
      </div>
      <p>Deployed Contract</p>
      <span class="text-sm text-gray-500">{{ contractAddress }}</span>

      <div class="mt-4">
        <label class="block text-sm text-gray-600" for="cus_email"
          >Highest Bid</label
        >
        <input
          readonly
          class="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded"
          v-model="highBid"
        />
      </div>

      <div class="mt-4">
        <label class="block text-sm text-gray-600" for="cus_email"
          >Highest Bidder</label
        >
        <input
          readonly
          class="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded"
          v-model="highBidder"
        />
      </div>

      <div class="mt-4">
        <label class="block text-sm text-gray-600" for="cus_email"
          >Auction End</label
        >
        <input
          readonly
          class="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded"
          v-model="auctionEnd"
        />
      </div>

      <div class="mt-4">
        <label class="block text-sm text-gray-600" for="cus_email"
          >Time to End</label
        >
        <input
          readonly
          class="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded"
          v-model="timeToEnd"
        />
      </div>

      <div class="mt-4">
        <label class="block text-sm text-gray-600" for="cus_email">My</label>
        <input
          readonly
          class="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded"
          v-model="lockedAmount"
        />
      </div>

      <button
        type="button"
        class="
          bg-gray-200
          rounded-md
          px-4
          py-2
          m-2
          select-none
          hover:bg-gray-600
          hover:text-white
          focus:outline-none
          focus:shadow-outline
        "
        @click="getAuctionInfo"
      >
        Get Info
      </button>

      <div
        class="
          flex
          items-center
          flex-wrap
          pb-4
          mb-4
          border-b-2 border-gray-100
          mt-auto
          w-full
        "
      ></div>

      <div class="mt-2 flex items-stretch">
        <div class="flex px-2 h-10 items-center text-sm text-gray-00">Bid</div>
        <div class="px-6">
          <input
            class="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded h-10"
            type="number"
            v-model="bidValue"
          />
        </div>
        <div>
          <button
            class="
              px-4
              text-white
              font-light
              tracking-wider
              bg-gray-900
              h-10
              rounded-md
              w-28
            "
            @click="placeBid"
          >
            Bid
          </button>
        </div>
      </div>

      <div
        class="
          flex
          items-center
          flex-wrap
          pb-4
          mb-4
          border-b-2 border-gray-100
          mt-auto
          w-full
        "
      ></div>

      <button
        class="
          mt-4
          px-4
          py-2
          text-white
          font-light
          tracking-wider
          bg-gray-900
          rounded-md
          w-full
        "
        @click="withdraw"
      >
        Withdraw
      </button>
    </div>
  </div>
</template>

<script>
import AccountInfo from './components/AccountInfo.vue'
import { ref, computed, watch, onMounted } from 'vue'
import { ContractWrapper } from './ContractWrapper.js'
import { AddressTranslator } from 'nervos-godwoken-integration'
import { createWeb3 } from "./getWeb3"
const CompiledContractArtifact = require(`.//ERC20.json`)


export default {
  name: 'App',
  components: {
    AccountInfo
  },
  setup () {



    const account = ref('')
    const polyjuiceAccount = computed(() => {
      if (account.value.length > 0) {
        const addressTranslator = new AddressTranslator()
        return addressTranslator.ethAddressToGodwokenShortAddress(account.value)
      } else {
        return ''
      }
    })


    const layer2DepositAddress = ref('')

    watch(account, (val) => {
      const addressTranslator = new AddressTranslator()
      addressTranslator.getLayer2DepositAddress(web3.value, val)
        .then(resp => layer2DepositAddress.value = resp.addressString)
    })


    const sudtBalance = ref('')
    const getSudtBalance = async function () {
      const SUDT_PROXY_CONTRACT_ADDRESS = '0xFbEb2b8090F6d00E710b5CCB99613148b14Cf5f1'
      const contract = new web3.value.eth.Contract(CompiledContractArtifact.abi, SUDT_PROXY_CONTRACT_ADDRESS)
      sudtBalance.value = await contract.methods.balanceOf(polyjuiceAccount.value).call({
        from: account.value
      })

    }




    const balance = ref(0)
    const deployed = ref(false)
    const useDeployed = ref(false)

    const deployedContractAddress = ref('0x28aC325e763651d44bBf14D77540ca4397400EdA')
    const contractAddress = ref(null)
    let web3 = ref(null)

    const auctionName = ref('Test Nervos Auction')
    const timeoutPriod = ref(600)
    const auctionLoaded = ref(true)

    const deployedAuctionName = ref(null)

    onMounted(async () => {
      web3.value = await createWeb3()
      loadInfo()

    })


    async function loadInfo () {
      const coinbase = window.ethereum.selectedAddress //await web3.value.eth.getCoinbase()
      const bal = await web3.value.eth.getBalance(coinbase)
      account.value = coinbase
      balance.value = bal // web3.value.utils.fromWei(bal, 'ether')
    }


    async function deployContract () {
      const _contract = new ContractWrapper(web3.value)

      try {
        contractAddress.value = await _contract.deploy(
          [auctionName.value, timeoutPriod.value],
          account.value)

        console.log(contractAddress.value)

      } catch (error) {
        console.error(error)
        console.log('There was an error sending your transaction. Please check developer console.')

      }
    }

    function useContract () {
      console.log(deployedContractAddress)
      contractAddress.value = deployedContractAddress.value

    }

    const highBid = ref(null)
    const highBidder = ref(null)
    const auctionEnd = ref(null)
    const lockedAmount = ref(null)

    async function getAuctionInfo () {
      const _contract = new ContractWrapper(web3.value)
      _contract.useDeployed(contractAddress.value)
      deployedAuctionName.value = await _contract.getAuctionName()
      highBidder.value = await _contract.getHighBidder()
      highBid.value = await _contract.getHighBid(highBidder.value)
      auctionEnd.value = await _contract.getAuctionEnd()
      lockedAmount.value = await _contract.getLockedAmount(account.value)
    }

    const currentTimestamp = ref(null)
    watch(currentTimestamp, () => {

      setTimeout(() => {
        currentTimestamp.value = Date.now()
      }, 1000)
    },
      { immediate: true })

    const timeToEnd = computed(() => {
      let seconds = Math.max(auctionEnd.value - currentTimestamp.value / 1000, 0)
      return Math.floor(seconds)
    })


    const bidValue = ref(0)

    async function placeBid () {
      const _contract = new ContractWrapper(web3.value)
      _contract.useDeployed(contractAddress.value)
      const tx = await _contract.sendBid(bidValue.value, account.value)
      console.log(tx)
    }

    async function withdraw () {
      const _contract = new ContractWrapper(web3.value)
      _contract.useDeployed(contractAddress.value)
      const tx = await _contract.withdraw(account.value)
      console.log(tx)

    }

    return {
      polyjuiceAccount,
      deployedContractAddress,
      layer2DepositAddress,
      account, balance, useDeployed,
      deployed, contractAddress,
      deployContract, useContract,
      auctionName, timeoutPriod,
      auctionLoaded,
      deployedAuctionName,
      getAuctionInfo,
      highBid, highBidder,
      auctionEnd, lockedAmount,
      bidValue, placeBid, withdraw,
      timeToEnd, getSudtBalance, sudtBalance
    }

  }
}
</script>

<style>
</style>
