(() => {
  "use strict";

  const STORAGE_KEY = "toefl-investor-static-demo-v1";
  const SAMPLE_ESSAY =
    "Dear Ms. Lee,\n\nThank you for coordinating Saturday's volunteer event. " +
    "The small team assignments made it easy for new volunteers to understand " +
    "their responsibilities. For the next event, it would help to send the " +
    "transportation plan one day earlier, because several students were unsure " +
    "where to meet. I appreciate the time you spent making the event welcoming " +
    "and useful.\n\nBest regards,\nAlex";

  const navItems = [
    ["overview", "总览"],
    ["student", "学生工作台"],
    ["practice", "练习与 Mock 评分"],
    ["report", "评分报告"],
    ["operations", "运营与成本"],
    ["rater-a", "评分员 A"],
    ["rater-b", "评分员 B"],
    ["adjudication", "分歧仲裁"],
    ["architecture", "能力边界"],
  ];

  const defaults = Object.freeze({
    practiceCompleted: false,
    raterA: null,
    raterB: null,
    adjudicated: null,
  });

  const app = document.querySelector("#app");
  const nav = document.querySelector("#primary-nav");
  const toast = document.querySelector("#toast");
  let toastTimer = null;
  let state = readState();

  function readState() {
    try {
      const candidate = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      return {
        practiceCompleted: candidate.practiceCompleted === true,
        raterA: validBand(candidate.raterA),
        raterB: validBand(candidate.raterB),
        adjudicated: validBand(candidate.adjudicated),
      };
    } catch {
      return { ...defaults };
    }
  }

  function validBand(value) {
    return Number.isInteger(value) && value >= 0 && value <= 5 ? value : null;
  }

  function writeState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(
      () => toast.classList.remove("is-visible"),
      2600,
    );
  }

  function currentRoute() {
    const route = location.hash.replace(/^#/, "").split("?")[0];
    return navItems.some(([key]) => key === route) ? route : "overview";
  }

  function navigate(route) {
    if (currentRoute() === route) {
      render();
      app.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    location.hash = route;
  }

  function renderNav(route) {
    nav.innerHTML = navItems
      .map(
        ([key, label], index) => `
          <a class="nav-link" href="#${key}" ${
            route === key ? 'aria-current="page"' : ""
          }>
            <span class="nav-index">${String(index + 1).padStart(2, "0")}</span>
            <span>${label}</span>
          </a>
        `,
      )
      .join("");
  }

  function pageHeading(eyebrow, title, description, actions = "") {
    return `
      <header class="page-heading">
        <div>
          <div class="eyebrow">${eyebrow}</div>
          <h1>${title}</h1>
          <p>${description}</p>
        </div>
        ${actions ? `<div class="page-actions">${actions}</div>` : ""}
      </header>
    `;
  }

  function metric(label, value, detail) {
    return `
      <article class="metric-card">
        <div class="metric-label">${label}</div>
        <div class="metric-value">${value}</div>
        <div class="metric-detail">${detail}</div>
      </article>
    `;
  }

  function renderOverview() {
    const completed = completionCount();
    return `
      <div class="page-enter">
        <section class="hero">
          <div class="eyebrow">Zero-cost interactive preview</div>
          <h1>从 AI 训练到人工校准，一条可操作的产品闭环</h1>
          <p>
            这是为投资者准备的纯静态交互镜像。它展示学生练习、Mock 报告、
            运营成本、双盲评分和分歧仲裁；所有数据都在当前浏览器内生成，
            不连接真实服务，也不会产生模型费用。
          </p>
          <div class="hero-actions">
            <a class="primary-button" href="#student">开始 5 分钟体验</a>
            <a class="secondary-button" href="#architecture">先看能力边界</a>
          </div>
        </section>

        <section class="metrics-grid" aria-label="演示关键指标">
          ${metric("外部 API 请求", "0", "网络调用已移除")}
          ${metric("模型费用", "$0", "纯静态 Mock")}
          ${metric("可切换角色", "5", "学生、运营、双评、仲裁")}
          ${metric("演示完成度", `${completed}/4`, "状态仅保存在本机")}
        </section>

        <section class="section">
          <div class="section-heading">
            <div>
              <div class="eyebrow">Guided tour</div>
              <h2>建议演示路线</h2>
              <p>按顺序操作，可以在约五分钟内讲清产品价值、可靠性与成本边界。</p>
            </div>
          </div>
          <div class="role-grid">
            ${roleCard("01", "学生训练闭环", "查看推荐、完成一篇练习并生成预置 Mock 报告。", "student", state.practiceCompleted)}
            ${roleCard("02", "运营与成本保护", "查看零 Token 账本、环境隔离与自动化覆盖。", "operations", true)}
            ${roleCard("03", "双盲人工评分", "由 A、B 两名评分员独立提交 Band，互不可见。", "rater-a", state.raterA !== null && state.raterB !== null)}
            ${roleCard("04", "分歧仲裁", "评分不一致时进入仲裁，并回写运营进度。", "adjudication", state.adjudicated !== null)}
            ${roleCard("05", "技术能力边界", "区分静态演示、已验证后端与尚待生产验证的能力。", "architecture", true)}
          </div>
        </section>

        <section class="section panel panel--safe">
          <div class="card-title-row">
            <div>
              <strong>隐私与费用承诺</strong>
              <p>本页面没有账号系统、追踪脚本、表单提交或外部资源。</p>
            </div>
            <span class="tag tag--green">浏览器本地</span>
          </div>
        </section>
      </div>
    `;
  }

  function roleCard(number, title, description, route, done) {
    return `
      <a class="role-card" href="#${route}">
        <div class="card-title-row">
          <span class="role-number">${number}</span>
          <span class="tag ${done ? "tag--green" : "tag--purple"}">
            ${done ? "已体验" : "待体验"}
          </span>
        </div>
        <h3>${title}</h3>
        <p>${description}</p>
        <span class="role-cta">进入演示 →</span>
      </a>
    `;
  }

  function renderStudent() {
    return `
      <div class="page-enter">
        ${pageHeading(
          "Student workspace",
          "学生学习工作台",
          "把诊断结果转化为推荐练习，让每次完成练习后都更新学习画像。",
          '<a class="primary-button" href="#practice">开始推荐练习</a>',
        )}

        <section class="metrics-grid">
          ${metric("当前能力 Band", state.practiceCompleted ? "4.0" : "3.5", state.practiceCompleted ? "本次练习后 +0.5" : "基于演示画像")}
          ${metric("本周练习", state.practiceCompleted ? "4" : "3", "目标 5 篇")}
          ${metric("连续学习", "6 天", "高于演示基线")}
          ${metric("推荐匹配度", "92%", "聚焦论证展开")}
        </section>

        <section class="card-grid">
          <article class="panel panel--accent">
            <div class="card-title-row">
              <div>
                <span class="tag tag--purple">今日推荐</span>
                <h2>Write an Email</h2>
              </div>
              <strong>10 min</strong>
            </div>
            <p>
              当前画像显示“任务完成度”稳定，但“具体细节与建议展开”仍有提升空间。
              推荐通过校园活动邮件练习构建完整回应。
            </p>
            <div class="inline-actions">
              <a class="primary-button" href="#practice">${state.practiceCompleted ? "再次查看练习" : "完成推荐练习"}</a>
            </div>
          </article>

          <article class="panel">
            <div class="card-title-row">
              <h2>能力画像</h2>
              <span class="tag">动态更新</span>
            </div>
            <div class="progress-list">
              ${progress("任务完成度", 88)}
              ${progress("内容展开", state.practiceCompleted ? 78 : 64)}
              ${progress("语言准确性", 82)}
              ${progress("结构与衔接", state.practiceCompleted ? 84 : 76)}
            </div>
          </article>
        </section>

        <section class="section">
          <div class="section-heading">
            <div>
              <div class="eyebrow">Learning loop</div>
              <h2>推荐如何形成闭环</h2>
            </div>
          </div>
          <div class="flow">
            ${flowStep("画像", "识别内容展开为当前短板")}
            ${flowStep("推荐", "匹配相应题型与难度")}
            ${flowStep("练习", "限时完成真实写作流程")}
            ${flowStep("反馈", "输出分项诊断和建议")}
            ${flowStep("更新", "刷新画像并重新推荐")}
          </div>
        </section>
      </div>
    `;
  }

  function progress(label, value) {
    return `
      <div>
        <div class="progress-label"><strong>${label}</strong><span>${value}%</span></div>
        <div class="progress-track"><div class="progress-fill" style="width:${value}%"></div></div>
      </div>
    `;
  }

  function flowStep(title, description) {
    return `<div class="flow-step"><strong>${title}</strong>${description}</div>`;
  }

  function renderPractice() {
    return `
      <div class="page-enter">
        ${pageHeading(
          "Practice",
          "完成一篇推荐练习",
          "输入内容只存在于当前页面内。静态版不会分析或上传文本，提交后展示预置的 Band 4 Mock 报告。",
        )}
        <section class="practice-layout">
          <article class="panel">
            <span class="tag tag--purple">Write an Email · 10 分钟</span>
            <div class="prompt-box">
              You helped organize a campus volunteer event. Write an email to
              the coordinator. Thank them, describe one part that worked well,
              and suggest one improvement for the next event.
            </div>
            <label class="editor-label">
              你的回答
              <textarea
                id="practice-editor"
                placeholder="在这里输入，或载入虚构示例作文……"
                spellcheck="false"
              ></textarea>
            </label>
            <div class="privacy-line">内容不会离开当前浏览器，也不会被持久保存。</div>
            <div class="inline-actions">
              <button class="secondary-button" type="button" data-action="load-sample">
                载入虚构示例
              </button>
              <button class="primary-button" type="button" data-action="complete-practice">
                生成零费用 Mock 报告
              </button>
            </div>
          </article>

          <aside class="panel panel--soft">
            <div class="card-title-row">
              <h2>演示保护</h2>
              <span class="tag tag--green">安全</span>
            </div>
            <ul class="check-list">
              <li>无网络评分请求</li>
              <li>无 Anthropic API Key</li>
              <li>无 Token 用量</li>
              <li>无用户身份或数据库</li>
              <li>结果明确标注为预置 Mock</li>
            </ul>
            ${
              state.practiceCompleted
                ? '<div class="alert alert--safe">练习已完成。学生画像和推荐状态已在本机更新。</div><a class="primary-button" href="#report">查看 Mock 报告</a>'
                : '<div class="alert">载入虚构作文后提交，可以体验完整前端闭环。</div>'
            }
          </aside>
        </section>
      </div>
    `;
  }

  function renderReport() {
    if (!state.practiceCompleted) {
      return renderEmpty(
        "Mock 报告尚未生成",
        "先完成推荐练习，系统才会在本机显示预置的分项诊断。",
        "前往练习",
        "practice",
      );
    }
    return `
      <div class="page-enter">
        ${pageHeading(
          "Mock scoring report",
          "预置评分报告",
          "以下结果用于展示报告结构，不是对输入内容的真实分析，也不代表官方 TOEFL 成绩。",
          '<a class="secondary-button" href="#student">返回工作台</a>',
        )}

        <section class="panel panel--accent">
          <div class="score-summary">
            <div class="score-ring">
              <div class="score-ring-inner"><div><strong>4</strong><small>Band / 5</small></div></div>
            </div>
            <div>
              <span class="tag tag--purple">mock-investor-demo</span>
              <h2>任务回应完整，细节清晰，语气得体</h2>
              <p>
                示例邮件覆盖感谢、有效环节和改进建议。下一步重点是增加更具体的影响说明，
                并通过句式变化提升表达成熟度。
              </p>
            </div>
          </div>
        </section>

        <section class="card-grid card-grid--three">
          ${dimension("任务完成度", 4, "三项要求均有回应，建议进一步说明改进措施的预期效果。")}
          ${dimension("语域与规范", 4, "称呼、感谢和结尾符合正式邮件语境。")}
          ${dimension("语言运用", 4, "整体准确清晰，可增加复杂句和词汇变化。")}
        </section>

        <section class="card-grid">
          <article class="panel">
            <div class="card-title-row"><h2>下一步修改建议</h2><span class="tag">可执行</span></div>
            <ul class="check-list">
              <li>在交通安排建议后补充对志愿者准时到达的影响。</li>
              <li>用一个从句连接问题与建议，增强逻辑关系。</li>
              <li>保留正式、感谢性的语气，不需要堆砌高级词汇。</li>
            </ul>
          </article>
          <article class="panel">
            <div class="card-title-row"><h2>本次用量</h2><span class="tag tag--green">零费用</span></div>
            <div class="ledger">
              ${ledgerRow("模型", "静态预置 Mock")}
              ${ledgerRow("输入 Token", "0")}
              ${ledgerRow("输出 Token", "0")}
              ${ledgerRow("结算费用", "$0.000000")}
            </div>
          </article>
        </section>
      </div>
    `;
  }

  function dimension(title, score, description) {
    return `
      <article class="panel">
        <div class="card-title-row"><h3>${title}</h3><strong>${score}/5</strong></div>
        <div class="progress-track"><div class="progress-fill" style="width:${score * 20}%"></div></div>
        <p>${description}</p>
      </article>
    `;
  }

  function ledgerRow(label, value) {
    return `<div class="ledger-row"><span>${label}</span><strong>${value}</strong></div>`;
  }

  function renderOperations() {
    const bothRated = state.raterA !== null && state.raterB !== null;
    const disagreement = bothRated && state.raterA !== state.raterB;
    return `
      <div class="page-enter">
        ${pageHeading(
          "Operations",
          "运营、成本与校准",
          "从管理端观察题库、Mock 账本和双盲人工评分进度。",
          '<a class="primary-button" href="#rater-a">进入双盲评分</a>',
        )}

        <section class="metrics-grid">
          ${metric("演示评分任务", state.practiceCompleted ? "1" : "0", "全部为静态 Mock")}
          ${metric("累计 Token", "0", "没有外部模型调用")}
          ${metric("累计费用", "$0", "无预占、无结算")}
          ${metric("人工校准样本", "2", "纯虚构验证集")}
        </section>

        <section class="card-grid">
          <article class="panel">
            <div class="card-title-row">
              <h2>双盲进度</h2>
              <span class="tag ${state.adjudicated !== null ? "tag--green" : "tag--amber"}">
                ${state.adjudicated !== null ? "已仲裁" : disagreement ? "待仲裁" : "进行中"}
              </span>
            </div>
            <div class="progress-list">
              ${progress("主评完成", state.raterA !== null ? 100 : 0)}
              ${progress("次评完成", state.raterB !== null ? 100 : 0)}
              ${progress("分歧处理", state.adjudicated !== null ? 100 : 0)}
            </div>
            <div class="inline-actions">
              <a class="secondary-button" href="#rater-a">评分员 A</a>
              <a class="secondary-button" href="#rater-b">评分员 B</a>
              <a class="secondary-button" href="#adjudication">仲裁</a>
            </div>
          </article>

          <article class="panel">
            <div class="card-title-row"><h2>零费用账本</h2><span class="tag tag--green">Mock</span></div>
            <div class="ledger">
              ${ledgerRow("请求次数", "0")}
              ${ledgerRow("预占金额", "$0.000000")}
              ${ledgerRow("实际金额", "$0.000000")}
              ${ledgerRow("供应商状态", "未连接")}
            </div>
            <div class="alert alert--safe">
              静态版没有后端，因此不可能读取环境变量或意外调用付费模型。
            </div>
          </article>
        </section>

        <section class="section panel">
          <div class="card-title-row"><h2>演示活动记录</h2><span class="tag">本地状态</span></div>
          <ul class="activity-list">
            <li>演示环境加载完成<time>当前浏览器会话</time></li>
            ${state.practiceCompleted ? "<li>学生完成推荐练习并查看 Mock 报告<time>已完成</time></li>" : ""}
            ${state.raterA !== null ? `<li>评分员 A 已提交独立评分：Band ${state.raterA}<time>已锁定</time></li>` : ""}
            ${state.raterB !== null ? `<li>评分员 B 已提交独立评分：Band ${state.raterB}<time>已锁定</time></li>` : ""}
            ${state.adjudicated !== null ? `<li>仲裁员已给出最终 Band ${state.adjudicated}<time>流程闭环</time></li>` : ""}
          </ul>
        </section>
      </div>
    `;
  }

  function renderRater(role) {
    const isA = role === "a";
    const ownScore = isA ? state.raterA : state.raterB;
    const otherScore = isA ? state.raterB : state.raterA;
    const name = isA ? "评分员 A" : "评分员 B";
    const suggested = isA ? 3 : 4;
    return `
      <div class="page-enter">
        ${pageHeading(
          "Double-blind rating",
          `${name} · 独立盲评`,
          "评分员只能看到题目与虚构作文；提交前后均不能看到 AI Band 或另一位评分员的结果。",
        )}
        <div class="alert alert--neutral">
          双盲规则正在模拟：${otherScore === null ? "另一位评分员的状态和分数均被隐藏。" : "另一位评分已提交，但分数仍保持隐藏。"}
        </div>
        <article class="task-card">
          <div class="task-meta">
            <span>样本 demo_email_001 · validation</span>
            <span>${ownScore === null ? "待评分" : "已提交并锁定"}</span>
          </div>
          <h2>Campus Volunteer Event Email</h2>
          <div class="prompt-box">
            Thank the coordinator, describe one successful part of the event,
            and suggest one improvement for next time.
          </div>
          <div class="essay-box">${SAMPLE_ESSAY}</div>
          <h3>选择 Band</h3>
          <div class="choice-row" aria-label="${name} Band 选择">
            ${[0, 1, 2, 3, 4, 5]
              .map(
                (band) => `
                  <button
                    class="choice-button ${ownScore === band ? "is-selected" : ""}"
                    type="button"
                    data-action="submit-rating"
                    data-rater="${role}"
                    data-band="${band}"
                    ${ownScore !== null ? "disabled" : ""}
                  >${band}</button>
                `,
              )
              .join("")}
          </div>
          ${
            ownScore === null
              ? `<div class="alert">演示建议：${name} 提交 Band ${suggested}，以形成评分分歧并触发仲裁。</div>`
              : `<div class="alert alert--safe">${name} 已提交 Band ${ownScore}。评分已锁定，等待双评流程继续。</div>`
          }
          <div class="inline-actions">
            <a class="secondary-button" href="#${isA ? "rater-b" : "adjudication"}">
              ${isA ? "切换到评分员 B" : "查看是否触发仲裁"}
            </a>
          </div>
        </article>
      </div>
    `;
  }

  function renderAdjudication() {
    const bothRated = state.raterA !== null && state.raterB !== null;
    const disagreement = bothRated && state.raterA !== state.raterB;
    if (!bothRated) {
      return renderEmpty(
        "仲裁任务尚未产生",
        "双盲流程要求评分员 A 和 B 都先独立提交评分。",
        state.raterA === null ? "前往评分员 A" : "前往评分员 B",
        state.raterA === null ? "rater-a" : "rater-b",
      );
    }
    if (!disagreement) {
      return `
        <div class="page-enter">
          ${pageHeading("Adjudication", "两位评分员结果一致", "系统检测到主评与次评均为 Band " + state.raterA + "，无需进入仲裁。")}
          <section class="panel panel--safe empty-state">
            <div class="empty-state-mark">✓</div>
            <h2>双盲评分已直接完成</h2>
            <p>一致结果将作为当前人工参考分。重置演示后可按建议分别提交 Band 3 和 Band 4，体验分歧仲裁。</p>
            <div class="inline-actions" style="justify-content:center">
              <button class="secondary-button" type="button" data-action="reset">重置双盲流程</button>
            </div>
          </section>
        </div>
      `;
    }
    return `
      <div class="page-enter">
        ${pageHeading(
          "Senior adjudication",
          "分歧样本人工仲裁",
          "只有在两份独立评分均提交且结果不一致时，仲裁员才会看到双方分数。",
          '<a class="secondary-button" href="#operations">查看运营进度</a>',
        )}
        <section class="card-grid">
          <article class="metric-card">
            <div class="metric-label">主评分</div>
            <div class="metric-value">${state.raterA}</div>
            <div class="metric-detail">评分员身份已脱敏</div>
          </article>
          <article class="metric-card">
            <div class="metric-label">次评分</div>
            <div class="metric-value">${state.raterB}</div>
            <div class="metric-detail">评分员身份已脱敏</div>
          </article>
        </section>
        <article class="task-card">
          <div class="task-meta"><span>demo_email_001 · 待仲裁</span><span>分差 ${Math.abs(state.raterA - state.raterB)}</span></div>
          <div class="essay-box">${SAMPLE_ESSAY}</div>
          <h3>最终人工 Band</h3>
          <div class="choice-row" aria-label="仲裁 Band 选择">
            ${[0, 1, 2, 3, 4, 5]
              .map(
                (band) => `
                  <button
                    class="choice-button ${state.adjudicated === band ? "is-selected" : ""}"
                    type="button"
                    data-action="submit-adjudication"
                    data-band="${band}"
                    ${state.adjudicated !== null ? "disabled" : ""}
                  >${band}</button>
                `,
              )
              .join("")}
          </div>
          ${
            state.adjudicated === null
              ? '<div class="alert">演示建议：选择 Band 4，提交后运营看板会显示“已仲裁”。</div>'
              : `<div class="alert alert--safe">仲裁完成：最终人工 Band ${state.adjudicated}。双盲流程已经闭环。</div>`
          }
        </article>
      </div>
    `;
  }

  function renderArchitecture() {
    return `
      <div class="page-enter">
        ${pageHeading(
          "Product boundary",
          "演示内容与真实能力边界",
          "静态页面重现可操作的产品路径，但不会把未来规划或前端模拟描述成已上线的生产能力。",
        )}
        <section class="panel panel--safe">
          <div class="card-title-row">
            <div>
              <strong>本页面是公开展示层，不是生产系统</strong>
              <p>它的目标是安全地解释产品，而不是验证真实模型准确率或承载用户数据。</p>
            </div>
            <span class="tag tag--green">透明披露</span>
          </div>
        </section>
        <section class="panel">
          <table class="comparison-table">
            <thead>
              <tr><th>能力</th><th>本静态演示</th><th>当前项目后端</th><th>投资者应如何理解</th></tr>
            </thead>
            <tbody>
              <tr><td>AI 评分</td><td>预置 Mock 结果</td><td>已具备异步评分与失败恢复</td><td>静态版不验证模型质量</td></tr>
              <tr><td>API 费用</td><td>不发请求，固定为 0</td><td>具备用量账本、预占和结算</td><td>演示不会产生 Anthropic 费用</td></tr>
              <tr><td>个性化推荐</td><td>预置画像和推荐变化</td><td>已实现基础推荐闭环</td><td>静态版展示交互方式</td></tr>
              <tr><td>双盲评分</td><td>浏览器本地状态机</td><td>已实现账号、任务、盲评和仲裁</td><td>流程可演示，数据均为虚构</td></tr>
              <tr><td>人工校准结论</td><td>不提供准确率结论</td><td>仍需真实评分员样本校准</td><td>不能宣称已与官方评分员一致</td></tr>
              <tr><td>数据存储</td><td>仅 localStorage</td><td>支持数据库持久化</td><td>刷新可保留，重置可清除</td></tr>
            </tbody>
          </table>
        </section>
        <section class="card-grid card-grid--three">
          ${featureCard("安全", "没有密钥、用户数据、外部脚本、追踪器或后端地址。")}
          ${featureCard("可分享", "发布为 GitHub Pages 后，投资者只需浏览器即可访问。")}
          ${featureCard("可复位", "所有操作状态均可一键恢复，不影响任何真实环境。")}
        </section>
      </div>
    `;
  }

  function featureCard(title, description) {
    return `<article class="feature-card"><span class="role-number">✓</span><h3>${title}</h3><p>${description}</p></article>`;
  }

  function renderEmpty(title, description, actionLabel, route) {
    return `
      <div class="page-enter">
        <section class="panel empty-state">
          <div class="empty-state-mark">→</div>
          <h2>${title}</h2>
          <p>${description}</p>
          <div class="inline-actions" style="justify-content:center">
            <a class="primary-button" href="#${route}">${actionLabel}</a>
          </div>
        </section>
      </div>
    `;
  }

  function completionCount() {
    return [
      state.practiceCompleted,
      true,
      state.raterA !== null && state.raterB !== null,
      state.adjudicated !== null,
    ].filter(Boolean).length;
  }

  function render() {
    const route = currentRoute();
    renderNav(route);
    const pages = {
      overview: renderOverview,
      student: renderStudent,
      practice: renderPractice,
      report: renderReport,
      operations: renderOperations,
      "rater-a": () => renderRater("a"),
      "rater-b": () => renderRater("b"),
      adjudication: renderAdjudication,
      architecture: renderArchitecture,
    };
    app.innerHTML = pages[route]();
    document.title = `${navItems.find(([key]) => key === route)[1]} · 新托福写作投资者演示`;
  }

  function resetDemo() {
    localStorage.removeItem(STORAGE_KEY);
    state = { ...defaults };
    render();
    showToast("演示状态已重置，未删除或修改任何外部数据。");
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const action = button.dataset.action;
    if (action === "reset") {
      resetDemo();
      return;
    }
    if (action === "load-sample") {
      const editor = document.querySelector("#practice-editor");
      if (editor) {
        editor.value = SAMPLE_ESSAY;
        editor.focus();
        showToast("已载入纯虚构示例作文。");
      }
      return;
    }
    if (action === "complete-practice") {
      const editor = document.querySelector("#practice-editor");
      if (!editor || editor.value.trim().length < 30) {
        showToast("请先输入至少 30 个字符，或载入虚构示例。");
        return;
      }
      state.practiceCompleted = true;
      writeState();
      showToast("预置 Mock 报告已生成：0 Token，$0 费用。");
      window.setTimeout(() => navigate("report"), 350);
      return;
    }
    if (action === "submit-rating") {
      const score = validBand(Number(button.dataset.band));
      const rater = button.dataset.rater;
      if (score === null || !["a", "b"].includes(rater)) return;
      if (rater === "a" && state.raterA === null) state.raterA = score;
      if (rater === "b" && state.raterB === null) state.raterB = score;
      writeState();
      render();
      showToast(`评分员 ${rater.toUpperCase()} 已提交 Band ${score}，评分已锁定。`);
      return;
    }
    if (action === "submit-adjudication") {
      const score = validBand(Number(button.dataset.band));
      if (
        score === null ||
        state.raterA === null ||
        state.raterB === null ||
        state.raterA === state.raterB ||
        state.adjudicated !== null
      ) {
        return;
      }
      state.adjudicated = score;
      writeState();
      render();
      showToast(`仲裁完成：最终人工 Band ${score}。`);
    }
  });

  window.addEventListener("hashchange", () => {
    render();
    app.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  if (!location.hash) {
    history.replaceState(null, "", "#overview");
  }
  render();
})();
