<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['click']);
</script>

<template>
  <button
    type="button"
    class="action-main"
    :disabled="disabled"
    @click="emit('click')"
  >
    {{ label }}
  </button>
</template>
