import React, { useState, useEffect } from 'react';
import { BookOpen, ExternalLink, Download, Globe, Heart } from "lucide-react";

export interface Book {
    id: string;
    title: string;
    author: string | null;
    source: string;
    download_url: string | null;
    preview_url: string | null;
    cover_url: string | null;
    summary: string | null;
}

export default function BookCard({ book }: { book: Book }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    // Initialize favorite status from localStorage when component mounts
    useEffect(() => {
        try {
            const savedFavorites = JSON.parse(localStorage.getItem('openlibrary_favorites') || '[]');
            setIsFavorite(savedFavorites.some((fav: Book) => fav.id === book.id));
        } catch (e) {
            console.error(e);
        }
    }, [book.id]);

    const toggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const savedFavorites = JSON.parse(localStorage.getItem('openlibrary_favorites') || '[]');

            if (isFavorite) {
                // Remove from favorites
                const updatedStats = savedFavorites.filter((fav: Book) => fav.id !== book.id);
                localStorage.setItem('openlibrary_favorites', JSON.stringify(updatedStats));
                setIsFavorite(false);
            } else {
                // Add to favorites
                savedFavorites.push(book);
                localStorage.setItem('openlibrary_favorites', JSON.stringify(savedFavorites));
                setIsFavorite(true);
            }
        } catch (e) {
            console.error("Failed to save to favorites", e);
        }
    };

    return (
        <div
            className="group relative h-full rounded-2xl bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300 flex flex-col"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Decorative Gradient Background on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-br from-red-600/10 via-red-700/5 to-transparent opacity-0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : ''}`} />

            {/* Provider Badge */}
            <div className="absolute top-4 right-4 z-10">
                <span className="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full bg-red-700/20 text-red-300 border border-red-700/30 backdrop-blur-md shadow-sm">
                    {book.source}
                </span>
            </div>

            <div className="flex-1 p-4 flex flex-col items-center text-center relative z-10">
                {/* Elegant Cover Container */}
                <div className={`relative w-full aspect-[2/3] mb-4 rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-white/10 transition-transform duration-500 ${isHovered ? 'scale-105 shadow-red-600/30' : ''} bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:shadow-2xl`}>
                    {book.cover_url ? (
                        <img
                            src={book.cover_url}
                            alt={book.title}
                            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                            loading="lazy"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                            <BookOpen className="w-10 h-10 mb-2 opacity-50" />
                            <span className="text-[10px] uppercase tracking-widest font-semibold">Sem Capa</span>
                        </div>
                    )}

                    {/* Subtle overlay on cover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Simulated Progress Bar (Kindle Style) */}
                <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full mb-3 overflow-hidden shadow-inner">
                    <div
                        className="h-full bg-red-600 dark:bg-red-600 transition-all duration-1000"
                        style={{ width: `${Math.floor(Math.random() * 80) + 10}%` }} // Random mock progress
                    />
                </div>

                {/* Text Details */}
                <div className="flex-1 w-full space-y-1 flex flex-col items-start text-left">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-red-600 dark:group-hover:text-red-300 transition-colors duration-300">
                        {book.title}
                    </h3>

                    <p className="text-xs font-medium text-gray-500 dark:text-red-200/90 tracking-wide line-clamp-1">
                        {book.author || "Autor Desconhecido"}
                    </p>
                </div>
            </div>

            {/* Action Buttons Section */}
            <div className="px-4 pb-4 bg-transparent flex gap-2 relative z-10 backdrop-blur-md opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 translate-y-0 lg:translate-y-2 lg:group-hover:translate-y-0 absolute bottom-0 left-0 w-full">
                <button
                    onClick={toggleFavorite}
                    className="flex flex-shrink-0 items-center justify-center p-2 rounded-lg text-gray-400 bg-white dark:bg-white/10 hover:bg-red-50 dark:hover:bg-red-900/20 border border-gray-200 dark:border-white/10 transition-all duration-300 shadow-sm active:scale-95 group/heart"
                    title="Adicionar aos Favoritos"
                >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'lg:group-hover/heart:text-red-500 transition-colors'}`} />
                </button>

                {book.preview_url && (
                    <a
                        href={book.preview_url}
                        className="flex-1 flex items-center justify-center py-2 px-3 rounded-lg text-[11px] font-semibold text-gray-700 bg-white dark:text-white dark:bg-white/10 hover:bg-gray-100 dark:hover:bg-white/20 border border-gray-200 dark:border-white/10 transition-all duration-300 shadow-sm active:scale-95"
                    >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Ler
                    </a>
                )}

                {book.download_url && (
                    <a
                        href={book.download_url}
                        className="flex-1 flex items-center justify-center py-2 px-3 rounded-lg text-[11px] font-semibold text-white bg-gradient-to-r from-red-700 to-red-600 dark:from-red-600 dark:to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md active:scale-95"
                    >
                        <Download className="w-3 h-3 mr-1" />
                        Baixar
                    </a>
                )}
            </div>
        </div>
    );
}
