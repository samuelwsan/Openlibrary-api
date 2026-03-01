"use client";

import Link from "next/link";
import { Library, Sparkles, GraduationCap, Search } from "lucide-react";

export default function MobileBottomNav() {
    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-[#141414]/90 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 flex items-center justify-around px-2 h-16 z-50 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
            <Link href="/" className="flex flex-col items-center justify-center w-full h-full gap-1 text-gray-500 hover:text-red-600 dark:hover:text-red-500 transition-colors">
                <Library className="w-5 h-5" />
                <span className="text-[10px] font-medium tracking-wide">Início</span>
            </Link>
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex flex-col items-center justify-center w-full h-full gap-1 text-gray-500 hover:text-red-600 dark:hover:text-red-500 transition-colors cursor-pointer border-none bg-transparent">
                <Search className="w-5 h-5" />
                <span className="text-[10px] font-medium tracking-wide">Busca</span>
            </button>
            <Link href="/?q=favoritos" className="flex flex-col items-center justify-center w-full h-full gap-1 text-gray-500 hover:text-red-600 dark:hover:text-red-500 transition-colors">
                <Sparkles className="w-5 h-5" />
                <span className="text-[10px] font-medium tracking-wide">Favoritos</span>
            </Link>
            <Link href="/?q=estudo" className="flex flex-col items-center justify-center w-full h-full gap-1 text-gray-500 hover:text-red-600 dark:hover:text-red-500 transition-colors">
                <GraduationCap className="w-5 h-5" />
                <span className="text-[10px] font-medium tracking-wide">Estudar</span>
            </Link>
        </nav>
    );
}
