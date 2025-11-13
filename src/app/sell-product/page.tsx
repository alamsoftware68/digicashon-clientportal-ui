'use client';

import Header from '@/components/Header';
import SellProductPage from '@/components/SellProductPage';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function SellProduct() {
  return (
    <div className="min-h-screen pt-16">
      <Header />
      <SellProductPage />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
