// Avaa sivu aina yläreunasta (estä selaimen vierityksen palautus ja
// jäänyt #yritys-ankkuri viemästä "Kattotyöt ammattitaidolla" -kohtaan)
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.addEventListener('load', () => {
  if (!location.hash || location.hash === '#yritys' || location.hash === '#hero') {
    window.scrollTo(0, 0);
  }
});

// Navbar scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

function closeMenu() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  document.body.style.overflow = '';
  document.querySelectorAll('.has-dropdown').forEach(el => el.classList.remove('open'));
}

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
  if (!isOpen) {
    document.querySelectorAll('.has-dropdown').forEach(el => el.classList.remove('open'));
  }
});

// Close mobile menu on non-dropdown link click
navLinks.querySelectorAll('a:not(.has-dropdown > a)').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Desktop dropdown toggle on click (mobile: no dropdown, link navigates normally)
document.querySelectorAll('.has-dropdown > a').forEach(toggle => {
  toggle.addEventListener('click', e => {
    if (window.innerWidth <= 768) return;
    e.preventDefault();
    toggle.closest('.has-dropdown').classList.toggle('open');
  });
});

// Close dropdown when clicking outside (desktop)
document.addEventListener('click', e => {
  if (window.innerWidth <= 768) return;
  if (!e.target.closest('.has-dropdown')) {
    document.querySelectorAll('.has-dropdown').forEach(el => el.classList.remove('open'));
  }
});

// Smooth scroll for same-page anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// Fade-in on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = Array.from(entry.target.parentElement.children).filter(
      el => el.classList.contains('fade-in')
    );
    const idx = siblings.indexOf(entry.target);
    entry.target.style.transitionDelay = `${idx * 75}ms`;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Active nav link highlight (homepage only)
const sections = document.querySelectorAll('section[id]');
if (sections.length) {
  function updateActiveLink() {
    const scrollY = window.scrollY + navbar.offsetHeight + 40;
    let current = '';
    sections.forEach(s => {
      if (scrollY >= s.offsetTop) current = s.getAttribute('id');
    });
    document.querySelectorAll('.nav-links > li > a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
  }
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
}

/* ======== CONTACT FORM MODAL (mailto-based) ======== */
(function () {
  var CONTACT_EMAIL = 'info@svkatto.fi';
  // Formspree-endpoint. Liitä tähän tilisi osoite, esim. 'https://formspree.io/f/xxxxxxx'.
  // Kun tämä on tyhjä, lomake käyttää varavaihtoehtona kävijän omaa sähköpostiohjelmaa (mailto).
  var FORMSPREE_ENDPOINT = 'https://formspree.io/f/mdavzwgy';
  var PHONE = 'info@svkatto.fi';
  var PHONE_TEL = '';

  var lang = (document.documentElement.lang || 'fi').slice(0, 2).toLowerCase();
  if (['fi', 'sv', 'en'].indexOf(lang) === -1) lang = 'fi';

  var S = {
    fi: {
      eyebrow: 'Ota yhteyttä', title: 'Lähetä viesti',
      intro: 'Täytä lomake, niin olemme yhteydessä mahdollisimman pian.',
      name: 'Nimi', email: 'Sähköposti', phone: 'Puhelin', company: 'Yritys',
      optional: '(valinnainen)', message: 'Viesti', send: 'Lähetä viesti',
      sending: 'Lähetetään…',
      errorMsg: 'Viestin lähetys ei onnistunut. Yritä uudelleen tai laita viesti osoitteeseen info@svkatto.fi.',
      mailSubject: 'Yhteydenotto verkkosivulta',
      thanksTitle: 'Kiitos yhteydenotostasi!',
      thanksBody: 'Viestisi on lähetetty. Yritämme vastata mahdollisimman pian.',
      urgent: 'Kiireellisissä tilanteissa olkaa yhteydessä puhelimitse:',
      close: 'Sulje',
      lName: 'Nimi', lEmail: 'Sähköposti', lPhone: 'Puhelin', lCompany: 'Yritys', lMsg: 'Viesti',
      privacy: 'Lähettämällä hyväksyt <a href="tietosuojaseloste.html" target="_blank" rel="noopener">tietosuojaselosteen</a>.'
    },
    sv: {
      eyebrow: 'Kontakta oss', title: 'Skicka meddelande',
      intro: 'Fyll i formuläret så kontaktar vi dig så snart som möjligt.',
      name: 'Namn', email: 'E-post', phone: 'Telefon', company: 'Företag',
      optional: '(valfritt)', message: 'Meddelande', send: 'Skicka meddelande',
      sending: 'Skickar…',
      errorMsg: 'Meddelandet kunde inte skickas. Försök igen eller mejla info@svkatto.fi.',
      mailSubject: 'Kontakt via webbplatsen',
      thanksTitle: 'Tack för din kontakt!',
      thanksBody: 'Ditt meddelande har skickats. Vi försöker svara så snart som möjligt.',
      urgent: 'I brådskande fall, kontakta oss per telefon:',
      close: 'Stäng',
      lName: 'Namn', lEmail: 'E-post', lPhone: 'Telefon', lCompany: 'Företag', lMsg: 'Meddelande',
      privacy: 'Genom att skicka godkänner du <a href="tietosuojaseloste.html" target="_blank" rel="noopener">dataskyddsbeskrivningen</a>.'
    },
    en: {
      eyebrow: 'Contact us', title: 'Send a message',
      intro: 'Fill in the form and we will get back to you as soon as possible.',
      name: 'Name', email: 'Email', phone: 'Phone', company: 'Company',
      optional: '(optional)', message: 'Message', send: 'Send message',
      sending: 'Sending…',
      errorMsg: 'The message could not be sent. Please try again or email info@svkatto.fi.',
      mailSubject: 'Contact from website',
      thanksTitle: 'Thank you for your message!',
      thanksBody: 'Your message has been sent. We will try to respond as soon as possible.',
      urgent: 'In urgent cases, please contact us by phone:',
      close: 'Close',
      lName: 'Name', lEmail: 'Email', lPhone: 'Phone', lCompany: 'Company', lMsg: 'Message',
      privacy: 'By submitting you accept the <a href="tietosuojaseloste.html" target="_blank" rel="noopener">privacy policy</a>.'
    },
    ru: {
      eyebrow: 'Связаться', title: 'Отправить сообщение',
      intro: 'Заполните форму, и мы свяжемся с вами как можно скорее.',
      name: 'Имя', email: 'Эл. почта', phone: 'Телефон', company: 'Компания',
      optional: '(необязательно)', message: 'Сообщение', send: 'Отправить сообщение',
      sending: 'Отправка…',
      errorMsg: 'Не удалось отправить сообщение. Попробуйте ещё раз или напишите на info@svkatto.fi.',
      mailSubject: 'Обращение с сайта',
      thanksTitle: 'Спасибо за обращение!',
      thanksBody: 'Ваше сообщение отправлено. Мы постараемся ответить как можно скорее.',
      urgent: 'В срочных случаях свяжитесь по электронной почте:',
      close: 'Закрыть',
      lName: 'Имя', lEmail: 'Эл. почта', lPhone: 'Телефон', lCompany: 'Компания', lMsg: 'Сообщение',
      privacy: 'Отправляя, вы принимаете <a href="tietosuojaseloste.html" target="_blank" rel="noopener">политику конфиденциальности</a>.'
    }
  };
  var t = S[lang];

  var modal = document.createElement('div');
  modal.className = 'cf-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML =
    '<div class="cf-overlay" data-cf-close></div>' +
    '<div class="cf-dialog">' +
      '<button class="cf-close" type="button" aria-label="' + t.close + '" data-cf-close>&times;</button>' +
      '<div class="cf-form-view">' +
        '<p class="cf-eyebrow">' + t.eyebrow + '</p>' +
        '<h2 class="cf-title">' + t.title + '</h2>' +
        '<p class="cf-intro">' + t.intro + '</p>' +
        '<form class="cf-form" novalidate>' +
          '<div class="cf-field"><label>' + t.lName + '</label><input type="text" name="name" required></div>' +
          '<div class="cf-field"><label>' + t.lEmail + '</label><input type="email" name="email" required></div>' +
          '<div class="cf-field"><label>' + t.lPhone + ' <span class="cf-optional">' + t.optional + '</span></label><input type="tel" name="phone"></div>' +
          '<div class="cf-field"><label>' + t.lCompany + ' <span class="cf-optional">' + t.optional + '</span></label><input type="text" name="company"></div>' +
          '<div class="cf-field"><label>' + t.lMsg + '</label><textarea name="message" required></textarea></div>' +
          '<button type="submit" class="btn btn-primary cf-submit">' + t.send + '</button>' +
          '<p class="cf-privacy" style="font-size:0.78rem;color:var(--gray-light);margin-top:0.8rem;text-align:center;">' + t.privacy + '</p>' +
          '<p class="cf-error" role="alert" style="display:none;color:#8B2213;font-family:var(--font-heading);font-size:0.85rem;margin-top:0.9rem;text-align:center;"></p>' +
        '</form>' +
      '</div>' +
      '<div class="cf-toast-view" style="display:none;">' +
        '<div class="cf-toast-text">' +
          '<div class="cf-toast-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></div>' +
          '<h3>' + t.thanksTitle + '</h3>' +
          '<p>' + t.thanksBody + '</p>' +
          '<p>' + t.urgent + '</p>' +
          '<a class="cf-toast-phone" href="mailto:info@svkatto.fi">' + PHONE + '</a>' +
        '</div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(modal);

  var dialog = modal.querySelector('.cf-dialog');
  var formView = modal.querySelector('.cf-form-view');
  var toastView = modal.querySelector('.cf-toast-view');
  var form = modal.querySelector('.cf-form');

  function openModal() {
    // Close the mobile nav if it happens to be open
    var nav = document.getElementById('navLinks');
    var ham = document.getElementById('hamburger');
    if (nav) nav.classList.remove('open');
    if (ham) ham.classList.remove('open');

    formView.style.display = '';
    toastView.style.display = 'none';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    var first = form.querySelector('input');
    if (first) setTimeout(function () { first.focus(); }, 60);
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    form.reset();
  }

  modal.addEventListener('click', function (e) {
    if (e.target.hasAttribute('data-cf-close')) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  var submitBtn = form.querySelector('.cf-submit');
  var errorEl = form.querySelector('.cf-error');

  function showToast() {
    formView.style.display = 'none';
    toastView.style.display = '';
    if (dialog) dialog.scrollTop = 0;
  }

  function buildMailto(d) {
    var company = (d.get('company') || '').trim();
    var bodyLines = [
      t.lName + ': ' + (d.get('name') || '').trim(),
      t.lEmail + ': ' + (d.get('email') || '').trim()
    ];
    if ((d.get('phone') || '').trim()) bodyLines.push(t.lPhone + ': ' + (d.get('phone') || '').trim());
    if (company) bodyLines.push(t.lCompany + ': ' + company);
    bodyLines.push('', t.lMsg + ':', (d.get('message') || '').trim());
    return 'mailto:' + CONTACT_EMAIL +
      '?subject=' + encodeURIComponent(t.mailSubject + (company ? ' - ' + company : '')) +
      '&body=' + encodeURIComponent(bodyLines.join('\n'));
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    errorEl.style.display = 'none';
    var d = new FormData(form);

    // Ilman Formspree-endpointia: avaa kävijän oma sähköpostiohjelma (mailto)
    if (!FORMSPREE_ENDPOINT) {
      window.location.href = buildMailto(d);
      showToast();
      return;
    }

    // Formspree: lähetä suoraan taustalla, kävijä pysyy sivulla
    d.append('_subject', t.mailSubject + ((d.get('company') || '').trim() ? ' - ' + (d.get('company') || '').trim() : ''));
    submitBtn.disabled = true;
    var originalLabel = submitBtn.textContent;
    submitBtn.textContent = t.sending;

    fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      body: d,
      headers: { Accept: 'application/json' }
    }).then(function (res) {
      if (res.ok) {
        showToast();
      } else {
        errorEl.textContent = t.errorMsg;
        errorEl.style.display = 'block';
      }
    }).catch(function () {
      errorEl.textContent = t.errorMsg;
      errorEl.style.display = 'block';
    }).then(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    });
  });

  // "Ota yhteyttä" -napit avaavat suoraan kävijän oman sähköpostiohjelman
  // (mailto: info@svkatto.fi). Lomake-modaalia ei enää avata näistä
  // napeista, joten jätetään natiivi mailto-linkki toimimaan sellaisenaan.
})();

// Yhteystieto-osio jokaisen sivun alapalkkiin (etusivulla se on jo valmiina)
(function () {
  if (document.querySelector('.contact')) return;
  var footer = document.querySelector('.footer');
  if (!footer) return;
  var lang = document.documentElement.lang || 'fi';
  var base = (location.pathname.indexOf('/sv/') !== -1 || location.pathname.indexOf('/ru/') !== -1 || location.pathname.indexOf('/en/') !== -1) ? '../' : '';
  var L = ({
    fi: { label: 'Yhteystiedot', heading: 'Svkatto palveluksessanne', lead: 'Työnjohtaja, Partner' },
    sv: { label: 'Kontakt', heading: 'Svkatto till er tjänst', lead: 'Arbetsledare, Partner' },
    en: { label: 'Contact', heading: 'Svkatto at your service', lead: 'Site manager, Partner' },
    ru: { label: 'Контакты', heading: 'Svkatto к вашим услугам', lead: '' }
  })[lang] || { label: 'Yhteystiedot', heading: 'Svkatto palveluksessanne', lead: 'Työnjohtaja, Partner' };
  function card(av, name, role, tel, telDisp, email) {
    return '<div class="contact-card"><div class="contact-avatar">' + av + '</div>' +
      '<div class="contact-card-info"><h3>' + name + '</h3><p class="contact-role">' + role + '</p>' +
      '<a href="tel:' + tel + '" class="contact-phone">' + telDisp + '</a></div>' +
      '<a href="mailto:' + email + '" class="contact-card-email">' + email + '</a></div>';
  }
  var html =
    '<section class="contact" id="yhteystiedot"><div class="section-container">' +
    '<div class="section-header"><span class="section-label section-label--light">' + L.label + '</span>' +
    '<h2 class="section-title section-title--light">' + L.heading + '</h2></div>' +
    '<div class="contact-grid">' +
    '<div class="contact-info">' +
    '<div class="contact-block"><p class="contact-company">Svkatto Oy</p><p>Pähkinätie 12 A1<br>01710 Vantaa</p>' +
    '<p class="contact-detail">Y-tunnus: 3510360-8</p></div>' +
    '<div class="contact-block">' +
    '<a href="mailto:info@svkatto.fi" class="contact-link">info@svkatto.fi</a></div>' +
    '<img src="' + base + 'kuvat/logo/luotettava-kumppani.svg" alt="Luotettava Kumppani" class="contact-cert">' +
    '</div>' +
    '<div class="contact-persons">' +
    '<p class="contact-note">' + (lang === 'ru' ? 'Мы работаем с частными клиентами, жилищными компаниями и по субподряду по всей Уусимаа. Свяжитесь с нами: info@svkatto.fi' : 'Palvelemme yksityisasiakkaita, taloyhtiöitä ja urakoitsijoita koko Uudellamaalla. Ota yhteyttä: info@svkatto.fi') + '</p>' +
    '</div></div></div></section>';
  footer.insertAdjacentHTML('beforebegin', html);
})();
