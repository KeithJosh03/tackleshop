export function SectionCard({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
    return (
        <div className='rounded-xl border border-greyColor bg-blackgroundColor'>
            <div className='flex items-center gap-3 px-5 py-3 border-b border-greyColor rounded-t-xl'
                style={{ background: 'linear-gradient(90deg,rgba(17,26,45,1) 0%,rgba(19,29,41,0.6) 100%)' }}>
                <span className='flex items-center justify-center w-7 h-7 rounded-full bg-primaryColor text-xs font-black text-white shrink-0'>
                    {step}
                </span>
                <h2 className='text-primaryColor font-extrabold tracking-widest text-sm uppercase'>
                    {title}
                </h2>
            </div>
            <div className='p-5'>{children}</div>
        </div>
    );
}