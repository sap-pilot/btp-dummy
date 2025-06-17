const cds = require("@sap/cds");
const LOG = cds.log("btp-dummy");

module.exports = cds.service.impl(srv => {
    srv.on("READ", "Message", _onReadMessage)
});

var REQUEST_COUNT = 0;

// default message
const msg = { 
    id: `${REQUEST_COUNT}`, 
    message: `Hello world!`
};

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function _onReadMessage(req) {
    const currentRequestIndex = REQUEST_COUNT++;
    if (req.req.query?.delay) {
        const delay = parseInt(req.req.query.delay, 10);
        if (isNaN(delay) || delay < 0) {
            return req.error(400, "Invalid delay value. It must be a non-negative integer.");
        }
        console.log(`#[${currentRequestIndex}] incoming GET /Message request with delay: ${delay} msecs for user: ${req.user?.id}`);
        console.log(`#[${currentRequestIndex}] taking a nap for ${delay} msecs for user: ${req.user?.id}`);
        await sleep(delay); // Pause for the specified delay
        console.log(`#[${currentRequestIndex}] woke up!`);
    }
    const currentMsg = {"id": `${currentRequestIndex}`, "message": `Hello world! (request #${currentRequestIndex})`};   
    return [currentMsg];
}
