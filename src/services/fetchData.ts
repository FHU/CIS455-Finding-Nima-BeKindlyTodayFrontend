import config from '../config';

const { inDev, backendUrl } = config;

/**
 * A fancy Fetch abstraction for DRY principles
 * @param endpoint The endpoint on the backend the fetch is ran against
 * @param method The method used in the request
 * @param data If a method requires body data, this is that data
 * @param token The access token for validation provided by Kinde
 * @returns Returns are dynamic depending on method.
 */
export default async function fancyFetch(options: {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: object;
  token?: string;
}) {
  const { endpoint, method, data, token } = options;

  const API_VERSION = '/api/v1';
  const url = backendUrl + API_VERSION + endpoint;

  if (!inDev) {
    try {
      const headers: HeadersInit =
        token !== undefined
          ? {
              Authorization: `Bearer ${token}`,
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers':
                'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization',
              'Access-Control-Allow-Methods':
                'GET, POST, PUT, DELETE, PATCH, OPTIONS',
              'Content-Type': 'application/json',
              Accept: 'application/json',
            }
          : {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            };
      const res: any = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }

      return await res.json();
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  } else {
    const res = await fetch(url, { method, body: JSON.stringify(data) });
    return await res.json();
  }
}
