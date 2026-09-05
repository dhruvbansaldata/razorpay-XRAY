# Razorpay X-Ray (Causal Risk Twin)

**Razorpay X-Ray** is an Explainable Graph-RAG Risk Engine designed to detect and explain deep-tier shell merchant networks and complex money laundering rings.

## The Problem
Traditional fraud detection relies on rule engines or black-box neural networks. When a high-value merchant is blocked, regulators (like the RBI) and internal risk officers require a deterministic, legally defensible explanation for the block. Current AI systems provide a probability score, not a causal explanation.

## The Solution
Razorpay X-Ray solves this using a 3-layer architecture:
1. **Detection Layer (GNN):** A Graph Neural Network analyzes the structural topology of merchants, directors, bank accounts, and IP addresses to flag hidden fraud rings (e.g., synthetic identities sharing diluted attributes).
2. **Causal Attribution Layer (GNNExplainer/SHAP):** Extracts the counterfactual subgraph, answering: *"If this merchant hadn't shared this specific bank account with a blacklisted entity, would they still be flagged?"*
3. **LLM Auditor Layer:** Translates the causal mathematical trace into a formal, RBI-compliant "Suspicious Activity Report" (SAR) in natural language.

## Architecture
- `data_generator/`: Generates an adversarial, synthetic Merchant Knowledge Graph.
- `backend/`: FastAPI + PyTorch Geometric for the Graph AI and LLM generation.
- `frontend/`: Next.js human-in-the-loop dashboard for Risk Officers to visualize the causal traces.
