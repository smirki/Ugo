# database connection
import os
from supabase import create_client, Client
from dotenv import load_dotenv


load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

def test_response():
    response = supabase.table('users').select("*").execute()
    return response