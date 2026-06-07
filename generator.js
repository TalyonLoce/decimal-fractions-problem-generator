const topicsState = {
  add: { operand1: 0, operand2: 0, result: 0 },
  sub: { operand1: 0, operand2: 0, result: 0 },
  mul: { operand1: 0, operand2: 0, result: 0 },
  div: { operand1: 0, operand2: 0, result: 0 }
};

function randomDecimal(min, max, decimalPlaces = 2) {
  const range = max - min;
  let rand = min + Math.random() * range;
  const factor = Math.pow(10, decimalPlaces);
  rand = Math.round(rand * factor) / factor;
  return parseFloat(rand.toFixed(decimalPlaces));
}

function ensureNonNegative(num1, num2) {
  if (num1 >= num2) return [num1, num2];
  return [num2, num1];
}

function generateAddition() {
  let a = randomDecimal(0.1, 9.99, 2);
  let b = randomDecimal(0.1, 9.99, 2);
  let res = parseFloat((a + b).toFixed(5));
  topicsState.add = { operand1: a, operand2: b, result: res };
  updateExpressionDisplay('add', `${a} + ${b}`);
  return res;
}

function generateSubtraction() {
  let a = randomDecimal(0.1, 9.99, 2);
  let b = randomDecimal(0.1, 9.99, 2);
  let [first, second] = ensureNonNegative(a, b);
  let res = parseFloat((first - second).toFixed(5));
  topicsState.sub = { operand1: first, operand2: second, result: res };
  updateExpressionDisplay('sub', `${first} - ${second}`);
  return res;
}

function generateMultiplication() {
  let a = randomDecimal(0.1, 5.0, 2);
  let b = randomDecimal(0.1, 5.0, 2);
  let res = parseFloat((a * b).toFixed(5));
  topicsState.mul = { operand1: a, operand2: b, result: res };
  updateExpressionDisplay('mul', `${a} × ${b}`);
  return res;
}

function generateDivision() {
  let quotient = randomDecimal(0.5, 9.99, 1);
  let divisor = randomDecimal(0.2, 5.0, 1);
  let dividend = parseFloat((divisor * quotient).toFixed(2));
  topicsState.div = { operand1: dividend, operand2: divisor, result: quotient };
  updateExpressionDisplay('div', `${dividend} ÷ ${divisor}`);
  return quotient;
}

function updateExpressionDisplay(topicId, expressionStr) {
  const exprSpan = document.getElementById(`${topicId}Expression`);
  if (exprSpan) exprSpan.textContent = expressionStr + " = ?";
}

function regenerateTopic(topicId) {
  let newResult;
  switch (topicId) {
    case 'add': newResult = generateAddition(); break;
    case 'sub': newResult = generateSubtraction(); break;
    case 'mul': newResult = generateMultiplication(); break;
    case 'div': newResult = generateDivision(); break;
    default: return;
  }
  const inputField = document.getElementById(`${topicId}Input`);
  if (inputField) inputField.value = '';
  const feedbackDiv = document.getElementById(`${topicId}Feedback`);
  if (feedbackDiv) {
    feedbackDiv.className = 'feedback feedback--info';
    feedbackDiv.textContent = 'Новый пример сгенерирован! Введите ответ.';
  }
}

function checkAnswer(topicId) {
  const state = topicsState[topicId];
  if (!state) return;
  const correct = state.result;
  const inputEl = document.getElementById(`${topicId}Input`);
  const feedbackEl = document.getElementById(`${topicId}Feedback`);
  let rawValue = inputEl.value.trim();
  if (rawValue === '') {
    feedbackEl.className = 'feedback feedback--error';
    feedbackEl.textContent = 'Введите число!';
    return;
  }
  let normalized = rawValue.replace(',', '.');
  let userNumber = parseFloat(normalized);
  if (isNaN(userNumber)) {
    feedbackEl.className = 'feedback feedback--error';
    feedbackEl.textContent = 'Некорректное число. Используйте цифры и точку/запятую.';
    return;
  }
  const epsilon = 0.005;
  let isCorrect = Math.abs(userNumber - correct) < epsilon;
  if (isCorrect) {
    feedbackEl.className = 'feedback feedback--success';
    feedbackEl.textContent = `Верно! ${state.operand1} ${getOperator(topicId)} ${state.operand2} = ${correct.toFixed(2)}. Отлично!`;
  } else {
    feedbackEl.className = 'feedback feedback--error';
    feedbackEl.textContent = `Неверно. Попробуйте ещё раз или нажмите «Новый пример».`;
  }
}

function getOperator(topicId) {
  switch(topicId) {
    case 'add': return '+';
    case 'sub': return '−';
    case 'mul': return '×';
    case 'div': return '÷';
    default: return '?';
  }
}

let currentActiveTopic = 'add';

function switchTopic(topicId) {
  document.querySelectorAll('.topic').forEach(section => {
    section.classList.remove('topic--active');
  });
  const activeSection = document.getElementById(`topic-${topicId}`);
  if (activeSection) activeSection.classList.add('topic--active');
  
  document.querySelectorAll('.nav__button').forEach(btn => {
    btn.classList.remove('nav__button--active');
    if (btn.getAttribute('data-nav') === topicId) {
      btn.classList.add('nav__button--active');
    }
  });
  currentActiveTopic = topicId;
  regenerateTopic(topicId);
}

function init() {
  generateAddition();
  generateSubtraction();
  generateMultiplication();
  generateDivision();
  updateExpressionDisplay('add', `${topicsState.add.operand1} + ${topicsState.add.operand2}`);
  updateExpressionDisplay('sub', `${topicsState.sub.operand1} - ${topicsState.sub.operand2}`);
  updateExpressionDisplay('mul', `${topicsState.mul.operand1} × ${topicsState.mul.operand2}`);
  updateExpressionDisplay('div', `${topicsState.div.operand1} ÷ ${topicsState.div.operand2}`);
  
  document.querySelectorAll('.nav__button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const topic = btn.getAttribute('data-nav');
      if (topic) switchTopic(topic);
    });
  });
  
  document.querySelectorAll('[data-check]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const topic = btn.getAttribute('data-check');
      if (topic) checkAnswer(topic);
    });
  });
  
  document.querySelectorAll('[data-new]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const topic = btn.getAttribute('data-new');
      if (topic) {
        regenerateTopic(topic);
        const inp = document.getElementById(`${topic}Input`);
        if (inp) inp.value = '';
        const feedbackDiv = document.getElementById(`${topic}Feedback`);
        if (feedbackDiv) {
          feedbackDiv.className = 'feedback feedback--info';
          feedbackDiv.textContent = 'Новый пример готов! Введите ответ.';
        }
      }
    });
  });
  
  const topicsList = ['add', 'sub', 'mul', 'div'];
  topicsList.forEach(topic => {
    const inputField = document.getElementById(`${topic}Input`);
    if (inputField) {
      inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          checkAnswer(topic);
        }
      });
    }
  });
  
  topicsList.forEach(t => {
    const fb = document.getElementById(`${t}Feedback`);
    if (fb && t !== 'add') fb.className = 'feedback feedback--info';
  });
  document.getElementById('addFeedback').className = 'feedback feedback--info';
  document.getElementById('addFeedback').textContent = 'Напишите ответ и нажмите «Проверить»';
}

document.addEventListener('DOMContentLoaded', init);