import { worksans } from "@/types/fonts";


export default function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${worksans.className} relative w-full 2xl:px-52 lg:px-20 mt-10`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {children}
      </div>
    </div>
  );
}
