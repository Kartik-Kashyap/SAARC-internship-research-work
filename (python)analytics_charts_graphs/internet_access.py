
import plotly.graph_objects as go
from plotly.subplots import make_subplots

# Data
countries = ["India", "Pakistan", "Bangladesh", "Nepal", "Sri Lanka", "Bhutan", "Maldives"]
internet_penetration = [52.4, 45.7, 31.5, 51.2, 45.8, 44.5, 68.2]
gender_gap = [15.6, 26.1, 21.8, 17.3, 15.0, 11.0, 12.1]

# Create subplots with two side-by-side bar charts
fig = make_subplots(
    rows=1, cols=2,
    subplot_titles=("Internet Penetration %", "Gender Gap (percentage points)"),
    horizontal_spacing=0.15
)

# Add Internet Penetration bars (left chart)
fig.add_trace(
    go.Bar(
        x=countries,
        y=internet_penetration,
        text=[f'{v}%' for v in internet_penetration],
        textposition='outside',
        marker_color='#1FB8CD',
        showlegend=False,
        cliponaxis=False
    ),
    row=1, col=1
)

# Add Gender Gap bars (right chart)
fig.add_trace(
    go.Bar(
        x=countries,
        y=gender_gap,
        text=[f'{v} pp' for v in gender_gap],
        textposition='outside',
        marker_color='#DB4545',
        showlegend=False,
        cliponaxis=False
    ),
    row=1, col=2
)

# Update layout
fig.update_layout(
    title={
        "text": "Internet Access & Gender Divide in South Asia (2023)<br><span style='font-size: 18px; font-weight: normal;'>Maldives leads in penetration; Pakistan shows widest gender gap</span>"
    }
)

# Update y-axes with appropriate ranges
fig.update_yaxes(title_text="Percentage (%)", range=[0, 75], row=1, col=1)
fig.update_yaxes(title_text="Gap (pp)", range=[0, 30], row=1, col=2)

# Update x-axes
fig.update_xaxes(title_text="Country", row=1, col=1)
fig.update_xaxes(title_text="Country", row=1, col=2)

fig.update_traces(cliponaxis=False)

# Save as PNG and SVG
fig.write_image('chart.png')
fig.write_image('chart.svg', format='svg')
