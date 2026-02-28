from abc import ABC, abstractmethod
from typing import List
import schemas


class BookProvider(ABC):
    @abstractmethod
    async def search(self, query: str, limit: int = 20) -> List[schemas.BookDetails]:
        """Search books matching the query text in this provider"""
        pass
