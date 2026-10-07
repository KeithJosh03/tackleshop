'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MentionsInput, Mention, SuggestionDataItem } from 'react-mentions';
import { searchProductsForMentions, storeBlog, updateBlog } from '@/lib/api/blogService';
import { uploadImages } from '@/lib/api/uploadImage';
import { UploadImageProps } from '@/lib/api/productService';
import { Camera, X, CheckCircle2, AlertCircle, Sparkles, MapPin, Navigation, Tag } from 'lucide-react';
import Image from 'next/image';
import FileDropImage from '@/components/ui/FileDropImage';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

interface CreateBlogClientProps {
    initialData?: {
        id: number;
        title: string;
        location?: string | null;
        caption_html: string;
        images: { url: string; is_main: boolean }[];
        tagged_products: { id: number; title: string; price: string; image: string | null }[];
    };
    blogId?: string | number;
}

export default function CreateBlogClient({ initialData, blogId }: CreateBlogClientProps) {
    const router = useRouter();
    const [title, setTitle] = useState(initialData?.title || '');
    const [location, setLocation] = useState(initialData?.location || '');

    const cleanInitialCaption = (html: string = '') => {
        return html
            .replace(/<p[^>]*>.*?Location:.*?<\/p>/gi, '')
            .replace(/<strong[^>]*>@(.*?)<\/strong>/g, '@$1')
            .replace(/<br\s*[\/]?>/gi, '\n');
    };
    const [caption, setCaption] = useState(cleanInitialCaption(initialData?.caption_html));

    const [images, setImages] = useState<{ file?: File; preview: string; isExisting?: boolean }[]>(
        initialData?.images.map(img => {
            const fullUrl = img.url.startsWith('http') ? img.url : `${BASE_URL}${img.url}`;
            return {
                preview: fullUrl,
                isExisting: true
            };
        }) || []
    );

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDetectingLocation, setIsDetectingLocation] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Dynamic search for @ mentions
    const fetchUsers = async (query: string, callback: (data: SuggestionDataItem[]) => void) => {
        if (!query) return;
        const results = await searchProductsForMentions(query);
        callback(results.map(r => ({ id: r.id.toString(), display: r.display })));
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    // Auto-detect location using browser GPS and reverse geocoding
    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setIsDetectingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await res.json();

                    const address = data.address;
                    const spotName = address.water || address.body_of_water || address.suburb || address.city || address.town || address.county || "Current Location";

                    setLocation(spotName);
                } catch (err) {
                    setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                } finally {
                    setIsDetectingLocation(false);
                }
            },
            (error) => {
                console.error(error);
                alert("Unable to retrieve your location. Please type it manually.");
                setIsDetectingLocation(false);
            },
            { timeout: 10000 }
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title.trim() || !caption.trim()) {
            setError('Title and Story are required to publish your catch report!');
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Separate new local files from existing image URLs
            const newImageFiles = images.filter(img => !img.isExisting && img.file);
            const existingUrls = images.filter(img => img.isExisting).map(img => {
                return img.preview.startsWith(BASE_URL) ? img.preview.replace(BASE_URL, '') : img.preview;
            });

            let uploadedUrls: string[] = [...existingUrls];

            if (newImageFiles.length > 0) {
                const uploadPayload: UploadImageProps[] = newImageFiles.map((img, idx) => ({
                    file: img.file as File,
                    originIndex: idx,
                }));
                const uploadRes = await uploadImages(uploadPayload);
                const newUrls = uploadRes.map(res => res.url);
                uploadedUrls = [...uploadedUrls, ...newUrls];
            }

            // 2. Extract Tagged Product IDs from react-mentions format: @[display](id)
            const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g;
            const taggedProductIds = new Set<number>();
            let match;
            while ((match = mentionRegex.exec(caption)) !== null) {
                taggedProductIds.add(Number(match[2]));
            }

            // 3. Convert caption to HTML for rendering
            let captionHtml = caption.replace(/@\[([^\]]+)\]\(([^)]+)\)/g, '<strong class="text-[#ffc49a]">@$1</strong>');
            captionHtml = captionHtml.replace(/\n/g, '<br />');

            // 4. Call Store or Update API service
            let successStatus = false;
            if (blogId) {
                successStatus = await updateBlog(blogId, {
                    title,
                    location: location.trim() || null,
                    caption_html: captionHtml,
                    images: uploadedUrls,
                    tagged_products: Array.from(taggedProductIds),
                });
            } else {
                successStatus = await storeBlog({
                    title,
                    location: location.trim() || null,
                    caption_html: captionHtml,
                    images: uploadedUrls,
                    tagged_products: Array.from(taggedProductIds),
                });
            }

            if (successStatus) {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/blogs');
                    router.refresh();
                }, 1500);
            } else {
                setError('Failed to save catch report. Please try again.');
                setIsSubmitting(false);
            }
        } catch (err) {
            setError('An error occurred during submission.');
            setIsSubmitting(false);
        }
    };

    // Perfectly matched padding layout for react-mentions layers
    const defaultStyle = {
        control: {
            backgroundColor: '#0b0f10',
            fontSize: '14px',
            fontFamily: 'inherit',
        },
        '&multiLine': {
            control: {
                minHeight: 140,
                backgroundColor: '#0b0f10',
                borderRadius: '0.5rem',
                border: '1px solid #303a47',
            },
            highlighter: {
                padding: '16px',
            },
            input: {
                padding: '16px',
                outline: 'none',
                color: '#e0e3e5',
            },
        },
        suggestions: {
            list: {
                backgroundColor: '#161b22',
                border: '1px solid #303a47',
                fontSize: 13,
                borderRadius: '0.5rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
                zIndex: 100,
                marginTop: '6px',
                maxHeight: '220px',
                overflowY: 'auto' as const,
            },
            item: {
                padding: '10px 14px',
                borderBottom: '1px solid #212936',
                color: '#e0e3e5',
                cursor: 'pointer',
                '&focused': {
                    backgroundColor: '#1f293a',
                    color: '#ffc49a',
                },
            },
        },
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center py-24 bg-[#14181a] rounded-xl border border-[#303a47] shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-[#44e1a0]/10 flex items-center justify-center mb-4 border border-[#44e1a0]/30">
                    <CheckCircle2 className="w-8 h-8 text-[#44e1a0]" />
                </div>
                <h2 className="text-2xl font-[900] text-white uppercase tracking-tight mb-2">
                    {blogId ? 'Catch Successfully Updated!' : 'Catch Successfully Posted!'}
                </h2>
                <p className="text-xs text-[#a28d7e] tracking-wider uppercase font-semibold">Redirecting you to the community feed...</p>
            </div>
        );
    }

    return (
        <div className="bg-[#14181a] rounded-xl border border-[#303a47] overflow-hidden shadow-2xl">
            {/* Header Banner */}
            <div className="p-6 border-b border-[#22282f] flex items-center justify-between bg-[#191e23]">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#ffc49a]/10 border border-[#ffc49a]/30 flex items-center justify-center text-[#ffc49a]">
                        <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                        <h2 className="text-lg font-[900] text-[#e0e3e5] uppercase tracking-tight">
                            {blogId ? 'Edit Catch Report' : 'Share Your Catch Report'}
                        </h2>
                        <p className="text-[11px] text-[#a28d7e]">Inspire fellow anglers and tag the gear that got the job done.</p>
                    </div>
                </div>
                <button
                    onClick={() => router.back()}
                    className="w-8 h-8 rounded-lg bg-[#0b0f10] border border-[#303a47] flex items-center justify-center text-[#a28d7e] hover:text-white hover:border-[#ffc49a] transition-all"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col gap-6">
                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-400 text-xs font-semibold">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                    </div>
                )}

                {/* Title Input */}
                <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-[#a28d7e] uppercase tracking-widest">Catch Headline</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Massive 12lb Seabass at Sunrise"
                        className="w-full bg-[#0b0f10] border border-[#303a47] rounded-lg px-4 py-3 text-sm text-[#e0e3e5] focus:outline-none focus:border-[#ffc49a] transition-colors"
                        maxLength={100}
                    />
                </div>

                {/* Location Input */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#a28d7e] uppercase tracking-widest flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#ffc49a]" /> Fishing Spot / Location
                        </label>
                        <button
                            type="button"
                            onClick={handleDetectLocation}
                            disabled={isDetectingLocation}
                            className="text-[10px] text-[#ffc49a] hover:underline flex items-center gap-1 font-semibold disabled:opacity-50"
                        >
                            <Navigation className={`w-3 h-3 ${isDetectingLocation ? 'animate-spin' : ''}`} />
                            {isDetectingLocation ? 'Detecting...' : 'Use My GPS'}
                        </button>
                    </div>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g., Matina Aplaya, Davao City"
                        className="w-full bg-[#0b0f10] border border-[#303a47] rounded-lg px-4 py-3 text-sm text-[#e0e3e5] focus:outline-none focus:border-[#ffc49a] transition-colors"
                        maxLength={100}
                    />
                    <p className="text-[10px] text-[#a28d7e]">
                        Tip: GPS can sometimes show your regional provider node. You can freely edit or type your exact spot.
                    </p>
                </div>

                {/* Story / Mentions Input */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#a28d7e] uppercase tracking-widest">The Story & Details</label>
                        <span className="text-[10px] text-[#ffc49a] font-semibold flex items-center gap-1">
                            <Tag className="w-3 h-3" /> Type @ to tag gear
                        </span>
                    </div>

                    <div className="rounded-lg relative overflow-visible transition-all focus-within:ring-1 focus-within:ring-[#ffc49a]">
                        <MentionsInput
                            value={caption}
                            onChange={(e, newValue) => setCaption(newValue)}
                            classNames={{
                                control: 'mentions__control bg-[#0b0f10] border border-[#303a47] rounded-lg min-h-[140px]',
                                highlighter: 'mentions__highlighter text-transparent whitespace-pre-wrap break-words',
                                input: 'mentions__input text-[#e0e3e5] text-sm outline-none resize-y',
                                suggestions: {
                                    list: 'bg-[#161b22] border border-[#303a47] text-xs rounded-lg shadow-2xl z-50 mt-1 max-h-[220px] overflow-y-auto',
                                    item: 'py-2.5 px-3.5 border-b border-[#212936] text-[#e0e3e5] cursor-pointer hover:bg-[#1f293a] hover:text-[#ffc49a] transition-colors',
                                }
                            }}
                            placeholder="Describe the fight, weather, technique, and how your setup performed..."
                        >
                            <Mention
                                trigger="@"
                                data={fetchUsers}
                                markup="@[__display__](__id__)"
                                displayTransform={(id, display) => `@${display}`}
                                style={{
                                    backgroundColor: 'rgba(255, 196, 154, 0.25)',
                                    color: '#ffc49a',
                                    borderRadius: '4px',
                                    fontWeight: 'bold',
                                }}
                                renderSuggestion={(suggestion, search, highlightedDisplay) => (
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-6 h-6 rounded bg-[#0b0f10] border border-[#303a47] flex items-center justify-center text-[9px] text-[#ffc49a] font-bold uppercase flex-shrink-0">
                                            Gear
                                        </div>
                                        <div className="text-xs font-semibold text-[#e0e3e5] truncate">
                                            {highlightedDisplay}
                                        </div>
                                    </div>
                                )}
                            />
                        </MentionsInput>
                    </div>




                </div>

                {/* Image Upload Area */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#a28d7e] uppercase tracking-widest">Catch Photos (Up to 3)</label>
                        <span className="text-[10px] text-[#a28d7e]">{images.length}/3 uploaded</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {images.map((img, idx) => (
                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-[#303a47] bg-[#0b0f10] group shadow-inner">
                                <Image src={img.preview} alt={`Upload ${idx}`} fill className="object-cover" />
                                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-bold text-white uppercase tracking-wider">
                                    {idx === 0 ? 'Cover' : `Photo ${idx + 1}`}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-2 right-2 w-7 h-7 bg-red-500/80 rounded-lg flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}

                        {images.length < 3 && (
                            <FileDropImage
                                maxImages={3 - images.length}
                                onFileChange={(files) => {
                                    const newFiles = Array.isArray(files) ? files : [files];
                                    const newImageObjects = newFiles.map(file => ({
                                        file,
                                        preview: URL.createObjectURL(file),
                                        isExisting: false,
                                    }));
                                    setImages(prev => [...prev, ...newImageObjects]);
                                }}
                                className="aspect-square rounded-lg border-2 border-dashed border-[#303a47] hover:border-[#ffc49a] hover:bg-[#191e23] transition-all flex flex-col items-center justify-center gap-2 text-[#a28d7e] hover:text-[#ffc49a] cursor-pointer group"
                            >
                                <div className="w-10 h-10 rounded-full bg-[#0b0f10] border border-[#303a47] flex items-center justify-center group-hover:border-[#ffc49a] transition-colors">
                                    <Camera className="w-5 h-5 text-[#ffc49a]" />
                                </div>
                                <span className="text-[11px] font-bold uppercase tracking-wider">Add Photo</span>
                            </FileDropImage>
                        )}
                    </div>
                </div>

                {/* Submit Actions */}
                <div className="pt-6 border-t border-[#22282f] flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 bg-transparent border border-[#303a47] text-[#a28d7e] hover:text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-8 py-3 bg-[#ffc49a] text-[#4f2500] font-bold text-xs uppercase tracking-widest rounded-lg transition-all shadow-[0_0_20px_-5px_rgba(255,196,154,0.3)] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#ffb47c] hover:shadow-[0_0_25px_-2px_rgba(255,196,154,0.5)]'
                            }`}
                    >
                        {isSubmitting ? (blogId ? 'Updating Report...' : 'Publishing Report...') : (blogId ? 'Save Changes' : 'Publish Catch Report')}
                    </button>
                </div>
            </form>
        </div>
    );
}