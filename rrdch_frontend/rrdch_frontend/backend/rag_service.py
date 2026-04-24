from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings

app = FastAPI()

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Embeddings and Load Vector Store
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vector_db_path = "vector_db/rrdch_index"

if os.path.exists(vector_db_path):
    vector_store = FAISS.load_local(vector_db_path, embeddings, allow_dangerous_deserialization=True)
else:
    vector_store = None
    print("Warning: Vector DB not found. Please run ingest.py first.")

class QueryRequest(BaseModel):
    question: str

@app.post("/api/academic-query")
async def academic_query(request: QueryRequest):
    if not vector_store:
        raise HTTPException(status_code=500, detail="Knowledge base not initialized.")

    # 1. Similarity Search
    docs = vector_store.similarity_search(request.question, k=3)
    
    # 2. Extract context and metadata
    context = "\n".join([doc.page_content for doc in docs])
    sources = list(set([doc.metadata.get('source', 'Unknown') for doc in docs]))
    
    # 3. Simulate LLM Response (since we don't have an API key here, 
    # but in a real app, we'd use RetrievalQA chain)
    # For now, we'll return the most relevant chunk as the 'exact answer' 
    # and a simulated professional AI response.
    
    answer = f"Based on the {sources[0]}, {docs[0].page_content[:300]}..."
    
    # In real implementation:
    # llm = OpenAI(temperature=0)
    # qa_chain = RetrievalQA.from_chain_type(llm, chain_type="stuff", retriever=vector_store.as_retriever())
    # response = qa_chain.run(request.question)

    return {
        "answer": docs[0].page_content,
        "source": sources[0],
        "metadata": {"chunks_retrieved": len(docs)}
    }

@app.get("/health")
def health():
    return {"status": "online", "db_loaded": vector_store is not None}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
