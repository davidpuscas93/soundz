<template>
  <li
    class="flex justify-between items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50 snapshot"
    :id="`song-id-${song.docId}`"
    :class="`song-class-${song.docId}`"
  >
    <div>
      <router-link
        :to="{ name: 'Song', params: { id: song.docId } }"
        class="font-bold block text-gray-600 composition-name"
      >
        {{ song.modifiedName }}
      </router-link>
      <span class="text-gray-500 text-sm">{{ song.displayName }}</span>
    </div>

    <div class="text-gray-600 text-lg">
      <router-link
        custom
        :to="{ name: 'Song', params: { id: song.docId }, hash: '#comments' }"
        v-slot="{ navigate }"
      >
        <span class="comments" @click="navigate">
          <i class="fa fa-comments text-gray-600"></i>
          {{ song.commentCount }}
        </span>
      </router-link>
    </div>
  </li>
</template>

<script>
export default {
  name: "AppSongItem",
  props: {
    song: {
      type: Object,
      required: true,
    },
  },
};
</script>
