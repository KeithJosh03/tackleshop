import { 
  Header,
  Hero,
  Brands,
  Reviews,
  HighLight,
  Collections,
  Footer
} from "@/components";

export default function Home() {
  return (
  <>
  <Header />
  <main className="flex flex-col items-center relative z-10 gap-y-10 mb-20">
    <Hero />
    <Brands />
    <Collections />
  </main>
  <Footer />
  </>
  );
}
