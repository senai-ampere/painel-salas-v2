require("dotenv").config();

module.exports = {
    token: process.env.GITHUB_TOKEN,
    owner: process.env.GITHUB_OWNER,
    repo: process.env.GITHUB_REPO,
    excel: process.env.EXCEL_PATH
};