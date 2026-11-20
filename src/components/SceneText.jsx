import React from 'react'

function Lines({ lines, className = 'body-line' }) {
  return (lines || []).map((line, i) => (
    <p key={i} className={className}>
      {line}
    </p>
  ))
}

function StudyList({ studies, lang }) {
  return (
    <ul className="plain-list study-list">
      {studies.map((study, i) => (
        <li key={i}>
          <span className="study-period">{study.period}</span>
          <span className="study-title">{study.title[lang]}</span>
          <span className="study-detail">{study.detail[lang]}</span>
        </li>
      ))}
    </ul>
  )
}

function ProjectList({ projects, more, lang }) {
  return (
    <>
      <ul className="plain-list project-list">
        {projects.map((project, i) => (
          <li key={i}>
            <span className="project-title">{project.title}</span>
            <span className="project-year">{project.year}</span>
            <span className="project-links">
              {project.links.map((link) => (
                <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.label} ↗
                </a>
              ))}
            </span>
          </li>
        ))}
      </ul>
      <p className="more-line">{more[lang]}</p>
    </>
  )
}

export default function SceneText({ section, lang, transitioning }) {
  const hidden = transitioning ? 'is-hidden' : ''

  return (
    <section
      className={`scene-text ${section.layout} ${hidden}`}
      aria-label={section.name[lang]}
      aria-live="polite"
    >
      {section.layout === 'vertical' ? (
        <>
          <div className="text-block text-top">
            <span className="eyebrow">PORTFOLIO // 2026</span>
            <Lines lines={section.top[lang]} className="display-line" />
          </div>
          <div className="text-block text-bottom">
            <Lines lines={section.bottom[lang]} className="soft-line" />
          </div>
        </>
      ) : (
        <>
          <div className="text-block text-left">
            <span className="eyebrow">{section.left.label[lang]}</span>
            <Lines lines={section.left.lines?.[lang]} />
            {section.left.link && (
              <a
                className="standalone-link"
                href={section.left.link.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {section.left.link.label[lang]}
              </a>
            )}
          </div>
          <div className="text-block text-right">
            <span className="eyebrow">{section.right.label[lang]}</span>
            <Lines lines={section.right.lines?.[lang]} />
            {section.right.studies && <StudyList studies={section.right.studies} lang={lang} />}
            {section.right.projects && (
              <ProjectList
                projects={section.right.projects}
                more={section.right.more}
                lang={lang}
              />
            )}
          </div>
        </>
      )}
    </section>
  )
}
