import Hero from "./Hero/Hero";
import Brands from "./BrandsLogo/BrandsLogo";
import Collections from "./ProductCollection/page";
import SetupCollection from "./SetupCollection";
import StoreServices from "./StoreServices/StoreServices";
import HomeBlogsSection from './Blogs';
import HeroSlide from "./Hero/HeroSlide";
import { Header, Footer } from "../layout";

export default function HomePage() {
    return (
        <>
            <Header />
            <main
                className="relative z-10 mb-24 flex flex-col items-center"
            >
                {/* <Hero /> */}
                <HeroSlide />
                <Brands />
                <Collections />
                <SetupCollection />
                <HomeBlogsSection />
                <StoreServices />
                {/* <FacebookReview /> */}
            </main>
            <Footer />
        </>
    );
}
