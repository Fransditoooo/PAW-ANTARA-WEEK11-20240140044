// ======================================================
// PRODUCT CARD COMPONENT
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


      <!-- ================================================= -->
      <!-- PRODUCT IMAGE -->
      <!-- ================================================= -->

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
            this.onerror=null;
            this.src='https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=900&q=90';
          "
        >


        <!-- BADGE -->

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


      <!-- ================================================= -->
      <!-- PRODUCT CONTENT -->
      <!-- ================================================= -->

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


        <!-- ================================================= -->
        <!-- ADD TO CART -->
        <!-- ================================================= -->

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