const apiUrl = "http://127.0.0.1:5054/Game/GetCpuChoice";

async function playGame(userChoice) {
  // Fetch CPU Choice from API
  try {
    const response = await fetch(apiUrl);
    const cpuChoice = await response.text();

    //  Show results 
    displayResult(userChoice, cpuChoice);
  } catch (error) {
    console.error(error);
    alert("Error connecting to API! Is the backend running?");
  }
}

function displayResult(user, cpu) {
  // use innerHTML now so it renders the image tag instead of text
  document.getElementById("userChoiceDisplay").innerHTML = getImgTag(user);
  document.getElementById("cpuChoiceDisplay").innerHTML = getImgTag(cpu);

  const result = checkWinner(user, cpu);
  document.getElementById("winnerText").innerText = result.title;
  document.getElementById("reasonText").innerText = result.message;

  showScreen("resultScreen");
}

function checkWinner(user, cpu) {
  user = user.toLowerCase();
  cpu = cpu.toLowerCase();

  if (user === cpu)
    return { title: "It's a Tie!", message: "Great minds think alike." };

  // Win Logic
  if (
    (user === "rock" && (cpu === "scissors" || cpu === "lizard")) ||
    (user === "paper" && (cpu === "rock" || cpu === "spock")) ||
    (user === "scissors" && (cpu === "paper" || cpu === "lizard")) ||
    (user === "lizard" && (cpu === "spock" || cpu === "paper")) ||
    (user === "spock" && (cpu === "scissors" || cpu === "rock"))
  ) {
    return {
      title: "You Win!",
      message: `${capitalize(user)} beats ${capitalize(cpu)}`,
    };
  }

  return {
    title: "CPU Wins!",
    message: `${capitalize(cpu)} beats ${capitalize(user)}`,
  };
}

function resetGame() {
  showScreen("startScreen");
}

// Utility Helpers
function showScreen(screenId) {
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("active"));
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.add("hidden"));

  const target = document.getElementById(screenId);
  target.classList.remove("hidden");
  target.classList.add("active");
}

function getImgTag(choice) {
  const c = choice.toLowerCase();
  let fileName = "";

  // MAPPING: 
  if (c === "rock")
    fileName = "Rock.png"; 
  else if (c === "paper")
    fileName = "paper.png"; 
  else if (c === "scissors") fileName = "scissors.png";
  else if (c === "lizard")
    fileName = "Lizard.png"; 
  else if (c === "spock") fileName = "spock.png";

  return `<img src="./Photos/${fileName}" alt="${choice}" class="result-img">`;
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
