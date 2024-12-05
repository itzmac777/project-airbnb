const inputCollection = document.querySelectorAll(".sign-up-container input");
const form = document.querySelector(".sign-up-container form");

form.addEventListener("submit", (e) => {
  for (let input of inputCollection) {
    if (input.value == "") {
      e.preventDefault();
      input.parentElement.querySelector(".warning").style.display = "block";
      input.style.borderColor = "#ff385c";
      input.style.boxShadow = "1px 1px 4px #ff385d60";
    }
  }
});
