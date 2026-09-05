import chromadb
from chromadb.config import Settings
import os

print("Initializing ChromaDB Vector Database...")
# Initialize a local persistent ChromaDB client
client = chromadb.PersistentClient(path="./chroma_db")

# Create or get the collection
collection = client.get_or_create_collection(name="rbi_regulations")

# Mock RBI Legal Texts regarding AML (Anti-Money Laundering) and KYC
documents = [
    "RBI Master Direction - KYC (Sec 33b): Entities sharing beneficial owners or directors across multiple highly-transactional accounts must undergo Enhanced Due Diligence (EDD) to prevent shell company laundering.",
    "RBI Circular - AML Framework: Financial institutions must flag interconnected merchant clusters sharing infrastructural assets (such as IP addresses or MAC addresses) if transaction velocity exceeds standard thresholds.",
    "FEMA Compliance Guideline 12(A): Cross-border or high-volume transactions routed through pooled or shared bank accounts by seemingly distinct corporate entities require immediate freezing and SAR filing.",
    "FATF Recommendation 24: Transparency and Beneficial Ownership of Legal Persons. Countries should ensure that competent authorities have access to adequate, accurate and timely information on the beneficial ownership and control of legal persons that can be obtained or accessed in a timely fashion by competent authorities. Any cross-border signal (foreign IP) mapped to a localized fraud ring is an immediate FATF flag."
]

ids = ["rbi_kyc_33b", "rbi_aml_infra", "fema_12a", "fatf_rec_24"]

# Metadata for richer citations
metadatas = [
    {"source": "RBI Master Direction KYC", "penalty": "License Suspension"},
    {"source": "RBI AML Framework 2024", "penalty": "₹5 Crore Fine"},
    {"source": "FEMA Guidelines", "penalty": "Asset Freezing & ED Enforcement"},
    {"source": "FATF International Standards", "penalty": "Global Blacklisting"}
]

print("Embedding legal texts into vector space...")
# Add to collection (ChromaDB uses a default sentence-transformer model automatically if none provided, 
# but it requires the 'onnxruntime' or 'sentence-transformers' package to be installed)
collection.add(
    documents=documents,
    metadatas=metadatas,
    ids=ids
)

print("Vector Database successfully seeded with RBI Regulatory knowledge.")
