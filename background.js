// Valores padrão caso o usuário ainda não tenha configurado nada
let config = { site: "youtube.com", limite: 7200 }; 
let tempoGasto = 0;

// Carrega as configurações salvas assim que a extensão inicia
chrome.storage.local.get(["configSite", "configLimite", "tempoGasto"], (res) => {
  if (res.configSite) config.site = res.configSite;
  if (res.configLimite) config.limite = parseInt(res.configLimite);
  if (res.tempoGasto) tempoGasto = res.tempoGasto;
});

// Verifica a aba ativa a cada 10 segundos
setInterval(async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (tab && tab.url && tab.url.includes(config.site)) {
    tempoGasto += 10;
    chrome.storage.local.set({ tempoGasto: tempoGasto });

    if (tempoGasto >= config.limite) {
      chrome.tabs.remove(tab.id);
      alert(`Chega de ${config.site} por hoje! Seu limite de tempo acabou.`);
    }
  }
}, 10000);

// Escuta mudanças feitas na interface visual (popup)
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "atualizarConfig") {
    config.site = request.site;
    config.limite = parseInt(request.limite);
    tempoGasto = 0; // Reseta o tempo ao mudar de site/limite para evitar bugs
    chrome.storage.local.set({ configSite: config.site, configLimite: config.limite, tempoGasto: 0 });
  }
});

// Reseta o contador à meia-noite
const tempoAteMeiaNoite = new Date().setHours(24, 0, 0, 0) - Date.now();
setTimeout(() => {
  tempoGasto = 0;
  chrome.storage.local.set({ tempoGasto: 0 });
  setInterval(() => { 
    tempoGasto = 0; 
    chrome.storage.local.set({ tempoGasto: 0 });
  }, 86400000);
}, tempoAteMeiaNoite);