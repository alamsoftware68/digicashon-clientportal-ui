import Header from "@/components/Header";
import ImageSlider from "@/components/ImageSlider";
import DeviceSellingSection from "@/components/DeviceSellingSection";
import HowItWorks from "@/components/HowItWorks";
import WhyChooseUs from "@/components/WhyChooseUs";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <div className="min-h-screen pt-16">
      <Header />
      <ImageSlider />
      <DeviceSellingSection />
      <HowItWorks />
      <WhyChooseUs />
      <Newsletter />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
