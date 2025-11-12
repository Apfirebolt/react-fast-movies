from elasticsearch import AsyncElasticsearch
from elasticsearch import ConnectionError

es_client = None
ES_URL = "http://localhost:9200" # Define Elasticsearch URL

async def connect_elasticsearch():
    """Initializes and tests the async Elasticsearch connection."""
    global es_client
    print(f"Connecting to Elasticsearch at {ES_URL}...")
    
    try:
        es_client = AsyncElasticsearch(
            hosts=[ES_URL],
        )
        # Test connection by getting cluster info
        info = await es_client.info()
        print(f"✅ Elasticsearch connection successful. Cluster name: {info['cluster_name']}")
    except ConnectionError as e:
        print(f"❌ Failed to connect to Elasticsearch: {e}")
    except Exception as e:
        # Catches version mismatch or other unexpected errors
        print(f"❌ An unexpected error occurred during ES connection: {e}")
        
async def close_elasticsearch():
    """Closes the Elasticsearch connection gracefully."""
    global es_client
    if es_client:
        await es_client.close() # Close the connection pool
        es_client = None
        print("❌ Elasticsearch client connection closed.")