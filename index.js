const { del, get, post, router } = require("microrouter");

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
    get("/*", handler),
    post("/*", handler),
    del("/*", handler)
);

const server = micro(routers);
server.listen(3000);
