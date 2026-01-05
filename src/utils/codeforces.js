const API_KEY = '42e85b805f3ab13964d2438c2d9c20b899c61523';
const API_SECRET = 'fd8aa1c914e6afd313b6bcf48cb60d93d819e7fc';

async function sha512(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-512', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

export const fetchCodeforces = async (method, params = {}) => {
    const time = Math.floor(Date.now() / 1000);
    const rand = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

    // Add apiKey and time to params
    const allParams = {
        ...params,
        apiKey: API_KEY,
        time: time
    };

    // Sort params by key, then value
    const sortedKeys = Object.keys(allParams).sort();
    const sortedParams = sortedKeys.map(key => `${key}=${allParams[key]}`).join('&');

    // Create signature string
    const sigString = `${rand}/${method}?${sortedParams}#${API_SECRET}`;

    // Generate signature
    const apiSig = await sha512(sigString);

    // Final URL
    const url = `https://codeforces.com/api/${method}?${sortedParams}&apiSig=${rand}${apiSig}`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Codeforces API error: ${response.statusText}`);
    }
    return response.json();
};
