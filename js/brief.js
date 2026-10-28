import {
  amtCertCatalog,
  amtPositioning,
  amtProgram,
  assembleAmtSkillGroups,
  assembleEmtSkillGroups,
  atsRules,
  emtPositioning,
  emtProgram,
  emtSummaryEditRules,
  emtSummarySkeleton,
  emtTechnicalCourses,
  labelFor,
  experienceTypes,
  summaryEditRules,
  summarySkeleton,
  technicalCourses,
} from "./data.js";

function clean(value) {
  return String(value ?? "").replace(/\r\n/g, "\n").trim();
}

function plain(value) {
  return clean(value).replace(/```/g, "'''").replace(/\n/g, " ");
}

function quote(text) {
  const body = clean(text).replace(/```/g, "'''");
  if (!body) return "> (none)";
  return body
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n");
}

function filled(entry, keys) {
  return keys.some((key) => clean(entry[key]));
}

function credentialFilled(entry) {
  return ["school", "credential", "program", "notes"].some((key) => clean(entry?.[key]));
}

export function collectRecord(state) {
  const experience = state.experience
    .filter(
      (entry) =>
        entry.current ||
        filled(entry, ["title", "organization", "city", "state", "start", "end", "notes"])
    )
    .map((entry) => ({
      ...entry,
      typeLabel: labelFor(experienceTypes, entry.type),
    }));

  const skillGroups =
    state.track === "amt"
      ? assembleAmtSkillGroups(state)
      : state.track === "emt"
        ? assembleEmtSkillGroups(state)
        : (state.skillGroups || [])
            .map((group) => ({ label: clean(group.label), skills: clean(group.skills) }))
            .filter((group) => group.skills);

  const certs = collectCerts(state);

  const earlier = state.education?.earlier || {};
  return {
    track: state.track,
    contact: state.contact,
    job: state.job,
    summary: state.summary || { focus: "", tools: "", mustInclude: "" },
    education: state.education,
    earlier: credentialFilled(earlier) ? earlier : null,
    technicalCourses:
      state.track === "amt" ? technicalCourses() : state.track === "emt" ? emtTechnicalCourses() : [],
    experience,
    pullLinkedIn: Boolean(state.pullLinkedIn),
    linkedInPaste: clean(state.linkedInPaste),
    skillGroups,
    certs,
  };
}

function collectCerts(state) {
  const groups = [];

  function add(issuer, name) {
    const trimmedName = clean(name);
    if (!trimmedName) return;
    const label = clean(issuer);
    const key = label.toLowerCase();
    let group = groups.find((item) => item.key === key);
    if (!group) {
      group = { key, issuer: label, names: [] };
      groups.push(group);
    } else if (!group.issuer && label) {
      group.issuer = label;
    }
    if (group.names.some((item) => item.toLowerCase() === trimmedName.toLowerCase())) return;
    group.names.push(trimmedName);
  }

  if (state.track === "amt") {
    for (const catalog of amtCertCatalog) {
      for (const cert of catalog.certs) {
        if (state.embeddedCerts?.[cert.id]) add(catalog.issuer, cert.name);
      }
    }
  }
  for (const cert of state.extraCerts || []) add(cert.issuer, cert.name);
  return groups.map(({ issuer, names }) => ({ issuer, names }));
}

function line(label, value) {
  const text = plain(value);
  return `- ${label}: ${text || "not provided"}`;
}

function generalSummaryNotes(summary) {
  return `### Technical summary notes
The assistant writes this paragraph. Use these notes when they are present, and otherwise use only education, skills, experience, and the job.
${line("Work the summary should point at", summary.focus)}
${line("Tools or training that must be named", summary.tools)}
${line("A fact that must appear", summary.mustInclude)}`;
}

function amtSummaryNotes(summary) {
  return `### Technical summary
Edit the student's draft into the technical summary on the resume. Follow every rule below. The student's draft and the answers are the facts. The skeleton is only the shape.

${summaryEditRules.map((rule) => `- ${rule}`).join("\n")}

Skeleton:
${quote(summarySkeleton)}

The credential sentence is already known. Use it in the summary and do not ask the student for it. Do not add a GPA.
Completed a Technical Diploma in Electromechanical Maintenance Technician and currently pursuing an Associate of Applied Science in Advanced Manufacturing Technology at Gateway Technical College.

Answers for the rest of that paragraph. "not provided" means the student left the line blank. Do not fill a blank from general knowledge.
${line("Technical role to open with", summary.focus)}
${line("Tools or systems the first sentence must name", summary.tools)}
${line("Role already secured", summary.nextRole)}
${line("Earlier work worth one sentence", summary.prior)}
${line("A fact that must appear", summary.mustInclude)}

Student's draft. Edit this. Do not drop a fact it already states:
${quote(summary.draft)}`;
}

function emtSummaryNotes(summary) {
  return `### Technical summary
Edit the student's draft into the technical summary on the resume. Follow every rule below. The student's draft and the answers are the facts. The skeleton is only the shape.

${emtSummaryEditRules.map((rule) => `- ${rule}`).join("\n")}

Skeleton:
${quote(emtSummarySkeleton)}

The credential sentence is already known. The student is currently in this diploma. Use it in the summary and do not ask the student for it. Do not add a GPA. Do not add another program.
Currently pursuing a Technical Diploma in Electromechanical Maintenance Technician at Gateway Technical College.

Answers for the rest of that paragraph. "not provided" means the student left the line blank. Do not fill a blank from general knowledge.
${line("Technical role to open with", summary.focus)}
${line("Tools or systems the first sentence must name", summary.tools)}
${line("Role already secured", summary.nextRole)}
${line("Earlier work worth one sentence", summary.prior)}
${line("A fact that must appear", summary.mustInclude)}

Student's draft. Edit this. Do not drop a fact it already states:
${quote(summary.draft)}`;
}

function htmlSkeleton() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Resume</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 10.5pt;
      line-height: 1.25;
      color: #1a1a1a;
      background: #e8e8e8;
    }
    .page-wrap {
      background: #fff;
      width: 8.5in;
      min-height: 11in;
      margin: 0.4in auto;
      padding: 0.45in 0.55in;
    }
    header { border-bottom: 2px solid #1a3a5c; padding-bottom: 6px; margin-bottom: 8px; }
    h1 { font-size: 22pt; font-weight: 700; letter-spacing: 0.04em; color: #1a3a5c; line-height: 1; }
    .contact-line { margin-top: 4px; font-size: 10pt; color: #333; }
    h2 {
      font-size: 11pt;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #1a3a5c;
      border-bottom: 1px solid #c8d4e0;
      margin: 12px 0 4px;
      padding-bottom: 2px;
    }
    .entry { margin-bottom: 8px; }
    .entry-header { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
    .entry-title { font-weight: 700; }
    .entry-sub { font-style: italic; }
    .entry-date { white-space: nowrap; color: #333; }
    ul { margin: 2px 0 0 1.15em; }
    li { margin-bottom: 2px; }
    p { margin-bottom: 2px; }
    @media print {
      body { background: #fff; }
      .page-wrap { width: auto; min-height: 0; margin: 0; padding: 0; box-shadow: none; }
      @page { size: letter; margin: 0.55in; }
    }
  </style>
</head>
<body>
<div class="page-wrap">
  <header>
    <h1></h1>
    <div class="contact-line"></div>
  </header>

  <!-- Technical tracks: heading is Technical Summary. General track: Summary. Two or three lines. Omit on the general track only when it would be filler. -->
  <section>
    <h2>Technical Summary</h2>
    <p></p>
  </section>

  <!-- Omit when the student selected or typed no skills. One paragraph per group: a bold label, then the tools. No columns and no bars. Technical-track heading: Technical Skills. -->
  <section>
    <h2>Technical Skills</h2>
    <p><strong></strong> </p>
  </section>

  <section>
    <h2>Education</h2>
    <!-- Duplicate .entry for each school, most recent first. Delete an entry you do not fill. -->
    <div class="entry">
      <div class="entry-header">
        <span class="entry-title"></span>
        <span class="entry-date"></span>
      </div>
      <div class="entry-sub"></div>
      <ul>
        <li></li>
      </ul>
    </div>
  </section>

  <!-- Omit this section when the student has no work history. -->
  <section>
    <h2>Experience</h2>
    <div class="entry">
      <div class="entry-header">
        <span class="entry-title"></span>
        <span class="entry-date"></span>
      </div>
      <div class="entry-sub"></div>
      <ul>
        <li></li>
      </ul>
    </div>
  </section>

  <!-- Omit this section when the student listed no certifications. One line per issuer. -->
  <section>
    <h2>Certifications</h2>
    <p></p>
  </section>
</div>
</body>
</html>`;
}

function experienceBlock(entry) {
  const place = [entry.city, entry.state].map(plain).filter(Boolean).join(", ");
  const dates = entry.current
    ? [plain(entry.start), "Present"].filter(Boolean).join(" – ")
    : [plain(entry.start), plain(entry.end)].filter(Boolean).join(" – ");
  return [
    `- ${entry.typeLabel}: ${plain(entry.title) || "(title not provided)"}`,
    `  Organization: ${plain(entry.organization) || "not provided"}`,
    `  Location: ${place || "not provided"}`,
    `  Dates: ${dates || "not provided"}`,
    `  Notes:`,
    quote(entry.notes),
  ].join("\n");
}

function trackLine(track) {
  if (track === "amt") {
    return `${amtProgram.programName}, ${amtProgram.school}. Do not print a catalog number on the resume.`;
  }
  if (track === "emt") {
    return `${emtProgram.programName}, ${emtProgram.school}. The student is currently pursuing this technical diploma. Do not print a catalog number on the resume. Do not add another program.`;
  }
  return "Any program. Follow the applicant tracking rules.";
}

export function buildBrief(state) {
  const record = collectRecord(state);
  const amt = record.track === "amt";
  const emt = record.track === "emt";
  const parts = [];

  parts.push(`# Resume brief

You are a career-services resume writer. Draft a resume for one job from the student record below. The resume may contain only facts from that record. When a fact is missing, leave it out.

## Standards for this resume

Track: ${trackLine(record.track)}

### Applicant tracking rules
${atsRules.map((rule) => `- ${rule}`).join("\n")}`);

  if (amt) {
    parts.push(`### How to position this student
${amtPositioning.map((rule) => `- ${rule}`).join("\n")}

### Program context
This explains the program. It is not a list of personal accomplishments. Do not copy an outcome onto the resume unless the student's notes show that work. When you do, describe it as training.

${amtProgram.description}

Program learning outcomes:
${amtProgram.outcomes.map((outcome) => `- ${outcome}`).join("\n")}

Technical courses in the program. General education is already removed from this list. Use a few titles that match the job on one coursework line. Do not print this whole list.
${technicalCourses().map((course) => `- ${course.title}`).join("\n")}`);
  }

  if (emt) {
    parts.push(`### How to position this student
${emtPositioning.map((rule) => `- ${rule}`).join("\n")}

### Program context
This explains the technical diploma. It is not a list of personal accomplishments. Do not copy an outcome onto the resume unless the student's notes show that work. When you do, describe it as training. Do not add another program.

${emtProgram.description}

Program learning outcomes:
${emtProgram.outcomes.map((outcome) => `- ${outcome}`).join("\n")}

Technical courses in the diploma. The student-success course is already removed from this list. Use a few titles that match the job on one coursework line. Do not print this whole list.
${emtTechnicalCourses().map((course) => `- ${course.title}`).join("\n")}`);
  }

  const contact = record.contact;
  const education = record.education;
  const place = [education.city, education.state].map(clean).filter(Boolean).join(", ");

  const earlier = record.earlier;
  const earlierPlace = earlier
    ? [earlier.city, earlier.state].map(clean).filter(Boolean).join(", ")
    : "";
  const earlierBlock = earlier
    ? `
Earlier credential, listed after the current program:
${line("School", earlier.school)}
${line("Credential", earlier.credential)}
${line("Program", earlier.program)}
${line("City and state", earlierPlace)}
${line("Graduation", earlier.gradDate)}
Notes:
${quote(earlier.notes)}`
    : "\nNo earlier credential provided.";

  const experienceLines = record.experience.length
    ? record.experience.map(experienceBlock)
    : ["No jobs typed."];

  let linkedInBlock;
  if (record.linkedInPaste) {
    linkedInBlock = `The student pasted raw LinkedIn descriptions. Turn them into experience entries. Do not add an employer, date, or duty that is not in this paste or in a typed job. When a typed job and the paste describe the same role, keep the typed job and use the paste only to fill a gap.
${quote(record.linkedInPaste)}`;
  } else if (record.pullLinkedIn) {
    linkedInBlock =
      "The student asked to use LinkedIn and did not paste descriptions. If you can read the LinkedIn URL on the contact line, use only Experience from that profile. If you cannot open it, stop and ask them to paste the descriptions. Do not invent roles.";
  } else {
    linkedInBlock = "Do not pull jobs from LinkedIn. The URL is only a contact line.";
  }
  if (!record.experience.length && !record.linkedInPaste && !record.pullLinkedIn) {
    linkedInBlock +=
      "\nNo work history was provided. Omit the Experience section. Do not create employers, titles, or dates.";
  }

  const skillLines = record.skillGroups.length
    ? record.skillGroups.map((group) => `- ${plain(group.label)}: ${plain(group.skills)}`)
    : [
        "No skills provided. Omit the skills section. Do not add tools from the program description, the skill list, or the job posting.",
      ];

  const certLines = record.certs.length
    ? record.certs.map((group) =>
        group.issuer
          ? `- ${plain(group.issuer)}: ${group.names.map(plain).join(" • ")}`
          : `- ${group.names.map(plain).join(" • ")}`
      )
    : [
        "No certifications provided. Omit the certifications section. Do not add program certifications the student left unchecked.",
      ];

  const summary = record.summary || {};
  const summaryNotes = amt
    ? amtSummaryNotes(summary)
    : emt
      ? emtSummaryNotes(summary)
      : generalSummaryNotes(summary);

  parts.push(`## Student record

### Contact
${line("Name", contact.name)}
${line("City", contact.city)}
${line("State", contact.state)}
${line("Phone", contact.phone)}
${line("Email", contact.email)}
${line("LinkedIn", contact.linkedin)}

### Target job
${line("Title", record.job.title)}
${line("Company", record.job.company)}
${line("Posting URL", record.job.url)}
The posting URL is for the student's files. Write from the pasted description, not from guessing what the page says.

${summaryNotes}

### Education
${line("School", education.school)}
${line("Credential", education.credential)}
${line("Program", education.program)}
${line("City and state", place)}
${line("Graduation", education.gradDate)}
Coursework and lab notes (this is the only source for lab bullets):
${quote(education.notes)}
${emt ? "\nProgram status: the student is currently pursuing this technical diploma. Print a graduation date only when one is written above. Do not describe the diploma as completed, and do not add another program.\n" : ""}${earlierBlock}

### Experience
${experienceLines.join("\n\n")}

LinkedIn:
${linkedInBlock}

### Skills
${skillLines.join("\n")}

### Certifications
${certLines.join("\n")}`);

  parts.push(`## Job description
${clean(record.job.description) ? quote(record.job.description) : "> No description was pasted. Ask the student to paste the posting before you write a resume."}`);

  parts.push(`## Drafts to return

Return both drafts in one reply. Put the Word draft first, as normal text, not inside a code block. Then put the HTML document in one fenced code block tagged html. After the drafts, add two short sentences telling the student to proofread names, dates, and job claims before applying.

### Word draft
Plain text the student can paste into Word.

- The finished resume is one page. If it runs long, cut words, then tighten spacing. Do not add a second page.
- Name on its own line.
- Next line: city, state, phone, email, and LinkedIn if provided, separated by vertical bars.
- Section labels on their own lines, in this order: summary, skills, education, experience, certifications. Drop a section the student record says to omit. Do not add a Projects section.
- ${
    emt
      ? "On this track the headings are TECHNICAL SUMMARY, TECHNICAL SKILLS, EDUCATION, EXPERIENCE, and CERTIFICATIONS. Always include the technical summary. Edit it with the technical-summary rules in the student record. Do not replace it with an objective. The student is currently pursuing the technical diploma. Do not describe it as completed, and do not add another program."
      : amt
        ? "On this track the headings are TECHNICAL SUMMARY, TECHNICAL SKILLS, EDUCATION, EXPERIENCE, and CERTIFICATIONS. Always include the technical summary. Edit it with the technical-summary rules in the student record. Do not replace it with an objective."
        : "On this track, use SUMMARY and SKILLS. Include a summary only when it states a specific credential, skill, or goal from the record. Do not write a vague objective."
  }
- Each school and job is a heading line with the date at the end of that same line, then a line for the credential or role, then left-aligned bullets. Coursework is one bullet. Lab notes become further bullets under that school. Do not use a table, text box, header, footer, or column.
- Certifications are one line per issuer, with the names separated by a middot.
- Assume Calibri. Say the point size you used in the note under the drafts.
- Bullets come from the student's notes or the LinkedIn paste. Do not add accomplishments that are not written there.

### HTML draft
Fill the skeleton below. Keep its CSS. Put the student's name in the h1 and the title element. Follow the same section order and the same omit rules as the Word draft. The printed page must be one page. If it overflows, shorten the sentences before you change the CSS.

Keep a single column. Do not add images, icons, skill bars, extra colors, a projects section, or a second column. Empty sections and the HTML comments must not remain in the finished file. Duplicate an entry block for each real school or job.

\`\`\`html
${htmlSkeleton()}
\`\`\``);

  return `${parts.join("\n\n")}\n`;
}

export function briefFilename(state) {
  const slug = clean(state.contact.name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return `resume-brief-${slug || "student"}.md`;
}
