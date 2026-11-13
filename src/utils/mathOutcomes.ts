import type { Figure, Question } from '../types';

type Seed = Pick<Question, 'q' | 'a' | 'explanation' | 'figure' | 'distractors' | 'difficulty'>;
type Family = { grade: number; code: string; name: string; make: (n: number) => Seed };

function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : Math.abs(a);
}

function frac(num: number, den: number): string {
  const g = gcd(Math.round(num), Math.round(den)) || 1;
  return `${Math.round(num / g)}/${Math.round(den / g)}`;
}

function fmt(value: number): string {
  const rounded = Math.round(value * 1000) / 1000;
  return String(rounded).replace('.', ',');
}

function uniqueNums(answer: number, candidates: number[]): [string, string, string] {
  const ansStr = fmt(answer);
  const out: string[] = [];
  const seen = new Set<string>([ansStr]);
  for (const c of candidates) {
    const s = fmt(c);
    if (!seen.has(s) && Number.isFinite(c)) {
      seen.add(s);
      out.push(s);
      if (out.length === 3) break;
    }
  }
  let offset = 1;
  while (out.length < 3) {
    const alt = answer + (offset % 2 === 0 ? offset : -offset);
    const s = fmt(alt < 0 && answer >= 0 ? answer + offset + 2 : alt);
    if (!seen.has(s)) {
      seen.add(s);
      out.push(s);
    }
    offset++;
  }
  return [out[0], out[1], out[2]];
}

const numSeed = (
  q: string,
  answer: number,
  wrongCandidates: number[],
  explanation: string,
  difficulty: Question['difficulty'],
  figure?: Figure,
): Seed => ({
  q,
  a: fmt(answer),
  distractors: uniqueNums(answer, wrongCandidates),
  explanation,
  difficulty,
  figure,
});

const families: Family[] = [
  // ===================== 5. SINIF (8 MEB KAZANIM AİLESİ) =====================
  {
    grade: 5,
    code: 'MAT.5.1.2',
    name: 'Doğal sayılarla çok adımlı günlük yaşam ve bölme yorumlama',
    make: n => {
      const boxes = 7 + n;
      const perBox = 24;
      const given = 31 + (n % 5) * 3;
      const shelfCap = 6;
      const remaining = boxes * perBox - given;
      const shelves = Math.floor(remaining / shelfCap);
      const leftover = remaining % shelfCap;
      return numSeed(
        `Okul kütüphanesine her birinde ${perBox} kitap bulunan ${boxes} koli geldi. İlk gün ${given} kitap öğrencilere dağıtıldı. Kalan kitaplar her rafa tam ${shelfCap} kitap konacak şekilde yerleştirildiğinde en son rafa sığmayan kaç kitap artar?`,
        leftover,
        [(leftover + 1) % shelfCap, (leftover + 2) % shelfCap, shelves],
        `Toplam kitap ${boxes} × ${perBox} = ${boxes * perBox}. Dağıtım sonrası ${remaining} kitap kalır. ${remaining} ÷ ${shelfCap} = ${shelves} raf dolar, kalan ${leftover} kitap artar.`,
        n % 3 === 0 ? 'kolay' : n % 3 === 1 ? 'orta' : 'zor',
      );
    },
  },
  {
    grade: 5,
    code: 'MAT.5.1.4',
    name: 'Kesir, ondalık ve yüzde gösterimlerini karşılaştırma',
    make: n => {
      const base = 14 + 2 * n;
      const a = base;
      const b = base - 3;
      const c = base + 5;
      const d = base + 2;
      return {
        q: `Sıfır atık projesinde dört sınıfın geri dönüşüme kazandırdığı kâğıt oranları şöyle ölçüldü: 5-A sınıfı %${a}, 5-B sınıfı ${b}/100, 5-C sınıfı 0,${c}, 5-D sınıfı ${d}/100. Geri dönüşüm oranı en yüksek sınıf hangisidir?`,
        a: '5-C',
        distractors: ['5-A', '5-B', '5-D'],
        explanation: `Tüm değerler yüzdeye çevrilirse: 5-A = %${a}, 5-B = %${b}, 5-C = %${c}, 5-D = %${d}. En büyük oran %${c} ile 5-C’dir.`,
        difficulty: n % 2 === 0 ? 'kolay' : 'orta',
      };
    },
  },
  {
    grade: 5,
    code: 'MAT.5.1.5',
    name: 'Kesirlerle çok adımlı problem çözme',
    make: n => {
      const cap = 24 * (3 + (n % 5));
      const morning = cap / 3;
      const afternoon = (cap - morning) / 4;
      const left = cap - morning - afternoon;
      return numSeed(
        `Okul bahçesindeki ${cap} litrelik su deposunun sabah 1/3’ü, öğleden sonra ise kalan suyun 1/4’ü çiçek sulamada kullanıldı. Gün sonunda depoda kaç litre su kalır?`,
        left,
        [cap - cap / 3 - cap / 4, morning + afternoon, left - 12],
        `Sabah ${cap} × 1/3 = ${morning} L kullanılır, ${cap - morning} L kalır. Öğleden sonra kalanın 1/4’ü olan ${afternoon} L kullanılır. Kalan: ${cap - morning} − ${afternoon} = ${left} L.`,
        n % 3 === 0 ? 'orta' : 'zor',
      );
    },
  },
  {
    grade: 5,
    code: 'MAT.5.2.1',
    name: 'Sayı ve şekil örüntülerinde kural bulma ve yorumlama',
    make: n => {
      const start = 4 + (n % 5);
      const step = 3 + (n % 4);
      const targetStep = 9 + (n % 4);
      const value = start + (targetStep - 1) * step;
      const prev = start + (targetStep - 2) * step;
      return numSeed(
        `Bir mozaik ustası 1. adımda ${start}, 2. adımda ${start + step}, 3. adımda ${start + 2 * step} adet renkli taş kullanarak süsleme yapıyor. Örüntü aynı kurala göre sürerse ${targetStep}. adımda kaç taş kullanır?`,
        value,
        [start + targetStep * step, prev, value + step],
        `Her adımda taş sayısı ${step} artmaktadır. ${targetStep}. adımda başlangıca (${targetStep - 1}) kez ${step} eklenir: ${start} + ${targetStep - 1} × ${step} = ${value}.`,
        n % 3 === 0 ? 'kolay' : 'orta',
      );
    },
  },
  {
    grade: 5,
    code: 'MAT.5.3.2',
    name: 'Zaman ölçüleri ve tarife çizelgesi analizi',
    make: n => {
      const busMin = 18 + n;
      const walkMin = 7 + (n % 5);
      const prepMin = 12 + (n % 4);
      const totalBefore = busMin + walkMin + prepMin;
      const targetMin = 8 * 60 + 30; // 08:30
      const leaveMin = targetMin - totalBefore;
      const hh = Math.floor(leaveMin / 60);
      const mm = leaveMin % 60;
      const hhStr = String(hh).padStart(2, '0');
      const mmStr = String(mm).padStart(2, '0');
      const ans = `${hhStr}:${mmStr}`;
      const wrong1 = `${String(Math.floor((leaveMin + 10) / 60)).padStart(2, '0')}:${String((leaveMin + 10) % 60).padStart(2, '0')}`;
      const wrong2 = `${String(Math.floor((leaveMin - 10) / 60)).padStart(2, '0')}:${String((leaveMin - 10) % 60).padStart(2, '0')}`;
      const wrong3 = `${String(Math.floor((leaveMin + prepMin) / 60)).padStart(2, '0')}:${String((leaveMin + prepMin) % 60).padStart(2, '0')}`;
      return {
        q: `Deniz’in okulundaki tören saat 08:30’da başlıyor. Deniz’in evden durağa yürümesi ${walkMin} dakika, otobüs yolculuğu ${busMin} dakika ve okulda tören hazırlığı ${prepMin} dakika sürüyor. Tam 08:30’da hazır olabilmek için en geç saat kaçta evden çıkmalıdır? (SS:DD biçiminde yaz)`,
        a: ans,
        distractors: [wrong1, wrong2, wrong3],
        explanation: `Toplam süre ${walkMin} + ${busMin} + ${prepMin} = ${totalBefore} dakikadır. 08:30’dan ${totalBefore} dakika geriye gidildiğinde saat ${ans} bulunur.`,
        difficulty: n % 2 === 0 ? 'orta' : 'zor',
      };
    },
  },
  {
    grade: 5,
    code: 'MAT.5.4.1',
    name: 'Dikdörtgen ve kare çevre kenarlarını modelleme',
    make: n => {
      const w = 11 + n;
      const h = 5 + (n % 4);
      const perim = 2 * (w + h);
      return numSeed(
        `Şekildeki okul panosunun çevresi ${perim} cm ve kısa kenarı ${h} cm’dir. Panonun çevresine iki sıra renkli şerit çekilirse yalnızca bir uzun kenarın uzunluğu kaç santimetredir?`,
        w,
        [perim - h, Math.floor(perim / 2), w + h],
        `Çevrenin yarısı bir uzun ve bir kısa kenarın toplamıdır: ${perim} ÷ 2 = ${w + h} cm. Uzun kenar = ${w + h} − ${h} = ${w} cm.`,
        n % 3 === 0 ? 'kolay' : 'orta',
        { kind: 'rectangle', width: w, height: h, hideWidth: true },
      );
    },
  },
  {
    grade: 5,
    code: 'MAT.5.4.2',
    name: 'Dikdörtgen alanından parça ayırma ve modelleme',
    make: n => {
      const w = 10 + n;
      const h = 6 + (n % 4);
      const cutW = 3 + (n % 3);
      const totalArea = w * h;
      const shadedArea = cutW * h;
      const remainingArea = totalArea - shadedArea;
      return numSeed(
        `Şekildeki ${w} cm × ${h} cm boyutlarındaki kartonun sol tarafından ${cutW} cm genişliğinde bir şerit kesilip atılıyor. Geriye kalan dikdörtgen parçanın alanı kaç santimetrekaredir?`,
        remainingArea,
        [totalArea, shadedArea, (w - cutW) * 2 + h * 2],
        `Kalan genişlik ${w} − ${cutW} = ${w - cutW} cm’dir. Alan = ${w - cutW} × ${h} = ${remainingArea} cm² (veya ${totalArea} − ${shadedArea}).`,
        n % 2 === 0 ? 'orta' : 'zor',
        { kind: 'rectSplit', width: w, height: h, cutWidth: cutW, labels: [`${cutW} cm`, 'Kalan'] },
      );
    },
  },
  {
    grade: 5,
    code: 'MAT.5.5.1',
    name: 'Sütun grafiği yorumlama ve hedef hesaplama',
    make: n => {
      const vals = [12 + n, 18 + (n % 5), 15 + (n % 4), 20 + (n % 6)];
      const sum = vals.reduce((a, b) => a + b, 0);
      const goal = sum + 15 + (n % 7);
      const needed = goal - sum;
      return numSeed(
        `Grafikte bir sınıfın dört günde topladığı atık pil sayıları verilmiştir. Haftalık hedef ${goal} pil olduğuna göre Cuma günü hedefe tam ulaşmak için en az kaç pil daha toplanmalıdır?`,
        needed,
        [sum, needed + 5, Math.max(1, needed - 4)],
        `İlk dört gün toplamı ${vals.join(' + ')} = ${sum} pildir. Hedefe ulaşmak için ${goal} − ${sum} = ${needed} pil gerekir.`,
        n % 3 === 0 ? 'kolay' : 'orta',
        { kind: 'bars', values: vals, labels: ['Pzt', 'Sal', 'Çar', 'Per'], title: 'Günlük Toplanan Pil Sayısı' },
      );
    },
  },

  // ===================== 6. SINIF (8 MEB KAZANIM AİLESİ) =====================
  {
    grade: 6,
    code: 'MAT.6.1.4',
    name: 'Ortak katlar ve ortak bölenlerle kısıt problemleri',
    make: n => {
      const a = 12 + 3 * (n % 4); // e.g. 12,15,18,21
      const b = 18 + 6 * (n % 3); // e.g. 18,24,30
      const lcm = (a * b) / gcd(a, b);
      const limit = lcm * 3 + 10;
      const meetings = Math.floor(limit / lcm);
      return numSeed(
        `İki metro hattı saat 07.00’de aynı anda ilk seferine başlıyor. A hattı her ${a} dakikada bir, B hattı her ${b} dakikada bir kalkıyor. Saat 07.00’den sonraki ${limit} dakika içinde bu iki hat başlangıç anı hariç kaç kez aynı anda kalkar?`,
        meetings,
        [meetings + 1, Math.max(1, meetings - 1), lcm],
        `Ortak kalkış aralığı EKOK(${a}, ${b}) = ${lcm} dakikadır. ${limit} dakika içinde ${Math.floor(limit / lcm)} kez birlikte kalkarlar.`,
        'zor',
      );
    },
  },
  {
    grade: 6,
    code: 'MAT.6.1.5',
    name: 'Tam sayılarla konum ve sıcaklık farkı analizi',
    make: n => {
      const seaSub = -(12 + 2 * n);
      const mountain = 25 + 3 * n;
      const diff = mountain - seaSub;
      return numSeed(
        `Bir araştırma drone’u deniz seviyesinin ${Math.abs(seaSub)} m altından (${seaSub} m) havalanıp deniz seviyesinin ${mountain} m üzerindeki (+${mountain} m) gözlem kulesine çıkıyor. Drone toplam dikey olarak kaç metre yükselmiştir?`,
        diff,
        [mountain + seaSub, mountain, Math.abs(seaSub)],
        `Konum farkı = Son konum − İlk konum = ${mountain} − (${seaSub}) = ${mountain} + ${Math.abs(seaSub)} = ${diff} m.`,
        'kolay',
      );
    },
  },
  {
    grade: 6,
    code: 'MAT.6.1.7',
    name: 'Kesir, ondalık ve yüzdeyle çok adımlı bütçe analizi',
    make: n => {
      const total = 40 * (4 + n);
      const pct25 = total * 0.25;
      const afterFirst = total - pct25;
      const fifth = afterFirst / 5;
      const left = afterFirst - fifth;
      return numSeed(
        `Bir yardım konserinin ${total} biletinin ilk gün %25’i, ikinci gün kalan biletlerin 1/5’i satılıyor. Geriye satılmayan kaç bilet kalır?`,
        left,
        [total * 0.55, pct25 + fifth, left - 8],
        `İlk gün %25’i (${pct25} bilet) satılır, ${afterFirst} bilet kalır. İkinci gün kalanın 1/5’i (${fifth} bilet) satılır. Kalan: ${afterFirst} − ${fifth} = ${left}.`,
        'orta',
      );
    },
  },
  {
    grade: 6,
    code: 'MAT.6.1.8',
    name: 'Oran ve birim fiyat karşılaştırma optimizasyonu',
    make: n => {
      const packA_qty = 4;
      const packA_price = 60 + 4 * n;
      const packB_qty = 6;
      const packB_price = 84 + 6 * n;
      const unitA = packA_price / packA_qty;
      const unitB = packB_price / packB_qty;
      const diffPer12 = 12 * (unitA - unitB);
      return numSeed(
        `A marka meyve suyunun ${packA_qty}’lü paketi ${packA_price} TL, B marka meyve suyunun ${packB_qty}’lı paketi ${packB_price} TL’dir. 12 kutu meyve suyu alacak biri daha ekonomik olan markayı seçerse diğerine göre kaç TL tasarruf eder?`,
        Math.abs(diffPer12),
        [Math.abs(unitA - unitB), Math.abs(packB_price - packA_price), Math.abs(diffPer12) + 6],
        `A’nın birim fiyatı ${packA_price} ÷ ${packA_qty} = ${unitA} TL, B’nin birim fiyatı ${packB_price} ÷ ${packB_qty} = ${unitB} TL’dir. 12 kutudaki fark 12 × |${unitA} − ${unitB}| = ${Math.abs(diffPer12)} TL.`,
        'orta',
      );
    },
  },
  {
    grade: 6,
    code: 'MAT.6.2.1',
    name: 'Cebirsel ifadeleri kurma ve değer hesaplama',
    make: n => {
      const coeff = 4 + (n % 4);
      const constant = 15 + 2 * n;
      const x = 6 + (n % 5);
      const val = coeff * x + constant;
      return numSeed(
        `Bir spor salonu üyeliğinde aylık sabit ücret ${constant} TL ve her antrenman seansı için ${coeff} TL alınmaktadır. Ayda x seansa katılan bir üyenin ödeyeceği tutarı veren cebirsel ifade kullanıldığında x = ${x} için toplam ödeme kaç TL olur?`,
        val,
        [coeff * x - constant, (coeff + constant) * x, val + coeff],
        `Cebirsel ifade ${coeff}x + ${constant} şeklindedir. x = ${x} yazılırsa ${coeff} × ${x} + ${constant} = ${coeff * x} + ${constant} = ${val} TL olur.`,
        'kolay',
      );
    },
  },
  {
    grade: 6,
    code: 'MAT.6.4.2',
    name: 'Dikdörtgenden üçgen ve parça alan bağıntısına ulaşma',
    make: n => {
      const w = 12 + 2 * n;
      const h = 6 + (n % 4) * 2;
      const triArea = (w * h) / 2;
      return numSeed(
        `Şekildeki dikdörtgen karton köşegeni boyunca kesilerek iki eş üçgene ayrılıyor. Oluşan üçgenlerden yalnızca birinin alanı kaç santimetrekaredir?`,
        triArea,
        [w * h, w + h, triArea + w],
        `Köşegen dikdörtgeni eş alanlı iki dik üçgene ayırır. Bir üçgenin alanı = (${w} × ${h}) ÷ 2 = ${triArea} cm².`,
        'orta',
        { kind: 'rectangle', width: w, height: h, diagonal: true },
      );
    },
  },
  {
    grade: 6,
    code: 'MAT.6.4.4',
    name: 'Ölçekli plan ve harita uzunluğu yorumlama',
    make: n => {
      const scaleM = 20 + 5 * (n % 5); // 1 cm = scaleM metre
      const routeA = 4 + (n % 4);
      const routeB = routeA + 3;
      const diffM = (routeB - routeA) * scaleM;
      return numSeed(
        `1 cm’nin gerçekte ${scaleM} m’yi gösterdiği mahalle krokisinde parkın kuzey yolu ${routeA} cm, bisiklet yolu ise ${routeB} cm çizilmiştir. Bisiklet yolu gerçekte kuzey yolundan kaç metre daha uzundur?`,
        diffM,
        [routeB * scaleM, routeA * scaleM, (routeB - routeA) + scaleM],
        `Plan üzerindeki fark ${routeB} − ${routeA} = ${routeB - routeA} cm’dir. Gerçek fark = ${routeB - routeA} × ${scaleM} = ${diffM} m.`,
        'orta',
      );
    },
  },
  {
    grade: 6,
    code: 'MAT.6.5.2',
    name: 'Aritmetik ortalama ve açıklık analizi',
    make: n => {
      const targetAvg = 18 + n;
      const v1 = targetAvg - 4;
      const v2 = targetAvg + 2;
      const v3 = targetAvg - 1;
      const v4 = 4 * targetAvg - (v1 + v2 + v3);
      return numSeed(
        `Bir basketbolcu ilk üç maçında sırasıyla ${v1}, ${v2} ve ${v3} sayı atmıştır. Dört maç sonundaki sayı ortalamasının ${targetAvg} olması için dördüncü maçta kaç sayı atmalıdır?`,
        v4,
        [targetAvg, Math.round((v1 + v2 + v3) / 3), v4 + 4],
        `4 maçta ortalamanın ${targetAvg} olması için toplam sayı 4 × ${targetAvg} = ${4 * targetAvg} olmalıdır. İlk üç maç toplamı ${v1 + v2 + v3} olduğundan 4. maçta ${4 * targetAvg} − ${v1 + v2 + v3} = ${v4} sayı atmalıdır.`,
        'zor',
      );
    },
  },

  // ===================== 7. SINIF (8 MEB KAZANIM AİLESİ) =====================
  {
    grade: 7,
    code: 'MAT.7.1.4',
    name: 'Rasyonel sayılarla çok adımlı gerçek yaşam problemleri',
    make: n => {
      const start = -(5 + n);
      const step = 1.5;
      const steps = 4; // 2 saat = 4 yarım saat
      const result = start + steps * step;
      return numSeed(
        `Soğuk hava deposunda sıcaklık ${start} °C iken elektrik kesintisi nedeniyle sıcaklık her yarım saatte 1,5 °C artmaktadır. Kesintiden 2 saat sonra deponun sıcaklığı kaç °C olur?`,
        result,
        [start + 2 * step, result - 3, Math.abs(result) + 2],
        `2 saatte 4 adet yarım saat vardır. Toplam artış = 4 × 1,5 = 6 °C. Son sıcaklık = ${start} + 6 = ${result} °C.`,
        'kolay',
      );
    },
  },
  {
    grade: 7,
    code: 'MAT.7.1.6',
    name: 'Yüzde artış-azalış ve ardışık indirim muhakemesi',
    make: n => {
      const base = 200 * (2 + (n % 4)); // 400, 600, 800...
      const afterUp = base * 1.25;
      const finalPrice = afterUp * 0.8;
      return numSeed(
        `Etiket fiyatı ${base} TL olan bir ürüne sezon başında %25 zam yapılıyor. Sezon sonunda ise zamlı fiyat üzerinden %20 indirim uygulanıyor. Ürünün son satış fiyatı kaç TL olur?`,
        finalPrice,
        [base * 1.05, base * 0.95, afterUp],
        `%25 zamlı fiyat ${base} × 1,25 = ${afterUp} TL olur. %20 indirimle ${afterUp} × 0,80 = ${finalPrice} TL bulunur.`,
        'zor',
      );
    },
  },
  {
    grade: 7,
    code: 'MAT.7.1.7',
    name: 'Doğru ve ters orantıyla karşılaştırma problemleri',
    make: n => {
      const workers1 = 6;
      const days1 = 12 + 2 * (n % 4);
      const workers2 = 4;
      const days2 = (workers1 * days1) / workers2;
      return numSeed(
        `Aynı kapasitedeki ${workers1} işçi bir okulun boyama işini ${days1} günde bitirebilmektedir. İşçilerden 2’si ayrılırsa kalan ${workers2} işçi aynı işi kaç günde bitirir?`,
        days2,
        [Math.round((workers2 * days1) / workers1), days1 + 2, days2 + 4],
        `İşçi sayısı ile süre ters orantılıdır. ${workers1} × ${days1} = ${workers2} × gün => ${workers1 * days1} ÷ ${workers2} = ${days2} gün.`,
        'orta',
      );
    },
  },
  {
    grade: 7,
    code: 'MAT.7.2.2',
    name: 'Birinci dereceden denklem kurma ve tarife kıyaslama',
    make: n => {
      const fixedA = 40 + 5 * n;
      const perA = 8;
      const fixedB = fixedA - 24;
      const perB = 12;
      const eqSessions = (fixedA - fixedB) / (perB - perA); // 24 / 4 = 6
      return numSeed(
        `A spor salonu ${fixedA} TL kayıt ücreti ve ders başına ${perA} TL; B spor salonu ${fixedB} TL kayıt ücreti ve ders başına ${perB} TL almaktadır. Bir öğrenci kaç ders aldığında iki salona ödeyeceği toplam ücret eşit olur?`,
        eqSessions,
        [eqSessions + 2, eqSessions - 2, 10],
        `Eşitlik: ${fixedA} + ${perA}x = ${fixedB} + ${perB}x => ${fixedA - fixedB} = ${perB - perA}x => x = ${eqSessions} ders.`,
        'zor',
      );
    },
  },
  {
    grade: 7,
    code: 'MAT.7.3.1',
    name: 'Çokgenler ve açılarla muhakeme',
    make: n => {
      const sides = [5, 6, 8, 9, 10, 12][n % 6];
      const extAngle = 360 / sides;
      const intAngle = 180 - extAngle;
      return numSeed(
        `Bir mimar düzgün ${sides}gen biçiminde bir avlu tasarlıyor. Bu düzgün çokgenin bir iç açısının ölçüsü bir dış açısının ölçüsünden kaç derece fazladır?`,
        intAngle - extAngle,
        [intAngle, extAngle, 180 - 2 * extAngle + 15],
        `Dış açı = 360° ÷ ${sides} = ${extAngle}°. İç açı = 180° − ${extAngle}° = ${intAngle}°. Fark = ${intAngle} − ${extAngle} = ${intAngle - extAngle}°.`,
        'orta',
      );
    },
  },
  {
    grade: 7,
    code: 'MAT.7.3.3',
    name: 'Çember çevresi ve dönme sayısı modellemesi',
    make: n => {
      const r = 20 + 5 * (n % 5); // cm
      const tours = 15 + n;
      const circCm = 2 * 3 * r;
      const distM = (circCm * tours) / 100;
      return numSeed(
        `Yarıçapı ${r} cm olan bir bisiklet tekerleği düz bir yolda kaymadan tam ${tours} tur dönüyor. π = 3 alınırsa bisiklet kaç metre yol almıştır?`,
        distM,
        [distM * 2, distM / 2, circCm],
        `Bir turda aldığı yol çevre kadardır: 2 × 3 × ${r} = ${circCm} cm = ${fmt(circCm / 100)} m. ${tours} turda ${fmt(circCm / 100)} × ${tours} = ${fmt(distM)} m yol alır.`,
        'orta',
      );
    },
  },
  {
    grade: 7,
    code: 'MAT.7.4.6',
    name: 'Prizma hacmi ve dolum kapasitesi yorumlama',
    make: n => {
      const w = 10 + n;
      const h = 5 + (n % 4);
      const depth = 8;
      const vol = w * h * depth;
      return numSeed(
        `Şekildeki dikdörtgen tabanlı akvaryumun yüksekliği ${depth} cm’dir. Akvaryumun yarısı su ile doluyken içinde kaç santimetreküp su bulunur?`,
        vol / 2,
        [vol, w * h, (w + h) * depth],
        `Taban alanı ${w} × ${h} = ${w * h} cm². Tam hacim ${w * h} × ${depth} = ${vol} cm³. Yarısı ${vol / 2} cm³ olur.`,
        'kolay',
        { kind: 'rectangle', width: w, height: h },
      );
    },
  },
  {
    grade: 7,
    code: 'MAT.7.5.1',
    name: 'Veri analizi: sütun grafiği ve ortalama değişimi',
    make: n => {
      const vals = [15 + n, 25 + n, 20 + n, 40 + n];
      const sum = vals.reduce((a, b) => a + b, 0);
      const avg = sum / 4;
      const max = Math.max(...vals);
      const min = Math.min(...vals);
      return numSeed(
        `Grafikte dört öğrencinin bir ayda okuduğu kitap sayfa sayıları (onluk ölçekte) verilmiştir. Bu veri grubunun aritmetik ortalaması ile açıklığı arasındaki fark kaçtır?`,
        Math.abs(avg - (max - min)),
        [avg, max - min, avg + (max - min)],
        `Ortalama = (${vals.join(' + ')}) ÷ 4 = ${fmt(avg)}. Açıklık = ${max} − ${min} = ${max - min}. Fark = ${fmt(Math.abs(avg - (max - min)))}.`,
        'zor',
        { kind: 'bars', values: vals, labels: ['Ece', 'Mert', 'Ada', 'Can'], title: 'Okunan Sayfa Puanı' },
      );
    },
  },

  // ===================== 8. SINIF LGS (8 MEB KAZANIM AİLESİ) =====================
  {
    grade: 8,
    code: 'M.8.1.1.2',
    name: 'EBOB - EKOK ile gerçek yaşam optimizasyonu',
    make: n => {
      const pairs: [number, number][] = [[18, 24], [20, 30], [15, 25], [24, 36], [16, 24], [12, 18]];
      const [a, b] = pairs[n % pairs.length];
      const g = gcd(a, b);
      const count = a / g + b / g;
      return numSeed(
        `İki rulo şeridin uzunlukları ${a} m ve ${b} m’dir. Hiç parça artmayacak ve her iki rulodan eşit uzunlukta en büyük boyda parçalar elde edilecek şekilde kesim yapılırsa toplam en az kaç parça elde edilir?`,
        count,
        [g, count + 2, (a + b) / 2],
        `Parça uzunluğu EBOB(${a}, ${b}) = ${g} m olmalıdır. Parça sayısı = (${a} ÷ ${g}) + (${b} ÷ ${g}) = ${a / g} + ${b / g} = ${count}.`,
        'orta',
      );
    },
  },
  {
    grade: 8,
    code: 'M.8.1.2.2',
    name: 'Üslü ifadelerde bölme/çarpma ve kapasite analizi',
    make: n => {
      const x = (n % 4) + 3;
      const y = 4 + (n % 5);
      const z = 2;
      const ans = x + y - z;
      return numSeed(
        `Bir veri merkezinde 2^${x} adet sunucu ve her sunucuda 2^${y} MB kapasiteli diskler vardır. Toplam kapasite her biri 2^${z} MB olan yedekleme bloklarına bölünürse elde edilen blok sayısı 2^k şeklinde yazıldığında k kaç olur?`,
        ans,
        [x + y + z, x * y - z, ans - 1],
        `Toplam kapasite = 2^${x} × 2^${y} = 2^${x + y} MB. 2^${z}’ye bölününce üsler çıkarılır: ${x + y} − ${z} = ${ans}.`,
        'orta',
      );
    },
  },
  {
    grade: 8,
    code: 'M.8.1.3.3',
    name: 'Kareköklü ifadelerde tam kare yaklaşımı ve aralık tahmini',
    make: n => {
      const k = 5 + (n % 7); // k^2 between 25 and 121
      const inside = k * k + 3 + (n % 5);
      return numSeed(
        `Bir bahçıvan √${inside} metre uzunluğundaki hortumu metre cinsinden hangi iki ardışık tam sayı arasında seçmelidir? Bu iki tam sayının toplamı kaçtır?`,
        2 * k + 1,
        [2 * k - 1, 2 * k + 3, k],
        `${k}² = ${k * k} ve ${k + 1}² = ${(k + 1) ** 2} olduğundan √${inside} sayısı ${k} ile ${k + 1} arasındadır. İki tam sayının toplamı ${k} + ${k + 1} = ${2 * k + 1}.`,
        'orta',
      );
    },
  },
  {
    grade: 8,
    code: 'M.8.2.1.3',
    name: 'Cebirsel ifadeler, özdeşlikler ve alan modellemesi',
    make: n => {
      const a = 12 + n;
      const b = 4 + (n % 4);
      const diffArea = a * a - b * b;
      return numSeed(
        `Bir kenarı ${a} cm olan kare biçimindeki levhadan bir kenarı ${b} cm olan kare biçiminde bir parça kesilip çıkarılıyor. Kalan bölgenin alanını (a² − b²) = (a − b)(a + b) özdeşliğiyle hesaplarsak sonuç kaç santimetrekaredir?`,
        diffArea,
        [(a - b) ** 2, a * a + b * b, (a - b) * a],
        `${a}² − ${b}² = (${a} − ${b})(${a} + ${b}) = ${a - b} × ${a + b} = ${diffArea} cm².`,
        'zor',
        { kind: 'rectSplit', width: a, height: a, cutWidth: b, cutHeight: b, labels: [`${b}×${b}`, 'Kalan'] },
      );
    },
  },
  {
    grade: 8,
    code: 'M.8.2.2.2',
    name: 'Doğrusal ilişkiler ve rampa eğimi yorumlama',
    make: n => {
      const init = 180 + 20 * n;
      const rate = 6 + (n % 4);
      const target = 42 + 6 * (n % 3);
      const mins = Math.floor((init - target) / rate);
      const exactInit = target + rate * mins;
      return numSeed(
        `Başlangıçta ${exactInit} litre su bulunan bir sulama tankından her dakika sabit ${rate} litre su akmaktadır. Tankta ${target} litre su kalması için musluk kaç dakika açık kalmalıdır?`,
        mins,
        [mins + 3, Math.max(1, mins - 3), Math.round(exactInit / rate)],
        `Doğrusal denklem: ${exactInit} − ${rate}t = ${target} => ${rate}t = ${exactInit - target} => t = ${mins} dakika.`,
        'orta',
      );
    },
  },
  {
    grade: 8,
    code: 'M.8.2.3.1',
    name: 'Eşitsizliklerle gerçek hayat sınır ve bütçe analizi',
    make: n => {
      const budget = 150 + 10 * n;
      const fixed = 35 + 5 * (n % 3);
      const perUnit = 12 + (n % 5);
      const maxItems = Math.floor((budget - fixed) / perUnit);
      return numSeed(
        `Bir öğrenci kulübü afiş baskısı için en fazla ${budget} TL harcayabilecektir. Matbaa ${fixed} TL sabit tasarım ücreti ve basılan her afiş için ${perUnit} TL istemektedir. Bu bütçeyle en fazla kaç adet afiş bastırılabilir?`,
        maxItems,
        [maxItems + 1, Math.max(1, maxItems - 1), Math.floor(budget / perUnit)],
        `${fixed} + ${perUnit}x ≤ ${budget} => ${perUnit}x ≤ ${budget - fixed} => x ≤ ${fmt((budget - fixed) / perUnit)}. En büyük tam sayı ${maxItems}’tir.`,
        'zor',
      );
    },
  },
  {
    grade: 8,
    code: 'M.8.3.1.5',
    name: 'Pisagor bağıntısı ve dik üçgen modellemesi',
    make: n => {
      const triples: [number, number, number][] = [[6, 8, 10], [9, 12, 15], [5, 12, 13], [8, 15, 17], [12, 16, 20], [7, 24, 25]];
      const [h, w, hyp] = triples[n % triples.length];
      return numSeed(
        `Şekildeki dik üçgen biçimli çelik desteğin dik kenarları ${w} cm ve ${h} cm’dir. “?” ile gösterilen eğimli destek çubuğunun uzunluğu kaç santimetredir?`,
        hyp,
        [w + h, Math.abs(w - h) + hyp - 2, hyp + 2],
        `Pisagor bağıntısından c² = ${w}² + ${h}² = ${w * w + h * h} => c = √${w * w + h * h} = ${hyp} cm.`,
        'kolay',
        { kind: 'triangle', width: w, height: h },
      );
    },
  },
  {
    grade: 8,
    code: 'M.8.5.1.5',
    name: 'Basit olayların olasılığı ve durum uzayı analizi',
    make: n => {
      const red = 4 + (n % 4);
      const blue = 5 + (n % 3);
      const yellow = 3 + (n % 5);
      const total = red + blue + yellow;
      const notYellow = red + blue;
      const ans = frac(notYellow, total);
      const d1 = frac(yellow, total);
      const d2 = frac(red, total);
      const d3 = `${notYellow}/${total + 1}`;
      const distractors = [d1, d2, d3].filter(x => x !== ans);
      while (distractors.length < 3) {
        distractors.push(`${Math.max(1, notYellow - distractors.length)}/${total + 2}`);
      }
      return {
        q: `Bir torbada özdeş ${red} kırmızı, ${blue} mavi ve ${yellow} sarı top vardır. Rastgele çekilen bir topun sarı OLMAMA olasılığı nedir? (Sade kesir olarak yaz)`,
        a: ans,
        distractors: [distractors[0], distractors[1], distractors[2]],
        explanation: `Toplam top = ${red} + ${blue} + ${yellow} = ${total}. Sarı olmayan toplar ${red} + ${blue} = ${notYellow} tanedir. Olasılık = ${notYellow}/${total} = ${ans}.`,
        difficulty: 'orta',
      };
    },
  },
];

export const mathOutcomeQuestions: Question[] = families.flatMap(({ grade, code, name, make }) =>
  Array.from({ length: 12 }, (_, n) => {
    const seed = make(n);
    return {
      ...seed,
      grade,
      course: 'mathematics' as const,
      outcome: name,
      outcomeCode: code,
      subject: name,
      category: 'context' as const,
      skillBased: true,
      family: code,
    };
  }),
);
