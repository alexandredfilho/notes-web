import { beforeEach, describe, expect, it, vi } from "vitest";

const mockClient = {
  interceptors: {
    request: {
      use: vi.fn()
    }
  },
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn()
};

vi.mock("axios", () => ({
  default: {
    create: vi.fn(() => mockClient)
  }
}));

describe("notes api", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("registers locale request interceptor", async () => {
    localStorage.setItem("notes_locale", "en");

    await import("./index");

    expect(mockClient.interceptors.request.use).toHaveBeenCalledTimes(1);
    const interceptor = mockClient.interceptors.request.use.mock.calls[0][0] as (
      config: { headers?: Record<string, string> }
    ) => { headers?: Record<string, string> };
    const config = interceptor({ headers: {} });

    expect(config.headers?.["Accept-Language"]).toBe("en");
  });

  it("maps listNotes JSON:API response", async () => {
    const { listNotes } = await import("./index");
    mockClient.get.mockResolvedValueOnce({
      data: {
        data: [
          {
            id: "7",
            type: "notes",
            attributes: {
              title: "Buy milk",
              content: "2 liters",
              created_at: "2026-01-01T10:00:00Z",
              updated_at: "2026-01-01T10:00:00Z"
            }
          }
        ]
      }
    });

    const notes = await listNotes();

    expect(mockClient.get).toHaveBeenCalledWith("/notes");
    expect(notes).toEqual([
      {
        id: 7,
        title: "Buy milk",
        content: "2 liters",
        created_at: "2026-01-01T10:00:00Z",
        updated_at: "2026-01-01T10:00:00Z"
      }
    ]);
  });

  it("wraps payload and maps create/update responses", async () => {
    const { createNote, updateNote } = await import("./index");
    mockClient.post.mockResolvedValueOnce({
      data: {
        data: {
          id: "3",
          type: "notes",
          attributes: {
            title: "Title",
            content: null,
            created_at: "2026-01-02T10:00:00Z",
            updated_at: "2026-01-02T10:00:00Z"
          }
        }
      }
    });
    mockClient.patch.mockResolvedValueOnce({
      data: {
        data: {
          id: "3",
          type: "notes",
          attributes: {
            title: "Updated title",
            content: "Body",
            created_at: "2026-01-02T10:00:00Z",
            updated_at: "2026-01-02T11:00:00Z"
          }
        }
      }
    });

    const created = await createNote({ title: "Title", content: null });
    const updated = await updateNote(3, { title: "Updated title", content: "Body" });

    expect(mockClient.post).toHaveBeenCalledWith("/notes", {
      note: { title: "Title", content: null }
    });
    expect(mockClient.patch).toHaveBeenCalledWith("/notes/3", {
      note: { title: "Updated title", content: "Body" }
    });
    expect(created.id).toBe(3);
    expect(updated.title).toBe("Updated title");
  });

  it("calls delete endpoint", async () => {
    const { deleteNote } = await import("./index");
    mockClient.delete.mockResolvedValueOnce(undefined);

    await deleteNote(9);

    expect(mockClient.delete).toHaveBeenCalledWith("/notes/9");
  });
});
