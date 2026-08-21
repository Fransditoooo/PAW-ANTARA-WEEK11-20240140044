// =====================================================
// LOAD CART
// =====================================================

function loadCartFromStorage() {

  try {

    const saved =
      localStorage.getItem('cart');

    if (!saved) {
      return [];
    }

    const parsed =
      JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;

  } catch (error) {

    console.error(
      'Gagal membaca keranjang:',
      error
    );

    return [];
  }
}

// =====================================================
// CART STORE
// =====================================================

const cartStore = createStore({

  items: loadCartFromStorage(),

  isOpen: false,

});

// =====================================================
// TOTAL QUANTITY
// =====================================================

function getTotalQty(items) {

  return items.reduce(
    (total, item) => {

      const qty =
        Number(item.qty) || 0;

      return total + qty;

    },
    0
  );

}

// =====================================================
// TOTAL PRICE
// =====================================================

function getTotalPrice(items) {

  return items.reduce(
    (total, item) => {

      const price =
        Number(item.price) || 0;

      const qty =
        Number(item.qty) || 0;

      return total + price * qty;

    },
    0
  );

}

// =====================================================
// CART ITEM
// =====================================================

function renderCartItem(item) {

  const price =
    Number(item.price) || 0;

  const qty =
    Number(item.qty) || 0;

  return `

    <div
      class="flex items-center justify-between gap-3
      border-b border-gray-100 dark:border-gray-700
      pb-3"
    >

      <div class="flex-1 min-w-0">

        <p
          class="text-sm font-medium
          text-gray-800 dark:text-gray-100
          truncate"
        >
          ${escapeCartHtml(item.name)}
        </p>

        <p
          class="text-xs
          text-gray-400 dark:text-gray-500"
        >
          Rp${price.toLocaleString('id-ID')}
          / item
        </p>

      </div>

      <div class="flex items-center gap-2">

        <button
          type="button"
          class="cart-decrease
          w-7 h-7 rounded
          bg-gray-100 dark:bg-gray-700
          text-gray-600 dark:text-gray-300
          hover:bg-gray-200
          dark:hover:bg-gray-600"
          data-id="${item.id}"
        >
          −
        </button>

        <span
          class="text-sm w-6
          text-center font-semibold
          text-gray-800 dark:text-gray-100"
        >
          ${qty}
        </span>

        <button
          type="button"
          class="cart-increase
          w-7 h-7 rounded
          bg-gray-100 dark:bg-gray-700
          text-gray-600 dark:text-gray-300
          hover:bg-gray-200
          dark:hover:bg-gray-600"
          data-id="${item.id}"
        >
          +
        </button>

      </div>

    </div>

  `;
}

// =====================================================
// ESCAPE HTML
// =====================================================

function escapeCartHtml(value) {

  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

}

// =====================================================
// RENDER CART
// =====================================================

function renderCart(state) {

  const badge =
    document.getElementById('cart-badge');

  const itemsContainer =
    document.getElementById('cart-items');

  const totalEl =
    document.getElementById('cart-total');

  const drawer =
    document.getElementById('cart-drawer');

  const overlay =
    document.getElementById('cart-overlay');

  if (
    !badge ||
    !itemsContainer ||
    !totalEl ||
    !drawer ||
    !overlay
  ) {

    console.error(
      'Elemen keranjang tidak ditemukan.'
    );

    return;
  }

  const totalQty =
    getTotalQty(state.items);

  const totalPrice =
    getTotalPrice(state.items);

  // ===================================================
  // BADGE
  // ===================================================

  if (totalQty > 0) {

    badge.textContent =
      totalQty > 99
        ? '99+'
        : totalQty;

    badge.classList.remove('hidden');

  } else {

    badge.classList.add('hidden');

  }

  // ===================================================
  // ITEMS
  // ===================================================

  if (state.items.length === 0) {

    itemsContainer.innerHTML = `

      <div
        class="text-center
        text-gray-400
        dark:text-gray-500
        py-10"
      >

        <div class="text-4xl mb-3">
          🛒
        </div>

        <p>
          Keranjang masih kosong
        </p>

      </div>

    `;

  } else {

    itemsContainer.innerHTML =
      state.items
        .map(renderCartItem)
        .join('');

  }

  // ===================================================
  // TOTAL
  // ===================================================

  totalEl.textContent =
    'Rp' +
    totalPrice.toLocaleString('id-ID');

  // ===================================================
  // DRAWER
  // ===================================================

  if (state.isOpen) {

    drawer.classList.remove(
      'translate-x-full'
    );

    overlay.classList.remove(
      'hidden'
    );

  } else {

    drawer.classList.add(
      'translate-x-full'
    );

    overlay.classList.add(
      'hidden'
    );

  }

  // ===================================================
  // LOCAL STORAGE
  // ===================================================

  localStorage.setItem(
    'cart',
    JSON.stringify(state.items)
  );

}

// =====================================================
// SUBSCRIBE
// =====================================================

cartStore.subscribe(renderCart);

// Render pertama
renderCart(
  cartStore.getState()
);

// =====================================================
// ADD TO CART
// =====================================================

function addToCart({
  id,
  name,
  price,
  stock = Infinity,
}) {

  const items =
    cartStore.getState().items;

  const existing =
    items.find(
      (item) =>
        String(item.id) === String(id)
    );

  if (existing) {

    const currentQty =
      Number(existing.qty) || 0;

    const maxStock =
      Number(stock);

    // Jangan melebihi stok
    if (
      Number.isFinite(maxStock) &&
      currentQty >= maxStock
    ) {

      alert(
        `Stok ${name} hanya tersedia ${maxStock} item.`
      );

      return;

    }

    cartStore.setState({

      items: items.map(
        (item) =>

          String(item.id) === String(id)

            ? {
                ...item,
                qty: currentQty + 1,
              }

            : item
      ),

    });

  } else {

    cartStore.setState({

      items: [

        ...items,

        {
          id,
          name,
          price: Number(price),
          qty: 1,
          stock: Number.isFinite(Number(stock))
            ? Number(stock)
            : undefined,
        },

      ],

    });

  }

}

// =====================================================
// CHANGE QUANTITY
// =====================================================

function changeQty(id, delta) {

  const items =
    cartStore.getState().items;

  const updated =
    items
      .map((item) => {

        if (
          String(item.id) !== String(id)
        ) {

          return item;

        }

        const currentQty =
          Number(item.qty) || 0;

        let newQty =
          currentQty + delta;

        // Minimum 1
        if (newQty < 1) {
          newQty = 1;
        }

        // Batasi berdasarkan stok
        const stock =
          Number(item.stock);

        if (
          delta > 0 &&
          Number.isFinite(stock) &&
          newQty > stock
        ) {

          alert(
            `Stok ${item.name} hanya ${stock} item.`
          );

          newQty = stock;

        }

        return {
          ...item,
          qty: newQty,
        };

      });

  cartStore.setState({
    items: updated,
  });

}

// =====================================================
// REMOVE ITEM
// =====================================================

function removeFromCart(id) {

  const items =
    cartStore.getState().items;

  const updated =
    items.filter(
      (item) =>
        String(item.id) !== String(id)
    );

  cartStore.setState({
    items: updated,
  });

}

// =====================================================
// CLEAR CART
// =====================================================

function clearCart() {

  cartStore.setState({
    items: [],
  });

}

// =====================================================
// OPEN CART
// =====================================================

const cartToggle =
  document.getElementById('cart-toggle');

if (cartToggle) {

  cartToggle.addEventListener(
    'click',
    () => {

      cartStore.setState({
        isOpen: true,
      });

    }
  );

}

// =====================================================
// CLOSE CART
// =====================================================

const cartClose =
  document.getElementById('cart-close');

if (cartClose) {

  cartClose.addEventListener(
    'click',
    () => {

      cartStore.setState({
        isOpen: false,
      });

    }
  );

}

// =====================================================
// OVERLAY
// =====================================================

const cartOverlay =
  document.getElementById('cart-overlay');

if (cartOverlay) {

  cartOverlay.addEventListener(
    'click',
    () => {

      cartStore.setState({
        isOpen: false,
      });

    }
  );

}

// =====================================================
// QUANTITY BUTTON
// =====================================================

const cartItems =
  document.getElementById('cart-items');

if (cartItems) {

  cartItems.addEventListener(
    'click',
    (event) => {

      const increaseButton =
        event.target.closest(
          '.cart-increase'
        );

      const decreaseButton =
        event.target.closest(
          '.cart-decrease'
        );

      if (increaseButton) {

        changeQty(
          increaseButton.dataset.id,
          1
        );

        return;

      }

      if (decreaseButton) {

        changeQty(
          decreaseButton.dataset.id,
          -1
        );

      }

    }
  );

}

// =====================================================
// CHECKOUT
// =====================================================

function checkoutCart() {

  const items =
    cartStore.getState().items;

  if (items.length === 0) {

    alert(
      'Keranjang masih kosong. Silakan tambahkan produk terlebih dahulu.'
    );

    return;

  }

  const totalQty =
    getTotalQty(items);

  const totalPrice =
    getTotalPrice(items);

  const confirmation =
    confirm(

      `Konfirmasi Checkout\n\n` +

      `Jumlah produk: ${totalQty} item\n` +

      `Total pembayaran: Rp${totalPrice.toLocaleString('id-ID')}\n\n` +

      `Apakah kamu ingin melanjutkan checkout?`

    );

  if (!confirmation) {
    return;
  }

  // Simpan informasi checkout terakhir
  const checkoutData = {

    items: items,

    totalQty: totalQty,

    totalPrice: totalPrice,

    checkoutAt:
      new Date().toISOString(),

  };

  localStorage.setItem(
    'lastCheckout',
    JSON.stringify(checkoutData)
  );

  // Kosongkan keranjang
  clearCart();

  // Tutup drawer
  cartStore.setState({
    isOpen: false,
  });

  alert(
    'Checkout berhasil! Terima kasih sudah berbelanja di Toko Kita.'
  );

}

// =====================================================
// CHECKOUT BUTTON
// =====================================================

function setupCheckoutButton() {

  const checkoutButtons =
    document.querySelectorAll(
      '#checkout-btn, .checkout-btn'
    );

  checkoutButtons.forEach(
    (button) => {

      button.addEventListener(
        'click',
        checkoutCart
      );

    }
  );

}

// Jalankan setelah DOM siap
if (document.readyState === 'loading') {

  document.addEventListener(
    'DOMContentLoaded',
    setupCheckoutButton
  );

} else {

  setupCheckoutButton();

}