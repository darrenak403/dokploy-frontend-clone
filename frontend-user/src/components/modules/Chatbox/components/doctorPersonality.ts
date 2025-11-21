/**
 * ========================================================================
 * 🩺 DOCTOR PERSONALITY ENGINE
 * ========================================================================
 *
 * Module này tạo ra tính cách của bác sĩ Dr.Meddy - một bác sĩ dày dạn kinh nghiệm
 * biết khi nào nên hỏi, khi nào nên kết thúc, và cách giao tiếp tự nhiên với bệnh nhân
 */

export type ConversationContext = {
  userMessage: string;
  botPreviousMessage?: string;
  conversationTurn: number; // Số lượt hội thoại
  hasProvidedValue: boolean; // Đã cung cấp giá trị xét nghiệm chưa
  hasAskedSymptoms: boolean; // Đã hỏi về triệu chứng chưa
  topic?: string; // Chủ đề đang bàn
};

/**
 * 🎯 Quyết định xem có nên hỏi tiếp hay kết thúc
 */
export function shouldAskFollowUp(ctx: ConversationContext): boolean {
  // Nếu đã hỏi quá 5 lần → nên kết thúc
  if (ctx.conversationTurn > 5) return false;

  // Nếu user đã cho thấy muốn kết thúc
  const normalized = ctx.userMessage
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
  const endingSignals =
    /\b(cam on|cảm ơn|thank|ok thoi|ok thôi|het|hết|xong|du roi|đủ rồi|bye)\b/;
  if (endingSignals.test(normalized)) return false;

  // Nếu chưa phân tích giá trị → nên hỏi
  if (!ctx.hasProvidedValue) return true;

  // Nếu đã phân tích giá trị bất thường nhưng chưa hỏi triệu chứng → nên hỏi
  if (ctx.hasProvidedValue && !ctx.hasAskedSymptoms) return true;

  // Mặc định: hỏi nếu chưa quá 3 lần
  return ctx.conversationTurn <= 3;
}

/**
 * 🎨 Tạo câu kết thúc tự nhiên (không phải lúc nào cũng hỏi)
 */
export function generateClosingStatement(
  result: string,
  context: ConversationContext
): string {
  const shouldAsk = shouldAskFollowUp(context);

  if (!shouldAsk) {
    // Kết thúc tự nhiên - KHÔNG hỏi thêm
    const closings = [
      "Chúc bạn sớm khỏe mạnh! 😊",
      "Nếu có gì thắc mắc, bạn cứ hỏi tôi bất cứ lúc nào nhé!",
      "Hãy chăm sóc sức khỏe thật tốt!",
      "Tôi luôn sẵn sàng hỗ trợ bạn khi cần! 🩺",
    ];
    const closing = closings[Math.floor(Math.random() * closings.length)];
    return `${result}\n\n${closing}`;
  }

  // Tiếp tục hội thoại - có thể hỏi thêm
  return result; // Giữ nguyên câu hỏi cuối nếu có
}

/**
 * 🗣️ Tạo câu hỏi follow-up tự nhiên dựa trên ngữ cảnh
 */
export function generateFollowUpQuestion(
  topic: string,
  severity: "normal" | "abnormal" | "critical"
): string {
  if (topic === "wbc-high" && severity === "critical") {
    return "Bạn có sốt cao hoặc đau ở đâu không? Tôi cần biết để tư vấn chính xác hơn.";
  }

  if (topic === "wbc-high" && severity === "abnormal") {
    return "Để tôi tư vấn chính xác, bạn có thể cho biết có triệu chứng gì đặc biệt không? (sốt, đau, mệt...)";
  }

  if (topic === "wbc-low") {
    return "Bạn có hay bị nhiễm trùng hoặc cảm thấy mệt mỏi kéo dài không?";
  }

  if (topic === "definition") {
    return "Bạn có muốn tôi kiểm tra giá trị WBC trong kết quả xét nghiệm của bạn không?";
  }

  return "Bạn có câu hỏi gì khác về kết quả xét nghiệm không?";
}

/**
 * 💬 Tạo câu trả lời theo phong cách bác sĩ thật
 * - Không cứng nhắc
 * - Biết khi nào nên hỏi, khi nào nên khẳng định
 * - Thể hiện sự quan tâm
 */
export function doctorSpeak(
  analysis: string,
  context: ConversationContext,
  needMoreInfo: boolean = false
): string {
  // Nếu cần thêm thông tin → hỏi trực tiếp
  if (needMoreInfo) {
    return analysis; // Giữ nguyên phần phân tích + câu hỏi
  }

  // Nếu phân tích đã đầy đủ → có thể kết thúc hoặc hỏi nhẹ
  const shouldContinue = shouldAskFollowUp(context);

  if (!shouldContinue) {
    // Thêm lời kết tự nhiên
    return generateClosingStatement(analysis, context);
  }

  // Tiếp tục hội thoại nhưng mềm mỏng hơn
  return analysis;
}

/**
 * 🎯 Phát hiện ý định kết thúc hội thoại
 */
export function detectConversationEnd(userMessage: string): boolean {
  const normalized = userMessage
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

  const endPatterns = [
    /\b(cam on|cảm ơn|thank you|thanks|tnx)\b.*\b(nhe|nhé|nha|nhá|a|ạ)\b/,
    /\b(ok thoi|ok thôi|oke thoi|oke thôi)\b/,
    /\b(het roi|hết rồi|du roi|đủ rồi|xong roi|xong rồi)\b/,
    /\b(khong con|không còn|khong can|không cần)\b.*\b(gi|gì|nua|nữa)\b/,
    /\b(bye|tam biet|tạm biệt|hen gap lai|hẹn gặp lại)\b/,
    /^(ok|oke|okie|cam on|cảm ơn|thank)$/,
  ];

  return endPatterns.some((pattern) => pattern.test(normalized));
}

/**
 * 🧠 Phân tích độ phức tạp của câu hỏi user
 */
export function analyzeQuestionComplexity(
  userMessage: string
): "simple" | "moderate" | "complex" {
  const normalized = userMessage.toLowerCase();
  const wordCount = normalized.split(/\s+/).length;

  // Câu ngắn < 5 từ
  if (wordCount < 5) return "simple";

  // Câu vừa 5-15 từ
  if (wordCount <= 15) return "moderate";

  // Câu dài > 15 từ
  return "complex";
}

/**
 * 🎭 Tone phù hợp với tình huống
 */
export function selectTone(severity: "normal" | "abnormal" | "critical"): {
  emoji: string;
  prefix: string;
} {
  switch (severity) {
    case "critical":
      return {
        emoji: "🚨",
        prefix: "**QUAN TRỌNG:**",
      };
    case "abnormal":
      return {
        emoji: "⚠️",
        prefix: "**Lưu ý:**",
      };
    default:
      return {
        emoji: "✅",
        prefix: "",
      };
  }
}

/**
 * 📊 Đếm số lần đã hỏi trong conversation
 */
export function countQuestions(conversationHistory: string[]): number {
  return conversationHistory.filter((msg) => msg.includes("?")).length;
}
