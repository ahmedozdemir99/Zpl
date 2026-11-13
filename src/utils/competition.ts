import { skillQuestions } from './skillQuestions';
import type { Course, MatchSettings, Question } from '../types';
import { reviewedQuestions } from './tymmBank';
import { mathOutcomeQuestions } from './mathOutcomes';
import { courseBank } from './courseBank';
import { isCorrectAnswer, pickQuestions, shuffle } from './matchQuestions';
import { allQuestions } from './questionsData';

export const courses = ['turkish', 'mathematics', 'science', 'social', 'religion', 'english'] as const;
export const times = [0, 30, 60, 90, 120] as const;
const names = { all: 'Tüm Dersler', turkish: 'Türkçe', mathematics: 'Matematik', science: 'Fen Bilimleri',
  social: 'Sosyal Bilgiler', religion: 'Din Kültürü ve Ahlak Bilgisi', english: 'İngilizce' };
export const courseName = (course: MatchSettings['course'], grade: string | number = 8) =>
  course === 'social' && Number(grade) === 8 ? 'T.C. İnkılap Tarihi ve Atatürkçülük' : names[course];
export const defaults: MatchSettings = { course: 'mathematics', format: 'open', seconds: 0 };
export function validSettings(value: unknown): value is MatchSettings {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as MatchSettings;
  return (candidate.course === 'all' || courses.includes(candidate.course)) &&
    ['open', 'multiple'].includes(candidate.format) && times.some(seconds => seconds === candidate.seconds) &&
    (candidate.outcomeCode === undefined || (candidate.course !== 'all' && typeof candidate.outcomeCode === 'string' && candidate.outcomeCode.length <= 30));
}
const reviewedMath = allQuestions.flatMap(q => {
  if (q.outcomeCode) return [];
  const grade = Number(q.grade);
  const label = q.subject.toLocaleLowerCase('tr');
  let outcomeCode: string | undefined;
  if (grade === 5 && /doğal sayı|zaman|işlem stratejisi|bütçe|ulaşım/.test(label)) outcomeCode = 'MAT.5.1.2';
  if (grade === 5 && /çevre/.test(label)) outcomeCode = 'MAT.5.4.1';
  if (grade === 5 && /alan/.test(label)) outcomeCode = 'MAT.5.4.2';
  if (grade === 6 && /ondalık|yakıt|bütçe|alışveriş/.test(label)) outcomeCode = 'MAT.6.1.7';
  if (grade === 6 && /ortak kat/.test(label)) outcomeCode = 'MAT.6.1.4';
  if (grade === 7 && /rasyonel|tam sayı/.test(label)) outcomeCode = 'MAT.7.1.4';
  if (grade === 7 && /yüzde/.test(label)) outcomeCode = 'MAT.7.1.6';
  if (grade === 8 && q.category === 'adaptation') {
    if (/ortak kat|ebob/.test(label)) outcomeCode = 'M.8.1.1.2';
    if (/olasılık/.test(label)) outcomeCode = 'M.8.5.1.5';
    if (/eşitsizlik/.test(label)) outcomeCode = 'M.8.2.3.1';
    if (/çarpanlara/.test(label)) outcomeCode = 'M.8.2.1.3';
    if (/üslü/.test(label)) outcomeCode = 'M.8.1.2.2';
  }
  if (grade === 8 && /pisagor/.test(label)) outcomeCode = 'M.8.3.1.5';
  if (!outcomeCode) return [];
  const labels: Record<string, string> = {
    'M.8.5.1.5': 'Basit olayların olasılığını hesaplama',
    'M.8.2.3.1': 'Gerçek hayat durumlarını eşitsizlikle ifade etme',
    'M.8.2.1.3': 'Cebirsel ifadeleri çarpanlarına ayırma',
    'M.8.1.2.2': 'Üslü ifadelerde eşdeğer gösterimler',
  };
  const outcome = labels[outcomeCode] ?? [...mathOutcomeQuestions, ...skillQuestions]
    .find(question => question.outcomeCode === outcomeCode)?.outcome ?? q.subject;
  return [{ ...q, course: 'mathematics' as const, outcomeCode, outcome }];
});
export const competitionBank = [
  ...skillQuestions, ...mathOutcomeQuestions, ...courseBank, ...reviewedQuestions, ...reviewedMath,
];
export const poolFor = (grade: string | number, course: Course) => [...new Map(competitionBank
  .filter(q => Number(q.grade) === Number(grade) && q.course === course)
  .map(q => [q.q + JSON.stringify(q.figure ?? null), q])).values()];
export function outcomesFor(grade: string | number, course: Course) {
  return [...new Map(poolFor(grade, course).flatMap(q => q.outcomeCode && q.outcome ? [[q.outcomeCode, q.outcome] as const] : [])).entries()];
}

export function answerOptions(q: Question): string[] | undefined {
  if (q.distractors?.length === 3) return shuffle([q.a, ...q.distractors]);
  const fraction = /^(-?\d+)\s*\/\s*([1-9]\d*)$/.exec(q.a);
  if (fraction && Number(fraction[1]) !== 0) {
    const n = Number(fraction[1]), d = Number(fraction[2]);
    const candidates = [`${n}/${d + 1}`, `${n + 1}/${d + 2}`, `${n}/${d + 2}`, `${Math.max(1, n - 1)}/${d + 1}`];
    const unique = [...new Set(candidates)].filter(c => c !== q.a).slice(0, 3);
    if (unique.length === 3) return shuffle([q.a, ...unique]);
  }
  if (/^-?\d+(?:[.,]\d+)?$/.test(q.a)) {
    const number = Number(q.a.replace(',', '.')), precision = q.a.split(/[.,]/)[1]?.length ?? 0;
    const baseStep = 10 ** -precision;
    const mag = Math.abs(number);
    const step = precision === 0 && mag >= 100 ? Math.max(5, Math.round(mag * 0.08))
      : precision === 0 && mag >= 20 ? 2
      : baseStep;
    const offsets = number - step >= 0 || number < 0
      ? [-step, step, 2 * step, -2 * step, 3 * step]
      : [step, 2 * step, 3 * step, 4 * step];
    const out: string[] = [];
    const seen = new Set<string>([q.a]);
    for (const off of offsets) {
      const val = (number + off).toFixed(precision).replace('.', ',');
      if (!seen.has(val)) {
        seen.add(val);
        out.push(val);
        if (out.length === 3) break;
      }
    }
    if (out.length === 3) return shuffle([q.a, ...out]);
  }
  if (q.a === 'Satürn') return shuffle([q.a, 'Jüpiter', 'Uranüs', 'Neptün']);
}
export function correctAnswer(q: Question, value: string) {
  if (!value.trim() || (q.options && !q.options.includes(value.trim()))) return false;
  const clean = (answer: string) => answer.trim().replace(/[.!?]$/, '');
  const fraction = (text: string) => /^([+−-]?\d+)\s*\/\s*([1-9]\d*)$/.exec(clean(text));
  return [q.a, ...(q.alternatives ?? [])].some(answer => {
    if (q.course === 'english') return clean(value).toLowerCase() === clean(answer).toLowerCase();
    if (isCorrectAnswer(clean(value), clean(answer))) return true;
    const given = fraction(value), expected = fraction(answer);
    return Boolean(given && expected &&
      BigInt(given[1].replace('−', '-')) * BigInt(expected[2]) === BigInt(expected[1].replace('−', '-')) * BigInt(given[2]));
  });
}
export function competitionQuestions(grade: string, count: 5 | 10, settings: MatchSettings) {
  function choose(course: Course, size: number) {
    const pool = poolFor(grade, course).flatMap(question => {
      if (settings.outcomeCode && question.outcomeCode !== settings.outcomeCode) return [];
      if (settings.format === 'open') return [question];
      const options = answerOptions(question);
      return options?.length === 4 ? [{ ...question, options }] : [];
    });
    const primary = shuffle(pool.filter(q => q.skillBased || q.category === 'adaptation'));
    const secondary = shuffle(pool.filter(q => !primary.includes(q)));
    if (settings.outcomeCode || course !== 'mathematics') {
      const ordered = [...primary, ...secondary];
      if (size <= 2) return ordered.slice(0, size);
      return pickQuestions(grade, 'mixed', size === 10 ? 10 : 5, ordered);
    }
    const figure = shuffle(pool.filter(q => q.figure))[0];
    if (size === 1 && figure) return [figure];
    if (size === 2) return figure ? [figure, ...[...primary, ...secondary].filter(q => !q.figure).slice(0, size - 1)] : [...primary, ...secondary].slice(0, size);
    const selected = pickQuestions(grade, 'mixed', size === 10 ? 10 : 5, pool);
    if (figure && !selected.some(q => q.figure)) {
      const replace = selected.findIndex(q => q.category !== 'adaptation' && q.difficulty === figure.difficulty);
      if (replace >= 0) selected[replace] = figure;
      else if (selected.length < size) selected.push(figure);
      else selected[selected.length - 1] = figure;
    }
    const reasoning = primary.find(q => q.skillBased);
    if (reasoning && !selected.includes(reasoning)) {
      const replace = selected.findIndex(q => !q.figure && q.category !== 'adaptation');
      if (replace >= 0) selected[replace] = reasoning;
      else if (selected.length < size) selected.push(reasoning);
    }
    const used = new Set(selected);
    const fill = shuffle(pool.filter(q => !used.has(q) && (!q.figure || !selected.some(item => item.figure))));
    return [...selected, ...fill.slice(0, size - selected.length)];
  }
  return settings.course === 'all'
    ? shuffle(courses.flatMap(course => choose(course, count === 10 ? 2 : 1)))
    : choose(settings.course, count);
}
