import cluster from 'cluster';
import os from 'os';
import http from 'http';
import {Server as WebSocketServer} from 'ws';

const NO_OF_CPUS = os.cpus().length;
const WORKERS = new Set();

if (cluster.isMaster) {
    for (let i = 0; i < NO_OF_CPUS; i++) {
        const newWorker = cluster.fork();
        WORKERS.add(newWorker);

        cluster.on('exit', (worker, code, signal) => {
            console.log(`Worker ${worker.id} stopped.`);
        });
    }
} else {
    console.log(`Worker ${cluster.worker.id} started.`);
    const httpServer = http.createServer((req, res) => {
        res.writeHead(200);
        res.end(`Welcome to signals server ${cluster.worker.id}`);
    });
    httpServer.listen(8044);
}