// WBC Knowledge Base - 100 conversation samples between doctor and patient
export const wbcInfo = {
  name: "White Blood Cells (Bạch cầu)",
  shortName: "WBC",
  normalRange: { min: 4.0, max: 10.0 },
  unit: "x10⁹/L",
  ranges: {
    criticalLow: { max: 1.0, label: "Cực kỳ thấp" },
    veryLow: { min: 1.0, max: 2.0, label: "Rất thấp" },
    low: { min: 2.0, max: 4.0, label: "Thấp" },
    normal: { min: 4.0, max: 10.0, label: "Bình thường" },
    slightlyHigh: { min: 10.0, max: 12.0, label: "Hơi cao" },
    high: { min: 12.0, max: 15.0, label: "Cao" },
    veryHigh: { min: 15.0, max: 20.0, label: "Rất cao" },
    criticalHigh: { min: 20.0, label: "Cực kỳ cao" },
  },
};

export type WBCConversation = {
  userQuestion: string;
  doctorAnswer: string;
  followUpQuestion: string;
  category: "basic" | "symptoms" | "treatment" | "lifestyle" | "follow-up";
};

// 100 WBC conversations categorized
export const wbcConversations: WBCConversation[] = [
  // ✅ 1–20: Basic result inquiries
  {
    userQuestion: "Bác sĩ ơi, chỉ số WBC của tôi hôm nay là bao nhiêu?",
    doctorAnswer:
      "WBC của anh là 6.2, nằm trong giới hạn bình thường (4.0–10.0).",
    followUpQuestion:
      "Anh có triệu chứng gì bất thường không, như sốt hoặc mệt?",
    category: "basic",
  },
  {
    userQuestion:
      "Em muốn xem kết quả bạch cầu, bác sĩ có thể cho em biết không?",
    doctorAnswer:
      "Bạch cầu của em là 9.8, hơi cao một chút so với giới hạn trên.",
    followUpQuestion: "Em có bị đau họng hoặc ho gần đây không?",
    category: "basic",
  },
  {
    userQuestion: "Chỉ số WBC của tôi có bình thường không bác sĩ?",
    doctorAnswer: "WBC 5.5 là hoàn toàn bình thường, không đáng lo.",
    followUpQuestion: "Anh muốn kiểm tra thêm chỉ số nào khác không?",
    category: "basic",
  },
  {
    userQuestion: "WBC của tôi thấp hay cao vậy bác sĩ?",
    doctorAnswer: "Hiện tại WBC 3.4 là hơi thấp so với giới hạn 4.0.",
    followUpQuestion: "Anh có mệt nhiều hoặc hay bị ốm gần đây không?",
    category: "basic",
  },
  {
    userQuestion: "Tôi thấy WBC ghi 12.3, điều đó có ý nghĩa gì?",
    doctorAnswer:
      "12.3 là tăng cao, có thể liên quan đến nhiễm trùng hoặc viêm.",
    followUpQuestion: "Anh có sốt hoặc đau ở vị trí nào không?",
    category: "basic",
  },
  {
    userQuestion: "Bác sĩ xem giúp tôi chỉ số WBC với ạ.",
    doctorAnswer: "Kết quả hiện tại là 7.1, hoàn toàn bình thường.",
    followUpQuestion:
      "Anh có muốn tôi giải thích ý nghĩa của chỉ số này không?",
    category: "basic",
  },
  {
    userQuestion: "Tôi mới nhận kết quả, WBC 4.2 có ổn không?",
    doctorAnswer:
      "4.2 là thấp nhẹ nhưng vẫn gần giới hạn, không quá nguy hiểm.",
    followUpQuestion:
      "Anh có uống thuốc gì đặc biệt hoặc đang điều trị bệnh nào không?",
    category: "basic",
  },
  {
    userQuestion: "WBC bao nhiêu thì được xem là bình thường vậy bác sĩ?",
    doctorAnswer:
      "Thường từ 4.0–10.0 x10⁹/L là bình thường ở người trưởng thành.",
    followUpQuestion:
      "Anh muốn biết thêm về các chỉ số bạch cầu phân loại không?",
    category: "basic",
  },
  {
    userQuestion: "Bạch cầu của tôi tăng, tôi có phải nhập viện không?",
    doctorAnswer:
      "Chưa cần ngay, chỉ tăng nhẹ lên 11.2. Cần theo dõi thêm triệu chứng.",
    followUpQuestion: "Anh có triệu chứng nào như ho, đau họng, sốt không?",
    category: "basic",
  },
  {
    userQuestion: "Em bị sốt, WBC 15 có đáng lo không bác sĩ?",
    doctorAnswer:
      "WBC 15 là tăng cao, kết hợp với sốt có thể là nhiễm trùng mạnh.",
    followUpQuestion: "Em sốt bao nhiêu độ và kéo dài bao lâu rồi?",
    category: "symptoms",
  },
  {
    userQuestion: "Cho tôi hỏi WBC có liên quan miễn dịch không?",
    doctorAnswer:
      "Có, WBC là tế bào miễn dịch chính giúp cơ thể chống nhiễm trùng.",
    followUpQuestion:
      "Anh muốn biết thêm về vai trò của từng loại bạch cầu không?",
    category: "basic",
  },
  {
    userQuestion: "WBC của tôi giảm có phải do thiếu sức đề kháng không?",
    doctorAnswer: "Có thể, cũng có thể do thuốc, virus, hoặc thiếu dinh dưỡng.",
    followUpQuestion: "Anh có hay ốm vặt hoặc lâu khỏi bệnh không?",
    category: "basic",
  },
  {
    userQuestion: "WBC thấp có nguy hiểm không bác sĩ?",
    doctorAnswer: "Nếu thấp nhiều (dưới 3.0) thì nguy cơ nhiễm trùng cao hơn.",
    followUpQuestion: "Chỉ số WBC của anh là bao nhiêu để tôi đánh giá cụ thể?",
    category: "basic",
  },
  {
    userQuestion: "Tôi muốn biết WBC 3.0 có cần điều trị không?",
    doctorAnswer:
      "WBC 3.0 là thấp, cần tìm nguyên nhân và có thể phải theo dõi sát.",
    followUpQuestion:
      "Anh có triệu chứng gì như mệt, chóng mặt, hay nhiễm trùng thường xuyên không?",
    category: "treatment",
  },
  {
    userQuestion: "Bạch cầu tăng thì có phải ung thư máu không?",
    doctorAnswer:
      "Không hẳn, đa số do nhiễm trùng hoặc viêm, ung thư máu rất hiếm.",
    followUpQuestion:
      "Anh có các triệu chứng khác như sút cân, đổ mồ hôi đêm không?",
    category: "basic",
  },
  {
    userQuestion: "WBC 11.2 có đáng lo không bác sĩ?",
    doctorAnswer:
      "Tăng nhẹ, không quá nguy hiểm, có thể do stress hoặc viêm nhẹ.",
    followUpQuestion: "Anh có bị stress nhiều hoặc mất ngủ gần đây không?",
    category: "basic",
  },
  {
    userQuestion: "Hôm nay tôi mệt, WBC chỉ 3.5. Lý do là gì?",
    doctorAnswer:
      "WBC 3.5 thấp nhẹ, có thể do virus, stress hoặc thiếu dinh dưỡng.",
    followUpQuestion: "Anh có ăn uống kém hoặc vừa ốm dậy không?",
    category: "symptoms",
  },
  {
    userQuestion: "Tôi đang mang thai, WBC cao có sao không?",
    doctorAnswer:
      "Khi mang thai WBC có thể tăng nhẹ (lên 12–13), đó là bình thường.",
    followUpQuestion:
      "Chị đang thai kỳ thứ mấy và có triệu chứng gì bất thường không?",
    category: "basic",
  },
  {
    userQuestion:
      "Bác sĩ cho biết WBC của tôi thay đổi so với lần trước thế nào?",
    doctorAnswer:
      "Lần này WBC tăng từ 5.8 lên 9.1, vẫn trong giới hạn bình thường.",
    followUpQuestion:
      "Anh có thay đổi gì về sức khỏe hoặc sinh hoạt giữa 2 lần xét nghiệm không?",
    category: "follow-up",
  },
  {
    userQuestion: "WBC 8.0 bình thường đúng không bác sĩ?",
    doctorAnswer: "Đúng, 8.0 là hoàn toàn bình thường và lý tưởng.",
    followUpQuestion: "Anh có muốn kiểm tra thêm chỉ số máu nào khác không?",
    category: "basic",
  },

  // ✅ 21–40: Symptoms & clinical context
  {
    userQuestion: "Tôi bị ho, WBC cao 14. Có phải viêm phổi không bác sĩ?",
    doctorAnswer:
      "WBC 14 kèm ho có khả năng viêm phổi, cần chụp X-quang để xác định.",
    followUpQuestion: "Anh ho có đờm không và sốt bao nhiêu độ?",
    category: "symptoms",
  },
  {
    userQuestion: "Em đau họng, WBC 13.5. Có phải nhiễm khuẩn không ạ?",
    doctorAnswer: "Khả năng cao là nhiễm khuẩn họng, có thể cần kháng sinh.",
    followUpQuestion: "Em đau họng mấy ngày rồi và có nuốt đau không?",
    category: "symptoms",
  },
  {
    userQuestion: "Tôi mệt lả, WBC 2.9. Tôi có cần nhập viện không?",
    doctorAnswer:
      "WBC 2.9 là khá thấp, nên nhập viện theo dõi và tìm nguyên nhân.",
    followUpQuestion: "Anh có bị chảy máu bất thường hoặc xuất huyết không?",
    category: "treatment",
  },
  {
    userQuestion: "Tôi bị virus gì mà WBC thấp vậy bác sĩ?",
    doctorAnswer:
      "Có thể là cúm, virus đường hô hấp, hoặc virus EBV (Epstein-Barr).",
    followUpQuestion: "Anh có sốt, đau người, hoặc mệt kéo dài không?",
    category: "symptoms",
  },
  {
    userQuestion: "Tôi bị tiêu chảy, WBC 12.5 là sao?",
    doctorAnswer:
      "WBC 12.5 có thể là nhiễm khuẩn tiêu hóa, cần xét nghiệm phân.",
    followUpQuestion: "Anh tiêu chảy mấy lần một ngày và có sốt không?",
    category: "symptoms",
  },
  {
    userQuestion: "WBC tăng nhưng tôi không sốt, có sao không bác sĩ?",
    doctorAnswer: "Có thể tăng do stress, viêm nhẹ, hút thuốc, hoặc mất nước.",
    followUpQuestion: "Anh có hút thuốc hoặc đang stress công việc không?",
    category: "symptoms",
  },
  {
    userQuestion: "WBC giảm có do thiếu vitamin không?",
    doctorAnswer: "Thiếu vitamin B12 hoặc acid folic có thể gây giảm WBC.",
    followUpQuestion: "Anh có ăn chay hoặc chế độ ăn hạn chế không?",
    category: "lifestyle",
  },
  {
    userQuestion: "Tôi bị đau bụng, WBC 16. Có nguy hiểm không?",
    doctorAnswer:
      "WBC 16 khá cao, có thể viêm ruột thừa hoặc viêm phúc mạc, cần khám gấp.",
    followUpQuestion: "Anh đau bụng ở vị trí nào và có nôn mửa không?",
    category: "symptoms",
  },
  {
    userQuestion: "Em mới ốm dậy, WBC 4.0. Có phải do hồi phục không?",
    doctorAnswer:
      "Đúng, sau nhiễm virus WBC thường thấp tạm thời trong giai đoạn hồi phục.",
    followUpQuestion:
      "Em ốm mấy ngày rồi và hiện tại còn triệu chứng gì không?",
    category: "follow-up",
  },
  {
    userQuestion: "Tôi bị viêm họng. WBC 9.0 có đúng với bệnh không?",
    doctorAnswer: "WBC 9.0 là mức tăng vừa phải, phù hợp với viêm họng nhẹ.",
    followUpQuestion: "Anh đã uống thuốc gì chưa và triệu chứng có giảm không?",
    category: "symptoms",
  },
  {
    userQuestion: "Tôi không triệu chứng nhưng WBC cao. Tại sao?",
    doctorAnswer:
      "Có thể do hút thuốc, stress, mất nước, hoặc viêm mạn tính không triệu chứng.",
    followUpQuestion:
      "Anh có hút thuốc, tập thể dục mạnh, hoặc uống ít nước không?",
    category: "lifestyle",
  },
  {
    userQuestion: "WBC thấp tôi có thể dễ bị bệnh hơn không?",
    doctorAnswer: "Đúng, WBC thấp làm sức đề kháng giảm, dễ nhiễm trùng.",
    followUpQuestion:
      "Anh có hay bị cảm cúm hoặc nhiễm trùng thường xuyên không?",
    category: "symptoms",
  },
  {
    userQuestion: "Tôi đang dùng thuốc. WBC giảm là tác dụng phụ à?",
    doctorAnswer:
      "Một số thuốc (kháng sinh, hóa trị, thuốc ức chế miễn dịch) có thể làm giảm WBC.",
    followUpQuestion: "Anh đang dùng thuốc gì để tôi kiểm tra?",
    category: "treatment",
  },
  {
    userQuestion: "WBC 12 cùng với sốt có nguy hiểm không?",
    doctorAnswer: "WBC 12 kèm sốt là dấu hiệu nhiễm trùng, cần điều trị sớm.",
    followUpQuestion: "Anh sốt bao lâu rồi và có dùng thuốc hạ sốt không?",
    category: "symptoms",
  },
  {
    userQuestion: "WBC thấp nhưng tôi khỏe, có cần lo không bác sĩ?",
    doctorAnswer:
      "Nếu thấp nhẹ (3.5–4.0) và không triệu chứng thì chỉ cần theo dõi.",
    followUpQuestion:
      "Anh có tiền sử bệnh gì hoặc gia đình có người bị bệnh máu không?",
    category: "follow-up",
  },
  {
    userQuestion: "Tôi mới tập thể dục nặng. WBC tăng là vì vậy à?",
    doctorAnswer: "Đúng, hoạt động thể lực mạnh có thể làm WBC tăng tạm thời.",
    followUpQuestion: "Anh tập mạnh thường xuyên không hay chỉ mới bắt đầu?",
    category: "lifestyle",
  },
  {
    userQuestion: "Tôi đang stress, WBC cao có liên quan không?",
    doctorAnswer:
      "Có, stress kéo dài có thể làm WBC tăng nhẹ do hormone cortisol.",
    followUpQuestion:
      "Anh đang gặp áp lực công việc hay vấn đề cá nhân gì không?",
    category: "lifestyle",
  },
  {
    userQuestion: "Tôi mất ngủ nhiều, WBC giảm có đúng không?",
    doctorAnswer:
      "Thiếu ngủ lâu dài có thể ảnh hưởng miễn dịch và làm WBC giảm.",
    followUpQuestion: "Anh ngủ mấy giờ mỗi đêm và mất ngủ kéo dài bao lâu rồi?",
    category: "lifestyle",
  },
  {
    userQuestion: "WBC 10.8 có cần uống thuốc không?",
    doctorAnswer: "Chưa cần, WBC 10.8 tăng nhẹ, cần xem thêm triệu chứng khác.",
    followUpQuestion: "Anh có triệu chứng nào như sốt, đau, hoặc mệt không?",
    category: "treatment",
  },
  {
    userQuestion: "Trẻ em WBC 13 có bình thường không bác sĩ?",
    doctorAnswer:
      "Trẻ em WBC thường cao hơn người lớn, 13 có thể bình thường tùy độ tuổi.",
    followUpQuestion: "Bé bao nhiêu tuổi và có triệu chứng gì không?",
    category: "basic",
  },

  // ✅ 41–60: Treatment & monitoring
  {
    userQuestion: "WBC tăng thì bao lâu kiểm tra lại?",
    doctorAnswer:
      "Nên kiểm tra lại sau 1–2 tuần nếu không có triệu chứng nặng.",
    followUpQuestion: "Anh có thể đặt lịch tái khám để theo dõi không?",
    category: "follow-up",
  },
  {
    userQuestion: "WBC thấp quá thì điều trị sao bác sĩ?",
    doctorAnswer:
      "Tùy nguyên nhân: bổ sung vitamin B12, thuốc kích bạch cầu, hoặc điều trị bệnh nền.",
    followUpQuestion: "Anh đã làm xét nghiệm tìm nguyên nhân chưa?",
    category: "treatment",
  },
  {
    userQuestion: "Tôi cần xét nghiệm gì thêm khi WBC tăng?",
    doctorAnswer:
      "Nên làm CRP, công thức bạch cầu (neutrophil, lympho), và xét nghiệm nhiễm trùng.",
    followUpQuestion: "Anh muốn tôi đặt lịch xét nghiệm này luôn không?",
    category: "follow-up",
  },
  {
    userQuestion: "WBC của tôi dao động thất thường, có sao không?",
    doctorAnswer:
      "Nhiều yếu tố ảnh hưởng (ăn uống, stress, ngủ), cần theo dõi dài hơn.",
    followUpQuestion:
      "Anh có ghi chép lại các lần xét nghiệm để so sánh không?",
    category: "follow-up",
  },
  {
    userQuestion: "Tôi có cần dùng kháng sinh nếu WBC cao không?",
    doctorAnswer:
      "Chỉ khi có dấu hiệu nhiễm khuẩn rõ ràng (sốt, đau, CRP cao).",
    followUpQuestion: "Anh có sốt hoặc đau ở vị trí nào không?",
    category: "treatment",
  },
  {
    userQuestion: "WBC thấp thì có được tiêm vaccine không?",
    doctorAnswer:
      "Nếu WBC quá thấp (<3.0) thì nên hoãn vaccine, cần hỏi bác sĩ.",
    followUpQuestion: "Anh định tiêm vaccine gì và WBC hiện tại là bao nhiêu?",
    category: "treatment",
  },
  {
    userQuestion: "Có thuốc nào giúp tăng WBC nhanh không bác sĩ?",
    doctorAnswer:
      "Có G-CSF (thuốc kích bạch cầu), nhưng chỉ dùng khi thực sự cần thiết.",
    followUpQuestion: "Anh có đang điều trị ung thư hoặc bệnh nặng nào không?",
    category: "treatment",
  },
  {
    userQuestion: "WBC bình thường nhưng tôi vẫn sốt. Vì sao?",
    doctorAnswer:
      "Có thể do virus (virus không làm WBC tăng nhiều), cần xét nghiệm khác.",
    followUpQuestion: "Anh sốt mấy ngày rồi và có triệu chứng cúm không?",
    category: "symptoms",
  },
  {
    userQuestion: "Tôi đang xạ trị, WBC giảm có bình thường không?",
    doctorAnswer: "Đúng, xạ trị và hóa trị thường làm giảm bạch cầu tạm thời.",
    followUpQuestion: "Anh có bị nhiễm trùng hoặc sốt gần đây không?",
    category: "treatment",
  },
  {
    userQuestion: "WBC cao bao lâu thì hạ về mức bình thường?",
    doctorAnswer: "Tùy nguyên nhân, thường 3–7 ngày sau điều trị nhiễm trùng.",
    followUpQuestion: "Anh đã điều trị được mấy ngày rồi?",
    category: "follow-up",
  },
  {
    userQuestion: "Tôi cần kiêng gì khi WBC thấp?",
    doctorAnswer:
      "Tránh người bệnh, đồ ăn sống (sushi, rau sống), vệ sinh sạch sẽ.",
    followUpQuestion: "Anh có thường xuyên tiếp xúc đông người không?",
    category: "lifestyle",
  },
  {
    userQuestion: "WBC cao có phải kiêng vận động không?",
    doctorAnswer: "Không cần kiêng trừ khi sốt cao hoặc mệt nhiều.",
    followUpQuestion: "Anh có sốt hoặc mệt không?",
    category: "lifestyle",
  },
  {
    userQuestion: "Bạch cầu thấp có nên uống vitamin C không?",
    doctorAnswer: "Có, vitamin C tốt cho miễn dịch, nên bổ sung.",
    followUpQuestion: "Anh có ăn nhiều trái cây tươi không?",
    category: "lifestyle",
  },
  {
    userQuestion: "Tôi uống thuốc cảm, WBC tăng do thuốc được không?",
    doctorAnswer: "Một số thuốc cảm có thể làm tăng nhẹ, nhưng thường do bệnh.",
    followUpQuestion: "Anh uống thuốc gì và bao lâu rồi?",
    category: "treatment",
  },
  {
    userQuestion: "Lúc nào cần lo lắng về WBC?",
    doctorAnswer:
      "Khi WBC <3.0 hoặc >15 kèm triệu chứng nặng (sốt cao, mệt nhiều).",
    followUpQuestion: "Chỉ số hiện tại của anh là bao nhiêu?",
    category: "basic",
  },
  {
    userQuestion: "WBC 7 nhưng neutrophil cao. Ý nghĩa là gì?",
    doctorAnswer:
      "Neutrophil cao (>70%) là dấu hiệu nhiễm khuẩn, cần theo dõi.",
    followUpQuestion: "Anh có triệu chứng nhiễm trùng nào không?",
    category: "follow-up",
  },
  {
    userQuestion: "WBC 5 nhưng lymphocyte thấp. Có sao không?",
    doctorAnswer: "Lympho thấp có thể do virus hoặc stress, cần xem tổng thể.",
    followUpQuestion: "Anh có vừa ốm hoặc stress nhiều không?",
    category: "follow-up",
  },
  {
    userQuestion: "WBC có thể tự tăng trở lại không bác sĩ?",
    doctorAnswer: "Có, nếu nguyên nhân nhẹ (virus, stress) thì tự hồi phục.",
    followUpQuestion: "Anh muốn theo dõi thêm bao lâu?",
    category: "follow-up",
  },
  {
    userQuestion: "Thức khuya nhiều ngày, WBC của tôi giảm. Có đúng không?",
    doctorAnswer: "Đúng, thiếu ngủ kéo dài làm miễn dịch suy yếu.",
    followUpQuestion: "Anh ngủ được mấy giờ mỗi đêm gần đây?",
    category: "lifestyle",
  },
  {
    userQuestion: "Tôi vừa phẫu thuật, WBC tăng có bình thường không?",
    doctorAnswer:
      "Bình thường, sau phẫu thuật WBC thường tăng nhẹ do phản ứng viêm.",
    followUpQuestion: "Anh mổ được mấy ngày rồi và vết mổ có sưng đỏ không?",
    category: "follow-up",
  },
  {
    userQuestion: "Khi nào WBC sẽ trở về bình thường sau kháng sinh?",
    doctorAnswer: "Thường 3–5 ngày sau khi uống kháng sinh đủ liều.",
    followUpQuestion: "Anh uống kháng sinh được mấy ngày rồi?",
    category: "treatment",
  },

  // ✅ 61–80: Nutrition & lifestyle
  {
    userQuestion: "Ăn uống có ảnh hưởng WBC không?",
    doctorAnswer:
      "Có, dinh dưỡng kém làm WBC giảm, thiếu protein và vitamin đặc biệt.",
    followUpQuestion: "Anh có ăn đủ chất không hay đang ăn kiêng?",
    category: "lifestyle",
  },
  {
    userQuestion: "Tôi nên ăn gì để tăng WBC?",
    doctorAnswer:
      "Thịt, trứng, cá, hạt, rau xanh, trái cây, bổ sung vitamin B12 và C.",
    followUpQuestion: "Anh có ăn chay hoặc hạn chế thực phẩm nào không?",
    category: "lifestyle",
  },
  {
    userQuestion: "Nhịn ăn có làm WBC giảm không?",
    doctorAnswer: "Nhịn ăn kéo dài có thể làm WBC giảm do thiếu dinh dưỡng.",
    followUpQuestion: "Anh nhịn ăn để giảm cân hay vì lý do sức khỏe?",
    category: "lifestyle",
  },
  {
    userQuestion: "Tôi uống nhiều cà phê, WBC tăng có phải vì vậy?",
    doctorAnswer: "Cà phê không ảnh hưởng nhiều đến WBC.",
    followUpQuestion: "Anh có uống bao nhiêu ly cà phê mỗi ngày?",
    category: "lifestyle",
  },
  {
    userQuestion: "WBC cao có nên uống rượu không?",
    doctorAnswer: "Không nên, rượu làm yếu miễn dịch và ảnh hưởng gan.",
    followUpQuestion: "Anh có uống rượu thường xuyên không?",
    category: "lifestyle",
  },
  {
    userQuestion: "WBC thấp có cần bổ sung kẽm không?",
    doctorAnswer: "Có, kẽm giúp tăng cường miễn dịch và hỗ trợ WBC.",
    followUpQuestion: "Anh có ăn hải sản hoặc hạt giàu kẽm không?",
    category: "lifestyle",
  },
  {
    userQuestion: "Stress kéo dài có làm giảm WBC không?",
    doctorAnswer: "Stress có thể làm WBC tăng hoặc giảm thất thường.",
    followUpQuestion: "Anh đang căng thẳng về điều gì?",
    category: "lifestyle",
  },
  {
    userQuestion: "Tập gym mạnh có làm WBC thay đổi không?",
    doctorAnswer:
      "Có, tập mạnh làm WBC tăng tạm thời, sau đó trở về bình thường.",
    followUpQuestion: "Anh tập gym mấy lần một tuần?",
    category: "lifestyle",
  },
  {
    userQuestion: "WBC thấp tôi có được ăn đồ sống không?",
    doctorAnswer: "Không nên, đồ sống dễ nhiễm khuẩn khi miễn dịch yếu.",
    followUpQuestion: "Anh có hay ăn sushi hoặc rau sống không?",
    category: "lifestyle",
  },
  {
    userQuestion: "Tôi nên uống nước nhiều hay ít nếu WBC cao?",
    doctorAnswer: "Nên uống nhiều nước để loại bỏ độc tố và giảm viêm.",
    followUpQuestion: "Anh uống được bao nhiêu lít nước mỗi ngày?",
    category: "lifestyle",
  },
  {
    userQuestion: "Thiếu ngủ có làm WBC tăng không?",
    doctorAnswer: "Thiếu ngủ thường làm giảm miễn dịch hơn là tăng WBC.",
    followUpQuestion: "Anh ngủ mấy giờ mỗi đêm?",
    category: "lifestyle",
  },
  {
    userQuestion: "Tôi bị dị ứng, WBC tăng là vì vậy à?",
    doctorAnswer: "Dị ứng có thể làm tăng eosinophil (một loại bạch cầu).",
    followUpQuestion: "Anh bị dị ứng gì và có triệu chứng nào không?",
    category: "symptoms",
  },
  {
    userQuestion: "Tôi muốn tăng sức đề kháng để WBC ổn định. Làm sao?",
    doctorAnswer:
      "Ngủ đủ 7–8 giờ, ăn đủ chất, tập thể dục đều đặn, giảm stress.",
    followUpQuestion: "Anh đang có thói quen nào trong những điều trên chưa?",
    category: "lifestyle",
  },
  {
    userQuestion: "Tôi hút thuốc, WBC của tôi cao. Có liên quan không?",
    doctorAnswer: "Có, người hút thuốc WBC thường cao hơn do viêm mạn tính.",
    followUpQuestion: "Anh hút bao nhiêu điếu mỗi ngày?",
    category: "lifestyle",
  },
  {
    userQuestion: "Tôi muốn giảm cân, WBC có ảnh hưởng không bác sĩ?",
    doctorAnswer:
      "Giảm cân lành mạnh không ảnh hưởng nhiều, nhưng nhịn ăn quá mức thì có.",
    followUpQuestion: "Anh đang áp dụng chế độ giảm cân nào?",
    category: "lifestyle",
  },
  {
    userQuestion: "WBC thấp tôi có nên uống probiotic không?",
    doctorAnswer: "Có thể, probiotic tốt cho đường ruột và miễn dịch.",
    followUpQuestion: "Anh có vấn đề về tiêu hóa không?",
    category: "lifestyle",
  },
  {
    userQuestion: "WBC cao tôi có nên tập thể dục không?",
    doctorAnswer: "Nếu không sốt thì vẫn tập nhẹ được, tránh tập quá mạnh.",
    followUpQuestion: "Anh có sốt hoặc mệt nhiều không?",
    category: "lifestyle",
  },
  {
    userQuestion: "Tâm lý lo âu có làm WBC tăng không?",
    doctorAnswer: "Có, lo âu và stress mạnh có thể làm WBC tăng tạm thời.",
    followUpQuestion: "Anh có đang lo lắng về vấn đề gì không?",
    category: "lifestyle",
  },
  {
    userQuestion: "Tôi ăn chay, WBC thấp có do thiếu chất không?",
    doctorAnswer:
      "Có thể thiếu B12 (chỉ có trong thực phẩm động vật), cần bổ sung.",
    followUpQuestion: "Anh ăn chay bao lâu rồi và có bổ sung vitamin không?",
    category: "lifestyle",
  },
  {
    userQuestion: "Tôi uống thuốc bổ có làm WBC sai lệch không?",
    doctorAnswer: "Thuốc bổ thông thường không ảnh hưởng nhiều đến WBC.",
    followUpQuestion: "Anh đang uống loại thuốc bổ gì?",
    category: "lifestyle",
  },

  // ✅ 81–100: Advanced follow-up & detailed interpretation
  {
    userQuestion: "Khi nào tôi cần xét nghiệm lại WBC?",
    doctorAnswer:
      "Khi có triệu chứng hoặc sau 1–2 tuần nếu kết quả bất thường.",
    followUpQuestion: "Anh muốn đặt lịch xét nghiệm lại không?",
    category: "follow-up",
  },
  {
    userQuestion:
      "Bạch cầu của tôi tăng rồi giảm liên tục. Có bình thường không?",
    doctorAnswer:
      "Nếu dao động nhẹ (5–9) thì bình thường, nhiều yếu tố ảnh hưởng.",
    followUpQuestion: "Anh có thay đổi sinh hoạt hoặc ăn uống gì không?",
    category: "follow-up",
  },
  {
    userQuestion: "WBC thấp có phải do di truyền không?",
    doctorAnswer:
      "Một số người có cơ địa WBC thấp hơn (3.5–4.0) nhưng vẫn khỏe.",
    followUpQuestion: "Gia đình anh có ai có WBC thấp không?",
    category: "basic",
  },
  {
    userQuestion: "WBC tăng 20 có nguy hiểm không bác sĩ?",
    doctorAnswer:
      "Rất cao, có thể nhiễm trùng nặng hoặc bệnh lý máu, cần khám gấp.",
    followUpQuestion: "Anh có sốt cao hoặc đau dữ dội không?",
    category: "symptoms",
  },
  {
    userQuestion: "WBC giảm 2.5 tôi cần làm gì ngay?",
    doctorAnswer:
      "Tránh tiếp xúc đông người, vệ sinh sạch sẽ, và khám bác sĩ ngay.",
    followUpQuestion: "Anh có triệu chứng nhiễm trùng nào không?",
    category: "treatment",
  },
  {
    userQuestion: "WBC cao có phải ung thư không?",
    doctorAnswer:
      "Không phải tất cả, đa số do nhiễm trùng, cần xét nghiệm thêm.",
    followUpQuestion: "Anh có sút cân hoặc mệt kéo dài không?",
    category: "basic",
  },
  {
    userQuestion: "Tôi bị nhiễm khuẩn, WBC bao lâu mới giảm?",
    doctorAnswer: "Thường 3–5 ngày sau khi điều trị kháng sinh hiệu quả.",
    followUpQuestion: "Anh đang uống kháng sinh gì và được mấy ngày?",
    category: "treatment",
  },
  {
    userQuestion: "WBC thấp trẻ em có nguy hiểm không?",
    doctorAnswer:
      "Cần theo dõi nguyên nhân, có thể do virus hoặc thiếu dinh dưỡng.",
    followUpQuestion: "Bé có triệu chứng gì và ăn uống thế nào?",
    category: "basic",
  },
  {
    userQuestion: "Bác sĩ giải thích cho tôi WBC neutro 70% là gì?",
    doctorAnswer: "Neutrophil chiếm 70% là dấu hiệu nhiễm khuẩn cấp.",
    followUpQuestion: "Anh có triệu chứng nhiễm trùng nào không?",
    category: "follow-up",
  },
  {
    userQuestion: "Lymphocyte của tôi giảm, có đáng lo không bác sĩ?",
    doctorAnswer: "Tùy mức độ, giảm nhẹ (<20%) là bình thường nếu tổng WBC ổn.",
    followUpQuestion: "Anh có vừa ốm hoặc stress không?",
    category: "follow-up",
  },
  {
    userQuestion: "Tôi có phải làm xét nghiệm tủy khi WBC bất thường không?",
    doctorAnswer:
      "Chỉ khi nghi ngờ bệnh lý máu nặng (WBC rất cao hoặc rất thấp kéo dài).",
    followUpQuestion: "Anh có triệu chứng nặng nào không?",
    category: "follow-up",
  },
  {
    userQuestion: "WBC giảm có nguy cơ nhiễm trùng da không?",
    doctorAnswer: "Có, miễn dịch yếu dễ bị nhiễm trùng da và vết thương.",
    followUpQuestion: "Anh có vết thương nào đang lâu lành không?",
    category: "symptoms",
  },
  {
    userQuestion: "WBC tăng có khiến tôi mệt không?",
    doctorAnswer: "Có thể, do cơ thể đang chống nhiễm trùng hoặc viêm.",
    followUpQuestion: "Anh mệt mức độ nào và kéo dài bao lâu?",
    category: "symptoms",
  },
  {
    userQuestion: "Tôi có thể làm gì để WBC ổn định hơn?",
    doctorAnswer:
      "Sinh hoạt điều độ, ngủ đủ, ăn tốt, giảm stress, tránh thuốc lá.",
    followUpQuestion: "Anh sẵn sàng thay đổi thói quen nào trước?",
    category: "lifestyle",
  },
  {
    userQuestion: "WBC bao nhiêu thì phải đi cấp cứu?",
    doctorAnswer: "WBC >20 kèm sốt cao, hoặc <3.0 kèm mệt nhiều/nhiễm trùng.",
    followUpQuestion: "Chỉ số của anh hiện tại là bao nhiêu?",
    category: "treatment",
  },
  {
    userQuestion: "Xét nghiệm WBC có sai số không?",
    doctorAnswer: "Có, do thời điểm lấy máu, uống nước, hoặc sai số phòng lab.",
    followUpQuestion: "Anh lấy máu lúc nào và có nhịn ăn không?",
    category: "follow-up",
  },
  {
    userQuestion: "Tôi bị mất nước, WBC tăng là do vậy à?",
    doctorAnswer: "Đúng, mất nước làm máu cô đặc, WBC có thể tăng giả.",
    followUpQuestion: "Anh có uống đủ nước trước khi xét nghiệm không?",
    category: "lifestyle",
  },
  {
    userQuestion: "WBC thấp có thể là do virus cúm không?",
    doctorAnswer:
      "Đúng, virus cúm và nhiều virus khác thường làm WBC giảm tạm thời.",
    followUpQuestion: "Anh có triệu chứng cúm như sốt, ho, đau người không?",
    category: "symptoms",
  },
  {
    userQuestion: "Bác sĩ có thấy WBC của tôi đang cải thiện không?",
    doctorAnswer: "Có, đã từ 3.0 tăng lên 4.5, đang hồi phục tốt.",
    followUpQuestion: "Anh có tiếp tục điều trị và theo dõi không?",
    category: "follow-up",
  },
  {
    userQuestion: "Khi nào WBC của tôi được xem là ổn định?",
    doctorAnswer: "Khi duy trì >4.0 và không dao động mạnh trong vài tuần.",
    followUpQuestion: "Anh muốn theo dõi thêm bao lâu nữa?",
    category: "follow-up",
  },
];

// Helper to analyze WBC value and provide context
export function analyzeWBCValue(value: number): {
  status: "low" | "normal" | "high";
  severity: "mild" | "moderate" | "severe" | "critical";
  rangeLabel: string;
  message: string;
  followUp: string;
} {
  const { ranges, normalRange, unit } = wbcInfo;

  // Critical Low: < 1.0
  if (value < ranges.criticalLow.max) {
    return {
      status: "low",
      severity: "critical",
      rangeLabel: ranges.criticalLow.label,
      message: `🚨 WBC ${value} ${unit} - ${ranges.criticalLow.label}! Đây là tình trạng rất nguy hiểm (giảm bạch cầu nặng - agranulocytosis). Có thể do:\n\n• Suy tủy xương nặng\n• Tác dụng phụ nghiêm trọng của thuốc hóa trị, xạ trị\n• Nhiễm virus cấp tính (HIV, viêm gan)\n• Bệnh tự miễn gây phá hủy bạch cầu\n\n⚠️ Nguy cơ nhiễm trùng rất cao, cần nhập viện khẩn cấp!`,
      followUp:
        "Anh có đang điều trị bệnh gì đặc biệt không? Có triệu chứng sốt cao, nhiễm trùng, hoặc chảy máu bất thường không? Tôi khuyên anh nên đến bệnh viện ngay để được xử lý kịp thời!",
    };
  }

  // Very Low: 1.0 - 2.0
  if (value >= ranges.veryLow.min && value < ranges.veryLow.max) {
    return {
      status: "low",
      severity: "severe",
      rangeLabel: ranges.veryLow.label,
      message: `⚠️ WBC ${value} ${unit} - ${ranges.veryLow.label} (bình thường: ${normalRange.min}-${normalRange.max}). Đây là mức giảm bạch cầu đáng lo ngại. Nguyên nhân có thể:\n\n• Nhiễm virus nặng (sốt xuất huyết, viêm gan, HIV)\n• Dùng thuốc ức chế miễn dịch, hóa trị\n• Thiếu vitamin B12, acid folic nghiêm trọng\n• Rối loạn tủy xương\n• Bệnh tự miễn`,
      followUp:
        "Anh có đang dùng thuốc gì đặc biệt không? Có triệu chứng mệt mỏi kéo dài, nhiễm trùng tái phát, hoặc sốt không rõ nguyên nhân không? Anh nên gặp bác sĩ chuyên khoa huyết học sớm nhé!",
    };
  }

  // Low: 2.0 - 4.0
  if (value >= ranges.low.min && value < ranges.low.max) {
    return {
      status: "low",
      severity: "moderate",
      rangeLabel: ranges.low.label,
      message: `📉 WBC ${value} ${unit} - ${ranges.low.label} (bình thường: ${normalRange.min}-${normalRange.max}). Bạch cầu giảm nhẹ, có thể do:\n\n• Nhiễm virus (cúm, COVID-19, sốt virus)\n• Thiếu dinh dưỡng (protein, vitamin B12, kẽm)\n• Dùng kháng sinh kéo dài\n• Mệt mỏi, stress mãn tính\n• Giai đoạn sau bệnh nhiễm trùng`,
      followUp:
        "Anh có bị cảm cúm hoặc nhiễm virus gần đây không? Chế độ ăn uống của anh có đầy đủ không? Có cảm thấy mệt mỏi thường xuyên không?",
    };
  }

  // Normal: 4.0 - 10.0
  if (value >= ranges.normal.min && value <= ranges.normal.max) {
    return {
      status: "normal",
      severity: "mild",
      rangeLabel: ranges.normal.label,
      message: `✅ WBC ${value} ${unit} - ${ranges.normal.label}! Hệ miễn dịch hoạt động tốt, không có dấu hiệu nhiễm trùng hay viêm nhiễm đáng lo ngại.`,
      followUp:
        "Chỉ số WBC của anh rất tốt! Anh có muốn tôi giải thích thêm về các chỉ số máu khác hoặc có thắc mắc gì về sức khỏe không?",
    };
  }

  // Slightly High: 10.0 - 12.0
  if (value > ranges.slightlyHigh.min && value <= ranges.slightlyHigh.max) {
    return {
      status: "high",
      severity: "mild",
      rangeLabel: ranges.slightlyHigh.label,
      message: `📈 WBC ${value} ${unit} - ${ranges.slightlyHigh.label} (bình thường: ${normalRange.min}-${normalRange.max}). Tăng nhẹ, thường do:\n\n• Nhiễm trùng nhẹ đang hình thành\n• Viêm họng, viêm phế quản nhẹ\n• Stress thể lực hoặc tinh thần\n• Sau vận động mạnh\n• Hút thuốc lá`,
      followUp:
        "Anh có cảm thấy đau họng, ho, hoặc khó chịu ở đâu không? Có stress hoặc vận động mạnh gần đây không? Anh có hút thuốc không?",
    };
  }

  // High: 12.0 - 15.0
  if (value > ranges.high.min && value <= ranges.high.max) {
    return {
      status: "high",
      severity: "moderate",
      rangeLabel: ranges.high.label,
      message: `⚠️ WBC ${value} ${unit} - ${ranges.high.label} (bình thường: ${normalRange.min}-${normalRange.max}). Tăng rõ rệt, thường do:\n\n• Nhiễm khuẩn cấp tính (viêm phổi, viêm đường tiết niệu, viêm ruột)\n• Phản ứng viêm trong cơ thể\n• Stress, phẫu thuật gần đây\n• Dùng corticoid\n• Hút thuốc lá nhiều`,
      followUp:
        "Anh có sốt, đau dữ dội, hoặc triệu chứng nhiễm trùng nào không? Có phẫu thuật hoặc chấn thương gần đây không? Đang dùng thuốc gì đặc biệt không?",
    };
  }

  // Very High: 15.0 - 20.0
  if (value > ranges.veryHigh.min && value <= ranges.veryHigh.max) {
    return {
      status: "high",
      severity: "severe",
      rangeLabel: ranges.veryHigh.label,
      message: `🚨 WBC ${value} ${unit} - ${ranges.veryHigh.label}! Tăng rất cao (bình thường: ${normalRange.min}-${normalRange.max}). Cần chú ý các nguyên nhân:\n\n• Nhiễm trùng nặng (viêm phổi nặng, nhiễm khuẩn huyết)\n• Viêm ruột thừa cấp\n• Phản ứng viêm toàn thân\n• Bệnh lý tủy xương (hiếm gặp)\n• Stress nặng, chấn thương nghiêm trọng`,
      followUp:
        "Anh có sốt cao liên tục, đau bụng dữ dội, hoặc triệu chứng nặng nào không? Có bị chấn thương hoặc phẫu thuật lớn gần đây không? Tôi khuyên anh nên gặp bác sĩ sớm để kiểm tra kỹ!",
    };
  }

  // Critical High: > 20.0
  if (value > ranges.criticalHigh.min) {
    return {
      status: "high",
      severity: "critical",
      rangeLabel: ranges.criticalHigh.label,
      message: `🚨🚨 WBC ${value} ${unit} - ${ranges.criticalHigh.label}! Mức tăng nguy hiểm (bình thường: ${normalRange.min}-${normalRange.max}). Nguyên nhân nghiêm trọng:\n\n• Nhiễm khuẩn huyết (sepsis)\n• Viêm phúc mạc cấp\n• Bệnh lý tủy xương (bạch cầu cấp/mạn)\n• Hoại tử mô rộng\n• Phản ứng viêm toàn thân nặng\n\n⚠️ ĐÂY LÀ MỨC NGUY HIỂM - CẦN XỬ LÝ Y TẾ KHẨN CẤP!`,
      followUp:
        "Anh có triệu chứng nặng như sốt cao kéo dài, đau đớn dữ dội, lú lẫn, khó thở, hoặc suy nhược nặng không? Tình trạng này rất nghiêm trọng - anh cần đến bệnh viện NGAY để được chẩn đoán và điều trị kịp thời!",
    };
  }

  // Fallback (shouldn't happen)
  return {
    status: "normal",
    severity: "mild",
    rangeLabel: "Không xác định",
    message: `WBC ${value} ${unit}. Vui lòng kiểm tra lại giá trị này.`,
    followUp: "Anh có thể cung cấp lại chỉ số WBC chính xác được không?",
  };
}

// Find matching conversation by semantic similarity
// ⚠️ IMPORTANT: Only use this for questions WITHOUT numeric values
// If user provides a value, use analyzeWBCValue() instead to avoid hardcoded responses
export function findWBCConversation(userInput: string): WBCConversation | null {
  const input = userInput.toLowerCase().trim();

  // ❌ DO NOT process if user provided a specific value - return null immediately
  // This forces the caller to use analyzeWBCValue() instead
  const hasValue = /\d+(\.\d+)?/.test(input);
  if (hasValue) {
    return null; // Let analyzeWBCValue handle it dynamically
  }

  // ✅ Only match for conceptual questions (symptoms, lifestyle, general advice)
  // Filter to categories that don't contain hardcoded values
  const conceptualCategories: Array<WBCConversation["category"]> = [
    "symptoms",
    "lifestyle",
    "follow-up",
  ];

  const matches = wbcConversations.filter((conv) => {
    // Skip conversations that contain hardcoded numeric values
    if (/\d+(\.\d+)?/.test(conv.doctorAnswer)) {
      return false;
    }

    // Only match conceptual categories
    if (!conceptualCategories.includes(conv.category)) {
      return false;
    }

    const question = conv.userQuestion.toLowerCase();
    // Check for key phrase overlap
    const userWords = input.split(/\s+/).filter((w) => w.length > 2);
    const questionWords = question.split(/\s+/).filter((w) => w.length > 2);
    const overlap = userWords.filter((w) =>
      questionWords.some((q) => q.includes(w) || w.includes(q))
    );
    return overlap.length >= 2; // At least 2 words overlap
  });

  // Return best match (prioritize exact category match if user intent is clear)
  if (matches.length > 0) {
    // Sort by relevance (more word overlaps = better)
    matches.sort((a, b) => {
      const scoreA = a.userQuestion
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => input.includes(w)).length;
      const scoreB = b.userQuestion
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => input.includes(w)).length;
      return scoreB - scoreA;
    });
    return matches[0];
  }

  return null;
}
