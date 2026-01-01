import networkx as nx
import matplotlib.pyplot as plt

# Create a graph representing a South Asian Family Network
G = nx.Graph()

# Nodes
G.add_node("Victim", color='red', size=2000)
family_members = ["Father", "Brother", "Sister", "Mother"]
society_members = ["Community Elder", "Neighbor", "School", "Extended Clan"]

# Edges
for member in family_members:
    G.add_edge("Victim", member, weight=5)

for member in society_members:
    G.add_edge("Father", member, weight=2)
    G.add_edge("Brother", member, weight=2)

# --- FIX 1: Increase 'k' to push nodes apart and 'iterations' for better spacing ---
pos = nx.spring_layout(G, k=1.5, iterations=50, seed=42)

plt.figure(figsize=(10, 8))

# Draw Nodes
nx.draw_networkx_nodes(G, pos, nodelist=["Victim"], node_color='#ff4d4d', node_size=3000, label="Deepfake Target")
nx.draw_networkx_nodes(G, pos, nodelist=family_members, node_color='#ffcccc', node_size=1500, label="Collateral Targets (Family)")
nx.draw_networkx_nodes(G, pos, nodelist=society_members, node_color='#e0e0e0', node_size=1000, label="Societal Judges")

# Draw Edges
edges = G.edges()
weights = [G[u][v]['weight'] for u,v in edges]
nx.draw_networkx_edges(G, pos, width=weights, edge_color='gray', alpha=0.6)

# Labels
nx.draw_networkx_labels(G, pos, font_size=10, font_weight='bold')

plt.title("The 'Collateral Damage' Network of Honor", fontsize=15, pad=20)

# --- FIX 2: Expand the X-axis to create empty space for the legend ---
ax = plt.gca()
ax.set_xlim([min(x for x, y in pos.values()) - 0.5, max(x for x, y in pos.values()) + 0.8])

# --- FIX 3: Move legend to the newly created empty space ---
plt.legend(loc='center right', bbox_to_anchor=(1, 0.5), fontsize=10, frameon=True)

plt.axis('off')
plt.tight_layout()
plt.show()