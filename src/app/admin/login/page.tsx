'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin';

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Lütfen yönetici şifresini girin.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Girdiğiniz şifre hatalı.');
        setLoading(false);
        return;
      }

      // Başarılı giriş: yönlendir ve yenile
      router.push(from);
      router.refresh();
    } catch (err) {
      setError('Bağlantı hatası oluştu. Lütfen tekrar deneyin.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xl shadow-stone-200/50">
      {/* Logo ve Başlık */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-block relative mb-3">
          <img
            src="/ata-lezzet-logo.jpg"
            alt="Ata Lezzet"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-300 shadow-md mx-auto"
          />
          <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center shadow-xs border-2 border-white">
            🔒
          </div>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
          Yönetici Girişi
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1 font-medium">
          Ata Lezzet Admin Paneline erişmek için şifrenizi girin.
        </p>
      </div>

      {/* Hata Bildirimi */}
      {error && (
        <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-800 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-shake">
          <span className="text-base shrink-0">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
            Yönetici Şifresi
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifrenizi yazın..."
              autoFocus
              className="w-full px-4 py-3 sm:py-3.5 pr-11 bg-stone-50 hover:bg-stone-100/70 focus:bg-white text-stone-900 rounded-2xl border border-stone-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/15 text-sm sm:text-base font-medium transition-all outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 rounded-lg transition-colors text-base"
              title={showPassword ? 'Şifreyi Gizle' : 'Şifreyi Göster'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 sm:py-3.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-[0.99] text-white font-black rounded-2xl shadow-md shadow-amber-500/25 transition-all text-sm sm:text-base flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Giriş yapılıyor...</span>
            </>
          ) : (
            <>
              <span>Giriş Yap</span>
              <span className="text-base">→</span>
            </>
          )}
        </button>
      </form>

      {/* Alt Link: Siteye Dön */}
      <div className="mt-6 pt-5 border-t border-stone-100 text-center">
        <Link
          href="/"
          className="text-xs sm:text-sm font-bold text-stone-500 hover:text-amber-800 transition-colors inline-flex items-center gap-1.5"
        >
          <span>←</span>
          <span>Ana Sayfaya (Menüye) Dön</span>
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-8 px-4">
      <Suspense
        fallback={
          <div className="text-center p-8 bg-white/70 rounded-3xl">
            <div className="w-8 h-8 border-3 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-2" />
            <span className="text-sm font-bold text-stone-600">Yükleniyor...</span>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
