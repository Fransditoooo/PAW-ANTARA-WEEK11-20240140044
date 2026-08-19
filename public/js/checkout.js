const checkoutModal =
  document.getElementById(
    "checkout-modal"
  );


const checkoutForm =
  document.getElementById(
    "checkout-form"
  );


const checkoutClose =
  document.getElementById(
    "checkout-close"
  );


const checkoutCancel =
  document.getElementById(
    "checkout-cancel"
  );


const checkoutItems =
  document.getElementById(
    "checkout-items"
  );


const checkoutTotal =
  document.getElementById(
    "checkout-total"
  );


function getCheckoutTotal() {

  const items =
    cartStore
      .getState()
      .items;


  return items.reduce(
    (total, item) =>
      total +
      item.price *
      item.qty,
    0
  );
}


function openCheckout() {

  const items =
    cartStore
      .getState()
      .items;


  if (items.length === 0) {

    alert(
      "Keranjang masih kosong."
    );

    return;
  }


  checkoutItems.innerHTML =
    items
      .map(
        (item) => `

          <div
            class="
              flex
              justify-between
              gap-3
              text-sm
            "
          >

            <span>
              ${item.name}
              × ${item.qty}
            </span>

            <strong>
              Rp${(
                item.price *
                item.qty
              ).toLocaleString(
                "id-ID"
              )}
            </strong>

          </div>

        `
      )
      .join("");


  checkoutTotal.textContent =
    "Rp" +
    getCheckoutTotal()
      .toLocaleString(
        "id-ID"
      );


  checkoutModal.classList.remove(
    "hidden"
  );

}


function closeCheckout() {

  checkoutModal.classList.add(
    "hidden"
  );

}


document
  .getElementById(
    "checkout-button"
  )
  ?.addEventListener(
    "click",
    openCheckout
  );


checkoutClose?.addEventListener(
  "click",
  closeCheckout
);


checkoutCancel?.addEventListener(
  "click",
  closeCheckout
);


checkoutForm?.addEventListener(
  "submit",
  (event) => {

    event.preventDefault();


    const name =
      document
        .getElementById(
          "customer-name"
        )
        .value
        .trim();


    const phone =
      document
        .getElementById(
          "customer-phone"
        )
        .value
        .trim();


    const address =
      document
        .getElementById(
          "customer-address"
        )
        .value
        .trim();


    const payment =
      document
        .getElementById(
          "payment-method"
        )
        .value;


    if (
      !name ||
      !phone ||
      !address ||
      !payment
    ) {

      alert(
        "Semua data checkout wajib diisi."
      );

      return;
    }


    const orderCode =
      "TK-" +
      Date.now()
        .toString()
        .slice(-8);


    const order = {

      code:
        orderCode,

      customer:
        name,

      phone,

      address,

      payment,

      items:
        cartStore
          .getState()
          .items,

      total:
        getCheckoutTotal(),

      createdAt:
        new Date()
          .toISOString(),

    };


    localStorage.setItem(
      "lastOrder",
      JSON.stringify(
        order
      )
    );


    // KOSONGKAN KERANJANG

    cartStore.setState({
      items: [],
      isOpen: false,
    });


    closeCheckout();


    alert(
      `Checkout berhasil!\n\nNomor pesanan: ${orderCode}\nTotal: Rp${order.total.toLocaleString("id-ID")}`
    );


    checkoutForm.reset();

  }
);