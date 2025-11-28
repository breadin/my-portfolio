<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const n = 120; // max tiles
const palette = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#84cc16",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

const allTiles = Array.from({ length: n }, (_, i) => ({
  id: i,
  title: `Tile ${i + 1}`,
  color: palette[i % palette.length],
}));

const sample = ref(allTiles.slice(0, 12)); // visible tiles
const container = ref(null);

const cols = ref(3);
const rows = ref(3);

function recalcLayout() {
  if (!container.value) return;

  const width = container.value.clientWidth || 800;
  const tileWidth = 140; // approximate width of one tile in px

  // How many columns can we fit in the container?
  const maxCols = Math.max(1, Math.floor(width / tileWidth));
  cols.value = maxCols;

  // How many rows you want visually
  rows.value = 3;

  const count = Math.min(n, cols.value * rows.value);
  sample.value = allTiles.slice(0, count);
}

onMounted(() => {
  recalcLayout();
  if (typeof window !== "undefined") {
    window.addEventListener("resize", recalcLayout);
  }
});

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("resize", recalcLayout);
  }
});
</script>

<template>
  <section
    ref="container"
    class="mx-auto my-8 w-full max-w-4xl rounded-xl border border-dashed border-black/10 bg-white/80 p-4 shadow-sm"
  >
    <header class="mb-4 flex flex-wrap items-center justify-between gap-2">
      <h2 class="text-lg font-semibold text-slate-800">
        ExamplesGrid
      </h2>

      <div class="flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span>tiles: {{ sample.length }} / {{ allTiles.length }}</span>
        <span>cols: {{ cols }}</span>
        <span>rows: {{ rows }}</span>
      </div>
    </header>

    <!-- Normal grid, no absolute positioning -->
    <div
      class="grid gap-3"
      :style="{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }"
    >
      <div
        v-for="tile in sample"
        :key="tile.id"
        class="flex h-24 flex-col items-center justify-center rounded-lg shadow-md text-xs font-medium text-white transition-transform duration-150 hover:scale-105 hover:shadow-lg"
        :style="{ backgroundColor: tile.color }"
      >
        <span>{{ tile.title }}</span>
        <span class="mt-1 opacity-80">#{{ tile.id }}</span>
      </div>
    </div>
  </section>
</template>
