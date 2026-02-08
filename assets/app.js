function $(s){ return document.querySelector(s); }

function setYear(){
  const el = $("#year");
  if(el) el.textContent = String(new Date().getFullYear());
}

async function exportPdf(){
  const target = $("#cvRoot"); // exportăm cardul din dreapta (curat și scurt)
  const btn = $("#btnPdf");
  if(!target) return;

  const old = btn.textContent;
  btn.disabled = true;
  btn.textContent = "Generez PDF…";

  try{
    const canvas = await html2canvas(target, {
      scale: 2.2,
      useCORS: true,
      backgroundColor: "#ffffff"
    });

    const imgData = canvas.toDataURL("image/png");
    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF("p", "pt", "a4");
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();

    const margin = 36;
    const usableW = pageW - margin*2;

    const imgW = usableW;
    const imgH = (canvas.height * imgW) / canvas.width;

    let y = margin;
    if(imgH <= pageH - margin*2){
      pdf.addImage(imgData, "PNG", margin, y, imgW, imgH);
    } else {
      // dacă depășește, îl spargem pe pagini
      let heightLeft = imgH;
      let pos = margin;

      pdf.addImage(imgData, "PNG", margin, pos, imgW, imgH);
      heightLeft -= (pageH - margin*2);

      while(heightLeft > 0){
        pdf.addPage();
        pos = margin - (imgH - heightLeft);
        pdf.addImage(imgData, "PNG", margin, pos, imgW, imgH);
        heightLeft -= (pageH - margin*2);
      }
    }

    pdf.save("Marian-Dumitru-CV.pdf");
  } catch(e){
    console.error(e);
    alert("Nu am putut genera PDF. Folosește Print → Save as PDF ca fallback.");
    window.print();
  } finally{
    btn.disabled = false;
    btn.textContent = old;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setYear();
  const btn = $("#btnPdf");
  if(btn) btn.addEventListener("click", exportPdf);
});
