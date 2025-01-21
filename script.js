// Get DOM elements
const gameContainer = document.querySelector(".container"),
    userResult = document.querySelector(".user_result img"),
    cpuResult = document.querySelector(".cpu_result img"),
    result = document.querySelector(".result"),
    optionImages = document.querySelectorAll(".option_image"),
    musicButton = document.querySelector(".music-btn"),
    musicIcon = document.getElementById("music-icon"),
    bgMusic = document.getElementById("bg-music"),
    soundButton = document.querySelector(".sound-btn"),
    soundIcon = document.getElementById("sound-icon"),
    choiceSound = document.getElementById("choice-sound"),
    userScoreDisplay = document.querySelector(".user-score"),
    cpuScoreDisplay = document.querySelector(".cpu-score"),
    startOverlay = document.getElementById("start-overlay"),
    startButton = document.getElementById("start-button"),
    infoButton = document.querySelector(".info-btn"),
    infoPopup = document.getElementById("info-popup"),
    closeInfoButton = document.getElementById("close-info");

// Define the music icon paths
const musicOnIcon = "./assets/music-on.png";
const musicOffIcon = "./assets/music-off.png";

// Define the sound icon paths
    const soundOnIcon = "./assets/sound-on.png";
    const soundOffIcon = "./assets/sound-off.png";

// State variables
let soundEffectsEnabled = true;
let userWins = 0;  // Track user wins
let cpuWins = 0;   // Track CPU wins

// Function to display result with effect
function displayResultWithEffect(text) {
    result.textContent = ""; // Update the result text
    result.classList.add("effect"); // Add animation class

    // Remove the class after animation ends to reset
    setTimeout(() => {
        result.textContent = text;
        result.classList.remove("effect");
    }, 100); // Match animation duration in CSS
}

// Function to update scoreboard
function updateScoreBoard() {
    userScoreDisplay.textContent = `User Wins: ${userWins}`;
    cpuScoreDisplay.textContent = `CPU Wins: ${cpuWins}`;
}

// Function to reset the game
function resetGame() {
    userWins = 0;
    cpuWins = 0;
    updateScoreBoard();
    result.textContent = "Let's Play!!";
    optionImages.forEach(image => image.classList.remove("active"));
}

// Function to check if the game has ended
function checkGameEnd() {
    if (userWins === 3) {
        displayResultWithEffect("Congratulations!");
        setTimeout(resetGame, 5000);
    } else if (cpuWins === 3) {
        displayResultWithEffect("Oh no!");
        setTimeout(resetGame, 5000);
    }
}

// Function to play sound with background music adjustment
function playSoundWithBgAdjustment(sound) {
    // Pause and lower the background music
    bgMusic.volume = 0.12;
    setTimeout(() => {
        if (soundEffectsEnabled) {
            sound.currentTime = 0;
            sound.play();
        }
    }, 500); // Delay to match the transition effect

    // Resume background music after the sound effect ends
    sound.onended = () => {
        bgMusic.volume = 0.3; // Restore the volume gradually if needed
    };
}

// Loop through each option image element
optionImages.forEach((image, index) => {
    image.addEventListener("click", (e) => {
        // Add 'active' class to the clicked image
        image.classList.add("active");

        // Reset images and classes
        userResult.src = cpuResult.src = "./assets/rock.png";
        optionImages.forEach((image2, index2) => {
            if (index !== index2) image2.classList.remove("active");
        });

        // Add class to animate the game container
        gameContainer.classList.add("start");

        // Set timeout to delay result calculation
        setTimeout(() => {
            gameContainer.classList.remove("start");

            // Get user choice and update image
            let imageSrc = e.target.querySelector("img").src;
            userResult.src = imageSrc;

            // Generate a random CPU choice
            let randomNumber = Math.floor(Math.random() * 3);
            let cpuImages = ["./assets/rock.png", "./assets/paper.png", "./assets/scissors.png"];
            cpuResult.src = cpuImages[randomNumber];

            // Map choices to values
            let cpuValue = ["R", "P", "S"][randomNumber];
            let userValue = ["R", "P", "S"][index];

            // Define outcomes
            let outcomes = {
                RR: "Draw",
                RP: "Cpu",
                RS: "User",
                PP: "Draw",
                PR: "User",
                PS: "Cpu",
                SS: "Draw",
                SP: "User",
                SR: "Cpu"
            };

            // Determine the result
            let outComeValue = outcomes[userValue + cpuValue];
            let resultText = userValue === cpuValue ? "Match Draw" : `${outComeValue} Won!!`;

            // Update score
            if (outComeValue === "User") {
                userWins++;
            } else if (outComeValue === "Cpu") {
                cpuWins++;
            }

            // Update scoreboard
            updateScoreBoard();

            // Display the result with effect
            displayResultWithEffect(resultText);

            // Check if the game has ended
            checkGameEnd();
        }, 5500); // Timeout duration to sync animations

        // Play choice sound with background music adjustment
        playSoundWithBgAdjustment(choiceSound);
    });
});

// Toggle background music
musicButton.addEventListener("click", () => {
    if (bgMusic.paused) {
        bgMusic.play(); // Play music
        musicIcon.src = musicOnIcon; // Update icon to 'music on'
    } else {
        bgMusic.pause(); // Pause music
        musicIcon.src = musicOffIcon; // Update icon to 'music off'
    }
});

// Toggle sound effects
soundButton.addEventListener("click", () => {
    soundEffectsEnabled = !soundEffectsEnabled;
    soundIcon.src = soundEffectsEnabled ? soundOnIcon : soundOffIcon; // Update sound icon
});

// Automatically play background music when the "Start Game" button is clicked
startButton.addEventListener("click", () => {
    bgMusic.play();
    musicIcon.src = musicOnIcon; // Ensure the icon matches the state
    startOverlay.style.display = "none";
    gameContainer.style.display = "block"; // Show the game container

    //Show the info pop up after start game
    infoPopup.style.display = "block";
});

// Show the info popup when the info button is clicked
infoButton.addEventListener("click", () => {
    infoPopup.style.display = "block";
});

// Close the info popup when the close button is clicked
closeInfoButton.addEventListener("click", () => {
    infoPopup.style.display = "none";
});