// This file exports functions for visualizing data, such as generating graphs or charts.

const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

const width = 800; // Width of the chart
const height = 600; // Height of the chart
const chartCallback = (ChartJS) => {
    // Register any necessary chart types or plugins here
};

const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback });

async function saveGraphAsPng(data, filePath) {
    const configuration = {
        type: 'line', // Example chart type
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Trading Data',
                data: data.values,
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
            }],
        },
        options: {
            responsive: false,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    };

    const image = await chartJSNodeCanvas.renderToBuffer(configuration);
    require('fs').writeFileSync(filePath, image);
}

module.exports = {
    saveGraphAsPng,
};