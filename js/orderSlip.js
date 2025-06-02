document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("orderForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    const name = document.getElementById("customerName")?.value || "N/A";
    const surname = document.getElementById("customerSurname")?.value || "N/A";
    const cart = JSON.parse(localStorage.getItem("computerhub_cart")) || [];

    if (cart.length === 0) return;

    const doc = new jspdf.jsPDF();
    const logo = new Image();
    logo.src = "images/logo.jpg"; // Update path if needed

    logo.onload = () => {
      // Heading
      doc.setFontSize(18);
      doc.text("INVOICE", 10, 20);

      // Customer and date info
      doc.setFontSize(12);
      const today = new Date().toLocaleDateString();
      doc.text(`Date: ${today}`, 10, 30);
      doc.text(`Customer: ${name} ${surname}`, 10, 37);

      // Addresses
      doc.text("Unit C12, 11 Havelock Rd,", 10, 47);
      doc.text("Willow Park Manor, Pretoria, 0184", 10, 52);
      doc.text("599 Smook Ave, Roseville,", 10, 62);
      doc.text("Pretoria, 0084", 10, 67);

      // Logo or Company name
      doc.addImage(logo, "JPEG", 150, 10, 40, 30);

      // Table data
      const rows = cart.map(item => [
        item.name,
        item.qty.toString(),
        "R" + (item.price * item.qty).toFixed(2)
      ]);

      const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

      doc.autoTable({
        startY: 80,
        head: [["Description", "Quantity", "Price"]],
        body: rows,
        theme: "grid",
        headStyles: { fillColor: [0, 0, 0], textColor: 255 },
        foot: [["", "Total", "R" + total.toFixed(2)]],
        footStyles: { fillColor: [230, 230, 230], textColor: 20, fontStyle: 'bold' }
      });

      // Thank you
      doc.setFontSize(12);
      doc.text("Thank you for your order!", 10, doc.lastAutoTable.finalY + 20);

      doc.save("ComputerHub_Invoice.pdf");
    };
  });
});
