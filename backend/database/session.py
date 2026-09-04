import os
from config.settings import settings

DB_DIR = os.path.dirname(__file__)
DB_PATH = os.path.join(DB_DIR, "signbridge.db")

def init_db():
    """Placeholder initialization for SQLite storage in Phase 2."""
    pass
