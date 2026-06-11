document.getElementById("year").textContent = new Date().getFullYear();

const LANG_COLORS = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  Jupyter: "#DA5B0B",
  "Jupyter Notebook": "#DA5B0B",
};

async function loadRepos() {
  const grid = document.getElementById("repo-grid");
  try {
    const res = await fetch(
      "https://api.github.com/users/DidoTau/repos?sort=updated&per_page=30"
    );
    if (!res.ok) throw new Error(`GitHub API: ${res.status}`);
    const repos = await res.json();

    const visible = repos
      .filter((r) => !r.fork && r.name !== "DidoTau" && r.name !== "didotau.github.io")
      .slice(0, 9);

    if (visible.length === 0) {
      grid.innerHTML = '<p class="loading mono">no hay repos públicos por ahora.</p>';
      return;
    }

    grid.innerHTML = "";
    for (const repo of visible) {
      const card = document.createElement("a");
      card.className = "repo-card";
      card.href = repo.html_url;
      card.target = "_blank";
      card.rel = "noopener";

      const name = document.createElement("h3");
      name.textContent = repo.name;

      const desc = document.createElement("p");
      desc.textContent = repo.description || "Sin descripción";

      const meta = document.createElement("div");
      meta.className = "repo-meta";

      if (repo.language) {
        const lang = document.createElement("span");
        const dot = document.createElement("span");
        dot.className = "lang-dot";
        dot.style.background = LANG_COLORS[repo.language] || "#8b9bb4";
        lang.appendChild(dot);
        lang.appendChild(document.createTextNode(repo.language));
        meta.appendChild(lang);
      }

      if (repo.stargazers_count > 0) {
        const stars = document.createElement("span");
        stars.textContent = `★ ${repo.stargazers_count}`;
        meta.appendChild(stars);
      }

      const updated = document.createElement("span");
      updated.textContent = new Date(repo.pushed_at).toLocaleDateString("es-CL", {
        year: "numeric",
        month: "short",
      });
      meta.appendChild(updated);

      card.append(name, desc, meta);
      grid.appendChild(card);
    }
  } catch (err) {
    grid.innerHTML =
      '<p class="loading mono">no se pudieron cargar los repos — <a href="https://github.com/DidoTau?tab=repositories" target="_blank" rel="noopener">verlos en GitHub</a></p>';
  }
}

loadRepos();
