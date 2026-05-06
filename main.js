const navLinks = document.querySelectorAll(".link");
const sections = document.querySelectorAll("main section[id], footer[id]");

const setActiveLink = () => {
  let currentId = "inicio";

  sections.forEach((section) => {
    const top = window.scrollY;
    const offset = section.offsetTop - 180;
    const height = section.offsetHeight;

    if (top >= offset && top < offset + height) {
      currentId = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("activo", link.getAttribute("href") === `#${currentId}`);
  });
};

window.addEventListener("scroll", setActiveLink);
window.addEventListener("load", setActiveLink);

(() => {
  const formulario = document.querySelector("#formulario-contacto");
  const nombreInput = document.querySelector("#nombre-contacto");
  const mensaje = document.querySelector("#mensaje-contacto");

  if (!formulario || !nombreInput || !mensaje) return;

  formulario.addEventListener("submit", (event) => {
    event.preventDefault();

    const nombre = nombreInput.value.trim();

    mensaje.textContent = nombre
      ? `Gracias, ${nombre}. Tu mensaje ha quedado preparado.`
      : "Gracias. Tu mensaje ha quedado preparado.";

    mensaje.classList.add("is-visible");
    formulario.reset();

    setTimeout(() => {
      mensaje.classList.remove("is-visible");
      mensaje.textContent = "";
    }, 4000);
  });
})();