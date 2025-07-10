const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/SendMail-CHZW5k8L.js","assets/index.esm-Btyk2eFL.js","assets/index-BK5W-wKg.js","assets/index-Cf4rMYZC.css","assets/index-BHtaHxM4.css","assets/SendMail-aMwcx0sS.css"])))=>i.map(i=>d[i]);
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { d as te, h as T, c as At, i as St, b as Mt, a as Ut, e as Lt, f as he, _ as ae, r as ye, u as ut, g as Ie, j as Tt, k as Dt, l as y, t as $t, m as It, n as _e, w as Oe, o as dt, p as Ue, q as Ot, X as Je, s as Qe, N as Ge, A as Pt, v as ge, x as zt, y as Xe, z as $e, B as Bt, C as Rt, D as E, E as I, F as N, G as K, H as ne, I as G, J as H, K as z, L as ct, M as $, O as X, P as e, Q as t, R as b, S as a, T as Nt, U as ke, V as M, W as xe, Y as we, Z as ie, $ as We, a0 as Pe, a1 as Vt, a2 as Et, a3 as mt, a4 as Ye, a5 as le, a6 as Ke, a7 as qt, a8 as Le, a9 as pt, aa as _t, ab as Y, ac as ee, ad as ce, ae as Ft, af as fe, ag as Te, ah as jt, ai as ze, aj as Ze, ak as Wt, al as Kt, am as ft, an as Ht, ao as Jt, ap as Qt, aq as Gt, ar as Xt, as as vt, at as Yt, au as Zt, av as ea, aw as ta, ax as aa, ay as na, az as la, aA as sa, __tla as __tla_0 } from "./index-BK5W-wKg.js";
let xn;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const oa = te({
    name: "Remove",
    render() {
      return T("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 512 512"
      }, T("line", {
        x1: "400",
        y1: "256",
        x2: "112",
        y2: "256",
        style: `
        fill: none;
        stroke: currentColor;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 32px;
      `
      }));
    }
  });
  function ra(d) {
    const { textColorDisabled: i } = d;
    return {
      iconColorDisabled: i
    };
  }
  const ia = At({
    name: "InputNumber",
    common: Ut,
    peers: {
      Button: Mt,
      Input: St
    },
    self: ra
  }), ua = Lt([
    he("input-number-suffix", `
 display: inline-block;
 margin-right: 10px;
 `),
    he("input-number-prefix", `
 display: inline-block;
 margin-left: 10px;
 `)
  ]);
  function da(d) {
    return d == null || typeof d == "string" && d.trim() === "" ? null : Number(d);
  }
  function ca(d) {
    return d.includes(".") && (/^(-)?\d+.*(\.|0)$/.test(d) || /^-?\d*$/.test(d)) || d === "-" || d === "-0";
  }
  function Fe(d) {
    return d == null ? true : !Number.isNaN(d);
  }
  function et(d, i) {
    return typeof d != "number" ? "" : i === void 0 ? String(d) : d.toFixed(i);
  }
  function je(d) {
    if (d === null) return null;
    if (typeof d == "number") return d;
    {
      const i = Number(d);
      return Number.isNaN(i) ? null : i;
    }
  }
  let tt, at, ma, He, pa, _a, fa, va, Me, ba, ga, ha, ya, wa, nt, ka, xa, Ca, Aa, Sa, Ma, Ua, La, Ta, Da, $a, Ia, Oa, Pa, za, Ba, Ra, Na, lt, Va, Ea, qa, Fa, ja, Wa, Ka, Ha, Ja, Qa, st, Ga, ot, Xa, Ya, Za, en, tn, an, nn, ln, sn, on, rn, un, rt, dn, cn, mn, pn, _n, fn, vn, bn, gn, hn, it, yn, wn;
  tt = 800;
  at = 100;
  ma = Object.assign(Object.assign({}, Ie.props), {
    autofocus: Boolean,
    loading: {
      type: Boolean,
      default: void 0
    },
    placeholder: String,
    defaultValue: {
      type: Number,
      default: null
    },
    value: Number,
    step: {
      type: [
        Number,
        String
      ],
      default: 1
    },
    min: [
      Number,
      String
    ],
    max: [
      Number,
      String
    ],
    size: String,
    disabled: {
      type: Boolean,
      default: void 0
    },
    validator: Function,
    bordered: {
      type: Boolean,
      default: void 0
    },
    showButton: {
      type: Boolean,
      default: true
    },
    buttonPlacement: {
      type: String,
      default: "right"
    },
    inputProps: Object,
    readonly: Boolean,
    clearable: Boolean,
    keyboard: {
      type: Object,
      default: {}
    },
    updateValueOnInput: {
      type: Boolean,
      default: true
    },
    round: {
      type: Boolean,
      default: void 0
    },
    parse: Function,
    format: Function,
    precision: Number,
    status: String,
    "onUpdate:value": [
      Function,
      Array
    ],
    onUpdateValue: [
      Function,
      Array
    ],
    onFocus: [
      Function,
      Array
    ],
    onBlur: [
      Function,
      Array
    ],
    onClear: [
      Function,
      Array
    ],
    onChange: [
      Function,
      Array
    ]
  });
  He = te({
    name: "InputNumber",
    props: ma,
    slots: Object,
    setup(d) {
      const { mergedBorderedRef: i, mergedClsPrefixRef: l, mergedRtlRef: n } = ut(d), s = Ie("InputNumber", "-input-number", ua, ia, d, l), { localeRef: f } = Tt("InputNumber"), o = Dt(d), { mergedSizeRef: u, mergedDisabledRef: r, mergedStatusRef: v } = o, m = y(null), c = y(null), h = y(null), k = y(d.defaultValue), S = $t(d, "value"), g = It(S, k), x = y(""), L = (p) => {
        const D = String(p).split(".")[1];
        return D ? D.length : 0;
      }, w = (p) => {
        const D = [
          d.min,
          d.max,
          d.step,
          p
        ].map((P) => P === void 0 ? 0 : L(P));
        return Math.max(...D);
      }, C = _e(() => {
        const { placeholder: p } = d;
        return p !== void 0 ? p : f.value.placeholder;
      }), A = _e(() => {
        const p = je(d.step);
        return p !== null ? p === 0 ? 1 : Math.abs(p) : 1;
      }), O = _e(() => {
        const p = je(d.min);
        return p !== null ? p : null;
      }), q = _e(() => {
        const p = je(d.max);
        return p !== null ? p : null;
      }), J = () => {
        const { value: p } = g;
        if (Fe(p)) {
          const { format: D, precision: P } = d;
          D ? x.value = D(p) : p === null || P === void 0 || L(p) > P ? x.value = et(p, void 0) : x.value = et(p, P);
        } else x.value = String(p);
      };
      J();
      const Z = (p) => {
        const { value: D } = g;
        if (p === D) {
          J();
          return;
        }
        const { "onUpdate:value": P, onUpdateValue: j, onChange: oe } = d, { nTriggerFormInput: re, nTriggerFormChange: be } = o;
        oe && ge(oe, p), j && ge(j, p), P && ge(P, p), k.value = p, re(), be();
      }, W = ({ offset: p, doUpdateIfValid: D, fixPrecision: P, isInputing: j }) => {
        const { value: oe } = x;
        if (j && ca(oe)) return false;
        const re = (d.parse || da)(oe);
        if (re === null) return D && Z(null), null;
        if (Fe(re)) {
          const be = L(re), { precision: Se } = d;
          if (Se !== void 0 && Se < be && !P) return false;
          let de = Number.parseFloat((re + p).toFixed(Se ?? w(re)));
          if (Fe(de)) {
            const { value: Ee } = q, { value: qe } = O;
            if (Ee !== null && de > Ee) {
              if (!D || j) return false;
              de = Ee;
            }
            if (qe !== null && de < qe) {
              if (!D || j) return false;
              de = qe;
            }
            return d.validator && !d.validator(de) ? false : (D && Z(de), de);
          }
        }
        return false;
      }, se = _e(() => W({
        offset: 0,
        doUpdateIfValid: false,
        isInputing: false,
        fixPrecision: false
      }) === false), V = _e(() => {
        const { value: p } = g;
        if (d.validator && p === null) return false;
        const { value: D } = A;
        return W({
          offset: -D,
          doUpdateIfValid: false,
          isInputing: false,
          fixPrecision: false
        }) !== false;
      }), F = _e(() => {
        const { value: p } = g;
        if (d.validator && p === null) return false;
        const { value: D } = A;
        return W({
          offset: +D,
          doUpdateIfValid: false,
          isInputing: false,
          fixPrecision: false
        }) !== false;
      });
      function Ce(p) {
        const { onFocus: D } = d, { nTriggerFormFocus: P } = o;
        D && ge(D, p), P();
      }
      function Ae(p) {
        var D, P;
        if (p.target === ((D = m.value) === null || D === void 0 ? void 0 : D.wrapperElRef)) return;
        const j = W({
          offset: 0,
          doUpdateIfValid: true,
          isInputing: false,
          fixPrecision: true
        });
        if (j !== false) {
          const be = (P = m.value) === null || P === void 0 ? void 0 : P.inputElRef;
          be && (be.value = String(j || "")), g.value === j && J();
        } else J();
        const { onBlur: oe } = d, { nTriggerFormBlur: re } = o;
        oe && ge(oe, p), re(), zt(() => {
          J();
        });
      }
      function U(p) {
        const { onClear: D } = d;
        D && ge(D, p);
      }
      function _() {
        const { value: p } = F;
        if (!p) {
          Ve();
          return;
        }
        const { value: D } = g;
        if (D === null) d.validator || Z(ue());
        else {
          const { value: P } = A;
          W({
            offset: P,
            doUpdateIfValid: true,
            isInputing: false,
            fixPrecision: true
          });
        }
      }
      function Q() {
        const { value: p } = V;
        if (!p) {
          R();
          return;
        }
        const { value: D } = g;
        if (D === null) d.validator || Z(ue());
        else {
          const { value: P } = A;
          W({
            offset: -P,
            doUpdateIfValid: true,
            isInputing: false,
            fixPrecision: true
          });
        }
      }
      const B = Ce, Be = Ae;
      function ue() {
        if (d.validator) return null;
        const { value: p } = O, { value: D } = q;
        return p !== null ? Math.max(0, p) : D !== null ? Math.min(0, D) : 0;
      }
      function Re(p) {
        U(p), Z(null);
      }
      function Ne(p) {
        var D, P, j;
        !((D = h.value) === null || D === void 0) && D.$el.contains(p.target) && p.preventDefault(), !((P = c.value) === null || P === void 0) && P.$el.contains(p.target) && p.preventDefault(), (j = m.value) === null || j === void 0 || j.activate();
      }
      let me = null, pe = null, ve = null;
      function R() {
        ve && (window.clearTimeout(ve), ve = null), me && (window.clearInterval(me), me = null);
      }
      let De = null;
      function Ve() {
        De && (window.clearTimeout(De), De = null), pe && (window.clearInterval(pe), pe = null);
      }
      function bt() {
        R(), ve = window.setTimeout(() => {
          me = window.setInterval(() => {
            Q();
          }, at);
        }, tt), Xe("mouseup", document, R, {
          once: true
        });
      }
      function gt() {
        Ve(), De = window.setTimeout(() => {
          pe = window.setInterval(() => {
            _();
          }, at);
        }, tt), Xe("mouseup", document, Ve, {
          once: true
        });
      }
      const ht = () => {
        pe || _();
      }, yt = () => {
        me || Q();
      };
      function wt(p) {
        var D, P;
        if (p.key === "Enter") {
          if (p.target === ((D = m.value) === null || D === void 0 ? void 0 : D.wrapperElRef)) return;
          W({
            offset: 0,
            doUpdateIfValid: true,
            isInputing: false,
            fixPrecision: true
          }) !== false && ((P = m.value) === null || P === void 0 || P.deactivate());
        } else if (p.key === "ArrowUp") {
          if (!F.value || d.keyboard.ArrowUp === false) return;
          p.preventDefault(), W({
            offset: 0,
            doUpdateIfValid: true,
            isInputing: false,
            fixPrecision: true
          }) !== false && _();
        } else if (p.key === "ArrowDown") {
          if (!V.value || d.keyboard.ArrowDown === false) return;
          p.preventDefault(), W({
            offset: 0,
            doUpdateIfValid: true,
            isInputing: false,
            fixPrecision: true
          }) !== false && Q();
        }
      }
      function kt(p) {
        x.value = p, d.updateValueOnInput && !d.format && !d.parse && d.precision === void 0 && W({
          offset: 0,
          doUpdateIfValid: true,
          isInputing: true,
          fixPrecision: false
        });
      }
      Oe(g, () => {
        J();
      });
      const xt = {
        focus: () => {
          var p;
          return (p = m.value) === null || p === void 0 ? void 0 : p.focus();
        },
        blur: () => {
          var p;
          return (p = m.value) === null || p === void 0 ? void 0 : p.blur();
        },
        select: () => {
          var p;
          return (p = m.value) === null || p === void 0 ? void 0 : p.select();
        }
      }, Ct = dt("InputNumber", n, l);
      return Object.assign(Object.assign({}, xt), {
        rtlEnabled: Ct,
        inputInstRef: m,
        minusButtonInstRef: c,
        addButtonInstRef: h,
        mergedClsPrefix: l,
        mergedBordered: i,
        uncontrolledValue: k,
        mergedValue: g,
        mergedPlaceholder: C,
        displayedValueInvalid: se,
        mergedSize: u,
        mergedDisabled: r,
        displayedValue: x,
        addable: F,
        minusable: V,
        mergedStatus: v,
        handleFocus: B,
        handleBlur: Be,
        handleClear: Re,
        handleMouseDown: Ne,
        handleAddClick: ht,
        handleMinusClick: yt,
        handleAddMousedown: gt,
        handleMinusMousedown: bt,
        handleKeyDown: wt,
        handleUpdateDisplayedValue: kt,
        mergedTheme: s,
        inputThemeOverrides: {
          paddingSmall: "0 8px 0 10px",
          paddingMedium: "0 8px 0 12px",
          paddingLarge: "0 8px 0 14px"
        },
        buttonThemeOverrides: Ue(() => {
          const { self: { iconColorDisabled: p } } = s.value, [D, P, j, oe] = Ot(p);
          return {
            textColorTextDisabled: `rgb(${D}, ${P}, ${j})`,
            opacityDisabled: `${oe}`
          };
        })
      });
    },
    render() {
      const { mergedClsPrefix: d, $slots: i } = this, l = () => T(Je, {
        text: true,
        disabled: !this.minusable || this.mergedDisabled || this.readonly,
        focusable: false,
        theme: this.mergedTheme.peers.Button,
        themeOverrides: this.mergedTheme.peerOverrides.Button,
        builtinThemeOverrides: this.buttonThemeOverrides,
        onClick: this.handleMinusClick,
        onMousedown: this.handleMinusMousedown,
        ref: "minusButtonInstRef"
      }, {
        icon: () => Qe(i["minus-icon"], () => [
          T(Ge, {
            clsPrefix: d
          }, {
            default: () => T(oa, null)
          })
        ])
      }), n = () => T(Je, {
        text: true,
        disabled: !this.addable || this.mergedDisabled || this.readonly,
        focusable: false,
        theme: this.mergedTheme.peers.Button,
        themeOverrides: this.mergedTheme.peerOverrides.Button,
        builtinThemeOverrides: this.buttonThemeOverrides,
        onClick: this.handleAddClick,
        onMousedown: this.handleAddMousedown,
        ref: "addButtonInstRef"
      }, {
        icon: () => Qe(i["add-icon"], () => [
          T(Ge, {
            clsPrefix: d
          }, {
            default: () => T(Pt, null)
          })
        ])
      });
      return T("div", {
        class: [
          `${d}-input-number`,
          this.rtlEnabled && `${d}-input-number--rtl`
        ]
      }, T(ae, {
        ref: "inputInstRef",
        autofocus: this.autofocus,
        status: this.mergedStatus,
        bordered: this.mergedBordered,
        loading: this.loading,
        value: this.displayedValue,
        onUpdateValue: this.handleUpdateDisplayedValue,
        theme: this.mergedTheme.peers.Input,
        themeOverrides: this.mergedTheme.peerOverrides.Input,
        builtinThemeOverrides: this.inputThemeOverrides,
        size: this.mergedSize,
        placeholder: this.mergedPlaceholder,
        disabled: this.mergedDisabled,
        readonly: this.readonly,
        round: this.round,
        textDecoration: this.displayedValueInvalid ? "line-through" : void 0,
        onFocus: this.handleFocus,
        onBlur: this.handleBlur,
        onKeydown: this.handleKeyDown,
        onMousedown: this.handleMouseDown,
        onClear: this.handleClear,
        clearable: this.clearable,
        inputProps: this.inputProps,
        internalLoadingBeforeSuffix: true
      }, {
        prefix: () => {
          var s;
          return this.showButton && this.buttonPlacement === "both" ? [
            l(),
            ye(i.prefix, (f) => f ? T("span", {
              class: `${d}-input-number-prefix`
            }, f) : null)
          ] : (s = i.prefix) === null || s === void 0 ? void 0 : s.call(i);
        },
        suffix: () => {
          var s;
          return this.showButton ? [
            ye(i.suffix, (f) => f ? T("span", {
              class: `${d}-input-number-suffix`
            }, f) : null),
            this.buttonPlacement === "right" ? l() : null,
            n()
          ] : (s = i.suffix) === null || s === void 0 ? void 0 : s.call(i);
        }
      }));
    }
  });
  pa = he("statistic", [
    $e("label", `
 font-weight: var(--n-label-font-weight);
 transition: .3s color var(--n-bezier);
 font-size: var(--n-label-font-size);
 color: var(--n-label-text-color);
 `),
    he("statistic-value", `
 margin-top: 4px;
 font-weight: var(--n-value-font-weight);
 `, [
      $e("prefix", `
 margin: 0 4px 0 0;
 font-size: var(--n-value-font-size);
 transition: .3s color var(--n-bezier);
 color: var(--n-value-prefix-text-color);
 `, [
        he("icon", {
          verticalAlign: "-0.125em"
        })
      ]),
      $e("content", `
 font-size: var(--n-value-font-size);
 transition: .3s color var(--n-bezier);
 color: var(--n-value-text-color);
 `),
      $e("suffix", `
 margin: 0 0 0 4px;
 font-size: var(--n-value-font-size);
 transition: .3s color var(--n-bezier);
 color: var(--n-value-suffix-text-color);
 `, [
        he("icon", {
          verticalAlign: "-0.125em"
        })
      ])
    ])
  ]);
  _a = Object.assign(Object.assign({}, Ie.props), {
    tabularNums: Boolean,
    label: String,
    value: [
      String,
      Number
    ]
  });
  fa = te({
    name: "Statistic",
    props: _a,
    slots: Object,
    setup(d) {
      const { mergedClsPrefixRef: i, inlineThemeDisabled: l, mergedRtlRef: n } = ut(d), s = Ie("Statistic", "-statistic", pa, Bt, d, i), f = dt("Statistic", n, i), o = Ue(() => {
        const { self: { labelFontWeight: r, valueFontSize: v, valueFontWeight: m, valuePrefixTextColor: c, labelTextColor: h, valueSuffixTextColor: k, valueTextColor: S, labelFontSize: g }, common: { cubicBezierEaseInOut: x } } = s.value;
        return {
          "--n-bezier": x,
          "--n-label-font-size": g,
          "--n-label-font-weight": r,
          "--n-label-text-color": h,
          "--n-value-font-weight": m,
          "--n-value-font-size": v,
          "--n-value-prefix-text-color": c,
          "--n-value-suffix-text-color": k,
          "--n-value-text-color": S
        };
      }), u = l ? Rt("statistic", void 0, o, d) : void 0;
      return {
        rtlEnabled: f,
        mergedClsPrefix: i,
        cssVars: l ? void 0 : o,
        themeClass: u == null ? void 0 : u.themeClass,
        onRender: u == null ? void 0 : u.onRender
      };
    },
    render() {
      var d;
      const { mergedClsPrefix: i, $slots: { default: l, label: n, prefix: s, suffix: f } } = this;
      return (d = this.onRender) === null || d === void 0 || d.call(this), T("div", {
        class: [
          `${i}-statistic`,
          this.themeClass,
          this.rtlEnabled && `${i}-statistic--rtl`
        ],
        style: this.cssVars
      }, ye(n, (o) => T("div", {
        class: `${i}-statistic__label`
      }, this.label || o)), T("div", {
        class: `${i}-statistic-value`,
        style: {
          fontVariantNumeric: this.tabularNums ? "tabular-nums" : ""
        }
      }, ye(s, (o) => o && T("span", {
        class: `${i}-statistic-value__prefix`
      }, o)), this.value !== void 0 ? T("span", {
        class: `${i}-statistic-value__content`
      }, this.value) : ye(l, (o) => o && T("span", {
        class: `${i}-statistic-value__content`
      }, o)), ye(f, (o) => o && T("span", {
        class: `${i}-statistic-value__suffix`
      }, o))));
    }
  });
  va = {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    viewBox: "0 0 24 24"
  };
  Me = te({
    name: "CleaningServicesFilled",
    render: function(i, l) {
      return I(), E("svg", va, l[0] || (l[0] = [
        N("path", {
          d: "M16 11h-1V3c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v8H8c-2.76 0-5 2.24-5 5v7h18v-7c0-2.76-2.24-5-5-5zm3 10h-2v-3c0-.55-.45-1-1-1s-1 .45-1 1v3h-2v-3c0-.55-.45-1-1-1s-1 .45-1 1v3H9v-3c0-.55-.45-1-1-1s-1 .45-1 1v3H5v-5c0-1.65 1.35-3 3-3h8c1.65 0 3 1.35 3 3v5z",
          fill: "currentColor"
        }, null, -1)
      ]));
    }
  });
  ba = {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    viewBox: "0 0 24 24"
  };
  ga = te({
    name: "SendOutlined",
    render: function(i, l) {
      return I(), E("svg", ba, l[0] || (l[0] = [
        N("path", {
          d: "M4.01 6.03l7.51 3.22l-7.52-1l.01-2.22m7.5 8.72L4 17.97v-2.22l7.51-1M2.01 3L2 10l15 2l-15 2l.01 7L23 12L2.01 3z",
          fill: "currentColor"
        }, null, -1)
      ]));
    }
  });
  ha = {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    viewBox: "0 0 576 512"
  };
  ya = te({
    name: "MailBulk",
    render: function(i, l) {
      return I(), E("svg", ha, l[0] || (l[0] = [
        N("path", {
          d: "M160 448c-25.6 0-51.2-22.4-64-32c-64-44.8-83.2-60.8-96-70.4V480c0 17.67 14.33 32 32 32h256c17.67 0 32-14.33 32-32V345.6c-12.8 9.6-32 25.6-96 70.4c-12.8 9.6-38.4 32-64 32zm128-192H32c-17.67 0-32 14.33-32 32v16c25.6 19.2 22.4 19.2 115.2 86.4c9.6 6.4 28.8 25.6 44.8 25.6s35.2-19.2 44.8-22.4c92.8-67.2 89.6-67.2 115.2-86.4V288c0-17.67-14.33-32-32-32zm256-96H224c-17.67 0-32 14.33-32 32v32h96c33.21 0 60.59 25.42 63.71 57.82l.29-.22V416h192c17.67 0 32-14.33 32-32V192c0-17.67-14.33-32-32-32zm-32 128h-64v-64h64v64zm-352-96c0-35.29 28.71-64 64-64h224V32c0-17.67-14.33-32-32-32H96C78.33 0 64 14.33 64 32v192h96v-32z",
          fill: "currentColor"
        }, null, -1)
      ]));
    }
  });
  wa = {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    viewBox: "0 0 640 512"
  };
  nt = te({
    name: "UserCheck",
    render: function(i, l) {
      return I(), E("svg", wa, l[0] || (l[0] = [
        N("path", {
          d: "M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0S96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4zm323-128.4l-27.8-28.1c-4.6-4.7-12.1-4.7-16.8-.1l-104.8 104l-45.5-45.8c-4.6-4.7-12.1-4.7-16.8-.1l-28.1 27.9c-4.7 4.6-4.7 12.1-.1 16.8l81.7 82.3c4.6 4.7 12.1 4.7 16.8.1l141.3-140.2c4.6-4.7 4.7-12.2.1-16.8z",
          fill: "currentColor"
        }, null, -1)
      ]));
    }
  });
  ka = {
    style: {
      overflow: "auto"
    }
  };
  xa = {
    style: {
      display: "inline-block"
    }
  };
  Ca = {
    __name: "SenderAccess",
    setup(d) {
      const { loading: i } = ne(), l = G(), { t: n } = H({
        messages: {
          en: {
            address: "Address",
            success: "Success",
            is_enabled: "Is Enabled",
            enable: "Enable",
            disable: "Disable",
            modify: "Modify",
            delete: "Delete",
            deleteTip: "Are you sure to delete this?",
            created_at: "Created At",
            action: "Action",
            itemCount: "itemCount",
            modalTip: "Please input the sender balance",
            balance: "Balance",
            query: "Query",
            ok: "OK"
          },
          zh: {
            address: "\u5730\u5740",
            success: "\u6210\u529F",
            is_enabled: "\u662F\u5426\u542F\u7528",
            enable: "\u542F\u7528",
            disable: "\u7981\u7528",
            modify: "\u4FEE\u6539",
            delete: "\u5220\u9664",
            deleteTip: "\u786E\u5B9A\u5220\u9664\u5417\uFF1F",
            created_at: "\u521B\u5EFA\u65F6\u95F4",
            action: "\u64CD\u4F5C",
            itemCount: "\u603B\u6570",
            modalTip: "\u8BF7\u8F93\u5165\u53D1\u4EF6\u989D\u5EA6",
            balance: "\u4F59\u989D",
            query: "\u67E5\u8BE2",
            ok: "\u786E\u5B9A"
          }
        }
      }), s = y([]), f = y(0), o = y(1), u = y(20), r = y({}), v = y(false), m = y(0), c = y(false), h = y(""), k = async () => {
        try {
          await $.fetch("/admin/address_sender", {
            method: "POST",
            body: JSON.stringify({
              address: r.value.address,
              address_id: r.value.id,
              balance: m.value,
              enabled: c.value ? 1 : 0
            })
          }), v.value = false, l.success(n("success")), await S();
        } catch (x) {
          l.error(x.message || "error");
        }
      }, S = async () => {
        try {
          h.value = h.value.trim();
          const { results: x, count: L } = await $.fetch(`/admin/address_sender?limit=${u.value}&offset=${(o.value - 1) * u.value}` + (h.value ? `&address=${h.value}` : ""));
          s.value = x, L > 0 && (f.value = L);
        } catch (x) {
          console.log(x), l.error(x.message || "error");
        }
      }, g = [
        {
          title: "ID",
          key: "id"
        },
        {
          title: n("address"),
          key: "address"
        },
        {
          title: n("created_at"),
          key: "created_at"
        },
        {
          title: n("balance"),
          key: "balance"
        },
        {
          title: n("is_enabled"),
          key: "enabled",
          render(x) {
            return T("div", [
              T("span", x.enabled ? n("enable") : n("disable"))
            ]);
          }
        },
        {
          title: n("action"),
          key: "actions",
          render(x) {
            return T("div", [
              T(z, {
                type: "success",
                tertiary: true,
                onClick: () => {
                  v.value = true, r.value = x, c.value = !!x.enabled, m.value = x.balance;
                }
              }, {
                default: () => n("modify")
              }),
              T(ct, {
                onPositiveClick: async () => {
                  await $.fetch(`/admin/address_sender/${x.id}`, {
                    method: "DELETE"
                  }), await S();
                }
              }, {
                trigger: () => T(z, {
                  tertiary: true,
                  type: "error"
                }, {
                  default: () => n("delete")
                }),
                default: () => n("deleteTip")
              })
            ]);
          }
        }
      ];
      return Oe([
        o,
        u
      ], async () => {
        await S();
      }), X(async () => {
        await S();
      }), (x, L) => {
        const w = ke, C = Nt, A = He, O = z, q = xe, J = ae, Z = ie, W = We, se = Pe;
        return I(), E("div", null, [
          e(q, {
            show: v.value,
            "onUpdate:show": L[3] || (L[3] = (V) => v.value = V),
            preset: "dialog"
          }, {
            action: t(() => [
              e(O, {
                loading: a(i),
                onClick: L[2] || (L[2] = (V) => k()),
                size: "small",
                tertiary: "",
                type: "primary"
              }, {
                default: t(() => [
                  M(b(a(n)("ok")), 1)
                ]),
                _: 1
              }, 8, [
                "loading"
              ])
            ]),
            default: t(() => [
              N("p", null, b(r.value.address), 1),
              N("p", null, b(a(n)("modalTip")), 1),
              e(C, {
                "show-label": false
              }, {
                default: t(() => [
                  e(w, {
                    checked: c.value,
                    "onUpdate:checked": L[0] || (L[0] = (V) => c.value = V)
                  }, {
                    default: t(() => [
                      M(b(a(n)("enable")), 1)
                    ]),
                    _: 1
                  }, 8, [
                    "checked"
                  ])
                ]),
                _: 1
              }),
              e(C, {
                "show-label": false
              }, {
                default: t(() => [
                  e(A, {
                    value: m.value,
                    "onUpdate:value": L[1] || (L[1] = (V) => m.value = V),
                    min: 0,
                    max: 1e3
                  }, null, 8, [
                    "value"
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, [
            "show"
          ]),
          e(Z, null, {
            default: t(() => [
              e(J, {
                value: h.value,
                "onUpdate:value": L[4] || (L[4] = (V) => h.value = V),
                onKeydown: we(S, [
                  "enter"
                ])
              }, null, 8, [
                "value"
              ]),
              e(O, {
                onClick: S,
                type: "primary",
                tertiary: ""
              }, {
                default: t(() => [
                  M(b(a(n)("query")), 1)
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          N("div", ka, [
            N("div", xa, [
              e(W, {
                page: o.value,
                "onUpdate:page": L[5] || (L[5] = (V) => o.value = V),
                "page-size": u.value,
                "onUpdate:pageSize": L[6] || (L[6] = (V) => u.value = V),
                "item-count": f.value,
                "page-sizes": [
                  20,
                  50,
                  100
                ],
                "show-size-picker": ""
              }, {
                prefix: t(({ itemCount: V }) => [
                  M(b(a(n)("itemCount")) + ": " + b(V), 1)
                ]),
                _: 1
              }, 8, [
                "page",
                "page-size",
                "item-count"
              ])
            ]),
            e(se, {
              columns: g,
              data: s.value,
              bordered: false,
              embedded: ""
            }, null, 8, [
              "data"
            ])
          ])
        ]);
      };
    }
  };
  Aa = K(Ca, [
    [
      "__scopeId",
      "data-v-bd8929db"
    ]
  ]);
  Sa = {
    __name: "Statistics",
    setup(d) {
      const i = G(), { t: l } = H({
        messages: {
          en: {
            userCount: "User Count",
            addressCount: "Address Count",
            activeAddressCount7days: "7 days Active Address Count",
            activeAddressCount30days: "30 days Active Address Count",
            mailCount: "Mail Count",
            sendMailCount: "Send Mail Count"
          },
          zh: {
            userCount: "\u7528\u6237\u603B\u6570",
            addressCount: "\u90AE\u7BB1\u5730\u5740\u603B\u6570",
            activeAddressCount7days: "7\u5929\u6D3B\u8DC3\u90AE\u7BB1\u5730\u5740\u603B\u6570",
            activeAddressCount30days: "30\u5929\u6D3B\u8DC3\u90AE\u7BB1\u5730\u5740\u603B\u6570",
            mailCount: "\u90AE\u4EF6\u603B\u6570",
            sendMailCount: "\u53D1\u9001\u90AE\u4EF6\u603B\u6570"
          }
        }
      }), n = y({
        addressCount: 0,
        userCount: 0,
        mailCount: 0,
        activeAddressCount7days: 0,
        activeAddressCount30days: 0,
        sendMailCount: 0
      }), s = async () => {
        try {
          const { userCount: f, mailCount: o, sendMailCount: u, addressCount: r, activeAddressCount7days: v, activeAddressCount30days: m } = await $.fetch("/admin/statistics");
          n.value.mailCount = o || 0, n.value.sendMailCount = u || 0, n.value.userCount = f || 0, n.value.addressCount = r || 0, n.value.activeAddressCount7days = v || 0, n.value.activeAddressCount30days = m || 0;
        } catch (f) {
          console.log(f), i.error(f.message || "error");
        }
      };
      return X(async () => {
        await s();
      }), (f, o) => {
        const u = mt, r = fa, v = Et, m = Vt, c = le;
        return I(), E("div", null, [
          e(c, {
            bordered: false,
            embedded: ""
          }, {
            default: t(() => [
              e(m, null, {
                default: t(() => [
                  e(v, {
                    span: 8
                  }, {
                    default: t(() => [
                      e(r, {
                        label: a(l)("addressCount"),
                        value: n.value.addressCount
                      }, {
                        prefix: t(() => [
                          e(u, {
                            component: a(Ye)
                          }, null, 8, [
                            "component"
                          ])
                        ]),
                        _: 1
                      }, 8, [
                        "label",
                        "value"
                      ])
                    ]),
                    _: 1
                  }),
                  e(v, {
                    span: 8
                  }, {
                    default: t(() => [
                      e(r, {
                        label: a(l)("activeAddressCount7days"),
                        value: n.value.activeAddressCount7days
                      }, {
                        prefix: t(() => [
                          e(u, {
                            component: a(nt)
                          }, null, 8, [
                            "component"
                          ])
                        ]),
                        _: 1
                      }, 8, [
                        "label",
                        "value"
                      ])
                    ]),
                    _: 1
                  }),
                  e(v, {
                    span: 8
                  }, {
                    default: t(() => [
                      e(r, {
                        label: a(l)("activeAddressCount30days"),
                        value: n.value.activeAddressCount30days
                      }, {
                        prefix: t(() => [
                          e(u, {
                            component: a(nt)
                          }, null, 8, [
                            "component"
                          ])
                        ]),
                        _: 1
                      }, 8, [
                        "label",
                        "value"
                      ])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          e(c, {
            bordered: false,
            embedded: ""
          }, {
            default: t(() => [
              e(m, null, {
                default: t(() => [
                  e(v, {
                    span: 8
                  }, {
                    default: t(() => [
                      e(r, {
                        label: a(l)("userCount"),
                        value: n.value.userCount
                      }, {
                        prefix: t(() => [
                          e(u, {
                            component: a(Ye)
                          }, null, 8, [
                            "component"
                          ])
                        ]),
                        _: 1
                      }, 8, [
                        "label",
                        "value"
                      ])
                    ]),
                    _: 1
                  }),
                  e(v, {
                    span: 8
                  }, {
                    default: t(() => [
                      e(r, {
                        label: a(l)("mailCount"),
                        value: n.value.mailCount
                      }, {
                        prefix: t(() => [
                          e(u, {
                            component: a(ya)
                          }, null, 8, [
                            "component"
                          ])
                        ]),
                        _: 1
                      }, 8, [
                        "label",
                        "value"
                      ])
                    ]),
                    _: 1
                  }),
                  e(v, {
                    span: 8
                  }, {
                    default: t(() => [
                      e(r, {
                        label: a(l)("sendMailCount"),
                        value: n.value.sendMailCount
                      }, {
                        prefix: t(() => [
                          e(u, {
                            component: a(ga)
                          }, null, 8, [
                            "component"
                          ])
                        ]),
                        _: 1
                      }, 8, [
                        "label",
                        "value"
                      ])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ]);
      };
    }
  };
  Ma = K(Sa, [
    [
      "__scopeId",
      "data-v-b73833c7"
    ]
  ]);
  Ua = {
    __name: "SendBox",
    setup(d) {
      const { adminSendBoxTabAddress: i } = ne(), { t: l } = H({
        messages: {
          en: {
            query: "Query",
            queryTip: "Please input address to query, leave blank to query all"
          },
          zh: {
            query: "\u67E5\u8BE2",
            queryTip: "\u8BF7\u8F93\u5165\u5730\u5740\u67E5\u8BE2, \u7559\u7A7A\u5219\u67E5\u8BE2\u6240\u6709"
          }
        }
      }), n = async (f, o) => (i.value = i.value.trim(), await $.fetch(`/admin/sendbox?limit=${f}&offset=${o}` + (i.value ? `&address=${i.value}` : ""))), s = async (f) => {
        await $.fetch(`/admin/sendbox/${f}`, {
          method: "DELETE"
        });
      };
      return (f, o) => {
        const u = ae, r = z, v = ie;
        return I(), E("div", null, [
          e(v, null, {
            default: t(() => [
              e(u, {
                value: a(i),
                "onUpdate:value": o[0] || (o[0] = (m) => Ke(i) ? i.value = m : null),
                placeholder: a(l)("queryTip"),
                onKeydown: we(n, [
                  "enter"
                ])
              }, null, 8, [
                "value",
                "placeholder"
              ]),
              e(r, {
                onClick: n,
                type: "primary",
                tertiary: ""
              }, {
                default: t(() => [
                  M(b(a(l)("query")), 1)
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          e(qt, {
            style: {
              "margin-top": "10px"
            },
            enableUserDeleteEmail: true,
            deleteMail: s,
            fetchMailData: n,
            showEMailFrom: true
          })
        ]);
      };
    }
  };
  La = K(Ua, [
    [
      "__scopeId",
      "data-v-fbae4450"
    ]
  ]);
  Ta = {
    style: {
      "margin-top": "10px"
    }
  };
  Da = {
    style: {
      overflow: "auto"
    }
  };
  $a = {
    style: {
      display: "inline-block"
    }
  };
  Ia = {
    __name: "Account",
    setup(d) {
      const { loading: i, adminTab: l, adminMailTabAddress: n, adminSendBoxTabAddress: s } = ne(), f = G(), { t: o } = H({
        messages: {
          en: {
            name: "Name",
            created_at: "Created At",
            updated_at: "Update At",
            mail_count: "Mail Count",
            send_count: "Send Count",
            showCredential: "Show Mail Address Credential",
            addressCredential: "Mail Address Credential",
            addressCredentialTip: "Please copy the Mail Address Credential and you can use it to login to your email account.",
            delete: "Delete",
            deleteTip: "Are you sure to delete this email?",
            delteAccount: "Delete Account",
            viewMails: "View Mails",
            viewSendBox: "View SendBox",
            itemCount: "itemCount",
            query: "Query",
            addressQueryTip: "Leave blank to query all addresses",
            actions: "Actions"
          },
          zh: {
            name: "\u540D\u79F0",
            created_at: "\u521B\u5EFA\u65F6\u95F4",
            updated_at: "\u66F4\u65B0\u65F6\u95F4",
            mail_count: "\u90AE\u4EF6\u6570\u91CF",
            send_count: "\u53D1\u9001\u6570\u91CF",
            showCredential: "\u67E5\u770B\u90AE\u7BB1\u5730\u5740\u51ED\u8BC1",
            addressCredential: "\u90AE\u7BB1\u5730\u5740\u51ED\u8BC1",
            addressCredentialTip: "\u8BF7\u590D\u5236\u90AE\u7BB1\u5730\u5740\u51ED\u8BC1\uFF0C\u4F60\u53EF\u4EE5\u4F7F\u7528\u5B83\u767B\u5F55\u4F60\u7684\u90AE\u7BB1\u3002",
            delete: "\u5220\u9664",
            deleteTip: "\u786E\u5B9A\u8981\u5220\u9664\u8FD9\u4E2A\u90AE\u7BB1\u5417\uFF1F",
            delteAccount: "\u5220\u9664\u90AE\u7BB1",
            viewMails: "\u67E5\u770B\u90AE\u4EF6",
            viewSendBox: "\u67E5\u770B\u53D1\u4EF6\u7BB1",
            itemCount: "\u603B\u6570",
            query: "\u67E5\u8BE2",
            addressQueryTip: "\u7559\u7A7A\u67E5\u8BE2\u6240\u6709\u5730\u5740",
            actions: "\u64CD\u4F5C"
          }
        }
      }), u = y(false), r = y(""), v = y(0), m = y(""), c = y([]), h = y(0), k = y(1), S = y(20), g = y(false), x = async (A) => {
        try {
          r.value = await $.adminShowAddressCredential(A), u.value = true;
        } catch (O) {
          f.error(O.message || "error"), u.value = false, r.value = "";
        }
      }, L = async () => {
        try {
          await $.adminDeleteAddress(v.value), f.success("success"), await w();
        } catch (A) {
          f.error(A.message || "error");
        } finally {
          g.value = false;
        }
      }, w = async () => {
        try {
          m.value = m.value.trim();
          const { results: A, count: O } = await $.fetch(`/admin/address?limit=${S.value}&offset=${(k.value - 1) * S.value}` + (m.value ? `&query=${m.value}` : ""));
          c.value = A, O > 0 && (h.value = O);
        } catch (A) {
          console.log(A), f.error(A.message || "error");
        }
      }, C = [
        {
          title: "ID",
          key: "id"
        },
        {
          title: o("name"),
          key: "name"
        },
        {
          title: o("created_at"),
          key: "created_at"
        },
        {
          title: o("updated_at"),
          key: "updated_at"
        },
        {
          title: o("mail_count"),
          key: "mail_count",
          render(A) {
            return T(z, {
              text: true,
              onClick: () => {
                A.mail_count > 0 && (n.value = A.name, l.value = "mails");
              }
            }, {
              icon: () => T(Le, {
                value: A.mail_count,
                "show-zero": true,
                max: 99,
                type: "success"
              }),
              default: () => A.mail_count > 0 ? o("viewMails") : ""
            });
          }
        },
        {
          title: o("send_count"),
          key: "send_count",
          render(A) {
            return T(z, {
              text: true,
              onClick: () => {
                A.send_count > 0 && (s.value = A.name, l.value = "sendBox");
              }
            }, {
              icon: () => T(Le, {
                value: A.send_count,
                "show-zero": true,
                max: 99,
                type: "success"
              }),
              default: () => A.send_count > 0 ? o("viewSendBox") : ""
            });
          }
        },
        {
          title: o("actions"),
          key: "actions",
          render(A) {
            return T("div", [
              T(pt, {
                mode: "horizontal",
                options: [
                  {
                    label: o("actions"),
                    icon: () => T(_t),
                    key: "action",
                    children: [
                      {
                        label: () => T(z, {
                          text: true,
                          onClick: () => x(A.id)
                        }, {
                          default: () => o("showCredential")
                        })
                      },
                      {
                        label: () => T(z, {
                          text: true,
                          onClick: () => {
                            n.value = A.name, l.value = "mails";
                          }
                        }, {
                          default: () => o("viewMails")
                        }),
                        show: A.mail_count > 0
                      },
                      {
                        label: () => T(z, {
                          text: true,
                          onClick: () => {
                            s.value = A.name, l.value = "sendBox";
                          }
                        }, {
                          default: () => o("viewSendBox")
                        }),
                        show: A.send_count > 0
                      },
                      {
                        label: () => T(z, {
                          text: true,
                          onClick: () => {
                            v.value = A.id, g.value = true;
                          }
                        }, {
                          default: () => o("delete")
                        })
                      }
                    ]
                  }
                ]
              })
            ]);
          }
        }
      ];
      return Oe([
        k,
        S
      ], async () => {
        await w();
      }), X(async () => {
        await w();
      }), (A, O) => {
        const q = le, J = xe, Z = ae, W = ie, se = We, V = Pe;
        return I(), E("div", Ta, [
          e(J, {
            show: u.value,
            "onUpdate:show": O[0] || (O[0] = (F) => u.value = F),
            preset: "dialog",
            title: "Dialog"
          }, {
            header: t(() => [
              N("div", null, b(a(o)("addressCredential")), 1)
            ]),
            action: t(() => O[5] || (O[5] = [])),
            default: t(() => [
              N("span", null, [
                N("p", null, b(a(o)("addressCredentialTip")), 1)
              ]),
              e(q, {
                bordered: false,
                embedded: ""
              }, {
                default: t(() => [
                  N("b", null, b(r.value), 1)
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, [
            "show"
          ]),
          e(J, {
            show: g.value,
            "onUpdate:show": O[1] || (O[1] = (F) => g.value = F),
            preset: "dialog",
            title: a(o)("delteAccount")
          }, {
            action: t(() => [
              e(a(z), {
                loading: a(i),
                onClick: L,
                size: "small",
                tertiary: "",
                type: "error"
              }, {
                default: t(() => [
                  M(b(a(o)("delteAccount")), 1)
                ]),
                _: 1
              }, 8, [
                "loading"
              ])
            ]),
            default: t(() => [
              N("p", null, b(a(o)("deleteTip")), 1)
            ]),
            _: 1
          }, 8, [
            "show",
            "title"
          ]),
          e(W, null, {
            default: t(() => [
              e(Z, {
                value: m.value,
                "onUpdate:value": O[2] || (O[2] = (F) => m.value = F),
                clearable: "",
                placeholder: a(o)("addressQueryTip"),
                onKeydown: we(w, [
                  "enter"
                ])
              }, null, 8, [
                "value",
                "placeholder"
              ]),
              e(a(z), {
                onClick: w,
                type: "primary",
                tertiary: ""
              }, {
                default: t(() => [
                  M(b(a(o)("query")), 1)
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          N("div", Da, [
            N("div", $a, [
              e(se, {
                page: k.value,
                "onUpdate:page": O[3] || (O[3] = (F) => k.value = F),
                "page-size": S.value,
                "onUpdate:pageSize": O[4] || (O[4] = (F) => S.value = F),
                "item-count": h.value,
                "page-sizes": [
                  20,
                  50,
                  100
                ],
                "show-size-picker": ""
              }, {
                prefix: t(({ itemCount: F }) => [
                  M(b(a(o)("itemCount")) + ": " + b(F), 1)
                ]),
                _: 1
              }, 8, [
                "page",
                "page-size",
                "item-count"
              ])
            ]),
            e(V, {
              columns: C,
              data: c.value,
              bordered: false,
              embedded: ""
            }, null, 8, [
              "data"
            ])
          ])
        ]);
      };
    }
  };
  Oa = K(Ia, [
    [
      "__scopeId",
      "data-v-621e5790"
    ]
  ]);
  Pa = {
    class: "center"
  };
  za = {
    __name: "CreateAccount",
    setup(d) {
      const { loading: i, openSettings: l } = ne(), n = G(), { t: s } = H({
        messages: {
          en: {
            address: "Address",
            enablePrefix: "If enable Prefix",
            creatNewEmail: "Get New Email",
            fillInAllFields: "Please fill in all fields",
            successTip: "Success Created",
            addressCredential: "Mail Address Credential"
          },
          zh: {
            address: "\u5730\u5740",
            enablePrefix: "\u662F\u5426\u542F\u7528\u524D\u7F00",
            creatNewEmail: "\u521B\u5EFA\u65B0\u90AE\u7BB1",
            fillInAllFields: "\u8BF7\u586B\u5199\u5B8C\u6574\u4FE1\u606F",
            successTip: "\u521B\u5EFA\u6210\u529F",
            addressCredential: "\u90AE\u7BB1\u5730\u5740\u51ED\u8BC1"
          }
        }
      }), f = y(true), o = y(""), u = y(""), r = y(false), v = y(""), m = async () => {
        if (!o.value || !u.value) {
          n.error(s("fillInAllFields"));
          return;
        }
        try {
          const c = await $.fetch("/admin/new_address", {
            method: "POST",
            body: JSON.stringify({
              enablePrefix: f.value,
              name: o.value,
              domain: u.value
            })
          });
          v.value = c.jwt, n.success(s("successTip")), r.value = true;
        } catch (c) {
          n.error(c.message || "error");
        }
      };
      return X(async () => {
        var _a2, _b;
        l.prefix && (f.value = true), u.value = ((_b = (_a2 = l.value.domains) == null ? void 0 : _a2[0]) == null ? void 0 : _b.value) || "";
      }), (c, h) => {
        const k = le, S = xe, g = ke, x = ce, L = Ft, w = ae, C = fe, A = ie, O = z;
        return I(), E("div", Pa, [
          e(S, {
            show: r.value,
            "onUpdate:show": h[0] || (h[0] = (q) => r.value = q),
            preset: "dialog",
            title: a(s)("addressCredential")
          }, {
            default: t(() => [
              N("p", null, b(a(s)("addressCredential")), 1),
              e(k, {
                bordered: false,
                embedded: ""
              }, {
                default: t(() => [
                  N("b", null, b(v.value), 1)
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, [
            "show",
            "title"
          ]),
          e(k, {
            bordered: false,
            embedded: "",
            style: {
              "max-width": "600px"
            }
          }, {
            default: t(() => [
              a(l).prefix ? (I(), Y(x, {
                key: 0,
                label: a(s)("enablePrefix")
              }, {
                default: t(() => [
                  e(g, {
                    checked: f.value,
                    "onUpdate:checked": h[1] || (h[1] = (q) => f.value = q)
                  }, null, 8, [
                    "checked"
                  ])
                ]),
                _: 1
              }, 8, [
                "label"
              ])) : ee("", true),
              e(x, {
                label: a(s)("address")
              }, {
                default: t(() => [
                  e(A, null, {
                    default: t(() => [
                      f.value && a(l).prefix ? (I(), Y(L, {
                        key: 0
                      }, {
                        default: t(() => [
                          M(b(a(l).prefix), 1)
                        ]),
                        _: 1
                      })) : ee("", true),
                      e(w, {
                        value: o.value,
                        "onUpdate:value": h[2] || (h[2] = (q) => o.value = q)
                      }, null, 8, [
                        "value"
                      ]),
                      e(L, null, {
                        default: t(() => h[4] || (h[4] = [
                          M("@")
                        ])),
                        _: 1,
                        __: [
                          4
                        ]
                      }),
                      e(C, {
                        value: u.value,
                        "onUpdate:value": h[3] || (h[3] = (q) => u.value = q),
                        "consistent-menu-width": false,
                        options: a(l).domains
                      }, null, 8, [
                        "value",
                        "options"
                      ])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, [
                "label"
              ]),
              e(O, {
                onClick: m,
                type: "primary",
                block: "",
                loading: a(i)
              }, {
                default: t(() => [
                  M(b(a(s)("creatNewEmail")), 1)
                ]),
                _: 1
              }, 8, [
                "loading"
              ])
            ]),
            _: 1
          })
        ]);
      };
    }
  };
  Ba = K(za, [
    [
      "__scopeId",
      "data-v-e2776dee"
    ]
  ]);
  Ra = {
    class: "center"
  };
  Na = {
    __name: "AccountSettings",
    setup(d) {
      const { loading: i } = ne(), l = G(), { t: n } = H({
        messages: {
          en: {
            tip: "You can manually input the following multiple select input and enter",
            save: "Save",
            successTip: "Save Success",
            address_block_list: "Address Block Keywords for Users(Admin can skip)",
            address_block_list_placeholder: "Please enter the keywords you want to block",
            send_address_block_list: "Address Block Keywords for send email",
            noLimitSendAddressList: "No Balance Limit Send Address List",
            verified_address_list: "Verified Address List(Can send email by cf internal api)",
            fromBlockList: "Block Keywords for receive email"
          },
          zh: {
            tip: "\u60A8\u53EF\u4EE5\u624B\u52A8\u8F93\u5165\u4EE5\u4E0B\u591A\u9009\u8F93\u5165\u6846, \u56DE\u8F66\u589E\u52A0",
            save: "\u4FDD\u5B58",
            successTip: "\u4FDD\u5B58\u6210\u529F",
            address_block_list: "\u90AE\u4EF6\u5730\u5740\u5C4F\u853D\u5173\u952E\u8BCD(\u7BA1\u7406\u5458\u53EF\u8DF3\u8FC7\u68C0\u67E5)",
            address_block_list_placeholder: "\u8BF7\u8F93\u5165\u60A8\u60F3\u8981\u5C4F\u853D\u7684\u5173\u952E\u8BCD",
            send_address_block_list: "\u53D1\u9001\u90AE\u4EF6\u5730\u5740\u5C4F\u853D\u5173\u952E\u8BCD",
            noLimitSendAddressList: "\u65E0\u4F59\u989D\u9650\u5236\u53D1\u9001\u5730\u5740\u5217\u8868",
            verified_address_list: "\u5DF2\u9A8C\u8BC1\u5730\u5740\u5217\u8868(\u53EF\u901A\u8FC7 cf \u5185\u90E8 api \u53D1\u9001\u90AE\u4EF6)",
            fromBlockList: "\u63A5\u6536\u90AE\u4EF6\u5730\u5740\u5C4F\u853D\u5173\u952E\u8BCD"
          }
        }
      }), s = y([]), f = y([]), o = y([]), u = y([]), r = y([]), v = async () => {
        try {
          const c = await $.fetch("/admin/account_settings");
          s.value = c.blockList || [], f.value = c.sendBlockList || [], u.value = c.verifiedAddressList || [], r.value = c.fromBlockList || [], o.value = c.noLimitSendAddressList || [];
        } catch (c) {
          l.error(c.message || "error");
        }
      }, m = async () => {
        try {
          await $.fetch("/admin/account_settings", {
            method: "POST",
            body: JSON.stringify({
              blockList: s.value || [],
              sendBlockList: f.value || [],
              verifiedAddressList: u.value || [],
              fromBlockList: r.value || [],
              noLimitSendAddressList: o.value || []
            })
          }), l.success(n("successTip"));
        } catch (c) {
          l.error(c.message || "error");
        }
      };
      return X(async () => {
        await v();
      }), (c, h) => {
        const k = Te, S = fe, g = ce, x = z, L = le;
        return I(), E("div", Ra, [
          e(L, {
            bordered: false,
            embedded: "",
            style: {
              "max-width": "600px"
            }
          }, {
            default: t(() => [
              e(k, {
                "show-icon": false,
                type: "warning",
                style: {
                  "margin-bottom": "10px"
                }
              }, {
                default: t(() => [
                  M(b(a(n)("tip")), 1)
                ]),
                _: 1
              }),
              e(g, {
                label: a(n)("address_block_list")
              }, {
                default: t(() => [
                  e(S, {
                    value: s.value,
                    "onUpdate:value": h[0] || (h[0] = (w) => s.value = w),
                    filterable: "",
                    multiple: "",
                    tag: "",
                    placeholder: a(n)("address_block_list_placeholder")
                  }, null, 8, [
                    "value",
                    "placeholder"
                  ])
                ]),
                _: 1
              }, 8, [
                "label"
              ]),
              e(g, {
                label: a(n)("send_address_block_list")
              }, {
                default: t(() => [
                  e(S, {
                    value: f.value,
                    "onUpdate:value": h[1] || (h[1] = (w) => f.value = w),
                    filterable: "",
                    multiple: "",
                    tag: "",
                    placeholder: a(n)("address_block_list_placeholder")
                  }, null, 8, [
                    "value",
                    "placeholder"
                  ])
                ]),
                _: 1
              }, 8, [
                "label"
              ]),
              e(g, {
                label: a(n)("noLimitSendAddressList")
              }, {
                default: t(() => [
                  e(S, {
                    value: o.value,
                    "onUpdate:value": h[2] || (h[2] = (w) => o.value = w),
                    filterable: "",
                    multiple: "",
                    tag: "",
                    placeholder: a(n)("noLimitSendAddressList")
                  }, null, 8, [
                    "value",
                    "placeholder"
                  ])
                ]),
                _: 1
              }, 8, [
                "label"
              ]),
              e(g, {
                label: a(n)("verified_address_list")
              }, {
                default: t(() => [
                  e(S, {
                    value: u.value,
                    "onUpdate:value": h[3] || (h[3] = (w) => u.value = w),
                    filterable: "",
                    multiple: "",
                    tag: "",
                    placeholder: a(n)("verified_address_list")
                  }, null, 8, [
                    "value",
                    "placeholder"
                  ])
                ]),
                _: 1
              }, 8, [
                "label"
              ]),
              e(g, {
                label: a(n)("fromBlockList")
              }, {
                default: t(() => [
                  e(S, {
                    value: r.value,
                    "onUpdate:value": h[4] || (h[4] = (w) => r.value = w),
                    filterable: "",
                    multiple: "",
                    tag: "",
                    placeholder: a(n)("fromBlockList")
                  }, null, 8, [
                    "value",
                    "placeholder"
                  ])
                ]),
                _: 1
              }, 8, [
                "label"
              ]),
              e(x, {
                onClick: m,
                type: "primary",
                block: "",
                loading: a(i)
              }, {
                default: t(() => [
                  M(b(a(n)("save")), 1)
                ]),
                _: 1
              }, 8, [
                "loading"
              ])
            ]),
            _: 1
          })
        ]);
      };
    }
  };
  lt = K(Na, [
    [
      "__scopeId",
      "data-v-96d55c19"
    ]
  ]);
  Va = {
    style: {
      overflow: "auto"
    }
  };
  Ea = {
    __name: "UserAddressManagement",
    props: {
      user_id: {
        type: Number,
        required: true
      }
    },
    setup(d) {
      const i = d, l = G(), { locale: n, t: s } = H({
        messages: {
          en: {
            success: "success",
            name: "Name",
            mail_count: "Mail Count",
            send_count: "Send Count"
          },
          zh: {
            success: "\u6210\u529F",
            name: "\u540D\u79F0",
            mail_count: "\u90AE\u4EF6\u6570\u91CF",
            send_count: "\u53D1\u9001\u6570\u91CF"
          }
        }
      }), f = y([]), o = async () => {
        try {
          const { results: r } = await $.fetch(`/admin/users/bind_address/${i.user_id}`);
          f.value = r;
        } catch (r) {
          console.log(r), l.error(r.message || "error");
        }
      }, u = [
        {
          title: s("name"),
          key: "name"
        },
        {
          title: s("mail_count"),
          key: "mail_count",
          render(r) {
            return T(Le, {
              value: r.mail_count,
              "show-zero": true,
              max: 99,
              type: "success"
            });
          }
        },
        {
          title: s("send_count"),
          key: "send_count",
          render(r) {
            return T(Le, {
              value: r.send_count,
              "show-zero": true,
              max: 99,
              type: "success"
            });
          }
        }
      ];
      return X(async () => {
        await o();
      }), (r, v) => {
        const m = Pe;
        return I(), E("div", Va, [
          e(m, {
            columns: u,
            data: f.value,
            bordered: false,
            embedded: ""
          }, null, 8, [
            "data"
          ])
        ]);
      };
    }
  };
  qa = K(Ea, [
    [
      "__scopeId",
      "data-v-b33d0779"
    ]
  ]);
  Fa = {
    style: {
      "margin-top": "10px"
    }
  };
  ja = {
    style: {
      overflow: "auto"
    }
  };
  Wa = {
    style: {
      display: "inline-block"
    }
  };
  Ka = {
    __name: "UserManagement",
    setup(d) {
      const { loading: i, openSettings: l } = ne(), n = G(), { t: s } = H({
        messages: {
          en: {
            success: "Success",
            user_email: "User Email",
            role: "Role",
            address_count: "Address Count",
            created_at: "Created At",
            actions: "Actions",
            query: "Query",
            itemCount: "itemCount",
            deleteUser: "Delete User",
            delete: "Delete",
            deleteUserTip: "Are you sure you want to delete this user?",
            resetPassword: "Reset Password",
            pleaseInput: "Please input complete information",
            createUser: "Create User",
            email: "Email",
            password: "Password",
            changeRole: "Change Role",
            prefix: "Prefix",
            domains: "Domains",
            roleDonotExist: "Current Role does not exist",
            userAddressManagement: "Address Management"
          },
          zh: {
            success: "\u6210\u529F",
            user_email: "\u7528\u6237\u90AE\u7BB1",
            role: "\u89D2\u8272",
            address_count: "\u5730\u5740\u6570\u91CF",
            created_at: "\u521B\u5EFA\u65F6\u95F4",
            actions: "\u64CD\u4F5C",
            query: "\u67E5\u8BE2",
            itemCount: "\u603B\u6570",
            deleteUser: "\u5220\u9664\u7528\u6237",
            delete: "\u5220\u9664",
            deleteUserTip: "\u786E\u5B9A\u8981\u5220\u9664\u6B64\u7528\u6237\u5417\uFF1F",
            resetPassword: "\u91CD\u7F6E\u5BC6\u7801",
            pleaseInput: "\u8BF7\u8F93\u5165\u5B8C\u6574\u4FE1\u606F",
            createUser: "\u521B\u5EFA\u7528\u6237",
            email: "\u90AE\u7BB1",
            password: "\u5BC6\u7801",
            changeRole: "\u66F4\u6539\u89D2\u8272",
            prefix: "\u524D\u7F00",
            domains: "\u57DF\u540D",
            roleDonotExist: "\u5F53\u524D\u89D2\u8272\u4E0D\u5B58\u5728",
            userAddressManagement: "\u5730\u5740\u7BA1\u7406"
          }
        }
      }), f = y([]), o = y(0), u = y(1), r = y(20), v = y(""), m = y(false), c = y(""), h = y(false), k = y(0), S = y(false), g = y({
        email: "",
        password: ""
      }), x = y(false), L = y(false), w = y([]), C = y(""), A = Ue(() => w.value.map((U) => ({
        label: U.role,
        value: U.role
      }))), O = async () => {
        try {
          const U = await $.fetch("/admin/user_roles");
          w.value = U;
        } catch (U) {
          console.log(U), n.error(U.message || "error");
        }
      }, q = async () => {
        try {
          v.value = v.value.trim();
          const { results: U, count: _ } = await $.fetch(`/admin/users?limit=${r.value}&offset=${(u.value - 1) * r.value}` + (v.value ? `&query=${v.value}` : ""));
          f.value = U, _ > 0 && (o.value = _);
        } catch (U) {
          console.log(U), n.error(U.message || "error");
        }
      }, J = async () => {
        if (!c.value) {
          n.error(s("pleaseInput"));
          return;
        }
        try {
          await $.fetch(`/admin/users/${k.value}/reset_password`, {
            method: "POST",
            body: JSON.stringify({
              password: await Ze(c.value)
            })
          }), n.success(s("success")), m.value = false;
        } catch (U) {
          console.log(U), n.error(U.message || "error");
        }
      }, Z = async () => {
        if (!g.value.email || !g.value.password) {
          n.error(s("pleaseInput"));
          return;
        }
        try {
          await $.fetch("/admin/users", {
            method: "POST",
            body: JSON.stringify({
              email: g.value.email,
              password: await Ze(g.value.password)
            })
          }), n.success(s("success")), await q(), S.value = false;
        } catch (U) {
          console.log(U), n.error(U.message || "error");
        }
      }, W = async () => {
        try {
          await $.fetch(`/admin/users/${k.value}`, {
            method: "DELETE"
          }), n.success(s("success")), h.value = false;
        } catch (U) {
          console.log(U), n.error(U.message || "error");
        }
      }, se = async () => {
        try {
          await $.fetch("/admin/user_roles", {
            method: "POST",
            body: JSON.stringify({
              user_id: k.value,
              role_text: C.value
            })
          }), n.success(s("success")), x.value = false, await q();
        } catch (U) {
          console.log(U), n.error(U.message || "error");
        }
      }, V = [
        {
          title: "ID",
          key: "id"
        },
        {
          title: s("user_email"),
          key: "user_email"
        },
        {
          title: s("role"),
          key: "role_text",
          render(U) {
            return U.role_text ? T(jt, {
              bordered: false,
              type: "info"
            }, {
              default: () => U.role_text
            }) : null;
          }
        },
        {
          title: s("address_count"),
          key: "address_count",
          render(U) {
            return T(z, {
              text: true,
              onClick: () => {
                U.address_count <= 0 || (k.value = U.id, L.value = true);
              }
            }, {
              icon: () => T(Le, {
                value: U.address_count,
                "show-zero": true,
                max: 99,
                type: "success"
              }),
              default: () => U.address_count > 0 ? s("userAddressManagement") : ""
            });
          }
        },
        {
          title: s("created_at"),
          key: "created_at"
        },
        {
          title: s("actions"),
          key: "actions",
          render(U) {
            return T("div", [
              T(pt, {
                mode: "horizontal",
                options: [
                  {
                    label: s("actions"),
                    icon: () => T(_t),
                    key: "action",
                    children: [
                      {
                        label: () => T(z, {
                          text: true,
                          onClick: () => {
                            k.value = U.id, L.value = true;
                          }
                        }, {
                          default: () => s("userAddressManagement")
                        }),
                        show: U.address_count > 0
                      },
                      {
                        label: () => T(z, {
                          text: true,
                          onClick: () => {
                            k.value = U.id, C.value = U.role_text, x.value = true;
                          }
                        }, {
                          default: () => s("changeRole")
                        })
                      },
                      {
                        label: () => T(z, {
                          text: true,
                          onClick: () => {
                            k.value = U.id, c.value = "", m.value = true;
                          }
                        }, {
                          default: () => s("resetPassword")
                        })
                      },
                      {
                        label: () => T(z, {
                          text: true,
                          onClick: () => {
                            k.value = U.id, g.value.email = "", g.value.password = "", h.value = true;
                          }
                        }, {
                          default: () => s("delete")
                        })
                      }
                    ]
                  }
                ]
              })
            ]);
          }
        }
      ], F = (U) => {
        var _a2;
        const _ = (_a2 = w.value.find((Q) => Q.role === U)) == null ? void 0 : _a2.prefix;
        return _ ?? l.value.prefix;
      }, Ce = (U) => {
        var _a2;
        const _ = (_a2 = w.value.find((Q) => Q.role === U)) == null ? void 0 : _a2.domains;
        return _ == null || _.length == 0 ? l.value.defaultDomains : _;
      }, Ae = Ue(() => C.value && !w.value.some((U) => U.role === C.value));
      return Oe([
        u,
        r
      ], async () => {
        await q();
      }), X(async () => {
        await O(), await q();
      }), (U, _) => {
        const Q = ae, B = ce, Be = ze, ue = xe, Re = Te, Ne = fe, me = ie, pe = We, ve = Pe;
        return I(), E("div", Fa, [
          e(ue, {
            show: S.value,
            "onUpdate:show": _[2] || (_[2] = (R) => S.value = R),
            preset: "dialog",
            title: a(s)("createUser")
          }, {
            action: t(() => [
              e(a(z), {
                loading: a(i),
                onClick: Z,
                size: "small",
                tertiary: "",
                type: "primary"
              }, {
                default: t(() => [
                  M(b(a(s)("createUser")), 1)
                ]),
                _: 1
              }, 8, [
                "loading"
              ])
            ]),
            default: t(() => [
              e(Be, null, {
                default: t(() => [
                  e(B, {
                    label: a(s)("email"),
                    required: ""
                  }, {
                    default: t(() => [
                      e(Q, {
                        value: g.value.email,
                        "onUpdate:value": _[0] || (_[0] = (R) => g.value.email = R)
                      }, null, 8, [
                        "value"
                      ])
                    ]),
                    _: 1
                  }, 8, [
                    "label"
                  ]),
                  e(B, {
                    label: a(s)("password"),
                    required: ""
                  }, {
                    default: t(() => [
                      e(Q, {
                        value: g.value.password,
                        "onUpdate:value": _[1] || (_[1] = (R) => g.value.password = R),
                        type: "password",
                        "show-password-on": "click"
                      }, null, 8, [
                        "value"
                      ])
                    ]),
                    _: 1
                  }, 8, [
                    "label"
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, [
            "show",
            "title"
          ]),
          e(ue, {
            show: m.value,
            "onUpdate:show": _[4] || (_[4] = (R) => m.value = R),
            preset: "dialog",
            title: a(s)("resetPassword")
          }, {
            action: t(() => [
              e(a(z), {
                loading: a(i),
                onClick: J,
                size: "small",
                tertiary: "",
                type: "primary"
              }, {
                default: t(() => [
                  M(b(a(s)("resetPassword")), 1)
                ]),
                _: 1
              }, 8, [
                "loading"
              ])
            ]),
            default: t(() => [
              e(B, {
                label: a(s)("password"),
                required: ""
              }, {
                default: t(() => [
                  e(Q, {
                    value: c.value,
                    "onUpdate:value": _[3] || (_[3] = (R) => c.value = R),
                    type: "password",
                    "show-password-on": "click"
                  }, null, 8, [
                    "value"
                  ])
                ]),
                _: 1
              }, 8, [
                "label"
              ])
            ]),
            _: 1
          }, 8, [
            "show",
            "title"
          ]),
          e(ue, {
            show: h.value,
            "onUpdate:show": _[5] || (_[5] = (R) => h.value = R),
            preset: "dialog",
            title: a(s)("deleteUser")
          }, {
            action: t(() => [
              e(a(z), {
                loading: a(i),
                onClick: W,
                size: "small",
                tertiary: "",
                type: "error"
              }, {
                default: t(() => [
                  M(b(a(s)("deleteUser")), 1)
                ]),
                _: 1
              }, 8, [
                "loading"
              ])
            ]),
            default: t(() => [
              N("p", null, b(a(s)("deleteUserTip")), 1)
            ]),
            _: 1
          }, 8, [
            "show",
            "title"
          ]),
          e(ue, {
            show: x.value,
            "onUpdate:show": _[7] || (_[7] = (R) => x.value = R),
            preset: "dialog",
            title: a(s)("changeRole")
          }, {
            action: t(() => [
              e(a(z), {
                loading: a(i),
                onClick: se,
                size: "small",
                tertiary: "",
                type: "primary"
              }, {
                default: t(() => [
                  M(b(a(s)("changeRole")), 1)
                ]),
                _: 1
              }, 8, [
                "loading"
              ])
            ]),
            default: t(() => [
              Ae.value ? (I(), Y(Re, {
                key: 0,
                type: "error",
                bordered: false
              }, {
                default: t(() => [
                  N("span", null, b(a(s)("roleDonotExist")), 1)
                ]),
                _: 1
              })) : ee("", true),
              N("p", null, b(a(s)("prefix") + ": " + F(C.value)), 1),
              N("p", null, b(a(s)("domains") + ": " + JSON.stringify(Ce(C.value))), 1),
              e(Ne, {
                clearable: "",
                value: C.value,
                "onUpdate:value": _[6] || (_[6] = (R) => C.value = R),
                options: A.value
              }, null, 8, [
                "value",
                "options"
              ])
            ]),
            _: 1
          }, 8, [
            "show",
            "title"
          ]),
          e(ue, {
            show: L.value,
            "onUpdate:show": _[8] || (_[8] = (R) => L.value = R),
            preset: "card",
            title: a(s)("userAddressManagement")
          }, {
            default: t(() => [
              e(qa, {
                user_id: k.value
              }, null, 8, [
                "user_id"
              ])
            ]),
            _: 1
          }, 8, [
            "show",
            "title"
          ]),
          e(me, null, {
            default: t(() => [
              e(Q, {
                value: v.value,
                "onUpdate:value": _[9] || (_[9] = (R) => v.value = R),
                onKeydown: we(q, [
                  "enter"
                ])
              }, null, 8, [
                "value"
              ]),
              e(a(z), {
                onClick: q,
                type: "primary",
                tertiary: ""
              }, {
                default: t(() => [
                  M(b(a(s)("query")), 1)
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          N("div", ja, [
            N("div", Wa, [
              e(pe, {
                page: u.value,
                "onUpdate:page": _[11] || (_[11] = (R) => u.value = R),
                "page-size": r.value,
                "onUpdate:pageSize": _[12] || (_[12] = (R) => r.value = R),
                "item-count": o.value,
                "page-sizes": [
                  20,
                  50,
                  100
                ],
                "show-size-picker": ""
              }, {
                prefix: t(({ itemCount: R }) => [
                  M(b(a(s)("itemCount")) + ": " + b(R), 1)
                ]),
                suffix: t(() => [
                  e(a(z), {
                    onClick: _[10] || (_[10] = (R) => S.value = true),
                    size: "small",
                    tertiary: "",
                    type: "primary",
                    style: {
                      "margin-left": "10px"
                    }
                  }, {
                    default: t(() => [
                      M(b(a(s)("createUser")), 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, [
                "page",
                "page-size",
                "item-count"
              ])
            ]),
            e(ve, {
              columns: V,
              data: f.value,
              bordered: false,
              embedded: ""
            }, null, 8, [
              "data"
            ])
          ])
        ]);
      };
    }
  };
  Ha = K(Ka, [
    [
      "__scopeId",
      "data-v-9bf893ed"
    ]
  ]);
  Ja = {
    class: "center"
  };
  Qa = {
    __name: "UserSettings",
    setup(d) {
      const { loading: i } = ne(), l = G(), { t: n } = H({
        messages: {
          en: {
            save: "Save",
            successTip: "Save Success",
            enable: "Enable",
            enableUserRegister: "Allow User Register",
            enableMailVerify: "Enable Mail Verify (Send address must be an address in the system with a balance and can send mail normally)",
            verifyMailSender: "Verify Mail Sender",
            enableMailAllowList: "Enable Mail Address Allow List(Manually enterable)",
            mailAllowList: "Mail Address Allow List",
            maxAddressCount: "Maximum number of email addresses that can be binded"
          },
          zh: {
            save: "\u4FDD\u5B58",
            successTip: "\u4FDD\u5B58\u6210\u529F",
            enable: "\u542F\u7528",
            enableUserRegister: "\u5141\u8BB8\u7528\u6237\u6CE8\u518C",
            enableMailVerify: "\u542F\u7528\u90AE\u4EF6\u9A8C\u8BC1(\u53D1\u9001\u5730\u5740\u5FC5\u987B\u662F\u7CFB\u7EDF\u4E2D\u80FD\u6709\u4F59\u989D\u4E14\u80FD\u6B63\u5E38\u53D1\u9001\u90AE\u4EF6\u7684\u5730\u5740)",
            verifyMailSender: "\u9A8C\u8BC1\u90AE\u4EF6\u53D1\u9001\u5730\u5740",
            enableMailAllowList: "\u542F\u7528\u90AE\u4EF6\u5730\u5740\u767D\u540D\u5355(\u53EF\u624B\u52A8\u8F93\u5165, \u56DE\u8F66\u589E\u52A0)",
            mailAllowList: "\u90AE\u4EF6\u5730\u5740\u767D\u540D\u5355",
            maxAddressCount: "\u53EF\u7ED1\u5B9A\u6700\u5927\u90AE\u7BB1\u5730\u5740\u6570\u91CF"
          }
        }
      }), s = [
        "gmail.com",
        "163.com",
        "126.com",
        "qq.com",
        "outlook.com",
        "hotmail.com",
        "icloud.com",
        "yahoo.com",
        "foxmail.com"
      ], f = s.map((v) => ({
        label: v,
        value: v
      })), o = y({
        enable: false,
        enableMailVerify: false,
        verifyMailSender: "",
        enableMailAllowList: false,
        mailAllowList: s,
        maxAddressCount: 5
      }), u = async () => {
        try {
          const v = await $.fetch("/admin/user_settings");
          Object.assign(o.value, v);
        } catch (v) {
          l.error(v.message || "error");
        }
      }, r = async () => {
        try {
          await $.fetch("/admin/user_settings", {
            method: "POST",
            body: JSON.stringify(o.value)
          }), l.success(n("successTip"));
        } catch (v) {
          l.error(v.message || "error");
        }
      };
      return X(async () => {
        await u();
      }), (v, m) => {
        const c = ke, h = ce, k = ae, S = ie, g = fe, x = He, L = z, w = ze, C = le;
        return I(), E("div", Ja, [
          e(C, {
            bordered: false,
            embedded: "",
            style: {
              "max-width": "600px"
            }
          }, {
            default: t(() => [
              e(w, {
                model: o.value
              }, {
                default: t(() => [
                  e(h, {
                    label: a(n)("enableUserRegister")
                  }, {
                    default: t(() => [
                      e(c, {
                        checked: o.value.enable,
                        "onUpdate:checked": m[0] || (m[0] = (A) => o.value.enable = A)
                      }, null, 8, [
                        "checked"
                      ])
                    ]),
                    _: 1
                  }, 8, [
                    "label"
                  ]),
                  e(h, {
                    label: a(n)("enableMailVerify")
                  }, {
                    default: t(() => [
                      e(S, null, {
                        default: t(() => [
                          e(c, {
                            checked: o.value.enableMailVerify,
                            "onUpdate:checked": m[1] || (m[1] = (A) => o.value.enableMailVerify = A),
                            style: {
                              width: "20%"
                            }
                          }, {
                            default: t(() => [
                              M(b(a(n)("enable")), 1)
                            ]),
                            _: 1
                          }, 8, [
                            "checked"
                          ]),
                          o.value.enableMailVerify ? (I(), Y(k, {
                            key: 0,
                            value: o.value.verifyMailSender,
                            "onUpdate:value": m[2] || (m[2] = (A) => o.value.verifyMailSender = A),
                            style: {
                              width: "80%"
                            },
                            placeholder: a(n)("verifyMailSender")
                          }, null, 8, [
                            "value",
                            "placeholder"
                          ])) : ee("", true)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, [
                    "label"
                  ]),
                  e(h, {
                    label: a(n)("enableMailAllowList")
                  }, {
                    default: t(() => [
                      e(S, null, {
                        default: t(() => [
                          e(c, {
                            checked: o.value.enableMailAllowList,
                            "onUpdate:checked": m[3] || (m[3] = (A) => o.value.enableMailAllowList = A),
                            style: {
                              width: "20%"
                            }
                          }, {
                            default: t(() => [
                              M(b(a(n)("enable")), 1)
                            ]),
                            _: 1
                          }, 8, [
                            "checked"
                          ]),
                          o.value.enableMailAllowList ? (I(), Y(g, {
                            key: 0,
                            value: o.value.mailAllowList,
                            "onUpdate:value": m[4] || (m[4] = (A) => o.value.mailAllowList = A),
                            filterable: "",
                            multiple: "",
                            tag: "",
                            style: {
                              width: "80%"
                            },
                            options: a(f),
                            placeholder: a(n)("mailAllowList")
                          }, null, 8, [
                            "value",
                            "options",
                            "placeholder"
                          ])) : ee("", true)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, [
                    "label"
                  ]),
                  e(h, {
                    label: a(n)("maxAddressCount")
                  }, {
                    default: t(() => [
                      e(S, null, {
                        default: t(() => [
                          e(x, {
                            value: o.value.maxAddressCount,
                            "onUpdate:value": m[5] || (m[5] = (A) => o.value.maxAddressCount = A),
                            placeholder: a(n)("maxAddressCount")
                          }, null, 8, [
                            "value",
                            "placeholder"
                          ])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, [
                    "label"
                  ]),
                  e(L, {
                    onClick: r,
                    type: "primary",
                    block: "",
                    loading: a(i)
                  }, {
                    default: t(() => [
                      M(b(a(n)("save")), 1)
                    ]),
                    _: 1
                  }, 8, [
                    "loading"
                  ])
                ]),
                _: 1
              }, 8, [
                "model"
              ])
            ]),
            _: 1
          })
        ]);
      };
    }
  };
  st = K(Qa, [
    [
      "__scopeId",
      "data-v-80d82720"
    ]
  ]);
  Ga = [
    "gmail.com",
    "163.com",
    "126.com",
    "qq.com",
    "outlook.com",
    "hotmail.com",
    "icloud.com",
    "yahoo.com",
    "foxmail.com"
  ];
  ot = {
    COMMOM_MAIL: Ga
  };
  Xa = {
    class: "center"
  };
  Ya = te({
    __name: "UserOauth2Settings",
    setup(d) {
      const { loading: i } = ne(), l = G(), { t: n } = H({
        messages: {
          en: {
            save: "Save",
            delete: "Delete",
            successTip: "Save Success",
            enable: "Enable",
            enableMailAllowList: "Enable Mail Address Allow List(Manually enterable)",
            mailAllowList: "Mail Address Allow List",
            addOauth2: "Add Oauth2",
            name: "Name",
            oauth2Type: "Oauth2 Type",
            tip: "Third-party login will automatically use the user's email to register an account (the same email will be regarded as the same account), this account is the same as the registered account, and you can also set the password through the forget password"
          },
          zh: {
            save: "\u4FDD\u5B58",
            delete: "\u5220\u9664",
            successTip: "\u4FDD\u5B58\u6210\u529F",
            enable: "\u542F\u7528",
            enableMailAllowList: "\u542F\u7528\u90AE\u4EF6\u5730\u5740\u767D\u540D\u5355(\u53EF\u624B\u52A8\u8F93\u5165, \u56DE\u8F66\u589E\u52A0)",
            mailAllowList: "\u90AE\u4EF6\u5730\u5740\u767D\u540D\u5355",
            addOauth2: "\u6DFB\u52A0 Oauth2",
            name: "\u540D\u79F0",
            oauth2Type: "Oauth2 \u7C7B\u578B",
            tip: "\u7B2C\u4E09\u65B9\u767B\u5F55\u4F1A\u81EA\u52A8\u4F7F\u7528\u7528\u6237\u90AE\u7BB1\u6CE8\u518C\u8D26\u53F7(\u90AE\u7BB1\u76F8\u540C\u5C06\u89C6\u4E3A\u540C\u4E00\u8D26\u53F7), \u6B64\u8D26\u53F7\u548C\u6CE8\u518C\u7684\u8D26\u53F7\u76F8\u540C, \u4E5F\u53EF\u4EE5\u901A\u8FC7\u5FD8\u8BB0\u5BC6\u7801\u8BBE\u7F6E\u5BC6\u7801"
          }
        }
      }), s = ot.COMMOM_MAIL.map((k) => ({
        label: k,
        value: k
      })), f = y([]), o = y(false), u = y(""), r = y("custom"), v = async () => {
        try {
          const k = await $.fetch("/admin/user_oauth2_settings");
          Object.assign(f.value, k);
        } catch (k) {
          l.error(k.message || "error");
        }
      }, m = async () => {
        try {
          await $.fetch("/admin/user_oauth2_settings", {
            method: "POST",
            body: JSON.stringify(f.value)
          }), l.success(n("successTip"));
        } catch (k) {
          l.error(k.message || "error");
        }
      }, c = () => {
        const k = () => {
          switch (r.value) {
            case "github":
              return "https://github.com/login/oauth/authorize";
            case "authentik":
              return "https://youdomain/application/o/authorize/";
            default:
              return "";
          }
        }, S = () => {
          switch (r.value) {
            case "github":
              return "https://github.com/login/oauth/access_token";
            case "authentik":
              return "https://youdomain/application/o/token/";
            default:
              return "";
          }
        }, g = () => {
          switch (r.value) {
            case "github":
              return "json";
            case "authentik":
              return "urlencoded";
            default:
              return "";
          }
        }, x = () => {
          switch (r.value) {
            case "github":
              return "https://api.github.com/user";
            case "authentik":
              return "https://youdomain/application/o/userinfo/";
            default:
              return "";
          }
        }, L = () => {
          switch (r.value) {
            case "github":
              return "email";
            case "authentik":
              return "email";
            default:
              return "";
          }
        }, w = () => {
          switch (r.value) {
            case "github":
              return "user:email";
            case "authentik":
              return "email openid";
            default:
              return "";
          }
        };
        f.value.push({
          name: u.value,
          clientID: "",
          clientSecret: "",
          authorizationURL: k(),
          accessTokenURL: S(),
          accessTokenFormat: g(),
          userInfoURL: x(),
          userEmailKey: L(),
          redirectURL: `${window.location.origin}/user/oauth2/callback`,
          logoutURL: "",
          scope: w(),
          enableMailAllowList: false,
          mailAllowList: ot.COMMOM_MAIL
        }), u.value = "", o.value = false;
      }, h = [
        {
          label: "json",
          value: "json"
        },
        {
          label: "urlencoded",
          value: "urlencoded"
        }
      ];
      return X(async () => {
        await v();
      }), (k, S) => {
        const g = ae, x = ce, L = Kt, w = Wt, C = ze, A = z, O = xe, q = Te, J = ft, Z = Ht, W = ct, se = fe, V = ke, F = ie, Ce = Xt, Ae = Jt, U = le;
        return I(), E("div", Xa, [
          e(O, {
            show: o.value,
            "onUpdate:show": S[2] || (S[2] = (_) => o.value = _),
            preset: "dialog",
            title: a(n)("addOauth2")
          }, {
            action: t(() => [
              e(A, {
                loading: a(i),
                onClick: c,
                size: "small",
                tertiary: "",
                type: "primary"
              }, {
                default: t(() => [
                  M(b(a(n)("addOauth2")), 1)
                ]),
                _: 1
              }, 8, [
                "loading"
              ])
            ]),
            default: t(() => [
              e(C, null, {
                default: t(() => [
                  e(x, {
                    label: a(n)("name"),
                    required: ""
                  }, {
                    default: t(() => [
                      e(g, {
                        value: u.value,
                        "onUpdate:value": S[0] || (S[0] = (_) => u.value = _)
                      }, null, 8, [
                        "value"
                      ])
                    ]),
                    _: 1
                  }, 8, [
                    "label"
                  ]),
                  e(x, {
                    label: a(n)("oauth2Type"),
                    required: ""
                  }, {
                    default: t(() => [
                      e(w, {
                        value: r.value,
                        "onUpdate:value": S[1] || (S[1] = (_) => r.value = _)
                      }, {
                        default: t(() => [
                          e(L, {
                            value: "github",
                            label: "Github"
                          }),
                          e(L, {
                            value: "authentik",
                            label: "Authentik"
                          }),
                          e(L, {
                            value: "custom",
                            label: "Custom"
                          })
                        ]),
                        _: 1
                      }, 8, [
                        "value"
                      ])
                    ]),
                    _: 1
                  }, 8, [
                    "label"
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, [
            "show",
            "title"
          ]),
          e(U, {
            bordered: false,
            embedded: "",
            style: {
              "max-width": "600px"
            }
          }, {
            default: t(() => [
              e(q, {
                "show-icon": false,
                type: "warning",
                closable: "",
                style: {
                  "margin-bottom": "10px"
                }
              }, {
                default: t(() => [
                  M(b(a(n)("tip")), 1)
                ]),
                _: 1
              }),
              e(J, {
                justify: "end"
              }, {
                default: t(() => [
                  e(A, {
                    onClick: S[3] || (S[3] = (_) => o.value = true),
                    secondary: "",
                    loading: a(i)
                  }, {
                    default: t(() => [
                      M(b(a(n)("addOauth2")), 1)
                    ]),
                    _: 1
                  }, 8, [
                    "loading"
                  ]),
                  e(A, {
                    onClick: m,
                    type: "primary",
                    loading: a(i)
                  }, {
                    default: t(() => [
                      M(b(a(n)("save")), 1)
                    ]),
                    _: 1
                  }, 8, [
                    "loading"
                  ])
                ]),
                _: 1
              }),
              e(Z),
              e(Ae, {
                "default-expanded-names": "1",
                accordion: "",
                "trigger-areas": [
                  "main",
                  "arrow"
                ]
              }, {
                default: t(() => [
                  (I(true), E(Qt, null, Gt(f.value, (_, Q) => (I(), Y(Ce, {
                    key: Q,
                    title: _.name
                  }, {
                    "header-extra": t(() => [
                      e(W, {
                        onPositiveClick: (B) => f.value.splice(Q, 1)
                      }, {
                        trigger: t(() => [
                          e(A, {
                            tertiary: "",
                            type: "error"
                          }, {
                            default: t(() => [
                              M(b(a(n)("delete")), 1)
                            ]),
                            _: 1
                          })
                        ]),
                        default: t(() => [
                          M(" " + b(a(n)("delete")), 1)
                        ]),
                        _: 2
                      }, 1032, [
                        "onPositiveClick"
                      ])
                    ]),
                    default: t(() => [
                      e(C, {
                        model: _
                      }, {
                        default: t(() => [
                          e(x, {
                            label: a(n)("name"),
                            required: ""
                          }, {
                            default: t(() => [
                              e(g, {
                                value: _.name,
                                "onUpdate:value": (B) => _.name = B
                              }, null, 8, [
                                "value",
                                "onUpdate:value"
                              ])
                            ]),
                            _: 2
                          }, 1032, [
                            "label"
                          ]),
                          e(x, {
                            label: "Client ID",
                            required: ""
                          }, {
                            default: t(() => [
                              e(g, {
                                value: _.clientID,
                                "onUpdate:value": (B) => _.clientID = B
                              }, null, 8, [
                                "value",
                                "onUpdate:value"
                              ])
                            ]),
                            _: 2
                          }, 1024),
                          e(x, {
                            label: "Client Secret",
                            required: ""
                          }, {
                            default: t(() => [
                              e(g, {
                                value: _.clientSecret,
                                "onUpdate:value": (B) => _.clientSecret = B,
                                type: "password",
                                "show-password-on": "click"
                              }, null, 8, [
                                "value",
                                "onUpdate:value"
                              ])
                            ]),
                            _: 2
                          }, 1024),
                          e(x, {
                            label: "Authorization URL",
                            required: ""
                          }, {
                            default: t(() => [
                              e(g, {
                                value: _.authorizationURL,
                                "onUpdate:value": (B) => _.authorizationURL = B
                              }, null, 8, [
                                "value",
                                "onUpdate:value"
                              ])
                            ]),
                            _: 2
                          }, 1024),
                          e(x, {
                            label: "Access Token URL",
                            required: ""
                          }, {
                            default: t(() => [
                              e(g, {
                                value: _.accessTokenURL,
                                "onUpdate:value": (B) => _.accessTokenURL = B
                              }, null, 8, [
                                "value",
                                "onUpdate:value"
                              ])
                            ]),
                            _: 2
                          }, 1024),
                          e(x, {
                            label: "Access Token Params Format",
                            required: ""
                          }, {
                            default: t(() => [
                              e(se, {
                                value: _.accessTokenFormat,
                                "onUpdate:value": (B) => _.accessTokenFormat = B,
                                options: h
                              }, null, 8, [
                                "value",
                                "onUpdate:value"
                              ])
                            ]),
                            _: 2
                          }, 1024),
                          e(x, {
                            label: "User Info URL",
                            required: ""
                          }, {
                            default: t(() => [
                              e(g, {
                                value: _.userInfoURL,
                                "onUpdate:value": (B) => _.userInfoURL = B
                              }, null, 8, [
                                "value",
                                "onUpdate:value"
                              ])
                            ]),
                            _: 2
                          }, 1024),
                          e(x, {
                            label: "User Email Key (Support JSONPATH like $[0].email)",
                            required: ""
                          }, {
                            default: t(() => [
                              e(g, {
                                value: _.userEmailKey,
                                "onUpdate:value": (B) => _.userEmailKey = B
                              }, null, 8, [
                                "value",
                                "onUpdate:value"
                              ])
                            ]),
                            _: 2
                          }, 1024),
                          e(x, {
                            label: "Redirect URL",
                            required: ""
                          }, {
                            default: t(() => [
                              e(g, {
                                value: _.redirectURL,
                                "onUpdate:value": (B) => _.redirectURL = B
                              }, null, 8, [
                                "value",
                                "onUpdate:value"
                              ])
                            ]),
                            _: 2
                          }, 1024),
                          e(x, {
                            label: "Scope",
                            required: ""
                          }, {
                            default: t(() => [
                              e(g, {
                                value: _.scope,
                                "onUpdate:value": (B) => _.scope = B
                              }, null, 8, [
                                "value",
                                "onUpdate:value"
                              ])
                            ]),
                            _: 2
                          }, 1024),
                          e(x, {
                            label: a(n)("enableMailAllowList")
                          }, {
                            default: t(() => [
                              e(F, null, {
                                default: t(() => [
                                  e(V, {
                                    checked: _.enableMailAllowList,
                                    "onUpdate:checked": (B) => _.enableMailAllowList = B,
                                    style: {
                                      width: "20%"
                                    }
                                  }, {
                                    default: t(() => [
                                      M(b(a(n)("enable")), 1)
                                    ]),
                                    _: 2
                                  }, 1032, [
                                    "checked",
                                    "onUpdate:checked"
                                  ]),
                                  _.enableMailAllowList ? (I(), Y(se, {
                                    key: 0,
                                    value: _.mailAllowList,
                                    "onUpdate:value": (B) => _.mailAllowList = B,
                                    filterable: "",
                                    multiple: "",
                                    tag: "",
                                    style: {
                                      width: "80%"
                                    },
                                    options: a(s),
                                    placeholder: a(n)("mailAllowList")
                                  }, null, 8, [
                                    "value",
                                    "onUpdate:value",
                                    "options",
                                    "placeholder"
                                  ])) : ee("", true)
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 2
                          }, 1032, [
                            "label"
                          ])
                        ]),
                        _: 2
                      }, 1032, [
                        "model"
                      ])
                    ]),
                    _: 2
                  }, 1032, [
                    "title"
                  ]))), 128))
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ]);
      };
    }
  });
  Za = K(Ya, [
    [
      "__scopeId",
      "data-v-e244e321"
    ]
  ]);
  en = {
    style: {
      "margin-top": "10px"
    }
  };
  tn = {
    __name: "Mails",
    setup(d) {
      const { adminMailTabAddress: i } = ne(), { t: l } = H({
        messages: {
          en: {
            addressQueryTip: "Leave blank to query all addresses",
            keywordQueryTip: "Leave blank to not query by keyword",
            query: "Query"
          },
          zh: {
            addressQueryTip: "\u7559\u7A7A\u67E5\u8BE2\u6240\u6709\u5730\u5740",
            keywordQueryTip: "\u7559\u7A7A\u4E0D\u6309\u5173\u952E\u5B57\u67E5\u8BE2",
            query: "\u67E5\u8BE2"
          }
        }
      }), n = y(""), s = y(""), f = () => {
        i.value = i.value.trim(), s.value = s.value.trim(), n.value = Date.now();
      }, o = async (r, v) => await $.fetch(`/admin/mails?limit=${r}&offset=${v}` + (i.value ? `&address=${i.value}` : "") + (s.value ? `&keyword=${s.value}` : "")), u = async (r) => {
        await $.fetch(`/admin/mails/${r}`, {
          method: "DELETE"
        });
      };
      return (r, v) => {
        const m = ae, c = z, h = ie;
        return I(), E("div", en, [
          e(h, null, {
            default: t(() => [
              e(m, {
                value: a(i),
                "onUpdate:value": v[0] || (v[0] = (k) => Ke(i) ? i.value = k : null),
                placeholder: a(l)("addressQueryTip"),
                onKeydown: we(f, [
                  "enter"
                ])
              }, null, 8, [
                "value",
                "placeholder"
              ]),
              e(m, {
                value: s.value,
                "onUpdate:value": v[1] || (v[1] = (k) => s.value = k),
                placeholder: a(l)("keywordQueryTip"),
                onKeydown: we(f, [
                  "enter"
                ])
              }, null, 8, [
                "value",
                "placeholder"
              ]),
              e(c, {
                onClick: f,
                type: "primary",
                tertiary: ""
              }, {
                default: t(() => [
                  M(b(a(l)("query")), 1)
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          v[2] || (v[2] = N("div", {
            style: {
              "margin-top": "10px"
            }
          }, null, -1)),
          (I(), Y(vt, {
            key: n.value,
            enableUserDeleteEmail: true,
            fetchMailData: o,
            deleteMail: u
          }))
        ]);
      };
    }
  };
  an = {
    style: {
      "margin-top": "10px"
    }
  };
  nn = {
    __name: "MailsUnknow",
    setup(d) {
      const i = async (n, s) => await $.fetch(`/admin/mails_unknow?limit=${n}&offset=${s}`), l = async (n) => {
        await $.fetch(`/admin/mails/${n}`, {
          method: "DELETE"
        });
      };
      return (n, s) => (I(), E("div", an, [
        e(vt, {
          enableUserDeleteEmail: true,
          fetchMailData: i,
          deleteMail: l
        })
      ]));
    }
  };
  ln = {
    class: "center"
  };
  sn = {
    __name: "Maintenance",
    setup(d) {
      const i = G(), l = y({
        enableMailsAutoCleanup: false,
        cleanMailsDays: 30,
        enableUnknowMailsAutoCleanup: false,
        cleanUnknowMailsDays: 30,
        enableSendBoxAutoCleanup: false,
        cleanSendBoxDays: 30,
        enableAddressAutoCleanup: false,
        cleanAddressDays: 30,
        enableInactiveAddressAutoCleanup: false,
        cleanInactiveAddressDays: 30
      }), { t: n } = H({
        messages: {
          en: {
            tip: "Please input the days",
            mailBoxLabel: "Cleanup the inbox before n days",
            mailUnknowLabel: "Cleanup the unknow mail before n days",
            sendBoxLabel: "Cleanup the sendbox before n days",
            addressCreateLabel: "Cleanup the address created before n days",
            inactiveAddressLabel: "Cleanup the inactive address before n days",
            cleanupNow: "Cleanup now",
            autoCleanup: "Auto cleanup",
            cleanupSuccess: "Cleanup success",
            save: "Save",
            cronTip: "Enable cron cleanup, need to configure [crons] in worker, please refer to the document, setting 0 days means clear all"
          },
          zh: {
            tip: "\u8BF7\u8F93\u5165\u5929\u6570",
            mailBoxLabel: "\u6E05\u7406 n \u5929\u524D\u7684\u6536\u4EF6\u7BB1",
            mailUnknowLabel: "\u6E05\u7406 n \u5929\u524D\u7684\u65E0\u6536\u4EF6\u4EBA\u90AE\u4EF6",
            sendBoxLabel: "\u6E05\u7406 n \u5929\u524D\u7684\u53D1\u4EF6\u7BB1",
            addressCreateLabel: "\u6E05\u7406 n \u5929\u524D\u521B\u5EFA\u7684\u5730\u5740",
            inactiveAddressLabel: "\u6E05\u7406 n \u5929\u524D\u7684\u672A\u6D3B\u8DC3\u5730\u5740",
            autoCleanup: "\u81EA\u52A8\u6E05\u7406",
            cleanupSuccess: "\u6E05\u7406\u6210\u529F",
            cleanupNow: "\u7ACB\u5373\u6E05\u7406",
            save: "\u4FDD\u5B58",
            cronTip: "\u542F\u7528\u5B9A\u65F6\u6E05\u7406, \u9700\u5728 worker \u914D\u7F6E [crons] \u53C2\u6570, \u8BF7\u53C2\u8003\u6587\u6863, \u914D\u7F6E\u4E3A 0 \u5929\u8868\u793A\u5168\u90E8\u6E05\u7A7A"
          }
        }
      }), s = async (u, r) => {
        try {
          await $.fetch("/admin/cleanup", {
            method: "POST",
            body: JSON.stringify({
              cleanType: u,
              cleanDays: r
            })
          }), i.success(n("cleanupSuccess"));
        } catch (v) {
          i.error(v.message || "error");
        }
      }, f = async () => {
        try {
          const u = await $.fetch("/admin/auto_cleanup");
          u && Object.assign(l.value, u);
        } catch (u) {
          i.error(u.message || "error");
        }
      }, o = async () => {
        try {
          await $.fetch("/admin/auto_cleanup", {
            method: "POST",
            body: JSON.stringify(l.value)
          }), i.success(n("cleanupSuccess"));
        } catch (u) {
          i.error(u.message || "error");
        }
      };
      return X(async () => {
        await f();
      }), (u, r) => {
        const v = Te, m = z, c = ft, h = ke, k = He, S = mt, g = ce, x = ze, L = le;
        return I(), E("div", ln, [
          e(L, {
            bordered: false,
            embedded: ""
          }, {
            default: t(() => [
              e(v, {
                "show-icon": false,
                bordered: false,
                type: "warning"
              }, {
                default: t(() => [
                  N("span", null, b(a(n)("cronTip")), 1)
                ]),
                _: 1
              }),
              e(c, {
                justify: "end"
              }, {
                default: t(() => [
                  e(m, {
                    onClick: o,
                    type: "primary",
                    loading: u.loading
                  }, {
                    default: t(() => [
                      M(b(a(n)("save")), 1)
                    ]),
                    _: 1
                  }, 8, [
                    "loading"
                  ])
                ]),
                _: 1
              }),
              e(x, {
                model: l.value
              }, {
                default: t(() => [
                  e(g, {
                    label: a(n)("mailBoxLabel")
                  }, {
                    default: t(() => [
                      e(h, {
                        checked: l.value.enableMailsAutoCleanup,
                        "onUpdate:checked": r[0] || (r[0] = (w) => l.value.enableMailsAutoCleanup = w)
                      }, {
                        default: t(() => [
                          M(b(a(n)("autoCleanup")), 1)
                        ]),
                        _: 1
                      }, 8, [
                        "checked"
                      ]),
                      e(k, {
                        value: l.value.cleanMailsDays,
                        "onUpdate:value": r[1] || (r[1] = (w) => l.value.cleanMailsDays = w),
                        placeholder: a(n)("tip")
                      }, null, 8, [
                        "value",
                        "placeholder"
                      ]),
                      e(m, {
                        onClick: r[2] || (r[2] = (w) => s("mails", l.value.cleanMailsDays))
                      }, {
                        icon: t(() => [
                          e(S, {
                            component: a(Me)
                          }, null, 8, [
                            "component"
                          ])
                        ]),
                        default: t(() => [
                          M(" " + b(a(n)("cleanupNow")), 1)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, [
                    "label"
                  ]),
                  e(g, {
                    label: a(n)("mailUnknowLabel")
                  }, {
                    default: t(() => [
                      e(h, {
                        checked: l.value.enableUnknowMailsAutoCleanup,
                        "onUpdate:checked": r[3] || (r[3] = (w) => l.value.enableUnknowMailsAutoCleanup = w)
                      }, {
                        default: t(() => [
                          M(b(a(n)("autoCleanup")), 1)
                        ]),
                        _: 1
                      }, 8, [
                        "checked"
                      ]),
                      e(k, {
                        value: l.value.cleanUnknowMailsDays,
                        "onUpdate:value": r[4] || (r[4] = (w) => l.value.cleanUnknowMailsDays = w),
                        placeholder: a(n)("tip")
                      }, null, 8, [
                        "value",
                        "placeholder"
                      ]),
                      e(m, {
                        onClick: r[5] || (r[5] = (w) => s("mails_unknow", l.value.cleanUnknowMailsDays))
                      }, {
                        icon: t(() => [
                          e(S, {
                            component: a(Me)
                          }, null, 8, [
                            "component"
                          ])
                        ]),
                        default: t(() => [
                          M(" " + b(a(n)("cleanupNow")), 1)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, [
                    "label"
                  ]),
                  e(g, {
                    label: a(n)("sendBoxLabel")
                  }, {
                    default: t(() => [
                      e(h, {
                        checked: l.value.enableSendBoxAutoCleanup,
                        "onUpdate:checked": r[6] || (r[6] = (w) => l.value.enableSendBoxAutoCleanup = w)
                      }, {
                        default: t(() => [
                          M(b(a(n)("autoCleanup")), 1)
                        ]),
                        _: 1
                      }, 8, [
                        "checked"
                      ]),
                      e(k, {
                        value: l.value.cleanSendBoxDays,
                        "onUpdate:value": r[7] || (r[7] = (w) => l.value.cleanSendBoxDays = w),
                        placeholder: a(n)("tip")
                      }, null, 8, [
                        "value",
                        "placeholder"
                      ]),
                      e(m, {
                        onClick: r[8] || (r[8] = (w) => s("sendbox", l.value.cleanSendBoxDays))
                      }, {
                        icon: t(() => [
                          e(S, {
                            component: a(Me)
                          }, null, 8, [
                            "component"
                          ])
                        ]),
                        default: t(() => [
                          M(" " + b(a(n)("cleanupNow")), 1)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, [
                    "label"
                  ]),
                  e(g, {
                    label: a(n)("addressCreateLabel")
                  }, {
                    default: t(() => [
                      e(h, {
                        checked: l.value.enableAddressAutoCleanup,
                        "onUpdate:checked": r[9] || (r[9] = (w) => l.value.enableAddressAutoCleanup = w)
                      }, {
                        default: t(() => [
                          M(b(a(n)("autoCleanup")), 1)
                        ]),
                        _: 1
                      }, 8, [
                        "checked"
                      ]),
                      e(k, {
                        value: l.value.cleanAddressDays,
                        "onUpdate:value": r[10] || (r[10] = (w) => l.value.cleanAddressDays = w),
                        placeholder: a(n)("tip")
                      }, null, 8, [
                        "value",
                        "placeholder"
                      ]),
                      e(m, {
                        onClick: r[11] || (r[11] = (w) => s("addressCreated", l.value.cleanAddressDays))
                      }, {
                        icon: t(() => [
                          e(S, {
                            component: a(Me)
                          }, null, 8, [
                            "component"
                          ])
                        ]),
                        default: t(() => [
                          M(" " + b(a(n)("cleanupNow")), 1)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, [
                    "label"
                  ]),
                  e(g, {
                    label: a(n)("inactiveAddressLabel")
                  }, {
                    default: t(() => [
                      e(h, {
                        checked: l.value.enableInactiveAddressAutoCleanup,
                        "onUpdate:checked": r[12] || (r[12] = (w) => l.value.enableInactiveAddressAutoCleanup = w)
                      }, {
                        default: t(() => [
                          M(b(a(n)("autoCleanup")), 1)
                        ]),
                        _: 1
                      }, 8, [
                        "checked"
                      ]),
                      e(k, {
                        value: l.value.cleanInactiveAddressDays,
                        "onUpdate:value": r[13] || (r[13] = (w) => l.value.cleanInactiveAddressDays = w),
                        placeholder: a(n)("tip")
                      }, null, 8, [
                        "value",
                        "placeholder"
                      ]),
                      e(m, {
                        onClick: r[14] || (r[14] = (w) => s("inactiveAddress", l.value.cleanInactiveAddressDays))
                      }, {
                        icon: t(() => [
                          e(S, {
                            component: a(Me)
                          }, null, 8, [
                            "component"
                          ])
                        ]),
                        default: t(() => [
                          M(" " + b(a(n)("cleanupNow")), 1)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, [
                    "label"
                  ])
                ]),
                _: 1
              }, 8, [
                "model"
              ])
            ]),
            _: 1
          })
        ]);
      };
    }
  };
  on = K(sn, [
    [
      "__scopeId",
      "data-v-e5b3fec1"
    ]
  ]);
  rn = {
    class: "center"
  };
  un = {
    __name: "DatabaseManager",
    setup(d) {
      const i = G(), l = y({
        need_initialization: false,
        need_migration: false,
        current_db_version: "",
        code_db_version: ""
      }), { t: n } = H({
        messages: {
          en: {
            need_initialization_tip: "Database initialization is required. Please initialize the database.",
            need_migration_tip: "Database migration is required. Please migrate the database.",
            current_db_version: "Current DB Version",
            code_db_version: "Code Needed DB Version",
            init: "Initialize Database",
            migration: "Migrate Database",
            initializationSuccess: "Database initialized successfully",
            migrationSuccess: "Database migrated successfully"
          },
          zh: {
            need_initialization_tip: "\u9700\u8981\u521D\u59CB\u5316\u6570\u636E\u5E93\uFF0C\u8BF7\u521D\u59CB\u5316\u6570\u636E\u5E93",
            need_migration_tip: "\u9700\u8981\u8FC1\u79FB\u6570\u636E\u5E93\uFF0C\u8BF7\u8FC1\u79FB\u6570\u636E\u5E93",
            current_db_version: "\u5F53\u524D\u6570\u636E\u5E93\u7248\u672C",
            code_db_version: "\u9700\u8981\u7684\u6570\u636E\u5E93\u7248\u672C",
            init: "\u521D\u59CB\u5316\u6570\u636E\u5E93",
            migration: "\u5347\u7EA7\u6570\u636E\u5E93 Schema",
            initializationSuccess: "\u6570\u636E\u5E93\u521D\u59CB\u5316\u6210\u529F",
            migrationSuccess: "\u6570\u636E\u5E93\u5347\u7EA7\u6210\u529F"
          }
        }
      }), s = async () => {
        try {
          const u = await $.fetch("/admin/db_version");
          u && Object.assign(l.value, u);
        } catch (u) {
          i.error(u.message || "error");
        }
      }, f = async () => {
        try {
          await $.fetch("/admin/db_initialize", {
            method: "POST"
          }), await s(), i.success(n("initializationSuccess"));
        } catch (u) {
          i.error(u.message || "error");
        }
      }, o = async () => {
        try {
          await $.fetch("/admin/db_migration", {
            method: "POST"
          }), await s(), i.success(n("migrationSuccess"));
        } catch (u) {
          i.error(u.message || "error");
        }
      };
      return X(async () => {
        await s();
      }), (u, r) => {
        const v = z, m = Te, c = le;
        return I(), E("div", rn, [
          e(c, {
            bordered: false,
            embedded: ""
          }, {
            default: t(() => [
              l.value.need_initialization ? (I(), Y(m, {
                key: 0,
                type: "warning",
                "show-icon": false,
                bordered: false
              }, {
                default: t(() => [
                  N("span", null, b(a(n)("need_initialization_tip")), 1),
                  e(v, {
                    onClick: f,
                    type: "primary",
                    secondary: "",
                    block: "",
                    loading: u.loading
                  }, {
                    default: t(() => [
                      M(b(a(n)("init")), 1)
                    ]),
                    _: 1
                  }, 8, [
                    "loading"
                  ])
                ]),
                _: 1
              })) : ee("", true),
              l.value.need_migration ? (I(), Y(m, {
                key: 1,
                type: "warning",
                "show-icon": false,
                bordered: false
              }, {
                default: t(() => [
                  N("span", null, b(a(n)("need_migration_tip")), 1),
                  e(v, {
                    onClick: o,
                    type: "primary",
                    secondary: "",
                    block: "",
                    loading: u.loading
                  }, {
                    default: t(() => [
                      M(b(a(n)("migration")), 1)
                    ]),
                    _: 1
                  }, 8, [
                    "loading"
                  ])
                ]),
                _: 1
              })) : ee("", true),
              e(m, {
                type: "info",
                "show-icon": false,
                bordered: false
              }, {
                default: t(() => [
                  N("span", null, b(a(n)("current_db_version")) + ": " + b(l.value.current_db_version || "unknown") + ", " + b(a(n)("code_db_version")) + ": " + b(l.value.code_db_version), 1)
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ]);
      };
    }
  };
  rt = K(un, [
    [
      "__scopeId",
      "data-v-6eef5c21"
    ]
  ]);
  dn = {
    class: "center"
  };
  cn = {
    key: 0
  };
  mn = te({
    __name: "Telegram",
    setup(d) {
      const i = G(), { t: l } = H({
        messages: {
          en: {
            init: "Init",
            successTip: "Success",
            status: "Check Status",
            enableTelegramAllowList: "Enable Telegram Allow List(Manually input user ID)",
            enable: "Enable",
            telegramAllowList: "Telegram Allow List(Manually input telegram user ID)",
            save: "Save",
            miniAppUrl: "Telegram Mini App URL",
            enableGlobalMailPush: "Enable Global Mail Push(Manually input telegram user ID)",
            globalMailPushList: "Global Mail Push List"
          },
          zh: {
            init: "\u521D\u59CB\u5316",
            successTip: "\u6210\u529F",
            status: "\u67E5\u770B\u72B6\u6001",
            enableTelegramAllowList: "\u542F\u7528 Telegram \u767D\u540D\u5355(\u624B\u52A8\u8F93\u5165\u7528\u6237 ID, \u56DE\u8F66\u589E\u52A0)",
            enable: "\u542F\u7528",
            telegramAllowList: "Telegram \u767D\u540D\u5355(\u624B\u52A8\u8F93\u5165\u7528\u6237 ID, \u56DE\u8F66\u589E\u52A0)",
            save: "\u4FDD\u5B58",
            miniAppUrl: "\u7535\u62A5\u5C0F\u7A0B\u5E8F URL(\u8BF7\u8F93\u5165\u4F60\u90E8\u7F72\u7684\u7535\u62A5\u5C0F\u7A0B\u5E8F\u7F51\u9875\u5730\u5740)",
            enableGlobalMailPush: "\u542F\u7528\u5168\u5C40\u90AE\u4EF6\u63A8\u9001(\u624B\u52A8\u8F93\u5165\u90AE\u7BB1\u7BA1\u7406\u5458\u7684 telegram \u7528\u6237 ID, \u56DE\u8F66\u589E\u52A0)",
            globalMailPushList: "\u5168\u5C40\u90AE\u4EF6\u63A8\u9001\u7528\u6237\u5217\u8868"
          }
        }
      }), n = y({
        fetched: false
      }), s = async () => {
        try {
          const m = await $.fetch("/admin/telegram/status");
          Object.assign(n.value, m), n.value.fetched = true;
        } catch (m) {
          i.error(m.message || "error");
        }
      }, f = async () => {
        try {
          await $.fetch("/admin/telegram/init", {
            method: "POST"
          }), i.success(l("successTip"));
        } catch (m) {
          i.error(m.message || "error");
        }
      };
      class o {
        constructor(c, h, k, S, g) {
          __publicField(this, "enableAllowList");
          __publicField(this, "allowList");
          __publicField(this, "miniAppUrl");
          __publicField(this, "enableGlobalMailPush");
          __publicField(this, "globalMailPushList");
          this.enableAllowList = c, this.allowList = h, this.miniAppUrl = k, this.enableGlobalMailPush = S, this.globalMailPushList = g;
        }
      }
      const u = y(new o(false, [], "", false, [])), r = async () => {
        try {
          const m = await $.fetch("/admin/telegram/settings");
          Object.assign(u.value, m);
        } catch (m) {
          i.error(m.message || "error");
        }
      }, v = async () => {
        try {
          await $.fetch("/admin/telegram/settings", {
            method: "POST",
            body: JSON.stringify(u.value)
          }), i.success(l("successTip"));
        } catch (m) {
          i.error(m.message || "error");
        }
      };
      return X(async () => {
        await r();
      }), (m, c) => {
        const h = ke, k = fe, S = ie, g = ce, x = ae, L = z, w = le;
        return I(), E("div", dn, [
          e(w, {
            bordered: false,
            embedded: "",
            style: {
              "max-width": "800px",
              overflow: "auto"
            }
          }, {
            default: t(() => [
              e(w, {
                bordered: false,
                embedded: ""
              }, {
                default: t(() => [
                  e(g, {
                    label: a(l)("enableTelegramAllowList")
                  }, {
                    default: t(() => [
                      e(S, null, {
                        default: t(() => [
                          e(h, {
                            checked: u.value.enableAllowList,
                            "onUpdate:checked": c[0] || (c[0] = (C) => u.value.enableAllowList = C),
                            style: {
                              width: "20%"
                            }
                          }, {
                            default: t(() => [
                              M(b(a(l)("enable")), 1)
                            ]),
                            _: 1
                          }, 8, [
                            "checked"
                          ]),
                          e(k, {
                            value: u.value.allowList,
                            "onUpdate:value": c[1] || (c[1] = (C) => u.value.allowList = C),
                            filterable: "",
                            multiple: "",
                            tag: "",
                            style: {
                              width: "80%"
                            },
                            placeholder: a(l)("telegramAllowList")
                          }, null, 8, [
                            "value",
                            "placeholder"
                          ])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, [
                    "label"
                  ]),
                  e(g, {
                    label: a(l)("enableGlobalMailPush")
                  }, {
                    default: t(() => [
                      e(S, null, {
                        default: t(() => [
                          e(h, {
                            checked: u.value.enableGlobalMailPush,
                            "onUpdate:checked": c[2] || (c[2] = (C) => u.value.enableGlobalMailPush = C),
                            style: {
                              width: "20%"
                            }
                          }, {
                            default: t(() => [
                              M(b(a(l)("enable")), 1)
                            ]),
                            _: 1
                          }, 8, [
                            "checked"
                          ]),
                          e(k, {
                            value: u.value.globalMailPushList,
                            "onUpdate:value": c[3] || (c[3] = (C) => u.value.globalMailPushList = C),
                            filterable: "",
                            multiple: "",
                            tag: "",
                            style: {
                              width: "80%"
                            },
                            placeholder: a(l)("globalMailPushList")
                          }, null, 8, [
                            "value",
                            "placeholder"
                          ])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, [
                    "label"
                  ]),
                  e(g, {
                    label: a(l)("miniAppUrl")
                  }, {
                    default: t(() => [
                      e(x, {
                        value: u.value.miniAppUrl,
                        "onUpdate:value": c[4] || (c[4] = (C) => u.value.miniAppUrl = C)
                      }, null, 8, [
                        "value"
                      ])
                    ]),
                    _: 1
                  }, 8, [
                    "label"
                  ]),
                  e(L, {
                    onClick: v,
                    type: "primary",
                    block: ""
                  }, {
                    default: t(() => [
                      M(b(a(l)("save")), 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              e(L, {
                onClick: f,
                type: "primary",
                block: ""
              }, {
                default: t(() => [
                  M(b(a(l)("init")), 1)
                ]),
                _: 1
              }),
              e(L, {
                onClick: s,
                secondary: "",
                block: ""
              }, {
                default: t(() => [
                  M(b(a(l)("status")), 1)
                ]),
                _: 1
              }),
              n.value.fetched ? (I(), E("pre", cn, b(JSON.stringify(n.value, null, 2)), 1)) : ee("", true)
            ]),
            _: 1
          })
        ]);
      };
    }
  });
  pn = K(mn, [
    [
      "__scopeId",
      "data-v-f745cedd"
    ]
  ]);
  _n = {
    class: "center"
  };
  fn = te({
    __name: "Webhook",
    setup(d) {
      const i = G(), { t: l } = H({
        messages: {
          en: {
            successTip: "Success",
            webhookAllowList: "Webhook Allow List(Enter the address that is allowed to use webhook and enter)",
            save: "Save",
            notEnabled: "Webhook is not enabled"
          },
          zh: {
            successTip: "\u6210\u529F",
            webhookAllowList: "Webhook \u767D\u540D\u5355(\u8BF7\u8F93\u5165\u5141\u8BB8\u4F7F\u7528webhook \u7684\u5730\u5740, \u56DE\u8F66\u589E\u52A0)",
            save: "\u4FDD\u5B58",
            notEnabled: "Webhook \u672A\u5F00\u542F"
          }
        }
      });
      class n {
        constructor(m) {
          __publicField(this, "allowList");
          this.allowList = m;
        }
      }
      const s = y(new n([])), f = y(false), o = y(""), u = async () => {
        try {
          const v = await $.fetch("/admin/webhook/settings");
          Object.assign(s.value, v), f.value = true;
        } catch (v) {
          o.value = v.message || "error";
        }
      }, r = async () => {
        try {
          await $.fetch("/admin/webhook/settings", {
            method: "POST",
            body: JSON.stringify(s.value)
          }), i.success(l("successTip"));
        } catch (v) {
          i.error(v.message || "error");
        }
      };
      return X(async () => {
        await u();
      }), (v, m) => {
        const c = fe, h = ce, k = z, S = le, g = Yt;
        return I(), E("div", _n, [
          f.value ? (I(), Y(S, {
            key: 0,
            bordered: false,
            embedded: "",
            style: {
              "max-width": "800px",
              overflow: "auto"
            }
          }, {
            default: t(() => [
              e(h, {
                label: a(l)("webhookAllowList")
              }, {
                default: t(() => [
                  e(c, {
                    value: s.value.allowList,
                    "onUpdate:value": m[0] || (m[0] = (x) => s.value.allowList = x),
                    filterable: "",
                    multiple: "",
                    tag: "",
                    placeholder: a(l)("webhookAllowList")
                  }, null, 8, [
                    "value",
                    "placeholder"
                  ])
                ]),
                _: 1
              }, 8, [
                "label"
              ]),
              e(k, {
                onClick: r,
                type: "primary",
                block: ""
              }, {
                default: t(() => [
                  M(b(a(l)("save")), 1)
                ]),
                _: 1
              })
            ]),
            _: 1
          })) : (I(), Y(g, {
            key: 1,
            status: "404",
            title: a(l)("notEnabled"),
            description: o.value
          }, null, 8, [
            "title",
            "description"
          ]))
        ]);
      };
    }
  });
  vn = K(fn, [
    [
      "__scopeId",
      "data-v-09dba2fd"
    ]
  ]);
  bn = te({
    __name: "MailWebhook",
    setup(d) {
      const i = async () => await $.fetch("/admin/mail_webhook/settings"), l = async (s) => {
        await $.fetch("/admin/mail_webhook/settings", {
          method: "POST",
          body: JSON.stringify(s)
        });
      }, n = async (s) => {
        await $.fetch("/admin/mail_webhook/test", {
          method: "POST",
          body: JSON.stringify(s)
        });
      };
      return (s, f) => (I(), Y(Zt, {
        fetchData: i,
        saveSettings: l,
        testSettings: n
      }));
    }
  });
  gn = {
    class: "center"
  };
  hn = {
    __name: "WorkerConfig",
    setup(d) {
      const { loading: i } = ne(), l = G(), n = y({}), s = async () => {
        try {
          const f = await $.fetch("/admin/worker/configs");
          Object.assign(n.value, f);
        } catch (f) {
          l.error(f.message || "error");
        }
      };
      return X(async () => {
        await s();
      }), (f, o) => {
        const u = le;
        return I(), E("div", gn, [
          e(u, {
            bordered: false,
            embedded: "",
            style: {
              "max-width": "600px",
              overflow: "auto"
            }
          }, {
            default: t(() => [
              N("pre", null, b(JSON.stringify(n.value, null, 2)), 1)
            ]),
            _: 1
          })
        ]);
      };
    }
  };
  it = K(hn, [
    [
      "__scopeId",
      "data-v-516133cd"
    ]
  ]);
  yn = {
    key: 0
  };
  wn = {
    __name: "Admin",
    setup(d) {
      const { adminAuth: i, showAdminAuth: l, adminTab: n, loading: s, globalTabplacement: f, showAdminPage: o, userSettings: u } = ne(), r = G(), v = aa(() => (s.value = true, sa(() => import("./SendMail-CHZW5k8L.js"), __vite__mapDeps([0,1,2,3,4,5])).finally(() => s.value = false))), m = async () => {
        try {
          i.value = k.value, location.reload();
        } catch (S) {
          r.error(S.message || "error");
        }
      }, { t: c } = H({
        messages: {
          en: {
            accessHeader: "Admin Password",
            accessTip: "Please enter the admin password",
            mails: "Emails",
            sendMail: "Send Mail",
            qucickSetup: "Quick Setup",
            account: "Account",
            account_create: "Create Account",
            account_settings: "Account Settings",
            user: "User",
            user_management: "User Management",
            user_settings: "User Settings",
            userOauth2Settings: "Oauth2 Settings",
            unknow: "Mails with unknow receiver",
            senderAccess: "Sender Access Control",
            sendBox: "Send Box",
            telegram: "Telegram Bot",
            webhookSettings: "Webhook Settings",
            statistics: "Statistics",
            maintenance: "Maintenance",
            database: "Database",
            workerconfig: "Worker Config",
            appearance: "Appearance",
            about: "About",
            ok: "OK",
            mailWebhook: "Mail Webhook"
          },
          zh: {
            accessHeader: "Admin \u5BC6\u7801",
            accessTip: "\u8BF7\u8F93\u5165 Admin \u5BC6\u7801",
            mails: "\u90AE\u4EF6",
            sendMail: "\u53D1\u9001\u90AE\u4EF6",
            qucickSetup: "\u5FEB\u901F\u8BBE\u7F6E",
            account: "\u8D26\u53F7",
            account_create: "\u521B\u5EFA\u8D26\u53F7",
            account_settings: "\u8D26\u53F7\u8BBE\u7F6E",
            user: "\u7528\u6237",
            user_management: "\u7528\u6237\u7BA1\u7406",
            user_settings: "\u7528\u6237\u8BBE\u7F6E",
            userOauth2Settings: "Oauth2 \u8BBE\u7F6E",
            unknow: "\u65E0\u6536\u4EF6\u4EBA\u90AE\u4EF6",
            senderAccess: "\u53D1\u4EF6\u6743\u9650\u63A7\u5236",
            sendBox: "\u53D1\u4EF6\u7BB1",
            telegram: "\u7535\u62A5\u673A\u5668\u4EBA",
            webhookSettings: "Webhook \u8BBE\u7F6E",
            statistics: "\u7EDF\u8BA1",
            maintenance: "\u7EF4\u62A4",
            database: "\u6570\u636E\u5E93",
            workerconfig: "Worker \u914D\u7F6E",
            appearance: "\u5916\u89C2",
            about: "\u5173\u4E8E",
            ok: "\u786E\u5B9A",
            mailWebhook: "\u90AE\u4EF6 Webhook"
          }
        }
      }), h = Ue(() => !o.value || l.value), k = y("");
      return X(async () => {
        u.value.user_id || await $.getUserSettings(r);
      }), (S, g) => {
        const x = ae, L = z, w = xe, C = ta, A = ea;
        return a(u).fetched ? (I(), E("div", yn, [
          e(w, {
            show: h.value,
            "onUpdate:show": g[1] || (g[1] = (O) => h.value = O),
            closable: false,
            closeOnEsc: false,
            maskClosable: false,
            preset: "dialog",
            title: a(c)("accessHeader")
          }, {
            action: t(() => [
              e(L, {
                onClick: m,
                type: "primary",
                loading: a(s)
              }, {
                default: t(() => [
                  M(b(a(c)("ok")), 1)
                ]),
                _: 1
              }, 8, [
                "loading"
              ])
            ]),
            default: t(() => [
              N("p", null, b(a(c)("accessTip")), 1),
              e(x, {
                value: k.value,
                "onUpdate:value": g[0] || (g[0] = (O) => k.value = O),
                type: "password",
                "show-password-on": "click"
              }, null, 8, [
                "value"
              ])
            ]),
            _: 1
          }, 8, [
            "show",
            "title"
          ]),
          a(o) ? (I(), Y(A, {
            key: 0,
            type: "card",
            value: a(n),
            "onUpdate:value": g[2] || (g[2] = (O) => Ke(n) ? n.value = O : null),
            placement: a(f)
          }, {
            default: t(() => [
              e(C, {
                name: "qucickSetup",
                tab: a(c)("qucickSetup")
              }, {
                default: t(() => [
                  e(A, {
                    type: "bar",
                    "justify-content": "center",
                    animated: ""
                  }, {
                    default: t(() => [
                      e(C, {
                        name: "database",
                        tab: a(c)("database")
                      }, {
                        default: t(() => [
                          e(rt)
                        ]),
                        _: 1
                      }, 8, [
                        "tab"
                      ]),
                      e(C, {
                        name: "account_settings",
                        tab: a(c)("account_settings")
                      }, {
                        default: t(() => [
                          e(lt)
                        ]),
                        _: 1
                      }, 8, [
                        "tab"
                      ]),
                      e(C, {
                        name: "user_settings",
                        tab: a(c)("user_settings")
                      }, {
                        default: t(() => [
                          e(st)
                        ]),
                        _: 1
                      }, 8, [
                        "tab"
                      ]),
                      e(C, {
                        name: "workerconfig",
                        tab: a(c)("workerconfig")
                      }, {
                        default: t(() => [
                          e(it)
                        ]),
                        _: 1
                      }, 8, [
                        "tab"
                      ])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, [
                "tab"
              ]),
              e(C, {
                name: "account",
                tab: a(c)("account")
              }, {
                default: t(() => [
                  e(A, {
                    type: "bar",
                    "justify-content": "center",
                    animated: ""
                  }, {
                    default: t(() => [
                      e(C, {
                        name: "account",
                        tab: a(c)("account")
                      }, {
                        default: t(() => [
                          e(Oa)
                        ]),
                        _: 1
                      }, 8, [
                        "tab"
                      ]),
                      e(C, {
                        name: "account_create",
                        tab: a(c)("account_create")
                      }, {
                        default: t(() => [
                          e(Ba)
                        ]),
                        _: 1
                      }, 8, [
                        "tab"
                      ]),
                      e(C, {
                        name: "account_settings",
                        tab: a(c)("account_settings")
                      }, {
                        default: t(() => [
                          e(lt)
                        ]),
                        _: 1
                      }, 8, [
                        "tab"
                      ]),
                      e(C, {
                        name: "senderAccess",
                        tab: a(c)("senderAccess")
                      }, {
                        default: t(() => [
                          e(Aa)
                        ]),
                        _: 1
                      }, 8, [
                        "tab"
                      ]),
                      e(C, {
                        name: "webhook",
                        tab: a(c)("webhookSettings")
                      }, {
                        default: t(() => [
                          e(vn)
                        ]),
                        _: 1
                      }, 8, [
                        "tab"
                      ])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, [
                "tab"
              ]),
              e(C, {
                name: "user",
                tab: a(c)("user")
              }, {
                default: t(() => [
                  e(A, {
                    type: "bar",
                    "justify-content": "center",
                    animated: ""
                  }, {
                    default: t(() => [
                      e(C, {
                        name: "user_management",
                        tab: a(c)("user_management")
                      }, {
                        default: t(() => [
                          e(Ha)
                        ]),
                        _: 1
                      }, 8, [
                        "tab"
                      ]),
                      e(C, {
                        name: "user_settings",
                        tab: a(c)("user_settings")
                      }, {
                        default: t(() => [
                          e(st)
                        ]),
                        _: 1
                      }, 8, [
                        "tab"
                      ]),
                      e(C, {
                        name: "userOauth2Settings",
                        tab: a(c)("userOauth2Settings")
                      }, {
                        default: t(() => [
                          e(Za)
                        ]),
                        _: 1
                      }, 8, [
                        "tab"
                      ])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, [
                "tab"
              ]),
              e(C, {
                name: "mails",
                tab: a(c)("mails")
              }, {
                default: t(() => [
                  e(A, {
                    type: "bar",
                    "justify-content": "center",
                    animated: ""
                  }, {
                    default: t(() => [
                      e(C, {
                        name: "mails",
                        tab: a(c)("mails")
                      }, {
                        default: t(() => [
                          e(tn)
                        ]),
                        _: 1
                      }, 8, [
                        "tab"
                      ]),
                      e(C, {
                        name: "unknow",
                        tab: a(c)("unknow")
                      }, {
                        default: t(() => [
                          e(nn)
                        ]),
                        _: 1
                      }, 8, [
                        "tab"
                      ]),
                      e(C, {
                        name: "sendBox",
                        tab: a(c)("sendBox")
                      }, {
                        default: t(() => [
                          e(La)
                        ]),
                        _: 1
                      }, 8, [
                        "tab"
                      ]),
                      e(C, {
                        name: "sendMail",
                        tab: a(c)("sendMail")
                      }, {
                        default: t(() => [
                          e(a(v))
                        ]),
                        _: 1
                      }, 8, [
                        "tab"
                      ]),
                      e(C, {
                        name: "mailWebhook",
                        tab: a(c)("mailWebhook")
                      }, {
                        default: t(() => [
                          e(bn)
                        ]),
                        _: 1
                      }, 8, [
                        "tab"
                      ])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, [
                "tab"
              ]),
              e(C, {
                name: "telegram",
                tab: a(c)("telegram")
              }, {
                default: t(() => [
                  e(pn)
                ]),
                _: 1
              }, 8, [
                "tab"
              ]),
              e(C, {
                name: "statistics",
                tab: a(c)("statistics")
              }, {
                default: t(() => [
                  e(Ma)
                ]),
                _: 1
              }, 8, [
                "tab"
              ]),
              e(C, {
                name: "maintenance",
                tab: a(c)("maintenance")
              }, {
                default: t(() => [
                  e(A, {
                    type: "bar",
                    "justify-content": "center",
                    animated: ""
                  }, {
                    default: t(() => [
                      e(C, {
                        name: "database",
                        tab: a(c)("database")
                      }, {
                        default: t(() => [
                          e(rt)
                        ]),
                        _: 1
                      }, 8, [
                        "tab"
                      ]),
                      e(C, {
                        name: "workerconfig",
                        tab: a(c)("workerconfig")
                      }, {
                        default: t(() => [
                          e(it)
                        ]),
                        _: 1
                      }, 8, [
                        "tab"
                      ]),
                      e(C, {
                        name: "maintenance",
                        tab: a(c)("maintenance")
                      }, {
                        default: t(() => [
                          e(on)
                        ]),
                        _: 1
                      }, 8, [
                        "tab"
                      ])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, [
                "tab"
              ]),
              e(C, {
                name: "appearance",
                tab: a(c)("appearance")
              }, {
                default: t(() => [
                  e(na)
                ]),
                _: 1
              }, 8, [
                "tab"
              ]),
              e(C, {
                name: "about",
                tab: a(c)("about")
              }, {
                default: t(() => [
                  e(la)
                ]),
                _: 1
              }, 8, [
                "tab"
              ])
            ]),
            _: 1
          }, 8, [
            "value",
            "placement"
          ])) : ee("", true)
        ])) : ee("", true);
      };
    }
  };
  xn = K(wn, [
    [
      "__scopeId",
      "data-v-2b9ec69b"
    ]
  ]);
});
export {
  __tla,
  xn as default
};
