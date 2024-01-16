<template>
  <main>
    <!-- Main Content -->
    <section class="container mx-auto mt-6">
      <div class="md:grid md:grid-cols-3 md:gap-4">
        <div class="col-span-1">
          <app-upload ref="upload" :addSong="addSong" />
        </div>
        <div class="col-span-2">
          <div class="bg-white rounded border border-gray-200 relative flex flex-col">
            <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
              <span class="card-title">{{ $t("manage.title") }}</span>
              <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
            </div>
            <div class="p-6">
              <!-- Composition Items -->
              <app-composition-item
                v-for="(song, index) in songs"
                :key="song.docId"
                :song="song"
                :index="index"
                :updateSong="updateSong"
                :removeSong="removeSong"
                :updateUnsavedFlag="updateUnsavedFlag"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
// import useUserStore from "@/stores/user";
import AppUpload from "@/components/AppUpload.vue";
import AppCompositionItem from "@/components/AppCompositionItem.vue";
import { songsCollection, auth } from "@/includes/firebase";

export default {
  name: "ManageView",
  components: {
    AppUpload,
    AppCompositionItem,
  },
  data() {
    return {
      songs: [],
      unsavedFlag: false,
    };
  },
  async created() {
    const snapshot = await songsCollection.where("uid", "==", auth.currentUser.uid).get();
    snapshot.forEach(this.addSong);
  },
  methods: {
    updateSong(i, values) {
      this.songs[i].modifiedName = values.modifiedName;
      this.songs[i].genre = values.genre;
    },
    removeSong(i) {
      this.songs.splice(i, 1);
    },
    addSong(doc) {
      const song = {
        docId: doc.id,
        ...doc.data(),
      };
      this.songs.push(song);
    },
    updateUnsavedFlag(value) {
      this.unsavedFlag = value;
    },
  },
  // beforeRouteEnter(to, from, next) {
  //   const userStore = useUserStore();

  //   if (userStore.userLoggedIn) {
  //     next();
  //   } else {
  //     next({ name: "Home" });
  //   }
  // },
  beforeRouteLeave(to, from, next) {
    if (!this.unsavedFlag) {
      next();
    } else {
      const leave = confirm(this.$t("common.unsaved"));
      next(leave);
    }
  },
};
</script>
