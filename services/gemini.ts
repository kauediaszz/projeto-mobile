import Constants from 'expo-constants';

type GeminiInput = Record<string, string | number>;

const apiKey =
  process.env.EXPO_PUBLIC_GEMINI_API_KEY ||
  String(Constants.expoConfig?.extra?.GEMINI_API_KEY ?? '');

const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

function buildImcPrompt(dados: GeminiInput) {
  const sexo = String(dados.sexo ?? 'não informado');
  const idade = String(dados.idade ?? 'não informado');
  const peso = String(dados.peso ?? 'não informado');
  const altura = String(dados.altura ?? 'não informado');
  const atividade = String(dados.atividade ?? 'não informado');
  const objetivo = String(dados.objetivo ?? 'não informado');
  const preferencias = String(dados.preferencias ?? 'não informado');

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
  const sexo = String(dados.sexo ?? 'não informado');
  const idade = String(dados.idade ?? 'não informado');
  const peso = String(dados.peso ?? 'não informado');
  const altura = String(dados.altura ?? 'não informado');
  const atividade = String(dados.atividade ?? 'não informado');
  const objetivo = String(dados.objetivo ?? 'não informado');
  const preferencias = String(dados.preferencias ?? 'não informado');

<<<<<<< HEAD
  return `Você é um Nutricionista Esportivo experiente.
  Crie uma estratégia nutricional com base nos dados do usuário.
=======
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
>>>>>>> 5a700c5b8d182ad44346bbc93c3848423579a673

DADOS DO UTILIZADOR:
- Sexo: ${sexo}
- Idade: ${idade} anos
- Peso: ${peso} kg
- Altura: ${altura}
- Nível de Atividade: ${atividade}
- Objetivo: ${objetivo}
- Preferências/Restrições: ${preferencias}


REGRAS ESTritas DE FORMATAÇÃO:
1. NUNCA use formatação Markdown (não use asteriscos **, não use hashtags ##).
2. Não use caracteres especiais complexos ou emojis não convencionais.
3. Use um traço simples (-) para listas.
4. Pule uma linha em branco entre as seções.
5. Siga EXATAMENTE a estrutura abaixo, substituindo os espaços pelos seus cálculos e recomendações.

ESTRUTURA OBRIGATÓRIA:

RESULTADOS DA AVALIAÇÃO
IMC: [Insira o valor e a classificação]
GASTO CALÓRICO DIÁRIO (TDEE): [Insira o valor exato em kcal]

PLANO ALIMENTAR
[Crie as refeições indicando horários e quantidades exatas. Respeite as preferências.]

DICAS EXTRAS
[Dicas focadas no objetivo de ${objetivo}]`;
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
          // A linha abaixo foi alterada para evitar erros de caracteres
          'Content-Type': 'application/json; charset=utf-8',
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
          continue; 
        } else {
          throw new Error(`[Gemini] Max retries (${maxRetries}) exhausted. Last status: ${response.status} ${response.statusText}`);
        }
      }

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

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error(`Gemini response missing expected text. Raw response: ${JSON.stringify(data)}`);
      }

      return text;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`[Gemini] Attempt ${attempt} failed:`, lastError.message);

      if (attempt < maxRetries && (lastError.message.includes('503') || lastError.message.includes('429'))) {
        continue;
      } else if (attempt === maxRetries) {
        throw lastError;
      } else {
        throw lastError;
      }
    }
  }

  throw lastError || new Error('[Gemini] Unknown error after retries');
}

export async function calculateImcFromGemini(dados: GeminiInput) {
  return requestGemini(buildImcPrompt(dados));
}

export async function generateDietFromGemini(dados: GeminiInput) {
  return requestGemini(buildDietPrompt(dados));
}