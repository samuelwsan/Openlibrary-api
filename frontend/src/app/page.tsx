"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import BookCard, { Book } from "@/components/BookCard";
import { BookMarked, Search } from "lucide-react";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setHasSearched(true);
    setError(null);
    setBooks([]);

    try {
      // Connect to FastAPI backend
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
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
    <div className="min-h-screen flex flex-col items-center">
      {/* Hero Section */}
      <div className={`w-full relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 transition-all duration-700 ease-in-out ${hasSearched ? 'py-16 shadow-2xl' : 'py-32 h-[65vh] flex flex-col justify-center'} px-6 rounded-b-[4rem]`}>
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-40 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-4xl mx-auto w-full text-center space-y-8 relative z-10">
          <div className="flex justify-center mb-6">
            <div className={`relative flex items-center justify-center ${hasSearched ? 'w-16 h-16' : 'w-28 h-28'} transition-all duration-500 bg-white/10 rounded-3xl backdrop-blur-md shadow-[0_0_40px_rgba(168,85,247,0.3)] border border-white/20`}>
              <BookMarked className={`${hasSearched ? 'w-8 h-8' : 'w-14 h-14'} text-purple-300 transition-all duration-500 drop-shadow-md`} />
            </div>
          </div>
          <h1 className={`${hasSearched ? 'text-4xl' : 'text-5xl md:text-7xl'} font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-purple-200 tracking-tight transition-all duration-500 drop-shadow-sm`}>
            Busca de Livros Abertos
          </h1>
          <p className={`${hasSearched ? 'text-lg opacity-0 h-0 overflow-hidden' : 'text-xl md:text-2xl text-indigo-100/90 max-w-2xl mx-auto h-auto opacity-100'} transition-all duration-500 font-medium tracking-wide`}>
            Encontre literatura de domínio público, clássicos da língua portuguesa e materiais para o ENEM em um só lugar.
          </p>

          <div className="pt-8">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </div>
      </div>

      {/* Results Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12">
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-center shadow-sm">
            {error}
          </div>
        )}

        {!isLoading && !error && hasSearched && books.length === 0 && (
          <div className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/50 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-600 text-2xl font-bold mb-2">Nenhum livro encontrado</p>
            <p className="text-gray-500 text-lg">Tente buscar por outros termos ou autores. Que tal verificar a ortografia?</p>
          </div>
        )}

        {!isLoading && books.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
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
      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-sm text-gray-400 mt-auto border-t border-gray-100">
        <p className="flex items-center justify-center gap-1 font-medium">
          Desenvolvido por Samuel
        </p>
      </footer>
    </div>
  );
}
