from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_openai import ChatOpenAI
from langchain_groq import ChatGroq
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

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

# Setup LangChain Components
def get_rag_chain(language="English"):
    # Priority: Groq (for speed) -> OpenAI
    groq_key = os.getenv("GROQ_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")
    
    if groq_key:
        llm = ChatGroq(temperature=0, model_name="llama3-70b-8192", groq_api_key=groq_key)
    elif openai_key:
        llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0, openai_api_key=openai_key)
    else:
        raise ValueError("No LLM API keys found in environment.")
    
    system_prompt = (
        "You are an expert Academic Assistant for Rajarajeswari Dental College & Hospital (RRDCH). "
        "Use the following retrieved context to answer the student's question about the BDS/MDS syllabus. "
        "If you don't know the answer, say that you don't know based on the current indexing. "
        "IMPORTANT: You MUST provide the final answer in {language}. "
        "\n\n"
        "Context: {context}"
    )
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{input}"),
    ])
    
    question_answer_chain = create_stuff_documents_chain(llm, prompt)
    chain = create_retrieval_chain(vector_store.as_retriever(), question_answer_chain)
    return chain

class QueryRequest(BaseModel):
    question: str
    language: str = "en"

LANG_NAMES = {
    "en": "English", "kn": "Kannada", "hi": "Hindi", "te": "Telugu", 
    "ta": "Tamil", "es": "Spanish", "fr": "French", "ar": "Arabic",
    "de": "German", "zh": "Chinese", "ja": "Japanese", "ru": "Russian", "ko": "Korean"
}

@app.post("/api/academic-query")
async def academic_query(request: QueryRequest):
    if not vector_store:
        raise HTTPException(status_code=500, detail="Knowledge base not initialized.")

    try:
        lang_name = LANG_NAMES.get(request.language, "English")
        rag_chain = get_rag_chain(language=lang_name)
        
        response = rag_chain.invoke({"input": request.question, "language": lang_name})
        
        # Extract sources from context documents
        sources = list(set([doc.metadata.get('source', 'Syllabus PDF') for doc in response["context"]]))
        
        return {
            "answer": response["answer"],
            "source": sources[0] if sources else "RRDCH Database",
            "metadata": {"chunks_retrieved": len(response["context"]), "language": lang_name}
        }
    except Exception as e:
        # Fallback to similarity search if LLM fails (e.g. no API key)
        print(f"RAG Chain Error: {e}")
        docs = vector_store.similarity_search(request.question, k=2)
        return {
            "answer": f"[FALLBACK] {docs[0].page_content}" if docs else "No relevant information found.",
            "source": docs[0].metadata.get('source', 'Unknown') if docs else "None",
            "metadata": {"error": str(e)}
        }

@app.get("/health")
def health():
    return {"status": "online", "db_loaded": vector_store is not None}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
