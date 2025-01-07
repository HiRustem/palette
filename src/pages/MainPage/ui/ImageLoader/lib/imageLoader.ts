import { ColorCounts, SortedColor } from "@/pages/MainPage/model/types";
import { ChangeEvent } from "react";

export const getImageCanvas = (
  event: ChangeEvent<HTMLInputElement>,
  canvas: HTMLCanvasElement,
  setPalette: (palette: string[]) => void,
  setImageData: (imageUrl: string, canvasRef: HTMLCanvasElement) => void,
  uniqCount: number
) => {
  const file = event?.target?.files?.[0];

  if (!file) return;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  const imageUrl = URL.createObjectURL(file);
  const image = new Image();
  image.crossOrigin = "Anonymous";
  image.src = imageUrl;

  image.onload = () => {
    if (!ctx) return;

    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    const colors = getColorsFromImage(canvas, uniqCount);

    setPalette(colors ?? []);
    setImageData(imageUrl, canvas);
  };
};

export const getImageCanvasFromUrl = (
  imageUrl: string,
  canvas: HTMLCanvasElement,
  setPalette: (palette: any) => void,
  setImageData: (imageUrl: string, canvasRef: HTMLCanvasElement) => void,
  uniqCount: number
) => {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const image = new Image();
  image.crossOrigin = "Anonymous";
  image.src = imageUrl;

  image.onload = () => {
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    const colors = getColorsFromImage(canvas, uniqCount);

    setPalette(colors);
    setImageData(imageUrl, canvas);
  };
};

export const getColorsFromImage = (
  canvas: HTMLCanvasElement,
  uniqCount: number
) => {
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  const colorCounts = collectAllColors(pixels);
  const sortedColors = getSortedColors(colorCounts);
  const uniqueColors = getUniqColors(sortedColors, uniqCount);

  return uniqueColors.map(({ r, g, b }) => `rgb(${r},${g},${b})`);
};

const collectAllColors = (pixels: Uint8ClampedArray) => {
  const colorCounts: { [key: string]: number } = {};
  const step = 10;

  for (let i = 0; i < pixels.length; i += 4 * step) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const alpha = pixels[i + 3];

    if (alpha === 0) continue; // Пропускаем прозрачные пиксели

    const colorKey = `${r},${g},${b}`;
    colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
  }

  return colorCounts;
};

const getSortedColors = (colorCounts: ColorCounts) => {
  const colors = Object.entries(colorCounts).map(([key, count]) => {
    const [r, g, b] = key.split(",").map(Number);
    return { r, g, b, count, diffFromWhite: colorDifferenceFromWhite(r, g, b) };
  });

  const sortedColors = colors.sort((a, b) => {
    if (b.count === a.count) {
      return b.diffFromWhite - a.diffFromWhite;
    }
    return b.count - a.count;
  });

  return sortedColors;
};

const getUniqColors = (sortedColors: SortedColor[], uniqCount: number) => {
  return filterSimilarColors(sortedColors, 100, uniqCount);
};

const colorDifferenceFromWhite = (r: number, g: number, b: number) => {
  return Math.sqrt(
    Math.pow(255 - r, 2) + Math.pow(255 - g, 2) + Math.pow(255 - b, 2)
  );
};

const filterSimilarColors = (
  colors: SortedColor[],
  maxColors: number,
  similarityThreshold: number
) => {
  const result: SortedColor[] = [];

  for (const color of colors) {
    const isSimilar = result.some(
      (c) => colorSimilarity(c, color) < similarityThreshold
    );
    if (!isSimilar) {
      result.push(color);
    }
    if (result.length >= maxColors) break;
  }
  return result;
};

const colorSimilarity = (color1: SortedColor, color2: SortedColor) => {
  return Math.sqrt(
    Math.pow(color1.r - color2.r, 2) +
      Math.pow(color1.g - color2.g, 2) +
      Math.pow(color1.b - color2.b, 2)
  );
};

export const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l;

  l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const delta = max - min;
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case r:
        h = (g - b) / delta + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      case b:
        h = (r - g) / delta + 4;
        break;
    }

    if (h) h /= 6;
  }

  if (h) {
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }
};

export const rgbToHex = (r: number, g: number, b: number) => {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
};
