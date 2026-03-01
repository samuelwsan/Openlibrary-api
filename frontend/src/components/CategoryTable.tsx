"use client";

import { useState } from "react";
import { Book } from "./BookCard";
import { ChevronLeft, ChevronRight, BookOpen, ExternalLink, Download } from "lucide-react";

interface CategoryTableProps {
    books: Book[];
    categoryName: string;
}

export default function CategoryTable({ books, categoryName }: CategoryTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(books.length / itemsPerPage);

    // Calculate current slice
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBooks = books.slice(indexOfFirstItem, indexOfLastItem);

    const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

    return (
        <div className="w-full bg-white dark:bg-[#111111] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            {/* Header Area */}
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-[#151515]">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="capitalize">{categoryName}</span>
                        <span className="text-sm font-normal text-gray-500 bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                            Top 100
                        </span>
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Exibindo lote de {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, books.length)}</p>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Lote Anterior"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-medium px-2 text-gray-600 dark:text-gray-300">
                        Página {currentPage} de {totalPages || 1}
                    </span>
                    <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Próximo Lote"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Table Body */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-[#141414]/50 text-sm">
                            <th className="py-4 px-6 font-semibold text-gray-500 dark:text-gray-400 w-16">Nº</th>
                            <th className="py-4 px-6 font-semibold text-gray-500 dark:text-gray-400">Título & Capa</th>
                            <th className="py-4 px-6 font-semibold text-gray-500 dark:text-gray-400 w-48">Autor</th>
                            <th className="py-4 px-6 font-semibold text-gray-500 dark:text-gray-400 w-32">Origem</th>
                            <th className="py-4 px-6 font-semibold text-gray-500 dark:text-gray-400 text-right w-36">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80">
                        {currentBooks.length > 0 ? (
                            currentBooks.map((book, index) => (
                                <tr key={book.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors group">
                                    <td className="py-4 px-6 text-gray-400 font-medium">
                                        #{indexOfFirstItem + index + 1}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-16 bg-gray-200 dark:bg-gray-800 rounded shadow-sm overflow-hidden flex-shrink-0 flex items-center justify-center">
                                                {book.cover_url ? (
                                                    <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <BookOpen className="w-5 h-5 text-gray-400" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                                                    {book.title}
                                                </h3>
                                                <div className="w-24 h-1 mt-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                                                    <div className="h-full bg-red-600" style={{ width: `${Math.floor(Math.random() * 80) + 10}%` }} />
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">
                                        {book.author || "Desconhecido"}
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="px-2.5 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-xs font-medium rounded-full border border-red-100 dark:border-red-800/50">
                                            {book.source}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right space-x-2">
                                        {book.preview_url && (
                                            <a href={book.preview_url} className="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white transition-colors" title="Ler online">
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        )}
                                        {book.download_url && (
                                            <a href={book.download_url} className="inline-flex items-center justify-center p-2 rounded-lg text-white bg-red-600 hover:bg-red-700 shadow-sm transition-colors" title="Baixar livro">
                                                <Download className="w-4 h-4" />
                                            </a>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="py-12 text-center text-gray-500">
                                    Nenhum livro encontrado para esta categoria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
