const form = document.querySelector('#chatForm');
const input = document.querySelector('#questionInput');
const welcome = document.querySelector('#welcome');
const messages = document.querySelector('#messages');
const sourceDialog = document.querySelector('#sourceDialog');
const toast = document.querySelector('#toast');
const savedPanel = document.querySelector('#savedPanel');
const savedList = document.querySelector('#savedList');
const savedAnswers = [];
const courseDialog = document.querySelector('#courseDialog');

const courses = {
  psy201: { code: 'PSY 201', name: 'Cognitive Psychology', term: 'Fall 2026', instructor: 'Dr. Chen', classTime: 'Tue & Thu · 10:00–11:15 AM', monogram: 'PS', accessCode: 'PSY201-F26', students: 34 },
  cis222: { code: 'CIS 222', name: 'Business Analytics', term: 'Fall 2026', instructor: 'Prof. Baek', classTime: 'Mon & Wed · 2:00–3:15 PM', monogram: 'CI', accessCode: 'CIS222-F26', students: 41 },
  cis490: { code: 'CIS 490', name: 'AI Capstone', term: 'Winter 2027', instructor: 'Prof. Baek', classTime: 'Friday · 1:00–3:30 PM', monogram: 'AI', accessCode: 'CIS490-W27', students: 18 }
};
let activeCourseKey = 'psy201';

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

const escapeHtml = value => String(value).replace(/[&<>"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[character]));

const sources = {
  memory: {
    title: 'Lecture 04 — Memory Systems', location: 'Slide 12', heading: 'Working memory',
    text: 'A limited-capacity system for temporarily holding and actively manipulating information needed for complex cognitive tasks.',
    highlight: 'Working memory involves both storage and active processing.', visibility: 'Citation-only'
  },
  assignment: {
    title: 'Assignment 3 — Research Critique', location: 'Page 1 · Submission', heading: 'Due date & submission',
    text: 'Submit one PDF through Canvas by the deadline. Include your critique, references, and completed article-analysis table.',
    highlight: 'Due Friday, October 16 at 11:59 PM ET.', visibility: 'Student-visible'
  },
  rubric: {
    title: 'Research Critique Rubric', location: 'Page 2 · Grading criteria', heading: 'Evaluation criteria',
    text: 'The critique is assessed across four areas: summary, methodological analysis, use of evidence, and clarity of writing.',
    highlight: 'Methodological analysis carries the greatest weight at 40%.', visibility: 'Student-visible'
  },
  exam: {
    title: 'Exam 2 Study Guide', location: 'Page 1 · Scope', heading: 'What to review',
    text: 'Exam 2 covers attention, working memory, long-term memory, and retrieval from Lectures 4–7 and the assigned readings.',
    highlight: 'Focus on comparing models and applying them to short scenarios.', visibility: 'Student-visible'
  },
  syllabus: {
    title: 'PSY 201 Course Syllabus', location: 'Page 5 · Course policies', heading: 'Getting help',
    text: 'Questions involving personal circumstances or exceptions to course policy must be directed to the instructor.',
    highlight: 'Email Dr. Chen or visit office hours for individual policy questions.', visibility: 'Student-visible'
  },
  sql: {
    title: 'Lecture 05 — Joining Data', location: 'Slide 9', heading: 'INNER JOIN and LEFT JOIN',
    text: 'An INNER JOIN keeps matching rows from both tables. A LEFT JOIN keeps every row from the left table and matching rows from the right table.',
    highlight: 'Choose the join based on which unmatched records must remain in the result.', visibility: 'Citation-only'
  },
  sqlAssignment: {
    title: 'Assignment 3 — SQL Analysis', location: 'Page 2 · AI help policy', heading: 'Permitted assistance',
    text: 'Students may receive conceptual explanations and error-localization help, but submitted SQL must be their own work.',
    highlight: 'Completed queries are not permitted for this assignment.', visibility: 'Student-visible'
  },
  capstone: {
    title: 'AI Capstone Project Guide', location: 'Page 3 · Proposal', heading: 'Proposal requirements',
    text: 'The proposal defines the user problem, evidence source, evaluation plan, and a scoped prototype milestone.',
    highlight: 'Submit the two-page proposal before beginning implementation.', visibility: 'Student-visible'
  }
};

const coursePromptSets = {
  psy201: [
    ['Explain a concept', 'Working memory vs. short-term memory', 'What is the difference between working memory and short-term memory?'],
    ['Check a deadline', 'Assignment 3 due date and requirements', 'When is Assignment 3 due, and what do I need to submit?'],
    ['Understand grading', 'Research critique rubric', 'How will the research critique be graded?'],
    ['Prepare for class', 'What to review before the next exam', 'What should I review before the next exam?']
  ],
  cis222: [
    ['Explain a concept', 'INNER JOIN vs. LEFT JOIN', 'What is the difference between an INNER JOIN and a LEFT JOIN?'],
    ['Check a deadline', 'SQL analysis submission', 'When is the SQL analysis due?'],
    ['Understand a policy', 'Allowed AI help for Assignment 3', 'Can AI write my Assignment 3 SQL query?'],
    ['Prepare for class', 'What to practice before the SQL lab', 'What should I practice before the SQL lab?']
  ],
  cis490: [
    ['Plan the project', 'Scope a useful AI prototype', 'How should I scope my AI prototype?'],
    ['Check a deadline', 'Capstone proposal requirements', 'What is required in the capstone proposal?'],
    ['Understand grading', 'Prototype evaluation rubric', 'How will the capstone prototype be evaluated?'],
    ['Prepare for class', 'What to bring to design review', 'What should I prepare for the design review?']
  ]
};

const materialsByCourse = {
  psy201: [
    { id: 'syllabus', type: 'PDF', tone: 'navy', title: 'PSY 201 Course Syllabus', meta: 'Syllabus · Official authority · 8 pages', visibility: 'Student-visible' },
    { id: 'memory', type: 'SLIDES', tone: 'purple', title: 'Lecture 04 — Memory Systems', meta: 'Lecture · Module 2 · 24 slides', visibility: 'Citation-only' },
    { id: 'script', type: 'DOCX', tone: 'orange', title: 'Lecture 04 Instructor Script', meta: 'Instructor notes · 14 pages · Original hidden', visibility: 'Instructor-only' },
    { id: 'assignment', type: 'PDF', tone: 'green', title: 'Assignment 3 — Research Critique', meta: 'Assignment · Official · 4 pages', visibility: 'Student-visible' },
    { id: 'answer-key', type: 'PDF', tone: 'red', title: 'Assignment 3 Answer Key', meta: 'Restricted assessment material · 3 pages', visibility: 'Instructor-only', locked: true }
  ],
  cis222: [
    { id: 'cis-syllabus', type: 'PDF', tone: 'navy', title: 'CIS 222 Course Syllabus', meta: 'Syllabus · Official authority · 9 pages', visibility: 'Student-visible' },
    { id: 'sql', type: 'SLIDES', tone: 'purple', title: 'Lecture 05 — Joining Data', meta: 'Lecture · Module 3 · 28 slides', visibility: 'Citation-only' },
    { id: 'sql-assignment', type: 'PDF', tone: 'green', title: 'Assignment 3 — SQL Analysis', meta: 'Assignment · Official · 5 pages', visibility: 'Student-visible' },
    { id: 'sql-key', type: 'SQL', tone: 'red', title: 'Assignment 3 Reference Solution', meta: 'Restricted answer key · Original hidden', visibility: 'Instructor-only', locked: true }
  ],
  cis490: [
    { id: 'capstone-syllabus', type: 'PDF', tone: 'navy', title: 'CIS 490 Course Syllabus', meta: 'Syllabus · Official authority · 7 pages', visibility: 'Student-visible' },
    { id: 'capstone', type: 'PDF', tone: 'green', title: 'AI Capstone Project Guide', meta: 'Project guide · Official · 12 pages', visibility: 'Student-visible' },
    { id: 'planning-notes', type: 'DOCX', tone: 'orange', title: 'Instructor Planning Notes', meta: 'Internal teaching notes · Original hidden', visibility: 'Instructor-only' },
    { id: 'rubric-capstone', type: 'PDF', tone: 'purple', title: 'Prototype Evaluation Rubric', meta: 'Rubric · Official · 4 pages', visibility: 'Citation-only' }
  ]
};

function getSource(key) {
  if (key === 'courseProfile') {
    const course = courses[activeCourseKey];
    return { title: `${course.code} Course Settings`, location: 'Official course metadata', heading: course.name, text: `Instructor: ${course.instructor}. Class time: ${course.classTime}. Term: ${course.term}.`, highlight: `${course.instructor} · ${course.classTime}`, visibility: 'Student-visible' };
  }
  return sources[key];
}

function openSource(key) {
  const source = getSource(key);
  if (!source) return;
  document.querySelector('#sourceTitle').textContent = source.title;
  document.querySelector('#sourceLocation').textContent = source.location;
  document.querySelector('#sourceHeading').textContent = source.heading;
  document.querySelector('#sourceText').textContent = source.text;
  document.querySelector('#sourceHighlight').textContent = source.highlight;
  const citationOnly = source.visibility === 'Citation-only';
  document.querySelector('#sourcePrivacyNote').hidden = !citationOnly;
  document.querySelector('#sourceOriginalButton').hidden = citationOnly;
  sourceDialog.showModal();
}

function citation(label, key) {
  return `<button class="citation" type="button" data-source="${key}">${icon('source')}${label}</button>`;
}

function answerFor(question) {
  const q = question.toLowerCase();
  const activeCourse = courses[activeCourseKey];
  if (/professor|instructor|teacher|who teaches|교수|담당/.test(q)) {
    return `<p><strong>${activeCourse.instructor}</strong> is the instructor for ${activeCourse.code} — ${activeCourse.name}. ${citation('Course settings · instructor', 'courseProfile')}</p>`;
  }
  if (/class time|meeting time|when.*class|what time|schedule|수업 시간|강의 시간|몇 시/.test(q)) {
    return `<p>${activeCourse.code} meets <strong>${activeCourse.classTime}</strong>. ${citation('Course settings · class time', 'courseProfile')}</p>`;
  }
  if (activeCourseKey === 'cis222') {
    if (/join|inner|left/.test(q)) return `<p>An <strong>INNER JOIN</strong> returns rows with matching keys in both tables. A <strong>LEFT JOIN</strong> keeps every row from the left table, even when no match exists on the right. ${citation('Lecture 05 · slide 9', 'sql')}</p><p>Start by asking whether unmatched records from your primary table must remain. If yes, use a LEFT JOIN; otherwise an INNER JOIN may be appropriate. ${citation('Lecture 05 · slides 9–11', 'sql')}</p>`;
    if (/ai|write|query|assignment 3/.test(q)) return `<div class="escalation"><strong>Direct query generation is restricted for Assignment 3.</strong><br>I can explain the relevant SQL concept, identify the next step, or help locate an error, but the submitted query must be your own.</div>`;
    if (/due|deadline|submit/.test(q)) return `<p>The SQL analysis is due <strong>Friday at 11:59 PM ET</strong>. Submit the SQL file and exported results through Canvas.</p>`;
  }
  if (activeCourseKey === 'cis490') {
    if (/proposal|required|scope|prototype/.test(q)) return `<p>Your proposal should define the <strong>user problem, evidence source, evaluation plan, and a scoped prototype milestone</strong>. Keep it to two pages. ${citation('Capstone guide · p. 3', 'capstone')}</p><p>The project guide recommends proving one complete user workflow before adding secondary features. ${citation('Capstone guide · p. 4', 'capstone')}</p>`;
    if (/design review|prepare|class/.test(q)) return `<p>Bring a one-sentence problem statement, your primary user flow, and one testable success measure to the design review. ${citation('Capstone guide · p. 3', 'capstone')}</p>`;
  }
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
    return `<div class="escalation"><strong>I can’t safely decide that from the course materials.</strong><br>This question may require an individual exception or involve personal circumstances. Please contact ${courses[activeCourseKey].instructor} or ask during office hours. The course policy directs individual exceptions to the instructor. ${citation('Course policy · individual exceptions', 'syllabus')}</div>`;
  }
  return `<p>I couldn’t find a reliable answer to that question in the approved evidence for this course. I don’t want to guess.</p><div class="escalation"><strong>This needs instructor guidance.</strong><br>Please send this question to ${courses[activeCourseKey].instructor}. You can also rephrase it with the name of a lecture, assignment, or course policy so I can search more precisely.</div>`;
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
    if (activeCourseKey === 'cis222') answer.innerHTML = `<p>The SQL analysis is due <strong>Friday at 11:59 PM ET</strong>. Submit the SQL file and exported results through Canvas.</p>${citation('Assignment 3 · p. 1', 'sqlAssignment')}`;
    else if (activeCourseKey === 'cis490') answer.innerHTML = `<p>The capstone proposal is due before the first design review and must be no more than two pages.</p>${citation('Capstone guide · p. 3', 'capstone')}`;
    else answer.innerHTML = `<p>Assignment 3 is due <strong>Friday, October 16 at 11:59 PM ET</strong>. Submit one PDF through Canvas.</p>${citation('Assignment 3 · p. 1', 'assignment')}`;
  } else {
    state.className = 'state restricted'; state.textContent = 'RESTRICTED'; policyLevel.textContent = 'HINT ONLY';
    policyText.innerHTML = activeCourseKey === 'cis222' ? '<strong>Assignment 3 override</strong><br>Concept explanation and error localization are allowed. Completed queries are prohibited.' : activeCourseKey === 'cis490' ? '<strong>Capstone submission policy</strong><br>Planning and feedback are allowed. A completed proposal is prohibited.' : '<strong>Research critique policy</strong><br>Explanation and planning are allowed. A completed critique is prohibited.';
    if (activeCourseKey === 'cis222') answer.innerHTML = `<p>I can help you understand the SQL concepts and identify the next step, but I can’t provide a completed query for this assignment.</p><p>Start by identifying the two tables you need to join and the column they share. Then decide which rows your <code>WHERE</code> clause should keep.</p>${citation('Assignment 3 · p. 2', 'sqlAssignment')}`;
    else if (activeCourseKey === 'cis490') answer.innerHTML = `<p>I can help you improve the proposal structure, but I can’t write a completed capstone proposal for submission.</p><p>Start with the user problem, evidence source, and one testable success measure.</p>${citation('Capstone guide · p. 3', 'capstone')}`;
    else answer.innerHTML = `<p>I can explain the critique requirements and help you plan, but I can’t write a completed submission.</p><p>Start by identifying one methodological strength and one limitation, then connect each to evidence from the article.</p>${citation('Assignment 3 · p. 2', 'assignment')}`;
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
  savedPanel.hidden = view !== 'saved';
  document.querySelector('#newChat').hidden = !isChat || instructorMode;
  document.querySelector('#viewLabel').textContent = view === 'saved' ? 'Saved answers' : 'Course assistant';
  document.querySelectorAll('[data-view]').forEach(item => {
    const active = item.dataset.view === view;
    item.classList.toggle('active', active);
    if (active) item.setAttribute('aria-current', 'page'); else item.removeAttribute('aria-current');
  });
}

function renderSavedAnswers() {
  document.querySelector('#savedCount').textContent = `${savedAnswers.length} saved`;
  if (!savedAnswers.length) return;
  savedList.innerHTML = savedAnswers.map(item => `<article class="saved-card"><div><p>${item.summary}</p><small>${item.savedAt}${item.sourceKey ? ` · ${getSource(item.sourceKey).title}` : ''}</small></div>${item.sourceKey ? `<button type="button" data-saved-source="${item.sourceKey}">Open source</button>` : ''}</article>`).join('');
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
savedPanel.addEventListener('click', event => {
  const sourceButton = event.target.closest('[data-saved-source]');
  if (sourceButton) openSource(sourceButton.dataset.savedSource);
  if (event.target.closest('[data-return-chat]')) switchStudentView('chat');
});

const workspaceMeta = {
  settings: ['Course settings', 'Manage course identity, student access, and the default assistant policy.'],
  materials: ['Materials', 'Upload knowledge, review processing, and control what students can see.'],
  test: ['Test Console', 'Preview the exact student answer, supporting evidence, and active policy.']
};

function switchWorkspace(view) {
  document.querySelector('#settingsWorkspace').hidden = view !== 'settings';
  document.querySelector('#materialsWorkspace').hidden = view !== 'materials';
  document.querySelector('#testWorkspace').hidden = view !== 'test';
  document.querySelector('#workspaceTitle').textContent = workspaceMeta[view][0];
  document.querySelector('#workspaceDescription').textContent = workspaceMeta[view][1];
  document.querySelectorAll('[data-workspace]').forEach(button => button.classList.toggle('active', button.dataset.workspace === view));
}

document.querySelectorAll('[data-workspace]').forEach(button => button.addEventListener('click', () => switchWorkspace(button.dataset.workspace)));

function renderCourseMaterials() {
  const list = document.querySelector('#instructorMaterialList');
  const materials = materialsByCourse[activeCourseKey];
  list.innerHTML = materials.map(material => {
    const publicDisabled = material.locked ? 'disabled' : '';
    return `<article class="instructor-material" data-material-id="${escapeHtml(material.id)}"><span class="material-type ${material.tone}">${escapeHtml(material.type)}</span><div><strong>${escapeHtml(material.title)}</strong><small>${escapeHtml(material.meta)}</small></div><span class="process-status ${material.status === 'Processing' ? 'processing' : 'ready'}">${material.status || 'Ready'}</span><label>Student access<select data-visibility ${material.locked ? 'aria-label="Student access — locked"' : ''}><option ${publicDisabled} ${material.visibility === 'Student-visible' ? 'selected' : ''}>Student-visible</option><option ${publicDisabled} ${material.visibility === 'Citation-only' ? 'selected' : ''}>Citation-only</option><option ${material.visibility === 'Instructor-only' ? 'selected' : ''}>Instructor-only</option></select></label><button type="button" data-material-menu aria-label="Material options">•••</button></article>`;
  }).join('');
  document.querySelector('#materialCount').textContent = materials.length;
}

function applyCourse(key) {
  const course = courses[key];
  if (!course) return;
  activeCourseKey = key;
  document.querySelector('#courseMonogram').textContent = course.monogram;
  document.querySelector('#courseCode').textContent = course.code;
  document.querySelector('#courseName').textContent = course.name;
  document.querySelector('#courseKicker').textContent = `${course.code} · ${course.term.toUpperCase()}`;
  input.placeholder = `Ask a question about ${course.code}…`;
  document.querySelector('#testQuestion').value = key === 'cis222' ? 'Can you write the SQL query for Assignment 3?' : key === 'cis490' ? 'Can you write my capstone proposal?' : 'Can you write my Assignment 3 critique?';
  document.querySelector('#settingCode').value = course.code;
  document.querySelector('#settingName').value = course.name;
  document.querySelector('#settingTerm').value = course.term;
  document.querySelector('#settingInstructor').value = course.instructor;
  document.querySelector('#settingClassTime').value = course.classTime;
  document.querySelector('#accessCode').textContent = course.accessCode;
  document.querySelector('#summaryMonogram').textContent = course.monogram;
  document.querySelector('#summaryCode').textContent = course.code;
  document.querySelector('#summaryName').textContent = course.name;
  document.querySelector('#summaryTerm').textContent = course.term;
  document.querySelector('#summaryClassTime').textContent = course.classTime;
  document.querySelector('#trustText').textContent = `Answers use only evidence approved by ${course.instructor}.`;
  document.querySelectorAll('#courseOptions [data-course]').forEach(button => {
    const active = button.dataset.course === key;
    const optionCourse = courses[button.dataset.course];
    button.querySelector('strong').textContent = optionCourse.code;
    button.querySelector('small').textContent = `${optionCourse.name} · ${optionCourse.term}`;
    button.classList.toggle('active', active);
    button.querySelector('b').textContent = active ? 'Current' : 'Switch';
  });
  document.querySelectorAll('.prompt-card').forEach((button, index) => {
    const prompt = coursePromptSets[key][index];
    button.dataset.question = prompt[2];
    button.querySelector('strong').textContent = prompt[0];
    button.querySelector('small').textContent = prompt[1];
  });
  const testExamples = key === 'cis222' ? [['Course info', 'When is Assignment 3 due?'], ['Restricted help', 'Can you write the SQL query for Assignment 3?'], ['Source conflict', 'Is the late policy different in the announcement?']] : key === 'cis490' ? [['Course info', 'When is the capstone proposal due?'], ['Restricted help', 'Can you write my capstone proposal?'], ['Source conflict', 'Do the project guide and announcement disagree?']] : [['Course info', 'When is Assignment 3 due?'], ['Restricted help', 'Can you write my Assignment 3 critique?'], ['Source conflict', 'Is the late policy different in the announcement?']];
  document.querySelectorAll('[data-test]').forEach((button, index) => { button.textContent = testExamples[index][0]; button.dataset.test = testExamples[index][1]; });
  renderCourseMaterials();
  messages.replaceChildren(); messages.classList.remove('active'); welcome.hidden = false;
  showToast(`${course.code} selected`);
}

document.querySelector('#courseButton').addEventListener('click', () => courseDialog.showModal());
document.querySelector('#openCourseSwitcher').addEventListener('click', () => courseDialog.showModal());
document.querySelector('#closeCourseDialog').addEventListener('click', () => courseDialog.close());
document.querySelectorAll('#courseOptions [data-course]').forEach(button => button.addEventListener('click', () => { applyCourse(button.dataset.course); courseDialog.close(); }));
document.querySelector('#createCourseButton').addEventListener('click', () => showToast('New course setup will open here'));

document.querySelector('#courseSettingsForm').addEventListener('submit', event => {
  event.preventDefault();
  const course = courses[activeCourseKey];
  course.code = document.querySelector('#settingCode').value.trim();
  course.name = document.querySelector('#settingName').value.trim();
  course.term = document.querySelector('#settingTerm').value.trim();
  course.instructor = document.querySelector('#settingInstructor').value.trim();
  course.classTime = document.querySelector('#settingClassTime').value.trim();
  applyCourse(activeCourseKey);
  document.querySelector('.settings-state').textContent = 'Saved just now';
  showToast('Course settings saved');
});

document.querySelector('#copyAccessCode').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(document.querySelector('#accessCode').textContent); showToast('Access code copied'); }
  catch { showToast('Access code ready to copy'); }
});

const materialInput = document.querySelector('#materialFileInput');
document.querySelector('#uploadMaterialButton').addEventListener('click', () => materialInput.click());
materialInput.addEventListener('change', () => {
  const files = [...materialInput.files];
  const uploadCourseKey = activeCourseKey;
  files.forEach(file => {
    const extension = file.name.split('.').pop().toUpperCase().slice(0, 6);
    materialsByCourse[uploadCourseKey].unshift({ id: `upload-${Date.now()}-${file.name}`, type: extension, tone: 'orange', title: file.name, meta: 'New upload · Private by default', visibility: 'Instructor-only', status: 'Processing' });
  });
  renderCourseMaterials();
  window.setTimeout(() => { materialsByCourse[uploadCourseKey].forEach(material => { if (material.status === 'Processing') material.status = 'Ready'; }); if (activeCourseKey === uploadCourseKey) renderCourseMaterials(); }, 1200);
  materialInput.value = '';
  showToast(`${files.length} material${files.length === 1 ? '' : 's'} added as Instructor-only`);
});

document.querySelector('#instructorMaterialList').addEventListener('change', event => {
  if (!event.target.matches('[data-visibility]')) return;
  const id = event.target.closest('[data-material-id]').dataset.materialId;
  const material = materialsByCourse[activeCourseKey].find(item => item.id === id);
  if (material) material.visibility = event.target.value;
  showToast(`Access changed to ${event.target.value}`);
});

renderCourseMaterials();

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
