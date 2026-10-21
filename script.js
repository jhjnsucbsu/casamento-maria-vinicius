/* CONFIGURAÇÕES: altere os valores abaixo quando tiver os detalhes. */
const CONFIG = {
  // Horário provisório de 15h, usado SOMENTE para a contagem regressiva.
  // Troque pela hora verdadeira assim que estiver definida.
  dataHoraCasamento: '2027-01-10T15:00:00-03:00',
  // Fotos: envie arquivos com estes nomes para a pasta "imagens" no GitHub.
  fotos: {
    historia: 'imagens/historia.jpg',
    foto1: 'imagens/foto1.jpg',
    foto2: 'imagens/foto2.jpg',
    foto3: 'imagens/foto3.jpg'
  },
  // Cole links reais entre as aspas; enquanto estiverem vazios, os botões ficam desativados.
  linkMapa: '', // exemplo: https://maps.google.com/?q=...
  linkPresentes: '', // exemplo: https://...
  whatsappConfirmacao: '', // formato: 5521999999999 (somente números)
};

// Exibe fotos apenas quando os arquivos existirem, sem mostrar imagens quebradas.
Object.entries(CONFIG.fotos).forEach(([nome, caminho]) => {
  const elemento = document.querySelector(`[data-photo="${nome}"]`);
  if (!elemento) return;
  const imagem = new Image();
  imagem.onload = () => {
    elemento.style.backgroundImage = `url("${caminho}")`;
    elemento.classList.add('has-photo');
    elemento.setAttribute('role', 'img');
    elemento.setAttribute('aria-label', `Foto do casal - ${nome}`);
  };
  imagem.src = caminho;
});

const destino = new Date(CONFIG.dataHoraCasamento).getTime();
function atualizarContagem() {
  if (!Number.isFinite(destino)) return;
  const restante = Math.max(0, destino - Date.now());
  const dia = 86400000, hora = 3600000, minuto = 60000;
  const valores = {
    dias: Math.floor(restante / dia),
    horas: Math.floor((restante % dia) / hora),
    minutos: Math.floor((restante % hora) / minuto),
    segundos: Math.floor((restante % minuto) / 1000),
  };
  Object.entries(valores).forEach(([id, valor]) => {
    document.getElementById(id).textContent = String(valor).padStart(2, '0');
  });
  if (restante === 0) {
    document.getElementById('mensagem-contagem').textContent = 'Chegou o nosso grande dia! ♡';
  }
}
atualizarContagem();
setInterval(atualizarContagem, 1000);

// Habilita um botão somente quando existe link real.
function configurarLink(id, url, texto) {
  const elemento = document.getElementById(id);
  if (!elemento || !url) return;
  elemento.href = url;
  elemento.removeAttribute('aria-disabled');
  elemento.textContent = texto;
  if (/^https?:\/\//i.test(url)) {
    elemento.target = '_blank';
    elemento.rel = 'noopener noreferrer';
  }
}
configurarLink('mapa-link', CONFIG.linkMapa, 'Como chegar ↗');
configurarLink('presentes-link', CONFIG.linkPresentes, 'Ver lista de presentes ↗');
if (CONFIG.whatsappConfirmacao) {
  const numero = CONFIG.whatsappConfirmacao.replace(/\D/g, '');
  const mensagem = encodeURIComponent('Olá! Gostaria de confirmar minha presença no casamento de Maria Eduarda e Vinícius. ♡');
  configurarLink('confirmacao-link', `https://wa.me/${numero}?text=${mensagem}`, 'Confirmar pelo WhatsApp ↗');
}

// Menu mobile.
const botaoMenu = document.querySelector('.menu-toggle');
const menu = document.getElementById('menu-principal');
botaoMenu.addEventListener('click', () => {
  const aberto = menu.classList.toggle('is-open');
  botaoMenu.setAttribute('aria-expanded', String(aberto));
  botaoMenu.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.classList.remove('is-open');
  botaoMenu.setAttribute('aria-expanded', 'false');
  botaoMenu.setAttribute('aria-label', 'Abrir menu');
}));
