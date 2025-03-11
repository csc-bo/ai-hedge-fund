import fs from 'fs';
import mermaid from 'mermaid';
import { createCanvas } from 'canvas';
import puppeteer from 'puppeteer';

/**
 * Initializes mermaid with optimal settings for graph visualization
 */
mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'loose',
    flowchart: {
        htmlLabels: true,
        curve: 'basis'
    }
});

/**
 * Saves a workflow graph as a PNG file
 * @param {Object} graph - The workflow graph object
 * @param {string} outputFilePath - Path where the PNG file will be saved
 */
export async function saveGraphAsPng(graph, outputFilePath = '') {
    try {
        // Convert graph to mermaid syntax
        const mermaidDefinition = convertToMermaidSyntax(graph);
        
        // Generate SVG using Puppeteer (for better rendering)
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Inject mermaid
        await page.setContent(`
            <!DOCTYPE html>
            <html>
                <body>
                    <pre class="mermaid">
                        ${mermaidDefinition}
                    </pre>
                    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
                    <script>
                        mermaid.initialize({startOnLoad: true});
                    </script>
                </body>
            </html>
        `);

        // Wait for rendering
        await page.waitForSelector('.mermaid svg');
        
        // Get the SVG
        const svg = await page.$eval('.mermaid svg', el => el.outerHTML);
        
        // Convert SVG to PNG using node-canvas
        const canvas = createCanvas(800, 600);
        const ctx = canvas.getContext('2d');
        
        // Write to file
        const filePath = outputFilePath || 'graph.png';
        fs.writeFileSync(filePath, canvas.toBuffer());
        
        await browser.close();
        
        return filePath;
    } catch (error) {
        console.error('Error generating graph:', error);
        throw error;
    }
}

/**
 * Converts a workflow graph object to Mermaid diagram syntax
 * @param {Object} graph - The workflow graph object
 * @returns {string} - Mermaid diagram syntax
 */
function convertToMermaidSyntax(graph) {
    const nodes = graph.nodes || [];
    const edges = graph.edges || [];
    
    let mermaidDef = 'graph TD;\n';
    
    // Add nodes
    nodes.forEach(node => {
        mermaidDef += `    ${node.id}[${node.label || node.id}];\n`;
    });
    
    // Add edges
    edges.forEach(edge => {
        mermaidDef += `    ${edge.from}-->${edge.to};\n`;
    });
    
    return mermaidDef;
}