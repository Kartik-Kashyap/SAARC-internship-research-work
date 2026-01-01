import matplotlib.pyplot as plt
import numpy as np

# Time steps (Months after a Deepfake incident)
t = np.linspace(0, 24, 100)

# Model: Social Reintegration Score (0 = Ostracized, 100 = Normal Life)
# Western Context: Exponential recovery (News cycle moves on)
# South Asian Context: "Honor" accumulation (Stigma creates a feedback loop)

def western_recovery(t):
    return 100 - (80 * np.exp(-0.3 * t)) # Recovers over time

def saarc_stigma(t):
    return 100 - (80 * np.exp(-0.05 * t)) - (1.5 * t) # Decays further due to family shame

western = western_recovery(t)
saarc = saarc_stigma(t)

plt.figure(figsize=(10, 6))

plt.plot(t, western, color='blue', linewidth=2, label='Global North Context (Reputational Recovery)')
plt.plot(t, saarc, color='red', linewidth=3, label='SAARC Context (The "Honor" Penalty)')

# Threshold of "Offline Harm"
plt.axhline(y=20, color='black', linestyle=':', label='Threshold of Physical/Social Danger')
plt.fill_between(t, 0, 20, color='gray', alpha=0.1)

plt.title('Simulation: Divergent Outcomes of Digital Scandal', fontsize=14)
plt.ylabel('Social Reintegration / Safety Score', fontsize=12)
plt.xlabel('Months Since Deepfake Release', fontsize=12)
plt.text(15, 10, 'Zone of "Honor" Killings\n& Forced Withdrawals', fontsize=10, color='darkred', fontweight='bold')

plt.legend()
plt.grid(alpha=0.3)
plt.show()
