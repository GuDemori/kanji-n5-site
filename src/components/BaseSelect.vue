<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import arrowDownIcon from '../arrow-down.svg';

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  wrapperClass: {
    type: String,
    default: 'space-y-1 text-sm text-slate-300',
  },
  buttonClass: {
    type: String,
    default: 'w-full',
  },
});

const emit = defineEmits(['update:modelValue']);
const open = ref(false);
const root = ref(null);

const selectedLabel = computed(() => {
  const selected = props.options.find(option => option.value === props.modelValue);
  return selected ? selected.label : '';
});

function selectOption(value) {
  emit('update:modelValue', value);
  open.value = false;
}

function handleOutsideClick(event) {
  if (!open.value || !root.value || root.value.contains(event.target)) return;
  open.value = false;
}

function handleKeydown(event) {
  if (event.key === 'Escape') {
    open.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick);
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div ref="root" :class="wrapperClass">
    <p v-if="label">{{ label }}</p>

    <div class="relative" :class="buttonClass">
      <button
        type="button"
        class="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 text-left text-slate-100"
        :aria-expanded="String(open)"
        @click="open = !open"
      >
        <span class="truncate">{{ selectedLabel }}</span>
        <img
          :src="arrowDownIcon"
          alt=""
          class="h-3 w-3 shrink-0 brightness-0 invert opacity-60"
          aria-hidden="true"
        >
      </button>

      <div
        v-if="open"
        class="absolute left-0 top-full z-30 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-slate-950 shadow-xl"
      >
        <button
          v-for="option in options"
          :key="option.value"
          type="button"
          class="block w-full px-3 py-2 text-left text-sm text-slate-100 hover:bg-sky-500/20 focus:bg-sky-500/20 focus:outline-none"
          :class="modelValue === option.value ? 'bg-sky-500/20 font-semibold text-sky-100' : ''"
          @click="selectOption(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>
  </div>
</template>
