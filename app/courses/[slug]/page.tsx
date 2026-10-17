import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseLessons, type LessonView } from "@/components/CourseLessons";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RevealObserver, Words } from "@/components/Reveal";
import { renderMarkdown } from "@/lib/markdown";
import { contactEmail } from "@/content/site";
import { levelLabel } from "@/modules/books/labels";
import { kindLabel } from "@/modules/courses/labels";
import { getPublishedCourse } from "@/modules/courses/queries";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = await getPublishedCourse((await params).slug).catch(() => null);
  return course ? { title: course.title, description: course.summary } : {};
}

// hero white · lessons green · footer white
const n = (i: number) => ({ "--i": i }) as React.CSSProperties;

export default async function CoursePage({ params }: Props) {
  const course = await getPublishedCourse((await params).slug);
  if (!course) notFound();

  // Lesson text is rendered here, on the server, through the safe Markdown renderer.
  const lessons: LessonView[] = course.lessons.map((l) => ({
    id: l.id,
    title: l.title,
    summary: l.summary,
    minutes: l.estimatedMinutes,
    html: l.body ? renderMarkdown(l.body) : null,
    questions: l.questions,
    task: l.task,
    book: l.book && { slug: l.book.slug, title: l.book.title, author: l.book.author, year: l.book.year, coverUrl: l.book.coverUrl, free: l.book.downloads },
  }));
  const meta = [
    levelLabel(course.level),
    `${lessons.length} ${lessons.length === 1 ? "aula" : "aulas"}`,
    course.durationWeeks ? `${course.durationWeeks} ${course.durationWeeks === 1 ? "semana" : "semanas"}` : null,
    course.workloadHours ? `cerca de ${course.workloadHours} h de estudo` : null,
    course.issuesCertificate && course.workloadHours ? "Emite certificado" : null,
    course.front?.name ?? null,
  ].filter(Boolean) as string[];

  return (
    <>
      <a className="skip" href="#content">
        Pular para o conteúdo
      </a>
      <Header />
      <RevealObserver />

      <main id="content">
        <section className="page-hero" data-reveal>
          <div className="wrap">
            <Link className="article-back rise" href="/courses">
              ← Todos os cursos
            </Link>
            <p className="kicker rise" style={n(1)}>
              {kindLabel(course.kind)}
            </p>
            <h1>
              <Words text={course.title} />
            </h1>
            <p className="lede rise" style={n(6)}>
              {course.summary}
            </p>
            <ul className="course-meta rise" style={n(7)}>
              {meta.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
            {course.description && <div className="prose course-intro rise" style={n(8)} dangerouslySetInnerHTML={{ __html: renderMarkdown(course.description) }} />}
          </div>
        </section>

        <section className="section green wipe-l">
          <div className="wrap">
            <div className="section-head" data-reveal>
              <p className="kicker rise">{course.kind === "TRACK" ? "A trilha" : "As aulas"}</p>
              <h2>
                <Words text={course.kind === "TRACK" ? "Passo a passo, semana a semana." : "Aula por aula."} />
              </h2>
            </div>
            {lessons.length === 0 ? (
              <p className="section-sub">As aulas deste curso ainda estão sendo preparadas.</p>
            ) : (
              <div data-reveal>
                <CourseLessons slug={course.slug} lessons={lessons} certificate={course.issuesCertificate && course.workloadHours ? { hours: course.workloadHours, email: contactEmail } : null} />
              </div>
            )}
            <div className="course-group-cta" data-reveal>
              <p className="rise">
                <b>Estude em grupo.</b> Uma trilha rende mais com gente para debater. Abra um diretório na sua universidade e façam juntos.
              </p>
              <Link className="btn btn-yellow rise" style={n(2)} href="/chapters">
                Abrir um diretório <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
