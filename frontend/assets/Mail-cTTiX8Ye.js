import { G as y, H as g, l as D, w, O as v, D as M, ab as d, ac as p, S as a, Q as s, M as b, aB as x, aC as T, a5 as k, E as i, P as l, F as B, ah as N, V as n, R as c, aD as O } from "./index-BK5W-wKg.js";
const S = { class: "center" }, V = ["srcdoc"], C = { __name: "Mail", setup(I) {
  const { telegramApp: r, loading: _, useUTCDate: f } = g(), m = x(), e = D({});
  w(r, async () => {
    r.value.initData && (e.value = await u());
  });
  const u = async () => {
    try {
      const t = await b.fetch("/telegram/get_mail", { method: "POST", body: JSON.stringify({ initData: r.value.initData, mailId: m.query.mail_id }) });
      return _.value = true, await T(t);
    } catch (t) {
      return console.error(t), {};
    } finally {
      _.value = false;
    }
  };
  return v(async () => {
    e.value = await u();
  }), (t, E) => {
    const o = N, h = k;
    return i(), M("div", S, [a(e).message ? (i(), d(h, { key: 0, bordered: false, embedded: "", style: { "max-width": "800px", height: "100%" } }, { default: s(() => [l(o, { type: "info" }, { default: s(() => [n(" ID: " + c(a(e).id), 1)]), _: 1 }), l(o, { type: "info" }, { default: s(() => [n(" Date: " + c(a(O)(a(e).created_at, a(f))), 1)]), _: 1 }), l(o, { type: "info" }, { default: s(() => [n(" FROM: " + c(a(e).source), 1)]), _: 1 }), t.showEMailTo ? (i(), d(o, { key: 0, type: "info" }, { default: s(() => [n(" TO: " + c(a(e).address), 1)]), _: 1 })) : p("", true), B("iframe", { srcdoc: a(e).message, style: { "margin-top": "10px", width: "100%", height: "100%" } }, null, 8, V)]), _: 1 })) : p("", true)]);
  };
} }, F = y(C, [["__scopeId", "data-v-5ff036bb"]]);
export {
  F as default
};
