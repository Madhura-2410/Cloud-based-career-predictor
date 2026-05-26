import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report
import os
import sys

# Add app to path to use services if needed
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

def train_role_prediction():
    print("Training Role Prediction Model...")
    
    # Load dataset
    data_path = os.path.join(os.path.dirname(__file__), '..', 'resume_data.csv')
    if not os.path.exists(data_path):
        print(f"Error: {data_path} not found.")
        return
    
    df = pd.read_csv(data_path)
    
    # Features: Resume text or skills
    # Target: Category or Job Title
    # Assuming columns: 'Resume_str', 'Category'
    
    X = df['Resume_str']
    y = df['Category']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Build pipeline
    model = Pipeline([
        ('tfidf', TfidfVectorizer(stop_words='english', max_features=5000)),
        ('clf', RandomForestClassifier(n_estimators=100, random_state=42))
    ])
    
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    print("Model Evaluation:")
    print(classification_report(y_test, y_pred))
    
    # Save model
    model_dir = os.path.join(os.path.dirname(__file__), 'models')
    os.makedirs(model_dir, exist_ok=True)
    joblib.dump(model, os.path.join(model_dir, 'role_predictor.pkl'))
    print(f"Model saved to {model_dir}/role_predictor.pkl")

if __name__ == "__main__":
    train_role_prediction()
