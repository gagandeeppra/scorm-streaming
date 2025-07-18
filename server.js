import express from 'express';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import stream from 'stream';
import { promisify } from 'util';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Verify environment variables
if (!process.env.AWS_BUCKET_NAME) {
    console.error('AWS_BUCKET_NAME is not defined in environment variables');
    process.exit(1);
}

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error('AWS credentials are not properly configured');
    process.exit(1);
}


const pipeline = promisify(stream.pipeline);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// AWS S3 Configuration
const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const SCORM_KEY_PREFIX = 'scorm/Diversity at the Workplace Course | QlickTrain_20250718130722/index.html'; // Path prefix in S3 bucket


const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Serve the SCORM API script
app.get('/scorm_api.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'scorm_api.js'));
});

// Middleware to serve SCORM content from S3
app.use('/course', async (req, res, next) => {
    try {
        const s3Key = SCORM_KEY_PREFIX + req.path.replace(/^\//, '');

        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: s3Key
        });

        const { Body, ContentType } = await s3Client.send(command);

        // If HTML content, inject SCORM API script
        if (ContentType && ContentType.includes('html')) {
            // Convert stream to string
            let chunks = [];
            for await (let chunk of Body) {
                chunks.push(chunk);
            }
            let html = Buffer.concat(chunks).toString('utf8');

            // Inject SCORM API script if not present
            if (!html.includes('scorm_api.js')) {
                const scriptTag = '<script src="/scorm_api.js"></script>';
                if (html.includes('<head>')) {
                    html = html.replace('<head>', `<head>\n    ${scriptTag}`);
                } else if (html.includes('<html>')) {
                    html = html.replace('<html>', `<html>\n<head>\n    ${scriptTag}\n</head>`);
                } else {
                    html = `${scriptTag}\n${html}`;
                }
            }

            res.setHeader('Content-Type', ContentType);
            return res.send(html);
        }

        // For non-HTML content, stream directly
        if (ContentType) {
            res.setHeader('Content-Type', ContentType);
        }
        await pipeline(Body, res);

    } catch (error) {
        if (error.name === 'NoSuchKey') {
            next();
        } else {
            console.error('Error streaming from S3:', error);
            res.status(500).send('Error accessing content');
        }
    }
});

// Serve the main index.html file
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Redirect root to index.html
app.get('/', (req, res) => {
    res.redirect('/index.html');
});

app.listen(PORT, () => {
    console.log(`SCORM server running at http://localhost:${PORT}`);
    console.log(`Main test page: http://localhost:${PORT}/index.html`);
    console.log(`SCORM course: http://localhost:${PORT}/course/index.html`);
});