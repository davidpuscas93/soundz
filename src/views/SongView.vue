<template>
  <main>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      ></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          type="button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
          @click.prevent="toggleAudio"
        >
          <i class="fas" :class="{ 'fa-play': !playing, 'fa-pause': playing }"></i>
        </button>
        <div class="z-0 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ song.modifiedName }}</div>
          <div>{{ song.genre }}</div>
          <div class="song-price">{{ $n(1.99, "currency") }}</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6" id="comments">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title">{{
            $tc("song.comments", song.commentCount, {
              count: song.commentCount,
            })
          }}</span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <div
            class="text-white text-center font-bold p-4 mb-4"
            :class="commentStatus.alertVariant"
            v-if="commentStatus.showAlert"
          >
            {{ commentStatus.alertMessage }}
          </div>
          <vee-form :validation-schema="schema" @submit="addComment" v-if="userLoggedIn">
            <vee-field
              as="textarea"
              name="comment"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Your comment here..."
            />
            <error-message class="text-red-600 text-sm" name="comment" />
            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block transition disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="commentStatus.inProgress"
            >
              Submit
            </button>
          </vee-form>
          <!-- Sort Comments -->
          <select
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            v-model="sort"
          >
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto">
      <li
        class="p-6 bg-gray-50 border border-gray-200"
        v-for="comment in sortedComments"
        :key="comment.docId"
      >
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.name }}</div>
          <time>{{ comment.createdAt }}</time>
        </div>

        <p>{{ comment.content }}</p>
      </li>
    </ul>
  </main>
</template>

<script>
import { mapState, mapActions } from "pinia";

import { songsCollection, commentsCollection, auth } from "@/includes/firebase";
import usePlayerStore from "@/stores/player";
import useUserStore from "@/stores/user";

export default {
  name: "SongView",
  data() {
    return {
      song: {},
      songId: this.$route.params.id,
      schema: {
        comment: "required|min:3",
      },
      commentStatus: {
        inProgress: false,
        showAlert: false,
        alertVariant: "bg-blue-500",
        alertMessage: "Adding comment...",
      },
      comments: [],
      sort: "1",
    };
  },
  computed: {
    ...mapState(useUserStore, ["userLoggedIn"]),
    ...mapState(usePlayerStore, ["playing"]),
    sortedComments() {
      return this.comments.slice().sort((a, b) => {
        if (this.sort === "1") {
          return new Date(b.createdAt) - new Date(a.createdAt);
        } else {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
      });
    },
  },
  async beforeRouteEnter(to, from, next) {
    const songSnapshot = await songsCollection.doc(to.params.id).get();

    next((vm) => {
      if (!songSnapshot.exists) {
        vm.$router.push({ name: "Home" });
        return;
      }

      const { sort } = vm.$route.query;

      vm.sort = sort === "1" || sort === "2" ? sort : "1";

      vm.song = songSnapshot.data();
      vm.getComments();
      vm.newSong(vm.song);
    });
  },
  methods: {
    ...mapActions(usePlayerStore, {
      newSong: "newSong",
      toggleAudio: "toggleAudio",
    }),
    async addComment(values, { resetForm }) {
      this.commentStatus = {
        inProgress: true,
        showAlert: true,
        alertVariant: "bg-blue-500",
        alertMessage: "Adding comment...",
      };

      const comment = {
        content: values.comment,
        createdAt: new Date().toString(),
        sid: this.songId,
        name: auth.currentUser.displayName,
        uid: auth.currentUser.uid,
      };

      try {
        await commentsCollection.add(comment);
      } catch (error) {
        this.commentStatus = {
          inProgress: false,
          showAlert: true,
          alertVariant: "bg-red-500",
          alertMessage: "Something went wrong! Please try again later.",
        };
        console.error(error);
        return;
      }

      this.commentStatus = {
        inProgress: false,
        showAlert: true,
        alertVariant: "bg-green-500",
        alertMessage: "Comment added!",
      };

      this.song.commentCount += 1;

      await songsCollection.doc(this.songId).update({
        commentCount: this.song.commentCount,
      });

      this.getComments();

      resetForm();
    },
    async getComments() {
      const commentSnapshots = await commentsCollection.where("sid", "==", this.songId).get();

      this.comments = [];
      commentSnapshots.forEach((doc) => {
        this.comments.push({
          docId: doc.id,
          ...doc.data(),
        });
      });
    },
  },
  watch: {
    sort(newVal) {
      if (newVal === this.$route.query.sort) {
        return;
      }

      this.$router.push({
        query: { sort: newVal },
      });
    },
  },
};
</script>
