!(function (e) {
    "function" == typeof define && define.amd ? define(["jquery"], e) : e("object" == typeof exports ? require("jquery") : jQuery);
})(function (e) {
    function t(e) {
        return a.raw ? e : encodeURIComponent(e);
    }
    function i(e) {
        return a.raw ? e : decodeURIComponent(e);
    }
    function o(e) {
        return t(a.json ? JSON.stringify(e) : String(e));
    }
    function n(e) {
        0 === e.indexOf('"') && (e = e.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\"));
        try {
            return (e = decodeURIComponent(e.replace(r, " "))), a.json ? JSON.parse(e) : e;
        } catch (t) {}
    }
    function s(t, i) {
        var o = a.raw ? t : n(t);
        return e.isFunction(i) ? i(o) : o;
    }
    var r = /\+/g,
        a = (e.cookie = function (n, r, l) {
            if (arguments.length > 1 && !e.isFunction(r)) {
                if (((l = e.extend({}, a.defaults, l)), "number" == typeof l.expires)) {
                    var d = l.expires,
                        c = (l.expires = new Date());
                    c.setTime(+c + 864e5 * d);
                }
                return (document.cookie = [t(n), "=", o(r), l.expires ? "; expires=" + l.expires.toUTCString() : "", l.path ? "; path=" + l.path : "", l.domain ? "; domain=" + l.domain : "", l.secure ? "; secure" : ""].join(""));
            }
            for (var p = n ? void 0 : {}, u = document.cookie ? document.cookie.split("; ") : [], f = 0, h = u.length; f < h; f++) {
                var m = u[f].split("="),
                    g = i(m.shift()),
                    v = m.join("=");
                if (n && n === g) {
                    p = s(v, r);
                    break;
                }
                n || void 0 === (v = s(v)) || (p[g] = v);
            }
            return p;
        });
    (a.defaults = {}),
        (e.removeCookie = function (t, i) {
            return void 0 !== e.cookie(t) && (e.cookie(t, "", e.extend({}, i, { expires: -1 })), !e.cookie(t));
        });
}),
    (function (e) {
        "function" == typeof define && define.amd ? define(["jquery"], e) : e("object" == typeof exports ? require("jquery") : window.jQuery || window.Zepto);
    })(function (e) {
        var t,
            i,
            o,
            n,
            s,
            r,
            a = "Close",
            l = "BeforeClose",
            d = "AfterClose",
            c = "BeforeAppend",
            p = "MarkupParse",
            u = "Open",
            f = "Change",
            h = "mfp",
            m = "." + h,
            g = "mfp-ready",
            v = "mfp-removing",
            y = "mfp-prevent-close",
            w = function () {},
            k = !!window.jQuery,
            T = e(window),
            b = function (e, i) {
                t.ev.on(h + e + m, i);
            },
            S = function (t, i, o, n) {
                var s = document.createElement("div");
                return (s.className = "mfp-" + t), o && (s.innerHTML = o), n ? i && i.appendChild(s) : ((s = e(s)), i && s.appendTo(i)), s;
            },
            C = function (i, o) {
                t.ev.triggerHandler(h + i, o), t.st.callbacks && ((i = i.charAt(0).toLowerCase() + i.slice(1)), t.st.callbacks[i] && t.st.callbacks[i].apply(t, e.isArray(o) ? o : [o]));
            },
            $ = function (i) {
                return (i === r && t.currTemplate.closeBtn) || ((t.currTemplate.closeBtn = e(t.st.closeMarkup.replace("%title%", t.st.tClose))), (r = i)), t.currTemplate.closeBtn;
            },
            x = function () {
                e.magnificPopup.instance || ((t = new w()), t.init(), (e.magnificPopup.instance = t));
            },
            O = function () {
                var e = document.createElement("p").style,
                    t = ["ms", "O", "Moz", "Webkit"];
                if (void 0 !== e.transition) return !0;
                for (; t.length; ) if (t.pop() + "Transition" in e) return !0;
                return !1;
            };
        (w.prototype = {
            constructor: w,
            init: function () {
                var i = navigator.appVersion;
                (t.isLowIE = t.isIE8 = document.all && !document.addEventListener),
                    (t.isAndroid = /android/gi.test(i)),
                    (t.isIOS = /iphone|ipad|ipod/gi.test(i)),
                    (t.supportsTransition = O()),
                    (t.probablyMobile = t.isAndroid || t.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent)),
                    (o = e(document)),
                    (t.popupsCache = {});
            },
            open: function (i) {
                var n;
                if (i.isObj === !1) {
                    (t.items = i.items.toArray()), (t.index = 0);
                    var r,
                        a = i.items;
                    for (n = 0; n < a.length; n++)
                        if (((r = a[n]), r.parsed && (r = r.el[0]), r === i.el[0])) {
                            t.index = n;
                            break;
                        }
                } else (t.items = e.isArray(i.items) ? i.items : [i.items]), (t.index = i.index || 0);
                if (t.isOpen) return void t.updateItemHTML();
                (t.types = []),
                    (s = ""),
                    i.mainEl && i.mainEl.length ? (t.ev = i.mainEl.eq(0)) : (t.ev = o),
                    i.key ? (t.popupsCache[i.key] || (t.popupsCache[i.key] = {}), (t.currTemplate = t.popupsCache[i.key])) : (t.currTemplate = {}),
                    (t.st = e.extend(!0, {}, e.magnificPopup.defaults, i)),
                    (t.fixedContentPos = "auto" === t.st.fixedContentPos ? !t.probablyMobile : t.st.fixedContentPos),
                    t.st.modal && ((t.st.closeOnContentClick = !1), (t.st.closeOnBgClick = !1), (t.st.showCloseBtn = !1), (t.st.enableEscapeKey = !1)),
                    t.bgOverlay ||
                        ((t.bgOverlay = S("bg").on("click" + m, function () {
                            t.close();
                        })),
                        (t.wrap = S("wrap")
                            .attr("tabindex", -1)
                            .on("click" + m, function (e) {
                                t._checkIfClose(e.target) && t.close();
                            })),
                        (t.container = S("container", t.wrap))),
                    (t.contentContainer = S("content")),
                    t.st.preloader && (t.preloader = S("preloader", t.container, t.st.tLoading));
                var l = e.magnificPopup.modules;
                for (n = 0; n < l.length; n++) {
                    var d = l[n];
                    (d = d.charAt(0).toUpperCase() + d.slice(1)), t["init" + d].call(t);
                }
                C("BeforeOpen"),
                    t.st.showCloseBtn &&
                        (t.st.closeBtnInside
                            ? (b(p, function (e, t, i, o) {
                                  i.close_replaceWith = $(o.type);
                              }),
                              (s += " mfp-close-btn-in"))
                            : t.wrap.append($())),
                    t.st.alignTop && (s += " mfp-align-top"),
                    t.fixedContentPos ? t.wrap.css({ overflow: t.st.overflowY, overflowX: "hidden", overflowY: t.st.overflowY }) : t.wrap.css({ top: T.scrollTop(), position: "absolute" }),
                    (t.st.fixedBgPos === !1 || ("auto" === t.st.fixedBgPos && !t.fixedContentPos)) && t.bgOverlay.css({ height: o.height(), position: "absolute" }),
                    t.st.enableEscapeKey &&
                        o.on("keyup" + m, function (e) {
                            27 === e.keyCode && t.close();
                        }),
                    T.on("resize" + m, function () {
                        t.updateSize();
                    }),
                    t.st.closeOnContentClick || (s += " mfp-auto-cursor"),
                    s && t.wrap.addClass(s);
                var c = (t.wH = T.height()),
                    f = {};
                if (t.fixedContentPos && t._hasScrollBar(c)) {
                    var h = t._getScrollbarSize();
                    h && (f.marginRight = h);
                }
                t.fixedContentPos && (t.isIE7 ? e("body, html").css("overflow", "hidden") : (f.overflow = "hidden"));
                var v = t.st.mainClass;
                return (
                    t.isIE7 && (v += " mfp-ie7"),
                    v && t._addClassToMFP(v),
                    t.updateItemHTML(),
                    C("BuildControls"),
                    e("html").css(f),
                    t.bgOverlay.add(t.wrap).prependTo(t.st.prependTo || e(document.body)),
                    (t._lastFocusedEl = document.activeElement),
                    setTimeout(function () {
                        t.content ? (t._addClassToMFP(g), t._setFocus()) : t.bgOverlay.addClass(g), o.on("focusin" + m, t._onFocusIn);
                    }, 16),
                    (t.isOpen = !0),
                    t.updateSize(c),
                    C(u),
                    i
                );
            },
            close: function () {
                t.isOpen &&
                    (C(l),
                    (t.isOpen = !1),
                    t.st.removalDelay && !t.isLowIE && t.supportsTransition
                        ? (t._addClassToMFP(v),
                          setTimeout(function () {
                              t._close();
                          }, t.st.removalDelay))
                        : t._close());
            },
            _close: function () {
                C(a);
                var i = v + " " + g + " ";
                if ((t.bgOverlay.detach(), t.wrap.detach(), t.container.empty(), t.st.mainClass && (i += t.st.mainClass + " "), t._removeClassFromMFP(i), t.fixedContentPos)) {
                    var n = { marginRight: "" };
                    t.isIE7 ? e("body, html").css("overflow", "") : (n.overflow = ""), e("html").css(n);
                }
                o.off("keyup" + m + " focusin" + m),
                    t.ev.off(m),
                    t.wrap.attr("class", "mfp-wrap").removeAttr("style"),
                    t.bgOverlay.attr("class", "mfp-bg"),
                    t.container.attr("class", "mfp-container"),
                    !t.st.showCloseBtn || (t.st.closeBtnInside && t.currTemplate[t.currItem.type] !== !0) || (t.currTemplate.closeBtn && t.currTemplate.closeBtn.detach()),
                    t.st.autoFocusLast && t._lastFocusedEl && e(t._lastFocusedEl).focus(),
                    (t.currItem = null),
                    (t.content = null),
                    (t.currTemplate = null),
                    (t.prevHeight = 0),
                    C(d);
            },
            updateSize: function (e) {
                if (t.isIOS) {
                    var i = document.documentElement.clientWidth / window.innerWidth,
                        o = window.innerHeight * i;
                    t.wrap.css("height", o), (t.wH = o);
                } else t.wH = e || T.height();
                t.fixedContentPos || t.wrap.css("height", t.wH), C("Resize");
            },
            updateItemHTML: function () {
                var i = t.items[t.index];
                t.contentContainer.detach(), t.content && t.content.detach(), i.parsed || (i = t.parseEl(t.index));
                var o = i.type;
                if ((C("BeforeChange", [t.currItem ? t.currItem.type : "", o]), (t.currItem = i), !t.currTemplate[o])) {
                    var s = !!t.st[o] && t.st[o].markup;
                    C("FirstMarkupParse", s), s ? (t.currTemplate[o] = e(s)) : (t.currTemplate[o] = !0);
                }
                n && n !== i.type && t.container.removeClass("mfp-" + n + "-holder");
                var r = t["get" + o.charAt(0).toUpperCase() + o.slice(1)](i, t.currTemplate[o]);
                t.appendContent(r, o), (i.preloaded = !0), C(f, i), (n = i.type), t.container.prepend(t.contentContainer), C("AfterChange");
            },
            appendContent: function (e, i) {
                (t.content = e),
                    e ? (t.st.showCloseBtn && t.st.closeBtnInside && t.currTemplate[i] === !0 ? t.content.find(".mfp-close").length || t.content.append($()) : (t.content = e)) : (t.content = ""),
                    C(c),
                    t.container.addClass("mfp-" + i + "-holder"),
                    t.contentContainer.append(t.content);
            },
            parseEl: function (i) {
                var o,
                    n = t.items[i];
                if ((n.tagName ? (n = { el: e(n) }) : ((o = n.type), (n = { data: n, src: n.src })), n.el)) {
                    for (var s = t.types, r = 0; r < s.length; r++)
                        if (n.el.hasClass("mfp-" + s[r])) {
                            o = s[r];
                            break;
                        }
                    (n.src = n.el.attr("data-mfp-src")), n.src || (n.src = n.el.attr("href"));
                }
                return (n.type = o || t.st.type || "inline"), (n.index = i), (n.parsed = !0), (t.items[i] = n), C("ElementParse", n), t.items[i];
            },
            addGroup: function (e, i) {
                var o = function (o) {
                    (o.mfpEl = this), t._openClick(o, e, i);
                };
                i || (i = {});
                var n = "click.magnificPopup";
                (i.mainEl = e), i.items ? ((i.isObj = !0), e.off(n).on(n, o)) : ((i.isObj = !1), i.delegate ? e.off(n).on(n, i.delegate, o) : ((i.items = e), e.off(n).on(n, o)));
            },
            _openClick: function (i, o, n) {
                var s = void 0 !== n.midClick ? n.midClick : e.magnificPopup.defaults.midClick;
                if (s || !(2 === i.which || i.ctrlKey || i.metaKey || i.altKey || i.shiftKey)) {
                    var r = void 0 !== n.disableOn ? n.disableOn : e.magnificPopup.defaults.disableOn;
                    if (r)
                        if (e.isFunction(r)) {
                            if (!r.call(t)) return !0;
                        } else if (T.width() < r) return !0;
                    i.type && (i.preventDefault(), t.isOpen && i.stopPropagation()), (n.el = e(i.mfpEl)), n.delegate && (n.items = o.find(n.delegate)), t.open(n);
                }
            },
            updateStatus: function (e, o) {
                if (t.preloader) {
                    i !== e && t.container.removeClass("mfp-s-" + i), o || "loading" !== e || (o = t.st.tLoading);
                    var n = { status: e, text: o };
                    C("UpdateStatus", n),
                        (e = n.status),
                        (o = n.text),
                        t.preloader.html(o),
                        t.preloader.find("a").on("click", function (e) {
                            e.stopImmediatePropagation();
                        }),
                        t.container.addClass("mfp-s-" + e),
                        (i = e);
                }
            },
            _checkIfClose: function (i) {
                if (!e(i).hasClass(y)) {
                    var o = t.st.closeOnContentClick,
                        n = t.st.closeOnBgClick;
                    if (o && n) return !0;
                    if (!t.content || e(i).hasClass("mfp-close") || (t.preloader && i === t.preloader[0])) return !0;
                    if (i === t.content[0] || e.contains(t.content[0], i)) {
                        if (o) return !0;
                    } else if (n && e.contains(document, i)) return !0;
                    return !1;
                }
            },
            _addClassToMFP: function (e) {
                t.bgOverlay.addClass(e), t.wrap.addClass(e);
            },
            _removeClassFromMFP: function (e) {
                this.bgOverlay.removeClass(e), t.wrap.removeClass(e);
            },
            _hasScrollBar: function (e) {
                return (t.isIE7 ? o.height() : document.body.scrollHeight) > (e || T.height());
            },
            _setFocus: function () {
                (t.st.focus ? t.content.find(t.st.focus).eq(0) : t.wrap).focus();
            },
            _onFocusIn: function (i) {
                if (i.target !== t.wrap[0] && !e.contains(t.wrap[0], i.target)) return t._setFocus(), !1;
            },
            _parseMarkup: function (t, i, o) {
                var n;
                o.data && (i = e.extend(o.data, i)),
                    C(p, [t, i, o]),
                    e.each(i, function (i, o) {
                        if (void 0 === o || o === !1) return !0;
                        if (((n = i.split("_")), n.length > 1)) {
                            var s = t.find(m + "-" + n[0]);
                            if (s.length > 0) {
                                var r = n[1];
                                "replaceWith" === r ? s[0] !== o[0] && s.replaceWith(o) : "img" === r ? (s.is("img") ? s.attr("src", o) : s.replaceWith(e("<img>").attr("src", o).attr("class", s.attr("class")))) : s.attr(n[1], o);
                            }
                        } else t.find(m + "-" + i).html(o);
                    });
            },
            _getScrollbarSize: function () {
                if (void 0 === t.scrollbarSize) {
                    var e = document.createElement("div");
                    (e.style.cssText = "width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;"), document.body.appendChild(e), (t.scrollbarSize = e.offsetWidth - e.clientWidth), document.body.removeChild(e);
                }
                return t.scrollbarSize;
            },
        }),
            (e.magnificPopup = {
                instance: null,
                proto: w.prototype,
                modules: [],
                open: function (t, i) {
                    return x(), (t = t ? e.extend(!0, {}, t) : {}), (t.isObj = !0), (t.index = i || 0), this.instance.open(t);
                },
                close: function () {
                    return e.magnificPopup.instance && e.magnificPopup.instance.close();
                },
                registerModule: function (t, i) {
                    i.options && (e.magnificPopup.defaults[t] = i.options), e.extend(this.proto, i.proto), this.modules.push(t);
                },
                defaults: {
                    disableOn: 0,
                    key: null,
                    midClick: !1,
                    mainClass: "",
                    preloader: !0,
                    focus: "",
                    closeOnContentClick: !1,
                    closeOnBgClick: !0,
                    closeBtnInside: !0,
                    showCloseBtn: !0,
                    enableEscapeKey: !0,
                    modal: !1,
                    alignTop: !1,
                    removalDelay: 0,
                    prependTo: null,
                    fixedContentPos: "auto",
                    fixedBgPos: "auto",
                    overflowY: "auto",
                    closeMarkup: '<button title="%title%" type="button" class="mfp-close">&#215;</button>',
                    tClose: "Close (Esc)",
                    tLoading: "Loading...",
                    autoFocusLast: !0,
                },
            }),
            (e.fn.magnificPopup = function (i) {
                x();
                var o = e(this);
                if ("string" == typeof i)
                    if ("open" === i) {
                        var n,
                            s = k ? o.data("magnificPopup") : o[0].magnificPopup,
                            r = parseInt(arguments[1], 10) || 0;
                        s.items ? (n = s.items[r]) : ((n = o), s.delegate && (n = n.find(s.delegate)), (n = n.eq(r))), t._openClick({ mfpEl: n }, o, s);
                    } else t.isOpen && t[i].apply(t, Array.prototype.slice.call(arguments, 1));
                else (i = e.extend(!0, {}, i)), k ? o.data("magnificPopup", i) : (o[0].magnificPopup = i), t.addGroup(o, i);
                return o;
            });
        var E,
            I,
            P,
            A = "inline",
            L = function () {
                P && (I.after(P.addClass(E)).detach(), (P = null));
            };
        e.magnificPopup.registerModule(A, {
            options: { hiddenClass: "hide", markup: "", tNotFound: "Content not found" },
            proto: {
                initInline: function () {
                    t.types.push(A),
                        b(a + "." + A, function () {
                            L();
                        });
                },
                getInline: function (i, o) {
                    if ((L(), i.src)) {
                        var n = t.st.inline,
                            s = e(i.src);
                        if (s.length) {
                            var r = s[0].parentNode;
                            r && r.tagName && (I || ((E = n.hiddenClass), (I = S(E)), (E = "mfp-" + E)), (P = s.after(I).detach().removeClass(E))), t.updateStatus("ready");
                        } else t.updateStatus("error", n.tNotFound), (s = e("<div>"));
                        return (i.inlineElement = s), s;
                    }
                    return t.updateStatus("ready"), t._parseMarkup(o, {}, i), o;
                },
            },
        });
        var z,
            M = "ajax",
            H = function () {
                z && e(document.body).removeClass(z);
            },
            N = function () {
                H(), t.req && t.req.abort();
            };
        e.magnificPopup.registerModule(M, {
            options: { settings: null, cursor: "mfp-ajax-cur", tError: '<a href="%url%">The content</a> could not be loaded.' },
            proto: {
                initAjax: function () {
                    t.types.push(M), (z = t.st.ajax.cursor), b(a + "." + M, N), b("BeforeChange." + M, N);
                },
                getAjax: function (i) {
                    z && e(document.body).addClass(z), t.updateStatus("loading");
                    var o = e.extend(
                        {
                            url: i.src,
                            success: function (o, n, s) {
                                var r = { data: o, xhr: s };
                                C("ParseAjax", r),
                                    t.appendContent(e(r.data), M),
                                    (i.finished = !0),
                                    H(),
                                    t._setFocus(),
                                    setTimeout(function () {
                                        t.wrap.addClass(g);
                                    }, 16),
                                    t.updateStatus("ready"),
                                    C("AjaxContentAdded");
                            },
                            error: function () {
                                H(), (i.finished = i.loadError = !0), t.updateStatus("error", t.st.ajax.tError.replace("%url%", i.src));
                            },
                        },
                        t.st.ajax.settings
                    );
                    return (t.req = e.ajax(o)), "";
                },
            },
        });
        var j,
            _ = function (i) {
                if (i.data && void 0 !== i.data.title) return i.data.title;
                var o = t.st.image.titleSrc;
                if (o) {
                    if (e.isFunction(o)) return o.call(t, i);
                    if (i.el) return i.el.attr(o) || "";
                }
                return "";
            };
        e.magnificPopup.registerModule("image", {
            options: {
                markup:
                    '<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>',
                cursor: "mfp-zoom-out-cur",
                titleSrc: "title",
                verticalFit: !0,
                tError: '<a href="%url%">The image</a> could not be loaded.',
            },
            proto: {
                initImage: function () {
                    var i = t.st.image,
                        o = ".image";
                    t.types.push("image"),
                        b(u + o, function () {
                            "image" === t.currItem.type && i.cursor && e(document.body).addClass(i.cursor);
                        }),
                        b(a + o, function () {
                            i.cursor && e(document.body).removeClass(i.cursor), T.off("resize" + m);
                        }),
                        b("Resize" + o, t.resizeImage),
                        t.isLowIE && b("AfterChange", t.resizeImage);
                },
                resizeImage: function () {
                    var e = t.currItem;
                    if (e && e.img && t.st.image.verticalFit) {
                        var i = 0;
                        t.isLowIE && (i = parseInt(e.img.css("padding-top"), 10) + parseInt(e.img.css("padding-bottom"), 10)), e.img.css("max-height", t.wH - i);
                    }
                },
                _onImageHasSize: function (e) {
                    e.img && ((e.hasSize = !0), j && clearInterval(j), (e.isCheckingImgSize = !1), C("ImageHasSize", e), e.imgHidden && (t.content && t.content.removeClass("mfp-loading"), (e.imgHidden = !1)));
                },
                findImageSize: function (e) {
                    var i = 0,
                        o = e.img[0],
                        n = function (s) {
                            j && clearInterval(j),
                                (j = setInterval(function () {
                                    return o.naturalWidth > 0 ? void t._onImageHasSize(e) : (i > 200 && clearInterval(j), i++, void (3 === i ? n(10) : 40 === i ? n(50) : 100 === i && n(500)));
                                }, s));
                        };
                    n(1);
                },
                getImage: function (i, o) {
                    var n = 0,
                        s = function () {
                            i &&
                                (i.img[0].complete
                                    ? (i.img.off(".mfploader"), i === t.currItem && (t._onImageHasSize(i), t.updateStatus("ready")), (i.hasSize = !0), (i.loaded = !0), C("ImageLoadComplete"))
                                    : (n++, n < 200 ? setTimeout(s, 100) : r()));
                        },
                        r = function () {
                            i && (i.img.off(".mfploader"), i === t.currItem && (t._onImageHasSize(i), t.updateStatus("error", a.tError.replace("%url%", i.src))), (i.hasSize = !0), (i.loaded = !0), (i.loadError = !0));
                        },
                        a = t.st.image,
                        l = o.find(".mfp-img");
                    if (l.length) {
                        var d = document.createElement("img");
                        (d.className = "mfp-img"),
                            i.el && i.el.find("img").length && (d.alt = i.el.find("img").attr("alt")),
                            (i.img = e(d).on("load.mfploader", s).on("error.mfploader", r)),
                            (d.src = i.src),
                            l.is("img") && (i.img = i.img.clone()),
                            (d = i.img[0]),
                            d.naturalWidth > 0 ? (i.hasSize = !0) : d.width || (i.hasSize = !1);
                    }
                    return (
                        t._parseMarkup(o, { title: _(i), img_replaceWith: i.img }, i),
                        t.resizeImage(),
                        i.hasSize
                            ? (j && clearInterval(j), i.loadError ? (o.addClass("mfp-loading"), t.updateStatus("error", a.tError.replace("%url%", i.src))) : (o.removeClass("mfp-loading"), t.updateStatus("ready")), o)
                            : (t.updateStatus("loading"), (i.loading = !0), i.hasSize || ((i.imgHidden = !0), o.addClass("mfp-loading"), t.findImageSize(i)), o)
                    );
                },
            },
        });
        var D,
            W = function () {
                return void 0 === D && (D = void 0 !== document.createElement("p").style.MozTransform), D;
            };
        e.magnificPopup.registerModule("zoom", {
            options: {
                enabled: !1,
                easing: "ease-in-out",
                duration: 300,
                opener: function (e) {
                    return e.is("img") ? e : e.find("img");
                },
            },
            proto: {
                initZoom: function () {
                    var e,
                        i = t.st.zoom,
                        o = ".zoom";
                    if (i.enabled && t.supportsTransition) {
                        var n,
                            s,
                            r = i.duration,
                            d = function (e) {
                                var t = e.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"),
                                    o = "all " + i.duration / 1e3 + "s " + i.easing,
                                    n = { position: "fixed", zIndex: 9999, left: 0, top: 0, "-webkit-backface-visibility": "hidden" },
                                    s = "transition";
                                return (n["-webkit-" + s] = n["-moz-" + s] = n["-o-" + s] = n[s] = o), t.css(n), t;
                            },
                            c = function () {
                                t.content.css("visibility", "visible");
                            };
                        b("BuildControls" + o, function () {
                            if (t._allowZoom()) {
                                if ((clearTimeout(n), t.content.css("visibility", "hidden"), (e = t._getItemToZoom()), !e)) return void c();
                                (s = d(e)),
                                    s.css(t._getOffset()),
                                    t.wrap.append(s),
                                    (n = setTimeout(function () {
                                        s.css(t._getOffset(!0)),
                                            (n = setTimeout(function () {
                                                c(),
                                                    setTimeout(function () {
                                                        s.remove(), (e = s = null), C("ZoomAnimationEnded");
                                                    }, 16);
                                            }, r));
                                    }, 16));
                            }
                        }),
                            b(l + o, function () {
                                if (t._allowZoom()) {
                                    if ((clearTimeout(n), (t.st.removalDelay = r), !e)) {
                                        if (((e = t._getItemToZoom()), !e)) return;
                                        s = d(e);
                                    }
                                    s.css(t._getOffset(!0)),
                                        t.wrap.append(s),
                                        t.content.css("visibility", "hidden"),
                                        setTimeout(function () {
                                            s.css(t._getOffset());
                                        }, 16);
                                }
                            }),
                            b(a + o, function () {
                                t._allowZoom() && (c(), s && s.remove(), (e = null));
                            });
                    }
                },
                _allowZoom: function () {
                    return "image" === t.currItem.type;
                },
                _getItemToZoom: function () {
                    return !!t.currItem.hasSize && t.currItem.img;
                },
                _getOffset: function (i) {
                    var o;
                    o = i ? t.currItem.img : t.st.zoom.opener(t.currItem.el || t.currItem);
                    var n = o.offset(),
                        s = parseInt(o.css("padding-top"), 10),
                        r = parseInt(o.css("padding-bottom"), 10);
                    n.top -= e(window).scrollTop() - s;
                    var a = { width: o.width(), height: (k ? o.innerHeight() : o[0].offsetHeight) - r - s };
                    return W() ? (a["-moz-transform"] = a.transform = "translate(" + n.left + "px," + n.top + "px)") : ((a.left = n.left), (a.top = n.top)), a;
                },
            },
        });
        var F = "iframe",
            R = "//about:blank",
            B = function (e) {
                if (t.currTemplate[F]) {
                    var i = t.currTemplate[F].find("iframe");
                    i.length && (e || (i[0].src = R), t.isIE8 && i.css("display", e ? "block" : "none"));
                }
            };
        e.magnificPopup.registerModule(F, {
            options: {
                markup: '<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>',
                srcAction: "iframe_src",
                patterns: {
                    youtube: { index: "youtube.com", id: "v=", src: "//www.youtube.com/embed/%id%?autoplay=1" },
                    vimeo: { index: "vimeo.com/", id: "/", src: "//player.vimeo.com/video/%id%?autoplay=1" },
                    gmaps: { index: "//maps.google.", src: "%id%&output=embed" },
                },
            },
            proto: {
                initIframe: function () {
                    t.types.push(F),
                        b("BeforeChange", function (e, t, i) {
                            t !== i && (t === F ? B() : i === F && B(!0));
                        }),
                        b(a + "." + F, function () {
                            B();
                        });
                },
                getIframe: function (i, o) {
                    var n = i.src,
                        s = t.st.iframe;
                    e.each(s.patterns, function () {
                        if (n.indexOf(this.index) > -1) return this.id && (n = "string" == typeof this.id ? n.substr(n.lastIndexOf(this.id) + this.id.length, n.length) : this.id.call(this, n)), (n = this.src.replace("%id%", n)), !1;
                    });
                    var r = {};
                    return s.srcAction && (r[s.srcAction] = n), t._parseMarkup(o, r, i), t.updateStatus("ready"), o;
                },
            },
        });
        var q = function (e) {
                var i = t.items.length;
                return e > i - 1 ? e - i : e < 0 ? i + e : e;
            },
            U = function (e, t, i) {
                return e.replace(/%curr%/gi, t + 1).replace(/%total%/gi, i);
            };
        e.magnificPopup.registerModule("gallery", {
            options: {
                enabled: !1,
                arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
                preload: [0, 2],
                navigateByImgClick: !0,
                arrows: !0,
                tPrev: "Previous (Left arrow key)",
                tNext: "Next (Right arrow key)",
                tCounter: "%curr% of %total%",
            },
            proto: {
                initGallery: function () {
                    var i = t.st.gallery,
                        n = ".mfp-gallery";
                    return (
                        (t.direction = !0),
                        !(!i || !i.enabled) &&
                            ((s += " mfp-gallery"),
                            b(u + n, function () {
                                i.navigateByImgClick &&
                                    t.wrap.on("click" + n, ".mfp-img", function () {
                                        if (t.items.length > 1) return t.next(), !1;
                                    }),
                                    o.on("keydown" + n, function (e) {
                                        37 === e.keyCode ? t.prev() : 39 === e.keyCode && t.next();
                                    });
                            }),
                            b("UpdateStatus" + n, function (e, i) {
                                i.text && (i.text = U(i.text, t.currItem.index, t.items.length));
                            }),
                            b(p + n, function (e, o, n, s) {
                                var r = t.items.length;
                                n.counter = r > 1 ? U(i.tCounter, s.index, r) : "";
                            }),
                            b("BuildControls" + n, function () {
                                if (t.items.length > 1 && i.arrows && !t.arrowLeft) {
                                    var o = i.arrowMarkup,
                                        n = (t.arrowLeft = e(o.replace(/%title%/gi, i.tPrev).replace(/%dir%/gi, "left")).addClass(y)),
                                        s = (t.arrowRight = e(o.replace(/%title%/gi, i.tNext).replace(/%dir%/gi, "right")).addClass(y));
                                    n.click(function () {
                                        t.prev();
                                    }),
                                        s.click(function () {
                                            t.next();
                                        }),
                                        t.container.append(n.add(s));
                                }
                            }),
                            b(f + n, function () {
                                t._preloadTimeout && clearTimeout(t._preloadTimeout),
                                    (t._preloadTimeout = setTimeout(function () {
                                        t.preloadNearbyImages(), (t._preloadTimeout = null);
                                    }, 16));
                            }),
                            void b(a + n, function () {
                                o.off(n), t.wrap.off("click" + n), (t.arrowRight = t.arrowLeft = null);
                            }))
                    );
                },
                next: function () {
                    (t.direction = !0), (t.index = q(t.index + 1)), t.updateItemHTML();
                },
                prev: function () {
                    (t.direction = !1), (t.index = q(t.index - 1)), t.updateItemHTML();
                },
                goTo: function (e) {
                    (t.direction = e >= t.index), (t.index = e), t.updateItemHTML();
                },
                preloadNearbyImages: function () {
                    var e,
                        i = t.st.gallery.preload,
                        o = Math.min(i[0], t.items.length),
                        n = Math.min(i[1], t.items.length);
                    for (e = 1; e <= (t.direction ? n : o); e++) t._preloadItem(t.index + e);
                    for (e = 1; e <= (t.direction ? o : n); e++) t._preloadItem(t.index - e);
                },
                _preloadItem: function (i) {
                    if (((i = q(i)), !t.items[i].preloaded)) {
                        var o = t.items[i];
                        o.parsed || (o = t.parseEl(i)),
                            C("LazyLoad", o),
                            "image" === o.type &&
                                (o.img = e('<img class="mfp-img" />')
                                    .on("load.mfploader", function () {
                                        o.hasSize = !0;
                                    })
                                    .on("error.mfploader", function () {
                                        (o.hasSize = !0), (o.loadError = !0), C("LazyLoadError", o);
                                    })
                                    .attr("src", o.src)),
                            (o.preloaded = !0);
                    }
                },
            },
        });
        var Y = "retina";
        e.magnificPopup.registerModule(Y, {
            options: {
                replaceSrc: function (e) {
                    return e.src.replace(/\.\w+$/, function (e) {
                        return "@2x" + e;
                    });
                },
                ratio: 1,
            },
            proto: {
                initRetina: function () {
                    if (window.devicePixelRatio > 1) {
                        var e = t.st.retina,
                            i = e.ratio;
                        (i = isNaN(i) ? i() : i),
                            i > 1 &&
                                (b("ImageHasSize." + Y, function (e, t) {
                                    t.img.css({ "max-width": t.img[0].naturalWidth / i, width: "100%" });
                                }),
                                b("ElementParse." + Y, function (t, o) {
                                    o.src = e.replaceSrc(o, i);
                                }));
                    }
                },
            },
        }),
            x();
    }),
    Array.prototype.find ||
        Object.defineProperty(Array.prototype, "find", {
            value: function (e) {
                if (null == this) throw new TypeError('"this" is null or not defined');
                var t = Object(this),
                    i = t.length >>> 0;
                if ("function" != typeof e) throw new TypeError("predicate must be a function");
                for (var o = arguments[1], n = 0; n < i; ) {
                    var s = t[n];
                    if (e.call(o, s, n, t)) return s;
                    n++;
                }
            },
        }),
    !(function (e, t) {
        "function" == typeof define && define.amd
            ? define(["jquery"], function (i) {
                  return t(e, i);
              })
            : "object" == typeof exports
            ? t(e, require("jquery"))
            : t(e, e.jQuery || e.Zepto);
    })(this, function (e, t) {
        "use strict";
        function i(e) {
            if (b && "none" === e.css("animation-name") && "none" === e.css("-webkit-animation-name") && "none" === e.css("-moz-animation-name") && "none" === e.css("-o-animation-name") && "none" === e.css("-ms-animation-name")) return 0;
            var t,
                i,
                o,
                n,
                s = e.css("animation-duration") || e.css("-webkit-animation-duration") || e.css("-moz-animation-duration") || e.css("-o-animation-duration") || e.css("-ms-animation-duration") || "0s",
                r = e.css("animation-delay") || e.css("-webkit-animation-delay") || e.css("-moz-animation-delay") || e.css("-o-animation-delay") || e.css("-ms-animation-delay") || "0s",
                a = e.css("animation-iteration-count") || e.css("-webkit-animation-iteration-count") || e.css("-moz-animation-iteration-count") || e.css("-o-animation-iteration-count") || e.css("-ms-animation-iteration-count") || "1";
            for (s = s.split(", "), r = r.split(", "), a = a.split(", "), n = 0, i = s.length, t = Number.NEGATIVE_INFINITY; n < i; n++) (o = parseFloat(s[n]) * parseInt(a[n], 10) + parseFloat(r[n])), o > t && (t = o);
            return t;
        }
        function o() {
            if (t(document.body).height() <= t(window).height()) return 0;
            var e,
                i,
                o = document.createElement("div"),
                n = document.createElement("div");
            return (
                (o.style.visibility = "hidden"),
                (o.style.width = "100px"),
                document.body.appendChild(o),
                (e = o.offsetWidth),
                (o.style.overflow = "scroll"),
                (n.style.width = "100%"),
                o.appendChild(n),
                (i = n.offsetWidth),
                o.parentNode.removeChild(o),
                e - i
            );
        }
        function n() {
            if (!S) {
                var e,
                    i,
                    n = t("html"),
                    s = c("is-locked");
                n.hasClass(s) || ((i = t(document.body)), (e = parseInt(i.css("padding-right"), 10) + o()), i.css("padding-right", e + "px"), n.addClass(s));
            }
        }
        function s() {
            if (!S) {
                var e,
                    i,
                    n = t("html"),
                    s = c("is-locked");
                n.hasClass(s) && ((i = t(document.body)), (e = parseInt(i.css("padding-right"), 10) - o()), i.css("padding-right", e + "px"), n.removeClass(s));
            }
        }
        function r(e, t, i, o) {
            var n = c("is", t),
                s = [c("is", k.CLOSING), c("is", k.OPENING), c("is", k.CLOSED), c("is", k.OPENED)].join(" ");
            e.$bg.removeClass(s).addClass(n), e.$overlay.removeClass(s).addClass(n), e.$wrapper.removeClass(s).addClass(n), e.$modal.removeClass(s).addClass(n), (e.state = t), !i && e.$modal.trigger({ type: t, reason: o }, [{ reason: o }]);
        }
        function a(e, o, n) {
            var s = 0,
                r = function (e) {
                    e.target === this && s++;
                },
                a = function (e) {
                    e.target === this &&
                        0 === --s &&
                        (t.each(["$bg", "$overlay", "$wrapper", "$modal"], function (e, t) {
                            n[t].off(v + " " + y);
                        }),
                        o());
                };
            t.each(["$bg", "$overlay", "$wrapper", "$modal"], function (e, t) {
                n[t].on(v, r).on(y, a);
            }),
                e(),
                0 === i(n.$bg) &&
                    0 === i(n.$overlay) &&
                    0 === i(n.$wrapper) &&
                    0 === i(n.$modal) &&
                    (t.each(["$bg", "$overlay", "$wrapper", "$modal"], function (e, t) {
                        n[t].off(v + " " + y);
                    }),
                    o());
        }
        function l(e) {
            e.state !== k.CLOSED &&
                (t.each(["$bg", "$overlay", "$wrapper", "$modal"], function (t, i) {
                    e[i].off(v + " " + y);
                }),
                e.$bg.removeClass(e.settings.modifier),
                e.$overlay.removeClass(e.settings.modifier).hide(),
                e.$wrapper.hide(),
                s(),
                r(e, k.CLOSED, !0));
        }
        function d(e) {
            var t,
                i,
                o,
                n,
                s = {};
            for (e = e.replace(/\s*:\s*/g, ":").replace(/\s*,\s*/g, ","), t = e.split(","), n = 0, i = t.length; n < i; n++)
                (t[n] = t[n].split(":")),
                    (o = t[n][1]),
                    ("string" == typeof o || o instanceof String) && (o = "true" === o || ("false" !== o && o)),
                    ("string" == typeof o || o instanceof String) && (o = isNaN(o) ? o : +o),
                    (s[t[n][0]] = o);
            return s;
        }
        function c() {
            for (var e = g, t = 0; t < arguments.length; ++t) e += "-" + arguments[t];
            return e;
        }
        function p() {
            var e,
                i,
                o = location.hash.replace("#", "");
            if (o) {
                try {
                    i = t('[data-remodal-id="' + o + '"]');
                } catch (n) {}
                i && i.length && ((e = t[m].lookup[i.data(m)]), e && e.settings.hashTracking && e.open());
            } else f && f.state === k.OPENED && f.settings.hashTracking && f.close();
        }
        function u(e, i) {
            var o = t(document.body),
                n = o,
                s = this;
            (s.settings = t.extend({}, w, i)),
                (s.index = t[m].lookup.push(s) - 1),
                (s.state = k.CLOSED),
                (s.$overlay = t("." + c("overlay"))),
                null !== s.settings.appendTo && s.settings.appendTo.length && (n = t(s.settings.appendTo)),
                s.$overlay.length ||
                    ((s.$overlay = t("<div>")
                        .addClass(c("overlay") + " " + c("is", k.CLOSED))
                        .hide()),
                    n.append(s.$overlay)),
                (s.$bg = t("." + c("bg")).addClass(c("is", k.CLOSED))),
                (s.$modal = e.addClass(g + " " + c("is-initialized") + " " + s.settings.modifier + " " + c("is", k.CLOSED)).attr("tabindex", "-1")),
                (s.$wrapper = t("<div>")
                    .addClass(c("wrapper") + " " + s.settings.modifier + " " + c("is", k.CLOSED))
                    .hide()
                    .append(s.$modal)),
                n.append(s.$wrapper),
                s.$wrapper.on("click." + g, '[data-remodal-action="close"]', function (e) {
                    e.preventDefault(), s.close();
                }),
                s.$wrapper.on("click." + g, '[data-remodal-action="cancel"]', function (e) {
                    e.preventDefault(), s.$modal.trigger(T.CANCELLATION), s.settings.closeOnCancel && s.close(T.CANCELLATION);
                }),
                s.$wrapper.on("click." + g, '[data-remodal-action="confirm"]', function (e) {
                    e.preventDefault(), s.$modal.trigger(T.CONFIRMATION), s.settings.closeOnConfirm && s.close(T.CONFIRMATION);
                }),
                s.$wrapper.on("click." + g, function (e) {
                    var i = t(e.target);
                    i.hasClass(c("wrapper")) && s.settings.closeOnOutsideClick && s.close();
                });
        }
        var f,
            h,
            m = "remodal",
            g = (e.REMODAL_GLOBALS && e.REMODAL_GLOBALS.NAMESPACE) || m,
            v = t
                .map(["animationstart", "webkitAnimationStart", "MSAnimationStart", "oAnimationStart"], function (e) {
                    return e + "." + g;
                })
                .join(" "),
            y = t
                .map(["animationend", "webkitAnimationEnd", "MSAnimationEnd", "oAnimationEnd"], function (e) {
                    return e + "." + g;
                })
                .join(" "),
            w = t.extend({ hashTracking: !0, closeOnConfirm: !0, closeOnCancel: !0, closeOnEscape: !0, closeOnOutsideClick: !0, modifier: "", appendTo: null }, e.REMODAL_GLOBALS && e.REMODAL_GLOBALS.DEFAULTS),
            k = { CLOSING: "closing", CLOSED: "closed", OPENING: "opening", OPENED: "opened" },
            T = { CONFIRMATION: "confirmation", CANCELLATION: "cancellation" },
            b = (function () {
                var e = document.createElement("div").style;
                return void 0 !== e.animationName || void 0 !== e.WebkitAnimationName || void 0 !== e.MozAnimationName || void 0 !== e.msAnimationName || void 0 !== e.OAnimationName;
            })(),
            S = /iPad|iPhone|iPod/.test(navigator.platform);
        (u.prototype.open = function () {
            var e,
                i = this;
            i.state !== k.OPENING &&
                i.state !== k.CLOSING &&
                ((e = i.$modal.attr("data-remodal-id")),
                e && i.settings.hashTracking && ((h = t(window).scrollTop()), (location.hash = e)),
                f && f !== i && l(f),
                (f = i),
                n(),
                i.$bg.addClass(i.settings.modifier),
                i.$overlay.addClass(i.settings.modifier).show(),
                i.$wrapper.show().scrollTop(0),
                i.$modal.focus(),
                a(
                    function () {
                        r(i, k.OPENING);
                    },
                    function () {
                        r(i, k.OPENED);
                    },
                    i
                ));
        }),
            (u.prototype.close = function (e) {
                var i = this;
                i.state !== k.OPENING &&
                    i.state !== k.CLOSING &&
                    (i.settings.hashTracking && i.$modal.attr("data-remodal-id") === location.hash.substr(1) && ((location.hash = ""), t(window).scrollTop(h)),
                    a(
                        function () {
                            r(i, k.CLOSING, !1, e);
                        },
                        function () {
                            i.$bg.removeClass(i.settings.modifier), i.$overlay.removeClass(i.settings.modifier).hide(), i.$wrapper.hide(), s(), r(i, k.CLOSED, !1, e);
                        },
                        i
                    ));
            }),
            (u.prototype.getState = function () {
                return this.state;
            }),
            (u.prototype.destroy = function () {
                var e,
                    i = t[m].lookup;
                l(this),
                    this.$wrapper.remove(),
                    delete i[this.index],
                    (e = t.grep(i, function (e) {
                        return !!e;
                    }).length),
                    0 === e && (this.$overlay.remove(), this.$bg.removeClass(c("is", k.CLOSING) + " " + c("is", k.OPENING) + " " + c("is", k.CLOSED) + " " + c("is", k.OPENED)));
            }),
            (t[m] = { lookup: [] }),
            (t.fn[m] = function (e) {
                var i, o;
                return (
                    this.each(function (n, s) {
                        (o = t(s)), null == o.data(m) ? ((i = new u(o, e)), o.data(m, i.index), i.settings.hashTracking && o.attr("data-remodal-id") === location.hash.substr(1) && i.open()) : (i = t[m].lookup[o.data(m)]);
                    }),
                    i
                );
            }),
            t(document).ready(function () {
                t(document).on("click", "[data-remodal-target]", function (e) {
                    e.preventDefault();
                    var i = e.currentTarget,
                        o = i.getAttribute("data-remodal-target"),
                        n = t('[data-remodal-id="' + o + '"]');
                    t[m].lookup[n.data(m)].open();
                }),
                    t(document)
                        .find("." + g)
                        .each(function (e, i) {
                            var o = t(i),
                                n = o.data("remodal-options");
                            n ? ("string" == typeof n || n instanceof String) && (n = d(n)) : (n = {}), o[m](n);
                        }),
                    t(document).on("keydown." + g, function (e) {
                        f && f.settings.closeOnEscape && f.state === k.OPENED && 27 === e.keyCode && f.close();
                    }),
                    t(window).on("hashchange." + g, p);
            });
    }),
    (function (e, t) {
        "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? (module.exports = t()) : (e.RouterRouter = t());
    })(this, function () {
        "use strict";
        var e = /[\-{}\[\]+?.,\\\^$|#\s]/g,
            t = /(\(\?)?:\w+/g,
            i = /\((.*?)\)/g,
            o = /\*\w+/g,
            n = /^[#\/]|\s+$/g,
            s = /\/$/,
            r = function (e) {
                if (e) for (var t, i = Object.keys(e); "undefined" != typeof (t = i.pop()); ) this.route(t, e[t]);
            },
            a = function (e, t) {
                var i = e.exec(t).slice(1);
                return i.map(function (e) {
                    return e ? decodeURIComponent(e) : null;
                });
            },
            l = function (e) {
                return e.replace(n, "").replace(s, "");
            },
            d = function (e, t) {
                return Object.prototype.toString.call(e) === "[object " + t + "]";
            },
            c = function (n) {
                return (
                    (n = n
                        .replace(e, "\\$&")
                        .replace(i, "(?:$1)?")
                        .replace(t, function (e, t) {
                            return t ? e : "([^/?]+)";
                        })
                        .replace(o, "([^?]*?)")),
                    new RegExp("^" + n + "(?:\\?([\\s\\S]*))?$")
                );
            },
            p = function (e) {
                (this.options = e || {}), r(this.options.routes);
            };
        return (
            (p.prototype.route = function (e, t, i) {
                d(e, "RegExp") || (e = c(e)), d(t, "Function") && ((i = t), (t = "")), i || (i = this.options[t]);
                var o = l(window.location.pathname);
                if (e.test(o)) {
                    var n = a(e, o);
                    d(i, "Function") && i.apply(this, n);
                }
                return this;
            }),
            p
        );
    }),
    (Shopify.utils = {
        defaultTo: function (e, t) {
            return null == e || e !== e ? t : e;
        },
    }),
    (Shopify.formatMoney = function (e, t) {
        function i(e, t, i, o) {
            if (((t = Shopify.utils.defaultTo(t, 2)), (i = Shopify.utils.defaultTo(i, ",")), (o = Shopify.utils.defaultTo(o, ".")), isNaN(e) || null == e)) return 0;
            e = (e / 100).toFixed(t);
            var n = e.split("."),
                s = n[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + i),
                r = n[1] ? o + n[1] : "";
            return s + r;
        }
        var o = "${{amount}}";
        "string" == typeof e && (e = e.replace(".", ""));
        var n = "",
            s = /\{\{\s*(\w+)\s*\}\}/,
            r = t || o;
        switch (r.match(s)[1]) {
            case "amount":
                n = i(e, 2);
                break;
            case "amount_no_decimals":
                n = i(e, 0);
                break;
            case "amount_with_comma_separator":
                n = i(e, 2, ".", ",");
                break;
            case "amount_no_decimals_with_comma_separator":
                n = i(e, 0, ".", ",");
                break;
            case "amount_no_decimals_with_space_separator":
                n = i(e, 0, " ");
        }
        return r.replace(s, n);
    }),
    (function (e) {
        "use strict";
        "function" == typeof define && define.amd ? define(["jquery"], e) : "undefined" != typeof exports ? (module.exports = e(require("jquery"))) : e(jQuery);
    })(function (e) {
        "use strict";
        var t = window.Slick || {};
        (t = (function () {
            function t(t, o) {
                var n,
                    s = this;
                (s.defaults = {
                    accessibility: !0,
                    adaptiveHeight: !1,
                    appendArrows: e(t),
                    appendDots: e(t),
                    arrows: !0,
                    asNavFor: null,
                    prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>',
                    nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',
                    autoplay: !1,
                    autoplaySpeed: 3e3,
                    centerMode: !1,
                    centerPadding: "50px",
                    cssEase: "ease",
                    customPaging: function (t, i) {
                        return e('<button type="button" data-role="none" role="button" tabindex="0" />').text(i + 1);
                    },
                    dots: !1,
                    dotsClass: "slick-dots",
                    draggable: !0,
                    easing: "linear",
                    edgeFriction: 0.35,
                    fade: !1,
                    focusOnSelect: !1,
                    infinite: !0,
                    initialSlide: 0,
                    lazyLoad: "ondemand",
                    mobileFirst: !1,
                    pauseOnHover: !0,
                    pauseOnFocus: !0,
                    pauseOnDotsHover: !1,
                    respondTo: "window",
                    responsive: null,
                    rows: 1,
                    rtl: !1,
                    slide: "",
                    slidesPerRow: 1,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    speed: 500,
                    swipe: !0,
                    swipeToSlide: !1,
                    touchMove: !0,
                    touchThreshold: 5,
                    useCSS: !0,
                    useTransform: !0,
                    variableWidth: !1,
                    vertical: !1,
                    verticalSwiping: !1,
                    waitForAnimate: !0,
                    zIndex: 1e3,
                }),
                    (s.initials = {
                        animating: !1,
                        dragging: !1,
                        autoPlayTimer: null,
                        currentDirection: 0,
                        currentLeft: null,
                        currentSlide: 0,
                        direction: 1,
                        $dots: null,
                        listWidth: null,
                        listHeight: null,
                        loadIndex: 0,
                        $nextArrow: null,
                        $prevArrow: null,
                        slideCount: null,
                        slideWidth: null,
                        $slideTrack: null,
                        $slides: null,
                        sliding: !1,
                        slideOffset: 0,
                        swipeLeft: null,
                        $list: null,
                        touchObject: {},
                        transformsEnabled: !1,
                        unslicked: !1,
                    }),
                    e.extend(s, s.initials),
                    (s.activeBreakpoint = null),
                    (s.animType = null),
                    (s.animProp = null),
                    (s.breakpoints = []),
                    (s.breakpointSettings = []),
                    (s.cssTransitions = !1),
                    (s.focussed = !1),
                    (s.interrupted = !1),
                    (s.hidden = "hidden"),
                    (s.paused = !0),
                    (s.positionProp = null),
                    (s.respondTo = null),
                    (s.rowCount = 1),
                    (s.shouldClick = !0),
                    (s.$slider = e(t)),
                    (s.$slidesCache = null),
                    (s.transformType = null),
                    (s.transitionType = null),
                    (s.visibilityChange = "visibilitychange"),
                    (s.windowWidth = 0),
                    (s.windowTimer = null),
                    (n = e(t).data("slick") || {}),
                    (s.options = e.extend({}, s.defaults, o, n)),
                    (s.currentSlide = s.options.initialSlide),
                    (s.originalSettings = s.options),
                    "undefined" != typeof document.mozHidden
                        ? ((s.hidden = "mozHidden"), (s.visibilityChange = "mozvisibilitychange"))
                        : "undefined" != typeof document.webkitHidden && ((s.hidden = "webkitHidden"), (s.visibilityChange = "webkitvisibilitychange")),
                    (s.autoPlay = e.proxy(s.autoPlay, s)),
                    (s.autoPlayClear = e.proxy(s.autoPlayClear, s)),
                    (s.autoPlayIterator = e.proxy(s.autoPlayIterator, s)),
                    (s.changeSlide = e.proxy(s.changeSlide, s)),
                    (s.clickHandler = e.proxy(s.clickHandler, s)),
                    (s.selectHandler = e.proxy(s.selectHandler, s)),
                    (s.setPosition = e.proxy(s.setPosition, s)),
                    (s.swipeHandler = e.proxy(s.swipeHandler, s)),
                    (s.dragHandler = e.proxy(s.dragHandler, s)),
                    (s.keyHandler = e.proxy(s.keyHandler, s)),
                    (s.instanceUid = i++),
                    (s.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/),
                    s.registerBreakpoints(),
                    s.init(!0);
            }
            var i = 0;
            return t;
        })()),
            (t.prototype.activateADA = function () {
                var e = this;
                e.$slideTrack.find(".slick-active").attr({ "aria-hidden": "false" }).find("a, input, button, select").attr({ tabindex: "0" });
            }),
            (t.prototype.addSlide = t.prototype.slickAdd = function (t, i, o) {
                var n = this;
                if ("boolean" == typeof i) (o = i), (i = null);
                else if (i < 0 || i >= n.slideCount) return !1;
                n.unload(),
                    "number" == typeof i
                        ? 0 === i && 0 === n.$slides.length
                            ? e(t).appendTo(n.$slideTrack)
                            : o
                            ? e(t).insertBefore(n.$slides.eq(i))
                            : e(t).insertAfter(n.$slides.eq(i))
                        : o === !0
                        ? e(t).prependTo(n.$slideTrack)
                        : e(t).appendTo(n.$slideTrack),
                    (n.$slides = n.$slideTrack.children(this.options.slide)),
                    n.$slideTrack.children(this.options.slide).detach(),
                    n.$slideTrack.append(n.$slides),
                    n.$slides.each(function (t, i) {
                        e(i).attr("data-slick-index", t);
                    }),
                    (n.$slidesCache = n.$slides),
                    n.reinit();
            }),
            (t.prototype.animateHeight = function () {
                var e = this;
                if (1 === e.options.slidesToShow && e.options.adaptiveHeight === !0 && e.options.vertical === !1) {
                    var t = e.$slides.eq(e.currentSlide).outerHeight(!0);
                    if (1 === t) return;
                    e.$list.animate({ height: t }, e.options.speed);
                }
            }),
            (t.prototype.animateSlide = function (t, i) {
                var o = {},
                    n = this;
                n.animateHeight(),
                    n.options.rtl === !0 && n.options.vertical === !1 && (t = -t),
                    n.transformsEnabled === !1
                        ? n.options.vertical === !1
                            ? n.$slideTrack.animate({ left: t }, n.options.speed, n.options.easing, i)
                            : n.$slideTrack.animate({ top: t }, n.options.speed, n.options.easing, i)
                        : n.cssTransitions === !1
                        ? (n.options.rtl === !0 && (n.currentLeft = -n.currentLeft),
                          e({ animStart: n.currentLeft }).animate(
                              { animStart: t },
                              {
                                  duration: n.options.speed,
                                  easing: n.options.easing,
                                  step: function (e) {
                                      (e = Math.ceil(e)), n.options.vertical === !1 ? ((o[n.animType] = "translate(" + e + "px, 0px)"), n.$slideTrack.css(o)) : ((o[n.animType] = "translate(0px," + e + "px)"), n.$slideTrack.css(o));
                                  },
                                  complete: function () {
                                      i && i.call();
                                  },
                              }
                          ))
                        : (n.applyTransition(),
                          (t = Math.ceil(t)),
                          n.options.vertical === !1 ? (o[n.animType] = "translate3d(" + t + "px, 0px, 0px)") : (o[n.animType] = "translate3d(0px," + t + "px, 0px)"),
                          n.$slideTrack.css(o),
                          i &&
                              setTimeout(function () {
                                  n.disableTransition(), i.call();
                              }, n.options.speed));
            }),
            (t.prototype.getNavTarget = function () {
                var t = this,
                    i = t.options.asNavFor;
                return i && null !== i && (i = e(i).not(t.$slider)), i;
            }),
            (t.prototype.asNavFor = function (t) {
                var i = this,
                    o = i.getNavTarget();
                null !== o &&
                    "object" == typeof o &&
                    o.each(function () {
                        var i = e(this).slick("getSlick");
                        i.unslicked || i.slideHandler(t, !0);
                    });
            }),
            (t.prototype.applyTransition = function (e) {
                var t = this,
                    i = {};
                t.options.fade === !1 ? (i[t.transitionType] = t.transformType + " " + t.options.speed + "ms " + t.options.cssEase) : (i[t.transitionType] = "opacity " + t.options.speed + "ms " + t.options.cssEase),
                    t.options.fade === !1 ? t.$slideTrack.css(i) : t.$slides.eq(e).css(i);
            }),
            (t.prototype.autoPlay = function () {
                var e = this;
                e.autoPlayClear(), e.slideCount > e.options.slidesToShow && (e.autoPlayTimer = setInterval(e.autoPlayIterator, e.options.autoplaySpeed));
            }),
            (t.prototype.autoPlayClear = function () {
                var e = this;
                e.autoPlayTimer && clearInterval(e.autoPlayTimer);
            }),
            (t.prototype.autoPlayIterator = function () {
                var e = this,
                    t = e.currentSlide + e.options.slidesToScroll;
                e.paused ||
                    e.interrupted ||
                    e.focussed ||
                    (e.options.infinite === !1 &&
                        (1 === e.direction && e.currentSlide + 1 === e.slideCount - 1 ? (e.direction = 0) : 0 === e.direction && ((t = e.currentSlide - e.options.slidesToScroll), e.currentSlide - 1 === 0 && (e.direction = 1))),
                    e.slideHandler(t));
            }),
            (t.prototype.buildArrows = function () {
                var t = this;
                t.options.arrows === !0 &&
                    ((t.$prevArrow = e(t.options.prevArrow).addClass("slick-arrow")),
                    (t.$nextArrow = e(t.options.nextArrow).addClass("slick-arrow")),
                    t.slideCount > t.options.slidesToShow
                        ? (t.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),
                          t.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),
                          t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.prependTo(t.options.appendArrows),
                          t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.appendTo(t.options.appendArrows),
                          t.options.infinite !== !0 && t.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true"))
                        : t.$prevArrow.add(t.$nextArrow).addClass("slick-hidden").attr({ "aria-disabled": "true", tabindex: "-1" }));
            }),
            (t.prototype.buildDots = function () {
                var t,
                    i,
                    o = this;
                if (o.options.dots === !0 && o.slideCount > o.options.slidesToShow) {
                    for (o.$slider.addClass("slick-dotted"), i = e("<ul />").addClass(o.options.dotsClass), t = 0; t <= o.getDotCount(); t += 1) i.append(e("<li />").append(o.options.customPaging.call(this, o, t)));
                    (o.$dots = i.appendTo(o.options.appendDots)), o.$dots.find("li").first().addClass("slick-active").attr("aria-hidden", "false");
                }
            }),
            (t.prototype.buildOut = function () {
                var t = this;
                (t.$slides = t.$slider.children(t.options.slide + ":not(.slick-cloned)").addClass("slick-slide")),
                    (t.slideCount = t.$slides.length),
                    t.$slides.each(function (t, i) {
                        e(i)
                            .attr("data-slick-index", t)
                            .data("originalStyling", e(i).attr("style") || "");
                    }),
                    t.$slider.addClass("slick-slider"),
                    (t.$slideTrack = 0 === t.slideCount ? e('<div class="slick-track"/>').appendTo(t.$slider) : t.$slides.wrapAll('<div class="slick-track"/>').parent()),
                    (t.$list = t.$slideTrack.wrap('<div aria-live="polite" class="slick-list"/>').parent()),
                    t.$slideTrack.css("opacity", 0),
                    (t.options.centerMode !== !0 && t.options.swipeToSlide !== !0) || (t.options.slidesToScroll = 1),
                    e("img[data-lazy]", t.$slider).not("[src]").addClass("slick-loading"),
                    t.setupInfinite(),
                    t.buildArrows(),
                    t.buildDots(),
                    t.updateDots(),
                    t.setSlideClasses("number" == typeof t.currentSlide ? t.currentSlide : 0),
                    t.options.draggable === !0 && t.$list.addClass("draggable");
            }),
            (t.prototype.buildRows = function () {
                var e,
                    t,
                    i,
                    o,
                    n,
                    s,
                    r,
                    a = this;
                if (((o = document.createDocumentFragment()), (s = a.$slider.children()), a.options.rows > 1)) {
                    for (r = a.options.slidesPerRow * a.options.rows, n = Math.ceil(s.length / r), e = 0; e < n; e++) {
                        var l = document.createElement("div");
                        for (t = 0; t < a.options.rows; t++) {
                            var d = document.createElement("div");
                            for (i = 0; i < a.options.slidesPerRow; i++) {
                                var c = e * r + (t * a.options.slidesPerRow + i);
                                s.get(c) && d.appendChild(s.get(c));
                            }
                            l.appendChild(d);
                        }
                        o.appendChild(l);
                    }
                    a.$slider.empty().append(o),
                        a.$slider
                            .children()
                            .children()
                            .children()
                            .css({ width: 100 / a.options.slidesPerRow + "%", display: "inline-block" });
                }
            }),
            (t.prototype.checkResponsive = function (t, i) {
                var o,
                    n,
                    s,
                    r = this,
                    a = !1,
                    l = r.$slider.width(),
                    d = window.innerWidth || e(window).width();
                if (("window" === r.respondTo ? (s = d) : "slider" === r.respondTo ? (s = l) : "min" === r.respondTo && (s = Math.min(d, l)), r.options.responsive && r.options.responsive.length && null !== r.options.responsive)) {
                    n = null;
                    for (o in r.breakpoints) r.breakpoints.hasOwnProperty(o) && (r.originalSettings.mobileFirst === !1 ? s < r.breakpoints[o] && (n = r.breakpoints[o]) : s > r.breakpoints[o] && (n = r.breakpoints[o]));
                    null !== n
                        ? null !== r.activeBreakpoint
                            ? (n !== r.activeBreakpoint || i) &&
                              ((r.activeBreakpoint = n),
                              "unslick" === r.breakpointSettings[n] ? r.unslick(n) : ((r.options = e.extend({}, r.originalSettings, r.breakpointSettings[n])), t === !0 && (r.currentSlide = r.options.initialSlide), r.refresh(t)),
                              (a = n))
                            : ((r.activeBreakpoint = n),
                              "unslick" === r.breakpointSettings[n] ? r.unslick(n) : ((r.options = e.extend({}, r.originalSettings, r.breakpointSettings[n])), t === !0 && (r.currentSlide = r.options.initialSlide), r.refresh(t)),
                              (a = n))
                        : null !== r.activeBreakpoint && ((r.activeBreakpoint = null), (r.options = r.originalSettings), t === !0 && (r.currentSlide = r.options.initialSlide), r.refresh(t), (a = n)),
                        t || a === !1 || r.$slider.trigger("breakpoint", [r, a]);
                }
            }),
            (t.prototype.changeSlide = function (t, i) {
                var o,
                    n,
                    s,
                    r = this,
                    a = e(t.currentTarget);
                switch ((a.is("a") && t.preventDefault(), a.is("li") || (a = a.closest("li")), (s = r.slideCount % r.options.slidesToScroll !== 0), (o = s ? 0 : (r.slideCount - r.currentSlide) % r.options.slidesToScroll), t.data.message)) {
                    case "previous":
                        (n = 0 === o ? r.options.slidesToScroll : r.options.slidesToShow - o), r.slideCount > r.options.slidesToShow && r.slideHandler(r.currentSlide - n, !1, i);
                        break;
                    case "next":
                        (n = 0 === o ? r.options.slidesToScroll : o), r.slideCount > r.options.slidesToShow && r.slideHandler(r.currentSlide + n, !1, i);
                        break;
                    case "index":
                        var l = 0 === t.data.index ? 0 : t.data.index || a.index() * r.options.slidesToScroll;
                        r.slideHandler(r.checkNavigable(l), !1, i), a.children().trigger("focus");
                        break;
                    default:
                        return;
                }
            }),
            (t.prototype.checkNavigable = function (e) {
                var t,
                    i,
                    o = this;
                if (((t = o.getNavigableIndexes()), (i = 0), e > t[t.length - 1])) e = t[t.length - 1];
                else
                    for (var n in t) {
                        if (e < t[n]) {
                            e = i;
                            break;
                        }
                        i = t[n];
                    }
                return e;
            }),
            (t.prototype.cleanUpEvents = function () {
                var t = this;
                t.options.dots && null !== t.$dots && e("li", t.$dots).off("click.slick", t.changeSlide).off("mouseenter.slick", e.proxy(t.interrupt, t, !0)).off("mouseleave.slick", e.proxy(t.interrupt, t, !1)),
                    t.$slider.off("focus.slick blur.slick"),
                    t.options.arrows === !0 && t.slideCount > t.options.slidesToShow && (t.$prevArrow && t.$prevArrow.off("click.slick", t.changeSlide), t.$nextArrow && t.$nextArrow.off("click.slick", t.changeSlide)),
                    t.$list.off("touchstart.slick mousedown.slick", t.swipeHandler),
                    t.$list.off("touchmove.slick mousemove.slick", t.swipeHandler),
                    t.$list.off("touchend.slick mouseup.slick", t.swipeHandler),
                    t.$list.off("touchcancel.slick mouseleave.slick", t.swipeHandler),
                    t.$list.off("click.slick", t.clickHandler),
                    e(document).off(t.visibilityChange, t.visibility),
                    t.cleanUpSlideEvents(),
                    t.options.accessibility === !0 && t.$list.off("keydown.slick", t.keyHandler),
                    t.options.focusOnSelect === !0 && e(t.$slideTrack).children().off("click.slick", t.selectHandler),
                    e(window).off("orientationchange.slick.slick-" + t.instanceUid, t.orientationChange),
                    e(window).off("resize.slick.slick-" + t.instanceUid, t.resize),
                    e("[draggable!=true]", t.$slideTrack).off("dragstart", t.preventDefault),
                    e(window).off("load.slick.slick-" + t.instanceUid, t.setPosition),
                    e(document).off("ready.slick.slick-" + t.instanceUid, t.setPosition);
            }),
            (t.prototype.cleanUpSlideEvents = function () {
                var t = this;
                t.$list.off("mouseenter.slick", e.proxy(t.interrupt, t, !0)), t.$list.off("mouseleave.slick", e.proxy(t.interrupt, t, !1));
            }),
            (t.prototype.cleanUpRows = function () {
                var e,
                    t = this;
                t.options.rows > 1 && ((e = t.$slides.children().children()), e.removeAttr("style"), t.$slider.empty().append(e));
            }),
            (t.prototype.clickHandler = function (e) {
                var t = this;
                t.shouldClick === !1 && (e.stopImmediatePropagation(), e.stopPropagation(), e.preventDefault());
            }),
            (t.prototype.destroy = function (t) {
                var i = this;
                i.autoPlayClear(),
                    (i.touchObject = {}),
                    i.cleanUpEvents(),
                    e(".slick-cloned", i.$slider).detach(),
                    i.$dots && i.$dots.remove(),
                    i.$prevArrow &&
                        i.$prevArrow.length &&
                        (i.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), i.htmlExpr.test(i.options.prevArrow) && i.$prevArrow.remove()),
                    i.$nextArrow &&
                        i.$nextArrow.length &&
                        (i.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), i.htmlExpr.test(i.options.nextArrow) && i.$nextArrow.remove()),
                    i.$slides &&
                        (i.$slides
                            .removeClass("slick-slide slick-active slick-center slick-visible slick-current")
                            .removeAttr("aria-hidden")
                            .removeAttr("data-slick-index")
                            .each(function () {
                                e(this).attr("style", e(this).data("originalStyling"));
                            }),
                        i.$slideTrack.children(this.options.slide).detach(),
                        i.$slideTrack.detach(),
                        i.$list.detach(),
                        i.$slider.append(i.$slides)),
                    i.cleanUpRows(),
                    i.$slider.removeClass("slick-slider"),
                    i.$slider.removeClass("slick-initialized"),
                    i.$slider.removeClass("slick-dotted"),
                    (i.unslicked = !0),
                    t || i.$slider.trigger("destroy", [i]);
            }),
            (t.prototype.disableTransition = function (e) {
                var t = this,
                    i = {};
                (i[t.transitionType] = ""), t.options.fade === !1 ? t.$slideTrack.css(i) : t.$slides.eq(e).css(i);
            }),
            (t.prototype.fadeSlide = function (e, t) {
                var i = this;
                i.cssTransitions === !1
                    ? (i.$slides.eq(e).css({ zIndex: i.options.zIndex }), i.$slides.eq(e).animate({ opacity: 1 }, i.options.speed, i.options.easing, t))
                    : (i.applyTransition(e),
                      i.$slides.eq(e).css({ opacity: 1, zIndex: i.options.zIndex }),
                      t &&
                          setTimeout(function () {
                              i.disableTransition(e), t.call();
                          }, i.options.speed));
            }),
            (t.prototype.fadeSlideOut = function (e) {
                var t = this;
                t.cssTransitions === !1 ? t.$slides.eq(e).animate({ opacity: 0, zIndex: t.options.zIndex - 2 }, t.options.speed, t.options.easing) : (t.applyTransition(e), t.$slides.eq(e).css({ opacity: 0, zIndex: t.options.zIndex - 2 }));
            }),
            (t.prototype.filterSlides = t.prototype.slickFilter = function (e) {
                var t = this;
                null !== e && ((t.$slidesCache = t.$slides), t.unload(), t.$slideTrack.children(this.options.slide).detach(), t.$slidesCache.filter(e).appendTo(t.$slideTrack), t.reinit());
            }),
            (t.prototype.focusHandler = function () {
                var t = this;
                t.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick", "*:not(.slick-arrow)", function (i) {
                    i.stopImmediatePropagation();
                    var o = e(this);
                    setTimeout(function () {
                        t.options.pauseOnFocus && ((t.focussed = o.is(":focus")), t.autoPlay());
                    }, 0);
                });
            }),
            (t.prototype.getCurrent = t.prototype.slickCurrentSlide = function () {
                var e = this;
                return e.currentSlide;
            }),
            (t.prototype.getDotCount = function () {
                var e = this,
                    t = 0,
                    i = 0,
                    o = 0;
                if (e.options.infinite === !0) for (; t < e.slideCount; ) ++o, (t = i + e.options.slidesToScroll), (i += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow);
                else if (e.options.centerMode === !0) o = e.slideCount;
                else if (e.options.asNavFor) for (; t < e.slideCount; ) ++o, (t = i + e.options.slidesToScroll), (i += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow);
                else o = 1 + Math.ceil((e.slideCount - e.options.slidesToShow) / e.options.slidesToScroll);
                return o - 1;
            }),
            (t.prototype.getLeft = function (e) {
                var t,
                    i,
                    o,
                    n = this,
                    s = 0;
                return (
                    (n.slideOffset = 0),
                    (i = n.$slides.first().outerHeight(!0)),
                    n.options.infinite === !0
                        ? (n.slideCount > n.options.slidesToShow && ((n.slideOffset = n.slideWidth * n.options.slidesToShow * -1), (s = i * n.options.slidesToShow * -1)),
                          n.slideCount % n.options.slidesToScroll !== 0 &&
                              e + n.options.slidesToScroll > n.slideCount &&
                              n.slideCount > n.options.slidesToShow &&
                              (e > n.slideCount
                                  ? ((n.slideOffset = (n.options.slidesToShow - (e - n.slideCount)) * n.slideWidth * -1), (s = (n.options.slidesToShow - (e - n.slideCount)) * i * -1))
                                  : ((n.slideOffset = (n.slideCount % n.options.slidesToScroll) * n.slideWidth * -1), (s = (n.slideCount % n.options.slidesToScroll) * i * -1))))
                        : e + n.options.slidesToShow > n.slideCount && ((n.slideOffset = (e + n.options.slidesToShow - n.slideCount) * n.slideWidth), (s = (e + n.options.slidesToShow - n.slideCount) * i)),
                    n.slideCount <= n.options.slidesToShow && ((n.slideOffset = 0), (s = 0)),
                    n.options.centerMode === !0 && n.slideCount <= n.options.slidesToShow
                        ? (n.slideOffset = (n.slideWidth * Math.floor(n.options.slidesToShow)) / 2 - (n.slideWidth * n.slideCount) / 2)
                        : n.options.centerMode === !0 && n.options.infinite === !0
                        ? (n.slideOffset += n.slideWidth * Math.floor(n.options.slidesToShow / 2) - n.slideWidth)
                        : n.options.centerMode === !0 && ((n.slideOffset = 0), (n.slideOffset += n.slideWidth * Math.floor(n.options.slidesToShow / 2))),
                    (t = n.options.vertical === !1 ? e * n.slideWidth * -1 + n.slideOffset : e * i * -1 + s),
                    n.options.variableWidth === !0 &&
                        ((o = n.slideCount <= n.options.slidesToShow || n.options.infinite === !1 ? n.$slideTrack.children(".slick-slide").eq(e) : n.$slideTrack.children(".slick-slide").eq(e + n.options.slidesToShow)),
                        (t = n.options.rtl === !0 ? (o[0] ? (n.$slideTrack.width() - o[0].offsetLeft - o.width()) * -1 : 0) : o[0] ? o[0].offsetLeft * -1 : 0),
                        n.options.centerMode === !0 &&
                            ((o = n.slideCount <= n.options.slidesToShow || n.options.infinite === !1 ? n.$slideTrack.children(".slick-slide").eq(e) : n.$slideTrack.children(".slick-slide").eq(e + n.options.slidesToShow + 1)),
                            (t = n.options.rtl === !0 ? (o[0] ? (n.$slideTrack.width() - o[0].offsetLeft - o.width()) * -1 : 0) : o[0] ? o[0].offsetLeft * -1 : 0),
                            (t += (n.$list.width() - o.outerWidth()) / 2))),
                    t
                );
            }),
            (t.prototype.getOption = t.prototype.slickGetOption = function (e) {
                var t = this;
                return t.options[e];
            }),
            (t.prototype.getNavigableIndexes = function () {
                var e,
                    t = this,
                    i = 0,
                    o = 0,
                    n = [];
                for (t.options.infinite === !1 ? (e = t.slideCount) : ((i = t.options.slidesToScroll * -1), (o = t.options.slidesToScroll * -1), (e = 2 * t.slideCount)); i < e; )
                    n.push(i), (i = o + t.options.slidesToScroll), (o += t.options.slidesToScroll <= t.options.slidesToShow ? t.options.slidesToScroll : t.options.slidesToShow);
                return n;
            }),
            (t.prototype.getSlick = function () {
                return this;
            }),
            (t.prototype.getSlideCount = function () {
                var t,
                    i,
                    o,
                    n = this;
                return (
                    (o = n.options.centerMode === !0 ? n.slideWidth * Math.floor(n.options.slidesToShow / 2) : 0),
                    n.options.swipeToSlide === !0
                        ? (n.$slideTrack.find(".slick-slide").each(function (t, s) {
                              if (s.offsetLeft - o + e(s).outerWidth() / 2 > n.swipeLeft * -1) return (i = s), !1;
                          }),
                          (t = Math.abs(e(i).attr("data-slick-index") - n.currentSlide) || 1))
                        : n.options.slidesToScroll
                );
            }),
            (t.prototype.goTo = t.prototype.slickGoTo = function (e, t) {
                var i = this;
                i.changeSlide({ data: { message: "index", index: parseInt(e) } }, t);
            }),
            (t.prototype.init = function (t) {
                var i = this;
                e(i.$slider).hasClass("slick-initialized") ||
                    (e(i.$slider).addClass("slick-initialized"), i.buildRows(), i.buildOut(), i.setProps(), i.startLoad(), i.loadSlider(), i.initializeEvents(), i.updateArrows(), i.updateDots(), i.checkResponsive(!0), i.focusHandler()),
                    t && i.$slider.trigger("init", [i]),
                    i.options.accessibility === !0 && i.initADA(),
                    i.options.autoplay && ((i.paused = !1), i.autoPlay());
            }),
            (t.prototype.initADA = function () {
                var t = this;
                t.$slides.add(t.$slideTrack.find(".slick-cloned")).attr({ "aria-hidden": "true", tabindex: "-1" }).find("a, input, button, select").attr({ tabindex: "-1" }),
                    t.$slideTrack.attr({role: "listbox", "aria-label": "carousel"});
                    t.$slides.not(t.$slideTrack.find(".slick-cloned")).each(function (i) {
                        e(this).attr("role", "option");
                        var o = t.options.centerMode ? i : Math.floor(i / t.options.slidesToShow);
                        t.options.dots === !0 && e(this).attr("aria-describedby", "slick-slide" + t.instanceUid + o);
                    }),
                    null !== t.$dots &&
                        t.$dots
                            .attr("role", "tablist")
                            .find("li")
                            .each(function (i) {
                                e(this).attr({ role: "presentation", "aria-selected": "false", "aria-controls": "navigation" + t.instanceUid + i, id: "slick-slide" + t.instanceUid + i });
                            })
                            .first()
                            .attr("aria-selected", "true")
                            .end()
                            .find("button")
                            .attr("role", "button")
                            .end()
                            .closest("div")
                            .attr("role", "toolbar"),
                    t.activateADA();
            }),
            (t.prototype.initArrowEvents = function () {
                var e = this;
                e.options.arrows === !0 &&
                    e.slideCount > e.options.slidesToShow &&
                    (e.$prevArrow.off("click.slick").on("click.slick", { message: "previous" }, e.changeSlide), e.$nextArrow.off("click.slick").on("click.slick", { message: "next" }, e.changeSlide));
            }),
            (t.prototype.initDotEvents = function () {
                var t = this;
                t.options.dots === !0 && t.slideCount > t.options.slidesToShow && e("li", t.$dots).on("click.slick", { message: "index" }, t.changeSlide),
                    t.options.dots === !0 && t.options.pauseOnDotsHover === !0 && e("li", t.$dots).on("mouseenter.slick", e.proxy(t.interrupt, t, !0)).on("mouseleave.slick", e.proxy(t.interrupt, t, !1));
            }),
            (t.prototype.initSlideEvents = function () {
                var t = this;
                t.options.pauseOnHover && (t.$list.on("mouseenter.slick", e.proxy(t.interrupt, t, !0)), t.$list.on("mouseleave.slick", e.proxy(t.interrupt, t, !1)));
            }),
            (t.prototype.initializeEvents = function () {
                var t = this;
                t.initArrowEvents(),
                    t.initDotEvents(),
                    t.initSlideEvents(),
                    t.$list.on("touchstart.slick mousedown.slick", { action: "start" }, t.swipeHandler),
                    t.$list.on("touchmove.slick mousemove.slick", { action: "move" }, t.swipeHandler),
                    t.$list.on("touchend.slick mouseup.slick", { action: "end" }, t.swipeHandler),
                    t.$list.on("touchcancel.slick mouseleave.slick", { action: "end" }, t.swipeHandler),
                    t.$list.on("click.slick", t.clickHandler),
                    e(document).on(t.visibilityChange, e.proxy(t.visibility, t)),
                    t.options.accessibility === !0 && t.$list.on("keydown.slick", t.keyHandler),
                    t.options.focusOnSelect === !0 && e(t.$slideTrack).children().on("click.slick", t.selectHandler),
                    e(window).on("orientationchange.slick.slick-" + t.instanceUid, e.proxy(t.orientationChange, t)),
                    e(window).on("resize.slick.slick-" + t.instanceUid, e.proxy(t.resize, t)),
                    e("[draggable!=true]", t.$slideTrack).on("dragstart", t.preventDefault),
                    e(window).on("load.slick.slick-" + t.instanceUid, t.setPosition),
                    e(document).on("ready.slick.slick-" + t.instanceUid, t.setPosition);
            }),
            (t.prototype.initUI = function () {
                var e = this;
                e.options.arrows === !0 && e.slideCount > e.options.slidesToShow && (e.$prevArrow.show(), e.$nextArrow.show()), e.options.dots === !0 && e.slideCount > e.options.slidesToShow && e.$dots.show();
            }),
            (t.prototype.keyHandler = function (e) {
                var t = this;
                e.target.tagName.match("TEXTAREA|INPUT|SELECT") ||
                    (37 === e.keyCode && t.options.accessibility === !0
                        ? t.changeSlide({ data: { message: t.options.rtl === !0 ? "next" : "previous" } })
                        : 39 === e.keyCode && t.options.accessibility === !0 && t.changeSlide({ data: { message: t.options.rtl === !0 ? "previous" : "next" } }));
            }),
            (t.prototype.lazyLoad = function () {
                function t(t) {
                    e("img[data-lazy]", t).each(function () {
                        var t = e(this),
                            i = e(this).attr("data-lazy"),
                            o = document.createElement("img");
                        (o.onload = function () {
                            t.animate({ opacity: 0 }, 100, function () {
                                t.attr("src", i).animate({ opacity: 1 }, 200, function () {
                                    t.removeAttr("data-lazy").removeClass("slick-loading");
                                }),
                                    r.$slider.trigger("lazyLoaded", [r, t, i]);
                            });
                        }),
                            (o.onerror = function () {
                                t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), r.$slider.trigger("lazyLoadError", [r, t, i]);
                            }),
                            (o.src = i);
                    });
                }
                var i,
                    o,
                    n,
                    s,
                    r = this;
                r.options.centerMode === !0
                    ? r.options.infinite === !0
                        ? ((n = r.currentSlide + (r.options.slidesToShow / 2 + 1)), (s = n + r.options.slidesToShow + 2))
                        : ((n = Math.max(0, r.currentSlide - (r.options.slidesToShow / 2 + 1))), (s = 2 + (r.options.slidesToShow / 2 + 1) + r.currentSlide))
                    : ((n = r.options.infinite ? r.options.slidesToShow + r.currentSlide : r.currentSlide), (s = Math.ceil(n + r.options.slidesToShow)), r.options.fade === !0 && (n > 0 && n--, s <= r.slideCount && s++)),
                    (i = r.$slider.find(".slick-slide").slice(n, s)),
                    t(i),
                    r.slideCount <= r.options.slidesToShow
                        ? ((o = r.$slider.find(".slick-slide")), t(o))
                        : r.currentSlide >= r.slideCount - r.options.slidesToShow
                        ? ((o = r.$slider.find(".slick-cloned").slice(0, r.options.slidesToShow)), t(o))
                        : 0 === r.currentSlide && ((o = r.$slider.find(".slick-cloned").slice(r.options.slidesToShow * -1)), t(o));
            }),
            (t.prototype.loadSlider = function () {
                var e = this;
                e.setPosition(), e.$slideTrack.css({ opacity: 1 }), e.$slider.removeClass("slick-loading"), e.initUI(), "progressive" === e.options.lazyLoad && e.progressiveLazyLoad();
            }),
            (t.prototype.next = t.prototype.slickNext = function () {
                var e = this;
                e.changeSlide({ data: { message: "next" } });
            }),
            (t.prototype.orientationChange = function () {
                var e = this;
                e.checkResponsive(), e.setPosition();
            }),
            (t.prototype.pause = t.prototype.slickPause = function () {
                var e = this;
                e.autoPlayClear(), (e.paused = !0);
            }),
            (t.prototype.play = t.prototype.slickPlay = function () {
                var e = this;
                e.autoPlay(), (e.options.autoplay = !0), (e.paused = !1), (e.focussed = !1), (e.interrupted = !1);
            }),
            (t.prototype.postSlide = function (e) {
                var t = this;
                t.unslicked || (t.$slider.trigger("afterChange", [t, e]), (t.animating = !1), t.setPosition(), (t.swipeLeft = null), t.options.autoplay && t.autoPlay(), t.options.accessibility === !0 && t.initADA());
            }),
            (t.prototype.prev = t.prototype.slickPrev = function () {
                var e = this;
                e.changeSlide({ data: { message: "previous" } });
            }),
            (t.prototype.preventDefault = function (e) {
                e.preventDefault();
            }),
            (t.prototype.progressiveLazyLoad = function (t) {
                t = t || 1;
                var i,
                    o,
                    n,
                    s = this,
                    r = e("img[data-lazy]", s.$slider);
                r.length
                    ? ((i = r.first()),
                      (o = i.attr("data-lazy")),
                      (n = document.createElement("img")),
                      (n.onload = function () {
                          i.attr("src", o).removeAttr("data-lazy").removeClass("slick-loading"), s.options.adaptiveHeight === !0 && s.setPosition(), s.$slider.trigger("lazyLoaded", [s, i, o]), s.progressiveLazyLoad();
                      }),
                      (n.onerror = function () {
                          t < 3
                              ? setTimeout(function () {
                                    s.progressiveLazyLoad(t + 1);
                                }, 500)
                              : (i.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), s.$slider.trigger("lazyLoadError", [s, i, o]), s.progressiveLazyLoad());
                      }),
                      (n.src = o))
                    : s.$slider.trigger("allImagesLoaded", [s]);
            }),
            (t.prototype.refresh = function (t) {
                var i,
                    o,
                    n = this;
                (o = n.slideCount - n.options.slidesToShow),
                    !n.options.infinite && n.currentSlide > o && (n.currentSlide = o),
                    n.slideCount <= n.options.slidesToShow && (n.currentSlide = 0),
                    (i = n.currentSlide),
                    n.destroy(!0),
                    e.extend(n, n.initials, { currentSlide: i }),
                    n.init(),
                    t || n.changeSlide({ data: { message: "index", index: i } }, !1);
            }),
            (t.prototype.registerBreakpoints = function () {
                var t,
                    i,
                    o,
                    n = this,
                    s = n.options.responsive || null;
                if ("array" === e.type(s) && s.length) {
                    n.respondTo = n.options.respondTo || "window";
                    for (t in s)
                        if (((o = n.breakpoints.length - 1), (i = s[t].breakpoint), s.hasOwnProperty(t))) {
                            for (; o >= 0; ) n.breakpoints[o] && n.breakpoints[o] === i && n.breakpoints.splice(o, 1), o--;
                            n.breakpoints.push(i), (n.breakpointSettings[i] = s[t].settings);
                        }
                    n.breakpoints.sort(function (e, t) {
                        return n.options.mobileFirst ? e - t : t - e;
                    });
                }
            }),
            (t.prototype.reinit = function () {
                var t = this;
                (t.$slides = t.$slideTrack.children(t.options.slide).addClass("slick-slide")),
                    (t.slideCount = t.$slides.length),
                    t.currentSlide >= t.slideCount && 0 !== t.currentSlide && (t.currentSlide = t.currentSlide - t.options.slidesToScroll),
                    t.slideCount <= t.options.slidesToShow && (t.currentSlide = 0),
                    t.registerBreakpoints(),
                    t.setProps(),
                    t.setupInfinite(),
                    t.buildArrows(),
                    t.updateArrows(),
                    t.initArrowEvents(),
                    t.buildDots(),
                    t.updateDots(),
                    t.initDotEvents(),
                    t.cleanUpSlideEvents(),
                    t.initSlideEvents(),
                    t.checkResponsive(!1, !0),
                    t.options.focusOnSelect === !0 && e(t.$slideTrack).children().on("click.slick", t.selectHandler),
                    t.setSlideClasses("number" == typeof t.currentSlide ? t.currentSlide : 0),
                    t.setPosition(),
                    t.focusHandler(),
                    (t.paused = !t.options.autoplay),
                    t.autoPlay(),
                    t.$slider.trigger("reInit", [t]);
            }),
            (t.prototype.resize = function () {
                var t = this;
                e(window).width() !== t.windowWidth &&
                    (clearTimeout(t.windowDelay),
                    (t.windowDelay = window.setTimeout(function () {
                        (t.windowWidth = e(window).width()), t.checkResponsive(), t.unslicked || t.setPosition();
                    }, 50)));
            }),
            (t.prototype.removeSlide = t.prototype.slickRemove = function (e, t, i) {
                var o = this;
                return (
                    "boolean" == typeof e ? ((t = e), (e = t === !0 ? 0 : o.slideCount - 1)) : (e = t === !0 ? --e : e),
                    !(o.slideCount < 1 || e < 0 || e > o.slideCount - 1) &&
                        (o.unload(),
                        i === !0 ? o.$slideTrack.children().remove() : o.$slideTrack.children(this.options.slide).eq(e).remove(),
                        (o.$slides = o.$slideTrack.children(this.options.slide)),
                        o.$slideTrack.children(this.options.slide).detach(),
                        o.$slideTrack.append(o.$slides),
                        (o.$slidesCache = o.$slides),
                        void o.reinit())
                );
            }),
            (t.prototype.setCSS = function (e) {
                var t,
                    i,
                    o = this,
                    n = {};
                o.options.rtl === !0 && (e = -e),
                    (t = "left" == o.positionProp ? Math.ceil(e) + "px" : "0px"),
                    (i = "top" == o.positionProp ? Math.ceil(e) + "px" : "0px"),
                    (n[o.positionProp] = e),
                    o.transformsEnabled === !1
                        ? o.$slideTrack.css(n)
                        : ((n = {}), o.cssTransitions === !1 ? ((n[o.animType] = "translate(" + t + ", " + i + ")"), o.$slideTrack.css(n)) : ((n[o.animType] = "translate3d(" + t + ", " + i + ", 0px)"), o.$slideTrack.css(n)));
            }),
            (t.prototype.setDimensions = function () {
                var e = this;
                e.options.vertical === !1
                    ? e.options.centerMode === !0 && e.$list.css({ padding: "0px " + e.options.centerPadding })
                    : (e.$list.height(e.$slides.first().outerHeight(!0) * e.options.slidesToShow), e.options.centerMode === !0 && e.$list.css({ padding: e.options.centerPadding + " 0px" })),
                    (e.listWidth = e.$list.width()),
                    (e.listHeight = e.$list.height()),
                    e.options.vertical === !1 && e.options.variableWidth === !1
                        ? ((e.slideWidth = Math.ceil(e.listWidth / e.options.slidesToShow)), e.$slideTrack.width(Math.ceil(e.slideWidth * e.$slideTrack.children(".slick-slide").length)))
                        : e.options.variableWidth === !0
                        ? e.$slideTrack.width(5e3 * e.slideCount)
                        : ((e.slideWidth = Math.ceil(e.listWidth)), e.$slideTrack.height(Math.ceil(e.$slides.first().outerHeight(!0) * e.$slideTrack.children(".slick-slide").length)));
                var t = e.$slides.first().outerWidth(!0) - e.$slides.first().width();
                e.options.variableWidth === !1 && e.$slideTrack.children(".slick-slide").width(e.slideWidth - t);
            }),
            (t.prototype.setFade = function () {
                var t,
                    i = this;
                i.$slides.each(function (o, n) {
                    (t = i.slideWidth * o * -1),
                        i.options.rtl === !0 ? e(n).css({ position: "relative", right: t, top: 0, zIndex: i.options.zIndex - 2, opacity: 0 }) : e(n).css({ position: "relative", left: t, top: 0, zIndex: i.options.zIndex - 2, opacity: 0 });
                }),
                    i.$slides.eq(i.currentSlide).css({ zIndex: i.options.zIndex - 1, opacity: 1 });
            }),
            (t.prototype.setHeight = function () {
                var e = this;
                if (1 === e.options.slidesToShow && e.options.adaptiveHeight === !0 && e.options.vertical === !1) {
                    var t = e.$slides.eq(e.currentSlide).outerHeight(!0);
                    if (1 === t) return;
                    e.$list.css("height", t);
                }
            }),
            (t.prototype.setOption = t.prototype.slickSetOption = function () {
                var t,
                    i,
                    o,
                    n,
                    s,
                    r = this,
                    a = !1;
                if (
                    ("object" === e.type(arguments[0])
                        ? ((o = arguments[0]), (a = arguments[1]), (s = "multiple"))
                        : "string" === e.type(arguments[0]) &&
                          ((o = arguments[0]), (n = arguments[1]), (a = arguments[2]), "responsive" === arguments[0] && "array" === e.type(arguments[1]) ? (s = "responsive") : "undefined" != typeof arguments[1] && (s = "single")),
                    "single" === s)
                )
                    r.options[o] = n;
                else if ("multiple" === s)
                    e.each(o, function (e, t) {
                        r.options[e] = t;
                    });
                else if ("responsive" === s)
                    for (i in n)
                        if ("array" !== e.type(r.options.responsive)) r.options.responsive = [n[i]];
                        else {
                            for (t = r.options.responsive.length - 1; t >= 0; ) r.options.responsive[t].breakpoint === n[i].breakpoint && r.options.responsive.splice(t, 1), t--;
                            r.options.responsive.push(n[i]);
                        }
                a && (r.unload(), r.reinit());
            }),
            (t.prototype.setPosition = function () {
                var e = this;
                e.setDimensions(), e.setHeight(), e.options.fade === !1 ? e.setCSS(e.getLeft(e.currentSlide)) : e.setFade(), e.$slider.trigger("setPosition", [e]);
            }),
            (t.prototype.setProps = function () {
                var e = this,
                    t = document.body.style;
                (e.positionProp = e.options.vertical === !0 ? "top" : "left"),
                    "top" === e.positionProp ? e.$slider.addClass("slick-vertical") : e.$slider.removeClass("slick-vertical"),
                    (void 0 === t.WebkitTransition && void 0 === t.MozTransition && void 0 === t.msTransition) || (e.options.useCSS === !0 && (e.cssTransitions = !0)),
                    e.options.fade && ("number" == typeof e.options.zIndex ? e.options.zIndex < 3 && (e.options.zIndex = 3) : (e.options.zIndex = e.defaults.zIndex)),
                    void 0 !== t.OTransform && ((e.animType = "OTransform"), (e.transformType = "-o-transform"), (e.transitionType = "OTransition"), void 0 === t.perspectiveProperty && void 0 === t.webkitPerspective && (e.animType = !1)),
                    void 0 !== t.MozTransform &&
                        ((e.animType = "MozTransform"), (e.transformType = "-moz-transform"), (e.transitionType = "MozTransition"), void 0 === t.perspectiveProperty && void 0 === t.MozPerspective && (e.animType = !1)),
                    void 0 !== t.webkitTransform &&
                        ((e.animType = "webkitTransform"), (e.transformType = "-webkit-transform"), (e.transitionType = "webkitTransition"), void 0 === t.perspectiveProperty && void 0 === t.webkitPerspective && (e.animType = !1)),
                    void 0 !== t.msTransform && ((e.animType = "msTransform"), (e.transformType = "-ms-transform"), (e.transitionType = "msTransition"), void 0 === t.msTransform && (e.animType = !1)),
                    void 0 !== t.transform && e.animType !== !1 && ((e.animType = "transform"), (e.transformType = "transform"), (e.transitionType = "transition")),
                    (e.transformsEnabled = e.options.useTransform && null !== e.animType && e.animType !== !1);
            }),
            (t.prototype.setSlideClasses = function (e) {
                var t,
                    i,
                    o,
                    n,
                    s = this;
                (i = s.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden", "true")),
                    s.$slides.eq(e).addClass("slick-current"),
                    s.options.centerMode === !0
                        ? ((t = Math.floor(s.options.slidesToShow / 2)),
                          s.options.infinite === !0 &&
                              (e >= t && e <= s.slideCount - 1 - t
                                  ? s.$slides
                                        .slice(e - t, e + t + 1)
                                        .addClass("slick-active")
                                        .attr("aria-hidden", "false")
                                  : ((o = s.options.slidesToShow + e),
                                    i
                                        .slice(o - t + 1, o + t + 2)
                                        .addClass("slick-active")
                                        .attr("aria-hidden", "false")),
                              0 === e ? i.eq(i.length - 1 - s.options.slidesToShow).addClass("slick-center") : e === s.slideCount - 1 && i.eq(s.options.slidesToShow).addClass("slick-center")),
                          s.$slides.eq(e).addClass("slick-center"))
                        : e >= 0 && e <= s.slideCount - s.options.slidesToShow
                        ? s.$slides
                              .slice(e, e + s.options.slidesToShow)
                              .addClass("slick-active")
                              .attr("aria-hidden", "false")
                        : i.length <= s.options.slidesToShow
                        ? i.addClass("slick-active").attr("aria-hidden", "false")
                        : ((n = s.slideCount % s.options.slidesToShow),
                          (o = s.options.infinite === !0 ? s.options.slidesToShow + e : e),
                          s.options.slidesToShow == s.options.slidesToScroll && s.slideCount - e < s.options.slidesToShow
                              ? i
                                    .slice(o - (s.options.slidesToShow - n), o + n)
                                    .addClass("slick-active")
                                    .attr("aria-hidden", "false")
                              : i
                                    .slice(o, o + s.options.slidesToShow)
                                    .addClass("slick-active")
                                    .attr("aria-hidden", "false")),
                    "ondemand" === s.options.lazyLoad && s.lazyLoad();
            }),
            (t.prototype.setupInfinite = function () {
                var t,
                    i,
                    o,
                    n = this;
                if ((n.options.fade === !0 && (n.options.centerMode = !1), n.options.infinite === !0 && n.options.fade === !1 && ((i = null), n.slideCount > n.options.slidesToShow))) {
                    for (o = n.options.centerMode === !0 ? n.options.slidesToShow + 1 : n.options.slidesToShow, t = n.slideCount; t > n.slideCount - o; t -= 1)
                        (i = t - 1),
                            e(n.$slides[i])
                                .clone(!0)
                                .attr("id", "")
                                .attr("data-slick-index", i - n.slideCount)
                                .prependTo(n.$slideTrack)
                                .addClass("slick-cloned");
                    for (t = 0; t < o; t += 1)
                        (i = t),
                            e(n.$slides[i])
                                .clone(!0)
                                .attr("id", "")
                                .attr("data-slick-index", i + n.slideCount)
                                .appendTo(n.$slideTrack)
                                .addClass("slick-cloned");
                    n.$slideTrack
                        .find(".slick-cloned")
                        .find("[id]")
                        .each(function () {
                            e(this).attr("id", "");
                        });
                }
            }),
            (t.prototype.interrupt = function (e) {
                var t = this;
                e || t.autoPlay(), (t.interrupted = e);
            }),
            (t.prototype.selectHandler = function (t) {
                var i = this,
                    o = e(t.target).is(".slick-slide") ? e(t.target) : e(t.target).parents(".slick-slide"),
                    n = parseInt(o.attr("data-slick-index"));
                return n || (n = 0), i.slideCount <= i.options.slidesToShow ? (i.setSlideClasses(n), void i.asNavFor(n)) : void i.slideHandler(n);
            }),
            (t.prototype.slideHandler = function (e, t, i) {
                var o,
                    n,
                    s,
                    r,
                    a,
                    l = null,
                    d = this;
                if (((t = t || !1), (d.animating !== !0 || d.options.waitForAnimate !== !0) && !((d.options.fade === !0 && d.currentSlide === e) || d.slideCount <= d.options.slidesToShow)))
                    return (
                        t === !1 && d.asNavFor(e),
                        (o = e),
                        (l = d.getLeft(o)),
                        (r = d.getLeft(d.currentSlide)),
                        (d.currentLeft = null === d.swipeLeft ? r : d.swipeLeft),
                        d.options.infinite === !1 && d.options.centerMode === !1 && (e < 0 || e > d.getDotCount() * d.options.slidesToScroll)
                            ? void (
                                  d.options.fade === !1 &&
                                  ((o = d.currentSlide),
                                  i !== !0
                                      ? d.animateSlide(r, function () {
                                            d.postSlide(o);
                                        })
                                      : d.postSlide(o))
                              )
                            : d.options.infinite === !1 && d.options.centerMode === !0 && (e < 0 || e > d.slideCount - d.options.slidesToScroll)
                            ? void (
                                  d.options.fade === !1 &&
                                  ((o = d.currentSlide),
                                  i !== !0
                                      ? d.animateSlide(r, function () {
                                            d.postSlide(o);
                                        })
                                      : d.postSlide(o))
                              )
                            : (d.options.autoplay && clearInterval(d.autoPlayTimer),
                              (n =
                                  o < 0
                                      ? d.slideCount % d.options.slidesToScroll !== 0
                                          ? d.slideCount - (d.slideCount % d.options.slidesToScroll)
                                          : d.slideCount + o
                                      : o >= d.slideCount
                                      ? d.slideCount % d.options.slidesToScroll !== 0
                                          ? 0
                                          : o - d.slideCount
                                      : o),
                              (d.animating = !0),
                              d.$slider.trigger("beforeChange", [d, d.currentSlide, n]),
                              (s = d.currentSlide),
                              (d.currentSlide = n),
                              d.setSlideClasses(d.currentSlide),
                              d.options.asNavFor && ((a = d.getNavTarget()), (a = a.slick("getSlick")), a.slideCount <= a.options.slidesToShow && a.setSlideClasses(d.currentSlide)),
                              d.updateDots(),
                              d.updateArrows(),
                              d.options.fade === !0
                                  ? (i !== !0
                                        ? (d.fadeSlideOut(s),
                                          d.fadeSlide(n, function () {
                                              d.postSlide(n);
                                          }))
                                        : d.postSlide(n),
                                    void d.animateHeight())
                                  : void (i !== !0
                                        ? d.animateSlide(l, function () {
                                              d.postSlide(n);
                                          })
                                        : d.postSlide(n)))
                    );
            }),
            (t.prototype.startLoad = function () {
                var e = this;
                e.options.arrows === !0 && e.slideCount > e.options.slidesToShow && (e.$prevArrow.hide(), e.$nextArrow.hide()),
                    e.options.dots === !0 && e.slideCount > e.options.slidesToShow && e.$dots.hide(),
                    e.$slider.addClass("slick-loading");
            }),
            (t.prototype.swipeDirection = function () {
                var e,
                    t,
                    i,
                    o,
                    n = this;
                return (
                    (e = n.touchObject.startX - n.touchObject.curX),
                    (t = n.touchObject.startY - n.touchObject.curY),
                    (i = Math.atan2(t, e)),
                    (o = Math.round((180 * i) / Math.PI)),
                    o < 0 && (o = 360 - Math.abs(o)),
                    o <= 45 && o >= 0
                        ? n.options.rtl === !1
                            ? "left"
                            : "right"
                        : o <= 360 && o >= 315
                        ? n.options.rtl === !1
                            ? "left"
                            : "right"
                        : o >= 135 && o <= 225
                        ? n.options.rtl === !1
                            ? "right"
                            : "left"
                        : n.options.verticalSwiping === !0
                        ? o >= 35 && o <= 135
                            ? "down"
                            : "up"
                        : "vertical"
                );
            }),
            (t.prototype.swipeEnd = function (e) {
                var t,
                    i,
                    o = this;
                if (((o.dragging = !1), (o.interrupted = !1), (o.shouldClick = !(o.touchObject.swipeLength > 10)), void 0 === o.touchObject.curX)) return !1;
                if ((o.touchObject.edgeHit === !0 && o.$slider.trigger("edge", [o, o.swipeDirection()]), o.touchObject.swipeLength >= o.touchObject.minSwipe)) {
                    switch ((i = o.swipeDirection())) {
                        case "left":
                        case "down":
                            (t = o.options.swipeToSlide ? o.checkNavigable(o.currentSlide + o.getSlideCount()) : o.currentSlide + o.getSlideCount()), (o.currentDirection = 0);
                            break;
                        case "right":
                        case "up":
                            (t = o.options.swipeToSlide ? o.checkNavigable(o.currentSlide - o.getSlideCount()) : o.currentSlide - o.getSlideCount()), (o.currentDirection = 1);
                    }
                    "vertical" != i && (o.slideHandler(t), (o.touchObject = {}), o.$slider.trigger("swipe", [o, i]));
                } else o.touchObject.startX !== o.touchObject.curX && (o.slideHandler(o.currentSlide), (o.touchObject = {}));
            }),
            (t.prototype.swipeHandler = function (e) {
                var t = this;
                if (!(t.options.swipe === !1 || ("ontouchend" in document && t.options.swipe === !1) || (t.options.draggable === !1 && e.type.indexOf("mouse") !== -1)))
                    switch (
                        ((t.touchObject.fingerCount = e.originalEvent && void 0 !== e.originalEvent.touches ? e.originalEvent.touches.length : 1),
                        (t.touchObject.minSwipe = t.listWidth / t.options.touchThreshold),
                        t.options.verticalSwiping === !0 && (t.touchObject.minSwipe = t.listHeight / t.options.touchThreshold),
                        e.data.action)
                    ) {
                        case "start":
                            t.swipeStart(e);
                            break;
                        case "move":
                            t.swipeMove(e);
                            break;
                        case "end":
                            t.swipeEnd(e);
                    }
            }),
            (t.prototype.swipeMove = function (e) {
                var t,
                    i,
                    o,
                    n,
                    s,
                    r = this;
                return (
                    (s = void 0 !== e.originalEvent ? e.originalEvent.touches : null),
                    !(!r.dragging || (s && 1 !== s.length)) &&
                        ((t = r.getLeft(r.currentSlide)),
                        (r.touchObject.curX = void 0 !== s ? s[0].pageX : e.clientX),
                        (r.touchObject.curY = void 0 !== s ? s[0].pageY : e.clientY),
                        (r.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(r.touchObject.curX - r.touchObject.startX, 2)))),
                        r.options.verticalSwiping === !0 && (r.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(r.touchObject.curY - r.touchObject.startY, 2)))),
                        (i = r.swipeDirection()),
                        "vertical" !== i
                            ? (void 0 !== e.originalEvent && r.touchObject.swipeLength > 4 && e.preventDefault(),
                              (n = (r.options.rtl === !1 ? 1 : -1) * (r.touchObject.curX > r.touchObject.startX ? 1 : -1)),
                              r.options.verticalSwiping === !0 && (n = r.touchObject.curY > r.touchObject.startY ? 1 : -1),
                              (o = r.touchObject.swipeLength),
                              (r.touchObject.edgeHit = !1),
                              r.options.infinite === !1 &&
                                  ((0 === r.currentSlide && "right" === i) || (r.currentSlide >= r.getDotCount() && "left" === i)) &&
                                  ((o = r.touchObject.swipeLength * r.options.edgeFriction), (r.touchObject.edgeHit = !0)),
                              r.options.vertical === !1 ? (r.swipeLeft = t + o * n) : (r.swipeLeft = t + o * (r.$list.height() / r.listWidth) * n),
                              r.options.verticalSwiping === !0 && (r.swipeLeft = t + o * n),
                              r.options.fade !== !0 && r.options.touchMove !== !1 && (r.animating === !0 ? ((r.swipeLeft = null), !1) : void r.setCSS(r.swipeLeft)))
                            : void 0)
                );
            }),
            (t.prototype.swipeStart = function (e) {
                var t,
                    i = this;
                return (
                    (i.interrupted = !0),
                    1 !== i.touchObject.fingerCount || i.slideCount <= i.options.slidesToShow
                        ? ((i.touchObject = {}), !1)
                        : (void 0 !== e.originalEvent && void 0 !== e.originalEvent.touches && (t = e.originalEvent.touches[0]),
                          (i.touchObject.startX = i.touchObject.curX = void 0 !== t ? t.pageX : e.clientX),
                          (i.touchObject.startY = i.touchObject.curY = void 0 !== t ? t.pageY : e.clientY),
                          void (i.dragging = !0))
                );
            }),
            (t.prototype.unfilterSlides = t.prototype.slickUnfilter = function () {
                var e = this;
                null !== e.$slidesCache && (e.unload(), e.$slideTrack.children(this.options.slide).detach(), e.$slidesCache.appendTo(e.$slideTrack), e.reinit());
            }),
            (t.prototype.unload = function () {
                var t = this;
                e(".slick-cloned", t.$slider).remove(),
                    t.$dots && t.$dots.remove(),
                    t.$prevArrow && t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.remove(),
                    t.$nextArrow && t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.remove(),
                    t.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden", "true").css("width", "");
            }),
            (t.prototype.unslick = function (e) {
                var t = this;
                t.$slider.trigger("unslick", [t, e]), t.destroy();
            }),
            (t.prototype.updateArrows = function () {
                var e,
                    t = this;
                (e = Math.floor(t.options.slidesToShow / 2)),
                    t.options.arrows === !0 &&
                        t.slideCount > t.options.slidesToShow &&
                        !t.options.infinite &&
                        (t.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false"),
                        t.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false"),
                        0 === t.currentSlide
                            ? (t.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true"), t.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false"))
                            : t.currentSlide >= t.slideCount - t.options.slidesToShow && t.options.centerMode === !1
                            ? (t.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), t.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false"))
                            : t.currentSlide >= t.slideCount - 1 &&
                              t.options.centerMode === !0 &&
                              (t.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), t.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")));
            }),
            (t.prototype.updateDots = function () {
                var e = this;
                null !== e.$dots &&
                    (e.$dots.find("li").removeClass("slick-active").attr("aria-hidden", "true"),
                    e.$dots
                        .find("li")
                        .eq(Math.floor(e.currentSlide / e.options.slidesToScroll))
                        .addClass("slick-active")
                        .attr("aria-hidden", "false"));
            }),
            (t.prototype.visibility = function () {
                var e = this;
                e.options.autoplay && (document[e.hidden] ? (e.interrupted = !0) : (e.interrupted = !1));
            }),
            (e.fn.slick = function () {
                var e,
                    i,
                    o = this,
                    n = arguments[0],
                    s = Array.prototype.slice.call(arguments, 1),
                    r = o.length;
                for (e = 0; e < r; e++) if (("object" == typeof n || "undefined" == typeof n ? (o[e].slick = new t(o[e], n)) : (i = o[e].slick[n].apply(o[e].slick, s)), "undefined" != typeof i)) return i;
                return o;
            });
    }),
    (function (e, t) {
        function i() {
            C = I = $ = x = O = E = N;
        }
        function o(e, t) {
            for (var i in t) t.hasOwnProperty(i) && (e[i] = t[i]);
        }
        function n(e) {
            return parseFloat(e) || 0;
        }
        function s() {
            A = { top: t.pageYOffset, left: t.pageXOffset };
        }
        function r() {
            return t.pageXOffset != A.left ? (s(), void $()) : void (t.pageYOffset != A.top && (s(), l()));
        }
        function a(e) {
            setTimeout(function () {
                t.pageYOffset != A.top && ((A.top = t.pageYOffset), l());
            }, 0);
        }
        function l() {
            for (var e = z.length - 1; e >= 0; e--) d(z[e]);
        }
        function d(e) {
            if (e.inited) {
                var t = A.top <= e.limit.start ? 0 : A.top >= e.limit.end ? 2 : 1;
                e.mode != t && m(e, t);
            }
        }
        function c() {
            for (var e = z.length - 1; e >= 0; e--)
                if (z[e].inited) {
                    var t = Math.abs(w(z[e].clone) - z[e].docOffsetTop),
                        i = Math.abs(z[e].parent.node.offsetHeight - z[e].parent.height);
                    if (t >= 2 || i >= 2) return !1;
                }
            return !0;
        }
        function p(e) {
            isNaN(parseFloat(e.computed.top)) ||
                e.isCell ||
                "none" == e.computed.display ||
                ((e.inited = !0),
                e.clone || g(e),
                "absolute" != e.parent.computed.position && "relative" != e.parent.computed.position && (e.parent.node.style.position = "relative"),
                d(e),
                (e.parent.height = e.parent.node.offsetHeight),
                (e.docOffsetTop = w(e.clone)));
        }
        function u(e) {
            var t = !0;
            e.clone && v(e), o(e.node.style, e.css);
            for (var i = z.length - 1; i >= 0; i--)
                if (z[i].node !== e.node && z[i].parent.node === e.parent.node) {
                    t = !1;
                    break;
                }
            t && (e.parent.node.style.position = e.parent.css.position), (e.mode = -1);
        }
        function f() {
            for (var e = z.length - 1; e >= 0; e--) p(z[e]);
        }
        function h() {
            for (var e = z.length - 1; e >= 0; e--) u(z[e]);
        }
        function m(e, t) {
            var i = e.node.style;
            switch (t) {
                case 0:
                    (i.position = "absolute"),
                        (i.left = e.offset.left + "px"),
                        (i.right = e.offset.right + "px"),
                        (i.top = e.offset.top + "px"),
                        (i.bottom = "auto"),
                        (i.width = "auto"),
                        (i.marginLeft = 0),
                        (i.marginRight = 0),
                        (i.marginTop = 0);
                    break;
                case 1:
                    (i.position = "fixed"), (i.left = e.box.left + "px"), (i.right = e.box.right + "px"), (i.top = e.css.top), (i.bottom = "auto"), (i.width = "auto"), (i.marginLeft = 0), (i.marginRight = 0), (i.marginTop = 0);
                    break;
                case 2:
                    (i.position = "absolute"), (i.left = e.offset.left + "px"), (i.right = e.offset.right + "px"), (i.top = "auto"), (i.bottom = 0), (i.width = "auto"), (i.marginLeft = 0), (i.marginRight = 0);
            }
            e.mode = t;
        }
        function g(e) {
            e.clone = document.createElement("div");
            var t = e.node.nextSibling || e.node,
                i = e.clone.style;
            (i.height = e.height + "px"),
                (i.width = e.width + "px"),
                (i.marginTop = e.computed.marginTop),
                (i.marginBottom = e.computed.marginBottom),
                (i.marginLeft = e.computed.marginLeft),
                (i.marginRight = e.computed.marginRight),
                (i.padding = i.border = i.borderSpacing = 0),
                (i.fontSize = "1em"),
                (i.position = "static"),
                (i.display = "inline-block"),
                (i.cssFloat = e.computed.cssFloat),
                e.node.parentNode.insertBefore(e.clone, t);
        }
        function v(e) {
            e.clone.parentNode.removeChild(e.clone), (e.clone = void 0);
        }
        function y(e) {
            var t = getComputedStyle(e),
                i = e.parentNode,
                o = getComputedStyle(i),
                s = e.style.position;
            e.style.position = "relative";
            var r = { top: t.top, marginTop: t.marginTop, marginBottom: t.marginBottom, marginLeft: t.marginLeft, marginRight: t.marginRight, cssFloat: t.cssFloat, display: t.display },
                a = { top: n(t.top), marginBottom: n(t.marginBottom), paddingLeft: n(t.paddingLeft), paddingRight: n(t.paddingRight), borderLeftWidth: n(t.borderLeftWidth), borderRightWidth: n(t.borderRightWidth) };
            e.style.position = s;
            var l = {
                    position: e.style.position,
                    top: e.style.top,
                    bottom: e.style.bottom,
                    left: e.style.left,
                    right: e.style.right,
                    width: e.style.width,
                    marginTop: e.style.marginTop,
                    marginLeft: e.style.marginLeft,
                    marginRight: e.style.marginRight,
                },
                d = k(e),
                c = k(i),
                p = {
                    node: i,
                    css: { position: i.style.position },
                    computed: { position: o.position },
                    numeric: { borderLeftWidth: n(o.borderLeftWidth), borderRightWidth: n(o.borderRightWidth), borderTopWidth: n(o.borderTopWidth), borderBottomWidth: n(o.borderBottomWidth) },
                },
                u = {
                    node: e,
                    box: { left: d.win.left, right: H.clientWidth - d.win.right },
                    offset: { top: d.win.top - c.win.top - p.numeric.borderTopWidth, left: d.win.left - c.win.left - p.numeric.borderLeftWidth, right: -d.win.right + c.win.right - p.numeric.borderRightWidth },
                    css: l,
                    isCell: "table-cell" == t.display,
                    computed: r,
                    numeric: a,
                    width: d.win.right - d.win.left,
                    height: d.win.bottom - d.win.top,
                    mode: -1,
                    inited: !1,
                    parent: p,
                    limit: { start: d.doc.top - a.top, end: c.doc.top + i.offsetHeight - p.numeric.borderBottomWidth - e.offsetHeight - a.top - a.marginBottom },
                };
            return u;
        }
        function w(e) {
            for (var t = 0; e; ) (t += e.offsetTop), (e = e.offsetParent);
            return t;
        }
        function k(e) {
            var i = e.getBoundingClientRect();
            return { doc: { top: i.top + t.pageYOffset, left: i.left + t.pageXOffset }, win: i };
        }
        function T() {
            L = setInterval(function () {
                !c() && $();
            }, 500);
        }
        function b() {
            clearInterval(L);
        }
        function S() {
            M && (document[j] ? b() : T());
        }
        function C() {
            M || (s(), f(), t.addEventListener("scroll", r), t.addEventListener("wheel", a), t.addEventListener("resize", $), t.addEventListener("orientationchange", $), e.addEventListener(_, S), T(), (M = !0));
        }
        function $() {
            if (M) {
                h();
                for (var e = z.length - 1; e >= 0; e--) z[e] = y(z[e].node);
                f();
            }
        }
        function x() {
            t.removeEventListener("scroll", r), t.removeEventListener("wheel", a), t.removeEventListener("resize", $), t.removeEventListener("orientationchange", $), e.removeEventListener(_, S), b(), (M = !1);
        }
        function O() {
            x(), h();
        }
        function E() {
            for (O(); z.length; ) z.pop();
        }
        function I(e) {
            for (var t = z.length - 1; t >= 0; t--) if (z[t].node === e) return;
            var i = y(e);
            z.push(i), M ? p(i) : C();
        }
        function P(e) {
            for (var t = z.length - 1; t >= 0; t--) z[t].node === e && (u(z[t]), z.splice(t, 1));
        }
        var A,
            L,
            z = [],
            M = !1,
            H = e.documentElement,
            N = function () {},
            j = "hidden",
            _ = "visibilitychange";
        void 0 !== e.webkitHidden && ((j = "webkitHidden"), (_ = "webkitvisibilitychange")), t.getComputedStyle || i();
        for (var D = ["", "-webkit-", "-moz-", "-ms-"], W = document.createElement("div"), F = D.length - 1; F >= 0; F--) {
            try {
                W.style.position = D[F] + "sticky";
            } catch (R) {}
            "" != W.style.position && i();
        }
        s(), (t.Stickyfill = { stickies: z, add: I, remove: P, init: C, rebuild: $, pause: x, stop: O, kill: E });
    })(document, window),
    window.jQuery &&
        !(function (e) {
            e.fn.Stickyfill = function (e) {
                return (
                    this.each(function () {
                        Stickyfill.add(this);
                    }),
                    this
                );
            };
        })(window.jQuery),
    (window.Template7 = (function () {
        "use strict";
        function e(e) {
            return "[object Array]" === Object.prototype.toString.apply(e);
        }
        function t(e) {
            return "function" == typeof e;
        }
        function i(e) {
            return "undefined" != typeof window && window.escape ? window.escape(e) : e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
        }
        function o(e) {
            var t,
                i,
                o,
                n = e.replace(/[{}#}]/g, "").split(" "),
                a = [];
            for (i = 0; i < n.length; i++) {
                var l,
                    d,
                    c = n[i];
                if (0 === i) a.push(c);
                else if (0 === c.indexOf('"') || 0 === c.indexOf("'"))
                    if (((l = 0 === c.indexOf('"') ? r : s), (d = 0 === c.indexOf('"') ? '"' : "'"), 2 === c.match(l).length)) a.push(c);
                    else {
                        for (t = 0, o = i + 1; o < n.length; o++)
                            if (((c += " " + n[o]), n[o].indexOf(d) >= 0)) {
                                (t = o), a.push(c);
                                break;
                            }
                        t && (i = t);
                    }
                else if (c.indexOf("=") > 0) {
                    var p = c.split("="),
                        u = p[0],
                        f = p[1];
                    if (2 !== f.match(l).length) {
                        for (t = 0, o = i + 1; o < n.length; o++)
                            if (((f += " " + n[o]), n[o].indexOf(d) >= 0)) {
                                t = o;
                                break;
                            }
                        t && (i = t);
                    }
                    var h = [u, f.replace(l, "")];
                    a.push(h);
                } else a.push(c);
            }
            return a;
        }
        function n(t) {
            var i,
                n,
                s = [];
            if (!t) return [];
            var r = t.split(/({{[^{^}]*}})/);
            for (i = 0; i < r.length; i++) {
                var a = r[i];
                if ("" !== a)
                    if (a.indexOf("{{") < 0) s.push({ type: "plain", content: a });
                    else {
                        if (a.indexOf("{/") >= 0) continue;
                        if (a.indexOf("{#") < 0 && a.indexOf(" ") < 0 && a.indexOf("else") < 0) {
                            s.push({ type: "variable", contextName: a.replace(/[{}]/g, "") });
                            continue;
                        }
                        var l = o(a),
                            d = l[0],
                            c = ">" === d,
                            p = [],
                            u = {};
                        for (n = 1; n < l.length; n++) {
                            var f = l[n];
                            e(f) ? (u[f[0]] = "false" !== f[1] && f[1]) : p.push(f);
                        }
                        if (a.indexOf("{#") >= 0) {
                            var h,
                                m = "",
                                g = "",
                                v = 0,
                                y = !1,
                                w = !1,
                                k = 0;
                            for (n = i + 1; n < r.length; n++)
                                if ((r[n].indexOf("{{#") >= 0 && k++, r[n].indexOf("{{/") >= 0 && k--, r[n].indexOf("{{#" + d) >= 0)) (m += r[n]), w && (g += r[n]), v++;
                                else if (r[n].indexOf("{{/" + d) >= 0) {
                                    if (!(v > 0)) {
                                        (h = n), (y = !0);
                                        break;
                                    }
                                    v--, (m += r[n]), w && (g += r[n]);
                                } else r[n].indexOf("else") >= 0 && 0 === k ? (w = !0) : (w || (m += r[n]), w && (g += r[n]));
                            y && (h && (i = h), s.push({ type: "helper", helperName: d, contextName: p, content: m, inverseContent: g, hash: u }));
                        } else a.indexOf(" ") > 0 && (c && ((d = "_partial"), p[0] && (p[0] = '"' + p[0].replace(/"|'/g, "") + '"')), s.push({ type: "helper", helperName: d, contextName: p, hash: u }));
                    }
            }
            return s;
        }
        var s = new RegExp("'", "g"),
            r = new RegExp('"', "g"),
            a = function (e, t) {
                function i(e, t) {
                    return e.content
                        ? a(e.content, t)
                        : function () {
                              return "";
                          };
                }
                function o(e, t) {
                    return e.inverseContent
                        ? a(e.inverseContent, t)
                        : function () {
                              return "";
                          };
                }
                function s(e, t) {
                    var i,
                        o,
                        n = 0;
                    if (0 === e.indexOf("../")) {
                        n = e.split("../").length - 1;
                        var s = t.split("_")[1] - n;
                        (t = "ctx_" + (s >= 1 ? s : 1)), (o = e.split("../")[n].split("."));
                    } else 0 === e.indexOf("@global") ? ((t = "Template7.global"), (o = e.split("@global.")[1].split("."))) : 0 === e.indexOf("@root") ? ((t = "root"), (o = e.split("@root.")[1].split("."))) : (o = e.split("."));
                    i = t;
                    for (var r = 0; r < o.length; r++) {
                        var a = o[r];
                        0 === a.indexOf("@")
                            ? r > 0
                                ? (i += "[(data && data." + a.replace("@", "") + ")]")
                                : (i = "(data && data." + e.replace("@", "") + ")")
                            : isFinite(a)
                            ? (i += "[" + a + "]")
                            : "this" === a || a.indexOf("this.") >= 0 || a.indexOf("this[") >= 0 || a.indexOf("this(") >= 0
                            ? (i = a.replace("this", t))
                            : (i += "." + a);
                    }
                    return i;
                }
                function r(e, t) {
                    for (var i = [], o = 0; o < e.length; o++) /^['"]/.test(e[o]) ? i.push(e[o]) : /^(true|false|\d+)$/.test(e[o]) ? i.push(e[o]) : i.push(s(e[o], t));
                    return i.join(", ");
                }
                function a(e, t) {
                    if (((t = t || 1), (e = e || l.template), "string" != typeof e)) throw new Error("Template7: Template must be a string");
                    var a = n(e);
                    if (0 === a.length)
                        return function () {
                            return "";
                        };
                    var d = "ctx_" + t,
                        c = "";
                    (c += 1 === t ? "(function (" + d + ", data, root) {\n" : "(function (" + d + ", data) {\n"),
                        1 === t &&
                            ((c += "function isArray(arr){return Object.prototype.toString.apply(arr) === '[object Array]';}\n"),
                            (c += "function isFunction(func){return (typeof func === 'function');}\n"),
                            (c += 'function c(val, ctx) {if (typeof val !== "undefined" && val !== null) {if (isFunction(val)) {return val.call(ctx);} else return val;} else return "";}\n'),
                            (c += "root = root || ctx_1 || {};\n")),
                        (c += "var r = '';\n");
                    var p;
                    for (p = 0; p < a.length; p++) {
                        var u = a[p];
                        if ("plain" !== u.type) {
                            var f, h;
                            if (("variable" === u.type && ((f = s(u.contextName, d)), (c += "r += c(" + f + ", " + d + ");")), "helper" === u.type))
                                if (u.helperName in l.helpers)
                                    (h = r(u.contextName, d)),
                                        (c +=
                                            "r += (Template7.helpers." +
                                            u.helperName +
                                            ").call(" +
                                            d +
                                            ", " +
                                            (h && h + ", ") +
                                            "{hash:" +
                                            JSON.stringify(u.hash) +
                                            ", data: data || {}, fn: " +
                                            i(u, t + 1) +
                                            ", inverse: " +
                                            o(u, t + 1) +
                                            ", root: root});");
                                else {
                                    if (u.contextName.length > 0) throw new Error('Template7: Missing helper: "' + u.helperName + '"');
                                    (f = s(u.helperName, d)),
                                        (c += "if (" + f + ") {"),
                                        (c += "if (isArray(" + f + ")) {"),
                                        (c += "r += (Template7.helpers.each).call(" + d + ", " + f + ", {hash:" + JSON.stringify(u.hash) + ", data: data || {}, fn: " + i(u, t + 1) + ", inverse: " + o(u, t + 1) + ", root: root});"),
                                        (c += "}else {"),
                                        (c += "r += (Template7.helpers.with).call(" + d + ", " + f + ", {hash:" + JSON.stringify(u.hash) + ", data: data || {}, fn: " + i(u, t + 1) + ", inverse: " + o(u, t + 1) + ", root: root});"),
                                        (c += "}}");
                                }
                        } else c += "r +='" + u.content.replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/'/g, "\\'") + "';";
                    }
                    return (c += "\nreturn r;})"), eval.call(window, c);
                }
                var l = this;
                (l.template = e),
                    (l.compile = function (e) {
                        return l.compiled || (l.compiled = a(e)), l.compiled;
                    });
            };
        a.prototype = {
            options: {},
            partials: {},
            helpers: {
                _partial: function (e, t) {
                    var i = a.prototype.partials[e];
                    if (!i || (i && !i.template)) return "";
                    i.compiled || (i.compiled = new a(i.template).compile());
                    var o = this;
                    for (var n in t.hash) o[n] = t.hash[n];
                    return i.compiled(o, t.data, t.root);
                },
                escape: function (e, t) {
                    if ("string" != typeof e) throw new Error('Template7: Passed context to "escape" helper should be a string');
                    return i(e);
                },
                if: function (e, i) {
                    return t(e) && (e = e.call(this)), e ? i.fn(this, i.data) : i.inverse(this, i.data);
                },
                unless: function (e, i) {
                    return t(e) && (e = e.call(this)), e ? i.inverse(this, i.data) : i.fn(this, i.data);
                },
                each: function (i, o) {
                    var n = "",
                        s = 0;
                    if ((t(i) && (i = i.call(this)), e(i))) {
                        for (o.hash.reverse && (i = i.reverse()), s = 0; s < i.length; s++) n += o.fn(i[s], { first: 0 === s, last: s === i.length - 1, index: s });
                        o.hash.reverse && (i = i.reverse());
                    } else for (var r in i) s++, (n += o.fn(i[r], { key: r }));
                    return s > 0 ? n : o.inverse(this);
                },
                with: function (e, i) {
                    return t(e) && (e = e.call(this)), i.fn(e);
                },
                join: function (e, i) {
                    return t(e) && (e = e.call(this)), e.join(i.hash.delimiter || i.hash.delimeter);
                },
                js: function (e, t) {
                    var i;
                    return (i = e.indexOf("return") >= 0 ? "(function(){" + e + "})" : "(function(){return (" + e + ")})"), eval.call(this, i).call(this);
                },
                js_compare: function (e, t) {
                    var i;
                    i = e.indexOf("return") >= 0 ? "(function(){" + e + "})" : "(function(){return (" + e + ")})";
                    var o = eval.call(this, i).call(this);
                    return o ? t.fn(this, t.data) : t.inverse(this, t.data);
                },
            },
        };
        var l = function (e, t) {
            if (2 === arguments.length) {
                var i = new a(e),
                    o = i.compile()(t);
                return (i = null), o;
            }
            return new a(e);
        };
        return (
            (l.registerHelper = function (e, t) {
                a.prototype.helpers[e] = t;
            }),
            (l.unregisterHelper = function (e) {
                (a.prototype.helpers[e] = void 0), delete a.prototype.helpers[e];
            }),
            (l.registerPartial = function (e, t) {
                a.prototype.partials[e] = { template: t };
            }),
            (l.unregisterPartial = function (e, t) {
                a.prototype.partials[e] && ((a.prototype.partials[e] = void 0), delete a.prototype.partials[e]);
            }),
            (l.compile = function (e, t) {
                var i = new a(e, t);
                return i.compile();
            }),
            (l.options = a.prototype.options),
            (l.helpers = a.prototype.helpers),
            (l.partials = a.prototype.partials),
            l
        );
    })()),
    (function (e, t) {
        "use strict";
        if ("function" != typeof e.createEvent) return !1;
        var i,
            o,
            n,
            s,
            r,
            a,
            l,
            d,
            c = function (e) {
                var t = e.toLowerCase(),
                    i = "MS" + e;
                return navigator.msPointerEnabled ? i : t;
            },
            p = {
                useJquery: !t.IGNORE_JQUERY && "undefined" != typeof jQuery,
                swipeThreshold: t.SWIPE_THRESHOLD || 100,
                tapThreshold: t.TAP_THRESHOLD || 150,
                dbltapThreshold: t.DBL_TAP_THRESHOLD || 200,
                longtapThreshold: t.LONG_TAP_THRESHOLD || 1e3,
                tapPrecision: t.TAP_PRECISION / 2 || 30,
                justTouchEvents: t.JUST_ON_TOUCH_DEVICES,
            },
            u = !1,
            f = { touchstart: c("PointerDown") + " touchstart", touchend: c("PointerUp") + " touchend", touchmove: c("PointerMove") + " touchmove" },
            h = function (e, t, i) {
                for (var o = t.split(" "), n = o.length; n--; ) e.addEventListener(o[n], i, !1);
            },
            m = function (e) {
                return e.targetTouches ? e.targetTouches[0] : e;
            },
            g = function () {
                return new Date().getTime();
            },
            v = function (t, n, s, r) {
                var a = e.createEvent("Event");
                if (((a.originalEvent = s), (r = r || {}), (r.x = i), (r.y = o), (r.distance = r.distance), p.useJquery && ((a = jQuery.Event(n, { originalEvent: s })), jQuery(t).trigger(a, r)), a.initEvent)) {
                    for (var l in r) a[l] = r[l];
                    a.initEvent(n, !0, !0), t.dispatchEvent(a);
                }
                for (; t; ) t["on" + n] && t["on" + n](a), (t = t.parentNode);
            },
            y = function (e) {
                if (("mousedown" !== e.type && (u = !0), "mousedown" !== e.type || !u)) {
                    var t = m(e);
                    (n = i = t.pageX),
                        (s = o = t.pageY),
                        (d = setTimeout(function () {
                            v(e.target, "longtap", e), (a = e.target);
                        }, p.longtapThreshold)),
                        (r = g()),
                        T++;
                }
            },
            w = function (e) {
                if ("mouseup" === e.type && u) return void (u = !1);
                var t = [],
                    c = g(),
                    f = s - o,
                    h = n - i;
                if (
                    (clearTimeout(l),
                    clearTimeout(d),
                    h <= -p.swipeThreshold && t.push("swiperight"),
                    h >= p.swipeThreshold && t.push("swipeleft"),
                    f <= -p.swipeThreshold && t.push("swipedown"),
                    f >= p.swipeThreshold && t.push("swipeup"),
                    t.length)
                ) {
                    for (var m = 0; m < t.length; m++) {
                        var y = t[m];
                        v(e.target, y, e, { distance: { x: Math.abs(h), y: Math.abs(f) } });
                    }
                    T = 0;
                } else
                    n >= i - p.tapPrecision && n <= i + p.tapPrecision && s >= o - p.tapPrecision && s <= o + p.tapPrecision && r + p.tapThreshold - c >= 0 && (v(e.target, T >= 2 && a === e.target ? "dbltap" : "tap", e), (a = e.target)),
                        (l = setTimeout(function () {
                            T = 0;
                        }, p.dbltapThreshold));
            },
            k = function (e) {
                if ("mousemove" !== e.type || !u) {
                    var t = m(e);
                    (i = t.pageX), (o = t.pageY);
                }
            },
            T = 0;
        h(e, f.touchstart + (p.justTouchEvents ? "" : " mousedown"), y),
            h(e, f.touchend + (p.justTouchEvents ? "" : " mouseup"), w),
            h(e, f.touchmove + (p.justTouchEvents ? "" : " mousemove"), k),
            (t.tocca = function (e) {
                for (var t in e) p[t] = e[t];
                return p;
            });
    })(document, window);