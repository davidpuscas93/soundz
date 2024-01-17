import { shallowMount, RouterLinkStub } from "@vue/test-utils";

import AppSongItem from "@/components/AppSongItem.vue";

describe("Router", () => {
  test("renders router link", () => {
    const song = {
      docId: "abc",
    };

    const wrapper = shallowMount(AppSongItem, {
      props: { song },
      global: {
        components: {
          "router-link": RouterLinkStub,
        },
      },
    });

    expect(wrapper.findComponent(RouterLinkStub).props().to).toEqual({
      name: "Song",
      params: { id: song.docId },
    });
  });
});
