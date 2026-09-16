/**
 * Site-wide language picker. Pages are written in Thai; this swaps every Thai
 * text node and label attribute for its translation, including text the apps
 * render later (MutationObserver), so app scripts don't need to know about it.
 *
 * Load in <head>, without defer, so nothing paints before it runs:
 *   <script src="../i18n.js" data-scope="pood"></script>
 * Dictionaries live in i18n/<scope>.js as I18N({ "ไทย": [en, zh-CN, ja, ko] }).
 * "common" (theme widget strings) is always loaded.
 * Mark text that must stay as-is (user speech, Thai practice topics) with translate="no".
 */
(function () {
  "use strict";

  var LANGS = [["th", "ไทย"], ["en", "English"], ["zh-CN", "简体中文"], ["ja", "日本語"], ["ko", "한국어"]];
  var CODES = LANGS.map(function (l) { return l[0]; });
  var STORAGE_KEY = "vpk-lang";
  var THAI = /[฀-๿]/;
  var ATTRS = ["placeholder", "title", "aria-label", "alt"];

  var script = document.currentScript;
  var base = script.src.slice(0, script.src.lastIndexOf("/") + 1);
  var root = document.documentElement;

  var lang = "th";
  try { lang = localStorage.getItem(STORAGE_KEY) || "th"; } catch (e) { /* storage blocked */ }
  var column = CODES.indexOf(lang) - 1; // dictionary rows have no Thai column
  if (column < 0) lang = "th";

  var dict = Object.create(null);
  var fragments = []; // dictionary keys, longest first

  function norm(s) { return s.replace(/\s+/g, " ").trim(); }

  function translate(s) {
    if (!fragments.length || !THAI.test(s)) return s;
    var key = norm(s);
    var out = dict[key];
    if (out === undefined) {
      // ponytail: text glued from pieces ("ชนะ " + name) is translated piece by piece,
      // so word order stays Thai. Add a whole-sentence key where that reads badly.
      out = key;
      for (var i = 0; i < fragments.length && THAI.test(out); i++) {
        if (out.indexOf(fragments[i]) !== -1) out = out.split(fragments[i]).join(dict[fragments[i]]);
      }
    }
    return s.match(/^\s*/)[0] + out + s.match(/\s*$/)[0];
  }
  window.vpkT = translate; // for text that never reaches the DOM (clipboard, downloads)

  function skipped(el) { return !el || el.closest("script,style,textarea,[translate=no]"); }

  function fixText(node) {
    if (skipped(node.parentElement)) return;
    var v = translate(node.nodeValue);
    if (v !== node.nodeValue) node.nodeValue = v;
  }

  function fixAttrs(el) {
    if (skipped(el)) return;
    ATTRS.forEach(function (name) {
      var v = el.getAttribute(name);
      var t = v && translate(v);
      if (t !== v) el.setAttribute(name, t);
    });
  }

  function walk(node) {
    if (node.nodeType === 3) return fixText(node);
    if (node.nodeType !== 1) return;
    fixAttrs(node);
    var tw = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    while (tw.nextNode()) {
      if (tw.currentNode.nodeType === 3) fixText(tw.currentNode);
      else fixAttrs(tw.currentNode);
    }
  }

  function reveal() { root.classList.remove("i18n-wait"); }

  function start() {
    fragments = Object.keys(dict).sort(function (a, b) { return b.length - a.length; });
    walk(root);
    new MutationObserver(function (records) {
      records.forEach(function (r) {
        if (r.type === "characterData") fixText(r.target);
        else if (r.type === "attributes") fixAttrs(r.target);
        else r.addedNodes.forEach(walk);
      });
    }).observe(root, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    reveal();
  }

  if (lang !== "th") {
    root.lang = lang;
    root.classList.add("i18n-wait");
    var style = document.createElement("style");
    style.textContent = "html.i18n-wait body{visibility:hidden}";
    document.head.appendChild(style);
    setTimeout(reveal, 3000); // never leave the page blank if a dictionary is slow

    ["alert", "confirm", "prompt"].forEach(function (name) {
      var native = window[name];
      window[name] = function () {
        var args = [].slice.call(arguments);
        if (args.length) args[0] = translate(String(args[0]));
        return native.apply(window, args);
      };
    });

    window.I18N = function (entries) {
      for (var k in entries) dict[norm(k)] = entries[k][column];
    };
    var scopes = ["common"].concat(script.dataset.scope || []);
    var pending = scopes.length;
    scopes.forEach(function (scope) {
      var el = document.createElement("script");
      el.src = base + "i18n/" + scope + ".js";
      el.onload = el.onerror = function () { if (--pending === 0) start(); };
      document.head.appendChild(el);
    });
  }

  function buildPicker() {
    var select = document.createElement("select");
    select.setAttribute("translate", "no");
    select.setAttribute("aria-label", "Language");
    select.style.cssText = "font:600 13px system-ui,sans-serif;padding:5px 8px;border-radius:999px;" +
      "border:1px solid rgba(0,0,0,.18);background:#fff;color:#222;cursor:pointer";
    LANGS.forEach(function (l) { select.add(new Option(l[1], l[0], false, l[0] === lang)); });
    select.addEventListener("change", function () {
      try { localStorage.setItem(STORAGE_KEY, select.value); } catch (e) { /* storage blocked */ }
      location.reload();
    });

    var host = document.querySelector(".theme-widget"); // built by theme.js on pages that load it
    if (!host) {
      host = document.createElement("div");
      host.style.cssText = "position:fixed;right:14px;bottom:14px;z-index:999";
      document.body.appendChild(host);
    }
    host.insertBefore(select, host.firstChild);
  }

  document.addEventListener("DOMContentLoaded", buildPicker);
})();
