import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import App from "./App.vue";

describe("App", () => {
  it("renders router shell", () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          RouterView: {
            template: "<div data-test='router-view-stub' />"
          }
        }
      }
    });

    expect(wrapper.find("[data-test='router-view-stub']").exists()).toBe(true);
  });
});
