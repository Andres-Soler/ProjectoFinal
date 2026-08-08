function openLesson(lesson) {
        console.log("Opening lesson:", lesson);
    }
const questions = [
    {
        question: "What is a variable?",

        answers: [
            "A place to store information",
            "A type of computer",
            "A programming language",
            "A mathematical equation"
        ],

        correct: 0
    }
];


function createQuestion(questionData) {

    document.getElementById("question-text").textContent = questionData.question;

    document.getElementById("answer-1").textContent = questionData.answers[0];
    document.getElementById("answer-2").textContent = questionData.answers[1];
    document.getElementById("answer-3").textContent = questionData.answers[2];
    document.getElementById("answer-4").textContent = questionData.answers[3];
}


createQuestion(questions[0]);