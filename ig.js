// Instagram, Facebook and TikTok open links in their own mini browser, which
// cannot open the App Store. There (on iPhone), an App Store button shows a box
// that reopens this site in Safari (x-safari-https://, which iOS asks to
// confirm), with the manual steps and a copy-the-link button as backups.
// <body data-ig-auto> shows the box as soon as the page loads (used by /download).
(function () {
  var STORE = 'https://apps.apple.com/app/id6822796922';
  var ua = navigator.userAgent || '';
  var inApp = /Instagram|FBAN|FBAV|FB_IAB|TikTok|musical_ly|Line\//i.test(ua);
  var ios = /iPhone|iPad|iPod/i.test(ua);
  if (!inApp || !ios) return;

  var css = '' +
    '.igbox-bg{position:fixed;inset:0;background:rgba(40,25,15,.55);display:none;align-items:flex-end;justify-content:center;z-index:99}' +
    '.igbox-bg.show{display:flex}' +
    '.igbox{position:relative;background:#fffaf3;color:#3f2a1c;border-radius:28px 28px 0 0;padding:64px 24px calc(22px + env(safe-area-inset-bottom));max-width:480px;width:100%;text-align:center;font:16px/1.5 -apple-system,BlinkMacSystemFont,sans-serif;animation:igup .28s ease-out}' +
    '@keyframes igup{from{transform:translateY(100%)}to{transform:none}}' +
    '.igbox img{position:absolute;left:50%;top:-58px;transform:translateX(-50%);width:120px;height:auto}' +
    '.igbox h2{font-size:26px;font-weight:900;letter-spacing:-.5px;margin:0 0 6px}' +
    '.igbox p{color:#7a6353;margin:0 0 20px}' +
    '.igbox .go{display:block;width:100%;border:0;border-radius:16px;background:#ff8b38;color:#fff;font:800 18px -apple-system,sans-serif;padding:16px;box-shadow:0 4px 0 #d96a1c}' +
    '.igbox .help{font-size:14px;margin:18px 0 6px}' +
    '.igbox .copy,.igbox .later{background:none;border:0;color:#c4601a;font:700 15px -apple-system,sans-serif;padding:8px;text-decoration:underline}' +
    '.igbox .later{display:block;margin:6px auto 0;color:#7a6353;text-decoration:none;font-weight:600}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var bg = document.createElement('div');
  bg.className = 'igbox-bg';
  bg.innerHTML =
    '<div class="igbox" role="dialog" aria-modal="true">' +
      '<img src="/img/tanu-hi.png" alt="">' +
      '<h2>Almost there!</h2>' +
      '<p>Instagram can\'t take you to the App Store from here. Hop over to Safari and Tanu is one tap away.</p>' +
      '<button class="go">Continue in Safari</button>' +
      '<p class="help">Didn\'t work? Tap <b>•••</b> at the top, then <b>Open in external browser</b>.</p>' +
      '<button class="copy">Copy the App Store link</button>' +
      '<button class="later">Not now</button>' +
    '</div>';

  function ready(fn) {
    if (document.body) fn(); else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    document.body.appendChild(bg);
    var open = function () { bg.classList.add('show'); };
    var close = function () { bg.classList.remove('show'); };
    bg.querySelector('.later').onclick = close;
    bg.onclick = function (e) { if (e.target === bg) close(); };

    // reopen the /download page in Safari: there it goes straight to the App Store
    bg.querySelector('.go').onclick = function () {
      window.location.href = 'x-safari-' + location.origin + '/download/';
    };

    var copyBtn = bg.querySelector('.copy');
    copyBtn.onclick = function () {
      var done = function () { copyBtn.textContent = 'Copied! Paste it in Safari'; };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(STORE).then(done, fallback);
      } else {
        fallback();
      }
      function fallback() {
        var t = document.createElement('textarea');
        t.value = STORE; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
        document.body.appendChild(t); t.select(); t.setSelectionRange(0, 999);
        try { document.execCommand('copy'); done(); } catch (e) {}
        document.body.removeChild(t);
      }
    };

    document.querySelectorAll('[data-store]').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); open(); });
    });
    if (document.body.hasAttribute('data-ig-auto')) open();
  });
})();
