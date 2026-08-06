const logosInstitucionais = [

    "img/Logo_Fiep_Azul_Fundo_Transparente.png",

    "img/Logo_IEL_Azul_Fundo_Transparente.png",

    "img/Logo_Senai_Azul_Fundo_Transparente.png",

    "img/Logo_Sesi_Azul_Fundo_Transparente.png"
];

let logoAtual = 0;
let intervaloLogos;

function trocarLogoInstitucional() {

    const logo =
        document.getElementById(
            "logoInstitucionalRotativa"
        );

    if (!logo) return;

    logo.style.opacity = 0;

    setTimeout(() => {

        logo.src =
            logosInstitucionais[logoAtual];

        logo.style.opacity = 1;

        logoAtual++;

        if (
            logoAtual >=
            logosInstitucionais.length
        ) {
            logoAtual = 0;
        }

    }, 400);
}

function obterDataLocal() {

    const agora = new Date();

    const ano = agora.getFullYear();

    const mes =
        String(agora.getMonth() + 1)
            .padStart(2, "0");

    const dia =
        String(agora.getDate())
            .padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

let dataAtualSistema =
    obterDataLocal();


const avisosBanner = [

    "MATRÍCULAS ABERTAS!",

    "SIGA  @sesisenaiiel.ampere  NO INSTAGRAM",

    "EDUCAÇÃO PROFISSIONAL PARA TRANSFORMAR VIDAS",

    "CONSULTE A PROGRAMAÇÃO DAS SALAS"
];

let indiceBanner = 0;

function atualizarRelogio() {

    const agora = new Date();

    document.getElementById("horaAtual").textContent =
        agora.toLocaleTimeString("pt-BR");

    document.getElementById("dataAtual").textContent =
        agora
            .toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            })
            .toUpperCase();

    const novaData =
        obterDataLocal();

    if (novaData !== dataAtualSistema) {

        console.log("Virada de dia detectada.");

        location.reload();
    }
}

function atualizarBanner() {

    document
        .getElementById("bannerTexto")
        .textContent =
        avisosBanner[indiceBanner];

    indiceBanner++;

    if (
        indiceBanner >=
        avisosBanner.length
    ) {

        indiceBanner = 0;
    }
}

async function carregarDados() {

    const horaAtual =
        new Date().getHours();

    if (
        horaAtual < 8 ||
        horaAtual >= 23
    ) {

        mostrarModoInstitucional();

        return;
    }

    try {

        const resposta = await fetch(
            `https://senai-ampere.github.io/painel-salas-dados/dados.json?v=${Date.now()}`
        );

        const dados = await resposta.json();

        const hoje =
            obterDataLocal();

        const turmasHoje =
            dados.filter(
                item => item.data === hoje
            );
        console.table(turmasHoje);

        document.getElementById("dataExibida")
            .innerHTML =
            `<strong>PROGRAMAÇÃO DE HOJE:</strong> ${new Date(hoje + "T12:00:00")
                .toLocaleDateString("pt-BR")}`;

        const total = turmasHoje.length;

        document.getElementById("contadorSalas")
            .textContent =
            total === 1
                ? "01 AMBIENTE OCUPADO"
                : `${String(total).padStart(2, "0")} AMBIENTES OCUPADOS`;

        const ordemSalas = [
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

        turmasHoje.sort((a, b) => {

            const posA =
                ordemSalas.indexOf(a.sala) === -1
                    ? 999
                    : ordemSalas.indexOf(a.sala);

            const posB =
                ordemSalas.indexOf(b.sala) === -1
                    ? 999
                    : ordemSalas.indexOf(b.sala);

            return posA - posB;
        });

        const container =
            document.getElementById("salasContainer");
        document
            .getElementById("qrFlutuante")
            .style.display = "block";

        container.classList.remove(
            "modo-institucional"
        );

        container.innerHTML = "";

        if (turmasHoje.length === 0) {

            container.innerHTML = `
                <div class="card sem-aulas">
                    <div class="sala">
                        SEM PROGRAMAÇÃO
                    </div>

                    <div class="turma">
                        Nenhuma aula programada para hoje.
                    </div>
                </div>
            `;

            document.getElementById("contadorSalas")
                .textContent =
                "0 ambientes ocupados";

            return;
        }

        turmasHoje.forEach(item => {

            console.log(item.sala);

            container.innerHTML += `
        <div class="card">
            <div class="sala">
                ${item.sala}
            </div>

            <div class="turma">
                ${item.turma.toUpperCase()}
            </div>
        </div>
    `;
        });

        document.getElementById("ultimaAtualizacao")
            .innerText =
            `Atualizado às ${new Date()
                .toLocaleTimeString("pt-BR")}`;

    } catch (error) {

        console.error(error);

        document.getElementById("salasContainer")
            .innerHTML = `
                <div class="card">
                    <div class="turma">
                        Erro ao carregar dados.
                    </div>
                </div>
            `;
    }
}

function mostrarModoInstitucional() {

    document
        .getElementById("qrFlutuante")
        .style.display = "none";

    document.getElementById(
        "dataExibida"
    ).innerHTML =
        "PAINEL INSTITUCIONAL";

    document.getElementById(
        "contadorSalas"
    ).innerHTML = "";

    document.getElementById(
        "salasContainer"
    ).innerHTML = `

        <div class="institucional-layout">

            <div class="logos-rotativas">

                <img
                    id="logoInstitucionalRotativa"
                    src="img/Logo_Sesi_Azul_Fundo_Transparente.png"
                >

            </div>

            <div class="qr-institucional">

                <h3>
                    MATRÍCULAS ABERTAS
                </h3>

                <img
                    src="img/qrcode-instagram.png"
                >

                <p>
                    Escaneie para saber mais
                </p>

            </div>

        </div>

    `;

    const container =
        document.getElementById(
            "salasContainer"
        );

    container.classList.add(
        "modo-institucional"
    );

    container.innerHTML = `
    <div class="institucional-layout">

        <div class="logos-rotativas">

            <img
                id="logoInstitucionalRotativa"
                src="img/Logo_Sesi_Azul_Fundo_Transparente.png"
            >

        </div>

        <div class="qr-institucional">

            <h3>MATRÍCULAS ABERTAS</h3>

            <img
                src="img/qrcode-instagram.png"
            >

            <p>
                Escaneie para saber mais
            </p>

        </div>

    </div>
`;
    if (intervaloLogos) {
        clearInterval(intervaloLogos);
    }

    trocarLogoInstitucional();

    intervaloLogos = setInterval(
        trocarLogoInstitucional,
        8000
    );
}

atualizarRelogio();
carregarDados();

setInterval(
    atualizarRelogio,
    1000
);

setInterval(
    carregarDados,
    60000
);

setInterval(() => {

    location.reload();

}, 300000);

atualizarBanner();

setInterval(
    atualizarBanner,
    10000
);