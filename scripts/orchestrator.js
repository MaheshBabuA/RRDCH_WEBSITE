const { spawn, execSync } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const IS_WINDOWS = /^win/.test(process.platform);

// Paths - Corrected for active project structure
const BACKEND_DIR = path.resolve(__dirname, '../rrdch_frontend/rrdch_frontend/appointment-server');
const FRONTEND_DIR = path.resolve(__dirname, '../rrdch_frontend/rrdch_frontend/frontend');
const RAG_DIR = path.resolve(__dirname, '../backend'); // Python RAG service

let backendProcess;
let frontendProcess;
let ragProcess;

const log = (prefix, data) => {
    const lines = data.toString().split('\n').filter(line => line.trim() !== '');
    for (const line of lines) {
        console.log(`[${prefix}] ${line}`);
    }
};

const pollHttp = (url, interval = 1000, timeout = 30000) => {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const check = () => {
            http.get(url, (res) => {
                if (res.statusCode === 200 || res.statusCode === 404) { // 404 is fine as it means server is up
                    resolve();
                } else {
                    retry();
                }
            }).on('error', () => {
                retry();
            });
        };

        const retry = () => {
            if (Date.now() - startTime > timeout) {
                reject(new Error(`Timeout waiting for URL ${url}`));
            } else {
                setTimeout(check, interval);
            }
        };

        check();
    });
};


const start = async () => {
    try {
        console.log('================================================================');
        console.log('[ORCHESTRATOR] Starting RRDCH Full Stack Environment (SQLite Mode)');
        console.log('================================================================');

        // 1. Start Appointment Backend (Node.js)
        console.log('[ORCHESTRATOR] Starting Appointment Backend (Port 5000)...');
        backendProcess = spawn('npm', ['start'], { 
            cwd: BACKEND_DIR,
            stdio: ['ignore', 'pipe', 'pipe'],
            shell: true
        });

        backendProcess.stdout.on('data', data => log('BACKEND', data));
        backendProcess.stderr.on('data', data => log('BACKEND-ERR', data));

        // Wait for Backend to be ready
        await pollHttp('http://localhost:5000/api', 1000, 30000);
        console.log('[ORCHESTRATOR] Backend API is ready.');

        // 2. Start Python RAG Service (Optional/Background)
        console.log('[ORCHESTRATOR] Starting Python RAG Service (Port 8000)...');
        ragProcess = spawn('python', ['-m', 'uvicorn', 'rag_service:app', '--port', '8000'], {
            cwd: RAG_DIR,
            stdio: ['ignore', 'pipe', 'pipe'],
            shell: true
        });
        ragProcess.stdout.on('data', data => log('RAG', data));
        ragProcess.stderr.on('data', data => log('RAG-ERR', data));

        // 3. Start Frontend (Vite)
        console.log('[ORCHESTRATOR] Starting Frontend (Port 3000)...');
        frontendProcess = spawn('npm', ['run', 'dev'], { 
            cwd: FRONTEND_DIR,
            stdio: ['ignore', 'pipe', 'pipe'],
            shell: true
        });

        frontendProcess.stdout.on('data', data => log('FRONTEND', data));
        frontendProcess.stderr.on('data', data => log('FRONTEND-ERR', data));

        console.log('\n================================================================');
        console.log('[SUCCESS] All services started. Open http://localhost:3000');
        console.log('================================================================\n');

    } catch (error) {
        console.error('\n[FATAL] Orchestration failed:', error.message);
        cleanup();
        process.exit(1);
    }
};

const cleanup = () => {
    console.log('\n[ORCHESTRATOR] Cleaning up...');
    const killCmd = IS_WINDOWS ? 'taskkill /F /T /PID' : 'kill -9';
    
    if (frontendProcess) {
        try { execSync(`${killCmd} ${frontendProcess.pid}`); } catch (e) {}
    }
    if (backendProcess) {
        try { execSync(`${killCmd} ${backendProcess.pid}`); } catch (e) {}
    }
    if (ragProcess) {
        try { execSync(`${killCmd} ${ragProcess.pid}`); } catch (e) {}
    }
    console.log('[ORCHESTRATOR] Cleanup complete.');
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

start();
