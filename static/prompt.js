const promptForm = document.getElementById("prompt-form");
const submitButton = document.getElementById("submit-button");
const questionButton = document.getElementById("question-button");
const messagesContainer = document.getElementById("messages-container");

const qcmButton = document.getElementById("qcm-button");
const AButton = document.getElementById("A-button");
const BButton = document.getElementById("B-button");
const CButton = document.getElementById("C-button");
const DButton = document.getElementById("D-button");
const qcmForm = document.getElementById("qcm-form");

const zoomInButton = document.getElementById("zoomIn");
const zoomOutButton = document.getElementById("zoomOut");

let fontSize = 16; // Taille de police initiale en pixels
const fontSizeStep = 2; // Pas de zoom en pixels
const maxFontSize = 32; // Taille maximale de la police
const minFontSize = 10; // Taille minimale de la police

const WELCOME_MESSAGE = "Je suis ton AIssistant de cours personnel ! Pose-moi une question sur le cours et je te répondrai.";

// Fonction pour ajouter un message de l'utilisateur
const appendHumanMessage = (message) => {
  const humanMessageElement = document.createElement("div");
  humanMessageElement.classList.add("message", "message-human");
  humanMessageElement.innerHTML = message;
  messagesContainer.appendChild(humanMessageElement);
};

// Fonction pour ajouter un message de l'IA
const appendAIMessage = async (messagePromise) => {
  const loaderElement = document.createElement("div");
  loaderElement.classList.add("message");
  loaderElement.innerHTML = "<div class='loader'><div></div><div></div><div></div></div>";
  messagesContainer.appendChild(loaderElement);

  const messageToAppend = await messagePromise();

  loaderElement.classList.remove("loader");
  loaderElement.innerHTML = messageToAppend;

  return messageToAppend;
};

// Fonction pour gérer l'envoi du formulaire
const handlePrompt = async (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  promptForm.reset();

  let url = "/prompt";
  if (questionButton.dataset.question !== undefined) {
    url = "/answer";
    data.append("question", questionButton.dataset.question);
    delete questionButton.dataset.question;
    questionButton.classList.remove("hidden");
    submitButton.innerHTML = "Message";
  }

  const userMessage = data.get("prompt");
  appendHumanMessage(userMessage);

  const aiResponse = await appendAIMessage(async () => {
    const response = await fetch(url, {
      method: "POST",
      body: data,
    });
    const result = await response.json();
    return result.answer;
  });

  saveMessage(userMessage, aiResponse);
};

promptForm.addEventListener("submit", handlePrompt);

// Fonction pour ajuster la taille de la police
function adjustFontSize(step) {
  fontSize += step;
  if (fontSize > maxFontSize) fontSize = maxFontSize;
  if (fontSize < minFontSize) fontSize = minFontSize;
  messagesContainer.style.fontSize = `${fontSize}px`;
}

zoomInButton.addEventListener('click', () => adjustFontSize(fontSizeStep));
zoomOutButton.addEventListener('click', () => adjustFontSize(-fontSizeStep));

// Fonction pour gérer l'envoi de questions
const handleQuestionClick = async (event) => {
  const question = await appendAIMessage(async () => {
    const response = await fetch("/question", { method: "GET" });
    const result = await response.json();
    return result.answer;
  });

  saveMessage("", question);

  questionButton.dataset.question = question;
  questionButton.classList.add("hidden");
  submitButton.innerHTML = "Répondre à la question";
};

questionButton.addEventListener("click", handleQuestionClick);

// Fonction pour gérer le clic sur le QCM
const handleQcmClick = async (event) => {
  const qcm = await appendAIMessage(async () => {
    const response = await fetch("/qcm", { method: "GET" });
    const result = await response.json();
    return result.answer;
  });

  questionButton.dataset.question = qcm;
  questionButton.classList.add("hidden");
  qcmForm.classList.remove("hidden");
  qcmButton.innerHTML = "Question suivante";

  saveMessage("", qcm);
};

qcmButton.addEventListener("click", handleQcmClick);



const handleAClick = async (event) => {
  event.preventDefault();

  appendAIMessage(async () => {
    const response = await fetch("/A", {
      method: "GET",
    });
    const result = await response.json();
    const question = result.answer;

    questionButton.dataset.question = question;

    return result.answer;
  });
};

AButton.addEventListener("click", handleAClick);

const handleBClick = async (event) => {
  event.preventDefault();

  appendAIMessage(async () => {
    const response = await fetch("/B", {
      method: "GET",
    });
    const result = await response.json();
    const question = result.answer;

    questionButton.dataset.question = question;

    return result.answer;
  });
};

BButton.addEventListener("click", handleBClick);

const handleCClick = async (event) => {
  event.preventDefault();

  appendAIMessage(async () => {
    const response = await fetch("/C", {
      method: "GET",
    });
    const result = await response.json();
    const question = result.answer;

    questionButton.dataset.question = question;

    return result.answer;
  });
};

CButton.addEventListener("click", handleCClick);

const handleDClick = async (event) => {
  event.preventDefault();

  appendAIMessage(async () => {
    const response = await fetch("/D", {
      method: "GET",
    });
    const result = await response.json();
    const question = result.answer;

    questionButton.dataset.question = question;

    return result.answer;
  });
};

DButton.addEventListener("click", handleDClick);



// Sauvegarder les messages dans le localStorage
function saveMessage(question, response) {
  let messages = JSON.parse(localStorage.getItem('messages')) || [];
  if (question || response) {
    messages.push({ question, response });
    localStorage.setItem('messages', JSON.stringify(messages));
  }
}

// Gérer le mode sombre
document.getElementById("dark-mode-toggle").addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
  const isDarkMode = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDarkMode ? "enabled" : "disabled");
});

// Vider les messages sauf le message d'accueil
document.getElementById("clear-button").addEventListener("click", function () {
  const welcomeText = WELCOME_MESSAGE;
  messagesContainer.innerHTML = `<div id="welcome-message" class="message">${welcomeText}</div>`;
});

// Charger le mode sombre et les messages à l'ouverture de la page
window.onload = function () {
  const darkMode = localStorage.getItem("darkMode");
  if (darkMode === "enabled") {
    document.body.classList.add("dark-mode");
  }

  messagesContainer.innerHTML = `<div id="welcome-message" class="message">${WELCOME_MESSAGE}</div>`;

  let messages = JSON.parse(localStorage.getItem('messages')) || [];
  messages.forEach(msg => {
    if (msg.question) {
      appendHumanMessage(msg.question);
    }
    if (msg.response) {
      appendAIMessage(async () => msg.response);
    }
  });
};

function changeBackground(imageUrl) {
  if (!document.body.classList.contains("dark-mode")) {
    document.body.style.backgroundImage = `url(${imageUrl})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
  }
}

document.getElementById("books-button").addEventListener("click", function () {
  changeBackground('https://i.pinimg.com/236x/25/c8/e6/25c8e63a547ae3195d23fa682337d7c2.jpg');
});

document.getElementById("beach-button").addEventListener("click", function () {
  changeBackground('https://i.pinimg.com/236x/71/5b/ba/715bba198259cc620f57eb28a2cd6ad3.jpg');
});

document.getElementById("trees-button").addEventListener("click", function () {
  changeBackground('https://i.pinimg.com/736x/af/40/4b/af404b4a88e60e22dc2e1fffa9d18370.jpg');
});

document.getElementById("theme-button").addEventListener("click", function () {
  const themeOptions = document.getElementById("theme-options");
  themeOptions.classList.toggle("visible");
});




















