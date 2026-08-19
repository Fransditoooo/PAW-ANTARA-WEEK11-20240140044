class Store {
  constructor(initialState = {}) {
    this.state = initialState;
    this.listeners = [];
  }

  getState() {
    return this.state;
  }

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

  subscribe(listener) {
    this.listeners.push(listener);

    return () => {
      this.listeners = this.listeners.filter(
        (item) => item !== listener
      );
    };
  }
}


// ===============================
// THEME STORE
// ===============================

const themeStore = new Store({
  theme: localStorage.getItem("theme") || "light",
});


// ===============================
// CART STORE
// ===============================

let savedCart = [];

try {
  savedCart = JSON.parse(
    localStorage.getItem("cart") || "[]"
  );

  if (!Array.isArray(savedCart)) {
    savedCart = [];
  }
} catch (error) {
  savedCart = [];
}

const cartStore = new Store({
  items: savedCart,
});


// ===============================
// PRODUCT STORE
// ===============================

const productStore = new Store({
  products: Array.isArray(window.initialProducts)
    ? window.initialProducts
    : [],

  filter: "all",

  searchQuery: "",

  sort: "default",
});