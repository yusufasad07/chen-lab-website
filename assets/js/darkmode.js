(function () {
  const storageKey = 'chen-lab-theme';
  const html = document.documentElement;

  const applyTheme = (mode) => {
    if (mode === 'dark') {
      html.classList.add('dark');
      html.classList.remove('light');
    } else {
      html.classList.add('light');
      html.classList.remove('dark');
    }
  };

  const saved = localStorage.getItem(storageKey);
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }

  const toggleButtons = document.querySelectorAll('[data-theme-toggle]');
  toggleButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const isDark = html.classList.contains('dark');
      const nextMode = isDark ? 'light' : 'dark';
      applyTheme(nextMode);
      localStorage.setItem(storageKey, nextMode);
      toggleButtons.forEach((el) => {
        el.setAttribute('aria-pressed', String(nextMode === 'dark'));
      });
    });
  });
})();
