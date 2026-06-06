import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
try:
    engine = create_engine(DATABASE_URL)
    conn = engine.connect()
    print("DB Success")
except Exception as e:
    print(f"DB Error: {repr(e)}")
