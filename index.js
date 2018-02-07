const { del, get, post, router } = require("microrouter");
const {
    register,
    Histogram,
    Counter,
    Gauge,
    collectDefaultMetrics
} = require('prom-client');


const h = new Histogram({
    name: 'test_histogram',
    help: 'Example of a histogram',
    labelNames: ['code']
});
const c = new Counter({
    name: 'test_counter',
    help: 'Example of a counter',
    labelNames: ['code']
});
const g = new Gauge({
    name: 'test_gauge',
    help: 'Example of a gauge',
    labelNames: ['method', 'code']
});
setTimeout(() => {
    h.labels('200').observe(Math.random());
    h.labels('300').observe(Math.random());
}, 10);

setInterval(() => {
    c.inc({ code: 200 });
}, 5000);

setInterval(() => {
    c.inc({ code: 400 });
}, 2000);

setInterval(() => {
    c.inc();
}, 2000);

setInterval(() => {
    g.set({ method: 'get', code: 200 }, Math.random());
    g.set(Math.random());
    g.labels('post', '300').inc();
}, 100);

const micro = require("micro");

const handler = (req, res) => {
    console.log(Object.keys(req))
    // console.log(req);
    return `Welcome to Kubernates :> !!!  path -> ${req.url}`;
}

const handlerPong = (req, res) => {
    return 'pong'
}

const routers = router(
    get("/fe-search/ping", handlerPong),

    // prometheus
    get('/metrics', (req, res) => {
        res.setHeader('Content-Type', register.contentType);
        res.end(register.metrics());
    }),
    // prometheus
    get('/metrics/counter', (req, res) => {
        res.setHeader('Content-Type', register.contentType);
        res.end(register.getSingleMetricAsString('test_counter'));
    }),
    get("/*", handler),
    post("/*", handler),
    del("/*", handler)
);
collectDefaultMetrics();

const server = micro(routers);
server.listen(3000);
