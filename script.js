const header = document.querySelector('[data-header]');
const navToggle = document.querySelector('[data-nav-toggle]');
const nav = document.querySelector('[data-nav]');

const setHeaderState = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 32);
};

setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

const closeMenu = () => {
  navToggle?.setAttribute('aria-expanded', 'false');
  navToggle?.setAttribute('aria-label', 'Open menu');
  nav?.classList.remove('is-open');
  document.body.classList.remove('is-menu-open');
};

navToggle?.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
  nav?.classList.toggle('is-open', !isOpen);
  document.body.classList.toggle('is-menu-open', !isOpen);
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealElements = document.querySelectorAll('.reveal:not(.is-visible)');

if (reducedMotion || !('IntersectionObserver' in window)) {
  revealElements.forEach((element) => element.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

const lastSync = document.querySelector('[data-last-sync]');
const waterLevel = document.querySelector('[data-water-level]');
let secondsSinceSync = 0;
let level = 73.0;

window.setInterval(() => {
  secondsSinceSync += 1;
  if (lastSync) {
    lastSync.textContent = secondsSinceSync < 5 ? 'Updated just now' : `Updated ${secondsSinceSync}s ago`;
  }

  if (secondsSinceSync >= 12) {
    secondsSinceSync = 0;
    level = Math.max(71.8, Math.min(74.4, level + (Math.random() - 0.42) * 0.35));
    if (waterLevel) waterLevel.textContent = `${Math.round(level)}% full`;
  }
}, 1000);

document.querySelectorAll('[data-signal]').forEach((row) => {
  row.addEventListener('click', () => {
    document.querySelectorAll('[data-signal]').forEach((other) => {
      const isActive = other === row;
      other.classList.toggle('is-active', isActive);
      other.setAttribute('aria-pressed', String(isActive));
    });
  });
});

const mapDetails = {
  water: {
    number: '01 / FIELD NODE',
    title: 'Water point',
    copy: 'Level, flow, pump state and water quality—measured where the water is, not where the signal stops.',
  },
  fence: {
    number: '02 / EDGE NODE',
    title: 'Fence line',
    copy: 'Zone voltage, energiser state and tamper inputs can turn a long perimeter into a short, specific response.',
  },
  gate: {
    number: '03 / EVENT NODE',
    title: 'Remote gate',
    copy: 'Contact, vibration and tilt events travel immediately, with local history if the route upstream is temporarily lost.',
  },
  gateway: {
    number: '04 / MESH GATEWAY',
    title: 'Operations gateway',
    copy: 'One well-placed gateway carries messages from the reserve mesh into Mistbits over GSM or Wi-Fi.',
  },
};

const mapDetail = document.querySelector('[data-map-detail]');
const mapNumber = document.querySelector('[data-map-number]');
const mapTitle = document.querySelector('[data-map-title]');
const mapCopy = document.querySelector('[data-map-copy]');

document.querySelectorAll('[data-map-pin]').forEach((pin, index) => {
  if (index === 0) pin.classList.add('is-active');

  pin.addEventListener('click', () => {
    const detail = mapDetails[pin.dataset.mapPin];
    if (!detail || !mapDetail) return;

    document.querySelectorAll('[data-map-pin]').forEach((other) => other.classList.toggle('is-active', other === pin));
    mapDetail.classList.remove('is-changing');
    void mapDetail.offsetWidth;
    mapDetail.classList.add('is-changing');
    if (mapNumber) mapNumber.textContent = detail.number;
    if (mapTitle) mapTitle.textContent = detail.title;
    if (mapCopy) mapCopy.textContent = detail.copy;
  });
});

const pilotDialog = document.querySelector('[data-pilot-dialog]');
const detailDialog = document.querySelector('[data-detail-dialog]');
const problemSelect = document.querySelector('[data-problem-select]');

const problemLabels = {
  water: 'Water levels, flow or pump monitoring',
  security: 'Gate, theft or asset alarms',
  wildlife: 'Wildlife or livestock sensing',
  climate: 'Weather or fire risk',
  pumps: 'Water levels, flow or pump monitoring',
};

const openPilot = (problemKey) => {
  closeMenu();
  if (problemKey && problemSelect && problemLabels[problemKey]) {
    problemSelect.value = problemLabels[problemKey];
  }
  if (detailDialog?.open) detailDialog.close();
  if (!pilotDialog?.open) pilotDialog?.showModal();
};

document.querySelectorAll('[data-open-pilot]').forEach((button) => {
  button.addEventListener('click', () => openPilot(button.dataset.problem));
});

document.querySelector('[data-close-pilot]')?.addEventListener('click', () => pilotDialog?.close());

const detailContent = {
  water: {
    number: '01',
    title: 'Water intelligence',
    lead: 'Know what is stored, what is moving and whether the system is behaving normally.',
    inputs: 'Level · flow · pressure · pump state · water temperature · pH · EC · dissolved oxygen',
    outcomes: 'Low-level warning · no-flow alarm · leak pattern · daily balance · quality trend',
  },
  security: {
    number: '02',
    title: 'Gates & assets',
    lead: 'Turn a physical change in a remote place into a fast, specific operational event.',
    inputs: 'Magnetic contact · vibration · tilt · power loss · cabinet tamper · beam sensor',
    outcomes: 'Out-of-hours opening · asset movement · cut power · failed sensor · ranger escalation',
  },
  wildlife: {
    number: '03',
    title: 'Wildlife & livestock',
    lead: 'Use low-bandwidth events to build a better picture of presence, pressure and movement.',
    inputs: 'Beam count · pressure pad · collar gateway · water draw · camera trigger · GPS event',
    outcomes: 'Corridor activity · water-point rhythm · unusual absence · livestock check · research export',
  },
  climate: {
    number: '04',
    title: 'Fire & weather',
    lead: 'Measure conditions across the land, not only beside the office or lodge.',
    inputs: 'Rain pulse · humidity · temperature · wind · soil moisture · smoke contact',
    outcomes: 'Local fire-risk index · rainfall map · dry-zone warning · crew alert · seasonal history',
  },
  pumps: {
    number: '05',
    title: 'Pumps & energy',
    lead: 'Connect the equipment Reserve depends on to the proven operational logic behind Smarta.',
    inputs: 'Pump pulse · current · voltage · relay state · pressure · flow · level',
    outcomes: 'Dry-run warning · abnormal cycling · runtime report · remote schedule · energy trend',
  },
};

let activeDetailKey = 'water';

document.querySelectorAll('[data-open-detail]').forEach((button) => {
  button.addEventListener('click', () => {
    const key = button.dataset.openDetail;
    const detail = detailContent[key];
    if (!detail || !detailDialog) return;
    activeDetailKey = key;
    detailDialog.querySelector('[data-detail-number]').textContent = detail.number;
    detailDialog.querySelector('[data-detail-title]').textContent = detail.title;
    detailDialog.querySelector('[data-detail-lead]').textContent = detail.lead;
    detailDialog.querySelector('[data-detail-inputs]').textContent = detail.inputs;
    detailDialog.querySelector('[data-detail-outcomes]').textContent = detail.outcomes;
    detailDialog.showModal();
  });
});

document.querySelector('[data-close-detail]')?.addEventListener('click', () => detailDialog?.close());
document.querySelector('[data-detail-pilot]')?.addEventListener('click', () => openPilot(activeDetailKey));

[pilotDialog, detailDialog].forEach((dialog) => {
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
});

document.querySelector('[data-pilot-form]')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const subject = `Mistbits Reserve pilot — ${data.get('property')}`;
  const body = [
    'Hello Mistbits,',
    '',
    'I would like to discuss a Mistbits Reserve pilot.',
    '',
    `Name: ${data.get('name')}`,
    `Email: ${data.get('email')}`,
    `Property: ${data.get('property')}`,
    `First problem: ${data.get('problem')}`,
    '',
    'Context:',
    data.get('context') || 'Not provided yet.',
  ].join('\n');

  window.location.href = `mailto:hello@mistbits.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
