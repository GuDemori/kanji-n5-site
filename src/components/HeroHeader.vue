<script setup>
defineProps({
  sessionSummary: {
    type: String,
    required: true,
  },
  totalCount: {
    type: Number,
    required: true,
  },
  knownCount: {
    type: Number,
    required: true,
  },
  unknownCount: {
    type: Number,
    required: true,
  },
  helpOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['toggle-help']);
</script>

<template>
  <header class="mb-5 grid gap-5 md:grid-cols-[1fr_280px]">
    <div>
      <div class="mb-2 inline-flex items-center gap-2" data-help-wrap>
        <p class="text-xs font-semibold uppercase tracking-[0.12em] text-sky-300">JLPT N5</p>

        <div class="relative">
          <button
            type="button"
            class="grid h-6 w-6 place-items-center rounded-full border border-slate-300 text-slate-200"
            :aria-expanded="String(helpOpen)"
            aria-label="Mostrar ajuda"
            @click="emit('toggle-help')"
          >
            ?
          </button>
          <div
            v-if="helpOpen"
            class="absolute left-0 top-9 z-20 w-[min(360px,calc(100vw-48px))] rounded-2xl border border-white/10 bg-slate-900/95 p-3 text-xs text-slate-300 shadow-2xl"
          >
            <p><strong class="text-slate-100">Quiz:</strong> 1-4 responde, Enter vai para próxima e Esc fecha feedback.</p>
            <p><strong class="text-slate-100">Navegação:</strong> setas esquerda/direita avançam e voltam os cards.</p>
            <p><strong class="text-slate-100">Lista:</strong> use busca e status para filtrar revisão.</p>
          </div>
        </div>
      </div>

      <h1 class="text-4xl font-black tracking-tight text-slate-50 md:text-5xl">Treino de identificação de kanji</h1>
      <p class="mt-2 max-w-3xl text-slate-400">Feito com o intuito de praticar o reconhecimento de kanji.</p>

      <p class="mt-4 inline-flex rounded-full border border-sky-300/35 bg-sky-400/15 px-3 py-1 text-sm text-sky-200">
        {{ sessionSummary }}
      </p>
    </div>

    <div class="grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-slate-900/85 p-4 shadow-xl">
      <div class="rounded-xl bg-white/5 p-3 text-center">
        <strong class="block text-2xl">{{ totalCount }}</strong>
        <span class="text-sm text-slate-400">kanji</span>
      </div>
      <div class="rounded-xl bg-white/5 p-3 text-center">
        <strong class="block text-2xl">{{ knownCount }}</strong>
        <span class="text-sm text-slate-400">sabia</span>
      </div>
      <div class="rounded-xl bg-white/5 p-3 text-center">
        <strong class="block text-2xl">{{ unknownCount }}</strong>
        <span class="text-sm text-slate-400">não sabia</span>
      </div>
    </div>
  </header>
</template>
