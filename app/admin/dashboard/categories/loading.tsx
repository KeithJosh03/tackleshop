import React from 'react'

export default function Loading() {
    return (
        <div className='flex flex-col space-y-6 animate-pulse'>
            {/* Header Skeleton */}
            <div className='flex flex-col space-y-2'>
                <div className='h-8 w-64 bg-secondary/20 rounded-md'></div>
                <div className='h-4 w-96 bg-secondary/10 rounded-md'></div>
            </div>

            {/* Layout Skeleton */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 items-start'>

                {/* Brands Column Skeleton */}
                <div className="w-full h-full bg-[#0E1313] border border-greyColor rounded-2xl p-6 flex flex-col space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <div className='flex items-center gap-2'>
                            <div className='w-6 h-6 bg-secondary/20 rounded-md'></div>
                            <div className='w-24 h-6 bg-secondary/20 rounded-md'></div>
                        </div>
                        <div className='w-32 h-8 bg-secondary/20 rounded-lg'></div>
                    </div>
                    <div className='w-full h-10 bg-secondary/10 rounded-lg'></div>
                    <div className="flex flex-col space-y-4 mt-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex justify-between items-center border-b border-greyColor/20 pb-4">
                                <div className='w-8 h-4 bg-secondary/10 rounded'></div>
                                <div className='flex flex-col gap-2 w-full ml-4'>
                                    <div className='w-24 h-4 bg-secondary/20 rounded'></div>
                                    <div className='w-32 h-3 bg-secondary/10 rounded-full'></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Categories Column Skeleton */}
                <div className="lg:col-span-2 w-full h-full bg-[#0E1313] border border-greyColor rounded-2xl p-6 flex flex-col space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <div className='flex items-center gap-2'>
                            <div className='w-6 h-6 bg-secondary/20 rounded-md'></div>
                            <div className='w-32 h-6 bg-secondary/20 rounded-md'></div>
                        </div>
                        <div className='w-40 h-8 bg-secondary/20 rounded-lg'></div>
                    </div>
                    <div className='w-full h-10 bg-secondary/10 rounded-lg'></div>
                    <div className="flex flex-col space-y-4 mt-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex justify-between items-center border-b border-greyColor/20 pb-4">
                                <div className='w-8 h-4 bg-secondary/10 rounded'></div>
                                <div className='flex flex-col gap-2 w-full ml-4'>
                                    <div className='w-32 h-4 bg-secondary/20 rounded'></div>
                                    <div className='w-20 h-3 bg-secondary/10 rounded-full'></div>
                                </div>
                                <div className='w-16 h-8 bg-secondary/20 rounded-lg'></div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}
