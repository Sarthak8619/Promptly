import os
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from rag.loader import load_and_split_pdf

VECTOR_PATH = "data/vectorstore"

def process_and_store_all_pdfs(folder_path="data/guides"):
    all_docs = []
    for filename in os.listdir(folder_path):
        if filename.endswith(".pdf"):
            print(f"🔍 Processing {filename}")
            docs = load_and_split_pdf(os.path.join(folder_path, filename))
            all_docs.extend(docs)

    # Use HuggingFace sentence-transformer for embeddings
    embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    # Create FAISS vectorstore
    db = FAISS.from_documents(all_docs, embedding_model)
    db.save_local("data/vectorstore")


    print("✅ Vectorstore saved to disk.")

if __name__ == "__main__":
    process_and_store_all_pdfs()
