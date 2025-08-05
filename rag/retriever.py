from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings

VECTOR_PATH = "data/vectorstore"

def retrieve_relevant_chunks(query: str, top_k: int = 5):
    embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    db = FAISS.load_local(VECTOR_PATH, embedding_model, allow_dangerous_deserialization=True)
    docs = db.similarity_search(query, k=top_k)

    return [doc.page_content for doc in docs]

if __name__ == "__main__":
    query = "how to write better prompts for coding tasks?"
    chunks = retrieve_relevant_chunks(query)
    for i, chunk in enumerate(chunks, 1):
        print(f"\n--- Chunk {i} ---\n{chunk[:500]}")
