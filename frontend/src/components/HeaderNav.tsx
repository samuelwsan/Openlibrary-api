"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldAlert, BookOpen, Search } from "lucide-react";

interface Category {
    id: number;
    nome: string;
    cor: string;
    adulto: boolean;
}

export default function HeaderNav() {
    const [categorias, setCategorias] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // Fallback map for local icons/emojis since API only gives color and text
    const getIcon = (nome: string) => {
        switch (nome.toLowerCase()) {
            case "fantasia": return "📜";
            case "estudo": return "🎓";
            case "quadrinhos": return "🎨";
            case "dark": return <ShieldAlert className="w-4 h-4" />;
            default: return <BookOpen className="w-4 h-4" />;
        }
    };

    useEffect(() => {
        // In production, point to the deployed Render backend
        const fetchCategorias = async () => {
            try {
                const res = await fetch("http://localhost:8000/api/categorias");
                if (res.ok) {
                    const data = await res.json();
                    setCategorias(data.categorias);
                }
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategorias();
    }, []);

    return (
        <header className="sticky top-0 z-10 bg-white/70 dark:bg-[#141414]/70 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 md:px-8 py-4 md:py-0 flex flex-col md:flex-row items-center justify-between md:h-16 gap-3 transition-colors duration-300">
            {/* Mobile Logo */}
            <div className="md:hidden flex items-center justify-between w-full mb-1">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-600/30">
                        <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                        OpenLibrary<span className="font-light">FREE</span>
                    </h1>
                </div>
            </div>

            <nav className="w-full flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0 snap-x">
                {loading ? (
                    <div className="flex gap-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-24 h-10 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    categorias.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/?q=${encodeURIComponent(cat.nome)}`}
                            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm snap-center hover:shadow-md
                ${cat.adulto
                                    ? "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50 dark:hover:bg-red-900/40 relative overflow-hidden group"
                                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-750"
                                }
              `}
                            style={!cat.adulto ? {
                                // subtle tint based on category color for normal items
                            } : {}}
                        >
                            {cat.adulto && (
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                            )}
                            <span className="flex items-center justify-center">
                                {getIcon(cat.nome)}
                            </span>
                            {cat.nome}
                        </Link>
                    ))
                )}
            </nav>
        </header>
    );
}
