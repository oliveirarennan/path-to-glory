(() => {
  const chapters = window.LIVRO;
  const $ = id => document.getElementById(id);
  let current = Math.min(Math.max(Number(localStorage.getItem('ptg-chapter')) || 0, 0), chapters.length - 1);
  let font = Math.min(24, Math.max(16, Number(localStorage.getItem('ptg-font')) || 19));
  function render(moveFocus = false) {
    const chapter = chapters[current];
    $('chapter-title').textContent = chapter.title;
    $('chapter-count').textContent = `${current + 1} de ${chapters.length}`;
    $('progress-bar').style.width = `${(current + 1) / chapters.length * 100}%`;
    $('chapter-body').replaceChildren();
    const chapterNumber = /^Capítulo (\d+) —/.exec(chapter.title);
    if (chapterNumber) {
      const number = Number(chapterNumber[1]);
      const descriptions = [
        'Curzi e o estandarte caem no campo de batalha.',
        'Thomas e Thundarak escalam as muralhas de Sarain.',
        'O resgate de Thomas nas águas do rio.',
        'A companhia encontra Linzi junto à carroça virada.',
        'Uma refeição no posto de Oleg e Svetlana.',
        'O encontro sob o velho sicômoro.',
        'Notícias chegam ao posto comercial.',
        'O confronto na ilha do rio Thorn.',
        'O ataque à mansão de Jamandi, em Restov.',
        'O ataque noturno no posto.',
        'Thundarak trabalha na fonte do templo.',
        'Linzi encontra Davik na travessia.',
        'Ralphye liberta Beaky no forte.',
        'O combate no porão escondido.',
        'A companhia descansa no forte.'
      ];
      if (number >= 1 && number <= descriptions.length) {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.src = `assets/capitulo-${String(number).padStart(2, '0')}.png`;
        img.alt = descriptions[number - 1];
        const caption = document.createElement('figcaption');
        caption.textContent = `${descriptions[number - 1]} Interpretação visual da campanha.`;
        figure.append(img, caption);
        $('chapter-body').append(figure);
      }
    }
    document.documentElement.style.setProperty('--reading-size', `${font}px`);
    for (const block of chapter.body.split(/\n\s*\n/)) {
      const trimmed = block.trim(); if (!trimmed) continue;
      let el;
      if (/^---+$/.test(trimmed)) el = document.createElement('hr');
      else if (/^>/.test(trimmed)) { el = document.createElement('blockquote'); el.textContent = trimmed.replace(/^> ?/gm, '').replace(/  \n/g, '\n'); el.style.whiteSpace = 'pre-line'; }
      else if (/^#{2,3} /.test(trimmed)) { el = document.createElement('h3'); el.textContent = trimmed.replace(/^#+ /, ''); }
      else { el = document.createElement('p'); el.textContent = trimmed.replace(/\*\*/g, '').replace(/(?<!\*)\*([^*]+)\*/g, '$1').replace(/\n/g, ' '); }
      $('chapter-body').append(el);
    }
    $('chapters').replaceChildren();
    chapters.forEach((item, i) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = item.title; if (i === current) { b.className = 'active'; b.setAttribute('aria-current', 'page'); } b.addEventListener('click', () => select(i)); $('chapters').append(b); });
    $('prev').disabled = current === 0; $('next').disabled = current === chapters.length - 1;
    try { localStorage.setItem('ptg-chapter', current); localStorage.setItem('ptg-font', font); } catch (_) {}
    if (moveFocus) { $('chapter-title').focus({preventScroll:true}); $('leitor').scrollIntoView(); }
  }
  function select(i) { current = i; render(true); }
  $('prev').addEventListener('click', () => select(current - 1));
  $('next').addEventListener('click', () => select(current + 1));
  $('reset').addEventListener('click', () => select(0));
  $('smaller').addEventListener('click', () => { font = Math.max(16, font - 1); render(); });
  $('bigger').addEventListener('click', () => { font = Math.min(24, font + 1); render(); });
  render();
})();