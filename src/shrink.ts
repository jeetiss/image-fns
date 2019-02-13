import createCanvas from './create-canvas'

function protect(img: HTMLCanvasElement): HTMLCanvasElement {
  const ratio = img.width / img.height

  const maxSquare = 5000000 // ios max canvas square
  const maxSize = 4096 // ie max canvas dimensions

  let maxWidth = Math.floor(Math.sqrt(maxSquare * ratio))
  let maxHeight = Math.floor(maxSquare / Math.sqrt(maxSquare * ratio))

  if (maxWidth > maxSize) {
    maxWidth = maxSize
    maxHeight = Math.round(maxWidth / ratio)
  }

  if (maxHeight > maxSize) {
    maxHeight = maxSize
    maxWidth = Math.round(ratio * maxHeight)
  }

  if (img.width > maxWidth) {
    const {canvas, context} = createCanvas(maxWidth, maxHeight)
    if (context) {
      context.drawImage(img, 0, 0, maxWidth, maxHeight)
    }

    return canvas
  }

  return img
}

function shrinkTo(input: HTMLCanvasElement, w: number, h: number) {
  const {canvas, context} = createCanvas(w, h)
  if (context) {
    context.drawImage(input, 0, 0, w, h)
  }

  return canvas
}

function shrink(image: HTMLCanvasElement, width: number, height: number) {
  let result = protect(image)

  let steps = Math.ceil(Math.log2(result.width / width))
  let shrinkWidth = width * Math.pow(2, steps - 1)
  let shrinkHeight = height * Math.pow(2, steps - 1)
  const x = 2

  while (true) {
    if (!steps--) {
      return result
    }

    result = shrinkTo(result, shrinkWidth, shrinkHeight)
    shrinkWidth = Math.round(shrinkWidth / x)
    shrinkHeight = Math.round(shrinkHeight / x)
  }
}

export default shrink
