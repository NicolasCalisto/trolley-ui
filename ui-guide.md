Minha Cestinha — Guia de UI
Regras visuais e de linguagem do app · versão 1.0 · outubro de 2026
1. Essência
A Minha Cestinha é prática e aconchegante. Visual escuro e suave, âmbar como calor, cantos arredondados, muito respiro, e uma voz que fala como um vizinho simpático, não como um sistema.
Princípios
• Minimalista, moderno e leve: poucos elementos por tela e bastante espaço.
• Ação primeiro: a pessoa abre o app, quase sempre no mercado, e precisa chegar rápido à cestinha certa.
• Conforto visual: tema escuro que não cansa os olhos e se lê bem sob a iluminação forte de supermercados.
• Carinho, não máquina: palavras do dia a dia, nunca jargão técnico nem termos em inglês.
2. Cores
2.1 Paleta base (Gilded Slate)
Papel
Nome
Hex
Onde usar
Primária
Âmbar
#F59E0B
Marca e ação: botão principal, item ativo da navegação, destaque do que está em andamento
Secundária
Azul
#60A5FA
Informação e calma: progresso, cestinhas compartilhadas, links, detalhes secundários
Terciária
Coral
#F87171
Cuidado: excluir, avisos, itens urgentes
Neutra
Marinho
#121826
Fundo das telas e texto sobre o âmbar
2.2 Cores de apoio (derivadas, ajustáveis)
Função
Hex
Uso
Superfície 1
#1A2233
Cards e blocos
Superfície 2
#232C40
Campos de busca, elementos elevados, botão secundário
Borda sutil
#2E384D
Divisórias de 1px, só quando necessário
Texto principal
#F5EFE6
Títulos e textos importantes (branco quente)
Texto secundário
#C9BFAE
Descrições e legendas
Texto discreto
#8B93A7
Apenas informação não essencial
Sucesso
#4ADE80
Item comprado e cestinha concluída (adição à paleta original)
2.3 Regras de uso
• O fundo é sempre #121826. Nunca usar preto puro nem branco puro.
• Texto sobre o âmbar é sempre #121826, nunca branco.
• O âmbar é a única cor de ação principal: no máximo um botão âmbar em destaque por tela.
• O coral é usado com moderação e nunca como decoração.
• O verde aparece só para marcar o que foi concluído.
• Cor nunca é o único sinal: sempre acompanhar de ícone ou texto (ex.: o status tem cor e palavra).
• Informação importante nunca usa texto discreto.
3. Tipografia
Quicksand para textos e Inter para números.
Estilo
Fonte
Peso
Tamanho
Título de tela
Quicksand
700
24
Saudação
Quicksand
600
20
Título de seção
Quicksand
700
18
Nome de cestinha ou item
Quicksand
600
16
Corpo
Quicksand
500
16
Rótulo e chip
Quicksand
600
13
Número de destaque
Inter
700
28
Número comum (preço, quantidade)
Inter
600
16
Número pequeno
Inter
500
13
Regras
• Todo número usa Inter, inclusive o símbolo R$, com algarismos tabulares para alinhar valores.
• Em frases como “24 itens”, o número é Inter e a palavra é Quicksand.
• Quicksand nunca abaixo do peso 500: os pesos finos ficam frágeis sobre fundo escuro.
• Tamanho mínimo de texto: 13.
• Altura de linha do corpo: 1,4.
• Evitar caixa alta em textos longos. Rótulos curtos podem usar.
4. Forma e espaço
Elemento
Raio
Cards
20
Campos de busca e inputs
16
Botões, chips e barras de progresso
Pílula (totalmente arredondado)
Bottom sheets (cantos superiores)
28
• Escala de espaçamento: 4, 8, 12, 16, 24, 32.
• Margem lateral das telas: 20.
• A separação entre elementos vem de tom (degraus de superfície), não de borda ou sombra.
• Sem sombras pesadas. Borda só de 1px sutil, quando indispensável.
• Alvos de toque com no mínimo 48 x 48, pensando em uso com uma mão só e o carrinho na outra.
• Muito respiro: na dúvida, remover um elemento em vez de apertar.
5. Componentes
Botões
• Principal: pílula âmbar, texto marinho. Uma ação por tela (ex.: Nova cestinha).
• Secundário: pílula em superfície 2, texto principal.
• Contorno: pílula com borda sutil, para ações terciárias.
• Destrutivo: coral, apenas em confirmações (ex.: Esvaziar cestinha).
Card de cestinha
• Fundo superfície 1, raio 20.
• Mostra: nome, “N itens” (número em Inter), barra de progresso fina, status e estimativa de valor.
• Toque abre a cestinha. Deslizar para a esquerda arquiva ou esvazia, para a direita duplica. Pressionar e segurar abre o menu rápido.
Progresso
• Barra fina, arredondada, trilho em superfície 2.
• Âmbar para cestinhas em andamento no mercado, azul para progresso informativo, verde quando completa.
Status (chips)
Status
Cor
Significado
Separando
Azul
Montando a cestinha
No mercado
Âmbar
Comprando agora
Tudo na sacola
Verde
Concluída
Chips têm fundo da cor com baixa opacidade e texto na cor cheia, sempre com a palavra.
Item da cestinha
• Linha alta (mínimo 56), com checkbox grande à esquerda.
• Ao marcar: o checkbox preenche de verde com animação suave, o texto fica riscado e esmaecido, e o item desce para o fim da lista.
• Emoji ou ícone da categoria à esquerda do nome.
Navegação inferior
• Quatro abas: Home, Cestinhas, Insights e Perfil.
• Aba ativa em pílula âmbar com ícone e texto marinho. Abas inativas em texto secundário.
Busca
• Campo em superfície 2, raio 16, ícone de lupa à esquerda.
Ícones e categorias
• Ícones de traço fino e pontas arredondadas, todos no mesmo estilo.
• Emojis para categorias (🥩 carnes, 🍎 frutas, 🧴 limpeza), que dão carinho e ajudam a achar rápido.
Estados vazios
• Ilustração simples ou emoji grande, mensagem carinhosa e um botão principal.
Movimento
• Transições de 150 a 250 ms, com saída suave (ease-out).
• Animações só para dar retorno a uma ação (marcar item, adicionar, concluir). Nada decorativo.
6. Linguagem
6.1 Tom de voz
• Como um vizinho simpático: frases curtas, “você”, informal sem exagero de gíria.
• Sem culpa nem pressão (nada de “você esqueceu…”).
• Nunca usar termos em inglês na interface.
• Dizer “cestinha” em vez de “lista” sempre que fizer sentido.
6.2 Dicionário do app
Em vez de
Use
Criar nova lista
Nova cestinha
Listas ativas
Cestinhas em andamento
Listas recentes
Cestinhas recentes
Shopping
No mercado
Planning
Separando
Lista concluída
Tudo na sacola
Item adicionado
Na cestinha!
Sem listas (estado vazio)
Sua cestinha está vazia. Bora encher?
Excluir lista
Esvaziar cestinha
6.3 Saudação
Varia com o horário: “Bom dia, {nome}!”, “Boa tarde, {nome}! O que vai pra cestinha hoje?”, “Boa noite, {nome}!”.
6.4 Mensagens-modelo
• Confirmar esvaziar: “Esvaziar esta cestinha? Os itens não poderão ser recuperados.” Botões: Esvaziar (coral) e Voltar.
• Concluir cestinha: “Tudo na sacola! Boas compras.”
• Erro: “Ops, algo deu errado. Tenta de novo?”
7. Acessibilidade e conforto
• Texto principal e títulos sempre em tom claro quente, com contraste alto sobre o fundo.
• Alvos de toque de no mínimo 48.
• Cor sempre acompanhada de texto ou ícone.
• Testar o app com o brilho da tela no máximo, simulando o ambiente do mercado.
• Avaliar um tema claro opcional no futuro.
8. Tokens de referência
:root {
  /* Cores */
  --color-bg: #121826;
  --color-surface-1: #1A2233;
  --color-surface-2: #232C40;
  --color-border: #2E384D;
  --color-primary: #F59E0B;
  --color-secondary: #60A5FA;
  --color-tertiary: #F87171;
  --color-success: #4ADE80;
  --color-text: #F5EFE6;
  --color-text-secondary: #C9BFAE;
  --color-text-muted: #8B93A7;
  --color-on-primary: #121826;

  /* Fontes */
  --font-text: 'Quicksand', sans-serif;
  --font-number: 'Inter', sans-serif;

  /* Raios */
  --radius-card: 20px;
  --radius-input: 16px;
  --radius-pill: 999px;
  --radius-sheet: 28px;

  /* Espaçamento */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --screen-margin: 20px;
}
9. Faça e evite
Faça
• Usar o âmbar para a ação principal e mais nada competindo com ele.
• Falar “cestinha” e usar frases curtas e acolhedoras.
• Separar blocos por tom e espaço.
• Mostrar progresso, status e estimativa em cada cestinha.
Evite
• Preto puro, branco puro e cinza médio em texto importante.
• Muitas cores no mesmo card.
• Bordas e sombras pesadas.
• Termos técnicos ou em inglês (Shopping, Planning, Insights técnico demais).
• Textos pequenos para informação que a pessoa precisa ler com o carrinho na mão.