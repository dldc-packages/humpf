export type AsciiGraphConfig = {
  width: number;
  height: number;
  xAxis: [min: number, max: number];
  yAxis: [min: number, max: number];
};

export function asciiGraph(fn: (x: number) => number, { xAxis, yAxis, width, height }: AsciiGraphConfig): string {
  const cols: Array<string> = [];
  for (let x = 0; x < width; x++) {
    const col = Array.from({ length: height }, () => '_');
    const fnX = map(0, width, xAxis[0], xAxis[1], x);
    const fnY = Math.round(map(yAxis[0], yAxis[1], 0, height, fn(fnX)));
    if (fnY >= 0 && fnY < height) {
      col[fnY] = '█';
    }
    cols.push(col.reverse().join(''));
  }
  let res = '';
  for (let y = 0; y < height; y++) {
    res += cols.map((col) => col[y]).join('');
    if (y < height - 1) {
      res += '\n';
    }
  }
  return res;
}

export function map(inMin: number, inMax: number, outMin: number, outMax: number, num: number): number {
  return ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
