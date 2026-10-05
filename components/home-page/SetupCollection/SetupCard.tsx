import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Package, Tag, ArrowRight } from 'lucide-react';

export default function SetupCard({ setup }: { setup: any }) {
    const { 
        bundle_title, 
        slug, 
        description, 
        bundle_price, 
        retail_price, 
        pricing_type, 
        main_image, 
        items,
        inclusions
    } = setup;

    const imageUrl = main_image ? main_image.url : '/placeholder-setup.jpg'; // We can fallback to some default if no image

    const price = bundle_price;
    const oldPrice = retail_price > bundle_price ? retail_price : null;

    return (
        <div className="bg-ma-surface-container rounded-2xl border border-greyColor/20 overflow-hidden flex flex-col group hover:border-primaryColor/50 transition-all shadow-md">
            <div className="relative w-full aspect-video bg-[#121922] overflow-hidden">
                {main_image ? (
                    <Image src={imageUrl} alt={bundle_title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-[#788ca5]">
                        <Package className="w-12 h-12 opacity-20" />
                    </div>
                )}
                {oldPrice && (
                    <div className="absolute top-3 right-3 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                        Save ₱{(oldPrice - price).toFixed(2)}
                    </div>
                )}
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="mb-2">
                    <h3 className="text-lg font-bold text-white leading-tight line-clamp-1">{bundle_title}</h3>
                    {description && (
                        <p className="text-xs text-[#788ca5] line-clamp-2 mt-1.5">{description}</p>
                    )}
                </div>

                <div className="mb-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase text-primaryColor tracking-wider mb-2">
                        <Tag className="w-3 h-3" />
                        <span>Includes {items?.length || 0} items</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5">
                        {items?.slice(0, 3).map((item: any, idx: number) => (
                            <span key={idx} className="bg-white/5 border border-white/10 text-[#d9e3f4] text-[10px] px-2 py-0.5 rounded-md">
                                {item.product?.product_title || 'Item'}
                            </span>
                        ))}
                        {items?.length > 3 && (
                            <span className="bg-white/5 border border-white/10 text-[#788ca5] text-[10px] px-2 py-0.5 rounded-md">
                                +{items.length - 3} more
                            </span>
                        )}
                        {inclusions?.length > 0 && (
                            <span className="bg-primaryColor/10 border border-primaryColor/20 text-primaryColor text-[10px] px-2 py-0.5 rounded-md">
                                + Freebies
                            </span>
                        )}
                    </div>
                </div>

                <div className="mt-auto flex items-end justify-between pt-4 border-t border-greyColor/10">
                    <div>
                        <div className="text-[10px] text-[#788ca5] uppercase font-bold tracking-wider mb-0.5">Bundle Price</div>
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-black text-white">₱{Number(price).toFixed(2)}</span>
                            {oldPrice && (
                                <span className="text-sm text-[#788ca5] line-through decoration-rose-500/50">₱{Number(oldPrice).toFixed(2)}</span>
                            )}
                        </div>
                    </div>

                    <Link 
                        href={`/setups/${slug || setup.setup_id}`}
                        className="w-10 h-10 rounded-full bg-primaryColor text-slate-950 flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-md"
                    >
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
