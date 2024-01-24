import type { TFetchHook } from '@/zod-schemas/apiSchemas';

type TMethod = 'POST' | 'GET' | 'DELETE';

const useFetch = async (url: string, method: TMethod = 'GET') => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = await fetch(url, options);

  const data: TFetchHook = await res.json();

  if ('message' in data && data.success === false) {
    if (data.message === 'Access token unauthorized!') {
      await fetch('/api/auth/refresh-token');

      const res_again = await fetch(url, options);
      const data_again: TFetchHook = await res_again.json();

      if ('message' in data_again && data_again.success === false) {
        throw new Error(data_again.message);
      }

      return data_again;
    } else {
      throw new Error(data.message);
    }
  } else {
    return data;
  }
};

export default useFetch;
