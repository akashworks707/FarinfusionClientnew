/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { format } from "date-fns";

import type { Order } from "@/types/orders";

import {
  generatePDFFileName,
  formatInvoiceNumber,
  formatCurrencyForPDF,
  BRAND_COLOR_DARK,
} from "@/lib/invoice";

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 35,
    backgroundColor: "#ffffff",
    fontSize: 10,
    color: "#1f2937",
    fontFamily: "Helvetica",
  },

  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: BRAND_COLOR_DARK,
  },

  companyInfo: {
    flex: 1,
    paddingRight: 20,
  },

  companyName: {
    fontSize: 20,
    fontWeight: "bold",
    color: BRAND_COLOR_DARK,
    marginBottom: 4,
  },

  companySubtitle: {
    fontSize: 10,
    color: "#666666",
    marginBottom: 10,
  },

  companyDetails: {
    fontSize: 9,
    color: "#666666",
    marginBottom: 3,
    lineHeight: 1.5,
  },

  invoiceHeader: {
    minWidth: 180,
  },

  invoiceTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: BRAND_COLOR_DARK,
    marginBottom: 10,
    textAlign: "right",
  },

  invoiceMeta: {
    fontSize: 10,
    color: "#666666",
    marginBottom: 4,
    textAlign: "right",
  },

  badgeWrapper: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  badge: {
    backgroundColor: "#fef3c7",
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },

  badgeText: {
    color: BRAND_COLOR_DARK,
    fontSize: 9,
    fontWeight: "bold",
  },

  infoGrid: {
    flexDirection: "row",
    marginBottom: 25,
  },

  infoColumnLeft: {
    flex: 1,
    paddingRight: 12,
  },

  infoColumnRight: {
    flex: 1,
    paddingLeft: 12,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: BRAND_COLOR_DARK,
    marginBottom: 10,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#fef3c7",
  },

  infoLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#666666",
    marginBottom: 2,
  },

  infoText: {
    fontSize: 10,
    color: "#1f2937",
    marginBottom: 6,
    lineHeight: 1.4,
  },

  table: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#fef3c7",
    borderBottomWidth: 2,
    borderBottomColor: BRAND_COLOR_DARK,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },

  tableHeaderCell: {
    flex: 1,
    fontSize: 10,
    fontWeight: "bold",
    color: BRAND_COLOR_DARK,
  },

  tableHeaderRight: {
    textAlign: "right",
  },

  productHeader: {
    flex: 3,
  },

  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },

  tableRowAlt: {
    backgroundColor: "#faf8f3",
  },

  tableCell: {
    flex: 1,
    fontSize: 9,
    color: "#1f2937",
  },

  productCell: {
    flex: 3,
  },

  tableCellRight: {
    textAlign: "right",
  },

  totalsWrapper: {
    marginTop: 25,
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  totalsSection: {
    minWidth: 230,
    borderWidth: 1,
    borderColor: "#fbbf24",
    backgroundColor: "#faf8f3",
    padding: 14,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  totalLabel: {
    fontSize: 10,
    color: "#666666",
  },

  totalValue: {
    fontSize: 10,
    color: "#1f2937",
    fontWeight: "bold",
  },

  totalDiscount: {
    fontSize: 10,
    color: "#059669",
    fontWeight: "bold",
  },

  divider: {
    borderBottomWidth: 1,
    borderBottomColor: BRAND_COLOR_DARK,
    marginVertical: 8,
  },

  totalAmount: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  totalAmountLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: BRAND_COLOR_DARK,
  },

  totalAmountValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: BRAND_COLOR_DARK,
  },

  footer: {
    marginTop: 35,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },

  footerCenter: {
    textAlign: "center",
  },

  footerTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: BRAND_COLOR_DARK,
    marginBottom: 6,
  },

  footerText: {
    fontSize: 9,
    color: "#666666",
    marginBottom: 3,
    lineHeight: 1.5,
  },
});

interface InvoicePDFProps {
  order: Order;
}

export function InvoicePDF({ order }: InvoicePDFProps) {
  const deliveryCharge = order.shippingCost ?? 0;
  const discount = order.discount ?? 0;
  const subtotal = order.total || 0;
  const grandTotal = subtotal;

  return (
    <Document title={generatePDFFileName(order)}>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.headerSection}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>FARIN FUSION</Text>

            <Text style={styles.companySubtitle}>
              Premium Quality Products
            </Text>

            <Text style={styles.companyDetails}>
              Email: info@farinfusion.com
            </Text>

            <Text style={styles.companyDetails}>
              Phone: +880-1-XXX-XXXXXX
            </Text>

            <Text style={styles.companyDetails}>
              Website: www.farinfusion.com
            </Text>

            <Text style={styles.companyDetails}>
              Address: Dhaka, Bangladesh
            </Text>
          </View>

          <View style={styles.invoiceHeader}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>

            <Text style={styles.invoiceMeta}>
              Invoice No: {formatInvoiceNumber(order._id)}
            </Text>

            <Text style={styles.invoiceMeta}>
              Order ID:{" "}
              {order.customOrderId || formatInvoiceNumber(order._id)}
            </Text>

            <Text style={styles.invoiceMeta}>
              Date:{" "}
              {format(
                new Date(order.createdAt || new Date()),
                "MMM dd, yyyy"
              )}
            </Text>

            <View style={styles.badgeWrapper}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {order.orderStatus || "PENDING"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* BILLING INFO */}
        <View style={styles.infoGrid}>
          <View style={styles.infoColumnLeft}>
            <Text style={styles.sectionTitle}>Bill To</Text>

            <Text style={styles.infoLabel}>Customer Name</Text>
            <Text style={styles.infoText}>
              {order.billingDetails?.fullName || "N/A"}
            </Text>

            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoText}>
              {order.billingDetails?.email || "N/A"}
            </Text>

            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoText}>
              {order.billingDetails?.phone || "N/A"}
            </Text>
          </View>

          <View style={styles.infoColumnRight}>
            <Text style={styles.sectionTitle}>Ship To</Text>

            <Text style={styles.infoText}>
              {order.shippingAddress || "N/A"}
            </Text>

            <Text style={styles.infoText}>
              {order.billingDetails?.address || "N/A"}
            </Text>

            <Text style={styles.infoLabel}>Delivery Method</Text>

            <Text style={styles.infoText}>
              {order.paymentMethod || "Standard"}
            </Text>
          </View>
        </View>

        {/* ORDER TABLE */}
        <Text style={styles.sectionTitle}>Order Details</Text>

        <View style={styles.table}>
          {/* TABLE HEADER */}
          <View style={styles.tableHeader}>
            <Text
              style={[styles.tableHeaderCell, styles.productHeader]}
            >
              Product
            </Text>

            <Text style={styles.tableHeaderCell}>Qty</Text>

            <Text
              style={[
                styles.tableHeaderCell,
                styles.tableHeaderRight,
              ]}
            >
              Unit Price
            </Text>

            <Text
              style={[
                styles.tableHeaderCell,
                styles.tableHeaderRight,
              ]}
            >
              Subtotal
            </Text>
          </View>

          {/* TABLE ROWS */}
          {order.products?.map((item: any, index: number) => {
            const product =
              typeof item.product === "object"
                ? item.product
                : {};

            const lineTotal =
              (item.price || 0) * (item.quantity || 1);

            return (
              <View
                key={index}
                style={
                  index % 2 === 1
                    ? [styles.tableRow, styles.tableRowAlt]
                    : styles.tableRow
                }
              >
                <Text
                  style={[styles.tableCell, styles.productCell]}
                >
                  {product.title || item.title || "N/A"}
                </Text>

                <Text style={styles.tableCell}>
                  {item.quantity}
                </Text>

                <Text
                  style={[
                    styles.tableCell,
                    styles.tableCellRight,
                  ]}
                >
                  {formatCurrencyForPDF(item.price || 0)}
                </Text>

                <Text
                  style={[
                    styles.tableCell,
                    styles.tableCellRight,
                  ]}
                >
                  {formatCurrencyForPDF(lineTotal)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* TOTALS */}
        <View style={styles.totalsWrapper}>
          <View style={styles.totalsSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal:</Text>

              <Text style={styles.totalValue}>
                {formatCurrencyForPDF(subtotal)}
              </Text>
            </View>

            {discount > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalDiscount}>
                  Discount:
                </Text>

                <Text style={styles.totalDiscount}>
                  -{formatCurrencyForPDF(discount)}
                </Text>
              </View>
            )}

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Delivery Charge:
              </Text>

              <Text style={styles.totalValue}>
                {deliveryCharge > 0
                  ? formatCurrencyForPDF(deliveryCharge)
                  : "FREE"}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalAmount}>
              <Text style={styles.totalAmountLabel}>
                Total Amount:
              </Text>

              <Text style={styles.totalAmountValue}>
                {formatCurrencyForPDF(grandTotal)}
              </Text>
            </View>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <View style={styles.footerCenter}>
            <Text style={styles.footerTitle}>
              Payment Information
            </Text>

            <Text style={styles.footerText}>
              Delivery Status:{" "}
              {order.deliveryStatus || "N/A"}
            </Text>

            <Text style={styles.footerText}>
              Payment Status:{" "}
              {order.payment ? "PAID" : "PENDING"}
            </Text>

            <Text
              style={[
                styles.footerText,
                { marginTop: 8, marginBottom: 8 },
              ]}
            >
              Thank you for your purchase at Farin Fusion!
            </Text>

            <Text style={styles.footerText}>
              For support, contact us at
              info@farinfusion.com
            </Text>

            <Text style={styles.footerTitle}>
              Quality Products, Premium Service
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}