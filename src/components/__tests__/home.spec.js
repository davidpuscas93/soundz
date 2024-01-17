import HomeView from "@/views/HomeView.vue";
import AppSongItem from "@/components/AppSongItem.vue";

import { shallowMount } from "@vue/test-utils";

describe("HomeView.vue", () => {
  test("renders list of songs", () => {
    const songs = [{}, {}, {}];

    const wrapper = shallowMount(HomeView, {
      data() {
        return {
          songs,
        };
      },
      global: {
        mocks: {
          $t: (message) => message,
        },
      },
    });

    const items = wrapper.findAllComponents(AppSongItem);

    expect(items).toHaveLength(songs.length);

    items.forEach((item, index) => {
      expect(item.props().song).toStrictEqual(songs[index]);
    });
  });
});
