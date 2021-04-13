const getStarted = document.querySelector(".get-started");
const questionNumber = document.querySelector(".question_number");
const submitQuestion = document.querySelector(".question-submit");
const quizQuestion = document.getElementById("quiz_question");
const question_counter = document.getElementById("questionNumber");
const ldsRing = document.querySelector(".lds-ring");
const questionType = document.querySelector(".question_type");
const questionDifficulty = document.querySelector(".question_difficulty");
const questionCategory = document.querySelector(".question_category");
const innerContainer = document.querySelector(".inner-container");
const questionCard = document.querySelector(".question-card");
const multipleItem = document.querySelector(".multiple-item");
const tryAgain = document.querySelector(".quiz-again");


// UI
const section_options = document.querySelector(".general-options");
const section_question = document.querySelector(".question");
const section_result = document.querySelector(".result");

// Errors
const errorInput = document.querySelector(".error-text-input");
const errorQuestion = document.getElementById("errorMessage");


const multipleDiv = document.querySelector(".question-choice-multiple");
const booleanDiv = document.querySelector(".question-choice-boolean");

let allQuestions = {}; // question object to check answers
let questions = []; // storing data result
let answers = []; // given answers
let currentQuestion = 1;

let givenAnswers = [];

const base_url = "https://opentdb.com/api.php";


// eventListeners

questionNumber.addEventListener("keyup",control);


getStarted.addEventListener("click",e=>{
    getQuestions();
    e.preventDefault();
});


submitQuestion.addEventListener("click",e=>{

    e.preventDefault();

    let temp = isEmpty();
    if(temp){

        errorQuestion.textContent = "";
        
        if(currentQuestion<questions.length){
            getAnswers();
            currentQuestion++;
            if(questions[currentQuestion-2].type == 'multiple') makeUncheckhed('multiple');
            else makeUncheckhed('boolean');
            loadQuiz();
        }else{
            getAnswers();
            showTheResult();
            loadResults();
    
        }

    }
    else{
        errorQuestion.textContent = "You must choose one choice.";
    }
});

tryAgain.addEventListener('click',_ => {
    location.reload();
    return false;
});

// functions


async function getQuestions(){

    
    if(!(questionNumber.value > 50 || questionNumber.value < 1))
    {

        ldsRing.classList.remove("d-none");
        let amount = "amount="+questionNumber.value;
        let fullURL = base_url+"?"+amount;

        if(questionCategory.value != "any"){
            fullURL+="&category="+questionCategory.value;
        }
        if(questionDifficulty.value != "any"){
            fullURL+="&difficulty="+questionDifficulty.value;
        }

        if(questionType.value != "any"){

            fullURL+="&type="+questionType.value;

        }
        fullURL += "&encode=url3986";
        const response = await fetch(fullURL);
        const data = await response.json();
        if(checkCode(data)){
            questions = data.results;
            changeUI();
            loadQuiz();
        }else{
            alert("There is no enough questions for the category...");
        }

    }

    return null;
    
}


function control(){


    if(questionNumber.value > 50 || questionNumber.value < 1){
        questionNumber.style.borderColor = "#cc0000";
        errorInput.classList.add("d-block");
        errorInput.classList.remove("d-none");
    }

    else{
        questionNumber.style.borderColor = "black";
        errorInput.classList.add("d-none");
        errorInput.classList.remove("d-block");
    }

}

function loadQuiz(){


    // All answers to answers array
    answers = [];

    answers.push(questions[currentQuestion-1].correct_answer);
    questions[currentQuestion-1].incorrect_answers.forEach(element => {
        answers.push(element);
    });

    // Shuffle an array
    answers.sort(()=> Math.random()-0.5);
    // Add the question to object for results.
    allQuestions[currentQuestion-1] = answers;
    
    

    if(currentQuestion == questionNumber.value)
    {
        submitQuestion.innerHTML = "Submit & See result";
        const currentQuestionData = questions[currentQuestion-1];
        question_counter.textContent = "Question "+currentQuestion;
        quizQuestion.textContent = unescape(currentQuestionData.question);
        

        if(questions[currentQuestion-1].type == "multiple"){
            booleanDiv.classList.add('d-none');
            booleanDiv.classList.remove('d-block');
            multipleDiv.classList.add('d-block');
            multipleDiv.classList.remove('d-none');
            let spans = document.querySelectorAll(".answer_text_multiple");
            for (let index = 0; index < answers.length; index++) spans[index].textContent = unescape(answers[index]);
            
        }else{

            booleanDiv.classList.add('d-block');
            booleanDiv.classList.remove('d-none');
            multipleDiv.classList.add('d-none');
            multipleDiv.classList.remove('d-block');
        
        }

        
    }else{
        const currentQuestionData = questions[currentQuestion-1];
        question_counter.textContent = "Question "+currentQuestion;
        quizQuestion.textContent = unescape(currentQuestionData.question);

        if(questions[currentQuestion-1].type == "multiple"){

            booleanDiv.classList.add('d-none');
            booleanDiv.classList.remove('d-block');
            multipleDiv.classList.add('d-block');
            multipleDiv.classList.remove('d-none');
            let spans = document.querySelectorAll(".answer_text_multiple");
            for (let index = 0; index < answers.length; index++) spans[index].textContent = unescape(answers[index]);

        }else{

            booleanDiv.classList.add('d-block');
            booleanDiv.classList.remove('d-none');
            multipleDiv.classList.add('d-none');
            multipleDiv.classList.remove('d-block');
        }   
    }

}

function changeUI(){

    section_options.classList.add('transform-close');

    setTimeout(()=>{

        section_options.classList.add('d-none');
        section_question.classList.remove('d-none');
        setTimeout(()=>{
            section_question.classList.add('transform-open');
        },500);

    },1000);

}

function checkCode(data){


    if(data.response_code == 0) return true;
    else return false;

}

function loadResults(){

    section_question.classList.remove('transform-open');

    setTimeout(_=>{

        section_question.classList.add('d-none');
        section_result.classList.remove('d-none');
        setTimeout(_=>{
            section_result.classList.add('transform-open');
        },500);

    },1000);

}

function showTheResult(){

    let len = currentQuestion;
    let numberOfCorrect = 0;
    let numberOfIncorrect = 0;

    for (let index = 0; index < questions.length; index++) {
        if(unescape(questions[index].correct_answer) == givenAnswers[index]) numberOfCorrect++;
        else numberOfIncorrect++;
        
    }

    // UI variables for result
    const numberOfQuestions = document.getElementById("numberOfQuestions");
    numberOfQuestions.textContent = `# of questions : ${questions.length}`;
    const correctAnswers = document.getElementById("correctAnswers");
    correctAnswers.textContent = `Correct Answer(s) : ${numberOfCorrect}`;
    const incorrectAnswers = document.getElementById("incorrectAnswers");
    incorrectAnswers.textContent = `Incorrect Answer(s) : ${numberOfIncorrect}`;

    for (let index = 0; index < len; index++) {
        
        
        innerContainer.appendChild(questionCard);
        
        let h3 = document.createElement('h3');
        h3.classList.add('mb1');
        h3.textContent = `Question ${index+1}`;
        questionCard.appendChild(h3);

        let p = document.createElement('p');
        
        if(allQuestions[index].length == 4){

            for (let index_inner = 0; index_inner < 4; index_inner++) {
                
                let copy = p.cloneNode();
                
                if(unescape(questions[index].correct_answer) == unescape(allQuestions[index][index_inner])){
                    copy.classList.add('result-true-bg');
                    copy.textContent = unescape(allQuestions[index][index_inner]);
                    questionCard.appendChild(copy);
                }
                else{
                    copy.textContent = unescape(allQuestions[index][index_inner]);

                    
                    if(unescape(allQuestions[index][index_inner]) == givenAnswers[index]){
                        
                        copy.classList.add("result-false-bg");

                    }
                    
                    questionCard.appendChild(copy);
                
                }
                
                
            }
            
        }else{


            for (let index_inner = 0; index_inner < 2; index_inner++) {

                let copy = p.cloneNode();
                if(questions[index].correct_answer == allQuestions[index][index_inner]){
                    copy.classList.add('result-true-bg');
                    copy.textContent = unescape(allQuestions[index][index_inner]);
                    questionCard.appendChild(copy);
                }
                else{
                    copy.textContent = allQuestions[index][index_inner];
                    
                    if(allQuestions[index][index_inner] == givenAnswers[index]){
                        copy.classList.add("result-false-bg");

                    }
                    
                    questionCard.appendChild(copy);
                
                }
                
            }
        }
    }
}

function makeUncheckhed(type){

    let allInputs =[];

    if(type == 'multiple'){
        
        allInputs = document.querySelectorAll(".answer_multiple");
        
        allInputs.forEach(element => {
            element.checked = false;
        });
    }
    else{

        allInputs = document.querySelectorAll(".answer_boolean");
        allInputs.forEach(element => {
            element.checked = false;
        });

    }

}

function getAnswers(){

    let allInputs =[];
    let temp;
    if(questions[currentQuestion-1].type == "multiple"){
        
        allInputs = document.querySelectorAll(".answer_multiple");
        
        allInputs.forEach(element => {
            
            if(element.checked){
                temp = element.value;
                givenAnswers.push(document.getElementById(`${temp}_answers`).textContent);
                
            } 
        });
        
    }
    else{
        allInputs = [];
        
        allInputs = document.querySelectorAll(".answer_boolean");
        
        allInputs.forEach(element => {

            if(element.checked){
                temp = element.value;
                
                givenAnswers.push(document.getElementById(`${temp}_answers`).textContent);
            } 

        });
    }

}

function isEmpty(){

    let flag = 0;

    if(questions[currentQuestion-1].type == "multiple"){
        console.log("multiple");
        let questionAns = document.querySelectorAll(".answer_multiple");
        questionAns.forEach(element => {
            if(element.checked){
                console.log("biri seçildi...");
                flag++;
            }
            
        });

        if(flag > 0 ) return true;
        else return false;

    }
    else{
        console.log("boolean");
        let questionAns = document.querySelectorAll(".answer_boolean");
        questionAns.forEach(element => {
            if(element.checked) flag++;
            
        });

        if(flag > 0) return true;
        else return false;
    }

}