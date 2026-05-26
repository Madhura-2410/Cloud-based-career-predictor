"""
Azure SQL Database Connector
This module provides utilities for database operations using SQL Alchemy ORM.
Supports connection pooling, migrations, and async operations.
"""

import os
from typing import Optional, Any
from urllib.parse import quote_plus
from sqlalchemy import create_engine, text, pool, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import NullPool
import logging

logger = logging.getLogger(__name__)

# Base class for all ORM models
Base = declarative_base()


class AzureSQLConnector:
    """
    Manages connections to Azure SQL Database.
    Handles connection pooling, initialization, and session management.
    """
    
    def __init__(self):
        """Initialize SQL Database connection."""
        connection_string = os.getenv("SQLALCHEMY_DATABASE_URL")
        
        if not connection_string:
            # Build connection string from individual components
            sql_server = os.getenv("SQL_SERVER", "localhost")
            sql_database = os.getenv("SQL_DATABASE", "ai_skill_platform_db")
            sql_username = os.getenv("SQL_USERNAME", "sa")
            sql_password = os.getenv("SQL_PASSWORD", "password")
            sql_driver = "ODBC Driver 17 for SQL Server"
            
            connection_string = (
                f"mssql+pyodbc://{sql_username}:{sql_password}@"
                f"{sql_server}/{sql_database}?"
                f"driver={sql_driver}"
            )
        
        # Create engine with connection pooling
        try:
            self.engine = create_engine(
                connection_string,
                poolclass=pool.QueuePool,
                pool_size=10,
                max_overflow=20,
                pool_pre_ping=True,  # Test connections before using
                pool_recycle=3600,   # Recycle connections after 1 hour
                echo=os.getenv("SQL_ECHO", "false").lower() == "true"
            )
            
            # Create session factory
            self.SessionLocal = sessionmaker(
                autocommit=False,
                autoflush=False,
                bind=self.engine
            )
            self.is_configured = True
            logger.info("Azure SQL Database connector initialized")
        except Exception as e:
            logger.warning(f"⚠️ SQL Connector initialization failed: {str(e)}")
            self.engine = None
            self.SessionLocal = None
            self.is_configured = False

    def _build_connection_string(self, database: Optional[str] = None) -> str:
        """Build a SQLAlchemy connection string for SQL Server."""
        sql_server = os.getenv("SQL_SERVER", "localhost")
        sql_database = database or os.getenv("SQL_DATABASE", "ai_skill_platform_db")
        sql_username = os.getenv("SQL_USERNAME", "sa")
        sql_password = os.getenv("SQL_PASSWORD", "password")
        sql_driver = "ODBC Driver 17 for SQL Server"

        return (
            f"mssql+pyodbc://{sql_username}:{quote_plus(sql_password)}@"
            f"{sql_server}/{sql_database}?"
            f"driver={quote_plus(sql_driver)}"
        )

    def create_database_if_missing(self) -> bool:
        """Create the configured database if it does not yet exist."""
        sql_database = os.getenv("SQL_DATABASE", "ai_skill_platform_db")
        try:
            master_connection_string = self._build_connection_string(database="master")
            master_engine = create_engine(
                master_connection_string,
                poolclass=NullPool,
                pool_pre_ping=True,
                echo=os.getenv("SQL_ECHO", "false").lower() == "true"
            )

            with master_engine.connect().execution_options(isolation_level="AUTOCOMMIT") as connection:
                result = connection.execute(text(f"SELECT DB_ID(N'{sql_database}')"))
                if result.scalar() is None:
                    connection.execute(text(f"CREATE DATABASE [{sql_database}]"))
                    logger.info(f"✓ Created database {sql_database}")
                else:
                    logger.info(f"✓ Database {sql_database} already exists")

            master_engine.dispose()
            return True
        except Exception as e:
            logger.error(f"✗ Failed to ensure database exists: {str(e)}")
            return False
    
    def get_session(self) -> Session:
        """Get a database session."""
        return self.SessionLocal()
    
    def init_db(self):
        """
        Initialize database tables.
        Note: In production, use Alembic for migrations.
        """
        try:
            Base.metadata.create_all(bind=self.engine)
            logger.info("Database tables initialized")
        except Exception as e:
            logger.error(f"Failed to initialize database: {str(e)}")
            raise
    
    def test_connection(self) -> bool:
        """Test database connectivity."""
        try:
            with self.engine.connect() as connection:
                result = connection.execute(text("SELECT 1"))
                logger.info("✓ Database connection successful")
                return True
        except Exception as e:
            err_text = str(e)
            logger.error(f"✗ Database connection failed: {err_text}")

            if "Cannot open database" in err_text or "requested by the login" in err_text or "4060" in err_text:
                logger.warning("⚠ Database does not exist yet; attempting to create it.")
                if self.create_database_if_missing():
                    try:
                        self.init_db()
                        logger.info("✓ Database initialized after creation")
                        return True
                    except Exception as init_error:
                        logger.error(f"✗ Failed to initialize database after creation: {init_error}")
            return False
    
    def execute_query(self, query: str, params: Optional[dict] = None) -> Any:
        """
        Execute a raw SQL query.
        
        Args:
            query: SQL query string
            params: Query parameters
        
        Returns:
            Query results
        """
        try:
            with self.engine.connect() as connection:
                result = connection.execute(text(query), params or {})
                return result.fetchall()
        except Exception as e:
            logger.error(f"Query execution failed: {str(e)}")
            raise
    
    def execute_update(self, query: str, params: Optional[dict] = None) -> int:
        """
        Execute an UPDATE/INSERT/DELETE query.
        
        Args:
            query: SQL query string
            params: Query parameters
        
        Returns:
            Number of rows affected
        """
        try:
            with self.engine.begin() as connection:
                result = connection.execute(text(query), params or {})
                rows_affected = result.rowcount
                logger.info(f"Query affected {rows_affected} rows")
                return rows_affected
        except Exception as e:
            logger.error(f"Update execution failed: {str(e)}")
            raise
    
    def close(self):
        """Close all database connections."""
        self.engine.dispose()
        logger.info("Database connections closed")


class DatabaseSessionManager:
    """
    Context manager for database sessions.
    Ensures sessions are properly closed after use.
    """
    
    def __init__(self, connector: AzureSQLConnector):
        self.connector = connector
        self.session = None
    
    def __enter__(self) -> Session:
        self.session = self.connector.get_session()
        return self.session
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            self.session.close()
        
        if exc_type:
            logger.error(f"Error in database session: {exc_val}")


# Global connector instance
sql_connector = AzureSQLConnector()


def get_db_session() -> Session:
    """
    Dependency function for FastAPI to inject database session.
    Usage: @app.get("/items", dependencies=[Depends(get_db_session)])
    """
    db = sql_connector.get_session()
    try:
        yield db
    finally:
        db.close()





if __name__ == "__main__":
    # Test SQL connection
    try:
        print("Testing Azure SQL Database connection...")
        
        if sql_connector.test_connection():
            print("✓ Successfully connected to Azure SQL Database")
            
            # Test query
            result = sql_connector.execute_query("SELECT GETUTCDATE() as current_time")
            print(f"✓ Query executed successfully: {result}")
        else:
            print("✗ Failed to connect to database")
    
    except Exception as e:
        print(f"✗ Error: {str(e)}")
    finally:
        sql_connector.close()
