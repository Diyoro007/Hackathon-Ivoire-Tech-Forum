import Tesseract from 'tesseract.js';

export async function extractTextFromImage(file: File): Promise<string> {
  try {
    const result = await Tesseract.recognize(file, 'fra+eng', {
      logger: (m) => console.log(m)
    });
    
    return result.data.text;
  } catch (error) {
    console.error('Erreur OCR:', error);
    throw new Error('Impossible d\'extraire le texte de l\'image');
  }
}

export async function processDocument(file: File): Promise<{
  extractedText: string;
  confidence: number;
}> {
  try {
    const text = await extractTextFromImage(file);
    const confidence = text.length > 50 ? 85 : text.length > 20 ? 60 : 30;
    
    return {
      extractedText: text,
      confidence
    };
  } catch (error) {
    console.error('Erreur traitement document:', error);
    return {
      extractedText: "",
      confidence: 0
    };
  }
}