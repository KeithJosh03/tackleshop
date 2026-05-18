import { getReviews, type Review } from "@/lib/api/reviewService";
import FacebookReviewClient from "./FacebookReviewClient";



export default async function Brands() {
    let reviews: Review[] = [];
    try {
        reviews = await getReviews();
    } catch {
        reviews = [];
    }
    return (
        <FacebookReviewClient
            reviews={reviews}
        />
    )
}
