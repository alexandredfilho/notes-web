import { isAxiosError } from "axios";
import { onMounted, reactive, ref } from "vue";
import { createNote, deleteNote, listNotes, updateNote, type Note } from "../core/api";
import { locale, t, type Locale } from "../utils/i18n";

type Toast = {
  id: string;
  message: string;
  type: "success" | "error";
  detail?: string | null;
};

export const useNotes = () => {
  const notes = ref<Note[]>([]);
  const errors = ref<string[]>([]);
  const loading = ref(false);
  const editingId = ref<number | null>(null);
  const confirmDeleteOpen = ref(false);
  const noteToDelete = ref<Note | null>(null);
  const toasts = ref<Toast[]>([]);

  const form = reactive<{ title: string; content: string }>({
    title: "",
    content: ""
  });

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
        notes.value = notes.value.map((note) => (note.id === updated.id ? updated : note));
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

  return {
    notes,
    errors,
    loading,
    editingId,
    confirmDeleteOpen,
    toasts,
    form,
    handleSubmit,
    startEdit,
    openDeleteDialog,
    closeDeleteDialog,
    confirmDelete,
    formatDate
  };
};
