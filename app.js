import { getFeed } from "./api.js";

const feedEl = document.getElementById("feed");

const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// сразу загружаем ленту
loadFeed();

async function loadFeed() {
  const posts = await getFeed();
  posts.forEach(renderPost);
}

function renderPost(post) {
  const el = document.createElement("div");
  el.className = "post";

  el.innerHTML = `
    <div class="text">${escapeHtml(post.text)}</div>
    <div class="reactions">
      <button class="reaction" data-r="support">🤍</button>
      <button class="reaction" data-r="hug">🫂</button>
      <button class="reaction" data-r="sad">😔</button>
    </div>
  `;

  el.querySelectorAll(".reaction").forEach(btn => {
    btn.onclick = () => {
      btn.classList.toggle("active");
    };
  });

  feedEl.appendChild(el);
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, m =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m])
  );
}
