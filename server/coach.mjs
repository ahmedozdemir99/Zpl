const model = 'gemini-4-hydrogen';
const questionSchema = {
  type: 'OBJECT',
  properties: {
    q: { type: 'STRING' },
    a: { type: 'STRING' },
    subject: { type: 'STRING' },
    explanation: { type: 'STRING' },
  },
  required: ['q', 'a', 'subject', 'explanation'],
};

export async function handleCoach(request, env) {
  const { pathname, origin } = new URL(request.url);
  const key = env.GEMINI_API_KEY?.trim();
  const reply = (value, status = 200) => Response.json(value, {
    status, headers: { 'Cache-Control': 'no-store' },
  });
  if (pathname === '/api/ai/status' && request.method === 'GET') {
    return reply({ available: Boolean(key) });
  }
  if (request.method !== 'POST') return reply({ error: 'Geçersiz istek.' }, 405);
  if (request.headers.has('Origin') && request.headers.get('Origin') !== origin) {
    return reply({ error: 'İstek bu uygulamadan gelmeli.' }, 403);
  }
  if (!key) return reply({ error: 'Gemini bağlantısı yapılandırılmamış.' }, 503);

  let input;
  try {
    const body = await request.text();
    if (body.length > 8000) return reply({ error: 'İstek çok uzun.' }, 413);
    input = JSON.parse(body);
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error();
  } catch {
    return reply({ error: 'Geçersiz istek.' }, 400);
  }

  const clean = (value, limit) => typeof value === 'string' ? value.trim().slice(0, limit) : '';
  const grade = Number(input.grade);
  const level = [5, 6, 7, 8].includes(grade) ? `${grade}. sınıf` : 'ortaokul';
  const makeQuestion = pathname === '/api/ai/generate-question';
  let prompt;
  if (makeQuestion) {
    const difficulty = ['kolay', 'orta', 'zor'].includes(input.difficulty) ? input.difficulty : 'orta';
    const topic = clean(input.topic, 120) || 'Matematik veya Fen/Türkçe beceri temelli konular';
    prompt = `${level} için ${difficulty} düzeyinde, MEB beceri temelli (yeni nesil) yaklaşıma uygun, günlük yaşam senaryolu ve çok adımlı akıl yürütme gerektiren, tek net doğru cevabı olan özgün bir soru üret. Konu/Ders: ${topic}. Cevabı doğrula ve açıklamada çözüm veya muhakeme adımlarını açıkça göster.`;
  } else if (pathname === '/api/ai/explain') {
    const question = clean(input.question, 3500);
    const answer = clean(input.answer, 400);
    if (!question || !answer) return reply({ error: 'Soru veya cevap eksik.' }, 400);
    prompt = `${level} öğrencisine bu soruyu adım adım açıkla. Verilen cevap anahtarını doğrula ve tutarsızsa belirt. Soru: ${question}\nCevap anahtarı: ${answer}`;
  } else if (pathname === '/api/ai/hint') {
    prompt = `Bu zekâ oyunu için çözümü söylemeden kısa bir strateji ipucu ver: ${clean(input.gameType, 40)}. Oyun durumu: ${clean(input.puzzleState, 1000)}`;
  } else {
    return reply({ error: 'İşlem bulunamadı.' }, 404);
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': key,
        'User-Agent': 'aistudio-build',
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{
            text: 'Türkçe yanıt veren deneyimli bir ortaokul öğretmenisin. Matematik, Türkçe, Fen Bilimleri, Sosyal Bilgiler / T.C. İnkılap Tarihi, Din Kültürü, İngilizce ve zekâ oyunları alanlarında MEB/LGS beceri temelli sorular ve açık çözümler üret.',
          }],
        },
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 2500,
          ...(makeQuestion ? { responseMimeType: 'application/json', responseSchema: questionSchema } : {}),
        },
      }),
      signal: AbortSignal.timeout(18000),
    });
    if (!response.ok) {
      const status = response.status;
      if (status === 429) return reply({ error: 'Gemini kota sınırına ulaşıldı. Daha sonra tekrar deneyin.' }, 502);
      if (status === 400 || status === 403) return reply({ error: 'Gemini API anahtarı geçersiz veya yetkisiz.' }, 502);
      return reply({ error: 'Gemini şu anda yanıt veremiyor.' }, 502);
    }
    const result = await response.json();
    const rawText = result.candidates?.[0]?.content?.parts
      ?.filter(part => !part.thought)
      .map(part => part.text || '').join('').trim();
    if (!rawText) return reply({ error: 'Gemini boş yanıt döndürdü.' }, 502);
    if (!makeQuestion) return reply({ text: rawText });
    const stripped = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    const question = JSON.parse(stripped);
    if (!Object.keys(questionSchema.properties).every(field => clean(question[field], 4000))) {
      return reply({ error: 'Soru yanıtı eksik.' }, 502);
    }
    return reply(question);
  } catch {
    return reply({ error: 'Gemini bağlantısı tamamlanamadı.' }, 502);
  }
}
