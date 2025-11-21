import { store } from "@/redux/store";

describe("Redux Store", () => {
  it("should initialize store", () => {
    expect(store).toBeDefined();
    expect(typeof store.getState).toBe("function");
    expect(typeof store.dispatch).toBe("function");
  });

  it("should have auth state", () => {
    const state = store.getState();
    expect(state).toHaveProperty("auth");
  });

  it("should have initial auth state structure", () => {
    const state = store.getState();
    expect(state.auth).toBeDefined();
  });

  it("should allow dispatching actions", () => {
    const dispatch = store.dispatch;
    expect(typeof dispatch).toBe("function");
  });

  it("should subscribe to state changes", () => {
    const unsubscribe = store.subscribe(() => {});
    expect(typeof unsubscribe).toBe("function");
    unsubscribe();
  });
});
