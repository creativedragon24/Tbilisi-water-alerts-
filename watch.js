/* Street matching shared by index.html and sw.js.
   Georgian and Latin spellings are folded to the same rough sound, so
   "Iqalto", "Ikalto" and "იყალთო" all match. */
(function (g) {
  const M = {ა:'a',ბ:'b',გ:'g',დ:'d',ე:'e',ვ:'v',ზ:'z',თ:'t',ი:'i',კ:'k',ლ:'l',მ:'m',ნ:'n',ო:'o',პ:'p',ჟ:'j',რ:'r',ს:'s',ტ:'t',უ:'u',ფ:'p',ქ:'k',ღ:'g',ყ:'k',შ:'s',ჩ:'c',ც:'c',ძ:'z',წ:'c',ჭ:'c',ხ:'k',ჯ:'j',ჰ:'h'};
  const D = [['sh','s'],['ch','c'],['ts','c'],['kh','k'],['gh','g'],['zh','j'],['dz','z'],['th','t'],['ph','p']];
  function norm(s) {
    s = String(s || '').toLowerCase();
    for (const [a, b] of D) s = s.split(a).join(b);
    s = s.replace(/q|x/g, 'k').replace(/w/g, 'v').replace(/y/g, 'i').replace(/f/g, 'p');
    return s.replace(/[\u10D0-\u10FF]/g, c => M[c] || '').replace(/[^a-z0-9]/g, '').replace(/(.)\1+/g, '$1');
  }
  function stem(s) {
    return String(s || '').replace(/\b(street|str|st|ave|avenue|lane|alley)\b\.?/gi, ' ').replace(/ქუჩ[ა-ჰ]*|ქ\./g, ' ');
  }
  // entry = {d: 'Vake', s: 'street name or empty = whole district'}, a = one alert from current_alerts.json
  function hit(e, a) {
    if (e.d && a.district_en !== e.d) return false;
    if (!e.s) return true;
    const q = norm(stem(e.s));
    if (q.length < 3) return false;
    return norm(String(a.address || '') + ' ' + String(a.email_text || '')).includes(q);
  }
  g.TBW = {norm, hit};
})(self);
