const inputCollection = document.querySelectorAll("form input");
const textarea = document.querySelector("form textarea");
const form = document.querySelector("form");
const submitBtn = document.querySelector("form button");

form.addEventListener("submit", (e) => {
  inputCollection.forEach((input) => {
    if (input.value == "") {
      input.parentElement.querySelector(".warning").style.display = "block";
      input.style.borderColor = "#ff385c";
      input.style.boxShadow = "1px 1px 4px #ff385d60";
      e.preventDefault();
    } else if (input.id == "price" && input.value < 0) {
      input.parentElement.querySelector(".warning").style.display = "block";
      input.style.borderColor = "#ff385c";
      input.style.boxShadow = "1px 1px 4px #ff385d60";
      e.preventDefault();
    } else {
      input.parentElement.querySelector(".warning").style.display = "none";
      input.style.border = "1.5px solid rgb(204, 203, 203)";
      input.style.boxShadow = "none";
    }
  });

  if (textarea.value == "") {
    textarea.parentElement.querySelector(".warning").style.display = "block";
    textarea.style.borderColor = "#ff385c";
    textarea.style.boxShadow = "1px 1px 4px #ff385d60";
    e.preventDefault();
  } else {
    textarea.parentElement.querySelector(".warning").style.display = "none";
    textarea.style.border = "1.5px solid rgb(204, 203, 203)";
    textarea.style.boxShadow = "none";
  }
});

// inputCollection.forEach((input) => {
//   input.addEventListener("keyup", (e) => {
//     if (input.value == "") {
//       input.parentElement.querySelector(".warning").style.display = "block";
//       input.style.borderColor = "#ff385c";
//       input.style.boxShadow = "1px 1px 4px #ff385d60";
//     } else {
//       input.parentElement.querySelector(".warning").style.display = "none";
//       input.style.border = "1.5px solid rgb(204, 203, 203)";
//       input.style.boxShadow = "none";
//     }
//   });
// });
