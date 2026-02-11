<template>
  <div class="fixed right-6 top-6 z-50 space-y-3">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="[
        'flex items-start gap-3 rounded-2xl px-4 py-3 text-sm font-semibold shadow-glow transition',
        toast.type === 'success'
          ? 'bg-emerald-600 text-white'
          : 'bg-ember-600 text-white'
      ]"
    >
      <span class="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/15">
        <svg
          v-if="toast.type === 'success'"
          viewBox="0 0 24 24"
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
        <svg
          v-else
          viewBox="0 0 24 24"
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
          <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </span>
      <div>
        <p>{{ toast.message }}</p>
        <p v-if="toast.detail" class="mt-1 text-xs font-medium text-white/80">
          {{ toast.detail }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export type Toast = {
  id: string;
  message: string;
  type: "success" | "error";
  detail?: string | null;
};

defineProps<{ toasts: Toast[] }>();
</script>
