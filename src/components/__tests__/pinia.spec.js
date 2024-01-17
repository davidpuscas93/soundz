import { setActivePinia, createPinia } from "pinia";

import useUserStore from "@/stores/user";

vi.mock("@/includes/firebase", () => ({
  auth: {
    signInWithEmailAndPassword: () => Promise.resolve(),
  },
}));

describe("User Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  test("login user", async () => {
    const userStore = useUserStore();

    expect(userStore.userLoggedIn).not.toBe(true);

    await userStore.login({});

    expect(userStore.userLoggedIn).toBe(true);
  });
});
