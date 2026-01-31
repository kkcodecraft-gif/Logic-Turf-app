// services/localAnalysisService.ts

// トラックバイアスの型定義（既存のtypes.tsに合わせてください）
export type TrackBiasType = 'A' | 'B' | 'C' | 'D' | 'FLAT';

interface AnalysisResult {
  title: string;
  summary: string;
  strategy: string; // 投資戦略（買い方）
  targetHorse: string; // 狙い馬
}

/**
 * 究極の競馬予想フレームワークに基づいた判定ロジック
 */
export const analyzeTrackBiasLocal = async (
  pattern: TrackBiasType, 
  trackCondition: string = '良' // 馬場状態（良・稍重・重・不良）
): Promise<string> => {
  
  [cite_start]// ダートの判定（「海辺の波打ち際」理論） [cite: 16]
  const isDirt = trackCondition.includes('ダート'); 
  if (isDirt) {
    return analyzeDirtLogic(trackCondition);
  }

  [cite_start]// 芝の判定（A〜Dパターン） [cite: 13, 14, 15]
  let result: AnalysisResult;

  switch (pattern) {
    case 'A':
      result = {
        title: '【パターンA】内有利 × 高速馬場',
        summary: '開幕週やBコース替わり直後に発生しやすい状態です。インコースの芝状態が良く、スピードが活きる環境です。',
        targetHorse: '「内枠の逃げ・先行馬」および「内を突ける器用な差し馬」',
        strategy: '基本パターンです。外枠の人気馬を軽視し、内枠の先行馬から入るのがセオリーです。距離ロスを最小限に抑える馬を狙います。'
      };
      break;

    case 'B':
      result = {
        title: '【パターンB】外有利 × タフ馬場',
        summary: '開催後半で内側の芝が荒れた状態です。パワーと持続力が要求される消耗戦になりやすい環境です。',
        targetHorse: '「外枠の差し・追い込み馬」',
        strategy: '内を通る馬は体力を削られます。外からスムーズに加速できる「持続力型」を重視してください。'
      };
      break;

    case 'C':
      result = {
        title: '【パターンC】内有利 × タフ馬場（盲点ゾーン）',
        summary: '雨中の開催序盤などで発生します。馬場は重いですが、内側がまだ荒れていない特殊な状況です。',
        targetHorse: '「内をロスなく回れるパワー先行型」',
        strategy: '【高配当のチャンス】多くの人が「タフ＝外差し」と誤認しやすいタイミングです。あえて内枠のパワータイプを狙うことで期待値の高い馬券が取れます。'
      };
      break;

    case 'D':
      result = {
        title: '【パターンD】外有利 × 高速馬場（盲点ゾーン）',
        summary: '秋の東京開催後半などで見られます。高速決着でありながら、内側だけが使われて伸びない特殊条件です。',
        targetHorse: '「外から末脚を伸ばせるスピード型」',
        strategy: '【高配当のチャンス】高速馬場＝内有利という先入観を捨ててください。レコード決着などの高速戦で、外から飛んでくるスピード馬が穴を開けます。'
      };
      break;

    default:
      result = {
        title: '【フラット】標準的な馬場状態',
        summary: '極端な有利不利は見られません。',
        targetHorse: '能力比較（センターピン）を重視',
        strategy: 'トラックバイアスによる補正は行わず、個体の能力比較（近5走の手動補正済み実績）を優先して予想を組み立ててください。'
      };
  }

  // AIっぽく見せるために、少し整形してテキストで返す
  return `
### ${result.title}

**📊 環境分析**
${result.summary}

**🐎 有利なタイプ（狙い馬）**
${result.targetHorse}

**💰 投資戦略（アクションプラン）**
${result.strategy}
  `.trim();
};

/**
 * ダート解析ロジック（「海辺の波打ち際」理論）
 */
const analyzeDirtLogic = (condition: string): string => {
  if (condition.includes('良')) {
    return `
### ダート（パサパサの砂浜）
**📊 環境分析**
[cite_start]砂が乾燥しており、足が沈み込みます。パワーが要求される条件です。[cite: 17]
**🐎 狙い目**
スピードよりも「パワー」と「スタミナ」のある大型馬を優遇してください。
    `.trim();
  } else if (condition.includes('不良')) {
    return `
### ダート（水の中・泥沼）
**📊 環境分析**
[cite_start]水浸しで足を取られるタフな状態です。また、泥はね（キックバック）が激しくなります。[cite: 19]
**🐎 狙い目**
「特殊な泥被り適性」が問われます。泥を嫌がらない精神力の強い馬や、逃げて泥を被らない馬を狙ってください。
    `.trim();
  } else {
    // 稍重〜重
    return `
### ダート（海辺の波打ち際）
**📊 環境分析**
[cite_start]適度な水分で砂が締まり、脚抜きが良くなっています。高速決着になりやすい「高速ダート」です。[cite: 18]
**🐎 狙い目**
パワーよりも「スピード」優先です。持ち時計のある馬や、芝スタートの馬を狙ってください。
    `.trim();
  }
};
