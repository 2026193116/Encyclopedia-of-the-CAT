const app = document.getElementById("app");
const GUEST_KEY = "miyaongjin-guestbook";

function catSvg(fill, extra = "") {
  return `
    <svg class="house-cat" viewBox="0 0 160 90" aria-hidden="true">
      <ellipse cx="80" cy="58" rx="34" ry="24" fill="${fill}" stroke="#171411" stroke-width="3"/>
      <path d="M52 48 L46 22 L70 40Z" fill="${fill}" stroke="#171411" stroke-width="3"/>
      <path d="M108 48 L114 22 L90 40Z" fill="${fill}" stroke="#171411" stroke-width="3"/>
      <circle cx="70" cy="54" r="3.2" fill="#171411"/>
      <circle cx="90" cy="54" r="3.2" fill="#171411"/>
      <ellipse cx="80" cy="62" rx="3.2" ry="2" fill="#e7a39a"/>
      <path d="M80 64 Q70 70 62 66" fill="none" stroke="#171411" stroke-width="2"/>
      <path d="M80 64 Q90 70 98 66" fill="none" stroke="#171411" stroke-width="2"/>
      <path d="M114 62 Q138 50 148 68" fill="none" stroke="#171411" stroke-width="3"/>
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
          <div class="roof" style="background:${field.roof};color:${field.accent === "#fffdf8" ? "#fffdf8" : "#171411"}">
            <span style="color:${field.roof === "#171411" || field.roof === "#5c3d24" ? "#fffdf8" : "#171411"}">${field.catName}</span>
          </div>
          <div class="house-body">
            ${catSvg(field.roof === "#fffdf8" || field.roof === "#f3f1ec" ? "#fffdf8" : field.roof)}
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
      <h1>배운 점, 느낀 점, 실천할 점</h1>
      <p class="note">아직 작성한 내용이 없어 빈칸으로 두었습니다. 나중에 여기에 정리하면 됩니다.</p>
      <div class="reflect-grid" style="margin-top:16px">
        <article class="blank-card">
          <h2>배운 점</h2>
          <p class="empty"> </p>
        </article>
        <article class="blank-card">
          <h2>느낀 점</h2>
          <p class="empty"> </p>
        </article>
        <article class="blank-card">
          <h2>실천할 점</h2>
          <p class="empty"> </p>
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
