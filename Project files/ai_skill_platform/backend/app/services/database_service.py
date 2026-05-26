"""
Database Service Layer
Handles all database operations for the application
"""

from sqlalchemy.orm import Session
from utils import sql_connector
import logging

logger = logging.getLogger(__name__)


class DatabaseService:
    """
    Central service for database operations.
    """
    
    @staticmethod
    def get_session() -> Session:
        """Get a database session."""
        return sql_connector.get_session()
    
    @staticmethod
    def execute_query(query: str, params: dict = None):
        """Execute a SELECT query."""
        return sql_connector.execute_query(query, params)
    
    @staticmethod
    def execute_update(query: str, params: dict = None):
        """Execute an UPDATE/INSERT/DELETE query."""
        return sql_connector.execute_update(query, params)
    
    @staticmethod
    def test_connection() -> bool:
        """Test database connection."""
        return sql_connector.test_connection()


# Initialize service
database_service = DatabaseService()
