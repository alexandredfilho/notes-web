<template>
  <ToastList :toasts="toasts" />

  <main class="mx-auto max-w-6xl px-6 py-8">
    <div class="mb-6 flex items-center justify-end gap-3">
      <span class="text-xs font-semibold uppercase tracking-[0.2em] text-ocean-500">
        {{ t("localeLabel") }}
      </span>
      <div class="flex items-center gap-2 rounded-full border border-ocean-100 bg-white p-1 shadow-sm">
        <button
          type="button"
          class="flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition"
          :class="locale === 'pt-BR' ? 'bg-ocean-900 text-white' : 'text-ocean-600'"
          @click="setLocale('pt-BR')"
        >
          <svg viewBox="0 0 24 16" class="h-4 w-6" aria-hidden="true">
            <rect width="24" height="16" fill="#1f8a3d" />
            <polygon points="12,2 22,8 12,14 2,8" fill="#f5d000" />
            <circle cx="12" cy="8" r="3.2" fill="#1c4b61" />
          </svg>
          BR
        </button>
        <button
          type="button"
          class="flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition"
          :class="locale === 'en' ? 'bg-ocean-900 text-white' : 'text-ocean-600'"
          @click="setLocale('en')"
        >
          <svg viewBox="0 0 24 16" class="h-4 w-6" aria-hidden="true">
            <rect width="24" height="16" fill="#b91c1c" />
            <rect y="2" width="24" height="2" fill="#ffffff" />
            <rect y="6" width="24" height="2" fill="#ffffff" />
            <rect y="10" width="24" height="2" fill="#ffffff" />
            <rect y="14" width="24" height="2" fill="#ffffff" />
            <rect width="10" height="8" fill="#1d4ed8" />
          </svg>
          EN
        </button>
      </div>
    </div>

    <div class="lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
      <section class="rounded-3xl border border-ocean-100 bg-white p-8 shadow-glow">
      <header class="space-y-3">
        <p class="text-xs uppercase tracking-[0.3em] text-ocean-500">{{ t("eyebrow") }}</p>
        <h1 class="text-4xl font-semibold text-ocean-900">{{ t("appTitle") }}</h1>
        <p class="text-ocean-600">{{ t("subtitle") }}</p>
      </header>

      <form class="mt-10 space-y-6" @submit.prevent="handleSubmit">
        <label class="block space-y-2 text-sm font-medium text-ocean-700">
          {{ t("titleLabel") }}
          <input
            v-model.trim="form.title"
            type="text"
            :placeholder="t('titlePlaceholder')"
            :class="[
              'w-full rounded-2xl border px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-ocean-300',
              errors.length ? 'border-ember-500' : 'border-ocean-100'
            ]"
          />
        </label>

        <label class="block space-y-2 text-sm font-medium text-ocean-700">
          {{ t("contentLabel") }}
          <textarea
            v-model.trim="form.content"
            rows="4"
            :placeholder="t('contentPlaceholder')"
            class="w-full rounded-2xl border border-ocean-100 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-ocean-300"
          ></textarea>
        </label>

        <div class="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            :disabled="loading"
            class="rounded-full bg-ocean-900 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-ocean-800 disabled:cursor-wait disabled:opacity-60"
          >
            {{ editingId ? t("update") : t("save") }}
          </button>
          <span v-if="loading" class="text-sm text-ocean-500">{{ t("saving") }}</span>
        </div>

      </form>
      </section>

    <section class="mt-8 rounded-3xl border border-ocean-100 bg-white p-8 shadow-glow lg:mt-0">
      <header class="flex items-baseline justify-between">
        <h2 class="text-2xl font-semibold text-ocean-900">{{ t("listTitle") }}</h2>
        <p class="text-sm text-ocean-500">{{ t("records", notes.length) }}</p>
      </header>

      <div v-if="notes.length === 0" class="py-10 text-sm text-ocean-500">
        {{ t("empty") }}
      </div>

      <ul v-else class="mt-6 space-y-4">
        <li
          v-for="note in notes"
          :key="note.id"
          class="rounded-2xl border border-ocean-100 bg-ocean-50 px-5 py-4"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <h3 class="text-lg font-semibold text-ocean-900">{{ note.title }}</h3>
              <p v-if="note.content" class="mt-2 text-sm text-ocean-600">
                {{ note.content }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="rounded-full border border-ocean-100 p-2 text-ocean-600 transition hover:border-ocean-200 hover:text-ocean-900"
                @click="startEdit(note)"
                :aria-label="t('edit')"
              >
                <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                </svg>
              </button>
              <button
                type="button"
                class="rounded-full border border-ember-500/40 p-2 text-ember-600 transition hover:border-ember-600 hover:text-ember-700"
                @click="openDeleteDialog(note)"
                :aria-label="t('remove')"
              >
                <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18" />
                  <path d="M8 6V4h8v2" />
                  <path d="M6 6l1 14h10l1-14" />
                </svg>
              </button>
            </div>
          </div>
          <span class="mt-4 inline-block text-xs uppercase tracking-[0.2em] text-ocean-400">
            {{ formatDate(note.created_at) }}
          </span>
        </li>
      </ul>
      </section>
    </div>

    <div
      v-if="confirmDeleteOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
    >
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-glow">
        <h3 class="text-xl font-semibold text-ocean-900">{{ t("confirmTitle") }}</h3>
        <p class="mt-2 text-sm text-ocean-600">
          {{ t("confirmText") }}
        </p>
        <div class="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            class="rounded-full border border-ocean-200 px-4 py-2 text-sm font-semibold text-ocean-700 transition hover:border-ocean-300 hover:text-ocean-900"
            @click="closeDeleteDialog"
          >
            {{ t("cancel") }}
          </button>
          <button
            type="button"
            class="rounded-full bg-ember-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-ember-700"
            @click="confirmDelete"
          >
            {{ t("delete") }}
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { isAxiosError } from "axios";
import { createNote, deleteNote, listNotes, updateNote, type Note } from "./core/api";
import ToastList from "./components/ToastList.vue";
import { locale, setLocale, t, type Locale } from "./utils/i18n";

const notes = ref<Note[]>([]);
const errors = ref<string[]>([]);
const loading = ref(false);
const editingId = ref<number | null>(null);
const confirmDeleteOpen = ref(false);
const noteToDelete = ref<Note | null>(null);
const toasts = ref<{ id: string; message: string; type: "success" | "error"; detail?: string | null }[]>([]);

const form = reactive<{ title: string; content: string }>({
  title: "",
  content: ""
});

const fetchNotes = async () => {
  try {
    notes.value = await listNotes();
  } catch {
    pushToast(t("toastLoadError"), "error");
  }
};

const handleSubmit = async () => {
  errors.value = [];
  loading.value = true;

  try {
    if (editingId.value) {
      const updated = await updateNote(editingId.value, {
        title: form.title,
        content: form.content || null
      });
      notes.value = notes.value.map((note) =>
        note.id === updated.id ? updated : note
      );
      editingId.value = null;
    pushToast(t("toastUpdate"), "success");
    } else {
      const created = await createNote({
        title: form.title,
        content: form.content || null
      });
      notes.value = [created, ...notes.value];
      pushToast(t("toastCreate"), "success");
    }
    form.title = "";
    form.content = "";
  } catch (error) {
    const apiErrors = isAxiosError(error) ? error.response?.data?.errors : null;
    errors.value = Array.isArray(apiErrors) ? apiErrors : [t("toastSaveError")];
    pushToast(errors.value[0], "error");
  } finally {
    loading.value = false;
  }
};

const startEdit = (note: Note) => {
  editingId.value = note.id;
  form.title = note.title;
  form.content = note.content || "";
  errors.value = [];
};

const openDeleteDialog = (note: Note) => {
  noteToDelete.value = note;
  confirmDeleteOpen.value = true;
};

const closeDeleteDialog = () => {
  confirmDeleteOpen.value = false;
  noteToDelete.value = null;
};

const confirmDelete = async () => {
  const current = noteToDelete.value;
  if (!current) return;

  try {
    await deleteNote(current.id);
    notes.value = notes.value.filter((item) => item.id !== current.id);
    pushToast(t("toastDelete"), "success", current.title);
  } catch {
    const message = t("toastDeleteError");
    errors.value = [message];
    pushToast(message, "error");
  } finally {
    closeDeleteDialog();
  }
};

const pushToast = (
  message: string,
  type: "success" | "error",
  detail: string | null = null
) => {
  const id = crypto.randomUUID();
  toasts.value = [...toasts.value, { id, message, type, detail }];
  setTimeout(() => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  }, 3000);
};

const localeMap: Record<Locale, string> = {
  "pt-BR": "pt-BR",
  en: "en-US"
};

const formatDate = (value: string) =>
  new Date(value).toLocaleString(localeMap[locale.value] || "pt-BR", {
    dateStyle: "medium",
    timeStyle: "short"
  });

onMounted(fetchNotes);
</script>
