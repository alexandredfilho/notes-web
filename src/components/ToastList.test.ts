import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import ToastList, { type Toast } from "./ToastList.vue";

describe("ToastList", () => {
  it("renders success and error toasts with optional detail", () => {
    const toasts: Toast[] = [
      {
        id: "1",
        message: "Note created successfully.",
        type: "success",
        detail: "Shopping list"
      },
      {
        id: "2",
        message: "Unable to save note.",
        type: "error"
      }
    ];

    const wrapper = mount(ToastList, { props: { toasts } });
    const rows = wrapper.findAll("div.fixed > div");

    expect(rows).toHaveLength(2);
    expect(rows[0].classes()).toContain("bg-emerald-600");
    expect(rows[1].classes()).toContain("bg-ember-600");
    expect(wrapper.text()).toContain("Note created successfully.");
    expect(wrapper.text()).toContain("Shopping list");
    expect(wrapper.text()).toContain("Unable to save note.");
  });
});
