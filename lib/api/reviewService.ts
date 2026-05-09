import axios from "axios";

export interface Review {
    reviewId: number;
    reviewerName: string;
    rating: number;
    reviewDate: string;
    comment: string;
}

export interface CreateReviewPayload {
    reviewer_name: string;
    rating: number;
    review_date: string;
    comment: string;
}

/**
 * GET /api/reviews
 * Returns all reviews ordered newest first.
 */
export async function getReviews(): Promise<Review[]> {
    const res = await axios.get("/api/reviews");
    return res.data.reviews;
}

/**
 * POST /api/reviews
 * Creates a new review.
 */
export async function createReview(payload: CreateReviewPayload): Promise<Review> {
    const res = await axios.post("/api/reviews", payload);
    return res.data;
}

/**
 * DELETE /api/reviews/{id}
 * Deletes a review by its ID.
 */
export async function deleteReview(id: number): Promise<void> {
    await axios.delete(`/api/reviews/${id}`);
}
