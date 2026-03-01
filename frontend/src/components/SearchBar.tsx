import React, { useState, useRef } from 'react';
import { Search, Loader2 } from "lucide-react";

interface SearchBarProps {
    onSearch: (query: string) => void;
    isLoading?: boolean;
}

export default function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto relative group">
            {/* Dynamic Glow Effect */}
            <div className={`absolute -inset-1 bg-gradient-to-r from-red-700 via-red-600 to-pink-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 ${isFocused ? 'opacity-50 blur-md' : ''}`}></div>

            <div className="relative flex items-center w-full h-16 sm:h-20 bg-slate-900/80 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl overflow-hidden transition-all duration-300 focus-within:border-red-500/50 focus-within:bg-slate-900">
                <div className="flex items-center justify-center pl-6 sm:pl-8">
                    <Search className={`w-6 h-6 transition-colors duration-300 ${isFocused ? 'text-red-500' : 'text-slate-400'}`} />
                </div>

                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Busque por título, autor ou assunto (ex: Machado de Assis)..."
                    className="w-full h-full pl-4 pr-4 bg-transparent text-white placeholder:text-slate-400 text-lg sm:text-xl focus:outline-none transition-colors"
                    disabled={isLoading}
                />

                <div className="pr-3 sm:pr-4 flex items-center">
                    <button
                        type="submit"
                        disabled={isLoading || !query.trim()}
                        className="flex items-center justify-center h-12 w-28 sm:h-14 sm:w-36 rounded-full bg-gradient-to-r from-red-600 to-red-600 font-bold text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] disabled:opacity-50 disabled:cursor-not-allowed hover:from-red-700 hover:to-red-600 transition-all duration-300 active:scale-95 group/btn overflow-hidden relative"
                    >
                        {/* Button Shine Effect */}
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/btn:animate-[shine_1.5s_ease-in-out_infinite]" />

                        {isLoading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <span className="text-base sm:text-lg tracking-wide">Buscar</span>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
}
