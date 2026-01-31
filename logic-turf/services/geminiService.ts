import { GoogleGenAI } from "@google/genai";
import { RaceInputData, TrackBiasPattern } from "../types";
import { FRAMEWORK_CONTEXT, BIAS_DEFINITIONS } from "../constants";

// Initialize Gemini Client
// Requires process.env.API_KEY to be set
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeRace = async (data: RaceInputData): Promise<string> => {
  try {
    const selectedBias = BIAS_DEFINITIONS.find(b => b.id === data.biasPattern);
    const isAuto = data.biasPattern === TrackBiasPattern.AUTO;
    
    // Construct dynamic bias instructions based on user selection
    let biasInstruction = '';

    if (isAuto) {
      biasInstruction = `
      【トラックバイアス設定: 自動判定モード】
      1. Google検索を使用して、対象レースの開催地（${data.location || '対象競馬場'}）における直近（当日または今週）の以下の情報を調査してください。
         - 公式発表の馬場状態（良・稍重・重・不良、クッション値、含水率など）
         - 直近レースの枠順別・脚質別の成績傾向（内枠有利か外枠有利か、逃げが決まっているか）
         - SNSや競馬ニュース等の馬場傾向に関する言及
      2. 調査結果に基づき、以下の4パターンのうち、現在の状況に最も近いものをAIが一つ特定してください。
         - パターンA（内有利・高速）
         - パターンB（外有利・タフ）
         - パターンC（内有利・タフ）
         - パターンD（外有利・高速）
      3. レポートの冒頭（【結論】の前）に、「🔍 AIが判定したトラックバイアス：[特定したパターン名]」というセクションを設け、なぜそのパターンと判断したかの根拠（調査したファクト）を簡潔に述べてください。
      4. その特定したバイアスを前提として、後続の予想ロジックを展開してください。
      `;
    } else {
      biasInstruction = `
      【ユーザー観測トラックバイアス】
      ユーザーは以下のバイアスパターンを指定しました。これを絶対的な前提条件として分析してください。
      パターン: ${selectedBias?.title}
      特徴: ${selectedBias?.description}
      有利なタイプ: ${selectedBias?.advantage}
      `;
    }

    // Construct the prompt
    const prompt = `
      【レース分析依頼】
      対象レース: ${data.raceName}
      場所: ${data.location || '指定なし'}
      
      【ユーザー入力予算】
      ${data.budget.toLocaleString()}円

      ${biasInstruction}
      
      【補足情報】
      ${data.additionalNotes || 'なし'}

      指示:
      Google検索ツールを使用して、このレースの最新の出馬表、オッズ傾向、天候、および（自動判定の場合は）馬場状態を調査してください。
      その情報と決定されたバイアスを組み合わせ、「究極の競馬予想フレームワーク」に基づいて分析レポートを作成してください。
      
      もし具体的な出馬表が見つからない場合（架空のレースや未来すぎる場合）は、
      そのコースとバイアスにおける「理想的な狙い目（血統や脚質の具体例）」と「一般的な投資戦略」を論理的に提示してください。
      
      文体は「冷静沈着なプロの投資家」のトーンで、断定的ながらもリスクを明示するスタイルで書いてください。
    `;

    // Call Gemini API with Grounding (Google Search)
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Use standard logic model
      contents: prompt,
      config: {
        systemInstruction: FRAMEWORK_CONTEXT,
        temperature: 0.2, // Low temperature for analytical/logical output
        tools: [{ googleSearch: {} }], // Enable grounding
      },
    });

    return response.text || "分析を生成できませんでした。もう一度お試しください。";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return `エラーが発生しました: ${error.message || "不明なエラー"}`;
  }
};