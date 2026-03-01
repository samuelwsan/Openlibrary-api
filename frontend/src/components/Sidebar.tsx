import Link from "next/link";
import { Book, Library, Settings, Flame, GraduationCap, Image as ImageIcon, Sparkles, SlidersHorizontal, User } from "lucide-react";

export default function Sidebar() {
    return (
        <aside className="w-64 h-screen bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800 flex flex-col p-6 sticky top-0 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <Book className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                    OpenLibrary<span className="font-light">FREE</span>
                </h1>
            </div>

            <nav className="flex-1 space-y-8">
                <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-2">
                        Biblioteca
                    </p>
                    <ul className="space-y-1">
                        <li>
                            <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900 font-medium transition-all shadow-md">
                                <Library className="w-5 h-5" />
                                Início
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white transition-all">
                                <Book className="w-5 h-5" />
                                Meus Livros
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-2">
                        Suas Coleções
                    </p>
                    <ul className="space-y-1">
                        <li>
                            <Link href="/?q=favoritos" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white transition-all">
                                <Sparkles className="w-5 h-5 text-purple-500" />
                                Favoritos
                            </Link>
                        </li>
                        <li>
                            <Link href="/?q=estudo" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white transition-all">
                                <GraduationCap className="w-5 h-5 text-blue-500" />
                                Para Estudar
                            </Link>
                        </li>
                        <li>
                            <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white transition-all w-full text-left">
                                <span className="text-xl leading-none">+</span> Nova Coleção
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>

            <div className="mt-auto space-y-4 pt-6 mt-8 border-t border-gray-200 dark:border-gray-800">
                <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2">
                        Filtros
                    </p>
                    <div className="flex items-center justify-between px-3 py-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Público Geral
                        </span>
                        <div className="w-10 h-5 bg-blue-500 rounded-full flex items-center p-1 shadow-inner cursor-pointer">
                            <div className="w-3.5 h-3.5 bg-white rounded-full translate-x-4.5 shadow-sm"></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                            <Flame className="w-4 h-4 text-red-500" />
                            Conteúdo Adulto
                        </span>
                        <div className="w-10 h-5 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center p-1 shadow-inner cursor-pointer">
                            <div className="w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform"></div>
                        </div>
                    </div>
                </div>

                <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white transition-all">
                    <Settings className="w-5 h-5" />
                    Configurações
                </Link>
            </div>
        </aside>
    );
}
