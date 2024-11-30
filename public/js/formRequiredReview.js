// const inputCollection = document.querySelectorAll(".review-form form input");
// const textarea = document.querySelector(".review-form form textarea");
// const form = document.querySelector(".review-form form");
// const submitBtn = document.querySelector(".review-form form button");

// form.addEventListener("submit", (e) => {
//   inputCollection.forEach((input) => {
//     if (input.value == "") {
//       input.parentElement.querySelector(".warning").style.display = "block";
//       input.style.borderColor = "#ff385c";
//       input.style.boxShadow = "1px 1px 4px #ff385d60";
//       e.preventDefault();
//     } else if (input.id == "rating") {
//       input.parentElement.querySelector(".warning").style.display = "block";
//       input.style.borderColor = "none";
//       input.style.boxShadow = "none";
//     } else {
//       input.parentElement.querySelector(".warning").style.display = "none";
//       input.style.border = "1.5px solid rgb(204, 203, 203)";
//       input.style.boxShadow = "none";
//     }
//   });

//   if (textarea.value == "") {
//     textarea.parentElement.querySelector(".warning").style.display = "block";
//     textarea.style.borderColor = "#ff385c";
//     textarea.style.boxShadow = "1px 1px 4px #ff385d60";
//     e.preventDefault();
//   } else {
//     textarea.parentElement.querySelector(".warning").style.display = "none";
//     textarea.style.border = "1.5px solid rgb(204, 203, 203)";
//     textarea.style.boxShadow = "none";
//   }
// });

const input = document.querySelector(".review-form-pair textarea");
const form = document.querySelector(".review-form form");

form.addEventListener("submit", (e) => {
  if (input.value == "") {
    e.preventDefault();
    input.parentElement.querySelector(".warning").style.display = "block";
    input.style.borderColor = "#ff385c";
    input.style.boxShadow = "1px 1px 4px #ff385d60";
  }
});
