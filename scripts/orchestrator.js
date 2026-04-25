const { spawn, execSync } = require('child_process');
const net = require('net');
const http = require('http');
const path = require('path');
const fs = require('fs');

const MYSQLD_PATH = "C:\\Program Files\\MySQL\\MySQL Server 8.4\\bin\\mysqld.exe";
const MYSQL_CLIENT_PATH = "C:\\Program Files\\MySQL\\MySQL Server 8.4\\bin\\mysql.exe";
const DATA_DIR = path.resolve(__dirname, '../backend/database/data');
const SCHEMA_FILE = path.resolve(__dirname, '../backend/database/RRDCH_DATABASE_SCHEMA.sql');

let dbProcess;
let backendProcess;
let frontendProcess;

const log = (prefix, data) => {
    const lines = data.toString().split('\n').filter(line => line.trim() !== '');
    for (const line of lines) {
        console.log(`[${prefix}] ${line}`);
    }
};

const pollPort = (port, host = '127.0.0.1', interval = 1000, timeout = 30000) => {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const check = () => {
            const socket = new net.Socket();
            socket.setTimeout(1000);
            socket.on('connect', () => {
                socket.destroy();
                resolve();
            });
            socket.on('timeout', () => {
                socket.destroy();
                retry();
            });
            socket.on('error', () => {
                socket.destroy();
                retry();
            });
            socket.connect(port, host);
        };

        const retry = () => {
            if (Date.now() - startTime > timeout) {
                reject(new Error(`Timeout waiting for port ${port}`));
            } else {
                setTimeout(check, interval);
            }
        };

        check();
    });
};

const pollHttp = (url, interval = 1000, timeout = 30000) => {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const check = () => {
            http.get(url, (res) => {
                if (res.statusCode === 200) {
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

const runInitSql = () => {
    return new Promise((resolve, reject) => {
        console.log('[ORCHESTRATOR] Initializing Database users and schema...');
        
        // Ensure user exists
        const createDbUserSql = `
            CREATE DATABASE IF NOT EXISTS rrdch_db;
            CREATE USER IF NOT EXISTS 'rrdch_user'@'localhost' IDENTIFIED BY 'RrdchSecure123!';
            GRANT ALL PRIVILEGES ON rrdch_db.* TO 'rrdch_user'@'localhost';
            FLUSH PRIVILEGES;
        `;
        
        try {
            // Write temp SQL file to avoid complex CMD quoting issues
            const tempSqlPath = path.resolve(__dirname, 'temp_init.sql');
            fs.writeFileSync(tempSqlPath, createDbUserSql);
            execSync(`"${MYSQL_CLIENT_PATH}" -u root < "${tempSqlPath}"`);
            fs.unlinkSync(tempSqlPath);
            console.log('[ORCHESTRATOR] Database and user verified.');
            
            // Load schema
            console.log('[ORCHESTRATOR] Loading schema from RRDCH_DATABASE_SCHEMA.sql...');
            execSync(`"${MYSQL_CLIENT_PATH}" -u root rrdch_db < "${SCHEMA_FILE}"`);
            console.log('[ORCHESTRATOR] Schema loaded successfully.');
            resolve();
        } catch (err) {
            console.error('[ORCHESTRATOR] Failed to initialize database. Make sure MySQL root user does not require a password, or update orchestrator.js. Error: ', err.message);
            reject(err);
        }
    });
};

const start = async () => {
    try {
        console.log('================================================================');
        console.log('[ORCHESTRATOR] Starting RRDCH Full Stack Environment');
        console.log('================================================================');

        // 1. Start DB
        console.log('[ORCHESTRATOR] Checking if port 3306 is free...');
        let dbNeedsStart = true;
        try {
            await pollPort(3306, '127.0.0.1', 500, 2000);
            console.log('[ORCHESTRATOR] Port 3306 is already in use. Assuming MySQL is already running.');
            dbNeedsStart = false;
        } catch (e) {
            console.log('[ORCHESTRATOR] Port 3306 is free. Starting MySQL...');
        }

        if (dbNeedsStart) {
            dbProcess = spawn(MYSQLD_PATH, [
                `--datadir=${DATA_DIR}`,
                '--console',
                '--port=3306',
                '--mysqlx=0'
            ]);

            dbProcess.stdout.on('data', data => log('DB', data));
            dbProcess.stderr.on('data', data => log('DB-ERR', data));
            
            dbProcess.on('exit', (code) => {
                console.log(`[DB] Exited with code ${code}`);
            });
        }

        // Wait for DB to be ready
        console.log('[ORCHESTRATOR] Waiting for MySQL to accept connections...');
        await pollPort(3306, '127.0.0.1', 1000, 30000);
        console.log('[ORCHESTRATOR] MySQL is ready.');

        // Initialize DB Schema and User
        await runInitSql();

        // 2. Start Backend
        console.log('[ORCHESTRATOR] Checking dependencies for Backend...');
        execSync('npm install', { cwd: path.resolve(__dirname, '../backend'), stdio: 'ignore' });
        
        console.log('[ORCHESTRATOR] Starting Backend...');
        backendProcess = spawn('npm', ['start'], { 
            cwd: path.resolve(__dirname, '../backend'),
            stdio: ['ignore', 'pipe', 'pipe'],
            shell: true
        });

        backendProcess.stdout.on('data', data => log('BACKEND', data));
        backendProcess.stderr.on('data', data => log('BACKEND-ERR', data));

        backendProcess.on('exit', (code) => {
            console.log(`[BACKEND] Exited with code ${code}`);
        });

        // Wait for Backend to be ready
        console.log('[ORCHESTRATOR] Waiting for Backend API to be ready on port 5000...');
        await pollHttp('http://localhost:5000/api', 1000, 30000);
        console.log('[ORCHESTRATOR] Backend API is ready.');

        // 3. Start Frontend
        const frontendDir = path.resolve(__dirname, '../rrdch_frontend/rrdch_frontend/frontend');
        console.log('[ORCHESTRATOR] Checking dependencies for Frontend...');
        execSync('npm install', { cwd: frontendDir, stdio: 'ignore' });

        console.log('[ORCHESTRATOR] Starting Frontend...');
        frontendProcess = spawn('npm', ['run', 'dev'], { 
            cwd: frontendDir,
            stdio: ['ignore', 'pipe', 'pipe'],
            shell: true
        });

        frontendProcess.stdout.on('data', data => log('FRONTEND', data));
        frontendProcess.stderr.on('data', data => log('FRONTEND-ERR', data));

        frontendProcess.on('exit', (code) => {
            console.log(`[FRONTEND] Exited with code ${code}`);
        });

        console.log('\n================================================================');
        console.log('[SUCCESS] All services started perfectly. Press Ctrl+C to stop.');
        console.log('================================================================\n');

    } catch (error) {
        console.error('\n[FATAL] Orchestration failed:', error.message);
        cleanup();
        process.exit(1);
    }
};

const cleanup = () => {
    console.log('\n[ORCHESTRATOR] Cleaning up child processes...');
    const killCmd = /^win/.test(process.platform) ? 'taskkill /pid' : 'kill -9';
    const killFlag = /^win/.test(process.platform) ? '/T /F' : '';
    
    if (frontendProcess && !frontendProcess.killed) {
        console.log('[ORCHESTRATOR] Terminating Frontend...');
        try { execSync(`${killCmd} ${frontendProcess.pid} ${killFlag}`); } catch (e) {}
    }
    if (backendProcess && !backendProcess.killed) {
        console.log('[ORCHESTRATOR] Terminating Backend...');
        try { execSync(`${killCmd} ${backendProcess.pid} ${killFlag}`); } catch (e) {}
    }
    if (dbProcess && !dbProcess.killed) {
        console.log('[ORCHESTRATOR] Terminating DB...');
        try { execSync(`${killCmd} ${dbProcess.pid} ${killFlag}`); } catch (e) {}
    }
    console.log('[ORCHESTRATOR] Cleanup complete.');
};

process.on('SIGINT', () => {
    cleanup();
    process.exit(0);
});

process.on('SIGTERM', () => {
    cleanup();
    process.exit(0);
});

start();
