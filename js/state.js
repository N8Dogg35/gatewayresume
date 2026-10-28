import { amtProgram, amtSkillGroups, canonicalGroupLabel, emtCredential, matchCatalogSkill, steps } from "./data.js";

const STORAGE_KEY = "resume-brief-wizard-v2";

export function blankEarlier() {
  return {
    school: "",
    credential: "",
    program: "",
    city: "",
    state: "",
    gradDate: "",
    notes: "",
  };
}

export function blankEducation() {
  return {
    school: "",
    credential: "",
    program: "",
    city: "",
    state: "",
    gradDate: "",
    notes: "",
    earlier: blankEarlier(),
  };
}

export function blankSummary() {
  return {
    focus: "",
    tools: "",
    mustInclude: "",
    completed: "",
    pursuing: "",
    nextRole: "",
    prior: "",
    draft: "",
  };
}

export function blankState() {
  return {
    track: null,
    step: "start",
    showJobError: false,
    contact: {
      name: "",
      city: "",
      state: "",
      phone: "",
      email: "",
      linkedin: "",
    },
    job: {
      title: "",
      company: "",
      url: "",
      description: "",
    },
    summary: blankSummary(),
    education: blankEducation(),
    experience: [],
    pullLinkedIn: false,
    linkedInPaste: "",
    skillGroups: [],
    selectedSkills: {},
    customSkills: [],
    skillDrafts: {},
    extraCerts: [],
    embeddedCerts: {},
  };
}

function knownStep(step) {
  return step === "start" || step === "result" || steps.some((item) => item.id === step);
}

export function normalize(raw) {
  const base = blankState();
  if (!raw || typeof raw !== "object") return base;
  const state = {
    ...base,
    ...raw,
    contact: { ...base.contact, ...(raw.contact || {}) },
    job: { ...base.job, ...(raw.job || {}) },
    summary: { ...base.summary, ...(raw.summary || {}) },
    education: {
      ...base.education,
      ...(raw.education || {}),
      earlier: {
        ...base.education.earlier,
        ...((raw.education && raw.education.earlier) || {}),
      },
    },
    experience: Array.isArray(raw.experience) ? raw.experience : [],
    skillGroups: Array.isArray(raw.skillGroups) ? raw.skillGroups : [],
    selectedSkills:
      raw.selectedSkills && typeof raw.selectedSkills === "object" && !Array.isArray(raw.selectedSkills)
        ? raw.selectedSkills
        : {},
    customSkills: Array.isArray(raw.customSkills)
      ? raw.customSkills.filter((item) => item && typeof item === "object")
      : [],
    skillDrafts:
      raw.skillDrafts && typeof raw.skillDrafts === "object" && !Array.isArray(raw.skillDrafts)
        ? raw.skillDrafts
        : {},
    extraCerts: Array.isArray(raw.extraCerts) ? raw.extraCerts : [],
    embeddedCerts:
      raw.embeddedCerts && typeof raw.embeddedCerts === "object" ? raw.embeddedCerts : {},
  };
  state.pullLinkedIn = Boolean(state.pullLinkedIn);
  state.linkedInPaste = state.linkedInPaste || "";
  if (state.track !== "amt" && state.track !== "emt" && state.track !== "general") {
    state.track = null;
    state.step = "start";
  }
  if (!knownStep(state.step)) state.step = state.track ? "contact" : "start";
  state.showJobError = Boolean(state.showJobError);
  absorbLegacySkillText(state);
  if (state.track === "amt") applyAmtEducationDefaults(state);
  if (state.track === "emt") applyEmtEducationDefaults(state);
  return state;
}

function tidy(value) {
  return String(value ?? "").trim();
}

export function absorbLegacySkillText(state) {
  if (state.track !== "amt") return;
  if (!state.selectedSkills || typeof state.selectedSkills !== "object") state.selectedSkills = {};
  if (!Array.isArray(state.customSkills)) state.customSkills = [];

  for (const group of state.skillGroups || []) {
    const label = canonicalGroupLabel(group.label);
    const parts = String(group.skills || "")
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
    for (const name of parts) {
      const match = matchCatalogSkill(label, name);
      if (match) {
        state.selectedSkills[match.id] = true;
        continue;
      }
      const exists = state.customSkills.some(
        (skill) =>
          canonicalGroupLabel(skill.group).toLowerCase() === label.toLowerCase() &&
          tidy(skill.name).toLowerCase() === name.toLowerCase()
      );
      if (exists) continue;
      const slug = `${label}-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      state.customSkills.push({
        id: `legacy-${slug}-${state.customSkills.length}`,
        group: label,
        name,
      });
    }
    group.skills = "";
  }

  state.skillGroups = (state.skillGroups || []).filter((group) => tidy(group.skills));
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return blankState();
    return normalize(JSON.parse(raw));
  } catch {
    return blankState();
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const legacyProgramLabel = `${amtProgram.programName} (${amtProgram.programCode})`;

export function programLabel() {
  return amtProgram.programName;
}

function text(value) {
  return String(value ?? "").trim();
}

function earlierEmpty(ed) {
  const earlier = ed.earlier || {};
  return !["school", "credential", "program", "city", "state", "gradDate", "notes"].some((key) =>
    text(earlier[key])
  );
}

function earlierMatchesPrefill(ed) {
  if (earlierEmpty(ed)) return true;
  const earlier = ed.earlier || {};
  return (
    earlier.school === emtCredential.school &&
    earlier.credential === emtCredential.credential &&
    earlier.program === emtCredential.program &&
    (text(earlier.city) === "" || text(earlier.city) === emtCredential.city) &&
    (text(earlier.state) === "" || text(earlier.state) === emtCredential.state) &&
    !text(earlier.gradDate) &&
    !text(earlier.notes)
  );
}

function isAmtProgramName(program) {
  const value = text(program);
  return value === amtProgram.programName || value === legacyProgramLabel;
}

export function educationMatchesPrefill(state) {
  const ed = state.education;
  return (
    ed.school === amtProgram.school &&
    ed.credential === amtProgram.credential &&
    isAmtProgramName(ed.program) &&
    (text(ed.city) === "" || text(ed.city) === amtProgram.city) &&
    (text(ed.state) === "" || text(ed.state) === amtProgram.state) &&
    !text(ed.gradDate) &&
    !text(ed.notes) &&
    earlierMatchesPrefill(ed)
  );
}

function fillEmtCredential(earlier) {
  earlier.school = emtCredential.school;
  earlier.credential = emtCredential.credential;
  earlier.program = emtCredential.program;
  if (!text(earlier.city)) earlier.city = emtCredential.city;
  if (!text(earlier.state)) earlier.state = emtCredential.state;
}

export function clearAmtSkills(state) {
  const groups = state.skillGroups || [];
  const onlyDefaults = groups.every(
    (group) => amtSkillGroups.includes(group.label) && !String(group.skills || "").trim()
  );
  if (onlyDefaults) state.skillGroups = [];
}

export function applyAmtEducationDefaults(state) {
  const ed = state.education;
  if (!ed.earlier) ed.earlier = blankEarlier();
  if (ed.program === legacyProgramLabel) ed.program = amtProgram.programName;
  const empty = !text(ed.school) && !text(ed.credential) && !text(ed.program) && earlierMatchesPrefill(ed);
  if (!empty && !educationMatchesPrefill(state)) {
    if (ed.school === amtProgram.school && isAmtProgramName(ed.program)) {
      if (!text(ed.city)) ed.city = amtProgram.city;
      if (!text(ed.state)) ed.state = amtProgram.state;
      if (earlierEmpty(ed)) fillEmtCredential(ed.earlier);
    }
    return;
  }
  ed.school = amtProgram.school;
  ed.credential = amtProgram.credential;
  ed.program = amtProgram.programName;
  ed.city = amtProgram.city;
  ed.state = amtProgram.state;
  fillEmtCredential(ed.earlier);
}

export function prefillAmt(state) {
  applyAmtEducationDefaults(state);
}

export function clearAmtPrefill(state) {
  if (!educationMatchesPrefill(state)) return;
  state.education = blankEducation();
}

export function educationMatchesEmt(state) {
  const ed = state.education;
  return (
    ed.school === emtCredential.school &&
    ed.credential === emtCredential.credential &&
    ed.program === emtCredential.program &&
    (text(ed.city) === "" || text(ed.city) === emtCredential.city) &&
    (text(ed.state) === "" || text(ed.state) === emtCredential.state) &&
    !text(ed.gradDate) &&
    !text(ed.notes) &&
    earlierEmpty(ed)
  );
}

export function applyEmtEducationDefaults(state) {
  const ed = state.education;
  if (!ed.earlier) ed.earlier = blankEarlier();
  const blank = !text(ed.school) && !text(ed.credential) && !text(ed.program) && earlierEmpty(ed);
  const replace = blank || educationMatchesEmt(state) || educationMatchesPrefill(state);
  if (!replace) {
    if (
      ed.school === emtCredential.school &&
      ed.credential === emtCredential.credential &&
      ed.program === emtCredential.program
    ) {
      if (!text(ed.city)) ed.city = emtCredential.city;
      if (!text(ed.state)) ed.state = emtCredential.state;
    }
    return;
  }
  ed.school = emtCredential.school;
  ed.credential = emtCredential.credential;
  ed.program = emtCredential.program;
  ed.city = emtCredential.city;
  ed.state = emtCredential.state;
  ed.earlier = blankEarlier();
}

export function prefillEmt(state) {
  applyEmtEducationDefaults(state);
}

export function clearEmtPrefill(state) {
  if (!educationMatchesEmt(state)) return;
  state.education = blankEducation();
}
