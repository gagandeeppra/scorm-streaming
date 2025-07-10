# SCORM Streaming Server

A Node.js Express server for serving and testing SCORM 1.2 courses locally with built-in SCORM API implementation.

## Overview

This project provides a local development environment for SCORM (Sharable Content Object Reference Model) courses. It automatically extracts SCORM packages, serves course content, and provides a SCORM 1.2 API implementation for testing and development purposes.

## Features

- **Automatic SCORM Package Extraction**: Automatically extracts `.zip` SCORM packages to a content directory
- **SCORM 1.2 API Implementation**: Built-in JavaScript SCORM API for local testing
- **HTML Injection**: Automatically injects SCORM API script into course HTML files
- **Static File Serving**: Serves all SCORM course assets (HTML, CSS, JS, images, etc.)
- **Local Development**: Perfect for testing SCORM courses without an LMS

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

## Installation

1. Clone or download this project
2. Navigate to the project directory:
   ```bash
   cd scorm-streaming
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Quick Start

1. Place your SCORM package (`.zip` file) in the project root directory
2. Update the `SCORM_ZIP` variable in `server.js` with your SCORM package filename
3. Start the server:
   ```bash
   npm start
   ```
4. Open your browser and navigate to `http://localhost:3000`

### Configuration

#### SCORM Package Setup

Edit the `SCORM_ZIP` constant in `server.js` to match your SCORM package filename:

```javascript
const SCORM_ZIP = 'your-scorm-package.zip';
```

#### Port Configuration

Change the port by modifying the `PORT` constant in `server.js`:

```javascript
const PORT = 3000; // Change to your desired port
```

### File Structure

```
scorm-streaming/
├── index.html              # Sample SCORM course page
├── package.json            # Node.js dependencies and scripts
├── server.js               # Main Express server
├── scorm_api.js            # SCORM 1.2 API implementation
├── scorm_content/          # Extracted SCORM course content
│   ├── index.html          # Course entry point
│   ├── imsmanifest.xml     # SCORM manifest file
│   └── ...                 # Other course assets
└── README.md               # This file
```

## SCORM API Implementation

The built-in SCORM API (`scorm_api.js`) provides a complete SCORM 1.2 implementation including:

- **LMSInitialize()**: Initialize the SCORM session
- **LMSGetValue()**: Retrieve SCORM data elements
- **LMSSetValue()**: Set SCORM data elements
- **LMSCommit()**: Commit data to storage
- **LMSFinish()**: End the SCORM session
- **LMSGetLastError()**: Get the last error code
- **LMSGetErrorString()**: Get error descriptions
- **LMSGetDiagnostic()**: Get diagnostic information

### Supported CMI Data Elements

- `cmi.core.lesson_status`
- `cmi.core.student_id`
- `cmi.core.student_name`
- `cmi.core.lesson_location`
- `cmi.core.score.raw/max/min`
- `cmi.suspend_data`
- `cmi.session_time`
- And more...

## API Endpoints

- `GET /` - Redirects to the course index page
- `GET /course/*` - Serves SCORM course content with API injection
- `GET /scorm_api.js` - Serves the SCORM API implementation

## Development

### Running in Development Mode

```bash
npm start
```

The server will:
1. Check for the SCORM package
2. Extract it if not already extracted
3. Start serving on `http://localhost:3000`

### Testing SCORM Functions

Use the sample page at `index.html` or the course content to test SCORM API functions:

```javascript
// Initialize SCORM
window.API.LMSInitialize('');

// Set lesson status
window.API.LMSSetValue('cmi.core.lesson_status', 'completed');

// Commit data
window.API.LMSCommit('');

// Finish session
window.API.LMSFinish('');
```

## Dependencies

- **express**: Web framework for Node.js
- **unzipper**: ZIP file extraction
- **scorm-again**: Additional SCORM utilities (optional)

## Troubleshooting

### Common Issues

1. **SCORM package not found**: Ensure the ZIP file exists and the filename matches the `SCORM_ZIP` variable
2. **Port already in use**: Change the PORT variable or stop other services using port 3000
3. **Course not loading**: Check the console for errors and verify the `imsmanifest.xml` file exists

### Debugging

Enable additional logging by adding console.log statements in `server.js` or check the browser's developer console for SCORM API interactions.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License - see the `package.json` file for details.

## Support

For issues related to SCORM standards, refer to the [ADL SCORM documentation](https://adlnet.gov/projects/scorm/).

For project-specific issues, please check the console output and browser developer tools for error messages.
