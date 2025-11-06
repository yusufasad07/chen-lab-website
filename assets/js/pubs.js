(async function () {
  const container = document.getElementById('publications-container');
  if (!container) return;

  const renderError = (message) => {
    container.innerHTML = `<div class="text-red-600 dark:text-red-400">${message}</div>`;
  };

  try {
    const response = await fetch('assets/data/publications.json');
    if (!response.ok) throw new Error('Unable to load publications.');
    const data = await response.json();

    const grouped = data.reduce((acc, item) => {
      (acc[item.year] = acc[item.year] || []).push(item);
      return acc;
    }, {});

    const years = Object.keys(grouped)
      .map(Number)
      .sort((a, b) => b - a);

    if (years.length === 0) {
      renderError('No publications available yet.');
      return;
    }

    const fragments = years
      .map((year) => {
        const items = grouped[year]
          .map((pub) => {
            const blob = new Blob([pub.bibtex || ''], { type: 'text/plain' });
            const bibUrl = URL.createObjectURL(blob);
            return `
              <article class="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm">
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white">${pub.title}</h3>
                <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">${pub.authors}</p>
                <p class="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">${pub.venue}</p>
                <div class="mt-4 flex flex-wrap gap-3 text-sm">
                  <a class="px-4 py-2 rounded-full bg-sky-500 text-white hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
                     href="${pub.link}" target="_blank" rel="noopener">Read Paper</a>
                  <a class="px-4 py-2 rounded-full border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
                     href="${bibUrl}" download="${year}-${pub.title.replace(/[^a-z0-9]/gi, '_')}.bib">Download BibTeX</a>
                </div>
              </article>
            `;
          })
          .join('');
        return `
          <section class="space-y-4" aria-labelledby="year-${year}">
            <h2 id="year-${year}" class="text-2xl font-bold text-slate-900 dark:text-white">${year}</h2>
            <div class="grid gap-4">
              ${items}
            </div>
          </section>
        `;
      })
      .join('');

    container.innerHTML = fragments;
  } catch (error) {
    console.error(error);
    renderError('We could not load the publications at this time.');
  }
})();
