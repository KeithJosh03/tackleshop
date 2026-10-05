import Hero from "./Hero/Hero";
import Brands from "./BrandsLogo/BrandsLogo";
import Collections from "./ProductCollection/page";
import SetupCollection from "./SetupCollection";
import StoreServices from "./StoreServices/StoreServices";
import { Header, Footer } from "../layout";

export default function HomePage() {
    return (
        <>
            <Header />
            <main
                className="relative z-10 mb-24 flex flex-col items-center"
            >
                <Hero />
                <Brands />
                <Collections />
                <SetupCollection />
                <StoreServices />
                {/* <FacebookReview /> */}
            </main>
            <Footer />
        </>
    );
}
