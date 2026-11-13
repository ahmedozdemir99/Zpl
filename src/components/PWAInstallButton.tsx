import React, { useState } from 'react';
import { Download, Share, X } from 'lucide-react';
import { useOnlineStatus, usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) return null;

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={() => void install()}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-400/40 bg-amber-400/15 text-amber-200 font-bold text-xs hover:bg-amber-400/25 active:scale-95 transition-all"
      >
        <Download className="w-3.5 h-3.5" aria-hidden="true" />
        Uygulamayı Yükle
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-400/40 bg-amber-400/15 text-amber-200 font-bold text-xs hover:bg-amber-400/25 active:scale-95 transition-all"
        >
          <Share className="w-3.5 h-3.5" aria-hidden="true" />
          Ana Ekrana Ekle
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-sm">
            <div role="dialog" aria-modal="true" className="relative w-full max-w-sm rounded-2xl border border-white/15 bg-[#171f42] p-5 text-white shadow-2xl space-y-3">
              <button
                type="button"
                aria-label="Kapat"
                onClick={() => setShowIOSGuide(false)}
                className="absolute right-3 top-3 rounded-lg bg-white/5 p-1.5 text-slate-300 hover:bg-white/10"
              >
                <X className="size-4" />
              </button>
              <h3 className="text-base font-black pr-8">iPhone / iPad’e Yükle</h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                1. Safari araç çubuğundaki <strong>Paylaş</strong> simgesine dokunun.<br />
                2. Aşağı kaydırıp <strong>Ana Ekrana Ekle</strong> seçeneğine dokunun.
              </p>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-xl bg-white/10 py-2 text-xs font-bold text-white hover:bg-white/20"
              >
                Tamam
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div role="status" className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl border border-amber-300/40 bg-amber-600/95 px-3 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-sm">
      <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
      Çevrimdışı Mod — Önbellekteki veriler kullanılıyor.
    </div>
  );
};
