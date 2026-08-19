// ======================================================
// LOAD CART
// ======================================================

function loadCartFromStorage() {

  try {

    const saved =
      localStorage.getItem('cart');

    return saved
      ? JSON.parse(saved)
      : [];

  } catch (error) {

    console.error(
      'Gagal membaca cart:',
      error
    );

    return [];

  }

}


// ======================================================
// CART STORE
// ======================================================

const cartStore = createStore({

  items:
    loadCartFromStorage(),

  isOpen:
    false

});


// ======================================================
// HELPERS
// ======================================================

function getTotalQty(items) {

  return items.reduce(
    (total, item) =>
      total + Number(item.qty || 0),
    0
  );

}


function getTotalPrice(items) {

  return items.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
      Number(item.qty || 0),
    0
  );

}


function formatRupiah(value) {

  return Number(value || 0)
    .toLocaleString('id-ID');

}


// ======================================================
// RENDER CART ITEM
// ======================================================

function renderCartItem(item) {

  const image =
    item.image ||
    'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=300&q=80';


  return `

    <div
      class="
        flex
        gap-3
        p-3
        rounded-2xl
        border
        border-gray-200
        dark:border-gray-800
        bg-white
        dark:bg-gray-900
      "
    >

      <img
        src="${image}"
        alt="${item.name}"
        class="
          w-16
          h-16
          rounded-xl
          object-cover
        "
      >


      <div class="flex-1 min-w-0">

        <p
          class="
            text-sm
            font-bold
            truncate
          "
        >
          ${item.name}
        </p>

        <p
          class="
            text-xs
            text-gray-400
            mt-1
          "
        >
          Rp${formatRupiah(item.price)}
        </p>


        <div
          class="
            flex
            items-center
            gap-2
            mt-2
          "
        >

          <button
            type="button"
            class="
              cart-decrease
              w-7
              h-7
              rounded-lg
              bg-gray-100
              dark:bg-gray-800
              font-bold
            "
            data-id="${item.id}"
          >
            −
          </button>


          <span
            class="
              w-6
              text-center
              text-sm
              font-bold
            "
          >
            ${item.qty}
          </span>


          <button
            type="button"
            class="
              cart-increase
              w-7
              h-7
              rounded-lg
              bg-blue-600
              text-white
              font-bold
            "
            data-id="${item.id}"
          >
            +
          </button>

        </div>

      </div>


      <div
        class="
          text-right
          text-sm
          font-bold
          text-blue-600
        "
      >
        Rp${formatRupiah(
          item.price * item.qty
        )}
      </div>

    </div>

  `;

}


// ======================================================
// RENDER CART
// ======================================================

function renderCart(state) {

  const badge =
    document.getElementById(
      'cart-badge'
    );

  const summary =
    document.getElementById(
      'cart-summary'
    );

  const itemsContainer =
    document.getElementById(
      'cart-items'
    );

  const totalElement =
    document.getElementById(
      'cart-total'
    );

  const drawer =
    document.getElementById(
      'cart-drawer'
    );

  const overlay =
    document.getElementById(
      'cart-overlay'
    );


  if (
    !badge ||
    !itemsContainer ||
    !totalElement
  ) {

    return;

  }


  const totalQty =
    getTotalQty(state.items);

  const totalPrice =
    getTotalPrice(state.items);


  // BADGE

  if (totalQty > 0) {

    badge.textContent =
      totalQty > 99
        ? '99+'
        : totalQty;

    badge.classList.remove(
      'hidden'
    );

    badge.classList.add(
      'flex'
    );

  } else {

    badge.classList.add(
      'hidden'
    );

    badge.classList.remove(
      'flex'
    );

  }


  // SUMMARY

  if (summary) {

    summary.textContent =
      `${totalQty} item`;

  }


  // ITEMS

  if (state.items.length === 0) {

    itemsContainer.innerHTML = `

      <div
        class="
          py-16
          text-center
        "
      >

        <div
          class="
            text-5xl
            mb-4
          "
        >
          🛒
        </div>

        <p
          class="
            font-bold
          "
        >
          Keranjang masih kosong
        </p>

        <p
          class="
            text-xs
            text-gray-400
            mt-1
          "
        >
          Yuk pilih produk favoritmu.
        </p>

      </div>

    `;

  } else {

    itemsContainer.innerHTML =
      state.items
        .map(renderCartItem)
        .join('');

  }


  // TOTAL

  totalElement.textContent =
    'Rp' +
    formatRupiah(totalPrice);


  // DRAWER

  if (drawer && overlay) {

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

  }


  // STORAGE

  localStorage.setItem(
    'cart',
    JSON.stringify(state.items)
  );

}


// ======================================================
// SUBSCRIBE
// ======================================================

cartStore.subscribe(
  renderCart
);


// ======================================================
// INITIAL RENDER
// ======================================================

renderCart(
  cartStore.getState()
);


// ======================================================
// ADD TO CART
// ======================================================

function addToCart(product) {

  const items =
    cartStore
      .getState()
      .items;


  const existing =
    items.find(
      item =>
        String(item.id) ===
        String(product.id)
    );


  if (existing) {

    cartStore.setState({

      items:
        items.map(item =>

          String(item.id) ===
          String(product.id)

            ? {
                ...item,
                qty:
                  Number(item.qty) + 1
              }

            : item

        )

    });

  } else {

    cartStore.setState({

      items: [

        ...items,

        {
          id:
            product.id,

          name:
            product.name,

          price:
            Number(product.price),

          image:
            product.image || '',

          qty:
            1
        }

      ]

    });

  }

}


// ======================================================
// CHANGE QUANTITY
// ======================================================

function changeQty(id, delta) {

  const items =
    cartStore
      .getState()
      .items;


  const updated =
    items
      .map(item => {

        if (
          String(item.id) ===
          String(id)
        ) {

          return {

            ...item,

            qty:
              Number(item.qty) +
              Number(delta)

          };

        }

        return item;

      })
      .filter(
        item =>
          Number(item.qty) > 0
      );


  cartStore.setState({

    items:
      updated

  });

}


// ======================================================
// OPEN CART
// ======================================================

document
  .getElementById('cart-toggle')
  ?.addEventListener(
    'click',
    function () {

      cartStore.setState({
        isOpen: true
      });

    }
  );


// ======================================================
// CLOSE CART
// ======================================================

document
  .getElementById('cart-close')
  ?.addEventListener(
    'click',
    function () {

      cartStore.setState({
        isOpen: false
      });

    }
  );


document
  .getElementById('cart-overlay')
  ?.addEventListener(
    'click',
    function () {

      cartStore.setState({
        isOpen: false
      });

    }
  );


// ======================================================
// CART +/-
// ======================================================

document
  .getElementById('cart-items')
  ?.addEventListener(
    'click',
    function (event) {

      const increase =
        event.target.closest(
          '.cart-increase'
        );

      const decrease =
        event.target.closest(
          '.cart-decrease'
        );


      if (increase) {

        changeQty(
          increase.dataset.id,
          1
        );

      }


      if (decrease) {

        changeQty(
          decrease.dataset.id,
          -1
        );

      }

    }
  );


// ======================================================
// CLEAR CART
// ======================================================

document
  .getElementById('clear-cart')
  ?.addEventListener(
    'click',
    function () {

      if (
        cartStore
          .getState()
          .items
          .length === 0
      ) {

        return;

      }


      const confirmClear =
        confirm(
          'Kosongkan semua isi keranjang?'
        );


      if (!confirmClear) return;


      cartStore.setState({

        items: []

      });

    }
  );