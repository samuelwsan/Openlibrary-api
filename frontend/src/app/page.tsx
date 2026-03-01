"use client";

import { useState, useEffect, Suspense } from "react";
import SearchBar from "@/components/SearchBar";
import BookCard, { Book } from "@/components/BookCard";
import CategoryTable from "@/components/CategoryTable";
import HeaderNav from "@/components/HeaderNav";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";

function LibraryContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q');

  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCategoryMode, setIsCategoryMode] = useState(false);

  const categoryOptions = ["romance", "fantasia", "dark", "ficcao_cientifica"];

  useEffect(() => {
    if (q === 'favoritos') {
      setIsCategoryMode(false);
      loadFavorites();
    } else if (q && categoryOptions.includes(q.toLowerCase())) {
      setIsCategoryMode(true);
      fetchCategory(q.toLowerCase());
    } else if (q) {
      setIsCategoryMode(false);
      handleSearch(q);
    }
  }, [q]);

  const fetchCategory = async (category: string) => {
    setIsLoading(true);
    setHasSearched(true);
    setError(null);
    setBooks([]);

    try {
      const response = await fetch(`https://openlibrary-api-t91i.onrender.com/api/categoria/${encodeURIComponent(category)}`);
      // Use local backend if standard render is failing
      // const response = await fetch(`http://localhost:8000/api/categoria/${encodeURIComponent(category)}`);
      if (!response.ok) {
        throw new Error("Erro ao buscar categoria");
      }
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar esta categoria.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadFavorites = () => {
    setIsLoading(true);
    setHasSearched(true);
    setError(null);
    try {
      const savedFavorites = JSON.parse(localStorage.getItem('openlibrary_favorites') || '[]');
      setBooks(savedFavorites);
    } catch (e) {
      console.error(e);
      setError("Não foi possível carregar seus favoritos.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setHasSearched(true);
    setError(null);
    setBooks([]);

    try {
      // Connect to FastAPI backend
      const response = await fetch(`https://openlibrary-api-t91i.onrender.com/api/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error("Erro ao buscar livros");
      }
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      console.error(err);
      setError("Não foi possível conectar ao servidor de busca. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Simplified Search Section */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          {q ? `Resultados para: ${q}` : "Sua Biblioteca"}
        </h1>
        <div className="max-w-2xl">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 px-6 py-4 rounded-xl shadow-sm max-w-2xl">
          {error}
        </div>
      )}

      {!isLoading && !error && hasSearched && books.length === 0 && (
        <div className="text-center py-24 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-900 dark:text-white text-xl font-semibold mb-2">Nenhum livro encontrado</p>
          <p className="text-gray-500 dark:text-gray-400">Tente buscar por outros termos ou autores. Que tal verificar a ortografia?</p>
        </div>
      )}

      {/* Conditional Rendering: Grid vs Table */}
      {!isLoading && books.length > 0 && (
        isCategoryMode ? (
          <CategoryTable books={books} categoryName={q || ""} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )
      )}

      {/* Easter Egg Meme */}
      <div className="mt-28 flex flex-col items-center justify-center pointer-events-none opacity-90 transition-all hover:opacity-100 duration-500">
        <img
          src="/Gato de touca indignado.jpg"
          alt="Mulher pelo amor de deus meme"
          className="w-56 md:w-72 rounded-3xl shadow-2xl shadow-purple-900/20 rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300 border-4 border-white/50 backdrop-blur-md pointer-events-auto"
        />
        <p className="mt-4 font-bold text-lg text-purple-200 tracking-wider pointer-events-auto drop-shadow-md">
          &quot; Mucura e pe de Pato Y &gt; S
        </p>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto w-full bg-gray-50/50 dark:bg-[#0a0a0a]">
      <HeaderNav />
      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-8 py-8">
        <Suspense fallback={<div className="p-8 text-center text-gray-500">Carregando biblioteca...</div>}>
          <LibraryContent />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-sm text-gray-400 mt-auto border-t border-gray-100 dark:border-gray-800">
        <p className="flex items-center justify-center gap-1 font-medium">
          Desenvolvido por Samuel
        </p>
      </footer>
    </div>
  );
}
