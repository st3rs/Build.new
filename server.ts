import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import { AI_REQUEST_TIMEOUT_MS, resolveModelConfig } from './src/utils/aiConfig';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

interface GenerateRequestBody {
  prompt?: string;
  mode?: 'new_app' | 'iteration';
  modelId?: 'build-fast' | 'build-pro';
  currentHtml?: string;
  currentTitle?: string;
  lang?: 'th' | 'en';
}

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      aiEnabled: Boolean(getGeminiClient()),
      timeoutMs: AI_REQUEST_TIMEOUT_MS,
      models: {
        fast: resolveModelConfig('build-fast'),
        pro: resolveModelConfig('build-pro'),
      },
    });
  });

  app.post('/api/generate', async (req, res) => {
    const body = (req.body ?? {}) as GenerateRequestBody;
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required.' });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.json({ fallback: true, reason: 'missing_api_key' });
      return;
    }

    const isIteration = body.mode === 'iteration';
    const lang = body.lang === 'en' ? 'en' : 'th';
    const modelId = body.modelId === 'build-pro' ? 'build-pro' : 'build-fast';
    const modelConfig = resolveModelConfig(modelId);
    const thinkingLevel =
      modelConfig.thinkingLevel === 'HIGH' ? ThinkingLevel.HIGH : ThinkingLevel.LOW;
    const isPro = modelId === 'build-pro';

    try {
      const systemInstruction = isIteration
        ? `You are Build.new's code synthesis engine (${modelConfig.displayLabel}).
Update the provided single-file HTML5 + CSS + Vanilla JS interactive web app according to the user's iteration instruction.
${isPro ? 'Deliver thorough, production-grade architectural enhancements and polished interactive controls (keep previewHtml under 220 lines and appTsx under 100 lines).' : 'Keep previewHtml concise (under 140 lines) and appTsx concise (under 60 lines).'}
Respond in valid JSON matching the schema. Write assistantMessage in ${lang === 'th' ? 'Thai' : 'English'}.
Ensure previewHtml is a complete, self-contained <!doctype html> document with inline <style> and interactive <script>.`
        : `You are Build.new's code synthesis engine (${modelConfig.displayLabel}).
Generate a clean, interactive single-file HTML5 + CSS + Vanilla JS web application matching the user's prompt.
Use a sleek dark matte graphite aesthetic (#141517 background, #1D1F24 cards, #0066FF primary CTA, #00E5FF accent) unless the prompt specifies another theme.
${isPro ? 'Use deep reasoning to build rich interactive workflows, multi-tab or stateful views, real-time filtering, charts/KPIs, and polished micro-interactions (keep previewHtml under 220 lines and appTsx under 100 lines).' : 'Keep previewHtml concise (under 140 lines) with real interactive DOM controls (buttons, inputs, filters, live state updates), and appTsx concise (under 60 lines).'}
Respond in valid JSON matching the schema. Write assistantMessage in ${lang === 'th' ? 'Thai' : 'English'}.`;

      const contents = isIteration
        ? `Current App Title: ${body.currentTitle ?? 'App'}\n\nIteration Request: ${prompt}\n\nCurrent HTML:\n${(body.currentHtml ?? '').slice(0, 12000)}`
        : `Build this web application: ${prompt}`;

      const geminiPromise = ai.models.generateContent({
        model: modelConfig.model,
        contents,
        config: {
          systemInstruction,
          thinkingConfig: {
            thinkingLevel,
          },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: 'Short concise application title.',
              },
              assistantMessage: {
                type: Type.STRING,
                description: 'Brief summary of what was generated or updated.',
              },
              previewHtml: {
                type: Type.STRING,
                description: 'Complete self-contained HTML5 document with inline CSS and interactive JS.',
              },
              appTsx: {
                type: Type.STRING,
                description: 'Clean React TypeScript component representing the generated app.',
              },
            },
            required: ['title', 'assistantMessage', 'previewHtml', 'appTsx'],
          },
        },
      });

      let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
      const timeoutPromise = new Promise<null>((resolve) => {
        timeoutHandle = setTimeout(() => resolve(null), AI_REQUEST_TIMEOUT_MS);
      });

      const response = await Promise.race([geminiPromise, timeoutPromise]);
      if (timeoutHandle) clearTimeout(timeoutHandle);

      if (!response) {
        res.json({
          fallback: true,
          warning: `Generation exceeded ${AI_REQUEST_TIMEOUT_MS / 1000}s timeout`,
        });
        return;
      }

      const rawText = (response.text ?? '').trim();
      const parsed = JSON.parse(rawText) as {
        title?: string;
        assistantMessage?: string;
        previewHtml?: string;
        appTsx?: string;
      };

      if (!parsed.previewHtml || !parsed.previewHtml.includes('<')) {
        res.json({ fallback: true, warning: 'Invalid HTML payload from AI' });
        return;
      }

      res.json({
        fallback: false,
        modelUsed: modelConfig.model,
        thinkingLevel: modelConfig.thinkingLevel,
        title: parsed.title || body.currentTitle || 'Build.new App',
        assistantMessage: parsed.assistantMessage || 'Application synthesized.',
        previewHtml: parsed.previewHtml,
        appTsx: parsed.appTsx || '',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Generation error';
      res.json({ fallback: true, warning: message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Build.new server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
