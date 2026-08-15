const form = document.querySelector('#chatForm');
const input = document.querySelector('#questionInput');
const welcome = document.querySelector('#welcome');
const messages = document.querySelector('#messages');
const sourceDialog = document.querySelector('#sourceDialog');
const toast = document.querySelector('#toast');
const materialsPanel = document.querySelector('#materialsPanel');
const savedPanel = document.querySelector('#savedPanel');
const savedList = document.querySelector('#savedList');
const savedAnswers = [];

const icon = (name) => {
  const paths = {
    source: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    save: '<path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
    up: '<path d="M7 10v12M15 5.9 14 10h5.8a2 2 0 0 1 1.9 2.5l-2.3 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.8L10 2h0a3.1 3.1 0 0 1 5 3.9Z"/>',
    down: '<path d="M17 14V2M9 18.1 10 14H4.2a2 2 0 0 1-1.9-2.5l2.3-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.8L14 22h0a3.1 3.1 0 0 1-5-3.9Z"/>'
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name]}</svg>`;
};

const sources = {
  memory: {
    title: 'Lecture 04 — Memory Systems', location: 'Slide 12', heading: 'Working memory',
    text: 'A limited-capacity system for temporarily holding and actively manipulating information needed for complex cognitive tasks.',
    highlight: 'Working memory involves both storage and active processing.'
  },
  assignment: {
    title: 'Assignment 3 — Research Critique', location: 'Page 1 · Submission', heading: 'Due date & submission',
    text: 'Submit one PDF through Canvas by the deadline. Include your critique, references, and completed article-analysis table.',
    highlight: 'Due Friday, October 16 at 11:59 PM ET.'
  },
  rubric: {
    title: 'Research Critique Rubric', location: 'Page 2 · Grading criteria', heading: 'Evaluation criteria',
    text: 'The critique is assessed across four areas: summary, methodological analysis, use of evidence, and clarity of writing.',
    highlight: 'Methodological analysis carries the greatest weight at 40%.'
  },
  exam: {
    title: 'Exam 2 Study Guide', location: 'Page 1 · Scope', heading: 'What to review',
    text: 'Exam 2 covers attention, working memory, long-term memory, and retrieval from Lectures 4–7 and the assigned readings.',
    highlight: 'Focus on comparing models and applying them to short scenarios.'
  },
  syllabus: {
    title: 'PSY 201 Course Syllabus', location: 'Page 5 · Course policies', heading: 'Getting help',
    text: 'Questions involving personal circumstances or exceptions to course policy must be directed to the instructor.',
    highlight: 'Email Dr. Chen or visit office hours for individual policy questions.'
  }
};

function openSource(key) {
  const source = sources[key];
  if (!source) return;
  document.querySelector('#sourceTitle').textContent = source.title;
  document.querySelector('#sourceLocation').textContent = source.location;
  document.querySelector('#sourceHeading').textContent = source.heading;
  document.querySelector('#sourceText').textContent = source.text;
  document.querySelector('#sourceHighlight').textContent = source.highlight;
  sourceDialog.showModal();
}

function citation(label, key) {
  return `<button class="citation" type="button" data-source="${key}">${icon('source')}${label}</button>`;
}

function answerFor(question) {
  const q = question.toLowerCase();
  if (/working memory|short-term|short term/.test(q)) {
    return `<p><strong>Short-term memory</strong> is the temporary storage of a small amount of information, while <strong>working memory</strong> includes both temporary storage and the active manipulation of that information. ${citation('Lecture 04 · slide 12', 'memory')}</p><p>For example, holding a phone number in mind uses short-term storage. Mentally rearranging those digits while following a rule uses working memory. Dr. Chen’s slides describe working memory as a limited-capacity system that supports complex tasks such as reasoning and comprehension. ${citation('Lecture 04 · slides 12–14', 'memory')}</p><h3>A useful distinction</h3><ul><li><strong>Short-term memory:</strong> “holding” information briefly. ${citation('Lecture 04 · slide 11', 'memory')}</li><li><strong>Working memory:</strong> holding <em>and working with</em> information. ${citation('Lecture 04 · slide 12', 'memory')}</li></ul>`;
  }
  if (/assignment 3|due|deadline|submit/.test(q)) {
    return `<p>Assignment 3, the <strong>Research Critique</strong>, is due <strong>Friday, October 16 at 11:59 PM ET</strong>. Submit a single PDF through Canvas. ${citation('Assignment 3 · p. 1', 'assignment')}</p><p>Your PDF should contain the critique, a reference list, and the completed article-analysis table. The instructions set a 1,200–1,500 word range for the critique itself. ${citation('Assignment 3 · pp. 1–2', 'assignment')}</p>`;
  }
  if (/grade|graded|grading|rubric|critique/.test(q)) {
    return `<p>The research critique is graded on four criteria: <strong>methodological analysis (40%)</strong>, summary and accuracy (25%), use of evidence (20%), and clarity and organization (15%). ${citation('Critique rubric · p. 2', 'rubric')}</p><p>The rubric’s “excellent” band expects you to identify meaningful design strengths and limitations, explain their consequences, and support your judgment with specific evidence from the article. ${citation('Critique rubric · pp. 2–3', 'rubric')}</p>`;
  }
  if (/exam|review|study|prepare/.test(q)) {
    return `<p>For Exam 2, review <strong>attention, working memory, long-term memory, and retrieval</strong> from Lectures 4–7 and the corresponding assigned readings. ${citation('Exam 2 study guide · p. 1', 'exam')}</p><p>Prioritize comparing the major models and applying them to short scenarios. The guide says the exam includes 30 multiple-choice questions and two short responses. ${citation('Exam 2 study guide · pp. 1–2', 'exam')}</p>`;
  }
  if (/extension|exception|personal|accommodation|late/.test(q)) {
    return `<div class="escalation"><strong>I can’t safely decide that from the course materials.</strong><br>This question may require an individual exception or involve personal circumstances. Please email Dr. Chen or ask during office hours. The syllabus directs individual policy questions to the instructor. ${citation('Syllabus · p. 5', 'syllabus')}</div>`;
  }
  return `<p>I couldn’t find a reliable answer to that question in the student-visible course materials. I don’t want to guess.</p><div class="escalation"><strong>This needs instructor guidance.</strong><br>Please send this question to Dr. Chen. You can also rephrase it with the name of a lecture, assignment, or course policy so I can search the approved materials more precisely. ${citation('Syllabus · p. 5', 'syllabus')}</div>`;
}

function addUserMessage(text) {
  const node = document.createElement('div');
  node.className = 'message user';
  node.innerHTML = `<div class="bubble"></div>`;
  node.querySelector('.bubble').textContent = text;
  messages.appendChild(node);
}

function addAssistantMessage(html) {
  const node = document.createElement('div');
  node.className = 'message assistant';
  const limited = /needs instructor guidance|can’t safely decide/.test(html);
  node.innerHTML = `<div class="bot-avatar">C</div><div class="assistant-content"><span class="answer-state ${limited ? 'not-found' : ''}">${limited ? 'NOT FOUND' : 'ANSWER'}</span>${html}<div class="next-actions"><button type="button" data-next="source">Open source</button><button type="button" data-next="simplify">Explain differently</button><button type="button" data-next="instructor">Ask instructor</button></div><div class="answer-tools"><button type="button" data-action="copy" aria-label="Copy answer">${icon('copy')}</button><button type="button" data-action="save" aria-label="Save answer">${icon('save')}</button><button type="button" data-action="up" aria-label="Helpful">${icon('up')}</button><button type="button" data-action="down" aria-label="Not helpful">${icon('down')}</button><span>Was this helpful?</span></div></div>`;
  messages.appendChild(node);
  node.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function ask(question) {
  const clean = question.trim();
  if (!clean) return;
  welcome.hidden = true;
  messages.classList.add('active');
  addUserMessage(clean);
  input.value = '';
  input.style.height = 'auto';
  const typing = document.createElement('div');
  typing.className = 'message assistant';
  typing.innerHTML = '<div class="bot-avatar">C</div><div class="typing" aria-label="CourseGuide is thinking"><i></i><i></i><i></i></div>';
  messages.appendChild(typing);
  typing.scrollIntoView({ behavior: 'smooth', block: 'end' });
  window.setTimeout(() => {
    typing.remove();
    addAssistantMessage(answerFor(clean));
  }, 650);
}

form.addEventListener('submit', (event) => { event.preventDefault(); ask(input.value); });
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); form.requestSubmit(); }
});
input.addEventListener('input', () => {
  input.style.height = 'auto';
  input.style.height = `${Math.min(input.scrollHeight, 130)}px`;
});
document.querySelectorAll('[data-question]').forEach(button => button.addEventListener('click', () => ask(button.dataset.question)));

messages.addEventListener('click', async (event) => {
  const citationButton = event.target.closest('[data-source]');
  if (citationButton) {
    openSource(citationButton.dataset.source);
    return;
  }
  const action = event.target.closest('[data-action]');
  const next = event.target.closest('[data-next]');
  if (next) {
    if (next.dataset.next === 'source') event.target.closest('.assistant-content').querySelector('[data-source]')?.click();
    if (next.dataset.next === 'simplify') ask('Please explain that in simpler language with an example.');
    if (next.dataset.next === 'instructor') showToast('Instructor-ready question drafted');
    return;
  }
  if (!action) return;
  if (action.dataset.action === 'copy') {
    const text = action.closest('.assistant-content').innerText.replace('Was this helpful?', '').trim();
    try { await navigator.clipboard.writeText(text); showToast('Answer copied'); } catch { showToast('Select the answer to copy'); }
  } else if (action.dataset.action === 'save') {
    const answer = action.closest('.assistant-content');
    const summary = answer.querySelector('p')?.innerText || 'Saved CourseGuide answer';
    if (!savedAnswers.some(item => item.summary === summary)) {
      const sourceKey = answer.querySelector('[data-source]')?.dataset.source;
      savedAnswers.unshift({ summary, sourceKey, savedAt: 'Saved just now' });
      renderSavedAnswers();
    }
    action.style.color = '#6457d7'; showToast('Answer saved');
  } else if (action.dataset.action === 'down') {
    document.querySelector('#feedbackDialog').showModal();
  } else {
    action.style.color = '#6457d7'; showToast('Thanks for your feedback');
  }
});

function showToast(message) {
  toast.textContent = message; toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 1600);
}

document.querySelector('#closeDialog').addEventListener('click', () => sourceDialog.close());
document.querySelector('#closeDialogSecondary').addEventListener('click', () => sourceDialog.close());
document.querySelector('#newChat').addEventListener('click', () => {
  messages.replaceChildren(); messages.classList.remove('active'); welcome.hidden = false; input.value = ''; input.focus();
});

document.querySelector('#closeFeedback').addEventListener('click', () => document.querySelector('#feedbackDialog').close());
document.querySelector('#feedbackForm').addEventListener('submit', (event) => {
  event.preventDefault(); document.querySelector('#feedbackDialog').close(); showToast('Feedback sent for instructor review'); event.target.reset();
});

const instructorConsole = document.querySelector('#instructorConsole');
const instructorSwitch = document.querySelector('#instructorSwitch');
const composerWrap = document.querySelector('.composer-wrap');
const conversation = document.querySelector('.conversation');
let instructorMode = false;
instructorSwitch.addEventListener('click', () => {
  instructorMode = !instructorMode;
  if (instructorMode) switchStudentView('chat');
  instructorConsole.hidden = !instructorMode;
  conversation.hidden = instructorMode;
  composerWrap.hidden = instructorMode;
  document.querySelector('#viewLabel').textContent = instructorMode ? 'Instructor workspace' : 'Course assistant';
  instructorSwitch.querySelector('strong').textContent = instructorMode ? 'Return to student view' : 'Instructor workspace';
  document.querySelector('#newChat').hidden = instructorMode;
  if (window.innerWidth <= 760) sidebar.classList.remove('open');
});

const testQuestion = document.querySelector('#testQuestion');
document.querySelectorAll('[data-test]').forEach(button => button.addEventListener('click', () => { testQuestion.value = button.dataset.test; runTest(); }));
document.querySelector('#runTest').addEventListener('click', runTest);
function runTest() {
  const q = testQuestion.value.toLowerCase();
  const state = document.querySelector('#testState');
  const answer = document.querySelector('#testAnswer > div:last-child');
  const policyLevel = document.querySelector('#policyLevel');
  const policyText = document.querySelector('#policyText');
  const conflictPanel = document.querySelector('#conflictPanel');
  conflictPanel.hidden = true;
  if (/late|different|conflict|announcement/.test(q)) {
    state.className = 'state conflict'; state.textContent = 'CONFLICT'; policyLevel.textContent = 'SOURCE PRIORITY';
    policyText.innerHTML = '<strong>Conflict rule applied</strong><br>A newer explicit announcement normally outranks the syllabus, but these sources have the same effective date.';
    answer.innerHTML = `<p><strong>I found conflicting course information.</strong> The syllabus allows submissions within 48 hours, while the Week 6 announcement says 24 hours. I can’t determine which applies without instructor confirmation.</p>${citation('Syllabus · p. 5', 'syllabus')} ${citation('Week 6 announcement', 'assignment')}`;
    conflictPanel.hidden = false;
  } else if (/due|when/.test(q)) {
    state.className = 'state answer'; state.textContent = 'ANSWER'; policyLevel.textContent = 'EXPLAIN';
    policyText.innerHTML = '<strong>Course information default</strong><br>Brief direct answers are allowed when supported by a visible official source.';
    answer.innerHTML = `<p>Assignment 3 is due <strong>Friday, October 16 at 11:59 PM ET</strong>. Submit one PDF through Canvas.</p>${citation('Assignment 3 · p. 1', 'assignment')}`;
  } else {
    state.className = 'state restricted'; state.textContent = 'RESTRICTED'; policyLevel.textContent = 'HINT ONLY';
    policyText.innerHTML = '<strong>Assignment 3 override</strong><br>Concept explanation and error localization are allowed. Completed queries are prohibited.';
    answer.innerHTML = `<p>I can help you understand the SQL concepts and identify the next step, but I can’t provide a completed query for this assignment.</p><p>Start by identifying the two tables you need to join and the column they share. Then decide which rows your <code>WHERE</code> clause should keep.</p>${citation('Assignment 3 · p. 2', 'assignment')}`;
  }
  showToast('Student preview updated');
}
document.querySelector('#approveAnswer').addEventListener('click', () => showToast('Official Answer approved'));
instructorConsole.addEventListener('click', event => {
  const source = event.target.closest('[data-source]');
  if (!source) return;
  openSource(source.dataset.source);
});

function switchStudentView(view) {
  const isChat = view === 'chat';
  conversation.hidden = !isChat;
  composerWrap.hidden = !isChat;
  materialsPanel.hidden = view !== 'materials';
  savedPanel.hidden = view !== 'saved';
  document.querySelector('#newChat').hidden = !isChat || instructorMode;
  document.querySelector('#viewLabel').textContent = view === 'materials' ? 'Course materials' : view === 'saved' ? 'Saved answers' : 'Course assistant';
  document.querySelectorAll('[data-view]').forEach(item => {
    const active = item.dataset.view === view;
    item.classList.toggle('active', active);
    if (active) item.setAttribute('aria-current', 'page'); else item.removeAttribute('aria-current');
  });
}

function renderSavedAnswers() {
  document.querySelector('#savedCount').textContent = `${savedAnswers.length} saved`;
  if (!savedAnswers.length) return;
  savedList.innerHTML = savedAnswers.map((item, index) => `<article class="saved-card"><div><p>${item.summary}</p><small>${item.savedAt}${item.sourceKey ? ` · ${sources[item.sourceKey].title}` : ''}</small></div>${item.sourceKey ? `<button type="button" data-saved-source="${item.sourceKey}">Open source</button>` : ''}</article>`).join('');
}

document.querySelectorAll('[data-view]').forEach(item => item.addEventListener('click', event => {
  event.preventDefault();
  if (instructorMode) {
    instructorMode = false;
    instructorConsole.hidden = true;
    instructorSwitch.querySelector('strong').textContent = 'Instructor workspace';
  }
  switchStudentView(item.dataset.view);
  if (window.innerWidth <= 760) sidebar.classList.remove('open');
}));
document.querySelectorAll('[data-open-source]').forEach(item => item.addEventListener('click', () => openSource(item.dataset.openSource)));
savedPanel.addEventListener('click', event => {
  const sourceButton = event.target.closest('[data-saved-source]');
  if (sourceButton) openSource(sourceButton.dataset.savedSource);
  if (event.target.closest('[data-return-chat]')) switchStudentView('chat');
});

const sidebar = document.querySelector('#sidebar');
const menuButton = document.querySelector('#menuButton');
menuButton.addEventListener('click', () => {
  const open = sidebar.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(open));
});
document.addEventListener('click', (event) => {
  if (window.innerWidth <= 760 && sidebar.classList.contains('open') && !sidebar.contains(event.target) && !menuButton.contains(event.target)) {
    sidebar.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false');
  }
});
