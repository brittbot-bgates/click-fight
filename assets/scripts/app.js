const PLAYER_NORMAL_ATTACK = 10;
const PLAYER_STRONG_ATTACK = 20;
const OPPONENT_NORMAL_ATTACK = 15;
const OPPONENT_STRONG_ATTACK = 25;
const PLAYER_HEAL_VALUE = 20;
const OPPONENT_HEAL_VALUE = 20;
const PLAYER_NORMAL_MODE_ATTACK = "ATTACK";
const PLAYER_STRONG_MODE_STRONG_ATTACK = "STRONG_ATTACK";
const OPPONENT_NORMAL_MODE_ATTACK = "ATTACK";
const OPPONENT_STRONG_MODE_STRONG_ATTACK = "STRONG_ATTACK";
const LOG_EVENT_PLAYER_NORMAL_ATTACK = "PLAYER_NORMAL_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_OPPONENT_NORMAL_ATTACK = "OPPONENT_NORMAL_ATTACK";
const LOG_EVENT_OPPONENT_STRONG_ATTACK = "OPPONENT_STRONG_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_OPPONENT_HEAL = "OPPONENT_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

let startingPlayerHealth = 100;
let startingOpponentHealth = 100;
let battleLog = [];
let battleLogLastEntry;
let extraLife = true;

function fightLog(event, value, opponentHealth, playerHealth) {
  let logEntry = {
    event: event,
    value: value,
    finalOpponentHealth: opponentHealth,
    finalPlayerHealth: playerHealth
  };

  // since all the other parameters will get push to the array I can just focus on adding the target
  switch (event) {
    case LOG_EVENT_PLAYER_NORMAL_ATTACK:
      logEntry.target = "OPPONENT";
      break;
    case LOG_EVENT_PLAYER_STRONG_ATTACK:
      logEntry.target = "OPPONENT";
      break;
    case LOG_EVENT_PLAYER_HEAL:
      logEntry.target = "PLAYER";
      break;
    case LOG_EVENT_OPPONENT_NORMAL_ATTACK:
      logEntry.target = "PLAYER";
      break;
    case LOG_EVENT_GAME_OVER:
      logEntry = {
        event: event,
        value: value,
        finalOpponentHealth: opponentHealth,
        finalPlayerHealth: playerHealth
      };
      break;
    default:
      logEvent = {};
  }
  battleLog.push(logEntry);
}

function fight(attackMode) {
  let maxDamage;
  let logEvent;

  if (attackMode === PLAYER_NORMAL_MODE_ATTACK) {
    maxDamage = PLAYER_NORMAL_ATTACK;
    logEvent = LOG_EVENT_PLAYER_NORMAL_ATTACK;
  } else if (attackMode === PLAYER_STRONG_MODE_STRONG_ATTACK) {
    maxDamage = PLAYER_STRONG_ATTACK;
    logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
  }
  const damage = dealOpponentDamage(maxDamage);
  startingOpponentHealth -= damage;
  fightLog(logEvent, damage, startingOpponentHealth, startingPlayerHealth);
  fightResults();
}

function fightResults() {
  const initialPlayerHealth = startingPlayerHealth;
  const damageToPlayer = dealPlayerDamage(OPPONENT_NORMAL_ATTACK);
  startingPlayerHealth -= damageToPlayer;
  fightLog(LOG_EVENT_OPPONENT_NORMAL_ATTACK, damageToPlayer, startingOpponentHealth, startingPlayerHealth);

  // If the player's health goes to 0 then the extra life is consumed
  if (startingPlayerHealth <= 0 && extraLife) {
    extraLife = false;
    removeExtraLife();
    fightLog("EXTRA LIFE", "EXTRA LIFE CONSUMED", startingOpponentHealth, startingPlayerHealth);
    startingPlayerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert("Extra Life keeps you in the fight!")
  }

  // determine whether someone dies at the end the fight round
  if (startingOpponentHealth <= 0 && startingPlayerHealth > 0) {
    alert("You won!");
    fightLog(LOG_EVENT_GAME_OVER, "PLAYER_WON", startingOpponentHealth, startingPlayerHealth);
    newGame();
  } else if (startingPlayerHealth <= 0 && startingOpponentHealth > 0) {
    alert("You lost!");
    fightLog(LOG_EVENT_GAME_OVER, "OPPONENT_WON", startingOpponentHealth, startingPlayerHealth);
    newGame();
  } else if (startingPlayerHealth <= 0 && startingOpponentHealth <= 0) {
    alert("It's a draw!");
    fightLog(LOG_EVENT_GAME_OVER, "DRAW", startingOpponentHealth, startingPlayerHealth);
    newGame();
  }
}

function newGame() {
  startingPlayerHealth = 100;
  startingOpponentHealth = 100;
  resetGame(startingPlayerHealth);
}

function attackHandler() {
  fight(PLAYER_NORMAL_MODE_ATTACK);
}

function strongAttackHandler() {
  fight(PLAYER_STRONG_MODE_STRONG_ATTACK);
}

function healPlayerHandler() {
  // let healValue;
  // if (currentPlayerHealth >= startingPlayerHealth - HEAL_VALUE) {
  //   alert("You can't heal more than max initial health.");
  //   healValue = startingPlayerHealth - currentPlayerHealth;
  // } else {
  //   healValue = HEAL_VALUE;
  // }
  // increasePlayerHealth(HEAL_VALUE);
  // currentPlayerHealth += HEAL_VALUE;
  // fightLog(LOG_EVENT_PLAYER_HEAL, healValue, currentMonsterHealth, currentPlayerHealth);
  // fightResults();
}

function printLogHandler() {
  // regular for loop
  for (let i = 0; i < 3; i++) {
    console.log("----------");
  }
  // for-of loop
  // works best with arrays
  // for (const entry of battleLog) {
  //   console.log(entry);
  // }
  // for-in loop
  let i = 0;
  for (const entry of battleLog) {
    if (!battleLogLastEntry && battleLogLastEntry !== 0 || battleLogLastEntry < i) {
      console.log(`#${i}`);
      for (const key in entry) {
        console.log(key);
        console.log(`${key} => ${entry[key]}`);
      }
      battleLogLastEntry = i;
      break;
    }
    i++;    
  }
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
