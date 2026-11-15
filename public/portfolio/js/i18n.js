/* Shared portfolio language content. Project names and external article URLs stay unchanged. */
(function () {
  const translations = {
    "Home": "Início", "Projects": "Projetos", "Blog": "Blog", "Contact": "Contato",
    "Open menu": "Abrir menu", "Close menu": "Fechar menu", "Main": "Principal",
    "Skip to content": "Pular para o conteúdo", "All": "Todos",
    "Filter by category": "Filtrar por categoria", "Read on Medium →": "Ler no Medium →",
    "See my projects": "Ver meus projetos", "Read the blog": "Ler o blog",
    "Featured projects": "Projetos em destaque", "View all →": "Ver todos →",
    "Previous project": "Projeto anterior", "Next project": "Próximo projeto",
    "Pause carousel": "Pausar carrossel", "Play carousel": "Reproduzir carrossel",
    "Go to project": "Ir para o projeto", "Download résumé": "Baixar currículo",
    "Latest posts": "Artigos recentes", "All posts →": "Todos os artigos →",
    "A collection of visual work. Pick a category to filter.": "Uma seleção de projetos e soluções de qualidade.",
    "My articles on Medium about QA, test automation and AI.": "Meus artigos no Medium sobre QA, automação de testes e IA.",
    "Creativity for Quality Solutions": "Criatividade para Soluções de Qualidade",
    "Creativity for <span class=\"hl\">Quality Solutions</span>": "Criatividade para <span class=\"hl\">Soluções de Qualidade</span>",
    "QA Engineer & AI SDET": "Engenheira de QA & AI SDET",
    "I build solutions to improve quality assurance for products and processes.": "Desenvolvo soluções para aprimorar a garantia de qualidade de produtos e processos.",
    "AI Engineering": "Engenharia de IA", "AI Engineering · 2026": "Engenharia de IA · 2026", "Data Viz": "Visualização de dados", "Web Design": "Design web",
    "Branding": "Identidade visual", "Illustration": "Ilustração",
    "An AI bot that researches every support ticket and drafts a reply for the team to review.": "Um bot de IA que pesquisa cada ticket de suporte e prepara uma resposta para a equipe revisar.",
    "A Jira ticket becomes a complete test plan, evidence-backed results and an automated regression pack.": "Um ticket do Jira se transforma em um plano de testes completo, resultados com evidências e um pacote de regressão automatizado.",
    "From one Jira task to a published QA report: the AI investigates, writes requirements, plans tests and executes them with Playwright.": "De uma tarefa no Jira a um relatório de QA publicado: a IA investiga, escreve requisitos, planeja testes e os executa com Playwright.",
    "A release gate that tests every change before deploy and says whether the release can proceed.": "Um portão de release que testa cada mudança antes do deploy e diz se o release pode seguir.",
    "A board and a drafting skill that keep the customer article platform up to date with every release.": "Um quadro e uma skill de rascunho que mantêm a plataforma de artigos dos clientes sempre em dia a cada release.",
    "Internal Knowledge Base": "Base de Conhecimento Interna",
    "Internal QA Metrics": "Métricas Internas de QA",
    "A dashboard with three quality metrics, calculated from real Jira bugs, so the QA team knows where it stands and where it needs to go.": "Um painel com três métricas de qualidade, calculadas sobre os bugs reais do Jira, para que o time de QA saiba onde está e para onde precisa ir.",
    "A searchable base that gathers the company's scattered knowledge in one place and keeps itself up to date.": "Uma base pesquisável que reúne em um só lugar o conhecimento espalhado pela empresa e se mantém atualizada sozinha.",
    "Short description of what this project is and what you did.": "Breve descrição do projeto e da solução desenvolvida.",
    "Project Three [PLACEHOLDER]": "Projeto três [EXEMPLO]", "Project Four [PLACEHOLDER]": "Projeto quatro [EXEMPLO]",
    "Project Five [PLACEHOLDER]": "Projeto cinco [EXEMPLO]", "Project Six [PLACEHOLDER]": "Projeto seis [EXEMPLO]",
    "Claude AI": "Claude IA", "QA Engineer": "Engenharia de QA", "Automation Testing": "Automação de testes",
    "Test": "Testes", "Quality Assurance": "Garantia de qualidade", "Development Cycle": "Ciclo de desenvolvimento",
    "Bugs": "Bugs", "QA Testing": "Testes de QA"
  };
  const articles = {
    "1793572c044c": ["Como os testes de regressão se tornaram uma skill de IA", "Todos conhecem o fluxo tradicional de TI: desenvolvimento, testes, lançamento e testes de regressão ou smoke tests. Mas como isso funciona no mundo da IA?"],
    "d86a99ec5d92": ["Ensinei um bot a responder tickets de suporte (e depois o testei como se o odiasse)", "Uma engenheira de QA cria um bot de rascunhos para o suporte ao cliente e passa boa parte do tempo tentando provar que ele está errado."],
    "3d0964caeed4": ["O que entender a arquitetura do Playwright realmente mudou no meu trabalho como QA", "Por muito tempo, achei que aprender uma ferramenta de automação era apenas aprender sua sintaxe: localizadores, asserções e alguns hooks. Mas havia mais."],
    "3dd1b9053714": ["Garantindo qualidade em cada etapa", "Ao desenvolver ou testar software, a qualidade é o que separa a experiência de um usuário satisfeito de um verdadeiro pesadelo."],
    "8f269970a2dd": ["Corra, QA, corra! A jornada da garantia de qualidade como Forrest Gump", "A jornada de Forrest Gump inspira uma reflexão sobre os desafios, as descobertas e a evolução de quem trabalha com garantia de qualidade."],
    "537f52b7e014": ["Caça-Fantasmas vs. QA: a incrível jornada de quem caça bugs no desenvolvimento de software", "O filme Caça-Fantasmas e o trabalho de um QA caçando bugs têm semelhanças surpreendentes."]
  };
  function normalize(language) { return language === "pt" ? "pt" : "en"; }
  function text(value, language) { return language === "pt" ? translations[value] || value : value; }
  function post(value, language) {
    const article = Object.entries(articles).find(([id]) => value.link.includes(id));
    return language === "pt" && article ? { ...value, title: article[1][0], excerpt: article[1][1] } : value;
  }
  window.PortfolioLanguage = { normalize, text, post };
})();