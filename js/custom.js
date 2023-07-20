const donationForm = document.getElementById("donation-form");
const donationRadios = document.querySelectorAll('input[name="donation"]');
const customAmount = document.getElementById("custom-amount");
const donateButton = document.getElementById("donate-btn");

donationRadios.forEach(function (radio) {
  radio.addEventListener("change", function () {
    customAmount.value = this.value;
    donateButton.innerText = `Donate $${this.value}`;
  });
});

customAmount.addEventListener("input", function () {
  donationRadios.forEach(function (radio) {
    radio.checked = false;
  });
  donateButton.innerText = `Donate $${this.value || 0}`;
});

// function to initiate checkout
function initiateCheckout(checkoutDetails) {
  var myHeaders = new Headers();
  myHeaders.append("v-c-merchant-id", "testrest");
  myHeaders.append("Date", "");
  myHeaders.append("Host", "apitest.cybersource.com");
  myHeaders.append("Digest", "");
  myHeaders.append("Signature", "");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("User-Agent", "Mozilla/5.0");

  var raw = JSON.stringify(checkoutDetails);

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("https://apitest.cybersource.com/pts/v2/payments/", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

// Attach an event listener to the donate button
donationForm.addEventListener("submit", function (event) {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Get the selected donation amount or custom amount entered by the user
  const selectedAmount =
    document.querySelector('input[name="donation"]:checked')?.value ||
    document.getElementById("custom-amount").value;

  // If no valid amount was selected or entered, show an error message
  if (!selectedAmount || isNaN(selectedAmount)) {
    alert("Please select a valid donation amount.");
    return;
  }

  // prepare transaction details
  const checkoutDetails = {
    clientReferenceInformation: {
      code: "TC50171_3",
      partner: {
        thirdPartyCertificationNumber: "123456789012",
      },
    },
    orderInformation: {
      billTo: {
        firstName: "John",
        lastName: "Deo",
        address2: "Address 2",
        address1: "201 S. Division St.",
        postalCode: "48104-2201",
        locality: "Ann Arbor",
        administrativeArea: "MI",
        country: "US",
        email: "test@cybersource.com",
      },
      amountDetails: {
        totalAmount: selectedAmount,
        currency: "USD",
      },
    },
    paymentInformation: {
      card: {
        expirationYear: "2031",
        number: "5555555555554444",
        securityCode: "123",
        expirationMonth: "12",
        type: "002",
      },
    },
  };

  // initiate checkout
  initiateCheckout(checkoutDetails);
});
