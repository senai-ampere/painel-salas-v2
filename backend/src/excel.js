const XLSX = require("xlsx");
const { excel } = require("./config");

const AMBIENTES = [
    "SALA 01",
    "SALA 02",
    "SALA 03",
    "SALA MÓVEL 01",
    "SALA MÓVEL 02",
    "LAB. INFORMÁTICA",
    "LAB. MECÂNICA",
    "LAB. AUTOMAÇÃO",
    "LAB. ELÉTRICA",
    "LAB. VESTUÁRIO"
];

function obterNomeAbaAtual() {
    const hoje = new Date();

    const meses = [
        "JANEIRO",
        "FEVEREIRO",
        "MARÇO",
        "ABRIL",
        "MAIO",
        "JUNHO",
        "JULHO",
        "AGOSTO",
        "SETEMBRO",
        "OUTUBRO",
        "NOVEMBRO",
        "DEZEMBRO"
    ];

    return `${meses[hoje.getMonth()]} ${hoje.getFullYear()}`;
}

function excelDateToISO(valor) {

    if (!valor) return null;

    if (typeof valor === "number") {
        const data = XLSX.SSF.parse_date_code(valor);

        return `${data.y}-${String(data.m).padStart(2, "0")}-${String(data.d).padStart(2, "0")}`;
    }

    if (valor instanceof Date) {
        return valor.toISOString().split("T")[0];
    }

    const d = new Date(valor);

    if (!isNaN(d))
        return d.toISOString().split("T")[0];

    return null;
}

function gerarDados() {

    const workbook = XLSX.readFile(excel);

    const worksheet = workbook.Sheets[obterNomeAbaAtual()];

    console.log("================================");
    console.log("ABA LIDA:", obterNomeAbaAtual());

    console.log(
        XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            raw: false
        }).slice(0, 10)
    );

    if (!worksheet)
        throw new Error("Aba do mês não encontrada.");

    const linhas = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: ""
    });

    const cabecalhos = linhas[0];

    const dados = [];

    for (let i = 1; i < linhas.length; i++) {

        const linha = linhas[i];

        const diaSemana = String(linha[0]).trim();

        const data = excelDateToISO(linha[1]);

        if (!data)
            continue;

        for (let c = 2; c < cabecalhos.length; c++) {

            const sala = String(cabecalhos[c])
                .trim()
                .replace(/\s+/g, " ");

            if (!AMBIENTES.includes(sala))
                continue;

            const turma = String(linha[c]).trim();

            if (!turma)
                continue;

            dados.push({
                data,
                diaSemana,
                sala,
                turma
            });

        }

    }

    console.log("Primeiros registros:");
    console.log(dados.slice(0, 20));

    return dados;
}

module.exports = {
    gerarDados
};