const sharp = require('sharp');
const path = require('path');

const files = ['GOODS LIFT 3', 'GOODS LIFT wall mounted'];

(async () => {
  for (const base of files) {
    const src = path.resolve(__dirname, `../client/public/images/product/${base}.jpg`);
    const dstCutout = path.resolve(__dirname, `../client/public/images/cutout/${base}.webp`);
    
    // We create a white background canvas of 500x500
    // and place the image inside with padding (e.g. 460x460), so all 4 corners are pure white (#ffffff)
    const inner = await sharp(src)
      .resize(460, 460, { fit: 'inside' })
      .toBuffer();

    await sharp({
      create: {
        width: 500,
        height: 500,
        channels: 3,
        background: { r: 255, g: 255, b: 255 }
      }
    })
      .composite([{ input: inner, gravity: 'center' }])
      .webp({ quality: 90 })
      .toFile(dstCutout);

    console.log('Fitted on pure white canvas:', base);
  }
})();
