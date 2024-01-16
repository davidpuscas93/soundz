<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-md font-bold">{{ song.modifiedName }}</h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click.prevent="deleteSong"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="showForm = !showForm"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-show="showForm">
      <div
        v-if="editStatus.showAlert"
        class="text-white text-center font-bold p-4 mb-4"
        :class="editStatus.alertVariant"
      >
        {{ editStatus.alertMessage }}
      </div>
      <vee-form :validation-schema="schema" @submit="edit" :initial-values="song">
        <div class="mb-3">
          <label class="inline-block mb-2">{{ $t("manage.songInfo") }}</label>
          <vee-field
            name="modifiedName"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            :placeholder="$t('manage.songInfoPlaceholder')"
            @input="updateUnsavedFlag(true)"
          />
          <error-message class="text-red-600 text-sm" name="modifiedName" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">{{ $t("manage.genre") }}</label>
          <vee-field
            name="genre"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            :placeholder="$t('manage.genrePlaceholder')"
            @input="updateUnsavedFlag(true)"
          />
          <error-message class="text-red-600 text-sm" name="genre" />
        </div>
        <div class="flex gap-2">
          <button
            type="submit"
            :disabled="editStatus.inProgress"
            class="py-1.5 px-3 rounded text-white bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ $t("common.save") }}
          </button>
          <button
            type="button"
            :disabled="editStatus.inProgress"
            class="py-1.5 px-3 rounded text-white bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            @click.prevent="showForm = false"
          >
            {{ $t("common.cancel") }}
          </button>
        </div>
      </vee-form>
    </div>
  </div>
</template>

<script>
import { songsCollection, storage } from "@/includes/firebase";

export default {
  name: "AppCompositionItem",
  props: {
    song: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    updateSong: {
      type: Function,
      required: true,
    },
    removeSong: {
      type: Function,
      required: true,
    },
    updateUnsavedFlag: {
      type: Function,
    },
  },
  data() {
    return {
      showForm: false,
      schema: {
        modifiedName: "required",
        genre: "alpha_spaces",
      },
      editStatus: {
        inProgress: false,
        showAlert: false,
        alertVariant: "bg-blue-500",
        alertMessage: this.$t("manage.updating"),
      },
    };
  },
  methods: {
    async edit(values) {
      this.editStatus = {
        inProgress: true,
        showAlert: false,
        alertVariant: "bg-blue-500",
        alertMessage: this.$t("manage.updating"),
      };

      try {
        const { modifiedName, genre } = values;
        await songsCollection.doc(this.song.docId).update({
          modifiedName,
          genre,
        });
      } catch (error) {
        this.editStatus = {
          inProgress: false,
          showAlert: true,
          alertVariant: "bg-red-500",
          alertMessage: this.$t("common.error"),
        };
        console.error(error);
        return;
      }

      this.updateSong(this.index, values);
      this.updateUnsavedFlag(false);

      this.editStatus = {
        inProgress: false,
        showAlert: true,
        alertVariant: "bg-green-500",
        alertMessage: this.$t("manage.updated"),
      };
    },
    async deleteSong() {
      try {
        const storageRef = storage.ref();
        const songRef = storageRef.child(`songs/${this.song.originalName}`);
        await songRef.delete();
        await songsCollection.doc(this.song.docId).delete();
        this.removeSong(this.index);
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
