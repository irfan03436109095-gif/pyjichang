/* 复用本站 gtag；仅统计两个现有邀请入口的点击，不代表注册完成。 */
(() => {
  "use strict";
  const providers = [
    { host: "goflybit.com", code: "gPinVG8C", name: "flybit" },
    { host: "99ba.net", code: "sExBbdk9", name: "99ba" },
  ];
  const record = (event) => {
    if (event.type === "auxclick" ? event.button !== 1 : event.button !== 0) return;
    const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
    if (!link || typeof window.gtag !== "function") return;
    try {
      const url = new URL(link.href, document.baseURI);
      if (url.protocol !== "https:") return;
      const hashQuery = url.hash.includes("?") ? url.hash.slice(url.hash.indexOf("?") + 1) : "";
      const code = new URLSearchParams(hashQuery).get("code") || url.searchParams.get("code");
      const provider = providers.find((item) => url.hostname === item.host && code === item.code);
      if (!provider) return;
      const placement = link.closest(".site-footer") ? "footer"
        : link.closest(".home-rail, .article-rail") ? "sidebar"
          : link.closest("article[data-pagefind-body]") ? "article" : "home";
      window.gtag("event", "airport_referral_click", { provider: provider.name, placement });
    } catch {
      /* 统计失败不能妨碍正常跳转，不延迟导航。 */
    }
  };
  document.addEventListener("click", record, { passive: true });
  document.addEventListener("auxclick", record, { passive: true });
})();
