type optionsType = {
  method: 'POST' | 'GET' | 'DELETE';
  headers?: {
    'Content-Type': 'application/json';
  };
};

const useFetch = async (url: string, options: null | optionsType = null) => {
  if (options === null) {
    options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  const res = await fetch(url, options);
  const data = await res.json();

  if (data.success === false) {
    if (data.message === 'Access token unauthorized!') {
      await fetch('/api/auth/refresh-token');

      const res_again = await fetch(url, options);
      const data_again = await res_again.json();

      if (data_again.success === false) {
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
