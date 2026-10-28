export const steps = [
  { id: "contact", label: "Contact" },
  { id: "job", label: "Target job" },
  { id: "summary", label: "Summary" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "experience", label: "Experience" },
  { id: "certifications", label: "Certifications" },
  { id: "review", label: "Review" },
];

export const experienceTypes = [
  ["paid", "Paid work"],
  ["unpaid", "Unpaid work"],
  ["internship", "Internship"],
  ["field", "Field experience"],
];

export const atsRules = [
  "The resume must fit on one page. Do not start a second page. Shorten wording before you drop a section that has facts.",
  "Use one font for the whole document: Calibri, Arial, or Times New Roman. Start at 11 point. If the page overflows, use 10.5 point, and do not go below 10 point.",
  "Single spacing, one column, and tight space between sections. No tables, text boxes, headers, footers, icons, or graphics.",
  "Put contact information on the line under the name: city, state, phone, and email, separated by vertical bars. Add a LinkedIn URL only when one was provided.",
  "Section order: summary, skills, education, experience, certifications. Most recent education and experience first. Omit a section only when the student record has nothing for it.",
  "There is no Projects section. Lab work belongs under Education.",
  "Write bullets. Start each bullet with an action verb. Use present tense for a current role and past tense for a past role.",
  "Tailor wording to the pasted job description. Use a keyword from the posting only when the student record supports it.",
  "Spell out an acronym the first time, then use the short form. Example: programmable logic controller (PLC).",
  "Leave out photographs, graphics, and keywords hidden in white text.",
  "Do not use I, me, or my. Do not list references or the line “references available upon request.”",
  "Stay truthful. If the student did not supply a date, metric, tool, course, or job, leave it out.",
];

export const amtPositioning = [
  "This brief is for one target role: the job described below.",
  "Open with the technical summary described in the student record: one short paragraph, four sentences at most, not an objective. Name the manufacturing or automation work the student is training for and the hands-on training they actually have. Earlier work, if any, is one supporting sentence at the end.",
  "Use the headings Technical Summary, Technical Skills, Education, Experience, and Certifications.",
  "Technical skills are grouped. Print a group only when the student checked or typed skills in it. Do not add a skill they left unchecked.",
  "Put coursework and lab work inside Education. On the coursework line, name only a few technical courses from the program list that match the job. Do not list the whole program.",
  "Do not name general education: English, math, speech, psychology, economics, or a student-success course.",
  "Lab bullets come only from the student's education notes. Do not invent lab tasks, tools, or results.",
  "When a past job is not technical, keep it and write bullets about process, systems, coordination, documentation, or problem-solving. Keep business-ownership language from crowding out the technical path.",
  "Group certifications by issuer on one line per issuer, with the names separated by a middot. Do not add a certification the student left unchecked.",
];

export const summarySkeleton =
  "[Technical role] with hands-on training in [specific tool], [specific tool], [specific tool], and [specific tool]. Completed a Technical Diploma in Electromechanical Maintenance Technician and currently pursuing an Associate of Applied Science in Advanced Manufacturing Technology at Gateway Technical College. Incoming [employer] [title] ([month and year]). Brings [quantity] of [transferable skill] from [earlier context] applied now to [technical field].";

export const summaryEditRules = [
  "Edit the student's technical-summary draft so it follows the skeleton. When the draft is blank, write the paragraph from the answers in this record and from the credential sentence, which is already known. Do not invent an employer, a date, a year, or a tool to finish the skeleton. Do not include a GPA.",
  "The skeleton is a pattern, not a sample resume. Do not copy an employer, grade, title, date, or tool from memory. Replace every bracket with a fact from this student, or delete that whole sentence. Do not print a bracket, and do not print the skeleton itself.",
  "Sentence 1 names the technical role as a noun phrase, then the words \"with hands-on training in,\" then four to six specific tools or systems the student named or checked. Use the brand or method they supplied. Do not open with a category label alone. Do not write seeking, objective, or looking for.",
  "Sentence 2 is credentials, and it is already known for this program. Write that they completed a Technical Diploma in Electromechanical Maintenance Technician and are currently pursuing an Associate of Applied Science in Advanced Manufacturing Technology at Gateway Technical College. Use the words Completed and currently pursuing. Do not include a GPA. Do not include how long the diploma took. If the draft mentions a GPA, leave the GPA out.",
  "Sentence 3 is a role the student has already secured. Include it only when they named an employer, a title, and a time. Use the shape Incoming [employer] [title] ([when]). Do not turn the job they are applying to into an incoming role. Do not write that they are looking, hoping, or available. Delete this sentence when nothing in the record supports it.",
  "Sentence 4 is earlier work, and it is one sentence at the end. Include it only when the student described that work. Lead with a quantity they supplied, name the skill they said they are bringing, name the earlier context briefly, and close with the words applied now to and the technical field they named. This sentence supports the technical opening. It does not lead the paragraph, and it does not retell the earlier career. Delete it when nothing in the record supports it.",
  "Keep every fact the draft already states, unless it uses I, me, or my, it mentions a GPA, or it adds a claim the rest of the record contradicts. You may reorder the facts into the four sentences, fix grammar, cut filler, and tighten wording. You may not upgrade a claim.",
  "Four sentences at most. When all four are earned, keep the paragraph near 70 to 85 words so it stays short on a one-page resume. When you delete a sentence, do not replace it with filler.",
  "When the pasted job description and the student's tools overlap, prefer those overlapping tools in sentence 1. Do not add a keyword from the posting that the student did not claim.",
];

export const emtSummarySkeleton =
  "[Technical role] with hands-on training in [specific tool], [specific tool], and [specific tool]. Currently pursuing a Technical Diploma in Electromechanical Maintenance Technician at Gateway Technical College. Incoming [employer] [title] ([month and year]). Brings [quantity] of [transferable skill] from [earlier context] applied now to [technical field].";

export const emtSummaryEditRules = [
  "Edit the student's technical-summary draft so it follows the skeleton. When the draft is blank, write the paragraph from the answers in this record and from the credential sentence, which is already known. Do not invent an employer, a date, a year, or a tool to finish the skeleton. Do not include a GPA.",
  "The skeleton is a pattern, not a sample resume. Do not copy an employer, grade, title, date, or tool from memory. Replace every bracket with a fact from this student, or delete that whole sentence. Do not print a bracket, and do not print the skeleton itself.",
  "Sentence 1 names the technical role as a noun phrase, then the words \"with hands-on training in,\" then three to five specific tools or systems the student named or checked. Use the brand or method they supplied. Do not open with a category label alone. Do not write seeking, objective, or looking for.",
  "Sentence 2 is the credential, and it is already known. The student is an active student in this diploma. Write that they are currently pursuing a Technical Diploma in Electromechanical Maintenance Technician at Gateway Technical College. Do not describe the diploma as completed. Do not add another program, degree, or school. Do not include a GPA. Do not include how long the diploma takes. If the draft mentions a GPA, leave the GPA out.",
  "Sentence 3 is a role the student has already secured. Include it only when they named an employer, a title, and a time. Use the shape Incoming [employer] [title] ([when]). Do not turn the job they are applying to into an incoming role. Do not write that they are looking, hoping, or available. Delete this sentence when nothing in the record supports it.",
  "Sentence 4 is earlier work, and it is one sentence at the end. Include it only when the student described that work. Lead with a quantity they supplied, name the skill they said they are bringing, name the earlier context briefly, and close with the words applied now to and the technical field they named. This sentence supports the technical opening. It does not lead the paragraph, and it does not retell the earlier career. Delete it when nothing in the record supports it.",
  "Keep every fact the draft already states, unless it uses I, me, or my, it mentions a GPA, it describes this diploma as completed, it adds another program, or it adds a claim the rest of the record contradicts. You may reorder the facts into the four sentences, fix grammar, cut filler, and tighten wording. You may not upgrade a claim.",
  "Four sentences at most. When all four are earned, keep the paragraph near 60 to 80 words so it stays short on a one-page resume. When you delete a sentence, do not replace it with filler.",
  "When the pasted job description and the student's tools overlap, prefer those overlapping tools in sentence 1. Do not add a keyword from the posting that the student did not claim.",
];

export const emtPositioning = [
  "This brief is for one target role: the job described below.",
  "The student is an active student in the Electromechanical Maintenance Technician technical diploma. Open with the technical summary described in the student record: one short paragraph, four sentences at most, not an objective. Name the maintenance work they are training for and the hands-on training they actually have. Earlier work, if any, is one supporting sentence at the end.",
  "Use the headings Technical Summary, Technical Skills, Education, Experience, and Certifications.",
  "Technical skills are grouped. Print a group only when the student checked or typed skills in it. Do not add a skill they left unchecked. Do not add a tool that is not in this diploma unless the student typed it.",
  "Put coursework and lab work inside Education. On the coursework line, name only a few technical courses from this diploma that match the job. Do not list the whole program.",
  "Do not name the student-success course or any general-education course.",
  "Do not add another program or degree. This resume is for the technical diploma only.",
  "Lab bullets come only from the student's education notes. Do not invent lab tasks, tools, or results.",
  "When a past job is not technical, keep it and write bullets about process, systems, coordination, documentation, or problem-solving. Keep business-ownership language from crowding out the technical path.",
  "Print a certification only when the student typed it. This diploma does not add certifications on its own.",
];

export const amtSkillCatalog = [
  {
    id: "automation",
    label: "Automation & Controls",
    skills: [
      { id: "allen-bradley-plc", name: "Allen-Bradley PLC (Ladder Logic)" },
      { id: "hmi-programming", name: "HMI Programming" },
      { id: "motor-controls", name: "Motor Controls" },
      { id: "industrial-control-systems", name: "Industrial Control Systems" },
      { id: "rockwell-studio-5000", name: "Rockwell Studio 5000 / RSLogix" },
      { id: "factorytalk-view", name: "FactoryTalk View Studio" },
    ],
  },
  {
    id: "robotics",
    label: "Robotics",
    skills: [
      { id: "fanuc-programming", name: "FANUC Robot Programming (hands-on)" },
      { id: "end-effector", name: "End-Effector Routines" },
      { id: "robot-cell", name: "Robot Cell Integration" },
      { id: "intro-robots", name: "Intro to Industrial Robots" },
    ],
  },
  {
    id: "electrical",
    label: "Electrical & Mechanical",
    skills: [
      { id: "pneumatics-hydraulics", name: "Pneumatics & Hydraulics" },
      { id: "mechatronics", name: "Mechatronics" },
      { id: "motor-wiring", name: "Motor Control Wiring & Commissioning" },
      { id: "machining", name: "Machining" },
      { id: "precision-measurement", name: "Precision Measurement" },
    ],
  },
  {
    id: "emerging",
    label: "AI, Software, & Emerging",
    skills: [
      { id: "solidworks", name: "SolidWorks CAD" },
      { id: "iiot", name: "Industrial IoT" },
      { id: "vision-sensors", name: "Vision & Smart Sensors" },
      { id: "schematics", name: "Schematic Interpretation" },
    ],
  },
];

export const amtSkillGroups = amtSkillCatalog.map((group) => group.label);

export const emtSkillCatalog = [
  {
    id: "mechanical",
    label: "Mechanical",
    skills: [
      { id: "emt-mechanical-skills", name: "Mechanical Skills" },
      { id: "emt-machining", name: "Machining" },
      { id: "emt-precision-measurement", name: "Precision Measurement" },
    ],
  },
  {
    id: "fluid",
    label: "Fluid Power & Mechatronics",
    skills: [
      { id: "emt-pneumatics", name: "Pneumatics & Hydraulics" },
      { id: "emt-mechatronics", name: "Mechatronics" },
    ],
  },
  {
    id: "controls",
    label: "Controls",
    skills: [
      { id: "emt-industrial-controls", name: "Industrial Control Systems" },
      { id: "emt-motor-controls", name: "Motor Controls" },
      { id: "emt-plc-hmi", name: "PLC & HMI Programming" },
    ],
  },
  {
    id: "robotics",
    label: "Robotics",
    skills: [{ id: "emt-robots", name: "Intro to Industrial Robots" }],
  },
];

export const amtCertCatalog = [
  {
    id: "saca",
    issuer: "SACA",
    certs: [
      { id: "saca-c101", name: "C-101 Certified Industry 4.0 Associate — Basic Operations" },
      { id: "saca-c102", name: "C-102 Certified Industry 4.0 Associate — Advanced Operations" },
      { id: "saca-c209", name: "C-209 Pneumatic Systems 1" },
      { id: "saca-c255", name: "C-255 Hydraulic Systems 1" },
    ],
  },
  {
    id: "nc3",
    issuer: "NC3",
    certs: [
      { id: "nc3-pmi", name: "PMI 1–6 Precision Measurement" },
      { id: "nc3-525", name: "525 Multimeter Certification" },
    ],
  },
  {
    id: "gateway",
    issuer: "Gateway Technical College",
    certs: [
      { id: "osha-10", name: "OSHA 10" },
      { id: "snapon-hand", name: "Snap-on Hand Tool Safety" },
      { id: "snapon-meter", name: "Snap-on Multimeter" },
      { id: "starrett", name: "Starrett Precision Measurement" },
    ],
  },
];

export const emtCredential = {
  school: "Gateway Technical College",
  credential: "Technical Diploma",
  program: "Electromechanical Maintenance Technician",
  city: "Sturtevant",
  state: "WI",
};

export function canonicalGroupLabel(label, catalog = amtSkillCatalog) {
  const text = String(label ?? "").trim();
  const match = catalog.find((group) => group.label.toLowerCase() === text.toLowerCase());
  return match ? match.label : text || "Other";
}

export function matchCatalogSkill(groupLabel, skillName, catalog = amtSkillCatalog) {
  const name = String(skillName ?? "").trim().toLowerCase();
  if (!name) return null;
  const wanted = String(groupLabel ?? "").trim().toLowerCase();
  const groups = wanted
    ? catalog.filter((group) => group.label.toLowerCase() === wanted)
    : catalog;
  for (const group of groups) {
    const skill = group.skills.find((item) => item.name.toLowerCase() === name);
    if (skill) return skill;
  }
  return null;
}

function tidyList(value) {
  return String(value ?? "").trim();
}

export function assembleSkillGroups(state, catalog) {
  const selected = state.selectedSkills || {};
  const buckets = new Map();

  function push(label, skillName) {
    const name = tidyList(skillName);
    if (!name) return;
    const groupLabel = canonicalGroupLabel(label, catalog);
    if (!buckets.has(groupLabel)) buckets.set(groupLabel, []);
    const list = buckets.get(groupLabel);
    if (list.some((item) => item.toLowerCase() === name.toLowerCase())) return;
    list.push(name);
  }

  for (const group of catalog) {
    for (const skill of group.skills) {
      if (selected[skill.id]) push(group.label, skill.name);
    }
  }
  for (const skill of state.customSkills || []) push(skill.group, skill.name);
  for (const group of state.skillGroups || []) {
    for (const part of String(group.skills || "").split(",")) push(group.label, part);
  }

  const ordered = [];
  for (const group of catalog) {
    if (buckets.has(group.label)) ordered.push(group.label);
  }
  for (const label of buckets.keys()) {
    if (!ordered.includes(label)) ordered.push(label);
  }
  return ordered.map((label) => ({ label, skills: buckets.get(label).join(", ") }));
}

export function assembleAmtSkillGroups(state) {
  return assembleSkillGroups(state, amtSkillCatalog);
}

export function assembleEmtSkillGroups(state) {
  return assembleSkillGroups(state, emtSkillCatalog);
}

export const amtProgram = {
  school: "Gateway Technical College",
  credential: "Associate of Applied Science",
  programName: "Advanced Manufacturing Technology",
  programCode: "10-664-2",
  city: "Sturtevant",
  state: "WI",
  description:
    "Advanced Manufacturing Technology combines mechanical, electronic, and information technology. Technicians in this program study mechanical and electrical principles and the use of data to improve a manufacturing process through automation.",
  outcomes: [
    "Apply state and national safety rules in a manufacturing systems environment.",
    "Analyze automation within a complex manufacturing system.",
    "Manage advanced manufacturing systems for operational efficiency and cost control.",
    "Analyze technical specifications for manufacturing systems, modules, and components.",
    "Explore a proportional-integral-derivative (PID) control system to reach a desired manufacturing outcome.",
    "Integrate industrial control systems into manufacturing processes.",
    "Apply electronic principles to devices in a complex manufacturing system.",
  ],
  terms: [
    {
      term: 1,
      courses: [
        ["890-155", "Gateway to Success"],
        ["628-109", "Mechanical Skills for Technicians"],
        ["612-102", "Intro to Pneumatics & Hydraulics"],
        ["664-100", "Intro to Industrial Control Systems"],
        ["664-105", "Intro to Industrial Robots"],
        ["664-110", "Intro to Mechatronics"],
        ["664-116", "Intro to Mfg Quality Control Systems"],
      ],
    },
    {
      term: 2,
      courses: [
        ["620-108", "Fundamentals of Industrial Controls"],
        ["664-103", "Motor Controls for Manufacturing"],
        ["664-104", "Industrial Control System Applications"],
        ["664-112", "Fundamentals of Machining Processes"],
        ["664-118", "PLC & HMI Programming"],
        ["804-134", "Mathematical Reasoning"],
      ],
    },
    {
      term: 3,
      courses: [
        ["664-120", "Intro to Industrial Internet of Things (IIoT)"],
        ["801-136", "English Composition 1"],
        ["809-195", "Economics"],
      ],
    },
    {
      term: 4,
      courses: [
        ["606-128", "CAD – SolidWorks"],
        ["664-119", "Advanced Manufacturing Network Systems"],
        ["664-121", "Vision and Smart Sensors"],
        ["664-123", "Advanced Industrial Robotics"],
        ["809-198", "Introduction to Psychology"],
      ],
    },
    {
      term: 5,
      courses: [
        ["664-113", "Leadership for Advanced Manufacturing"],
        ["664-115", "Interpreting Engineering Drawings"],
        ["664-117", "Materials and Processes"],
        ["664-124", "Integrated Systems Capstone"],
        ["801-198", "Speech"],
      ],
    },
  ],
};

const courseIndex = new Map();
for (const term of amtProgram.terms) {
  for (const [code, title] of term.courses) {
    courseIndex.set(code, { code, title, term: term.term });
  }
}

const genEdCodes = new Set(["890-155", "804-134", "801-136", "809-195", "809-198", "801-198"]);

export function technicalCourses() {
  const courses = [];
  for (const term of amtProgram.terms) {
    for (const [code, title] of term.courses) {
      if (!genEdCodes.has(code)) courses.push({ code, title, term: term.term });
    }
  }
  return courses;
}

export const emtProgram = {
  school: "Gateway Technical College",
  credential: "Technical Diploma",
  programName: "Electromechanical Maintenance Technician",
  programCode: "31-620-3",
  city: "Sturtevant",
  state: "WI",
  description:
    "Electromechanical maintenance technicians assemble, install, troubleshoot, repair, and modify machinery. This technical diploma trains students on hydraulic and pneumatic systems, motors and motor controls, mechanical drives, programmable logic controllers (PLCs), human-machine interfaces (HMIs), and robotic systems, plus manual machining, precision measurement, and industrial safety.",
  outcomes: [
    "Perform work safely.",
    "Apply a basic troubleshooting process for electrical and mechanical systems and devices.",
    "Repair basic electrical and mechanical systems.",
    "Communicate technical information.",
  ],
  terms: [
    {
      term: 1,
      courses: [
        ["890-155", "Gateway to Success"],
        ["612-102", "Intro to Pneumatics & Hydraulics"],
        ["628-109", "Mechanical Skills for Technicians"],
        ["664-100", "Intro to Industrial Control Systems"],
        ["664-105", "Intro to Industrial Robots"],
        ["664-110", "Intro to Mechatronics"],
        ["664-116", "Intro to Mfg Quality Control Systems"],
      ],
    },
    {
      term: 2,
      courses: [
        ["620-108", "Fundamentals of Industrial Controls"],
        ["664-103", "Motor Controls for Manufacturing"],
        ["664-104", "Industrial Control System Applications"],
        ["664-112", "Fundamentals of Machining Processes"],
        ["664-118", "PLC & HMI Programming"],
      ],
    },
  ],
};

const emtGenEdCodes = new Set(["890-155"]);

export function emtTechnicalCourses() {
  const courses = [];
  for (const term of emtProgram.terms) {
    for (const [code, title] of term.courses) {
      if (!emtGenEdCodes.has(code)) courses.push({ code, title, term: term.term });
    }
  }
  return courses;
}

export function courseByCode(code) {
  return courseIndex.get(code) || null;
}

export function labelFor(pairs, id) {
  return pairs.find(([value]) => value === id)?.[1] || id;
}
