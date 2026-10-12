// Shared by every public page — both the app.js-rendered ones and the
// hand-written static pages under services/ and case-studies/.
//
// 1. Lead tracking. Google Analytics only counted page views, so there was no
//    way to tell which pages or channels produced enquiries. This sends GA4
//    events for the actions that count as a lead:
//      generate_lead   — the HubSpot enquiry form was submitted
//      sign_up         — the Quick Subscribe form was submitted
//      contact_click   — an email or phone link was clicked (method: email|phone)
//      enquire_click   — a link to /enquire/ was clicked (which button, which page)
//      profile_download — the company profile PDF was downloaded
//    Mark generate_lead and contact_click as key events in GA4
//    (Admin > Data display > Events) so they show up as conversions.
//
// 2. Lazy video. The home page used to start downloading ~29 MB of autoplay
//    video before anyone scrolled. Videos marked data-lazy carry
//    preload="none" and no autoplay attribute, so only the poster image loads
//    up front; each video starts playing as it nears the viewport and pauses
//    once it leaves, so off-screen loops stop streaming.
(function () {
  var ENQUIRY_FORM = 'f5c252b4-19ed-4c9a-89ea-87cf5a02b01c';

  function track(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var page = location.pathname;
    if (href.indexOf('mailto:') === 0) track('contact_click', { method: 'email', page_path: page });
    else if (href.indexOf('tel:') === 0) track('contact_click', { method: 'phone', page_path: page });
    else if (/\.pdf(\?|#|$)/i.test(href)) track('profile_download', { file_name: href.split('/').pop(), page_path: page });
    else if (a.origin === location.origin && /\/enquire\/?$/.test(a.pathname) && !/\/enquire\/?$/.test(page)) {
      track('enquire_click', { link_text: (a.textContent || '').trim().slice(0, 60), page_path: page });
    }
  }, true);

  // HubSpot form submissions. The current embed (hs-form-frame) fires a window
  // event; older embeds post an hsFormCallback message. Listen for both, and
  // count each form once per page view.
  var submitted = {};
  function formSubmitted(formId) {
    if (!formId) formId = /\/enquire\/?$/.test(location.pathname) ? ENQUIRY_FORM : 'subscribe';
    if (submitted[formId]) return;
    submitted[formId] = true;
    track(formId === ENQUIRY_FORM ? 'generate_lead' : 'sign_up', { form_id: formId, page_path: location.pathname });
  }
  window.addEventListener('hs-form-event:on-submission:success', function (e) {
    var id = e.detail && e.detail.formId;
    try {
      if (!id && window.HubSpotFormsV4) id = window.HubSpotFormsV4.getFormFromEvent(e).getFormId();
    } catch (err) { /* fall back to the page-based guess */ }
    formSubmitted(id);
  });
  window.addEventListener('message', function (e) {
    var d = e.data;
    if (d && d.type === 'hsFormCallback' && d.eventName === 'onFormSubmitted') formSubmitted(d.id);
  });

  var io = 'IntersectionObserver' in window && new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var v = entry.target;
      if (entry.isIntersecting) {
        var p = v.play();
        if (p && p.catch) p.catch(function () {});
      } else {
        v.pause();
      }
    });
  }, { rootMargin: '200px 0px' });

  function scan(root) {
    if (!root.querySelectorAll) return;
    root.querySelectorAll('video[data-lazy]').forEach(function (v) {
      if (v.dataset.lazyBound) return;
      v.dataset.lazyBound = '1';
      v.muted = true;
      if (io) io.observe(v);
      else v.play();
    });
  }

  scan(document);
  // app.js re-renders the page after load, replacing the prerendered markup,
  // so pick up videos as they are added.
  new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      m.addedNodes.forEach(function (n) {
        if (n.nodeType === 1) scan(n.parentNode || n);
      });
    });
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
