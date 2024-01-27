import type {
  TGetApiRes,
  TPostBody,
  TPostApiRes,
} from '@/zod-schemas/apiSchemas';
import axios from '@/apiCalls/axiosConfig';

const getApi = async (url: string) => {
  const res = await axios.get(url);
  const data: TGetApiRes = res.data;

  if ('message' in data && data.success === false) {
    if (data.message === 'Access token unauthorized!') {
      await fetch('/api/auth/refresh-token');

      const res_again = await axios.get(url);
      const data_again: TGetApiRes = res_again.data;

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

const postApi = async (url: string, postBody: TPostBody) => {
  const res = await axios.post(url, postBody);
  const data: TPostApiRes = res.data;

  if ('message' in data && data.success === false) {
    if (data.message === 'Access token unauthorized!') {
      await fetch('/api/auth/refresh-token');

      const res_again = await axios.post(url, postBody);
      const data_again: TPostApiRes = res_again.data;

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

export { getApi, postApi };
