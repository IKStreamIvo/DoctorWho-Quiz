window.addEventListener("load", init);

//Better looking radio buttons (source: https://material.io/icons/)
var svgUnchecked = "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z";
var svgChecked = "M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z";

//References
var intro;
var quiz;
var outro;
var quizOption;
var backButton;
var nextButton;

//Storage
var questionsList;
var answersList;
var options;
var quizOptions;
var currentQuestion;
var checkedQuestions;

function init(){
    //Setup
    intro = document.querySelector(".intro");
    quiz = document.querySelector("#quiz");
    outro = document.querySelector(".outro");
    quizOption = quiz.querySelector("#option");
    backButton = quiz.querySelector("#back");
    nextButton = quiz.querySelector("#next");
    quizOptions = [];
    checkedQuestions = [];

    //Hide quiz and outro
    quiz.style.display = "none";
    outro.style.display = "none";
    backButton.style.display = "none";

    //Add events
    document.querySelector('button#start').addEventListener("click", startQuiz);
    quiz.querySelector("button#next").addEventListener("click", nextQuestion);
    quiz.querySelector("button#back").addEventListener("click", previousQuestion);
    document.querySelector('button#restart').addEventListener("click", restart);

    //Create questions
    questionsList = [
        new question("Who are the arch enemies of the Doctor?", 
                    ["The Daleks", "The Cybermen", "Apples", "The Face of Boe"], 0),
        new question("What is the first food the Eleventh Doctor eats and likes?", 
                    ["Pears", "Beacon", "Fish fingers and custard", "Yoghurt"], 2),
        new question("Which alien species look like potatoes?", 
                    ["The Oods", "The Silence", "The Raxacoricofallapatorians", "The Sontarans"], 3),
        new question("What is the main alias of the Vashta Nerada?", 
                    ["Evil darkness", "The piranhas of the air", "The black bugs", "Shaded death"], 1),
        new question("In which time period did The Doctor first meet Captain Jack?", 
                    ["World War I", "World War II", "World War III", "The Cold War"], 1),
        new question("What was the previous regeneration of Missy called?", 
                    ["The Doctor", "Mister", "The Magician", "The Master"], 3),
        new question("What does TARDIS stand for?", 
                    ["Time and Radical Directories in Salt", "Transport and Rad Display in Space", "Time and Relative Dimensions in Space", "Ten Apples, Red Dinosaurs, Idle Snakes"], 2),
        new question("Who has the biggest sonic screwdriver?", 
                    ["The Ninth Doctor", "The Tenth Doctor", "The Eleventh Doctor", "The Twelfth Doctor"], 2),
        new question("Which alien species were possessed by 'The Devil'?", 
                    ["The Ood", "The Adipose", "The Atraxi", "The Humans"], 0),
        new question("What was the name of the Doctor's metal dog?", 
                    ["M5", "K9", "X1", "T8"], 1)
    ];
    //Randomize questions
    questionsList = shuffle(questionsList);

    currentQuestion = 0;
    answersList = [];

    setupQuestion(questionsList[currentQuestion]);
}

function startQuiz(){
    //Hide start menu
    document.querySelector(".intro").remove();

    //Show quiz
    quiz.style.display = "";

    //Start first question
    setupQuestion(questionsList[currentQuestion]);
}

function setupQuestion(question){
    //Reset options
    quizOption.querySelector("svg path").setAttribute("d", svgUnchecked);
    quizOptions.forEach(element => {
        if(quizOptions.indexOf(element) !== 0){ //Keep one as a prefab
            element.remove();
        }
    });
    quizOptions = [];
    options = [];
    
    //Display question
    quiz.querySelector("#question").innerHTML = question.question;
    
    //Create options
    for (let i = 0; i < question.options.length; i++) {
        const element = question.options[i];
        let target;
        if(i == 0){
            //<odify existing option (the template)
            target = quizOption;
        }else{
            //Create a copy of first option
            target = quizOption.cloneNode(true);
            quiz.querySelector("ul").appendChild(target);
        }
        quizOptions.push(target);
        target.querySelector("#optionText").innerHTML = element;
        options.push(target);

        target.addEventListener("click", optionClick);
    }

    //Restore selected answer?
    if(answersList[currentQuestion] !== undefined){
        tickOption(quizOptions[answersList[currentQuestion]]);
    }

    //Buttons
    //Back button?
    if(currentQuestion > 0){
        backButton.style.display = "";
        nextButton.setAttribute("class", "accent")
    }else{
        backButton.style.display = "none";
        nextButton.setAttribute("class", "")
    }

    //Change next button to finish?
    if(currentQuestion == questionsList.length-1){
        nextButton.innerHTML = "Finish";
    }else{
        nextButton.innerHTML = "Next";
    }
}

function nextQuestion(){
    //Is anything selected?
    if(answersList[currentQuestion] == undefined){
        return;
    }
    
    //Next question
    currentQuestion += 1;

    //Are there questions left?
    if(currentQuestion < questionsList.length){
        setupQuestion(questionsList[currentQuestion]);
    }else{
        endQuiz();
    }
}

function previousQuestion(){
    currentQuestion -= 1;
    setupQuestion(questionsList[currentQuestion]);
    checkedQuestions[currentQuestion] = undefined;
}

function endQuiz(){
    //Hide quiz, show outro
    quiz.style.display = "none";
    outro.style.display = "";

    //Check answers
    var score = 0;
    for (let i = 0; i < questionsList.length; i++) {
        if (questionsList[i].answerindex == answersList[i]){
            score++;
        }
    }

    //Points text
    let text = outro.querySelector("p").innerHTML;
    text = text.replace("_", score.toString());
    if(score == 1){
        text = text.replace("points", "point");
    }
    outro.querySelector("p").innerHTML = text;

    //Extra text
    let extraText;
    if(score <= 2){
        extraText = "Too bad...";
    }else if(score <= 5){
        extraText = "Good job!";
    }else if(score <= 9){
        extraText = "Awesome!";
    }else{
        extraText = "Outstanding!"
    }
    outro.querySelector("p#extra").innerHTML = extraText;
}

function restart(){
    //Reload page
    location.reload();
}

function optionClick(args){
    let element = args.target;
    //Make sure we got an option element
    if(element.getAttribute("id") !== "option"){ 
        element = element.parentElement; //Maybe its the parent
        if(element.getAttribute("id") !== "option"){ return; }
    }
    
    tickOption(element);
}

function tickOption(element){
    //Set checked state
    element.querySelector("svg path").setAttribute("d", svgChecked);
    //Unselect others
    options.forEach(e => {
        if(e !== element){
            e.querySelector("svg path").setAttribute("d", svgUnchecked);
        }
    });

    //Save answer
    answersList[currentQuestion] = quizOptions.indexOf(element);
}

function shuffle(array) {
    for(let i = array.length - 1; i > 0; i--){
        let randomIndex = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[randomIndex];
        array[randomIndex] = temp;
    }
    return array;
}

//Question Data
function question(question, options, answerindex){
    this.question = question;
    this.options = options;
    this.answerindex = answerindex;
}