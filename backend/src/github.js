const axios = require("axios");
const { token, owner, repo } = require("./config");

const api = axios.create({
    baseURL: `https://api.github.com/repos/${owner}/${repo}/contents`,
    headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json"
    }
});

async function obterArquivo(nome) {
    try {

        const { data } = await api.get(`/${nome}`);

        return {
            existe: true,
            sha: data.sha,
            conteudo: Buffer
                .from(data.content, "base64")
                .toString("utf8")
        };

    } catch (err) {

        if (err.response?.status === 404) {

            return {
                existe: false
            };

        }

        throw err;
    }
}

async function salvarArquivo(nome, conteudo, sha = null) {

    const body = {
        message: `Atualização automática ${new Date().toLocaleString("pt-BR")}`,
        content: Buffer.from(conteudo).toString("base64")
    };

    if (sha)
        body.sha = sha;

    await api.put(`/${nome}`, body);
}

module.exports = {
    obterArquivo,
    salvarArquivo
};