import { getDocument } from 'pdfjs-dist';

async function extractPdfData(pdfUrl) {
  const loadingTask = getDocument(pdfUrl);
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  let text = '';

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join('\n');
  }

  return text;
}

export default extractPdfData;
