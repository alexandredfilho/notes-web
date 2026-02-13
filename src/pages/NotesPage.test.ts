import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import NotesPage from "./NotesPage.vue";
import * as api from "../core/api";

vi.mock("../core/api", () => ({
  listNotes: vi.fn(),
  createNote: vi.fn(),
  updateNote: vi.fn(),
  deleteNote: vi.fn()
}));

const mockedApi = vi.mocked(api);

const baseNote = {
  id: 1,
  title: "Nota inicial",
  content: "Conteudo inicial",
  created_at: "2026-01-10T10:00:00.000Z",
  updated_at: "2026-01-10T10:00:00.000Z"
};

describe("NotesPage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    mockedApi.listNotes.mockResolvedValue([]);
    mockedApi.createNote.mockResolvedValue(baseNote);
    mockedApi.updateNote.mockResolvedValue(baseNote);
    mockedApi.deleteNote.mockResolvedValue();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("loads and renders existing notes on mount", async () => {
    mockedApi.listNotes.mockResolvedValueOnce([baseNote]);

    const wrapper = mount(NotesPage);
    await flushPromises();

    expect(mockedApi.listNotes).toHaveBeenCalledTimes(1);
    expect(wrapper.text()).toContain("Nota inicial");
    expect(wrapper.text()).toContain("1 registro(s)");
  });

  it("creates a new note and shows success toast", async () => {
    const created = {
      ...baseNote,
      id: 9,
      title: "Nova nota",
      content: "Conteudo novo"
    };
    mockedApi.createNote.mockResolvedValueOnce(created);

    const wrapper = mount(NotesPage);
    await flushPromises();

    await wrapper.find("input[type='text']").setValue("Nova nota");
    await wrapper.find("textarea").setValue("Conteudo novo");
    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    expect(mockedApi.createNote).toHaveBeenCalledWith({
      title: "Nova nota",
      content: "Conteudo novo"
    });
    expect(wrapper.text()).toContain("Nova nota");
    expect(wrapper.text()).toContain("Anotação criada com sucesso.");
  });

  it("edits an existing note and shows update toast", async () => {
    const updated = {
      ...baseNote,
      title: "Titulo atualizado",
      content: "Conteudo atualizado"
    };
    mockedApi.listNotes.mockResolvedValueOnce([baseNote]);
    mockedApi.updateNote.mockResolvedValueOnce(updated);

    const wrapper = mount(NotesPage);
    await flushPromises();

    await wrapper.find('button[aria-label="Editar anotação"]').trigger("click");
    await wrapper.find("input[type='text']").setValue("Titulo atualizado");
    await wrapper.find("textarea").setValue("Conteudo atualizado");
    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    expect(mockedApi.updateNote).toHaveBeenCalledWith(1, {
      title: "Titulo atualizado",
      content: "Conteudo atualizado"
    });
    expect(wrapper.text()).toContain("Titulo atualizado");
    expect(wrapper.text()).toContain("Anotação atualizada com sucesso.");
  });

  it("opens delete confirmation and removes note when confirmed", async () => {
    mockedApi.listNotes.mockResolvedValueOnce([baseNote]);

    const wrapper = mount(NotesPage);
    await flushPromises();

    await wrapper.find('button[aria-label="Excluir anotação"]').trigger("click");
    expect(wrapper.text()).toContain("Confirmar exclusão");

    const modal = wrapper.find("div.fixed.inset-0");
    const confirmButton = modal
      .findAll("button")
      .find((button) => button.text().trim() === "Excluir");
    expect(confirmButton).toBeDefined();

    await confirmButton!.trigger("click");
    await flushPromises();

    expect(mockedApi.deleteNote).toHaveBeenCalledWith(1);
    expect(wrapper.text()).toContain("Nenhuma anotação encontrada.");
    expect(wrapper.text()).toContain("Anotação excluída com sucesso.");
  });

  it("shows load error toast when list request fails", async () => {
    mockedApi.listNotes.mockRejectedValueOnce(new Error("fail"));

    const wrapper = mount(NotesPage);
    await flushPromises();

    expect(wrapper.text()).toContain("Não foi possível carregar as anotações.");
  });

  it("shows API validation error when create fails", async () => {
    mockedApi.createNote.mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        data: {
          errors: ["Título é obrigatório"]
        }
      }
    });

    const wrapper = mount(NotesPage);
    await flushPromises();

    await wrapper.find("input[type='text']").setValue(" ");
    await wrapper.find("textarea").setValue("qualquer");
    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    expect(wrapper.text()).toContain("Título é obrigatório");
  });
});
