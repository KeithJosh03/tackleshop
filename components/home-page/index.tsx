import Hero from "./Hero/Hero";
import Brands from "./BrandsLogo/Brands";
import Collections from "./ProductCollections/Collection";
import StoreServices from "./StoreServices/StoreServices";
// import FacebookReviewClient from "./FacebookReviews/FacebookReviewClient";
import { Header, Footer } from "../layout";

export default function HomePage() {
    return (
        <>
            <Header />
            <main className="flex flex-col items-center relative z-10 gap-y-2 mb-20 mt-40">
                <Hero />
                <StoreServices />
                <Brands />
                <Collections />
                {/* <FacebookReviewClient /> */}
            </main>
            <Footer />
        </>
    );
}
