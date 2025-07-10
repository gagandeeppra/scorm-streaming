// scorm_api.js
// SCORM 1.2 API implementation for local development
// This script exposes the SCORM API as window.API

(function () {
    // Check if API already exists
    if (window.API) return;

    // SCORM data storage
    const scormData = {
        'cmi.core.lesson_status': 'not attempted',
        'cmi.core.student_id': '749217',
        'cmi.core.student_name': 'Naman Sharma',
        'cmi.core.lesson_location': '',
        'cmi.core.credit': 'credit',
        'cmi.core.lesson_mode': 'normal',
        'cmi.core.exit': '',
        'cmi.core.session_time': '00:00:00',
        'cmi.core.score.raw': '',
        'cmi.core.score.max': '',
        'cmi.core.score.min': '',
        'cmi.suspend_data': '',
        'cmi.launch_data': '',
        'cmi.comments': '',
        'cmi.comments_from_lms': ''
    };

    let initialized = false;
    let lastError = '0';

    // Error codes
    const errors = {
        '0': 'No error',
        '101': 'General exception',
        '201': 'Invalid argument error',
        '202': 'Element cannot have children',
        '203': 'Element not an array - cannot have count',
        '301': 'Not initialized',
        '401': 'Not implemented error',
        '402': 'Invalid set value, element is a keyword',
        '403': 'Element is read only',
        '404': 'Element is write only',
        '405': 'Incorrect data type'
    };

    window.API = {
        LMSInitialize: function (parameter) {
            if (parameter !== '' && parameter !== null) {
                lastError = '201';
                return 'false';
            }
            if (initialized) {
                lastError = '101';
                return 'false';
            }
            initialized = true;
            lastError = '0';
            console.log('SCORM API: LMSInitialize successful');
            return 'true';
        },

        LMSFinish: function (parameter) {
            if (parameter !== '' && parameter !== null) {
                lastError = '201';
                return 'false';
            }
            if (!initialized) {
                lastError = '301';
                return 'false';
            }
            initialized = false;
            lastError = '0';
            console.log('SCORM API: LMSFinish successful');
            return 'true';
        },

        LMSGetValue: function (element) {
            if (!initialized) {
                lastError = '301';
                return '';
            }
            if (typeof element !== 'string') {
                lastError = '201';
                return '';
            }

            if (scormData.hasOwnProperty(element)) {
                lastError = '0';
                console.log('SCORM API: LMSGetValue(' + element + ') = ' + scormData[element]);
                return scormData[element];
            } else {
                lastError = '201';
                return '';
            }
        },

        LMSSetValue: function (element, value) {
            if (!initialized) {
                lastError = '301';
                return 'false';
            }
            if (typeof element !== 'string') {
                lastError = '201';
                return 'false';
            }

            // Read-only elements
            const readOnly = [
                'cmi.core.student_id',
                'cmi.core.student_name',
                'cmi.core.credit',
                'cmi.core.lesson_mode',
                'cmi.launch_data',
                'cmi.comments_from_lms'
            ];

            if (readOnly.includes(element)) {
                lastError = '403';
                return 'false';
            }

            if (scormData.hasOwnProperty(element)) {
                scormData[element] = value;
                lastError = '0';
                console.log('SCORM API: LMSSetValue(' + element + ', ' + value + ')');
                return 'true';
            } else {
                lastError = '201';
                return 'false';
            }
        },

        LMSCommit: function (parameter) {
            if (parameter !== '' && parameter !== null) {
                lastError = '201';
                return 'false';
            }
            if (!initialized) {
                lastError = '301';
                return 'false';
            }
            lastError = '0';
            console.log('SCORM API: LMSCommit successful');
            return 'true';
        },

        LMSGetLastError: function () {
            return lastError;
        },

        LMSGetErrorString: function (errorCode) {
            if (errors[errorCode]) {
                return errors[errorCode];
            }
            return '';
        },

        LMSGetDiagnostic: function (errorCode) {
            return 'Diagnostic information for error: ' + errorCode;
        }
    };

    console.log('SCORM API initialized and available as window.API');
})();