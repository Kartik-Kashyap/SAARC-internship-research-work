import networkx as nx
import matplotlib.pyplot as plt
import random

def generate_echo_chamber_graph():
    # 1. Create two distinct communities (Echo Chambers)
    # Community A: 25 nodes, Community B: 25 nodes
    n = 25
    G_a = nx.connected_watts_strogatz_graph(n, k=6, p=0.2, seed=42)
    G_b = nx.connected_watts_strogatz_graph(n, k=6, p=0.2, seed=43)
    
    # Combine them into one graph
    G = nx.disjoint_union(G_a, G_b)
    
    # 2. Add "Bridge" edges (Weak Ties)
    # We only add a few connections between the two communities to show polarization
    nodes_a = list(range(0, n))
    nodes_b = list(range(n, 2*n))
    
    for _ in range(3): # Only 3 connections between the two large groups
        u = random.choice(nodes_a)
        v = random.choice(nodes_b)
        G.add_edge(u, v)

    # 3. Setup Visualization
    plt.figure(figsize=(12, 8))
    pos = nx.spring_layout(G, k=0.15, seed=100) # Layout that pushes clusters apart
    
    # Color nodes by community
    colors = ['#3b82f6' if node < n else '#ef4444' for node in G.nodes()]
    
    # Draw the network
    nx.draw_networkx_nodes(G, pos, node_size=300, node_color=colors, alpha=0.8)
    nx.draw_networkx_edges(G, pos, alpha=0.3, edge_color='gray')
    
    # Annotations for your paper
    plt.title("Visualizing Algorithmic Polarization & Echo Chambers", fontsize=16, loc='center')
    plt.text(-1, -1, "Blue/Red: Polarized Communities\nGray Lines: Social Interactions", 
             fontsize=10, bbox=dict(facecolor='white', alpha=0.5))
    
    plt.axis('off')
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    generate_echo_chamber_graph()