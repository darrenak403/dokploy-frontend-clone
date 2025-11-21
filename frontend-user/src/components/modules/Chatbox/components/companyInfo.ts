// ========================
// 🧠 LABMS - AI Training Data (Restructured)
// ========================
// Import Doctor Personality Engine
import { detectConversationEnd } from "./doctorPersonality";
/**
 * findContextualAnswer - xử lý câu trả lời ngắn dựa trên context câu hỏi trước
 */
import { processUserAnswer } from "./questionAnswerRegistry";
import {
  analyzeWBCValue,
  findWBCConversation,
  wbcConversations,
  wbcInfo,
} from "./wbcKnowledge";

// Re-export for use in other components
export { wbcInfo, wbcConversations, analyzeWBCValue, findWBCConversation };

// Note: shouldAskFollowUp, generateClosingStatement, ConversationContext
// sẽ được sử dụng trong các cải tiến tiếp theo

export const companyInfo = `
LABMS - Laboratory Management System
====================================

Tôi là **Dr.Meddy**, bác sĩ AI chuyên về xét nghiệm máu tại LabMS.  
Tôi đóng vai trò như một bác sĩ dày dặn kinh nghiệm, luôn sẵn sàng tư vấn và giải đáp mọi thắc mắc của bệnh nhân về kết quả xét nghiệm máu.

🩺 VAI TRÒ CỦA TÔI:
- Phân tích và giải thích 11 chỉ số máu cơ bản
- Tư vấn nguyên nhân khi chỉ số bất thường
- Dẫn dắt bệnh nhân hiểu rõ tình trạng sức khỏe
- Gợi ý hướng xử lý và theo dõi phù hợp

🔬 DỊCH VỤ XÉT NGHIỆM:
- Xét nghiệm máu: WBC, RBC, HGB, HCT, PLT, MCV, MCH, MCHC, LYM, MID, GRAN
- Tư vấn chi tiết về kết quả
- Theo dõi lịch sử xét nghiệm theo thời gian

📅 QUY TRÌNH:
1. Đăng ký và đặt lịch online  
2. Lấy mẫu máu tại phòng lab  
3. Xử lý và phân tích (1–7 ngày)  
4. Nhận kết quả và tư vấn từ Dr.Meddy  

  CÁCH TÔI TRẢ LỜI:
- Luôn ngắn gọn, súc tích, dễ hiểu
- Kết thúc mỗi câu trả lời bằng câu hỏi dẫn dắt
- Không vội kết luận, luôn hỏi thêm triệu chứng
- Phân tích kỹ trước khi từ chối câu hỏi "ngoài phạm vi"

🏥 LIÊN HỆ:
- Địa chỉ: 123 Đường ABC, Q1, TP.HCM  
- Giờ làm việc: T2–T7 (7:00–17:00), CN (7:00–12:00)  
- Hotline: 1900-xxxx  
- Email: info@labms.com

⚠️ LƯU Ý QUAN TRỌNG:
- Khi bệnh nhân hỏi về chỉ số, LUÔN hỏi thêm về triệu chứng và hoàn cảnh
- Không bao giờ kết thúc cuộc trò chuyện quá sớm
- Nếu không chắc chắn về intent, hãy phân tích kỹ ngữ cảnh trước khi trả lời
`;

export const labSystemKnowledge = {
  testTypes: ["Xét nghiệm máu"],
  services: [
    "Đặt lịch và tra kết quả xét nghiệm máu",
    "Giải thích chỉ số xét nghiệm máu",
    "Tư vấn sức khỏe dựa trên kết quả xét nghiệm",
  ],
  processes: [
    "Đăng ký tài khoản",
    "Đặt lịch online",
    "Lấy mẫu máu",
    "Xử lý và phân tích mẫu",
    "Trả kết quả và tư vấn AI",
  ],
  features: [
    "Phân tích tự động 11 chỉ số máu",
    "Đánh giá kết quả bình thường hoặc bất thường",
    "Gợi ý nguyên nhân và hướng xử lý",
    "Theo dõi lịch sử xét nghiệm máu theo thời gian",
  ],

  // =====================
  // 🧬 11 Blood Indicators
  // =====================
  bloodIndicators: {
    WBC: {
      name: "White Blood Cells (Bạch cầu)",
      range: "4.0–10.0 x10⁹/L",
      highCauses: "Nhiễm khuẩn, viêm, stress, hút thuốc, dị ứng.",
      lowCauses:
        "Giảm miễn dịch, dùng thuốc ức chế tủy, nhiễm virus (cúm, EBV).",
      advice:
        "Nếu cao → kiểm tra nhiễm trùng hoặc viêm. Nếu thấp → bổ sung dinh dưỡng, nghỉ ngơi, khám chuyên khoa huyết học.",
    },
    LYM: {
      name: "Lymphocytes (Lympho bào %)",
      range: "20.0–40.0%",
      highCauses: "Nhiễm virus, viêm mạn tính.",
      lowCauses: "Suy giảm miễn dịch, stress, dùng corticoid.",
      advice: "Duy trì nghỉ ngơi, tăng sức đề kháng, kiểm tra nếu kéo dài.",
    },
    MID: {
      name: "Monocytes (Bạch cầu đơn nhân %)",
      range: "3.0–15.0%",
      highCauses: "Nhiễm khuẩn mạn, lao, viêm gan.",
      lowCauses: "Thiếu máu hoặc dùng thuốc ức chế miễn dịch.",
      advice: "Theo dõi và khám nếu kết quả cao liên tục.",
    },
    GRAN: {
      name: "Granulocytes (Bạch cầu hạt %)",
      range: "50.0–70.0%",
      highCauses: "Nhiễm khuẩn cấp, stress, phản ứng viêm.",
      lowCauses: "Nhiễm virus, thiếu vitamin B12, suy tủy.",
      advice:
        "Nếu cao → theo dõi dấu hiệu nhiễm trùng. Nếu thấp → khám tổng quát.",
    },
    HGB: {
      name: "Hemoglobin (Huyết sắc tố)",
      range: "Nam: 130–175 g/L, Nữ: 120–155 g/L",
      highCauses: "Mất nước, bệnh phổi mạn, hút thuốc nhiều.",
      lowCauses: "Thiếu máu do thiếu sắt, chảy máu, bệnh thận.",
      advice: "Bổ sung sắt, ăn uống cân bằng, khám nếu Hb thấp kéo dài.",
    },
    RBC: {
      name: "Red Blood Cells (Hồng cầu)",
      range: "3.5–5.5 x10⁶/uL",
      highCauses: "Mất nước, bệnh tim, thiếu oxy mạn.",
      lowCauses: "Thiếu máu, chảy máu, thiếu vitamin B12.",
      advice: "Theo dõi nếu thấp, kết hợp đánh giá Hb và HCT.",
    },
    HCT: {
      name: "Hematocrit (Thể tích hồng cầu)",
      range: "37.0–54.0%",
      highCauses: "Mất nước, bệnh phổi, đa hồng cầu.",
      lowCauses: "Thiếu máu, dinh dưỡng kém.",
      advice: "Uống đủ nước, khám nếu thấp kéo dài.",
    },
    MCV: {
      name: "Mean Corpuscular Volume (Thể tích trung bình hồng cầu)",
      range: "80.0–100.0 fL",
      highCauses: "Thiếu vitamin B12 hoặc acid folic.",
      lowCauses: "Thiếu sắt hoặc bệnh mạn tính.",
      advice: "Cải thiện chế độ ăn, bổ sung vi chất cần thiết.",
    },
    MCH: {
      name: "Mean Corpuscular Hemoglobin (Lượng Hb trung bình/hồng cầu)",
      range: "27.0–34.0 pg",
      highCauses: "Ít gặp, có thể do thiếu oxy.",
      lowCauses: "Thiếu sắt, thiếu máu nhỏ hồng cầu.",
      advice: "Ăn thực phẩm giàu sắt, khám nếu chỉ số thấp.",
    },
    MCHC: {
      name: "Mean Corpuscular Hemoglobin Concentration (Nồng độ Hb trung bình/hồng cầu)",
      range: "320–360 g/L",
      highCauses: "Hiếm gặp, đôi khi do mất nước.",
      lowCauses: "Thiếu sắt, hồng cầu nhược sắc.",
      advice: "Bổ sung sắt và vitamin C để cải thiện hấp thu.",
    },
    PLT: {
      name: "Platelets (Tiểu cầu)",
      range: "150–400 x10⁹/L",
      highCauses: "Viêm, nhiễm khuẩn, mất máu, bệnh tủy.",
      lowCauses: "Thiếu vitamin B12, bệnh gan, tác dụng thuốc.",
      advice:
        "Nếu thấp → tránh va chạm, kiểm tra nguyên nhân. Nếu cao → kiểm tra viêm mạn.",
    },
  },

  // =====================
  // 🩸 Result Interpretation
  // =====================
  resultInterpretation: {
    allNormal:
      "✅ Tất cả 11 chỉ số đều trong giới hạn bình thường — sức khỏe ổn định, nên duy trì chế độ ăn uống và sinh hoạt điều độ.",
    slightAbnormal:
      "⚠️ Có 1–2 chỉ số lệch nhẹ khỏi giới hạn bình thường. Có thể do thiếu ngủ, stress, hoặc ăn uống không điều độ. Hãy tái kiểm tra sau vài ngày.",
    moderateAbnormal:
      "⚠️ Có 3–5 chỉ số lệch khỏi giới hạn. Có thể là dấu hiệu của thiếu máu, viêm nhẹ hoặc rối loạn chuyển hóa. Nên tái khám trong 1–2 tuần.",
    severeAbnormal:
      "🚨 Có trên 5 chỉ số bất thường — nên gặp bác sĩ chuyên khoa huyết học hoặc nội tổng quát để kiểm tra kỹ hơn.",
  },

  // =====================
  // ⚙️ AI Logic Guide
  // =====================
  aiLogic: {
    description:
      "Hướng dẫn AI cách phản hồi khi người dùng nhập chỉ số xét nghiệm máu.",
    rules: [
      "Trả lời ngắn gọn, trọng tâm, và luôn kết thúc câu trả lời bằng một câu hỏi để dẫn dắt cuộc trò chuyện tiếp theo.",
      "Khi user cung cấp giá trị: so sánh với range và nêu nguyên nhân + hướng xử lý, rồi hỏi bước tiếp.",
      "Nếu user trả lời ngắn (có/không) – xử lý theo ngữ cảnh câu hỏi trước; nếu không rõ intent, đưa gợi ý mẫu.",
      "Từ chối lịch sự với câu hỏi ngoài phạm vi LabMS.",
    ],
    example:
      "User: 'WBC của tôi là 12.5' → Bot: 'WBC của bạn hơi cao (4.0–10.0). Có thể do nhiễm khuẩn hoặc viêm; bạn có sốt hoặc đau họng không để tôi tư vấn bước tiếp theo?'",
  },
};

// --- Types used by the file ---
type Sample = { question: string; answer: string; topic: string };

const baseConversationSamples: Sample[] = [
  {
    question: "Bác sĩ ơi, chỉ số WBC là gì vậy?",
    answer:
      "WBC là Bạch cầu, phản ánh khả năng miễn dịch; nếu cao có thể do nhiễm khuẩn, nếu thấp có thể do suy giảm miễn dịch. Bạn có muốn tôi kiểm tra giá trị WBC trong kết quả của bạn không?",
    topic: "ý nghĩa chỉ số WBC",
  },
  {
    question: "WBC đo cái gì trong máu?",
    answer:
      "WBC (White Blood Cells) đo số lượng bạch cầu — tế bào bảo vệ cơ thể khỏi nhiễm trùng và bệnh tật. Bạn muốn biết WBC của bạn nằm trong khoảng nào không?",
    topic: "ý nghĩa chỉ số WBC",
  },
  {
    question: "Tại sao cần xét nghiệm WBC?",
    answer:
      "Xét nghiệm WBC giúp phát hiện nhiễm khuẩn, viêm, hoặc các bệnh lý huyết học sớm. Bạn có triệu chứng gì đặc biệt để tôi tư vấn thêm không?",
    topic: "ý nghĩa chỉ số WBC",
  },
  {
    question: "Khoảng bình thường của WBC là bao nhiêu?",
    answer:
      "Khoảng tham chiếu bình thường của WBC là 4.0–10.0 x10⁹/L. WBC hiện tại của bạn là bao nhiêu để tôi đánh giá giúp?",
    topic: "ý nghĩa chỉ số WBC",
  },

  // 2️⃣ Phân tích kết quả WBC cao
  {
    question: "WBC của tôi là 12.5, có sao không bác sĩ?",
    answer:
      "WBC = 12.5 cao hơn bình thường (4.0–10.0), có thể do nhiễm khuẩn hoặc viêm. Bạn có bị sốt hay đau họng gần đây không?",
    topic: "phân tích kết quả WBC",
  },
  {
    question: "WBC cao có nguy hiểm không?",
    answer:
      "WBC cao thường không nguy hiểm nếu chỉ tăng nhẹ do stress hoặc viêm tạm thời, nhưng nếu cao kéo dài cần xét nghiệm thêm. WBC của bạn hiện tại bao nhiêu?",
    topic: "phân tích kết quả WBC",
  },
  {
    question: "Tôi có WBC 15, nguyên nhân là gì?",
    answer:
      "WBC = 15 cao đáng kể, thường do nhiễm khuẩn cấp, viêm phổi, hoặc nhiễm trùng máu. Bạn có đau bụng, ho, hoặc sốt cao không?",
    topic: "phân tích kết quả WBC",
  },
  {
    question: "WBC cao liên quan đến bệnh gì?",
    answer:
      "WBC cao có thể liên quan đến nhiễm khuẩn, viêm, dị ứng, stress, hoặc trong một số trường hợp hiếm: bệnh tủy xương. Bạn muốn tôi giải thích thêm về các nguyên nhân này không?",
    topic: "phân tích kết quả WBC",
  },

  // 3️⃣ Phân tích kết quả WBC thấp
  {
    question: "WBC của tôi chỉ 3.2, có sao không?",
    answer:
      "WBC = 3.2 thấp hơn bình thường (4.0–10.0), có thể do suy giảm miễn dịch, nhiễm virus, hoặc tác dụng thuốc. Bạn có đang dùng thuốc gì đặc biệt không?",
    topic: "phân tích kết quả WBC",
  },
  {
    question: "WBC thấp có nguy hiểm không?",
    answer:
      "WBC thấp có thể làm giảm khả năng chống nhiễm trùng của cơ thể. Nếu thấp kéo dài, nên khám chuyên khoa huyết học. WBC của bạn hiện tại là bao nhiêu?",
    topic: "phân tích kết quả WBC",
  },
  {
    question: "Tại sao WBC của tôi giảm?",
    answer:
      "WBC giảm có thể do nhiễm virus (cúm, COVID), thiếu vitamin B12, hoặc dùng thuốc hóa trị/ức chế miễn dịch. Bạn có bị ốm hoặc dùng thuốc gì gần đây không?",
    topic: "phân tích kết quả WBC",
  },

  // 4️⃣ Triệu chứng lâm sàng liên quan WBC
  {
    question: "Tôi hay bị sốt, có liên quan đến WBC không?",
    answer:
      "Sốt thường đi kèm WBC cao khi cơ thể chống nhiễm trùng. Bạn có làm xét nghiệm máu gần đây để kiểm tra WBC không?",
    topic: "triệu chứng lâm sàng WBC",
  },
  {
    question: "Tôi dễ bị nhiễm trùng, WBC có thấp không?",
    answer:
      "Dễ bị nhiễm trùng có thể do WBC thấp hoặc chức năng bạch cầu kém. Bạn muốn tôi hướng dẫn xét nghiệm WBC không?",
    topic: "triệu chứng lâm sàng WBC",
  },
  {
    question: "Đau họng và sốt cao, WBC có liên quan không?",
    answer:
      "Đau họng + sốt cao thường làm tăng WBC do nhiễm khuẩn họng (strep throat). Bạn có thể làm xét nghiệm máu để xác định WBC và cần kháng sinh hay không?",
    topic: "triệu chứng lâm sàng WBC",
  },

  // 5️⃣ Tư vấn ăn uống / sinh hoạt cho WBC
  {
    question: "Làm sao để tăng WBC tự nhiên?",
    answer:
      "Để tăng WBC, bạn nên ăn thực phẩm giàu protein, vitamin C (cam, ớt chuông), vitamin E, và kẽm (hải sản, thịt). Bạn có muốn danh sách thực phẩm cụ thể không?",
    topic: "tư vấn ăn uống WBC",
  },
  {
    question: "Ăn gì để cải thiện WBC thấp?",
    answer:
      "WBC thấp cần bổ sung protein, vitamin B12, acid folic qua thịt, trứng, rau xanh đậm, và trái cây họ cam quýt. Bạn có đang ăn chay hay hạn chế thực phẩm nào không?",
    topic: "tư vấn ăn uống WBC",
  },
  {
    question: "Có cần kiêng gì khi WBC cao?",
    answer:
      "Khi WBC cao, nên hạn chế thực phẩm viêm nhiễm như đường, thức ăn chiên rán, rượu bia. Bạn có muốn hướng dẫn chế độ ăn chống viêm không?",
    topic: "tư vấn ăn uống WBC",
  },
  {
    question: "Stress có ảnh hưởng đến WBC không?",
    answer:
      "Stress kéo dài có thể làm tăng WBC tạm thời do hormone cortisol. Bạn có đang trong giai đoạn căng thẳng công việc hoặc học tập không?",
    topic: "tư vấn sinh hoạt WBC",
  },

  // 6️⃣ Quy trình xét nghiệm WBC
  {
    question: "Làm sao để xét nghiệm WBC?",
    answer:
      "Bạn có thể đặt lịch xét nghiệm máu tổng quát (bao gồm WBC) trên hệ thống LabMS. Bạn muốn tôi hướng dẫn đặt lịch không?",
    topic: "quy trình xét nghiệm WBC",
  },
  {
    question: "Xét nghiệm WBC bao lâu có kết quả?",
    answer:
      "Kết quả xét nghiệm máu (bao gồm WBC) thường có sau 1–3 ngày làm việc. Bạn muốn đặt lịch ngay bây giờ không?",
    topic: "quy trình xét nghiệm WBC",
  },
  {
    question: "Có cần nhịn ăn trước khi xét nghiệm WBC không?",
    answer:
      "Xét nghiệm WBC không cần nhịn ăn, nhưng nên tránh ăn quá no hoặc uống rượu trước 24h. Bạn có câu hỏi nào khác về chuẩn bị xét nghiệm không?",
    topic: "quy trình xét nghiệm WBC",
  },

  // 7️⃣ Tâm lý và theo dõi WBC
  {
    question: "Tôi lo lắng vì WBC hơi cao.",
    answer:
      "Đừng quá lo ❤️, WBC cao nhẹ thường do viêm tạm thời hoặc stress. Bạn có muốn tôi giải thích chi tiết hơn về nguyên nhân không?",
    topic: "tâm lý bệnh nhân WBC",
  },
  {
    question: "WBC bình thường thì có cần theo dõi không?",
    answer:
      "Nếu WBC bình thường và không có triệu chứng, chỉ cần kiểm tra định kỳ 6–12 tháng/lần. Bạn có muốn đặt nhắc lịch xét nghiệm không?",
    topic: "theo dõi sức khỏe WBC",
  },
  {
    question: "Nên xét nghiệm WBC bao lâu một lần?",
    answer:
      "Người khỏe mạnh nên xét nghiệm WBC 6–12 tháng/lần; nếu có bệnh mạn tính thì 3–6 tháng/lần. Bạn có tiền sử bệnh gì cần theo dõi không?",
    topic: "theo dõi sức khỏe WBC",
  },

  // 8️⃣ So sánh WBC với các chỉ số khác
  {
    question: "WBC cao nhưng các chỉ số khác bình thường, có sao không?",
    answer:
      "Nếu chỉ WBC cao mà các chỉ số khác bình thường, có thể do nhiễm trùng nhẹ hoặc stress. Bạn có muốn tôi xem thêm các chỉ số LYM, GRAN không?",
    topic: "phân tích đa chỉ số WBC",
  },
  {
    question: "WBC và LYM đều cao, nghĩa là gì?",
    answer:
      "WBC + LYM cao cùng lúc gợi ý nhiễm virus (cúm, COVID) hoặc viêm mạn tính. Bạn có bị ho, sốt hoặc mệt mỏi gần đây không?",
    topic: "phân tích đa chỉ số WBC",
  },
  {
    question: "WBC cao nhưng HGB thấp thì sao?",
    answer:
      "WBC cao + HGB thấp có thể do nhiễm trùng kết hợp thiếu máu. Bạn có cảm thấy mệt và chóng mặt không?",
    topic: "phân tích đa chỉ số WBC",
  },

  // 9️⃣ Các câu hỏi nâng cao về WBC
  {
    question: "WBC tăng đột ngột có nguy hiểm không?",
    answer:
      "WBC tăng đột ngột (VD từ 7 lên 15 trong vài ngày) cần đánh giá cấp cứu, có thể do nhiễm trùng nặng hoặc viêm phúc mạc. Bạn có đau bụng hoặc sốt cao không?",
    topic: "tình huống khẩn cấp WBC",
  },
  {
    question: "WBC giảm nhanh trong 1 tuần, nguyên nhân?",
    answer:
      "WBC giảm nhanh có thể do nhiễm virus mới, tác dụng thuốc, hoặc suy tủy xương. Bạn có dùng thuốc kháng sinh hoặc thuốc mới gần đây không?",
    topic: "tình huống khẩn cấp WBC",
  },
  {
    question: "WBC 20 trở lên có phải ung thư máu không?",
    answer:
      "WBC ≥ 20 cần đánh giá kỹ, thường do nhiễm trùng nặng trước tiên, chứ chưa chắc là ung thư máu. Bạn có triệu chứng như sụt cân, đổ mồ hôi đêm không?",
    topic: "tình huống khẩn cấp WBC",
  },

  // 🔟 Các câu hỏi tổng hợp (tư vấn phòng bệnh liên quan WBC)
  {
    question: "Làm sao để giữ WBC ổn định?",
    answer:
      "Để giữ WBC ổn định: ăn đủ chất, ngủ 7–8h/đêm, vận động nhẹ, tránh stress, và kiểm tra định kỳ. Bạn có muốn lịch theo dõi WBC hàng tháng không?",
    topic: "tư vấn phòng bệnh WBC",
  },
  {
    question: "Có thuốc nào giúp tăng WBC không?",
    answer:
      "Có thuốc kích thích tủy xương (G-CSF) dùng khi WBC quá thấp, nhưng chỉ dùng theo chỉ định bác sĩ. Bạn có đang điều trị bệnh gì cần tăng WBC không?",
    topic: "tư vấn phòng bệnh WBC",
  },
  {
    question: "WBC bị ảnh hưởng bởi thuốc nào?",
    answer:
      "Thuốc hóa trị, kháng sinh mạnh (chloramphenicol), thuốc chống động kinh có thể làm giảm WBC. Bạn có đang dùng loại thuốc nào trong số này không?",
    topic: "tư vấn phòng bệnh WBC",
  },
];

// ======= AUTO-GENERATE MANY WBC CONVERSATIONS (100-200) =======
// This generator produces deterministic variations so file stays compact but yields many training Q/A pairs.
// Each answer ends with a guiding question (per aiLogic rules) to make the model reply in conversational style.

function createWbcSamples(count: number): Sample[] {
  const subjects = [
    "WBC của tôi",
    "Chỉ số WBC",
    "Giá trị WBC tôi nhận được",
    "Kết quả WBC",
    "Mức WBC",
    "Số lượng bạch cầu của tôi",
  ];
  const phrasings = [
    "là {val}, có sao không?",
    "mình đo được {val}, cần làm gì?",
    "đang tăng ({val}), nguyên nhân có thể là gì?",
    "đang thấp ({val}), có đáng lo không?",
    "cho tôi biết ý nghĩa khi WBC = {val} được không?",
    "với WBC = {val} thì tôi nên làm gì tiếp theo?",
  ];
  const endings = [
    "Bạn có triệu chứng sốt hoặc đau họng không?",
    "Bạn có đang dùng thuốc hoặc bị nhiễm gần đây không?",
    "Bạn có muốn tôi so sánh với các chỉ số khác không?",
    "Bạn có muốn hướng dẫn ăn uống để cải thiện không?",
    "Bạn muốn tôi giải thích nguyên nhân chi tiết hơn không?",
  ];

  const samples: Sample[] = [];
  for (let i = 0; i < count; i++) {
    const subj = subjects[i % subjects.length];
    const phr = phrasings[i % phrasings.length];
    const offset = (i % 9) - 4;
    const base = 7.5;
    const valNum = +(base + offset * 0.8).toFixed(1);
    const q = `${subj} ${phr.replace("{val}", String(valNum))}`;
    let answerMain = "";
    if (valNum < 4.0) {
      answerMain = `WBC=${valNum} thấp hơn phạm vi tham chiếu (4.0–10.0). Thường gặp khi giảm miễn dịch hoặc sau nhiễm virus; nên theo dõi và xét nghiệm lại.`;
    } else if (valNum > 10.0) {
      answerMain = `WBC=${valNum} cao hơn phạm vi (4.0–10.0), gợi ý nhiễm khuẩn, viêm hoặc stress cấp; cần kiểm tra triệu chứng lâm sàng và có thể làm thêm xét nghiệm viêm.`;
    } else {
      answerMain = `WBC=${valNum} trong giới hạn bình thường (4.0–10.0). Nếu không có triệu chứng, chỉ cần theo dõi định kỳ.`;
    }
    const ending = endings[i % endings.length];
    const answer = `${answerMain} ${ending}`;
    samples.push({ question: q, answer, topic: "WBC" });
  }
  return samples;
}

// generate 150 WBC samples (adjustable: set to 100 or 200 if needed)
export const wbcConversationSamples: Sample[] = createWbcSamples(150);

// final exported conversationSamples: base + WBC-focused set (WBC samples first to bias matching)
export const conversationSamples: Sample[] = [
  ...baseConversationSamples, // manual samples first (higher quality)
  ...wbcConversationSamples, // auto-generated samples second
];

// ======= ADDED: ready-to-send seed prompt (string) for model/context =======

export const conversationSeed: string = (() => {
  const maxExamples = 12;
  const examples = conversationSamples
    .slice(0, maxExamples)
    .map((s) => `Q: ${s.question}\nA: ${s.answer}`)
    .join("\n\n");

  return [
    "SYSTEM INSTRUCTIONS:",
    "You are Dr.Meddy — a conversational clinical assistant for LabMS.",
    "Goal: answer concisely and on-topic, then always end the reply with a question to continue the conversation.",
    "If user's query matches or closely paraphrases an example, prefer the example answer (adapted to specifics) and keep the closing question.",
    "Do NOT use a generic 'Bạn có muốn tìm hiểu thêm...' prompt unless it's a genuine invitation for follow-up.",
    "",
    "CONTEXT:",
    companyInfo,
    "",
    "EXAMPLES:",
    examples,
    "",
    "GUIDELINES:",
    "- Keep replies focused and brief (1-3 sentences), then add a guiding question.",
    "- For numeric WBC values, compare with range 4.0–10.0 and state likely causes + next action, then ask a follow-up question.",
  ].join("\n\n");
})();

/**
 * extractLastBotQuestion - lấy câu hỏi cuối cùng từ bot reply
 */
export function extractLastBotQuestion(botMessage: string): string | null {
  const match = botMessage.match(/([^.!?]*\?)\s*$/);
  return match ? match[1].trim() : null;
}

export function findContextualAnswer(
  userAnswer: string,
  lastBotQuestion: string | null,
  lastBotMessage?: string
): string | null {
  // 🎯 PRIORITY 0: Kiểm tra xem user có muốn kết thúc hội thoại không
  if (detectConversationEnd(userAnswer)) {
    return "Cảm ơn bạn đã tin tưởng Dr.Meddy! 😊 Nếu sau này cần hỗ trợ về xét nghiệm máu, bạn cứ quay lại bất cứ lúc nào. Chúc bạn sức khỏe! 🩺";
  }

  // 🎯 PRIORITY 1: Check Question-Answer Registry first
  if (lastBotQuestion) {
    const registryAnswer = processUserAnswer(
      userAnswer,
      lastBotQuestion,
      lastBotMessage
    );
    if (registryAnswer) {
      console.log("✅ Registry found answer for:", lastBotQuestion);
      return registryAnswer;
    } else {
      console.log("❌ Registry NO answer for:", lastBotQuestion);
    }
  }
  if (!lastBotQuestion) return null;

  const normalize = (s: string) =>
    (s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const uaRaw = (userAnswer || "").trim();
  const ua = normalize(uaRaw);
  const lbq = normalize(lastBotQuestion);

  const uaTokens = ua.split(/\s+/).filter(Boolean);
  const lbqTokens = lbq.split(/\s+/).filter(Boolean);
  const tokenSetLbq = new Set(lbqTokens);

  const overlap = uaTokens.filter((t) => tokenSetLbq.has(t)).length;
  const overlapRatio = lbqTokens.length ? overlap / lbqTokens.length : 0;

  // 🎯 MỞ RỘNG danh sách yes/no
  const yesSet = new Set([
    "co",
    "có",
    "duoc",
    "được",
    "dc",
    "đc",
    "ok",
    "oke",
    "okie",
    "okay",
    "okê",
    "yes",
    "yep",
    "yeah",
    "uh",
    "uhm",
    "um",
    "dung",
    "đúng",
    "dungroi",
    "đúng rồi",
    "vâng",
    "vang",
    "da",
    "dạ",
    "a",
    "ạ",
    "muon",
    "muốn",
    "can",
    "cần",
    "tot",
    "tốt",
    "hay",
    "duocday",
    "được đấy",
    "chinhxac",
    "chính xác",
  ]);
  const noSet = new Set([
    "khong",
    "không",
    "ko",
    "k",
    "chua",
    "chưa",
    "no",
    "nope",
    "nah",
    "khongmuon",
    "không muốn",
    "ko muon",
    "khongcan",
    "không cần",
    "ko can",
    "thoi",
    "thôi",
    "thoikhoi",
    "thôi khỏi",
    "desau",
    "để sau",
    "lankhac",
    "lần khác",
  ]);

  const isShort = uaRaw.length <= 40;
  const isYes = isShort && uaTokens.some((t) => yesSet.has(t));
  const isNo = isShort && uaTokens.some((t) => noSet.has(t));
  const hasNumber = /\d+(\.\d+)?/.test(ua);

  let expected: string = "other";
  if (
    /\b(kiem tra|xem|danh gia|gui gia tri|gia tri|wbc|gia tri wbc|wbc cua)\b/.test(
      lbq
    )
  )
    expected = "value";
  else if (/\b(dat lich|dat lich xet nghiem|dat lich|dat)\b/.test(lbq))
    expected = "booking";
  else if (/\b(lien he|hotline|thong tin lien he|lienlac|lien lac)\b/.test(lbq))
    expected = "contact";
  else if (/\b(sot|dau hong|ho|trieu chung|met|dau bung|sot khong)\b/.test(lbq))
    expected = "symptom";
  else if (/\b(giai thich|y nghia|la gi|nguyen nhan)\b/.test(lbq))
    expected = "explain";
  else if (/\b(so sanh|so sanh voi|compare|lym|gran|hgb|chi so)\b/.test(lbq))
    expected = "compare";
  else if (/\b(huong dan|huong dan dat lich|huong dan cach)\b/.test(lbq))
    expected = "booking";

  // Compute additional similarity metrics (Jaccard) to detect near-meaning replies
  const uaTokenSet = new Set(uaTokens.filter((t) => t.length > 0));
  const lbqTokenSet = new Set(lbqTokens.filter((t) => t.length > 0));
  const intersectCount = Array.from(uaTokenSet).filter((t) =>
    lbqTokenSet.has(t)
  ).length;
  const unionCount = new Set([...uaTokenSet, ...lbqTokenSet]).size || 1;
  const jaccard = intersectCount / unionCount;

  // Decide whether the user's short reply aligns with the bot's last question intent
  const isAligned =
    // explicit yes/no or number when value expected
    isYes ||
    isNo ||
    (hasNumber && expected === "value") ||
    // token overlap or jaccard indicate semantic similarity
    overlapRatio >= 0.45 ||
    jaccard >= 0.35;

  if (isAligned) {
    // Aligned replies: answer according to expected intent
    if (isNo) {
      // ✅ Phân tích ngữ cảnh từ lastBotMessage
      const botAskedAboutSymptoms =
        lastBotMessage &&
        /\b(sốt|đau|triệu chứng|phẫu thuật|chấn thương|dùng thuốc)\b/i.test(
          lastBotMessage
        );
      const botAskedAboutHighWBC =
        lastBotMessage &&
        /\b(cao|tăng|WBC.*cao|WBC.*tăng)\b/i.test(lastBotMessage);
      const botAskedAboutLowWBC =
        lastBotMessage &&
        /\b(thấp|giảm|WBC.*thấp|WBC.*giảm)\b/i.test(lastBotMessage);

      // ✅ Nếu bot vừa hỏi về triệu chứng SAU KHI đã phân tích kết quả WBC
      if (
        botAskedAboutSymptoms &&
        (botAskedAboutHighWBC || botAskedAboutLowWBC)
      ) {
        if (botAskedAboutHighWBC) {
          // WBC cao nhưng KHÔNG có triệu chứng → tư vấn tiếp
          return "Hiểu rồi, không có triệu chứng là tốt! 😊\n\nVới WBC cao như vậy mà không có triệu chứng, có thể do:\n• Stress, căng thẳng gần đây\n• Tập thể dục cường độ cao\n• Hút thuốc lá\n• Phản ứng tạm thời của cơ thể\n\n💡 **Khuyến nghị:** Bạn nên theo dõi và xét nghiệm lại sau 1-2 tuần để xem WBC có giảm về bình thường không. Nếu vẫn cao, nên gặp bác sĩ để kiểm tra kỹ hơn.\n\nBạn có muốn tôi hướng dẫn đặt lịch xét nghiệm lại không?";
        } else if (botAskedAboutLowWBC) {
          // WBC thấp nhưng KHÔNG có triệu chứng → tư vấn tiếp
          return "Hiểu rồi, không có triệu chứng là tốt! 😊\n\nVới WBC thấp như vậy mà không có triệu chứng, có thể do:\n• Giai đoạn phục hồi sau bệnh virus\n• Chế độ ăn thiếu dinh dưỡng\n• Mệt mỏi kéo dài\n\n💡 **Khuyến nghị:** Bạn nên bổ sung dinh dưỡng (protein, vitamin B12, kẽm), nghỉ ngơi đủ, và xét nghiệm lại sau 2-4 tuần. Nếu WBC vẫn thấp, nên gặp bác sĩ chuyên khoa huyết học.\n\nBạn có muốn tôi tư vấn về chế độ ăn uống để cải thiện WBC không?";
        }
      }

      // handle declines light vs strong
      const isStrongDecline =
        /\b(khong can|khong can nua|không cần|không cần nữa|ko muốn|không muốn|da kieu|da keu|toi da noi)\b/.test(
          ua
        );
      if (isStrongDecline) {
        return "Hiểu rồi. Tôi tôn trọng quyết định của bạn — nếu sau này cần trợ giúp về kết quả xét nghiệm hoặc đặt lịch, bạn chỉ cần nhắn lại. Chúc bạn mạnh khỏe! 😊";
      }
      switch (expected) {
        case "booking":
        case "contact":
          return "Hiểu rồi. Nếu không muốn đặt lịch, tôi có thể: 'giải thích' (ý nghĩa chỉ số) hoặc 'theo dõi' (hướng dẫn theo dõi tại nhà). Bạn chọn phương án nào?";
        case "value":
          return "Hiểu rồi. Nếu bạn chưa gửi giá trị, bạn có thể gõ 'giải thích' để nghe định nghĩa WBC hoặc 'đặt lịch' khi muốn làm xét nghiệm.";
        case "symptom":
          return "Hiểu rồi. Nếu không có triệu chứng đặc biệt, bạn có thể theo dõi tại nhà và xét nghiệm lại sau vài tuần. Bạn có muốn tôi hướng dẫn cách theo dõi không?";
        default:
          return "Hiểu rồi. Nếu cần trợ giúp khác, bạn có thể trả lời 'giải thích', 'theo dõi' hoặc 'đặt lịch'.";
      }
    }

    if (isYes) {
      // ✅ Phân tích ngữ cảnh từ lastBotMessage
      const botAskedAboutSymptoms =
        lastBotMessage &&
        /\b(sốt|đau|triệu chứng|phẫu thuật|chấn thương|dùng thuốc)\b/i.test(
          lastBotMessage
        );
      const botAskedAboutHighWBC =
        lastBotMessage &&
        /\b(cao|tăng|WBC.*cao|WBC.*tăng)\b/i.test(lastBotMessage);
      const botAskedAboutLowWBC =
        lastBotMessage &&
        /\b(thấp|giảm|WBC.*thấp|WBC.*giảm)\b/i.test(lastBotMessage);

      // ✅ Nếu bot vừa hỏi về triệu chứng SAU KHI đã phân tích kết quả WBC
      if (
        botAskedAboutSymptoms &&
        (botAskedAboutHighWBC || botAskedAboutLowWBC)
      ) {
        if (botAskedAboutHighWBC) {
          // WBC cao + CÓ triệu chứng → hỏi chi tiết để tư vấn
          return "Cảm ơn bạn đã chia sẻ! Để tôi tư vấn chính xác hơn, bạn có thể cho tôi biết:\n\n1️⃣ **Có sốt không?** Nếu có, nhiệt độ bao nhiêu?\n2️⃣ **Đau ở đâu?** (họng, đầu, bụng, ngực...)\n3️⃣ **Có ho, khó thở không?**\n4️⃣ **Có phẫu thuật hoặc chấn thương gần đây không?**\n5️⃣ **Đang dùng thuốc gì?** (đặc biệt là corticoid)\n\nBạn có thể trả lời ngắn gọn, ví dụ: 'Sốt 38.5 độ, đau họng 3 ngày' nhé!";
        } else if (botAskedAboutLowWBC) {
          // WBC thấp + CÓ triệu chứng → hỏi chi tiết để tư vấn
          return "Cảm ơn bạn đã chia sẻ! Với WBC thấp, tôi cần biết thêm để tư vấn chính xác:\n\n1️⃣ **Có hay bị nhiễm trùng, sốt không?**\n2️⃣ **Có cảm thấy mệt mỏi kéo dài không?**\n3️⃣ **Có bị bầm tím hoặc chảy máu bất thường không?**\n4️⃣ **Có đang điều trị bệnh gì không?** (hóa trị, xạ trị, thuốc ức chế miễn dịch)\n5️⃣ **Có bị bệnh virus gần đây không?** (cúm, COVID, sốt xuất huyết)\n\nBạn có thể trả lời ngắn gọn để tôi tư vấn tiếp nhé!";
        }
      }

      switch (expected) {
        case "booking":
          return "Bạn có thể đặt lịch trên trang chủ LabMS hoặc gọi hotline 1900-xxxx. Bạn muốn tôi hướng dẫn chi tiết quy trình đặt lịch không?";
        case "contact":
          return "Thông tin liên hệ LABMS: Hotline 1900-xxxx, Email: info@labms.com. Bạn muốn tôi gửi địa chỉ chi tiết không?";
        case "symptom":
          return "Cảm ơn. Bạn có thể mô tả triệu chứng cụ thể hơn không? Ví dụ: 'Sốt 38.5 độ, ho 2 ngày, đau họng'. Điều này giúp tôi tư vấn chính xác hơn!";
        case "value":
          return "Tuyệt! Bạn muốn gửi giá trị WBC ngay bây giờ (ví dụ: 'WBC = 5.9') để tôi phân tích, hay bạn muốn hướng dẫn đặt lịch lấy mẫu?";
        case "explain":
          return "Tôi sẽ giải thích chi tiết: WBC là bạch cầu — tế bào miễn dịch; bạn muốn nghe về nguyên nhân cao hay thấp trước?";
        default:
          return "Được rồi! Bạn có thể chia sẻ thêm chi tiết để tôi tư vấn chính xác hơn không?";
      }
    }

    // If expected is a numeric value request and user provided a number -> analyze
    if (expected === "value" && hasNumber) {
      const m = ua.match(/\d+(\.\d+)?/);
      if (m && m[0]) {
        const val = parseFloat(m[0]);
        if (!Number.isNaN(val)) return analyzeWbcValue(val);
      }
      return "Để tôi phân tích, vui lòng gửi giá trị WBC từ phiếu kết quả (ví dụ: 'WBC = 5.9').";
    }

    if (expected === "booking")
      return "Bạn muốn tôi hướng dẫn cách đặt lịch trực tuyến hay gọi hotline để đặt?";
    if (expected === "contact")
      return "Bạn muốn tôi gửi thông tin liên hệ chi tiết (địa chỉ + bản đồ) hay chỉ cần số hotline?";
    if (expected === "symptom")
      return "Bạn có thể mô tả triệu chứng ngắn gọn (ví dụ: 'sốt 38.5, ho 2 ngày') để tôi tư vấn tiếp không?";
    if (expected === "explain" || expected === "compare")
      return "Bạn muốn tôi giải thích 'nguyên nhân', 'so sánh với chỉ số khác', hay 'hướng xử trí' trước?";

    return "Đã hiểu. Bạn muốn tôi làm gì tiếp theo liên quan đến câu hỏi vừa nãy?";
  }

  // ✅ Xử lý "ok" đơn lẻ - phân tích ngữ cảnh câu hỏi bot
  const isSimpleOk = /^(ok|oke|okie|okay|okê)$/i.test(uaRaw.trim());
  if (isSimpleOk && lastBotMessage) {
    // Nếu bot vừa hỏi có muốn giải thích/hỗ trợ gì không → hiểu là KHÔNG cần nữa
    if (
      /\b(có muốn|có cần|bạn có|muốn.*không|cần.*không)\b/i.test(lastBotMessage)
    ) {
      return "Được rồi! Nếu có câu hỏi gì về xét nghiệm máu, bạn cứ hỏi tôi bất cứ lúc nào nhé! 😊";
    }
  }

  // ✅ Xử lý câu kết thúc hội thoại (user không muốn tiếp tục)
  const isEndingConversation =
    /\b(khong con|không còn|hết|xong|thôi|thoi|tạm biệt|tam biet|bye|ok thôi|ok thoi)\b.*\b(cau hoi|câu hỏi|gi|gì|nua|nữa)\b/i.test(
      uaRaw
    );
  if (isEndingConversation) {
    return "Cảm ơn bạn đã tin tùng Dr.Meddy! 😊 Nếu sau này cần hỗ trợ về xét nghiệm máu, bạn cứ quay lại bất cứ lúc nào nhé! Chúc bạn sức khỏe! 🩺";
  }

  // Not aligned: professionally steer back to the domain/focus
  return generateSteeringReply(uaRaw);

  // end of findContextualAnswer
}

/**
 * 🩺 analyzeWbcValue - Phân tích giá trị WBC theo phong cách bác sĩ
 * Không phải lúc nào cũng hỏi - biết khi nào kết thúc tự nhiên
 */
export function analyzeWbcValue(value: number, turn?: number): string {
  const refMin = 4.0;
  const refMax = 10.0;
  const conversationTurn = turn || 1;

  // === WBC THẤP ===
  if (value < refMin) {
    const isCritical = value < 1.0;
    const isSevere = value >= 1.0 && value < 2.0;
    const isModerate = value >= 2.0 && value < 3.0;

    let result = isCritical ? "🚨 " : isSevere ? "⚠️ " : "⚠️ ";
    result += `**WBC = ${value}** - `;

    if (isCritical) {
      result += "**CỰC KỲ THẤP - KHẨN CẤP!**\n\n";
      result += `WBC dưới 1.0 là tình trạng nguy hiểm, nguy cơ nhiễm trùng nặng rất cao.\n\n`;
      result += `🚑 **HÀNH ĐỘNG NGAY:**\n`;
      result += `• ĐI CẤP CỨU hoặc gọi 115\n`;
      result += `• TRÁNH tiếp xúc người ốm\n`;
      result += `• KHÔNG tự ý dùng thuốc\n\n`;
      result += `📋 **Nguyên nhân:**\n`;
      result += `• Hóa trị/xạ trị\n• Suy tủy xương\n• Bệnh tự miễn\n• Nhiễm virus nặng\n\n`;

      if (conversationTurn <= 1) {
        result += `Bạn có đang điều trị bệnh gì hoặc dùng thuốc đặc biệt không?`;
      } else {
        result += `**Hãy đến bệnh viện ngay hôm nay.**`;
      }
    } else if (isSevere) {
      result += "**rất thấp**\n\n";
      result += `Phạm vi tham chiếu: ${refMin}-${refMax} x10⁹/L\n\n`;
      result += `🔍 **Nguyên nhân thường gặp:**\n`;
      result += `• Nhiễm virus (cúm, COVID, EBV)\n`;
      result += `• Thiếu vitamin B12, acid folic\n`;
      result += `• Tác dụng phụ thuốc (kháng sinh mạnh)\n`;
      result += `• Stress kéo dài\n\n`;
      result += `💡 **Khuyến nghị:**\n`;
      result += `• Bổ sung dinh dưỡng (vitamin B12, kẽm)\n`;
      result += `• Xét nghiệm lại sau 2-4 tuần\n`;
      result += `• Nếu vẫn thấp → khám bác sĩ huyết học\n\n`;

      if (conversationTurn === 1) {
        result += `Bạn có hay bị nhiễm trùng hoặc mệt mỏi kéo dài không?`;
      }
    } else if (isModerate) {
      result += "thấp đáng lo\n\n";
      result += `WBC dưới mức bình thường, cần theo dõi.\n\n`;
      result += `✅ **Khuyến nghị:** Bổ sung dinh dưỡng, nghỉ ngơi, xét nghiệm lại sau 1 tháng.\n\n`;

      if (conversationTurn === 1) {
        result += `Bạn có đang dùng thuốc gì không?`;
      } else {
        result += `Hãy chăm sóc sức khỏe thật tốt nhé!`;
      }
    } else {
      result += "hơi thấp\n\n";
      result += `WBC hơi thấp nhưng chưa đáng lo. Có thể do giai đoạn hồi phục sau bệnh.\n\n`;
      result += `✅ **Khuyến nghị:** Theo dõi, bổ sung dinh dưỡng.\n\n`;

      if (conversationTurn === 1) {
        result += `Bạn có bị ốm gần đây không?`;
      } else {
        result += `Chúc bạn sớm khỏe mạnh!`;
      }
    }

    return result;
  }

  // === WBC CAO ===
  if (value > refMax) {
    const isCritical = value > 20;
    const isSevere = value > 15 && value <= 20;
    const isModerate = value > 12 && value <= 15;

    let result = isCritical ? "🚨 " : isSevere ? "⚠️ " : "⚠️ ";
    result += `**WBC = ${value}** - `;

    if (isCritical) {
      result += "**CỰC KỲ CAO - CẦN KHÁM GẤP!**\n\n";
      result += `WBC trên 20 là tình trạng nghiêm trọng, cần đánh giá y khoa ngay.\n\n`;
      result += `🚑 **KHÁM GẤP nếu có:**\n`;
      result += `• Sốt cao >39°C\n`;
      result += `• Đau bụng dữ dội\n`;
      result += `• Khó thở nặng\n`;
      result += `• Lú lẫn, mê sảng\n\n`;
      result += `🔍 **Cần làm:**\n`;
      result += `• X-quang phổi (nếu ho/khó thở)\n`;
      result += `• Siêu âm bụng (nếu đau bụng)\n`;
      result += `• Xét nghiệm cấy máu\n\n`;

      if (conversationTurn <= 1) {
        result += `Bạn có sốt cao, đau dữ dội, hoặc phẫu thuật gần đây không?`;
      } else {
        result += `**Hãy đi khám bác sĩ ngay hôm nay!**`;
      }
    } else if (isSevere) {
      result += "**rất cao**\n\n";
      result += `Phạm vi tham chiếu: ${refMin}-${refMax} x10⁹/L\n\n`;
      result += `🔍 **Nguyên nhân thường gặp:**\n`;
      result += `• Nhiễm khuẩn cấp (viêm phổi, viêm họng)\n`;
      result += `• Sau phẫu thuật/chấn thương\n`;
      result += `• Viêm mạn tính\n`;
      result += `• Dùng corticoid\n\n`;
      result += `💡 **Khuyến nghị:**\n`;
      result += `• Tìm và điều trị nguyên nhân\n`;
      result += `• Uống nhiều nước\n`;
      result += `• Đi khám nếu sốt >38.5°C\n\n`;

      if (conversationTurn === 1) {
        result += `Bạn có sốt, đau ở đâu, hoặc phẫu thuật gần đây không?`;
      }
    } else if (isModerate) {
      result += "cao đáng chú ý\n\n";
      result += `WBC cao hơn bình thường, cần tìm nguyên nhân.\n\n`;
      result += `💡 **Có thể do:** Nhiễm khuẩn nhẹ, viêm, hoặc stress.\n\n`;
      result += `✅ **Khuyến nghị:** Theo dõi, uống nước, nghỉ ngơi.\n\n`;

      if (conversationTurn === 1) {
        result += `Bạn có đau họng, ho, hoặc sốt không?`;
      } else {
        result += `Hãy theo dõi và tái khám nếu không giảm!`;
      }
    } else {
      result += "hơi cao\n\n";
      result += `WBC hơi cao nhưng không đáng lo. Có thể do stress hoặc vận động mạnh.\n\n`;
      result += `✅ **Khuyến nghị:** Giảm stress, xét nghiệm lại sau 1-2 tuần.\n\n`;

      if (conversationTurn === 1) {
        result += `Bạn có căng thẳng hoặc tập thể dục cường độ cao gần đây không?`;
      } else {
        result += `Chúc bạn luôn khỏe mạnh!`;
      }
    }

    return result;
  }

  // === WBC BÌNH THƯỜNG ===
  let result = `✅ **WBC = ${value} - BÌNH THƯỜNG**\n\n`;
  result += `Phạm vi tham chiếu: ${refMin}-${refMax} x10⁹/L\n\n`;
  result += `🎉 Tuyệt vời! Số lượng bạch cầu hoàn toàn bình thường, hệ miễn dịch hoạt động tốt.\n\n`;
  result += `💡 **Duy trì:**\n`;
  result += `• Chế độ ăn cân bằng\n`;
  result += `• Ngủ đủ 7-8 giờ/đêm\n`;
  result += `• Vận động đều đặn\n`;
  result += `• Kiểm tra định kỳ 6-12 tháng/lần\n\n`;
  result += `Chúc bạn luôn khỏe mạnh! 😊`;

  return result;
}

// ===== INTENTS =====
type Intent = {
  name: string;
  patterns: RegExp[];
  response?: string;
  handler?:
    | "analyzeWbcValue"
    | "askForWbcValue"
    | "definition"
    | "booking"
    | "contextual";
};

const intents: Intent[] = [
  {
    name: "greeting",
    patterns: [/^(hi|hello|xin chao|chao|alo)\b/],
    response:
      "Xin chào! Tôi là Dr.Meddy, trợ lý ảo hỗ trợ đọc hiểu kết quả xét nghiệm trong hệ thống LabMS. Bạn muốn tôi giúp kiểm tra ý nghĩa chỉ số WBC hay hướng dẫn cách đặt lịch xét nghiệm mới?",
  },
  {
    name: "ask_definition_wbc",
    patterns: [
      /\b(wbc|bach cau|bachcau|bach cau)\b.*\b(la gi|y nghia|giai thich|ve cai gi|muon biet)\b/,
      /\b(muon biet)\b.*\b(wbc|bach cau)\b/,
    ],
    handler: "definition",
  },
  {
    name: "ask_check_wbc_value",
    patterns: [/\b(kiem tra|xem|danh gia)\b.*\b(wbc|bach cau)\b/],
    handler: "askForWbcValue",
  },
  {
    name: "provide_wbc_value",
    patterns: [
      /\b(wbc|bach cau).*\d+(\.\d+)?\b/,
      /\b\d+(\.\d+)?\b.*\b(wbc|bach cau)\b/,
    ],
    handler: "analyzeWbcValue",
  },
  {
    name: "ask_normal_range",
    patterns: [/\b(khoang|pham vi|ref range|gioi han)\b.*\b(wbc|bach cau)\b/],
    response:
      "Khoảng tham chiếu WBC thường là 4.0–10.0 x10⁹/L; giá trị có thể khác theo tuổi và phòng xét nghiệm.",
  },
  {
    name: "ask_booking",
    patterns: [
      /\b(dat lich|dat lich xet nghiem|dat lich xet|dat lich xet nghiem)\b/,
    ],
    handler: "booking",
  },
  {
    name: "thanks",
    patterns: [/\b(cam on|thank you|tnx)\b/],
    response: "Bạn cứ thoải mái hỏi thêm nếu cần.",
  },
];

function normalizeForIntent(s: string) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Helpers: comprehensive Vietnamese yes/no detection + relevance check
 */
function normalizeTextForMatch(s: string) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function isAffirmativeText(raw: string): boolean {
  const s = normalizeTextForMatch(raw);
  const affirmPatterns = [
    /\b(co|có|có ạ|vâng|vang|da|dạ|được|duoc|ok|oke|okie|dc|đc|uh|ừ|ừm|sure|yes|yep|yup)\b/,
  ];
  return affirmPatterns.some((re) => re.test(s));
}

export function isNegativeText(raw: string): boolean {
  const s = normalizeTextForMatch(raw);
  const negPatterns = [
    /\b(khong|không|ko|khong can|không cần|khong can nua|không cần nữa|khong muon|không muốn|chua|no)\b/,
    /\b(khong phai|không phải|ko phai|khong nha|không nha|khong nhe|không nhé)\b/,
  ];
  return negPatterns.some((re) => re.test(s));
}

/**
 * isRelevantQuestion - kiểm tra xem câu hỏi có nằm trong phạm vi nghiệp vụ LabMS hay không
 */
function isRelevantQuestion(uqRaw: string): boolean {
  const uq = normalizeTextForMatch(uqRaw);
  const keywords = [
    "wbc",
    "bach cau",
    "bachcau",
    "lym",
    "gran",
    "hgb",
    "rbc",
    "hct",
    "mcv",
    "mch",
    "mchc",
    "plt",
    "tieu", // tolerance for misspell
    "tiểu cầu",
    "huyet",
    "xet nghiem",
    "ket qua",
    "chi so",
    "labms",
    "dat lich",
    "đặt lịch",
    "hotline",
    "lien he",
    "sot",
    "ho",
    "dau hong",
    "trieu chung",
    "theo doi",
  ];
  return keywords.some((k) => uq.includes(k));
}

/**
 * generateSteeringReply - when no sample or intent matches, gently steer the user
 * back to domain-focused options (analyze a value, explain a metric, book, or contact).
 */
function generateSteeringReply(uqRaw: string): string {
  const uq = normalizeTextForMatch(uqRaw);
  const indicators = Object.keys(labSystemKnowledge.bloodIndicators).map((k) =>
    k.toLowerCase()
  );

  // detect mention of known indicators (e.g., wbc, hgb, lym)
  const mentioned = indicators.find((ind) => uq.includes(ind.toLowerCase()));
  if (mentioned) {
    return `Mình có thể giúp phân tích chỉ số ${mentioned.toUpperCase()}. Bạn vui lòng gửi giá trị (ví dụ: 'WBC = 5.9') hoặc mô tả triệu chứng (ví dụ: 'sốt 38.5') để tôi tư vấn tiếp nhé?`;
  }

  // detect symptom keywords
  if (/(sot|ho|dau hong|met|dau bung|chay mau|xuat huyet)\b/.test(uq)) {
    return "Bạn đang mô tả triệu chứng — bạn có thể cho biết ngắn gọn (ví dụ: 'sốt 38.5, ho 3 ngày') để tôi đánh giá khả năng liên quan tới các chỉ số máu như WBC không?";
  }

  // default steering options
  return "Mình chưa tìm thấy câu trả lời cụ thể — bạn muốn tôi: 'giải thích' (ý nghĩa chỉ số), 'gửi giá trị' (ví dụ: 'WBC = 5.9'), 'đặt lịch' hay 'liên hệ'? Hãy trả lời ngắn để tôi dẫn tiếp.";
}

/**
 * generateDirectAnswer - try to synthesize a direct, domain-focused reply
 * for queries that are not in the fixed training set. Returns null if unable
 * to produce a meaningful direct answer (caller should fall back to steering).
 */
function generateDirectAnswer(
  uqRaw: string,
  lastBotMessage?: string
): string | null {
  const uq = normalizeTextForMatch(uqRaw);

  // helper: find an indicator mentioned in text (match keys or name tokens)
  type IndicatorKey = keyof typeof labSystemKnowledge.bloodIndicators;
  const indicators = Object.keys(
    labSystemKnowledge.bloodIndicators
  ) as Array<IndicatorKey>;

  const findIndicator = (): string | null => {
    for (const key of indicators) {
      const keyLower = key.toLowerCase();
      if (uq.includes(keyLower)) return key;
      const meta = labSystemKnowledge.bloodIndicators[key];
      if (
        meta &&
        meta.name &&
        normalizeTextForMatch(meta.name).includes(keyLower)
      )
        return key;
    }
    return null;
  };

  const ind = findIndicator();

  // If user asked for a definition or explanation
  if (
    /(giai thich|giải thích|la gi|y nghia|nguyen nhan|tại sao|tai sao)/.test(uq)
  ) {
    const target =
      ind ??
      (() => {
        // try to extract from lastBotMessage
        if (!lastBotMessage) return null;
        const s = normalizeTextForMatch(lastBotMessage);
        for (const k of indicators) if (s.includes(k.toLowerCase())) return k;
        return null;
      })();

    if (target) {
      const info = labSystemKnowledge.bloodIndicators[target as IndicatorKey];
      if (/(cao|tang|tăng)/.test(uq)) {
        return `${info.name} thường tăng khi ${info.highCauses} Bạn có triệu chứng nào như sốt, đau họng, hoặc mệt không để tôi tư vấn bước tiếp?`;
      }
      if (/(thap|thấp|giam)/.test(uq)) {
        return `${info.name} có thể giảm khi ${info.lowCauses} Bạn có đang dùng thuốc hoặc có tiền sử bệnh nào không để tôi hướng dẫn tiếp?`;
      }
      // default explanation
      return `${info.name} (${target}) — Khoảng tham chiếu: ${info.range}. ${info.advice} Bạn muốn tôi so sánh với chỉ số khác hay phân tích giá trị cụ thể của bạn?`;
    }
    // no specific indicator found — prefer curated WBC definition if available
    const defSample = baseConversationSamples.find(
      (s) =>
        /wbc|bach cau|bachcau/.test(normalizeForIntent(s.question)) &&
        /(la gi|y nghia|giai thich)/.test(normalizeForIntent(s.question))
    );
    if (defSample) return defSample.answer;
  }

  // If a numeric value is present and we can map to an indicator (useful for WBC)
  const numMatch = uq.match(/\d+(\.\d+)?/);
  if (numMatch && ind) {
    const val = parseFloat(numMatch[0]);
    if (!Number.isNaN(val)) {
      if (ind.toLowerCase() === "wbc") {
        return analyzeWbcValue(val);
      }
      const info = labSystemKnowledge.bloodIndicators[ind as IndicatorKey];
      return `${info.name}: giá trị ${val} (tham chiếu ${info.range}). ${info.advice} Bạn muốn tôi giải thích chi tiết nguyên nhân hay hướng xử trí?`;
    }
  }

  // If user asked for 'giải thích rõ hơn' without a clear indicator, try to
  // expand on last bot message: if last bot message referenced an indicator,
  // explain that indicator.
  if (/ro hon|rõ hơn|chi tiet|chi tiết/.test(uq) && lastBotMessage) {
    const s = normalizeTextForMatch(lastBotMessage);
    for (const k of indicators) {
      if (s.includes(k.toLowerCase())) {
        const info = labSystemKnowledge.bloodIndicators[k as IndicatorKey];
        return `${info.name} — ${info.advice} Bạn muốn tôi đề xuất các xét nghiệm bổ sung hay hướng dẫn thay đổi lối sống trước?`;
      }
    }
  }

  // If the user asked an open question inside domain (e.g., symptoms) try a brief answer
  if (/(sot|ho|dau hong|met|trieu chung)/.test(uq)) {
    return `Triệu chứng như sốt và ho thường liên quan đến nhiễm khuẩn, điều này có thể làm tăng WBC. Bạn có muốn tôi hướng dẫn cách theo dõi tại nhà hay đặt lịch xét nghiệm?`;
  }

  // Can't synthesize a confident direct answer — return null to allow steering
  return null;
}

/**
 * findSampleAnswer - Enhanced with WBC knowledge + Gemini fallback logic
 * Now prioritizes 100 WBC conversations and always ends with follow-up question
 */
export function findSampleAnswer(
  userQuestion: string,
  lastBotMessage?: string
): string | null {
  if (!userQuestion) return null;
  const uqRaw = userQuestion || "";
  const uq = normalizeForIntent(uqRaw);
  if (!uq) return null;

  // 🎯 PRIORITY 0: Check Question-Answer Registry FIRST (extract last question from lastBotMessage)
  // ⚠️ SKIP THIS if user is asking about medical terms (WBC, RBC, etc.) to avoid false matches
  const isAskingAboutMedicalTerm =
    /\b(wbc|rbc|hgb|hct|plt|mcv|mch|mchc|lym|mid|gran|bạch cầu|hồng cầu|tiểu cầu)\b/i.test(
      uqRaw
    );

  if (lastBotMessage && !isAskingAboutMedicalTerm) {
    // ⚠️ CRITICAL: Extract ONLY the standalone question at the very end
    // Split by newlines and find the last line that ends with '?'
    // This prevents including definition/explanation text that might have confusing keywords
    const lines = lastBotMessage
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    let lastBotQuestion: string | null = null;

    // Search from the end backwards for a line ending with '?'
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].endsWith("?")) {
        lastBotQuestion = lines[i];
        break;
      }
    }

    console.log(
      "🔍 PRIORITY 0 - Extracted question from lastBotMessage:",
      lastBotQuestion
    );

    if (lastBotQuestion) {
      const contextualAnswer = findContextualAnswer(
        userQuestion,
        lastBotQuestion,
        lastBotMessage
      );
      if (contextualAnswer) {
        console.log("✅ Registry match found for question:", lastBotQuestion);
        return contextualAnswer;
      } else {
        console.log("❌ Registry NO match for question:", lastBotQuestion);
      }
    }
  } else if (isAskingAboutMedicalTerm) {
    console.log(
      "⏭️ PRIORITY 0 - SKIPPED (user asking about medical term, go straight to PRIORITY 1+)"
    );
  }

  // 🎯 PRIORITY 1: Check if asking for DEFINITION/EXPLANATION (no specific value)
  const isAskingAboutWBC = /\b(wbc|bach cau|bạch cầu|bachcau)\b/i.test(uqRaw);
  const hasNumericValue = /\d+(\.\d+)?/.test(uqRaw);

  console.log(
    "🔍 PRIORITY 1 - isAskingAboutWBC:",
    isAskingAboutWBC,
    "hasNumericValue:",
    hasNumericValue,
    "input:",
    uqRaw
  );

  if (isAskingAboutWBC && !hasNumericValue) {
    // User is asking ABOUT WBC in general, not providing a value
    // Always provide definition first, then ask what they want
    console.log("✅ PRIORITY 1 - Returning WBC definition");
    return `${wbcInfo.name} (${wbcInfo.shortName}) là chỉ số đo số lượng bạch cầu trong máu, phản ánh khả năng miễn dịch của cơ thể.\n\n📊 **Khoảng bình thường:** ${wbcInfo.normalRange.min}–${wbcInfo.normalRange.max} ${wbcInfo.unit}\n\n🔬 **Ý nghĩa:**\n• **Cao:** Có thể do nhiễm khuẩn, viêm, stress, hút thuốc\n• **Thấp:** Có thể do suy giảm miễn dịch, nhiễm virus, dùng thuốc ức chế tủy\n\nBạn có kết quả WBC cụ thể cần tôi phân tích không? (Ví dụ: "WBC = 12.5" hoặc chỉ số "14") 🩺`;
  }

  // 🎯 PRIORITY 2: Extract and analyze ACTUAL WBC value from user input
  // Check if: (user mentions WBC AND has number) OR (only number AND bot asked about WBC)
  const botAskedAboutWBC =
    lastBotMessage && /\b(wbc|bạch cầu|bach cau)\b/i.test(lastBotMessage);
  const onlyNumber = /^\s*(\d+\.?\d*)\s*$/.test(uqRaw);

  if (
    (isAskingAboutWBC && hasNumericValue) ||
    (onlyNumber && botAskedAboutWBC)
  ) {
    console.log("🔍 PRIORITY 2 - Checking for WBC value in:", uqRaw);

    // Pattern 1a: "WBC = 14", "WBC: 12.5", "WBC=14", "wbc= 4" (với hoặc không có space)
    let valueMatch = uqRaw.match(
      /(?:wbc|bạch cầu|bach cau)\s*[=:]\s*(\d+\.?\d*)/i
    );
    console.log("  Pattern 1a (WBC = 14 or WBC=14) result:", valueMatch);

    // Pattern 1b: "WBC là 14", "WBC của tôi là 10"
    if (!valueMatch) {
      valueMatch = uqRaw.match(
        /(?:wbc|bạch cầu|bach cau)\s*(?:của tôi|của mình|của em|cua toi)?\s*(?:là|la|đo được|do duoc|hiện tại|hien tai)\s+(\d+\.?\d*)/i
      );
      console.log("  Pattern 1b (WBC là 14) result:", valueMatch);
    }

    // Pattern 2: "14 WBC", "12.5 là WBC"
    if (!valueMatch) {
      valueMatch = uqRaw.match(
        /(\d+\.?\d*)\s*(?:là|la)?\s*(?:wbc|bạch cầu|bach cau)/i
      );
      console.log("  Pattern 2 (14 WBC) result:", valueMatch);
    }

    // Pattern 3: Chỉ có số (nếu bot vừa hỏi về WBC)
    if (
      !valueMatch &&
      lastBotMessage &&
      /\b(wbc|bạch cầu|bach cau)\b/i.test(lastBotMessage)
    ) {
      valueMatch = uqRaw.match(/^\s*(\d+\.?\d*)\s*$/);
      console.log("  Pattern 3 (only number) result:", valueMatch);
    }

    if (valueMatch) {
      const value = parseFloat(valueMatch[1]);
      console.log("  ✅ Extracted value:", value);
      // Validate reasonable WBC range
      if (value >= 0.1 && value <= 100) {
        const analysis = analyzeWBCValue(value);
        console.log("  ✅ Analysis complete, returning message");
        return `${analysis.message}\n\n${analysis.followUp}`;
      } else {
        console.log("  ❌ Value out of range (0.1-100):", value);
      }
    } else {
      console.log("  ❌ No WBC value match found");
    }
  }

  // 🎯 PRIORITY 3: Analyze symptom details if bot just asked about symptoms
  if (lastBotMessage) {
    const botAskedAboutSymptoms =
      /\b(sốt|đau|triệu chứng|phẫu thuật|chấn thương|dùng thuốc|ho|khó thở|mệt|chảy máu|bầm tím|nhiễm trùng)\b/i.test(
        lastBotMessage
      );
    const botAskedAboutHighWBC =
      /\b(cao|tăng|WBC.*cao|WBC.*tăng|nhiễm trùng|nhiễm khuẩn|viêm)\b/i.test(
        lastBotMessage
      );
    const botAskedAboutLowWBC =
      /\b(thấp|giảm|WBC.*thấp|WBC.*giảm|miễn dịch yếu)\b/i.test(lastBotMessage);

    // ✅ User đang mô tả triệu chứng cụ thể
    if (
      botAskedAboutSymptoms &&
      (botAskedAboutHighWBC || botAskedAboutLowWBC)
    ) {
      // Detect specific symptoms from user input
      const hasFever = /\b(sốt|sot|fever|38|39|40)\b/i.test(uqRaw);
      const hasPain = /\b(đau|dau|đau|pain|ho|khó thở|kho tho)\b/i.test(uqRaw);
      const hasSurgery =
        /\b(phẫu thuật|phau thuat|mổ|mo|surgery|chấn thương|chan thuong)\b/i.test(
          uqRaw
        );
      const hasMedication =
        /\b(thuốc|thuoc|medicine|corticoid|kháng sinh|khang sinh)\b/i.test(
          uqRaw
        );
      const hasFatigue = /\b(mệt|met|tired|yếu|yeu|weakness)\b/i.test(uqRaw);
      const hasBleeding =
        /\b(chảy máu|chay mau|bleeding|xuất huyết|xuat huyet|bầm tím|bam tim)\b/i.test(
          uqRaw
        );

      if (botAskedAboutHighWBC) {
        // WBC cao + có triệu chứng cụ thể → tư vấn chi tiết
        // ✅ Tổ hợp 2-3 triệu chứng (ưu tiên xử lý trước)
        if (hasFever && hasPain && (hasSurgery || hasMedication)) {
          return "🚨 **Sốt + đau + (phẫu thuật/dùng thuốc)** với WBC cao là tình huống KHẨN CẤP!\n\n⚠️ **Nguy cơ cao:**\n• Nhiễm trùng hậu phẫu\n• Nhiễm khuẩn huyết\n• Tác dụng phụ thuốc nặng\n\n🚑 **PHẢI LÀM NGAY:**\n• ĐI CẤP CỨU hoặc gọi 115\n• KHÔNG tự ý dùng thêm thuốc\n• Mang theo phiếu kết quả và danh sách thuốc đang dùng\n\n📋 **Bác sĩ sẽ cần:**\n• Xét nghiệm CRP, PCT, cấy máu\n• Kiểm tra vết mổ (nếu có)\n• Đánh giá tương tác thuốc\n\nBạn có người thân đưa đi bệnh viện ngay được không? Đây là tình huống khẩn cấp!";
        } else if (hasFever && hasPain) {
          return "⚠️ **Sốt cao + đau** là dấu hiệu nhiễm trùng nghiêm trọng với WBC cao như vậy!\n\n🏥 **Khuyến nghị KHẨN:**\n• Đến bệnh viện NGAY để được khám và điều trị\n• Có thể cần kháng sinh mạnh hoặc nhập viện theo dõi\n• Không tự ý dùng thuốc giảm đau/hạ sốt mà chưa biết nguyên nhân\n\n📋 **Cần làm thêm:**\n• Xét nghiệm CRP, PCT (protein viêm)\n• Cấy máu nếu nghi ngờ nhiễm khuẩn huyết\n• X-quang phổi nếu ho/khó thở\n\nBạn có thể đến bệnh viện ngay bây giờ không? Tôi sẽ hướng dẫn bạn chuẩn bị hồ sơ!";
        } else if (hasFever && hasSurgery) {
          return "🏥 **Sốt sau phẫu thuật** + WBC cao CẦN KHÁM GẤP!\n\n⚠️ **Nghi ngờ nhiễm trùng vết mổ nếu:**\n• Sốt >38.5°C sau 3 ngày mổ\n• Vết mổ đỏ, sưng, chảy mủ\n• Đau tăng thay vì giảm\n\n🚑 **CẦN LÀM NGAY:**\n• Liên hệ bác sĩ phẫu thuật NGAY\n• Đến bệnh viện để kiểm tra vết mổ\n• Có thể cần kháng sinh tĩnh mạch\n\n📋 **Bạn cần cho biết:**\n• Mổ được mấy ngày?\n• Sốt bao nhiêu độ?\n• Vết mổ có bất thường không?\n\nVui lòng đi khám GẤP để tránh biến chứng!";
        } else if (hasFever && hasMedication) {
          return "💊🌡️ **Sốt + dùng thuốc** với WBC cao cần kiểm tra GẤP!\n\n⚠️ **Thuốc có thể gây:**\n• Tăng WBC giả (corticoid)\n• Hoặc sốt do thuốc (phản ứng dị ứng)\n\n📋 **Cần biết ngay:**\n• Tên thuốc đang dùng?\n• Dùng được bao lâu?\n• Bác sĩ kê hay tự mua?\n• Sốt xuất hiện sau khi uống thuốc bao lâu?\n\n🏥 **Khuyến nghị:**\n• KHÔNG ngừng thuốc đột ngột\n• Gặp bác sĩ trong 24h\n• Mang theo vỏ thuốc khi đi khám\n\nBạn đang dùng thuốc gì? Tôi sẽ kiểm tra xem có liên quan không!";
        } else if (hasPain && hasSurgery) {
          return "🏥😣 **Đau sau phẫu thuật** + WBC cao cần đánh giá kỹ!\n\n✅ **Đau bình thường nếu:**\n• Trong 3-5 ngày đầu sau mổ\n• Đau giảm dần từng ngày\n• Kiểm soát được bằng thuốc giảm đau\n\n⚠️ **CẢNH BÁO nếu:**\n• Đau TĂNG sau 3 ngày\n• Đau dữ dội không giảm bằng thuốc\n• Vết mổ sưng đỏ, nóng\n\n📋 **Cần biết:**\n• Loại phẫu thuật gì?\n• Mổ được mấy ngày?\n• Đau ở vết mổ hay vị trí khác?\n• Mức độ đau: 1-10 điểm?\n\nVui lòng cho tôi biết chi tiết để tư vấn chính xác!";
        } else if (hasPain && hasMedication) {
          return "😣💊 **Đau + dùng thuốc** với WBC cao cần làm rõ!\n\n📌 **Có thể do:**\n• Nhiễm trùng đang điều trị (WBC cao là phản ứng)\n• Thuốc gây đau dạ dày (NSAID, aspirin)\n• Tác dụng phụ của thuốc\n\n📋 **Cần biết:**\n• Đau ở đâu? (đầu, bụng, ngực, khớp...)\n• Đang dùng thuốc gì?\n• Đau xuất hiện trước hay sau khi dùng thuốc?\n\n💡 **Lưu ý:**\n• Không uống thêm thuốc giảm đau tự ý\n• Uống thuốc sau ăn để bảo vệ dạ dày\n\nBạn đau ở đâu và đang dùng thuốc gì?";
        } else if (hasSurgery && hasMedication) {
          return "🏥💊 **Sau phẫu thuật + dùng thuốc** với WBC cao cần theo dõi!\n\n✅ **Bình thường nếu:**\n• Dùng thuốc theo đơn bác sĩ\n• WBC 12-15 trong tuần đầu sau mổ\n• Không có triệu chứng bất thường\n\n⚠️ **Cần chú ý:**\n• Corticoid sau mổ có thể làm WBC tăng cao\n• Kháng sinh dự phòng là bình thường\n• Không tự ý thêm/bớt thuốc\n\n📋 **Cần biết:**\n• Mổ loại gì và được mấy ngày?\n• Đang dùng thuốc gì? (tên + liều)\n• Có triệu chứng bất thường không?\n\nVui lòng chia sẻ để tôi đánh giá!";
        } else if (hasFever) {
          return "🌡️ **Sốt cao** kèm WBC cao là dấu hiệu nhiễm trùng!\n\n📊 **Để đánh giá chính xác, tôi cần biết thêm:**\n• Sốt bao nhiêu độ? (38-39 độ = nhẹ, >39 độ = nặng)\n• Sốt được mấy ngày rồi?\n• Có dùng thuốc hạ sốt chưa? Hiệu quả thế nào?\n• Sốt liên tục hay từng cơn?\n• Có run, ớn lạnh không?\n\n💡 **Trong lúc chờ:**\n• Uống nhiều nước (2-3 lít/ngày)\n• Chườm mát trán nếu sốt >38.5°C\n• Theo dõi nhiệt độ mỗi 4 giờ\n\nBạn có thể cho tôi biết nhiệt độ cụ thể không?";
        } else if (hasPain) {
          return "😣 **Có đau** kèm WBC cao cần xác định vị trí đau để tư vấn chính xác!\n\n📍 **Bạn đau ở đâu?**\n• Họng → Viêm họng/amidan\n• Ngực/lưng → Viêm phổi\n• Bụng → Viêm ruột thừa, viêm đường tiết niệu\n• Răng/hàm → Nhiễm trùng răng\n• Khớp/cơ → Viêm khớp, viêm cơ\n\n⏰ **Mức độ đau:**\n• Đau nhẹ → Theo dõi thêm\n• Đau vừa → Nên khám trong 24h\n• Đau dữ dội → ĐI KHÁM NGAY!\n\nBạn đau ở vị trí nào và mức độ thế nào?";
        } else if (hasSurgery) {
          return "🏥 **Phẫu thuật/chấn thương gần đây** kèm WBC cao là phản ứng bình thường NHƯNG cần theo dõi!\n\n✅ **Bình thường nếu:**\n• Trong 3-7 ngày sau mổ\n• WBC 12-15 (tăng vừa phải)\n• Vết mổ khô, không sưng đỏ\n• Không sốt hoặc sốt nhẹ <38°C\n\n⚠️ **CẢNH BÁO nếu:**\n• WBC >15 sau 7 ngày\n• Vết mổ đỏ, sưng, mủ, chảy dịch\n• Sốt >38.5°C\n• Đau tăng dần thay vì giảm\n\n📋 **Bạn cần cho tôi biết:**\n• Mổ được mấy ngày rồi?\n• Vết mổ trông thế nào?\n• Có sốt không?\n\nVui lòng chia sẻ để tôi đánh giá chính xác!";
        } else if (hasMedication) {
          return "💊 **Đang dùng thuốc** kèm WBC cao cần kiểm tra loại thuốc!\n\n📌 **Thuốc TĂNG WBC:**\n• Corticoid (prednisone, dexamethasone)\n• G-CSF (thuốc kích bạch cầu)\n• Lithium\n\n📌 **Cần biết:**\n• Tên thuốc cụ thể?\n• Liều lượng và dùng bao lâu?\n• Bác sĩ kê đơn hay tự mua?\n• Có triệu chứng phụ gì không?\n\n⚠️ **Lưu ý:** KHÔNG tự ý ngừng thuốc mà chưa hỏi bác sĩ!\n\nBạn đang dùng thuốc gì? Tôi sẽ kiểm tra xem có ảnh hưởng đến WBC không.";
        } else if (hasFatigue) {
          return "😴 **Mệt mỏi** với WBC cao là dấu hiệu cơ thể đang chống nhiễm trùng!\n\n🔍 **Nguyên nhân:**\n• Cơ thể tiêu hao năng lượng để sản xuất bạch cầu\n• Có thể có nhiễm trùng tiềm ẩn\n• Stress, thiếu ngủ kéo dài\n\n📋 **Cần biết:**\n• Mệt cấp độ nào? (ngủ nhiều vẫn mệt? không tập trung?)\n• Mệt được bao lâu?\n• Có sốt nhẹ hoặc triệu chứng khác không?\n\n💡 **Khuyến nghị:**\n• Nghỉ ngơi đủ (8 giờ/đêm)\n• Uống nhiều nước\n• Nếu mệt >2 tuần → khám bác sĩ\n\nBạn còn triệu chứng nào khác không?";
        } else {
          return "Cảm ơn bạn đã chia sẻ! Để tư vấn chính xác hơn với WBC cao, tôi cần biết thêm:\n\n1️⃣ **Có sốt không?** Nếu có, nhiệt độ bao nhiêu?\n2️⃣ **Có đau ở đâu không?** (họng, ngực, bụng...)\n3️⃣ **Có ho, khó thở không?**\n4️⃣ **Có phẫu thuật hoặc chấn thương gần đây không?**\n5️⃣ **Đang dùng thuốc gì?**\n\nBạn có thể trả lời ngắn gọn để tôi tư vấn tiếp nhé!";
        }
      } else if (botAskedAboutLowWBC) {
        // WBC thấp + có triệu chứng cụ thể → cảnh báo sớm
        // ✅ Tổ hợp 2-3 triệu chứng (ưu tiên cao nhất)
        if (hasFatigue && hasFever && hasBleeding) {
          return '🚨🚨🚨 **Mệt + sốt + chảy máu** với WBC thấp là CỰC KỲ NGUY HIỂM!\n\n⚠️ **NGUY CƠ CAO:**\n• Suy tủy xương cấp\n• Nhiễm trùng huyết + rối loạn đông máu\n• Nguy cơ tử vong nếu không cấp cứu\n\n🚑 **GỌI 115 NGAY HOẶC ĐI CẤP CỨU:**\n• KHÔNG tự đi (cần xe cấp cứu)\n• Mang theo tất cả phiếu xét nghiệm\n• Báo với bác sĩ cấp cứu: "WBC thấp + 3 triệu chứng"\n\n📋 **Sẽ cần làm:**\n• Xét nghiệm tủy xương khẩn\n• Cấy máu, kháng sinh tĩnh mạch\n• Truyền máu/tiểu cầu\n• Theo dõi ICU\n\nĐây là KHẨN CẤP TUYỆT ĐỐI! Hãy gọi 115 NGAY!';
        } else if (hasFatigue && hasFever) {
          return "🚨 **Mệt + sốt** với WBC thấp là tình huống KHẨN CẤP!\n\n⚠️ **Nguy cơ:**\n• Nhiễm trùng nặng do suy giảm miễn dịch\n• Có thể tiến triển nhanh\n• Cần can thiệp y tế ngay\n\n🚑 **PHẢI LÀM NGAY:**\n• ĐI CẤP CỨU hoặc gọi 115\n• Tránh tiếp xúc người bệnh/đám đông\n• Mang theo phiếu kết quả máu\n\n📋 **Bác sĩ sẽ cần:**\n• Xét nghiệm phân loại bạch cầu chi tiết\n• Cấy máu để tìm vi khuẩn\n• Có thể cần kháng sinh ngay\n\nBạn có thể đi cấp cứu ngay không? Đây là tình huống nguy hiểm!";
        } else if (hasFatigue && hasBleeding) {
          return "🩸  **Mệt + chảy máu** với WBC thấp CẦN KHÁM GẤP!\n\n⚠️ **Nghi ngờ:**\n• Suy giảm đa dòng tủy (WBC, PLT đều thấp)\n• Thiếu máu nặng + rối loạn đông máu\n• Có thể cần nhập viện\n\n🏥 **KHUYẾN NGHỊ:**\n• Đi khám trong ngày hôm nay\n• Xét nghiệm công thức máu + đông máu\n• Có thể cần xét nghiệm tủy xương\n\n📋 **Cần biết:**\n• Chảy máu ở đâu? (cam, lợi, da, nội tạng?)\n• Mệt cấp độ nào?\n• Có tiền sử bệnh gì không?\n\nVui lòng đi khám GẤP để đánh giá đầy đủ!";
        } else if (hasFever && hasBleeding) {
          return "🌡️🩸 **Sốt + chảy máu** với WBC thấp là DẤU HIỆU NGUY HIỂM!\n\n⚠️ **Có thể:**\n• Nhiễm trùng + tiểu cầu thấp\n• Sốt xuất huyết (dengue)\n• Suy tủy xương cấp\n\n🚑 **CẦN LÀM NGAY:**\n• ĐI CẤP CỨU trong vòng 2 giờ\n• Xét nghiệm: công thức máu, đông máu, NS1 (dengue)\n• Theo dõi sát tiểu cầu\n\n📋 **Lưu ý:**\n• KHÔNG dùng aspirin, ibuprofen\n• Uống nhiều nước\n• Tránh va chạm mạnh\n\nĐây là tình huống nghiêm trọng! Bạn cần đi cấp cứu NGAY!";
        } else if (hasFever && hasMedication) {
          return "💊 ️ **Sốt + dùng thuốc** với WBC thấp cần làm rõ!\n\n⚠️ **Thuốc có thể GÂY WBC THẤP:**\n• Hóa trị liệu\n• Thuốc ức chế miễn dịch\n• Một số kháng sinh (chloramphenicol)\n• Thuốc chống động kinh (carbamazepine)\n\n🏥 **CẦN LÀM:**\n• Gặp bác sĩ kê đơn TRONG NGÀY\n• Có thể cần điều chỉnh liều hoặc đổi thuốc\n• Theo dõi WBC thường xuyên hơn\n\n  **Cần biết:**\n• Tên thuốc đang dùng?\n• Dùng được bao lâu?\n• Sốt bao nhiêu độ?\n\nVui lòng liên hệ bác sĩ điều trị GẤP!";
        } else if (hasBleeding && hasMedication) {
          return "🩸💊 **Chảy máu + dùng thuốc** với WBC thấp CẦN KHẨN!\n\n⚠️ **Thuốc nguy hiểm:**\n• Hóa trị → suy tủy\n• Thuốc chống đông (warfarin, aspirin)\n• Kết hợp thuốc gây chảy máu\n\n🚑 **LÀM NGAY:**\n• ĐI CẤP CỨU nếu chảy máu nhiều\n• Mang theo tất cả thuốc đang dùng\n• KHÔNG ngừng thuốc tự ý\n\n📋 **Bác sĩ cần biết:**\n• Tên tất cả thuốc (kể cả thực phẩm chức năng)\n• Liều lượng và thời gian dùng\n• Vị trí và mức độ chảy máu\n\nĐây là tình huống cần xử lý khẩn! Vui lòng đi khám GẤP!";
        } else if (hasPain && hasMedication) {
          return "😣  **Đau + dùng thuốc** với WBC thấp cần kiểm tra!\n\n🔍 **Có thể:**\n• Tác dụng phụ của thuốc\n• Nhiễm trùng khu trú (đau vị trí nhiễm trùng)\n• Viêm khớp do thuốc\n\n  **Cần biết:**\n• Đau ở đâu? (đầu, bụng, khớp, ngực?)\n• Đang dùng thuốc gì?\n• Đau xuất hiện sau khi dùng thuốc bao lâu?\n\n🏥 **Khuyến nghị:**\n• Gặp bác sĩ trong 24-48h\n• KHÔNG tự ý dùng thêm thuốc giảm đau\n• Theo dõi thêm triệu chứng\n\nBạn đau ở vị trí nào? Tôi sẽ tư vấn cụ thể hơn!";
        } else if (hasFever) {
          return "🌡️ **Sốt** với WBC thấp CẦN RẤT CHÚ Ý!\n\n⚠️ **Nguy hiểm vì:**\n• Miễn dịch yếu → dễ nhiễm trùng nặng\n• Không đủ bạch cầu để chống nhiễm trùng\n• Có thể tiến triển nhanh\n\n📋 **Cần biết ngay:**\n• Sốt bao nhiêu độ?\n• Sốt được mấy ngày?\n• Có triệu chứng khác? (ho, đau họng, tiểu buốt...)\n• Đang điều trị bệnh gì không?\n\n🏥 **Khuyến nghị:**\n• Nếu sốt >38.5°C → đi khám NGAY\n• Nếu sốt <38.5°C → theo dõi sát, khám trong 24h\n• Uống nhiều nước, nghỉ ngơi\n\nBạn sốt bao nhiêu độ? Tôi sẽ tư vấn tiếp!";
        } else if (hasBleeding) {
          return "🩸 **Chảy máu/bầm tím** với WBC thấp CẦN CẤP CỨU!\n\n⚠️ **Nguy hiểm:**\n• Có thể kèm tiểu cầu thấp\n• Nguy cơ chảy máu nội tạng\n• Cần xét nghiệm và điều trị GẤP\n\n🚑 **LÀM NGAY:**\n• ĐI CẤP CỨU NGAY LẬP TỨC\n• Không dùng thuốc chống đông (aspirin, ibuprofen)\n• Không tự ý bấm/cọ vùng chảy máu\n\n📋 **Cần làm:**\n• Xét nghiệm công thức máu đầy đủ\n• Đông máu (PT, APTT)\n• Có thể cần truyền máu\n\nĐây là KHẨN CẤP! Bạn cần đi cấp cứu NGAY!";
        } else if (hasFatigue) {
          return "😴 **Mệt mỏi** với WBC thấp cần theo dõi sát!\n\n🔍 **Nguyên nhân có thể:**\n• Thiếu máu (cần xem HGB, HCT)\n• Suy giảm miễn dịch\n• Thiếu dinh dưỡng (B12, sắt, folate)\n• Bệnh tủy xương\n\n📋 **Cần biết thêm:**\n• Mệt cấp độ nào? (không ngủ được? ngủ nhiều vẫn mệt?)\n• Mệt được bao lâu rồi?\n• Có triệu chứng khác không? (chóng mặt, hoa mắt, da nhợt nhạt)\n• Ăn uống có bình thường không?\n\n💡 **Khuyến nghị:**\n• Nghỉ ngơi đầy đủ\n• Ăn nhiều protein, rau xanh\n• Tránh stress\n• Khám bác sĩ trong tuần này\n\nBạn có thể mô tả rõ hơn về tình trạng mệt mỏi không?";
        } else if (hasPain) {
          return "  **Có đau** với WBC thấp cần làm rõ nguyên nhân!\n\n🔍 **Có thể:**\n• Nhiễm trùng khu trú (đau vị trí nhiễm trùng)\n• Viêm khớp do suy giảm miễn dịch\n• Bệnh lý tủy xương (đau xương sâu)\n\n📋 **Cần biết:**\n• Đau ở đâu? (đầu, ngực, bụng, xương, khớp?)\n• Đau bao lâu rồi?\n• Mức độ đau: nhẹ/vừa/nặng?\n\n🏥 **Khuyến nghị:**\n• Đau nhiều → khám trong 24-48h\n• Đau xương sâu → cần xét nghiệm tủy\n• Đau kèm sốt → đi khám NGAY\n\nBạn đau ở vị trí nào? Tôi sẽ tư vấn cụ thể!";
        } else if (hasMedication) {
          return "💊 **Đang dùng thuốc** với WBC thấp cần kiểm tra!\n\n⚠️ **Thuốc GÂY WBC THẤP:**\n• Hóa trị liệu\n• Thuốc ức chế miễn dịch (azathioprine, methotrexate)\n• Một số kháng sinh\n• Thuốc chống động kinh\n\n📋 **Cần biết:**\n• Tên thuốc đang dùng?\n• Liều lượng và thời gian dùng?\n• Bác sĩ có dặn theo dõi WBC không?\n• Có triệu chứng bất thường không?\n\n🏥 **Khuyến nghị:**\n• Liên hệ bác sĩ kê đơn để tư vấn\n• KHÔNG tự ý ngừng thuốc\n• Có thể cần xét nghiệm thường xuyên hơn\n\nBạn đang dùng thuốc gì? Tôi sẽ kiểm tra tác dụng phụ!";
        } else {
          return "Cảm ơn bạn đã chia sẻ! Với WBC thấp, tôi cần biết thêm:\n\n1️⃣ **Có hay bị nhiễm trùng/sốt không?**\n2️⃣ **Có mệt mỏi kéo dài không?**\n3️⃣ **Có bầm tím/chảy máu bất thường không?**\n4️⃣ **Đang điều trị bệnh gì không?** (hóa trị, xạ trị)\n5️⃣ **Có bị bệnh virus gần đây không?**\n\nBạn có thể mô tả ngắn gọn để tôi tư vấn tiếp!";
        }
      }
    }
  }

  // 🎯 PRIORITY 4: Contextual handling (for short replies like "có", "không", numbers)
  if (lastBotMessage && uqRaw.trim().length <= 200) {
    // Check if user is answering previous question
    for (const intent of intents) {
      for (const p of intent.patterns) {
        if (p.test(uq)) {
          if (intent.response) return intent.response;
          if (intent.handler === "analyzeWbcValue") {
            const num = (uq.match(/\d+(\.\d+)?/) || [null])[0];
            if (num) {
              const analysis = analyzeWBCValue(parseFloat(num));
              return `${analysis.message}\n\n${analysis.followUp}`;
            }
            return "Bạn vui lòng cho biết giá trị WBC (ví dụ: 'WBC của tôi là 12.5') để tôi phân tích. 🩺";
          }
          if (intent.handler === "askForWbcValue") {
            return "Bạn vui lòng cung cấp giá trị WBC từ phiếu kết quả, ví dụ: 'WBC = 5.9'. Tôi sẽ so sánh với khoảng tham chiếu 4.0–10.0. 📋";
          }
          if (intent.handler === "definition") {
            return `${wbcInfo.name}: ${wbcInfo.normalRange.min}–${wbcInfo.normalRange.max} ${wbcInfo.unit}\n\nWBC là chỉ số đo số lượng bạch cầu trong máu, phản ánh khả năng miễn dịch của cơ thể.\n\nBạn muốn tôi phân tích giá trị WBC của bạn không? 🔬`;
          }
          if (intent.handler === "booking") {
            return "Bạn có thể đặt lịch trên trang chủ LabMS hoặc gọi hotline 1900-xxxx. Bạn muốn tôi hướng dẫn chi tiết quy trình đặt lịch không? 📅";
          }
        }
      }
    }
    const extracted = extractLastBotQuestion(lastBotMessage) ?? lastBotMessage;
    const ctx = findContextualAnswer(userQuestion, extracted, lastBotMessage);
    if (ctx) return ctx;
    if (ctx) return ctx;
  }

  // 🎯 PRIORITY 4: Relevance check (but analyze carefully before rejecting)
  const isGreeting = /^(hi|hello|xin chao|chao|alo)\b/.test(uq);
  if (!isGreeting && !isRelevantQuestion(uqRaw)) {
    // ⚠️ IMPORTANT: Analyze question semantics before rejecting
    // Check if it might be related but phrased differently
    const mightBeRelevant =
      /\b(suc khoe|kham|benh|tieu chay|sot|ho|dau|met|stress|an uong|tap the duc|ngu|vitamin)\b/.test(
        uq
      );
    if (mightBeRelevant) {
      // Don't reject immediately - try to find connection to blood test
      return "Tôi hiểu bạn đang quan tâm đến vấn đề sức khỏe này. Nó có thể liên quan đến kết quả xét nghiệm máu của bạn. Bạn có muốn chia sẻ kết quả WBC hoặc chỉ số máu nào để tôi tư vấn không? 🩺";
    }
    return "Xin lỗi, tôi là bác sĩ AI chuyên về xét nghiệm máu. Tôi có thể giúp bạn về: phân tích kết quả (WBC, HGB, RBC...), tư vấn triệu chứng liên quan, hoặc đặt lịch xét nghiệm. Bạn muốn hỏi về vấn đề nào? 🔬";
  }

  // Continue with existing intent matching...

  for (const intent of intents) {
    for (const p of intent.patterns) {
      if (p.test(uq)) {
        if (intent.response) return intent.response;

        if (intent.handler === "analyzeWbcValue") {
          const num = (uq.match(/\d+(\.\d+)?/) || [null])[0];
          if (num) return analyzeWbcValue(parseFloat(num));
          return "Bạn vui lòng cho biết giá trị WBC (ví dụ: 'WBC của tôi là 12.5') để tôi phân tích.";
        }

        if (intent.handler === "askForWbcValue") {
          return "Bạn vui lòng cung cấp giá trị WBC và khoảng tham chiếu (Ref Range) từ phiếu kết quả, ví dụ: 'WBC = 5.9, Ref 4.0-10.0'.";
        }

        if (intent.handler === "definition") {
          const defSample = baseConversationSamples.find(
            (s) =>
              /wbc|bach cau|bachcau/.test(normalizeForIntent(s.question)) &&
              /(la gi|y nghia|giai thich)/.test(normalizeForIntent(s.question))
          );
          if (defSample) return defSample.answer;
          return "WBC là Bạch cầu (White Blood Cells) — tế bào miễn dịch; bạn có muốn tôi kiểm tra giá trị WBC trong kết quả của bạn không?";
        }

        if (intent.handler === "booking") {
          return "Bạn có thể đặt lịch trên trang chủ LabMS hoặc gọi hotline 1900-xxxx. Bạn muốn tôi hướng dẫn chi tiết quy trình đặt lịch không?";
        }

        if (intent.handler === "contextual") {
          const lastQ = lastBotMessage
            ? extractLastBotQuestion(lastBotMessage)
            : null;
          const ca = findContextualAnswer(userQuestion, lastQ);
          if (ca) return ca;
          return "Bạn có thể cho biết chi tiết triệu chứng hoặc giá trị xét nghiệm để tôi tư vấn chính xác hơn không?";
        }
      }
    }
  }

  const hasNumber = /\d+(\.\d+)?/.test(uq);
  const hasWbcKeyword = /\b(wbc|bach cau|bachcau)\b/.test(uq);
  if (hasNumber && hasWbcKeyword) {
    const num = (uq.match(/\d+(\.\d+)?/) || [null])[0];
    if (num) return analyzeWbcValue(parseFloat(num));
  }

  const normalize = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  for (const sample of baseConversationSamples) {
    const sq = normalize(sample.question);
    if (
      sq === uq ||
      (sq.includes(uq) && uq.length > 5) ||
      (uq.includes(sq) && sq.length > 5)
    ) {
      return sample.answer;
    }

    // token-based similarity fallback for short/paraphrased user inputs
    const uqTokens = new Set(uq.split(" ").filter((t) => t.length > 1));
    const sqTokens = new Set(sq.split(" ").filter((t) => t.length > 1));
    const intersect = Array.from(uqTokens).filter((t) =>
      sqTokens.has(t)
    ).length;
    const union = new Set([...uqTokens, ...sqTokens]).size || 1;
    const jaccard = intersect / union;
    if (jaccard >= 0.45) {
      return sample.answer;
    }
  }

  for (const sample of conversationSamples) {
    const sq = normalize(sample.question);
    if (
      sq === uq ||
      (sq.includes(uq) && uq.length > 5) ||
      (uq.includes(sq) && sq.length > 5)
    ) {
      return sample.answer;
    }
  }

  // fuzzy match with explicit Sample typing to avoid 'never' or unsafe types
  const uqTokens = new Set(uq.split(" ").filter((t) => t.length > 1));
  let bestSample: Sample | null = null;
  let bestScore = 0;

  const fuzzySearch = (list: Sample[]) => {
    for (const sample of list) {
      const tokens = normalize(sample.question)
        .split(" ")
        .filter((t) => t.length > 1);
      const tokensSet = new Set(tokens);
      const intersect = Array.from(uqTokens).filter((t) =>
        tokensSet.has(t)
      ).length;
      const unionSize = new Set([...uqTokens, ...tokensSet]).size;
      const score = unionSize ? intersect / unionSize : 0;
      if (score > bestScore) {
        bestScore = score;
        bestSample = sample;
      }
    }
  };

  fuzzySearch(baseConversationSamples);
  if (bestScore < 0.45) fuzzySearch(wbcConversationSamples);

  if (bestSample !== null && bestScore >= 0.45) {
    // bestSample is a Sample — return its answer string
    return (bestSample as Sample).answer;
  }

  // no match — try to synthesize a direct answer first, otherwise steer
  const direct = generateDirectAnswer(uqRaw, lastBotMessage);
  if (direct) return direct;
  return generateSteeringReply(uqRaw);
}

// End of companyInfo.ts
