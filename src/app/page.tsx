import Header from '@/components/Header';
import MenuButtons from '@/components/MenuButtons';
import UserNoteForm from '@/components/UserNoteForm';
import PixarBackgroundFood from '@/components/PixarBackgroundFood';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fcfaf5] flex flex-col justify-between relative overflow-hidden">
      {/* 3D Pixar Arka Plan Meyve ve Sebzeleri */}
      <PixarBackgroundFood />

      {/* Arka Plan Yumuşak Sıcak Işıklar */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-amber-200/30 via-orange-100/20 to-transparent blur-3xl pointer-events-none z-0" />

      {/* Ana İçerik Konteyneri */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-10 flex-1 flex flex-col justify-center space-y-8">
        {/* 1. Üst Başlık & 3D Pixar Yemek Kümesi */}
        <Header />

        {/* 2. Büyük Butonlar Bölümü */}
        <MenuButtons />

        {/* 3. Kullanıcı Notu Bölümü */}
        <UserNoteForm />
      </div>

      {/* Ata Dijital Alt Bilgi & Sürüm Geçmişi */}
      <Footer />
    </main>
  );
}
