const opponentHealthBar = document.getElementById('opponent-health');
const playerHealthBar = document.getElementById('player-health');
const extraLifeEl = document.getElementById('extra-life');

const attackBtn = document.getElementById('attack-btn');
const strongAttackBtn = document.getElementById('strong-attack-btn');
const healBtn = document.getElementById('heal-btn');
const logBtn = document.getElementById('log-btn');

function adjustHealthBars(maxLife) {
  opponentHealthBar.max = maxLife;
  opponentHealthBar.value = maxLife;
  playerHealthBar.max = maxLife;
  playerHealthBar.value = maxLife;
}

function dealOpponentDamage(damage) {
  const dealtDamage = Math.floor(Math.random() * damage);
  opponentHealthBar.value = +opponentHealthBar.value - dealtDamage;
  return dealtDamage;
}

function dealPlayerDamage(damage) {
  const dealtDamage = Math.floor(Math.random() * damage);
  playerHealthBar.value = +playerHealthBar.value - dealtDamage;
  return dealtDamage;
}

function increasePlayerHealth(healValue) {
  playerHealthBar.value = +playerHealthBar.value + healValue;
}

function increaseOpponentHealth(healValue) {
  opponentHealthBar.value = +opponentHealthBar.value + healValue;
}

function resetGame(value) {
  playerHealthBar.value = value;
  opponentHealthBar.value = value;
}

function removeExtraLife() {
  extraLifeEl.parentNode.removeChild(extraLifeEl);
}

function setPlayerHealth(health) {
  playerHealthBar.value = health;
}
