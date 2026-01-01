import matplotlib.pyplot as plt
import numpy as np

t = np.arange(0, 365)

high_algo = 100 - 0.09 * t
medium_algo = 100 - 0.05 * t
low_algo = 100 - 0.02 * t

plt.figure()
plt.plot(t, high_algo, label="High Algorithmic Exposure")
plt.plot(t, medium_algo, label="Moderate Algorithmic Exposure")
plt.plot(t, low_algo, label="Low Algorithmic Exposure")
plt.xlabel("Days")
plt.ylabel("Relative Attention Capacity Index")
plt.legend()
plt.tight_layout()
plt.show()
