import os
from typing import List, Dict
from azure.core.credentials import AzureKeyCredential
from azure.search.documents import SearchClient

class CognitiveSearchService:
    """
    Integration with Azure AI Search for highly performant skill and role indexing.
    """
    
    def __init__(self):
        self.endpoint = os.getenv("AZURE_SEARCH_ENDPOINT")
        self.key = os.getenv("AZURE_SEARCH_KEY")
        self.index_name = os.getenv("AZURE_SEARCH_INDEX", "skills-index")
        self.client = None
        
        if self.endpoint and self.key:
            self.client = SearchClient(
                endpoint=self.endpoint,
                index_name=self.index_name,
                credential=AzureKeyCredential(self.key)
            )

    def search_skills(self, query: str, top: int = 10) -> List[Dict]:
        """
        Perform semantic search across skills and job roles.
        """
        if not self.client:
            # Fallback to simple keyword filtering if search is not configured
            return [{"skill": query, "note": "Search service not configured"}]
            
        results = self.client.search(
            search_text=query,
            query_type="semantic",
            semantic_configuration_name="my-semantic-config",
            top=top
        )
        
        return [dict(res) for res in results]

    def index_documents(self, documents: List[Dict]):
        """
        Upload documents to the Azure Search Index.
        """
        if self.client:
            self.client.upload_documents(documents=documents)

search_service = CognitiveSearchService()
