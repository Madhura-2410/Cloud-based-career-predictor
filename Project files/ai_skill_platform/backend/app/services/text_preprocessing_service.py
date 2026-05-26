"""
Text Preprocessing Service
Cleans and preprocesses text data
"""

import re
import logging
from typing import List, Dict
import pandas as pd
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

logger = logging.getLogger(__name__)

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', quiet=True)

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords', quiet=True)


class TextPreprocessingService:
    """
    Service for cleaning and preprocessing text data.
    """
    
    STOPWORDS = set(stopwords.words('english'))
    
    @staticmethod
    def clean_text(text: str) -> str:
        """
        Clean text by removing special characters, URLs, etc.
        
        Args:
            text: Raw text
        
        Returns:
            Cleaned text
        """
        if not isinstance(text, str):
            return ""
        
        # Remove URLs
        text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
        
        # Remove email addresses
        text = re.sub(r'\S+@\S+', '', text)
        
        # Remove special characters and digits
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        
        # Convert to lowercase
        text = text.lower()
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    @staticmethod
    def tokenize_text(text: str) -> List[str]:
        """
        Tokenize text into words.
        
        Args:
            text: Cleaned text
        
        Returns:
            List of tokens
        """
        tokens = word_tokenize(text)
        
        # Remove stopwords
        tokens = [t for t in tokens if t not in TextPreprocessingService.STOPWORDS]
        
        # Remove short tokens
        tokens = [t for t in tokens if len(t) > 2]
        
        return tokens
    
    @staticmethod
    def preprocess_job_description(text: str) -> Dict:
        """
        Preprocess a job description.
        
        Args:
            text: Job description text
        
        Returns:
            Dictionary with cleaned and tokenized text
        """
        cleaned = TextPreprocessingService.clean_text(text)
        tokens = TextPreprocessingService.tokenize_text(cleaned)
        
        return {
            "original": text[:500] if len(text) > 500 else text,
            "cleaned": cleaned,
            "tokens": tokens,
            "word_count": len(tokens)
        }
    
    @staticmethod
    def preprocess_dataframe(df: pd.DataFrame, text_column: str) -> pd.DataFrame:
        """
        Preprocess all text in a DataFrame column.
        
        Args:
            df: DataFrame
            text_column: Column name with text
        
        Returns:
            DataFrame with additional cleaned columns
        """
        df[f"{text_column}_cleaned"] = df[text_column].fillna("").apply(
            TextPreprocessingService.clean_text
        )
        
        df[f"{text_column}_tokens"] = df[text_column].fillna("").apply(
            lambda x: TextPreprocessingService.tokenize_text(
                TextPreprocessingService.clean_text(x)
            )
        )
        
        logger.info(f"✓ Preprocessed {len(df)} records in '{text_column}'")
        return df


preprocessor = TextPreprocessingService()
