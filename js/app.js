const app = document.getElementById("app");
const GUEST_KEY = "miyaongjin-guestbook";

function catSvg(fill, extra = "", { pattern = "solid", faceColor = fill } = {}) {
  const isSiamese = pattern === "siamese";
  const isYellow = fill === "#e0a45a";
  const isBlack = fill === "#171411";
  const pointColor = isSiamese ? faceColor : fill;
  const eyeColor = isSiamese ? "#78bde8" : isBlack ? "#8acb70" : "#171411";
  const mouthColor = isBlack ? "#fffdf8" : "#171411";
  const yellowMuzzle = isYellow
    ? '<path d="M65 61 Q70 58 76 59 Q78 54 80 51 Q82 54 84 59 Q90 58 95 61 Q93 72 80 74 Q67 72 65 61Z" fill="#fffdf8"/>'
    : "";

  return `
    <svg class="house-cat" viewBox="0 0 160 90" aria-hidden="true">
      <path d="M108 63 C122 53 140 54 148 68" fill="none" stroke="#171411" stroke-width="8" stroke-linecap="round"/>
      <path d="M108 63 C122 53 140 54 148 68" fill="none" stroke="${pointColor}" stroke-width="5" stroke-linecap="round"/>
      <path d="M57 42 L54 28 Q62 32 70 40Z" fill="${pointColor}" stroke="#171411" stroke-width="3" stroke-linejoin="round"/>
      <path d="M103 42 L106 28 Q98 32 90 40Z" fill="${pointColor}" stroke="#171411" stroke-width="3" stroke-linejoin="round"/>
      <ellipse cx="80" cy="58" rx="34" ry="24" fill="${fill}" stroke="#171411" stroke-width="3"/>
      ${isSiamese ? `<path d="M56 54 Q59 45 68 46 Q74 43 80 47 Q86 43 92 46 Q101 45 104 54 Q100 64 91 67 Q85 69 80 65 Q75 69 69 67 Q60 64 56 54Z" fill="${faceColor}"/>` : ""}
      ${yellowMuzzle}
      <circle cx="70" cy="54" r="3.2" fill="${eyeColor}"/>
      <circle cx="90" cy="54" r="3.2" fill="${eyeColor}"/>
      <ellipse cx="80" cy="62" rx="3.2" ry="2" fill="#e7a39a"/>
      <path d="M80 64 Q76 68 72 66" fill="none" stroke="${mouthColor}" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M80 64 Q84 68 88 66" fill="none" stroke="${mouthColor}" stroke-width="1.8" stroke-linecap="round"/>
      ${extra}
    </svg>
  `;
}

function timeLabel(item) {
  return item.measured ? `${item.minutes}분 · 실제 기록` : `${item.minutes}분`;
}

function renderHome() {
  app.innerHTML = `
    <section class="hero">
      <p class="kicker">2026-2 학생자율연구</p>
      <h1>고양이와 떠나는<br>지식 마을 탐험</h1>
      <p>${PROJECT.intro}</p>
      <div class="hero-cats" aria-hidden="true">
        ${["#fffdf8", "#e0a45a", "#8d867c", "#5c3d24"]
          .map((c, i) => `<span class="float-cat">${catSvg(c).replace('class="house-cat"', `class="house-cat" style="width:88px;height:70px"`)}</span>`)
          .join("")}
      </div>
    </section>
    <section class="village-grid" aria-label="분야별 고양이 집">
      ${FIELDS.map(
        (field) => `
        <button class="house" type="button" data-go="field" data-id="${field.id}">
          <div class="roof" style="--roof-color:${field.roof};color:${field.accent === "#fffdf8" ? "#fffdf8" : "#171411"}">
            <svg class="roof-outline" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <path d="M1 42 L50 2 L99 42 V99 H1 Z" />
            </svg>
            <span style="color:${field.roof === "#171411" || field.roof === "#5c3d24" ? "#fffdf8" : "#171411"}">${field.catName}</span>
          </div>
          <div class="house-body">
            ${catSvg(
              field.catPattern === "siamese"
                ? "#f3e7d2"
                : field.roof === "#fffdf8" || field.roof === "#f3f1ec"
                  ? "#fffdf8"
                  : field.roof,
              "",
              { pattern: field.catPattern, faceColor: field.roof }
            )}
            <h2>${field.name}</h2>
            <p>${field.houseLine}</p>
          </div>
        </button>
      `
      ).join("")}
    </section>
  `;
}

function articleBlock(item) {
  return `
    <div class="meta-row">
      <span class="chip cheese">${timeLabel(item)}</span>
    </div>
    <div class="prose">${item.body.map((p) => `<p>${p}</p>`).join("")}</div>
    <div class="sources">
      <h3>참고한 출처</h3>
      <ol>
        ${item.sources
          .map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.label}</a></li>`)
          .join("")}
      </ol>
    </div>
  `;
}

function renderField(id) {
  const field = FIELDS.find((f) => f.id === id);
  if (!field) return renderHome();
  app.innerHTML = `
    <div class="crumb">
      <button class="ink-btn ghost" type="button" data-go="home">← 마을</button>
    </div>
    <article class="panel">
      <span class="kicker">${field.name} · ${field.catName}</span>
      <h1>${field.cat.title}</h1>
      ${articleBlock(field.cat)}
      <div class="action-row">
        <button class="ink-btn cheese" type="button" data-go="compare" data-id="${field.id}">비교하기</button>
      </div>
    </article>
  `;
}

function renderCompare(id) {
  const field = FIELDS.find((f) => f.id === id);
  if (!field) return renderHome();
  const max = Math.max(field.cat.minutes, field.other.minutes);
  const diff = field.other.minutes - field.cat.minutes;
  const diffText =
    diff === 0
      ? "두 주제의 공부 시간이 같습니다."
      : diff > 0
        ? `고양이 관련 주제가 ${diff}분 짧게 기록되어 있습니다.`
        : `고양이 관련 주제가 ${Math.abs(diff)}분 길게 기록되어 있습니다.`;

  app.innerHTML = `
    <div class="crumb">
      <button class="ink-btn ghost" type="button" data-go="field" data-id="${field.id}">← ${field.name}</button>
    </div>
    <div class="time-board">
      <h3>${field.name} 공부 시간 비교</h3>
      <div class="bar-row">
        <span>고양이 관련</span>
        <div class="bar"><span style="width:${(field.cat.minutes / max) * 100}%;background:#e0a45a"></span></div>
        <strong>${field.cat.minutes}분</strong>
      </div>
      <div class="bar-row">
        <span>고양이 밖</span>
        <div class="bar"><span style="width:${(field.other.minutes / max) * 100}%;background:#8d867c"></span></div>
        <strong>${field.other.minutes}분</strong>
      </div>
      <p class="note">${diffText}</p>
    </div>
    <section class="compare-grid">
      <article class="panel compare-card">
        <span class="chip cheese">고양이 관련</span>
        <h2>${field.cat.title}</h2>
        ${articleBlock(field.cat)}
      </article>
      <article class="panel compare-card">
        <span class="chip gray">비슷한 난이도의 고양이 밖 지식</span>
        <h2>${field.other.title}</h2>
        ${articleBlock(field.other)}
      </article>
    </section>
  `;
}

function renderReflect() {
  app.innerHTML = `
    <div class="crumb">
      <button class="ink-btn ghost" type="button" data-go="home">← 마을</button>
    </div>
    <section class="panel">
      <span class="kicker">탐구 이후</span>
      <h1>느낀 점, 배운 점, 실천할 점</h1>
      <div class="reflect-grid" style="margin-top:16px">
        <div class="reflection-column">
          <article class="blank-card">
            <h2>느낀 점</h2>
            <p class="reflection-text">이번 탐구를 통해 고양이라는 친숙하고 관심 있는 소재를 활용하면 평소에는 어렵게 느껴졌던 다양한 분야의 지식도 부담 없이 접하고 배울 수 있다는 것을 느꼈다. 그동안 새로운 지식을 탐구할 때는 배워야 할 필요성을 느끼면서도 흥미가 부족해 공부를 시작하기 어려웠거나, 관심이 있더라도 내용이 너무 생소해 쉽게 접근하지 못하는 경우가 많았다. 하지만 평소 관심을 가지고 있던 고양이를 여러 분야와 연결해 탐구하니 낯선 내용에도 자연스럽게 흥미가 생겼고, 이전보다 쉽고 재미있게 학습할 수 있었다. 이를 통해 학습의 출발점으로 자신의 관심사를 활용하는 것이 새로운 지식에 대한 심리적 부담을 줄이고 탐구에 대한 흥미를 높이는 데 도움이 된다는 것을 느꼈다.</p>
          </article>
          <article class="blank-card">
            <h2>배운 점</h2>
            <p class="reflection-text">이번 탐구에서는 각 주제에 대한 학습 시간을 직접 측정하고 비교했다. 그 결과, 대부분의 분야에서 고양이와 관련된 내용을 학습할 때 더 짧은 시간이 소요되었다. 이를 통해 평소 관심 있는 주제를 학습 내용과 연결하면 새로운 지식을 더욱 빠르고 효과적으로 이해하는 데 도움이 될 수 있다는 점을 배웠다. 앞으로도 어려운 내용을 공부할 때 내가 관심을 가지고 있는 분야와 연결해 이해하는 방법을 활용해 보고자 한다.</p>
            <p class="reflection-text">다만 교육학과 의류환경학에서는 고양이와 관련 없는 내용을 학습할 때 오히려 시간이 더 짧게 소요되는 결과가 나타났다. 탐구를 마친 뒤 그 이유를 되짚어 보니, 해당 분야의 고양이와 관련 없는 주제는 사전에 알고 있던 내용이 일부 포함되어 있었으며, 다른 주제를 학습할 때보다 상대적으로 여유로운 시간대에 공부했다는 차이점이 있었다. 이를 통해 학습 시간과 효율은 단순히 주제에 대한 관심도만으로 결정되는 것이 아니라, 학습자가 가지고 있는 배경지식이나 학습 당시의 시간적 여유 등 다양한 요인의 영향을 받는다는 사실을 알게 되었다. 따라서 관심 있는 주제를 활용한 학습은 효과적인 방법이 될 수 있지만, 학습 효과를 정확하게 이해하기 위해서는 이러한 여러 조건도 함께 고려해야 한다는 점을 배웠다.</p>
          </article>
        </div>
        <article class="blank-card">
          <h2>실천할 점</h2>
          <p class="reflection-text">이번 탐구를 통해 관심 있는 주제를 활용하면 낯선 지식에도 흥미를 가지고 접근할 수 있다는 점을 알게 된 만큼, 앞으로 전공 공부에도 이러한 학습 방법을 적용해 보고자 한다. 특히 반도체 전공에서는 에너지 밴드, 반도체 소자의 작동 원리 등 추상적인 개념을 이해해야 하는 경우가 많다. 이러한 내용을 학습할 때 내가 평소 관심을 가지고 있는 고양이와 같은 친숙한 소재를 활용한 사례나 시각 자료를 찾아 학습의 출발점으로 삼고, 이후 교재와 수식을 통해 정확한 개념을 이해하는 방식으로 공부해 보고 싶다.</p>
          <p class="reflection-text">또한 이번 탐구에서는 학습 시간 외에도 배경지식이나 학습 환경 등 다양한 요소가 학습에 영향을 줄 수 있다는 점을 발견했다. 앞으로는 학습 시간을 기록하는 것에 그치지 않고 학습 전후의 이해도와 일정 시간이 지난 뒤의 기억 정도도 함께 확인해 보고자 한다. 이를 통해 나에게 효과적인 학습 방법을 찾아내고, 관심사를 활용한 학습이 실제 전공 지식의 이해와 기억에도 도움이 되는지 지속적으로 확인하고 싶다.</p>
        </article>
      </div>
    </section>
  `;
}

function loadGuestbook() {
  try {
    return JSON.parse(localStorage.getItem(GUEST_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveGuestbook(entries) {
  localStorage.setItem(GUEST_KEY, JSON.stringify(entries));
}

const ADMIN_PASSWORD = "4815";
let guestbookAdminOpen = false;
let guestbookAdminUnlocked = false;
let guestbookAdminError = "";

function renderGuestbook() {
  const entries = loadGuestbook();
  const showDelete = guestbookAdminOpen && guestbookAdminUnlocked;
  app.innerHTML = `
    <div class="crumb">
      <button class="ink-btn ghost" type="button" data-go="home">← 마을</button>
    </div>
    <section class="panel">
      <div class="guestbook-head">
        <div>
          <span class="kicker">마을 방명록</span>
          <h1>이름과 글을 남겨 주세요</h1>
        </div>
        <button class="ink-btn" type="button" id="admin-toggle">방명록 관리하기</button>
      </div>
      ${
        guestbookAdminOpen && !guestbookAdminUnlocked
          ? `<form class="admin-form" id="admin-form">
        <input name="password" type="password" inputmode="numeric" autocomplete="off" placeholder="관리 비밀번호" required />
        <button class="ink-btn cheese" type="submit">확인</button>
      </form>
      ${guestbookAdminError ? `<p class="note">${escapeHtml(guestbookAdminError)}</p>` : ""}`
          : ""
      }
      <form class="guestbook-form" id="guest-form">
        <input name="name" maxlength="40" required placeholder="이름" />
        <textarea name="message" rows="4" maxlength="600" required placeholder="남기고 싶은 글"></textarea>
        <button class="ink-btn cheese" type="submit">남기기</button>
      </form>
      <div class="entries">
        ${
          entries.length
            ? entries
                .map(
                  (e, index) => `
          <article class="entry">
            <header>
              <strong>${escapeHtml(e.name)}</strong>
              <span>${e.date}</span>
              ${showDelete ? `<button class="entry-delete" type="button" data-delete="${index}">삭제</button>` : ""}
            </header>
            <p>${escapeHtml(e.message)}</p>
          </article>`
                )
                .join("")
            : `<p class="empty-state">아직 글이 없습니다. 첫 발자국을 남겨 주세요.</p>`
        }
      </div>
    </section>
  `;

  document.getElementById("admin-toggle").addEventListener("click", () => {
    guestbookAdminOpen = !guestbookAdminOpen;
    if (!guestbookAdminOpen) {
      guestbookAdminUnlocked = false;
      guestbookAdminError = "";
    }
    renderGuestbook();
  });

  const adminForm = document.getElementById("admin-form");
  if (adminForm) {
    adminForm.addEventListener("submit", (ev) => {
      ev.preventDefault();
      if (adminForm.password.value === ADMIN_PASSWORD) {
        guestbookAdminUnlocked = true;
        guestbookAdminError = "";
      } else {
        guestbookAdminUnlocked = false;
        guestbookAdminError = "비밀번호가 맞지 않습니다.";
      }
      renderGuestbook();
    });
  }

  document.getElementById("guest-form").addEventListener("submit", (ev) => {
    ev.preventDefault();
    const form = ev.target;
    const name = form.name.value.trim();
    const message = form.message.value.trim();
    if (!name || !message) return;
    const next = [
      {
        name,
        message,
        date: new Date().toLocaleString("ko-KR", { hour12: false })
      },
      ...loadGuestbook()
    ];
    saveGuestbook(next);
    renderGuestbook();
  });

  app.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.delete);
      const next = loadGuestbook().filter((_, i) => i !== index);
      saveGuestbook(next);
      renderGuestbook();
    });
  });
}

function escapeHtml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function go(view, id) {
  if (view !== "guestbook") {
    guestbookAdminOpen = false;
    guestbookAdminUnlocked = false;
    guestbookAdminError = "";
  }
  if (view === "home") renderHome();
  else if (view === "field") renderField(id);
  else if (view === "compare") renderCompare(id);
  else if (view === "reflect") renderReflect();
  else if (view === "guestbook") renderGuestbook();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.body.addEventListener("click", (ev) => {
  const btn = ev.target.closest("[data-go]");
  if (!btn) return;
  go(btn.dataset.go, btn.dataset.id);
});

renderHome();
