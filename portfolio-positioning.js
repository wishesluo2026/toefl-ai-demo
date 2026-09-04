(() => {
  "use strict";

  function isOverview() {
    const route = location.hash.replace(/^#/, "").split("?")[0];
    return !route || route === "overview";
  }

  function applyPortfolioPositioning() {
    if (!isOverview()) return;

    const heroDescription = document.querySelector("#app .hero p");
    if (heroDescription) {
      heroDescription.textContent =
        "这是新托福写作 AI 训练与评分平台的公开安全交互演示，展示学生训练、AI 评分报告、学习画像、成本控制、双盲人工评分与分歧仲裁等核心产品机制。公开演示使用模拟数据；主项目已完成隔离 Staging 真实模型链路、异步评分、成本账本及 Human-in-the-loop 流程验证。";
    }

    const metricCards = [...document.querySelectorAll("#app .metric-card")];
    const apiMetric = metricCards.find(
      (card) =>
        card.querySelector(".metric-label")?.textContent.trim() === "外部 API 请求",
    );

    if (apiMetric) {
      const label = apiMetric.querySelector(".metric-label");
      const value = apiMetric.querySelector(".metric-value");
      const detail = apiMetric.querySelector(".metric-detail");

      if (label) label.textContent = "真实模型链路";
      if (value) value.textContent = "已验证";
      if (detail) detail.textContent = "公开 Demo 使用 Mock 数据";
    }
  }

  applyPortfolioPositioning();

  const app = document.querySelector("#app");
  if (app) {
    new MutationObserver(applyPortfolioPositioning).observe(app, {
      childList: true,
    });
  }

  window.addEventListener("hashchange", () => {
    window.setTimeout(applyPortfolioPositioning, 0);
  });
})();
