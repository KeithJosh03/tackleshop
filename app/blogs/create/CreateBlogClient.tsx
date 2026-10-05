'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MentionsInput, Mention, SuggestionDataItem } from 'react-mentions';
import { searchProductsForMentions, storeBlog } from '@/lib/api/blogService';
import { uploadImages } from '@/lib/api/uploadImage';
import { UploadImageProps } from '@/lib/api/productService';
import { Camera, X, CheckCircle2, AlertCircle } from 'lucide-react';
import Image from 'next/image';

export default function CreateBlogClient() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [caption, setCaption] = useState('');
    const [images, setImages] = useState<{ file: File, preview: string }[]>([]);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Dynamic search for @ mentions
    const fetchUsers = async (query: string, callback: (data: SuggestionDataItem[]) => void) => {
        if (!query) return;
        const results = await searchProductsForMentions(query);
        // Convert to string for react-mentions
        callback(results.map(r => ({ id: r.id.toString(), display: r.display })));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const currentTotal = images.length + newFiles.length;
            
            if (currentTotal > 3) {
                alert("You can only upload up to 3 images per catch report.");
                return;
            }

            const newImageObjects = newFiles.map(file => ({
                file,
                preview: URL.createObjectURL(file)
            }));

            setImages(prev => [...prev, ...newImageObjects]);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!title.trim() || !caption.trim()) {
            setError('Title and Story are required!');
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Upload Images
            let uploadedUrls: string[] = [];
            if (images.length > 0) {
                const uploadPayload: UploadImageProps[] = images.map((img, idx) => ({
                    file: img.file,
                    originIndex: idx
                }));
                const uploadRes = await uploadImages(uploadPayload);
                uploadedUrls = uploadRes.map(res => res.url);
            }

            // 2. Extract Tagged Product IDs from react-mentions format: @[display](id)
            const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g;
            const taggedProductIds = new Set<number>();
            let match;
            while ((match = mentionRegex.exec(caption)) !== null) {
                taggedProductIds.add(Number(match[2]));
            }

            // 3. Convert caption to HTML for rendering (optional, but good for maintaining simple formatting)
            // Replace @[display](id) with a styled span if we wanted to pre-render it, but for now we'll let the frontend parse it or just replace it with bold text.
            let captionHtml = caption.replace(/@\[([^\]]+)\]\(([^)]+)\)/g, '<strong class="text-[#ffc49a]">@$1</strong>');
            // Add basic newlines
            captionHtml = captionHtml.replace(/\n/g, '<br />');

            // 4. Submit Blog
            const success = await storeBlog({
                title,
                caption_html: captionHtml,
                images: uploadedUrls,
                tagged_products: Array.from(taggedProductIds)
            });

            if (success) {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/blogs');
                    router.refresh();
                }, 1500);
            } else {
                setError('Failed to post catch. Please try again.');
                setIsSubmitting(false);
            }
        } catch (err) {
            setError('An error occurred during submission.');
            setIsSubmitting(false);
        }
    };

    // Styling for react-mentions
    const defaultStyle = {
        control: {
            backgroundColor: '#0b0f10',
            fontSize: 14,
            fontWeight: 'normal',
        },
        '&multiLine': {
            control: {
                fontFamily: 'inherit',
                minHeight: 120,
            },
            highlighter: {
                padding: 16,
                border: '1px solid transparent',
            },
            input: {
                padding: 16,
                border: '1px solid #303a47',
                borderRadius: '0.5rem',
                color: '#e0e3e5',
                outline: 'none',
            },
        },
        suggestions: {
            list: {
                backgroundColor: '#1d2430',
                border: '1px solid #303a47',
                fontSize: 14,
                borderRadius: '0.5rem',
                overflow: 'hidden',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            },
            item: {
                padding: '10px 16px',
                borderBottom: '1px solid #303a47',
                '&focused': {
                    backgroundColor: '#262f3f',
                },
            },
        },
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-[#12171e] rounded-xl border border-[#212b37]">
                <CheckCircle2 className="w-16 h-16 text-[#44e1a0] mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Catch Posted!</h2>
                <p className="text-[#a28d7e]">Redirecting to the feed...</p>
            </div>
        );
    }

    return (
        <div className="bg-[#12171e] rounded-xl border border-[#212b37] overflow-hidden shadow-xl">
            <div className="p-6 border-b border-[#212b37] flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#e0e3e5] uppercase tracking-wider">Post a Catch</h2>
                <button onClick={() => router.back()} className="text-[#a28d7e] hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm font-medium">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        {error}
                    </div>
                )}

                {/* Title */}
                <div>
                    <label className="block text-xs font-bold text-[#a28d7e] uppercase tracking-wider mb-2">Catch Title / Headline</label>
                    <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Morning Bass at Lake Davao"
                        className="w-full bg-[#0b0f10] border border-[#303a47] rounded-lg p-4 text-[#e0e3e5] focus:outline-none focus:border-[#ffc49a] transition-colors"
                        maxLength={100}
                    />
                </div>

                {/* Story / Mentions */}
                <div>
                    <label className="block text-xs font-bold text-[#a28d7e] uppercase tracking-wider mb-2">The Story</label>
                    <p className="text-[#a6a7a6] text-xs mb-3">Type <strong className="text-[#ffc49a]">@</strong> to tag the gear you used in this catch!</p>
                    
                    <div className="focus-within:ring-1 focus-within:ring-[#ffc49a] rounded-lg transition-all">
                        <MentionsInput
                            value={caption}
                            onChange={(e, newValue) => setCaption(newValue)}
                            style={defaultStyle}
                            placeholder="Tell us about the fight, the weather, and what worked..."
                            className="mentions-textarea"
                        >
                            <Mention
                                trigger="@"
                                data={fetchUsers}
                                markup="@[__display__](__id__)"
                                className="mentions__mention"
                                style={{
                                    backgroundColor: 'rgba(255, 196, 154, 0.1)',
                                    color: '#ffc49a',
                                    borderRadius: '4px',
                                    fontWeight: 'bold'
                                }}
                                renderSuggestion={(suggestion, search, highlightedDisplay) => (
                                    <div className="text-[#e0e3e5] font-medium py-1">{highlightedDisplay}</div>
                                )}
                            />
                        </MentionsInput>
                    </div>
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-xs font-bold text-[#a28d7e] uppercase tracking-wider mb-2">Photos (Max 3)</label>
                    
                    <div className="grid grid-cols-3 gap-4">
                        {images.map((img, idx) => (
                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-[#303a47] group">
                                <Image src={img.preview} alt={`Upload ${idx}`} fill className="object-cover" />
                                <button 
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}

                        {images.length < 3 && (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="aspect-square rounded-lg border-2 border-dashed border-[#303a47] hover:border-[#ffc49a] hover:bg-[#1d2430] transition-colors flex flex-col items-center justify-center gap-2 text-[#a28d7e] hover:text-[#ffc49a]"
                            >
                                <Camera className="w-8 h-8" />
                                <span className="text-xs font-bold uppercase tracking-wider">Add Photo</span>
                            </button>
                        )}
                    </div>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageChange}
                        accept="image/*"
                        multiple
                        className="hidden" 
                    />
                </div>

                {/* Submit */}
                <div className="pt-6 border-t border-[#212b37] flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-8 py-3 bg-[#ffc49a] text-[#4f2500] font-bold uppercase tracking-wider rounded-lg transition-colors ${
                            isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#ff9d4d]'
                        }`}
                    >
                        {isSubmitting ? 'Posting...' : 'Post Catch Report'}
                    </button>
                </div>
            </form>
        </div>
    );
}
