import { getFeed, addReaction } from "./api.js";

const feedEl = document.getElementById("feed");
const refreshBtn = document.getElementById("refresh");

const tg = window.Telegram?.WebApp;
tg?.ready?.();
tg?.expand?.();

refreshBtn.onclick = () => loadFeed();

loadFeed();

async function loadFeed() {
  feedEl.innerHTML = "";
  const posts = await getFeed();

  if (!tg?.CloudStorage) {
    feedEl.innerHTML = `<div style="opacity:.7;padding:12px">
      Открой приложение через кнопку в боте (не в браузере).
    </div>`;
    return;
  }

  if (!posts.length) {
    feedEl.innerHTML = `<div style="opacity:.7;padding:12px">
      Пока пусто. Напиши пост боту через <b>/newpost</b>.
    </div>`;
    return;
  }

  posts.forEach(renderPost);
}

function renderPost(p) {
  const el = document.createElement("div");
  el.className = "post";

  const r = p.reactions || { support: 0, hug: 0, sad: 0 };

  el.innerHTML = `
    <div class="text">${escapeHtml(p.text)}</div>
    <div class="reactions">
      <button class="reaction" data-t="support">🤍 <span>${r.support || 0}</span></button>
      <button class="reaction" data-t="hug">🫂 <span>${r.hug || 0}</span></button>
      <button class="reaction" data-t="sad">😔 <span>${r.sad || 0}</span></button>
    </div>
  `;

  el.querySelectorAll(".reaction").forEach(btn => {
    btn.onclick = async () => {
      await addReaction(p.id, btn.dataset.t);
      await loadFeed();
    };
  });

  feedEl.appendChild(el);
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (m) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m])
  );
}
