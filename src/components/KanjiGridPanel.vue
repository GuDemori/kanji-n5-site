<script setup>
import { computed } from 'vue';
import { useI18n } from '../i18n';

const emit = defineEmits(['update:grid-search', 'update:grid-status']);
const { t } = useI18n();

const props = defineProps({
  gridSearch: {
    type: String,
    required: true,
  },
  gridStatusFilter: {
    type: String,
    required: true,
  },
  gridFilteredData: {
    type: Array,
    required: true,
  },
  getProgressState: {
    type: Function,
    required: true,
  },
});

const resultsLabel = computed(() => {
  if (props.gridFilteredData.length === 1) {
    return t('grid.resultOne', { count: 1 });
  }
  return t('grid.resultMany', { count: props.gridFilteredData.length });
});
</script>

<template>
  <section class="rounded-2xl border border-white/10 bg-slate-900/90 p-6 shadow-xl">
    <h2 class="text-2xl font-bold">{{ t('grid.title') }}</h2>

    <div class="my-4 grid gap-3 sm:grid-cols-[1fr_220px]">
      <label class="text-sm text-slate-300">
        {{ t('grid.search') }}
        <input
          :value="gridSearch"
          type="search"
          :placeholder="t('grid.searchPlaceholder')"
          class="mt-1 w-full rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100"
          @input="emit('update:grid-search', $event.target.value)"
        >
      </label>

      <label class="text-sm text-slate-300">
        {{ t('grid.status') }}
        <select
          :value="gridStatusFilter"
          class="mt-1 w-full rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100"
          @change="emit('update:grid-status', $event.target.value)"
        >
          <option value="all">{{ t('grid.statusAll') }}</option>
          <option value="known">{{ t('grid.statusKnown') }}</option>
          <option value="unknown">{{ t('grid.statusUnknown') }}</option>
          <option value="unmarked">{{ t('grid.statusUnmarked') }}</option>
        </select>
      </label>
    </div>

    <p class="mb-3 text-sm text-slate-400">{{ resultsLabel }}</p>

    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <article
        v-for="item in gridFilteredData"
        :key="item.id"
        class="rounded-2xl border border-white/10 bg-white/5 p-4"
      >
        <div class="mb-2 text-5xl leading-none">{{ item.kanji }}</div>
        <p class="text-sm text-slate-300"><strong class="text-slate-100">{{ t('grid.meaning') }}</strong> {{ item.meaning }}</p>
        <p class="text-sm text-slate-300"><strong class="text-slate-100">{{ t('grid.kunReading') }}</strong> {{ item.kunReading }}</p>
        <p class="text-sm text-slate-300"><strong class="text-slate-100">{{ t('grid.onReading') }}</strong> {{ item.onReading }}</p>
        <p class="text-sm text-slate-300"><strong class="text-slate-100">{{ t('grid.hint') }}</strong> {{ item.hintText }}</p>
        <p class="text-sm text-slate-300"><strong class="text-slate-100">{{ t('grid.source') }}</strong> {{ t('grid.lessonPage', { lesson: item.lesson, page: item.page }) }}</p>
        <p class="text-sm text-slate-300"><strong class="text-slate-100">{{ t('grid.statusLabel') }}</strong> {{ getProgressState(item.id) }}</p>
      </article>

      <article
        v-if="!gridFilteredData.length"
        class="col-span-full rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-slate-400"
      >
        {{ t('grid.noResults') }}
      </article>
    </div>
  </section>
</template>
