import manifest from "./photography.generated.json";

export interface PhotoVariant {
  width: number;
  src: string;
}

export interface PhotoRecord {
  source: string;
  slug: string;
  title: string;
  titleZh?: string;
  alt: string;
  series: string;
  seriesZh?: string;
  location?: string;
  date?: string;
  caption?: string;
  width?: number;
  height?: number;
  variants: PhotoVariant[];
}

export const photos = manifest as PhotoRecord[];
