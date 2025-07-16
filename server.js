// server.js
import express from 'express';
import unzipper from 'unzipper';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;
const SCORM_ZIP = 'HSI_SCORM12_osha_IntrotoPersonalSafety.zip';
const SCORM_DIR = path.join(__dirname, 'scorm_content');

// Middleware to parse JSON
app.use(express.json());

// Serve the SCORM API script
app.get('/scorm_api.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'scorm_api.js'));
});

// Middleware to inject SCORM API into HTML files
app.use('/course', (req, res, next) => {
    if (req.path.endsWith('.html')) {
        const filePath = path.join(SCORM_DIR, req.path);
        if (fs.existsSync(filePath)) {
            let html = fs.readFileSync(filePath, 'utf8');

            // Inject SCORM API script if not already present
            if (!html.includes('scorm_api.js') && !html.includes('window.API')) {
                const scriptTag = '<script src="/scorm_api.js"></script>';
                if (html.includes('<head>')) {
                    html = html.replace('<head>', `<head>\n    ${scriptTag}`);
                } else if (html.includes('<html>')) {
                    html = html.replace('<html>', `<html>\n<head>\n    ${scriptTag}\n</head>`);
                } else {
                    html = `<script src="/scorm_api.js"></script>\n${html}`;
                }
            }

            res.setHeader('Content-Type', 'text/html');
            res.send(html);
            return;
        }
    }
    next();
});

// Function to start the server
function startServer() {
    // Serve SCORM static files
    app.use('/course', express.static(SCORM_DIR));

    // (Optional) Redirect root to course index.html
    app.get('/', (req, res) => {
        res.redirect('/course/index.html');
    });

    app.listen(PORT, () => {
        console.log(`SCORM server running at http://localhost:${PORT}`);
    });
}

// Extract SCORM package if not already extracted
if (!fs.existsSync(SCORM_DIR)) {
    console.log('Extracting SCORM package...');

    // Check if the zip file exists
    if (!fs.existsSync(SCORM_ZIP)) {
        console.error(`Error: SCORM zip file not found: ${SCORM_ZIP}`);
        process.exit(1);
    }

    fs.createReadStream(SCORM_ZIP)
        .pipe(unzipper.Extract({ path: SCORM_DIR }))
        .on('close', () => {
            console.log('SCORM package extracted successfully.');
            startServer();
        })
        .on('error', (err) => {
            console.error('Error extracting SCORM package:', err);
            process.exit(1);
        });
} else {
    console.log('SCORM package already extracted.');
    startServer();
}