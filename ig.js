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
    '.igbox-bg{position:fixed;inset:0;background:rgba(0,0,0,.45);display:none;align-items:center;justify-content:center;padding:20px;z-index:99}' +
    '.igbox-bg.show{display:flex}' +
    '.igbox{position:relative;background:#fff;color:#2a1d14;border-radius:24px;padding:28px 22px 22px;max-width:380px;width:100%;text-align:center;font:16px/1.45 -apple-system,BlinkMacSystemFont,sans-serif;box-shadow:0 20px 60px rgba(0,0,0,.3)}' +
    '.igbox h2{font-size:24px;line-height:1.2;margin:0 0 8px}' +
    '.igbox h2 span{color:#ff8b38}' +
    '.igbox p{color:#6b5a4e;margin:0 0 20px}' +
    '.igbox .go{display:block;width:100%;border:0;border-radius:999px;background:#ff8b38;color:#fff;font:700 18px -apple-system,sans-serif;padding:15px}' +
    '.igbox .or{display:flex;align-items:center;gap:10px;color:#9a8a7e;font-size:14px;margin:18px 0 12px}' +
    '.igbox .or:before,.igbox .or:after{content:"";flex:1;height:1px;background:#e6ddd5}' +
    '.igbox ol{list-style:none;padding:0;margin:0 0 18px;text-align:left}' +
    '.igbox li{display:flex;gap:12px;align-items:flex-start;margin:10px 0}' +
    '.igbox li i{flex:none;width:26px;height:26px;border-radius:50%;background:#ff8b38;color:#fff;font:700 14px/26px -apple-system,sans-serif;font-style:normal;text-align:center}' +
    '.igbox .copy{display:block;width:100%;border:0;border-radius:999px;background:#2a1d14;color:#fff;font:700 17px -apple-system,sans-serif;padding:14px}' +
    '.igbox small{display:block;color:#9a8a7e;margin-top:8px;word-break:break-all}' +
    '.igbox .x{position:absolute;top:12px;right:12px;width:34px;height:34px;border:0;border-radius:50%;background:#efe8e2;color:#2a1d14;font-size:18px}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var bg = document.createElement('div');
  bg.className = 'igbox-bg';
  bg.innerHTML =
    '<div class="igbox" role="dialog" aria-modal="true">' +
      '<button class="x" aria-label="Close">✕</button>' +
      '<h2>Open in <span>Safari</span> to download</h2>' +
      '<p>Instagram\'s built-in browser can\'t open the App Store. It only takes a second to switch.</p>' +
      '<button class="go">Open in Safari</button>' +
      '<div class="or">or do it yourself</div>' +
      '<ol><li><i>1</i><span>Tap the <b>•••</b> button at the top right of this screen</span></li>' +
      '<li><i>2</i><span>Choose <b>Open in external browser</b></span></li></ol>' +
      '<button class="copy">Copy the App Store link</button>' +
      '<small>' + STORE + '</small>' +
    '</div>';

  function ready(fn) {
    if (document.body) fn(); else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    document.body.appendChild(bg);
    var open = function () { bg.classList.add('show'); };
    var close = function () { bg.classList.remove('show'); };
    bg.querySelector('.x').onclick = close;
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
