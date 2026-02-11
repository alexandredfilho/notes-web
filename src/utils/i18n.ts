import { ref } from "vue";

const storageKey = "notes_locale";
const defaultLocale = "pt-BR" as const;

type Locale = "pt-BR" | "en";

type Messages = {
  appTitle: string;
  eyebrow: string;
  subtitle: string;
  titleLabel: string;
  titlePlaceholder: string;
  contentLabel: string;
  contentPlaceholder: string;
  save: string;
  update: string;
  saving: string;
  listTitle: string;
  records: (count: number) => string;
  empty: string;
  edit: string;
  remove: string;
  confirmTitle: string;
  confirmText: string;
  cancel: string;
  delete: string;
  toastLoadError: string;
  toastCreate: string;
  toastUpdate: string;
  toastDelete: string;
  toastSaveError: string;
  toastDeleteError: string;
  localeLabel: string;
};

const messages: Record<Locale, Messages> = {
  "pt-BR": {
    appTitle: "Sistema de Anotações",
    eyebrow: "Anotações",
    subtitle: "Crie e consulte anotações em tempo real.",
    titleLabel: "Título",
    titlePlaceholder: "Digite um título",
    contentLabel: "Conteúdo",
    contentPlaceholder: "Conteúdo opcional",
    save: "Salvar anotação",
    update: "Atualizar anotação",
    saving: "Salvando...",
    listTitle: "Suas anotações",
    records: (count) => `${count} registro(s)` ,
    empty: "Nenhuma anotação encontrada.",
    edit: "Editar anotação",
    remove: "Excluir anotação",
    confirmTitle: "Confirmar exclusão",
    confirmText: "Tem certeza que deseja excluir esta anotação?",
    cancel: "Cancelar",
    delete: "Excluir",
    toastLoadError: "Não foi possível carregar as anotações.",
    toastCreate: "Anotação criada com sucesso.",
    toastUpdate: "Anotação atualizada com sucesso.",
    toastDelete: "Anotação excluída com sucesso.",
    toastSaveError: "Não foi possível salvar a anotação.",
    toastDeleteError: "Não foi possível excluir a anotação.",
    localeLabel: "Idioma"
  },
  en: {
    appTitle: "Notes System",
    eyebrow: "Notes",
    subtitle: "Create and review notes in real time.",
    titleLabel: "Title",
    titlePlaceholder: "Type a title",
    contentLabel: "Content",
    contentPlaceholder: "Optional content",
    save: "Save note",
    update: "Update note",
    saving: "Saving...",
    listTitle: "Your notes",
    records: (count) => `${count} record(s)` ,
    empty: "No notes found.",
    edit: "Edit note",
    remove: "Delete note",
    confirmTitle: "Confirm deletion",
    confirmText: "Are you sure you want to delete this note?",
    cancel: "Cancel",
    delete: "Delete",
    toastLoadError: "Unable to load notes.",
    toastCreate: "Note created successfully.",
    toastUpdate: "Note updated successfully.",
    toastDelete: "Note deleted successfully.",
    toastSaveError: "Unable to save the note.",
    toastDeleteError: "Unable to delete the note.",
    localeLabel: "Language"
  }
};

const locale = ref<Locale>((localStorage.getItem(storageKey) as Locale) || defaultLocale);

const setLocale = (value: Locale) => {
  locale.value = value;
  localStorage.setItem(storageKey, value);
};

type FunctionKeys = {
  [K in keyof Messages]: Messages[K] extends (...args: any[]) => string ? K : never;
}[keyof Messages];

type StringKeys = Exclude<keyof Messages, FunctionKeys>;

function t<K extends StringKeys>(key: K): Messages[K];
function t<K extends FunctionKeys>(key: K, ...args: Parameters<Messages[K]>): string;
function t(key: keyof Messages, ...args: unknown[]) {
  const dict = messages[locale.value] || messages[defaultLocale];
  const entry = dict[key];
  if (typeof entry === "function") {
    return entry(...(args as [number]));
  }
  return entry;
}

export type { Locale, Messages };
export { locale, setLocale, t };
