import { monts } from "@/types/fonts";

export default function MainLayout({
    children,
}:{
    children:React.ReactNode
}) {
  return (
    <div className={`${monts.className} h-fit w-full flex flex-col items-center justify-center px-28 py-6 gap-y-2`}>
        {children}
    </div>
  )
}
