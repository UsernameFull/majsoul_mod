// ==UserScript==
// @name         雀魂mod
// @namespace    http://tampermonkey.net/
// @version      0.0.9
// @description  雀魂mod,解锁了全人物道具等。。。
// @author       You
// @match        https://*.union-game.com/0/
// @grant        none
// ==/UserScript==
//cfg.item_definition.item.map_  物品一览
//1代表一姬,2代表二阶堂，以此类推
var setcharacter = 12; //人物
var charid = "charid=";
var skin = "skin="
var ca = document.cookie.split(';');
for (var i = 0; i < ca.length; i++) {
    var c = ca[i].trim();
    if (c.indexOf(charid) == 0) {
        setcharacter = c.substring(charid.length, c.length) - 200000;
        console.log(setcharacter)
    }
}
for (var i = 0; i < ca.length; i++) {
    var c = ca[i].trim();
    if (c.indexOf(skin) == 0) {
        setskin = c.substring(skin.length, c.length);
    } else {
        setskin = null
    }
}
/*
id:305001, name_chs:"咸鱼立直棒"
id: 305002, name_chs: "大葱立直棒",
id: 305003, name_chs: "狗骨头立直棒"
id: 305004, name_chs: "巧克力立直棒"
id: 305005, name_chs: "邪眼立直棒",
id: 305006, name_chs: "翡翠立直棒",
id: 305018, name_chs: "猩红立直棒",
id: 305019, name_chs: "24K金棒",
id: 305027, name_chs: "爆竹立直棒",
id: 305028, name_chs: "饺子立直棒",
*/
var setitemlizhibang = 305001; //立直棒
/*
id: 305007, name_chs: "烈焰和牌",
id: 305008, name_chs: "旋风和牌",
id: 305009, name_chs: "樱花和牌",
id: 305023, name_chs: "黑炎和牌",
id: 305029, name_chs: "烟花和牌",
id: 305034, name_chs: "和牌-爆炎龙卷",
id: 305035, name_chs: "和牌-方舟反应堆",
id: 305036, name_chs: "和牌-红玫瑰",
*/
var setitemhupai = 305035; //胡牌特效
/*
id: 305010, name_chs: "苍火立直",
id: 305021, name_chs: "碎冰立直",
id: 305022, name_chs: "火焰立直",
id: 305032, name_chs: "立直-幻影",
id: 305033, name_chs: "立直-飞羽",

*/
var setlizhi = 305033; //立直特效
/*
id: 305011, name_chs: "橘猫爪",
id: 305030, name_chs: "夜月猫爪",
id: 305031, name_chs: "蓝猫爪",
*/
var setshou = 305030; //爪子
/*
id: 305025, name_chs: "《真剑胜负》",
id: 305026, name_chs: "《激斗》"
*/
var setmusic = 305025; //立直音效
setTimeout(
    (function() {
        setTimeout(function() {
            // Hack 开启报番型，作者 aoarashi1988，Handle修改
            if (game) {
                game.Tools.get_chara_audio = function(t, e) {
                    if (e && "" != e) {
                        var i = t.charid,
                            n = cfg.item_definition.character.get(i);
                        if (!n) return null;
                        for (var r = t.level,
                                a = cfg.voice.sound.findGroup(n.sound),
                                s = [],
                                o = 0; o < a.length; o++) a[o].type == e && a[o].level_limit <= r && s.push(o);
                        if (0 == s.length) return null;
                        var l = s[Math.floor(Math.random() * s.length)];
                        return {
                            path: a[l].path,
                            volume: view.AudioMgr.getCVmute(n.id) ? 0 : view.AudioMgr.getCVvolume(n.id) * n.sound_volume,
                            time_length: a[l].time_length
                        };
                    }
                };
                view.AudioMgr.PlayCharactorSound = function(t, e, i) {
                    var n = t.charid,
                        a = cfg.item_definition.character.get(n);
                    if (!a) return null;
                    for (var r = t.level,
                            s = cfg.voice.sound.findGroup(a.sound),
                            o = [],
                            l = 0; l < s.length; l++) s[l].type == e && s[l].level_limit <= r && o.push(l);
                    if (0 == o.length) return null;
                    var h = o[Math.floor(Math.random() * o.length)],
                        c = a.sound_volume;
                    return (
                        (c *= this.getCVvolume(n)), this.getCVmute(n) && (c = 0), {
                            words: s[h]["words_" + GameMgr.client_language],
                            sound: this.PlaySound(s[h].path, c, i)
                        });
                };
                requestAnimationFrame(function autoRun() {
                    try {
                        const arrBackup = cfg.voice.sound.groups_;
                        if (!arrBackup || arrBackup.length === 0) {
                            throw new Error();
                        }
                        console.log("Hacked所有语音");
                        Object.entries(cfg.voice.sound.groups_).forEach(
                            ([soundID, soundGroup]) => {
                                soundGroup.forEach((soundObject, index) => {
                                    soundObject.level_limit = 0;
                                });
                            });
                    } catch (error) {
                        requestAnimationFrame(autoRun);
                    }
                });
            }
            //以下为解锁全立绘，作者UsernameFull
            //设置全部道具
            ! function(t) {
                var e;
                ! function(t) {
                    t[t.none = 0] = "none", t[t.daoju = 1] = "daoju", t[t.gift = 2] = "gift", t[t.fudai = 3] = "fudai", t[t.character_view = 4] = "character_view", t[t.common_view = 5] = "common_view"
                }(e = t.EItemCategory || (t.EItemCategory = {}));
                var i = function(i) {
                    function n() {
                        var t = i.call(this, new ui.lobby.bagUI) || this;
                        return t.container_top = null, t.container_content = null, t.locking = !1, t.tabs = [], t.page_item = null, t.page_gift = null, t.page_desktop = null, t.page_skin = null, t.select_index = 0, n.Inst = t, t
                    }
                    return __extends(n, i), n.init = function() {
                        var t = this;
                        app.NetAgent.AddListener2Lobby("NotifyAccountUpdate", Laya.Handler.create(this, function(e) {
                            var i = e.update;
                            i && i.bag && (t.update_data(i.bag.update_items), t.update_daily_gain_data(i.bag))
                        }, null, !1)), this.fetch()
                    }, n.fetch = function() {
                        var e = this;
                        this._item_map = {}, this._daily_gain_record = {}, app.NetAgent.sendReq2Lobby("Lobby", "fetchBagInfo", {}, function(i, n) {
                            if (i || n.error) t.UIMgr.Inst.showNetReqError("fetchBagInfo", i, n);
                            else {
                                app.Log.log("背包信息：" + JSON.stringify(n));
                                var a = n.bag;
                                //设置全部道具（立直棒及特效不起效果）
                                if (a) {
                                // 	if (a.items)
                                // 		for (h = 0; h < a.items.length; h++) {
                                // 			var r = a.items[h].item_id,
                                // 				s = a.items[h].stack,
                                // 				o = cfg.item_definition.item.get(r);
                                // 			o && (e._item_map[r] = {
                                // 				item_id: r,
                                // 				count: s,
                                // 				category: o.category
                                // 			})
                                // 		}
                                    if (a.daily_gain_record)
                                        for (var l = a.daily_gain_record, h = 0; h < l.length; h++) {
                                            var c = l[h].limit_source_id;
                                            e._daily_gain_record[c] = {};
                                            var u = l[h].record_time;
                                            e._daily_gain_record[c].record_time = u;
                                            var _ = l[h].records;
                                            if (_)
                                                for (var d = 0; d < _.length; d++) e._daily_gain_record[c][_[d].item_id] = _[d].count
                                        }
                                }
                                var items = cfg.item_definition.item.map_;
                                for (var id in items) {
                                    cfg.item_definition.item.get(id);
                                    e._item_map[id] = {
                                        item_id: id,
                                        count: 1,
                                        category: items[id].category
                                    };
                                }
                            }
                        })
                    }, n.find_item = function(t) {
                        var e = this._item_map[t];
                        return e ? {
                            item_id: e.item_id,
                            category: e.category,
                            count: e.count
                        } : null
                    }, n.get_item_count = function(t) {
                        var e = this.find_item(t);
                        if (e) return e.count;
                        if (100001 == t) {
                            var i = GameMgr.Inst.account_data.diamond;
                            return GameMgr.inGooglePlay && GameMgr.Inst.account_numerical_resource[101001] && (i += GameMgr.Inst.account_numerical_resource[101001]), GameMgr.inChina && GameMgr.Inst.account_numerical_resource[101002] && (i += GameMgr.Inst.account_numerical_resource[101002]), i
                        }
                        return 100002 == t ? GameMgr.Inst.access_token.gold : 0
                    }, n.find_items_by_category = function(t) {
                        var e = [];
                        for (var i in this._item_map) this._item_map[i].category == t && e.push({
                            item_id: this._item_map[i].item_id,
                            category: this._item_map[i].category,
                            count: this._item_map[i].count
                        });
                        return e
                    }, n.update_data = function(t) {
                        for (r = 0; r < t.length; r++) {
                            var e = t[r].item_id,
                                i = t[r].stack;
                            i > 0 ? this._item_map.hasOwnProperty(e.toString()) ? this._item_map[e].count = i : this._item_map[e] = {
                                item_id: e,
                                count: i,
                                category: cfg.item_definition.item.get(e).category
                            } : this._item_map.hasOwnProperty(e.toString()) && (this._item_map[e] = 0, delete this._item_map[e])
                        }
                        this.Inst && this.Inst.when_data_change();
                        for (r = 0; r < t.length; r++) {
                            e = t[r].item_id;
                            if (this._item_listener.hasOwnProperty(e.toString()))
                                for (var n = this._item_listener[e], a = 0; a < n.length; a++) n[a].run()
                        }
                        for (var r = 0; r < this._all_item_listener.length; r++) this._all_item_listener[r].run()
                    }, n.update_daily_gain_data = function(t) {
                        var e = t.update_daily_gain_record;
                        if (e)
                            for (var i = 0; i < e.length; i++) {
                                var n = e[i].limit_source_id;
                                this._daily_gain_record[n] || (this._daily_gain_record[n] = {});
                                var a = e[i].record_time;
                                this._daily_gain_record[n].record_time = a;
                                var r = e[i].records;
                                if (r)
                                    for (var s = 0; s < r.length; s++) this._daily_gain_record[n][r[s].item_id] = r[s].count
                            }
                    }, n.get_item_daily_record = function(t, e) {
                        return this._daily_gain_record[t] && this._daily_gain_record[t].record_time && game.Tools.isPassedRefreshTime(this._daily_gain_record[t].record_time) && this._daily_gain_record[t][e] ? this._daily_gain_record[t][e] : 0
                    }, n.add_item_listener = function(t, e) {
                        this._item_listener.hasOwnProperty(t.toString()) || (this._item_listener[t] = []), this._item_listener[t].push(e)
                    }, n.remove_item_listener = function(t, e) {
                        var i = this._item_listener[t];
                        if (i)
                            for (var n = 0; n < i.length; n++)
                                if (i[n] === e) {
                                    i[n] = i[i.length - 1], i.pop();
                                    break
                                }
                    }, n.add_all_item_listener = function(t) {
                        this._all_item_listener.push(t)
                    }, n.remove_all_item_listener = function(t) {
                        for (var e = this._all_item_listener, i = 0; i < e.length; i++)
                            if (e[i] === t) {
                                e[i] = e[e.length - 1], e.pop();
                                break
                            }
                    }, n.prototype.have_red_point = function() {
                        return this.page_desktop.have_red_point()
                    }, n.prototype.onCreate = function() {
                        var e = this;
                        this.container_top = this.me.getChildByName("top"), this.container_top.getChildByName("btn_back").clickHandler = Laya.Handler.create(this, function() {
                            e.locking || e.hide(Laya.Handler.create(e, function() {
                                t.UI_Lobby.Inst.enable = !0
                            }))
                        }, null, !1), this.container_content = this.me.getChildByName("content");
                        for (var i = function(t) {
                                n.tabs.push(n.container_content.getChildByName("tabs").getChildByName("btn" + t)), n.tabs[t].clickHandler = Laya.Handler.create(n, function() {
                                    e.select_index != t && e.on_change_tab(t)
                                }, null, !1)
                            }, n = this, a = 0; a < 5; a++) i(a);
                        this.page_item = new t.UI_Bag_PageItem(this.container_content.getChildByName("page_items")), this.page_gift = new t.UI_Bag_PageGift(this.container_content.getChildByName("page_gift")), this.page_desktop = new t.UI_Bag_PageDesktop(this.container_content.getChildByName("page_desktop")), this.page_skin = new t.UI_Bag_PageSkin(this.container_content.getChildByName("page_skin"))
                    }, n.prototype.show = function(e) {
                        var i = this;
                        void 0 === e && (e = 0), this.enable = !0, this.locking = !0, t.UIBase.anim_alpha_in(this.container_top, {
                            y: -30
                        }, 200), t.UIBase.anim_alpha_in(this.container_content, {
                            y: 30
                        }, 200), Laya.timer.once(300, this, function() {
                            i.locking = !1
                        }), this.on_change_tab(e), game.Scene_Lobby.Inst.change_bg("indoor", !1), 4 != e && this.page_skin.when_update_data(), this.tabs[3].getChildByName("redpoint").visible = this.page_desktop.have_red_point()
                    }, n.prototype.hide = function(e) {
                        var i = this;
                        this.locking = !0, t.UIBase.anim_alpha_out(this.container_top, {
                            y: -30
                        }, 200), t.UIBase.anim_alpha_out(this.container_content, {
                            y: 30
                        }, 200), Laya.timer.once(300, this, function() {
                            i.locking = !1, i.enable = !1, e && e.run()
                        })
                    }, n.prototype.onDisable = function() {
                        this.page_desktop.me.visible && this.page_desktop.close(), this.page_skin.close()
                    }, n.prototype.on_change_tab = function(t) {
                        this.select_index = t;
                        for (var i = 0; i < this.tabs.length; i++) this.tabs[i].skin = game.Tools.localUISrc(t == i ? "myres/shop/tab_choose.png" : "myres/shop/tab_unchoose.png"), this.tabs[i].getChildAt(0).color = t == i ? "#d9b263" : "#8cb65f";
                        switch (this.page_item.close(), this.page_gift.close(), this.page_desktop.close(), this.page_skin.me.visible = !1, t) {
                            case 0:
                                this.page_item.show(e.daoju);
                                break;
                            case 1:
                                this.page_gift.show();
                                break;
                            case 2:
                                this.page_item.show(e.character_view);
                                break;
                            case 3:
                                this.page_desktop.show();
                                break;
                            case 4:
                                this.page_skin.show()
                        }
                    }, n.prototype.when_data_change = function() {
                        this.page_item.me.visible && this.page_item.when_update_data(), this.page_gift.me.visible && this.page_gift.when_update_data()
                    }, n.prototype.on_skin_change = function() {
                        this.page_skin.when_update_data()
                    }, n.prototype.clear_desktop_btn_redpoint = function() {
                        this.tabs[3].getChildByName("redpoint").visible = !1
                    }, n._item_map = {}, n._item_listener = {}, n._all_item_listener = [], n._daily_gain_record = {}, n.Inst = null, n
                }(t.UIBase);
                t.UI_Bag = i
            }(uiscript || (uiscript = {}));
            //桌布和卡背
            ! function(t) {
                var e = function() {
                    function e(t) {
                        var e = this;
                        console.log(this);
                        this.desktop_default = 305044, this.mjp_defalut = 305045, this.lobby_bg_default = 307001, this.tab_index = 0, this.select_index = 0, this.items = [], this.img_desktop = null, this.img_mjp = null, this.btn_save = null, this.seen_lobby_bg_map = null, this.me = t, this.scrollview = t.getChildByName("items").scriptMap["capsui.CScrollView"], this.scrollview.init_scrollview(new Laya.Handler(this, this.render_item), -1, 3, 10), this.scrollview.reset(), this.btn_tablecloth = t.getChildByName("items").getChildByName("btn_tablecloth"), this.btn_tablecloth.clickHandler = Laya.Handler.create(this, function() {
                            1 != e.tab_index && e.change_tab(1)
                        }, null, !1), this.btn_cardback = t.getChildByName("items").getChildByName("btn_cardback"), this.btn_cardback.clickHandler = Laya.Handler.create(this, function() {
                            2 != e.tab_index && e.change_tab(2)
                        }, null, !1), this.btn_lobby_bg = t.getChildByName("items").getChildByName("btn_lobby_bg"), this.btn_lobby_bg.clickHandler = new Laya.Handler(this, function() {
                            3 != e.tab_index && e.change_tab(3)
                        });
                        var i = this.me.getChildByName("preview");
                        this.img_desktop = i.getChildByName("desktop"), this.img_mjp = i.getChildByName("mjp"), this.btn_save = i.getChildByName("btn_use"), this.btn_save.clickHandler = Laya.Handler.create(this, this.save_change, null, !1)
                    }
                    return e.prototype.have_red_point = function() {
                        if (!this.seen_lobby_bg_map) {
                            this.seen_lobby_bg_map = {};
                            var e = Laya.LocalStorage.getItem(game.Tools.eeesss("lobby_bg_list_" + GameMgr.Inst.account_id));
                            if (e)
                                for (var i = (e = game.Tools.dddsss(e)).split(","), n = 0; n < i.length; n++) this.seen_lobby_bg_map[i[n]] = 1
                        }
                        for (var a = t.UI_Bag.find_items_by_category(t.EItemCategory.common_view), n = 0; n < a.length; n++) {
                            if (3 == cfg.item_definition.item.get(a[n].item_id).type && !this.seen_lobby_bg_map[a[n].item_id]) return !0
                        }
                        return !1
                    }, e.prototype.show = function() {
                        this.me.visible = !0, this.btn_save.visible = !1, this.change_tab(1), this.btn_lobby_bg.getChildByName("redpoint").visible = this.have_red_point()
                    }, e.prototype.close = function() {
                        this.me.visible = !1, this.items = [], this.scrollview.reset(), Laya.loader.clearTextureRes(this.img_desktop.skin), Laya.loader.clearTextureRes(this.img_mjp.skin), this.img_desktop.skin = "", this.img_mjp.skin = "", game.LoadMgr.clearImgSkin(this.img_desktop), game.LoadMgr.clearImgSkin(this.img_mjp)
                    }, e.prototype.change_tab = function(e) {
                        var i = this;
                        if (this.tab_index = e, this.items = [], 1 == e ? this.items.push({
                                item_id: this.desktop_default,
                                owned: !0
                            }) : 2 == e ? this.items.push({
                                item_id: this.mjp_defalut,
                                owned: !0
                            }) : 3 == e && this.items.push({
                                item_id: this.lobby_bg_default,
                                owned: !0
                            }), this.scrollview.reset(), this.select_index = 0, this.btn_tablecloth.getChildByName("inchoose").visible = 1 == e, this.btn_cardback.getChildByName("inchoose").visible = 2 == e, this.btn_lobby_bg.getChildByName("inchoose").visible = 3 == e, 1 == e || 2 == e) {
                            var n = t.UI_Bag.find_items_by_category(t.EItemCategory.common_view);
                            n = n.sort(function(t, e) {
                                return t.item_id - e.item_id
                            });
                            for (a = 0; a < n.length; a++)
                                if (n[a].item_id != this.desktop_default && n[a].item_id != this.mjp_defalut) {
                                    cfg.item_definition.item.get(n[a].item_id).type == e && (this.items.push({
                                        item_id: n[a].item_id,
                                        owned: !0
                                    }), n[a].item_id == game.GameUtility.get_common_view_id(e) && (this.select_index = this.items.length - 1))
                                }
                        } else 3 == e && cfg.item_definition.item.forEach(function(n) {
                            n.id != i.lobby_bg_default && 5 == n.category && 3 == n.type && (i.items.push({
                                item_id: n.id,
                                owned: t.UI_Bag.get_item_count(n.id) > 0
                            }), n.id == game.GameUtility.get_common_view_id(e) && (i.select_index = i.items.length - 1))
                        });
                        if (this.select_index < 0 && (this.select_index = 0), this.scrollview.addItem(this.items.length), this._on_select_change(), 3 == e) {
                            this.btn_lobby_bg.getChildByName("redpoint").visible = !1, t.UI_Bag.Inst.clear_desktop_btn_redpoint();
                            for (var a = 0; a < this.items.length; a++) this.items[a].owned && (this.seen_lobby_bg_map[this.items[a].item_id.toString()] = 1);
                            var r = "";
                            for (var s in this.seen_lobby_bg_map) "" != r && (r += ","), r += s;
                            Laya.LocalStorage.setItem(game.Tools.eeesss("lobby_bg_list_" + GameMgr.Inst.account_id), game.Tools.eeesss(r))
                        }
                    }, e.prototype.render_item = function(e) {
                        var i = this,
                            n = e.index,
                            a = e.container,
                            r = e.cache_data,
                            s = this.items[n],
                            o = cfg.item_definition.item.get(s.item_id),
                            l = a.getChildByName("btn").getChildByName("inchoose");
                        this.select_index == n ? l.visible = !0 : l.visible = !1;
                        var h = a.getChildByName("btn");
                        h.clickHandler = Laya.Handler.create(this, function() {
                            if (i.select_index != n) {
                                var e = i.select_index;
                                i.select_index = n, l.visible = !0, e >= 0 && e < i.items.length && i.scrollview.wantToRefreshItem(e), i._on_select_change()
                            } else t.UI_ItemDetail.Inst.show(s.item_id)
                        }, null, !1);
                        var c = a.getChildByName("useing"),
                            u = GameMgr.Inst.commonview_slot[this.tab_index];
                        u || (1 == this.tab_index ? u = this.desktop_default : 2 == this.tab_index ? u = this.mjp_defalut : 3 == this.tab_index && (u = this.lobby_bg_default)), u == s.item_id ? c.visible = !0 : c.visible = !1, h.getChildByName("lock").visible = !s.owned, r.skin || (r.skin = new t.UI_Item_Skin(h.getChildByName("icon"))), r.skin.setSkin(o.icon);
                        a.getChildByName("name").text = o["name_" + GameMgr.client_language]
                    }, e.prototype._on_select_change = function() {
                        if (this.img_mjp.visible = 1 == this.tab_index || 2 == this.tab_index, this.select_index >= 0 && this.select_index < this.items.length) {
                            var t = this.items[this.select_index];
                            if (t.owned) {
                                var e = GameMgr.Inst.commonview_slot[this.tab_index];
                                e || (1 == this.tab_index ? e = this.desktop_default : 2 == this.tab_index ? e = this.mjp_defalut : 3 == this.tab_index && (e = this.lobby_bg_default)), e == t.item_id ? this.btn_save.visible = !1 : (this.btn_save.visible = !0, this.btn_save.getChildByName("info").text = game.Tools.strOfLocalization(2035))
                            } else this.btn_save.visible = !1;
                            1 == this.tab_index ? (this._show_desktop_preview(t.item_id), this._show_mjp_preview(game.GameUtility.get_common_view_id(game.ECommonView.mjp))) : 2 == this.tab_index ? (this._show_mjp_preview(t.item_id), this._show_desktop_preview(game.GameUtility.get_common_view_id(game.ECommonView.desktop))) : 3 == this.tab_index && this._show_lobby_bg_preview(t.item_id)
                        } else this.btn_save.visible = !1, 1 == this.tab_index ? (this._show_desktop_preview(0), this._show_mjp_preview(game.GameUtility.get_common_view_id(game.ECommonView.mjp))) : 2 == this.tab_index ? (this._show_mjp_preview(0), this._show_desktop_preview(game.GameUtility.get_common_view_id(game.ECommonView.desktop))) : 3 == this.tab_index && this._show_lobby_bg_preview(0)
                    }, e.prototype._show_desktop_preview = function(t) {
                        var e = cfg.item_definition.view.get(t),
                            i = "";
                        e || (e = cfg.item_definition.view.get(this.desktop_default)), i = "myres2/tablecloth/" + e.res_name + "/preview.jpg", game.LoadMgr.clearImgSkin(this.img_desktop), "" != this.img_desktop.skin && (Laya.loader.clearTextureRes(this.img_desktop.skin), this.img_desktop.skin = ""), game.LoadMgr.setImgSkin(this.img_desktop, i)
                    }, e.prototype._show_mjp_preview = function(t) {
                        var e = cfg.item_definition.view.get(t),
                            i = "";
                        e || (e = cfg.item_definition.view.get(this.mjp_defalut)), i = "myres2/mjp/" + e.res_name + "/preview.png", game.LoadMgr.clearImgSkin(this.img_mjp), "" != this.img_mjp.skin && (Laya.loader.clearTextureRes(this.img_mjp.skin), this.img_mjp.skin = ""), game.LoadMgr.setImgSkin(this.img_mjp, i)
                    }, e.prototype._show_lobby_bg_preview = function(t) {
                        var e = cfg.item_definition.view.get(t),
                            i = "";
                        e || (e = cfg.item_definition.view.get(this.lobby_bg_default)), i = "myres2/lobby_bg/" + e.res_name + ".jpg", game.LoadMgr.clearImgSkin(this.img_desktop), "" != this.img_desktop.skin && (Laya.loader.clearTextureRes(this.img_desktop.skin), this.img_desktop.skin = ""), game.LoadMgr.setImgSkin(this.img_desktop, i)
                    }, e.prototype.save_change = function() {
                        var t = this.items[this.select_index],
                            e = t.item_id;
                        if (0 == this.select_index && (e = 0), GameMgr.Inst.commonview_slot[this.tab_index] = e, 
                        //屏蔽改变桌布，牌背，大厅背景的网络请求
                        // app.NetAgent.sendReq2Lobby("Lobby", "changeCommonView", {
                        // 		slot: this.tab_index,
                        // 		value: e
                        // 	}, function(t, e) {
                        // 		t ? app.Log.log(t) : app.Log.log(e)
                        //     }), 
                            2 == this.tab_index && GameMgr.Inst.load_mjp_view(e), 3 == this.tab_index) {
                            var i = "";
                            if (0 != this.select_index) {
                                i = "scene/Assets/Resource/lobby/" + cfg.item_definition.view.get(t.item_id).res_name + ".jpg"
                            } else i = "scene/Assets/Resource/lobby/yard.jpg";
                            game.Scene_Lobby.Inst.set_lobby_bg(i)
                        }
                        for (var n = 0; n < this.items.length; n++) this.scrollview.wantToRefreshItem(n);
                        this._on_select_change()
                    }, e
                }();
                t.UI_Bag_PageDesktop = e
            }(uiscript || (uiscript = {}));
            //修改牌桌上角色
            ! function(t) {
                var e = function() {
                    function e() {
                        var e = this;
                        this.urls = [], this.link_index = -1, this.connect_state = t.EConnectState.none, this.reconnect_count = 0, this.reconnect_span = [500, 1e3, 3e3, 6e3, 1e4, 15e3], this.playerreconnect = !1, this.lasterrortime = 0, this.load_over = !1, this.loaded_player_count = 0, this.real_player_count = 0, app.NetAgent.AddListener2MJ("NotifyPlayerLoadGameReady", Laya.Handler.create(this, function(t) {
                            app.Log.log("NotifyPlayerLoadGameReady: " + JSON.stringify(t)), e.loaded_player_count = t.ready_id_list.length, e.load_over && uiscript.UI_Loading.Inst.enable && uiscript.UI_Loading.Inst.showLoadCount(e.loaded_player_count, e.real_player_count)
                        }))
                    }
                    return Object.defineProperty(e, "Inst", {
                        get: function() {
                            return null == this._Inst ? this._Inst = new e : this._Inst
                        },
                        enumerable: !0,
                        configurable: !0
                    }), e.prototype.OpenConnect = function(e, i, n, a, r) {
                        var s = this;
                        uiscript.UI_Loading.Inst.show("enter_mj"), this.Close(), view.AudioMgr.StopMusic(), Laya.timer.once(500, this, function() {
                            s.url = "", s.token = e, s.game_uuid = i, s.server_location = n, GameMgr.Inst.ingame = !0, GameMgr.Inst.mj_server_location = n, GameMgr.Inst.mj_game_token = e, GameMgr.Inst.mj_game_uuid = i, s.playerreconnect = a, s._setState(t.EConnectState.tryconnect), s.load_over = !1, s.loaded_player_count = 0, s.real_player_count = 0, s._fetch_gateway(0)
                        })
                    }, e.prototype.Close = function() {
                        this.load_over = !1, app.Log.log("MJNetMgr close"), this._setState(t.EConnectState.none), app.NetAgent.Close2MJ(), this.url = ""
                    }, e.prototype._OnConnent = function(e) {
                        app.Log.log("MJNetMgr _OnConnent event:" + e), e == Laya.Event.CLOSE || e == Laya.Event.ERROR ? Laya.timer.currTimer - this.lasterrortime > 100 && (this.lasterrortime = Laya.timer.currTimer, this.connect_state == t.EConnectState.tryconnect ? this._try_to_linknext() : this.connect_state == t.EConnectState.connecting ? view.DesktopMgr.Inst.active ? (view.DesktopMgr.Inst.duringReconnect = !0, this._setState(t.EConnectState.reconnecting), this.reconnect_count = 0, this._Reconnect()) : (this._setState(t.EConnectState.disconnect), uiscript.UIMgr.Inst.ShowErrorInfo(t.Tools.strOfLocalization(2008)), t.Scene_MJ.Inst.ForceOut()) : this.connect_state == t.EConnectState.reconnecting && this._Reconnect()) : e == Laya.Event.OPEN && (this.connect_state == t.EConnectState.tryconnect ? (this._setState(t.EConnectState.connecting), this._ConnectSuccess()) : this.connect_state == t.EConnectState.reconnecting && (this._setState(t.EConnectState.connecting), this._ConnectSuccess()))
                    }, e.prototype._Reconnect = function() {
                        var e = this;
                        t.LobbyNetMgr.Inst.connect_state == t.EConnectState.none || t.LobbyNetMgr.Inst.connect_state == t.EConnectState.disconnect ? this._setState(t.EConnectState.disconnect) : t.LobbyNetMgr.Inst.connect_state == t.EConnectState.connecting && GameMgr.Inst.logined ? this.reconnect_count >= this.reconnect_span.length ? this._setState(t.EConnectState.disconnect) : (Laya.timer.once(this.reconnect_span[this.reconnect_count], this, function() {
                            e.connect_state == t.EConnectState.reconnecting && (app.Log.log("MJNetMgr reconnect count:" + e.reconnect_count), app.NetAgent.connect2MJ(e.url, Laya.Handler.create(e, e._OnConnent, null, !1)))
                        }), this.reconnect_count++) : Laya.timer.once(1e3, this, this._Reconnect)
                    }, e.prototype._try_to_linknext = function() {
                        this.link_index++, this.url = "", app.Log.log("mj _try_to_linknext(" + this.link_index + ") url.length=" + this.urls.length), this.link_index < 0 || this.link_index >= this.urls.length ? (this._setState(t.EConnectState.none), uiscript.UIMgr.Inst.ShowErrorInfo(t.Tools.strOfLocalization(59)), this._SendDebugInfo(), view.DesktopMgr.Inst && !view.DesktopMgr.Inst.active && t.Scene_MJ.Inst.ForceOut()) : (app.NetAgent.connect2MJ(this.urls[this.link_index].url, Laya.Handler.create(this, this._OnConnent, null, !1)), this.url = this.urls[this.link_index].url)
                    }, e.prototype._fetch_gateway = function(e) {
                        var i = this;
                        this.urls = [], this.link_index = -1, app.Log.log("mj _fetch_gateway retry_count:" + e);
                        ! function(n) {
                            var a = new Laya.HttpRequest;
                            a.once(Laya.Event.COMPLETE, i, function(n) {
                                ! function(n) {
                                    var a = JSON.parse(n);
                                    if (app.Log.log("mj _fetch_gateway func_success data = " + n), a.maintenance) i._setState(t.EConnectState.none), uiscript.UIMgr.Inst.ShowErrorInfo(t.Tools.strOfLocalization(2009)), view.DesktopMgr.Inst.active || t.Scene_MJ.Inst.ForceOut();
                                    else if (a.servers && a.servers.length > 0) {
                                        for (var r = a.servers, s = t.Tools.deal_gateway(r), o = 0; o < s.length; o++) i.urls.push({
                                            name: t.LobbyNetMgr.gateway_name + "_" + o,
                                            url: s[o]
                                        });
                                        i.link_index = -1, i._try_to_linknext()
                                    } else e < 1 ? Laya.timer.once(1e3, i, function() {
                                        i._fetch_gateway(e + 1)
                                    }) : (uiscript.UIMgr.Inst.ShowErrorInfo(t.Tools.strOfLocalization(60)), i._SendDebugInfo(), view.DesktopMgr.Inst && !view.DesktopMgr.Inst.active && t.Scene_MJ.Inst.ForceOut(), i._setState(t.EConnectState.none))
                                }(n)
                            }), a.once(Laya.Event.ERROR, i, function(n) {
                                app.Log.log("mj _fetch_gateway func_error"), e < 1 ? Laya.timer.once(500, i, function() {
                                    i._fetch_gateway(e + 1)
                                }) : (uiscript.UIMgr.Inst.ShowErrorInfo(t.Tools.strOfLocalization(58)), i._SendDebugInfo(), view.DesktopMgr.Inst.active || t.Scene_MJ.Inst.ForceOut(), i._setState(t.EConnectState.none))
                            });
                            var r = [];
                            r.push("If-Modified-Since"), r.push("0"), n += "?service=ws-game-gateway", GameMgr.inHttps ? n += "&protocol=ws&ssl=true" : n += "&protocol=ws&ssl=false", n += "&location=" + i.server_location, a.send(n, "", "get", "text", r), app.Log.log("mj _fetch_gateway func_fetch url = " + n)
                        }(t.LobbyNetMgr.gateway_url)
                    }, e.prototype._setState = function(e) {
                        this.connect_state = e, GameMgr.inRelease || null != uiscript.UI_Common.Inst && (e == t.EConnectState.none ? uiscript.UI_Common.Inst.label_net_mj.text = "" : e == t.EConnectState.tryconnect ? (uiscript.UI_Common.Inst.label_net_mj.text = "尝试连接麻将服务器", uiscript.UI_Common.Inst.label_net_mj.color = "#000000") : e == t.EConnectState.connecting ? (uiscript.UI_Common.Inst.label_net_mj.text = "麻将服务器：正常", uiscript.UI_Common.Inst.label_net_mj.color = "#00ff00") : e == t.EConnectState.disconnect ? (uiscript.UI_Common.Inst.label_net_mj.text = "麻将服务器：断开连接", uiscript.UI_Common.Inst.label_net_mj.color = "#ff0000", uiscript.UI_Disconnect.Inst && uiscript.UI_Disconnect.Inst.show()) : e == t.EConnectState.reconnecting && (uiscript.UI_Common.Inst.label_net_mj.text = "麻将服务器：正在重连", uiscript.UI_Common.Inst.label_net_mj.color = "#ff0000", uiscript.UI_Disconnect.Inst && uiscript.UI_Disconnect.Inst.show()))
                    }, e.prototype._ConnectSuccess = function() {
                        var e = this;
                        app.Log.log("MJNetMgr _ConnectSuccess "), this.load_over = !1, app.NetAgent.sendReq2MJ("FastTest", "authGame", {
                            account_id: GameMgr.Inst.account_id,
                            token: this.token,
                            game_uuid: this.game_uuid
                        }, function(i, n) {
                            if (i || n.error) uiscript.UIMgr.Inst.showNetReqError("authGame", i, n), t.Scene_MJ.Inst.GameEnd(), view.AudioMgr.PlayMusic("music/lobby.mp3");
                            else {
                                app.Log.log("麻将桌验证通过：" + JSON.stringify(n)), uiscript.UI_Loading.Inst.setProgressVal(.1);
                                var a = [];
                                view.DesktopMgr.player_link_state = n.state_list;
                                var r = t.Tools.strOfLocalization(2003),
                                    s = n.game_config.mode;
                                view.ERuleMode.Liqi4;
                                s.mode < 10 ? (view.ERuleMode.Liqi4, e.real_player_count = 4) : s.mode < 20 && (view.ERuleMode.Liqi3, e.real_player_count = 3);
                                for (h = 0; h < e.real_player_count; h++) a.push(null);
                                s.extendinfo && (r = t.Tools.strOfLocalization(2004)), s.detail_rule && s.detail_rule.ai_level && (1 === s.detail_rule.ai_level && (r = t.Tools.strOfLocalization(2003)), 2 === s.detail_rule.ai_level && (r = t.Tools.strOfLocalization(2004)));
                                for (h = 0; h < n.seat_list.length; h++) {
                                    var o = n.seat_list[h];
                                    if (0 == o) a[h] = {
                                        nickname: r,
                                        avatar_id: 400101,
                                        level: {
                                            id: 10101
                                        },
                                        level3: {
                                            id: 20101
                                        },
                                        character: {
                                            charid: 200001,
                                            level: 0,
                                            exp: 0,
                                            views: [],
                                            skin: 400101,
                                            is_upgraded: !1
                                        }
                                    };
                                    else {
                                        0;
                                        for (var l = 0; l < n.players.length; l++)
                                            if (n.players[l].account_id == o) {
                                                a[h] = n.players[l];
                                                console.log("n_id:" + a[h].account_id);
                                                    console.log(GameMgr.Inst.account_id);
                                                    //修改牌桌上人物头像及皮肤
                                                    if (a[h].account_id == GameMgr.Inst.account_id) {
                                                        (a[h].character = {
                                                            charid: GameMgr.Inst.account_data.my_charid,
                                                            level: 5,
                                                            exp: 0,
                                                            skin: GameMgr.Inst.account_data.my_character.skin,
                                                            views: GameMgr.Inst.account_data.my_character.views,
                                                            is_upgraded: 1
                                                        }), (a[h].avatar_id = GameMgr.Inst.account_data.my_character.skin);
                                                    }
                                                    //end
                                                break
                                            }
                                    }
                                }
                                for (var h = 0; h < e.real_player_count; h++) null == a[h] && (a[h] = {
                                    account: 0,
                                    nickname: t.Tools.strOfLocalization(2010),
                                    avatar_id: 400101,
                                    level: {
                                        id: 10101
                                    },
                                    level3: {
                                        id: 20101
                                    },
                                    character: {
                                        charid: 200001,
                                        level: 0,
                                        exp: 0,
                                        views: [],
                                        skin: 400101,
                                        is_upgraded: !1
                                    }
                                });
                                e.loaded_player_count = n.ready_id_list.length, e._AuthSuccess(a, n.is_game_start, n.game_config.toJSON())
                            }
                        })
                    }, e.prototype._AuthSuccess = function(e, i, n) {
                        var a = this;
                        view.DesktopMgr.Inst && view.DesktopMgr.Inst.active ? (this.load_over = !0, Laya.timer.once(500, this, function() {
                            app.Log.log("重连信息1 round_id:" + view.DesktopMgr.Inst.round_id + " step:" + view.DesktopMgr.Inst.current_step), view.DesktopMgr.Inst.Reset(), view.DesktopMgr.Inst.duringReconnect = !0, uiscript.UI_Loading.Inst.setProgressVal(.2), app.NetAgent.sendReq2MJ("FastTest", "syncGame", {
                                round_id: view.DesktopMgr.Inst.round_id,
                                step: view.DesktopMgr.Inst.current_step
                            }, function(e, i) {
                                e || i.error ? (uiscript.UIMgr.Inst.showNetReqError("syncGame", e, i), t.Scene_MJ.Inst.ForceOut()) : (app.Log.log("[syncGame] " + JSON.stringify(i)), i.isEnd ? (uiscript.UIMgr.Inst.ShowErrorInfo(t.Tools.strOfLocalization(2011)), t.Scene_MJ.Inst.GameEnd()) : (uiscript.UI_Loading.Inst.setProgressVal(.3), view.DesktopMgr.Inst.fetchLinks(), view.DesktopMgr.Inst.Reset(), view.DesktopMgr.Inst.duringReconnect = !0, view.DesktopMgr.Inst.syncGameByStep(i.game_restore)))
                            })
                        })) : t.Scene_MJ.Inst.openMJRoom(e, Laya.Handler.create(this, function() {
                            view.DesktopMgr.Inst.initRoom(JSON.parse(JSON.stringify(n)), e, GameMgr.Inst.account_id, view.EMJMode.play, Laya.Handler.create(a, function() {
                                i ? Laya.timer.frameOnce(10, a, function() {
                                    app.Log.log("重连信息2 round_id:-1 step:" + 1e6), view.DesktopMgr.Inst.Reset(), view.DesktopMgr.Inst.duringReconnect = !0, app.NetAgent.sendReq2MJ("FastTest", "syncGame", {
                                        round_id: "-1",
                                        step: 1e6
                                    }, function(e, i) {
                                        app.Log.log("syncGame " + JSON.stringify(i)), e || i.error ? (uiscript.UIMgr.Inst.showNetReqError("syncGame", e, i), t.Scene_MJ.Inst.ForceOut()) : (uiscript.UI_Loading.Inst.setProgressVal(1), view.DesktopMgr.Inst.fetchLinks(), a._PlayerReconnectSuccess(i))
                                    })
                                }) : Laya.timer.frameOnce(10, a, function() {
                                    app.Log.log("send enterGame"), view.DesktopMgr.Inst.Reset(), view.DesktopMgr.Inst.duringReconnect = !0, app.NetAgent.sendReq2MJ("FastTest", "enterGame", {}, function(e, i) {
                                        e || i.error ? (uiscript.UIMgr.Inst.showNetReqError("enterGame", e, i), t.Scene_MJ.Inst.ForceOut()) : (uiscript.UI_Loading.Inst.setProgressVal(1), app.Log.log("enterGame"), a._EnterGame(i), view.DesktopMgr.Inst.fetchLinks())
                                    })
                                })
                            }))
                        }), Laya.Handler.create(this, function(t) {
                            return uiscript.UI_Loading.Inst.setProgressVal(.1 + .8 * t)
                        }, null, !1))
                    }, e.prototype._EnterGame = function(e) {
                        app.Log.log("正常进入游戏: " + JSON.stringify(e)), e.is_end ? (uiscript.UIMgr.Inst.ShowErrorInfo(t.Tools.strOfLocalization(2011)), t.Scene_MJ.Inst.GameEnd()) : e.game_restore ? view.DesktopMgr.Inst.syncGameByStep(e.game_restore) : (console.log("正常进入游戏：" + Laya.Stat.currentMemorySize / 1024 / 1024 + " MB"), this.load_over = !0, this.load_over && uiscript.UI_Loading.Inst.enable && uiscript.UI_Loading.Inst.showLoadCount(this.loaded_player_count, this.real_player_count), view.DesktopMgr.Inst.duringReconnect = !1, view.DesktopMgr.Inst.StartChainAction(0))
                    }, e.prototype._PlayerReconnectSuccess = function(e) {
                        app.Log.log("_PlayerReconnectSuccess data:" + JSON.stringify(e)), e.isEnd ? (uiscript.UIMgr.Inst.ShowErrorInfo(t.Tools.strOfLocalization(2011)), t.Scene_MJ.Inst.GameEnd()) : e.game_restore ? view.DesktopMgr.Inst.syncGameByStep(e.game_restore) : (uiscript.UIMgr.Inst.ShowErrorInfo(t.Tools.strOfLocalization(2012)), t.Scene_MJ.Inst.ForceOut())
                    }, e.prototype._SendDebugInfo = function() {
                        var t = {};
                        t.type = "未连接了!!!!!!", t.logs = app.Log.getCacheLog(), GameMgr.Inst.postInfo2Server(t)
                    }, e._Inst = null, e
                }();
                t.MJNetMgr = e
            }(game || (game = {}));
            //打完之后刷新用户数据，重新赋值为寮舍选择人物
            ! function(t) {
                var e = function() {
                        function e(e) {
                            var i = this;
                            this.money = null, this.rank = null, this.small_rank = null, this.rank_show_type = 0, this.me = e;
                            var n = e.getChildByName("container_name");
                            this.label_name = n.getChildByName("label_name"), this.rank = new t.UI_Level(n.getChildByName("rank")), this.title = new t.UI_PlayerTitle(n.getChildByName("img_title")), this.small_rank = new t.UI_Level(n.getChildByName("btn_small_rank")), this.money = new t.UI_Money(e, Laya.Handler.create(h.Inst, h.Inst.Hide, null, !1), Laya.Handler.create(this, function() {
                                return h.Inst.locking
                            }, null, !1)), n.getChildByName("btn_info").clickHandler = Laya.Handler.create(this, function() {
                                t.UI_PlayerInfo.Inst.show(), GameMgr.Inst.BehavioralStatistics(13)
                            }, null, !1), e.getChildByName("btn_activity").clickHandler = Laya.Handler.create(this, function() {
                                h.Inst.locking || (t.UI_Activity.Inst.show(), GameMgr.Inst.BehavioralStatistics(18))
                            }, null, !1), e.getChildByName("btn_rank").clickHandler = Laya.Handler.create(this, function() {
                                h.Inst.locking || (t.UI_Rank.Inst.show(), GameMgr.Inst.BehavioralStatistics(18))
                            }, null, !1), e.getChildByName("btn_info").clickHandler = Laya.Handler.create(this, function() {
                                h.Inst.locking || t.UI_Info.Inst.show()
                            }, null, !1), e.getChildByName("btn_set").clickHandler = Laya.Handler.create(this, function() {
                                h.Inst.locking || t.UI_Config.Inst.show()
                            }, null, !1), e.getChildByName("btn_help").clickHandler = Laya.Handler.create(this, function() {
                                h.Inst.locking || t.UI_Rules.Inst.show()
                            }, null, !1), e.getChildByName("btn_xinshouyindao").clickHandler = Laya.Handler.create(this, function() {
                                h.Inst.locking || (t.UI_PiPeiYuYue.Inst.enable ? t.UI_Popout.PopOutNoTitle(game.Tools.strOfLocalization(204), null) : h.Inst.Hide(Laya.Handler.create(i, function() {
                                    t.UI_XinShouYinDao.Inst.show(0, Laya.Handler.create(i, function() {
                                        h.Inst.enable = !0
                                    }))
                                })))
                            }, null, !1), n.getChildByName("btn_small_rank").clickHandler = new Laya.Handler(this, function() {
                                h.Inst.locking || (0 == i.rank_show_type ? i.rank_show_type = 1 : i.rank_show_type = 0, i.show_rank(), Laya.LocalStorage.setItem("rank_show_type", i.rank_show_type.toString()))
                            });
                            var a = Laya.LocalStorage.getItem("rank_show_type");
                            this.rank_show_type = "1" == a ? 1 : 0
                        }
                        return e.prototype.refresh = function() {
                            var t = GameMgr.Inst.account_data;
                            this.label_name.text = t.nickname, this.title.id = t.title, this.show_rank(), this.money.onEnable(), this.refreshRedpoint()
                        }, e.prototype.refreshRedpoint = function() {
                            this.me.getChildByName("btn_activity").getChildByName("redpoint").visible = t.UI_Mail.haveRedPoint || t.UI_Activity.haveRedPoint, this.me.getChildByName("btn_info").getChildByName("redpoint").visible = t.UI_Info.haveRedPoint
                        }, e.prototype.show_rank = function() {
                            var t = "level",
                                e = "level3";
                            1 == this.rank_show_type && (t = "level3", e = "level"), this.rank.id = GameMgr.Inst.account_data[t].id, this.small_rank.id = GameMgr.Inst.account_data[e].id
                        }, e
                    }(),
                    i = function() {
                        function e(e) {
                            this.me = e, this.btn_dajiangsai = e.getChildByName("btn_dajiangsai"), this.btn_yibanchang = e.getChildByName("btn_yibanchang"), this.btn_yourenfang = e.getChildByName("btn_yourenfang"), this.btn_yibanchang.clickHandler = Laya.Handler.create(this, function() {
                                h.Inst.setPage(1), GameMgr.Inst.BehavioralStatistics(1)
                            }, null, !1), this.btn_yourenfang.clickHandler = Laya.Handler.create(this, function() {
                                h.Inst.setPage(2), GameMgr.Inst.BehavioralStatistics(2)
                            }, null, !1), this.btn_dajiangsai.clickHandler = Laya.Handler.create(this, function() {
                                GameMgr.Inst.BehavioralStatistics(3), h.Inst.setPage(3), t.UI_Activity.activity_is_running(1011) && Laya.LocalStorage.setItem("art0_1011_" + GameMgr.Inst.account_id, Date.now().toString())
                            }, null, !1)
                        }
                        return e.prototype.onEnable = function(e) {
                            var i = this;
                            this.btn_yibanchang.visible = !1, this.btn_dajiangsai.visible = !1, this.btn_yourenfang.visible = !1, this.btn_yibanchang.alpha = 1, this.btn_dajiangsai.alpha = 1, this.btn_yourenfang.alpha = 1, Laya.timer.once(e, this, function() {
                                view.AudioMgr.PlayAudio(104), i.btn_yibanchang.x = 700, i.btn_yibanchang.y = 405, i.btn_yibanchang.scaleX = .2, i.btn_yibanchang.scaleY = .2, i.btn_yibanchang.visible = !0, i.btn_yibanchang.alpha = 0, Laya.Tween.to(i.btn_yibanchang, {
                                    x: 1183,
                                    y: 368,
                                    scaleX: 1.2,
                                    scaleY: 1.2,
                                    alpha: 1
                                }, 233, function(t, e, i, n) {
                                    return Laya.Ease.backOut(t, e, i, n, 1)
                                })
                            }), Laya.timer.once(e + 100, this, function() {
                                view.AudioMgr.PlayAudio(104), i.btn_dajiangsai.x = 700, i.btn_dajiangsai.y = 530, i.btn_dajiangsai.scaleX = .2, i.btn_dajiangsai.scaleY = .2, i.btn_dajiangsai.visible = !0, i.btn_dajiangsai.alpha = 0, Laya.Tween.to(i.btn_dajiangsai, {
                                    x: 1110,
                                    y: 547,
                                    scaleX: 1.2,
                                    scaleY: 1.2,
                                    alpha: 1
                                }, 233, function(t, e, i, n) {
                                    return Laya.Ease.backOut(t, e, i, n, 1)
                                })
                            }), Laya.timer.once(e + 200, this, function() {
                                view.AudioMgr.PlayAudio(104), i.btn_yourenfang.x = 700, i.btn_yourenfang.y = 634, i.btn_yourenfang.scaleX = .2, i.btn_yourenfang.scaleY = .2, i.btn_yourenfang.visible = !0, i.btn_yourenfang.alpha = 0, Laya.Tween.to(i.btn_yourenfang, {
                                    x: 1123,
                                    y: 736,
                                    scaleX: 1.2,
                                    scaleY: 1.2,
                                    alpha: 1
                                }, 233, function(t, e, i, n) {
                                    return Laya.Ease.backOut(t, e, i, n, 1)
                                })
                            });
                            var n = !1;
                            if (t.UI_Activity.activity_is_running(1011)) {
                                var a = Laya.LocalStorage.getItem("art0_1011_" + GameMgr.Inst.account_id),
                                    r = 0;
                                a && "" != a && (r = parseInt(a)), n = Date.now() > r + 864e6
                            }
                            this.btn_dajiangsai.getChildByName("redpoint").visible = n, this.me.visible = !0
                        }, e.prototype.onDisable = function(e) {
                            var i = this;
                            t.UIBase.anim_alpha_out(this.btn_yibanchang, {
                                x: -500,
                                y: 450,
                                scaleX: -1,
                                scaleY: -1
                            }, 200, e, null, Laya.Ease.backIn), t.UIBase.anim_alpha_out(this.btn_dajiangsai, {
                                x: -500,
                                y: 150,
                                scaleX: -1,
                                scaleY: -1
                            }, 200, e, null, Laya.Ease.backIn), t.UIBase.anim_alpha_out(this.btn_yourenfang, {
                                x: -500,
                                y: -150,
                                scaleX: -1,
                                scaleY: -1
                            }, 200, e, null, Laya.Ease.backIn), Laya.timer.once(200 + e, this, function() {
                                i.me.visible = !1
                            })
                        }, e
                    }(),
                    n = function() {
                        function t(t) {
                            var e = this;
                            this.me = t, this.me.visible = !1, this.btn_back = t.getChildByName("btn_back"), this.btn_back.clickHandler = new Laya.Handler(this, function() {
                                e.func_back && e.func_back.run()
                            }), this.title = t.getChildByName("title")
                        }
                        return t.prototype.show = function(t, e) {
                            this.title.text = t, game.Tools.labelLocalizationPosition(this.title, 345, this.title.width, !0), this.func_back = e, this.me.visible || (this.me.visible = !0, h.Inst.me.page_title_in.play(0, !1)), Laya.timer.clearAll(this)
                        }, t.prototype.close = function() {
                            var t = this;
                            this.me.visible && (h.Inst.me.page_title_out.play(0, !1), Laya.timer.once(200, this, function() {
                                t.me.visible = !1
                            }))
                        }, t
                    }(),
                    a = function() {
                        function e(e) {
                            var i = this;
                            this.locking = !1, this.me = e, this.me.visible = !1, this.p0 = e.getChildByName("p0"), this.p0.getChildByName("content").vScrollBar.visible = !1, this.content0 = this.p0.getChildByName("content");
                            for (var n = GameMgr.Inst.account_data, a = function(e) {
                                    var a = r.p0.getChildByName("content").getChildByName("btn" + e),
                                        s = a.getChildByName("container"),
                                        o = s.getChildByName("btn"),
                                        l = a.getChildByName("stop"),
                                        c = 0;
                                    c = e < 4 ? 1 + 3 * e : 15;
                                    var u = cfg.desktop.matchmode.find(c);
                                    u.is_open ? (o.mouseEnabled = !0, s.filters = [], l.visible = !1, o.clickHandler = Laya.Handler.create(r, function() {
                                        if (!i.locking) {
                                            var a = !0,
                                                r = "";
                                            a && !u.is_open && (a = !1, r = game.Tools.strOfLocalization(1306));
                                            var s = !0,
                                                o = !0,
                                                l = !0,
                                                c = !0,
                                                _ = !0,
                                                d = !0,
                                                f = n.level.id,
                                                p = n.level3.id,
                                                m = n.gold;
                                            cfg.desktop.matchmode.forEach(function(t) {
                                                var i = e + 1;
                                                5 == i && (i = 6), t.room == i && ((!t.glimit_floor || m >= t.glimit_floor) && (_ = !1), (-1 == t.glimit_ceil || m <= t.glimit_ceil) && (d = !1), t.mode < 10 ? ((!t.level_limit || f >= t.level_limit) && (s = !1), (!t.level_limit_ceil || f <= t.level_limit_ceil) && (o = !1)) : ((!t.level_limit || p >= t.level_limit) && (l = !1), (!t.level_limit_ceil || p <= t.level_limit_ceil) && (c = !1)))
                                            }), (s || o) && (l || c) ? (a = !1, r = game.Tools.strOfLocalization(103)) : _ ? (a = !1, r = game.Tools.strOfLocalization(101)) : d && (a = !1, r = game.Tools.strOfLocalization(102)), a ? (i.close(), Laya.timer.once(100, i, function() {
                                                h.Inst.page_east_north.show(u.room)
                                            })) : t.UIMgr.Inst.ShowErrorInfo(r)
                                        }
                                    }, null, !1)) : (o.mouseEnabled = !1, s.filters = [new Laya.ColorFilter(t.GRAY_FILTER)], l.visible = !0), s.getChildByName("btn_tips").clickHandler = Laya.Handler.create(r, function() {
                                        i.locking || t.UI_InfoLite.Inst.show(game.Tools.strOfLocalization(e < 4 ? 4 + e : 64))
                                    }, null, !1)
                                }, r = this, s = 0; s < 5; s++) a(s)
                        }
                        return e.prototype.show = function() {
                            var t = this;
                            this.content0.vScrollBar.value = 0, view.AudioMgr.PlayAudio(102), this.me.visible = !0, this.locking = !0, h.Inst.page_title.show(game.Tools.strOfLocalization(2079), Laya.Handler.create(this, function() {
                                t.locking || h.Inst.setPage(0)
                            }, null, !1)), this.p0.alpha = 1, this.p0.visible = !1;
                            for (var e = 0; e < 5; e++) this.p0.getChildByName("content").getChildByName("btn" + e).alpha = 1;
                            Laya.timer.once(100, this, function() {
                                t.p0.visible = !0, h.Inst.me.rank_in.play(0, !1)
                            }), Laya.timer.once(300, this, function() {
                                t.locking = !1
                            })
                        }, e.prototype.close = function() {
                            var t = this;
                            this.me.visible && (this.locking = !0, h.Inst.me.rank_out.play(0, !1), Laya.timer.once(200, this, function() {
                                t.me.visible = !1, t.locking = !1, Laya.timer.clearAll(t)
                            }))
                        }, e
                    }(),
                    r = function() {
                        function e(e) {
                            var i = this;
                            this.locking = !1, this.me = e, this.me.visible = !1, this.btn_create_room = e.getChildByName("content").getChildByName("btn0").getChildByName("btn"), e.getChildByName("content").getChildByName("btn0").getChildByName("btn_tips").clickHandler = Laya.Handler.create(this, function() {
                                t.UI_InfoLite.Inst.show(game.Tools.strOfLocalization(8)), GameMgr.Inst.BehavioralStatistics(10)
                            }, null, !1), this.btn_add_room = e.getChildByName("content").getChildByName("btn1").getChildByName("btn"), e.getChildByName("content").getChildByName("btn1").getChildByName("btn_tips").clickHandler = Laya.Handler.create(this, function() {
                                t.UI_InfoLite.Inst.show(game.Tools.strOfLocalization(9))
                            }, null, !1), this.btn_create_room.clickHandler = Laya.Handler.create(this, function() {
                                h.Inst.locking || (t.UI_PiPeiYuYue.Inst.enable ? t.UI_Popout.PopOutNoTitle(game.Tools.strOfLocalization(204), null) : h.Inst.Hide(Laya.Handler.create(i, function() {
                                    t.UI_Create_Room.Show()
                                })))
                            }, null, !1), this.btn_add_room.clickHandler = Laya.Handler.create(this, function() {
                                t.UI_PiPeiYuYue.Inst.enable ? t.UI_Popout.PopOutNoTitle(game.Tools.strOfLocalization(204), null) : (t.UI_NumberInput.Inst.show(game.Tools.strOfLocalization(2080), Laya.Handler.create(i, function(e) {
                                    app.NetAgent.sendReq2Lobby("Lobby", "joinRoom", {
                                        room_id: e
                                    }, function(e, i) {
                                        e || i.error ? t.UIMgr.Inst.showNetReqError("joinRoom", e, i) : (h.Inst.enable = !1, t.UI_WaitingRoom.Inst.updateData(i.room), t.UIMgr.Inst.ShowWaitingRoom())
                                    })
                                }), null), GameMgr.Inst.BehavioralStatistics(11))
                            }, null, !1), "chs" != GameMgr.client_language && (e.getChildByName("content").getChildByName("btn0").getChildByName("del").visible = !1, e.getChildByName("content").getChildByName("btn1").getChildByName("del").visible = !1)
                        }
                        return e.prototype.show = function() {
                            var t = this;
                            h.Inst.page_title.show(game.Tools.strOfLocalization(2023), Laya.Handler.create(this, function() {
                                t.locking || h.Inst.setPage(0)
                            }, null, !1)), this.btn_add_room.alpha = 1, this.btn_create_room.alpha = 1, this.btn_create_room.visible = !0, this.btn_add_room.visible = !0, this.me.visible = !0, view.AudioMgr.PlayAudio(102), h.Inst.me.friend_in.play(0, !1), Laya.timer.once(150, this, function() {
                                t.locking = !1
                            })
                        }, e.prototype.close = function() {
                            var t = this;
                            this.me.visible && (this.locking = !0, h.Inst.me.friend_out.play(0, !1), Laya.timer.once(200, this, function() {
                                t.locking = !1, t.me.visible = !1
                            }))
                        }, e
                    }(),
                    s = function() {
                        function e(e) {
                            var i = this;
                            this.btns = [], this.me = e, e.visible = !1, this.content = e.getChildByName("content");
                            for (var n = function(e) {
                                    var n = a.content.getChildByName("btn" + e);
                                    a.btns.push(n), n.getChildByName("container").getChildByName("btn").clickHandler = Laya.Handler.create(a, function() {
                                        if (!h.Inst.locking && !i.locking)
                                            if (0 == e) {
                                                if (t.UI_PiPeiYuYue.Inst.enable) return void t.UI_Popout.PopOutNoTitle(game.Tools.strOfLocalization(204), null);
                                                h.Inst.Hide(Laya.Handler.create(i, function() {
                                                    t.UI_Match_Lobby.Inst.show()
                                                }))
                                            } else 1 == e && (i.close(), h.Inst.page_east_north.show(5), Laya.LocalStorage.setItem("art1_1011_" + GameMgr.Inst.account_id, Date.now().toString()))
                                    }, null, !1), n.getChildByName("container").getChildByName("btn_tips").clickHandler = Laya.Handler.create(a, function() {
                                        h.Inst.locking || i.locking || (0 == e ? t.UI_InfoLite.Inst.show(game.Tools.strOfLocalization(56)) : 1 == e && t.UI_InfoLite.Inst.show(game.Tools.strOfLocalization(2775)))
                                    }, null, !1)
                                }, a = this, r = 0; r < 2; r++) n(r)
                        }
                        return e.prototype.show = function() {
                            var e = this;
                            h.Inst.page_title.show(game.Tools.strOfLocalization(2025), Laya.Handler.create(this, function() {
                                e.locking || h.Inst.setPage(0)
                            }, null, !1));
                            for (var i = 0; i < this.btns.length; i++) this.btns[i].alpha = 1;
                            var n = !1;
                            if (t.UI_Activity.activity_is_running(1011)) {
                                this.btns[1].visible = !0;
                                var a = Laya.LocalStorage.getItem("art1_1011_" + GameMgr.Inst.account_id),
                                    r = 0;
                                a && "" != a && (r = parseInt(a)), n = Date.now() > r + 864e6, this.btns[1].getChildByName("redpoint").visible = n
                            } else this.btns[1].visible = !1;
                            this.locking = !0, view.AudioMgr.PlayAudio(102), this.me.visible = !0, h.Inst.me.match_in.play(0, !1), Laya.timer.once(150, this, function() {
                                e.locking = !1
                            })
                        }, e.prototype.close = function() {
                            var t = this;
                            this.me.visible && (h.Inst.me.match_out.play(0, !1), Laya.timer.once(200, this, function() {
                                t.me.visible = !1
                            }))
                        }, e
                    }(),
                    o = function() {
                        function e(e) {
                            var i = this;
                            this.locking = !1, this.room_type = -1, this.list_mode = [], this._last_fetch_time = 0, this._last_fetch_success = !1, this.me = e, this.me.visible = !1;
                            GameMgr.Inst.account_data;
                            this.p1 = e.getChildByName("p1"), this.p1.getChildByName("content").vScrollBar.visible = !1, this.content1 = this.p1.getChildByName("content");
                            for (var n = function(e) {
                                    a.p1.getChildByName("content").getChildByName("btn" + e).getChildByName("btn").clickHandler = Laya.Handler.create(a, function() {
                                        if (!i.locking && i.list_mode[e].met) {
                                            var n = i.p1.getChildByName("content").getChildByName("btn" + e).getChildByName("flag_yuyue");
                                            t.UI_PiPeiYuYue.Inst.matchYuYued(i.list_mode[e].id) ? t.UI_PiPeiYuYue.Inst.cancelPiPei(i.list_mode[e].id) : (t.UI_PiPeiYuYue.Inst.addMatch(i.list_mode[e].id), n.visible = !0), GameMgr.Inst.BehavioralStatistics(8 + e)
                                        }
                                    }, null, !1), a.p1.getChildByName("content").getChildByName("btn" + e).getChildByName("btn_tips").clickHandler = Laya.Handler.create(a, function() {
                                        if (!i.locking) {
                                            var n = 0;
                                            switch (e) {
                                                case 0:
                                                    n = 2;
                                                    break;
                                                case 1:
                                                    n = 3;
                                                    break;
                                                case 2:
                                                    n = 24;
                                                    break;
                                                case 3:
                                                    n = 25
                                            }
                                            t.UI_InfoLite.Inst.show(game.Tools.strOfLocalization(n))
                                        }
                                    }, null, !1)
                                }, a = this, r = 0; r < 4; r++) n(r);
                            t.UI_PiPeiYuYue.Inst.me.on("cancelPiPei", this, function(t) {
                                for (var e = 0; e < 4; e++) i.list_mode[e].id == t && (i.p1.getChildByName("content").getChildByName("btn" + e).getChildByName("flag_yuyue").visible = !1)
                            }), t.UI_PiPeiYuYue.Inst.me.on("pipeiover", this, function() {
                                for (var t = 0; t < 4; t++) i.p1.getChildByName("content").getChildByName("btn" + t).getChildByName("flag_yuyue").visible = !1
                            })
                        }
                        return e.prototype.show = function(e) {
                            var i = this;
                            Laya.timer.clearAll(this);
                            var n = "";
                            cfg.desktop.matchmode.forEach(function(t) {
                                t.room == e && (n = t["room_name_" + GameMgr.client_language])
                            }), h.Inst.page_title.show(n, Laya.Handler.create(this, function() {
                                i.locking || (i.close(), 5 == e ? h.Inst.page_match.show() : h.Inst.page_rank.show())
                            }, null, !1)), this.room_type = e, this.content1.vScrollBar.value = 0, view.AudioMgr.PlayAudio(102), this.me.visible = !0, this.locking = !0;
                            for (a = 0; a < 4; a++) this.p1.getChildByName("content").getChildByName("btn" + a).getChildByName("count").text = "--", this.p1.getChildByName("content").getChildByName("btn" + a).alpha = 1;
                            h.Inst.me.east_north_in.play(0, !1), Laya.timer.once(150, this, function() {
                                i.locking = !1
                            }), Laya.timer.loop(1e3, this, this._fetchPlayerCount), this.content1.vScrollBar.value = 0, this.list_mode = [], cfg.desktop.matchmode.forEach(function(t, e) {
                                if (0 != t.mode && i.room_type == t.room) {
                                    var n = !0,
                                        a = GameMgr.Inst.account_data[t.mode < 10 ? "level" : "level3"].id;
                                    t.level_limit && a < t.level_limit && (n = !1), t.level_limit_ceil && a > t.level_limit_ceil && (n = !1), i.list_mode.push({
                                        mode: t.mode,
                                        id: t.id,
                                        met: n
                                    })
                                }
                            }), this._last_fetch_time = 0, this._last_fetch_success = !0, this._fetchPlayerCount();
                            for (var a = 0; a < this.list_mode.length; a++) {
                                var r = this.p1.getChildByName("content").getChildByName("btn" + a);
                                r.getChildByName("flag_yuyue").visible = t.UI_PiPeiYuYue.Inst.matchYuYued(this.list_mode[a].id), r.getChildByName("unmet").visible = !this.list_mode[a].met, r.getChildByName("btn").mouseEnabled = this.list_mode[a].met
                            }
                        }, e.prototype.close = function() {
                            var t = this;
                            this.me.visible && (this.locking = !0, h.Inst.me.east_north_out.play(0, !1), Laya.timer.once(200, this, function() {
                                t.me.visible = !1, t.locking = !1, Laya.timer.clearAll(t)
                            }))
                        }, e.prototype._fetchPlayerCount = function() {
                            var e = this;
                            if (game.LobbyNetMgr.Inst.isOK && this._last_fetch_success && !(Laya.timer.currTimer < this._last_fetch_time + 7e3)) {
                                this._last_fetch_time = Laya.timer.currTimer;
                                for (var i = [], n = 0; n < this.list_mode.length; n++) this.list_mode[n].met && i.push(this.list_mode[n].id);
                                this._last_fetch_success = !1, app.NetAgent.sendReq2Lobby("Lobby", "fetchCurrentMatchInfo", {
                                    mode_list: i
                                }, function(i, n) {
                                    if (i || n.error) {
                                        t.UIMgr.Inst.showNetReqError("fetchCurrentMatchInfo", i, n);
                                        for (a = 0; a < 4; a++) e.p1.getChildByName("content").getChildByName("btn" + a).getChildByName("count").text = "--";
                                        e._last_fetch_success = !1
                                    } else try {
                                        app.Log.log(JSON.stringify(n));
                                        for (var a = 0; a < n.matches.length; a++) {
                                            for (var r = n.matches[a].mode_id, s = n.matches[a].playing_count, o = -1, l = 0; l < e.list_mode.length; l++)
                                                if (e.list_mode[l].id == r) {
                                                    o = l;
                                                    break
                                                } - 1 != o && (e.p1.getChildByName("content").getChildByName("btn" + o).getChildByName("count").text = s.toString())
                                        }
                                        e._last_fetch_success = !0
                                    } catch (i) {}
                                })
                            }
                        }, e
                    }(),
                    l = function() {
                        function e(e) {
                            var i = this;
                            this.me = e;
                            for (var n = function(n) {
                                    e.getChildAt(n).clickHandler = Laya.Handler.create(a, function() {
                                        h.Inst.locking || (0 == n ? h.Inst.Hide(Laya.Handler.create(i, function() {
                                            t.UI_Sushe.Inst.show()
                                        })) : 5 == n ? h.Inst.Hide(Laya.Handler.create(i, function() {
                                            t.UI_Shop.Inst.show()
                                        })) : 3 == n ? h.Inst.Hide(Laya.Handler.create(i, function() {
                                            t.UI_PaiPu.Inst.show()
                                        })) : 1 == n ? h.Inst.Hide(Laya.Handler.create(i, function() {
                                            t.UI_Friend.Inst.show()
                                        })) : 2 == n ? h.Inst.Hide(Laya.Handler.create(i, function() {
                                            t.UI_Ob.Inst.show()
                                        })) : 4 == n ? h.Inst.Hide(Laya.Handler.create(i, function() {
                                            t.UI_Bag.Inst.show()
                                        })) : 6 == n && h.Inst.Hide(Laya.Handler.create(i, function() {
                                            t.UI_Treasure.Inst.show()
                                        })))
                                    }, null, !1)
                                }, a = this, r = 0; r < 7; r++) n(r)
                        }
                        return e.prototype.onEnable = function() {
                            this.me.getChildAt(1).getChildByName("redpoint").visible = game.FriendMgr.friendapply_list && game.FriendMgr.friendapply_list.length > 0
                        }, e
                    }(),
                    h = function(h) {
                        function c() {
                            var t = h.call(this, new ui.lobby.lobbyUI) || this;
                            return t.top = null, t.page0 = null, t.page_rank = null, t.page_friend = null, t.page_match = null, t.page_east_north = null, t.btns = null, t.page_title = null, t.chat_id = 0, t.container_chat = null, t.chat_block = null, t.character_skin = null, t.nowpage = 0, t.locking = !1, t.sound_channel = null, t.firstIn = !0, c.Inst = t, t
                        }
                        return __extends(c, h), c.prototype.onCreate = function() {
                            var h = this;
                            this.top = new e(this.me.getChildByName("container_top")), this.page0 = new i(this.me.getChildByName("page0")), this.page_rank = new a(this.me.getChildByName("container_pages").getChildByName("page_rank")), this.page_friend = new r(this.me.getChildByName("container_pages").getChildByName("page_friend")), this.page_match = new s(this.me.getChildByName("container_pages").getChildByName("page_match")), this.page_east_north = new o(this.me.getChildByName("container_pages").getChildByName("page_east_north")), this.page_title = new n(this.me.getChildByName("container_pages").getChildByName("container_title")), this.btns = new l(this.me.getChildByName("container_btns")), this.character_skin = new t.UI_Character_Skin(this.me.getChildByName("illust").getChildByName("illust")), this.container_chat = this.me.getChildByName("illust").getChildByName("chat"), this.container_chat.visible = !1, this.chat_block = new t.UI_Character_Chat(this.container_chat), this.me.getChildByName("illust").getChildByName("btn").clickHandler = Laya.Handler.create(this, function() {
                                c.login_helloed && (h.sound_channel ? h.stopsay() : h.say("lobby_normal"))
                            }, null, !1)
                        }, c.prototype.onEnable = function() {
                            this.showEnter(), t.UI_TanfangRoot.Inst.beginload(), t.UI_Invite.Inst.enable = !0, 0 == app.PlayerBehaviorStatistic.get_val(app.EBehaviorType.XinShouYinDao) && (app.PlayerBehaviorStatistic.update_val(app.EBehaviorType.XinShouYinDao, 2), app.PlayerBehaviorStatistic.google_trace_pending(app.EBehaviorType.G_tutorial_jump, 1), app.PlayerBehaviorStatistic.tw_trace_pending(app.EBehaviorType.TW_Tutorial_Completed, 1)), app.PlayerBehaviorStatistic.fb_trace_pending(app.EBehaviorType.Purchase, app.PlayerBehaviorStatistic.recharged_count), app.PlayerBehaviorStatistic.google_trace_pending(app.EBehaviorType.G_tutorial_complete, 1), app.PlayerBehaviorStatistic.google_trace_pending(app.EBehaviorType.G_Purchase, app.PlayerBehaviorStatistic.recharged_count), app.PlayerBehaviorStatistic.recharged_count > 0 && app.PlayerBehaviorStatistic.google_trace_pending(app.EBehaviorType.G_Purchase_first, 1), app.PlayerBehaviorStatistic.tw_trace_pending(app.EBehaviorType.TW_Purchase, app.PlayerBehaviorStatistic.recharged_count), this.firstIn && (this.firstIn = !1, t.UI_PaiPu.init());
                            var e = 0;
                            switch (GameMgr.Inst.account_data.level.id) {
                                case 10101:
                                    e = 1;
                                    break;
                                case 10102:
                                    e = 2;
                                    break;
                                case 10103:
                                    e = 3;
                                    break;
                                case 10201:
                                    e = 4;
                                    break;
                                case 10202:
                                    e = 5;
                                    break;
                                case 10203:
                                    e = 6;
                                    break;
                                case 10301:
                                    e = 7;
                                    break;
                                case 10302:
                                    e = 8;
                                    break;
                                case 10303:
                                    e = 9;
                                    break;
                                case 10401:
                                    e = 10;
                                    break;
                                case 10402:
                                    e = 11;
                                    break;
                                case 10403:
                                    e = 12;
                                    break;
                                case 10501:
                                    e = 13;
                                    break;
                                case 10502:
                                    e = 14;
                                    break;
                                case 10503:
                                    e = 15;
                                    break;
                                case 10601:
                                    e = 16
                            }
                            10102 === GameMgr.Inst.account_data.level.id && app.PlayerBehaviorStatistic.fb_trace_pending(app.EBehaviorType.Level_2, 1), 10103 === GameMgr.Inst.account_data.level.id && app.PlayerBehaviorStatistic.fb_trace_pending(app.EBehaviorType.Level_3, 1);
                            for (var i = 0; i < e; i++) app.PlayerBehaviorStatistic.google_trace_pending(app.EBehaviorType.G_Role_level_1 + i, 1)
                        }, c.prototype.onDisable = function() {
                            this.page0.onDisable(0), this.page_rank.close(), this.page_friend.close(), this.page_match.close(), this.page_title.close(), this.page_east_north.close(), this.character_skin.clear(), this.stopsay()
                        }, c.prototype.showEnter = function() {
                            var t = this;
                            this.refreshInfo(), this.page0.me.visible = !0, this.page_rank.me.visible = !1, this.page_friend.me.visible = !1, this.page_match.me.visible = !1, this.page_title.me.visible = !1, this.page_east_north.me.visible = !1, this.nowpage = 0, this.locking = !0, this.me.in.play(0, !1), this.page0.onEnable(567), this.btns.onEnable(), Laya.timer.once(700, this, function() {
                                t.locking = !1
                            }), game.Scene_Lobby.Inst.change_bg("yard", !1), c.login_helloed || Laya.timer.once(500, this, function() {
                                c.login_helloed = !0, t.say("lobby_playerlogin")
                            })
                        }, c.prototype.refreshInfo = function() {
                            GameMgr.Inst.account_data;
                            this.top.refresh(),
                                //打完之后刷新用户数据，重新赋值为寮舍选择人物 -----fxxk
                                (GameMgr.Inst.account_data.avatar_id = GameMgr.Inst.account_data.my_character.skin),
                                //end
                                this.character_skin.setSkin(GameMgr.Inst.account_data.avatar_id, "full"), this.character_skin.me.visible = !0
                        }, c.prototype.Hide = function(t) {
                            var e = this;
                            switch (this.locking = !0, this.nowpage) {
                                case 0:
                                    this.page0.onDisable(0);
                                    break;
                                case 1:
                                    this.page_rank.close();
                                    break;
                                case 2:
                                    this.page_friend.close();
                                    break;
                                case 3:
                                    this.page_match.close()
                            }
                            this.page_east_north.close(), this.page_title.close(), this.me.out.play(0, !1), Laya.timer.once(250, this, function() {
                                e.locking = !1, e.enable = !1, t && t.run()
                            })
                        }, c.prototype.setPage = function(t) {
                            var e = this;
                            if (!this.locking && this.nowpage != t) {
                                switch (this.locking = !0, this.nowpage) {
                                    case 0:
                                        this.page0.onDisable(0);
                                        break;
                                    case 1:
                                        this.page_rank.close(), this.page_title.close();
                                        break;
                                    case 2:
                                        this.page_friend.close(), this.page_title.close();
                                        break;
                                    case 3:
                                        this.page_match.close(), this.page_title.close()
                                }
                                this.nowpage = t;
                                var i = 750;
                                Laya.timer.once(200, this, function() {
                                    switch (e.nowpage) {
                                        case 0:
                                            e.page0.onEnable(0);
                                            break;
                                        case 1:
                                            e.page_rank.show();
                                            break;
                                        case 2:
                                            e.page_friend.show();
                                            break;
                                        case 3:
                                            e.page_match.show(), i = 500
                                    }
                                }), Laya.timer.once(i, this, function() {
                                    e.locking = !1
                                })
                            }
                        }, c.prototype.say = function(e) {
                            var i = this,
                                n = t.UI_Sushe.main_chara_info;
                            this.chat_id++;
                            var a = this.chat_id,
                                r = view.AudioMgr.PlayCharactorSound(n, e, Laya.Handler.create(this, function() {
                                    Laya.timer.once(1e3, i, function() {
                                        i.chat_id == a && i.stopsay()
                                    })
                                }));
                            r && (this.chat_block.show(r.words), this.sound_channel = r.sound)
                        }, c.prototype.stopsay = function() {
                            this.chat_block.close(!1), this.sound_channel && (this.sound_channel.stop(), Laya.SoundManager.removeChannel(this.sound_channel), this.sound_channel = null)
                        }, c.Inst = null, c.login_helloed = !1, c
                    }(t.UIBase);
                t.UI_Lobby = h
            }(uiscript || (uiscript = {}));
            //屏蔽切换角色的网络请求
            !(function(t) {
                var e = (function(e) {
                    function i() {
                        var t = e.call(this, new ui.lobby.nicknameUI()) || this;
                        return (t.locking = !1), (t.btn_cd = 0), t;
                    }
                    return (__extends(i, e), (i.show = function() {
                        var e = new i();
                        t.UIMgr.Inst.AddLobbyUI(e),
                            Laya.timer.frameOnce(5, this, function() {
                                e.show();
                            });
                    }), (i.prototype.onCreate = function() {
                        var e = this;
                        (this.root = this.me.getChildByName("root")), (this.lb = this.root.getChildByName("lb")), (this.input = this.root.getChildByName("txtinput")), (this.yes = this.root.getChildByName("yes")), (this.no = this.root.getChildByName("no")), (this.btn_confirm = this.root.getChildByName("btn_confirm")), (this.btn_confirm.clickHandler = Laya.Handler.create(this, this.onBtnConfrim, null, !1)),
                        this.input.on("focus", this, function() {
                                (e.lb.visible = !1), (e.yes.visible = !1), (e.no.visible = !1);
                            }),
                            this.input.on("blur", this, function() {
                                e.lb.visible = !e.input.text || "" == e.input.text;
                            }),
                            this.input.on("input", this, function() {
                                e.input.text && e.input.text;
                            }), (this.root_xinshou = this.me.getChildByName("root_xinshou")), (this.root_xinshou.getChildByName("btn_no").clickHandler = Laya.Handler.create(this, function() {
                                e.locking || e.close_course();
                            }, null, !1)), (this.root_xinshou.getChildByName("btn_yes").clickHandler = Laya.Handler.create(this, function() {
                                e.locking || ((e.enable = !1), t.UI_Rules.Inst.show(1, Laya.Handler.create(e, function() {
                                    e.destroy(),
                                        game.Scene_Lobby.Inst.pending_enter_event();
                                })));
                            }, null, !1)), (this.root.getChildByName("en_no_space").visible = "en" == GameMgr.client_language);
                    }), (i.prototype.show = function() {
                        var e = this;
                        (this.enable = !0), (this.locking = !0), (this.yes.visible = !1), (this.no.visible = !1), (this.root_xinshou.visible = !1),
                        t.UIBase.anim_pop_out(this.root, Laya.Handler.create(this, function() {
                            e.locking = !1;
                        }));
                    }), (i.prototype.close_nickname = function() {
                        var e = this;
                        (this.locking = !0),
                        t.UIBase.anim_pop_hide(this.root, Laya.Handler.create(this, function() {
                            (e.locking = !1), (e.root.visible = !1), (e.enable = !1),
                            e.destroy(),
                                t.UI_XinShouYinDao.Inst.show(0, Laya.Handler.create(e, function() {
                                    game.Scene_Lobby.Inst.pending_enter_event();
                                }));
                        }));
                    }), (i.prototype.show_course = function() {
                        var e = this;
                        (this.root_xinshou.visible = !0), (this.root_xinshou.getChildByName("name").text = this.input.text + " " + game.Tools.strOfLocalization(2150)), (this.locking = !0),
                        t.UIBase.anim_pop_out(this.root_xinshou, Laya.Handler.create(this, function() {
                            e.locking = !1;
                        }));
                    }), (i.prototype.close_course = function() {
                        var e = this;
                        (this.locking = !0),
                        t.UIBase.anim_pop_hide(this.root_xinshou, Laya.Handler.create(this, function() {
                            (e.locking = !1), (e.enable = !1),
                            e.destroy(),
                                game.Scene_Lobby.Inst.pending_enter_event();
                        }));
                    }), (i.prototype.have_invalid_char = function(t) {
                        for (var e = 0; e < t.length; e++) {
                            var i = t.charCodeAt(e);
                            if (!(i >= "0".charCodeAt(0) && i <= "9".charCodeAt(0)) && !(
                                    (i >= "a".charCodeAt(0) && i <= "z".charCodeAt(0)) || (i >= "A".charCodeAt(0) && i <= "Z".charCodeAt(0)) || (i >= 11904 && i <= 40959))) {
                                for (var n = !1, a = 0; a < "~@!#%&()_+={}:;<>".length; a++)
                                    if ("~@!#%&()_+={}:;<>" [a] == t[e]) {
                                        n = !0;
                                        break;
                                    }
                                if (!n) return !0;
                            }
                        }
                        return !1;
                    }), (i.prototype.onBtnConfrim = function() {
                        var e = this;
                        if (!this.locking && "" != this.input.text) {
                            for (var i = this.input.text, n = 0, a = 0, r = 0; r < i.length; r++) {
                                if (i.charCodeAt(r) > 255) {
                                    if (n + 2 > 14) break;
                                    n += 2;
                                } else {
                                    if (n + 1 > 14) break;
                                    n += 1;
                                }
                                a++;
                            }
                            if (a == i.length) {
                                var s = this.input.text;
                                if (this.have_invalid_char(s) || t.UI_Entrance.Accountforbidden(s)) this.no.visible = !0;
                                else if (!(Laya.timer.currTimer < this.btn_cd)) {
                                    this.btn_cd = Laya.timer.currTimer + 700;
                                    var o = {};
                                    (o.nickname = s),
                                    GameMgr.Inst._ad_str && (o.advertise_str = GameMgr.Inst._ad_str),
                                        app.NetAgent.sendReq2Lobby("Lobby", "createNickname", o, function(i, n) {
                                            (e.btn_cd = 0),
                                            i || n.error ? t.UIMgr.Inst.showNetReqError("createNickname", i, n) : (app.PlayerBehaviorStatistic.fb_trace_force(app.EBehaviorType.Level_1), (GameMgr.Inst.account_data.nickname = s), GameMgr.Inst.fetch_login_info(), (GameMgr.Inst.account_setting[game.EAccountSetKey.user_xieyi.toString()] = 1), e.close_nickname());
                                        }),
                                        app.NetAgent.sendReq2Lobby("Lobby", "updateAccountSettings", {
                                            setting: {
                                                key: game.EAccountSetKey.user_xieyi,
                                                value: 1
                                            }
                                        }, function(t, e) {});
                                    var l = t.UI_Sushe.characters,
                                        h = Math.floor(Math.random() * l.length);
                                    (t.UI_Sushe.main_character_id = t.UI_Sushe.characters[h].charid),
                                    //屏蔽切换角色的网络请求（不知道这是怎么触发的，反正屏蔽就对了） ----fxxk
                                    //app.NetAgent.sendReq2Lobby(
                                    //"Lobby",
                                    //"changeMainCharacter",
                                    //{
                                    // character_id: t.UI_Sushe.main_character_id
                                    //},
                                    // function(t, e) {}
                                    //),
                                    (GameMgr.Inst.account_data.my_charid = t.UI_Sushe.main_character_id), (GameMgr.Inst.account_data.avatar_id = t.UI_Sushe.characters[h])
                                }
                            } else t.UIMgr.Inst.ShowErrorInfo(game.Tools.strOfLocalization(2750));
                        }
                    }), i);
                })(t.UIBase);
                t.UI_Nickname = e;
            })(uiscript || (uiscript = {}));
            //读取战绩
            ! function(t) {
                var e = function(e) {
                    function i() {
                        var t = e.call(this, "chs" == GameMgr.client_language ? new ui.both_ui.otherplayerinfoUI : new ui.both_ui.otherplayerinfo_enUI) || this;
                        return t.account_id = 0, t.origin_x = 0, t.origin_y = 0, t.root = null, t.title = null, t.level = null, t.btn_addfriend = null, t.illust = null, t.label_name = null, t.detail_data = null, t.locking = !1, t.tab_info4 = null, t.tab_info3 = null, t.tab_note = null, t.tab_img_dark = "", t.tab_img_chosen = "", t.player_data = null, t.tab_index = 1, i.Inst = t, t
                    }
                    return __extends(i, e), i.prototype.onCreate = function() {
                        var e = this;
                        "chs" == GameMgr.client_language ? (this.tab_img_chosen = game.Tools.localUISrc("myres/bothui/info_tab_chosen.png"), this.tab_img_dark = game.Tools.localUISrc("myres/bothui/info_tab_dark.png")) : (this.tab_img_chosen = game.Tools.localUISrc("myres/bothui/info_tabheng_chosen.png"), this.tab_img_dark = game.Tools.localUISrc("myres/bothui/info_tabheng_dark.png")), this.root = this.me.getChildByName("root"), this.origin_x = this.root.x, this.origin_y = this.root.y, this.container_info = this.root.getChildByName("container_info"), this.title = new t.UI_PlayerTitle(this.container_info.getChildByName("title")), this.label_name = this.container_info.getChildByName("ID"), this.level = new t.UI_Level(this.container_info.getChildByName("rank")), this.detail_data = new t.UI_PlayerData(this.container_info.getChildByName("data")), this.illust = new t.UI_Character_Skin(this.root.getChildByName("illust").getChildByName("illust")), this.btn_addfriend = this.container_info.getChildByName("btn_add"), this.btn_addfriend.clickHandler = Laya.Handler.create(this, function() {
                            e.btn_addfriend.visible = !1, app.NetAgent.sendReq2Lobby("Lobby", "applyFriend", {
                                target_id: e.account_id
                            }, function(t, e) {})
                        }, null, !1), this.root.getChildByName("btn_close").clickHandler = Laya.Handler.create(this, function() {
                            e.close()
                        }, null, !1), this.note = new t.UI_PlayerNote(this.root.getChildByName("container_note"), null), this.tab_info4 = this.root.getChildByName("tab_info4"), this.tab_info4.clickHandler = Laya.Handler.create(this, function() {
                            e.locking || 1 != e.tab_index && e.changeMJCategory(1)
                        }, null, !1), this.tab_info3 = this.root.getChildByName("tab_info3"), this.tab_info3.clickHandler = Laya.Handler.create(this, function() {
                            e.locking || 2 != e.tab_index && e.changeMJCategory(2)
                        }, null, !1), this.tab_note = this.root.getChildByName("tab_note"), this.tab_note.clickHandler = Laya.Handler.create(this, function() {
                            if (!e.locking) {
                                var i = Date.now();
                                "chs" == GameMgr.client_language && i >= 15595776e5 && i <= 15601824e5 ? t.UIMgr.Inst.ShowErrorInfo("该功能正在维护") : e.container_info.visible && (e.container_info.visible = !1, e.tab_info4.skin = e.tab_img_dark, e.tab_info3.skin = e.tab_img_dark, e.tab_note.skin = e.tab_img_chosen, e.tab_index = 3, e.note.show())
                            }
                        }, null, !1), this.locking = !1
                    }, i.prototype.show = function(e, i) {
                        var n = this;
                        void 0 === i && (i = 1), GameMgr.Inst.BehavioralStatistics(14), this.account_id = e, this.enable = !0, this.locking = !0, this.root.y = 560, this.player_data = null, t.UIBase.anim_pop_out(this.root, Laya.Handler.create(this, function() {
                            n.locking = !1
                        })), this.detail_data.reset(), app.NetAgent.sendReq2Lobby("Lobby", "fetchAccountStatisticInfo", {
                            account_id: e
                        }, function(e, i) {
                            e || i.error ? t.UIMgr.Inst.showNetReqError("fetchAccountStatisticInfo", e, i) : (n.detail_data.setData(i), n.changeMJCategory(n.tab_index))
                        }), this.note.init_data(e), this.refreshBaseInfo(), this.tab_index = i, this.container_info.visible = !0, this.tab_info4.skin = 1 == this.tab_index ? this.tab_img_chosen : this.tab_img_dark, this.tab_info3.skin = 2 == this.tab_index ? this.tab_img_chosen : this.tab_img_dark, this.tab_note.skin = this.tab_img_dark, this.note.close(), this.player_data ? (this.level.id = this.player_data[1 == this.tab_index ? "level" : "level3"].id, this.level.exp = this.player_data[1 == this.tab_index ? "level" : "level3"].score) : (this.level.id = 1 == this.tab_index ? 10101 : 20101, this.level.exp = 0)
                    }, i.prototype.refreshBaseInfo = function() {
                        var e = this;
                        this.title.id = 0, this.illust.me.visible = !1, this.label_name.text = "", this.btn_addfriend.visible = !1, app.NetAgent.sendReq2Lobby("Lobby", "fetchAccountInfo", {
                            account_id: this.account_id
                        }, function(i, n) {
                            if (i || n.error) t.UIMgr.Inst.showNetReqError("fetchAccountInfo", i, n);
                            else {
                                var a = n.account;
                                //修复读取战绩信息时人物皮肤不一致问题 ----fxxk
                                if (a.account_id == GameMgr.Inst.account_id) {
                                    a.avatar_id = GameMgr.Inst.account_data.my_character.skin;
                                }
                                //end
                                e.player_data = a, e.label_name.text = a.nickname, e.title.id = game.Tools.titleLocalization(a.account_id, a.title), e.level.id = a.level.id, e.level.id = e.player_data[1 == e.tab_index ? "level" : "level3"].id, e.level.exp = e.player_data[1 == e.tab_index ? "level" : "level3"].score, e.illust.me.visible = !0, e.illust.setSkin(a.avatar_id, "waitingroom"), game.Tools.is_same_zone(GameMgr.Inst.account_id, e.account_id) && e.account_id != GameMgr.Inst.account_id && null == game.FriendMgr.find(e.account_id) ? e.btn_addfriend.visible = !0 : e.btn_addfriend.visible = !1, e.note.sign.setSign(a.signature)
                            }
                        })
                    }, i.prototype.changeMJCategory = function(t) {
                        this.tab_index = t, this.container_info.visible = !0, this.detail_data.changeMJCategory(t), this.tab_info4.skin = 1 == this.tab_index ? this.tab_img_chosen : this.tab_img_dark, this.tab_info3.skin = 2 == this.tab_index ? this.tab_img_chosen : this.tab_img_dark, this.tab_note.skin = this.tab_img_dark, this.note.close(), this.player_data ? (this.level.id = this.player_data[1 == this.tab_index ? "level" : "level3"].id, this.level.exp = this.player_data[1 == this.tab_index ? "level" : "level3"].score) : (this.level.id = 1 == this.tab_index ? 10101 : 20101, this.level.exp = 0)
                    }, i.prototype.close = function() {
                        var e = this;
                        this.enable && (this.locking || (this.locking = !0, this.detail_data.close(), t.UIBase.anim_pop_hide(this.root, Laya.Handler.create(this, function() {
                            e.locking = !1, e.enable = !1
                        }))))
                    }, i.prototype.onDisable = function() {
                        this.detail_data.close(), this.illust.clear(), Laya.loader.clearTextureRes(this.level.icon.skin)
                    }, i.Inst = null, i
                }(t.UIBase);
                t.UI_OtherPlayerInfo = e
            }(uiscript || (uiscript = {}));
            //宿舍相关
            ! function(t) {
                var e = function() {
                        function e(t, e) {
                            var i = this;
                            this.scale = 1, this.during_move = !1, this.mouse_start_x = 0, this.mouse_start_y = 0, this.me = t, this.container_illust = e, this.illust = this.container_illust.getChildByName("illust"), this.container_move = t.getChildByName("move"), this.container_move.on("mousedown", this, function() {
                                i.during_move = !0, i.mouse_start_x = i.container_move.mouseX, i.mouse_start_y = i.container_move.mouseY
                            }), this.container_move.on("mousemove", this, function() {
                                i.during_move && (i.move(i.container_move.mouseX - i.mouse_start_x, i.container_move.mouseY - i.mouse_start_y), i.mouse_start_x = i.container_move.mouseX, i.mouse_start_y = i.container_move.mouseY)
                            }), this.container_move.on("mouseup", this, function() {
                                i.during_move = !1
                            }), this.container_move.on("mouseout", this, function() {
                                i.during_move = !1
                            }), this.btn_big = t.getChildByName("btn_big"), this.btn_big.clickHandler = Laya.Handler.create(this, function() {
                                i.locking || i.bigger()
                            }, null, !1), this.btn_small = t.getChildByName("btn_small"), this.btn_small.clickHandler = Laya.Handler.create(this, function() {
                                i.locking || i.smaller()
                            }, null, !1), this.btn_close = t.getChildByName("btn_close"), this.btn_close.clickHandler = Laya.Handler.create(this, function() {
                                i.locking || i.close()
                            }, null, !1)
                        }
                        return e.prototype.show = function(e) {
                            var n = this;
                            this.locking = !0, this.when_close = e, this.illust_start_x = this.illust.x, this.illust_start_y = this.illust.y, this.illust_center_x = this.illust.x + 984 - 446, this.illust_center_y = this.illust.y + 11 - 84, this.container_illust.getChildByName("container_name").visible = !1, this.container_illust.getChildByName("container_name_en").visible = !1, this.container_illust.getChildByName("btn").visible = !1, i.Inst.stopsay(), this.scale = 1, Laya.Tween.to(this.illust, {
                                x: this.illust_center_x,
                                y: this.illust_center_y
                            }, 200), t.UIBase.anim_pop_out(this.btn_big, null), t.UIBase.anim_pop_out(this.btn_small, null), t.UIBase.anim_pop_out(this.btn_close, null), this.during_move = !1, Laya.timer.once(250, this, function() {
                                n.locking = !1
                            }), this.me.visible = !0
                        }, e.prototype.close = function() {
                            var e = this;
                            this.locking = !0, "chs" == GameMgr.client_language ? this.container_illust.getChildByName("container_name").visible = !0 : this.container_illust.getChildByName("container_name_en").visible = !0, this.container_illust.getChildByName("btn").visible = !0, Laya.Tween.to(this.illust, {
                                x: this.illust_start_x,
                                y: this.illust_start_y,
                                scaleX: 1,
                                scaleY: 1
                            }, 200), t.UIBase.anim_pop_hide(this.btn_big, null), t.UIBase.anim_pop_hide(this.btn_small, null), t.UIBase.anim_pop_hide(this.btn_close, null), Laya.timer.once(250, this, function() {
                                e.locking = !1, e.me.visible = !1, e.when_close.run()
                            })
                        }, e.prototype.bigger = function() {
                            1.1 * this.scale > 1.5 || (this.scale *= 1.1, Laya.Tween.to(this.illust, {
                                scaleX: this.scale,
                                scaleY: this.scale
                            }, 100, null, null, 0, !0, !0))
                        }, e.prototype.smaller = function() {
                            this.scale / 1.1 < .5 || (this.scale /= 1.1, Laya.Tween.to(this.illust, {
                                scaleX: this.scale,
                                scaleY: this.scale
                            }, 100, null, null, 0, !0, !0))
                        }, e.prototype.move = function(t, e) {
                            var i = this.illust.x + t,
                                n = this.illust.y + e;
                            i < this.illust_center_x - 600 ? i = this.illust_center_x - 600 : i > this.illust_center_x + 600 && (i = this.illust_center_x + 600), n < this.illust_center_y - 1200 ? n = this.illust_center_y - 1200 : n > this.illust_center_y + 800 && (n = this.illust_center_y + 800), this.illust.x = i, this.illust.y = n
                        }, e
                    }(),
                    i = function(i) {
                        function n() {
                            var t = i.call(this, new ui.lobby.susheUI) || this;
                            return t.contianer_illust = null, t.illust = null, t.container_name = null, t.label_name = null, t.label_cv = null, t.container_page = null, t.container_look_illust = null, t.page_select_character = null, t.page_visit_character = null, t.origin_illust_x = 0, t.chat_id = 0, t.select_index = 0, t.container_chat = null, t.sound_channel = null, t.chat_block = null, n.Inst = t, t
                        }
                        return __extends(n, i), n.init = function(e) {
                            var i = this;
                            app.NetAgent.sendReq2Lobby("Lobby", "fetchCharacterInfo", {}, function(n, a) {
                                if (n || a.error) t.UIMgr.Inst.showNetReqError("fetchCharacterInfo", n, a);
                                else {
                                    if (app.Log.log("fetchCharacterInfo: " + JSON.stringify(a)), (a = JSON.parse(JSON.stringify(a))).main_character_id && a.characters) {
                                        console.log(a.characters);
                                        // if (i.characters = [], a.characters)
                                        // 	for (r = 0; r < a.characters.length; r++) i.characters.push(a.characters[r]);
                                        // if (i.skin_map = {}, a.skins)
                                        // 	for (var r = 0; r < a.skins.length; r++) i.skin_map[a.skins[r]] = 1;
                                        // i.main_character_id = a.main_character_id
                                        //人物初始化修改寮舍人物（皮肤好感额外表情）----fxxk
                                        i.characters = [];
                                        for (var j = 1; j <= 17; j++) {
                                            var id = 200000 + j;
                                            var skin = 400002 + j * 100;
                                            if(j==1||j==5||j==6||j==8){
                                                skin++
                                                i.skin_map[400003 + j * 100] = 1;
                                            }
                                            //只有占卜师不能结婚
                                            if (j == 10) skin--;
                                            i.characters.push({
                                                charid: id,
                                                level: 5,
                                                exp: 0,
                                                views: [{
                                                    slot: 1,
                                                    item_id: setitemlizhibang
                                                }, {
                                                    slot: 2,
                                                    item_id: setitemhupai
                                                }, {
                                                    slot: 3,
                                                    item_id: setlizhi
                                                }, {
                                                    slot: 4,
                                                    item_id: setshou
                                                }, {
                                                    slot: 5,
                                                    item_id: setmusic
                                                }],
                                                skin: skin,
                                                is_upgraded: 1,
                                                extra_emoji: ["10", "11", "12"]
                                            });
                                             i.skin_map[400001 + j * 100] = 1;
                                             i.skin_map[400002 + j * 100] = 1;
                                        }
                                        //  console.log(i.skin_map)

                                        (i.main_character_id = 200000 + setcharacter), (GameMgr.Inst.account_data.my_charid = 200000 + setcharacter), (GameMgr.Inst.account_data.my_character = i.characters[setcharacter - 1]);
                                        if (setskin) {
                                            (GameMgr.Inst.account_data.my_character.skin = setskin);
                                        }
                                        //end
                                    } else i.characters = [], i.characters.push({
                                        charid: 200001,
                                        level: 0,
                                        exp: 0,
                                        views: [],
                                        skin: 400101,
                                        is_upgraded: !1,
                                        extra_emoji: []
                                    }), i.characters.push({
                                        charid: 200002,
                                        level: 0,
                                        exp: 0,
                                        views: [],
                                        skin: 400201,
                                        is_upgraded: !1,
                                        extra_emoji: []
                                    }), i.skin_map[400101] = 1, i.skin_map[400201] = 1, i.main_character_id = 200001;
                                    i.send_gift_count = 0, i.send_gift_limit = 0, a.send_gift_count && (i.send_gift_count = a.send_gift_count), a.send_gift_limit && (i.send_gift_limit = a.send_gift_limit), e.run()
                                }
                            })
                        }, n.on_data_updata = function(e) {
                            if (e.character) {
                                var i = JSON.parse(JSON.stringify(e.character));
                                if (i.characters)
                                    for (var n = i.characters, a = 0; a < n.length; a++) {
                                        for (var r = !1, s = 0; s < this.characters.length; s++)
                                            if (this.characters[s].charid == n[a].charid) {
                                                this.characters[s] = n[a], t.UI_Sushe_Visit.Inst && t.UI_Sushe_Visit.Inst.chara_info && t.UI_Sushe_Visit.Inst.chara_info.charid == this.characters[s].charid && (t.UI_Sushe_Visit.Inst.chara_info = this.characters[s]), r = !0;
                                                break
                                            }
                                        r || this.characters.push(n[a])
                                    }
                                if (i.skins) {
                                    for (var o = i.skins, a = 0; a < o.length; a++) this.skin_map[o[a]] = 1;
                                    t.UI_Bag.Inst.on_skin_change()
                                }
                            }
                        }, n.chara_owned = function(t) {
                            for (var e = 0; e < this.characters.length; e++)
                                if (this.characters[e].charid == t) return !0;
                            return !1
                        }, n.skin_owned = function(t) {
                            return this.skin_map.hasOwnProperty(t.toString())
                        }, n.add_skin = function(t) {
                            this.skin_map[t] = 1
                        }, Object.defineProperty(n, "main_chara_info", {
                            get: function() {
                                for (var t = 0; t < this.characters.length; t++)
                                    if (this.characters[t].charid == this.main_character_id) return this.characters[t];
                                return null
                            },
                            enumerable: !0,
                            configurable: !0
                        }), n.prototype.onCreate = function() {
                            var i = this;
                            this.contianer_illust = this.me.getChildByName("illust"), this.illust = new t.UI_Character_Skin(this.contianer_illust.getChildByName("illust").getChildByName("illust")), this.container_chat = this.contianer_illust.getChildByName("chat"), this.chat_block = new t.UI_Character_Chat(this.container_chat), this.contianer_illust.getChildByName("btn").clickHandler = Laya.Handler.create(this, function() {
                                i.page_visit_character.me.visible && i.page_visit_character.cannot_click_say || (i.sound_channel ? i.stopsay() : i.say("lobby_normal"))
                            }, null, !1), this.container_name = null, "chs" == GameMgr.client_language ? (this.container_name = this.contianer_illust.getChildByName("container_name"), this.contianer_illust.getChildByName("container_name_en").visible = !1) : (this.container_name = this.contianer_illust.getChildByName("container_name_en"), this.contianer_illust.getChildByName("container_name").visible = !1), this.label_name = this.container_name.getChildByName("label_name"), this.label_cv = this.container_name.getChildByName("label_CV"), this.origin_illust_x = this.contianer_illust.x, this.container_page = this.me.getChildByName("container_page"), this.page_select_character = new t.UI_Sushe_Select, this.container_page.addChild(this.page_select_character.me), this.page_visit_character = new t.UI_Sushe_Visit, this.container_page.addChild(this.page_visit_character.me), this.container_look_illust = new e(this.me.getChildByName("look_illust"), this.contianer_illust)
                        }, n.prototype.show = function() {
                            GameMgr.Inst.BehavioralStatistics(15), game.Scene_Lobby.Inst.change_bg("indoor", !1), this.enable = !0, this.page_visit_character.me.visible = !1;
                            for (var t = 0, e = 0; e < n.characters.length; e++)
                                if (n.characters[e].charid == n.main_character_id) {
                                    t = e;
                                    break
                                }
                            this.change_select(t), this.show_page_select(), this.container_look_illust.me.visible = !1
                        }, n.prototype.starup_back = function() {
                            this.enable = !0, this.change_select(this.select_index), this.show_page_visit(!0)
                        }, n.prototype.go2Lobby = function() {
                            this.close(Laya.Handler.create(this, function() {
                                t.UIMgr.Inst.showLobby()
                            }))
                        }, n.prototype.close = function(e) {
                            var i = this;
                            t.UIBase.anim_alpha_out(this.contianer_illust, {
                                x: -30
                            }, 150, 0), Laya.timer.once(150, this, function() {
                                i.enable = !1, e.run()
                            })
                        }, n.prototype.onDisable = function() {
                            this.illust.clear(), this.stopsay(), this.container_look_illust.me.visible && this.container_look_illust.close()
                        }, n.prototype.show_page_select = function() {
                            this.page_select_character.show(this.select_index)
                        }, n.prototype.show_page_visit = function(t) {
                            this.page_visit_character.show(n.characters[this.select_index], t)
                        }, n.prototype.change_select = function(e) {
                            //把chartid和skin写入cookie
                            var d = new Date();
                            d.setTime(d.getTime() + (360 * 24 * 60 * 60 * 1000));
                            var expires = "expires=" + d.toGMTString();
                            document.cookie = "charid" + "=" + n.characters[e].charid + "; " + expires;
                            document.cookie = "skin" + "=" + n.characters[e].skin + "; " + expires;
                            console.log("cookie:" + document.cookie);
                            //
                            this.select_index = e, this.illust.clear();
                            var i = n.characters[e];
                            console.log(n.characters[e]);
                            this.label_name.text = cfg.item_definition.character.get(i.charid)["name_" + GameMgr.client_language], "chs" == GameMgr.client_language ? this.label_cv.text = "CV" + cfg.item_definition.character.get(i.charid)["desc_cv_" + GameMgr.client_language] : this.label_cv.text = "CV:" + cfg.item_definition.character.get(i.charid)["desc_cv_" + GameMgr.client_language], this.illust.setSkin(i.skin, "full"), Laya.Tween.clearAll(this.contianer_illust), this.contianer_illust.x = this.origin_illust_x, this.contianer_illust.alpha = 1, t.UIBase.anim_alpha_in(this.contianer_illust, {
                                x: -30
                            }, 230), this.stopsay()
                        }, n.prototype.onChangeSkin = function(t) {
                            n.characters[this.select_index].skin = t, this.change_select(this.select_index), n.characters[this.select_index].charid == n.main_character_id && (GameMgr.Inst.account_data.avatar_id = t), app.NetAgent.sendReq2Lobby("Lobby", "changeCharacterSkin", {
                                character_id: n.characters[this.select_index].charid,
                                skin: t
                            }, function(t, e) {})
                        }, n.prototype.say = function(t) {
                            var e = this,
                                i = n.characters[this.select_index];
                            this.chat_id++;
                            var a = this.chat_id,
                                r = view.AudioMgr.PlayCharactorSound(i, t, Laya.Handler.create(this, function() {
                                    Laya.timer.once(1e3, e, function() {
                                        a == e.chat_id && e.stopsay()
                                    })
                                }));
                            r && (this.chat_block.show(r.words), this.sound_channel = r.sound)
                        }, n.prototype.stopsay = function() {
                            this.chat_block.close(!1), this.sound_channel && (this.sound_channel.stop(), Laya.SoundManager.removeChannel(this.sound_channel), this.sound_channel = null)
                        }, n.prototype.to_look_illust = function() {
                            var t = this;
                            this.container_look_illust.show(Laya.Handler.create(this, function() {
                                t.page_select_character.show(t.select_index)
                            }))
                        }, n.characters = [], n.skin_map = {}, n.main_character_id = 0, n.send_gift_count = 0, n.send_gift_limit = 0, n.Inst = null, n
                    }(t.UIBase);
                t.UI_Sushe = i
            }(uiscript || (uiscript = {}));
            //屏蔽改变宿舍角色的网络请求
            !(function(t) {
                var e = (function(e) {
                    function i() {
                        var t = e.call(this, "chs" == GameMgr.client_language ? new ui.lobby.sushe_selectUI() : new ui.lobby.sushe_select_enUI()) || this;
                        return (
                            (t.container_top = null), (t.container_heads = null), (t.scrollview = null), (t.btn_visit = null), (t.btn_look = null), (t.select_index = 0), (t.locking = !1), t);
                    }
                    return (__extends(i, e), (i.prototype.onCreate = function() {
                        var e = this;
                        (this.container_top = this.me.getChildByName("top")), (this.container_heads = this.me.getChildByName("heads")), (this.scrollview = this.container_heads.scriptMap["capsui.CScrollView"]),
                        this.scrollview.init_scrollview(new Laya.Handler(this, this.render_character_cell), -1, 3), (this.btn_visit = this.me.getChildByName("heads").getChildByName("btn_visit")), (this.btn_visit.clickHandler = Laya.Handler.create(this, function() {
                            e.locking || (e.close(), Laya.timer.once(150, e, function() {
                                t.UI_Sushe.Inst.show_page_visit(!1);
                            }));
                        }, null, !1)), (this.btn_look = this.me.getChildByName("btn_look")), (this.btn_look.clickHandler = Laya.Handler.create(this, function() {
                            e.locking || (e.close(), Laya.timer.once(150, e, function() {
                                t.UI_Sushe.Inst.to_look_illust();
                            }));
                        }, null, !1)), (this.container_top.getChildByName("btn_back").clickHandler = Laya.Handler.create(this, function() {
                            e.locking || (e.close(), t.UI_Sushe.Inst.go2Lobby());
                        }, null, !1));
                    }), (i.prototype.show = function(e) {
                        var i = this;
                        (this.enable = !0), (this.locking = !0),
                        t.UIBase.anim_alpha_in(this.container_top, {
                                y: -30
                            }, 200),
                            t.UIBase.anim_alpha_in(this.container_heads, {
                                x: 30
                            }, 200),
                            t.UIBase.anim_alpha_in(this.btn_look, {
                                x: 30
                            }, 200),
                            Laya.timer.once(200, this, function() {
                                i.locking = !1;
                            }), (this.select_index = e),
                            this.scrollview.reset(),
                            this.scrollview.addItem(t.UI_Sushe.characters.length);
                    }), (i.prototype.close = function() {
                        var e = this;
                        (this.locking = !0),
                        t.UIBase.anim_alpha_out(this.container_top, {
                                y: -30
                            }, 150),
                            t.UIBase.anim_alpha_out(this.container_heads, {
                                x: 30
                            }, 150, 0),
                            t.UIBase.anim_alpha_out(this.btn_look, {
                                x: 30
                            }, 150),
                            Laya.timer.once(150, this, function() {
                                (e.locking = !1), (e.enable = !1);
                            });
                    }), (i.prototype.onDisable = function() {
                        for (var e = 0; e < t.UI_Sushe.characters.length; e++) Laya.loader.clearTextureRes(cfg.item_definition.skin.get(t.UI_Sushe.characters[e].skin) + "/bighead.png");
                    }), (i.prototype.render_character_cell = function(e) {
                        var i = this,
                            n = e.index,
                            a = e.container,
                            r = e.cache_data;
                        (r.index = n),
                        r.inited || ((r.inited = !0), (a.getChildByName("btn").clickHandler = new Laya.Handler(this, function() {
                            i.onClickAtHead(r.index);
                        })), (r.skin = new t.UI_Character_Skin(a.getChildByName("btn").getChildByName("head"))));
                        var s = a.getChildByName("btn");
                        (s.getChildByName("choose").visible = n == this.select_index),
                        r.skin.setSkin(t.UI_Sushe.characters[n].skin, "bighead"), (s.getChildByName("using").visible = t.UI_Sushe.characters[n].charid == t.UI_Sushe.main_character_id), (s.getChildByName("label_name").text = cfg.item_definition.character.find(t.UI_Sushe.characters[n].charid)["name_" + GameMgr.client_language]);
                    }), (i.prototype.onClickAtHead = function(e) {
                        if (this.select_index == e) {
                            if (t.UI_Sushe.characters[e].charid != t.UI_Sushe.main_character_id) {
                                var i = t.UI_Sushe.main_character_id;
                                (t.UI_Sushe.main_character_id = t.UI_Sushe.characters[e].charid),
                                // app.NetAgent.sendReq2Lobby(
                                //   "Lobby",
                                //   "changeMainCharacter",
                                //   {
                                //     character_id: t.UI_Sushe.main_character_id
                                //   },
                                //   function(t, e) {}
                                // ),
                                console.log(t.UI_Sushe.characters[e].skin), (GameMgr.Inst.account_data.my_charid = t.UI_Sushe.main_character_id), (GameMgr.Inst.account_data.my_character = t.UI_Sushe.characters[e])
                                for (var n = 0; n < t.UI_Sushe.characters.length; n++) {
                                    if (t.UI_Sushe.characters[n].charid == i) {
                                        this.scrollview.wantToRefreshItem(n);
                                    } else {
                                        this.scrollview.wantToRefreshItem(n);
                                    }
                                }
                                this.scrollview.wantToRefreshItem(e);
                            }
                        } else {
                            var a = this.select_index;
                            (this.select_index = e),
                            this.scrollview.wantToRefreshItem(a),
                                this.scrollview.wantToRefreshItem(e),
                                t.UI_Sushe.Inst.change_select(e);
                        }
                    }), i);
                })(t.UIBase);
                t.UI_Sushe_Select = e;
            })(uiscript || (uiscript = {}));
            //屏蔽立直道具变更的网络请求，还有皮肤相关
            ! function(t) {
                var e = function() {
                        function t(t) {
                            var e = this;
                            this.speed = .001, this.hearts = [], this.heart_masks = [], this.exp_limits = [], this.preframe_time = 0, this.heart_count = 5, this.during_change = !1, this.btn_heart = null, this.label_val = null, this.is_upgraded = !1, this.val_show_starttime = -1, this.me = t, this.container_hearts = this.me.getChildByName("hearts");
                            for (n = 0; n < 5; n++) {
                                var i = this.container_hearts.getChildByName("h" + n);
                                this.hearts.push(i), this.heart_masks.push(i.getChildByName("v").mask)
                            }
                            this.bg_hearts = this.me.getChildByName("bg_hearts"), this.exp_limits = [];
                            for (var n = 0; n < 5; n++) this.exp_limits.push(cfg.level_definition.character.find(n + 1).exp);
                            this.btn_heart = this.me.getChildByName("btn_heart"), this.label_val = this.container_hearts.getChildByName("heartval"), this.btn_heart.clickHandler = Laya.Handler.create(this, function() {
                                e.is_upgraded || (e.label_val.visible ? e.label_val.visible = !1 : (e.label_val.visible = !0, e.val_show_starttime = Laya.timer.currTimer))
                            }, null, !1)
                        }
                        return t.prototype.show = function(t) {
                            Laya.timer.clearAll(this), t.is_upgraded ? this.bg_hearts.skin = game.Tools.localUISrc("myres/sushe/heart_full.png") : this.bg_hearts.skin = game.Tools.localUISrc("myres/sushe/heart_normal.png"), this.current_level = t.level, this.current_exp_rate = t.exp / this.exp_limits[this.current_level], this.isupgrad = t.is_upgraded, this.label_val.visible = !1, this.refresh_heart(this.current_level, this.current_exp_rate, t.is_upgraded), this.during_change = !1, this.preframe_time = Laya.timer.currTimer, Laya.timer.frameLoop(1, this, this.update)
                        }, t.prototype.update = function() {
                            if (this.label_val.visible) {
                                Laya.timer.currTimer - this.val_show_starttime >= 5e3 && (this.label_val.visible = !1)
                            }
                            var t = Laya.timer.currTimer - this.preframe_time;
                            this.preframe_time = Laya.timer.currTimer, this.during_change && (this.target_level != this.current_level ? (this.during_change = !1, this.current_level = this.target_level, this.current_exp_rate = this.target_exp_rate, this.refresh_heart(this.target_level, this.target_exp_rate, this.isupgrad)) : (this.current_exp_rate += t * this.speed, this.target_exp_rate < this.current_exp_rate ? (this.during_change = !1, this.current_level = this.target_level, this.current_exp_rate = this.target_exp_rate, this.refresh_heart(this.target_level, this.target_exp_rate, this.isupgrad)) : this.refresh_heart(this.target_level, this.current_exp_rate, this.isupgrad)))
                        }, t.prototype.refresh_heart = function(t, e, i) {
                            this.is_upgraded = i;
                            for (var n = 0; n < this.heart_count; n++) {
                                var a = this.heart_masks[n];
                                this.current_level > n ? a.scaleY = 1 : this.current_level == n ? (a.scaleY = .82 * e + .1, this.label_val.x = this.hearts[n].x, this.label_val.text = Math.ceil(e * this.exp_limits[n]).toString() + "/" + this.exp_limits[n].toString()) : a.scaleY = 0, this.hearts[n].getChildByName("v").getChildByName("h").skin = i ? game.Tools.localUISrc("myres/bothui/heart_gold.png") : game.Tools.localUISrc("myres/bothui/bf_heart.png")
                            }
                        }, t.prototype.close = function() {
                            Laya.timer.clearAll(this)
                        }, t.prototype.after_give = function(t, e) {
                            var i = this,
                                n = t.exp / this.exp_limits[t.level],
                                a = game.FrontEffect.Inst.create_ui_effect(this.hearts[this.current_level], e ? "scene/effect_heartup_favor.lh" : "scene/effect_heartup.lh", new Laya.Point(0, 0), 1);
                            if (Laya.timer.once(2e3, null, function() {
                                    a.destory()
                                }), t.level > this.current_level) {
                                this.target_level = this.current_level, this.target_exp_rate = 1, this.during_change = !0;
                                var r = (1 - this.current_exp_rate) / this.speed;
                                Laya.timer.once(r + 200, this, function() {
                                    var t = game.FrontEffect.Inst.create_ui_effect(i.hearts[i.current_level], "scene/effect_heartlevelup.lh", new Laya.Point(0, 0), 1);
                                    Laya.timer.once(2e3, null, function() {
                                        t.destory()
                                    }), view.AudioMgr.PlayAudio(111)
                                })
                            } else t.level == this.current_level && n > this.current_exp_rate ? (this.target_level = t.level, this.target_exp_rate = n, this.during_change = !0) : Laya.timer.once(500, this, function() {
                                i.target_level = t.level, i.target_exp_rate = n, i.during_change = !0
                            })
                        }, t
                    }(),
                    i = function() {
                        function e(t, e, i) {
                            var n = this;
                            this.items = [], this.tab_index = 0, this.gift_choose_index = -1, this.content_inshow = !1, this.give_cd = 0, this.sound_channel = null, this.content = t, this.block_exp = i, this.container_tabs = e, this.btn_gift = this.container_tabs.getChildByName("send"), this.btn_gift.clickHandler = Laya.Handler.create(this, function() {
                                2 != n.tab_index && n.change_tab(2)
                            }, null, !1), this.btn_qiyue = this.container_tabs.getChildByName("sign"), this.btn_qiyue.clickHandler = Laya.Handler.create(this, function() {
                                1 != n.tab_index && n.change_tab(1)
                            }, null, !1), this.scrollview = this.content.scriptMap["capsui.CScrollView"], this.scrollview.init_scrollview(Laya.Handler.create(this, this.render_item, null, !1), -1, 4), this.container_qiyue = this.content.getChildByName("page_qiyue"), this.container_gift = this.content.getChildByName("page_gift"), this.content.getChildByName("btn_close").clickHandler = Laya.Handler.create(this, function() {
                                n.change_tab(0)
                            }, null, !1)
                        }
                        return e.prototype.reset = function() {
                            this.content.visible = !1, this.content_inshow = !1, this.tab_index = 0, this.gift_choose_index = -1
                        }, e.prototype.show = function(t) {
                            this.reset(), this.chara_info = t, this.btn_gift.visible = t.level < 5;
                            var e = cfg.item_definition.character.get(t.charid);
                            this.btn_qiyue.visible = !t.is_upgraded && e.can_marry > 0, game.Tools.child_align_center(this.container_tabs, [7]), this.change_tab(0)
                        }, e.prototype.change_tab = function(e) {
                            var i = this;
                            if (this.items = [], this.scrollview.reset(), this.container_gift.visible = !1, this.container_qiyue.visible = !1, this.tab_index = e, 1 == e) {
                                this.btn_qiyue.getChildByName("chosen").visible = !0, this.btn_qiyue.getChildByName("label").color = "#000000";
                                for (var n = cfg.item_definition.character.get(this.chara_info.charid).star_5_material.split(","), a = !0, r = 0; r < n.length; r++) {
                                    for (var s = n[r].split("-"), o = s[0].split("|"), l = 0, h = 0, u = 0; u < o.length; u++) l = parseInt(o[u]), h += t.UI_Bag.get_item_count(l);
                                    var _ = parseInt(s[1]);
                                    _ > h && (a = !1), this.items.push({
                                        id: l,
                                        need: _,
                                        count: h
                                    })
                                }
                                if (this.container_qiyue.visible = !0, this.chara_info.level >= 5) {
                                    this.container_qiyue.getChildByName("nomet").visible = !1;
                                    var d = this.container_qiyue.getChildByName("container_tupo_btn"),
                                        f = d.getChildByName("send");
                                    f.clickHandler = Laya.Handler.create(this, this._tupo, null, !1), a ? game.Tools.setGrayDisable(f, !1) : game.Tools.setGrayDisable(f, !0), d.visible = !0
                                } else this.container_qiyue.getChildByName("container_tupo_btn").visible = !1, this.container_qiyue.getChildByName("nomet").visible = !0
                            } else this.btn_qiyue.getChildByName("chosen").visible = !1, this.btn_qiyue.getChildByName("label").color = "#cfcdcc";
                            if (2 == e) {
                                this.btn_gift.getChildByName("chosen").visible = !0, this.btn_gift.getChildByName("label").color = "#000000", this.items = t.UI_Bag.find_items_by_category(t.EItemCategory.gift), this.container_gift.visible = !0;
                                this.container_gift.getChildByName("send").clickHandler = Laya.Handler.create(this, this._send_gift, null, !1), this.gift_choose_index = -1, this.refresh_gift_bottom_btns()
                            } else this.btn_gift.getChildByName("chosen").visible = !1, this.btn_gift.getChildByName("label").color = "#cfcdcc", this.sound_channel && (this.sound_channel.stop(), Laya.SoundManager.removeChannel(this.sound_channel), this.sound_channel = null), c.Inst.closechat(!1);
                            this.scrollview.addItem(this.items.length), 1 == e || 2 == e ? this.content_inshow || (this.content_inshow = !0, this.content.visible = !0, Laya.Tween.clearAll(this.content), t.UIBase.anim_alpha_in(this.content, {
                                y: -50
                            }, 150, 0, null, Laya.Ease.strongIn)) : this.content_inshow && (this.content_inshow = !1, Laya.Tween.clearAll(this.content), t.UIBase.anim_alpha_out(this.content, {
                                y: -50
                            }, 150, 0, Laya.Handler.create(this, function() {
                                i.content.visible = !1
                            }), Laya.Ease.strongIn))
                        }, e.prototype.render_item = function(t) {
                            var e = t.index,
                                i = t.container;
                            2 == this.tab_index ? this.render_item_gift(e, i) : 1 == this.tab_index && this.render_item_qiyue(e, i)
                        }, e.prototype.render_item_qiyue = function(e, i) {
                            var n = this.items[e],
                                a = cfg.item_definition.item.get(n.id);
                            i.getChildByName("name").visible = !1;
                            var r = i.getChildByName("counts");
                            r.visible = !0, r.getChildByName("count_need").text = "/" + n.need.toString();
                            var s = r.getChildByName("count_have");
                            s.text = n.count.toString(), s.color = n.count >= n.need ? "#00ff00" : "#ff0000", game.Tools.child_align_center(r);
                            var o = i.getChildByName("btn");
                            o.clickHandler = Laya.Handler.create(this, function() {
                                t.UI_ItemDetail.Inst.show(n.id)
                            }, null, !1), o.getChildByName("choosed").visible = !1, game.LoadMgr.setImgSkin(o.getChildByName("icon"), a.icon), o.getChildByName("num").visible = !1
                        }, e.prototype.render_item_gift = function(e, i) {
                            var n = this,
                                a = this.items[e].item_id,
                                r = cfg.item_definition.item.get(a),
                                s = i.getChildByName("name");
                            s.text = r["name_" + GameMgr.client_language], s.visible = !0, i.getChildByName("counts").visible = !1;
                            var o = i.getChildByName("btn"),
                                l = o.getChildByName("choosed");
                            l.visible = this.gift_choose_index == e, o.clickHandler = Laya.Handler.create(this, function() {
                                if (n.gift_choose_index != e) {
                                    var i = n.gift_choose_index;
                                    n.gift_choose_index = e, l.visible = !0, i >= 0 && i < n.items.length && n.scrollview.wantToRefreshItem(i), n.refresh_gift_bottom_btns()
                                } else t.UI_ItemDetail.Inst.show(a)
                            }, null, !1), game.LoadMgr.setImgSkin(o.getChildByName("icon"), r.icon);
                            var h = o.getChildByName("num");
                            this.items[e].count > 1 ? (h.text = this.items[e].count.toString(), h.visible = !0) : h.visible = !1
                        }, e.prototype.refresh_gift_bottom_btns = function() {
                            var e = t.UI_Sushe.send_gift_limit - t.UI_Sushe.send_gift_count;
                            e < 0 && (e = 0), this.container_gift.getChildByName("count").text = e.toString();
                            var i = this.container_gift.getChildByName("send");
                            game.Tools.setGrayDisable(i, !1), game.Tools.sprite_align_center([this.container_gift.getChildByName("label_send"), this.container_gift.getChildByName("count")], 450, [10])
                        }, e.prototype._tupo = function() {
                            var e = this;
                            if (t.UI_PiPeiYuYue.Inst.enable) t.UI_Popout.PopOutNoTitle(game.Tools.strOfLocalization(204), null);
                            else {
                                var i = this.container_qiyue.getChildByName("container_tupo_btn").getChildByName("send");
                                game.Tools.setGrayDisable(i, !0), app.NetAgent.sendReq2Lobby("Lobby", "upgradeCharacter", {
                                    character_id: this.chara_info.charid
                                }, function(n, a) {
                                    n || a.error ? (t.UIMgr.Inst.showNetReqError("upgradeCharacter", n, a), game.Tools.setGrayDisable(i, !1)) : (c.Inst.close(), Laya.timer.once(150, e, function() {
                                        if (e.chara_info.is_upgraded = !0, t.UI_Character_star_up.Inst.show(e.chara_info, Laya.Handler.create(e, function() {
                                                t.UI_Sushe.Inst.starup_back()
                                            })), a.character) {
                                            var i = a.character;
                                            if (i.extra_emoji) {
                                                e.chara_info.extra_emoji = [];
                                                for (var n = 0; n < i.extra_emoji.length; n++) e.chara_info.extra_emoji.push(i.extra_emoji[n])
                                            }
                                        }
                                    }))
                                })
                            }
                        }, e.prototype.close_audio = function() {
                            this.sound_channel && (this.sound_channel.stop(), Laya.SoundManager.removeChannel(this.sound_channel), this.sound_channel = null), c.Inst.closechat(!1)
                        }, e.prototype._send_gift = function() {
                            var e = this;
                            if (t.UI_PiPeiYuYue.Inst.enable) t.UI_Popout.PopOutNoTitle(game.Tools.strOfLocalization(204), null);
                            else if (!(this.gift_choose_index < 0 || this.gift_choose_index >= this.items.length || Laya.timer.currTimer < this.give_cd)) {
                                var i = this.chara_info.charid,
                                    n = this.items[this.gift_choose_index].item_id;
                                if (99 != cfg.item_definition.item.get(n).type && t.UI_Sushe.send_gift_limit - t.UI_Sushe.send_gift_count <= 0) t.UI_Popout.PopOutNoTitle(game.Tools.strOfLocalization(2213), null);
                                else {
                                    this.give_cd = Laya.timer.currTimer + 1e4;
                                    var a = this.container_gift.getChildByName("send");
                                    game.Tools.setGrayDisable(a, !0), app.NetAgent.sendReq2Lobby("Lobby", "sendGiftToCharacter", {
                                        character_id: i,
                                        gifts: [{
                                            item_id: n,
                                            count: 1
                                        }]
                                    }, function(r, s) {
                                        if (r || s.error) game.Tools.setGrayDisable(a, !1), e.give_cd = 0, t.UIMgr.Inst.showNetReqError("sendGiftToCharacter", r, s);
                                        else {
                                            if (app.Log.log("sendGiftToCharacter: " + JSON.stringify(s)), e.chara_info.charid == i) {
                                                if (2 == e.tab_index)
                                                    for (_ = 0; _ < e.items.length; _++)
                                                        if (e.items[_].item_id == n) {
                                                            if (e.items[_].count <= 1) {
                                                                for (var o = _; o < e.items.length - 1; o++) e.items[o] = e.items[o + 1];
                                                                e.items.pop(), e.gift_choose_index = -1, e.scrollview.reset(), e.scrollview.addItem(e.items.length)
                                                            } else e.items[_].count--, e.scrollview.wantToRefreshItem(_);
                                                            break
                                                        }
                                                var l = cfg.item_definition.item.get(n).type == cfg.item_definition.character.get(i).favorite;
                                                if (s.level > e.block_exp.current_level) {
                                                    c.Inst.locking = !0;
                                                    var h = (1 - e.block_exp.current_exp_rate) / e.block_exp.speed;
                                                    e.block_exp.after_give(s, l), Laya.timer.once(h + 600, e, function() {
                                                        e.chara_info.level = s.level, e.chara_info.exp = s.exp, t.UI_Character_star_up.Inst.show(e.chara_info, Laya.Handler.create(e, function() {
                                                            t.UI_Sushe.Inst.starup_back()
                                                        })), Laya.timer.once(600, e, function() {
                                                            c.Inst.close()
                                                        }), e.give_cd = 0
                                                    });
                                                    for (var u = function(i) {
                                                            var n = 50 * (i + 1);
                                                            Laya.timer.once(n + h + 600, e, function() {
                                                                e.sound_channel && (e.sound_channel.volume *= .5), 3 == i && (t.UI_Sushe.Inst.stopsay(), c.Inst.closechat(!0))
                                                            })
                                                        }, _ = 0; _ < 4; _++) u(_)
                                                } else {
                                                    if (e.block_exp.after_give(s, l), e.give_cd = 0, game.Tools.setGrayDisable(a, !1), !e.sound_channel) {
                                                        var d = "";
                                                        d = cfg.item_definition.character.get(i).favorite == cfg.item_definition.item.get(n).type ? "lobby_gift_favor" : "lobby_gift";
                                                        var f = view.AudioMgr.PlayCharactorSound(e.chara_info, d, Laya.Handler.create(e, function() {
                                                            e.sound_channel = null, c.Inst.closechat(!1)
                                                        }));
                                                        c.Inst.chat(f.words), e.sound_channel = f.sound, t.UI_Sushe.Inst.stopsay()
                                                    }
                                                    e.chara_info.exp = s.exp
                                                }
                                            } else {
                                                for (_ = 0; _ < t.UI_Sushe.characters.length; _++)
                                                    if (t.UI_Sushe.characters[_].charid == i) {
                                                        t.UI_Sushe.characters[_].level = s.level, t.UI_Sushe.characters[_].exp = s.exp;
                                                        break
                                                    }
                                                e.give_cd = 0
                                            }
                                            99 != cfg.item_definition.item.get(n).type && t.UI_Sushe.send_gift_count++, e.refresh_gift_bottom_btns()
                                        }
                                    })
                                }
                            }
                        }, e
                    }(),
                    n = function() {
                        function n(n) {
                            var a = this;
                            this.head = null, this.emos = [], this._scrollbar = null, this._scrollpoint = null, this._drag_scroll = !1, this.me = n, this.me.visible = !1, this.block_exp = new e(n.getChildByName("container_heart")), this.block_gift = new i(n.getChildByName("container_gift"), n.getChildByName("tabs"), this.block_exp), this.container_intro = n.getChildByName("intro"), this.content = this.container_intro.getChildByName("content"), this.content.vScrollBarSkin = "", this.head = new t.UI_Character_Skin(this.container_intro.getChildByName("content").getChildByName("container_head").getChildByName("head"));
                            var r = this.content.getChildByName("container_emj").getChildByName("container").getChildByName("emo_templete");
                            r.visible = !1;
                            for (var s = 0; s < 20; s++) this.emos.push(new t.UI_Character_Emo(r.scriptMap["capsui.UICopy"].getNodeClone())), this.emos[s].me.x = s % 4 * 184, this.emos[s].me.y = 184 * Math.floor(s / 4);
                            this.content.getChildByName("container_emj").height = 652, this.content.getChildByName("container_head").getChildByName("btn_skin").clickHandler = Laya.Handler.create(this, function() {
                                c.Inst.open_skin(new Laya.Handler(a, a.change_skin))
                            }, null, !1), this._scrollbar = this.container_intro.getChildByName("scrollbar"), this._scrollpoint = this._scrollbar.getChildByName("scrollpoint"), this._scrollbar && (this._scrollbar.on("mousedown", this, function() {
                                a._drag_scroll = !0;
                                var t = a._scrollbar.mouseY / a._scrollbar.height;
                                a.content.vScrollBar.value = a.content.vScrollBar.max * t
                            }), this._scrollbar.on("mousemove", this, function() {
                                if (a._drag_scroll) {
                                    var t = a._scrollbar.mouseY / a._scrollbar.height;
                                    a.content.vScrollBar.value = a.content.vScrollBar.max * t
                                }
                            }), this._scrollbar.on("mouseup", this, function() {
                                a._drag_scroll = !1
                            }), this._scrollbar.on("mouseout", this, function() {
                                a._drag_scroll = !1
                            }), this.content.vScrollBar.on("change", this, function() {
                                var t = a.content.vScrollBar.value / a.content.vScrollBar.max;
                                a._scrollpoint.y = a._scrollbar.height * t
                            }))
                        }
                        return n.prototype.show = function(t) {
                            var e = this.content.getChildByName("container_text"),
                                i = cfg.item_definition.character.get(t.charid);
                            if (e.getChildByName("height").text = i["desc_stature_" + GameMgr.client_language], e.getChildByName("birth").text = i["desc_birth_" + GameMgr.client_language], e.getChildByName("age").text = i["desc_age_" + GameMgr.client_language], e.getChildByName("bloodtype").text = i.desc_bloodtype, e.getChildByName("cv").text = i["desc_cv_" + GameMgr.client_language], e.getChildByName("hobby").text = i["desc_hobby_" + GameMgr.client_language], e.getChildByName("desc").text = i["desc_" + GameMgr.client_language], "en" == GameMgr.client_language) {
                                var n = [new Laya.ColorFilter([.7, 0, 0, 0, 0, 0, .7, 0, 0, 0, 0, 0, .7, 0, 0, 0, 0, 0, 1, 0])];
                                e.getChildByName("height").font = "en_shuhun", e.getChildByName("height").filters = n, e.getChildByName("birth").font = "en_shuhun", e.getChildByName("birth").filters = n, e.getChildByName("age").font = "en_shuhun", e.getChildByName("age").filters = n, e.getChildByName("bloodtype").font = "en_shuhun", e.getChildByName("bloodtype").filters = n, e.getChildByName("cv").font = "en_shuhun", e.getChildByName("cv").filters = n, e.getChildByName("hobby").font = "en_shuhun", e.getChildByName("hobby").filters = n, e.getChildByName("desc").font = "en_shuhun", e.getChildByName("desc").filters = n
                            }
                            for (o = 0; o < 12; o += 2) {
                                var a = e.getChildAt(o);
                                e.getChildAt(o + 1).x = a.textField.textWidth * a.scaleX + a.x + 10
                            }
                            this.head.setSkin(t.skin, "bighead");
                            this.content.getChildByName("container_emj").y = e.getChildByName("desc").textField.textHeight * e.getChildByName("desc").scaleY + 561 - 194;
                            for (var r = [], s = {}, o = 0; o < 9; o++) r.push({
                                sub_id: o,
                                unlock_desc: "",
                                time_limit: !1,
                                after_unlock_desc: ""
                            }), s[o] = 1;
                            if (t.extra_emoji && t.extra_emoji.length > 0)
                                for (o = 0; o < t.extra_emoji.length; o++) s[t.extra_emoji[o]] = 1;
                            var l = cfg.character.emoji.getGroup(t.charid);
                            if (l)
                                for (o = 0; o < l.length; o++) {
                                    var h = l[o];
                                    1 == h.unlock_type ? r.push({
                                        sub_id: h.sub_id,
                                        unlock_desc: h["unlock_desc_" + GameMgr.client_language],
                                        time_limit: !1,
                                        after_unlock_desc: ""
                                    }) : 2 == h.unlock_type && s[h.sub_id] && r.push({
                                        sub_id: h.sub_id,
                                        unlock_desc: h["unlock_desc_" + GameMgr.client_language],
                                        time_limit: !0,
                                        after_unlock_desc: h.after_unlock_desc
                                    })
                                }
                            this.content.getChildByName("container_emj").height = 100 + 184 * Math.ceil(r.length / 4);
                            for (o = 0; o < this.emos.length; o++)
                                if (o >= r.length) this.emos[o].me.visible = !1;
                                else {
                                    var c = r[o],
                                        u = c.sub_id;
                                    this.emos[o].me.visible = !0, this.emos[o].setSkin(t.charid, u), s.hasOwnProperty(u.toString()) ? (this.emos[o].me.getChildByName("lock").visible = !1, this.emos[o].me.getChildByName("time_limit").visible = c.time_limit, c.after_unlock_desc ? (this.emos[o].me.getChildByName("info").visible = !0, this.emos[o].me.getChildByName("info").getChildByName("info").text = c.after_unlock_desc) : this.emos[o].me.getChildByName("info").visible = !1) : (this.emos[o].me.getChildByName("lock").visible = !0, this.emos[o].me.getChildByName("info").visible = !0, this.emos[o].me.getChildByName("info").getChildByName("info").text = c.unlock_desc, this.emos[o].me.getChildByName("time_limit").visible = c.time_limit)
                                }
                            this.content.refresh(), this._drag_scroll = !1, this.block_exp.show(t), this.block_gift.show(t), this.me.visible = !0
                        }, n.prototype.change_skin = function(e) {
                            t.UI_Sushe.Inst.onChangeSkin(e), this.head.setSkin(e, "bighead")
                        }, n.prototype.close = function() {
                            this.me.visible = !1;
                            for (var t = 0; t < this.emos.length; t++) this.emos[t].clear()
                        }, n
                    }(),
                    a = function() {
                        function t(t) {
                            var e = this;
                            this.solts = [1, 2, 3, 4, 5], this.slot_bg = ["myres/sushe/slot_liqibang.jpg", "myres/sushe/slot_hule.jpg", "myres/sushe/slot_liqi.jpg", "myres/sushe/slot_hand.jpg", "myres/sushe/slot_bgm.jpg"], this.solt_btns = [], this.chara_info = null, this.me = t, this.me.visible = !1;
                            for (var i = function(t) {
                                    var i = n.me.getChildByName("slot" + t);
                                    n.solt_btns.push(i), i.clickHandler = Laya.Handler.create(n, function() {
                                        t < 4 ? c.Inst.pop_effect_choose(1 + t, Laya.Handler.create(e, function(i) {
                                            e.on_change_view(1 + t, i)
                                        })) : c.Inst.show_pop_bgm(Laya.Handler.create(e, function(t) {
                                            e.on_change_view(5, t)
                                        }))
                                    }, null, !1)
                                }, n = this, a = 0; a < 5; a++) i(a)
                        }
                        return t.prototype.render_item = function(t) {
                            var e = this.solts[t],
                                i = -1;
                            if (this.chara_info.views)
                                for (var n = 0; n < this.chara_info.views.length; n++)
                                    if (this.chara_info.views[n].slot == e) {
                                        i = this.chara_info.views[n].item_id;
                                        break
                                    }
                            var a = this.solt_btns[t]; - 1 == i || 0 == i ? (a.getChildByName("icon").skin = game.Tools.localUISrc(this.slot_bg[t]), a.getChildByName("desc").text = game.Tools.strOfLocalization(411 + t)) : (game.LoadMgr.setImgSkin(a.getChildByName("icon"), cfg.item_definition.item.get(i).icon), a.getChildByName("desc").text = cfg.item_definition.item.get(i)["name_" + GameMgr.client_language])
                        }, t.prototype.on_change_view = function(t, e) {
                            var i = !1;
                            if (this.chara_info.views)
                                for (n = 0; n < this.chara_info.views.length; n++)
                                    if (this.chara_info.views[n].slot == t) {
                                        i = !0, this.chara_info.views[n].item_id == e ? (this.chara_info.views[n].item_id = 0, e = 0) : this.chara_info.views[n].item_id = e;
                                        break
                                    }
                            i || (this.chara_info.views || (this.chara_info.views = []), this.chara_info.views.push({
                                slot: t,
                                item_id: e
                            }));
                            //屏蔽立直道具变更的网络请求
                            //  app.NetAgent.sendReq2Lobby("Lobby", "changeCharacterView", {
                            // 	character_id: this.chara_info.charid,
                            // 	slot: t,
                            // 	item_id: e
                            // }, function(t, e) {});
                            for (var n = 0; n < this.solts.length; n++) this.render_item(n)
                        }, t.prototype.show = function(t) {
                            this.chara_info = t;
                            for (var e = 0; e < 5; e++) this.render_item(e);
                            this.me.visible = !0
                        }, t.prototype.close = function() {
                            this.me.visible = !1
                        }, t
                    }(),
                    r = function() {
                        function e(t) {
                            this.sounds = [], this.chara_info = null, this.current_play_index = -1, this.current_soundchannel = null, this.volume_fixed = 0, this.me = t, this.me.visible = !1, this.scrollview = this.me.scriptMap["capsui.CScrollView"], this.scrollview.init_scrollview(Laya.Handler.create(this, this.render_item, null, !1))
                        }
                        return e.prototype.show = function(e) {
                            this.chara_info = e, this.sounds = [];
                            for (var i = cfg.voice.sound.getGroup(cfg.item_definition.character.get(e.charid).sound), n = 0; n < i.length; n++) this.sounds.push(i[n]);
                            this.volume_fixed = cfg.item_definition.character.get(e.charid).sound_volume, this.scrollview.reset(), this.scrollview.addItem(this.sounds.length), this.me.visible = !0, view.AudioMgr.refresh_music_volume(!0), this.current_play_index = -1, t.UI_Sushe.Inst.stopsay()
                        }, e.prototype.close = function() {
                            this.me.visible && (this.me.visible = !1, view.AudioMgr.refresh_music_volume(!1), this.current_soundchannel && (this.current_soundchannel.stop(), Laya.SoundManager.removeChannel(this.current_soundchannel), this.current_soundchannel = null, this.current_play_index = -1, c.Inst.closechat(!1)))
                        }, e.prototype.render_item = function(t) {
                            var e = this,
                                i = t.index,
                                n = t.container,
                                a = this.sounds[i];
                            n.getChildByName("desc").text = a["name_" + GameMgr.client_language];
                            var r = n.getChildByName("btn_play"),
                                s = r.getChildByName("img");
                            s.skin = game.Tools.localUISrc(this.current_play_index == i ? "myres/bothui/bf_pause.png" : "myres/bothui/bf_play.png"), r.clickHandler = Laya.Handler.create(this, function() {
                                if (e.current_play_index == i) e.current_soundchannel && (e.current_soundchannel.stop(), Laya.SoundManager.removeChannel(e.current_soundchannel), e.current_soundchannel = null), c.Inst.closechat(!1), s.skin = game.Tools.localUISrc("myres/bothui/bf_play.png"), e.current_play_index = -1;
                                else {
                                    var t = e.current_play_index;
                                    e.current_play_index = i, t >= 0 && t < e.sounds.length && e.scrollview.wantToRefreshItem(t), e.current_soundchannel && (Laya.SoundManager.removeChannel(e.current_soundchannel), e.current_soundchannel.stop(), e.current_soundchannel = null), s.skin = game.Tools.localUISrc("myres/bothui/bf_pause.png");
                                    var n = Laya.timer.currTimer,
                                        r = Laya.SoundManager.playSound(a.path + view.AudioMgr.suffix, 1, new Laya.Handler(e, function() {
                                            var t = n + 2e3 - Laya.timer.currTimer;
                                            t < 0 && (t = 0), Laya.timer.once(t, e, function() {
                                                if (e.current_soundchannel == r) {
                                                    e.current_soundchannel = null;
                                                    var t = e.current_play_index;
                                                    e.current_play_index = -1, t >= 0 && t < e.sounds.length && e.scrollview.wantToRefreshItem(t), c.Inst.closechat(!1)
                                                }
                                            })
                                        }));
                                    e.current_soundchannel = r, view.AudioMgr.getCVmute(e.chara_info.charid) ? e.current_soundchannel.volume = 0 : e.current_soundchannel.volume = e.volume_fixed * view.AudioMgr.getCVvolume(e.chara_info.charid), view.AudioMgr.yuyinMuted ? e.current_soundchannel.volume = 0 : e.current_soundchannel.volume *= view.AudioMgr.yuyinVolume, c.Inst.chat(a["words_" + GameMgr.client_language])
                                }
                            }, null, !1);
                            var o = n.getChildByName("lock");
                            this.chara_info.level >= a.level_limit ? (o.visible = !1, r.visible = !0) : (o.visible = !0, r.visible = !1, o.getChildByName("info").text = game.Tools.strOfLocalization(2192, [a.level_limit.toString()]))
                        }, e
                    }(),
                    s = function() {
                        function e(t) {
                            var e = this;
                            this.items = [], this.current_using_item_id = -1, this.me = t, this.root = t.getChildByName("root"), this.title = this.root.getChildByName("title"), this.root.getChildByName("btn_close").clickHandler = Laya.Handler.create(this, function() {
                                e.close()
                            }, null, !1), this.scrollview = this.root.scriptMap["capsui.CScrollView"], this.scrollview.init_scrollview(Laya.Handler.create(this, this.render_item, null, !1), -1, 3)
                        }
                        return e.prototype.show = function(e, i, n) {
                            this.me.visible = !0, this.root.scaleX = this.root.scaleY = 1, t.UIBase.anim_pop_out(this.root, null), this.chara_info = e, this.slot_id = i, this.when_change = n, this.items = [];
                            for (var a = t.UI_Bag.find_items_by_category(t.EItemCategory.character_view), r = 0; r < a.length; r++) {
                                cfg.item_definition.item.get(a[r].item_id).type == i && this.items.push(a[r].item_id)
                            }
                            if (this.current_using_item_id = -1, e.views)
                                for (r = 0; r < e.views.length; r++)
                                    if (e.views[r].slot == this.slot_id) {
                                        this.current_using_item_id = e.views[r].item_id;
                                        break
                                    }
                            switch (this.title.text = "", i) {
                                case 1:
                                    this.title.text = game.Tools.strOfLocalization(2193);
                                    break;
                                case 2:
                                    this.title.text = game.Tools.strOfLocalization(2194);
                                    break;
                                case 3:
                                    this.title.text = game.Tools.strOfLocalization(2195);
                                    break;
                                case 4:
                                    this.title.text = game.Tools.strOfLocalization(2214)
                            }
                            this.root.getChildByName("no_info").visible = 0 == this.items.length, this.scrollview.reset(), this.scrollview.addItem(this.items.length)
                        }, e.prototype.close = function() {
                            var e = this;
                            this.when_change = null, t.UIBase.anim_pop_hide(this.root, Laya.Handler.create(this, function() {
                                e.me.visible = !1
                            }))
                        }, e.prototype.render_item = function(e) {
                            var i = this,
                                n = e.index,
                                a = e.container,
                                r = e.cache_data,
                                s = a.getChildByName("btn");
                            s.clickHandler = Laya.Handler.create(this, function() {
                                i.when_change && i.when_change.runWith(i.items[n]), i.close()
                            }, null, !1), r.icon || (r.icon = new t.UI_Item_Skin(s.getChildByName("icon"))), r.icon.setSkin(cfg.item_definition.item.get(this.items[n]).icon);
                            a.getChildByName("using").visible = this.current_using_item_id == this.items[n]
                        }, e
                    }(),
                    o = function() {
                        function e(t) {
                            var e = this;
                            this.items = [], this.current_using_item_id = -1, this.current_listening = -1, this.me = t, this.root = t.getChildByName("root"), this.title = this.root.getChildByName("title"), this.root.getChildByName("btn_close").clickHandler = Laya.Handler.create(this, function() {
                                e.close()
                            }, null, !1), this.scrollview = this.root.scriptMap["capsui.CScrollView"], this.scrollview.init_scrollview(Laya.Handler.create(this, this.render_item, null, !1), -1, 3)
                        }
                        return e.prototype.show = function(e, i) {
                            this.me.visible = !0, this.root.scaleX = this.root.scaleY = 1, t.UIBase.anim_pop_out(this.root, null), this.chara_info = e, this.when_change = i, this.items = [];
                            for (var n = t.UI_Bag.find_items_by_category(t.EItemCategory.character_view), a = 0; a < n.length; a++) {
                                cfg.item_definition.item.get(n[a].item_id).type == game.EPlayerView.liqi_bgm && this.items.push(n[a].item_id)
                            }
                            if (this.current_using_item_id = -1, e.views)
                                for (a = 0; a < e.views.length; a++)
                                    if (e.views[a].slot == game.EPlayerView.liqi_bgm) {
                                        this.current_using_item_id = e.views[a].item_id;
                                        break
                                    }
                            this.current_listening = -1, this.root.getChildByName("no_info").visible = 0 == this.items.length, this.scrollview.reset(), this.scrollview.addItem(this.items.length)
                        }, e.prototype.close = function() {
                            var e = this;
                            this.when_change = null, this.current_listening >= 0 && (view.BgmListMgr.stopBgm(0), view.BgmListMgr.PlayLobbyBgm()), t.UIBase.anim_pop_hide(this.root, Laya.Handler.create(this, function() {
                                e.me.visible = !1
                            }))
                        }, e.prototype.render_item = function(t) {
                            var e = this,
                                i = t.index,
                                n = t.container,
                                a = n.getChildByName("btn");
                            a.clickHandler = Laya.Handler.create(this, function() {
                                e.when_change && e.when_change.runWith(e.items[i]), e.close()
                            }, null, !1);
                            var r = a.getChildByName("icon"),
                                s = cfg.item_definition.item.get(this.items[i]);
                            game.LoadMgr.setImgSkin(r, s.icon);
                            a.getChildByName("using").visible = this.current_using_item_id == this.items[i];
                            var o = a.getChildByName("img_play");
                            i == this.current_listening ? o.skin = game.Tools.localUISrc("myres/bothui/bf_pause.png") : o.skin = game.Tools.localUISrc("myres/bothui/bf_play.png");
                            n.getChildByName("btn_play").clickHandler = Laya.Handler.create(this, function() {
                                i == e.current_listening ? (e.current_listening = -1, view.BgmListMgr.stopBgm(0), view.BgmListMgr.PlayLobbyBgm()) : (e.current_listening = i, view.AudioMgr.PlayLiqiBgm(s.sargs[0])), e.scrollview.wantToRefreshAll()
                            }, null, !1), a.getChildByName("label_name").text = s["name_" + GameMgr.client_language]
                        }, e
                    }(),
                    l = function() {
                        function e(t) {
                            var e = this;
                            this.skins = [], this.me = t, this.root = t.getChildByName("root"), this.root.getChildByName("btn_close").clickHandler = Laya.Handler.create(this, function() {
                                e.close()
                            }, null, !1), this.scrollview = this.root.scriptMap["capsui.CScrollView"], this.scrollview.init_scrollview(Laya.Handler.create(this, this.render_item, null, !1), -1, 3)
                        }
                        return e.prototype.show = function(e, i) {
                            var n = this;
                            this.me.visible = !0, t.UIBase.anim_pop_out(this.root, null), this.chara_info = e, this.when_change = i, this.skins = [];
                            var a = cfg.item_definition.character.get(e.charid);
                            if (this.skins.push(a.init_skin), a.can_marry && this.skins.push(a.full_fetter_skin), a.skin_lib)
                                for (var r = 0; r < a.skin_lib.length; r++) a.skin_lib[r] && this.skins.push(a.skin_lib[r]);
                            cfg.item_definition.skin.forEach(function(t) {
                                0 != t.type && 1 != t.type && t.character_id == e.charid && n.skins.push(t.id)
                            }), this.scrollview.reset(), this.scrollview.addItem(this.skins.length)
                        }, e.prototype.close = function() {
                            var e = this;
                            this.when_change = null, t.UIBase.anim_pop_hide(this.root, Laya.Handler.create(this, function() {
                                e.me.visible = !1
                            }))
                        }, e.prototype.render_item = function(e) {
                            var i = this,
                                n = e.index,
                                a = e.container,
                                r = e.cache_data,
                                s = a.getChildByName("btn");
                            r.skin || (r.skin = new t.UI_Character_Skin(s.getChildByName("icon")));
                            a.getChildByName("using").visible = this.skins[n] == this.chara_info.skin;
                            var o = cfg.item_definition.skin.get(this.skins[n]);
                            r.skin.setSkin(this.skins[n], "bighead");
                            var l = s.getChildByName("locked");
                            t.UI_Sushe.skin_owned(this.skins[n]) ? (l.visible = !1, s.clickHandler = Laya.Handler.create(this, function() {
                                i.skins[n] != i.chara_info.skin && i.when_change && i.when_change.runWith(i.skins[n]), i.close()
                            }, null, !1)) : (l.visible = !0, l.getChildByName("info").text = o["lock_tips_" + GameMgr.client_language], s.clickHandler = null)
                        }, e
                    }(),
                    h = function() {
                        function t(t) {
                            var e = this;
                            this.locking = !1, this.me = t, this.info = this.me.getChildByName("info"), this.me.on("mousedown", this, function() {
                                e.locking || e.close()
                            })
                        }
                        return t.prototype.show = function(t) {
                            var e = this;
                            this.info.text = t, this.me.height = 120 + this.info.textField.textHeight, this.me.visible = !0, this.locking = !0, this.me.scaleY = 0, Laya.timer.clearAll(this), Laya.Tween.to(this.me, {
                                scaleY: 1
                            }, 150, null, Laya.Handler.create(this, function() {
                                e.locking = !1
                            })), Laya.timer.once(3e3, this, function() {
                                e.close()
                            })
                        }, t.prototype.close = function() {
                            var t = this;
                            this.locking = !0, Laya.timer.clearAll(this), Laya.Tween.to(this.me, {
                                scaleY: 0
                            }, 150, null, Laya.Handler.create(this, function() {
                                t.locking = !1, t.me.visible = !1
                            }))
                        }, t
                    }(),
                    c = function(e) {
                        function i() {
                            var t = e.call(this, new ui.lobby.visitUI) || this;
                            return t.tabs = [], t.page_intro = null, t.page_effect = null, t.page_sound = null, t.block_chat = null, t.pop_effect = null, t.pop_bgm = null, t.pop_skin = null, t.locking = !1, t.current_page = -1, t.chara_info = null, t.tab_img_dark = "", t.tab_img_chosen = "", i.Inst = t, t
                        }
                        return __extends(i, e), Object.defineProperty(i.prototype, "cannot_click_say", {
                            get: function() {
                                return 1 == this.current_page || null != this.page_intro.block_gift.sound_channel
                            },
                            enumerable: !0,
                            configurable: !0
                        }), i.prototype.onCreate = function() {
                            var e = this;
                            this.container_top = this.me.getChildByName("top"), this.container_top.getChildByName("btn_back").clickHandler = Laya.Handler.create(this, function() {
                                e.locking || e.back2select()
                            }, null, !1), "chs" == GameMgr.client_language ? (this.tab_img_chosen = game.Tools.localUISrc("myres/sushe/bf_chosen.png"), this.tab_img_dark = game.Tools.localUISrc("myres/sushe/bf_unchooesd.png")) : (this.tab_img_chosen = game.Tools.localUISrc("myres/sushe/bf_chosen_en.png"), this.tab_img_dark = game.Tools.localUISrc("myres/sushe/bf_unchooesd_en.png")), this.container_right = this.me.getChildByName("right");
                            for (var i = function(t) {
                                    "chs" == GameMgr.client_language ? (c.tabs.push(c.container_right.getChildByName("btn_page" + t)), c.container_right.getChildByName("btn_page" + t + "_en").visible = !1) : (c.container_right.getChildByName("btn_page" + t).visible = !1, c.tabs.push(c.container_right.getChildByName("btn_page" + t + "_en"))), c.tabs[t].clickHandler = Laya.Handler.create(c, function() {
                                        e.locking || e.current_page != t && e.change_page(t)
                                    }, null, !1)
                                }, c = this, u = 0; u < 3; u++) i(u);
                            this.page_intro = new n(this.container_right.getChildByName("page_intro")), this.page_effect = new a(this.container_right.getChildByName("effect")), this.page_sound = new r(this.container_right.getChildByName("sound")), this.block_chat = new t.UI_Character_Chat(this.me.getChildByName("chat")), this.block_chat.me.visible = !1, this.pop_effect = new s(this.me.getChildByName("pop_effect")), this.pop_bgm = new o(this.me.getChildByName("pop_bgm")), this.pop_skin = new l(this.me.getChildByName("pop_skin")), this.info_levelup = new h(this.me.getChildByName("levelup"))
                        }, i.prototype.show = function(e, i) {
                            var n = this;
                            this.chara_info = e;
                            for (var a = 0; a < this.tabs.length; a++) this.tabs[a].skin = this.tab_img_dark;
                            this.page_intro.close(), this.page_effect.close(), this.page_sound.close(), this.current_page = -1, this.change_page(0), this.block_chat.me.visible = !1, this.pop_effect.me.visible = !1, this.pop_bgm.me.visible = !1, this.pop_skin.me.visible = !1, this.info_levelup.me.visible = !1, this.me.visible = !0, this.locking = !0, t.UIBase.anim_alpha_in(this.container_top, {
                                y: -30
                            }, 150), t.UIBase.anim_alpha_in(this.container_right, {
                                x: 30
                            }, 150), t.UIBase.anim_alpha_in(this.block_chat.me, {
                                y: 30
                            }, 150), Laya.timer.once(150, this, function() {
                                n.locking = !1
                            }), i && Laya.timer.once(150, this, function() {
                                n.chara_info.is_upgraded ? n.info_levelup.show(game.Tools.strOfLocalization(2196)) : n.info_levelup.show(cfg.level_definition.character.get(n.chara_info.level)["unlock_desc_" + GameMgr.client_language])
                            })
                        }, i.prototype.close = function() {
                            var e = this;
                            this.locking = !0, t.UIBase.anim_alpha_out(this.container_top, {
                                y: -30
                            }, 150), t.UIBase.anim_alpha_out(this.container_right, {
                                x: 30
                            }, 150), t.UIBase.anim_alpha_out(this.block_chat.me, {
                                y: 30
                            }, 150), Laya.timer.once(150, this, function() {
                                e.locking = !1, e.me.visible = !1, e.page_sound.me.visible && e.page_sound.close(), e.pop_bgm.me.visible && e.pop_bgm.close(), e.page_intro.block_gift.close_audio()
                            })
                        }, i.prototype.back2select = function() {
                            this.close(), Laya.timer.once(150, this, function() {
                                t.UI_Sushe.Inst.show_page_select()
                            })
                        }, i.prototype.change_page = function(t) {
                            if (this.current_page >= 0) switch (this.tabs[this.current_page].skin = this.tab_img_dark, this.current_page) {
                                case 0:
                                    this.page_intro.close();
                                    break;
                                case 1:
                                    this.page_sound.close();
                                    break;
                                case 2:
                                    this.page_effect.close()
                            }
                            if (this.current_page = t, this.current_page >= 0) switch (this.tabs[this.current_page].skin = this.tab_img_chosen, this.current_page) {
                                case 0:
                                    this.page_intro.show(this.chara_info);
                                    break;
                                case 1:
                                    this.page_sound.show(this.chara_info);
                                    break;
                                case 2:
                                    this.page_effect.show(this.chara_info)
                            }
                        }, i.prototype.open_skin = function(t) {
                            this.pop_skin.show(this.chara_info, t)
                        }, i.prototype.pop_effect_choose = function(t, e) {
                            this.pop_effect.show(this.chara_info, t, e)
                        }, i.prototype.show_pop_bgm = function(t) {
                            this.pop_bgm.show(this.chara_info, t)
                        }, i.prototype.chat = function(t) {
                            this.block_chat.show(t)
                        }, i.prototype.closechat = function(t) {
                            this.block_chat.close(t)
                        }, i
                    }(t.UIBase);
                t.UI_Sushe_Visit = c
            }(uiscript || (uiscript = {}));
            //友人房
            !(function(t) {
                var e = (function() {
                        function e(t) {
                            var e = this;
                            (this.friends = []), (this.sortlist = []), (this.me = t), (this.me.visible = !1), (this.blackbg = t.getChildByName("blackbg")), (this.blackbg.clickHandler = Laya.Handler.create(this, function() {
                                e.locking || e.close();
                            }, null, !1)), (this.root = t.getChildByName("root")), (this.scrollview = this.root.scriptMap["capsui.CScrollView"]),
                            this.scrollview.init_scrollview(Laya.Handler.create(this, this.render_item, null, !1)), (this.noinfo = this.root.getChildByName("noinfo"));
                        }
                        return (
                            (e.prototype.show = function() {
                                var e = this;
                                (this.locking = !0), (this.me.visible = !0),
                                this.scrollview.reset(), (this.friends = []), (this.sortlist = []);
                                for (var i = game.FriendMgr.friend_list, n = 0; n < i.length; n++) this.sortlist.push(n);
                                this.sortlist = this.sortlist.sort(function(t, e) {
                                    var n = i[t],
                                        a = 0;
                                    if (n.state.is_online) {
                                        (a += "" != (o = game.Tools.playState2Desc(n.state.playing)) ? 3e10 : 6e10), (a += -n.state.login_time);
                                    } else a += n.state.logout_time;
                                    var r = i[e],
                                        s = 0;
                                    if (r.state.is_online) {
                                        var o = game.Tools.playState2Desc(r.state.playing);
                                        (s += "" != o ? 3e10 : 6e10), (s += -r.state.login_time);
                                    } else s += r.state.logout_time;
                                    return s - a;
                                });
                                for (n = 0; n < i.length; n++) this.friends.push({
                                    f: i[n],
                                    invited: !1
                                });
                                (this.noinfo.visible = 0 == this.friends.length),
                                this.scrollview.addItem(this.friends.length),
                                    t.UIBase.anim_pop_out(this.root, Laya.Handler.create(this, function() {
                                        e.locking = !1;
                                    }));
                            }), (e.prototype.close = function() {
                                var e = this;
                                (this.locking = !0),
                                t.UIBase.anim_pop_hide(this.root, Laya.Handler.create(this, function() {
                                    (e.locking = !1), (e.me.visible = !1);
                                }));
                            }), (e.prototype.render_item = function(e) {
                                var n = e.index,
                                    a = e.container,
                                    r = e.cache_data;
                                r.head || ((r.head = new t.UI_Head(a.getChildByName("head"))), (r.name = a.getChildByName("label_name")), (r.state = a.getChildByName("label_state")), (r.btn = a.getChildByName("btn_invite")), (r.invited = a.getChildByName("invited")));
                                var s = this.friends[this.sortlist[n]];
                                (r.head.id = s.f.base.avatar_id), (r.name.text = s.f.base.nickname);
                                var o = !1;
                                if (s.f.state.is_online) {
                                    var l = game.Tools.playState2Desc(s.f.state.playing);
                                    "" != l ? ((r.state.text = game.Tools.strOfLocalization(2069, [l])), (r.state.color = "#a9d94d"), (r.name.color = "#a9d94d")) : ((r.state.text = game.Tools.strOfLocalization(2071)), (r.state.color = "#58c4db"), (r.name.color = "#58c4db"), (o = !0));
                                } else(r.state.text = game.Tools.strOfLocalization(2072)), (r.state.color = "#8c8c8c"), (r.name.color = "#8c8c8c");
                                s.invited ? ((r.btn.visible = !1), (r.invited.visible = !0)) : ((r.btn.visible = !0), (r.invited.visible = !1), game.Tools.setGrayDisable(r.btn, !o), o && (r.btn.clickHandler = Laya.Handler.create(this, function() {
                                    game.Tools.setGrayDisable(r.btn, !0);
                                    var e = {
                                        room_id: i.Inst.room_id,
                                        mode: i.Inst.room_mode,
                                        nickname: GameMgr.Inst.account_data.nickname,
                                        account_id: GameMgr.Inst.account_id
                                    };
                                    app.NetAgent.sendReq2Lobby("Lobby", "sendClientMessage", {
                                        target_id: s.f.base.account_id,
                                        type: game.EFriendMsgType.room_invite,
                                        content: JSON.stringify(e)
                                    }, function(e, i) {
                                        e || i.error ? (game.Tools.setGrayDisable(r.btn, !1), t.UIMgr.Inst.showNetReqError("sendClientMessage", e, i)) : ((r.btn.visible = !1), (r.invited.visible = !0), (s.invited = !0));
                                    });
                                }, null, !1)));
                            }), e);
                    })(),
                    i = (function(i) {
                        function n() {
                            var e = i.call(this, new ui.lobby.waitingroomUI()) || this;
                            return (
                                (e.skin_ready = "myres/room/btn_ready.png"), (e.skin_cancel = "myres/room/btn_cancel.png"), (e.skin_start = "myres/room/btn_start.png"), (e.skin_start_no = "myres/room/btn_start_no.png"), (e.label_rommid = null), (e.player_cells = []), (e.btn_ok = null), (e.btn_invite_friend = null), (e.btn_add_robot = null), (e.beReady = !1), (e.room_id = -1), (e.owner_id = -1), (e.tournament_id = 0), (e.max_player_count = 0), (e.players = []), (e.container_rules = null), (e.container_top = null), (e.container_right = null), (e.locking = !1), (e.mousein_copy = !1), (e.popout = null), (e.room_link = null), (e.btn_copy_link = null), (e.last_start_room = 0), (e.invitefriend = null), (e.pre_choose = null), (e.ai_name = game.Tools.strOfLocalization(2003)), (n.Inst = e), app.NetAgent.AddListener2Lobby("NotifyRoomPlayerReady", Laya.Handler.create(e, function(t) {
                                    app.Log.log("NotifyRoomPlayerReady:" + JSON.stringify(t)),
                                        e.onReadyChange(t.account_id, t.ready);
                                })), app.NetAgent.AddListener2Lobby("NotifyRoomPlayerUpdate", Laya.Handler.create(e, function(t) {
                                    app.Log.log("NotifyRoomPlayerUpdate:" + JSON.stringify(t)),
                                        e.onPlayerChange(t);
                                })), app.NetAgent.AddListener2Lobby("NotifyRoomGameStart", Laya.Handler.create(e, function(t) {
                                    e.enable && (app.Log.log("NotifyRoomGameStart:" + JSON.stringify(t)), e.onGameStart(t));
                                })), app.NetAgent.AddListener2Lobby("NotifyRoomKickOut", Laya.Handler.create(e, function(t) {
                                    app.Log.log("NotifyRoomKickOut:" + JSON.stringify(t)),
                                        e.onBeKictOut();
                                })), game.LobbyNetMgr.Inst.add_connect_listener(Laya.Handler.create(e, function() {
                                    e.enable && e.hide(Laya.Handler.create(e, function() {
                                        t.UI_Lobby.Inst.enable = !0;
                                    }));
                                }, null, !1)), e);
                        }
                        return (__extends(n, i), Object.defineProperty(n.prototype, "inRoom", {
                            get: function() {
                                return -1 != this.room_id;
                            },
                            enumerable: !0,
                            configurable: !0
                        }), Object.defineProperty(n.prototype, "robot_count", {
                            get: function() {
                                for (var t = 0, e = 0; e < this.players.length; e++) 2 == this.players[e].category && t++;
                                return t;
                            },
                            enumerable: !0,
                            configurable: !0
                        }), (n.prototype.resetData = function() {
                            (this.room_id = -1), (this.owner_id = -1), (this.room_mode = {}), (this.max_player_count = 0), (this.players = []);
                        }), (n.prototype.updateData = function(t) {
                            if (t) {
                                (this.room_id = t.room_id), (this.owner_id = t.owner_id), (this.room_mode = t.mode), (this.public_live = t.public_live), (this.tournament_id = 0),
                                t.tournament_id && (this.tournament_id = t.tournament_id), (this.ai_name = game.Tools.strOfLocalization(2003)),
                                    this.room_mode.detail_rule && (1 === this.room_mode.detail_rule.ai_level && (this.ai_name = game.Tools.strOfLocalization(2003)), 2 === this.room_mode.detail_rule.ai_level && (this.ai_name = game.Tools.strOfLocalization(2004))), (this.max_player_count = t.max_player_count), (this.players = []);
                                for (i = 0; i < t.persons.length; i++) {
                                    var e = t.persons[i];
                                    //修改友人房间立绘  -----fxxk
                                    if (e.account_id == GameMgr.Inst.account_id) e.avatar_id = GameMgr.Inst.account_data.my_character.skin;
                                    //end
                                    (e.ready = !1), (e.cell_index = -1), (e.category = 1),
                                    this.players.push(e);
                                }
                                for (i = 0; i < t.robot_count; i++) this.players.push({
                                    //修改友人房间机器人的立绘  -----fxxk
                                    category: 2,
                                    cell_index: -1,
                                    account_id: 0,
                                    level: {
                                        id: 10101,
                                        score: 0
                                    },
                                    nickname: this.ai_name,
                                    ready: !0,
                                    title: 0,
                                    avatar_id: 400101
                                    //end
                                });
                                for (var i = 0; i < t.ready_list.length; i++)
                                    for (var n = 0; n < this.players.length; n++)
                                        if (this.players[n].account_id == t.ready_list[i]) {
                                            this.players[n].ready = !0;
                                            break;
                                        }
                            } else this.resetData();
                        }), (n.prototype.onReadyChange = function(t, e) {
                            for (var i = 0; i < this.players.length; i++)
                                if (this.players[i].account_id == t) {
                                    (this.players[i].ready = e),
                                    this._onPlayerReadyChange(this.players[i]);
                                    break;
                                }
                        }), (n.prototype.onPlayerChange = function(t) {
                            t = t.toJSON();
                            for (var e = [], i = 0; i < this.players.length; i++) 0 != this.players[i].category && e.push(this.players[i]);
                            if (((this.players = e), t.update_list))
                                for (i = 0; i < t.update_list.length; i++) {
                                    for (var n = t.update_list[i], a = n.account_id, r = !0, s = 0; s < this.players.length; s++)
                                        if (this.players[s] && this.players[s].account_id == a) {
                                            n.avatar_id && (this.players[s].avatar_id = n.avatar_id),
                                                n.title && (this.players[s].avatar_id = n.title),
                                                n.nickname && (this.players[s].avatar_id = n.nickname),
                                                n.level && (this.players[s].level = n.level),
                                                this._refreshPlayerInfo(this.players[s]), (r = !1);
                                            break;
                                        }
                                    if (r) {
                                        var o = -1;
                                        if (this.enable) {
                                            for (var l = [!1, !1, !1, !1], h = 0; h < this.players.length; h++) l[this.players[h].cell_index] = !0;
                                            for (s = 0; s < this.max_player_count; s++)
                                                if (!l[s]) {
                                                    o = s;
                                                    break;
                                                }
                                        }
                                        (n.cell_index = o), (n.ready = !1), (n.category = 1),
                                        this.players.push(n),
                                            this._refreshPlayerInfo(this.players[this.players.length - 1]);
                                    }
                                }
                            if (t.remove_list)
                                for (i = 0; i < t.remove_list.length; i++)
                                    for (var a = t.remove_list[i], s = 0; s < this.players.length; s++)
                                        if (this.players[s] && this.players[s].account_id == a) {
                                            for (var c = this.players[s].cell_index, u = s; u < this.players.length - 1; u++) this.players[u] = this.players[u + 1];
                                            this.players.pop(), this._clearCell(c);
                                            break;
                                        }
                            if (null != t.robot_count && void 0 != t.robot_count) {
                                var _ = t.robot_count;
                                _ < this.robot_count && this.pre_choose && 2 == this.pre_choose.category && ((this.pre_choose.category = 0), this._clearCell(this.pre_choose.cell_index), (this.pre_choose = null));
                                for (i = 0; i < this.players.length; i++) {
                                    var d = this.players[i];
                                    2 == d.category && (0 == _ ? ((this.players[i].category = 0), this._clearCell(d.cell_index)) : _--);
                                }
                                for (; _ > 0;) {
                                    for (var f = -1, i = 0; i < this.players.length; i++)
                                        if (0 == this.players[i].category) {
                                            f = i;
                                            break;
                                        }
                                    if (-1 == f) {
                                        if (!(this.players.length < this.max_player_count)) {
                                            app.Log.Error("同步机器人数量有问题");
                                            break;
                                        }
                                        _--;
                                        for (var c = -1, l = [!1, !1, !1, !1], i = 0; i < this.players.length; i++) l[this.players[i].cell_index] = !0;
                                        for (s = 0; s < this.max_player_count; s++)
                                            if (!l[s]) {
                                                c = s;
                                                break;
                                            }
                                        this.players.push({
                                                category: 2,
                                                cell_index: c,
                                                account_id: 0,
                                                level: {
                                                    id: 10101,
                                                    score: 0
                                                },
                                                nickname: this.ai_name,
                                                ready: !0,
                                                title: 0,
                                                avatar_id: 400101
                                            }),
                                            this._refreshPlayerInfo(this.players[this.players.length - 1]);
                                    } else _--, (this.players[f].category = 2), (this.players[f].cell_index = f), (this.players[f].account_id = 0), (this.players[f].level = {
                                            id: 10101,
                                            score: 0
                                        }), (this.players[f].nickname = this.ai_name), (this.players[f].ready = !0), (this.players[f].title = 0), (this.players[f].avatar_id = 400101),
                                        this._refreshPlayerInfo(this.players[f]);
                                }
                            }
                            if (t.owner_id) {
                                if (((this.owner_id = t.owner_id), this.enable))
                                    if (this.owner_id == GameMgr.Inst.account_id) this.refreshAsOwner();
                                    else
                                        for (s = 0; s < this.players.length; s++)
                                            if (this.players[s] && this.players[s].account_id == this.owner_id) {
                                                this._refreshPlayerInfo(this.players[s]);
                                                break;
                                            }
                            } else if (this.enable)
                                if (this.owner_id == GameMgr.Inst.account_id) this.refreshAsOwner();
                                else
                                    for (s = 0; s < this.players.length; s++)
                                        if (this.players[s] && this.players[s].account_id == this.owner_id) {
                                            this._refreshPlayerInfo(this.players[s]);
                                            break;
                                        }
                        }), (n.prototype.onBeKictOut = function() {
                            this.resetData(),
                                this.enable && ((this.enable = !1), (t.UI_Lobby.Inst.enable = !0), t.UIMgr.Inst.ShowErrorInfo(game.Tools.strOfLocalization(52)));
                        }), (n.prototype.onCreate = function() {
                            var i = this;
                            this.last_start_room = 0;
                            var n = this.me.getChildByName("root");
                            (this.container_top = n.getChildByName("top")), (this.container_right = n.getChildByName("right")), (this.label_rommid = this.container_top.getChildByName("label_roomid"));
                            for (var a = function(e) {
                                        var a = n.getChildByName("player_" + e.toString()),
                                            s = {};
                                        (s.index = e), (s.container = a), (s.container_flag = a.getChildByName("flag")), (s.container_name = a.getChildByName("container_name")), (s.name = a.getChildByName("container_name").getChildByName("label_name")), (s.btn_t = a.getChildByName("btn_t")), (s.container_illust = a.getChildByName("container_illust")), (s.illust = new t.UI_Character_Skin(a.getChildByName("container_illust").getChildByName("illust"))), (s.host = a.getChildByName("host")), (s.title = new t.UI_PlayerTitle(a.getChildByName("container_name").getChildByName("title"))), (s.rank = new t.UI_Level(a.getChildByName("container_name").getChildByName("rank"))), (s.is_robot = !1);
                                        var o = 0;
                                        (s.btn_t.clickHandler = Laya.Handler.create(r, function() {
                                            if (!(i.locking || Laya.timer.currTimer < o)) {
                                                o = Laya.timer.currTimer + 500;
                                                for (var t = 0; t < i.players.length; t++)
                                                    if (i.players[t].cell_index == e) {
                                                        i.kickPlayer(t);
                                                        break;
                                                    }
                                            }
                                        }, null, !1)), (s.btn_info = a.getChildByName("btn_info")), (s.btn_info.clickHandler = Laya.Handler.create(r, function() {
                                            if (!i.locking)
                                                for (var n = 0; n < i.players.length; n++)
                                                    if (i.players[n].cell_index == e) {
                                                        i.players[n].account_id && i.players[n].account_id > 0 && t.UI_OtherPlayerInfo.Inst.show(i.players[n].account_id);
                                                        break;
                                                    }
                                        }, null, !1)),
                                        r.player_cells.push(s);
                                    },
                                    r = this,
                                    s = 0; s < 4; s++) a(s);
                            (this.btn_ok = n.getChildByName("btn_ok")), (this.btn_ok.clickHandler = Laya.Handler.create(this, function() {
                                i.owner_id == GameMgr.Inst.account_id ? i.getStart() : i.switchReady();
                            }, null, !1)), (this.container_top.getChildByName("btn_leave").clickHandler = Laya.Handler.create(this, function() {
                                i.leaveRoom();
                            }, null, !1)), (this.btn_invite_friend = this.container_right.getChildByName("btn_friend")), (this.btn_invite_friend.clickHandler = Laya.Handler.create(this, function() {
                                i.locking || i.invitefriend.show();
                            }, null, !1)), (this.btn_add_robot = this.container_right.getChildByName("btn_robot"));
                            var o = 0;
                            (this.btn_add_robot.clickHandler = Laya.Handler.create(this, function() {
                                i.locking || Laya.timer.currTimer < o || ((o = Laya.timer.currTimer + 1e3), app.NetAgent.sendReq2Lobby("Lobby", "modifyRoom", {
                                    robot_count: i.robot_count + 1
                                }, function(e, i) {
                                    (e || (i.error && 1111 != i.error.code)) && t.UIMgr.Inst.showNetReqError("modifyRoom_add", e, i), (o = 0);
                                }));
                            }, null, !1)), (this.container_right.getChildByName("btn_help").clickHandler = Laya.Handler.create(this, function() {
                                i.locking || t.UI_Rules.Inst.show();
                            }, null, !1));
                            var l = this.container_right.getChildByName("btn_copy");
                            l.on("mouseover", this, function() {
                                    i.mousein_copy = !0;
                                }),
                                l.on("mouseout", this, function() {
                                    i.mousein_copy = !1;
                                }), (l.clickHandler = Laya.Handler.create(this, function() {
                                    i.popout.visible || (GameMgr.Inst.BehavioralStatistics(12), (i.popout.visible = !0), t.UIBase.anim_pop_out(i.popout, null));
                                }, null, !1)), (this.container_rules = this.container_right.getChildByName("container_rules")), (this.container_rules.visible = !0), (this.popout = this.me.getChildByName("pop")), (this.room_link = this.popout.getChildByName("input").getChildByName("txtinput")), (this.room_link.editable = !1), (this.btn_copy_link = this.popout.getChildByName("btn_copy")), (this.btn_copy_link.visible = !1),
                                GameMgr.inConch ? ((this.btn_copy_link.visible = !0), (this.btn_copy_link.clickHandler = Laya.Handler.create(this, function() {
                                    Laya.PlatformClass.createClass("layaair.majsoul.mjmgr").call("setSysClipboardText", i.room_link.text),
                                        t.UIBase.anim_pop_hide(i.popout, Laya.Handler.create(i, function() {
                                            i.popout.visible = !1;
                                        })),
                                        t.UI_FlyTips.ShowTips(game.Tools.strOfLocalization(2125));
                                }, null, !1))) : GameMgr.iniOSWebview && ((this.btn_copy_link.visible = !0), (this.btn_copy_link.clickHandler = Laya.Handler.create(this, function() {
                                    Laya.Browser.window.wkbridge.callNative("copy2clip", i.room_link.text, function() {}),
                                        t.UIBase.anim_pop_hide(i.popout, Laya.Handler.create(i, function() {
                                            i.popout.visible = !1;
                                        })),
                                        t.UI_FlyTips.ShowTips(game.Tools.strOfLocalization(2125));
                                }, null, !1))), (this.popout.visible = !1), (this.popout.getChildByName("btn_cancel").clickHandler = Laya.Handler.create(this, function() {
                                    t.UIBase.anim_pop_hide(i.popout, Laya.Handler.create(i, function() {
                                        i.popout.visible = !1;
                                    }));
                                }, null, !1)), (this.invitefriend = new e(this.me.getChildByName("invite_friend")));
                        }), (n.prototype.show = function() {
                            var e = this;
                            game.Scene_Lobby.Inst.change_bg("indoor", !1), (this.mousein_copy = !1), (this.beReady = !1), (this.invitefriend.me.visible = !1), (this.btn_add_robot.visible = !1), (this.btn_invite_friend.visible = !1), (this.pre_choose = null);
                            for (h = 0; h < 4; h++) this.player_cells[h].container.visible = h < this.max_player_count;
                            for (h = 0; h < this.max_player_count; h++) this._clearCell(h);
                            for (h = 0; h < this.players.length; h++)
                                (this.players[h].cell_index = h),
                                this._refreshPlayerInfo(this.players[h]);
                            this.owner_id == GameMgr.Inst.account_id ? ((this.btn_ok.skin = game.Tools.localUISrc(this.skin_start)), this.refreshAsOwner()) : ((this.btn_ok.skin = game.Tools.localUISrc(this.skin_ready)), game.Tools.setGrayDisable(this.btn_ok, !1)), "en" == GameMgr.client_language ? (this.label_rommid.text = "#" + this.room_id.toString()) : (this.label_rommid.text = this.room_id.toString()), (this.container_rules.visible = !0);
                            for (h = 0; h < this.container_rules.numChildren; h++) this.container_rules.getChildAt(h).visible = !1;
                            var i = [];
                            i.push(game.Tools.room_mode_desc(this.room_mode.mode));
                            var n = this.room_mode.detail_rule;
                            if (n) {
                                var a = 5,
                                    r = 20;
                                if (
                                    (null != n.time_fixed && (a = n.time_fixed), null != n.time_add && (r = n.time_add), i.push(a.toString() + "+" + r.toString() + game.Tools.strOfLocalization(2019)), 0 != this.tournament_id)) {
                                    var s = cfg.tournament.tournaments.get(this.tournament_id);
                                    s && i.push(s.name);
                                }
                                if (
                                    (null != n.init_point && i.push(game.Tools.strOfLocalization(2199) + n.init_point), null != n.fandian && i.push(game.Tools.strOfLocalization(2094) + ":" + n.fandian), null != n.dora_count)) switch (n.dora_count) {
                                    case 0:
                                        i.push(game.Tools.strOfLocalization(2044));
                                        break;
                                    case 2:
                                        i.push(game.Tools.strOfLocalization(2047));
                                        break;
                                    case 3:
                                        i.push(game.Tools.strOfLocalization(2045));
                                        break;
                                    case 4:
                                        i.push(game.Tools.strOfLocalization(2046));
                                }
                                null != n.shiduan && 1 != n.shiduan && i.push(game.Tools.strOfLocalization(2137)),
                                    null != n.bianjietishi && 1 != n.bianjietishi && i.push(game.Tools.strOfLocalization(2200)),
                                    this.room_mode.mode >= 10 && this.room_mode.mode <= 14 && (null != n.have_zimosun && 1 != n.have_zimosun ? i.push(game.Tools.strOfLocalization(2202)) : i.push(game.Tools.strOfLocalization(2203)));
                            }
                            this.public_live && i.push(game.Tools.strOfLocalization(2220));
                            for (h = 0; h < i.length; h++) {
                                var o = this.container_rules.getChildAt(h);
                                (o.visible = !0), (o.x = 6), (o.y = 334 - 68 * (i.length - 1 - h));
                                var l = o.getChildAt(0);
                                (l.fontSize = 40),
                                i[h].length <= 5 ? (l.fontSize = 40) : i[h].length <= 9 ? (l.fontSize = 52.5 - 2.5 * i[h].length) : (l.fontSize = 30), (l.text = i[h]);
                            }
                            (this.enable = !0), (this.locking = !0),
                            t.UIBase.anim_alpha_in(this.container_top, {
                                y: -30
                            }, 200);
                            for (var h = 0; h < this.player_cells.length; h++) t.UIBase.anim_alpha_in(this.player_cells[h].container, {
                                x: 80
                            }, 150, 150 + 50 * h, null, Laya.Ease.backOut);
                            t.UIBase.anim_alpha_in(this.btn_ok, {}, 100, 600),
                                t.UIBase.anim_alpha_in(this.container_right, {
                                    x: 20
                                }, 100, 500),
                                Laya.timer.once(600, this, function() {
                                    e.locking = !1;
                                });
                            var c = game.Tools.room_mode_desc(this.room_mode.mode);
                            (this.room_link.text = game.Tools.strOfLocalization(2221, [
                                this.room_id.toString()
                            ])), "" != c && (this.room_link.text += "(" + c + ")"), (this.room_link.text += ": " + GameMgr.Inst.link_url + "?room=" + this.room_id);
                        }), (n.prototype.leaveRoom = function() {
                            var e = this;
                            this.locking || app.NetAgent.sendReq2Lobby("Lobby", "leaveRoom", {}, function(i, n) {
                                i || n.error ? t.UIMgr.Inst.showNetReqError("leaveRoom", i, n) : e.hide(Laya.Handler.create(e, function() {
                                    t.UI_Lobby.Inst.enable = !0;
                                }));
                            });
                        }), (n.prototype.tryToClose = function(e) {
                            var i = this;
                            app.NetAgent.sendReq2Lobby("Lobby", "leaveRoom", {}, function(n, a) {
                                n || a.error ? (t.UIMgr.Inst.showNetReqError("leaveRoom", n, a), e.runWith(!1)) : ((i.enable = !1), e.runWith(!0));
                            });
                        }), (n.prototype.hide = function(e) {
                            var i = this;
                            (this.locking = !0),
                            t.UIBase.anim_alpha_out(this.container_top, {
                                y: -30
                            }, 150);
                            for (var n = 0; n < this.player_cells.length; n++) t.UIBase.anim_alpha_out(this.player_cells[n].container, {
                                x: 80
                            }, 150, 0, null);
                            t.UIBase.anim_alpha_out(this.btn_ok, {}, 150),
                                t.UIBase.anim_alpha_out(this.container_right, {
                                    x: 20
                                }, 150),
                                Laya.timer.once(200, this, function() {
                                    (i.locking = !1), (i.enable = !1), e && e.run();
                                }), (document.getElementById("layaCanvas").onclick = null);
                        }), (n.prototype.onDisbale = function() {
                            Laya.timer.clearAll(this);
                            for (var t = 0; t < this.player_cells.length; t++) Laya.loader.clearTextureRes(this.player_cells[t].illust.skin);
                            document.getElementById("layaCanvas").onclick = null;
                        }), (n.prototype.switchReady = function() {
                            this.owner_id != GameMgr.Inst.account_id && ((this.beReady = !this.beReady), (this.btn_ok.skin = game.Tools.localUISrc(this.beReady ? this.skin_cancel : this.skin_ready)), app.NetAgent.sendReq2Lobby("Lobby", "readyPlay", {
                                ready: this.beReady
                            }, function(t, e) {}));
                        }), (n.prototype.getStart = function() {
                            this.owner_id == GameMgr.Inst.account_id && (Laya.timer.currTimer < this.last_start_room + 2e3 || ((this.last_start_room = Laya.timer.currTimer), app.NetAgent.sendReq2Lobby("Lobby", "startRoom", {}, function(e, i) {
                                (e || i.error) && t.UIMgr.Inst.showNetReqError("startRoom", e, i);
                            })));
                        }), (n.prototype.kickPlayer = function(e) {
                            if (this.owner_id == GameMgr.Inst.account_id) {
                                var i = this.players[e];
                                1 == i.category ? app.NetAgent.sendReq2Lobby("Lobby", "kickPlayer", {
                                    account_id: this.players[e].account_id
                                }, function(t, e) {}) : 2 == i.category && ((this.pre_choose = i), app.NetAgent.sendReq2Lobby("Lobby", "modifyRoom", {
                                    robot_count: this.robot_count - 1
                                }, function(e, i) {
                                    (e || i.error) && t.UIMgr.Inst.showNetReqError("modifyRoom_minus", e, i);
                                }));
                            }
                        }), (n.prototype._clearCell = function(t) {
                            if (!(t < 0 || t >= this.player_cells.length)) {
                                var e = this.player_cells[t];
                                (e.container_flag.visible = !1), (e.container_illust.visible = !1), (e.name.visible = !1), (e.container_name.visible = !1), (e.btn_t.visible = !1), (e.host.visible = !1);
                            }
                        }), (n.prototype._refreshPlayerInfo = function(t) {
                            var e = t.cell_index;
                            if (!(e < 0 || e >= this.player_cells.length)) {
                                var i = this.player_cells[e];
                                (i.container_illust.visible = !0), (i.container_name.visible = !0), (i.name.visible = !0), (i.name.text = t.nickname), (i.btn_t.visible = this.owner_id == GameMgr.Inst.account_id && t.account_id != GameMgr.Inst.account_id),
                                this.owner_id == t.account_id && ((i.container_flag.visible = !0), (i.host.visible = !0)),
                                    i.illust.setSkin(t.avatar_id, "waitingroom"), (i.title.id = game.Tools.titleLocalization(t.account_id, t.title)), (i.rank.id = t.level.id),
                                    this._onPlayerReadyChange(t);
                            }
                        }), (n.prototype._onPlayerReadyChange = function(t) {
                            var e = t.cell_index;
                            if (!(e < 0 || e >= this.player_cells.length)) {
                                var i = this.player_cells[e];
                                this.owner_id == t.account_id ? (i.container_flag.visible = !0) : (i.container_flag.visible = t.ready),
                                    this.refreshStart();
                            }
                        }), (n.prototype.refreshAsOwner = function() {
                            if (this.owner_id == GameMgr.Inst.account_id) {
                                for (var t = 0, e = 0; e < this.players.length; e++) 0 != this.players[e].category && (this._refreshPlayerInfo(this.players[e]), t++);
                                (this.btn_add_robot.visible = !0), (this.btn_invite_friend.visible = !0),
                                game.Tools.setGrayDisable(this.btn_add_robot, t == this.max_player_count),
                                    this.refreshStart();
                            }
                        }), (n.prototype.refreshStart = function() {
                            if (this.owner_id == GameMgr.Inst.account_id) {
                                this.btn_ok.skin = game.Tools.localUISrc(this.skin_start);
                                for (var t = 0, e = 0; e < this.players.length; e++)
                                    if (0 != this.players[e].category && (!this.players[e] || this.players[e].account_id != this.owner_id)) {
                                        if (!this.players[e] || null == this.players[e].ready || void 0 == this.players[e].ready || !this.players[e].ready) return void game.Tools.setGrayDisable(this.btn_ok, !0);
                                        t++;
                                    }
                                game.Tools.setGrayDisable(this.btn_ok, t + 1 != this.max_player_count);
                            }
                        }), (n.prototype.onGameStart = function(t) {
                            game.Tools.setGrayDisable(this.btn_ok, !0), (this.enable = !1),
                                game.MJNetMgr.Inst.OpenConnect(t.connect_token, t.game_uuid, t.location, !1, null);
                        }), (n.Inst = null), n);
                    })(t.UIBase);
                t.UI_WaitingRoom = i;
            })(uiscript || (uiscript = {}));
        }, 5000);
    })(), 100);