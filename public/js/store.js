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
      this.listeners =
        this.listeners.filter(
          (item) => item !== listener
        );
    };
  }
}


// ======================================================
// CREATE STORE
// ======================================================
// cart.js dan products.js menggunakan createStore().
// Jangan membuat cartStore/productStore di sini karena
// keduanya sudah dibuat masing-masing di file tersebut.
// ======================================================

function createStore(initialState = {}) {
  return new Store(initialState);
}


// ======================================================
// THEME STORE
// ======================================================
// Theme.js menggunakan themeStore.
// Jadi themeStore memang dibuat di store.js.
// ======================================================

const themeStore = createStore({
  theme:
    localStorage.getItem("theme") || "light",
});