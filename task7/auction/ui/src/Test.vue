<template>
  <div class="flex">
    {{ web3 }}
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { createWeb3 } from "./getWeb3"

export default {
  setup () {
    let web3 = ref(null)

    onMounted(async () => {
      web3.value = await createWeb3()
    })

    return { web3 }

  }

}
</script>

<style>
</style>