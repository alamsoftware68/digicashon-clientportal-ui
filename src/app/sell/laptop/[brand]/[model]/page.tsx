'use client';

import Header from '@/components/Header';
import LaptopSeriesSelection from '@/components/LaptopSeriesSelection';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useParams } from 'next/navigation';

export default function ModelSeriesPage() {
  const params = useParams();
  const brand = params.brand as string;
  const model = params.model as string;

  return (
    <div className="min-h-screen pt-16">
      <Header />
      <LaptopSeriesSelection brand={brand} model={model} />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
