const PLAYER_NORMAL_ATTACK = 10;
const PLAYER_STRONG_ATTACK = 20;
const OPPONENT_NORMAL_ATTACK = 10;
const OPPONENT_STRONG_ATTACK = 20;
const PLAYER_HEAL_VALUE = 20;
const OPPONENT_HEAL_VALUE = 20; // will be used in future version
const PLAYER_NORMAL_MODE_ATTACK = "ATTACK";
const PLAYER_STRONG_MODE_STRONG_ATTACK = "STRONG_ATTACK";
const OPPONENT_NORMAL_MODE_ATTACK = "ATTACK";
const OPPONENT_STRONG_MODE_STRONG_ATTACK = "STRONG_ATTACK";
const LOG_EVENT_PLAYER_NORMAL_ATTACK = "PLAYER_NORMAL_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_OPPONENT_NORMAL_ATTACK = "OPPONENT_NORMAL_ATTACK";
const LOG_EVENT_OPPONENT_STRONG_ATTACK = "OPPONENT_STRONG_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_OPPONENT_HEAL = "OPPONENT_HEAL"; // will be used in future version
const LOG_EVENT_GAME_OVER = "GAME_OVER";

let startingPlayerHealth = 100;
let startingOpponentHealth = 100;
let currentPlayerHealth = startingPlayerHealth;
let currentOpponentHealth = startingOpponentHealth;
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
    case LOG_EVENT_OPPONENT_STRONG_ATTACK:
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
  let playerMaxDamage;
  let opponentMaxDamage
  let playerLogEvent;
  let opponentLogEvent;
  let opponentAttackMode;
  let randomNum = Math.floor(Math.random() * 4);

  // This code determines the opponent's attack
  if (randomNum === 3) {
    opponentAttackMode = OPPONENT_STRONG_MODE_STRONG_ATTACK;
  } else {
    opponentAttackMode = OPPONENT_NORMAL_MODE_ATTACK;
  }

  if (attackMode === PLAYER_NORMAL_MODE_ATTACK) {
    playerMaxDamage = PLAYER_NORMAL_ATTACK;
    playerLogEvent = LOG_EVENT_PLAYER_NORMAL_ATTACK;
  } else if (attackMode === PLAYER_STRONG_MODE_STRONG_ATTACK) {
    playerMaxDamage = PLAYER_STRONG_ATTACK;
    playerLogEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
  }

  if (opponentAttackMode === OPPONENT_NORMAL_MODE_ATTACK) {
    opponentMaxDamage = OPPONENT_NORMAL_ATTACK;
    opponentLogEvent = LOG_EVENT_OPPONENT_NORMAL_ATTACK;
  } else if (opponentAttackMode === OPPONENT_STRONG_MODE_STRONG_ATTACK) {
    opponentMaxDamage = OPPONENT_STRONG_ATTACK;
    opponentLogEvent = LOG_EVENT_OPPONENT_STRONG_ATTACK;
  }

  // player hits the opponent
  const damage = dealOpponentDamage(playerMaxDamage);
  currentOpponentHealth -= damage;
  fightLog(playerLogEvent, damage, currentOpponentHealth, currentPlayerHealth);

  // Opponent hits the player
  const damageToPlayer = dealPlayerDamage(opponentMaxDamage);
  currentPlayerHealth -= damageToPlayer;
  fightLog(opponentLogEvent, damageToPlayer, currentOpponentHealth, currentPlayerHealth);
  fightResults();
}

function fightResults() {
  const initialPlayerHealth = currentPlayerHealth;

  // If the player's health goes to 0 (or below) during a round then the extra life is consumed
  if (currentPlayerHealth <= 0 && extraLife) {
    extraLife = false;
    removeExtraLife();
    fightLog("EXTRA LIFE", "EXTRA LIFE CONSUMED", currentOpponentHealth, currentPlayerHealth);
    currentPlayerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert("Extra Life keeps you in the fight!")
  }

  // Determines whether the player or the opponent dies at the end the round and chooses a winner
  if (currentOpponentHealth <= 0 && currentPlayerHealth > 0) {
    alert("You won!");
    fightLog(LOG_EVENT_GAME_OVER, "PLAYER_WON", currentOpponentHealth, currentPlayerHealth);
    newGame();
  } else if (currentPlayerHealth <= 0 && currentOpponentHealth > 0) {
    alert("You lost!");
    fightLog(LOG_EVENT_GAME_OVER, "OPPONENT_WON", currentOpponentHealth, currentPlayerHealth);
    newGame();
  } else if (currentPlayerHealth <= 0 && currentOpponentHealth <= 0) {
    alert("It's a draw!");
    fightLog(LOG_EVENT_GAME_OVER, "DRAW", currentOpponentHealth, currentPlayerHealth);
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
  let healValue;
  if (currentPlayerHealth >= startingPlayerHealth - PLAYER_HEAL_VALUE) {
    alert("You can't heal more than max initial health.");
    healValue = startingPlayerHealth - currentPlayerHealth;
  } else {
    healValue = PLAYER_HEAL_VALUE;
  }
  increasePlayerHealth(PLAYER_HEAL_VALUE);
  currentPlayerHealth += PLAYER_HEAL_VALUE;
  fightLog(LOG_EVENT_PLAYER_HEAL, healValue, currentOpponentHealth, currentPlayerHealth);
  fightResults();
}

function printLogHandler() {
  // I like this log better
  console.log(battleLog);

  // This loop prints out the log one attack at a time
  // let i = 0;
  // for (const entry of battleLog) {
  //   if (!battleLogLastEntry && battleLogLastEntry !== 0 || battleLogLastEntry < i) {
  //     console.log(`#${i}`);
  //     for (const key in entry) {
  //       console.log(key);
  //       console.log(`${key} => ${entry[key]}`);
  //     }
  //     console.log("----------");
  //     battleLogLastEntry = i;
  //     break;
  //   }
  //   i++;
  // }
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
