'use client';

import React, { useState } from 'react';

interface VersionItem {
  version: string;
  date: string;
  isCurrent?: boolean;
  changes: string[];
}

const VERSION_HISTORY: VersionItem[] = [
  {
    version: 'v1.4.0',
    date: '22 Eylül 2026',
    isCurrent: true,
    changes: [
      'Kapsamlı Responsive (Mobil & Tablet) Arayüzü: Tüm kullanıcı ve yönetici ekranları akıllı telefon ve tablet ekranlarına %100 duyarlı hale getirildi.',
      'Mobil Yönetici Gezinme Çubuğu (AdminNavbar): Mobilde parmakla rahat basılabilen (minimum 44px dokunma alanı) ve aktif sayfayı vurgulayan mobil navigasyon çubuğu eklendi.',
      'Yemek Seçme ve Değiştirme Açılır Menüsü (DishSwapPopover): Menüdeki yemekleri değiştirme (🔄) veya "+ Yemek Seç / Ekle" butonuyla yeni yemek ekleme işlemleri için anlık arama kutucuklu ve kategori filtreli akıllı açılır menü geliştirildi.',
      'Mobilde Alttan Açılan Eylem Sayfası (Bottom Sheet): Mobil cihazlarda popover pencereleri ekranın altından yukarı doğru kayarak açılan dokunmatik bir panele dönüştürüldü.',
      'Yemekler Sayfası Mobil Kart Görünümü: Admin yemek yönetiminde yatay tablo kaydırma zorunluluğu kaldırılarak mobilde büyük fotoğraflı, kategori ve kalori rozetli, tek dokunuşla Düzenle/Sil yapılabilen pratik Mobil Yemek Kartları geliştirildi.',
      '20\'şerli Sayfalama Sistemi: Yemek yönetiminde sayfa başına gösterim adedi 25\'ten 20\'ye düşürüldü; mobilde [Önceki] Sayfa X / Y [Sonraki] kompakt gezinme çubuğu sağlandı.',
      'Aylık Takvim Mobil Görünüm Tercihi: Mobilde kullanıcıların yatay kaydırma yapmadan tüm ayı inceleyebilmesi için "📋 Hafta Hafta Liste" ve "📅 6 Günlük Tablo" arasında tek tıkla geçiş yapabilen görünüm seçici eklendi.',
      'Yazdırma ve PDF Penceresi Mobil Uyumu: Küçük ekranlarda butonların ekran dışına taşması engellenerek esnek dikey/yatay hizalama sağlandı.',
      'Tüm Manuel Yemek Görsellerinin Arşivlenmesi & Senkronizasyonu: 145 adet yemek fotoğrafı public/dishes/*.jpg altında optimize edilip veritabanı ile eşitlendi; Vercel sunucusuz dağıtımında kalıcılığı sağlandı.',
    ],
  },
  {
    version: 'v1.3.0',
    date: '21 Eylül 2026',
    changes: [
      'Doğrudan Günün Menüsü Görünümü: Açılır pencereler (popover/modal) kaldırıldı; ana sayfa doğrudan bugünün zengin yemek kartlarıyla açılır.',
      'Günlük Ok Navigasyonu: Önceki ve sonraki günlere sağ-sol ok butonları ve klavye ok tuşları (← / →) ile akıcı geçiş sağlandı; tek tıkla "Bugün"e dönüş butonu eklendi.',
      '6 Günlük Çalışma Takvimi Izgarası: Tabldot hizmeti Pazartesi-Cumartesi arası olduğundan Pazar günü takvimden kaldırıldı. 6 sütunlu düzenle her gün hücresine %17 daha fazla yatay alan kazandırıldı.',
      'Net ve Ferah Tipografi: Yemeklerin başındaki renkli noktalar kaldırıldı; yemek isimleri iki satıra kadar rahatça okunabilecek sade ve ferah bir düzene kavuşturuldu.',
      'Belirgin Kamera Rozeti: Fotoğrafı olan yemeklerin yanına canlı amber renkli özel kamera butonu eklendi; tıklandığında lightbox görsel büyütme penceresi açılır.',
      'Sade ve Gerçekçi Görsel Kataloğu: Türk mutfağına uygun, temiz beyaz arka planlı gerçekçi yemek fotoğrafları 164 yemeğin tamamına entegre edildi (%100 görsel kapsamı).',
      'Yemek Açıklamalarının ve Özel Etiketlerin Kaldırılması: Kullanıcı talebi doğrultusunda yemek açıklamaları ve "özel fotoğraf" gibi ibareler arayüzden tamamen temizlenerek sade bir kurumsal kimlik sağlandı.',
      'Admin Paneli Fotoğraf Yükleme: Yemek Yönetimi sayfasından bilgisayar veya telefondan tek tıkla cihazdan fotoğraf seçme (otomatik 35KB JPEG optimizasyonuyla) veya URL girme desteği eklendi.',
      'GitHub ve Vercel Altyapısı: Proje resmi GitHub deposuna yüklendi; Vercel sunucusuz ortamında SQLite veritabanının otomatik beslenmesi ve kalıcılığı güvence altına alındı.',
    ],
  },
  {
    version: 'v1.2.0',
    date: '18 Eylül 2026',
    changes: [
      'Gerçek Kalori Hesaplama Motoru: Türkiye kurumsal yemekhane/tabldot standartları baz alınarak 164 yemeğin porsiyon kalorileri hesaplandı ve sisteme işlendi.',
      'Günün Menüsü Kalori Entegrasyonu: Her bir yemek kartında porsiyon kalorisi ve gün başlığında menünün toplam kalori rozeti (🔥 Toplam: X kcal) eklendi.',
      'Aylık Liste Kalori Görünümü: Takvim tablosunda her güne ait toplam kalori ve her yemek etiketinin içinde kalori bilgisi görüntülendi.',
      'Yemek Yönetimi Kalori Desteği: Admin panelinde yemek eklerken veya düzenlerken kalori alanı eklendi (boş bırakıldığında otomatik hesaplanır).',
      'Menü Sihirbazı Canlı Kalori Takibi: Yeni liste oluşturma sihirbazı ve yemek seçici modallarında günün ve yemeklerin kalorileri anlık olarak yansıtıldı.',
      'Tavuklu Ana Yemek Arşivi: Fırında Soslu Baget, Körili Tavuk, Kremalı Mantarlı Tavuk, Beyti, Şiş Kebap vb. 14 yeni tavuk yemeği eklendi.',
      'Kullanıcı Ay Kısıtlaması: Standart kullanıcıların yalnızca mevcut aktif ayı görmesi sağlandı; geçmiş/gelecek ay sekmeleri ana sayfadan kaldırıldı.',
    ],
  },
  {
    version: 'v1.1.0',
    date: '17 Eylül 2026',
    changes: [
      'Akıllı Aylık Menü Sihirbazı: Seçilen ay ve yıla göre otomatik dengeli menü oluşturma, tekil gün yenileme (🔄) ve doğrudan yayınlama sistemi.',
      'Haftalık Yan Yemek Çeşitliliği Kuralı: Aynı hafta içinde yan yemek çeşitlerinin (bulgur, pirinç, makarna, erişte, börek, patates) tekrarlanmaması sağlandı.',
      'Özel Eşleştirme Kuralları: Bakliyat, Karnıyarık ve Dönerlerin yanına yalnızca pilav çeşitleri; Sebze ve Et yemeklerinin yanına yalnızca peynirli börek verilmesi.',
      'Cumartesi Pratik Tabldot Kuralı: Cumartesi günleri çorba, salata ve tatlı otomatik olarak menüden çıkarıldı.',
      'Hamur İşi Kuralı: Mantı, pide, lahmacun ve pizza menülerinde yan yemek tamamen kaldırıldı.',
      'Çoklu Ay Sekmeleri: Hem kullanıcı hem yönetici panelinde onaylı tüm aylar arasında hızlı geçiş imkanı.',
      'Haziran, Temmuz ve Ağustos menü arşivleri eklenerek yemek arşivi 176 aktif yemeğe ulaştırıldı.',
    ],
  },
  {
    version: 'v1.0.0',
    date: '17 Eylül 2026',
    changes: [
      '3D Pixar tarzı yemek illüstrasyonları ve modern arayüz tasarımı.',
      'Günün Menüsü (Bugünün Öğle Yemeği) hızlı gösterim modalı.',
      'Aylık Yemek Takvimi (Pazar günleri hariç tutuldu, arama ve filtreleme özelliği eklendi).',
      'Kategorilere özel renk paleti (Çorba: Amber, Ana Yemek: Kırmızı, Yan Yemek: Turuncu, Salata: Yeşil, Tatlı/Meyve: Mor, İçecek: Mavi).',
      'Akıllı Türkçe mutfak algoritması: Ağlayan pasta, profiterol, revani, tatlı ve meyveler otomatik doğru renkte gösterilir.',
      'Kullanıcı İstek ve Not Gönderme sistemi.',
      'Yönetici (Admin) Paneli: Menü oluşturma, düzenleme ve toplu yapıştırma.',
      'Yemek Yönetimi: 25\'er adet sıralama ve sayfalama (Pagination: 1, 2, 3...) sistemi.',
      'Ata Dijital kurumsal kimlik ve sürüm geçmişi alt bilgi alanı entegrasyonu.',
    ],
  },
  {
    version: 'v0.9.5',
    date: '16 Eylül 2026',
    changes: [
      'Aylık menü oluştururken veritabanından yemek seçme veya o anda yeni yemek ekleme desteği.',
      'Pilav, makarna ve böreklerin otomatik olarak "Yan Yemek" grubuna atanması kuralı.',
      'Pazar günlerinin takvimden ve aylık plandan otomatik hariç tutulması.',
      'Tatlı rozetlerinin lejant ile uyumlu hale getirilmesi.',
    ],
  },
  {
    version: 'v0.9.0',
    date: '15 Eylül 2026',
    changes: [
      'Next.js ve Prisma SQLite veritabanı altyapısının kurulması.',
      'Yemekler, Günlük Menü, Haftalık Menü ve Aylık Plan modellerinin oluşturulması.',
      'İlk prototip ve temel arayüz tasarımının tamamlanması.',
    ],
  },
];

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <footer className="relative z-10 w-full bg-white/90 backdrop-blur-xs border-t border-stone-200/70 pt-10 pb-8 text-center">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center space-y-3">
          {/* 1. ATA YAYINCILIK LOGOSU (Gri Kurumsal Görünüm) */}
          <div className="flex justify-center items-center mb-1">
            <img
              src="/ata-logo.png"
              alt="Ata Yayıncılık"
              className="h-8 sm:h-9 w-auto object-contain grayscale opacity-55 hover:opacity-90 transition-all duration-300 select-none"
            />
          </div>

          {/* 2. ANA BAŞLIK */}
          <h4 className="text-sm sm:text-base font-bold text-slate-700 tracking-tight pt-1">
            Ata Dijital Ekibi Tarafından Hazırlanmıştır &copy; 2026
          </h4>

          {/* 3. AÇIKLAMA METNİ */}
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto font-medium">
            Tüm soru, istek ve düşünceleriniz için Yayın Yönetmeninizle iletişime geçin.
          </p>

          {/* 4. SÜRÜM BİLGİSİ & TIKLANABİLİR SÜRÜM GEÇMİŞİ */}
          <div className="pt-4 flex items-center justify-center gap-2 text-xs text-stone-400 font-medium">
            <span className="text-stone-400 tracking-wide">Ata Lezzet v1.4.0</span>
            <span className="text-stone-300">|</span>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-stone-400 hover:text-amber-600 uppercase tracking-wider text-[11px] font-bold transition-colors cursor-pointer hover:underline"
            >
              SÜRÜM GEÇMİŞİ
            </button>
          </div>
        </div>
      </footer>

      {/* SÜRÜM GEÇMİŞİ MODALI */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-stone-200 text-stone-800 my-auto max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Başlığı */}
            <div className="px-6 py-5 border-b border-stone-100 bg-amber-50/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-lg shadow-xs">
                  🚀
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight">
                    Ata Lezzet — Sürüm Geçmişi
                  </h3>
                  <p className="text-xs text-stone-500 font-medium">
                    Yayınlanan güncellemeler ve sürüm detayları
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer text-sm font-bold"
                aria-label="Kapat"
              >
                ✕
              </button>
            </div>

            {/* Sürüm Listesi */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {VERSION_HISTORY.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    item.isCurrent
                      ? 'bg-amber-50/40 border-amber-300 shadow-xs'
                      : 'bg-stone-50/50 border-stone-200'
                  }`}
                >
                  {/* Sürüm Başlık & Tarih */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-stone-900">
                        {item.version}
                      </span>
                      {item.isCurrent && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Güncel Sürüm
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-stone-400">
                      {item.date}
                    </span>
                  </div>

                  {/* Değişiklik Maddeleri */}
                  <ul className="space-y-1.5 text-xs text-stone-600">
                    {item.changes.map((change, cIdx) => (
                      <li key={cIdx} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold mt-0.5">•</span>
                        <span className="leading-relaxed">{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Modal Alt Kısmı */}
            <div className="px-6 py-4 border-t border-stone-100 bg-stone-50/70 flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-400">
                Ata Dijital Ekibi &copy; 2026
              </span>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
