/**
 * ========================================================================================
 * QUESTION-ANSWER REGISTRY
 * ========================================================================================
 *
 * Hệ thống quản lý TẤT CẢ câu hỏi từ bot và câu trả lời tương ứng.
 * Mỗi câu hỏi bot đặt ra đều phải có handler xử lý câu trả lời của user.
 *
 * CẤU TRÚC:
 * - patterns: RegExp để nhận diện câu hỏi của bot
 * - possibleAnswers: Các câu trả lời có thể có từ user
 * - handler: Function xử lý câu trả lời cụ thể
 */

export type UserAnswerContext = {
  userAnswer: string;
  normalizedAnswer: string;
  botQuestion: string;
  lastBotMessage?: string;
};

export type QuestionHandler = {
  id: string;
  botQuestionPatterns: RegExp[];
  description: string;
  handler: (ctx: UserAnswerContext) => string | null;
};

// ===========================
// HELPER FUNCTIONS
// ===========================

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * 🔥 FUZZY MATCHING - So khớp mềm cho nhiều cách nói
 */
function fuzzyMatch(text: string, patterns: string[][]): boolean {
  const normalized = normalizeText(text);
  const tokens = normalized.split(/\s+/);

  // Kiểm tra xem text có chứa ít nhất 1 từ trong mỗi nhóm patterns
  for (const patternGroup of patterns) {
    const hasMatch = patternGroup.some((keyword) => {
      // Exact match
      if (normalized.includes(keyword)) return true;
      // Token match
      if (tokens.some((token) => token === keyword)) return true;
      // Partial match (for longer keywords)
      if (
        keyword.length > 3 &&
        tokens.some(
          (token) => token.includes(keyword) || keyword.includes(token)
        )
      )
        return true;
      return false;
    });
    if (hasMatch) return true;
  }
  return false;
}

/**
 * 🎯 Yes/No detection - Hỗ trợ NHIỀU cách nói của người Việt
 */
function isAffirmative(text: string): boolean {
  const normalized = normalizeText(text);

  // Danh sách mở rộng các cách nói "có"
  const yesPatterns = [
    // Trực tiếp
    /\b(co|có|duoc|được|dc)\b/,
    // Đồng ý
    /\b(ok|oke|okie|okay|okê|yes|yep|yeah|uh|uhm|um)\b/,
    // Xác nhận
    /\b(dung|đúng|dung roi|đúng rồi|chinh xac|chính xác)\b/,
    // Lịch sự
    /\b(vâng|vang|da|dạ|a|ạ|vâng ạ|dạ vâng)\b/,
    // Muốn/cần
    /\b(muon|muốn|can|cần|mong muon|mong muốn)\b/,
    // Đồng ý gián tiếp
    /\b(tot|tốt|hay|duoc day|được đấy|duoc nhe|được nhé)\b/,
    // Câu ngắn xác nhận
    /^(co|có|duoc|được|ok|dung|đúng|vâng|da|dạ)$/,
  ];

  // Kiểm tra độ dài (câu ngắn có khả năng cao là yes)
  const isShort = normalized.length <= 50;

  // Kiểm tra patterns
  const hasYesWord = yesPatterns.some((pattern) => pattern.test(normalized));

  // Nếu là câu ngắn VÀ có từ yes → 90% là yes
  if (isShort && hasYesWord) return true;

  // Nếu câu dài hơn, cần chắc chắn hơn
  if (hasYesWord && !isNegative(text)) return true;

  return false;
}

function isNegative(text: string): boolean {
  const normalized = normalizeText(text);

  // Danh sách mở rộng các cách nói "không"
  const noPatterns = [
    // Trực tiếp
    /\b(khong|không|ko|k)\b/,
    // Chưa
    /\b(chua|chưa)\b/,
    // Từ chối
    /\b(no|nope|nah)\b/,
    // Không muốn/cần
    /\b(khong muon|không muốn|ko muon|khong can|không cần|ko can)\b/,
    // Từ chối lịch sự
    /\b(thoi|thôi|thoi khoi|thôi khỏi|de sau|để sau|lan khac|lần khác)\b/,
    // Phủ định mạnh
    /\b(chua bao gio|chưa bao giờ|khong bao gio|không bao giờ)\b/,
    // Câu ngắn phủ định
    /^(khong|không|ko|k|chua|chưa|thoi|thôi)$/,
  ];

  const isShort = normalized.length <= 50;
  const hasNoWord = noPatterns.some((pattern) => pattern.test(normalized));

  if (isShort && hasNoWord) return true;
  if (hasNoWord && !isAffirmative(text)) return true;

  return false;
}

function extractNumber(text: string): number | null {
  const match = text.match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : null;
}

// ===========================
// QUESTION HANDLERS REGISTRY
// ===========================

export const questionHandlers: QuestionHandler[] = [
  // ========================================
  // 1. CÂU HỎI VỀ NHIỆT ĐỘ SỐT
  // ========================================
  {
    id: "fever_temperature",
    botQuestionPatterns: [
      /Sốt bao nhiêu độ\?/i,
      /nhiệt độ cụ thể/i,
      /cho tôi biết nhiệt độ/i,
      /Bạn có thể cho tôi biết nhiệt độ cụ thể không\?/i,
    ],
    description: "Bot hỏi nhiệt độ sốt cụ thể",
    handler: (ctx) => {
      let temp = extractNumber(ctx.userAnswer);

      // 🔥 XỬ LÝ CÂU TRẢ LỜI CHỈ CÓ SỐ (như "39", "38.5", "39 độ")
      if (!temp) {
        const match = ctx.userAnswer.match(/(\d+\.?\d*)\s*(do|độ|c|°c)?/i);
        if (match) {
          const num = parseFloat(match[1]);
          // Nhiệt độ cơ thể hợp lý: 35-42°C
          if (num >= 35 && num <= 42) {
            temp = num;
          }
        }
      }

      // 🔥 PHÁT HIỆN USER TRẢ LỜI VỀ SỐ NGÀY KHI HỎI VỀ NHIỆT ĐỘ
      const seemsLikeDays = /\b(\d+)\s*(ngay|ngày|day)\b/i.test(ctx.userAnswer);
      const justNumber = /^\d+$/.test(ctx.userAnswer.trim());

      if (
        (seemsLikeDays || (justNumber && !temp)) &&
        ctx.userAnswer.length < 10
      ) {
        const daysMatch = ctx.userAnswer.match(/(\d+)/);
        if (daysMatch) {
          const num = parseInt(daysMatch[1]);
          // Nếu số này có thể là số ngày (3-30 thường gặp)
          if (num >= 1 && num <= 30 && num !== 38 && num !== 39 && num !== 40) {
            return `Tôi hiểu bạn muốn nói về **thời gian sốt ${num} ngày** - đây là thông tin quan trọng!\n\n💡 Nhưng để tư vấn chính xác, tôi cần biết thêm **nhiệt độ sốt cao nhất** là bao nhiêu độ?\n\nVí dụ: "sốt 39 độ", "38.5", "40°C"\n\nNhiệt độ giúp tôi đánh giá mức độ nghiêm trọng! 🌡️`;
          }
        }
      }

      if (temp && temp >= 35 && temp <= 42) {
        if (temp >= 39) {
          return `🌡️ **Sốt ${temp}°C là MỨC ĐỘ NẶNG!**\n\n⚠️ **CẦN LÀM NGAY:**\n• ĐI KHÁM NGAY trong vòng 2-4 giờ\n• Uống paracetamol 500mg nếu sốt >38.5°C\n• Chườm mát, uống nhiều nước\n• KHÔNG tắm nước lạnh\n\n🚨 **ĐI CẤP CỨU NGAY nếu:**\n• Sốt >40°C\n• Co giật, lơ mơ\n• Khó thở, nhịp tim nhanh\n\nSốt được mấy ngày rồi? Bạn đã dùng thuốc hạ sốt chưa?`;
        } else if (temp >= 38.5) {
          return `🌡️ **Sốt ${temp}°C là mức độ VỪA PHẢI**\n\n💊 **Xử trí:**\n• Có thể dùng thuốc hạ sốt (paracetamol 500mg)\n• Uống nhiều nước (2-3 lít/ngày)\n• Chườm mát trán, nách\n• Theo dõi nhiệt độ mỗi 4-6 giờ\n\n🏥 **Nên đi khám nếu:**\n• Sốt kéo dài >3 ngày\n• Có đau đầu dữ dội, nôn\n• Khó thở, đau ngực\n\nSốt được mấy ngày rồi? Có triệu chứng khác không?`;
        } else if (temp >= 38) {
          return `🌡️ **Sốt ${temp}°C là mức độ NHẸ**\n\n✅ **Xử trí tại nhà:**\n• Chưa cần dùng thuốc ngay\n• Nghỉ ngơi, uống nhiều nước\n• Theo dõi nhiệt độ mỗi 4-6 giờ\n• Ăn nhẹ, dễ tiêu\n\n📋 **Dùng thuốc hạ sốt nếu:**\n• Sốt >38.5°C\n• Cảm thấy khó chịu nhiều\n• Có tiền sử co giật\n\nSốt được mấy ngày rồi? Có triệu chứng đi kèm không?`;
        } else {
          return `🌡️ **${temp}°C là nhiệt độ BÌNH THƯỜNG đến hơi tăng nhẹ**\n\n💡 **Lưu ý:**\n• 37-37.5°C là bình thường\n• Buổi chiều/tối thường cao hơn buổi sáng 0.5-1°C\n• Sau ăn, vận động có thể tăng nhẹ\n\n✅ **Chưa cần lo lắng nếu:**\n• Không có triệu chứng bất thường\n• Ăn uống bình thường\n• Không mệt mỏi\n\nBạn có triệu chứng gì khác không? (đau, ho, mệt...)`;
        }
      }

      // Không có số hoặc số không hợp lý
      return "Bạn có thể cho tôi biết nhiệt độ cụ thể không? Ví dụ: '38.5 độ' hoặc '39 độ'. Điều này giúp tôi đánh giá chính xác mức độ nghiêm trọng! 🌡️";
    },
  },

  // ========================================
  // 2. CÂU HỎI VỀ THỜI GIAN SỐT
  // ========================================
  {
    id: "fever_duration",
    botQuestionPatterns: [
      /Sốt được mấy ngày/i,
      /sốt được bao lâu/i,
      /sốt từ khi nào/i,
      /mấy ngày rồi/i,
      /bao lâu rồi/i,
    ],
    description: "Bot hỏi thời gian sốt bao lâu",
    handler: (ctx) => {
      let days = extractNumber(ctx.userAnswer);
      const normalized = normalizeText(ctx.userAnswer);

      // 🔥 XỬ LÝ CÂU TRẢ LỜI NHIỀU DẠNG:
      // - "3 ngày"
      // - "5"
      // - "sốt 3 ngày" ← THÊM MỚI!
      // - "sốt được 5 ngày"
      if (!days) {
        // Pattern 1: "sốt 3 ngày", "sốt 5 ngày", "sốt được 3 ngày"
        let match = ctx.userAnswer.match(
          /sốt\s*(?:được|duoc)?\s*(\d+)\s*(?:ngay|ngày)/i
        );
        if (match) {
          days = parseInt(match[1]);
        }

        // Pattern 2: "3 ngày", "5 ngày" (không có từ "sốt")
        if (!days) {
          match = ctx.userAnswer.match(/(\d+)\s*(?:ngay|ngày)/i);
          if (match) {
            days = parseInt(match[1]);
          }
        }

        // Pattern 3: Chỉ có số (như "3", "5")
        if (!days) {
          match = ctx.userAnswer.match(/^(\d+)$/);
          if (match) {
            const num = parseInt(match[1]);
            // Validate: số ngày hợp lý (1-365)
            if (num > 0 && num <= 365) {
              days = num;
            }
          }
        }
      }

      if (days && days > 0) {
        // 🔥 TRÍCH XUẤT NHIỆT ĐỘ TỪ LASTBOTMESSAGE (nếu có)
        let temperature: number | null = null;
        if (ctx.lastBotMessage) {
          // Tìm nhiệt độ trong message trước: "Sốt 42°C" hoặc "42°C"
          const tempMatch = ctx.lastBotMessage.match(
            /(\d+(?:\.\d+)?)\s*[°℃C]/i
          );
          if (tempMatch) {
            temperature = parseFloat(tempMatch[1]);
          }
        }

        // Tạo phân tích thời gian
        let durationAnalysis = "";

        if (days <= 2) {
          durationAnalysis = `📅 **Sốt ${days} ngày** - thời gian NGẮN:\n• Nhiễm virus (cảm cúm, COVID)\n• Nhiễm khuẩn đường hô hấp\n• Phản ứng vắc xin`;
        } else if (days <= 5) {
          durationAnalysis = `📅 **Sốt ${days} ngày** - CẦN CHÚ Ý:\n• Nhiễm khuẩn (họng, phổi, tiết niệu)\n• Viêm phổi nhẹ\n• Sốt xuất huyết (nếu khu vực dịch)`;
        } else if (days <= 10) {
          durationAnalysis = `📅 **Sốt ${days} ngày** - KÉO DÀI:\n• Nhiễm khuẩn nghiêm trọng\n• Sốt xuất huyết dengue\n• Sốt typhoid, lao\n• Viêm phổi`;
        } else {
          durationAnalysis = `📅 **Sốt ${days} ngày** - CỰC KỲ NGHIÊM TRỌNG:\n• Nhiễm khuẩn mạn tính (lao, nội tâm mạc)\n• Bệnh tự miễn (lupus)\n• Ung thư (lymphoma, bạch cầu)\n• Cần điều tra sâu`;
        }

        // 🔥 TỔNG HỢP KẾT LUẬN CUỐI CÙNG nếu có đủ thông tin (nhiệt độ + số ngày)
        if (temperature) {
          let finalConclusion = `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n✅ **TỔNG HỢP TÌNH TRẠNG:**\n• Nhiệt độ: **${temperature}°C**\n• Thời gian: **${days} ngày**\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

          // Quyết định mức độ nghiêm trọng dựa trên CẢ nhiệt độ VÀ số ngày
          if (
            temperature >= 40 ||
            days >= 7 ||
            (temperature >= 39 && days >= 4)
          ) {
            // CRITICAL
            finalConclusion += `🚨 **KẾT LUẬN: TÌNH TRẠNG NGHIÊM TRỌNG**\n\n**HÀNH ĐỘNG KHẨN CẤP:**\n🚑 ĐI CẤP CỨU HOẶC BỆNH VIỆN NGAY\n🩺 Xét nghiệm: WBC, CRP, cấy máu, X-quang\n💊 Có thể cần kháng sinh tĩnh mạch\n🏥 Chuẩn bị nhập viện điều trị\n\n**CẢNH BÁO ĐỎ - Đi cấp cứu NGAY nếu:**\n• Co giật, lơ mơ, mê sảng\n• Khó thở, tím môi\n• Đau ngực, tim đập nhanh >120\n• Nôn nhiều, không ăn uống được\n• Xuất huyết dưới da, chảy máu\n• Tiểu ít hoặc không tiểu\n\n⏰ **THỜI GIAN:** Đi NGAY BÂY GIỜ - đừng trì hoãn!\n\nChúc bạn mau khỏe! Hãy đi khám ngay nhé! 🩺`;
          } else if (temperature >= 38.5 || days >= 4) {
            // MODERATE-SEVERE
            finalConclusion += `⚠️ **KẾT LUẬN: CẦN ĐI KHÁM TRONG NGÀY**\n\n**HÀNH ĐỘNG CẦN LÀM:**\n🏥 Đi khám trong vòng 4-6 giờ\n🩺 Xét nghiệm máu: WBC, CRP, công thức máu\n💊 Uống paracetamol 500mg mỗi 6h khi sốt\n💧 Uống 2-3 lít nước/ngày\n� Nghỉ ngơi tuyệt đối\n\n**ĐI CẤP CỨU NGAY nếu:**\n• Sốt tăng lên >40°C\n• Khó thở, đau ngực\n• Đau đầu dữ dội\n• Nôn nhiều\n• Phát ban, chảy máu\n\n📞 **Lưu ý:** Mang theo:\n• Thẻ BHYT\n• Kết quả xét nghiệm cũ (nếu có)\n• Danh sách thuốc đang dùng\n\nHãy đi khám để an tâm! 😊`;
          } else {
            // MILD
            finalConclusion += `💡 **KẾT LUẬN: THEO DÕI TẠI NHÀ**\n\n**CHĂM SÓC TẠI NHÀ:**\n✅ Uống paracetamol 500mg khi sốt >38.5°C\n✅ Uống nhiều nước (2-3 lít/ngày)\n✅ Nghỉ ngơi, ngủ đủ giấc\n✅ Ăn nhẹ, dễ tiêu\n✅ Theo dõi nhiệt độ mỗi 4-6h\n\n**ĐI KHÁM nếu:**\n• Sốt không giảm sau 2 ngày nữa\n• Sốt tăng cao hơn (>39°C)\n• Xuất hiện triệu chứng mới (ho, đau, khó thở)\n• Mệt lả, không ăn được\n\nHy vọng bạn sớm bình phục! 🌟\nNếu có gì lo lắng, đừng ngại đi khám nhé! 🏥`;
          }

          return durationAnalysis + finalConclusion;
        }

        // Nếu chưa có nhiệt độ, chỉ trả về phân tích thời gian (KHÔNG hỏi lại nếu user đã cung cấp)
        return (
          durationAnalysis +
          `\n\n💡 Để tư vấn chính xác hơn, bạn có thể cho biết nhiệt độ cao nhất không? (Nếu đã nói ở tin nhắn trước thì bỏ qua câu này nhé!)`
        );
      }

      // Trả lời không có số cụ thể
      if (/\b(hom nay|hôm nay|moi|mới|vua|vừa)\b/.test(normalized)) {
        return "Hiểu rồi, sốt mới xuất hiện hôm nay. Bạn hãy theo dõi thêm và cho tôi biết nhiệt độ cao nhất được bao nhiêu nhé! Nếu sốt >39°C hoặc có triệu chứng nặng (khó thở, đau đầu dữ dội), cần đi khám ngay.";
      }

      return "Bạn có thể cho tôi biết sốt được bao lâu rồi không? Ví dụ: '2 ngày', '5 ngày', 'hôm nay mới sốt'. Điều này giúp tôi đánh giá nguy cơ!";
    },
  },

  // ========================================
  // 3. CÂU HỎI VỀ VỊ TRÍ ĐAU
  // ========================================
  {
    id: "pain_location",
    botQuestionPatterns: [
      /Đau ở đâu\?/i,
      /đau ở vị trí nào/i,
      /vị trí đau/i,
      /bạn đau.*đâu/i,
      /Bạn đau ở đâu\?/i,
      /Bạn đau ở vị trí nào/i,
      /Đau ở vết mổ hay vị trí khác\?/i,
      /Bạn đau ở đâu và đang dùng thuốc gì\?/i,
    ],
    description: "Bot hỏi vị trí đau",
    handler: (ctx) => {
      const normalized = normalizeText(ctx.userAnswer);

      // ĐAU HỌNG
      if (/\b(hong|họng|throat)\b/.test(normalized)) {
        return `😣 **Đau họng** với WBC cao thường do:\n\n🔍 **Nguyên nhân:**\n• Viêm họng virus (70%)\n• Viêm họng do liên cầu khuẩn (30%)\n• Viêm amidan\n\n🏥 **Cần khám nếu:**\n• Đau họng >3 ngày\n• Khó nuốt, sưng hạch cổ\n• Sốt >38.5°C\n• Có đốm trắng ở họng\n\n💊 **Xử trí:**\n• Súc miệng nước muối ấm\n• Uống nhiều nước\n• Có thể cần kháng sinh nếu nhiễm khuẩn\n\nBạn có nuốt khó, sốt cao không? Tôi sẽ tư vấn tiếp!`;
      }

      // ĐAU NGỰC
      if (/\b(nguc|ngực|chest|lung|phoi|phổi)\b/.test(normalized)) {
        return `😣 **Đau ngực** với WBC cao là DẤU HIỆU NGHIÊM TRỌNG!\n\n⚠️ **Nguy cơ:**\n• Viêm phổi\n• Viêm màng phổi\n• Viêm phế quản\n• (Hiếm: nhồi máu cơ tim, thuyên tắc phổi)\n\n🚨 **ĐI CẤP CỨU NGAY nếu:**\n• Đau ngực dữ dội, lan ra vai/cánh tay\n• Khó thở nặng\n• Đau tăng khi hít thở sâu\n• Nhịp tim nhanh, vã mồ hôi\n\n🏥 **Cần làm:**\n• X-quang phổi NGAY\n• Điện tâm đồ\n• Xét nghiệm troponin (nếu nghi tim)\n\nBạn có khó thở, ho ra máu không? Đây có thể là KHẨN CẤP!`;
      }

      // ĐAU BỤNG
      if (/\b(bung|bụng|abdomen|stomach|da day|dạ dày)\b/.test(normalized)) {
        return `😣 **Đau bụng** với WBC cao cần XÁC ĐỊNH VỊ TRÍ cụ thể!\n\n📍 **Đau bụng phải dưới:**\n• Viêm ruột thừa (cần mổ gấp!)\n• Viêm đường tiết niệu\n\n📍 **Đau bụng trên:**\n• Viêm dạ dày\n• Viêm tụy\n• Loét dạ dày\n\n📍 **Đau toàn bộ:**\n• Viêm phúc mạc (cực nguy hiểm!)\n• Viêm ruột\n\n🚨 **ĐI CẤP CỨU NGAY nếu:**\n• Đau dữ dội, không giảm\n• Nôn nhiều, bụng cứng\n• Sốt cao >39°C\n\nBạn đau ở vị trí cụ thể nào? (phải dưới, trái dưới, trên rốn...)`;
      }

      // ĐAU ĐẦU
      if (/\b(dau|đau|head|headache)\b/.test(normalized)) {
        return `😣 **Đau đầu** với WBC cao có thể do:\n\n🔍 **Nguyên nhân:**\n• Nhiễm trùng đường hô hấp (thường gặp)\n• Viêm xoang\n• Viêm màng não (hiếm nhưng nguy hiểm!)\n\n🚨 **ĐI CẤP CỨU NGAY nếu đau đầu kèm:**\n• Cứng gáy (không cúi cổ được)\n• Buồn nôn/nôn nhiều\n• Lú lẫn, co giật\n• Sốt cao >39°C\n\n✅ **Có thể tự theo dõi nếu:**\n• Đau đầu nhẹ/vừa\n• Không cứng gáy\n• Không buồn nôn\n\nBạn có cúi cổ xuống ngực được không? Có buồn nôn không?`;
      }

      // ĐAU KHỚP/CƠ
      if (/\b(khop|khớp|co|cơ|joint|muscle|chan|chân|tay)\b/.test(normalized)) {
        return `😣 **Đau khớp/cơ** với WBC cao có thể do:\n\n🔍 **Nguyên nhân:**\n• Nhiễm trùng virus (cảm cúm, dengue)\n• Viêm khớp nhiễm khuẩn (nguy hiểm!)\n• Viêm cơ\n• Phản ứng miễn dịch\n\n⚠️ **Cần khám GẤP nếu:**\n• Khớp sưng đỏ, nóng\n• Không cử động được khớp\n• Sốt cao >38.5°C\n• Đau 1 khớp (nghi nhiễm khuẩn khớp)\n\n✅ **Có thể theo dõi nếu:**\n• Đau nhiều khớp (cảm cúm)\n• Không sưng đỏ\n• Đau giảm dần\n\nKhớp có sưng đỏ không? Đau 1 hay nhiều khớp?`;
      }

      // ĐAU RĂNG/HÀM
      if (/\b(rang|răng|ham|hàm|tooth|jaw)\b/.test(normalized)) {
        return `😣 **Đau răng/hàm** với WBC cao thường do:\n\n🔍 **Nguyên nhân:**\n• Nhiễm trùng chân răng (áp xe)\n• Viêm tủy răng\n• Nhiễm trùng hàm (rất nguy hiểm!)\n\n🚨 **ĐI CẤP CỨU nếu:**\n• Sưng má/cổ nhiều\n• Khó nuốt, khó thở\n• Sốt cao >38.5°C\n\n🏥 **Nên khám nha khoa nếu:**\n• Đau 1 răng cụ thể\n• Sưng lợi\n• Ê buốt\n\n💡 **Tạm thời:**\n• Súc miệng nước muối ấm\n• Uống giảm đau (paracetamol)\n• KHÔNG tự ý uống kháng sinh\n\nRăng có sưng mủ không? Má có sưng to không?`;
      }

      // Không xác định được vị trí
      return `Tôi chưa xác định rõ vị trí đau của bạn. Bạn có thể cho biết cụ thể hơn không?\n\n📍 **Các vị trí thường gặp:**\n• Họng\n• Ngực/lưng\n• Bụng (phải dưới, trái dưới, trên rốn...)\n• Đầu\n• Khớp/cơ (chân, tay, lưng...)\n• Răng/hàm\n\nVui lòng mô tả rõ để tôi tư vấn chính xác!`;
    },
  },

  // ========================================
  // 4. CÂU HỎI VỀ MỨC ĐỘ ĐAU
  // ========================================
  {
    id: "pain_severity",
    botQuestionPatterns: [
      /Mức độ đau/i,
      /đau.*điểm/i,
      /1-10 điểm/i,
      /đau nhiều không/i,
      /Bạn đau ở vị trí nào và mức độ thế nào\?/i,
      /Mức độ đau: 1-10 điểm\?/i,
    ],
    description: "Bot hỏi mức độ đau (thang điểm)",
    handler: (ctx) => {
      const score = extractNumber(ctx.userAnswer);
      const normalized = normalizeText(ctx.userAnswer);

      if (score && score >= 0 && score <= 10) {
        if (score <= 3) {
          return `✅ **Đau nhẹ (${score}/10)** - có thể tự theo dõi\n\n💡 **Xử trí:**\n• Nghỉ ngơi, tránh vận động mạnh\n• Chườm ấm/lạnh (tùy vị trí)\n• Có thể dùng giảm đau nhẹ (paracetamol)\n\n🏥 **Theo dõi và đi khám nếu:**\n• Đau tăng dần\n• Xuất hiện triệu chứng mới\n• Đau không giảm sau 2-3 ngày\n\nBạn đau từ khi nào? Có triệu chứng khác không?`;
        } else if (score <= 6) {
          return `⚠️ **Đau vừa phải (${score}/10)** - nên đi khám trong 24-48h\n\n💊 **Xử trí:**\n• Dùng thuốc giảm đau theo chỉ định\n• Nghỉ ngơi tuyệt đối\n• Theo dõi sát\n\n🏥 **NÊN ĐI KHÁM để:**\n• Tìm nguyên nhân chính xác\n• Xét nghiệm thêm nếu cần\n• Được kê thuốc phù hợp\n\n🚨 **Đi NGAY nếu:**\n• Đau tăng nhanh\n• Sốt cao >39°C\n• Xuất hiện triệu chứng mới\n\nĐau tăng hay giảm theo thời gian? Có kèm sốt không?`;
        } else {
          return `🚨 **Đau nặng (${score}/10)** - CẦN KHÁM GẤP!\n\n⚠️ **Đây là MỨC ĐỘ NGHIÊM TRỌNG!**\n\n🚑 **KHUYẾN NGHỊ:**\n• ĐI CẤP CỨU hoặc gọi 115\n• Có thể cần nhập viện\n• Cần xét nghiệm và chẩn đoán hình ảnh ngay\n\n💊 **Tạm thời:**\n• KHÔNG tự ý dùng thuốc giảm đau mạnh\n• Nằm yên, tránh di chuyển nhiều\n• Ghi nhận thời điểm đau tăng\n\n📋 **Chuẩn bị khi đi:**\n• Phiếu xét nghiệm WBC\n• Danh sách thuốc đang dùng\n• Tiền sử bệnh\n\nBạn có thể đến bệnh viện ngay được không?`;
        }
      }

      // Trả lời bằng lời
      if (/\b(nhẹ|nhe|light|mild)\b/.test(normalized)) {
        return "Hiểu rồi, đau nhẹ là tốt! Bạn có thể theo dõi thêm. Nếu đau tăng hoặc có triệu chứng mới (sốt, sưng đỏ), hãy đi khám nhé!";
      }
      if (/\b(vua|vừa|trung binh|moderate)\b/.test(normalized)) {
        return "Đau vừa phải nên được kiểm tra. Tôi khuyên bạn đi khám trong 24-48h để tìm nguyên nhân và điều trị kịp thời!";
      }
      if (
        /\b(dữ dội|du doi|nang|nặng|severe|nhieu|nhiều|lam|làm|khó chịu)\b/.test(
          normalized
        )
      ) {
        return "🚨 Đau nặng cần được khám GẤP! Tôi khuyên bạn đi cấp cứu hoặc gặp bác sĩ TRONG NGÀY để tránh biến chứng!";
      }

      return "Bạn có thể đánh giá mức độ đau trên thang 0-10 không?\n• 0 = không đau\n• 1-3 = đau nhẹ\n• 4-6 = đau vừa\n• 7-10 = đau nặng\n\nHoặc mô tả: 'đau nhẹ', 'đau vừa', 'đau dữ dội'";
    },
  },

  // ========================================
  // 5. CÂU HỎI VỀ THỜI GIAN PHẪU THUẬT
  // ========================================
  {
    id: "surgery_timeline",
    botQuestionPatterns: [
      /Mổ được mấy ngày/i,
      /phẫu thuật được bao lâu/i,
      /mổ từ khi nào/i,
      /Mổ được mấy ngày rồi\?/i,
      /Bạn cần cho biết.*Mổ được mấy ngày\?/i,
    ],
    description: "Bot hỏi thời gian sau phẫu thuật",
    handler: (ctx) => {
      const days = extractNumber(ctx.userAnswer);
      const normalized = normalizeText(ctx.userAnswer);

      if (days && days > 0) {
        if (days <= 3) {
          return `🏥 **${days} ngày sau mổ** - giai đoạn QUAN TRỌNG!\n\n✅ **Bình thường trong 3 ngày đầu:**\n• WBC tăng 12-15 (phản ứng phẫu thuật)\n• Sốt nhẹ <38°C\n• Đau vết mổ giảm dần\n• Vết mổ khô, không chảy dịch\n\n⚠️ **CẢNH BÁO nhiễm trùng nếu:**\n• Sốt >38.5°C\n• Vết mổ đỏ, sưng, nóng\n• Chảy mủ, dịch vàng/xanh\n• Đau TĂNG thay vì giảm\n\n📋 **Cần biết thêm:**\n• Vết mổ trông thế nào? (khô, ướt, đỏ?)\n• Có sốt không? Bao nhiêu độ?\n• Đau tăng hay giảm?\n\nVui lòng mô tả để tôi đánh giá chính xác!`;
        } else if (days <= 7) {
          return `🏥 **${days} ngày sau mổ** - giai đoạn hồi phục\n\n✅ **Bình thường:**\n• WBC giảm dần về <12\n• Không sốt hoặc sốt rất nhẹ <37.5°C\n• Vết mổ khô, không đỏ\n• Đau giảm đáng kể\n\n⚠️ **CẦN KHÁM GẤP nếu:**\n• WBC vẫn >15\n• Sốt >38°C\n• Vết mổ có dấu hiệu nhiễm trùng:\n  - Đỏ, sưng, nóng\n  - Chảy mủ/dịch\n  - Mùi hôi\n• Đau tăng trở lại\n\n💡 **Khuyến nghị:**\n• Liên hệ bác sĩ phẫu thuật\n• Có thể cần kháng sinh\n• Tái khám sớm hơn lịch\n\nVết mổ hiện tại thế nào? Có dấu hiệu bất thường không?`;
        } else if (days <= 14) {
          return `🏥 **${days} ngày sau mổ** - WBC CAO bất thường!\n\n⚠️ **WBC cao sau >7 ngày là DẤU HIỆU LO NGẠI:**\n• Nhiễm trùng vết mổ muộn\n• Áp xe sâu\n• Nhiễm trùng nội tạng\n\n🚨 **CẦN LÀM NGAY:**\n• Liên hệ bác sĩ phẫu thuật TRONG NGÀY\n• Xét nghiệm:\n  - WBC phân loại\n  - CRP, PCT\n  - Cấy máu nếu sốt\n• Siêu âm/CT vết mổ\n• Có thể cần kháng sinh tĩnh mạch\n\n📋 **Chuẩn bị:**\n• Tất cả phiếu xét nghiệm\n• Danh sách thuốc đã dùng\n• Mô tả chi tiết triệu chứng\n\nBạn có sốt, đau tăng, hoặc vết mổ chảy dịch không?`;
        } else {
          return `🏥 **${days} ngày sau mổ** - WBC CAO NGHIÊM TRỌNG!\n\n🚨 **SAU 2 TUẦN MÀ WBC VẪN CAO LÀ BẤT THƯỜNG!**\n\n⚠️ **Nguyên nhân lo ngại:**\n• Nhiễm trùng mạn tính vết mổ\n• Áp xe ổ bụng\n• Nhiễm trùng huyết\n• Biến chứng nội tạng\n\n🚑 **PHẢI LÀM NGAY:**\n• GẶP BÁC SĨ PHẪU THUẬT KHẨN\n• Nhập viện để điều tra\n• CT scan toàn bộ\n• Cấy máu, nước tiểu\n• Kháng sinh mạnh tĩnh mạch\n\n📋 **Có thể cần:**\n• Mổ lại để dẫn lưu\n• Điều trị kéo dài\n• Theo dõi sát\n\nĐây là tình huống CẤP! Bạn cần đi bệnh viện NGAY!`;
        }
      }

      // Trả lời không rõ thời gian
      if (/\b(hom nay|hôm nay|moi|mới|vua|vừa)\b/.test(normalized)) {
        return "Mổ hôm nay à? WBC cao ngày đầu sau mổ là bình thường! Tuy nhiên vẫn cần theo dõi. Bạn có sốt cao (>38.5°C) hoặc vết mổ bất thường không?";
      }
      if (/\b(tuan|tuần|week)\b/.test(normalized)) {
        return "Mổ được khoảng 1 tuần rồi. WBC cao sau 7 ngày cần chú ý! Bạn có thể cho biết chính xác bao nhiêu ngày không? (ví dụ: 8 ngày, 10 ngày)";
      }

      return "Bạn có thể cho biết mổ được bao nhiêu ngày rồi không? Ví dụ: '3 ngày', '1 tuần', 'hôm qua mới mổ'. Thông tin này rất quan trọng để đánh giá!";
    },
  },

  // ========================================
  // 6. CÂU HỎI VỀ TÊN THUỐC ĐANG DÙNG
  // ========================================
  {
    id: "medication_name",
    botQuestionPatterns: [
      /Đang dùng thuốc gì\?/i,
      /tên thuốc/i,
      /thuốc gì/i,
      /loại thuốc nào/i,
      /bạn đang dùng thuốc/i,
      /Bạn đang dùng thuốc gì\?/i,
      /Tên thuốc đang dùng\?/i,
      /Tên thuốc cụ thể\?/i,
      /Đang dùng thuốc gì\? \(tên \+ liều\)/i,
    ],
    description: "Bot hỏi tên thuốc đang sử dụng",
    handler: (ctx) => {
      const normalized = normalizeText(ctx.userAnswer);

      // Không dùng thuốc
      if (/\b(khong|không|ko|chua|chưa|khong co|không có)\b/.test(normalized)) {
        return "Hiểu rồi, bạn không dùng thuốc. Điều này giúp loại trừ nguyên nhân do tác dụng phụ thuốc.\n\nVới WBC bất thường mà không dùng thuốc, nguyên nhân có thể do bệnh lý tự nhiên. Bạn có muốn tôi tư vấn thêm về xét nghiệm cần làm không?";
      }

      // CORTICOID (gây WBC cao)
      if (
        /\b(corticoid|prednisone|prednisolone|dexamethasone|methylprednisolone|hydrocortisone)\b/.test(
          normalized
        )
      ) {
        return `💊 **Corticoid** là thuốc GÂY WBC TĂNG CAO!\n\n✅ **Đây là tác dụng BÌNH THƯỜNG:**\n• Corticoid kích thích tủy xương sản xuất bạch cầu\n• WBC có thể tăng 15-20 khi dùng liều cao\n• Sẽ giảm dần khi ngừng thuốc\n\n⚠️ **LƯU Ý QUAN TRỌNG:**\n• KHÔNG tự ý ngừng thuốc đột ngột\n• Phải giảm liều từ từ theo chỉ định bác sĩ\n• Ngừng đột ngột có thể gây suy thượng thận\n\n📋 **Cần biết thêm:**\n• Dùng liều bao nhiêu? (mg/ngày)\n• Dùng được bao lâu rồi?\n• Bác sĩ kê cho bệnh gì?\n\nBạn dùng liều bao nhiêu mg/ngày?`;
      }

      // KHÁNG SINH (có thể gây WBC thấp hoặc cao)
      if (
        /\b(khang sinh|kháng sinh|antibiotic|amoxicillin|cephalexin|azithromycin|ciprofloxacin|chloramphenicol)\b/.test(
          normalized
        )
      ) {
        return `💊 **Kháng sinh** - cần KIỂM TRA LOẠI CỤ THỂ!\n\n⚠️ **Một số kháng sinh GÂY WBC THẤP:**\n• Chloramphenicol (rất nguy hiểm!)\n• Trimethoprim-sulfamethoxazole\n• Beta-lactam (hiếm)\n\n✅ **Đa số kháng sinh KHÔNG ảnh hưởng WBC**\n• Amoxicillin, cephalexin → an toàn\n• Azithromycin, ciprofloxacin → an toàn\n\n📋 **Cần biết:**\n• Tên chính xác kháng sinh nào?\n• Dùng được mấy ngày rồi?\n• Bác sĩ kê hay tự mua?\n• Có triệu chứng phụ gì không? (phát ban, ngứa)\n\nBạn có thể cho biết tên kháng sinh cụ thể không?`;
      }

      // THUỐC HÓA TRỊ (gây WBC thấp nghiêm trọng)
      if (
        /\b(hoa tri|hóa trị|chemo|chemotherapy|cisplatin|doxorubicin|methotrexate)\b/.test(
          normalized
        )
      ) {
        return `💊 **Hóa trị liệu** GÂY WBC THẤP NGHIÊM TRỌNG!\n\n⚠️ **Đây là tác dụng phụ THƯỜNG GẶP:**\n• WBC thường giảm sau 7-14 ngày hóa trị\n• Có thể xuống <2.0 (rất thấp!)\n• Tăng nguy cơ nhiễm trùng nặng\n\n🚨 **PHẢI THEO DÕI SÁT:**\n• Xét nghiệm WBC mỗi tuần\n• Có thể cần thuốc kích bạch cầu (G-CSF)\n• Tránh tiếp xúc người ốm\n• Gặp bác sĩ NGAY nếu sốt >38°C\n\n📋 **Bạn đang:**\n• Hóa trị loại gì?\n• Chu kỳ thứ mấy?\n• Bác sĩ có kê G-CSF không?\n\nBạn có triệu chứng gì không? (sốt, mệt, chảy máu...)`;
      }

      // THUỐC ỨC CHẾ MIỄN DỊCH
      if (
        /\b(uc che|ức chế|miễn dịch|azathioprine|cyclosporine|tacrolimus|mycophenolate)\b/.test(
          normalized
        )
      ) {
        return `💊 **Thuốc ức chế miễn dịch** GÂY WBC THẤP!\n\n⚠️ **Tác dụng phụ thường gặp:**\n• WBC thấp do ức chế tủy xương\n• Tăng nguy cơ nhiễm trùng\n• Cần theo dõi định kỳ\n\n🏥 **PHẢI LÀM:**\n• Xét nghiệm WBC mỗi 1-3 tháng\n• Báo bác sĩ nếu WBC <3.0\n• Có thể cần điều chỉnh liều\n\n📋 **Cần biết:**\n• Dùng cho bệnh gì? (ghép tạng, lupus, viêm khớp...)\n• Dùng được bao lâu?\n• WBC trước đây thế nào?\n\nBạn có triệu chứng nhiễm trùng không? (sốt, đau họng...)`;
      }

      // THUỐC GIẢM ĐAU/HẠ SỐT (NSAID)
      if (
        /\b(giam dau|giảm đau|ibuprofen|aspirin|paracetamol|acetaminophen|diclofenac)\b/.test(
          normalized
        )
      ) {
        return `💊 **Thuốc giảm đau/hạ sốt** - thường AN TOÀN với WBC\n\n✅ **Ít ảnh hưởng WBC:**\n• Paracetamol → rất an toàn\n• Ibuprofen, aspirin → an toàn ở liều thường\n\n⚠️ **Lưu ý:**\n• Dùng nhiều/lâu có thể gây tác dụng phụ\n• Không vượt quá liều khuyến cáo\n• Paracetamol: tối đa 4g/ngày\n• Ibuprofen: tối đa 2.4g/ngày\n\n📋 **WBC bất thường có thể do:**\n• KHÔNG phải thuốc giảm đau\n• Mà do NGUYÊN NHÂN khác đang điều trị\n\nBạn uống giảm đau cho triệu chứng gì? (đau đầu, sốt, đau bụng...)`;
      }

      // THUỐC CHỐNG ĐỘNG KINH
      if (
        /\b(dong kinh|động kinh|phenytoin|carbamazepine|valproic acid|lamotrigine)\b/.test(
          normalized
        )
      ) {
        return `💊 **Thuốc chống động kinh** - MỘT SỐ loại GÂY WBC THẤP!\n\n⚠️ **Thuốc NGUY HIỂM:**\n• Carbamazepine → có thể gây giảm WBC nghiêm trọng\n• Phenytoin → hiếm gặp nhưng nguy hiểm\n• Valproic acid → ít ảnh hưởng\n\n🏥 **CẦN LÀM:**\n• Báo bác sĩ thần kinh NGAY\n• Xét nghiệm WBC phân loại\n• Có thể cần đổi thuốc\n• KHÔNG tự ý ngừng thuốc (nguy hiểm co giật!)\n\n📋 **Cần biết:**\n• Tên thuốc cụ thể?\n• Dùng được bao lâu?\n• Có triệu chứng gì không? (sốt, đau họng, phát ban)\n\nVui lòng liên hệ bác sĩ điều trị GẤP!`;
      }

      // THUỐC KHÁC/KHÔNG RÕ
      return `Cảm ơn bạn đã chia sẻ! Để tôi đánh giá chính xác ảnh hưởng của thuốc đến WBC, bạn có thể cho biết:\n\n📋 **Thông tin cần thiết:**\n• Tên thuốc CHÍNH XÁC (ghi trên vỏ hộp)\n• Liều lượng (mg) và số lần uống/ngày\n• Dùng được bao lâu rồi?\n• Bác sĩ kê cho bệnh gì?\n\n💡 **Hoặc bạn có thể chụp vỏ hộp thuốc gửi cho bác sĩ để tư vấn chính xác hơn!**\n\nBạn có thể cung cấp tên thuốc cụ thể không?`;
    },
  },

  // ========================================
  // 7. CÂU HỎI VỀ LIỀU LƯỢNG THUỐC
  // ========================================
  {
    id: "medication_dosage",
    botQuestionPatterns: [
      /Liều lượng/i,
      /liều bao nhiêu/i,
      /uống.*mg/i,
      /dùng.*viên/i,
      /Liều lượng và dùng bao lâu\?/i,
      /Liều lượng và thời gian dùng\?/i,
      /Bạn dùng liều bao nhiêu mg\/ngày\?/i,
    ],
    description: "Bot hỏi liều lượng thuốc",
    handler: (ctx) => {
      const dose = extractNumber(ctx.userAnswer);
      const normalized = normalizeText(ctx.userAnswer);

      if (dose && dose > 0) {
        // CORTICOID
        if (
          ctx.lastBotMessage &&
          /corticoid|prednisone|prednisolone/i.test(ctx.lastBotMessage)
        ) {
          if (dose >= 40) {
            return `💊 **Liều ${dose}mg/ngày là LIỀU CAO!**\n\n⚠️ **Tác dụng phụ với liều cao:**\n• WBC tăng rất cao (15-25)\n• Tăng đường huyết\n• Tăng huyết áp\n• Loãng xương (nếu dùng lâu)\n\n✅ **Theo dõi cần thiết:**\n• Xét nghiệm WBC mỗi 2-4 tuần\n• Kiểm tra đường huyết\n• Không tự ý ngừng thuốc\n\n📋 **Khi nào giảm liều?**\n• Theo hướng dẫn bác sĩ\n• Thường giảm 5-10mg mỗi tuần\n\nBạn dùng cho bệnh gì? Dùng được bao lâu rồi?`;
          } else if (dose >= 20) {
            return `💊 **Liều ${dose}mg/ngày là liều VỪA PHẢI**\n\nĐây là liều điều trị thường gặp cho nhiều bệnh. WBC tăng là phản ứng bình thường.\n\n✅ **Lưu ý:**\n• Uống sau ăn sáng\n• Không bỏ liều\n• Giảm liều theo chỉ định bác sĩ\n\nBạn có tác dụng phụ gì không? (khó ngủ, tăng cân...)`;
          } else {
            return `💊 **Liều ${dose}mg/ngày là liều THẤP**\n\nLiều này ít ảnh hưởng đến WBC. Nếu WBC tăng nhiều, có thể do nguyên nhân khác.\n\nBạn có triệu chứng nhiễm trùng không? (sốt, đau...)`;
          }
        }

        // Generic response
        return `Liều ${dose}mg được ghi nhận. Để đánh giá chính xác, tôi cần biết:\n• Thuốc gì?\n• Uống mấy lần/ngày?\n• Dùng được bao lâu?\n\nBạn có thể bổ sung thông tin này không?`;
      }

      // Không có số cụ thể
      if (/\b(vien|viên|tablet|capsule)\b/.test(normalized)) {
        return "Bạn có thể xem trên vỏ hộp thuốc liều lượng mỗi viên là bao nhiêu mg không? (ví dụ: 5mg, 20mg, 500mg). Thông tin này giúp tôi đánh giá chính xác!";
      }

      return "Bạn có thể cho biết liều lượng cụ thể không?\n• Số mg mỗi viên?\n• Uống mấy viên/lần?\n• Uống mấy lần/ngày?\n\nVí dụ: 'Uống 20mg sáng 1 viên'";
    },
  },

  // ========================================
  // 8. CÂU HỎI VỀ MỨC ĐỘ MỆT MỎI
  // ========================================
  {
    id: "fatigue_level",
    botQuestionPatterns: [
      /Mệt cấp độ nào/i,
      /mệt như thế nào/i,
      /mệt nhiều không/i,
      /mức độ mệt/i,
      /Bạn có thể mô tả rõ hơn về tình trạng mệt mỏi không\?/i,
      /\(ngủ nhiều vẫn mệt\? không tập trung\?\)/i,
    ],
    description: "Bot hỏi mức độ mệt mỏi",
    handler: (ctx) => {
      const normalized = normalizeText(ctx.userAnswer);

      // MỆT NẶNG
      if (
        /\b(nang|nặng|lam|làm|khong duong|không đứng|khong di|không đi|chat vat|chật vật|severe|extreme)\b/.test(
          normalized
        )
      ) {
        return `😴 **Mệt mỏi NẶNG** với WBC bất thường là DẤU HIỆU NGHIÊM TRỌNG!\n\n🚨 **Nguyên nhân lo ngại:**\n• Thiếu máu nặng (HGB thấp)\n• Nhiễm trùng toàn thân\n• Suy tủy xương\n• Bệnh nội tiết (giáp, thượng thận)\n\n🏥 **CẦN KHÁM GẤP - làm thêm:**\n• Công thức máu đầy đủ (WBC, RBC, HGB, PLT)\n• Chức năng tuyến giáp (TSH, FT4)\n• Vitamin B12, acid folic\n• Chức năng gan, thận\n\n⚠️ **ĐI CẤP CỨU nếu:**\n• Không đứng nổi\n• Chóng mặt, ngất\n• Da tái, môi xanh\n• Đau ngực, khó thở\n\nBạn có triệu chứng nào trong số trên không?`;
      }

      // MỆT VỪA PHẢI
      if (/\b(vua|vừa|kha|khá|moderate|tired)\b/.test(normalized)) {
        return `😴 **Mệt mỏi VỪA PHẢI** cần tìm nguyên nhân\n\n🔍 **Có thể do:**\n• Thiếu máu nhẹ/vừa\n• Nhiễm trùng mạn tính\n• Thiếu vitamin (B12, D, sắt)\n• Rối loạn giấc ngủ\n• Stress kéo dài\n\n📋 **Nên làm thêm:**\n• Xét nghiệm HGB (huyết sắc tố)\n• Vitamin B12, D\n• Sắt huyết thanh, ferritin\n• Đường huyết\n\n💡 **Trong lúc chờ:**\n• Ngủ đủ 7-8 giờ/đêm\n• Ăn đầy đủ protein, rau xanh\n• Tránh stress\n• Uống đủ nước\n\nBạn ngủ được mấy giờ mỗi đêm? Ăn uống có đầy đủ không?`;
      }

      // MỆT NHẸ
      if (/\b(nhe|nhẹ|it|ít|chut|chút|mild|slight)\b/.test(normalized)) {
        return `😴 **Mệt mỏi NHẸ** - có thể do nguyên nhân lành tính\n\n✅ **Thường gặp:**\n• Thiếu ngủ\n• Stress công việc\n• Thiếu tập thể dục\n• Ăn uống không đủ chất\n\n💡 **Cải thiện bằng cách:**\n• Ngủ đủ giấc\n• Tập thể dục nhẹ 30 phút/ngày\n• Ăn đa dạng: thịt, cá, rau, trái cây\n• Giảm stress\n\n📋 **Nên khám nếu:**\n• Mệt kéo dài >2 tuần\n• Mệt tăng dần\n• Có triệu chứng khác (sốt, giảm cân...)\n\nBạn có triệu chứng nào khác không?`;
      }

      // NGỦ NHIỀU VẪN MỆT
      if (
        /\b(ngu nhieu|ngủ nhiều|ngu van met|ngủ vẫn mệt|sleep)\b/.test(
          normalized
        )
      ) {
        return `😴 **Ngủ nhiều vẫn mệt** là DẤU HIỆU BẤT THƯỜNG!\n\n🔍 **Nguyên nhân có thể:**\n• Thiếu máu (kiểm tra HGB)\n• Suy giáp (TSH cao)\n• Ngưng thở khi ngủ\n• Trầm cảm\n• Thiếu vitamin B12\n\n🏥 **Nên khám và làm:**\n• Xét nghiệm máu: HGB, TSH, B12\n• Đánh giá giấc ngủ\n• Khám tâm thần nếu cần\n\n📋 **Câu hỏi:**\n• Có ngáy to, thở hổn hển khi ngủ không?\n• Có buồn chán, mất hứng thú không?\n• Da có nhợt nhạt không?\n\nBạn có triệu chứng nào trong số trên?`;
      }

      return "Bạn có thể mô tả rõ hơn mức độ mệt mỏi không?\n\n📊 **Ví dụ:**\n• Mệt nhẹ: Vẫn làm việc bình thường\n• Mệt vừa: Khó tập trung, muốn nghỉ sớm\n• Mệt nặng: Không đứng nổi, phải nằm\n\nHoặc:\n• Ngủ nhiều vẫn mệt?\n• Không tập trung?\n• Chóng mặt, hoa mắt?";
    },
  },

  // ========================================
  // 9. CÂU HỎI VỀ VỊ TRÍ CHẢY MÁU
  // ========================================
  {
    id: "bleeding_location",
    botQuestionPatterns: [
      /Chảy máu ở đâu/i,
      /vị trí chảy máu/i,
      /chảy máu.*ở/i,
      /bị chảy máu/i,
      /Chảy máu ở đâu\? \(cam, lợi, da, nội tạng\?\)/i,
      /Có bầm tím hoặc chảy máu bất thường không\?/i,
      /Có bầm tím\/chảy máu bất thường không\?/i,
    ],
    description: "Bot hỏi vị trí chảy máu",
    handler: (ctx) => {
      const normalized = normalizeText(ctx.userAnswer);

      // CHẢY MÁU CAM
      if (/\b(cam|mui|mũi|nose)\b/.test(normalized)) {
        return `🩸 **Chảy máu cam** với WBC thấp cần CHÚ Ý!\n\n⚠️ **Nguyên nhân:**\n• Tiểu cầu thấp (kiểm tra PLT)\n• WBC thấp + PLT thấp = suy tủy\n• Dùng thuốc chống đông\n• Huyết áp cao\n\n✅ **Xử trí tại nhà:**\n• Ngồi thẳng, cúi đầu về phía trước\n• Bóp chặt cánh mũi 10 phút\n• Chườm lạnh gáy\n• KHÔNG ngửa đầu ra sau\n\n🚨 **ĐI CẤP CỨU nếu:**\n• Chảy >20 phút không cầm\n• Chảy nhiều, nuốt phải máu\n• Chảy máu nhiều lần/ngày\n• Kèm chảy máu nơi khác\n\n📋 **Cần làm:**\n• Xét nghiệm tiểu cầu (PLT)\n• Đông máu (PT, aPTT)\n• Huyết áp\n\nBạn có chảy máu vị trí nào khác không?`;
      }

      // CHẢY MÁU LỢI/RĂNG
      if (
        /\b(loi|lợi|rang|răng|chan rang|chân răng|gum|tooth)\b/.test(normalized)
      ) {
        return `🩸 **Chảy máu lợi/răng** với WBC thấp CẦN KHÁM GẤP!\n\n⚠️ **Nguyên nhân:**\n• Tiểu cầu thấp (nghiêm trọng!)\n• Thiếu vitamin C, K\n• Viêm lợi + suy giảm miễn dịch\n\n🚨 **ĐI KHÁM NGAY nếu:**\n• Chảy máu tự nhiên (không chải răng)\n• Chảy nhiều, khó cầm\n• Lợi sưng tím, đỏ\n• Kèm chảy máu mũi hoặc bầm tím\n\n💊 **Xử trí tạm:**\n• Ngậm gạc sạch 10 phút\n• KHÔNG súc miệng mạnh\n• Ăn mềm, tránh thức ăn cứng\n• Uống vitamin C\n\n📋 **Cần làm:**\n• Xét nghiệm PLT (tiểu cầu)\n• Đông máu\n• Khám nha khoa\n\nBạn có bầm tím bất thường không?`;
      }

      // BẦM TÍM DA
      if (
        /\b(bam tim|bầm tím|dam tim|đầm tím|bruise|purple)\b/.test(normalized)
      ) {
        return `🩸 **Bầm tím da** với WBC thấp là DẤU HIỆU NGHIÊM TRỌNG!\n\n🚨 **Nguyên nhân nguy hiểm:**\n• Suy tủy xương (WBC + PLT thấp)\n• Bệnh bạch cầu cấp\n• Giảm tiểu cầu miễn dịch (ITP)\n• Thiếu vitamin K nghiêm trọng\n\n⚠️ **ĐI KHÁM GẤP nếu bầm tím:**\n• Xuất hiện tự nhiên (không va chạm)\n• Nhiều vết, lan rộng\n• Ở ngực, bụng (nguy hiểm!)\n• Kèm xuất huyết điểm (chấm đỏ nhỏ)\n\n🏥 **CẦN LÀM NGAY:**\n• Xét nghiệm PLT (tiểu cầu)\n• Đông máu (PT, aPTT)\n• Có thể cần xét nghiệm tủy xương\n\n📋 **Hỏi thêm:**\n• Bầm tím ở đâu? (tay, chân, thân mình?)\n• Có mấy vết?\n• Xuất hiện bao lâu rồi?\n\nĐây là tình huống CẦN KHÁM GẤP!`;
      }

      // CHẢY MÁU TIÊU HÓA
      if (
        /\b(phan den|phân đen|non mau|nôn máu|blood stool|black stool)\b/.test(
          normalized
        )
      ) {
        return `🚨🚨 **Chảy máu tiêu hóa** là KHẨN CẤP TUYỆT ĐỐI!\n\n⚠️ **DẤU HIỆU NGUY CẤP:**\n• Phân đen = chảy máu dạ dày/ruột non\n• Nôn máu = chảy máu dạ dày\n• Phân có máu đỏ = chảy máu ruột già\n\n🚑 **GỌI 115 HOẶC ĐI CẤP CỨU NGAY:**\n• KHÔNG tự đi (cần xe cấp cứu)\n• Nằm yên, không ăn uống\n• Chuẩn bị nhập viện\n\n🏥 **Sẽ cần:**\n• Nội soi dạ dày khẩn\n• Truyền máu\n• Cầm máu nội soi\n• Theo dõi ICU\n\n📋 **Nguyên nhân với WBC thấp:**\n• Suy tủy xương + loét dạ dày\n• Dùng thuốc chống đông + loét\n• Bệnh gan + giảm tiểu cầu\n\nĐây là KHẨN CẤP! Hãy gọi 115 NGAY!`;
      }

      // XUẤT HUYẾT ĐIỂM (PETECHIAE)
      if (
        /\b(cham do|chấm đỏ|diem do|điểm đỏ|xuat huyet diem|xuất huyết điểm|petechiae)\b/.test(
          normalized
        )
      ) {
        return `🚨 **Xuất huyết điểm** là DẤU HIỆU CỰC KỲ NGUY HIỂM!\n\n⚠️ **Ý nghĩa:**\n• Tiểu cầu rất thấp (<20)\n• Nguy cơ chảy máu não\n• Cần cấp cứu NGAY\n\n🚑 **PHẢI LÀM NGAY LẬP TỨC:**\n• GỌI 115 hoặc ĐI CẤP CỨU\n• Xét nghiệm PLT khẩn\n• Có thể cần truyền tiểu cầu\n• Nhập viện điều trị\n\n🚨 **ĐẶC BIỆT NGUY HIỂM nếu:**\n• Xuất huyết điểm nhiều, lan rộng\n• Ở ngực, bụng\n• Kèm đau đầu dữ dội\n• Buồn nôn, lú lẫn\n\n📋 **Trong lúc chờ:**\n• Nằm yên\n• KHÔNG uống aspirin, ibuprofen\n• Tránh va chạm\n\nĐây là TÌNH HUỐNG KHẨN CẤP! Cần đi cấp cứu NGAY!`;
      }

      return `Tôi cần biết cụ thể vị trí chảy máu để tư vấn chính xác:\n\n📍 **Các vị trí thường gặp:**\n• Cam (mũi)\n• Lợi/răng\n• Bầm tím da\n• Chấm đỏ nhỏ (xuất huyết điểm)\n• Phân đen/nôn máu (tiêu hóa - KHẨN CẤP!)\n• Tiểu ra máu\n\nVui lòng mô tả cụ thể!`;
    },
  },

  // ========================================
  // 10. CÂU HỎI VỀ HO, KHÓ THỞ
  // ========================================
  {
    id: "cough_breathing",
    botQuestionPatterns: [
      /Có ho.*không/i,
      /có khó thở không/i,
      /ho.*khó thở/i,
      /triệu chứng hô hấp/i,
      /Có ho, khó thở không\?/i,
      /X-quang phổi nếu ho\/khó thở/i,
    ],
    description: "Bot hỏi về ho và khó thở",
    handler: (ctx) => {
      const normalized = normalizeText(ctx.userAnswer);

      // Có cả ho VÀ khó thở
      if (
        /\b(co|có)\b/.test(normalized) &&
        /\b(ho)\b/.test(normalized) &&
        /\b(kho tho|khó thở)\b/.test(normalized)
      ) {
        return `🚨 **Ho + khó thở** với WBC cao là DẤU HIỆU VIÊM PHỔI!\n\n⚠️ **Nguy cơ cao:**\n• Viêm phổi do vi khuẩn\n• Viêm phế quản cấp\n• COVID-19\n• Cần khám và điều trị GẤP\n\n🏥 **CẦN LÀM NGAY:**\n• ĐI KHÁM TRONG NGÀY\n• X-quang phổi\n• Xét nghiệm CRP\n• Có thể cần kháng sinh\n\n🚑 **ĐI CẤP CỨU nếu:**\n• Khó thở nặng, thở nhanh >25 lần/phút\n• Môi xanh, tím\n• Đau ngực khi thở\n• SpO2 <94% (nếu có máy đo)\n\n📋 **Cần biết thêm:**\n• Ho ra đờm không? Màu gì?\n• Có sốt không? Bao nhiêu độ?\n• Đau ngực khi thở không?\n\nBạn có thể đi khám ngay được không?`;
      }

      // CHỈ có ho
      if (
        /\b(co|có|co ho|có ho)\b/.test(normalized) &&
        /\b(ho|cough)\b/.test(normalized)
      ) {
        return `😷 **Ho** với WBC cao - cần phân loại\n\n🔍 **Ho khan (không đờm):**\n• Viêm họng\n• Viêm phế quản nhẹ\n• Dị ứng\n• Có thể do virus\n\n🔍 **Ho có đờm:**\n• Màu trắng/trong → virus\n• Màu vàng/xanh → vi khuẩn\n• Có máu → KHẨN CẤP!\n\n📋 **Cần biết:**\n• Ho khan hay có đờm?\n• Nếu có đờm, màu gì?\n• Ho được mấy ngày?\n• Ho nhiều buổi nào? (đêm? sáng?)\n\n🏥 **Nên khám nếu:**\n• Ho >7 ngày không giảm\n• Ho ra đờm vàng/xanh\n• Ho ra máu\n• Kèm sốt cao\n\nBạn ho có đờm không? Màu gì?`;
      }

      // CHỈ có khó thở
      if (
        /\b(co|có)\b/.test(normalized) &&
        /\b(kho tho|khó thở|shortness)\b/.test(normalized)
      ) {
        return `🚨 **Khó thở** với WBC bất thường là DẤU HIỆU NGUY HIỂM!\n\n⚠️ **Nguyên nhân có thể:**\n• Viêm phổi (không ho)\n• Suy tim\n• Thiếu máu nặng (nếu WBC thấp)\n• Thuyên tắc phổi (hiếm)\n\n🚑 **ĐI CẤP CỨU NGAY nếu:**\n• Khó thở nặng, không nói được câu dài\n• Thở nhanh >25 lần/phút\n• Môi xanh, tím\n• Đau ngực\n• Chóng mặt, ngất\n\n🏥 **Nên khám GẤP nếu:**\n• Khó thở khi gắng sức\n• Khó thở khi nằm xuống\n• Thở nhanh bất thường\n\n📋 **Cần làm:**\n• X-quang phổi NGAY\n• Đo SpO2\n• Điện tâm đồ\n• Xét nghiệm máu (WBC, HGB)\n\nBạn có đau ngực, chóng mặt không?`;
      }

      // KHÔNG ho, không khó thở
      if (/\b(khong|không|ko|chua|chưa)\b/.test(normalized)) {
        return "Tốt! Không có ho và khó thở giúp loại trừ các vấn đề về đường hô hấp.\n\nVới WBC bất thường, nguyên nhân có thể ở hệ thống khác. Bạn có triệu chứng nào khác không? (sốt, đau, mệt...)";
      }

      // HO RA MÁU
      if (/\b(ho.*mau|ho.*ra mau|hemoptysis)\b/.test(normalized)) {
        return `🚨🚨 **HO RA MÁU** là KHẨN CẤP TUYỆT ĐỐI!\n\n⚠️ **NGUY HIỂM CAO:**\n• Lao phổi\n• Viêm phổi nặng\n• Ung thư phổi\n• Thuyên tắc phổi\n• Dãn phế quản\n\n🚑 **GỌI 115 hoặc ĐI CẤP CỨU NGAY:\n• KHÔNG chậm trễ!\n• Ngồi thẳng, nghiêng về phía chảy máu\n• KHÔNG nằm ngửa\n• Ghi nhận lượng máu (ít/nhiều)\n\n🏥 **Sẽ cần:**\n• X-quang/CT phổi khẩn\n• Nội soi phế quản\n• Xét nghiệm đông máu\n• Có thể cần nhập viện\n\nĐây là KHẨN CẤP! Cần đi NGAY!`;
      }

      return "Bạn có thể mô tả rõ hơn về triệu chứng hô hấp không?\n\n📋 **Câu hỏi:**\n• Có ho không? (khan/có đờm/ra máu)\n• Có khó thở không? (nhẹ/nặng)\n• Ho được bao lâu?\n• Đờm màu gì? (trắng/vàng/xanh/có máu)";
    },
  },

  // ========================================
  // 11-20: CÁC HANDLERS KHÁC
  // ========================================
  // Tiếp tục với các câu hỏi về:
  // - Có muốn đặt lịch
  // - Có muốn hướng dẫn
  // - Có muốn tư vấn chế độ ăn
  // - Trực tuyến hay hotline
  // - Có muốn biết nguyên nhân
  // - v.v...
];

/**
 * 🔥 MAIN FUNCTION: Match bot question and get appropriate handler
 * Sử dụng fuzzy matching để tìm handler phù hợp nhất
 */
export function findQuestionHandler(
  botQuestion: string
): QuestionHandler | null {
  const normalizedQuestion = normalizeText(botQuestion);
  console.log("🔍 findQuestionHandler - botQuestion:", botQuestion);
  console.log(
    "🔍 findQuestionHandler - normalizedQuestion:",
    normalizedQuestion
  );

  // 🎯 Fuzzy keyword groups - Mở rộng khả năng nhận diện
  // ⚠️ LƯU Ý: Tránh dùng từ quá ngắn (1-2 chữ) để tránh false positive!
  const questionKeywords = {
    fever_temperature: [
      ["sot", "nhiet do", "bao nhieu do", "nhiet", "temperature", "sot cao"],
    ], // ❌ Removed "do" - too short, causes false matches
    fever_duration: [
      ["sot", "bao lau", "may ngay", "tu khi nao", "tu bao gio", "sot duoc"],
    ], // ❌ Removed "duoc" alone
    pain_location: [
      ["vi tri dau", "dau o dau", "location", "bi dau o", "dau noi nao"],
    ], // ❌ Removed "dau" alone - too short
    pain_severity: [
      [
        "muc do dau",
        "diem dau",
        "1-10",
        "dau nang",
        "dau nhe",
        "severity",
        "dau the nao",
      ],
    ],
    surgery_timeline: [
      ["mo duoc", "phau thuat", "mo may ngay", "bao lau sau mo", "surgery"],
    ],
    medication_name: [
      ["thuoc gi", "ten thuoc", "dang dung thuoc", "loai thuoc", "medication"],
    ],
    medication_dosage: [
      [
        "lieu luong",
        "lieu bao nhieu",
        "mg ngay",
        "vien ngay",
        "dosage",
        "uong bao nhieu",
      ],
    ],
    fatigue_level: [
      ["muc do met", "met nhu the nao", "fatigue", "tired", "met moi keo dai"],
    ],
    bleeding_location: [
      [
        "chay mau o dau",
        "vi tri chay mau",
        "bleeding location",
        "bam tim o dau",
      ],
    ],
    cough_breathing: [
      [
        "ho khan",
        "kho tho",
        "ho co dam",
        "breathing difficulty",
        "trieu chung ho hap",
      ],
    ],
  };

  // Thử fuzzy match với từng handler
  for (const handler of questionHandlers) {
    // Kiểm tra patterns gốc trước (exact match)
    for (const pattern of handler.botQuestionPatterns) {
      if (pattern.test(normalizedQuestion)) {
        console.log(
          "✅ EXACT MATCH - handler:",
          handler.id,
          "pattern:",
          pattern
        );
        return handler;
      }
    }

    // Nếu không match exact, thử fuzzy match
    const keywords =
      questionKeywords[handler.id as keyof typeof questionKeywords];
    if (keywords && fuzzyMatch(normalizedQuestion, keywords)) {
      console.log("✅ FUZZY MATCH - handler:", handler.id);
      return handler;
    }
  }

  console.log(
    "❌ NO MATCH - Available handlers:",
    questionHandlers.map((h) => h.id)
  );
  return null;
}

/**
 * Process user answer based on bot's last question
 */
export function processUserAnswer(
  userAnswer: string,
  botQuestion: string,
  lastBotMessage?: string
): string | null {
  console.log(
    "🎯 processUserAnswer called - userAnswer:",
    userAnswer,
    "botQuestion:",
    botQuestion
  );

  const handler = findQuestionHandler(botQuestion);

  if (!handler) {
    console.log("❌ processUserAnswer - No handler found");
    return null; // No specific handler found
  }

  console.log("✅ processUserAnswer - Handler found:", handler.id);

  const ctx: UserAnswerContext = {
    userAnswer,
    normalizedAnswer: normalizeText(userAnswer),
    botQuestion,
    lastBotMessage,
  };

  const result = handler.handler(ctx);
  console.log("📤 processUserAnswer result:", result ? "SUCCESS" : "NULL");
  return result;
}
