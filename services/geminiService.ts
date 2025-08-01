
import { GoogleGenAI } from "@google/genai";
import type { Suggestion, SuggestionResult, GroundingSource, Location } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not found.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const parseJsonFromMarkdown = (text: string): any => {
    const match = text.match(/```json\n([\s\S]*?)\n```/);
    if (match && match[1]) {
        return JSON.parse(match[1]);
    }
    // Fallback for cases where the model doesn't use markdown
    try {
        return JSON.parse(text);
    } catch(e) {
        console.error("Failed to parse JSON directly, text was:", text);
        throw new Error("模型返回的数据格式不正确，无法解析。");
    }
};


export const getSuggestions = async (category: string, mood: string, topic: string, location: Location | null): Promise<SuggestionResult> => {
  const systemInstruction = "你是一位富有创意和同理心的生活顾问。你的目标是根据用户的类别偏好、心情、可选的兴趣主题，并结合今天的新闻、天气等实时情况，为他们提供3个个性化、安全且愉快的活动建议。在描述建议时，请使用自然、亲切的语气，将实时信息（如天气或时事）作为灵感的背景，而不是直接在描述中引用。例如，不要说‘因为天气很好...’，而是直接提出一个适合好天气的活动。所有回答都必须是中文，并以指定的JSON格式返回。";
  
  let topicInstruction = "";
  if (topic.trim()) {
    topicInstruction = `用户还对“${topic}”这个主题特别感兴趣。`;
  }

  let locationInstruction = "";
  if (location) {
      locationInstruction = `用户当前地理位置为纬度 ${location.latitude}，经度 ${location.longitude}。请务必结合当地的天气情况为用户推荐。`
  } else {
      locationInstruction = "由于无法获取用户位置，请结合普适性的头条新闻或常见的季节性特点来提供建议。"
  }

  const prompt = `
    请为用户生成活动建议。
    - 类别: "${category}"
    - 用户当前心情: "${mood}"
    ${topicInstruction}
    ${locationInstruction}
    
    重要提示：在生成的建议描述中，请不要直接提及“新闻”、“天气预报”或“根据你的位置”等字眼。请将这些实时信息作为你提出建议的内在灵感，让文案听起来自然流畅，仿佛一个朋友在给你出主意。
    
    返回一个JSON对象，其结构如下:
    \`\`\`json
    {
      "suggestions": [
        {
          "title": "一个简短、吸引人的活动标题",
          "description": "一段鼓舞人心且简洁的活动描述，大约2-3句话",
          "emoji": "一个代表该活动的表情符号"
        }
      ]
    }
    \`\`\`
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
        systemInstruction: systemInstruction,
        temperature: 0.9,
        topP: 0.9,
      }
    });

    const jsonText = response.text.trim();
    const parsedJson = parseJsonFromMarkdown(jsonText);
    const suggestions: Suggestion[] = parsedJson.suggestions;
    
    if (!Array.isArray(suggestions) || suggestions.length === 0) {
      throw new Error("API 未返回有效的建议列表。");
    }

    const validSuggestions = suggestions.filter(s => s.title && s.description && s.emoji);

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
    const sources: GroundingSource[] = groundingChunks
      .map(chunk => chunk.web)
      .filter((web): web is { uri: string; title: string; } => !!(web && web.uri));


    return { suggestions: validSuggestions, sources };

  } catch (error) {
    console.error("Error fetching suggestions from Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`获取建议失败: ${error.message}`);
    }
    throw new Error("获取建议时发生未知错误。");
  }
};