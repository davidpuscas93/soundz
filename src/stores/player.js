import { defineStore } from "pinia";
import { Howl } from "howler";
import helpers from "@/includes/helpers";

export default defineStore("player", {
  state: () => ({
    currentSong: null,
    sound: {},
    seek: "0:00",
    duration: "0:00",
    playerProgress: "0%",
  }),
  getters: {
    playing: (state) => {
      if (state.sound.playing) {
        return state.sound.playing();
      }

      return false;
    },
  },
  actions: {
    async newSong(song) {
      if (this.sound instanceof Howl) {
        this.sound.unload();
      }
      this.currentSong = song;
      this.sound = new Howl({
        src: [song.url],
        html5: true,
      });
    },
    async toggleAudio() {
      if (!this.sound.playing) {
        return;
      }

      if (this.sound.playing()) {
        this.sound.pause();
      } else {
        this.sound.play();
        this.sound.on("play", () => {
          requestAnimationFrame(this.progress);
        });
      }
    },
    progress() {
      this.seek = helpers.formatTime(this.sound.seek());
      this.duration = helpers.formatTime(this.sound.duration());

      this.playerProgress = `${(this.sound.seek() / this.sound.duration()) * 100}%`;

      if (this.sound.playing) {
        requestAnimationFrame(this.progress);
      }
    },
    updateSeek(event) {
      if (!this.sound.playing()) {
        return;
      }

      const { x, width } = event.currentTarget.getBoundingClientRect();
      const clickX = event.clientX - x;

      const percentage = clickX / width;
      const seconds = this.sound.duration() * percentage;

      this.sound.seek(seconds);
      this.sound.once("seek", () => this.progress());
    },
  },
});
