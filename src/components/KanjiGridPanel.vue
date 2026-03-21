<script setup>
defineProps({
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

const emit = defineEmits(['update:grid-search', 'update:grid-status']);
</script>

<template>
  <section class="rounded-2xl border border-white/10 bg-slate-900/90 p-6 shadow-xl">
    <h2 class="text-2xl font-bold">Lista completa</h2>

    <div class="my-4 grid gap-3 sm:grid-cols-[1fr_220px]">
      <label class="text-sm text-slate-300">
        Buscar
        <input
          :value="gridSearch"
          type="search"
          placeholder="kanji, leitura ou significado"
          class="mt-1 w-full rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100"
          @input="emit('update:grid-search', $event.target.value)"
        >
      </label>

      <label class="text-sm text-slate-300">
        Status
        <select
          :value="gridStatusFilter"
          class="mt-1 w-full rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100"
          @change="emit('update:grid-status', $event.target.value)"
        >
          <option value="all">Todos</option>
          <option value="known">Sabia</option>
          <option value="unknown">Não sabia</option>
          <option value="unmarked">Sem marcação</option>
        </select>
      </label>
    </div>

    <p class="mb-3 text-sm text-slate-400">
      {{ gridFilteredData.length }} resultado{{ gridFilteredData.length === 1 ? '' : 's' }}
    </p>

    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <article
        v-for="item in gridFilteredData"
        :key="item.id"
        class="rounded-2xl border border-white/10 bg-white/5 p-4"
      >
        <div class="mb-2 text-5xl leading-none">{{ item.kanji }}</div>
        <p class="text-sm text-slate-300"><strong class="text-slate-100">Significado:</strong> {{ item.meaning }}</p>
        <p class="text-sm text-slate-300"><strong class="text-slate-100">Leitura:</strong> {{ item.reading }}</p>
        <p class="text-sm text-slate-300"><strong class="text-slate-100">Dica:</strong> {{ item.hintText }}</p>
        <p class="text-sm text-slate-300"><strong class="text-slate-100">Fonte:</strong> lição {{ item.lesson }}, p. {{ item.page }}</p>
        <p class="text-sm text-slate-300"><strong class="text-slate-100">Status:</strong> {{ getProgressState(item.id) }}</p>
      </article>

      <article
        v-if="!gridFilteredData.length"
        class="col-span-full rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-slate-400"
      >
        Nenhum kanji encontrado com os filtros atuais.
      </article>
    </div>
  </section>
</template>
