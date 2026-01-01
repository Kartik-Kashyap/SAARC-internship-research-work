
import plotly.graph_objects as go
import json

# Data
data = {"age_groups": ["13-17", "18-24", "25-34", "35-44", "45+"], 
        "countries": [
            {"name": "India", "values": [78, 85, 62, 38, 22], "color": "#2E7D8C"}, 
            {"name": "Pakistan", "values": [65, 72, 48, 28, 15], "color": "#E6A04E"}, 
            {"name": "Bangladesh", "values": [52, 58, 35, 20, 10], "color": "#C01F2F"}, 
            {"name": "Nepal", "values": [75, 82, 55, 32, 18], "color": "#32B8C6"}
        ]}

# Create figure
fig = go.Figure()

# Add a shaded rectangle for youth zone (13-24 age group) - covering first two age groups
fig.add_shape(
    type="rect",
    x0=-0.5, x1=1.5,
    y0=0, y1=100,
    fillcolor="lightgray",
    opacity=0.12,
    layer="below",
    line_width=0
)

# Add annotation for youth zone at the top
fig.add_annotation(
    x=0.5, y=98,
    text="Youth Zone",
    showarrow=False,
    font=dict(size=10, color="gray"),
    xanchor="center",
    yanchor="top"
)

# Add lines for each country
for country in data['countries']:
    fig.add_trace(go.Scatter(
        x=data['age_groups'],
        y=country['values'],
        mode='lines+markers',
        name=country['name'],
        line=dict(color=country['color'], width=3),
        marker=dict(size=9, color=country['color'], line=dict(width=1, color='white'))
    ))

# Update layout
fig.update_layout(
    title={
        "text": "Internet Adoption Declines with Age Across South Asia<br><span style='font-size: 18px; font-weight: normal;'>Youth rates 3-5x higher than seniors</span>"
    },
    xaxis_title="Age Group",
    yaxis_title="Penetration (%)",
    legend=dict(
        orientation='h', 
        yanchor='bottom', 
        y=-0.2, 
        xanchor='center', 
        x=0.5
    ),
    yaxis=dict(range=[0, 100])
)

# Update axes for better spacing
fig.update_xaxes(title_standoff=15)
fig.update_yaxes(title_standoff=15)

# Update traces
fig.update_traces(cliponaxis=False)

# Save as PNG and SVG
fig.write_image("internet_adoption.png")
fig.write_image("internet_adoption.svg", format="svg")
