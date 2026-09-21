import React from 'react';
import { prisma } from '@/lib/prisma';

export default async function AdminNotlarPage() {
  const notes = await prisma.userNote.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Kullanıcı Notları</h1>
        <p className="text-sm text-stone-500 mt-1">
          Kullanıcıların ana sayfadaki form üzerinden gönderdiği tüm not ve geri bildirimler.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        {notes.length === 0 ? (
          <div className="p-12 text-center text-stone-500">
            Henüz herhangi bir kullanıcı notu bulunmuyor.
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {notes.map((note) => (
              <div key={note.id} className="p-5 sm:p-6 hover:bg-stone-50/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-800">
                    {note.status === 'pending' ? 'Yeni Not' : 'İncelendi'}
                  </span>
                  <span className="text-xs text-stone-400">
                    {new Date(note.createdAt).toLocaleString('tr-TR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-stone-800 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
