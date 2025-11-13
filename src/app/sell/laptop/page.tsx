'use client';

import Header from '@/components/Header';
import LaptopBrandSelection from '@/components/LaptopBrandSelection';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function SellLaptop() {
  return (
    <div className="min-h-screen pt-16">
      <Header />
      <LaptopBrandSelection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
