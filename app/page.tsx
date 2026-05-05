import {
  Hero,
  Brands,
  Collections,
  StoreServices,
  FacebookReviewClient
} from "@/components";

import Header from "@/components/sections/Header/Header";
import Footer from "@/components/sections/Footer/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center relative z-10 gap-y-2 mb-20 mt-40">
        <Hero />
        <StoreServices />
        <Brands />
        <Collections />
        <FacebookReviewClient />
      </main>
      <Footer />
    </>
  );
}
