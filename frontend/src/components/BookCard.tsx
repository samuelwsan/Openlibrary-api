import React from 'react';
import { BookOpen, ExternalLink, Download, Globe } from "lucide-react";
import { useState } from "react";

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

    return (
        <div
            className="group relative h-full rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(139,92,246,0.3)] hover:border-purple-500/30 flex flex-col"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Decorative Gradient Background on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-transparent opacity-0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : ''}`} />

            {/* Provider Badge */}
            <div className="absolute top-4 right-4 z-10">
                <span className="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 backdrop-blur-md shadow-sm">
                    {book.source}
                </span>
            </div>

            <div className="flex-1 p-6 flex flex-col items-center text-center relative z-10">
                {/* Elegant Cover Container */}
                <div className={`relative w-40 h-56 mb-6 rounded-xl overflow-hidden shadow-lg border border-white/10 transition-transform duration-500 ${isHovered ? 'scale-105 shadow-purple-500/20' : ''} bg-slate-800 flex items-center justify-center`}>
                    {book.cover_url ? (
                        <img
                            src={book.cover_url}
                            alt={book.title}
                            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                            loading="lazy"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-slate-500">
                            <BookOpen className="w-12 h-12 mb-2 opacity-50" />
                            <span className="text-xs uppercase tracking-widest font-semibold">Sem Capa</span>
                        </div>
                    )}

                    {/* Subtle overlay on cover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Text Details */}
                <div className="flex-1 w-full space-y-3 flex flex-col">
                    <h3 className="text-xl font-bold text-white leading-tight line-clamp-2 min-h-[3rem] group-hover:text-purple-300 transition-colors duration-300">
                        {book.title}
                    </h3>

                    <p className="text-base font-medium text-indigo-200/90 tracking-wider line-clamp-1">
                        {book.author || "Autor Desconhecido"}
                    </p>
                </div>
            </div>

            {/* Action Buttons Section */}
            <div className="p-4 border-t border-white/10 bg-black/20 flex gap-3 relative z-10 backdrop-blur-md">
                {book.preview_url && (
                    <a
                        href={book.preview_url}
                        className="flex-1 flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-95"
                    >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ler
                    </a>
                )}

                {book.download_url && (
                    <a
                        href={book.download_url}
                        className="flex-1 flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] active:scale-95"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Baixar
                    </a>
                )}
            </div>
        </div>
    );
}
