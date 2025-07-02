# repo_scanner/clone_repo.py

import os
import tempfile
from git import Repo

def clone_repo(github_url: str) -> str:
    temp_dir = tempfile.mkdtemp()
    Repo.clone_from(github_url, temp_dir)
    return temp_dir
