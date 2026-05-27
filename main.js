﻿const navLinks = document.querySelectorAll(".link");
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