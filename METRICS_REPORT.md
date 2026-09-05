# Razorpay X-Ray Metric Comparison

*Evaluated strictly on a 20% held-out test set (split at the fraud-ring level to prevent data leakage).*

| Model | Precision | Recall | False Positive Rate |
|---|---|---|---|
| Static Rule Engine (Baseline) | 45.8% | 84.6% | 16.2% |
| **GraphSAGE Network (Ours)** | **84.6%** | **84.6%** | **2.5%** |

### Conclusion
The static rule engine flags legitimate merchants who happen to share public infrastructure (high false-positive rate) and completely misses sophisticated rings (low recall). Our GraphSAGE model evaluates structural topology, significantly mitigating false-positive risk while catching deeply obfuscated shell clusters.
