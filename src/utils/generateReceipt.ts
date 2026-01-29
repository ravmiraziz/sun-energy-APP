import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatPrice } from "./formatter";

export const generateReceiptPDF = (order: any) => {
  const doc = new jsPDF();

  // 🔰 HEADER
  doc.setFontSize(18);
  doc.text("TO‘LOV CHEKI", 105, 20, { align: "center" });

  doc.setFontSize(10);
  doc.text(`Buyurtma #: ${order.order_id}`, 14, 30);
  doc.text(`Sana: ${new Date(order.created_at).toLocaleString()}`, 14, 36);

  // 👤 MIJOZ
  doc.setFontSize(12);
  doc.text("Mijoz ma'lumotlari", 14, 48);

  doc.setFontSize(10);
  doc.text(`Ism: ${order.user.first_name} ${order.user.last_name}`, 14, 55);
  doc.text(`Telefon: +${order.user.phone}`, 14, 61);
  doc.text(`Manzil: ${order.user.address}`, 14, 67);

  // 🧾 ITEMS TABLE
  const tableData = order.items.map((item: any, index: number) => [
    index + 1,
    item.product_info.name_uz,
    item.amount,
    formatPrice(item.unit_price),
    formatPrice(item.total_price),
  ]);

  autoTable(doc, {
    startY: 75,
    head: [["#", "Mahsulot", "Soni", "Narxi", "Jami"]],
    body: tableData,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: 255,
    },
    columnStyles: {
      0: { cellWidth: 10 },
      2: { cellWidth: 20 },
      3: { cellWidth: 30 },
      4: { cellWidth: 30 },
    },
  });

  // 💰 TOTAL
  const finalY = (doc as any).lastAutoTable.finalY + 10;

  doc.setFontSize(12);
  doc.text("Jami to‘lov:", 130, finalY);
  doc.setFontSize(14);
  doc.text(`${formatPrice(order.total_price)} so'm`, 130, finalY + 8);

  // FOOTER
  doc.setFontSize(9);
  doc.text("Rahmat! Xaridingiz uchun minnatdormiz.", 105, 285, {
    align: "center",
  });

  // ⬇️ DOWNLOAD
  doc.save(`${order.user.first_name}_${order.order_id}.pdf`);
};
