// Формат IDR и прописью (индо/ру) для UI‑подсказок и политик

export function formatIDR(n: number, opts: { showCode?: boolean } = {}) {
  const s = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(
    n
  );
  return opts.showCode ? `${s} IDR` : `Rp ${s}`;
}

// ——— Индонезийские числа прописью (до миллиардов) ———
const ID_SMALL = [
  'nol',
  'satu',
  'dua',
  'tiga',
  'empat',
  'lima',
  'enam',
  'tujuh',
  'delapan',
  'sembilan',
  'sepuluh',
  'sebelas',
];

function toWordsID_uptoHundreds(n: number): string {
  if (n < 12) return ID_SMALL[n];
  if (n < 20) return toWordsID_uptoHundreds(n - 10) + ' belas';
  if (n < 100) {
    const d = Math.floor(n / 10),
      r = n % 10;
    return (
      toWordsID_uptoHundreds(d) +
      ' puluh' +
      (r ? ' ' + toWordsID_uptoHundreds(r) : '')
    );
  }
  if (n < 200)
    return 'seratus' + (n % 100 ? ' ' + toWordsID_uptoHundreds(n % 100) : '');
  const h = Math.floor(n / 100),
    r = n % 100;
  return (
    toWordsID_uptoHundreds(h) +
    ' ratus' +
    (r ? ' ' + toWordsID_uptoHundreds(r) : '')
  );
}

function toWordsID(n: number): string {
  if (n === 0) return 'nol';
  if (n < 1000) return toWordsID_uptoHundreds(n);
  if (n < 2000) return 'seribu' + (n % 1000 ? ' ' + toWordsID(n % 1000) : '');
  if (n < 1_000_000) {
    const th = Math.floor(n / 1000),
      r = n % 1000;
    return toWordsID(th) + ' ribu' + (r ? ' ' + toWordsID(r) : '');
  }
  if (n < 1_000_000_000) {
    const m = Math.floor(n / 1_000_000),
      r = n % 1_000_000;
    return toWordsID(m) + ' juta' + (r ? ' ' + toWordsID(r) : '');
  }
  const b = Math.floor(n / 1_000_000_000),
    r = n % 1_000_000_000;
  return toWordsID(b) + ' miliar' + (r ? ' ' + toWordsID(r) : '');
}

// ——— Русские числа (упрощённо, до миллионов, без падежных тонкостей) ———
const RU_1_19 = [
  'ноль',
  'один',
  'два',
  'три',
  'четыре',
  'пять',
  'шесть',
  'семь',
  'восемь',
  'девять',
  'десять',
  'одиннадцать',
  'двенадцать',
  'тринадцать',
  'четырнадцать',
  'пятнадцать',
  'шестнадцать',
  'семнадцать',
  'восемнадцать',
  'девятнадцать',
];
const RU_TENS = [
  '',
  '',
  'двадцать',
  'тридцать',
  'сорок',
  'пятьдесят',
  'шестьдесят',
  'семьдесят',
  'восемьдесят',
  'девяносто',
];
const RU_HUND = [
  '',
  'сто',
  'двести',
  'триста',
  'четыреста',
  'пятьсот',
  'шестьсот',
  'семьсот',
  'восемьсот',
  'девятьсот',
];

function toWordsRU_upto999(n: number): string {
  if (n < 20) return RU_1_19[n];
  if (n < 100) {
    const d = Math.floor(n / 10),
      r = n % 10;
    return RU_TENS[d] + (r ? ' ' + RU_1_19[r] : '');
  }
  const h = Math.floor(n / 100),
    r = n % 100;
  return RU_HUND[h] + (r ? ' ' + toWordsRU_upto999(r) : '');
}

function toWordsRU(n: number): string {
  if (n === 0) return 'ноль';
  let out: string[] = [];
  const mln = Math.floor(n / 1_000_000);
  n = n % 1_000_000;
  const th = Math.floor(n / 1000);
  const rest = n % 1000;
  if (mln) out.push(toWordsRU_upto999(mln), 'миллионов');
  if (th) out.push(toWordsRU_upto999(th), 'тысяч');
  if (rest) out.push(toWordsRU_upto999(rest));
  return out.join(' ').replace(/\s+/g, ' ').trim();
}

export function idrWithWords(
  n: number,
  locale: 'id' | 'ru' = 'id',
  withCode = true
) {
  const money = formatIDR(n, { showCode: withCode });
  const words = locale === 'ru' ? toWordsRU(n) : toWordsID(n);
  const tail = locale === 'ru' ? ' индонезийских рупий' : ' rupiah';
  return `${money} (${words}${tail})`;
}
