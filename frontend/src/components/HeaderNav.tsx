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
        <header className="sticky top-0 z-10 bg-white/60 dark:bg-[#0a0a0a]/60 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-8 flex items-center justify-between h-20 transition-colors duration-300">
            <div className="flex-1 max-w-2xl relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                </div>
                <input
                    type="text"
                    className="w-full bg-gray-100 dark:bg-gray-800/50 border border-transparent focus:border-purple-500/50 focus:bg-white dark:focus:bg-gray-900 focus:ring-4 focus:ring-purple-500/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none transition-all shadow-sm"
                    placeholder="Busque por livros, autores ou conteúdos no acervo livre..."
                />
            </div>

            <nav className="ml-8 flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
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
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm hover:shadow-md
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
