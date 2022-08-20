let buttonColors = ["red", "blue", "green", "yellow"];

let gamePattern = [];
let userClickedPattern = [];
let gameOn = false;
let gameLevel = 0;
let userCurrentStrick = 0;

// Should be used only during pattern presentation
let lockButtons = false;

document.addEventListener("keypress", (event) => {
  if (event.key === "a" || event.key === "A") {
    startGame();
  }
});

resetGame = () => {
  $("body").css("background-color", "#011F3F");
  $("#level-title").text("Press A Key to Start");
  gameLevel = 0;
  userCurrentStrick = 0;
  gamePattern = [];
  userClickedPattern = [];
};

gameOver = () => {
  playSound("wrong")
  $("body").css("background-color", "red");
  $("#level-title").text("Game Over");
  gameOn = false;

  setTimeout(() => {
    resetGame();
  }, 3000);
};

$(".btn").click(function () {
  if (gameOn && !lockButtons) {
    let colorChosen = $(this).attr("id");
    $("#" + colorChosen)
      .fadeOut(100)
      .fadeIn(100);
    userClickedPattern.push(colorChosen);

    console.log("user clicked: ", userClickedPattern);
    console.log("game pattern: ", gamePattern);

    console.log(
      "comparing: ",
      userClickedPattern[userCurrentStrick],
      gamePattern[userCurrentStrick]
    );

    if (
      userClickedPattern[userCurrentStrick] != gamePattern[userCurrentStrick]
    ) {
      gameOver();
    } else {
      userCurrentStrick += 1;
      playSound(colorChosen);

      // This means it got all of the strike right
      if (userCurrentStrick == gameLevel) {
        userClickedPattern = [];
        userCurrentStrick = 0;
        setTimeout(() => nextSequence(), 1000);
      }
    }
  }
});

setLevel = () => {
  $("#level-title").text("Level " + gameLevel.toString());
};

function nextSequence() {
  gameLevel += 1;
  console.log("level: ", gameLevel);
  setLevel(gameLevel);

  let randomNumber = Math.floor(Math.random() * 4);
  let randomChosenColor = buttonColors[randomNumber];
  gamePattern.push(randomChosenColor);

  // present the current pattern
  lockButtons = true
  timeoutPromiseArray = gamePattern.map(
    (buttonName, i) =>
      new Promise(function (resolve) {
        setTimeout(() => {
          $("#" + buttonName)
            .fadeOut(100)
            .fadeIn(100);

          playSound(buttonName);
          resolve();
        }, 1000 * i);
      })
  );

  Promise.all(timeoutPromiseArray).then(() => {lockButtons = false})
}

function playSound(name) {
  let audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

function startGame() {
  if (gameOn) {
    alert(
      "Game already started, please finish current game to start a new one"
    );
    return;
  }
  gameOn = true;
  nextSequence();
}
