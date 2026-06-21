// Script auxiliar (Node) que gera os arquivos dados-<familia>.json criptografados.
// Formato compatível com a Web Crypto API usada em cripto.js (tag GCM anexada ao final).
// A senha de cada família é o próprio sobrenome (id).
// Uso: node gerar-exemplo.js
const crypto = require("crypto");
const fs = require("fs");

const ITERACOES = 250000;

function criptografar(objeto, senha) {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const key = crypto.pbkdf2Sync(senha, salt, ITERACOES, 32, "sha256");
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const plano = Buffer.from(JSON.stringify(objeto), "utf8");
  const ct = Buffer.concat([cipher.update(plano), cipher.final()]);
  const tag = cipher.getAuthTag();
  const conteudo = Buffer.concat([ct, tag]); // Web Crypto anexa a tag de 16 bytes ao final
  return {
    v: 1, kdf: "PBKDF2", hash: "SHA-256", cifra: "AES-GCM", iteracoes: ITERACOES,
    salt: salt.toString("base64"),
    iv: iv.toString("base64"),
    conteudo: conteudo.toString("base64"),
  };
}

const agora = new Date().toLocaleString("pt-BR");

const familias = [
  {
    id: "hatanaka",
    senha: "hatanaka",
    arquivo: "dados-hatanaka.json",
    dados: {
      familia: "Hatanaka",
      atualizadoEm: agora,
      membros: [
        {
          nome: "João Hatanaka", parentesco: "Pai (avô materno)", nascimento: "1972-04-15", sexo: "Masculino", foto: "",
          telefone: "(11) 90000-0001", contatoEmergencia: "Maria Hatanaka — (11) 90000-0002",
          planoSaude: "Unimed", numeroPlano: "0000 0000 0000 0000",
          tipoSanguineo: "O+", peso: "82 kg", altura: "1,78 m",
          alergias: ["Dipirona", "Frutos do mar"], condicoes: ["Hipertensão", "Colesterol alto"],
          cirurgias: ["Apendicectomia (2005)"], vacinas: ["COVID-19 — reforço (2023)", "Influenza (2024)"],
          historicoFamiliar: "Pai com diabetes tipo 2. Mãe com hipertensão.",
          observacoes: "Acompanhamento cardiológico semestral. (DADOS DE EXEMPLO)",
          medicamentos: [{ nome: "Losartana", dose: "50 mg", frequencia: "1x ao dia" }, { nome: "Sinvastatina", dose: "20 mg", frequencia: "à noite" }],
          medicos: [{ nome: "Dr. Carlos Lima", especialidade: "Cardiologia", telefone: "(11) 3000-0000" }],
          exames: [{ nome: "Hemograma completo", tipo: "Sangue", data: "2024-12-10", observacao: "Dentro da normalidade.", link: "" }],
        },
        {
          nome: "Maria Hatanaka", parentesco: "Mãe (avó materna)", nascimento: "1975-09-30", sexo: "Feminino", foto: "",
          telefone: "(11) 90000-0002", contatoEmergencia: "João Hatanaka — (11) 90000-0001",
          planoSaude: "Unimed", numeroPlano: "0000 0000 0000 0001",
          tipoSanguineo: "A+", peso: "63 kg", altura: "1,65 m",
          alergias: ["Penicilina"], condicoes: ["Hipotireoidismo"], cirurgias: [],
          vacinas: ["COVID-19 — reforço (2023)"],
          historicoFamiliar: "Histórico de câncer de mama na família materna.",
          observacoes: "DADOS DE EXEMPLO.",
          medicamentos: [{ nome: "Levotiroxina", dose: "75 mcg", frequencia: "em jejum" }],
          medicos: [{ nome: "Dra. Ana Souza", especialidade: "Endocrinologia", telefone: "(11) 3000-0001" }],
          exames: [],
        },
      ],
    },
  },
  {
    id: "bussinati",
    senha: "bussinati",
    arquivo: "dados-bussinati.json",
    dados: {
      familia: "Bussinati",
      atualizadoEm: agora,
      membros: [
        {
          nome: "Pedro Bussinati", parentesco: "Pai (avô paterno)", nascimento: "1968-02-20", sexo: "Masculino", foto: "",
          telefone: "(11) 91111-0001", contatoEmergencia: "Lúcia Bussinati — (11) 91111-0002",
          planoSaude: "Bradesco Saúde", numeroPlano: "1111 1111 1111 1111",
          tipoSanguineo: "B+", peso: "88 kg", altura: "1,80 m",
          alergias: ["Sulfa"], condicoes: ["Diabetes tipo 2"],
          cirurgias: ["Catarata - olho direito (2019)"], vacinas: ["COVID-19 — reforço (2023)", "Pneumonia (2022)"],
          historicoFamiliar: "Pai faleceu de infarto. Diabetes na família.",
          observacoes: "Usa insulina. (DADOS DE EXEMPLO)",
          medicamentos: [{ nome: "Metformina", dose: "850 mg", frequencia: "2x ao dia" }, { nome: "Insulina NPH", dose: "20 UI", frequencia: "manhã e noite" }],
          medicos: [{ nome: "Dr. Roberto Dias", especialidade: "Endocrinologia", telefone: "(11) 3111-0000" }],
          exames: [{ nome: "Glicemia de jejum", tipo: "Sangue", data: "2025-01-15", observacao: "Glicada 7,2%.", link: "" }],
        },
        {
          nome: "Lúcia Bussinati", parentesco: "Mãe (avó paterna)", nascimento: "1970-11-05", sexo: "Feminino", foto: "",
          telefone: "(11) 91111-0002", contatoEmergencia: "Pedro Bussinati — (11) 91111-0001",
          planoSaude: "Bradesco Saúde", numeroPlano: "1111 1111 1111 1112",
          tipoSanguineo: "O-", peso: "68 kg", altura: "1,62 m",
          alergias: [], condicoes: ["Artrite reumatoide"], cirurgias: [],
          vacinas: ["COVID-19 — reforço (2023)", "Influenza (2024)"],
          historicoFamiliar: "Mãe com osteoporose.",
          observacoes: "DADOS DE EXEMPLO.",
          medicamentos: [{ nome: "Metotrexato", dose: "15 mg", frequencia: "1x por semana" }],
          medicos: [{ nome: "Dra. Fernanda Rocha", especialidade: "Reumatologia", telefone: "(11) 3111-0001" }],
          exames: [],
        },
      ],
    },
  },
  {
    id: "rapariga",
    senha: "rapariga",
    arquivo: "dados-rapariga.json",
    dados: {
      familia: "Rapariga",
      atualizadoEm: agora,
      membros: [
        {
          nome: "Lucas Rapariga", parentesco: "Eu (marido)", nascimento: "1995-07-12", sexo: "Masculino", foto: "",
          telefone: "(11) 92222-0001", contatoEmergencia: "Beatriz Rapariga — (11) 92222-0002",
          planoSaude: "SulAmérica", numeroPlano: "2222 2222 2222 2222",
          tipoSanguineo: "A-", peso: "75 kg", altura: "1,76 m",
          alergias: ["Camarão"], condicoes: [],
          cirurgias: [], vacinas: ["COVID-19 — reforço (2023)", "Febre amarela (2018)"],
          historicoFamiliar: "Pais com hipertensão (lado Bussinati/Hatanaka).",
          observacoes: "Saudável, pratica corrida. (DADOS DE EXEMPLO)",
          medicamentos: [],
          medicos: [{ nome: "Dr. Marcos Teixeira", especialidade: "Clínico geral", telefone: "(11) 3222-0000" }],
          exames: [{ nome: "Check-up anual", tipo: "Clínico", data: "2025-03-01", observacao: "Tudo normal.", link: "" }],
        },
        {
          nome: "Beatriz Rapariga", parentesco: "Esposa", nascimento: "1996-12-22", sexo: "Feminino", foto: "",
          telefone: "(11) 92222-0002", contatoEmergencia: "Lucas Rapariga — (11) 92222-0001",
          planoSaude: "SulAmérica", numeroPlano: "2222 2222 2222 2223",
          tipoSanguineo: "AB+", peso: "60 kg", altura: "1,68 m",
          alergias: ["Lactose (intolerância)"], condicoes: ["Enxaqueca crônica"],
          cirurgias: [], vacinas: ["COVID-19 — reforço (2023)", "HPV (2015)"],
          historicoFamiliar: "Mãe com enxaqueca.",
          observacoes: "DADOS DE EXEMPLO.",
          medicamentos: [{ nome: "Topiramato", dose: "50 mg", frequencia: "à noite" }],
          medicos: [{ nome: "Dra. Júlia Antunes", especialidade: "Neurologia", telefone: "(11) 3222-0001" }],
          exames: [],
        },
      ],
    },
  },
];

const manifesto = [];
for (const f of familias) {
  const pacote = criptografar(f.dados, f.senha);
  fs.writeFileSync(f.arquivo, JSON.stringify(pacote, null, 2));
  manifesto.push({ id: f.id, nome: f.dados.familia, arquivo: f.arquivo });
  console.log("Gerado", f.arquivo, "(senha:", f.senha + ")");
}
fs.writeFileSync("familias.json", JSON.stringify(manifesto, null, 2) + "\n");
console.log("Manifesto familias.json atualizado.");
