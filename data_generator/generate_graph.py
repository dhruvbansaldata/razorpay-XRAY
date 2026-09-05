import pandas as pd
import networkx as nx
from faker import Faker
import random
import os

fake = Faker('en_IN')
random.seed(42)
Faker.seed(42)

def generate_graph(num_normal_merchants=800, num_fraud_rings=30):
    G = nx.Graph()
    node_data = []
    edge_data = []
    
    node_id_counter = 1
    
    def add_node(label, properties):
        nonlocal node_id_counter
        nid = f"n_{node_id_counter}"
        node_id_counter += 1
        G.add_node(nid, label=label, **properties)
        node_data.append({'node_id': nid, 'label': label, **properties})
        return nid
        
    def add_edge(src, dst, type):
        G.add_edge(src, dst, type=type)
        edge_data.append({'src': src, 'dst': dst, 'type': type})

    print("Generating Normal Merchants with Noise...")
    
    # Introduce NOISE: Co-working spaces and Cloudflare IPs that many legit merchants share
    public_ips = [add_node('IPAddress', {'ip': fake.ipv4()}) for _ in range(5)]
    serial_entrepreneurs = [add_node('Director', {'name': fake.name()}) for _ in range(10)]
    
    for i in range(num_normal_merchants):
        split = 'train' if i < (num_normal_merchants * 0.8) else 'test'
        m_id = add_node('Merchant', {'name': fake.company(), 'is_fraud': 0, 'split': split})
        
        # 10% chance to be a serial entrepreneur
        if random.random() < 0.1:
            add_edge(m_id, random.choice(serial_entrepreneurs), 'HAS_DIRECTOR')
        else:
            for _ in range(random.randint(1, 2)):
                d_id = add_node('Director', {'name': fake.name()})
                add_edge(m_id, d_id, 'HAS_DIRECTOR')
            
        b_id = add_node('BankAccount', {'account': fake.bban()})
        add_edge(m_id, b_id, 'HAS_BANK_ACCOUNT')
        
        # 20% chance to use a public shared IP
        if random.random() < 0.2:
            add_edge(m_id, random.choice(public_ips), 'USES_IP')
        else:
            ip_id = add_node('IPAddress', {'ip': fake.ipv4()})
            add_edge(m_id, ip_id, 'USES_IP')

    print("Generating Adversarial Fraud Rings...")
    # Fraud rings designed to evade simple rules
    for i in range(num_fraud_rings):
        split = 'train' if i < (num_fraud_rings * 0.8) else 'test'
        num_shells = random.randint(3, 6)
        
        # Ring assets
        ring_banks = [add_node('BankAccount', {'account': fake.bban()}) for _ in range(2)]
        mastermind = add_node('Director', {'name': fake.name()})
        
        for _ in range(num_shells):
            m_id = add_node('Merchant', {'name': fake.company() + f" (Ring {i})", 'is_fraud': 1, 'split': split})
            
            # Dilute the bank account sharing (only share sometimes)
            add_edge(m_id, random.choice(ring_banks), 'HAS_BANK_ACCOUNT')
            
            # 50% use unique IPs, 50% use public shared IPs to hide
            if random.random() > 0.5:
                add_edge(m_id, random.choice(public_ips), 'USES_IP')
            else:
                ip_id = add_node('IPAddress', {'ip': fake.ipv4()})
                add_edge(m_id, ip_id, 'USES_IP')
                
            # Mastermind hides behind strawmen, only occasionally appearing
            if random.random() > 0.6:
                add_edge(m_id, mastermind, 'HAS_DIRECTOR')
            else:
                strawman = add_node('Director', {'name': fake.name()})
                add_edge(m_id, strawman, 'HAS_DIRECTOR')
                
    return pd.DataFrame(node_data), pd.DataFrame(edge_data)

if __name__ == "__main__":
    nodes_df, edges_df = generate_graph()
    os.makedirs('data', exist_ok=True)
    nodes_df.to_csv('data/nodes.csv', index=False)
    edges_df.to_csv('data/edges.csv', index=False)
    print("Regenerated adversarial dataset.")
