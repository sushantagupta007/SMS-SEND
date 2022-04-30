const numberInput = document.getElementById("number");
const textInput = document.getElementById("msg");
const button = document.querySelector("#button");
const response = document.querySelector("#response");

// To check non-numeric number '/\D/g'
function sendMessage() {
  const number = numberInput.value.replace(/\D/g, "");
  const text = textInput.value;
  console.log(number);
  fetch("/", {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ number: number, msg: text }),
  })
    .then(function (res) {
      console.log(res);
    })
    .catch(function (error) {
      console.log(error);
    });
}

const socket = io();
//Data Catch from Server
socket.on("smsStatus", (data) => {
  response.innerHTML = `<h5> Text Message Was Sent to + ${data.number} </h5>`;
});
socket.on("smsStatus");

button.addEventListener("click", sendMessage);

console.log("hello");
