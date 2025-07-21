import { 
  Introduction,
  Brands,
  Reviews,
  HighLight,
  Footer
} from "@/components";

export default function Home() {
  return (
    <main className="flex flex-col items-center relative z-10 gap-y-10 mb-20">
      <Introduction />
      <Brands />
      <HighLight />
      {/* <Reviews /> */}
    </main>
  );
}
