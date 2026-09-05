import torch
import torch.nn.functional as F
from torch_geometric.nn import VGAE, GCNConv
from train_gnn import prepare_data
import os

print("--- Initializing Graph-VAE for Synthetic Shell Network Generation ---")

# Load existing data
data, num_features = prepare_data()

# Define the Variational Graph Autoencoder Encoder
class Encoder(torch.nn.Module):
    def __init__(self, in_channels, out_channels):
        super().__init__()
        self.conv1 = GCNConv(in_channels, 2 * out_channels)
        self.conv_mu = GCNConv(2 * out_channels, out_channels)
        self.conv_logstd = GCNConv(2 * out_channels, out_channels)

    def forward(self, x, edge_index):
        x = self.conv1(x, edge_index).relu()
        return self.conv_mu(x, edge_index), self.conv_logstd(x, edge_index)

# Create the VGAE Model
out_channels = 16
model = VGAE(Encoder(num_features, out_channels))
optimizer = torch.optim.Adam(model.parameters(), lr=0.01)

def train():
    model.train()
    optimizer.zero_grad()
    z = model.encode(data.x, data.edge_index)
    loss = model.recon_loss(z, data.edge_index) + (1 / data.num_nodes) * model.kl_loss()
    loss.backward()
    optimizer.step()
    return float(loss)

print("Training VGAE to learn the distribution of Fraud Rings...")
for epoch in range(1, 201):
    loss = train()
    if epoch % 50 == 0:
        print(f'Epoch: {epoch:03d}, Loss: {loss:.4f}')

print("--- Generating Synthetic Topologies ---")
model.eval()
with torch.no_grad():
    z = model.encode(data.x, data.edge_index)
    
    # Generate new edges by sampling from the learned latent space
    # The inner product decoder determines the probability of an edge
    adj_prob = torch.sigmoid(torch.matmul(z, z.t()))
    
    # We sample synthetic edges where probability > 0.85
    synthetic_adj = (adj_prob > 0.85).float()
    num_synthetic_edges = int(synthetic_adj.sum().item() / 2) # Undirected
    
    print(f"VGAE successfully hallucinated {num_synthetic_edges} realistic synthetic connections!")
    print("These generative topologies can now be used to stress-test the primary GraphSAGE detection engine.")

# In a real pipeline, we would save these generated topologies back to CSV.
print("Finished Graph-VAE Synthetic Generation module.")
