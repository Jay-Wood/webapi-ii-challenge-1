const server = require("./server.js");

const port = 7777;

server.listen(port, () => console.log(`server running on ${port}`))