import sharp from 'sharp';

export const sanitizeImage = async (buffer: Buffer): Promise<Buffer> => {
  try {
    const sanitized = await sharp(buffer)
      .rotate()
      .toBuffer();
    return sanitized;
  } catch (error) {
    console.error('Error sanitizing image:', error);
    throw new Error('Falha ao processar imagem.');
  }
};
