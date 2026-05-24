/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import type { Order } from "@/types/orders";
import {
  generatePDFFileName,
  formatInvoiceNumber,
  formatCurrencyForPDF,
} from "@/lib/invoice";

Font.register({
  family: "NotoSansBengali",
  fonts: [
    {
      src: "/fonts/NotoSansBengali-Regular.ttf",
      fontWeight: 400,
    },
    {
      src: "/fonts/NotoSansBengali-Bold.ttf",
      fontWeight: 700,
    },
  ],
});

const GOLD = "#B45309";
const GOLD_LIGHT = "#fef3c7";
const GOLD_MID = "#fbbf24";
const DARK_TEXT = "#1f2937";
const MUTED = "#6b7280";
const ROW_ALT = "#fffbeb";
const BORDER = "#e5e7eb";

const BN = "NotoSansBengali";
const EN = "Helvetica";

const S = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 40,
    paddingHorizontal: 36,
    backgroundColor: "#ffffff",
    fontSize: 10,
    color: DARK_TEXT,
    fontFamily: EN,
    position: "relative",
  },

  watermark: {
    position: "absolute",
    top: "22%",
    left: "2%",
    width: 640,
    height: 470,
    opacity: 0.15,
  },

  topBar: {
    backgroundColor: GOLD,
    height: 5,
    marginBottom: 20,
    borderRadius: 2,
  },
  bottomBar: {
    backgroundColor: GOLD,
    height: 4,
    marginTop: 14,
    borderRadius: 2,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: GOLD,
  },
  logoArea: { flex: 1 },
  logoImage: { width: 150, height: 40, marginBottom: 6 },
  companyName: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: GOLD,
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  companyTagline: {
    fontSize: 8,
    color: MUTED,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  companyDetail: {
    fontSize: 8,
    color: MUTED,
    marginBottom: 2,
    lineHeight: 1.5,
  },

  invoiceRight: { alignItems: "flex-end", minWidth: 190 },
  invoiceTitle: {
    fontSize: 32,
    fontFamily: "Helvetica-Bold",
    color: GOLD,
    letterSpacing: 3,
    marginBottom: 10,
  },
  metaLine: { fontSize: 9, color: MUTED, marginBottom: 3, textAlign: "right" },
  metaValue: { fontFamily: "Helvetica-Bold", color: DARK_TEXT },
  statusBadge: {
    marginTop: 8,
    backgroundColor: GOLD_LIGHT,
    borderRadius: 4,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: GOLD_MID,
  },
  statusText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: GOLD,
    letterSpacing: 0.5,
  },

  infoGrid: { flexDirection: "row", marginBottom: 20, gap: 16 },
  infoCol: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#fde68a",
    borderRadius: 6,
    padding: 10,
    // backgroundColor: "#fffbf0",
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: GOLD,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: GOLD_LIGHT,
    letterSpacing: 0.3,
  },
  infoLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: MUTED,
    marginBottom: 1,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  infoText: { fontSize: 9, color: DARK_TEXT, marginBottom: 6, lineHeight: 1.4 },

  table: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 20,
  },
  tableHead: {
    flexDirection: "row",
    backgroundColor: GOLD_LIGHT,
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    borderBottomColor: GOLD,
  },
  thProduct: {
    flex: 3,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: GOLD,
  },
  thCell: { flex: 1, fontSize: 9, fontFamily: "Helvetica-Bold", color: GOLD },
  thRight: { textAlign: "right" },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  tableRowAlt: { backgroundColor: ROW_ALT },
  tdProduct: { flex: 3, fontSize: 9, color: DARK_TEXT },
  tdCell: { flex: 1, fontSize: 9, color: DARK_TEXT },
  tdRight: { textAlign: "right" },
  tdSku: { fontSize: 7, color: MUTED, marginTop: 1 },

  totalsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  totalsBox: {
    width: 240,
    borderWidth: 1,
    borderColor: GOLD_MID,
    borderRadius: 6,
    backgroundColor: "#fffbf0",
    padding: 14,
  },
  totalLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 7,
  },
  totalLbl: { fontSize: 9, color: MUTED },
  totalVal: { fontSize: 9, fontFamily: "Helvetica-Bold", color: DARK_TEXT },
  totalDiscount: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#059669",
  },
  totalAdvance: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#2563eb" },
  divider: { borderBottomWidth: 1, borderBottomColor: GOLD, marginVertical: 8 },
  grandLine: { flexDirection: "row", justifyContent: "space-between" },
  grandLbl: { fontSize: 12, fontFamily: "Helvetica-Bold", color: GOLD },
  grandVal: { fontSize: 12, fontFamily: "Helvetica-Bold", color: GOLD },

  termsBox: {
    borderWidth: 1,
    borderColor: "#fde68a",
    borderRadius: 6,
    backgroundColor: "#fffbf0",
    padding: 12,
    marginBottom: 18,
  },
  termsTitle: {
    fontSize: 10,
    fontFamily: BN,
    fontWeight: 700,
    color: GOLD,
    marginBottom: 8,
  },
  termRow: {
    flexDirection: "row",
    marginBottom: 5,
    alignItems: "flex-start",
  },
  termBullet: {
    fontSize: 9,
    fontFamily: BN,
    color: "#059669",
    fontWeight: 700,
    marginRight: 4,
    marginTop: 1,
    width: 12,
  },
  termText: {
    flex: 1,
    fontSize: 8.5,
    fontFamily: BN,
    color: DARK_TEXT,
    lineHeight: 1.6,
  },

  footer: {
    marginTop: 10,
    paddingTop: 14,
    borderTopWidth: 2,
    borderTopColor: GOLD,
    alignItems: "center",
  },
  footerThank: {
    fontSize: 11,
    fontFamily: BN,
    fontWeight: 700,
    color: GOLD,
    marginBottom: 5,
  },
  footerLine: {
    fontSize: 8,
    fontFamily: EN,
    color: MUTED,
    marginBottom: 3,
    lineHeight: 1.5,
    textAlign: "center",
  },
  footerSlogan: {
    marginTop: 8,
    fontSize: 9,
    fontFamily: EN,
    color: GOLD,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  footerTagline: {
    marginTop: 4,
    fontSize: 8,
    fontFamily: BN,
    color: MUTED,
    textAlign: "center",
  },
});

const TERMS = [
  "প্রোডাক্ট হাতে পাওয়ার সময় কুরিয়ার ম্যানের সামনে পার্সেল পলি খোলার আগ থেকেই ভিডিও করুন। পার্সেল পলি খুলে প্রডাক্ট নষ্ট/সিল খোলা হলে সেই দায়ভার সম্পূর্ণ ক্রেতার।",
  "স্কিন কেয়ার প্রোডাক্টের ফলাফল ব্যক্তিভেদে ভিন্ন হতে পারে।",
  "ব্যবহৃত বা সিল খোলা প্রোডাক্ট / ড্যামেজ প্রডাক্ট রিটার্ন / এক্সচেঞ্জ গ্রহণযোগ্য নয়।",
  "সরাসরি রোদ ও অতিরিক্ত গরম স্থান থেকে দূরে সংরক্ষণ করুন।",
  "প্রোডাক্ট ব্যবহারের নির্দেশনা অনুসরণ করুন।",
];

interface InvoicePDFProps {
  order: Order;
}

export function InvoicePDF({ order }: InvoicePDFProps) {
  const deliveryCharge = order.shippingCost ?? 0;
  const discount = order.discount ?? 0;
  const grandTotal = order.total ?? 0;
  const productsSubtotal =
    order.products?.reduce(
      (sum: number, item: any) =>
        sum + Number(item.discountPrice > 0 ? item.discountPrice : item.price || 0) * Number(item.quantity || 1),
      0,
    ) ?? 0;

  return (
    <Document title={generatePDFFileName(order)}>
      <Page size="A4" style={S.page}>
        <Image src="/assets/Farin-Fusion-01.png" style={S.watermark} />

        <View style={S.topBar} />

        <View style={S.header}>
          <View style={S.logoArea}>
            <Image src="/assets/Farin-Fusion-Logo.jpeg" style={S.logoImage} />
            <Text style={S.companyName}>FARIN FUSION</Text>
            <Text style={S.companyTagline}>Premium Quality Products</Text>
            <Text style={S.companyDetail}>Email: info@farinfusion.com</Text>
            <Text style={S.companyDetail}>Phone: +8801805564602</Text>
            <Text style={S.companyDetail}>Website: www.farinfusion.com</Text>
            <Text style={S.companyDetail}>Address: Dhaka, Bangladesh</Text>
          </View>

          {/* Right: invoice meta */}
          <View style={S.invoiceRight}>
            <Text style={S.invoiceTitle}>INVOICE</Text>
            <Text style={S.metaLine}>
              Invoice No:{" "}
              <Text style={S.metaValue}>{formatInvoiceNumber(order._id)}</Text>
            </Text>
            <Text style={S.metaLine}>
              Order ID:{" "}
              <Text style={S.metaValue}>
                {order.customOrderId || formatInvoiceNumber(order._id)}
              </Text>
            </Text>
            <Text style={S.metaLine}>
              Date:{" "}
              <Text style={S.metaValue}>
                {format(new Date(order.createdAt || new Date()), "dd MMM yyyy")}
              </Text>
            </Text>
            <Text style={S.metaLine}>
              Payment:{" "}
              <Text style={S.metaValue}>
                {order.payment ? "PAID" : "PENDING"}
              </Text>
            </Text>
            <View style={S.statusBadge}>
              <Text style={S.statusText}>{order.orderStatus || "PENDING"}</Text>
            </View>
          </View>
        </View>

        {/* ══ BILLING / SHIPPING ══ */}
        <View style={S.infoGrid}>
          <View style={S.infoCol}>
            <Text style={S.sectionTitle}>Bill To</Text>
            <Text style={S.infoLabel}>Customer Name</Text>
            <Text style={S.infoText}>
              {order.billingDetails?.fullName || "N/A"}
            </Text>
            <Text style={S.infoLabel}>Email</Text>
            <Text style={S.infoText}>
              {order.billingDetails?.email || "N/A"}
            </Text>
            <Text style={S.infoLabel}>Phone</Text>
            <Text style={S.infoText}>
              {order.billingDetails?.phone || "N/A"}
            </Text>
          </View>
          <View style={S.infoCol}>
            <Text style={S.sectionTitle}>Ship To</Text>
            <Text style={S.infoLabel}>Shipping Address</Text>
            <Text style={S.infoText}>{order.shippingAddress || "N/A"}</Text>
            <Text style={S.infoLabel}>Billing Address</Text>
            <Text style={S.infoText}>
              {order.billingDetails?.address || "N/A"}
            </Text>
            <Text style={S.infoLabel}>Delivery Method</Text>
            <Text style={S.infoText}>
              {order.courierName || order.paymentMethod || "Standard"}
            </Text>
            <Text style={S.infoLabel}>Delivery Status</Text>
            <Text style={S.infoText}>{order.deliveryStatus || "N/A"}</Text>
          </View>
        </View>

        {/* ══ ORDER ITEMS ══ */}
        <Text style={S.sectionTitle}>Order Details</Text>
        <View style={S.table}>
          <View style={S.tableHead}>
            <Text style={S.thProduct}>Product</Text>
            <Text style={S.thCell}>Qty</Text>
            <Text style={[S.thCell, S.thRight]}>Unit Price</Text>
            <Text style={[S.thCell, S.thRight]}>Subtotal</Text>
          </View>
          {order.products?.map((item: any, i: number) => {
            const product =
              typeof item.product === "object" ? item.product : {};
            const lineTotal = (item.price || 0) * (item.quantity || 1);
            return (
              <View
                key={i}
                style={i % 2 === 1 ? [S.tableRow, S.tableRowAlt] : S.tableRow}
              >
                <View style={S.tdProduct}>
                  <Text>{product.title || item.title || "N/A"}</Text>
                  {product.sku && (
                    <Text style={S.tdSku}>SKU: {product.sku}</Text>
                  )}
                </View>
                <Text style={S.tdCell}>{item.quantity}</Text>
                <Text style={[S.tdCell, S.tdRight]}>
                  {formatCurrencyForPDF(item.price || 0)}
                </Text>
                <Text style={[S.tdCell, S.tdRight]}>
                  {formatCurrencyForPDF(lineTotal)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* ══ TOTALS ══ */}
        <View style={S.totalsRow}>
          <View style={S.totalsBox}>
            <View style={S.totalLine}>
              <Text style={S.totalLbl}>Products Subtotal:</Text>
              <Text style={S.totalVal}>
                {formatCurrencyForPDF(productsSubtotal as any)}
              </Text>
            </View>
            {discount > 0 && (
              <View style={S.totalLine}>
                <Text style={S.totalDiscount}>Discount:</Text>
                <Text style={S.totalDiscount}>
                  -{formatCurrencyForPDF(discount)}
                </Text>
              </View>
            )}
            {(order.advanceDetails?.amount ?? 0) > 0 && (
              <View style={S.totalLine}>
                <Text style={S.totalAdvance}>Advance Paid:</Text>
                <Text style={S.totalAdvance}>
                  -{formatCurrencyForPDF(order.advanceDetails?.amount || 0)}
                </Text>
              </View>
            )}
            <View style={S.totalLine}>
              <Text style={S.totalLbl}>Delivery Charge:</Text>
              <Text style={S.totalVal}>
                {deliveryCharge > 0
                  ? formatCurrencyForPDF(deliveryCharge)
                  : "FREE"}
              </Text>
            </View>
            <View style={S.divider} />
            <View style={S.grandLine}>
              <Text style={S.grandLbl}>Total Amount:</Text>
              <Text style={S.grandVal}>{formatCurrencyForPDF(grandTotal)}</Text>
            </View>
          </View>
        </View>

        <View style={S.termsBox}>
          <Text style={S.termsTitle}>প্রোডাক্ট নির্দেশনা ও শর্তাবলী:</Text>

          {TERMS.map((term, i) => (
            <View key={i} style={S.termRow}>
              <Text style={S.termBullet}>✓</Text>
              <Text style={S.termText}>{term}</Text>
            </View>
          ))}
        </View>

        {/* ══ FOOTER ══ */}
        <View style={S.footer}>
          <Text style={S.footerThank}>
            ধন্যবাদ আমাদের সাথে কেনাকাটা করার জন্য!
          </Text>

          <Text style={S.footerLine}>
            Thank you for your purchase at Farin Fusion. We appreciate your
            trust in our products.
          </Text>
          <Text style={S.footerLine}>
            Support: info@farinfusion.com | www.farinfusion.com
          </Text>
          <Text style={S.footerSlogan}>Quality Products, Premium Service</Text>

          {/* Bangla tagline — needs BN */}
          <Text style={S.footerTagline}>
            ফারিন ফিউশন পন্য নয়, সমাধান বিক্রি করে।
          </Text>
        </View>

        {/* ── Bottom gold bar ── */}
        <View style={S.bottomBar} />
      </Page>
    </Document>
  );
}
