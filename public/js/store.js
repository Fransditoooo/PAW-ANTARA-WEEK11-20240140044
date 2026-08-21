// ======================================================
// SIMPLE STATE MANAGEMENT
// ======================================================

class Store {
  constructor(initialState = {}) {
    this.state = initialState;
    this.listeners = [];
  }

  // ====================================================
  // GET STATE
  // ====================================================

  getState() {
    return this.state;
  }

  // ====================================================
  // SET STATE
  // ====================================================

  setState(updater) {
    const nextState =
      typeof updater === "function"
        ? updater(this.state)
        : updater;

    this.state = {
      ...this.state,
      ...nextState,
    };

    this.listeners.forEach((listener) => {
      listener(this.state);
    });
  }

  // ====================================================
  // SUBSCRIBE
  // ====================================================

  subscribe(listener) {
    this.listeners.push(listener);

    return () => {
      this.listeners = this.listeners.filter(
        (item) => item !== listener
      );
    };
  }
}


// ======================================================
// CREATE STORE
// ======================================================
// cart.js dan products.js menggunakan createStore().
// Jadi fungsi ini harus tersedia secara global.
// ======================================================

function createStore(initialState = {}) {
  return new Store(initialState);
}


// ======================================================
// THEME STORE
// ======================================================
// theme.js menggunakan themeStore.
// Bagian ini TETAP dipertahankan.
// ======================================================

const themeStore = new Store({
  theme:
    localStorage.getItem("theme") || "light",
});