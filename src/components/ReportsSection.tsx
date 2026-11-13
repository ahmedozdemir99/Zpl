import React, { useState } from 'react';
import { FileText, Download, Database, RotateCcw, BarChart3, Search } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { MatchHistoryRecord, AppState } from '../types';
import { sound } from '../utils/sound';

interface ReportsSectionProps {
  state: AppState;
  onRestoreBackup: (jsonState: any) => void;
}

function pdfSafe(text: string): string {
  const map: Record<string, string> = {
    ç: 'c', Ç: 'C', ğ: 'g', Ğ: 'G', ı: 'i', İ: 'I',
    ö: 'o', Ö: 'O', ş: 's', Ş: 'S', ü: 'u', Ü: 'U',
    '—': '-', '–': '-', '·': '-',
  };
  return text.replace(/[çÇğĞıİöÖşŞüÜ—–·]/g, ch => map[ch] ?? ch);
}

export const ReportsSection: React.FC<ReportsSectionProps> = ({ state, onRestoreBackup }) => {
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [statusBanner, setStatusBanner] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [pendingBackup, setPendingBackup] = useState<any | null>(null);

  const handleDownloadPDF = () => {
    sound.playClick();
    try {
      const doc = new jsPDF();
      let y = 15;
      doc.setFontSize(18);
      doc.text('Zeka Pro Ligim - Mac ve Lig Raporu', 14, y);
      y += 10;
      doc.setFontSize(10);
      doc.text(pdfSafe(`Rapor Tarihi: ${new Date().toLocaleString('tr-TR')}`), 14, y);
      doc.text(pdfSafe(`Toplam Puan: ${Math.round(state.score)} | Cozulen: ${state.solved} | Toplam Mac: ${state.matches.length}`), 14, y + 6);
      y += 15;

      if (state.matches.length === 0) {
        doc.text('Henuz tamamlanmis lig maci bulunmuyor.', 14, y);
      } else {
        state.matches.forEach((m, idx) => {
          if (y > 270) {
            doc.addPage();
            y = 15;
          }
          const textLine = pdfSafe(`${idx + 1}. ${m.className || 'Sinif'} | ${m.p1} (${m.correct1}) vs ${m.p2 || '-'} (${m.correct2}) | Kazanan: ${m.winner || 'Tamamlandi'}`);
          doc.text(textLine, 14, y);
          y += 7;
        });
      }

      doc.save(`Zeka_Pro_Ligim_Rapor_${new Date().toISOString().slice(0, 10)}.pdf`);
      setStatusBanner({ type: 'ok', text: 'PDF raporu indirildi.' });
    } catch {
      setStatusBanner({ type: 'err', text: 'PDF indirilirken bir hata oluştu.' });
    }
  };

  const handleDownloadCSV = () => {
    sound.playClick();
    const rows = [['Tarih', 'Sınıf', 'Oyuncu 1', 'Doğru 1', 'Oyuncu 2', 'Doğru 2', 'Kazanan']];
    state.matches.forEach(m => {
      rows.push([
        m.date || '',
        m.className || '',
        m.p1 || '',
        String(m.correct1 || 0),
        m.p2 || '',
        String(m.correct2 || 0),
        m.winner || '',
      ]);
    });

    const csvContent =
      '\uFEFF' +
      rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Zeka_Pro_Ligim_Mac_Sonuclari_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusBanner({ type: 'ok', text: 'CSV dosyası indirildi.' });
  };

  const handleBackupJSON = () => {
    sound.playClick();
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zeka_pro_ligim_yedek_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusBanner({ type: 'ok', text: 'JSON yedeği indirildi.' });
  };

  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (parsed && Array.isArray(parsed.classes)) {
          setPendingBackup(parsed);
          setStatusBanner(null);
        } else {
          setStatusBanner({ type: 'err', text: 'Geçersiz Zekâ Pro Ligim yedek dosyası.' });
        }
      } catch {
        setStatusBanner({ type: 'err', text: 'Yedek dosyası ayrıştırılamadı.' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const confirmRestore = () => {
    if (!pendingBackup) return;
    onRestoreBackup(pendingBackup);
    setPendingBackup(null);
    sound.playSuccess();
    setStatusBanner({ type: 'ok', text: 'Yedek başarıyla geri yüklendi.' });
  };

  const filteredHistory = state.history.filter(h => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    return (
      (h.className && h.className.toLowerCase().includes(q)) ||
      (h.p1 && h.p1.toLowerCase().includes(q)) ||
      (h.p2 && h.p2.toLowerCase().includes(q)) ||
      (h.winner && h.winner.toLowerCase().includes(q)) ||
      (h.type && h.type.toLowerCase().includes(q)) ||
      (h.result && h.result.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#1a2450] to-[#121938] border border-white/10 p-5 shadow-xl space-y-2">
        <span className="px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 font-extrabold text-xs border border-cyan-500/30">
          📊 ÖĞRETMEN MERKEZİ & RAPORLAMA
        </span>
        <h2 className="text-2xl font-black text-white">Raporlar ve Veri Yedekleme</h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          Sınıf maçlarını PDF/CSV olarak dışarı aktarın veya tüm platform verilerini tek bir JSON dosyasında yedekleyin.
        </p>
      </div>

      {statusBanner && (
        <div
          role={statusBanner.type === 'err' ? 'alert' : 'status'}
          className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-xs font-bold ${
            statusBanner.type === 'ok'
              ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-200'
              : 'border-rose-500/30 bg-rose-500/15 text-rose-200'
          }`}
        >
          <span>{statusBanner.text}</span>
          <button type="button" onClick={() => setStatusBanner(null)} className="text-xs underline opacity-80 hover:opacity-100">
            Kapat
          </button>
        </div>
      )}

      {pendingBackup && (
        <div role="alert" className="rounded-2xl border border-amber-400/40 bg-amber-500/15 p-4 text-xs space-y-3">
          <p className="font-bold text-amber-200">
            Mevcut tüm veriler seçilen yedek dosyası ({pendingBackup.classes?.length ?? 0} sınıf, {pendingBackup.matches?.length ?? 0} maç) ile değiştirilecek. Onaylıyor musunuz?
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={confirmRestore} className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-black hover:brightness-110">
              Onayla ve Yükle
            </button>
            <button type="button" onClick={() => setPendingBackup(null)} className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20">
              Vazgeç
            </button>
          </div>
        </div>
      )}

      {/* Export Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#171f42] border border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center text-xl">
              📄
            </div>
            <h3 className="text-sm font-extrabold text-white">PDF Raporu</h3>
            <p className="text-[11px] text-slate-400">Maç sonuçları ve sıralama çıktısı al.</p>
          </div>
          <button
            onClick={handleDownloadPDF}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-md hover:brightness-110"
          >
            PDF İndir
          </button>
        </div>

        <div className="bg-[#171f42] border border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xl">
              📊
            </div>
            <h3 className="text-sm font-extrabold text-white">Excel / CSV</h3>
            <p className="text-[11px] text-slate-400">Excel'de açılabilir tablo olarak indir.</p>
          </div>
          <button
            onClick={handleDownloadCSV}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-md hover:brightness-110"
          >
            CSV İndir
          </button>
        </div>

        <div className="bg-[#171f42] border border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xl">
              💾
            </div>
            <h3 className="text-sm font-extrabold text-white">Tam Yedek Al</h3>
            <p className="text-[11px] text-slate-400">Sınıfları, öğrencileri ve ligi JSON yedekle.</p>
          </div>
          <button
            onClick={handleBackupJSON}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-md hover:brightness-110"
          >
            Yedeği İndir
          </button>
        </div>

        <div className="bg-[#171f42] border border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-xl">
              ♻️
            </div>
            <h3 className="text-sm font-extrabold text-white">Yedek Yükle</h3>
            <p className="text-[11px] text-slate-400">Önceden alınmış JSON yedeğini geri yükle.</p>
          </div>
          <label className="w-full text-center py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer block border border-white/10 transition-colors">
            Dosya Seç
            <input type="file" accept=".json" onChange={handleRestoreFile} className="hidden" />
          </label>
        </div>
      </div>

      {/* Match History Table */}
      <div className="bg-[#171f42] border border-white/10 rounded-3xl p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            📋 Tüm Geçmiş Maç ve Etkinlik Kayıtları
          </h3>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={filterQuery}
              onChange={e => setFilterQuery(e.target.value)}
              placeholder="Öğrenci veya sınıf ara..."
              className="w-full bg-[#0e1530] border border-white/10 text-white text-xs rounded-xl pl-8 pr-3 py-2 outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-4 text-center">Henüz kayıtlı maç bulunmuyor.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-bold">
                  <th className="py-2 px-3">Tarih</th>
                  <th className="py-2 px-3">Tür</th>
                  <th className="py-2 px-3">Sınıf</th>
                  <th className="py-2 px-3">Oyuncular</th>
                  <th className="py-2 px-3">Sonuç</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredHistory.map((h, i) => (
                  <tr key={i} className="hover:bg-white/5">
                    <td className="py-2.5 px-3 text-slate-400">{h.date}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-bold text-[10px]">
                        {h.type || '🏆 Maç'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">{h.className || '—'}</td>
                    <td className="py-2.5 px-3 font-bold text-white">
                      {h.p1} {h.p2 ? `— ${h.p2}` : ''}
                    </td>
                    <td className="py-2.5 px-3 font-extrabold text-cyan-400">
                      {h.winner ? `🏆 ${h.winner} (${h.correct1}-${h.correct2})` : h.result || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
