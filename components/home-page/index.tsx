import Hero from "./Hero/Hero";
import Brands from "./BrandsLogo/BrandsLogo";
import Collections from "./ProductCollections/page";
// import StoreServices from "./StoreServices/StoreServices";
// import FacebookReview from "./FacebookReviews/FacebookReview";
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
                {/* <StoreServices /> */}
                {/* <FacebookReview /> */}
            </main>
            <Footer />
        </>
    );
}
