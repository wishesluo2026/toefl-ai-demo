(() => {
  "use strict";

  const STORAGE_KEY = "toefl-product-static-demo-v1";
  const SAMPLE_ESSAY =
    "Dear Ms. Lee,\n\nThank you for coordinating Saturday's volunteer event. " +
    "The small team assignments made it easy for new volunteers to understand " +
    "their responsibilities. For the next event, it would help to send the " +
    "transportation plan one day earlier, because several students were unsure " +
    "where to meet. I appreciate the time you spent making the event welcoming " +
    "and useful.\n\nBest regards,\nAlex";

  const navItems = [
    ["overview", "作品集总览"],
    ["tour", "5分钟体验导览"],
    ["student", "学生工作台"],
    ["practice", "练习与 Mock 评分"],
    ["report", "评分报告"],
    ["operations", "运营与成本"],
    ["rater-a", "评分员 A"],
    ["rater-b", "评分员 B"],
    ["adjudication", "分歧仲裁"],
    ["architecture", "能力边界"],
    ["decisions", "产品决策"],
    ["evidence", "验证证据"],
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
    return "\n<div class=\"page-enter\">\n  <section class=\"portfolio-hero\">\n    <div class=\"portfolio-kicker\"><span>AI PRODUCT CASE STUDY</span><span class=\"tag tag--green\">独立产品作品集 · 公开Mock</span></div>\n    <h1>让 AI 写作反馈从一次性评分，变成可持续的个性化训练</h1>\n    <p class=\"portfolio-lead\">新托福 AI 写作训练与评分平台：围绕学习者“诊断不清楚、反馈难执行、训练缺少连续性”的问题，设计诊断、训练、评分、反馈、画像与人工校准相结合的 SaaS 产品方案。</p>\n    <div class=\"portfolio-metadata\">\n      <div><span>项目角色</span><strong>个人项目负责人 · 产品规划 / AI 协作研发 / 验收</strong></div>\n      <div><span>项目阶段</span><strong>本地核心 MVP 已完成 · 校准及封闭测试准备中</strong></div>\n      <div><span>演示性质</span><strong>静态 Mock · 不运行真实模型 · 不收集作文</strong></div>\n    </div>\n    <div class=\"hero-actions\">\n      <a class=\"primary-button\" href=\"#tour\">开始 5 分钟作品集导览 →</a>\n      <a class=\"secondary-button\" href=\"#decisions\">看 3 个关键产品决策</a>\n    </div>\n    <p class=\"micro-disclaimer\">这是独立的公开演示环境，不是生产 SaaS。页面中的分数、画像、Token、费用及完成状态均为演示数据。</p>\n  </section>\n  <section class=\"section\">\n    <div class=\"section-heading\"><div><div class=\"eyebrow\">Problem → Product → Validation</div><h2>我如何从业务问题走向 AI 产品</h2><p>招聘经理无需理解复杂后端代码，也能快速看到需求、方案、关键取舍和验证边界。</p></div></div>\n    <div class=\"case-triad\">\n      <article class=\"panel\"><span class=\"case-index\">01 / 用户问题</span><h3>评分之后，学生下一步练什么？</h3><p>来自托福内容账号 1000+ 粉丝及累计 100+ 次相关咨询的需求观察；这些不是本平台活跃或付费用户数据。</p></article>\n      <article class=\"panel\"><span class=\"case-index\">02 / 产品方案</span><h3>构建可反复使用的训练闭环</h3><p>把入学诊断、题型练习、结构化评分、可执行反馈、学习画像和推荐连接起来，而不是只返回一次 AI 文本。</p></article>\n      <article class=\"panel\"><span class=\"case-index\">03 / 验证路径</span><h3>先验证可用与可靠，再谈评分准确率</h3><p>核心 MVP 已实现，持续通过测试、人工双盲校准、仲裁和版本门禁治理质量；评分效果与真实用户留存尚待验证。</p></article>\n    </div>\n  </section>\n  <section class=\"section\">\n    <div class=\"section-heading\"><div><div class=\"eyebrow\">Product walkthrough</div><h2>先体验产品，再看为什么这样设计</h2></div></div>\n    <div class=\"portfolio-entry-grid\">\n      <a class=\"portfolio-entry\" href=\"#student\"><span>01 · 学生视角</span><strong>练习 → Mock 报告 → 画像</strong><p>了解训练反馈和推荐如何连成闭环</p><b>进入演示 →</b></a>\n      <a class=\"portfolio-entry\" href=\"#rater-a\"><span>02 · 人工校准</span><strong>双盲评分 → 分歧仲裁</strong><p>模拟公平的评分流程和角色状态</p><b>进入演示 →</b></a>\n      <a class=\"portfolio-entry\" href=\"#decisions\"><span>03 · 产品负责人视角</span><strong>业务问题 → 决策与取舍</strong><p>异步评分、人工校准、成本治理</p><b>查看案例 →</b></a>\n      <a class=\"portfolio-entry\" href=\"#evidence\"><span>04 · 交付验证</span><strong>已验证证据 → 待验证风险</strong><p>区分历史 CI 基线和当前进行中的工作</p><b>查看证据 →</b></a>\n    </div>\n  </section>\n  <section class=\"section\">\n    <div class=\"section-heading\"><div><div class=\"eyebrow\">Product design focus</div><h2>产品设计重点</h2></div></div>\n    <div class=\"product-design-grid\">\n      <article class=\"feature-card\"><span class=\"role-number\">01</span><h3>学习闭环</h3><p>诊断 → 推荐 → 限时训练 → AI 反馈 → 画像更新</p></article>\n      <article class=\"feature-card\"><span class=\"role-number\">02</span><h3>AI 可靠性</h3><p>结构化输出、Schema 校验、异步评分、失败恢复</p></article>\n      <article class=\"feature-card\"><span class=\"role-number\">03</span><h3>成本与模型治理</h3><p>模型路由、预算预占、费用结算与幂等保护</p></article>\n      <article class=\"feature-card\"><span class=\"role-number\">04</span><h3>Human-in-the-loop</h3><p>人工双盲评分、分歧仲裁与一致性评估机制</p></article>\n    </div>\n  </section>\n  <section class=\"section panel panel--safe\">\n    <div class=\"card-title-row\"><div><strong>公开页面只展示流程，不调用真实评分服务</strong><p>没有登录、真实身份、生产数据、外部模型请求或额外费用。实际项目能力与待验证事项请查看“验证证据”。</p></div><span class=\"tag tag--green\">0 外部 API 请求</span></div>\n  </section>\n</div>";
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

  function designCard(number, title, description) {
    return `
      <article class="feature-card">
        <span class="role-number">${number}</span>
        <h3>${title}</h3>
        <p>${description}</p>
      </article>
    `;
  }

  function renderTour() { return "\n<div class=\"page-enter\">\n  <header class=\"page-heading\"><div><div class=\"eyebrow\">Recruiter-friendly walkthrough</div><h1>5 分钟看懂这个 AI 产品</h1><p>按建议顺序体验：先看业务与交互，再了解设计取舍和验证证据。不需要账号或真实模型。</p></div></header>\n  <section class=\"panel tour-intro\"><strong>你将看到什么？</strong><p>这是一个公开、可复位的模拟产品流程。面试官可以快速了解候选人作为个人产品负责人的工作，而不把 Mock 效果误认为正式评分质量。</p></section>\n  <section class=\"tour-steps\">\n    <article class=\"tour-step\"><span class=\"tour-time\">01 · 1 分钟</span><div><h2>理解产品为什么存在</h2><p>从托福学习中的评分可信度和反馈可执行性问题出发，了解MVP范围。</p></div><a class=\"secondary-button\" href=\"#overview\">产品定位 →</a></article>\n    <article class=\"tour-step\"><span class=\"tour-time\">02 · 1 分钟</span><div><h2>体验学生训练闭环</h2><p>查看模拟学习画像，载入虚构示例作文，体验预置 Mock 反馈。</p></div><a class=\"secondary-button\" href=\"#student\">学生工作台 →</a></article>\n    <article class=\"tour-step\"><span class=\"tour-time\">03 · 1 分钟</span><div><h2>体验人工校准</h2><p>评分员 A 与 B 先后提交模拟独立评分，随后体验分歧仲裁。</p></div><a class=\"secondary-button\" href=\"#rater-a\">双盲评分 →</a></article>\n    <article class=\"tour-step\"><span class=\"tour-time\">04 · 1 分钟</span><div><h2>理解关键产品取舍</h2><p>为什么需要异步任务、人工评分、成本账本？看业务问题和方案之间的关系。</p></div><a class=\"secondary-button\" href=\"#decisions\">产品决策 →</a></article>\n    <article class=\"tour-step\"><span class=\"tour-time\">05 · 1 分钟</span><div><h2>检查验证证据与边界</h2><p>区分已验收版本、进行中的数据库并发治理，以及未验证的用户与评分指标。</p></div><a class=\"secondary-button\" href=\"#evidence\">交付证据 →</a></article>\n  </section>\n  <div class=\"alert alert--neutral\">提示：本导览不需要填写真实作文。建议使用“载入虚构示例”，避免误将预设报告理解为模型评分。</div>\n</div>"; }

  function renderDecisions() { return "\n<div class=\"page-enter\">\n  <header class=\"page-heading\"><div><div class=\"eyebrow\">Product decisions / Trade-offs</div><h1>3 个影响产品可用性的关键决策</h1><p>展示的不只是技术选型，而是从用户问题、风险约束到设计取舍、验证方式的完整判断。</p></div></header>\n  <section class=\"decision-list\">\n    <article class=\"panel decision-case\">\n      <div class=\"decision-head\"><span class=\"case-index\">DECISION 01</span><span class=\"tag tag--purple\">体验与可靠性</span></div>\n      <h2>评分为什么要异步，而不是让用户一直等待？</h2>\n      <div class=\"decision-grid\">\n        <div><h3>业务问题</h3><p>模型调用可能超时、重试或失败；同步阻塞使用户难以判断作文是否提交成功。</p></div>\n        <div><h3>我的产品选择</h3><p>设计评分任务状态、异步结果反馈、幂等提交、自动重试和失败恢复，减少用户的不确定性及重复扣费风险。</p></div>\n        <div><h3>取舍与边界</h3><p>异步流程增加任务状态与异常恢复复杂度，需要明确“处理中 / 成功 / 失败”的交互和验收条件。</p></div>\n        <div><h3>如何验证</h3><p>以关键链路测试和失败场景验收验证流程；用户真实等待体验与性能指标仍需封闭测试。</p></div>\n      </div>\n    </article>\n    <article class=\"panel decision-case\">\n      <div class=\"decision-head\"><span class=\"case-index\">DECISION 02</span><span class=\"tag tag--purple\">AI可信度</span></div>\n      <h2>为什么不能把 AI 给出的分数直接当作可靠成绩？</h2>\n      <div class=\"decision-grid\">\n        <div><h3>业务问题</h3><p>流畅的AI评语不一定等于稳定或与人工评分一致的判断，尤其在跨题型和边界分数场景中。</p></div>\n        <div><h3>我的产品选择</h3><p>设计双盲人工评分、评分差异仲裁、正式数据集治理与训练/验证隔离，形成可追溯的校准流程。</p></div>\n        <div><h3>取舍与边界</h3><p>人工评估提高成本和流程复杂度，但在对外宣称评分质量前必须先解决证据充分性问题。</p></div>\n        <div><h3>如何验证</h3><p>展示双盲与仲裁的模拟交互；正式评分一致性数据、统计充分性与发布审批尚未完成。</p></div>\n      </div>\n    </article>\n    <article class=\"panel decision-case\">\n      <div class=\"decision-head\"><span class=\"case-index\">DECISION 03</span><span class=\"tag tag--purple\">成本与系统治理</span></div>\n      <h2>怎样避免模型重试、复核和重复提交带来失控的费用？</h2>\n      <div class=\"decision-grid\">\n        <div><h3>业务问题</h3><p>异步评分和复核模型可能产生额外调用，失败重试与重复请求还会增加费用及账务不一致风险。</p></div>\n        <div><h3>我的产品选择</h3><p>引入默认/复核模型路由、请求幂等、预算预占、费用结算与异常账本治理，明确成本边界。</p></div>\n        <div><h3>取舍与边界</h3><p>不能单纯为了低价牺牲反馈质量；当前先验证账务正确性，再通过真实数据评估最优调用策略。</p></div>\n        <div><h3>如何验证</h3><p>本公开页面只展示零Token模拟账本；真实成本节约率和规模化运营效益尚无足够数据支持。</p></div>\n      </div>\n    </article>\n  </section>\n  <section class=\"panel panel--safe\"><strong>个人项目中的分工说明</strong><p>本人负责需求、MVP范围、产品机制、开发任务编排、关键逻辑复核与阶段验收；借助 Codex / Claude Code 等工具参与代码实现，不将AI辅助开发等同于独立手写全部工程代码。</p></section>\n</div>"; }

  function renderEvidence() { return "\n<div class=\"page-enter\">\n  <header class=\"page-heading\"><div><div class=\"eyebrow\">Delivery evidence / Truthful claims</div><h1>哪些已经验证，哪些还不能宣称成功？</h1><p>将公开演示、项目实际实现、历史CI证据和仍在治理中的事项分开呈现，避免把绿色测试误认为正式产品发布许可。</p></div></header>\n  <section class=\"proof-metrics\">\n    <div class=\"metric-card\"><div class=\"metric-label\">已验收历史CI基线</div><div class=\"metric-value\">6 / 6</div><div class=\"metric-detail\">Jobs PASS · B3-B1历史版本</div></div>\n    <div class=\"metric-card\"><div class=\"metric-label\">历史后端自动化测试</div><div class=\"metric-value\">561</div><div class=\"metric-detail\">PASS · 0 SKIP / 0 FAIL</div></div>\n    <div class=\"metric-card\"><div class=\"metric-label\">历史核心端到端测试</div><div class=\"metric-value\">8</div><div class=\"metric-detail\">PASS · 不代表当前全部改动通过</div></div>\n    <div class=\"metric-card\"><div class=\"metric-label\">Partner Sandbox E2E</div><div class=\"metric-value\">4</div><div class=\"metric-detail\">PASS · 历史已验收基线</div></div>\n  </section>\n  <section class=\"panel panel--safe\">\n    <div class=\"card-title-row\"><div><strong>历史CI证据的确切边界</strong><p>对应主项目 B3-B1 已验收版本，Commit：<code>21debd09152efbbf379adf83c4c426302cb453ea</code>，Run ID：<code>38339162342</code>。这不是当前未验收改动的测试结论。</p></div><span class=\"tag tag--green\">历史版本已验收</span></div>\n  </section>\n  <section class=\"evidence-grid\">\n    <article class=\"panel\"><span class=\"tag tag--green\">已实现 / 已验证</span><h2>产品与基础能力</h2><ul class=\"check-list\"><li>本地核心MVP学习闭环</li><li>异步评分与结构化结果校验</li><li>成本账本、预算预占及费用结算机制</li><li>双盲评分和分歧仲裁工具</li><li>隔离Staging环境的真实模型链路验证</li></ul></article>\n    <article class=\"panel\"><span class=\"tag tag--amber\">进行中 / 未完成</span><h2>质量与发布门禁</h2><ul class=\"check-list\"><li>删除生命周期安全与PostgreSQL并发验收</li><li>人工评分样本的正式数据积累</li><li>模型-人工一致性与充分性验证</li><li>小规模封闭用户测试</li><li>生产环境和正式发布审批</li></ul></article>\n    <article class=\"panel\"><span class=\"tag\">没有宣称</span><h2>尚无充分证据的结果</h2><ul class=\"check-list\"><li>已规模化上线或拥有真实付费用户</li><li>托福官方评分或准确率已认证</li><li>真实用户留存率、转化率与收入</li><li>评分提升或成本节约的真实量化效果</li></ul></article>\n  </section>\n  <section class=\"panel evidence-note\"><h2>作品集证据如何阅读</h2><p><strong>模拟交互：</strong>本页面里的分数、画像、订单及人工评分状态均为虚构数据，仅用于解释产品逻辑。</p><p><strong>工程证明：</strong>历史CI数据来自上述确定的提交，后续阶段需以新提交实际测试结果为准。</p><p><strong>开发责任：</strong>个人负责产品需求、设计取舍和AI辅助交付验收；不声称商业化运营或独立完成全部技术研发。</p></section>\n  <div class=\"inline-actions\"><a class=\"primary-button\" href=\"#decisions\">继续看产品决策 →</a><a class=\"secondary-button\" href=\"#architecture\">查看演示与生产边界</a></div>\n</div>"; }

  function renderStudent() {
    return `
      <div class="page-enter">
        ${pageHeading(
          "Student workspace",
          "学生学习工作台",
          "体验诊断、推荐与反馈如何形成闭环。本页所有Band、推荐比例、学习天数与画像变化均为模拟展示，不是真实评测结果。",
          '<a class="primary-button" href="#practice">开始推荐练习</a>',
        )}

        <div class="alert alert--neutral">演示说明：数据均为虚构画像。提交练习后显示的Band变化是预设动画式状态，不代表一次练习后实际提升。</div>
        <section class="metrics-grid">
          ${metric("模拟能力 Band", state.practiceCompleted ? "4.0" : "3.5", state.practiceCompleted ? "本次练习后 +0.5" : "基于演示画像")}
          ${metric("模拟本周练习", state.practiceCompleted ? "4" : "3", "目标 5 篇")}
          ${metric("模拟连续学习", "6 天", "高于演示基线")}
          ${metric("模拟推荐匹配度", "92%", "虚构数值，不代表实际算法效果")}
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
              <span class="tag">模拟变化</span>
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
          "本公开演示不分析输入内容；无论输入什么，都会展示同一份虚构样例的 Band 4 Mock 报告。建议载入示例作文体验。",
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
            <div class="privacy-line">请勿输入真实个人信息。所写内容不上传或持久保存，且不会参与评分；报告仅是预置Mock。</div>
            <div class="inline-actions">
              <button class="secondary-button" type="button" data-action="load-sample">
                载入虚构示例
              </button>
              <button class="primary-button" type="button" data-action="complete-practice">
                查看预置 Mock 报告
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

        <div class="alert alert--neutral"><strong>固定模拟报告：</strong>下方Band 4及反馈文字均为预置示例，不会根据你刚才输入的作文动态变化，也不能证明评分准确率。</div>
        <section class="panel panel--accent">
          <div class="score-summary">
            <div class="score-ring">
              <div class="score-ring-inner"><div><strong>4</strong><small>Band / 5</small></div></div>
            </div>
            <div>
              <span class="tag tag--purple">mock-product-demo</span>
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
          "当前仅模拟角色切换与评分隐藏规则，不含真实登录、权限管理或身份隔离。所有评分对象均为虚构示例。",
        )}
        <div class="alert alert--neutral">
          模拟双盲流程（非真实权限隔离）：${otherScore === null ? "另一位评分员的状态和分数均被隐藏。" : "另一位评分已提交，但分数仍保持隐藏。"}
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
          "这是公开Mock仲裁规则演示：两次模拟独立评分结果不一致时显示双方分数，不涉及真实仲裁权限。",
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
        <section class="card-grid card-grid--three boundary-grid">
          ${boundaryCard("当前交互演示", "演示层", [
            "GitHub Pages 静态页面",
            "使用模拟数据",
            "不连接外部 API",
            "不产生模型费用",
          ])}
          ${boundaryCard("当前项目已经完成 / 验证的能力", "项目能力", [
            "本地 MVP 核心学习闭环",
            "异步评分、Schema 校验与失败恢复",
            "API 成本账本、预算预占与费用结算",
            "双盲评分及分歧仲裁工具",
            "隔离 staging 真实模型链路验证",
          ])}
          ${boundaryCard("下一阶段验证", "待验证", [
            "人工评分数据积累",
            "AI 与人工评分一致性验证",
            "小规模封闭测试",
            "生产环境验收",
          ])}
        </section>
        <section class="panel">
          <div class="card-title-row">
            <div>
              <strong>阶段说明</strong>
              <p>当前未宣称正式上线、真实用户运营数据或已验证的评分准确率；静态演示中的分数与进度均为模拟信息。</p>
            </div>
            <span class="tag">如实展示</span>
          </div>
        </section>
        <section class="card-grid card-grid--three">
          ${featureCard("安全", "没有密钥、用户数据、外部脚本、追踪器或后端地址。")}
          ${featureCard("可分享", "发布为 GitHub Pages 后，可通过浏览器直接体验产品交互。")}
          ${featureCard("可复位", "所有操作状态均可一键恢复，不影响任何真实环境。")}
        </section>
      </div>
    `;
  }

  function featureCard(title, description) {
    return `<article class="feature-card"><span class="role-number">✓</span><h3>${title}</h3><p>${description}</p></article>`;
  }

  function boundaryCard(title, label, items) {
    return `
      <article class="feature-card boundary-card">
        <span class="tag tag--purple">${label}</span>
        <h3>${title}</h3>
        <ul class="check-list">${items.map((item) => `<li>${item}</li>`).join("")}</ul>
      </article>
    `;
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
      tour: renderTour,
      decisions: renderDecisions,
      evidence: renderEvidence,
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
    document.title = `${navItems.find(([key]) => key === route)[1]} · 新托福写作产品演示`;
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
