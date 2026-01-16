export function getFeed() {
  const tg = window.Telegram?.WebApp;
  if (!tg?.CloudStorage) return Promise.resolve([]);

  return new Promise((resolve) => {
    tg.CloudStorage.getItem("feed", (err, value) => {
      if (err || !value) return resolve([]);
      try {
        const data = JSON.parse(value);
        resolve(Array.isArray(data) ? data : []);
      } catch {
        resolve([]);
      }
    });
  });
}

export async function addReaction(postId, type) {
  const tg = window.Telegram?.WebApp;
  if (!tg?.CloudStorage) return;

  const feed = await getFeed();
  const post = feed.find(p => p.id === postId);
  if (!post) return;

  post.reactions = post.reactions || { support: 0, hug: 0, sad: 0 };
  post.reactions[type] = (post.reactions[type] || 0) + 1;

  return new Promise((resolve) => {
    tg.CloudStorage.setItem("feed", JSON.stringify(feed), () => resolve());
  });
}
