'use client';

import Header from '@/components/Header';
import LaptopModelSelection from '@/components/LaptopModelSelection';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useParams } from 'next/navigation';

export default function BrandModelPage() {
  const params = useParams();
  const brand = params.brand as string;

  return (
    <div className="min-h-screen pt-16">
      <Header />
      <LaptopModelSelection brand={brand} />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
