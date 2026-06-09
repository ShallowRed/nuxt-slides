(function () {
  var meta = document.querySelector('meta[name="eulerian-domain"]');
  var e = meta && meta.getAttribute('content');
  if (!e) return;

  var a = 'EA_push';
  var i = e.length,
    y = 5381,
    k = 'script',
    s = window,
    v = document,
    o = v.createElement(k);
  for (; i; ) {
    i -= 1;
    y = (y * 33) ^ e.charCodeAt(i);
  }
  y = '_EA_' + (y >>>= 0);
  (function (e, a, s, y) {
    s[a] =
      s[a] ||
      function () {
        (s[y] = s[y] || []).push(arguments);
        s[y].eah = e;
      };
  })(e, a, s, y);
  i = (new Date() / 1e7) | 0;
  o.ea = y;
  y = i % 26;
  o.async = 1;
  o.src =
    '//' +
    e +
    '/' +
    String.fromCharCode(97 + y, 122 - y, 65 + y) +
    (i % 1e3) +
    '.js?2';
  s = v.getElementsByTagName(k)[0];
  s.parentNode.insertBefore(o, s);
})();
