import { 
  Hero,
  Brands,
  Collections,
  Setups,
  Discounts
} from "@/components";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
  <>
  <Header />
  <main className="flex flex-col items-center relative z-10 gap-y-10 mb-10">
    <Hero />
    <Brands />
    <Discounts />
    <Setups />
    <Collections />
  </main>
  <Footer />
  </>
  );
}
