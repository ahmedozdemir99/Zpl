import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/sound';

interface WeeklyChallenge {
  id: string;
  badge: string;
  title: string;
  intro: string;
  clues: string[];
  question: string;
  options: { key: string; label: string }[];
  answer: string;
  successText: string;
  hintText: string;
}

const SOLVED_KEY = 'zekaProLigim_weekly_solved_2026';

const challenges: WeeklyChallenge[] = [
  {
    id: 'w1-boxes',
    badge: '1. HAFTA · MANTIK',
    title: 'Üç Kutu Mantık Problemi',
    intro: 'Üç kutunun üzerinde A, B, C yazıyor. Kutulardan yalnızca bir tanesinde büyük ödül var.',
    clues: [
      'A Kutusunun üstünde: “Ödül B’de.”',
      'B Kutusunun üstünde: “Ödül bu kutuda değil.”',
      'C Kutusunun üstünde: “Ödül A’da değil.”',
    ],
    question: 'Bu üç cümleden YALNIZCA BİRİ DOĞRU ise ödül hangi kutudadır?',
    options: [
      { key: 'A', label: 'A Kutusu' },
      { key: 'B', label: 'B Kutusu' },
      { key: 'C', label: 'C Kutusu' },
    ],
    answer: 'A',
    successText: 'MÜKEMMEL! Ödül A Kutusunda! Sadece B kutusundaki ifade ("Ödül bu kutuda değil") DOĞRUDUR. A ve C kutularının üzerindeki ifadeler YANLIŞTIR; böylece tam olarak 1 cümle doğru kalır.',
    hintText: 'Ödül B veya C kutusunda olsaydı 2 cümle birden doğru olurdu! Üç durumu tek tek kontrol edin.',
  },
  {
    id: 'w2-lock',
    badge: '2. HAFTA · SAYISAL ÇIKARIM',
    title: 'Üç Haneli Şifreli Kilit',
    intro: 'Bir okul dolabının 3 haneli şifresi için aşağıdaki ipuçları veriliyor:',
    clues: [
      '6 – 8 – 2 : Rakamlardan biri doğru ve yeri doğru.',
      '6 – 1 – 4 : Rakamlardan biri doğru ama yeri yanlış.',
      '2 – 0 – 6 : Rakamlardan ikisi doğru ama ikisinin de yeri yanlış.',
      '7 – 3 – 8 : Hiçbir rakam doğru değil.',
      '7 – 8 – 0 : Rakamlardan biri doğru ama yeri yanlış.',
    ],
    question: 'Bu kurallara göre dolabın 3 haneli şifresi nedir?',
    options: [
      { key: '042', label: '042' },
      { key: '062', label: '062' },
      { key: '240', label: '240' },
      { key: '402', label: '402' },
    ],
    answer: '042',
    successText: 'HARİKA! Şifre 042! (7, 3, 8 elenir → 6-8-2’den 2 sondadır → 2-0-6 ve 7-8-0’dan 0 baştadır → 6-1-4’ten ortadaki rakam 4’tür.)',
    hintText: 'Önce "7-3-8" ipucuyla elenen rakamları belirle, ardından 0 ve 2’nin yerlerini karşılaştır.',
  },
  {
    id: 'w3-race',
    badge: '3. HAFTA · SIRALAMA',
    title: 'Zekâ Turnuvası Sıralaması',
    intro: 'Dört öğrenci (Deniz, Ece, Mert, Sude) aynı gün yapılan zekâ yarışmasında ilk dört sırayı paylaşmıştır:',
    clues: [
      'Deniz, Mert’in hemen önünde bitirmiştir.',
      'Ece ne birinci ne de sonuncu olmuştur.',
      'Sude yarışmayı Ece’nin hemen önünde bitirmiştir.',
    ],
    question: 'Bu bilgilere göre yarışmayı 3. sırada kim bitirmiştir?',
    options: [
      { key: 'Sude', label: 'Sude' },
      { key: 'Ece', label: 'Ece' },
      { key: 'Deniz', label: 'Deniz' },
      { key: 'Mert', label: 'Mert' },
    ],
    answer: 'Deniz',
    successText: 'DOĞRU! Ece 2. veya 3. olabilir. Sude-Ece (2., 3.) olsaydı 1. ve 4. sıralar ardışık kalmazdı ve Deniz Mert’in hemen önünde olamazdı. Bu yüzden sıralama 1. Sude, 2. Ece, 3. Deniz, 4. Mert şeklindedir!',
    hintText: 'Ece’nin 2. ve 3. olma durumlarını dene; hangisinde Deniz ile Mert için art arda iki boş yer kalıyor?',
  },
  {
    id: 'w4-scale',
    badge: '4. HAFTA · CEBİRSEL DÜŞÜNME',
    title: 'İki Terazi Dengesi',
    intro: 'Özdeş üçgen ve kare ağırlıklar iki ayrı eşit kollu terazide tartılıyor:',
    clues: [
      '1. Terazi: 2 üçgen + 1 kare = 14 kg',
      '2. Terazi: 1 üçgen + 2 kare = 16 kg',
    ],
    question: 'Buna göre 1 kare ağırlık kaç kilogramdır?',
    options: [
      { key: '4', label: '4 kg' },
      { key: '5', label: '5 kg' },
      { key: '6', label: '6 kg' },
      { key: '8', label: '8 kg' },
    ],
    answer: '6',
    successText: 'SÜPER! İki denge toplandığında 3 üçgen + 3 kare = 30 kg, yani 1 üçgen + 1 kare = 10 kg bulunur. İkinci teraziden 1 kare = 16 − 10 = 6 kg çıkar!',
    hintText: 'İki terazideki ağırlıkları taraf tarafa toplayarak önce 1 üçgen + 1 kare toplamını bulmayı dene.',
  },
];

interface WeeklySectionProps {
  onSolveWeekly?: (challengeId: string, title: string) => void;
}

export const WeeklySection: React.FC<WeeklySectionProps> = ({ onSolveWeekly }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState<string>(challenges[0].options[0].key);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'no'; text: string } | null>(null);
  const [solvedIds, setSolvedIds] = useState<string[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(SOLVED_KEY) || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const current = challenges[activeIndex];
  const isSolved = solvedIds.includes(current.id);

  const selectChallenge = (index: number) => {
    sound.playClick();
    setActiveIndex(index);
    setSelected(challenges[index].options[0].key);
    setFeedback(null);
  };

  const checkWeekly = () => {
    sound.playClick();
    if (selected === current.answer) {
      sound.playSuccess();
      const firstTime = !solvedIds.includes(current.id);
      if (firstTime) {
        const next = [...solvedIds, current.id];
        setSolvedIds(next);
        try {
          localStorage.setItem(SOLVED_KEY, JSON.stringify(next));
        } catch {}
        onSolveWeekly?.(current.id, current.title);
      }
      setFeedback({
        type: 'ok',
        text: `🎉 ${current.successText}${firstTime ? ' (+50 Puan)' : ''}`,
      });
    } else {
      sound.playError();
      setFeedback({
        type: 'no',
        text: `❌ Yanlış Cevap. ${current.hintText}`,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-gradient-to-r from-[#1a2450] to-[#121938] border border-white/10 p-5 shadow-xl space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="px-3 py-1 rounded-full bg-yellow-500/15 text-yellow-300 font-extrabold text-xs border border-yellow-500/30">
            ⭐ HAFTANIN MEYDAN OKUMASI
          </span>
          <span className="text-xs font-bold text-emerald-300">
            {solvedIds.length} / {challenges.length} Tamamlandı
          </span>
        </div>
        <h2 className="text-2xl font-black text-white">{current.title}</h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          Tek soru. Birden fazla düşünme yolu. Amaç yalnızca cevabı bulmak değil, mantıksal nedenini izah etmektir.
        </p>
      </div>

      {/* Challenge Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {challenges.map((ch, idx) => {
          const done = solvedIds.includes(ch.id);
          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => selectChallenge(idx)}
              className={`rounded-2xl border p-3 text-left text-xs transition-all ${
                activeIndex === idx
                  ? 'border-purple-400 bg-purple-600/25 text-white'
                  : 'border-white/10 bg-[#171f42] text-slate-300 hover:border-white/25'
              }`}
            >
              <div className="flex items-center justify-between gap-1 font-extrabold text-[10px] text-amber-300">
                <span>{ch.badge}</span>
                {done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-label="Çözüldü" />}
              </div>
              <p className="mt-1 font-bold text-white line-clamp-1">{ch.title}</p>
            </button>
          );
        })}
      </div>

      <div className="bg-[#171f42] border border-white/10 rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-extrabold text-cyan-300">{current.badge}</span>
          {isSolved && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
              <CheckCircle2 className="w-3 h-3" /> Çözüldü
            </span>
          )}
        </div>

        <div className="space-y-3 leading-relaxed text-sm text-slate-200">
          <p>{current.intro}</p>

          <div className="bg-[#0e1530] border border-white/10 rounded-2xl p-4 space-y-2 text-xs font-mono text-cyan-300">
            {current.clues.map((clue, i) => (
              <div key={i}>• {clue}</div>
            ))}
          </div>

          <p className="text-xs text-amber-300 font-bold">{current.question}</p>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-400">Seçiminiz:</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {current.options.map(opt => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setSelected(opt.key)}
                className={`py-3 px-2 rounded-xl font-extrabold text-sm transition-all border ${
                  selected === opt.key
                    ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={checkWeekly}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all"
        >
          ✓ Cevabımı Kontrol Et
        </button>

        {feedback && (
          <div
            role={feedback.type === 'ok' ? 'status' : 'alert'}
            className={`p-4 rounded-2xl text-xs font-bold leading-relaxed border animate-fadeIn ${
              feedback.type === 'ok'
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
            }`}
          >
            {feedback.text}
          </div>
        )}
      </div>
    </div>
  );
};
