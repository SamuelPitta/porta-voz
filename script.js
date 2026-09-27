// 1. Os dados (AGORA COM NOVAS CATEGORIAS E PALAVRAS!)
// 1. Os dados (Com todas as categorias e Família completa!)
const INITIAL_DATA = {
  categories: [
    { id: 'essenciais', label: 'Básico' },
    { id: 'necessidades', label: 'Necessidades' },
    { id: 'acoes', label: 'Ações' },
    { id: 'sentimentos', label: 'Sentimentos' },
    { id: 'familia', label: 'Família' },
    { id: 'conversa', label: 'Conversa' }
  ],
  cards: [
    // BÁSICO
    { id: 'c1', label: 'Sim', category: 'essenciais', emoji: '✅', color: '#4CAF50' },
    { id: 'c2', label: 'Não', category: 'essenciais', emoji: '❌', color: '#F44336' },
    { id: 'c3', label: 'Por favor', category: 'essenciais', emoji: '🙏', color: '#FF9800' },
    
    // NECESSIDADES
    { id: 'c4', label: 'Banheiro', category: 'necessidades', emoji: '🚽', color: '#009688' },
    { id: 'c5', label: 'Sede', category: 'necessidades', emoji: '💧', color: '#03A9F4' },
    
    // AÇÕES
    { id: 'c6', label: 'Quero', category: 'acoes', emoji: '👉', color: '#2196F3' },
    { id: 'c7', label: 'Comer', category: 'acoes', emoji: '🍽️', color: '#2196F3' },
    
    // SENTIMENTOS
    { id: 'c10', label: 'Dor', category: 'sentimentos', emoji: '🤕', color: '#9C27B0' },
    { id: 'c11', label: 'Feliz', category: 'sentimentos', emoji: '😊', color: '#9C27B0' },
    { id: 'c12', label: 'Saudade', category: 'sentimentos', emoji: '🥺', color: '#9C27B0' },
    
    // FAMÍLIA
    { id: 'c13', label: 'Mãe', category: 'familia', emoji: '👩', color: '#E91E63' },
    { id: 'c14', label: 'Pai', category: 'familia', emoji: '👨', color: '#3F51B5' },
    { id: 'c15', label: 'Irmão', category: 'familia', emoji: '👦', color: '#795548' },
    { id: 'c16', label: 'Irmã', category: 'familia', emoji: '👧', color: '#795548' },
    { id: 'c17', label: 'Tio', category: 'familia', emoji: '👨‍🦰', color: '#607D8B' },
    { id: 'c18', label: 'Tia', category: 'familia', emoji: '👩‍🦱', color: '#607D8B' },
    { id: 'c19', label: 'Avô', category: 'familia', emoji: '👴', color: '#546E7A' },
    { id: 'c20', label: 'Avó', category: 'familia', emoji: '👵', color: '#546E7A' },


    // CONVERSA (As novas frases sociais!)
    { id: 'c21', label: 'Tudo bem?', category: 'conversa', emoji: '👋', color: '#FFB300' },
    { id: 'c22', label: 'Como foi o dia?', category: 'conversa', emoji: '🌇', color: '#FFB300' },
    { id: 'c23', label: 'Quero conversar', category: 'conversa', emoji: '🗣️', color: '#FFB300' },
    { id: 'c24', label: 'Estou sozinho', category: 'conversa', emoji: '🛋️', color: '#FFB300' },
    { id: 'c25', label: 'Me conte uma história', category: 'conversa', emoji: '📖', color: '#FFB300' },
    { id: 'c26', label: 'Novidades?', category: 'conversa', emoji: '📰', color: '#FFB300' }
    
  ]
};

// 2. Variáveis de controle
const synth = window.speechSynthesis;
let currentSentence = [];
let activeCategory = 'essenciais'; 

// 3. Pegando as partes do HTML
const DOM = {
  boardGrid: document.getElementById('board-grid'),
  sentenceDisplay: document.getElementById('sentence-display'),
  categoryTabs: document.getElementById('category-tabs'),
  btnSpeak: document.getElementById('btn-speak'),
  btnBackspace: document.getElementById('btn-backspace'),
  btnClear: document.getElementById('btn-clear'),
  btnHelp: document.getElementById('btn-help'),
  inputName: document.getElementById('input-name'),
  btnSaveName: document.getElementById('btn-save-name'),
  inputCustomText: document.getElementById('input-custom-text'), 
  btnSpeakCustom: document.getElementById('btn-speak-custom')
};



// 4. Função de Voz
function falar(texto) {
  if (!synth || !texto) return;
  synth.cancel(); 
  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = 'pt-BR'; 
  synth.speak(utterance);
}

// 5. Funções para desenhar as coisas na tela
function renderCategories() {
  DOM.categoryTabs.innerHTML = '';
  INITIAL_DATA.categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat.label;
    btn.dataset.id = cat.id;
    if (cat.id === activeCategory) {
      btn.style.background = '#333';
      btn.style.color = 'white';
    }
    DOM.categoryTabs.appendChild(btn);
  });
}

function renderBoard() {
  DOM.boardGrid.innerHTML = '';
  const cards = INITIAL_DATA.cards.filter(c => c.category === activeCategory);
  cards.forEach(card => {
    const btn = document.createElement('button');
    btn.className = 'card';
    btn.dataset.id = card.id;
    // Removida a borda que tínhamos antes, pois o novo CSS já tem sombras!
    btn.innerHTML = `<div style="font-size: 40px">${card.emoji}</div><b>${card.label}</b>`;
    DOM.boardGrid.appendChild(btn);
  });
}

function renderSentence() {
  DOM.sentenceDisplay.innerHTML = '';
  currentSentence.forEach(card => {
    const span = document.createElement('span');
    span.textContent = `${card.emoji} ${card.label}  `;
    span.style.cssText = `background: ${card.color}; color: white; padding: 5px 15px; border-radius: 20px; margin: 5px; display: inline-block; font-weight: bold; font-size: 18px;`;
    DOM.sentenceDisplay.appendChild(span);
  });
}

// 6. Ouvindo os cliques do usuário
DOM.boardGrid.addEventListener('click', (e) => {
  const cardEl = e.target.closest('.card');
  if (!cardEl) return;
  const card = INITIAL_DATA.cards.find(c => c.id === cardEl.dataset.id);
  currentSentence.push(card);
  renderSentence();
  falar(card.label); 
});

DOM.categoryTabs.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    activeCategory = e.target.dataset.id;
    renderCategories();
    renderBoard();
  }
});

DOM.btnSpeak.addEventListener('click', () => {
  if (currentSentence.length > 0) falar(currentSentence.map(c => c.label).join(', '));
});

DOM.btnBackspace.addEventListener('click', () => {
  currentSentence.pop();
  renderSentence();
});

DOM.btnClear.addEventListener('click', () => {
  currentSentence = [];
  renderSentence();
});
// Evento do botão de emergência
// Evento do botão de emergência (AGORA COM NOME!)
DOM.btnHelp.addEventListener('click', () => {
  if (nomeCuidador) {
    falar(`Atenção ${nomeCuidador}! Preciso de ajuda. Por favor, venha aqui.`);
  } else {
    falar("Atenção! Preciso de ajuda. Por favor, venha aqui.");
  }
});

// Recupera o nome salvo na memória (se existir)
let nomeCuidador = localStorage.getItem('vozviva_nome') || '';
if (nomeCuidador) {
  DOM.inputName.value = nomeCuidador; // Já deixa o nome preenchido na tela
}

// Quando clicar em "Salvar Nome"
DOM.btnSaveName.addEventListener('click', () => {
  nomeCuidador = DOM.inputName.value.trim(); // Pega o que foi digitado
  localStorage.setItem('vozviva_nome', nomeCuidador); // Salva na memória
  
  if (nomeCuidador) {
    falar("Nome salvo! Agora vou chamar por " + nomeCuidador);
  } else {
    falar("Nome apagado.");
  }
});

// Evento para falar o texto que a pessoa digitou
DOM.btnSpeakCustom.addEventListener('click', () => {
  const textoDigitado = DOM.inputCustomText.value.trim(); // Pega o texto da barra
  if (textoDigitado !== '') {
    falar(textoDigitado); // Fala o texto
    DOM.inputCustomText.value = ''; // Limpa a barra depois de falar
  }
});

// 7. Ligando o aplicativo
renderCategories();
renderBoard();