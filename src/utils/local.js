const DEFAULT_EXPIRE_TIME = -1;

export const setLocalData = (key, data, opt = { expire: -1 }) => {
  let expire = -1;

  if (typeof opt.expire == 'number' && opt.expire > 0) {
    expire = new Date().getTime() + opt.expire;
  }
  const localedData = JSON.stringify({ data, expire });

  localStorage.setItem(key, localedData);
}

export const getLocalData = (key) => {
  try {
    const parsedData = JSON.parse(localStorage.getItem(key));
    const now = new Date().getTime();
    if (parsedData.expire === -1 || parsedData.expire > now) {
      return parsedData.data;
    }
    return null;
  } catch (err) {
    return null;
  }
}
