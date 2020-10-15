import SparkMD5 from 'spark-md5';

export const SIZE_10M = 1024 * 1024 * 10;
export const SIZE_100M = 1024 * 1024 * 100;

export const buffer2File = (buffer, filename) => {
  return new File([buffer], filename);
}

const readFile = (file) => new Promise((reslove) => {
  const timeout = setTimeout(() => {
    reslove({ err: true, message: '读取超时' });
  }, 15000);
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.addEventListener('loadend', (e) => {
    clearTimeout(timeout);
    reslove({
      buffer: e.target.result,
      name: file.name
    })
  })
});

export const file2Buffer = async (file) => {
  const { err, buffer } = await readFile(file);
  if (err) {
    return;
  }
  return buffer;
}

export const fileMD5 = async (file) => {
  const chunkSize = SIZE_100M;
  const chunks = Math.ceil(file.size / chunkSize);
  const spark = new SparkMD5.ArrayBuffer();
  for (let currentChunk = 0; currentChunk <= chunks; currentChunk++) {
    const start = currentChunk * chunkSize;
    const end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
    const buffer = await file2Buffer(file.slice(start, end));
    spark.append(buffer);
  }
  return spark.end();
}
