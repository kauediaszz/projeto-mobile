import Constants from 'expo-constants';

type GeminiInput = Record<string, string | number>;

const apiKey =
  process.env.EXPO_PUBLIC_GEMINI_API_KEY ||
  String(Constants.expoConfig?.extra?.GEMINI_API_KEY ?? '');

const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

function buildImcPrompt(dados: GeminiInput) {
  const sexo = String(dados.sexo ?? 'nao informado');
  const idade = String(dados.idade ?? 'nao informado');
  const peso = String(dados.peso ?? 'nao informado');
  const altura = String(dados.altura ?? 'nao informado');
  const atividade = String(dados.atividade ?? 'nao informado');
  const objetivo = String(dados.objetivo ?? 'nao informado');
  const preferencias = String(dados.preferencias ?? 'nao informado');

  return `You are a health assistant. Calculate the user BMI based on the data below and return only the BMI value using a comma decimal separator. Do not return explanations.

User data:
- Sex: ${sexo}
- Age: ${idade}
- Weight: ${peso}
- Height: ${altura}
- Activity: ${atividade}
- Goal: ${objetivo}
- Preferences: ${preferencias}
`;
}

// NOVA FUNÇÃO AQUI: Forçando a IA a retornar JSON estruturado
function buildDietPrompt(dados: GeminiInput) {
  const sexo = String(dados.sexo ?? 'nao informado');
  const idade = String(dados.idade ?? 'nao informado');
  const peso = String(dados.peso ?? 'nao informado');
  const altura = String(dados.altura ?? 'nao informado');
  const atividade = String(dados.atividade ?? 'nao informado');
  const objetivo = String(dados.objetivo ?? 'nao informado');
  const preferencias = String(dados.preferencias ?? 'nao informado');

  return `Você é um nutricionista e assistente de saúde. Use os dados abaixo para calcular o IMC, estimar o TDEE (Gasto Energético Total Diário) e gerar um plano alimentar de UM DIA focado no objetivo.
  
RETORNE APENAS UM JSON VÁLIDO. Não adicione nenhuma formatação markdown (como \`\`\`json) e não adicione textos fora do JSON. Use a estrutura exata abaixo:

{
  "avaliacao": {
    "imc": "22.5",
    "tdee": "2100",
    "texto": "Sua avaliação nutricional detalhada aqui..."
  },
  "refeicoes": [
    {
      "nome": "Café da Manhã",
      "icone": "☕",
      "itens": [
        { "nome": "Ovos Mexidos", "detalhe": "3 unidades", "icone": "🥚" },
        { "nome": "Pão integral", "detalhe": "2 fatias (60g)", "icone": "🍞" }
      ]
    }
  ],
  "notas": [
    "Beber pelo menos 3L de água por dia.",
    "Pode substituir o frango por patinho moído."
  ]
}

User data:
- Sex: ${sexo}
- Age: ${idade}
- Weight: ${peso} kg
- Height: ${altura}
- Activity: ${atividade}
- Goal: ${objetivo}
- Food preferences: ${preferencias}
`;
}

async function requestGemini(prompt: string) {
  if (!apiKey) {
    throw new Error('[Gemini] API key not configured. Check EXPO_PUBLIC_GEMINI_API_KEY or app config.');
  }

  const body = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
  };

  const maxRetries = 3;
  const backoffMultiplier = 1000; // 1 segundo em ms
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[Gemini] Attempt ${attempt}/${maxRetries} - Sending prompt to Gemini:`, {
        endpoint: GEMINI_ENDPOINT,
        prompt,
      });

      const response = await fetch(GEMINI_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey,
        },
        body: JSON.stringify(body),
      });

      console.log(`[Gemini] Attempt ${attempt} - Response status:`, response.status, response.statusText);

      // Retry on 503 (Service Unavailable) or 429 (Too Many Requests)
      if (response.status === 503 || response.status === 429) {
        if (attempt < maxRetries) {
          const waitTime = Math.pow(2, attempt - 1) * backoffMultiplier; // 1s, 2s, 4s
          console.warn(`[Gemini] Attempt ${attempt} returned ${response.status}. Retrying in ${waitTime}ms...`);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          continue; // Go to next attempt
        } else {
          throw new Error(`[Gemini] Max retries (${maxRetries}) exhausted. Last status: ${response.status} ${response.statusText}`);
        }
      }

      // Handle other HTTP errors
      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const rawText = await response.text();

      let data;
      try {
        data = JSON.parse(rawText);
      } catch (error) {
        console.error('[Gemini] Failed to parse JSON response:', rawText);
        throw new Error(`Gemini returned invalid JSON: ${error}`);
      }

      console.log('[Gemini] Raw response:', data);

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error(`Gemini response missing expected text. Raw response: ${JSON.stringify(data)}`);
      }

      console.log('[Gemini] Gemini responded with text:', text);
      return text;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`[Gemini] Attempt ${attempt} failed:`, lastError.message);

      if (attempt < maxRetries && (lastError.message.includes('503') || lastError.message.includes('429'))) {
        // Will retry in next iteration
        continue;
      } else if (attempt === maxRetries) {
        // All retries exhausted
        throw lastError;
      } else {
        // Other errors that shouldn't retry
        throw lastError;
      }
    }
  }

  // Fallback error (should not reach here)
  throw lastError || new Error('[Gemini] Unknown error after retries');
}

export async function calculateImcFromGemini(dados: GeminiInput) {
  return requestGemini(buildImcPrompt(dados));
}

export async function generateDietFromGemini(dados: GeminiInput) {
  return requestGemini(buildDietPrompt(dados));
}