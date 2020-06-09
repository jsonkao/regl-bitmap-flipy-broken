import textureFrag from './shaders/texture.frag';
import textureVert from './shaders/texture.vert';

import createREGL from 'regl';
const regl = createREGL();

const imgUrl = 'https://webglfundamentals.org/webgl/resources/leaves.jpg';

async function getBitmap() {
  return fetch(imgUrl)
    .then(response => response.blob())
    .then(blob => createImageBitmap(blob));
}

async function getImage() {
  return new Promise(resolve => {
    const image = new Image();
    image.src = imgUrl;
    image.crossOrigin = '';
    image.onload = () => resolve(image);
  });
}

async function main() {
  // Using getImage(), texture is flipped correctly
  const texture = regl.texture({ data: await getImage(), flipY: true });

  // Using getBitmap(), texture is unflipped no matter what flipY is set to
  // const texture = regl.texture({ data: await getBitmap(), flipY: true });

  const drawTexture = regl({
    frag: textureFrag,
    vert: textureVert,

    uniforms: {
      texture,
    },

    attributes: {
      // Two triangles that cover the whole clip space
      position: regl.buffer([
        [-1, 1],
        [1, -1],
        [1, 1],
        [-1, 1],
        [1, -1],
        [-1, -1],
      ]),
    },

    count: 6,
  });

  drawTexture();
}

main().catch(console.error);
