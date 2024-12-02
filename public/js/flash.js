const flashDiv = document.querySelector(".flash-message");

if (flashDiv) {
  setTimeout(() => {
    flashDiv.style.display = "none";
  }, 1500);
}
