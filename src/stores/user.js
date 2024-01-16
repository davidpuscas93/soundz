import { defineStore } from "pinia";
import { auth, usersCollection } from "@/includes/firebase";

export default defineStore("user", {
  state: () => ({
    userLoggedIn: false,
  }),
  actions: {
    async register(data) {
      const { name, email, password, age, country, artistOrListener } = data;

      const credentials = await auth.createUserWithEmailAndPassword(email, password);

      await usersCollection.doc(credentials.user.uid).set({
        name,
        email,
        age,
        country,
        artistOrListener,
      });

      await credentials.user.updateProfile({
        displayName: name,
      });

      this.userLoggedIn = true;
    },
    async login(data) {
      const { email, password } = data;

      await auth.signInWithEmailAndPassword(email, password);

      this.userLoggedIn = true;
    },
    async logout() {
      await auth.signOut();

      this.userLoggedIn = false;
    },
  },
});
