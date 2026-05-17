let count = 0;
let dodgeMode = false;
let decoyMode = false;
let sadMode = false;
let gameWon = false;
let miniClicks = 0;
let starCount = 0;

const menuScreen = document.getElementById("menuScreen");
const gameScreen = document.getElementById("gameScreen");
const realmScreen = document.getElementById("realmScreen");

const startButton = document.getElementById("startButton");
const howToPlayButton = document.getElementById("howToPlayButton");
const enterCodeButton = document.getElementById("enterCodeButton");
const leaveRealmButton = document.getElementById("leaveRealmButton");
const howToPlayText = document.getElementById("howToPlayText");

const button = document.getElementById("redButton");
const message = document.getElementById("message");
const countText = document.getElementById("count");
const title = document.getElementById("title");

const starButton = document.getElementById("starButton");
const starCountText = document.getElementById("starCount");
const realmMessage = document.getElementById("realmMessage");

const messages = [
  "Boris. I said do NOT press it.",
  "Okay, now you've done it.",
  "Warning: button is getting annoyed.",
  "Self-destruct sequence started... just kidding.",
  "The button has accepted you as its leader.",
  "You are now officially a red button scientist."
];

startButton.addEventListener("click", () => {
  menuScreen.classList.add("hidden");
  realmScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
});

howToPlayButton.addEventListener("click", () => {
  howToPlayText.classList.toggle("hidden");
});

enterCodeButton.addEventListener("click", () => {
  const code = prompt("Enter secret code:");

  if (code === "ORION") {
    menuScreen.classList.add("hidden");
    gameScreen.classList.add("hidden");
    realmScreen.classList.remove("hidden");

    resetOrionRealm();
  } else {
    alert("Access denied. The stars do not recognise that code.");
  }
});

leaveRealmButton.addEventListener("click", () => {
  realmScreen.classList.add("hidden");
  menuScreen.classList.remove("hidden");
});

function playBeep() {
  const audio = new AudioContext();

  const oscillator = audio.createOscillator();
  const volume = audio.createGain();

  oscillator.connect(volume);
  volume.connect(audio.destination);

  oscillator.frequency.value = 220;
  oscillator.type = "square";

  volume.gain.value = 0.2;

  oscillator.start();

  setTimeout(() => {
    oscillator.stop();
    audio.close();
  }, 150);
}

function dangerEffect() {
  document.body.classList.remove("danger-effect");

  void document.body.offsetWidth;

  document.body.classList.add("danger-effect");

  setTimeout(() => {
    document.body.classList.remove("danger-effect");
  }, 400);
}

function showNormalMessage() {
  const messageNumber = (count - 1) % messages.length;
  message.textContent = messages[messageNumber];
}

function moveButtonToRandomPlace() {
  const maxX = window.innerWidth - button.offsetWidth - 20;
  const maxY = window.innerHeight - button.offsetHeight - 20;

  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);

  button.style.position = "fixed";
  button.style.left = randomX + "px";
  button.style.top = randomY + "px";
}

function returnButtonToDefaultPosition() {
  button.style.position = "";
  button.style.left = "";
  button.style.top = "";
}

function createFakeButton() {
  const fakeButton = document.createElement("button");

  fakeButton.textContent = "PRESS";
  fakeButton.classList.add("fake-button");

  const maxX = window.innerWidth - 140;
  const maxY = window.innerHeight - 140;

  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);

  fakeButton.style.left = randomX + "px";
  fakeButton.style.top = randomY + "px";

  fakeButton.addEventListener("click", () => {
    message.textContent = "Wrong button. The real one is laughing.";
    playBeep();
  });

  document.body.appendChild(fakeButton);
}

function removeFakeButtons() {

const fakeButtons = document.querySelectorAll(".fake-button");

  fakeButtons.forEach((fakeButton) => {
    fakeButton.remove();
  });
}

function startDodgeMode() {
  dodgeMode = true;
  message.textContent = "The button is scared. Catch it 10 more times.";
  moveButtonToRandomPlace();
}

function startDecoyMode() {
  decoyMode = true;
  dodgeMode = false;

  message.textContent = "Too many buttons! Find the real one.";

  button.textContent = "REAL?";
  moveButtonToRandomPlace();

  for (let i = 0; i < 20; i = i + 1) {
    createFakeButton();
  }
}

function endDecoyMode() {
  decoyMode = false;

  removeFakeButtons();

  button.textContent = "DO NOT PRESS";
  returnButtonToDefaultPosition();

  message.textContent = "You found the real one. Back to normal... for now.";
}

function startSadMode() {
  sadMode = true;
  decoyMode = false;
  dodgeMode = false;
  miniClicks = 0;

  removeFakeButtons();
  returnButtonToDefaultPosition();

  document.body.classList.add("sad-mode");

  title.textContent = "You made him sad, cheer him up";
  title.classList.add("sad-message");

  message.textContent = "Mini button clicks: 0 / 50";
  countText.textContent = count;

  button.textContent = "cheer";
  button.classList.add("mini-button");
}

function winGame() {
  gameWon = true;
  dodgeMode = false;
  decoyMode = false;
  sadMode = false;

  removeFakeButtons();
  returnButtonToDefaultPosition();

  document.body.classList.remove("sad-mode");
  document.body.classList.add("happy-mode");

  title.classList.remove("sad-message");
  title.textContent = "You cheered him up!";

  button.classList.remove("mini-button");
  button.classList.add("happy-button");
  button.textContent = "HAPPY";

  message.textContent = "Fine you win. The button forgives you.";
}

button.addEventListener("click", () => {
  if (gameWon) {
    return;
  }

  playBeep();

  if (sadMode) {
    miniClicks = miniClicks + 1;
    message.textContent = "Mini button clicks: " + miniClicks + " / 50";

    if (miniClicks >= 50) {
      winGame();
    }

    return;
  }

  if (decoyMode) {
    count = count + 1;
    countText.textContent = count;
    endDecoyMode();
    return;
  }

  count = count + 1;
  countText.textContent = count;

  if (count < 20) {
    showNormalMessage();
    dangerEffect();
    return;
  }

  if (count === 20) {
    startDodgeMode();
    return;
  }

  if (count > 20 && count < 30) {
    message.textContent = "You caught it! Clicks until chaos: " + (30 - count);
    moveButtonToRandomPlace();
    return;
  }

  if (count === 30) {
    startDecoyMode();
    return;
  }

  if (count > 30 && count < 40) {
    message.textContent = "Back to normal. Sadness in: " + (40 - count);
    returnButtonToDefaultPosition();
    return;
  }

  if (count === 40) {
    startSadMode();
    return;
  }
});

/* ORION REALM */

function resetOrionRealm() {
  starCount = 0;
  starCountText.textContent = starCount;

  realmMessage.textContent = "Catch the star 5 times to unlock Orion's secret.";
  realmMessage.classList.remove("secret-reveal");

  starButton.textContent = "★";
  starButton.style.color = "#fff176";

  starButton.classList.remove(
    "hidden",
    "star-power-1",
    "star-power-2",
    "star-power-3",
    "star-power-4",
    "star-burst"
  );

  moveStar();
}

function moveStar() {
  const maxX = window.innerWidth - 100;
  const maxY = window.innerHeight - 100;

  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);

  starButton.style.left = randomX + "px";
  starButton.style.top = randomY + "px";
}

starButton.addEventListener("click", () => {
  if (starCount >= 5) {
    return;
  }

  starCount = starCount + 1;
  starCountText.textContent = starCount;

  starButton.classList.remove(
    "star-power-1",
    "star-power-2",
    "star-power-3",
    "star-power-4"
  );

  if (starCount === 1) {
    starButton.classList.add("star-power-1");
    realmMessage.textContent = "The star begins to glow...";
    moveStar();
    return;
  }

  if (starCount === 2) {
starButton.classList.add("star-power-2");
    realmMessage.textContent = "The star is getting brighter.";
    moveStar();
    return;
  }

  if (starCount === 3) {
    starButton.classList.add("star-power-3");
    realmMessage.textContent = "The star is full of energy.";
    moveStar();
    return;
  }

  if (starCount === 4) {
    starButton.classList.add("star-power-4");
    realmMessage.textContent = "The star is about to burst!";
    moveStar();
    return;
  }

  if (starCount === 5) {
    realmMessage.textContent = "";

    starButton.classList.add("star-burst");

    setTimeout(() => {
      starButton.classList.add("hidden");

      realmMessage.textContent = "Secret revealed: the red button was created in the Orion Realm… and Boris is the only one powerful enough to control it.";
      realmMessage.classList.add("secret-reveal");
    }, 800);
  }
});
