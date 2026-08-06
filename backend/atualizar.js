require("dotenv").config();

const fs = require("fs");
const XLSX = require("xlsx");

const {
    EXCEL_PATH
} = process.env;

const logger = require("./src/logger");
const { gerarDados } = require("./src/excel");
const {
    obterArquivo,
    salvarArquivo
} = require("./src/github");

console.log("Arquivo utilizado:");
console.log(EXCEL_PATH);

const stats = fs.statSync(EXCEL_PATH);

console.log("Última modificação:");
console.log(stats.mtime);

console.log("Tamanho:");
console.log(stats.size);

const workbook = XLSX.readFile(EXCEL_PATH);

console.log(workbook.SheetNames);

const worksheet = workbook.Sheets[workbook.SheetNames[0]];

console.log(
    XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        raw: false
    }).slice(0,20)
);

(async () => {

    try {

        logger.info("Lendo planilha...");

        const dados = gerarDados();

        logger.info(`${dados.length} registros encontrados.`);

        const json = JSON.stringify(dados, null, 2);

        fs.writeFileSync("dados.json", json);

        logger.info("Buscando arquivo no GitHub...");

        const remoto = await obterArquivo("dados.json");

        if (remoto.existe) {

            if (remoto.conteudo === json) {

                logger.info("Nenhuma alteração encontrada.");
                return;

            }

            logger.info("Atualizando dados.json...");

            await salvarArquivo(
                "dados.json",
                json,
                remoto.sha
            );

        } else {

            logger.info("Criando dados.json...");

            await salvarArquivo(
                "dados.json",
                json
            );

        }

        logger.info("GitHub atualizado com sucesso.");

    }

    catch (e) {

        logger.erro(e.response?.data?.message || e.message);

    }

})();