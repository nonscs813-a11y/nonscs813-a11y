# #10 — Helios Engenharia & Energia Solar (Engenharia Fotovoltaica & Projetos)

[![HTML5 Semântico](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://github.com/nonscs813-a11y/10-energia-solar-engenharia-firebase)
[![CSS3 Design System](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://github.com/nonscs813-a11y/10-energia-solar-engenharia-firebase)
[![JavaScript ES2026](https://img.shields.io/badge/JavaScript_ES2026-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://github.com/nonscs813-a11y/10-energia-solar-engenharia-firebase)
[![Firebase Cloud](https://img.shields.io/badge/Firebase_Cloud-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://github.com/nonscs813-a11y/10-energia-solar-engenharia-firebase)

> **Sistema Web 100% Nativo para Negócios Locais** — Desenvolvido com **1 arquivo HTML (`index.html`) + 1 arquivo CSS (`styles.css`) + 1 arquivo JavaScript (`app.js`) + Banco de Dados Firebase (`projetos_energia_solar`)**.

---

## 🎯 Visão Geral do Projeto

O sistema **Helios Engenharia & Energia Solar** foi projetado para resolver a operação digital de **Engenharia Fotovoltaica & Projetos** com performance extrema, zero dependências pesadas e sincronização em tempo real:

1. **Simulador Instantâneo (Calculadora de Economia Solar (25 Anos) & Potência kWp):** Cálculo dinâmico no cliente a 60fps.
2. **Catálogo Interativo com Busca e Filtro por Categoria:** Renderização reativa em JavaScript ES2026.
3. **Módulo Transacional Firebase (`projetos_energia_solar`):** Criação de registros, atualização de status em tempo real (`Confirmado` ➔ `Em Atendimento` ➔ `Concluído`), exclusão e exportação de dump JSON.
4. **Acessibilidade WCAG AAA & SEO Local:** Marcação estruturada `Schema.org/LocalBusiness` em JSON-LD.

---

## 🗂️ Arquitetura de Arquivos

```text
📦 10-energia-solar-engenharia-firebase/
 ┣ 📜 index.html        # Interface HTML5 semântica, Schema.org JSON-LD e landmarks acessíveis
 ┣ 🎨 styles.css        # Design System em CSS3 puro com paleta personalizada (#F97316)
 ┣ ⚡ app.js            # Motor reativo ES2026 + Camada de persistência Firebase Cloud (projetos_energia_solar)
 ┣ 🔥 firebase.json     # Configuração de deploy para Firebase Hosting + Headers de cache
 ┣ 🛡️ firestore.rules   # Regras de segurança do banco de dados Firebase Firestore
 ┗ 📘 README.md         # Documentação técnica completa
```

---

## 📋 Catálogo de Serviços Configurados no Sistema

| ID | Serviço / Solução | Categoria | Duração / Ref | Valor |
| :-: | :--- | :---: | :---: | :---: |
| `s1` | **Sistema Residencial 5.2 kWp (Geração ~650 kWh/mês • Contas até R$ 650)** | `Residencial` | `Payback 2.4 Anos` | **R$ 14.900,00** |
| `s2` | **Sistema Residencial Premium 8.8 kWp (Geração ~1.100 kWh/mês • Contas até R$ 1.150)** | `Residencial` | `Payback 2.1 Anos` | **R$ 23.400,00** |
| `s3` | **Sistema Híbrido Zero-Apagão 10.5 kWp + Banco de Baterias Lítio LiFePO4 10kWh** | `Híbrido / Sítio` | `Backup Automático` | **R$ 46.800,00** |
| `s4` | **Usina Comercial / Galpão 25.0 kWp (Geração ~3.200 kWh/mês • Contas até R$ 3.400)** | `Empresarial` | `Payback 1.8 Anos` | **R$ 58.900,00** |
| `s5` | **Carregador Veicular Wallbox 22kW Integrado à Geração Solar** | `Mobilidade` | `Instalação 1 Dia` | **R$ 5.400,00** |
| `s6` | **Limpeza Técnica de Placas Solares + Termografia Infravermelha com Drone** | `Manutenção` | `Recupera +18% Geração` | **R$ 680,00** |

---

## 🔥 Estrutura do Documento no Firebase (`projetos_energia_solar`)

```json
{
  "id": "fb_m9x8a72k",
  "cliente": "Condomínio Reserva do Parque",
  "contato": "(62) 99911-4080 • Conta R$ 1.200",
  "profissional": "Eng. Rafael Moura",
  "servico": "Sistema Residencial Premium 8.8 kWp",
  "horario": "Vistoria Agendada",
  "valor": "R$ 23.400,00",
  "status": "Confirmado",
  "createdAt": "2026-11-19T22:00:00.000Z"
}
```

---

## 🚀 Como Executar Localmente ou Publicar no Firebase

```bash
# 1. Clonar o repositório
git clone https://github.com/nonscs813-a11y/10-energia-solar-engenharia-firebase.git
cd 10-energia-solar-engenharia-firebase

# 2. Abrir diretamente no navegador ou servir localmente
npx serve .

# 3. (Opcional) Publicar no Firebase Hosting
npx firebase-tools deploy --only hosting
```

---

**Engenharia Web Sênior por [Julio Cesar (`@nonscs813-a11y`)](https://github.com/nonscs813-a11y)**
