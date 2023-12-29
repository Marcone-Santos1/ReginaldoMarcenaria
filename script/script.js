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

const sendMail = async (messageContent) => {
  const request = await fetch('http://127.0.0.1:8000/send-mail', {
    method: 'POST',
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(messageContent),
  })

  console.log(request)

  const response = await request.json()

  console.log(response)
}

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
    button.innerHTML = '<i class="fa fa-spinner fa-spin"></i>'
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
    console.log('teste')
    successMessage.style.display = "block"
    return
  }
  successMessage.style.display = "none"

}

function reveal() {
  let reveals = document.querySelectorAll(".reveal");

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