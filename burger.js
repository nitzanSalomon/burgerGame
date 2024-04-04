const FORCE = 0;
const DONT_FORCE = 1;
const DATA = { 
    // tillburger
    "tillburger": {
        "icon": "./assets/images/homePage/tillburger.svg",
        "amountOfQuestions": 3, // how many questions will actualy appear
        "completed": false,
        "appContent": [
            {
                instructions: "סדרו את החודשים לפי סדר כרונולוגי",
                rangeTop: "ראשון",
                rangeBottom: "אחרון",
                options: ["ינואר", "פברואר", "מרץ", "אפריל","מאי"]
            },
            {
                instructions: "סדרו לפי סדר הפעולות",
                rangeTop: "ראשונה",
                rangeBottom: "אחרונה",
                options: ["פעולה ראשונה", "פעולה שנייה", "פעולה שלישית", "פעולה רביעית",]
            },
            {
                instructions: "סדרו לפי גודל החייה",
                rangeTop: "הכי גדולה",
                rangeBottom: "הכי קטנה",
                options: ["פיל", "אריה", "כלב", "ארנב", "עכבר", "נמלה"]
            },
        ]
    },
};
// question
let nTillburgerCurrentQuestion = 0;
let nTillburgerCorrectAnswers = 0;
let arrTillburgerQuestions = [];
let arrTillburgerCurrentOptions = [];
let bTillburgerVisited = false;
let nTillburgerMistakes = 0;
let arrQuestionFeedbackBurger = []
// const
const TOPPINGS = ["tomato","patty", "lettuce", "onion"];
const TILLBURGER_FAIL_EXER = 3;
const AMOUNT_OF_TILLBURGER_QUESTION = DATA.tillburger.amountOfQuestions; // how many questions we want out of the array
/* loading function
--------------------------------------------------------------
Description: */
window.addEventListener("load", () => { 
    arrTillburgerQuestions = shuffle(DATA.tillburger.appContent);
    startTillburger();
});

/* startTillburger
--------------------------------------------------------------
Description: */
const startTillburger = () => {
    document.querySelector("#tillburgerStartButton").addEventListener("click",() => {
        document.querySelector("#tillburgerOpeningPage").classList.add("hidden");
        startTillburgerExer();
    })
    
}


/* startTillburgerExer
--------------------------------------------------------------
Description: */
const startTillburgerExer = () => {
    document.querySelector("#feedbackPage").classList.add("hidden");
    document.querySelector(".tillburgerExerPage").classList.remove("hidden");
    document.querySelector("#tillburgerToppingsContainer").innerHTML = "";
    arrTillburgerCurrentOptions = shuffle(arrTillburgerQuestions[nTillburgerCurrentQuestion].options.slice());
    let topingIndex = 0;
    let toppings = shuffle(TOPPINGS)
    arrTillburgerCurrentOptions.forEach(option => {
        if(topingIndex >= TOPPINGS.length){topingIndex = 0}
        let topping = El("div", {classes: ["tillburgerTopping", toppings[topingIndex]]},
            El("div", {cls: "toppingText"}, option)
        );
        document.querySelector("#tillburgerToppingsContainer").append(topping);
        topingIndex++;
    });

    document.querySelectorAll(".tillburgerToppingsContainer .tillburgerTopping").forEach((e, index) => {
        e.style.zIndex = 10 + (document.querySelectorAll(".tillburgerToppingsContainer .tillburgerTopping").length - index);
    });

    document.querySelector(".tillburgerExerPage .topBun").innerHTML = arrTillburgerQuestions[nTillburgerCurrentQuestion].rangeTop;
    document.querySelector(".tillburgerExerPage .bottomBun").innerHTML = arrTillburgerQuestions[nTillburgerCurrentQuestion].rangeBottom;
    document.querySelector("#tillburgerExerInstruction").innerHTML = arrTillburgerQuestions[nTillburgerCurrentQuestion].instructions;

    let lifePre = document.querySelector("#tillburgerLifeContainer");
    if (lifePre) {
        document.querySelector(".tillburgerExerPage").removeChild(lifePre);
    };
    let life = El("div",{id: "tillburgerLifeContainer"},
        "נסיונות:",
        El("img", {cls: "tillburgerLifeFries", id: "pattyLife3", attributes: {src: "./assets/images/tillburger/pattyLife.svg"}}),
        El("img", {cls: "tillburgerLifeFries", id: "pattyLife2", attributes: {src: "./assets/images/tillburger/pattyLife.svg"}}),
        El("img", {cls: "tillburgerLifeFries", id: "pattyLife1", attributes: {src: "./assets/images/tillburger/pattyLife.svg"}}),
    );
    document.querySelector(".tillburgerExerPage").prepend(life);

    if(nTillburgerCurrentQuestion === 0) {
        new Sortable(tillburgerToppingsContainer, {
            animation: 150,
            onEnd: function (/**Event*/evt) {
                document.querySelectorAll(".tillburgerToppingsContainer .tillburgerTopping").forEach((e, index) => {
                    e.style.zIndex = 10 + (document.querySelectorAll(".tillburgerToppingsContainer .tillburgerTopping").length - index);
                })
            },
        });
    }
    

    document.querySelector(".tillburgerSubmitButton").addEventListener("click", onClickTillburgerSubmit);
}

/* onClickTillburgerSubmit
--------------------------------------------------------------
Description: */
const onClickTillburgerSubmit = () => {
    let bCorrectAnswer = true;
    document.querySelectorAll(".tillburgerToppingsContainer .tillburgerTopping").forEach((e, index) => {
        if (e.children[0].innerHTML === arrTillburgerQuestions[nTillburgerCurrentQuestion].options[index]) {
            e.style.backgroundImage = `url("./assets/images/tillburger/${e.classList[1]}Right.svg")`
        } else {
            bCorrectAnswer = false;
            e.style.backgroundImage = `url("./assets/images/tillburger/${e.classList[1]}Wrong.svg")`
        }
    });
    if(bCorrectAnswer){
        nTillburgerCorrectAnswers++
        tillburgerEndQuestion(true);
    } else {
        nTillburgerMistakes++;
        document.querySelector(`#pattyLife${nTillburgerMistakes}`).classList.add("disabled");
        if(nTillburgerMistakes === TILLBURGER_FAIL_EXER) {
            tillburgerEndQuestion(false);
        }
    }
}

/* tillburgerEndQuestion
--------------------------------------------------------------
Description: */
const tillburgerEndQuestion = (win) => {
    document.querySelector(".tillburgerSubmitButton").removeEventListener("click", onClickTillburgerSubmit);
    setTimeout(() => {
        // show feedback page
        document.querySelector("#feedbackPage").classList.remove("hidden");
        document.querySelector(".tillburgerExerPage").classList.add("hidden");

        // get correct answers and order
        document.querySelectorAll("#tillburgerToppingsContainer .tillburgerTopping").forEach(e => {
            let correctIndex = arrTillburgerQuestions[nTillburgerCurrentQuestion].options.indexOf(e.children[0].innerHTML);
            arrQuestionFeedbackBurger[correctIndex] = e;
        });

        // create feedback burger
        document.querySelector(".tillburgerToppingsFeedback").innerHTML = "";
        arrQuestionFeedbackBurger.forEach((option, index) => {
            option.style.zIndex = 10 + (arrQuestionFeedbackBurger.length - index);
            option.style.backgroundImage = `${option.style.backgroundImage.slice(0, -11)}.svg`
            document.querySelector(".tillburgerToppingsFeedback").append(option);
        });

        //create next button
        let nextBtn = document.querySelector("#tillburgerNextButton");
        document.querySelector("#feedbackPage").removeChild(nextBtn);
        nTillburgerCurrentQuestion++;
        if(nTillburgerCurrentQuestion === arrTillburgerQuestions.length) {
            nextBtn = El("div", {id: "tillburgerNextButton", cls: "centerX", listeners: {click: endTillburgerExer}}, "לסיום התרגול")
        } else {
            nextBtn = El("div", {id: "tillburgerNextButton", cls: "centerX", listeners: {click: startTillburgerExer}}, "ללקוח הבא")
        }
        document.querySelector("#feedbackPage").append(nextBtn);

        //restart for next question
        nTillburgerMistakes = 0;
        arrQuestionFeedbackBurger = [];
        document.querySelectorAll(`.tillburgerLifeFries`).forEach( patty => {
            patty.classList.remove("disabled");
        })
    }, 1000);

    if(win) {
        document.querySelector(".tillburgerFeedback").innerHTML = "מעולים! זאת ההזמנה הנכונה"
    } else {
        document.querySelector(".tillburgerFeedback").innerHTML = "אוי! זה לא מה שהלקוח הזמין זאת ההזמנה הנכונה:"
    }
}


/* endTullburgerExer
--------------------------------------------------------------
Description: */
const endTillburgerExer = () => {
    // window.close();
    location.reload();
}


/*
shuffle
------------------------------------------------
Description: take orgnaiz array and shffel it
Parameters: array.
------------------------------------------------
Programer: Gal
------------------------------------------------
*/
function shuffle(arr) {
    let tmp = arr.slice();
    for (let i = 0; i < arr.length; i++) {
        let index = Math.floor(Math.random() * tmp.length);
        arr[i] = tmp[index];
        tmp = tmp.slice(0, index).concat(tmp.slice(index + 1));
    }
    return arr;
}

/* El
--------------------------------------------------------------
Description: create html elements */
function El(tagName, options = {}, ...children) {
    let el = Object.assign(document.createElement(tagName), options.fields || {});
    if (options.classes && options.classes.length) el.classList.add(...options.classes);
    else if (options.cls) el.classList.add(options.cls);
    if (options.id) el.id = options.id;
    el.append(...children.filter(el => el));
    for (let listenerName of Object.keys(options.listeners || {}))
        if (options.listeners[listenerName]) el.addEventListener(listenerName, options.listeners[listenerName], false);
    for (let attributeName of Object.keys(options.attributes || {})) {
        if (options.attributes[attributeName] !== undefined) el.setAttribute(attributeName, options.attributes[attributeName]);
    }
    return el;
}

const scaleFontSize = (element, initialFont) => {
    element.style.fontSize = `${initialFont}em`
    let fontSize = Number(element.style.fontSize.replace("em", ""));
    while (element.scrollHeight > element.clientHeight) {
        element.style.fontSize = `${fontSize - 0.1}em`;
        fontSize = Number(element.style.fontSize.replace("em", ""));
    }
}
