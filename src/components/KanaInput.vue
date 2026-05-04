<script setup>
import tradeIcon from '../trade.svg';

defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  showScriptToggle: {
    type: Boolean,
    default: false,
  },
  switchTitle: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue', 'toggle-script', 'enter']);
</script>

<template>
  <div class="relative">
    <input
      :value="modelValue"
      type="text"
      :placeholder="placeholder"
      :disabled="disabled"
      lang="ja"
      class="w-full rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
      :class="{ 'pr-11': showScriptToggle }"
      @input="emit('update:modelValue', $event.target.value)"
      @keyup.enter="emit('enter')"
    >
    <button
      v-if="showScriptToggle"
      type="button"
      class="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      :title="switchTitle"
      :aria-label="switchTitle"
      :disabled="disabled"
      @click="emit('toggle-script')"
    >
      <img :src="tradeIcon" alt="" class="h-4 w-4 brightness-0 invert opacity-95">
    </button>
  </div>
</template>
