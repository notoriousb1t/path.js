export interface PathStatic {
  mix?: (a: string, b: string, x?: number) => PathInstance;
  scale?: (pathStrings: string[], options?: { loop?: boolean }) => (x: number) => string;
  reverse?: (path: PathSource) => string;

  (d: PathSource): PathInstance;

  new (d: PathSource): PathInstance;
}

export interface PathInstance {
  points: any[][];
  d(options?: { type?: string }): string;
  toString(options?: { type?: string }): string;
  reverse?: () => string;
}

export type PathSource = PathInstance | any[][] | string;
