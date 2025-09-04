import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function MobileRepairPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Mobile Repair Services</h1>
          <p className="text-xl text-gray-600 mb-8">Coming Soon! We're working on bringing you the best mobile repair services.</p>
          
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
            <svg className="w-24 h-24 text-blue-500 mx-auto mb-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zM6 4a1 1 0 011-1h6a1 1 0 011 1v10H6V4z" clipRule="evenodd"/>
              <path d="M9 16a1 1 0 011-1h0a1 1 0 110 2h0a1 1 0 01-1-1z"/>
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Mobile Repair</h3>
            <p className="text-gray-600">Screen replacement, battery issues, charging problems and more.</p>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
