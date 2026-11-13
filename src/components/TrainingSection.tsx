import { useState } from 'react';
import type { MatchSettings, Question } from '../types';
import { pickQuestions } from '../utils/matchQuestions';
import { competitionQuestions, correctAnswer, courseName, courses } from '../utils/competition';
import { sound } from '../utils/sound';
import { AnswerField, Diagram } from './CompetitionControls';

const difficulties = { mixed: 'Karışık', kolay: 'Kolay', orta: 'Orta', zor: 'Zor' } as const;
const panel = 'rounded-3xl border border-white/10 bg-[#171f42] p-5 sm:p-6';
const field = 'block w-full mt-2 rounded-xl border border-white/15 bg-[#0e1530] px-3 py-3 text-white';
const primary = 'rounded-xl bg-violet-300 px-5 py-3 text-sm font-extrabold text-[#1a1231] hover:bg-violet-200';
const secondary = 'rounded-xl border border-white/15 px-5 py-3 text-sm font-bold text-white hover:bg-white/10';

interface Round {
  grade: string;
  courseLabel: string;
  questions: Question[];
  answers: { value: string; correct: boolean }[];
}

export function TrainingSection({ onComplete }: { onComplete: (grade: string, correct: number, total: number, courseLabel?: string) => void }) {
  const [grade, setGrade] = useState('5');
  const [course, setCourse] = useState<MatchSettings['course']>('mathematics');
  const [format, setFormat] = useState<MatchSettings['format']>('multiple');
  const [difficulty, setDifficulty] = useState<keyof typeof difficulties>('mixed');
  const [round, setRound] = useState<Round | null>(null);
  const [answer, setAnswer] = useState('');
  const question = round?.questions[round.answers.length];

  const startRound = () => {
    sound.playClick();
    let questions: Question[];
    if (course === 'mathematics' && format === 'open' && difficulty !== 'mixed') {
      questions = pickQuestions(grade, difficulty, 10);
    } else if (course === 'mathematics' && format === 'open') {
      questions = pickQuestions(grade, 'mixed', 10);
    } else {
      questions = competitionQuestions(grade, 10, { course, format, seconds: 0 });
      if (difficulty !== 'mixed') {
        const filtered = questions.filter(q => q.difficulty === difficulty);
        if (filtered.length >= 5) questions = filtered;
      }
    }
    setRound({
      grade,
      courseLabel: courseName(course, grade),
      questions,
      answers: [],
    });
    setAnswer('');
  };

  const recordAnswer = (value: string) => {
    if (!round || !question) return;
    const ok = Boolean(value) && correctAnswer(question, value);
    if (ok) sound.playSuccess();
    else sound.playError();
    const answers = [...round.answers, { value, correct: ok }];
    setRound({ ...round, answers });
    setAnswer('');
    if (answers.length === round.questions.length) {
      onComplete(round.grade, answers.filter(item => item.correct).length, answers.length, round.courseLabel);
    }
  };

  return (
    <section className="mx-auto max-w-3xl space-y-4" aria-label="Beceri temelli antrenman">
      <div className={panel}>
        <h2 className="text-2xl font-black sm:text-3xl">Beceri Temelli Antrenman</h2>
        <p className="mt-2 text-sm text-slate-300">Sınıf listesi oluşturmadan tüm derslerde 10 soruluk antrenman çöz. Tur sonunda çözümleri incele.</p>
      </div>

      {!round && (
        <form className={panel + ' space-y-4'} onSubmit={event => {
          event.preventDefault();
          startRound();
        }}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold">Sınıf düzeyi
              <select className={field} value={grade} onChange={event => setGrade(event.target.value)}>
                {[5, 6, 7, 8].map(value => <option key={value} value={value}>{value}. sınıf</option>)}
              </select>
            </label>
            <label className="text-sm font-bold">Ders
              <select className={field} value={course} onChange={event => {
                const next = event.target.value as MatchSettings['course'];
                setCourse(next);
                if (next !== 'mathematics') setFormat('multiple');
              }}>
                {(['all', ...courses] as const).map(id => <option key={id} value={id}>{courseName(id, grade)}</option>)}
              </select>
            </label>
            <label className="text-sm font-bold">Soru biçimi
              <select className={field} value={format} onChange={event => setFormat(event.target.value as MatchSettings['format'])}>
                <option value="multiple">Çoktan seçmeli</option>
                <option value="open">Açık uçlu</option>
              </select>
            </label>
            <label className="text-sm font-bold">Zorluk
              <select className={field} value={difficulty} onChange={event => setDifficulty(event.target.value as keyof typeof difficulties)}>
                {Object.entries(difficulties).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
          </div>
          <button className={primary} type="submit">Antrenmanı Başlat</button>
        </form>
      )}

      {round && question && (
        <form className={panel + ' space-y-4'} onSubmit={event => {
          event.preventDefault();
          if (answer.trim()) recordAnswer(answer.trim());
        }}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-extrabold" aria-live="polite">Soru {round.answers.length + 1} / {round.questions.length}</h3>
            <span className="rounded-full bg-violet-300/15 px-3 py-1 text-xs font-bold text-violet-200">{difficulties[question.difficulty]}</span>
          </div>
          <progress className="h-2 w-full accent-violet-300" value={round.answers.length} max={round.questions.length} aria-label="Tamamlanan soru sayısı" />
          <p className="text-sm text-teal-200">
            {question.course ? courseName(question.course, question.grade) + ' · ' : ''}{question.outcomeCode ? question.outcomeCode + ' · ' : ''}{question.subject}
          </p>
          <p className="rounded-xl bg-[#101732] p-4 text-lg font-semibold leading-relaxed">{question.q}</p>
          <Diagram figure={question.figure} />
          <AnswerField label="Cevabın" value={answer} onChange={setAnswer} options={question.options} />
          <div className="flex flex-wrap gap-2">
            <button className={primary + ' disabled:opacity-50'} type="submit" disabled={!answer.trim()}>Cevabı Kaydet</button>
            <button className={secondary} type="button" onClick={() => recordAnswer('')}>Soruyu Geç</button>
            <button className={secondary + ' ml-auto'} type="button" onClick={() => setRound(null)}>Turu Bitir</button>
          </div>
        </form>
      )}

      {round && !question && (
        <div className={panel + ' space-y-4'}>
          <h3 className="text-xl font-extrabold" role="status">Tur Tamamlandı · {round.courseLabel}</h3>
          <dl className="grid grid-cols-3 gap-2">
            {[
              ['Doğru', round.answers.filter(item => item.correct).length],
              ['Yanlış', round.answers.filter(item => item.value && !item.correct).length],
              ['Boş', round.answers.filter(item => !item.value).length],
            ].map(([label, count]) => (
              <div key={label} className="rounded-xl bg-[#101732] p-3">
                <dt className="text-xs text-slate-300">{label}</dt>
                <dd className="text-2xl font-black">{count}</dd>
              </div>
            ))}
          </dl>
          <h4 className="font-bold">Cevaplarını İncele</h4>
          {round.questions.map((item, index) => {
            const result = round.answers[index];
            return (
              <details className="border-t border-white/10 pt-3" key={index}>
                <summary className="cursor-pointer text-sm font-bold">
                  {index + 1}. Soru · {item.subject.split(' • ')[0]} · {result.correct ? 'Doğru' : result.value ? 'Yanlış' : 'Boş'}
                </summary>
                <div className="mt-3 space-y-2 text-sm leading-relaxed text-slate-200">
                  <p>{item.q}</p>
                  <p>Cevabın <strong>{result.value || '—'}</strong></p>
                  <p>Doğru cevap <strong>{item.a.replace(/^(\d+)\.(\d+)$/, '$1,$2')}</strong></p>
                  {item.explanation && <p>{item.explanation}</p>}
                  {item.sourceUrl && <a className="text-cyan-300 underline" href={item.sourceUrl} target="_blank" rel="noopener noreferrer">Uyarlama kaynağı · {item.source} ↗</a>}
                </div>
              </details>
            );
          })}
          <button type="button" className={primary} onClick={() => setRound(null)}>Yeni Tur Seç</button>
        </div>
      )}
    </section>
  );
}
