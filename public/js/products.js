// ======================================================
// PRODUCTS - STATE, FILTER, SEARCH, SORT & CART
// ======================================================


// ======================================================
// HELPER: ESCAPE HTML
// ======================================================

function escapeHtml(value) {

  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

}


// ======================================================
// HELPER: FORMAT RUPIAH
// ======================================================

function formatRupiah(value) {

  const number =
    Number(value) || 0;

  return number.toLocaleString(
    'id-ID'
  );

}


// ======================================================
// HELPER: BADGE
// ======================================================

function renderBadge({
  label,
  color
}) {

  const classes =
    color === 'green'

      ? `
        bg-green-100
        text-green-700
        dark:bg-green-900/40
        dark:text-green-300
      `

      : `
        bg-red-100
        text-red-700
        dark:bg-red-900/40
        dark:text-red-300
      `;


  return `
    <span
      class="
        inline-flex
        items-center
        px-3
        py-1
        rounded-full
        text-xs
        font-bold
        ${classes}
      "
    >
      ${escapeHtml(label)}
    </span>
  `;

}


// ======================================================
// PRODUCT CARD
// ======================================================

function renderProductCard(product) {

  const available =
    Number(product.stock) > 0;


  // ====================================================
  // GAMBAR PRODUK
  // ====================================================

  const image =
    product.image ||
    'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=900&q=90';


  const badge =
    renderBadge({

      label:
        available
          ? 'Tersedia'
          : 'Habis',

      color:
        available
          ? 'green'
          : 'red'

    });


  return `

    <article
      class="
        product-card
        group
        overflow-hidden
        rounded-2xl
        bg-white
        dark:bg-gray-900
        border
        border-gray-200
        dark:border-gray-800
        shadow-sm
        hover:shadow-xl
        transition-all
        duration-300
      "
    >

      <!-- ============================================= -->
      <!-- PRODUCT IMAGE -->
      <!-- ============================================= -->

      <div
        class="
          relative
          h-64
          overflow-hidden
          bg-gray-100
          dark:bg-gray-800
        "
      >

        <img
          src="${escapeHtml(image)}"
          alt="${escapeHtml(product.name)}"
          class="
            w-full
            h-full
            object-cover
            group-hover:scale-105
            transition-transform
            duration-500
          "
          loading="lazy"
          onerror="
            this.onerror = null;
            this.src =
              'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=900&q=90';
          "
        >

        <div
          class="
            absolute
            top-3
            left-3
          "
        >
          ${badge}
        </div>

      </div>


      <!-- ============================================= -->
      <!-- PRODUCT CONTENT -->
      <!-- ============================================= -->

      <div class="p-5">


        <!-- NAME -->

        <h3
          class="
            text-lg
            font-bold
            text-gray-900
            dark:text-white
            line-clamp-1
          "
        >
          ${escapeHtml(product.name)}
        </h3>


        <!-- DESCRIPTION -->

        <p
          class="
            mt-2
            text-sm
            text-gray-500
            dark:text-gray-400
            line-clamp-2
            min-h-[48px]
          "
        >
          ${escapeHtml(
            product.description ||
            'Produk berkualitas pilihan.'
          )}
        </p>


        <!-- PRICE + STOCK -->

        <div
          class="
            mt-4
            flex
            items-end
            justify-between
          "
        >

          <div>

            <p
              class="
                text-xs
                text-gray-400
              "
            >
              Harga
            </p>

            <p
              class="
                text-xl
                font-black
                text-blue-600
                dark:text-blue-400
              "
            >
              Rp${formatRupiah(product.price)}
            </p>

          </div>


          <div class="text-right">

            <p
              class="
                text-xs
                text-gray-400
              "
            >
              Stok
            </p>

            <p
              class="
                text-sm
                font-bold
                ${
                  available
                    ? 'text-green-600'
                    : 'text-red-500'
                }
              "
            >
              ${product.stock}
            </p>

          </div>

        </div>


        <!-- ============================================= -->
        <!-- ADD TO CART -->
        <!-- ============================================= -->

        <button
          type="button"
          class="
            add-to-cart-btn
            mt-5
            w-full
            py-3
            rounded-xl
            text-sm
            font-bold
            transition
            ${
              available

                ? `
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                `

                : `
                  bg-gray-200
                  dark:bg-gray-800
                  text-gray-400
                  cursor-not-allowed
                `
            }
          "
          data-id="${escapeHtml(product.id)}"
          data-name="${escapeHtml(product.name)}"
          data-price="${Number(product.price) || 0}"
          data-stock="${Number(product.stock) || 0}"
          data-image="${escapeHtml(image)}"
          ${available ? '' : 'disabled'}
        >

          ${
            available
              ? '🛒 Tambah ke Keranjang'
              : 'Stok Habis'
          }

        </button>


      </div>

    </article>

  `;

}


// ======================================================
// INITIAL PRODUCTS
// ======================================================

const initialProducts =

  Array.isArray(
    window.__INITIAL_PRODUCTS__
  )

    ? window.__INITIAL_PRODUCTS__

    : [];


// ======================================================
// PRODUCT STORE
// ======================================================

const productStore =
  createStore({

    products:
      initialProducts,

    filter:
      'all',

    search:
      '',

    sort:
      'default'

  });


// ======================================================
// GET FILTERED PRODUCTS
// ======================================================

function getFilteredProducts(state) {

  let products =
    [...state.products];


  // ====================================================
  // FILTER STOCK
  // ====================================================

  if (
    state.filter ===
    'available'
  ) {

    products =
      products.filter(
        (product) =>
          Number(product.stock) > 0
      );

  }


  if (
    state.filter ===
    'out'
  ) {

    products =
      products.filter(
        (product) =>
          Number(product.stock) <= 0
      );

  }


  // ====================================================
  // SEARCH
  // ====================================================

  const keyword =
    String(state.search || '')
      .trim()
      .toLowerCase();


  if (keyword) {

    products =
      products.filter(
        (product) => {

          const name =
            String(
              product.name || ''
            )
              .toLowerCase();


          const description =
            String(
              product.description || ''
            )
              .toLowerCase();


          return (
            name.includes(keyword) ||
            description.includes(keyword)
          );

        }
      );

  }


  // ====================================================
  // SORT
  // ====================================================

  if (
    state.sort ===
    'name'
  ) {

    products.sort(
      (a, b) =>
        String(a.name || '')
          .localeCompare(
            String(b.name || ''),
            'id'
          )
    );

  }


  if (
    state.sort ===
    'price-low'
  ) {

    products.sort(
      (a, b) =>
        Number(a.price || 0) -
        Number(b.price || 0)
    );

  }


  if (
    state.sort ===
    'price-high'
  ) {

    products.sort(
      (a, b) =>
        Number(b.price || 0) -
        Number(a.price || 0)
    );

  }


  return products;

}


// ======================================================
// RENDER PRODUCTS
// ======================================================

function renderProducts(state) {

  const productList =
    document.getElementById(
      'product-list'
    );


  const emptyState =
    document.getElementById(
      'empty-state'
    );


  const resultInfo =
    document.getElementById(
      'result-info'
    );


  if (!productList) {

    console.error(
      'Element #product-list tidak ditemukan.'
    );

    return;

  }


  const products =
    getFilteredProducts(state);


  // ====================================================
  // RENDER PRODUCT
  // ====================================================

  productList.innerHTML =
    products
      .map(
        renderProductCard
      )
      .join('');


  // ====================================================
  // EMPTY STATE
  // ====================================================

  if (emptyState) {

    if (products.length === 0) {

      emptyState.classList.remove(
        'hidden'
      );

    } else {

      emptyState.classList.add(
        'hidden'
      );

    }

  }


  // ====================================================
  // RESULT INFO
  // ====================================================

  if (resultInfo) {

    const total =
      state.products.length;

    resultInfo.textContent =
      `Menampilkan ${products.length} dari ${total} produk`;

  }


  // ====================================================
  // ACTIVE FILTER
  // ====================================================

  updateFilterButtons(
    state.filter
  );

}


// ======================================================
// FILTER BUTTON STYLE
// ======================================================

function updateFilterButtons(
  activeFilter
) {

  const buttons =
    document.querySelectorAll(
      '.filter-btn'
    );


  buttons.forEach(
    (button) => {

      const isActive =
        button.dataset.filter ===
        activeFilter;


      if (isActive) {

        button.classList.remove(
          'bg-gray-100',
          'dark:bg-gray-900',
          'text-gray-700',
          'dark:text-gray-300'
        );

        button.classList.add(
          'bg-blue-600',
          'text-white'
        );

      } else {

        button.classList.remove(
          'bg-blue-600',
          'text-white'
        );

        button.classList.add(
          'bg-gray-100',
          'dark:bg-gray-900',
          'text-gray-700',
          'dark:text-gray-300'
        );

      }

    }
  );

}


// ======================================================
// FILTER BUTTON EVENT
// ======================================================

const filterButtons =
  document.getElementById(
    'filter-buttons'
  );


if (filterButtons) {

  filterButtons.addEventListener(
    'click',
    (event) => {

      const button =
        event.target.closest(
          '.filter-btn'
        );


      if (!button) {
        return;
      }


      const filter =
        button.dataset.filter;


      productStore.setState({

        filter:
          filter || 'all'

      });

    }
  );

}


// ======================================================
// SEARCH EVENT
// ======================================================

const searchInput =
  document.getElementById(
    'search-input'
  );


if (searchInput) {

  searchInput.addEventListener(
    'input',
    (event) => {

      productStore.setState({

        search:
          event.target.value

      });

    }
  );

}


// ======================================================
// SORT EVENT
// ======================================================

const sortSelect =
  document.getElementById(
    'sort-select'
  );


if (sortSelect) {

  sortSelect.addEventListener(
    'change',
    (event) => {

      productStore.setState({

        sort:
          event.target.value

      });

    }
  );

}


// ======================================================
// ADD TO CART EVENT
// ======================================================

const productList =
  document.getElementById(
    'product-list'
  );


if (productList) {

  productList.addEventListener(
    'click',
    (event) => {

      const button =
        event.target.closest(
          '.add-to-cart-btn'
        );


      if (!button) {
        return;
      }


      if (
        button.disabled
      ) {

        return;

      }


      const id =
        button.dataset.id;


      const name =
        button.dataset.name;


      const price =
        Number(
          button.dataset.price
        ) || 0;


      const stock =
        Number(
          button.dataset.stock
        ) || 0;


      // ================================================
      // PANGGIL CART
      // ================================================

      if (
        typeof addToCart !==
        'function'
      ) {

        console.error(
          'Fungsi addToCart() tidak ditemukan.'
        );

        return;

      }


      addToCart({

        id,

        name,

        price,

        stock

      });

    }
  );

}


// ======================================================
// STORE SUBSCRIBE
// ======================================================

productStore.subscribe(
  renderProducts
);


// ======================================================
// INITIAL RENDER
// ======================================================

renderProducts(
  productStore.getState()
);