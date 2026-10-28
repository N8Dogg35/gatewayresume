import {
  amtCertCatalog,
  amtSkillCatalog,
  canonicalGroupLabel,
  experienceTypes,
  matchCatalogSkill,
  steps,
  summarySkeleton,
} from "./data.js";
import { briefFilename, buildBrief, collectRecord } from "./brief.js";
import {
  blankState,
  clearAmtPrefill,
  clearAmtSkills,
  loadState,
  prefillAmt,
  saveState,
} from "./state.js";

const app = document.querySelector("#app");
let state = loadState();

const stepCopy = {
  contact: {
    title: "Contact",
    lede: "This becomes the top line of the resume.",
  },
  job: {
    title: "Target job",
    lede: "Each brief is for one posting. Paste the description so the draft can use its language.",
  },
  summary: {
    title: "Technical summary",
    lede: "This is the short paragraph under your name. Follow the shape, answer the questions, and write a draft. The assistant edits the draft and will not add a fact you left out.",
  },
  skills: {
    title: "Technical skills",
    lede: "Check the skills you could talk about in an interview. Add one that is missing. The assistant will not add a skill you did not check or type.",
  },
  education: {
    title: "Education",
    lede: "",
  },
  experience: {
    title: "Experience",
    lede: "Add each job you want on the resume, or paste the descriptions you copied from LinkedIn. You do not need to format that paste. Paid work, unpaid work, internships, and field experience all count.",
  },
  certifications: {
    title: "Certifications",
    lede: "Check a certification only if you have earned it. Add any certification that is not on the list.",
  },
  review: {
    title: "Review",
    lede: "Check the facts, then build one brief to paste into a new chat.",
  },
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function uid(prefix) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function setPath(object, path, value) {
  const parts = path.split(".");
  let current = object;
  for (let i = 0; i < parts.length - 1; i += 1) current = current[parts[i]];
  current[parts[parts.length - 1]] = value;
}

function field({
  label,
  path,
  value,
  placeholder = "",
  autocomplete = "",
  hint = "",
  required = false,
  multiline = false,
  type = "text",
  rows = 0,
}) {
  const id = `f-${path.replace(/\./g, "-")}`;
  const hintId = hint ? `${id}-hint` : "";
  const described = hint ? `aria-describedby="${hintId}"` : "";
  const mark = required ? ' <abbr class="req" title="required">*</abbr>' : "";
  const rowCount = rows || (path === "job.description" ? 10 : 5);
  const control = multiline
    ? `<textarea id="${id}" data-path="${path}" rows="${rowCount}" placeholder="${escapeHtml(placeholder)}" ${described}>${escapeHtml(value)}</textarea>`
    : `<input id="${id}" data-path="${path}" type="${type}" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}" autocomplete="${autocomplete}" ${described}>`;
  return `<label class="field">
    <span>${label}${mark}</span>
    ${control}
    ${hint ? `<p class="hint" id="${hintId}">${hint}</p>` : ""}
  </label>`;
}

function options(pairs, current) {
  return pairs
    .map(
      ([value, label]) =>
        `<option value="${value}" ${value === current ? "selected" : ""}>${label}</option>`
    )
    .join("");
}

function persist() {
  saveState(state);
}

function render(options = {}) {
  const y = window.scrollY;
  app.innerHTML = view();
  if (options.focusSelector) {
    const el = document.querySelector(options.focusSelector);
    if (el) {
      el.focus();
      if (options.scroll === "entry") {
        (el.closest(".entry-card") || el).scrollIntoView({ block: "center" });
      }
      return;
    }
  }
  if (options.scroll === "keep") window.scrollTo(0, y);
  else window.scrollTo(0, 0);
}

function view() {
  if (!state.track || state.step === "start") return renderStart();
  if (state.step === "result") return renderResult();
  return renderWizard();
}

function privacy() {
  return `<p class="privacy">Answers stay in this browser. Nothing is uploaded.</p>`;
}

function renderStart() {
  const amtSelected = state.track === "amt" ? " is-selected" : "";
  const generalSelected = state.track === "general" ? " is-selected" : "";
  return `<div class="shell">
    <h1>AI Resume Builder - Create Your Prompt</h1>
    <p class="lede">This tool is a guide to help you write a resume with the AI chat tool of your choice. It will help you gather the materials to build a resume for a specific job. It will output a prompt for you to enter into the tool of your choice (ChatGPT, Gemini, Claude, Grok, etc.) You work with your chatbot to proofread and edit the draft before you finalize your resume.</p>
    <div class="tracks">
      <button type="button" class="track-card${amtSelected}" data-track="amt">
        <span class="eyebrow">Gateway Technical College · 10-664-2</span>
        <span class="track-title">Advanced Manufacturing Technology</span>
        <span class="track-copy">Courses, program outcomes, and embedded certifications are built in, along with the ATS resume standard.</span>
      </button>
      <button type="button" class="track-card${generalSelected}" data-track="general">
        <span class="eyebrow">Any school</span>
        <span class="track-title">Any program</span>
        <span class="track-copy">The ATS resume standard only. You enter your own school, program, and history.</span>
      </button>
    </div>
    ${privacy()}
  </div>`;
}

function header() {
  const title =
    state.track === "amt" ? "Advanced Manufacturing Technology" : "Any program";
  return `<header class="top">
    <div>
      <p class="eyebrow">Resume brief</p>
      <h1>${title}</h1>
    </div>
    <button type="button" class="secondary" data-action="start-over">Start over</button>
  </header>`;
}

function stepNav() {
  const buttons = steps
    .map((step) => {
      const current = step.id === state.step ? ' aria-current="step"' : "";
      return `<button type="button" data-goto="${step.id}"${current}>${step.label}</button>`;
    })
    .join("");
  return `<nav class="steps" aria-label="Steps">${buttons}</nav>`;
}

function footer() {
  const primary =
    state.step === "review"
      ? `<button type="button" class="primary" id="build-brief" data-action="build">Build brief</button>`
      : `<button type="button" class="primary" data-action="next">Continue</button>`;
  return `<div class="nav">
    <button type="button" class="secondary" data-action="back">Back</button>
    ${primary}
  </div>`;
}

function jobError() {
  if (clean(state.job.description)) return "";
  const show = state.step === "review" || (state.step === "job" && state.showJobError);
  if (!show) return "";
  return `<div class="banner" id="job-error" role="alert" tabindex="-1">
    <p>Paste the full job description to build the brief. The link is saved for you. The assistant only sees the text you paste.</p>
    ${state.step === "review" ? '<button type="button" data-goto="job">Go to target job</button>' : ""}
  </div>`;
}

function renderWizard() {
  const copy = stepCopy[state.step] || stepCopy.contact;
  const lede =
    state.step === "education"
      ? state.track === "amt"
        ? "Gateway, Sturtevant, and your program are filled in. The Electromechanical Maintenance Technician diploma is filled in below the associate degree. In the notes, name the technical labs and coursework you want on the resume. General education stays off."
        : "Enter the school and program you want on the resume. Use the notes for coursework or labs. Add an earlier credential if you have one."
      : state.step === "summary" && state.track !== "amt"
        ? "This is the short paragraph under your name. Give the facts you want in it. The assistant writes the sentences, and the whole resume stays on one page."
        : state.step === "skills" && state.track !== "amt"
          ? "Group the skills you could talk about in an interview. Leave a group out if it does not apply."
          : state.step === "certifications" && state.track !== "amt"
            ? "List only certifications you have earned. Add an issuer when you have one, and the assistant will group them on one line."
            : copy.lede;
  return `<div class="shell">
    ${header()}
    ${stepNav()}
    <main class="panel">
      <h2>${copy.title}</h2>
      <p class="lede">${lede}</p>
      ${jobError()}
      ${panel()}
      ${footer()}
    </main>
    ${privacy()}
  </div>`;
}

function panel() {
  switch (state.step) {
    case "job":
      return panelJob();
    case "summary":
      return panelSummary();
    case "skills":
      return panelSkills();
    case "education":
      return panelEducation();
    case "experience":
      return panelExperience();
    case "certifications":
      return panelCertifications();
    case "review":
      return panelReview();
    default:
      return panelContact();
  }
}

function panelContact() {
  const c = state.contact;
  return `${field({ label: "Name", path: "contact.name", value: c.name, autocomplete: "name", required: true })}
    <div class="grid-2">
      ${field({ label: "City", path: "contact.city", value: c.city, autocomplete: "address-level2" })}
      ${field({ label: "State", path: "contact.state", value: c.state, autocomplete: "address-level1", placeholder: "WI" })}
    </div>
    <div class="grid-2">
      ${field({ label: "Phone", path: "contact.phone", value: c.phone, type: "tel", autocomplete: "tel" })}
      ${field({ label: "Email", path: "contact.email", value: c.email, type: "email", autocomplete: "email" })}
    </div>
    ${field({
      label: "LinkedIn URL",
      path: "contact.linkedin",
      value: c.linkedin,
      type: "url",
      autocomplete: "url",
      placeholder: "https://www.linkedin.com/in/",
      hint: "Optional. The link can appear on the resume. This page does not read your profile.",
    })}`;
}

function panelJob() {
  const job = state.job;
  return `${field({ label: "Job title", path: "job.title", value: job.title, placeholder: "Maintenance technician" })}
    ${field({ label: "Company", path: "job.company", value: job.company, hint: "Optional." })}
    ${field({
      label: "Link to the posting",
      path: "job.url",
      value: job.url,
      type: "url",
      placeholder: "https://",
      hint: "Saved in the brief for your records. The page is not opened.",
    })}
    ${field({
      label: "Job description",
      path: "job.description",
      value: job.description,
      multiline: true,
      required: true,
      placeholder: "Paste the full posting",
      hint: "Required. Paste the duties and qualifications, not just the link.",
    })}
    <p class="hint" data-job-status>${clean(job.description) ? "Description pasted." : ""}</p>`;
}

function panelSummary() {
  if (state.track === "amt") return panelAmtSummary();
  return panelGeneralSummary();
}

function panelGeneralSummary() {
  const summary = state.summary;
  return `${field({
      label: "Work this summary should point at",
      path: "summary.focus",
      value: summary.focus,
      placeholder: "Industrial maintenance and automation",
    })}
    ${field({
      label: "Tools or training that must be named",
      path: "summary.tools",
      value: summary.tools,
      multiline: true,
      placeholder: "Only tools you have actually used",
    })}
    ${field({
      label: "A fact that must appear",
      path: "summary.mustInclude",
      value: summary.mustInclude,
      hint: "Optional. A credential, date, or result. Leave this blank and the summary will use your other sections.",
    })}`;
}

function panelAmtSummary() {
  const summary = state.summary;
  return `<div class="pattern">
      <h3>How this paragraph is built</h3>
      <ol>
        <li>Name the technical role, then write "with hands-on training in," then four to six specific tools.</li>
        <li>The credential sentence is already set for this program: a Technical Diploma in Electromechanical Maintenance Technician, then the Associate of Applied Science in Advanced Manufacturing Technology at Gateway Technical College. Do not add a GPA.</li>
        <li>If you already have a role, start that sentence with "Incoming," and give the employer and the start. Leave it out if you are still applying.</li>
        <li>Give earlier work one sentence at the end: how long, the skill you are bringing, and "applied now to" this field. Leave it out if the summary should stay with your training.</li>
      </ol>
      <p class="hint">Shape, with your facts in the brackets:</p>
      <p class="skeleton">${escapeHtml(summarySkeleton)}</p>
    </div>
    <p class="hint pattern-note">Replace every bracket with your own facts, or skip that sentence.</p>
    ${field({
      label: "What technical role should the first line name?",
      path: "summary.focus",
      value: summary.focus,
      placeholder: "Maintenance technician",
      hint: "A job noun, such as maintenance technician or automation technician.",
    })}
    ${field({
      label: "Which tools should that sentence name?",
      path: "summary.tools",
      value: summary.tools,
      multiline: true,
      placeholder: "Four to six tools you have actually used",
      hint: "Name the specific system, such as a PLC brand or a robot. Leave out anything you could not explain in an interview.",
    })}
    ${field({
      label: "Do you already have a next role?",
      path: "summary.nextRole",
      value: summary.nextRole,
      placeholder: "Employer, title, and start date",
      hint: "Optional. Leave this blank if you are still applying.",
    })}
    ${field({
      label: "What earlier work is worth one sentence?",
      path: "summary.prior",
      value: summary.prior,
      multiline: true,
      placeholder: "Years, the skill it gave you, and the field you use it in now",
      hint: "Optional. Leave this blank to keep the summary with your training.",
    })}
    ${field({
      label: "Write the summary in your own words",
      path: "summary.draft",
      value: summary.draft,
      multiline: true,
      rows: 7,
      placeholder: "A rough paragraph is enough. The assistant will tighten it.",
      hint: "The assistant adds the credential sentence for you. It may reorder and cut words. It will not add any other fact you left out, and it will not add a GPA.",
    })}`;
}

function panelEducation() {
  const ed = state.education;
  const earlier = ed.earlier;
  return `${field({ label: "School", path: "education.school", value: ed.school, autocomplete: "organization" })}
    ${field({ label: "Credential", path: "education.credential", value: ed.credential, placeholder: "Associate of Applied Science" })}
    ${field({ label: "Program", path: "education.program", value: ed.program })}
    <div class="grid-2">
      ${field({
        label: "Campus city",
        path: "education.city",
        value: ed.city,
        placeholder: state.track === "amt" ? "Sturtevant" : "",
      })}
      ${field({ label: "State", path: "education.state", value: ed.state, placeholder: "WI" })}
    </div>
    ${field({
      label: "Graduation or expected date",
      path: "education.gradDate",
      value: ed.gradDate,
      placeholder: "Expected May 2027",
    })}
    ${field({
      label: "Technical coursework and labs",
      path: "education.notes",
      value: ed.notes,
      multiline: true,
      hint: "What you want named under this school. General education classes are left off, and lab details come only from what you write here.",
    })}
    <h3>Earlier credential</h3>
    <p class="hint">${
      state.track === "amt"
        ? "The Electromechanical Maintenance Technician diploma is filled in. Add the date you finished it if you want that on the resume."
        : "Optional. A diploma, degree, or certificate that should appear under your current program."
    }</p>
    ${field({ label: "School", path: "education.earlier.school", value: earlier.school })}
    ${field({ label: "Credential", path: "education.earlier.credential", value: earlier.credential, placeholder: "Technical diploma" })}
    ${field({ label: "Program", path: "education.earlier.program", value: earlier.program })}
    <div class="grid-2">
      ${field({ label: "City", path: "education.earlier.city", value: earlier.city })}
      ${field({ label: "State", path: "education.earlier.state", value: earlier.state })}
    </div>
    ${field({
      label: "Date",
      path: "education.earlier.gradDate",
      value: earlier.gradDate,
      placeholder: "Completed Spring 2026",
    })}
    ${field({
      label: "Coursework or labs for this credential",
      path: "education.earlier.notes",
      value: earlier.notes,
      multiline: true,
    })}`;
}

function panelExperience() {
  const cards = state.experience.map((entry) => experienceCard(entry)).join("");
  const empty = state.experience.length
    ? ""
    : `<p class="hint">No jobs added. That is fine for early in a program.</p>`;
  const paste = state.pullLinkedIn
    ? field({
        label: "Paste descriptions from LinkedIn",
        path: "linkedInPaste",
        value: state.linkedInPaste,
        multiline: true,
        placeholder: "Drop in the text you copied. You do not need to format it.",
        hint: "The assistant turns this into job entries. It will not add duties that are not in the paste or in a job you typed.",
      })
    : "";
  return `<label class="check">
      <input type="checkbox" data-flag="pullLinkedIn" ${state.pullLinkedIn ? "checked" : ""}>
      <span>Paste descriptions from LinkedIn</span>
    </label>
    <p class="hint">Copy the experience text from LinkedIn and drop it in. You do not need to format it.</p>
    ${paste}
    ${empty}${cards}
    <button type="button" class="secondary add" data-action="add-experience">Add a job</button>`;
}

function experienceCard(entry) {
  return `<article class="entry-card" data-focus-card="${escapeHtml(entry.id)}">
    <div class="card-top">
      <strong>${escapeHtml(entry.title || "New job")}</strong>
      <button type="button" class="text-btn" data-action="remove-experience" data-id="${escapeHtml(entry.id)}">Remove</button>
    </div>
    <label class="field">
      <span>Type</span>
      <select data-list="experience" data-id="${escapeHtml(entry.id)}" data-key="type">${options(experienceTypes, entry.type || "paid")}</select>
    </label>
    ${listField("Job title", "experience", entry, "title")}
    ${listField("Organization", "experience", entry, "organization")}
    <div class="grid-2">
      ${listField("City", "experience", entry, "city")}
      ${listField("State", "experience", entry, "state")}
    </div>
    <div class="grid-2">
      ${listField("Start", "experience", entry, "start", "Jan 2024")}
      ${listField("End", "experience", entry, "end", "May 2025", false, entry.current)}
    </div>
    <label class="check">
      <input type="checkbox" data-list="experience" data-id="${escapeHtml(entry.id)}" data-key="current" ${entry.current ? "checked" : ""}>
      <span>I currently work here</span>
    </label>
    ${listField("What you actually did", "experience", entry, "notes", "Rough notes are enough. Write them in your own words.", true)}
  </article>`;
}

function listField(label, list, entry, key, placeholder = "", multiline = false, disabled = false) {
  const id = `${list}-${entry.id}-${key}`;
  const common = `id="${escapeHtml(id)}" data-list="${list}" data-id="${escapeHtml(entry.id)}" data-key="${key}" placeholder="${escapeHtml(placeholder)}" ${disabled ? "disabled" : ""}`;
  const control = multiline
    ? `<textarea ${common} rows="4">${escapeHtml(entry[key] || "")}</textarea>`
    : `<input ${common} type="text" value="${escapeHtml(entry[key] || "")}">`;
  return `<label class="field"><span>${label}</span>${control}</label>`;
}

function panelSkills() {
  if (state.track === "amt") return panelAmtSkills();
  return panelFreeSkills();
}

function panelFreeSkills() {
  const groups = state.skillGroups
    .map((group) => {
      return `<article class="entry-card" data-focus-card="${escapeHtml(group.id)}">
        <div class="card-top">
          <label class="field"><span>Group name</span><input data-list="skillGroups" data-id="${escapeHtml(group.id)}" data-key="label" type="text" value="${escapeHtml(group.label)}" placeholder="Group name"></label>
          <button type="button" class="text-btn" data-action="remove-skill-group" data-id="${escapeHtml(group.id)}">Remove</button>
        </div>
        <label class="field">
          <span>Tools in this group</span>
          <textarea data-list="skillGroups" data-id="${escapeHtml(group.id)}" data-key="skills" rows="3" placeholder="Tools you have used, separated by commas">${escapeHtml(group.skills || "")}</textarea>
        </label>
      </article>`;
    })
    .join("");
  const empty = state.skillGroups.length
    ? ""
    : `<p class="hint">No groups yet. Add one for each cluster of tools, such as Design: Figma, Photoshop.</p>`;
  return `${empty}${groups}
    <button type="button" class="secondary add" data-action="add-skill-group">Add a skill group</button>`;
}

function customSkillsIn(label) {
  const key = clean(label).toLowerCase();
  return (state.customSkills || []).filter((skill) => clean(skill.group).toLowerCase() === key);
}

function skillChips(skills) {
  if (!skills.length) return "";
  return `<ul class="added-skills">${skills
    .map(
      (skill) => `<li>
        <span>${escapeHtml(skill.name)}</span>
        <button type="button" class="text-btn" data-action="remove-custom-skill" data-id="${escapeHtml(skill.id)}">Remove</button>
      </li>`
    )
    .join("")}</ul>`;
}

function catalogSkillCard(group) {
  const draft = state.skillDrafts?.[group.id] || "";
  return `<article class="entry-card">
    <h3 id="skills-${group.id}">${escapeHtml(group.label)}</h3>
    <div class="checks" role="group" aria-labelledby="skills-${group.id}">
      ${group.skills
        .map((skill) => {
          const checked = state.selectedSkills?.[skill.id] ? "checked" : "";
          return `<label class="check">
            <input type="checkbox" data-skill="${escapeHtml(skill.id)}" ${checked}>
            <span>${escapeHtml(skill.name)}</span>
          </label>`;
        })
        .join("")}
    </div>
    ${skillChips(customSkillsIn(group.label))}
    <div class="row-inline">
      <input id="add-skill-${group.id}" data-draft="${escapeHtml(group.id)}" type="text" value="${escapeHtml(draft)}" placeholder="Add a skill, or several separated by commas" aria-label="Add a skill to ${escapeHtml(group.label)}">
      <button type="button" class="secondary" data-action="add-custom-skill" data-group="${escapeHtml(group.id)}">Add</button>
    </div>
  </article>`;
}

function extraSkillGroups() {
  const known = new Set(amtSkillCatalog.map((group) => group.label.toLowerCase()));
  const labels = [];
  for (const skill of state.customSkills || []) {
    const label = clean(skill.group) || "Other";
    if (known.has(label.toLowerCase())) continue;
    if (!labels.some((item) => item.toLowerCase() === label.toLowerCase())) labels.push(label);
  }
  return labels;
}

function panelAmtSkills() {
  const extras = extraSkillGroups()
    .map(
      (label) => `<article class="entry-card">
        <h3>${escapeHtml(label)}</h3>
        ${skillChips(customSkillsIn(label))}
      </article>`
    )
    .join("");
  return `${amtSkillCatalog.map((group) => catalogSkillCard(group)).join("")}
    ${extras}
    <h3>Add a skill in a different group</h3>
    <p class="hint">Use this when none of the groups above fit.</p>
    <div class="grid-2">
      <label class="field">
        <span>Group name</span>
        <input data-draft="extraGroup" type="text" value="${escapeHtml(state.skillDrafts?.extraGroup || "")}" placeholder="Group name">
      </label>
      <label class="field">
        <span>Skill</span>
        <input id="add-skill-extra" data-draft="extraName" type="text" value="${escapeHtml(state.skillDrafts?.extraName || "")}" placeholder="Skill you have used">
      </label>
    </div>
    <button type="button" class="secondary add" data-action="add-extra-skill">Add skill</button>`;
}

function panelCertifications() {
  const embedded =
    state.track === "amt"
      ? amtCertCatalog
          .map(
            (group) => `<section class="group-block">
              <h3 id="certs-${group.id}">${escapeHtml(group.issuer)}</h3>
              <div class="checks" role="group" aria-labelledby="certs-${group.id}">
                ${group.certs
                  .map((cert) => {
                    const checked = state.embeddedCerts?.[cert.id] ? "checked" : "";
                    return `<label class="check">
                      <input type="checkbox" data-cert="${escapeHtml(cert.id)}" ${checked}>
                      <span>${escapeHtml(cert.name)}</span>
                    </label>`;
                  })
                  .join("")}
              </div>
            </section>`
          )
          .join("")
      : "";
  const extras = state.extraCerts
    .map(
      (cert) => `<div class="entry-card">
        <div class="card-top"><strong>Certification</strong><button type="button" class="text-btn" data-action="remove-cert" data-id="${escapeHtml(cert.id)}">Remove</button></div>
        <label class="field"><span>Issuer</span><input data-list="extraCerts" data-id="${escapeHtml(cert.id)}" data-key="issuer" type="text" value="${escapeHtml(cert.issuer || "")}" placeholder="Issuer"></label>
        <label class="field"><span>Name</span><input data-list="extraCerts" data-id="${escapeHtml(cert.id)}" data-key="name" type="text" value="${escapeHtml(cert.name || "")}" placeholder="Certification name"></label>
      </div>`
    )
    .join("");
  const extraHeading = state.track === "amt" ? "Add a certification that is not listed" : "Other certifications";
  return `${embedded}
    <h3>${extraHeading}</h3>
    ${extras}
    <button type="button" class="secondary add" data-action="add-cert">Add a certification</button>`;
}

function panelReview() {
  const record = collectRecord(state);
  const contactBits = [
    record.contact.name,
    [record.contact.city, record.contact.state].filter(Boolean).join(", "),
    record.contact.phone,
    record.contact.email,
    record.contact.linkedin,
  ].filter(Boolean);
  const description = clean(record.job.description);
  const excerpt = description
    ? `${description.slice(0, 180)}${description.length > 180 ? "…" : ""}`
    : "No description pasted yet.";
  const skillBody = record.skillGroups.length
    ? `<ul>${record.skillGroups
        .map((group) => `<li><strong>${escapeHtml(group.label)}:</strong> ${escapeHtml(group.skills)}</li>`)
        .join("")}</ul>`
    : "<p>No skills listed</p>";
  const certLine = record.certs.length
    ? record.certs.map((group) => (group.issuer ? `${group.issuer}: ${group.names.join(", ")}` : group.names.join(", "))).join(" · ")
    : "No certifications listed";
  const jobLine = record.experience.length
    ? `${record.experience.length} ${record.experience.length === 1 ? "job" : "jobs"}`
    : "No jobs typed";
  const linkedLine = record.linkedInPaste
    ? "LinkedIn descriptions pasted"
    : record.pullLinkedIn
      ? "LinkedIn requested, nothing pasted yet"
      : "";
  return `${summaryBlock("Contact", "contact", contactBits.length ? `<p>${escapeHtml(contactBits.join(" · "))}</p>` : `<p>Name and contact details are still open.</p>`)}
    ${summaryBlock(
      "Target job",
      "job",
      `<p>${escapeHtml(record.job.title || "Title not set")}${record.job.company ? ` · ${escapeHtml(record.job.company)}` : ""}</p>
       <p class="excerpt">${escapeHtml(excerpt)}</p>`
    )}
    ${summaryBlock(state.track === "amt" ? "Technical summary" : "Summary", "summary", summaryReview(record))}
    ${summaryBlock(state.track === "amt" ? "Technical skills" : "Skills", "skills", skillBody)}
    ${summaryBlock(
      "Education",
      "education",
      `<p>${escapeHtml([record.education.credential, record.education.program, record.education.school].filter(Boolean).join(", ") || "School not set")}</p>
       ${record.earlier ? `<p>Earlier: ${escapeHtml([record.earlier.credential, record.earlier.school].filter(Boolean).join(", "))}</p>` : ""}`
    )}
    ${summaryBlock(
      "Experience",
      "experience",
      `<p>${escapeHtml([jobLine, linkedLine].filter(Boolean).join(" · "))}</p>`
    )}
    ${summaryBlock("Certifications", "certifications", `<p>${escapeHtml(certLine)}</p>`)}
    <p class="hint">${
      state.track === "amt"
        ? "The brief asks for one page, with a technical summary, grouped skills, education, experience, and certifications. General education stays off. Lab details come only from your notes."
        : "The brief asks for one page: summary, skills, education, experience, and certifications, using the facts on this page."
    }</p>`;
}

function summaryReview(record) {
  const summary = record.summary || {};
  if (record.track !== "amt") {
    const line = [summary.focus, summary.tools, summary.mustInclude].filter((item) => clean(item)).join(" · ");
    return `<p>${escapeHtml(line || "The assistant will write this from your other sections.")}</p>`;
  }
  const facts = [summary.focus, summary.tools, summary.nextRole, summary.prior]
    .map((item) => clean(item))
    .filter(Boolean);
  const draft = clean(summary.draft);
  if (!draft && !facts.length) {
    return "<p>The assistant will write this from your other sections, using the summary shape.</p>";
  }
  return `${draft ? `<p>${escapeHtml(draft)}</p>` : ""}${facts.length ? `<p class="excerpt">${escapeHtml(facts.join(" · "))}</p>` : ""}`;
}

function summaryBlock(title, step, body) {
  return `<section class="summary-block">
    <header>
      <h3>${title}</h3>
      <button type="button" class="text-btn" data-goto="${step}">Edit</button>
    </header>
    ${body}
  </section>`;
}

function renderResult() {
  const record = collectRecord(state);
  const highlights = [];
  highlights.push(record.contact.name || "Name not provided");
  if (record.job.title) highlights.push(record.job.title);
  if (record.skillGroups.length) highlights.push(`${record.skillGroups.length} skill ${record.skillGroups.length === 1 ? "group" : "groups"}`);
  if (record.earlier) highlights.push("Earlier credential included");
  if (record.linkedInPaste) highlights.push("LinkedIn descriptions pasted");
  highlights.push(record.experience.length ? `${record.experience.length} ${record.experience.length === 1 ? "job" : "jobs"} included` : "No jobs typed");
  if (record.certs.length) highlights.push(`${record.certs.length} certification ${record.certs.length === 1 ? "group" : "groups"}`);

  return `<div class="shell">
    ${header()}
    ${stepNav()}
    <main class="panel">
      <h2>Brief ready</h2>
      <p class="lede">Paste this whole brief into a new chat. The assistant should return a Word draft and an HTML page. Read both before you apply. This page does not save the assistant’s reply.</p>
      <ul class="highlights">
        ${highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
      <div class="actions">
        <button type="button" class="primary" id="copy-brief" data-action="copy">Copy brief</button>
        <button type="button" class="secondary" data-action="download">Download .md</button>
        <button type="button" class="secondary" data-goto="review">Back to review</button>
      </div>
      <label class="field" style="margin-top:1rem">
        <span>Brief</span>
        <textarea id="brief-text" readonly>${escapeHtml(buildBrief(state))}</textarea>
      </label>
    </main>
    ${privacy()}
  </div>`;
}

function clean(value) {
  return String(value ?? "").trim();
}

function chooseTrack(track) {
  if (track === "amt") prefillAmt(state);
  if (track === "general") {
    clearAmtPrefill(state);
    clearAmtSkills(state);
  }
  state.track = track;
  state.step = "contact";
  persist();
  render();
}

function go(step) {
  commitPendingSkills();
  state.step = step;
  persist();
  render(step === "job" && state.showJobError ? { focusSelector: "#job-error" } : {});
}

function next() {
  const index = steps.findIndex((step) => step.id === state.step);
  if (index < 0 || index >= steps.length - 1) return;
  commitPendingSkills();
  state.step = steps[index + 1].id;
  persist();
  render();
}

function back() {
  if (state.step === "result") {
    state.step = "review";
  } else {
    const index = steps.findIndex((step) => step.id === state.step);
    state.step = index <= 0 ? "start" : steps[index - 1].id;
  }
  persist();
  render();
}

function startOver() {
  const ok = window.confirm("Clear this brief and start over? This deletes only what is saved in this browser.");
  if (!ok) return;
  state = blankState();
  persist();
  render();
}

function addExperience() {
  const id = uid("job");
  state.experience.push({
    id,
    title: "",
    organization: "",
    city: "",
    state: "",
    start: "",
    end: "",
    current: false,
    type: "paid",
    notes: "",
  });
  persist();
  render({ focusSelector: `[data-focus-card="${id}"] input`, scroll: "entry" });
}

function addSkillGroup() {
  const id = uid("group");
  state.skillGroups.push({ id, label: "", skills: "" });
  persist();
  render({ focusSelector: `[data-focus-card="${id}"] input`, scroll: "entry" });
}

function addCert() {
  const id = uid("cert");
  state.extraCerts.push({ id, issuer: "", name: "" });
  persist();
  render({ focusSelector: `[data-id="${id}"]`, scroll: "entry" });
}

function removeFrom(list, id) {
  state[list] = state[list].filter((item) => item.id !== id);
  persist();
  render({ scroll: "keep" });
}

function build() {
  commitPendingSkills();
  if (!clean(state.job.description)) {
    state.showJobError = true;
    state.step = "review";
    persist();
    render({ focusSelector: "#job-error" });
    return;
  }
  state.showJobError = false;
  state.step = "result";
  persist();
  render();
}

async function copyBrief() {
  const text = buildBrief(state);
  const button = document.querySelector("#copy-brief");
  try {
    await navigator.clipboard.writeText(text);
    if (button) {
      button.textContent = "Copied";
      window.setTimeout(() => {
        if (button.isConnected) button.textContent = "Copy brief";
      }, 2000);
    }
  } catch {
    const area = document.querySelector("#brief-text");
    if (!area) return;
    area.focus();
    area.select();
  }
}

function downloadBrief() {
  const blob = new Blob([buildBrief(state)], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = briefFilename(state);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function entryBy(target) {
  return state[target.dataset.list]?.find((item) => item.id === target.dataset.id);
}

function onInput(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
  if (target.type === "checkbox") return;
  if (target.dataset.draft) {
    if (!state.skillDrafts) state.skillDrafts = {};
    state.skillDrafts[target.dataset.draft] = target.value;
    persist();
    return;
  }
  if (target.dataset.path) {
    setPath(state, target.dataset.path, target.value);
    if (target.dataset.path === "job.description") {
      const status = document.querySelector("[data-job-status]");
      if (status) status.textContent = clean(target.value) ? "Description pasted." : "";
      if (clean(target.value)) {
        state.showJobError = false;
        document.querySelector("#job-error")?.remove();
      }
    }
    persist();
    return;
  }
  if (target.dataset.list && target.dataset.id && target.dataset.key) {
    const entry = entryBy(target);
    if (!entry) return;
    entry[target.dataset.key] = target.value;
    persist();
  }
}

function onChange(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement)) return;
  if (target.dataset.flag === "pullLinkedIn") {
    state.pullLinkedIn = target.checked;
    persist();
    render(target.checked ? { focusSelector: "#f-linkedInPaste", scroll: "entry" } : { scroll: "keep" });
    return;
  }
  if (target.dataset.cert) {
    if (!state.embeddedCerts) state.embeddedCerts = {};
    state.embeddedCerts[target.dataset.cert] = target.checked;
    persist();
    return;
  }
  if (target.dataset.skill) {
    if (!state.selectedSkills) state.selectedSkills = {};
    state.selectedSkills[target.dataset.skill] = target.checked;
    persist();
    return;
  }
  if (target.dataset.list && target.dataset.id && target.dataset.key) {
    const entry = entryBy(target);
    if (!entry) return;
    entry[target.dataset.key] = target.type === "checkbox" ? target.checked : target.value;
    if (target.dataset.key === "current") {
      const end = document.querySelector(
        `[data-list="${target.dataset.list}"][data-id="${CSS.escape(target.dataset.id)}"][data-key="end"]`
      );
      if (end) end.disabled = target.checked;
    }
    persist();
  }
}

function onClick(event) {
  const track = event.target.closest("[data-track]");
  if (track) {
    chooseTrack(track.dataset.track);
    return;
  }
  const actionEl = event.target.closest("[data-action]");
  if (actionEl) {
    const { action, id } = actionEl.dataset;
    if (action === "next") next();
    else if (action === "back") back();
    else if (action === "start-over") startOver();
    else if (action === "add-experience") addExperience();
    else if (action === "remove-experience") removeFrom("experience", id);
    else if (action === "add-skill-group") addSkillGroup();
    else if (action === "remove-skill-group") removeFrom("skillGroups", id);
    else if (action === "add-custom-skill") addCatalogSkill(actionEl.dataset.group);
    else if (action === "add-extra-skill") addExtraSkill();
    else if (action === "remove-custom-skill") removeCustomSkill(id);
    else if (action === "add-cert") addCert();
    else if (action === "remove-cert") removeFrom("extraCerts", id);
    else if (action === "build") build();
    else if (action === "copy") copyBrief();
    else if (action === "download") downloadBrief();
    return;
  }
  const goto = event.target.closest("[data-goto]");
  if (goto) go(goto.dataset.goto);
}

function draftValue(key) {
  const input = document.querySelector(`[data-draft="${CSS.escape(key)}"]`);
  if (input instanceof HTMLInputElement) return input.value;
  return state.skillDrafts?.[key] || "";
}

function addCustomSkillName(groupLabel, name) {
  const skillName = clean(name);
  if (!skillName) return false;
  const label = canonicalGroupLabel(groupLabel);
  const match = matchCatalogSkill(label, skillName);
  if (!state.selectedSkills) state.selectedSkills = {};
  if (!Array.isArray(state.customSkills)) state.customSkills = [];
  if (match) {
    state.selectedSkills[match.id] = true;
    return true;
  }
  const exists = state.customSkills.some(
    (skill) =>
      canonicalGroupLabel(skill.group).toLowerCase() === label.toLowerCase() &&
      clean(skill.name).toLowerCase() === skillName.toLowerCase()
  );
  if (exists) return true;
  state.customSkills.push({ id: uid("custom"), group: label, name: skillName });
  return true;
}

function commitDraftValue(groupLabel, raw) {
  const parts = String(raw || "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  if (!parts.length) return false;
  for (const name of parts) addCustomSkillName(groupLabel, name);
  return true;
}

function commitPendingSkills() {
  if (state.track !== "amt") return;
  if (!state.skillDrafts) state.skillDrafts = {};
  for (const group of amtSkillCatalog) {
    if (commitDraftValue(group.label, draftValue(group.id))) state.skillDrafts[group.id] = "";
  }
  if (commitDraftValue(draftValue("extraGroup") || "Other", draftValue("extraName"))) {
    state.skillDrafts.extraGroup = "";
    state.skillDrafts.extraName = "";
  }
}

function addCatalogSkill(groupId) {
  const group = amtSkillCatalog.find((item) => item.id === groupId);
  if (!group) return;
  if (!commitDraftValue(group.label, draftValue(group.id))) return;
  if (!state.skillDrafts) state.skillDrafts = {};
  state.skillDrafts[group.id] = "";
  persist();
  render({ focusSelector: `#add-skill-${group.id}`, scroll: "keep" });
}

function addExtraSkill() {
  if (!commitDraftValue(draftValue("extraGroup") || "Other", draftValue("extraName"))) return;
  if (!state.skillDrafts) state.skillDrafts = {};
  state.skillDrafts.extraGroup = "";
  state.skillDrafts.extraName = "";
  persist();
  render({ focusSelector: "#add-skill-extra", scroll: "keep" });
}

function removeCustomSkill(id) {
  state.customSkills = (state.customSkills || []).filter((skill) => skill.id !== id);
  persist();
  render({ scroll: "keep" });
}

function onKeyDown(event) {
  if (event.key !== "Enter") return;
  const target = event.target;
  if (!(target instanceof HTMLInputElement) || !target.dataset.draft) return;
  event.preventDefault();
  if (target.dataset.draft === "extraGroup" || target.dataset.draft === "extraName") addExtraSkill();
  else addCatalogSkill(target.dataset.draft);
}

document.addEventListener("click", onClick);
document.addEventListener("input", onInput);
document.addEventListener("change", onChange);
document.addEventListener("keydown", onKeyDown);
render();
