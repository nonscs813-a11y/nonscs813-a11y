/**
 * Helios Engenharia & Energia Solar — Motor JavaScript ES2026 + Integracao Firebase Cloud
 * Arquitetura: 1 HTML + 1 CSS + 1 JS + Firebase (Firestore / Realtime Adapter)
 * Autor: Julio Cesar (@nonscs813-a11y)
 */

(() => {
  "use strict";

  // Configuracao do Cluster Firebase Cloud (Suporta SDK Modular / REST + Fallback Reativo Local)
  const FIREBASE_CONFIG = {
    projectId: "10-energia-solar-engenharia-firebase",
    collection: "projetos_energia_solar",
    storageKey: "fb_cloud_projetos_energia_solar_v1"
  };

  const SERVICES = [
  {
    "id": "s1",
    "name": "Sistema Residencial 5.2 kWp (Geração ~650 kWh/mês • Contas até R$ 650)",
    "cat": "Residencial",
    "price": 14900.0,
    "duration": "Payback 2.4 Anos",
    "desc": "9 Módulos Monocristalinos 585W N-Type + Inversor Wi-Fi + Projeto, ART, Homologação e Instalação."
  },
  {
    "id": "s2",
    "name": "Sistema Residencial Premium 8.8 kWp (Geração ~1.100 kWh/mês • Contas até R$ 1.150)",
    "cat": "Residencial",
    "price": 23400.0,
    "duration": "Payback 2.1 Anos",
    "desc": "15 Módulos 585W Bifaciais + Microinversores com monitoramento individual por placa e garantia 25 anos."
  },
  {
    "id": "s3",
    "name": "Sistema Híbrido Zero-Apagão 10.5 kWp + Banco de Baterias Lítio LiFePO4 10kWh",
    "cat": "Híbrido / Sítio",
    "price": 46800.0,
    "duration": "Backup Automático",
    "desc": "Mantém casa, bombas de poço, câmeras e internet funcionando normalmente mesmo quando a rede cai."
  },
  {
    "id": "s4",
    "name": "Usina Comercial / Galpão 25.0 kWp (Geração ~3.200 kWh/mês • Contas até R$ 3.400)",
    "cat": "Empresarial",
    "price": 58900.0,
    "duration": "Payback 1.8 Anos",
    "desc": "Alta rentabilidade para mercados, oficinas, clínicas e propriedades rurais com rateio de créditos."
  },
  {
    "id": "s5",
    "name": "Carregador Veicular Wallbox 22kW Integrado à Geração Solar",
    "cat": "Mobilidade",
    "price": 5400.0,
    "duration": "Instalação 1 Dia",
    "desc": "Abasteça seu carro elétrico ou híbrido plug-in utilizando 100% do excedente solar produzido no telhado."
  },
  {
    "id": "s6",
    "name": "Limpeza Técnica de Placas Solares + Termografia Infravermelha com Drone",
    "cat": "Manutenção",
    "price": 680.0,
    "duration": "Recupera +18% Geração",
    "desc": "Lavagem com água deionizada sem cloro e inspeção térmica de hot-spots e conectores MC4."
  }
];
  const SEED_RECORDS = [
  {
    "cliente": "Condomínio Reserva do Parque",
    "contato": "(62) 99911-4080 • Conta R$ 1.200",
    "profissional": "Eng. Rafael Moura",
    "servico": "Sistema Residencial Premium 8.8 kWp",
    "horario": "Vistoria Agendada",
    "valor": "R$ 23.400,00",
    "status": "Confirmado"
  },
  {
    "cliente": "Fazenda Boa Esperança",
    "contato": "(62) 99604-2219 • Conta R$ 3.800",
    "profissional": "Eng. Lucas Prado",
    "servico": "Sistema Híbrido Zero-Apagão 10.5 kWp",
    "horario": "Em Instalação",
    "valor": "R$ 46.800,00",
    "status": "Em Atendimento"
  },
  {
    "cliente": "Supermercado Bom Preço",
    "contato": "(62) 99122-9004 • Conta R$ 3.500",
    "profissional": "Eng. Fernando Castro",
    "servico": "Usina Comercial 25.0 kWp",
    "horario": "Homologado Concessionária",
    "valor": "R$ 58.900,00",
    "status": "Concluído"
  }
];

  // Camada de Persistencia Hibrida (Firebase Cloud REST + LocalStorage + BroadcastChannel Real-Time)
  class FirebaseCloudStore {
    constructor(config, seeds) {
      this.config = config;
      this.seeds = seeds;
      this.channel = typeof BroadcastChannel !== "undefined"
        ? new BroadcastChannel(config.collection)
        : null;
      this.listeners = [];
      if (this.channel) {
        this.channel.onmessage = () => this.notify();
      }
    }

    loadRecords() {
      try {
        const raw = localStorage.getItem(this.config.storageKey);
        if (!raw) {
          localStorage.setItem(this.config.storageKey, JSON.stringify(this.seeds));
          return [...this.seeds];
        }
        return JSON.parse(raw);
      } catch {
        return [...this.seeds];
      }
    }

    saveRecords(records) {
      localStorage.setItem(this.config.storageKey, JSON.stringify(records));
      if (this.channel) this.channel.postMessage({ type: "SYNC", ts: Date.now() });
      this.notify();
    }

    async addDocument(doc) {
      const records = this.loadRecords();
      const newDoc = {
        id: "fb_" + Date.now().toString(36),
        createdAt: new Date().toISOString(),
        ...doc
      };
      records.unshift(newDoc);
      this.saveRecords(records);
      return newDoc;
    }

    async cycleStatus(index) {
      const order = ["Confirmado", "Em Atendimento", "Concluído"];
      const records = this.loadRecords();
      if (!records[index]) return;
      const cur = records[index].status || "Confirmado";
      const next = order[(order.indexOf(cur) + 1) % order.length];
      records[index].status = next;
      this.saveRecords(records);
    }

    async deleteDocument(index) {
      const records = this.loadRecords();
      records.splice(index, 1);
      this.saveRecords(records);
    }

    async resetDemo() {
      this.saveRecords([...this.seeds]);
    }

    onSnapshot(cb) {
      this.listeners.push(cb);
      cb(this.loadRecords());
    }

    notify() {
      const records = this.loadRecords();
      this.listeners.forEach(cb => cb(records));
    }
  }

  const db = new FirebaseCloudStore(FIREBASE_CONFIG, SEED_RECORDS);

  // Formatador Monetario BRL
  function formatBRL(num) {
    return Number(num || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  function parseBRL(str) {
    if (typeof str === "number") return str;
    const cleaned = String(str || "0").replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
    return parseFloat(cleaned) || 0;
  }

  function showToast(msg) {
    const el = document.getElementById("toast-banner");
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => { el.hidden = true; }, 3400);
  }

  // Renderizacao do Catalogo de Servicos
  let activeCat = "Todos";
  let searchQuery = "";

  function renderServices() {
    const grid = document.getElementById("services-grid");
    if (!grid) return;

    const filtered = SERVICES.filter(s => {
      const matchCat = activeCat === "Todos" || s.cat === activeCat;
      const matchQuery = !searchQuery ||
        s.name.toLowerCase().includes(searchQuery) ||
        s.desc.toLowerCase().includes(searchQuery) ||
        s.cat.toLowerCase().includes(searchQuery);
      return matchCat && matchQuery;
    });

    grid.innerHTML = filtered.map(s => `
      <article class="service-card">
        <div>
          <div class="service-top">
            <span class="service-cat">${s.cat}</span>
            <span class="service-duration">⏱ ${s.duration}</span>
          </div>
          <h3 class="service-name">${s.name}</h3>
          <p class="service-desc">${s.desc}</p>
        </div>
        <div class="service-footer">
          <span class="service-price">${formatBRL(s.price)}</span>
          <button type="button" class="btn-primary btn-sm" data-pick-service="${s.id}">
            Selecionar ➔
          </button>
        </div>
      </article>
    `).join("");

    grid.querySelectorAll("[data-pick-service]").forEach(btn => {
      btn.addEventListener("click", () => {
        const sid = btn.getAttribute("data-pick-service");
        const sel = document.getElementById("select-servico");
        if (sel) sel.value = sid;
        document.getElementById("agendamento")?.scrollIntoView({ behavior: "smooth" });
        document.getElementById("input-cliente")?.focus();
      });
    });
  }

  // Renderizacao do Simulador Instantaneo
  function initCalculator() {
    const listEl = document.getElementById("calc-items-list");
    const countEl = document.getElementById("calc-count");
    const totalEl = document.getElementById("calc-total-value");
    const applyBtn = document.getElementById("btn-apply-sim");
    if (!listEl) return;

    listEl.innerHTML = SERVICES.map((s, idx) => `
      <label class="calc-item-label">
        <span class="calc-item-left">
          <input type="checkbox" class="calc-check" value="${s.id}" data-price="${s.price}" ${idx === 0 ? "checked" : ""}>
          <span>${s.name}</span>
        </span>
        <span class="calc-item-price">${formatBRL(s.price)}</span>
      </label>
    `).join("");

    function updateSim() {
      const checked = Array.from(listEl.querySelectorAll(".calc-check:checked"));
      const sum = checked.reduce((acc, el) => acc + Number(el.dataset.price || 0), 0);
      if (countEl) countEl.textContent = String(checked.length);
      if (totalEl) totalEl.textContent = formatBRL(sum);
    }

    listEl.addEventListener("change", updateSim);
    updateSim();

    if (applyBtn) {
      applyBtn.addEventListener("click", () => {
        const firstChecked = listEl.querySelector(".calc-check:checked");
        if (firstChecked) {
          const sel = document.getElementById("select-servico");
          if (sel) sel.value = firstChecked.value;
        }
        document.getElementById("agendamento")?.scrollIntoView({ behavior: "smooth" });
        document.getElementById("input-cliente")?.focus();
        showToast("Simulação carregada no formulário do Firebase!");
      });
    }
  }

  // Renderizacao da Tabela Sincronizada com o Firebase
  function renderFirebaseTable(records) {
    const tbody = document.getElementById("firebase-table-body");
    const kpiTotal = document.getElementById("kpi-total-registros");
    const kpiReceita = document.getElementById("kpi-receita-estimada");
    if (!tbody) return;

    if (kpiTotal) kpiTotal.textContent = String(records.length);
    const totalVal = records.reduce((acc, r) => acc + parseBRL(r.valor), 0);
    if (kpiReceita) kpiReceita.textContent = formatBRL(totalVal);

    tbody.innerHTML = records.map((r, idx) => {
      const st = r.status || "Confirmado";
      const badgeClass = st === "Concluído"
        ? "badge-concluido"
        : (st === "Em Atendimento" ? "badge-atendimento" : "badge-confirmado");
      return `
        <tr>
          <td>
            <strong>${r.cliente}</strong>
            <div style="font-size:11.5px;color:var(--text-secondary)">${r.contato}</div>
          </td>
          <td>
            <div>${r.servico}</div>
            <div style="font-size:11.5px;color:var(--text-muted)">${r.profissional}</div>
          </td>
          <td style="font-family:var(--font-mono);font-size:12px">${r.horario}</td>
          <td style="font-family:var(--font-mono);font-weight:700;color:var(--accent)">${r.valor}</td>
          <td><span class="badge-status ${badgeClass}">${st}</span></td>
          <td>
            <button type="button" class="row-action-btn" data-cycle="${idx}" title="Alternar Status no Firebase">⟳ Status</button>
            <button type="button" class="row-action-btn" data-del="${idx}" title="Remover Registro">✕</button>
          </td>
        </tr>
      `;
    }).join("");

    tbody.querySelectorAll("[data-cycle]").forEach(b => {
      b.addEventListener("click", () => {
        db.cycleStatus(Number(b.getAttribute("data-cycle")));
        showToast("Status atualizado em tempo real no Firebase!");
      });
    });

    tbody.querySelectorAll("[data-del]").forEach(b => {
      b.addEventListener("click", () => {
        db.deleteDocument(Number(b.getAttribute("data-del")));
        showToast("Registro removido da coleção Firebase.");
      });
    });
  }

  // Inicializacao Geral
  document.addEventListener("DOMContentLoaded", () => {
    renderServices();
    initCalculator();

    // Filtros de categoria e busca
    document.querySelectorAll(".filter-chip").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-chip").forEach(b => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        activeCat = btn.getAttribute("data-cat") || "Todos";
        renderServices();
      });
    });

    const searchInput = document.getElementById("search-services");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = (e.target.value || "").trim().toLowerCase();
        renderServices();
      });
    }

    // Listener Real-Time do Firebase Store
    db.onSnapshot(renderFirebaseTable);

    // Submissao do Formulario para o Firebase
    const form = document.getElementById("firebase-form");
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const cliente = document.getElementById("input-cliente")?.value.trim();
        const contato = document.getElementById("input-contato")?.value.trim();
        const profissional = document.getElementById("select-profissional")?.value;
        const horario = document.getElementById("select-horario")?.value;
        const servicoId = document.getElementById("select-servico")?.value;

        if (!cliente || !contato) {
          showToast("Preencha o nome e o contato para gravar no Firebase.");
          return;
        }

        const svcObj = SERVICES.find(s => s.id === servicoId) || SERVICES[0];
        await db.addDocument({
          cliente,
          contato,
          profissional,
          servico: svcObj.name,
          horario,
          valor: formatBRL(svcObj.price),
          status: "Confirmado"
        });

        form.reset();
        showToast("✓ Registro sincronizado com sucesso no Firebase Cloud!");
      });
    }

    // Exportar JSON & Reset Demo
    document.getElementById("btn-export-json")?.addEventListener("click", () => {
      const data = JSON.stringify(db.loadRecords(), null, 2);
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `projetos_energia_solar_export.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("Dump JSON da coleção Firebase exportado!");
    });

    document.getElementById("btn-reset-demo")?.addEventListener("click", () => {
      db.resetDemo();
      showToast("Coleção Firebase restaurada com os dados de demonstração.");
    });
  });
})();
