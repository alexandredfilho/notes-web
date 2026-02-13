import { beforeEach, describe, expect, it, vi } from "vitest";

const loadI18nModule = async () => import("./i18n");

describe("i18n", () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
  });

  it("uses pt-BR as default locale", async () => {
    const { locale, t } = await loadI18nModule();

    expect(locale.value).toBe("pt-BR");
    expect(t("appTitle")).toBe("Sistema de Anotações");
  });

  it("changes locale and persists it in localStorage", async () => {
    const { locale, setLocale, t } = await loadI18nModule();

    setLocale("en");

    expect(locale.value).toBe("en");
    expect(localStorage.getItem("notes_locale")).toBe("en");
    expect(t("save")).toBe("Save note");
  });

  it("loads locale from localStorage", async () => {
    localStorage.setItem("notes_locale", "en");

    const { locale, t } = await loadI18nModule();

    expect(locale.value).toBe("en");
    expect(t("records", 3)).toBe("3 record(s)");
  });
});
