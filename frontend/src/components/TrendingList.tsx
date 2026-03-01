"use client";

import { useEffect, useState, useRef } from "react";
import { Book } from "./BookCard";
import { BookOpen, ExternalLink, Download, Heart, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function TrendingList() {
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const apiUrl = process.env.NODE_ENV === "production"
                    ? "https://openlibrary-api-t91i.onrender.com"
                    : "http://localhost:8000";

                const response = await fetch(`${apiUrl}/api/destaques`);

                if (response.ok) {
                    const data = await response.json();
                    setBooks(data);
                }
            } catch (err) {
                console.error("Failed to load trending books", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTrending();
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 600;
            const newScrollPosition = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
            scrollContainerRef.current.scrollTo({
                left: newScrollPosition,
                behavior: 'smooth'
            });
        }
    };

    if (isLoading) {
        return (
            <div className="w-full mb-12">
                <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-6 h-6 text-red-600" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Os Mais Lidos</h2>
                </div>
                <div className="flex gap-6 overflow-hidden mt-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex-shrink-0 w-44 md:w-52 h-64 md:h-72 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (books.length === 0) return null;

    return (
        <div className="w-full mb-16 relative group">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-red-600 dark:text-red-500" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Destaques do Dia
                    </h2>
                </div>

                {/* Desktop Navigation Buttons */}
                <div className="hidden md:flex gap-2">
                    <button
                        onClick={() => scroll('left')}
                        className="p-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors shadow-sm"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="p-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors shadow-sm"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Horizontal Scroll Container */}
            <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-8 pt-2"
                style={{ scrollBehavior: 'smooth' }}
            >
                {books.map((book, index) => (
                    <div key={book.id} className="snap-start snap-always shrink-0 group/card relative w-40 md:w-48 transition-transform duration-300 hover:-translate-y-2">
                        {/* Rank Number Overlay */}
                        <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-red-600 to-red-600 text-white font-black text-xl flex items-center justify-center rounded-xl shadow-lg z-20 border-2 border-white dark:border-gray-900 rotate-[-10deg]">
                            #{index + 1}
                        </div>

                        {/* Cover Image */}
                        <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-md group-hover/card:shadow-2xl transition-shadow bg-gray-100 dark:bg-gray-800 mb-3">
                            {book.cover_url ? (
                                <img
                                    src={book.cover_url}
                                    alt={book.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center p-4">
                                    <BookOpen className="w-8 h-8 text-gray-300 mb-2" />
                                </div>
                            )}

                            {/* Hover Overlay actions */}
                            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center gap-3 lg:inset-0 lg:bg-black/60 lg:opacity-0 lg:group-hover/card:opacity-100 transition-opacity duration-300 lg:items-center lg:backdrop-blur-[2px]">
                                {book.preview_url && (
                                    <a
                                        href={book.preview_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 bg-white/20 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg backdrop-blur-md"
                                        title="Ler online"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                                {book.download_url && (
                                    <a
                                        href={book.download_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 bg-white/20 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-colors shadow-lg backdrop-blur-md"
                                        title="Baixar Livro"
                                    >
                                        <Download className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Book Info */}
                        <div className="px-1">
                            <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover/card:text-red-600 dark:group-hover/card:text-red-500 transition-colors">
                                {book.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                                {book.author || "Autor Desconhecido"}
                            </p>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
