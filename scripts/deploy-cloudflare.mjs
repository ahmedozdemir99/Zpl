import { spawnSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const wranglerPath = path.join(root, 'wrangler.jsonc');
const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const DB_NAME = 'zeka-pro-ligim';
const PLACEHOLDER_ID = 'CLOUDFLARE_D1_DATABASE_ID';

function run(args, capture = false) {
  const result = spawnSync(npxCmd, args, {
    cwd: root,
    encoding: 'utf-8',
    stdio: capture ? ['inherit', 'pipe', 'pipe'] : 'inherit',
    shell: process.platform === 'win32',
  });
  return result;
}

function fail(message) {
  console.error(`\n❌ ${message}`);
  process.exit(1);
}

console.log('☁️ Zekâ Pro Ligim — Cloudflare Yayınlama Başlatılıyor...\n');

// 1. Cloudflare oturumu kontrolü
const whoami = run(['wrangler', 'whoami'], true);
if (whoami.status !== 0) {
  if (process.env.CI) {
    fail('CLOUDFLARE_API_TOKEN ortam değişkeni eksik veya geçersiz.');
  }
  console.log('🔐 Cloudflare hesabınıza giriş yapılması gerekiyor...');
  const login = run(['wrangler', 'login']);
  if (login.status !== 0) {
    fail('Cloudflare girişi tamamlanamadı. CLOUDFLARE_API_TOKEN tanımlayın veya `npx wrangler login` çalıştırın.');
  }
}

// 2. D1 veritabanı kontrolü ve wrangler.jsonc güncellemesi
let configText = await readFile(wranglerPath, 'utf-8');
if (configText.includes(PLACEHOLDER_ID)) {
  console.log('🗄️ Cloudflare D1 veritabanı kontrol ediliyor...');
  let databaseId = '';

  const list = run(['wrangler', 'd1', 'list', '--json'], true);
  if (list.status === 0 && list.stdout) {
    try {
      const items = JSON.parse(list.stdout);
      const found = Array.isArray(items)
        ? items.find(db => db?.name === DB_NAME)
        : undefined;
      if (found?.uuid) {
        databaseId = found.uuid;
        console.log(`✓ Mevcut '${DB_NAME}' D1 veritabanı bulundu (${databaseId}).`);
      }
    } catch {}
  }

  if (!databaseId) {
    console.log(`➕ Yeni D1 veritabanı oluşturuluyor (${DB_NAME})...`);
    const created = run(['wrangler', 'd1', 'create', DB_NAME, '--location', 'weur'], true);
    const combined = `${created.stdout || ''}\n${created.stderr || ''}`;
    if (created.status !== 0) {
      console.error(combined);
      fail('D1 veritabanı oluşturulamadı.');
    }
    const uuidMatch = combined.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
    if (!uuidMatch) {
      console.log(combined);
      fail('D1 veritabanı kimliği (UUID) çıktıda bulunamadı. wrangler.jsonc dosyasını elle güncelleyin.');
    }
    databaseId = uuidMatch[0];
    console.log(`✓ D1 veritabanı oluşturuldu (${databaseId}).`);
  }

  configText = configText.replace(PLACEHOLDER_ID, databaseId);
  await writeFile(wranglerPath, configText, 'utf-8');
  console.log('✓ wrangler.jsonc D1 database_id ile güncellendi.\n');
}

// 3. Uzak D1 tabloları (drizzle migrations)
console.log('📦 D1 veritabanı tabloları uygulanıyor...');
const migrate = run(['wrangler', 'd1', 'migrations', 'apply', 'DB', '--remote']);
if (migrate.status !== 0) {
  fail('D1 migration işlemi başarısız oldu.');
}

// 4. Derleme ve Worker yayını
console.log('\n🚀 Worker derleniyor ve Cloudflare üzerine yayımlanıyor...');
const deploy = run(['wrangler', 'deploy']);
if (deploy.status !== 0) {
  fail('Cloudflare Worker yayını başarısız oldu.');
}

// 5. İsteğe bağlı GEMINI_API_KEY sırrını CI üzerinden otomatik aktar
const geminiKey = process.env.GEMINI_API_KEY?.trim();
if (geminiKey && process.env.CI) {
  console.log('🔑 GEMINI_API_KEY Worker sırrı güncelleniyor...');
  const secretRes = spawnSync(npxCmd, ['wrangler', 'secret', 'put', 'GEMINI_API_KEY'], {
    cwd: root,
    encoding: 'utf-8',
    input: geminiKey,
    stdio: ['pipe', 'inherit', 'inherit'],
    shell: process.platform === 'win32',
  });
  if (secretRes.status !== 0) {
    console.warn('⚠️ GEMINI_API_KEY sırrı ayarlanamadı; uygulama yerel soru bankasıyla çalışmaya devam eder.');
  }
}

console.log('\n✅ Yayın tamamlandı!');
if (!geminiKey) {
  console.log('💡 İsteğe bağlı: AI Zekâ Koçu için Gemini API anahtarını eklemek isterseniz `npm run cf:secret` komutunu çalıştırın.');
}
