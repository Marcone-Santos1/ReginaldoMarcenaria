window.addEventListener("scroll", function () {
  var header = document.querySelector("header");
  header.classList.toggle("sticky", window.scrollY > 0);
});

const btnMobile = document.getElementById("btn-mobile");

function toggleMenu(event) {
  if (event.type === "touchstart") event.preventDefaut();
  const nav = document.getElementById("nav");
  nav.classList.toggle("active");
}

btnMobile.addEventListener("click", toggleMenu);
btnMobile.addEventListener("touchstart", toggleMenu);


/* pegar dados do form */

var form = document.querySelector("#form");
var nome = document.querySelector("#nome");
var tel = document.querySelector("#telefone");
var email = document.querySelector("#email");

form.addEventListener("submit", (e) => {
  e.preventDefault();
})

function mostrar(){
  alert(nome.value)
  alert(tel.value)
  alert(email.value)
}

