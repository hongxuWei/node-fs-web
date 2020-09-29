export const SIZE_UNIT = {
  AUTO: 0,
  KB: 1,
  MB: 2,
  GB: 3,
  TB: 4,
  PB: 5,
}


export const format = (size, type = 0) => {
  const BASE = 1000;
  let pow = Math.pow(BASE, type - SIZE_UNIT.AUTO);

  if (type === SIZE_UNIT.AUTO) {
    while (size > BASE && type < SIZE_UNIT.PB) {
      size = size / BASE;
      type += 1;
    }
    pow = 1;
  }

  if (type !== SIZE_UNIT.AUTO) {
    return `${(size / pow).toFixed(1)} ${
      type === SIZE_UNIT.KB ? 'KB' :
      type === SIZE_UNIT.MB ? 'MB' :
      type === SIZE_UNIT.GB ? 'GB' :
      type === SIZE_UNIT.TB ? 'TB' :
      'PB'
    }`
  }
  return `${size} B`;
}
