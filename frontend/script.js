
const content = document.getElementById("content");
const pageTitle = document.getElementById("page-title");
const headerName = document.getElementById("header-name");
const headerAvatar = document.getElementById("header-avatar");

let student = JSON.parse(localStorage.getItem("sa-student")) || {
  name: "Student",
  email: "",
  course: "",
  college: ""
};

let results = JSON.parse(localStorage.getItem("sa-results")) || [];
let activeQuiz = null;
let currentQuestion = 0;
let answers = [];

const assessments = [
  {
    id: "java",
    title: "Java Programming",
    description: "Test your Java fundamentals and object-oriented programming knowledge.",
    icon: "☕",
    color: "orange",
    duration: 15,
    questions: [
      { q: "Which keyword is used to inherit a class in Java?", options: ["implements", "extends", "inherits", "super"], answer: 1 },
      { q: "Which method is the entry point of a Java application?", options: ["start()", "run()", "main()", "init()"], answer: 2 },
      { q: "Which of these is not a primitive data type in Java?", options: ["int", "boolean", "char", "String"], answer: 3 },
      { q: "Which keyword is used to create an object in Java?", options: ["class", "new", "this", "void"], answer: 1 },
      { q: "Which collection does not allow duplicate elements?", options: ["List", "ArrayList", "Set", "LinkedList"], answer: 2 }
    ]
  },
  {
    id: "web",
    title: "Web Development",
    description: "Evaluate your HTML, CSS and JavaScript skills.",
    icon: "🌐",
    color: "blue",
    duration: 15,
    questions: [
      { q: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Text Machine Language", "Hyper Transfer Main Language", "Home Tool Markup Language"], answer: 0 },
      { q: "Which CSS property changes text color?", options: ["font-style", "text-color", "color", "background"], answer: 2 },
      { q: "Which symbol is used for an ID selector in CSS?", options: [".", "#", "*", "&"], answer: 1 },
      { q: "Which keyword declares a block-scoped variable in JavaScript?", options: ["varname", "define", "let", "dim"], answer: 2 },
      { q: "Which HTML element creates a hyperlink?", options: ["<link>", "<a>", "<href>", "<url>"], answer: 1 }
    ]
  },
  {
    id: "python",
    title: "Python Basics",
    description: "Practise Python syntax, variables, data types and functions.",
    icon: "🐍",
    color: "green",
    duration: 10,
    questions: [
      { q: "Which symbol is used for comments in Python?", options: ["//", "/*", "#", "--"], answer: 2 },
      { q: "Which function displays output in Python?", options: ["echo()", "print()", "display()", "write()"], answer: 1 },
      { q: "Which data type stores True or False?", options: ["int", "str", "bool", "list"], answer: 2 },
      { q: "Which brackets create a Python list?", options: ["{}", "()", "[]", "<>"], answer: 2 },
      { q: "Which keyword defines a function in Python?", options: ["function", "def", "func", "create"], answer: 1 }
    ]
  }
];

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function saveData() {
  localStorage.setItem("sa-student", JSON.stringify(student));
  localStorage.setItem("sa-results", JSON.stringify(results));
}

function updateHeader(title) {
  pageTitle.textContent = title;
  headerName.textContent = student.name || "Student";
  headerAvatar.textContent = (student.name || "S").trim().charAt(0).toUpperCase();
}

function navigate(page) {
  document.querySelectorAll(".nav-item").forEach(button => {
    button.classList.toggle("active", button.dataset.page === page);
  });

  const titles = {
    dashboard: "Dashboard",
    assessments: "Assessments",
    results: "My Results",
    profile: "My Profile",
    quiz: "Assessment",
    result: "Assessment Result"
  };

  updateHeader(titles[page] || "Dashboard");

  if (page === "dashboard") renderDashboard();
  if (page === "assessments") renderAssessments();
  if (page === "results") renderResults();
  if (page === "profile") renderProfile();
  if (page === "quiz") renderQuiz();
}

function assessmentCard(item) {
  return `
    <article class="assessment-card">
      <div class="assessment-icon ${item.color}">${item.icon}</div>
      <h3>${escapeHTML(item.title)}</h3>
      <p>${escapeHTML(item.description)}</p>
      <div class="assessment-meta">
        <span>◷ ${item.duration} minutes</span>
        <span>☷ ${item.questions.length} questions</span>
      </div>
      <button class="primary-btn" data-start="${item.id}">
        Start Assessment →
      </button>
    </article>
  `;
}

function renderDashboard() {
  const average = results.length
    ? Math.round(results.reduce((sum, result) => sum + result.score, 0) / results.length)
    : 0;

  content.innerHTML = `
    <div class="welcome-row">
      <div>
        <p class="eyebrow">YOUR LEARNING JOURNEY</p>
        <h2>Welcome back, ${escapeHTML(student.name)}!</h2>
        <p>Test your knowledge, improve your skills and track your progress in one place.</p>
      </div>
      <button class="primary-btn" data-action="assessments">Explore Assessments →</button>
    </div>

    <div class="stats-grid">
      <article class="stat-card">
        <div class="stat-top">
          <span class="stat-label">Available Assessments</span>
          <span class="stat-icon">▤</span>
        </div>
        <div class="stat-value">${assessments.length}</div>
        <p class="stat-note">Assessments ready to take</p>
      </article>

      <article class="stat-card">
        <div class="stat-top">
          <span class="stat-label">Tests Completed</span>
          <span class="stat-icon green">✓</span>
        </div>
        <div class="stat-value">${results.length}</div>
        <p class="stat-note">Completed assessments</p>
      </article>

      <article class="stat-card">
        <div class="stat-top">
          <span class="stat-label">Average Score</span>
          <span class="stat-icon orange">%</span>
        </div>
        <div class="stat-value">${average}%</div>
        <p class="stat-note">Your average performance</p>
      </article>

      <article class="stat-card">
        <div class="stat-top">
          <span class="stat-label">Learning Topics</span>
          <span class="stat-icon blue">✦</span>
        </div>
        <div class="stat-value">${assessments.length}</div>
        <p class="stat-note">Skills available to practise</p>
      </article>
    </div>

    <div class="panel">
      <div class="panel-heading">
        <div>
          <h3>Recommended Assessments</h3>
          <p style="color:var(--muted);font-size:12px;margin-top:5px">
            Choose a subject and test your knowledge.
          </p>
        </div>
        <button class="text-link" data-action="assessments">View all →</button>
      </div>

      <div class="assessment-grid">
        ${assessments.map(assessmentCard).join("")}
      </div>
    </div>

    <div class="panel" style="margin-top:24px">
      <div class="panel-heading">
        <h3>Recent Activity</h3>
        <button class="text-link" data-action="results">View results →</button>
      </div>

      ${
        results.length
          ? `<div class="activity-list">
              ${results.slice().reverse().slice(0, 4).map(result => `
                <div class="activity-item">
                  <span class="activity-dot"></span>
                  <div>
                    <strong>${escapeHTML(result.title)}</strong>
                    <p>Score: ${result.score}% · ${escapeHTML(result.date)}</p>
                  </div>
                </div>
              `).join("")}
            </div>`
          : `<div class="empty-state">
              <h3>Your learning journey starts here</h3>
              <p>Complete your first assessment to see your activity and results.</p>
              <button class="primary-btn" data-action="assessments">Browse Assessments</button>
            </div>`
      }
    </div>
  `;
}

function renderAssessments() {
  content.innerHTML = `
    <div class="section-heading">
      <h2>Explore Assessments</h2>
      <p>Select an assessment to practise your skills and check your knowledge.</p>
    </div>

    <div class="toolbar">
      <input id="assessment-search" class="search-input"
        type="search" placeholder="Search assessments..."
        aria-label="Search assessments">
      <span class="status">${assessments.length} available</span>
    </div>

    <div id="assessment-list" class="assessment-grid">
      ${assessments.map(assessmentCard).join("")}
    </div>
  `;
}

function renderResults() {
  const average = results.length
    ? Math.round(results.reduce((sum, result) => sum + result.score, 0) / results.length)
    : 0;

  const ordered = results.slice().reverse();

  content.innerHTML = `
    <div class="section-heading">
      <h2>My Results</h2>
      <p>Review your scores and monitor your learning progress.</p>
    </div>

    <div class="stats-grid">
      <article class="stat-card">
        <span class="stat-label">Tests Completed</span>
        <div class="stat-value">${results.length}</div>
        <p class="stat-note">Assessments attempted</p>
      </article>
      <article class="stat-card">
        <span class="stat-label">Average Score</span>
        <div class="stat-value">${average}%</div>
        <p class="stat-note">Across completed tests</p>
      </article>
    </div>

    <div class="panel">
      <div class="panel-heading">
        <h3>Assessment History</h3>
        <span class="status">${results.length} completed</span>
      </div>

      ${
        ordered.length
          ? `<div class="table-wrap">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>ASSESSMENT</th>
                    <th>DATE</th>
                    <th>SCORE</th>
                    <th>RESULT</th>
                  </tr>
                </thead>
                <tbody>
                  ${ordered.map(result => `
                    <tr>
                      <td><strong>${escapeHTML(result.title)}</strong></td>
                      <td>${escapeHTML(result.date)}</td>
                      <td><strong>${result.score}%</strong></td>
                      <td>
                        <span class="status ${result.score < 50 ? "pending" : ""}">
                          ${result.score >= 50 ? "Completed" : "Keep Practising"}
                        </span>
                      </td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>`
          : `<div class="empty-state">
              <h3>No results yet</h3>
              <p>Your scores will appear here after you complete an assessment.</p>
              <button class="primary-btn" data-action="assessments">Take an Assessment</button>
            </div>`
      }
    </div>
  `;
}

function renderProfile() {
  content.innerHTML = `
    <div class="section-heading">
      <h2>My Profile</h2>
      <p>Update your student information and account details.</p>
    </div>

    <div class="profile-layout">
      <div class="profile-card">
        <div class="profile-avatar">
          ${escapeHTML((student.name || "S").trim().charAt(0).toUpperCase())}
        </div>
        <h3>${escapeHTML(student.name || "Student")}</h3>
        <p>Student Account</p>
        <div style="margin-top:18px">
          <span class="status">SkillAssess Member</span>
        </div>
      </div>

      <form class="form-panel" id="profile-form">
        <h3>Personal Information</h3>

        <div class="form-grid">
          <div class="form-group">
            <label for="student-name">Full Name</label>
            <input class="form-input" id="student-name" name="name"
              value="${escapeHTML(student.name)}" required>
          </div>

          <div class="form-group">
            <label for="student-email">Email Address</label>
            <input class="form-input" id="student-email" name="email"
              type="email" value="${escapeHTML(student.email)}"
              placeholder="student@example.com">
          </div>

          <div class="form-group">
            <label for="student-course">Course / Department</label>
            <input class="form-input" id="student-course" name="course"
              value="${escapeHTML(student.course)}" placeholder="e.g. B.Tech AIDS">
          </div>

          <div class="form-group">
            <label for="student-college">College Name</label>
            <input class="form-input" id="student-college" name="college"
              value="${escapeHTML(student.college)}" placeholder="Enter college name">
          </div>
        </div>

        <div class="form-actions">
          <button type="reset" class="secondary-btn">Reset</button>
          <button type="submit" class="primary-btn">Save Changes</button>
        </div>
      </form>
    </div>
  `;
}

function startAssessment(id) {
  activeQuiz = assessments.find(item => item.id === id);
  if (!activeQuiz) return;

  currentQuestion = 0;
  answers = new Array(activeQuiz.questions.length).fill(null);
  navigate("quiz");
}

function renderQuiz() {
  if (!activeQuiz) {
    navigate("assessments");
    return;
  }

  const question = activeQuiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / activeQuiz.questions.length) * 100;

  content.innerHTML = `
    <div class="quiz-container">
      <div class="quiz-top">
        <div>
          <p class="eyebrow">ASSESSMENT IN PROGRESS</p>
          <h2 style="margin-top:5px;font-size:19px">${escapeHTML(activeQuiz.title)}</h2>
        </div>
        <button class="secondary-btn" data-action="exit">Exit Test</button>
      </div>

      <div class="quiz-progress">
        <div class="quiz-progress-bar" style="width:${progress}%"></div>
      </div>

      <div class="quiz-panel">
        <p class="question-number">
          QUESTION ${currentQuestion + 1} OF ${activeQuiz.questions.length}
        </p>

        <h2 class="question-title">${escapeHTML(question.q)}</h2>

        <div class="answer-list">
          ${question.options.map((option, index) => `
            <label class="answer-option ${answers[currentQuestion] === index ? "selected" : ""}">
              <input type="radio" name="answer" value="${index}"
                ${answers[currentQuestion] === index ? "checked" : ""}>
              <span>${escapeHTML(option)}</span>
            </label>
          `).join("")}
        </div>

        <div class="quiz-actions">
          <button class="secondary-btn" data-action="previous"
            ${currentQuestion === 0 ? "disabled" : ""}>← Previous</button>

          <span style="color:var(--muted);font-size:12px">
            ${answers.filter(answer => answer !== null).length} of ${answers.length} answered
          </span>

          ${
            currentQuestion === activeQuiz.questions.length - 1
              ? `<button class="primary-btn" data-action="submit">Submit Assessment ✓</button>`
              : `<button class="primary-btn" data-action="next">Next Question →</button>`
          }
        </div>
      </div>
    </div>
  `;
}

function submitQuiz() {
  if (answers.some(answer => answer === null)) {
    alert("Please answer every question before submitting.");
    return;
  }

  const correct = activeQuiz.questions.reduce((total, question, index) => {
    return total + (answers[index] === question.answer ? 1 : 0);
  }, 0);

  const score = Math.round(correct / activeQuiz.questions.length * 100);
  const title = activeQuiz.title;

  results.push({
    title,
    score,
    correct,
    total: activeQuiz.questions.length,
    date: new Date().toLocaleDateString()
  });

  saveData();
  activeQuiz = null;
  renderResultSummary(title, score, correct);
}

function renderResultSummary(title, score, correct) {
  updateHeader("Assessment Result");

  content.innerHTML = `
    <div class="result-summary">
      <div class="assessment-icon" style="margin:0 auto">✓</div>
      <h2 style="margin-top:18px;font-family:Manrope,sans-serif">
        Assessment Completed!
      </h2>
      <p style="margin-top:8px;color:var(--muted)">
        You completed ${escapeHTML(title)}.
      </p>

      <div class="result-score">${score}%</div>

      <h3>${correct} out of ${correct + answers.filter(a => a !== null).length - correct} correct</h3>

      <p style="margin-top:8px;color:var(--muted)">
        ${
          score >= 80
            ? "Excellent work! You demonstrated strong understanding."
            : score >= 50
              ? "Good effort! Keep practising to improve your score."
              : "Keep learning and try again to improve your understanding."
        }
      </p>

      <div style="display:flex;justify-content:center;flex-wrap:wrap;gap:12px;margin-top:26px">
        <button class="primary-btn" data-action="results">View My Results</button>
        <button class="secondary-btn" data-action="assessments">Other Assessments</button>
      </div>
    </div>
  `;
}

document.addEventListener("click", event => {
  const nav = event.target.closest("[data-page]");

  if (nav) {
    event.preventDefault();
    navigate(nav.dataset.page);
    return;
  }

  const start = event.target.closest("[data-start]");

  if (start) {
    startAssessment(start.dataset.start);
    return;
  }

  const button = event.target.closest("[data-action]");
  if (!button) return;

  const action = button.dataset.action;

  if (action === "assessments") navigate("assessments");
  if (action === "results") navigate("results");

  if (action === "previous" && activeQuiz && currentQuestion > 0) {
    currentQuestion--;
    renderQuiz();
  }

  if (action === "next" && activeQuiz && currentQuestion < activeQuiz.questions.length - 1) {
    currentQuestion++;
    renderQuiz();
  }

  if (action === "submit") submitQuiz();

  if (action === "exit") {
    if (confirm("Exit this assessment? Your answers will not be saved.")) {
      activeQuiz = null;
      navigate("assessments");
    }
  }
});

document.addEventListener("change", event => {
  if (event.target.matches('input[name="answer"]') && activeQuiz) {
    answers[currentQuestion] = Number(event.target.value);
    renderQuiz();
  }
});

document.addEventListener("input", event => {
  if (event.target.id !== "assessment-search") return;

  const query = event.target.value.toLowerCase().trim();
  const filtered = assessments.filter(item =>
    item.title.toLowerCase().includes(query) ||
    item.description.toLowerCase().includes(query)
  );

  document.getElementById("assessment-list").innerHTML = filtered.length
    ? filtered.map(assessmentCard).join("")
    : `<div class="empty-state"><h3>No assessments found</h3><p>Try another search.</p></div>`;
});

document.addEventListener("submit", event => {
  if (event.target.id !== "profile-form") return;

  event.preventDefault();
  const form = new FormData(event.target);

  student = {
    name: String(form.get("name") || "Student").trim() || "Student",
    email: String(form.get("email") || "").trim(),
    course: String(form.get("course") || "").trim(),
    college: String(form.get("college") || "").trim()
  };

  saveData();
  updateHeader("My Profile");
  renderProfile();
  alert("Profile saved successfully.");
});

navigate("dashboard");
