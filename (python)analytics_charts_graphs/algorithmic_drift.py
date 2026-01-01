import matplotlib.pyplot as plt
import numpy as np

# Simulated iterations
t = np.arange(0, 500)

# Synthetic drift curves
low_resistance = 0.2 + 0.6 * (1 - np.exp(-t / 120))
medium_resistance = 0.2 + 0.4 * (1 - np.exp(-t / 220))
high_resistance = 0.2 + 0.2 * (1 - np.exp(-t / 350))

plt.figure()
plt.plot(t, low_resistance, label="Low Resistance (γ = 0.2)")
plt.plot(t, medium_resistance, label="Medium Resistance (γ = 0.5)")
plt.plot(t, high_resistance, label="High Resistance (γ = 0.8)")
plt.xlabel("Iterations (Time)")
plt.ylabel("Proportion of Extreme Content Exposure")
plt.legend()
plt.tight_layout()
plt.show()