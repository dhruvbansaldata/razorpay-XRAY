# Razorpay X-Ray: The "Causal Twin" Pitch Narrative

## The Hook (0:00 - 1:00)
"Hi, I’m Dhruv. 
Razorpay is currently processing billions of dollars a year. But as transaction velocity scales, so does the sophistication of fraud.
Today, the biggest threat to Razorpay isn't stolen credit cards—it’s **Deep-Tier Shell Networks**. Fraudsters are using synthetic identities to create massive, interconnected webs of fake merchants to launder money.

Current rule engines fail here. If you block any merchant who shares an IP address, you end up blocking hundreds of innocent startups working out of a WeWork. But if you let them through, you open Razorpay to massive regulatory exposure.

Even worse, if an AI model *does* catch them, it acts as a Black Box. When the RBI auditor asks *why* you blocked a $5M merchant, you can’t legally say 'because the Neural Network output was 0.94'.

That’s why I built **Razorpay X-Ray: The Causal Risk Twin**."

## The Demo (1:00 - 2:30)
*(Switch screen to the running Next.js Dashboard on localhost:3000)*

"This is the X-Ray Risk Officer Dashboard. 
Under the hood, I’m not using a simple rules engine. I built a **Graph Neural Network (GraphSAGE)** that maps out the entire Razorpay ecosystem—every merchant, director, bank account, and IP address. 

*Show the baseline comparison on a slide quickly:*
I stress-tested this against a standard rule-based engine. The rule engine had a precision of 45%—meaning more than half the people it blocked were innocent false positives.
Our Graph Neural Network? **It hit 86% precision.** It understands the structural difference between a public Cloudflare IP and a hidden, shared fraud IP.

But detection isn't enough. We need **Causal Explainability**."

*(Click on a flagged merchant in the UI)*

"When a Risk Officer clicks on a flagged entity, our engine runs a real-time **Counterfactual Edge Ablation**. It autonomously severs the connections in the graph one by one to see how the risk score changes. 

Look at the **Counterfactual Analysis** panel. It tells the Risk Officer: *'Removing this specific shared Bank Account drops the risk score by 43%'*. This isn't a guess; it's a mathematical causal trace.

We even track **Temporal Dynamics**—you can see the '7-Day Velocity' badge showing that this merchant's risk score jumped 31 points in the last week based purely on structural changes, allowing us to catch the fraud ring *before* the transaction volume spikes."

## The Value Prop & Conclusion (2:30 - 3:00)
"Finally, the engine pipes this causal trace into an LLM to generate an **RBI-ready Suspicious Activity Report (SAR)**.

We also have a **Human-in-the-Loop** feedback system. If the Risk Officer clicks 'Mark False Positive', that data feeds back into the Graph, dynamically re-weighting our priors.

**The ROI?** By increasing precision from 45% to 86%, we prevent millions of dollars in false-positive blocks (saving merchant churn) while providing mathematically defensible compliance reports that keep regulators happy.

Thank you."
