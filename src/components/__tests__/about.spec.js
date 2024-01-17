import { shallowMount } from "@vue/test-utils";

import AboutView from "@/views/AboutView.vue";

describe("AboutView.vue", () => {
  test("renders inner text", () => {
    // const wrapper = mount(AboutView, {
    //   shallow: true,
    // });
    const wrapper = shallowMount(AboutView);

    expect(wrapper.text()).toContain("This is an about page.");
  });
});
