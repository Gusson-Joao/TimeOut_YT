// Atualiza a tela com o tempo atualizado assim que abre o popup
chrome.storage.local.get(["configSite", "configLimite", "tempoGasto"], (res) => {
  const siteAtual = res.configSite || "youtube.com";
  const limiteAtual = res.configLimite || 7200;
  const gastoAtual = res.tempoGasto || 0;

  document.getElementById("txtSite").innerText = siteAtual;
  document.getElementById("txtTempo").innerText = `${Math.floor(gastoAtual / 60)} min / ${Math.floor(limiteAtual / 60)} min`;
  
  document.getElementById("inputSite").value = siteAtual;
  document.getElementById("inputLimite").value = Math.floor(limiteAtual / 60);
});

// Salva as novas configurações ao clicar no botão
document.getElementById("btnSalvar").addEventListener("click", () => {
  const novoSite = document.getElementById("inputSite").value.trim();
  const novoLimiteMinutos = parseInt(document.getElementById("inputLimite").value);
  
  if (novoSite && novoLimiteMinutos > 0) {
    const novoLimiteSegundos = novoLimiteMinutos * 60;
    
    // Envia a nova configuração para o background.js aplicar na hora
    chrome.runtime.sendMessage({
      action: "atualizarConfig",
      site: novoSite,
      limite: novoLimiteSegundos
    });

    alert("Configurações atualizadas e tempo zerado para o novo ciclo!");
    window.close(); // Fecha o balãozinho
  } else {
    alert("Por favor, preencha os campos corretamente.");
  }
});