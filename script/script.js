window.addEventListener("scroll", function () {
  let header = document.querySelector("header");
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

let form = document.querySelector("#form");
let nome = document.querySelector("#nome");
let tel = document.querySelector("#telefone");
let email = document.querySelector("#email");
let description = document.querySelector("#description");
let button = document.getElementById("formButton");

let spinner = button.querySelector(".spinner");
let reveals = document.querySelectorAll(".reveal");


const sendMail = async (messageContent) => {
  const request = await fetch('https://mail-send-two.vercel.app/send-mail', {
    method: 'POST',
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(messageContent),
  })

  return await request.json()
}

tel.addEventListener("input", function(e) {
  let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não é dígito

  let key = e.inputType;

  // Ignora o backspace ao aplicar a máscara
  if (key === "deleteContentBackward") {
    return;
  }

  if (value.length > 10) {
    // Máscara para celular (XX) XXXXX-XXXX
    value = value.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else {
    // Máscara para fixo (XX) XXXX-XXXX
    value = value.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  }

  e.target.value = value;
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const messageContent = {
    name: nome.value,
    phone: tel.value,
    mail: email.value,
    description: description.value,
  }  
  await loadingButton(button, true);
  await clearOrcamentoInputs(messageContent);
  await sendMail(messageContent)
  await loadingButton(button);
})

const loadingButton = async (button, active = false) => {

  await showSuccessMessage(active);

  if (active) {
    button.setAttribute('disabled', 'disabled')
    return
  }

  button.innerHTML = 'Enviar'
  button.removeAttribute('disabled')
}

const clearOrcamentoInputs = async () => {
  nome.value = ''
  tel.value = ''
  email.value = ''
  description.value = ''
}

const showSuccessMessage = async (active = false) => {
  const successMessage = document.getElementById("successMessage")

  if (active) {
    successMessage.style.display = "block"
    return
  }
  successMessage.style.display = "none"

}

const reveal = () => {

  for (let i = 0; i < reveals.length; i++) {
    let windowHeight = window.innerHeight;
    let elementTop = reveals[i].getBoundingClientRect().top;
    let elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    } else {
      reveals[i].classList.remove("active");
    }
  }
}

window.addEventListener("scroll", reveal);