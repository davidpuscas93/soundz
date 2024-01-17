import { shallowMount, RouterLinkStub } from "@vue/test-utils";

import AppSongItem from "@/components/AppSongItem.vue";

describe("AppSongItem.vue", () => {
  test("renders song.displayName", () => {
    const song = {
      displayName: "Test Song",
    };

    const wrapper = shallowMount(AppSongItem, {
      props: { song },
      global: {
        components: {
          "router-link": RouterLinkStub,
        },
      },
    });

    const compositionAuthor = wrapper.find(".text-gray-500");

    expect(compositionAuthor.text()).toBe(song.displayName);
  });

  test("renders song.docId in id attribute", () => {
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

    expect(wrapper.attributes().id).toBe(`song-id-${song.docId}`);
  });

  test("renders song.docId in class attribute", () => {
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

    expect(wrapper.classes()).toContain(`song-class-${song.docId}`);
  });
});
