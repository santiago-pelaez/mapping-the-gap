import { cases as caseDeck, regions, tribalBoundary } from "./data.mjs";

const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");

const startPanel = document.getElementById("startPanel");
const startGameButton = document.getElementById("startGame");
const casesReviewedEl = document.getElementById("casesReviewed");
const correctDecisionsEl = document.getElementById("correctDecisions");
const badClaimsChallengedEl = document.getElementById("badClaimsChallenged");
const credibilityEl = document.getElementById("credibility");
const fundingStatusEl = document.getElementById("fundingStatus");
const caseTitleEl = document.getElementById("caseTitle");
const caseMetaEl = document.getElementById("caseMeta");
const challengeButton = document.getElementById("challengeButton");
const verifyButton = document.getElementById("verifyButton");
const evidenceButton = document.getElementById("evidenceButton");
const feedbackEl = document.getElementById("feedback");
const evidenceCountEl = document.getElementById("evidenceCount");
const fundingFillEl = document.getElementById("fundingFill");
const messageEl = document.getElementById("message");
const playAgainButton = document.getElementById("playAgain");

const TOTAL_BAD_CLAIMS = 4;
const BORDER_COLOR = "#4f3522";
const MISTAKE_COLOR = "#8A7864";

const state = {
  started: false,
  finished: false,
  caseIndex: 0,
  casesReviewed: 0,
  correctDecisions: 0,
  badClaimsChallenged: 0,
  credibility: 100,
  regionOutcomes: new Map(),
  playDeck: []
};

function shuffle(items) {
  const copy = items.slice();

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function drawBackground() {
  ctx.fillStyle = "#d6c090";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.strokeStyle = "rgba(79, 53, 34, 0.13)";
  ctx.lineWidth = 1.5;

  for (let y = 34; y < canvas.height; y += 42) {
    ctx.beginPath();
    for (let x = -20; x <= canvas.width + 20; x += 20) {
      const wave = Math.sin((x + y) / 48) * 8 + Math.cos((x - y) / 62) * 5;
      if (x === -20) {
        ctx.moveTo(x, y + wave);
      } else {
        ctx.lineTo(x, y + wave);
      }
    }
    ctx.stroke();
  }

  ctx.restore();
}

function drawPolygon(points) {
  ctx.beginPath();
  points.forEach(([x, y], index) => {
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.closePath();
}

function centerOf(points) {
  const total = points.reduce((sum, [x, y]) => {
    sum.x += x;
    sum.y += y;
    return sum;
  }, { x: 0, y: 0 });

  return {
    x: total.x / points.length,
    y: total.y / points.length
  };
}

function drawRegionLabel(region) {
  const center = centerOf(region.points);
  ctx.save();
  ctx.fillStyle = "rgba(48, 31, 19, 0.88)";
  ctx.font = "700 18px Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(region.id, center.x, center.y);
  ctx.restore();
}

function drawRegions() {
  regions.forEach((region) => {
    drawPolygon(region.points);
    ctx.fillStyle = state.regionOutcomes.get(region.id) || region.fill;
    ctx.fill();
    ctx.strokeStyle = BORDER_COLOR;
    ctx.lineWidth = 3;
    ctx.stroke();
    drawRegionLabel(region);
  });
}

function drawTribalBoundary() {
  ctx.save();
  drawPolygon(tribalBoundary);
  ctx.strokeStyle = "rgba(79, 53, 34, 0.92)";
  ctx.lineWidth = 4;
  ctx.setLineDash([14, 9]);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "rgba(79, 53, 34, 0.86)";
  ctx.font = "700 15px Georgia, serif";
  ctx.fillText("Tribal boundary", 610, 578);
  ctx.restore();
}

function renderMap() {
  drawBackground();
  drawRegions();
  drawTribalBoundary();
}

function renderFeedback(message, tone) {
  feedbackEl.className = `feedback-box ${tone}`;
  feedbackEl.textContent = message;
}

function renderCase() {
  const currentCase = state.playDeck[state.caseIndex];

  caseTitleEl.textContent = currentCase.title;
  caseMetaEl.innerHTML = "";

  [
    `Region: ${currentCase.regionId}`,
    currentCase.claim,
    `Provider: ${currentCase.provider}`,
    `Evidence: ${currentCase.evidence}`,
    currentCase.question
  ].forEach((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    caseMetaEl.appendChild(item);
  });

  renderFeedback("Choose the decision that best fits the evidence.", "pending");
  setDecisionButtons(true);
}

function setDecisionButtons(enabled) {
  challengeButton.disabled = !enabled;
  verifyButton.disabled = !enabled;
  evidenceButton.disabled = !enabled;
}

function getFundingStatus() {
  if (state.badClaimsChallenged === 0) {
    return "Blocked";
  }

  if (state.badClaimsChallenged < TOTAL_BAD_CLAIMS || state.credibility < 55) {
    return "At Risk";
  }

  return "Eligible";
}

function updateStats() {
  casesReviewedEl.textContent = state.casesReviewed;
  correctDecisionsEl.textContent = state.correctDecisions;
  badClaimsChallengedEl.textContent = state.badClaimsChallenged;
  credibilityEl.textContent = state.credibility;
  fundingStatusEl.textContent = getFundingStatus();
  evidenceCountEl.textContent = state.badClaimsChallenged;
  fundingFillEl.style.width = `${(state.badClaimsChallenged / TOTAL_BAD_CLAIMS) * 100}%`;
}

function incorrectFeedback(action, currentCase) {
  const labels = {
    challenge: "submitting a challenge",
    verify: "verifying the claim",
    evidence: "asking for more evidence"
  };

  return `Not quite. You chose ${labels[action]}, but the stronger decision was ${labels[currentCase.correctAction]}. ${currentCase.feedback}`;
}

function finishGame() {
  state.finished = true;
  setDecisionButtons(false);

  if (state.badClaimsChallenged === TOTAL_BAD_CLAIMS && state.credibility >= 55) {
    messageEl.textContent = "Victory. The false coverage claims were challenged, credibility held, and funding eligibility is unlocked.";
  } else if (state.badClaimsChallenged >= 3 && state.credibility >= 40) {
    messageEl.textContent = "Partial success. The map improved, but some mistakes still leave funding at risk.";
  } else {
    messageEl.textContent = "Defeat. Too many claims remained uncorrected, so the flawed map keeps blocking funding.";
  }

  caseTitleEl.textContent = "Review Complete";
  caseMetaEl.innerHTML = "";

  [
    `Correct decisions: ${state.correctDecisions} of ${state.playDeck.length}`,
    `False coverage claims challenged: ${state.badClaimsChallenged} of ${TOTAL_BAD_CLAIMS}`,
    `Credibility remaining: ${state.credibility}`,
    "The result shows how evidence quality shapes whether lived broadband gaps become visible to funding systems."
  ].forEach((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    caseMetaEl.appendChild(item);
  });
}

function handleDecision(action) {
  if (!state.started || state.finished) {
    return;
  }

  const currentCase = state.playDeck[state.caseIndex];
  const isCorrect = action === currentCase.correctAction;

  state.casesReviewed += 1;

  if (isCorrect) {
    state.correctDecisions += 1;
    state.regionOutcomes.set(currentCase.regionId, currentCase.successColor);
    renderFeedback(currentCase.feedback, "correct");

    if (action === "challenge") {
      state.badClaimsChallenged += 1;
    }
  } else {
    state.credibility = Math.max(0, state.credibility - 15);
    state.regionOutcomes.set(currentCase.regionId, MISTAKE_COLOR);
    renderFeedback(incorrectFeedback(action, currentCase), "incorrect");
  }

  setDecisionButtons(false);
  updateStats();
  renderMap();

  if (state.caseIndex >= state.playDeck.length - 1) {
    finishGame();
    return;
  }

  state.caseIndex += 1;
  window.setTimeout(renderCase, 900);
}

function startGame() {
  state.started = true;
  state.finished = false;
  startPanel.classList.add("hidden");
  messageEl.textContent = "Read each case and choose the strongest decision.";
  renderCase();
}

function resetGame(showStart = true) {
  state.started = !showStart;
  state.finished = false;
  state.caseIndex = 0;
  state.casesReviewed = 0;
  state.correctDecisions = 0;
  state.badClaimsChallenged = 0;
  state.credibility = 100;
  state.regionOutcomes = new Map();
  state.playDeck = shuffle(caseDeck);

  startPanel.classList.toggle("hidden", !showStart);
  setDecisionButtons(false);
  updateStats();
  renderMap();

  if (showStart) {
    caseTitleEl.textContent = "Current Case";
    caseMetaEl.innerHTML = "<li>Press start to receive the first case file.</li>";
    renderFeedback("Feedback appears after you choose.", "pending");
    messageEl.textContent = "Press Start Challenge Desk when ready.";
    return;
  }

  messageEl.textContent = "Read each case and choose the strongest decision.";
  renderCase();
}

startGameButton.addEventListener("click", startGame);
playAgainButton.addEventListener("click", () => resetGame(true));
challengeButton.addEventListener("click", () => handleDecision("challenge"));
verifyButton.addEventListener("click", () => handleDecision("verify"));
evidenceButton.addEventListener("click", () => handleDecision("evidence"));

resetGame(true);
