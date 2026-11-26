// Fills the "Latest from the blog" section of README.md from the blog feed.
const fs = require("fs");
const BLOG = "https://ten-dev-notes.blogspot.com";
(async () => {
  const data = await (await fetch(`${BLOG}/feeds/posts/summary?alt=json&max-results=30`)).json();
  const posts = (data.feed.entry || [])
    .filter((e) => !(e.category || []).some((c) => c.term === "Archive"))
    .slice(0, 6)
    .map((e) => {
      const url = e.link.find((l) => l.rel === "alternate").href;
      const date = new Date(e.published.$t).toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
      const title = e.title.$t.trim().replace(/([\[\]])/g, "\$1");
      return `- [${title}](${url}) <sub>${date}</sub>`;
    });
  const readme = fs.readFileSync("README.md", "utf8");
  const next = readme.replace(/<!-- blog:start -->[\s\S]*<!-- blog:end -->/, `<!-- blog:start -->\n${posts.join("\n")}\n<!-- blog:end -->`);
  fs.writeFileSync("README.md", next);
  console.log(`README: ${posts.length} posts`);
})();
