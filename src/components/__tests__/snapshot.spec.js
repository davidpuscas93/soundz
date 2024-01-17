import { shallowMount, RouterLinkStub } from "@vue/test-utils";

import AppSongItem from "@/components/AppSongItem.vue";

describe("Snapshots AppSongItem.vue", () => {
  test("renders correctly", () => {
    const song = {
      docId: "abc",
      modifiedName: "test.mp3",
      displayName: "test",
      commentCount: 10,
    };

    const wrapper = shallowMount(AppSongItem, {
      props: { song },
      global: {
        components: {
          "router-link": RouterLinkStub,
        },
      },
    });

    expect(wrapper.element).toMatchSnapshot();
  });
});
