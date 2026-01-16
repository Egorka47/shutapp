import { apiGet, apiPost } from "./api.js";

const feedEl = document.getElementById("feed");
const loadMoreBtn = document.getElementById("loadMore");

let cursor = null;

Telegram.WebApp.ready();
Telegram.WebApp.expand();

async function loadFeed() {
  let url = "/feed";
  if (cursor) url += "?cursor=" + cursor;

  const posts = await apiGet(url);
  if (!posts.length) {
    loadMoreBtn.style.display = "none";
    return;
  }

  posts.forEach(renderPost);
  cursor = posts[posts.length - 1].id;
}

function renderPost(p) {
  const el = document.createElement("div");
  el.className = "post";

  el.innerHTML = `
    <div class="author">@${p.user.username || "anon"}</div>
    <div class="text">${escapeHtml(p.text)}</div>
    <div class="actions">
      <button data-like>❤️ ${p.likes}</button>
      <button data-comments>💬 ${p.comments_count}</button>
    </div>
  `;

  el.querySelector("[data-like]").onclick = async () => {
    await apiPost(`/posts/${p.id}/reactions/toggle`, { type: "like" });
    el.querySelector("[data-like]").innerText =
      (p.my_like ? "🤍" : "❤️") + " " + (++p.likes);
    p.my_like = !p.my_like;
  };

  feedEl.appendChild(el);
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, m =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m])
  );
}

loadMoreBtn.onclick = () => loadFeed();

loadFeed();
