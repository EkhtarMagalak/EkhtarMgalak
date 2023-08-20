const questions = document.getElementById("questions");
const field = document.querySelector(".field");
const fieldBtn = document.querySelector(".field-btn");
const fieldText = document.getElementById("field-text");
// Fields
const fieldScores = {
    frontend: 0,
    backend: 0,
    fullstack: 0,
    ai: 0,
    cybersecurity: 0,
    gamedev: 0,
    mobile: 0,
    desktop: 0
};

const getSuitableField = () => {
    let highestField = '';
    let highestScore = -Infinity;

    for (const field in fieldScores) {
        if (fieldScores[field] > highestScore) {
            highestScore = fieldScores[field];
            highestField = field;
        }
    }

    console.log(`The most suitable field is: ${highestField}`);
    const translations = {frontend: "الفرونت اند", backend: "الباك اند", fullstack: "الفل ستاك", ai: "الذكاء الاصطناعي", cybersecurity: "الأمن السيبراني", gamedev: "تطوير الألعاب", mobile: "تطبيقات الموبايل", desktop: "تطبيقات سطح المكتب"};
    fieldText.textContent = translations[highestField];
}

const configScores = (op, points) => {
    if (op === "+") {
        fieldScores.frontend += points.frontend;
        fieldScores.backend += points.backend;
        fieldScores.fullstack += points.fullstack;
        fieldScores.ai += points.ai;
        fieldScores.cybersecurity += points.cyber;
        fieldScores.mobile += points.mobile;
        fieldScores.gamedev += points.game;
        fieldScores.desktop += points.desktop;
    } else if (op === "-") {
        fieldScores.frontend -= points.frontend;
        fieldScores.backend -= points.backend;
        fieldScores.fullstack -= points.fullstack;
        fieldScores.ai -= points.ai;
        fieldScores.cybersecurity -= points.cyber;
        fieldScores.mobile -= points.mobile;
        fieldScores.gamedev -= points.game;
        fieldScores.desktop -= points.desktop; 
    }
}
const fetchData = async () => {
    const data = await (await fetch("../info.json")).json();
    console.log(data);

    for (let i = 0; i < data.length; i++) {
        questions.innerHTML += `
        <div class="q q${i+1}">
            <p class="q-title">${data[i].title}</p>
            <div class="ans" data-checked="false">
                <button class="ans-1" id=${i}>${data[i].accept}</button>
                <button class="ans-2" id=${i}>${data[i].reject}</button>
            </div>
        </div>`
    }
    
    const acceptBtns = document.querySelectorAll(".ans button:first-child");
    const rejectBtns = document.querySelectorAll(".ans button:last-child");
    const btnsParents = document.querySelectorAll(".ans");
    
    acceptBtns.forEach(btn => 
        btn.addEventListener("click", () => {
            const btnParent = btn.parentElement;
            const rejectBtn = btn.nextElementSibling;
            const points = data[btn.id].new;

            if (rejectBtn.classList.contains("chosen")) { configScores("+", points); rejectBtn.classList.remove("chosen") };
            btn.classList.add("chosen");

            // Add points to all fields
            if (btnParent.getAttribute("data-checked") != "true") { 
                configScores("+", points)
            };
            btnParent.setAttribute("data-checked", "true");

            // Check if either accept btn or reject btn is choosed
            const allChecked = Array.from(btnsParents).every(parent => parent.getAttribute("data-checked") === "true");

            if (allChecked) { 
                fieldBtn.style.display = "block";
                getSuitableField()
            } else {
                console.log(fieldScores);
            }
        })
    )

    rejectBtns.forEach(btn =>
        btn.addEventListener("click", () => {
            const btnParent = btn.parentElement;
            const acceptBtn = btn.previousElementSibling;

            if (acceptBtn.classList.contains("chosen")) { acceptBtn.classList.remove("chosen") };
            btn.classList.add("chosen")
            const points = data[btn.id].new;
            if (btnParent.getAttribute("data-checked") === "true") {
                configScores("-", points)
            }

            btnParent.setAttribute("data-checked", "true");
            const allChecked = Array.from(btnsParents).every(parent => parent.getAttribute("data-checked") === "true");

            if (allChecked) { 
                fieldBtn.style.display = "block";
                getSuitableField();
            } else {
                console.log(fieldScores);
            }
        })
    );
}

fetchData()
    
document.querySelector(".field-btn").addEventListener("click", () => {
    field.style.display = "flex";
    window.scrollTo(0, 2746);
})
