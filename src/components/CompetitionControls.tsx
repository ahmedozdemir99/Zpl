import { useEffect, useRef, useState } from 'react';
import type { Figure, MatchSettings } from '../types';
import { courseName, courses, outcomesFor, times } from '../utils/competition';

export function CompetitionSettings({ settings, onChange, grade }: {
  settings: MatchSettings; onChange: (settings: MatchSettings) => void; grade: string | number;
}) {
  const outcomes = settings.course === 'all' ? [] : outcomesFor(grade, settings.course);
  return <div className="grid w-full gap-3 sm:grid-cols-3">
    <label className="league-field">Ders<select value={settings.course} onChange={e => onChange({ ...settings, course: e.target.value as MatchSettings['course'], outcomeCode: undefined })}>
      {(['all', ...courses] as const).map(course => <option key={course} value={course}>{courseName(course, grade)}</option>)}
    </select></label>
    {outcomes.length > 0 && <label className="league-field">Kazanım
      <select value={settings.outcomeCode ?? ''} onChange={e => onChange({ ...settings, outcomeCode: e.target.value || undefined })}>
        <option value="">Tüm kazanımlar</option>
        {outcomes.map(([code, name]) => <option value={code} key={code}>{code} · {name}</option>)}
      </select>
    </label>}
    <label className="league-field">Soru biçimi<select value={settings.format} onChange={e => onChange({ ...settings, format: e.target.value as MatchSettings['format'] })}>
      <option value="open">Açık uçlu</option><option value="multiple">Çoktan seçmeli</option>
    </select></label>
    <label className="league-field">Soru başına süre<select value={settings.seconds} onChange={e => onChange({ ...settings, seconds: Number(e.target.value) })}>
      {times.map(seconds => <option key={seconds} value={seconds}>{seconds ? seconds + ' saniye' : 'Süresiz'}</option>)}
    </select></label>
  </div>;
}

export function AnswerField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (value: string) => void; options?: string[];
}) {
  if (!options) return <label className="league-field">{label}<input value={value} onChange={e => onChange(e.target.value)} maxLength={160} autoComplete="off" /></label>;
  return <fieldset className="min-w-0"><legend className="mb-2 text-sm font-bold">{label}</legend>
    <div className="grid gap-2 sm:grid-cols-2">{options.map((option, i) => <button type="button" key={option} aria-pressed={value === option}
      className={`min-h-11 rounded-xl border p-2 text-left text-sm ${value === option ? 'border-sky-200 bg-sky-200/20' : 'border-white/15 bg-black/20'}`}
      onClick={() => onChange(option)}><b className="mr-2 text-sky-200">{'ABCD'[i]}</b>{option}</button>)}</div>
  </fieldset>;
}

export function Timer({ deadline }: { deadline?: number }) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    if (deadline === undefined) return;
    const timer = window.setInterval(() => setNow(Date.now()), 200);
    return () => window.clearInterval(timer);
  }, [deadline]);
  if (deadline === undefined) return null;
  const seconds = Math.max(0, Math.ceil((deadline - Math.max(Date.now(), now)) / 1000));
  return <p role="timer" aria-label="Kalan soru süresi" className="font-bold tabular-nums text-sky-200">{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</p>;
}

export function Diagram({ figure }: { figure?: Figure }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvas.current?.getContext('2d');
    if (!c || !figure) return;
    c.clearRect(0, 0, 640, 300);
    c.save();
    c.scale(2, 2);
    c.strokeStyle = '#173253';
    c.fillStyle = '#173253';
    c.lineWidth = 2;
    c.font = 'bold 12px sans-serif';

    if (figure.kind === 'bars') {
      const count = figure.values.length;
      const maxVal = Math.max(...figure.values, 1);
      const max = Math.ceil(maxVal / 5) * 5 || 5;
      const labels = figure.labels ?? ['Pzt', 'Sal', 'Çar', 'Per'];
      if (figure.title) {
        c.font = 'bold 11px sans-serif';
        c.fillText(figure.title, 35, 13);
      }
      const baseTop = figure.title ? 24 : 18;
      const baseBottom = 122;
      c.beginPath(); c.moveTo(35, baseTop); c.lineTo(35, baseBottom); c.lineTo(302, baseBottom); c.stroke();
      const slot = 250 / Math.max(count, 1);
      const barW = Math.min(34, slot * 0.55);
      figure.values.forEach((value, i) => {
        const x = 44 + slot * i + (slot - barW) / 2;
        const height = (baseBottom - baseTop - 8) * value / max;
        c.fillStyle = i % 2 === 0 ? '#2e719e' : '#3d86b8';
        c.fillRect(x, baseBottom - 1 - height, barW, height);
        c.fillStyle = '#173253';
        c.font = 'bold 11px sans-serif';
        c.fillText(String(value), x + 2, baseBottom - 6 - height);
        c.fillText((labels[i] ?? '').slice(0, 8), x - 2, 138);
      });
    } else if (figure.kind === 'rectSplit') {
      const unit = figure.unit ?? 'cm';
      const scale = Math.min(180 / figure.width, 82 / figure.height);
      const w = scale * figure.width, h = scale * figure.height;
      const x = 72, y = 24;
      const cw = scale * Math.min(figure.cutWidth, figure.width);
      const ch = figure.cutHeight ? scale * Math.min(figure.cutHeight, figure.height) : h;
      c.fillStyle = '#d7ecf9';
      c.fillRect(x, y, w, h);
      c.fillStyle = '#8ecae6';
      c.fillRect(x, y, cw, ch);
      c.strokeRect(x, y, w, h);
      c.beginPath();
      if (figure.cutHeight && figure.cutHeight < figure.height) {
        c.moveTo(x, y + ch); c.lineTo(x + cw, y + ch); c.lineTo(x + cw, y);
      } else {
        c.moveTo(x + cw, y); c.lineTo(x + cw, y + h);
      }
      c.stroke();
      c.fillStyle = '#173253';
      c.font = 'bold 11px sans-serif';
      c.fillText(`${figure.width} ${unit}`, x + w / 2 - 16, y + h + 16);
      c.fillText(`${figure.height} ${unit}`, 10, y + h / 2 + 4);
      if (figure.labels?.[0]) c.fillText(figure.labels[0], x + 6, y + Math.min(ch, h) / 2 + 4);
      if (figure.labels?.[1]) c.fillText(figure.labels[1], x + cw + 6, y + h / 2 + 4);
    } else if (figure.kind === 'table') {
      const cols = figure.headers.length;
      const totalRows = figure.rows.length + 1;
      const startX = 12, startY = figure.title ? 24 : 12;
      const tableW = 296;
      const colW = tableW / Math.max(cols, 1);
      const rowH = Math.min(26, Math.floor((142 - startY) / Math.max(totalRows, 1)));
      if (figure.title) {
        c.font = 'bold 11px sans-serif';
        c.fillText(figure.title, startX, 14);
      }
      c.fillStyle = '#cfe5f5';
      c.fillRect(startX, startY, tableW, rowH);
      c.strokeStyle = '#173253';
      c.lineWidth = 1.2;
      c.strokeRect(startX, startY, tableW, rowH * totalRows);
      for (let i = 1; i < cols; i++) {
        c.beginPath();
        c.moveTo(startX + i * colW, startY);
        c.lineTo(startX + i * colW, startY + rowH * totalRows);
        c.stroke();
      }
      for (let r = 1; r < totalRows; r++) {
        c.beginPath();
        c.moveTo(startX, startY + r * rowH);
        c.lineTo(startX + tableW, startY + r * rowH);
        c.stroke();
      }
      c.fillStyle = '#173253';
      c.font = 'bold 10px sans-serif';
      figure.headers.forEach((h, i) => c.fillText(h.slice(0, 18), startX + i * colW + 5, startY + rowH / 2 + 3));
      c.font = '600 10px sans-serif';
      figure.rows.forEach((row, rIdx) => {
        row.forEach((cell, cIdx) => {
          c.fillText(cell.slice(0, 18), startX + cIdx * colW + 5, startY + (rIdx + 1) * rowH + rowH / 2 + 3);
        });
      });
    } else {
      const scale = Math.min(170 / figure.width, 80 / figure.height);
      const w = scale * figure.width, h = scale * figure.height, x = 74, y = 112;
      c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - h);
      if (figure.kind === 'rectangle') c.lineTo(x + w, y - h);
      c.lineTo(x + w, y); c.closePath(); c.stroke();
      if (figure.kind === 'triangle') {
        c.strokeRect(x, y - 10, 10, 10);
        c.fillText('?', x + w / 2 + 5, y - h / 2 - 8);
      }
      if (figure.diagonal) { c.beginPath(); c.moveTo(x, y); c.lineTo(x + w, y - h); c.stroke(); }
      c.fillText(figure.hideWidth ? '?' : figure.width + ' cm', x + w / 2 - 16, y + 19);
      c.fillText(figure.height + ' cm', 12, y - h / 2);
    }
    c.restore();
  }, [figure]);
  if (!figure) return null;
  const description = figure.kind === 'bars'
    ? `${figure.title ?? 'Sütun grafiği'}: ${(figure.labels ?? ['Pzt', 'Sal', 'Çar', 'Per']).map((l, i) => `${l} ${figure.values[i] ?? ''}`).join(', ')}.`
    : figure.kind === 'rectSplit'
    ? `Bölünmüş dikdörtgen modeli: dış kenarlar ${figure.width} ve ${figure.height}, ayrılan kısım ${figure.cutWidth}${figure.cutHeight ? ' × ' + figure.cutHeight : ''}.`
    : figure.kind === 'table'
    ? `${figure.title ?? 'Veri tablosu'}: ${figure.headers.join(', ')}.`
    : `${figure.kind === 'triangle' ? 'Dik üçgen, hipotenüs bilinmiyor' : 'Dikdörtgen'}. Yatay kenar ${figure.hideWidth ? 'bilinmiyor' : figure.width + ' cm'}, düşey kenar ${figure.height} cm.`;
  return <canvas ref={canvas} width={640} height={300} role="img" aria-label={description}
    className="w-full max-w-sm rounded-xl bg-sky-50">{description}</canvas>;
}
