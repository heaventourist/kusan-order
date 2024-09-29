// This is a script to put automatic order in
// https://order.toasttab.com/online/kusan-uyghur-cuisine-1516-n-4th-street
// In order to use it, go to the URL and copy/paste the code in the console.
// The payment should be manually handled after the order being added to the cart.

localStorage.setItem("orderCompleted", "false");

let numTry = 0;

function startOrder() {
  const now = new Date();
  const nextSecond = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    20,
    30,
    0,
    0
  ); // The surplus box is ready at 8:30pm and ends in 1 min.
  const delay = nextSecond.getTime() - now.getTime();
  if (delay < 0) {
    console.log("Can try it tomorrow.");
    return;
  }
  console.log("Scheduled in " + msToTime(delay));
  setTimeout(function () {
    openOrderPage();
    const intervalId = setInterval(function () {
      if (localStorage.getItem("orderCompleted") === "false") {
        openOrderPage();
      } else {
        console.log("Timeout ends since the order is completed.");
        clearInterval(intervalId);
      }
    }, 1000);
    setTimeout(() => {
      clearInterval(intervalId);
    }, 60000); // Stop putting order after 1 min.
  }, delay);
}

function openOrderPage() {
  console.log(++numTry + " time try...");
  const linkEle = document.body.querySelector(
    "div[aria-labelledby^='Surplus_Box'] a[data-testid^='add-to-cart']"
  );
  if (linkEle == null) {
    console.log("Cannot find the link.");
    return;
  }
  const orderLink = "https://order.toasttab.com" + linkEle.getAttribute("href");

  console.log(orderLink);

  const newWindow = window.open(orderLink);

  const newScript = document.createElement("script");

  newScript.innerHTML = doOrder.toString() + ";doOrder();";

  newWindow.onload = function () {
    newWindow.document.head.appendChild(newScript);
  };
}

function doOrder() {
  const checkExist = setInterval(() => {
    const orderButton = document.body.querySelector(
      "div.addToCart button.modalButton"
    );
    if (orderButton) {
      clearInterval(checkExist);
      orderButton.click();

      const cartItems = document.body.querySelectorAll(
        "div.cartData div.items div.item"
      );

      if (cartItems.length == 0) {
        console.log("empty cart");
        window.close();
        return;
      }

      localStorage.setItem("orderCompleted", "true");
      console.log("Order added to cart successfully.");

      const checkoutButton = document.body.querySelector(
        "a.checkoutButtonAction"
      );

      checkoutButton.click();
    }
  }, 100);
}

function msToTime(ms) {
  let seconds = (ms / 1000).toFixed(1);
  let minutes = (ms / (1000 * 60)).toFixed(1);
  let hours = (ms / (1000 * 60 * 60)).toFixed(1);
  let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
  if (seconds < 60) return seconds + " Sec";
  else if (minutes < 60) return minutes + " Min";
  else if (hours < 24) return hours + " Hrs";
  else return days + " Days";
}

startOrder();
