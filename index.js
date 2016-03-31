'use strict';

const redis = require('redis');
const express = require('express');
const request = require('request');

const app = express();
const client = redis.createClient('//pub-redis-12165.us-east-1-3.2.ec2.garantiadata.com:12165');
client.auth(process.env.REDIS_PSWD);

client.on('error', (err) => {
    console.log('Error ' + err);
});

function getNode() {
    const nodes = ['http://ex-node-0.compute.worldfly.org'];
    var i = 0;

    return () => nodes[i < nodes.length ? i++ : i = 0];
}
var node = getNode();

app.use((req, res) => {
    if (req.method !== 'GET') {
        res.status(400);

    } else {
        request.get(node() + req.originalUrl).pipe(res);
        // client.get(req.originalUrl + ':expire', (err, r) => {
        //     if (err) {
        //         request.get(`http://${node()}/${req.originalUrl}`, (error, response, body) => {
        //             if (error) {
        //                 return res.status(502);
        //             }
        //
        //             const cacheControl = response.headers['cache-control'].split(', ');
        //             if (cacheControl === 'private') {
        //
        //             }
        //         });
        //     }
        //
        //     if (r > new Date()) {
        //         request.get(`http://${node()}/${req.originalUrl}`, (error, response, body) => {
        //             if (error) {
        //                 return res.status(502);
        //             }
        //
        //             const cacheControl = response.headers['cache-control'].split(', ');
        //             if (cacheControl === 'private') {
        //                 client.del(req.originalUrl, req.originalUrl + ':expire');
        //             }
        //         });
        //     }
        //     res.send(r);
        // })

    }
});

app.listen(3000);