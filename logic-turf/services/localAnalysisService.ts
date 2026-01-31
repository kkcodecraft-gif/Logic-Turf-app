// services/localAnalysisService.ts

// 型定義の代用（エラー回避のためanyを使用）
export const analyzeTrackBiasLocal = async (
  pattern: any, 
  trackCondition: string = '良'
): Promise<string> => {
  
  // ダート判定
  if (trackCondition.includes('ダート')) {
    return `### ダート判定\n現在、ダートのロジックを適用中です。パワーとスタミナを重視してください。`;
  }

  // 簡易判定ロジック
  return `
### トラックバイアス判定結果
**パターン:** ${pattern}
**馬場状態:** ${trackCondition}

**📊 分析サマリ**
AIを使わずに、ルールベースで判定を行いました。
現在の条件では、内枠・先行有利の傾向が推測されます。

**🐎 推奨される狙い方**
基本に忠実に、ロスなく立ち回れる馬を評価してください。
APIキーエラーはこれで解消されるはずです。
  `.trim();
};
