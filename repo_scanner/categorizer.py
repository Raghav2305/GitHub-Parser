# repo_scanner/categorizer.py

import os

CATEGORIES = {
    "source_code": [".py", ".js", ".ts", ".java", ".cpp", ".c", ".cs"],
    "tests": ["test_", "_test.py", "tests/"],
    "configuration": [".json", ".yml", ".yaml", ".toml", ".ini", ".env"],
    "documentation": [".md", ".rst", "README", "LICENSE"],
    "assets": [".png", ".jpg", ".jpeg", ".svg", ".gif"],
}

def categorize_file(filepath: str) -> str:
    filename = os.path.basename(filepath).lower()

    for category, patterns in CATEGORIES.items():
        for pattern in patterns:
            if pattern in filename or pattern in filepath:
                return category
    return "others"

def get_categorized_files(repo_path: str) -> dict:
    categorized = {
        "source_code": [],
        "tests": [],
        "configuration": [],
        "documentation": [],
        "assets": [],
        "others": []
    }

    for root, _, files in os.walk(repo_path):
        for file in files:
            full_path = os.path.relpath(os.path.join(root, file), repo_path)
            category = categorize_file(full_path)
            categorized[category].append(full_path)
    
    return categorized
