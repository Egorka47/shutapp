const API_URL = "https://YOUR_BACKEND_URL"; // потом подставишь
const tg = window.Telegram.WebApp;

export async function apiGet(path) {
  const res = await fetch(API_URL + path, {
    headers: {
      "X-Tg-Init-Data": tg.initData
    }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiPost(path, body) {
  const res = await fetch(API_URL + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Tg-Init-Data": tg.initData
    },
    body: JSON.stringify(body || {})
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
