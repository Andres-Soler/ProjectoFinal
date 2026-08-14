let lives = 3;
document.getElementById("retry-button").onclick = function() {

    lives = 3;


    // Restore hearts
    document.getElementById("life-1").src =
        "assets/ui/heart-full.png";

    document.getElementById("life-2").src =
        "assets/ui/heart-full.png";

    document.getElementById("life-3").src =
        "assets/ui/heart-full.png";


    // Hide game over
    document.getElementById("game-over-screen").style.display =
        "none";


    // Start lesson again
    startLesson();

};
document.getElementById("exit-button").onclick = function() {

    window.location.href = "index.html";

};
const lessons = {

    introduction: {

        title: "Introduction",

        activities: [

            {
                type: "info",

                title: "What is Programming?",

                text: "Programming is the process of giving a computer instructions to perform tasks. These instructions are written using programming languages such as Python, JavaScript, Java, and C++."
            },

            {
                type: "multiple-choice",

                question: "What is programming?",

                answers: [
                    "Designing computer hardware",
                    "Giving a computer instructions to perform tasks",
                    "Using the internet",
                    "Installing applications"
                ],

                correct: 1
            },

            {
                type: "multiple-choice",

                question: "What does this code do?",

                code: 'print("Hello!")',

                answers: [
                    "It stores Hello! in a variable",
                    "It displays Hello!",
                    "It creates a new program",
                    "It deletes text"
                ],

                correct: 1
            },

            {
                type: "matching",

                question: "Match each concept with its description.",

                pairs: [
                    {
                        left: "Program",
                        right: "A set of instructions"
                    },
                    {
                        left: "Programming",
                        right: "Creating instructions for a computer"
                    },
                    {
                        left: "Python",
                        right: "A programming language"
                    }
                ]
            },

            {
                type: "code",

                question: 'Write code that displays "Hello, world!"',

                expected: 'print("Hello, world!")'
            }

        ]
    },


    variables: {

        title: "Variables",

        activities: [

            {
                type: "info",

                title: "What is a Variable?",

                text: "A variable is a named place where a program can store information. The value stored in a variable can be used and changed while the program runs."
            },

            {
                type: "multiple-choice",

                question: "Which line creates a variable called age?",

                answers: [
                    "age = 18",
                    "print(age)",
                    "age == 18",
                    "variable age"
                ],

                correct: 0
            },

            {
                type: "code",

                question: 'Create a variable called "score" and give it the value 100.',

                expected: "score = 100"
            }

        ]
    }

};
function loseLife() {

    if (lives <= 0) {
        return;
    }

    const heart = document.getElementById("life-" + lives);
    console.log("Heart:", heart);
    console.log("Image path:", heart.src);

    if (heart) {
        heart.src = "assets/ui/heart-empty.png";
    }

    lives--;

    console.log("Lives remaining:", lives);

    if (lives === 0) {

        showGameOver();

    }

}
function showGameOver() {

    // Hide the current activity
    document.querySelector(".question").style.display = "none";

    document.querySelector(".check-button").style.display = "none";


    // Hide matching activity if it exists
    const matchingContainer =
        document.getElementById("matching-container");

    if (matchingContainer) {
        matchingContainer.style.display = "none";
    }


    // Hide code editor
    const codeEditor =
        document.getElementById("code-editor");

    if (codeEditor) {
        codeEditor.style.display = "none";
    }


    // Show game over screen
    const gameOverScreen =
        document.getElementById("game-over-screen");

    gameOverScreen.style.display = "flex";

}
function openLesson(lesson) {

    window.location.href = "lesson.html?lesson=" + lesson;

}



const urlParams = new URLSearchParams(window.location.search);

const lessonId = urlParams.get("lesson");

const currentLesson = lessons[lessonId];




let currentActivityIndex = 0;

let selectedAnswer = null;

let currentQuestion = null;




function startLesson() {

    if (!currentLesson) {

        console.error("Lesson not found:", lessonId);

        return;
    }

    currentActivityIndex = 0;

    showActivity();

}




function showActivity() {

    const activity = currentLesson.activities[currentActivityIndex];

    if (!activity) {

        finishLesson();

        return;
    }


    if (activity.type === "info") {

        showInfo(activity);

    }

    else if (activity.type === "multiple-choice") {

        createQuestion(activity);

    }

    else if (activity.type === "matching") {

        showMatching(activity);

    }

    else if (activity.type === "code") {

        showCodeExercise(activity);

    }

    else if (activity.type === "debug") {

        showDebugExercise(activity);

    }

    else {

        console.error("Unknown activity type:", activity.type);

    }

}




function showInfo(activity) {

    const infoScreen = document.getElementById("info-screen");

    const questionScreen = document.querySelector(".question");

    infoScreen.style.display = "block";

    questionScreen.style.display = "none";

    document.getElementById("info-title").textContent = activity.title;

    document.getElementById("info-text").textContent = activity.text;

    document.getElementById("info-next").onclick = function() {

        infoScreen.style.display = "none";

        questionScreen.style.display = "block";

        nextActivity();

    };

}

// Preguntas

function createQuestion(questionData) {
    document.querySelector(".check-button").style.display = "block";
    document.querySelector(".answers").style.display = "flex";

    currentQuestion = questionData;

    selectedAnswer = null;


    document.getElementById("question-text").textContent =
        questionData.question;

    const codeBlock = document.getElementById("question-code");

    if (questionData.code) {
       codeBlock.textContent = questionData.code;
       codeBlock.style.display = "block";
    } else {
       codeBlock.style.display = "none";
    }
    const answers = document.querySelectorAll(".answer");


    answers.forEach((button, index) => {

        button.textContent = questionData.answers[index];

        button.classList.remove("selected");


        button.onclick = function() {

            selectedAnswer = index;


            answers.forEach(answer => {

                answer.classList.remove("selected");

            });


            button.classList.add("selected");

        };

    });

}




function checkAnswer() {

    if (selectedAnswer === null) {

        return;
    }


    if (selectedAnswer === currentQuestion.correct) {

        console.log("Correct!");

        nextActivity();

    }

    else {

        console.log("Wrong!");
        loseLife();

    }

}


 // Matching
function showMatching(activity) {
    
    const codeBlock = document.getElementById("question-code");

    if (codeBlock) {
        codeBlock.style.display = "none";
    }

    const questionScreen = document.querySelector(".question");

    questionScreen.style.display = "block";


    // Hide multiple-choice answers
    const answersContainer = document.querySelector(".answers");

    answersContainer.style.display = "none";


    // Hide CHECK
    document.querySelector(".check-button").style.display = "none";


    // Question text
    document.getElementById("question-text").textContent = activity.question;


    // Create matching container
    let matchingContainer = document.getElementById("matching-container");

    if (!matchingContainer) {

        matchingContainer = document.createElement("div");

        matchingContainer.id = "matching-container";

        questionScreen.appendChild(matchingContainer);

    }


    matchingContainer.innerHTML = "";
    matchingContainer.style.display = "flex";



    let selectedLeft = null;

    let matchedPairs = 0;


    // Create columns
    const leftColumn = document.createElement("div");

    const rightColumn = document.createElement("div");

    leftColumn.className = "matching-column";

    rightColumn.className = "matching-column";


    // ==========================
    // LEFT SIDE
    // ==========================

    activity.pairs.forEach((pair, index) => {

        const leftButton = document.createElement("button");

        leftButton.className = "matching-option left-option";

        leftButton.textContent = pair.left;


        // Store which pair this belongs to
        leftButton.dataset.index = index;


        leftButton.onclick = function() {

            if (leftButton.classList.contains("matched")) {
                return;
            }


            // Remove previous selection
            document
                .querySelectorAll(".left-option")
                .forEach(button => {
                    button.classList.remove("selected");
                });


            selectedLeft = index;

            leftButton.classList.add("selected");

        };


        leftColumn.appendChild(leftButton);

    });


    // ==========================
    // RIGHT SIDE
    // ==========================

    // Make a copy so we DON'T modify activity.pairs
    const shuffledPairs = [...activity.pairs];


    // Shuffle the copy
    shuffledPairs.sort(() => Math.random() - 0.5);


    shuffledPairs.forEach(pair => {

        const rightButton = document.createElement("button");

        rightButton.className = "matching-option right-option";

        rightButton.textContent = pair.right;


        // Find the original pair this belongs to
        const originalIndex = activity.pairs.indexOf(pair);

        rightButton.dataset.index = originalIndex;


        rightButton.onclick = function() {

            if (rightButton.classList.contains("matched")) {
                return;
            }


            if (selectedLeft === null) {
                return;
            }


            // Check if the selected left item
            // belongs to this right item
            if (selectedLeft === originalIndex) {

                const leftButton = document.querySelector(
                    `.left-option[data-index="${originalIndex}"]`
                );


                // Correct match
                leftButton.classList.remove("selected");

                leftButton.classList.add("matched");

                rightButton.classList.add("matched");


                matchedPairs++;

                selectedLeft = null;


                // Finished all pairs
                if (matchedPairs === activity.pairs.length) {

                    console.log("Matching complete!");


                    setTimeout(() => {

                        nextActivity();

                    }, 500);

                }

            }

            else {

                // Wrong match
                console.log("Wrong match!");
                
                loseLife();

                selectedLeft = null;
                


                document
                    .querySelectorAll(".left-option")
                    .forEach(button => {
                        button.classList.remove("selected");
                    });

            }

        };


        rightColumn.appendChild(rightButton);

    });


    matchingContainer.appendChild(leftColumn);

    matchingContainer.appendChild(rightColumn);

}



function showCodeExercise(activity) {
    const matchingContainer = document.getElementById("matching-container");

    if (matchingContainer) {
        matchingContainer.style.display = "none";
    }

    const questionScreen = document.querySelector(".question");

    questionScreen.style.display = "block";


    // Hide multiple-choice stuff
    const answersContainer = document.querySelector(".answers");

    answersContainer.style.display = "none";


    // Hide code display from "what does this code do?"
    const codeBlock = document.getElementById("question-code");

    if (codeBlock) {
        codeBlock.style.display = "none";
    }


    // Show CHECK
    document.querySelector(".check-button").style.display = "block";


    // Show question
    document.getElementById("question-text").textContent =
        activity.question;


    // Show editor
    const editor = document.getElementById("code-editor");

    editor.style.display = "block";

    editor.value = "";


    // Make CHECK check this code
    document.querySelector(".check-button").onclick = function() {

        const userCode = editor.value.trim();

        const expectedCode = activity.expected.trim();


        if (userCode === expectedCode) {

            console.log("Correct!");

            nextActivity();

        }

        else {

            console.log("Wrong!");
            loseLife();

        }

    };

}



function showDebugExercise(activity) {

    console.log("Debug exercise:", activity);


}



function nextActivity() {

    currentActivityIndex++;

    showActivity();

}



function finishLesson() {

    console.log("Lesson complete!");

}



if (currentLesson) {

    startLesson();

}