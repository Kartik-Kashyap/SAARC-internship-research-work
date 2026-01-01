import plotly.graph_objects as go
import numpy as np

# Data from the provided JSON
harm_types = ["Cyberbullying", "Misinformation Exposure", "Privacy Violation", "Online Harassment", "Grooming/CSEA Risk"]
countries = ["India", "Pakistan", "Bangladesh", "Nepal", "Sri Lanka"]
data = [[28, 65, 42, 35, 18], 
        [24, 58, 38, 32, 15], 
        [31, 72, 48, 39, 22], 
        [26, 61, 44, 34, 19], 
        [22, 54, 36, 28, 14]]

# Use line breaks for better readability while keeping horizontal text
harm_types_display = [
    "Cyberbullying", 
    "Misinformation<br>Exposure", 
    "Privacy<br>Violation", 
    "Online<br>Harassment", 
    "Grooming/<br>CSEA Risk"
]

# Create text annotations for the heatmap
text_annotations = [[f"{val}%" for val in row] for row in data]

# Create the heatmap
fig = go.Figure(data=go.Heatmap(
    z=data,
    x=harm_types_display,
    y=countries,
    text=text_annotations,
    texttemplate="%{text}",
    textfont={"size": 14},
    colorscale=[[0, '#2E8B57'], [0.5, '#D2BA4C'], [1, '#DB4545']],  # green-yellow-red
    hovertemplate='%{y}<br>%{fullData.x[%{x}]}<br>%{z}%<extra></extra>',
    showscale=True,
    colorbar=dict(
        title="Prevalence (%)",
        ticksuffix="%",
        len=0.7
    ),
    xgap=3,
    ygap=3
))

# Update layout with better spacing and shorter subtitle
fig.update_layout(
    title={
        "text": "Digital Harms Vary Across South Asia (Youth 15-24)<br><span style='font-size: 18px; font-weight: normal;'>Misinformation most prevalent in all five countries</span>"
    },
    xaxis_title="Type of Digital Harm",
    yaxis_title="Country",
    xaxis=dict(
        side='bottom',
        tickfont=dict(size=12)
    ),
    yaxis=dict(
        tickfont=dict(size=12)
    )
)

# Save as PNG and SVG
fig.write_image("heatmap.png")
fig.write_image("heatmap.svg", format="svg")
