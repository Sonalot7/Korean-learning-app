let xp = 0;
const xpEl = document.getElementById("xp");
const xpFill = document.getElementById("xpFill");

const lessons = {
  alphabet: [
    { q: "What sound does 'ㄱ' make?", options: ["g/k", "n", "m", "s"], answer: "g/k" },
    { q: "What sound does 'ㅂ' make?", options: ["b/p", "j", "r/l", "t"], answer: "b/p" }
  ],
  vocab: [
    { q: "What does '사랑 (sarang)' mean?", options: ["Love", "Food", "Friend", "School"], answer: "Love" },
    { q: "What does '물 (mul)' mean?", options: ["Water", "Fire", "Tree", "House"], answer: "Water" }
  ],
  phrases: [
    { q: "How do you say 'Hello' in Korean?", options: ["안녕하세요", "감사합니다", "잘 지내요", "사랑해요"], answer: "안녕하세요" },
    { q: "What does '감사합니다' mean?", options: ["Sorry", "Thank you", "Goodbye", "Yes"], answer: "Thank you" }
  ]
};

let currentLesson = [];
let lessonIndex = 0;

function startLesson(name) {
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("lesson").classList.remove("hidden");
  document.getElementById("lessonTitle").innerText = "Lesson: " + name;
  currentLesson = lessons[name];
  lessonIndex = 0;
  showQuestion();
}

function showQuestion() {
  const q = currentLesson[lessonIndex];
  document.getElementById("question").innerText = q.q;
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";
  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.className = "quiz-option";
    btn.onclick = () => checkAnswer(opt, q.answer);
    optionsDiv.appendChild(btn);
  });
}

function checkAnswer(selected, correct) {
  const feedback = document.getElementById("feedback");
  if (selected === correct) {
    feedback.innerText = "✅ Correct!";
    xp += 10;
    xpEl.innerText = xp;
    xpFill.style.width = Math.min(xp, 100) + "%";
  } else {
    feedback.innerText = "❌ Oops! Correct answer: " + correct;
  }
  lessonIndex++;
  if (lessonIndex < currentLesson.length) {
    setTimeout(showQuestion, 1200);
  } else {
    setTimeout(() => {
      feedback.innerText = "🎉 Lesson complete!";
    }, 1000);
  }
}

function backToMenu() {
  document.getElementById("lesson").classList.add("hidden");
  document.getElementById("menu").classList.remove("hidden");
  document.getElementById("feedback").innerText = "";
}
