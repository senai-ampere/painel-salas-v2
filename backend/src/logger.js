function info(msg) {
    console.log(`✔ ${msg}`);
}

function erro(msg) {
    console.error(`✖ ${msg}`);
}

module.exports = {
    info,
    erro
};