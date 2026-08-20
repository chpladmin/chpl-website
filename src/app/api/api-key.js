const HARDCODED_API_KEY = '12909a978483dfb8ecd0596c98ae9094';

function getApiKey() {
  if (window.__env && window.__env.API_KEY) {
    return window.__env.API_KEY;
  }
  return HARDCODED_API_KEY;
}

export default getApiKey;
