'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { inter, worksans } from '@/types/fonts';
import { getReviews, createReview, deleteReview, type Review } from '@/lib/api/reviewService';
import { InputText, InputDate, CollapsibleTextarea } from '@/components/ui';

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function getInitials(name: string) {
    return name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase();
}

function StarDisplay({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <svg
                    key={s}
                    className={`w-3.5 h-3.5 ${s <= rating ? 'text-[#E89347]' : 'text-[#2A3441]'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

/* ─── Empty form state ───────────────────────────────────────────────────── */
const emptyForm = {
    reviewer_name: '',
    rating: 5,
    review_date: '',
    comment: '',
};

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [form, setForm] = useState(emptyForm);
    const [formErrors, setFormErrors] = useState<Partial<typeof emptyForm>>({});
    const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [statusType, setStatusType] = useState<'success' | 'error' | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [commentOpen, setCommentOpen] = useState(false);

    /* ── Fetch on mount ── */
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await getReviews();
                console.log(data);
                setReviews(data);
            } catch {
                showToast('error', 'Failed to load reviews.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchReviews();
    }, []);

    /* ── Toast helper ── */
    const showToast = (type: 'success' | 'error', msg: string) => {
        setStatusType(type);
        setStatusMessage(msg);
        setTimeout(() => {
            setStatusMessage(null);
            setStatusType(null);
        }, 5000);
    };

    /* ── Validate ── */
    const validate = () => {
        const errors: Partial<typeof emptyForm> = {};
        if (!form.reviewer_name.trim()) errors.reviewer_name = 'Reviewer name is required.';
        if (!form.review_date) errors.review_date = 'Review date is required.';
        if (!form.comment.trim()) errors.comment = 'Comment is required.';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    /* ── Submit ── */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            const newReview = await createReview({
                reviewer_name: form.reviewer_name.trim(),
                rating: form.rating,
                review_date: form.review_date,
                comment: form.comment.trim(),
            });

            setReviews((prev) => [newReview, ...prev]);
            setForm(emptyForm);
            setFormErrors({});
            showToast('success', 'Review added successfully!');
        } catch {
            showToast('error', 'Failed to add review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ── Delete ── */
    const confirmDelete = async () => {
        if (!reviewToDelete) return;
        try {
            await deleteReview(reviewToDelete.reviewId);
            setReviews((prev) => prev.filter((r) => r.reviewId !== reviewToDelete.reviewId));
            showToast('success', 'Review deleted successfully!');
        } catch {
            showToast('error', 'Failed to delete review.');
        } finally {
            setReviewToDelete(null);
        }
    };

    /* ─────────────────── Render ─────────────────── */
    return (
        <div className={`${worksans.className} flex flex-col gap-y-6`}>

            {/* ── Page title ── */}
            <h1 className="text-primaryColor text-xl font-extrabold">FACEBOOK REVIEWS</h1>

            {/* ─── Create Review Form ─────────────────────────────────────── */}
            <div className="border border-greyColor rounded bg-blackgroundColor p-5 flex flex-col gap-y-4">
                <h2 className="text-primaryColor text-sm font-extrabold uppercase tracking-wider">
                    Add New Review
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Reviewer Name */}
                    <div className="flex flex-col gap-y-1">
                        <label className={`${inter.className} text-xs font-bold text-secondary uppercase tracking-wider`}>
                            Reviewer Name
                        </label>
                        <InputText
                            placeholder="e.g. Juan dela Cruz"
                            value={form.reviewer_name}
                            onChange={(e) => setForm((f) => ({ ...f, reviewer_name: e.target.value }))}
                        />
                        {formErrors.reviewer_name && (
                            <span className={`${inter.className} text-xs text-red-400`}>{formErrors.reviewer_name}</span>
                        )}
                    </div>

                    {/* Review Date */}
                    <div className="flex flex-col gap-y-1">
                        <label className={`${inter.className} text-xs font-bold text-secondary uppercase tracking-wider`}>
                            Review Date
                        </label>
                        <InputDate
                            value={form.review_date}
                            onChange={(e) => setForm((f) => ({ ...f, review_date: e.target.value }))}
                        />
                        {formErrors.review_date && (
                            <span className={`${inter.className} text-xs text-red-400`}>{formErrors.review_date}</span>
                        )}
                    </div>

                    {/* Rating */}
                    <div className="flex flex-col gap-y-1">
                        <label className={`${inter.className} text-xs font-bold text-secondary uppercase tracking-wider`}>
                            Rating
                        </label>
                        <div className="flex items-center gap-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setForm((f) => ({ ...f, rating: star }))}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                >
                                    <svg
                                        className={`w-7 h-7 transition-colors ${star <= form.rating ? 'text-[#E89347]' : 'text-[#2A3441] hover:text-[#E89347]/40'}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </button>
                            ))}
                            <span className={`${inter.className} text-sm text-primaryColor font-bold ml-1`}>
                                {form.rating}/5
                            </span>
                        </div>
                    </div>

                    {/* Comment (full width) */}
                    <div className="md:col-span-2">
                        <CollapsibleTextarea
                            label="Comment"
                            icon={
                                <svg className="w-4 h-4 text-primaryColor" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3-3-3z" />
                                </svg>
                            }
                            isOpen={commentOpen}
                            onToggle={() => setCommentOpen((o) => !o)}
                            value={form.comment}
                            placeholder="Write the reviewer's comment..."
                            onChange={(val) => setForm((f) => ({ ...f, comment: val }))}
                            error={formErrors.comment}
                        />
                    </div>

                    {/* Submit button */}
                    <div className="md:col-span-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`${inter.className} px-6 py-2 rounded border border-primaryColor text-primaryColor text-sm font-bold uppercase tracking-wider hover:bg-primaryColor hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isSubmitting ? 'Adding...' : '+ Add Review'}
                        </button>
                    </div>
                </form>
            </div>

            {/* ─── Reviews Table ──────────────────────────────────────────── */}
            <div className="border border-greyColor rounded bg-blackgroundColor p-5 flex flex-col gap-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-primaryColor text-sm font-extrabold uppercase tracking-wider">
                        All Reviews
                    </h2>
                    <span className={`${inter.className} text-xs text-secondary`}>
                        {reviews.length} total
                    </span>
                </div>

                <div className="overflow-x-auto border border-greyColor rounded">
                    <table className="w-full text-sm text-secondary">
                        <thead className="bg-primaryColor text-tertiaryColor">
                            <tr>
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Reviewer</th>
                                <th className="p-3 text-left">Rating</th>
                                <th className="p-3 text-left">Date</th>
                                <th className="p-3 text-left">Comment</th>
                                <th className="p-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td colSpan={6} className="p-6 text-center text-greyColor">
                                        Loading reviews...
                                    </td>
                                </tr>
                            )}
                            {!isLoading && reviews.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-6 text-center text-greyColor">
                                        No reviews yet. Add one above.
                                    </td>
                                </tr>
                            )}
                            {reviews.map((review) => (
                                <tr
                                    key={review.reviewId}
                                    className="border-t border-greyColor hover:bg-secondary text-primaryColor"
                                >
                                    {/* ID */}
                                    <td className={`${inter.className} p-3 text-xs text-greyColor font-mono`}>
                                        {review.reviewId}
                                    </td>

                                    {/* Reviewer */}
                                    <td className="p-3">
                                        <div className="flex items-center gap-x-2">
                                            <div
                                                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                                                style={{ background: 'linear-gradient(135deg, #E89347 0%, #835d32 100%)' }}
                                            >
                                                {getInitials(review.reviewerName)}
                                            </div>
                                            <span className={`${inter.className} text-sm font-semibold`}>
                                                {review.reviewerName}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Rating */}
                                    <td className="p-3">
                                        <StarDisplay rating={review.rating} />
                                    </td>

                                    {/* Date */}
                                    <td className={`${inter.className} p-3 text-xs text-greyColor`}>
                                        {new Date(review.reviewDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </td>

                                    {/* Comment */}
                                    <td className={`${inter.className} p-3 text-xs text-secondary max-w-xs`}>
                                        <span className="line-clamp-2">{review.comment}</span>
                                    </td>

                                    {/* Actions */}
                                    <td className="p-3">
                                        <button
                                            onClick={() => setReviewToDelete(review)}
                                            className={`${inter.className} px-3 py-1 text-xs rounded border border-red-500 text-red-500 hover:bg-red-500/10 transition-colors font-bold`}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Delete Confirmation Modal ── */}
            {reviewToDelete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div
                        className="bg-[#111A2D] border border-[#2A3441] rounded-2xl shadow-2xl overflow-hidden w-full max-w-sm"
                        style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 text-red-400 mx-auto mb-4 border border-red-500/20">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h3 className={`${worksans.className} text-lg font-black text-white text-center tracking-wide`}>
                                Delete Review
                            </h3>
                            <p className={`${inter.className} text-secondary text-sm text-center mt-2 leading-relaxed`}>
                                Are you sure you want to delete{' '}
                                <span className="text-white font-bold">{reviewToDelete.reviewerName}</span>
                                &apos;s review? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex border-t border-[#2A3441]">
                            <button
                                onClick={() => setReviewToDelete(null)}
                                className={`${inter.className} flex-1 py-3 text-sm font-bold text-secondary hover:text-white hover:bg-white/5 transition-colors focus:outline-none`}
                                style={{ borderRight: '1px solid #2A3441' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className={`${inter.className} flex-1 py-3 text-sm font-bold text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors focus:outline-none`}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Toast Notification ── */}
            <AnimatePresence>
                {statusMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border ${statusType === 'success'
                            ? 'bg-[#1a2e1d] border-green-500/30'
                            : 'bg-[#2e1a1a] border-red-500/30'
                            }`}
                    >
                        {statusType === 'success' ? (
                            <svg className="w-6 h-6 text-green-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6 text-red-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        )}
                        <div className="flex flex-col max-w-[280px]">
                            <span className={`${inter.className} text-sm font-bold uppercase tracking-wider ${statusType === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                {statusType === 'success' ? 'Success' : 'Error'}
                            </span>
                            <p className={`${inter.className} text-white text-sm font-medium mt-0.5 leading-snug`}>
                                {statusMessage}
                            </p>
                        </div>
                        <button
                            onClick={() => setStatusMessage(null)}
                            className="ml-4 text-secondary hover:text-white transition-colors shrink-0"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
