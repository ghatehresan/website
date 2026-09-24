/* A local-only, data-free interaction preview. No calls to WordPress, analytics or any API. */
(() => {
  'use strict';

  const menuButton = document.getElementById('menu-toggle');
  const menu = document.getElementById('main-nav');
  const closeMenu = () => {
    menu.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'باز کردن منو');
  };
  menuButton.addEventListener('click', () => {
    const opened = menuButton.getAttribute('aria-expanded') !== 'true';
    menu.classList.toggle('is-open', opened);
    menuButton.setAttribute('aria-expanded', String(opened));
    menuButton.setAttribute('aria-label', opened ? 'بستن منو' : 'باز کردن منو');
    if (opened) menu.querySelector('a')?.focus();
  });
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuButton.focus();
    }
  });

  const tabs = [...document.querySelectorAll('.finder-tab')];
  const activateTab = (selected, moveFocus = false) => {
    tabs.forEach((tab) => {
      const active = tab === selected;
      tab.setAttribute('aria-selected', String(active));
      tab.setAttribute('tabindex', active ? '0' : '-1');
      tab.classList.toggle('is-active', active);
      document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
    });
    if (moveFocus) selected.focus();
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', (event) => {
      const target = event.key === 'ArrowLeft' ? tabs[(index + 1) % tabs.length]
        : event.key === 'ArrowRight' ? tabs[(index - 1 + tabs.length) % tabs.length]
        : event.key === 'Home' ? tabs[0]
        : event.key === 'End' ? tabs[tabs.length - 1] : null;
      if (target) {
        event.preventDefault();
        activateTab(target, true);
      }
    });
  });

  const query = document.getElementById('part-query');
  const feedback = document.getElementById('search-feedback');
  const feedbackTitle = document.getElementById('feedback-title');
  const feedbackDetail = document.getElementById('feedback-detail');
  const runSearch = () => {
    const hasQuery = query.value.trim().length > 0;
    feedbackTitle.textContent = hasQuery ? 'هنوز کاتالوگ واقعی متصل نشده است.' : 'اول نام یا شمارهٔ قطعه را وارد کن.';
    feedbackDetail.textContent = hasQuery
      ? 'این بخش فقط مسیر جست‌وجو را نشان می‌دهد. عبارت شما نه ذخیره شد و نه به سایت اصلی ارسال شد؛ نتیجهٔ ساختگی نمایش نمی‌دهیم.'
      : 'در نسخهٔ واقعی، پس از ورود اطلاعات تأییدشده، اینجا می‌توانی جست‌وجو کنی.';
    feedback.hidden = false;
    if (!hasQuery) query.focus();
  };
  document.getElementById('search-trigger').addEventListener('click', runSearch);
  query.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      runSearch();
    }
  });

  const tasks = [...document.querySelectorAll('input[data-task]')];
  const storageKey = 'ghatehresan-preview-checklist-v1';
  let stored = {};
  try {
    stored = JSON.parse(localStorage.getItem(storageKey) || '{}') || {};
  } catch (_) { stored = {}; }
  tasks.forEach((task) => { task.checked = stored[task.dataset.task] === true; });

  const progress = document.getElementById('progress-track');
  const progressLabel = document.getElementById('progress-label');
  const progressFill = document.getElementById('progress-fill');
  const format = (value) => new Intl.NumberFormat('fa-IR').format(value);
  const updateProgress = () => {
    const done = tasks.filter((task) => task.checked).length;
    progressLabel.textContent = `${format(done)} از ${format(tasks.length)}`;
    progress.setAttribute('aria-valuenow', String(done));
    progress.setAttribute('aria-valuetext', `${format(done)} از ${format(tasks.length)} مورد انجام شده`);
    progressFill.style.width = `${(done / tasks.length) * 100}%`;
    try {
      const state = Object.fromEntries(tasks.map((task) => [task.dataset.task, task.checked]));
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (_) { /* Preview still works when local storage is blocked. */ }
  };
  tasks.forEach((task) => task.addEventListener('change', updateProgress));
  updateProgress();

  const copyButton = document.getElementById('copy-steps');
  const copyStatus = document.getElementById('copy-status');
  const steps = 'قدم‌های من برای ادامهٔ قطعه‌رسان:\n۱. بازخورد روی پیش‌نمایش طراحی\n۲. هماهنگی بکاپ قابل بازیابی و Staging امن\n۳. آماده کردن چند کالای واقعی با کد، قیمت، برند، وضعیت تأمین و سازگاری مستند\n۴. تأیید اطلاعات تماس، ارسال و مرجوعی\n\nرمز، بکاپ و اطلاعات مشتری در گفتگو ارسال نمی‌شود.';
  copyButton.addEventListener('click', async () => {
    let copied = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(steps);
        copied = true;
      } else {
        const temp = document.createElement('textarea');
        temp.value = steps;
        temp.style.position = 'fixed';
        temp.style.opacity = '0';
        document.body.appendChild(temp);
        temp.select();
        copied = document.execCommand('copy');
        temp.remove();
      }
    } catch (_) { copied = false; }
    copyStatus.textContent = copied ? 'فهرست کپی شد.' : 'کپی خودکار ممکن نشد؛ از متن چک‌لیست استفاده کن.';
  });
})();
