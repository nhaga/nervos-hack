<template>
  <div class="">
    <label class="block text-sm text-gray-00 overflow-ellipsis"
      >Your Polyjiuce address</label
    >
    {{ polyjuiceAccount }}
  </div>
  <div class="mt-4">
    <label class="block text-sm text-gray-00 overflow-ellipsis"
      >Your ETH address</label
    >
    {{ account }}
  </div>
  <div class="mt-4">
    <label class="block text-sm text-gray-600" for="cus_email">Balance</label>
    {{ balance }}
  </div>
</template>

<script>
export default {
  props: ['polyjuiceAccount', 'account', 'balance']

}
</script>

<style>
</style>