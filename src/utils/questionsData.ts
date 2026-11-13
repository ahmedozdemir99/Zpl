import { contextQuestions } from './contextQuestions';
import { mathOutcomeQuestions } from './mathOutcomes';
import { sourceQuestions } from './sourceQuestions';
import { Question } from '../types';

export const initialMatchQuestions: Question[] = [
  // 5. SINIF
  { grade: 5, difficulty: 'kolay', subject: 'Ondalık Gösterim • Günlük yaşam', q: 'Okul kantininde bir tost 24,50 TL, ayran 8,50 TL. İkisini alan öğrenci kaç TL öder?', a: '33', explanation: '24,50 + 8,50 = 33,00 TL.' },
  { grade: 5, difficulty: 'kolay', subject: 'Doğal Sayılar • Zaman', q: 'Bir okul gezisi için 6 otobüsün her birine 38 öğrenci biniyor. Toplam kaç öğrenci taşınır?', a: '228', explanation: '6 × 38 = 228 öğrenci.' },
  { grade: 5, difficulty: 'kolay', subject: 'Geometri • Çevre', q: 'Kare biçimindeki bir bahçenin bir kenarı 9 metredir. Bahçenin çevresine bir tur tel çekmek için kaç metre tel gerekir?', a: '36', explanation: 'Kare çevre = 4 × 9 = 36 m.' },
  { grade: 5, difficulty: 'orta', subject: 'Kesirler • Tarif', q: 'Bir tarifte 3 kişiye 3/4 litre süt kullanılıyor. Aynı tarif 6 kişi için hazırlanırsa kaç litre süt gerekir?', a: '1,5', explanation: 'Kişi sayısı 2 katına çıktığından süt 3/4 × 2 = 6/4 = 1,5 litre olur.' },
  { grade: 5, difficulty: 'orta', subject: 'Veri yorumlama • Alışveriş', q: 'Bir kırtasiyede defter 18 TL, kalem 7 TL\'dir. 2 defter ve 3 kalem alan biri 100 TL verirse kaç TL para üstü alır?', a: '43', explanation: 'Toplam Harcama = (2 × 18) + (3 × 7) = 36 + 21 = 57 TL. Para Üstü = 100 - 57 = 43 TL.' },
  { grade: 5, difficulty: 'orta', subject: 'Alan • Planlama', q: 'Dikdörtgen bir oyun alanı 12 m uzunluğunda, 7 m genişliğindedir. Alanın 20 m²\'sine kauçuk döşenirse açıkta kaç m² kalır?', a: '64', explanation: 'Toplam Alan = 12 × 7 = 84 m². Kalan = 84 - 20 = 64 m².' },
  { grade: 5, difficulty: 'zor', subject: 'Çok adımlı problem • Ulaşım', q: 'Bir gezi otobüsü 240 km yolun önce 3/8\'ini, sonra 60 km\'sini gidiyor. Gidilecek kaç kilometre kalır?', a: '90', explanation: '240 × 3/8 = 90 km. Toplam gidilen = 90 + 60 = 150 km. Kalan = 240 - 150 = 90 km.' },
  { grade: 5, difficulty: 'zor', subject: 'Örüntü • Tasarım', q: 'Bir duvar süslemesinde 1. sıraya 4, 2. sıraya 7, 3. sıraya 10 üçgen konuyor. Kural aynıysa 8. sırada kaç üçgen olur?', a: '25', explanation: 'Artış miktarı 3\'tür. n. terim = 3n + 1. 8. terim = 3(8) + 1 = 25.' },
  { grade: 5, difficulty: 'zor', subject: 'Kesir ve karşılaştırma • Gıda israfı', q: 'Bir pastanın sabah 2/5\'i, öğleden sonra kalanının 1/3\'ü yeniyor. Pastanın tamamının hangi kesri kalır? Cevabı sade kesir olarak yaz.', a: '2/5', explanation: 'Kalan = 1 - 2/5 = 3/5. Öğleden sonra yenilen = 3/5 × 1/3 = 1/5. Son Kalan = 3/5 - 1/5 = 2/5.' },
  { grade: 5, difficulty: 'zor', subject: 'Geometri • Görsel model', q: 'Çevresi 40 metre olan bir dikdörtgen bahçenin uzun kenarı 14 metredir. Kısa kenarı kaç metredir?', a: '6', explanation: 'Çevre = 2 × (Uzun + Kısa) => 40 = 2 × (14 + Kısa) => 20 = 14 + Kısa => Kısa = 6 m.' },

  // 6. SINIF
  { grade: 6, difficulty: 'kolay', subject: 'Oran • Tarif', q: 'Bir içecek için 2 ölçü şuruba 5 ölçü su ekleniyor. 10 ölçü su kullanılırsa kaç ölçü şurup gerekir?', a: '4', explanation: 'Oran 2/5\'tir. 10 su 5×2 olduğundan şurup da 2×2 = 4 olur.' },
  { grade: 6, difficulty: 'kolay', subject: 'Tam sayılar • Sıcaklık', q: 'Sabah hava −3 °C, öğlen 8 °C ölçülüyor. Sıcaklık kaç derece artmıştır?', a: '11', explanation: 'Fark = 8 - (-3) = 11 °C.' },
  { grade: 6, difficulty: 'kolay', subject: 'Alan • Ev yaşamı', q: '4 m uzunluğunda ve 3 m genişliğindeki bir odanın taban alanı kaç metrekaredir?', a: '12', explanation: 'Alan = 4 × 3 = 12 m².' },
  { grade: 6, difficulty: 'orta', subject: 'Ondalık gösterim • Yakıt', q: 'Bir araç 100 km\'de 6,4 litre yakıt tüketiyor. 250 km\'lik yolda aynı tüketimle kaç litre yakıt harcar?', a: '16', explanation: '2.5 × 6,4 = 16 litre.' },
  { grade: 6, difficulty: 'orta', subject: 'Veri yorumlama • Okuma', q: 'Dört öğrencinin bir haftada okuduğu sayfa sayıları 24, 31, 29 ve 36\'dır. Bu öğrencilerin okuduğu ortalama sayfa sayısı kaçtır?', a: '30', explanation: 'Toplam = 24 + 31 + 29 + 36 = 120. Ortalama = 120 / 4 = 30.' },
  { grade: 6, difficulty: 'orta', subject: 'Cebir • Bütçe', q: 'Bir müze giriş bileti yetişkinler için 45 TL, öğrenciler için 25 TL. 2 yetişkin ve 4 öğrenci toplam kaç TL öder?', a: '190', explanation: '(2 × 45) + (4 × 25) = 90 + 100 = 190 TL.' },
  { grade: 6, difficulty: 'zor', subject: 'Oran ve çok adımlı problem', q: 'Bir okulda kız öğrencilerin erkek öğrencilere oranı 4:5, toplam öğrenci sayısı 270\'tir. Erkek öğrenci sayısı kaçtır?', a: '150', explanation: 'Toplam kat = 4 + 5 = 9 kat. 1 kat = 270 / 9 = 30. Erkekler = 5 × 30 = 150.' },
  { grade: 6, difficulty: 'zor', subject: 'Kesirler • Su tasarrufu', q: 'Bir depo doluyken suyun önce 1/4\'ü, sonra kalan suyun 1/3\'ü kullanılıyor. Depoda başlangıçtaki suyun hangi kesri kalır? Sade kesir yaz.', a: '1/2', explanation: 'Kalan = 3/4. 3/4 × (1 - 1/3) = 3/4 × 2/3 = 2/4 = 1/2.' },
  { grade: 6, difficulty: 'zor', subject: 'Geometri • Ölçekli plan', q: 'Bir parkın planda 8 cm görünen yolu gerçekte 200 m\'dir. Aynı ölçekte 5,5 cm görünen başka bir yol gerçekte kaç metredir?', a: '137,5', explanation: '1 cm = 200 / 8 = 25 m. 5,5 cm = 5,5 × 25 = 137,5 m.' },
  { grade: 6, difficulty: 'zor', subject: 'Veri ve çıkarım • Grafikler', q: 'Üç günde sırasıyla 15, 20 ve 10 sayfa okuyan öğrenci, 4. gün ilk 3 günün ortalaması kadar okursa 4 günde toplam kaç sayfa okur?', a: '60', explanation: '3 günün toplamı = 45. Ortalama = 15. 4 günde toplam = 45 + 15 = 60 sayfa.' },

  // 7. SINIF
  { grade: 7, difficulty: 'kolay', subject: 'Yüzdeler • İndirim', q: 'Etiketi 400 TL olan bir çantaya %15 indirim uygulanıyor. İndirimli fiyat kaç TL\'dir?', a: '340', explanation: 'İndirim = 400 × 0,15 = 60 TL. Satış fiyatı = 400 - 60 = 340 TL.' },
  { grade: 7, difficulty: 'kolay', subject: 'Rasyonel sayılar • Günlük yaşam', q: 'Bir yürüyüşçü sabah 1,2 km, akşam 0,85 km yürüyor. Toplam kaç kilometre yürür?', a: '2,05', explanation: '1,20 + 0,85 = 2,05 km.' },
  { grade: 7, difficulty: 'kolay', subject: 'Doğrular ve açılar', q: 'Bir kavşakta komşu bütünler açılardan biri 68° ise diğeri kaç derecedir?', a: '112', explanation: 'Bütünler açılar toplamı 180°dir. 180 - 68 = 112°.' },
  { grade: 7, difficulty: 'orta', subject: 'Orantı • Üretim', q: '4 makine 3 saatte 240 parça üretiyor. Aynı hızla çalışan 6 makine 3 saatte kaç parça üretir?', a: '360', explanation: '1 makine 3 saatte = 240 / 4 = 60 parça. 6 makine = 6 × 60 = 360 parça.' },
  { grade: 7, difficulty: 'orta', subject: 'Cebir • Telefon paketi', q: 'Bir telefon paketinde 80 TL sabit ücret ve kullanılan her GB için 12 TL ücret var. Fatura 164 TL ise kaç GB kullanılmıştır?', a: '7', explanation: '80 + 12x = 164 => 12x = 84 => x = 7 GB.' },
  { grade: 7, difficulty: 'orta', subject: 'Çember • Tasarım', q: 'Yarıçapı 7 cm olan bir çemberin çevresini π=22/7 alarak hesaplayınız. Sonuç kaç cm\'dir?', a: '44', explanation: 'Çevre = 2 × π × r = 2 × (22/7) × 7 = 44 cm.' },
  { grade: 7, difficulty: 'zor', subject: 'Yüzde değişimi • Alışveriş', q: 'Bir ürünün fiyatı önce %20 artırılıp sonra yeni fiyat üzerinden %20 indirilirse başlangıç fiyatı 500 TL olan ürün kaç TL olur?', a: '480', explanation: '500 × 1,20 = 600 TL. 600 × 0,80 = 480 TL.' },
  { grade: 7, difficulty: 'zor', subject: 'Cebirsel düşünme • Taksi', q: 'Bir taksi açılışta 25 TL, her kilometre için 14 TL alıyor. 165 TL ödeyen yolcu kaç kilometre gitmiştir?', a: '10', explanation: '25 + 14x = 165 => 14x = 140 => x = 10 km.' },
  { grade: 7, difficulty: 'zor', subject: 'Alan • Planlama', q: 'Dikdörtgen bir arsanın uzun kenarı kısa kenarının 2 katından 3 m fazladır. Kısa kenar 9 m ise arsanın alanı kaç m²\'dir?', a: '189', explanation: 'Kısa = 9. Uzun = 2(9) + 3 = 21 m. Alan = 9 × 21 = 189 m².' },
  { grade: 7, difficulty: 'zor', subject: 'Olasılık • Oyun', q: 'Bir kutuda 4 kırmızı, 3 mavi ve 5 sarı kart vardır. Rastgele seçilen kartın sarı olmama olasılığı nedir? Sade kesir yaz.', a: '7/12', explanation: 'Sarı olmayan kart sayısı = 4 + 3 = 7. Toplam kart = 12. Olasılık = 7/12.' },

  // 8. SINIF
  { grade: 8, difficulty: 'kolay', subject: 'Üslü ifadeler • Dijital veri', q: 'Bir dosya 2⁵ MB büyüklüğündedir. Bu dosya kaç MB\'tır?', a: '32', explanation: '2⁵ = 32 MB.' },
  { grade: 8, difficulty: 'kolay', subject: 'Kareköklü ifadeler • Alan', q: 'Alanı 196 m² olan kare biçimindeki bir meydanın bir kenarı kaç metredir?', a: '14', explanation: '√196 = 14 m.' },
  { grade: 8, difficulty: 'kolay', subject: 'Doğrusal denklem • Bütçe', q: 'Aynı fiyatlı 3 bilet ve 20 TL hizmet bedeli toplam 170 TL tutuyor. Bir bilet kaç TL\'dir?', a: '50', explanation: '3x + 20 = 170 => 3x = 150 => x = 50 TL.' },
  { grade: 8, difficulty: 'orta', subject: 'Eğim • Rampa', q: 'Bir rampada yatay ilerleme 12 m, yükseklik artışı 3 m\'dir. Eğim (yükseklik/yatay) kaçtır? Sade kesir yaz.', a: '1/4', explanation: 'Eğim = 3 / 12 = 1/4.' },
  { grade: 8, difficulty: 'orta', subject: 'Olasılık • Üretim', q: 'Bir fabrikadaki ürünlerin %4\'ü kusurludur. Rastgele seçilen 250 üründe beklenen kusurlu ürün sayısı kaçtır?', a: '10', explanation: '250 × 0,04 = 10 kusurlu ürün.' },
  { grade: 8, difficulty: 'orta', subject: 'Eşitsizlik • Yaş sınırı', q: 'Bir etkinliğe katılmak için yaşın en az 12, 18\'den küçük olması gerekiyor. Kaç farklı tam sayı yaş uygundur?', a: '6', explanation: '12, 13, 14, 15, 16, 17 yaşları uygundur (6 farklı değer).' },
  { grade: 8, difficulty: 'zor', subject: 'Doğrusal ilişki • Su deposu', q: 'Bir depoda başlangıçta 180 litre su vardır. Her dakika sabit 6 litre su boşalıyor. Depoda 42 litre su kalması kaç dakika sürer?', a: '23', explanation: '180 - 6t = 42 => 6t = 138 => t = 23 dakika.' },
  { grade: 8, difficulty: 'zor', subject: 'Pisagor • Erişilebilirlik', q: 'Bir bina girişine yapılan rampanın yatay uzunluğu 15 m, yüksekliği 8 m\'dir. Rampanın eğimli uzunluğu kaç metredir?', a: '17', explanation: '8² + 15² = 64 + 225 = 289. √289 = 17 m (8-15-17 özel üçgeni).' },
  { grade: 8, difficulty: 'zor', subject: 'Çok adımlı yüzde problemi', q: 'Bir ürün %20 indirimle 720 TL\'ye satılıyor. İndirimden önceki fiyatı kaç TL\'dir?', a: '900', explanation: '%80\'i 720 TL ise %100\'ü (720 / 0.80) = 900 TL.' },
  { grade: 8, difficulty: 'zor', subject: 'Veri yorumlama • Satış grafiği', q: '1. mağaza 2 haftada sırasıyla 30 ve 35 satış yapıyor. 2. mağaza ise 40 ve 45 satış yapıyor. 2. mağaza toplam kaç adet fazla satış yapmıştır?', a: '20', explanation: '1. Mağaza Toplam = 65. 2. Mağaza Toplam = 85. Fark = 85 - 65 = 20.' },
];

function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : Math.abs(a);
}

function simpleFraction(num: number, den: number): string {
  const g = gcd(Math.round(num), Math.round(den)) || 1;
  return `${Math.round(num / g)}/${Math.round(den / g)}`;
}

export function buildSupplementaryQuestions(): Question[] {
  const out: Question[] = [];
  const patterns: Record<number, Array<(n: number) => [string, string, 'kolay' | 'orta' | 'zor', string, string]>> = {
    5: [
      (n) => {
        const notebook = 22 + n, pen = 9 + (n % 5), budget = 150;
        const spent = 3 * notebook + 4 * pen;
        return [`Kırtasiyeden tanesi ${notebook} TL olan defterden 3 tane ve tanesi ${pen} TL olan kalemden 4 tane alan öğrenci kasaya ${budget} TL verirse kaç TL para üstü alır?`, String(budget - spent), 'kolay', 'Doğal sayılar • Bütçe planlama', `Defterler 3 × ${notebook} = ${3 * notebook} TL, kalemler 4 × ${pen} = ${4 * pen} TL. Toplam ${spent} TL harcanır, para üstü ${budget - spent} TL olur.`];
      },
      (n) => {
        const students = 42 + 3 * n, teachers = 4 + (n % 3), seats = 14 + (n % 4);
        const total = students + teachers;
        return [`Okul gezisine ${students} öğrenci ve ${teachers} öğretmen katılıyor. Her minibüs en fazla ${seats} yolcu alabildiğine göre herkesin oturabilmesi için en az kaç minibüs gerekir?`, String(Math.ceil(total / seats)), 'kolay', 'Doğal sayılar • Ulaşım optimizasyonu', `Toplam ${total} yolcu var. ${total} ÷ ${seats} bölümünde artan yolcular için ek bir araç gerekir; en az ${Math.ceil(total / seats)} minibüs gerekir.`];
      },
      (n) => {
        const side = 6 + (n % 9);
        return [`Kare biçimindeki bir panonun çevresine 3 sıra renkli şerit çekilecektir. Panonun bir kenarı ${side} cm olduğuna göre en az kaç cm şerit gerekir?`, String(12 * side), 'kolay', 'Geometri • Çevre modelleme', `Bir tur çevre 4 × ${side} = ${4 * side} cm. 3 sıra için 3 × ${4 * side} = ${12 * side} cm şerit gerekir.`];
      },
      (n) => {
        const cap = 24 * (2 + (n % 4));
        const used1 = cap / 3;
        const used2 = (cap - used1) / 2;
        return [`${cap} litrelik bir yağmur suyu deposunun önce 1/3’ü bahçe sulamada, ardından kalan suyun yarısı temizlikte kullanılıyor. Depoda kaç litre su kalır?`, String(cap - used1 - used2), 'orta', 'Kesirler • Su tasarrufu', `İlk kullanım ${used1} L (kalan ${cap - used1} L). İkinci kullanım kalanın yarısı ${used2} L. Son kalan ${cap - used1 - used2} L.`];
      },
      (n) => {
        const w = 10 + n, h = 6 + (n % 5), inner = 12 + (n % 8);
        return [`Kenarları ${w} m ve ${h} m olan dikdörtgen avlunun içine ${inner} m² alan kaplayan bir satranç köşesi yapılıyor. Avlunun kalan alanı kaç m²’dir?`, String(w * h - inner), 'orta', 'Alan • Avlu tasarımı', `Toplam alan ${w} × ${h} = ${w * h} m². Kalan alan ${w * h} − ${inner} = ${w * h - inner} m².`];
      },
      (n) => {
        const a = 5 + (n % 4), step = 4 + (n % 5), k = 7 + (n % 5);
        return [`Bir kütüphane rafına 1. gün ${a}, 2. gün ${a + step}, 3. gün ${a + 2 * step} kitap yerleştiriliyor. Bu örüntü aynı kuralla devam ederse ${k}. gün rafa kaç kitap yerleştirilir?`, String(a + (k - 1) * step), 'zor', 'Örüntü • Kural genelleme', `Her gün ${step} kitap artıyor. ${k}. gün = ${a} + (${k - 1} × ${step}) = ${a + (k - 1) * step} kitap.`];
      },
      (n) => {
        const b = 5 + (n % 4), a = 2 + (n % 3);
        return [`Bir su tankının önce ${a}/${b + 3}’ü, sonra kalanının yarısı kullanılıyor. Başlangıçtaki suyun hangi kesri kalır? Sade kesir yaz.`, simpleFraction(b + 3 - a, 2 * (b + 3)), 'zor', 'Kesirler • Çok adımlı çıkarım', `İlk kullanımdan sonra ${b + 3 - a}/${b + 3} kalır. Bunun yarısı (${b + 3 - a})/${2 * (b + 3)} olur.`];
      },
      (n) => {
        const perim = 36 + 4 * n, shortSide = 5 + (n % 5);
        const longSide = perim / 2 - shortSide;
        return [`Çevresi ${perim} cm olan bir dikdörtgenin kısa kenarı ${shortSide} cm olduğuna göre bu dikdörtgenin alanı kaç cm²’dir?`, String(longSide * shortSide), 'zor', 'Geometri • Çevre-alan ilişkisi', `Yarı çevre ${perim / 2} cm, uzun kenar ${perim / 2} − ${shortSide} = ${longSide} cm. Alan = ${longSide} × ${shortSide} = ${longSide * shortSide} cm².`];
      },
    ],
    6: [
      (n) => {
        const s1 = -6 - (n % 5), s2 = 9 + n;
        return [`Bir soğuk hava deposunda sabah ${s1} °C ölçülen sıcaklık, öğleye kadar eşit aralıklarla artarak ${s2} °C’ye ulaşıyor. Sıcaklık toplam kaç derece yükselmiştir?`, String(s2 - s1), 'kolay', 'Tam sayılar • Sıcaklık analizi', `Sıcaklık artışı = ${s2} − (${s1}) = ${s2 - s1} °C.`];
      },
      (n) => {
        const w = 5 + (n % 6), h = 4 + (n % 5);
        return [`Tabanı ${w} m ve ${h} m olan dikdörtgen bir salonun yarısına halı seriliyor. Halı serilmeyen alan kaç m²’dir?`, String((w * h) / 2), 'kolay', 'Alan • Modelleme', `Toplam alan ${w} × ${h} = ${w * h} m², yarısı ${(w * h) / 2} m².`];
      },
      (n) => {
        const rate = 5 + (n % 4), halfHours = 3 + (n % 3);
        const km = 100 + halfHours * 50;
        return [`Bir otomobil 100 km’de ortalama ${rate} litre yakıt tüketiyor. Aynı koşullarda ${km} km’lik bir şehirler arası yolda kaç litre yakıt harcar?`, String((rate * km) / 100).replace('.', ','), 'orta', 'Oran • Yakıt verimliliği', `${km} km, 100 km’nin ${km / 100} katıdır. Yakıt = ${rate} × ${km / 100} = ${String((rate * km) / 100).replace('.', ',')} L.`];
      },
      (n) => {
        const avg = 22 + n, d1 = avg - 4, d2 = avg + 5, d3 = avg - 1;
        return [`Dört günde ortalama ${avg} sayfa kitap okumayı hedefleyen bir öğrenci ilk üç günde ${d1}, ${d2} ve ${d3} sayfa okumuştur. Hedefini yakalamak için dördüncü gün tam olarak kaç sayfa okumalıdır?`, String(4 * avg - (d1 + d2 + d3)), 'orta', 'Veri analizi • Ortalama hedefi', `4 gün toplamı 4 × ${avg} = ${4 * avg} olmalı. İlk üç gün ${d1 + d2 + d3} olduğundan 4. gün ${4 * avg - (d1 + d2 + d3)} sayfa gerekir.`];
      },
      (n) => {
        const a = 2 + (n % 4), b = 3 + (n % 5);
        return [`Bir yakıt deposunun önce 1/${a + 2}’si, sonra kalan yakıtın 1/${b + 1}’i tüketiliyor. Depoda başlangıçtaki yakıtın hangi kesri kalır? Sade kesir yaz.`, simpleFraction((a + 1) * b, (a + 2) * (b + 1)), 'zor', 'Kesirler • Kaynak yönetimi', `İlk aşamada ${a + 1}/${a + 2} kalır; ardından kalanın ${b}/${b + 1}’i kalır. İki kesrin çarpımı sadeleştirilir.`];
      },
      (n) => {
        const partsA = 3 + (n % 4), partsB = 5, mult = 20 + 2 * (n % 6);
        const total = (partsA + partsB) * mult;
        return [`Bir turnuvaya katılan kız öğrencilerin erkek öğrencilere oranı ${partsA}:${partsB} ve toplam sporcu sayısı ${total}’dir. Kız ve erkek sporcu sayıları arasındaki fark kaçtır?`, String(Math.abs(partsB - partsA) * mult), 'zor', 'Oran • Çok adımlı karşılaştırma', `Toplam ${partsA + partsB} kat = ${total} => 1 kat = ${mult}. Fark = |${partsB} − ${partsA}| × ${mult} = ${Math.abs(partsB - partsA) * mult}.`];
      },
      (n) => {
        const scale = 25 + 5 * (n % 4), cm = 6.4;
        return [`1 cm’nin gerçekte ${scale} m’ye karşılık geldiği bir yürüyüş haritasında 6,4 cm ölçülen parkurun gerçek uzunluğu kaç metredir?`, String(Math.round(scale * cm * 10) / 10).replace('.', ','), 'zor', 'Ölçek • Harita okuryazarlığı', `6,4 × ${scale} = ${String(Math.round(scale * cm * 10) / 10).replace('.', ',')} m.`];
      },
    ],
    7: [
      (n) => {
        const price = 300 + 25 * n, disc = 20;
        return [`Etiket fiyatı ${price} TL olan bir spor ayakkabıya önce %${disc} indirim uygulanıyor, ardından kasada indirimli fiyat üzerinden 15 TL daha düşülüyor. Müşteri kaç TL öder?`, String(price * 0.8 - 15), 'kolay', 'Yüzdeler • Alışveriş senaryosu', `%20 indirimle ${price * 0.8} TL olur, 15 TL daha düşülünce ${price * 0.8 - 15} TL ödenir.`];
      },
      (n) => {
        const a = 45 + (n % 35);
        return [`Bir kavşakta komşu bütünler iki açıdan biri diğerinden ${2 * a - 180 >= 0 ? 2 * a - 180 : 180 - 2 * a}° farklıdır. Açılardan biri ${a}° olduğuna göre büyük açı kaç derecedir?`, String(Math.max(a, 180 - a)), 'kolay', 'Doğrular ve açılar • Muhakeme', `Bütünler açılar toplamı 180° olduğundan diğer açı 180 − ${a} = ${180 - a}° olur. Büyük olan ${Math.max(a, 180 - a)}°dir.`];
      },
      (n) => {
        const machines = 4 + (n % 3), pieces = machines * (30 + 5 * n);
        return [`${machines} özdeş yazıcı 2 saatte toplam ${pieces} sayfa basıyor. Aynı hızdaki ${machines + 2} yazıcı 2 saatte kaç sayfa basar?`, String(((pieces / machines) * (machines + 2))), 'orta', 'Orantı • Üretim kapasitesi', `1 yazıcı 2 saatte ${pieces / machines} sayfa basar. ${machines + 2} yazıcı = ${(pieces / machines) * (machines + 2)} sayfa.`];
      },
      (n) => {
        const fixed = 40 + 5 * n, perGb = 12, gbs = 5 + (n % 6), total = fixed + perGb * gbs;
        return [`Bir internet tarifesinde ${fixed} TL sabit ücret ve kullanılan her GB için ${perGb} TL alınmaktadır. Ay sonunda ${total} TL fatura ödeyen kullanıcı kaç GB internet kullanmıştır?`, String(gbs), 'orta', 'Denklem • Tarife analizi', `${fixed} + ${perGb}x = ${total} => ${perGb}x = ${total - fixed} => x = ${gbs} GB.`];
      },
      (n) => {
        const base = 400 + 100 * (n % 5);
        return [`Fiyatı ${base} TL olan bir ürüne önce %20 zam yapılıyor, sonra zamlı fiyat üzerinden %25 indirim uygulanıyor. Ürünün son fiyatı kaç TL olur?`, String(base * 1.2 * 0.75), 'zor', 'Yüzde değişimi • Ardışık işlem', `Zamlı fiyat ${base * 1.2} TL. %25 indirim sonrası ${base * 1.2 * 0.75} TL (toplamda 0,90 katı).`];
      },
      (n) => {
        const shortSide = 6 + (n % 7);
        const longSide = 2 * shortSide + 5;
        return [`Dikdörtgen bir bahçenin uzun kenarı kısa kenarının 2 katından 5 m fazladır. Kısa kenar ${shortSide} m olduğuna göre bahçenin alanı kaç m²’dir?`, String(shortSide * longSide), 'zor', 'Cebir ve alan • Modelleme', `Uzun kenar = 2 × ${shortSide} + 5 = ${longSide} m. Alan = ${shortSide} × ${longSide} = ${shortSide * longSide} m².`];
      },
      (n) => {
        const r = 3 + (n % 5), b = 4 + (n % 4), y = 5 + (n % 3);
        return [`Bir kutuda ${r} kırmızı, ${b} mavi ve ${y} sarı kart var. Rastgele çekilen bir kartın sarı OLMAMA olasılığı nedir? Sade kesir yaz.`, simpleFraction(r + b, r + b + y), 'zor', 'Olasılık • Durum uzayı', `Sarı olmayan ${r + b} kartı toplam ${r + b + y} karta böl ve sadeleştir.`];
      },
    ],
    8: [
      (n) => {
        const exp = 3 + (n % 5);
        return [`Bir sunucudaki 2^${exp} MB boyutundaki 4 özdeş dosya tek bir klasörde birleştirilirse toplam boyut kaç MB olur?`, String(4 * (2 ** exp)), 'kolay', 'Üslü ifadeler • Veri kapasitesi', `4 = 2² olduğundan toplam boyut 2² × 2^${exp} = 2^${exp + 2} = ${4 * (2 ** exp)} MB.`];
      },
      (n) => {
        const side = 11 + n;
        return [`Alanı ${side * side} m² olan kare şeklindeki bir bahçenin çevresine 2 sıra tel çekilecektir. Kaç metre tel gerekir?`, String(8 * side), 'kolay', 'Kareköklü ifadeler • Çevre-alan', `Bir kenar √${side * side} = ${side} m. 2 sıra çevre = 2 × 4 × ${side} = ${8 * side} m.`];
      },
      (n) => {
        const h = 2 + (n % 4), w = h * (3 + (n % 4));
        return [`Bir engelli rampasında dikey yükseklik ${h} m, yatay uzunluk ${w} m’dir. Rampanın eğimi yüzde cinsinden veya kesir olarak kaçtır? (Sade kesir yaz)`, simpleFraction(h, w), 'orta', 'Eğim • Erişilebilir tasarım', `Eğim = Dikey / Yatay = ${h}/${w} = ${simpleFraction(h, w)}.`];
      },
      (n) => {
        const minAge = 12 + (n % 4), maxAge = 18 + (n % 4);
        return [`Bir kodlama kampına yaş sınırı olarak "en az ${minAge} yaşında ve ${maxAge} yaşından küçük" koşulu getirilmiştir. Tam sayı olarak kaç farklı yaşta öğrenci başvurabilir?`, String(maxAge - minAge), 'orta', 'Eşitsizlik • Sınır analizi', `${minAge} ≤ x < ${maxAge} aralığında ${maxAge - minAge} farklı tam sayı yaş vardır.`];
      },
      (n) => {
        const rate = 6 + (n % 5), mins = 16 + n, rem = 40 + (n % 15);
        const start = rem + rate * mins;
        return [`İçinde ${start} litre su bulunan bir depodan her dakika sabit ${rate} litre su boşaltılmaktadır. Depoda ${rem} litre su kalması için kaç dakika geçmelidir?`, String(mins), 'zor', 'Doğrusal ilişki • Su yönetimi', `${start} − ${rate}t = ${rem} => ${rate}t = ${start - rem} => t = ${mins} dakika.`];
      },
      (n) => {
        const k = 1 + (n % 5), a = 3 * k, b = 4 * k, c = 5 * k;
        return [`Dikdörtgen bir parkın kenarları ${a} m ve ${b} m’dir. Bir köşeden karşı köşeye kenarlar boyunca yürümek yerine köşegenden yürüyen biri kaç metre daha az yol yürür?`, String(a + b - c), 'zor', 'Pisagor • Rota kısaltma', `Kenar yolu ${a + b} m. Pisagor’dan köşegen √(${a}² + ${b}²) = ${c} m. Kısalan yol ${a + b - c} m.`];
      },
      (n) => {
        const orig = 500 + 50 * n, paid = orig * 0.75;
        return [`%25 indirim uygulanarak ${paid} TL’ye satılan bir bisikletin indirimden önceki etiket fiyatı kaç TL’dir?`, String(orig), 'zor', 'Yüzde • Ters orantılı denklem', `%75’i ${paid} TL ise %100’ü ${paid} ÷ 0,75 = ${orig} TL’dir.`];
      },
    ],
  };

  for (const grade of [5, 6, 7, 8]) {
    const templates = patterns[grade];
    for (let i = 0; i < templates.length * 12; i++) {
      const t = i % templates.length;
      const n = Math.floor(i / templates.length) + 1;
      const result = templates[t](n);
      out.push({
        grade,
        difficulty: result[2],
        subject: result[3],
        q: result[0],
        a: String(result[1]),
        explanation: result[4],
        family: `original-${grade}-${t}`,
        category: 'context',
        skillBased: true,
        source: 'Özgün Soru • MEB/LGS beceri yaklaşımı',
      });
    }
  }

  return out;
}

export const allQuestions: Question[] = [
  ...initialMatchQuestions,
  ...mathOutcomeQuestions,
  ...buildSupplementaryQuestions(),
  ...contextQuestions,
  ...sourceQuestions,
];
