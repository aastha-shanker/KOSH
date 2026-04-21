function checkDailyReset() {
  let today = new Date().toLocaleDateString();
  let lastReset = localStorage.getItem("lastReset");

  if (lastReset !== today) {
  
    localStorage.removeItem("completed");
    localStorage.setItem("lastReset", today);
  }

  checkDailyReset();
}
const challenges = [
  { id: 1, title: "No Spend Day 🚫", reward: 100 },
  { id: 2, title: "Skip Coffee ☕", reward: 200 },
  { id: 3, title: "No Online Shopping 🛍️", reward: 300 },
  { id: 4, title: "Save ₹500 this week 💰", reward: 500 }
];

let container = document.getElementById("challengeList");


let completedChallenges = JSON.parse(localStorage.getItem("completed")) || [];


challenges.forEach(ch => {
  let div = document.createElement("div");
  div.className = "challenge-card";

  let isDone = completedChallenges.includes(ch.id);

  div.innerHTML = `
    <h3>${ch.title}</h3>
    <p>Reward: ₹${ch.reward}</p>
    <button ${isDone ? "disabled" : ""}>
      ${isDone ? "Done ✅" : "Complete"}
    </button>
  `;

  let btn = div.querySelector("button");

  if (!isDone) {
    btn.onclick = () => completeChallenge(ch.id, btn, div);
  } else {
    div.classList.add("completed");
  }

  container.appendChild(div);
});


function completeChallenge(id, btn, card) {
  completedChallenges.push(id);
  localStorage.setItem("completed", JSON.stringify(completedChallenges));

  card.classList.add("completed");
  btn.innerText = "Done ✅";
  btn.disabled = true;

  updateProgress();
}


function updateProgress() {
  let count = completedChallenges.length;
  let total = challenges.length;

  document.getElementById("progressText").innerText =
    `Completed: ${count} / ${total}`;

  let percent = (count / total) * 100;
  document.getElementById("progressFill").style.width = percent + "%";
}


document.getElementById("resetBtn").onclick = () => {
  localStorage.removeItem("completed");
  location.reload();
};


updateProgress();