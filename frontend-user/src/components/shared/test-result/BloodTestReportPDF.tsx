/* eslint-disable jsx-a11y/alt-text */
import React from "react";

import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import { Comment, TestResultParameters } from "@/types/test-result";

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "/fonts/Roboto-Regular.ttf",
      fontWeight: 400,
      fontStyle: "normal",
    },
    {
      src: "/fonts/Roboto-Bold.ttf",
      fontWeight: 700,
      fontStyle: "normal",
    },
    {
      src: "/fonts/Roboto-Italic.ttf", // ✅ Add italic variant
      fontWeight: 400,
      fontStyle: "italic",
    },
  ],
});
// Create styles matching BloodTestReportContent - OPTIMIZED FOR SINGLE PAGE
const styles = StyleSheet.create({
  page: {
    padding: 14,
    fontFamily: "Roboto",
    backgroundColor: "#ffffff",
    fontSize: 10,
  },
  // Header Section
  header: {
    flexDirection: "row",
    marginBottom: 8,
    marginHorizontal: 50,
    borderBottom: "1.5pt solid #d1d5db",
    paddingBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
  },
  logo: {
    width: 100,
    height: 100,
  },
  headerRight: {
    flexDirection: "column",
    justifyContent: "center",
  },
  companyName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#b91c1c",
    marginBottom: 4,
  },
  companyInfo: {
    fontSize: 9,
    color: "#4b5563",
    marginBottom: 2,
  },
  companyInfoBold: {
    fontSize: 9,
    color: "#4b5563",
    fontWeight: "bold",
  },
  // Title
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#1f2937",
  },
  // Patient Info Grid
  patientInfoGrid: {
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 6,
    borderBottom: "0.5pt solid #e4e4e7",
    paddingBottom: 6,
    gap: 30,
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#374151",
    width: 90,
  },
  infoValue: {
    fontSize: 9,
    color: "#111827",
    flex: 1,
  },
  infoValueBold: {
    fontSize: 9,
    color: "#111827",
    fontWeight: "bold",
    flex: 1,
  },
  // Table
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderTop: "0.5pt solid #9ca3af",
    borderBottom: "0.5pt solid #9ca3af",
    borderLeft: "0.5pt solid #9ca3af",
    borderRight: "0.5pt solid #9ca3af",
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  tableHeaderCell: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: "#374151",
  },
  tableSubHeader: {
    flexDirection: "row",
    backgroundColor: "#dbeafe",
    borderLeft: "0.5pt solid #9ca3af",
    borderRight: "0.5pt solid #9ca3af",
    borderBottom: "0.5pt solid #9ca3af",
    paddingVertical: 6,
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },
  tableSubHeaderText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#1f2937",
  },
  tableRow: {
    flexDirection: "row",
    borderLeft: "0.5pt solid #9ca3af",
    borderRight: "0.5pt solid #9ca3af",
    borderBottom: "0.5pt solid #9ca3af",
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  tableRowHighlight: {
    backgroundColor: "#fef2f2",
  },
  tableCell: {
    fontSize: 8,
    color: "#1f2937",
  },
  tableCellBold: {
    fontSize: 8,
    color: "#111827",
    fontWeight: "bold",
  },
  // Table Columns
  col1: { width: "12%" },
  col2: { width: "30%" },
  col3: { width: "12%", textAlign: "center" },
  col4: { width: "20%", textAlign: "center" },
  col5: { width: "10%", textAlign: "center" },
  col6: { width: "16%", textAlign: "center" },
  // Flag Colors
  flagNormal: {
    color: "#16a34a",
    fontWeight: "bold",
  },
  flagHigh: {
    color: "#dc2626",
    fontWeight: "bold",
  },
  flagLow: {
    color: "#fb923c",
    fontWeight: "bold",
  },
  // Comments Section
  commentsSection: {
    marginBottom: 16,
    border: "0.5pt solid #d1d5db",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fef2f2",
    minHeight: 100,
  },
  commentsTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 10,
  },
  commentItem: {
    borderLeft: "4pt solid #dc2626",
    paddingLeft: 12,
    marginBottom: 12,
  },
  commentHeader: {
    fontSize: 8,
    color: "#6b7280",
    marginBottom: 4,
  },
  commentText: {
    fontSize: 8,
    color: "#111827",
  },
  // Signature Section
  signatureSection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 70,
    marginBottom: 20,
  },
  signatureBox: {
    width: 180,
    alignItems: "center",
  },
  signatureDate: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 8,
    textAlign: "center",
  },
  signatureTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 60,
    textAlign: "center",
  },
  signatureName: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
  },
  // Footer
  footer: {
    borderTop: "0.5pt solid #d1d5db",
    paddingTop: 14,
    textAlign: "center",
  },
  footerText: {
    fontSize: 7,
    color: "#fca5a5",
    fontStyle: "italic",
    lineHeight: 1.4, // ✅ Add line height for better readability
    maxWidth: "100%", // ✅ Ensure text wraps within container
  },
});

// ✅ Fixed interface to match BloodTestReportContentProps
interface BloodTestReportPDFProps {
  patientName?: string;
  address?: string;
  birthYear?: string;
  gender?: string;
  accessionNumber?: string;
  instrument?: string;
  testDate?: string;
  parameters: TestResultParameters[];
  doctorComments: Comment[];
  doctorName?: string;
  signatureDate?: string;
  status?: string;
  phone?: string;
  email?: string;
}

const formatParameterFlag = (flag: string | null | undefined) => {
  if (flag === "H") return "High";
  if (flag === "L") return "Low";
  return "Normal";
};

const BloodTestReportPDF: React.FC<BloodTestReportPDFProps> = ({
  patientName = "",
  address = "",
  birthYear = "",
  gender = "",
  // accessionNumber = "",
  instrument = "",
  testDate = "",
  parameters = [],
  doctorComments = [],
  doctorName = "",
  signatureDate = "",
  phone = "",
  // email = "",
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image src="/images/LogoPDF2.png" style={styles.logo} />
          <View style={styles.headerRight}>
            <Text style={styles.companyName}>
              TRUNG TÂM XÉT NGHIỆM MÁU CODE GANG
            </Text>
            <Text style={styles.companyInfo}>
              Địa chỉ: S9.01 Vinhome Grand Park, Phường Long Bình, TP. Thủ Đức,
              Việt Nam
            </Text>
            <Text style={styles.companyInfoBold}>
              Hotline: 0799 995 828 | Hotline khiếu nại: 0885 034 070
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>PHIẾU TRẢ KẾT QUẢ XÉT NGHIỆM</Text>

        {/* Patient Information */}
        <View style={styles.patientInfoGrid}>
          {/* Row 1 */}
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={[styles.infoRow, { flex: 1 }]}>
              <Text style={styles.infoLabel}>HỌ VÀ TÊN:</Text>
              <Text style={styles.infoValueBold}>{patientName}</Text>
            </View>
            <View style={[styles.infoRow, { flex: 1 }]}>
              <Text style={styles.infoLabel}>NĂM SINH:</Text>
              <Text style={styles.infoValue}>{birthYear}</Text>
            </View>
          </View>

          {/* Row 2 */}
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={[styles.infoRow, { flex: 1 }]}>
              <Text style={styles.infoLabel}>ĐỊA CHỈ:</Text>
              <Text style={styles.infoValue}>{address}</Text>
            </View>
            <View style={[styles.infoRow, { flex: 1 }]}>
              <Text style={styles.infoLabel}>GIỚI TÍNH:</Text>
              <Text style={styles.infoValue}>{gender}</Text>
            </View>
          </View>

          {/* Row 3 */}
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={[styles.infoRow, { flex: 1 }]}>
              <Text style={styles.infoLabel}>ĐIỆN THOẠI:</Text>
              <Text style={styles.infoValue}>{phone}</Text>
            </View>
            <View style={[styles.infoRow, { flex: 1 }]}>
              <Text style={styles.infoLabel}>THIẾT BỊ:</Text>
              <Text style={styles.infoValue}>{instrument}</Text>
            </View>
          </View>
        </View>

        {/* Test Results Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.col1]}>MÃ</Text>
            <Text style={[styles.tableHeaderCell, styles.col2]}>
              TÊN XÉT NGHIỆM
            </Text>
            <Text style={[styles.tableHeaderCell, styles.col3]}>KẾT QUẢ</Text>
            <Text style={[styles.tableHeaderCell, styles.col4]}>
              CHỈ SỐ BÌNH THƯỜNG
            </Text>
            <Text style={[styles.tableHeaderCell, styles.col5]}>ĐƠN VỊ</Text>
            <Text style={[styles.tableHeaderCell, styles.col6]}>
              TÌNH TRẠNG
            </Text>
          </View>

          {/* Sub Header */}
          <View style={styles.tableSubHeader}>
            <Text style={styles.tableSubHeaderText}>CÔNG THỨC MÁU</Text>
            <Text style={styles.tableSubHeaderText}>{testDate}</Text>
          </View>

          {/* Table Rows */}
          {parameters?.map((param, index) => (
            <View
              key={param.sequence || index}
              style={[
                styles.tableRow,
                param.flag === "H" || param.flag === "L"
                  ? styles.tableRowHighlight
                  : {},
              ]}
            >
              <Text style={[styles.tableCellBold, styles.col1]}>
                {param.paramCode || ""}
              </Text>
              <Text style={[styles.tableCell, styles.col2]}>
                {param.paramName || ""}
              </Text>
              <Text style={[styles.tableCellBold, styles.col3]}>
                {param.value || ""}
              </Text>
              <Text style={[styles.tableCell, styles.col4]}>
                {param.refRange || ""}
              </Text>
              <Text style={[styles.tableCell, styles.col5]}>
                {param.unit || ""}
              </Text>
              <Text
                style={[
                  styles.tableCellBold,
                  styles.col6,
                  param.flag === "H"
                    ? styles.flagHigh
                    : param.flag === "L"
                      ? styles.flagLow
                      : styles.flagNormal,
                ]}
              >
                {formatParameterFlag(param.flag)}
              </Text>
            </View>
          ))}
        </View>

        {/* Doctor Comments */}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>GHI CHÚ CỦA BÁC SĨ</Text>
          {doctorComments && doctorComments.length > 0 ? (
            <View>
              <Text style={styles.commentText}>
                {doctorComments.map((comment, index) => (
                  <Text key={comment.commentId || index}>
                    <Text style={{ fontWeight: "bold" }}>
                      {comment.doctorName}
                    </Text>
                    {": "}
                    {comment.commentContent}
                    {index < doctorComments.length - 1 && ", "}
                  </Text>
                ))}
              </Text>
            </View>
          ) : (
            <Text style={styles.commentText}>Không có ghi chú.</Text>
          )}
        </View>

        {/* Signature */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureDate}>{signatureDate}</Text>
            <Text style={styles.signatureTitle}>PHÒNG XÉT NGHIỆM</Text>
            <Text style={styles.signatureName}>DR. {doctorName}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Dựa vào kết quả xét nghiệm không thể chuẩn đoán được bệnh, cần phải
            kết hợp với các triệu chứng lâm sàng, cận lâm sàng và tiền sử bệnh
            để có chuẩn đoán chính xác
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default BloodTestReportPDF;
