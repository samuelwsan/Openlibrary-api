"use client";

import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";

const quotes = [
    {
        author: "Marco Aurélio",
        text: "Pense na beleza da vida. Observe as estrelas e veja-se correndo com elas.",
        book: "Meditações"
    },
    {
        author: "Sêneca",
        text: "Sofremos mais na imaginação do que na realidade.",
        book: "Cartas a Lucílio"
    },
    {
        author: "Epicteto",
        text: "Não explique a sua filosofia. Incorpore-a.",
        book: "O Encheirídion"
    },
    {
        author: "Marco Aurélio",
        text: "A nossa vida é aquilo que os nossos pensamentos fizerem dela.",
        book: "Meditações"
    },
    {
        author: "Sêneca",
        text: "Apressa-te a viver bem e pensa que cada dia é, por si só, uma vida.",
        book: "Cartas a Lucílio"
    }
];

export default function StoicHeroBanner() {
    const [quote, setQuote] = useState(quotes[0]);

    useEffect(() => {
        // Pick a random quote on mount
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setQuote(randomQuote);
    }, []);

    return (
        <div className="relative w-full h-[45vh] md:h-[50vh] min-h-[320px] md:min-h-[400px] mb-8 md:mb-12 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl group flex items-end">
            {/* Background Image / Netflix Style Gradient */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=2730&auto=format&fit=crop")',
                }}
            />

            {/* Dark/Red Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/80 to-transparent dark:from-black dark:via-black/80" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-transparent to-transparent dark:from-black" />

            {/* Content */}
            <div className="relative z-10 p-5 md:p-12 w-full max-w-4xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 md:mb-6 text-[10px] md:text-xs font-bold rounded-full bg-red-600/20 text-red-500 border border-red-600/30 backdrop-blur-md uppercase tracking-widest">
                    <BookOpen className="w-3 h-3 md:w-4 md:h-4" /> Destaque do Dia
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-white mb-2 md:mb-4 leading-tight">
                    &quot;{quote.text}&quot;
                </h1>

                <p className="text-sm md:text-xl text-gray-300 font-medium mb-6 md:mb-8">
                    — {quote.author}, <span className="italic text-gray-400">{quote.book}</span>
                </p>

                <div className="flex flex-wrap gap-4">
                    <button className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-600/30 active:scale-95">
                        <BookOpen className="w-5 h-5 fill-current" />
                        Ler Clássico Agora
                    </button>
                    <button className="flex items-center gap-2 px-8 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl backdrop-blur-md transition-all border border-white/10 active:scale-95">
                        Mais Obras
                    </button>
                </div>
            </div>
        </div>
    );
}
