# Zekâ Pro Ligim’i Cloudflare’da Yayımlama

## 1. Telefondan Yayınlama (Bilgisayar ve Terminal Olmadan — Önerilen)

Telefon tarayıcısından GitHub ve Cloudflare kullanarak hiç komut yazmadan doğrudan yayınlayabilirsiniz:

1. Projeyi GitHub deponuza aktarın (AI Studio içindeki **GitHub’a kaydet / push** butonuyla).
2. Telefonunuzdan **dash.cloudflare.com** adresine girin → sağ üstten profil ikonuna dokunun → **My Profile → API Tokens → Create Token** seçin.
   - **Edit Cloudflare Workers** şablonunu kullanın (veya izinlere **Account → D1 → Edit**, **Account → Workers Scripts → Edit**, **Account → Workers KV / Routes** ekleyin).
   - Oluşan token’ı kopyalayın.
3. Telefonunuzdan GitHub deponuzu açın → **Settings → Secrets and variables → Actions → New repository secret** yolunu izleyin:
   - **Name:** `CLOUDFLARE_API_TOKEN` → **Secret:** kopyaladığınız token.
   - *(İsteğe bağlı)* AI Zekâ Koçu’nun canlı Gemini soruları üretmesi için bir tane daha ekleyin: **Name:** `GEMINI_API_KEY`.
4. GitHub deponuzda **Actions** sekmesine girin → **Cloudflare Workers Deploy** iş akışını seçin → **Run workflow** butonuna dokunun.
   - Bu işlem otomatik olarak D1 veritabanını (`zeka-pro-ligim`) kurar, tabloları yükler ve uygulamayı `https://zeka-pro-ligim.<hesabiniz>.workers.dev` adresinde canlıya alır.

---

## 2. Cloudflare Panelinden Doğrudan GitHub Bağlama (Alternatif)

1. **dash.cloudflare.com** → **Storage & databases → D1 SQL Database → Create** ile `zeka-pro-ligim` veritabanını oluşturun ve **Database ID** değerini kopyalayın.
2. GitHub’da `wrangler.jsonc` dosyasını açıp `"CLOUDFLARE_D1_DATABASE_ID"` yerine kopyaladığınız ID’yi yazıp kaydedin (tablolar ilk istekte otomatik oluşturulur).
3. Cloudflare panelinde **Workers & Pages → Create → Import a repository** ile GitHub deponuzu seçin:
   - **Build command:** `npm run build:cloudflare`
   - **Deploy command:** `npx wrangler deploy`
4. *(İsteğe bağlı)* Worker **Settings → Variables and Secrets** bölümünden `GEMINI_API_KEY` ekleyin.

---

## 3. Bilgisayardan Tek Komutla Yayınlama

Node.js 22+ kurulu bir terminalde:

```sh
npm install
npm run cf:deploy
```

İsteğe bağlı Gemini API anahtarı için:

```sh
npm run cf:secret
```

---

## 4. Öğrenci Girişi ve Erişim Seçenekleri

- **Doğrudan Yayın (Varsayılan `REQUIRE_ACCESS: "false"`)**: Uygulama herkese açık olarak hemen açılır; tüm maçlar, çevrim içi düello, oyunlar ve antrenmanlar çalışır, **Profilim** bölümü her tarayıcıya özel güvenli bir oturum çereziyle D1 veritabanına kaydedilir.
- **Okul / E-posta Kısıtlamalı Giriş (İsteğe Bağlı Cloudflare Access)**:
  1. **Zero Trust → Access → Applications** altında Worker adresiniz için **Self-hosted** uygulama ekleyin ve **One-time PIN** girişini açın.
  2. İzin verdiğiniz öğrenci/öğretmen e-postalarını **Allow** kuralına ekleyin.
  3. Tam site kilidi için `wrangler.jsonc` veya Worker ortam değişkenlerinde `REQUIRE_ACCESS` değerini `"true"` yapın.

---

## 5. Özel Alan Adı

Alan adınız Cloudflare DNS üzerinde **Active** durumdaysa Worker ayarlarında **Settings → Domains & Routes → Add → Custom Domain** üzerinden eklemeniz yeterlidir (ör. `lig.okulunuz.com`). SSL sertifikası ve DNS kaydı otomatik oluşturulur.
