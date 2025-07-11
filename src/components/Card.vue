<template>
  <div class="bg-white p-4 rounded shadow flex flex-col items-center text-center">
    <h3 class="text-sm text-gray-600 mb-1">{{ title }}</h3>
    <p class="text-3xl font-bold mb-2">{{ count }}</p>
    <button class="text-sm bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">
      {{ button }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  count: [String, Number],
  button: String
})
</script>
