import os
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

def ingest_data():
    print("Initializing Ingestion Process...")
    
    # 1. Load Documents
    # Pointing to syllabus_pdfs as requested
    if not os.path.exists('./syllabus_pdfs'):
        os.makedirs('./syllabus_pdfs')
        print("Created syllabus_pdfs folder. Please add PDF files there.")
        
    loader = DirectoryLoader('./syllabus_pdfs', glob="./*.pdf")
    documents = loader.load()

    print(f"Loaded {len(documents)} documents.")

    # 2. Split Documents
    # Split documents into 1000-character chunks with 200-character overlap
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
    )
    chunks = text_splitter.split_documents(documents)
    print(f"Split into {len(chunks)} chunks.")

    # 3. Create Embeddings
    # Using HuggingFace as a free, local alternative. Can be swapped for OpenAI.
    print("Generating Embeddings (HuggingFace)...")
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    # 4. Store in Vector Database (FAISS)
    print("Creating Vector Store...")
    vector_store = FAISS.from_documents(chunks, embeddings)
    
    # 5. Save Vector Store locally
    vector_store.save_local("vector_db/rrdch_index")
    print("Vector Store saved successfully in 'vector_db/rrdch_index'")

if __name__ == "__main__":
    ingest_data()
