const button = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("#mobileMenu");

button.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("open");
  button.setAttribute("aria-expanded", String(isOpen));
});

menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("open");
    button.setAttribute("aria-expanded", "false");
  });
});
