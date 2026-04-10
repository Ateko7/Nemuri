(function () {
  const storageKey = "nemuri_timeline_events";
  const feedback = document.getElementById("action-feedback");
  const timelineList = document.getElementById("timeline-list");
  const answerGrid = document.getElementById("answer-grid");
  const questionTitle = document.getElementById("question-title");
  const questionHelper = document.getElementById("question-helper");
  const stepLabel = document.getElementById("step-label");
  const progressBar = document.querySelector(".progress-bar");
  const nextQuestion = document.getElementById("next-question");

  const interviewQuestions = [
    {
      title: "Edad del bebe",
      helper: "Esto ajusta ventanas de sueno y expectativas para su etapa.",
      options: ["0 a 3 meses", "4 a 6 meses", "7 a 12 meses", "1 a 3 anos"]
    },
    {
      title: "Problema principal",
      helper: "Vamos a priorizar una sola necesidad para empezar con foco.",
      options: ["Despertares nocturnos", "Siestas cortas", "Dormirse mejor", "Tener rutina"]
    },
    {
      title: "Como suele dormirse",
      helper: "Esto nos ayuda a adaptar el plan sin pedir cambios bruscos.",
      options: ["En brazos", "Al pecho o biberon", "En cuna con ayuda", "Casi solo"]
    },
    {
      title: "Cuantos despertares hay por noche",
      helper: "No buscamos perfeccion, solo un punto de partida realista.",
      options: ["1 a 2", "3 a 4", "5 a 6", "Mas de 6"]
    }
  ];
  let currentInterviewStep = 0;
  let selectedInterviewAnswer = null;

  function getNowLabel() {
    const now = new Date();
    return now.toLocaleTimeString("es-GT", {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function loadEvents() {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveEvents(events) {
    localStorage.setItem(storageKey, JSON.stringify(events));
  }

  function createTimelineItem(event) {
    const wrapper = document.createElement("div");
    wrapper.className = "timeline-item timeline-item-live";
    wrapper.innerHTML = `
      <div class="timeline-dot"></div>
      <div>
        <strong>${event.label}</strong>
        <p>${event.time}</p>
        <small>Registro rapido desde dashboard</small>
      </div>
    `;
    return wrapper;
  }

  function renderInterview() {
    if (!answerGrid || !questionTitle || !questionHelper || !nextQuestion) {
      return;
    }

    const current = interviewQuestions[currentInterviewStep];
    questionTitle.textContent = current.title;
    questionHelper.textContent = current.helper;

    if (stepLabel) {
      stepLabel.textContent = `Paso ${currentInterviewStep + 1} de ${interviewQuestions.length}`;
    }

    if (progressBar) {
      progressBar.style.width = `${((currentInterviewStep + 1) / interviewQuestions.length) * 100}%`;
    }

    answerGrid.innerHTML = "";
    current.options.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = selectedInterviewAnswer === option ? "answer-card selected" : "answer-card";
      button.textContent = option;
      button.addEventListener("click", () => {
        selectedInterviewAnswer = option;
        renderInterview();
      });
      answerGrid.appendChild(button);
    });

    nextQuestion.textContent = currentInterviewStep === interviewQuestions.length - 1
      ? "Terminar y entrar a la app"
      : "Siguiente";
  }

  document.querySelectorAll(".quick-action").forEach((button) => {
    button.addEventListener("click", () => {
      const event = {
        label: button.dataset.action || button.textContent.trim(),
        time: getNowLabel()
      };

      const events = loadEvents();
      events.unshift(event);
      saveEvents(events.slice(0, 10));

      if (feedback) {
        feedback.textContent = `Ultimo registro: ${event.label} a las ${event.time}`;
      }
    });
  });

  if (timelineList) {
    const saved = loadEvents();
    saved.forEach((event) => {
      timelineList.prepend(createTimelineItem(event));
    });
  }

  if (nextQuestion && answerGrid) {
    renderInterview();
    nextQuestion.addEventListener("click", () => {
      if (!selectedInterviewAnswer) {
        return;
      }

      if (currentInterviewStep === interviewQuestions.length - 1) {
        window.location.href = "/dashboard.html";
        return;
      }

      currentInterviewStep += 1;
      selectedInterviewAnswer = null;
      renderInterview();
    });
  }
})();
