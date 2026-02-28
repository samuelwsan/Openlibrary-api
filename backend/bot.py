import os
import asyncio
import telebot
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
if not TELEGRAM_BOT_TOKEN:
    raise ValueError("TELEGRAM_BOT_TOKEN not found in environment variables")

bot = telebot.TeleBot(TELEGRAM_BOT_TOKEN)

# We need to access our providers to search for books
from providers.gutenberg import GutenbergProvider
from providers.openlibrary import OpenLibraryProvider
from providers.internetarchive import InternetArchiveProvider
from providers.annasarchive import AnnasArchiveProvider

providers = [GutenbergProvider(), OpenLibraryProvider(), InternetArchiveProvider(), AnnasArchiveProvider()]

@bot.message_handler(commands=['start', 'help'])
def send_welcome(message):
    welcome_text = (
        "Olá! Sou o bot do OpenLibraryFREE 📚\n\n"
        "Me envie o nome de um livro, autor ou assunto, e eu buscarei para você em domínio público!\n\n"
        "Exemplo: 'Machado de Assis', 'Dom Casmurro'"
    )
    bot.reply_to(message, welcome_text)

@bot.message_handler(func=lambda message: True)
def handle_search(message):
    query = message.text
    bot.reply_to(message, f"🔍 Buscando por '{query}'... aguarde um instante.")

    # Run the async code in a synchronous context using asyncio
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    try:
        results = loop.run_until_complete(perform_search(query))
        
        if not results:
            bot.send_message(message.chat.id, "Nenhum livro encontrado para essa busca. Tente outros termos.")
            return

        response_text = f"📚 *Resultados para '{query}':*\n\n"
        for i, book in enumerate(results[:5]): # Limits to 5 results to not flood chat
            response_text += f"*{i+1}. {book.title}*\n"
            response_text += f"👤 Autor: {book.author or 'Desconhecido'}\n"
            response_text += f"📖 Fonte: {book.source}\n"
            if book.download_url:
                response_text += f"⬇️ [Baixar Livro]({book.download_url})\n"
            elif book.preview_url:
                response_text += f"👀 [Ler Online]({book.preview_url})\n"
            response_text += "\n"
        
        bot.send_message(message.chat.id, response_text, parse_mode="Markdown", disable_web_page_preview=True)

    except Exception as e:
        print(f"Error during bot search: {e}")
        bot.send_message(message.chat.id, "Ocorreu um erro ao buscar os livros. Tente novamente mais tarde.")
    finally:
        loop.close()

async def perform_search(query: str) -> list:
    tasks = [provider.search(query, limit=5) for provider in providers]
    provider_results = await asyncio.gather(*tasks, return_exceptions=True)

    all_books = []
    for res in provider_results:
        if isinstance(res, Exception):
            continue
        if isinstance(res, list):
            all_books.extend(res)
            
    return all_books

def run_bot():
    print("Iniciando o Bot do Telegram...")
    bot.polling(none_stop=True)
