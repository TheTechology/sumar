function $(sel){ return document.querySelector(sel); }

function setYear(){
  const y = new Date().getFullYear();
  const el = $("#year");
  if(el) el.textContent = String(y);
}

async function downloadPdfFromCv(){
  const cv = $("#cv");
  const btn = $("#btnDownloadPdf");
  if(!cv) return;

  const originalText = btn ? btn.textContent : "";
  if(btn){
    btn.disabled = true;
    btn.textContent = "Generez PDF…";
  }

  try{
    const canvas = await html2canvas(cv, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#0b0f14",
      windowWidth: document.documentElement.clientWidth
    });

    const imgData = canvas.toDataURL("image/png");
    const { jsPDF } = window.jspdf;

    // A4 in pt
    const pdf = new jsPDF("p", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Fit image to A4 width, keep ratio
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while(heightLeft > 10){
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("Marian-Dumitru-CV-IT-Digitalizare.pdf");
  } catch(err){
    console.error(err);
    alert("Nu am putut genera PDF. Folosește Print (fallback) sau încearcă în Chrome.");
  } finally{
    if(btn){
      btn.disabled = false;
      btn.textContent = originalText;
    }
  }
}

function init(){
  setYear();

  const btnPdf = $("#btnDownloadPdf");
  if(btnPdf) btnPdf.addEventListener("click", downloadPdfFromCv);

  const btnPrint = $("#btnPrint");
  if(btnPrint) btnPrint.addEventListener("click", () => window.print());
}

document.addEventListener("DOMContentLoaded", init);
