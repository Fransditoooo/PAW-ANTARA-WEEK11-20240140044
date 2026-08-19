// ======================================================
// PRODUCT STATE
// ======================================================

const productStore = createStore({

  products:
    Array.isArray(window.__INITIAL_PRODUCTS__)
      ? window.__INITIAL_PRODUCTS__
      : [],

  filter: 'all',

  search: '',

  sort: 'default'

});


// ======================================================
// HELPER
// ======================================================

function escapeHtml(value) {

  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

}


function formatRupiah(value) {

  return Number(value || 0)
    .toLocaleString('id-ID');

}


// ======================================================
// BADGE COMPONENT
// ======================================================

function renderBadge({ label, color }) {

  const colors = {

    green:
      'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700',

    red:
      'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700',

    gray:
      'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'

  };

  return `
    <span
      class="
        inline-flex
        px-2.5
        py-1
        rounded-full
        border
        text-[11px]
        font-bold
        ${colors[color] || colors.gray}
      "
    >
      ${escapeHtml(label)}
    </span>
  `;

}


// ======================================================
// PRODUCT CARD COMPONENT
// ======================================================

function renderProductCard(product) {

  const available =
    Number(product.stock) > 0;

  const image =
    product.image ||
    'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=85';

  const badge = renderBadge({

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
          onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=85';"
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


      <div class="p-5">

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
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
            }
          "
          data-id="${escapeHtml(product.id)}"
          data-name="${escapeHtml(product.name)}"
          data-price="${product.price}"
          data-stock="${product.stock}"
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
// FILTER
// ======================================================

function getFilteredProducts(state) {

  let products = [...state.products];


  // FILTER STOCK

  if (state.filter === 'available') {

    products =
      products.filter(
        product => Number(product.stock) > 0
      );

  }

  if (state.filter === 'out') {

    products =
      products.filter(
        product => Number(product.stock) <= 0
      );

  }


  // SEARCH

  if (state.search.trim()) {

    const keyword =
      state.search
        .toLowerCase()
        .trim();

    products =
      products.filter(product => {

        const name =
          String(product.name || '')
            .toLowerCase();

        const description =
          String(product.description || '')
            .toLowerCase();

        return (
          name.includes(keyword) ||
          description.includes(keyword)
        );

      });

  }


  // SORT

  if (state.sort === 'name') {

    products.sort((a, b) =>
      String(a.name)
        .localeCompare(
          String(b.name),
          'id'
        )
    );

  }


  if (state.sort === 'price-low') {

    products.sort(
      (a, b) =>
        Number(a.price) -
        Number(b.price)
    );

  }


  if (state.sort === 'price-high') {

    products.sort(
      (a, b) =>
        Number(b.price) -
        Number(a.price)
    );

  }


  return products;

}


// ======================================================
// RENDER
// ======================================================

function renderProductList(state) {

  const container =
    document.getElementById(
      'product-list'
    );

  const empty =
    document.getElementById(
      'empty-state'
    );

  const resultInfo =
    document.getElementById(
      'result-info'
    );


  if (!container) return;


  const products =
    getFilteredProducts(state);


  if (resultInfo) {

    resultInfo.textContent =
      `${products.length} produk ditampilkan`;

  }


  if (products.length === 0) {

    container.innerHTML = '';

    if (empty) {
      empty.classList.remove('hidden');
    }

    return;

  }


  if (empty) {
    empty.classList.add('hidden');
  }


  container.innerHTML =
    products
      .map(renderProductCard)
      .join('');

}


// ======================================================
// SUBSCRIBE
// ======================================================

productStore.subscribe(
  renderProductList
);


// ======================================================
// INITIAL RENDER
// ======================================================

renderProductList(
  productStore.getState()
);


// ======================================================
// FILTER BUTTON
// ======================================================

const filterButtons =
  document.getElementById(
    'filter-buttons'
  );


if (filterButtons) {

  filterButtons.addEventListener(
    'click',
    function (event) {

      const button =
        event.target.closest(
          '.filter-btn'
        );

      if (!button) return;


      productStore.setState({

        filter:
          button.dataset.filter

      });


      document
        .querySelectorAll('.filter-btn')
        .forEach(btn => {

          btn.classList.remove(
            'bg-blue-600',
            'text-white'
          );

          btn.classList.add(
            'bg-gray-100',
            'dark:bg-gray-900',
            'text-gray-700',
            'dark:text-gray-300'
          );

        });


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

    }
  );

}


// ======================================================
// SEARCH
// ======================================================

const searchInput =
  document.getElementById(
    'search-input'
  );


if (searchInput) {

  searchInput.addEventListener(
    'input',
    function (event) {

      productStore.setState({

        search:
          event.target.value

      });

    }
  );

}


// ======================================================
// SORT
// ======================================================

const sortSelect =
  document.getElementById(
    'sort-select'
  );


if (sortSelect) {

  sortSelect.addEventListener(
    'change',
    function (event) {

      productStore.setState({

        sort:
          event.target.value

      });

    }
  );

}


// ======================================================
// ADD TO CART
// ======================================================

const productList =
  document.getElementById(
    'product-list'
  );


if (productList) {

  productList.addEventListener(
    'click',
    function (event) {

      const button =
        event.target.closest(
          '.add-to-cart-btn'
        );

      if (!button) return;

      if (button.disabled) return;


      addToCart({

        id:
          button.dataset.id,

        name:
          button.dataset.name,

        price:
          Number(
            button.dataset.price
          ),

        image:
          button.dataset.image

      });


      // buka drawer

      if (
        typeof cartStore !==
        'undefined'
      ) {

        cartStore.setState({
          isOpen: true
        });

      }

    }
  );

}