
import plotly.graph_objects as go

# Data from instructions
countries = ["India", "Pakistan", "Bangladesh", "Nepal", "Sri Lanka"]
own_device = [34, 42, 28, 38, 45]
shared_device = [66, 52, 68, 58, 48]
school_cafe = [18, 12, 25, 15, 8]

# Create the grouped bar chart
fig = go.Figure()

# Add bars for each category using brand colors
fig.add_trace(go.Bar(
    name='Own Personal Device',
    x=countries,
    y=own_device,
    marker_color='#1FB8CD',
    text=[f'{v}%' for v in own_device],
    textposition='outside',
    textfont=dict(size=12),
    offsetgroup=0
))

fig.add_trace(go.Bar(
    name='Shared Family Device',
    x=countries,
    y=shared_device,
    marker_color='#DB4545',
    text=[f'{v}%' for v in shared_device],
    textposition='outside',
    textfont=dict(size=12),
    offsetgroup=1
))

fig.add_trace(go.Bar(
    name='School/Cyber Cafe Only',
    x=countries,
    y=school_cafe,
    marker_color='#2E8B57',
    text=[f'{v}%' for v in school_cafe],
    textposition='outside',
    textfont=dict(size=12),
    offsetgroup=2
))

# Update layout with better spacing
fig.update_layout(
    title={
        "text": "Shared Devices Dominate Youth Access in South Asia<br><span style='font-size: 18px; font-weight: normal;'>Bangladesh youth rely most on family devices at 68%, Sri Lanka leads in personal ownership</span>"
    },
    barmode='group',
    bargap=0.25,
    bargroupgap=0.15,
    yaxis=dict(
        title='% of Youth Users',
        range=[0, 78],
        dtick=10,
        showgrid=True,
        gridcolor='rgba(128, 128, 128, 0.15)'
    ),
    xaxis=dict(
        title='',
        showgrid=False
    ),
    legend=dict(
        orientation='h',
        yanchor='bottom',
        y=1.0,
        xanchor='center',
        x=0.5
    )
)

fig.update_traces(cliponaxis=False)

# Save as PNG and SVG
fig.write_image('device_access_chart.png')
fig.write_image('device_access_chart.svg', format='svg')
