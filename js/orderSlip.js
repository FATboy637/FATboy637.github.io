  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("orderForm");

    if (form) {
      form.addEventListener("submit", async (e) => {
        const cart = JSON.parse(localStorage.getItem("computerhub_cart") || "[]");

        if (cart.length === 0) {
          e.preventDefault();
          alert("Your cart is empty. Please add items before submitting.");
          return;
        }

        const orderDetailsInput = document.getElementById("orderDetails");
        const userEmail = document.getElementById("user_email").value.trim();
        const date = new Date().toLocaleDateString();

        let message = cart.map(item =>
          `${item.name} (x${item.qty}) - R${(item.price * item.qty).toFixed(2)}`
        ).join("\n");

        const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
        message += `\n\nTotal: R${total.toFixed(2)}`;
        orderDetailsInput.value = message;

        //Generate PDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        let y = 10;
        doc.setFontSize(16);
        doc.text("ComputerHub Order Slip", 10, y);
        y += 10;

        doc.setFontSize(12);
        if (userEmail) {
          doc.text(`Customer Email: ${userEmail}`, 10, y);
          y += 10;
        }

        doc.text(`Date: ${date}`, 10, y);
        y += 10;

        doc.text("Items:", 10, y);
        y += 10;

        cart.forEach(item => {
          doc.text(`• ${item.name} (x${item.qty}) - R${(item.price * item.qty).toFixed(2)}`, 12, y);
          y += 8;
        });

        y += 5;
        doc.setFontSize(14);
        doc.text(`Total: R${total.toFixed(2)}`, 10, y);

        //Save the PDF
        doc.save("ComputerHub_Order.pdf");

        // Optional: Clear cart after short delay
        setTimeout(() => {
          localStorage.removeItem("computerhub_cart");
        }, 2000);
      });
    }
  });

