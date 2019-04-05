// ==UserScript==
// @name         雀魂mod
// @namespace    https://github.com/UsernameFull/majsoul_mod 
// @version      0.0.3
// @description  雀魂mod,解锁了全人物道具等。。。
// @author       You
// @match        https://*.union-game.com/0/
// @grant        none
// ==/UserScript==
setTimeout(function(){
    setTimeout(function(){
    // Hack 开启报番型，作者 aoarashi1988，Handle修改
    if (game) {
      game.Tools.get_chara_audio = function (e, t) {
        if (t && '' != t) {
          var charid = e.charid,
            chara = cfg.item_definition.character.get(charid)
          if (!chara) return null
          for (
            var a = 6, r = cfg.voice.sound.findGroup(chara.sound), o = [], s = 0;
            s < r.length;
            s++
          )
            r[s].type == t && r[s].level_limit <= a && o.push(s)
          if (0 == o.length) return null
          var h = o[Math.floor(Math.random() * o.length)]
          return {
            path: r[h].path,
            volume: chara.sound_volume,
            time_length: r[h].time_length
          }
        }
      }
      view.AudioMgr.PlayCharactorSound = function(t, e, i) {
            var n = t.charid,
                r = cfg.item_definition.character.get(n);
            if (!r) return null;
            for (var a = t.level, s = cfg.voice.sound.findGroup(r.sound), o = [], l = 0; l < s.length; l++) s[l].type == e && s[l].level_limit <= a && o.push(l);
            if (0 == o.length) return null;
            var h = o[Math.floor(Math.random() * o.length)],
                c = r.sound_volume;
            return c *= this.getCVvolume(n), this.getCVmute(n) && (c = 0), {
                words: s[h].words,
                sound: this.PlaySound(s[h].path, c, i)
            }
        }
    
      requestAnimationFrame(function autoRun() {
        try {
          const arrBackup = cfg.voice.sound.groups_
          if (!arrBackup || arrBackup.length === 0) {
            throw new Error()
          }
          console.log('Hacked所有语音')
          Object.entries(cfg.voice.sound.groups_).forEach(
            ([soundID, soundGroup]) => {
              soundGroup.forEach((soundObject, index) => {
                soundObject.level_limit = 0
              })
            }
          )
        } catch (error) {
          requestAnimationFrame(autoRun)
        }
      })
    }
    
    //以下为解锁全立绘，作者UsernameFull
    !function(e) {
      var t = function() {
          function t(e) {
              var t = this;
              this.desktop_default = "myres2/tablecloth/tablecloth_default/preview.jpg",
              this.mjp_defalut = "myres2/mjp/mjp_default/preview.png",
              this.tab_index = 0,
              this.select_index = 0,
              this.items = [],
              this.img_desktop = null,
              this.img_mjp = null,
              this.btn_save = null,
              this.me = e,
              this.scrollview = e.getChildByName("items").scriptMap["capsui.CScrollView"],
              this.scrollview.init_scrollview(new Laya.Handler(this, this.render_item), -1, 3, 10),
              this.scrollview.reset(),
              this.btn_tablecloth = e.getChildByName("items").getChildByName("btn_tablecloth"),
              this.btn_tablecloth.clickHandler = Laya.Handler.create(this,
              function() {
                  1 != t.tab_index && t.change_tab(1)
              },
              null, !1),
              this.btn_cardback = e.getChildByName("items").getChildByName("btn_cardback"),
              this.btn_cardback.clickHandler = Laya.Handler.create(this,
              function() {
                  2 != t.tab_index && t.change_tab(2)
              },
              null, !1);
              var i = this.me.getChildByName("preview");
              this.img_desktop = i.getChildByName("desktop"),
              this.img_mjp = i.getChildByName("mjp"),
              this.btn_save = i.getChildByName("btn_use"),
              this.btn_save.clickHandler = Laya.Handler.create(this, this.save_change, null, !1)
          }
          return t.prototype.show = function() {
              this.me.visible = !0,
              this.items = e.UI_Bag.find_items_by_category(e.EItemCategory.common_view),
              this.items = this.items.sort(function(e, t) {
                  return e.item_id - t.item_id
              }),
              this.scrollview.reset(),
              this.scrollview.addItem(this.items.length),
              this.btn_save.visible = !1,
              this.change_tab(1)
          },
          t.prototype.close = function() {
              this.me.visible = !1,
              this.items = [],
              this.scrollview.reset(),
              Laya.loader.clearTextureRes(this.img_desktop.skin),
              Laya.loader.clearTextureRes(this.img_mjp.skin),
              this.img_desktop.skin = "",
              this.img_mjp.skin = "",
              game.LoadMgr.clearImgSkin(this.img_desktop),
              game.LoadMgr.clearImgSkin(this.img_mjp)
          },
          t.prototype.change_tab = function(t) {
              var i = e.UI_Bag.find_items_by_category(e.EItemCategory.common_view);
              i = i.sort(function(e, t) {
                  return e.item_id - t.item_id
              }),
              this.tab_index = t,
              this.items = [],
              this.scrollview.reset(),
              this.select_index = -1,
              this.btn_tablecloth.getChildByName("inchoose").visible = 1 == t,
              this.btn_cardback.getChildByName("inchoose").visible = 2 == t;
              for (var n = 0; n < i.length; n++) {
                  cfg.item_definition.item.get(i[n].item_id).type == t && (this.items.push(i[n]), i[n].item_id == game.GameUtility.get_common_view_id(t) && (this.select_index = this.items.length - 1))
              }
              this.scrollview.addItem(this.items.length),
              this._on_select_change(),
              1 == t ? this._refresh_mjp_view(game.GameUtility.get_common_view_id(game.ECommonView.mjp)) : this._refresh_desktop_view(game.GameUtility.get_common_view_id(game.ECommonView.desktop))
          },
          t.prototype.render_item = function(t) {
              var i = this,
              n = t.index,
              a = t.container,
              r = t.cache_data,
              o = this.items[n],
              s = cfg.item_definition.item.get(o.item_id),
              h = a.getChildByName("btn").getChildByName("inchoose");
              this.select_index == n ? h.visible = !0 : h.visible = !1;
              var l = a.getChildByName("btn");
              l.clickHandler = Laya.Handler.create(this,
              function() {
                  if (i.select_index != n) {
                      var t = i.select_index;
                      i.select_index = n,
                      h.visible = !0,
                      t >= 0 && t < i.items.length && i.scrollview.wantToRefreshItem(t),
                      i._on_select_change()
                  } else e.UI_ItemDetail.Inst.show(o.item_id)
              },
              null, !1);
              var c = a.getChildByName("useing");
              GameMgr.Inst.commonview_slot[s.type] == o.item_id ? c.visible = !0 : c.visible = !1,
              r.skin || (r.skin = new e.UI_Item_Skin(l.getChildByName("icon"))),
              r.skin.setSkin(s.icon)
          },
          t.prototype._on_select_change = function() {
              if (this.select_index >= 0 && this.select_index < this.items.length) {
                  var e = this.items[this.select_index];
                  game.GameUtility.get_common_view_id(this.tab_index) == e.item_id ? this.btn_save.getChildByName("info").text = game.Tools.strOfLocalization(2034) : this.btn_save.getChildByName("info").text = game.Tools.strOfLocalization(2035),
                  this.btn_save.visible = !0,
                  1 == this.tab_index ? this._refresh_desktop_view(e.item_id) : this._refresh_mjp_view(e.item_id)
              } else this.btn_save.visible = !1,
              1 == this.tab_index ? this._refresh_desktop_view(0) : this._refresh_mjp_view(0)
          },
          t.prototype._refresh_desktop_view = function(e) {
              var t = cfg.item_definition.view.get(e),
              i = this.desktop_default;
              t && (i = "myres2/tablecloth/" + t.res_name + "/preview.jpg"),
              game.LoadMgr.clearImgSkin(this.img_desktop),
              "" != this.img_desktop.skin && (Laya.loader.clearTextureRes(this.img_desktop.skin), this.img_desktop.skin = ""),
              game.LoadMgr.setImgSkin(this.img_desktop, i)
          },
          t.prototype._refresh_mjp_view = function(e) {
              var t = cfg.item_definition.view.get(e),
              i = this.mjp_defalut;
              t && (i = "myres2/mjp/" + t.res_name + "/preview.png"),
              game.LoadMgr.clearImgSkin(this.img_mjp),
              "" != this.img_mjp.skin && (Laya.loader.clearTextureRes(this.img_mjp.skin), this.img_mjp.skin = ""),
              game.LoadMgr.setImgSkin(this.img_mjp, i)
          },
          t.prototype.save_change = function() {
              var e = this.items[this.select_index],
              t = 0;
              game.GameUtility.get_common_view_id(this.tab_index) == e.item_id ? (t = 0, this.select_index = -1) : t = e.item_id,
              GameMgr.Inst.commonview_slot[this.tab_index] = t,
              //屏蔽改变桌布及牌背的网络请求 ----fxxk
              // app.NetAgent.sendReq2Lobby("Lobby", "changeCommonView", {
              //     slot: this.tab_index,
              //     value: t
              // },
              // function(e, t) {}),
              //end
              2 == this.tab_index && GameMgr.Inst.load_mjp_view(t);
              for (var i = 0; i < this.items.length; i++) this.scrollview.wantToRefreshItem(i);
              this._on_select_change()
          },
          t
      } ();
      e.UI_Bag_PageDesktop = t
    } (uiscript || (uiscript = {}));
    
    !function(e) {
      var t = function() {
          function t() {
              var t = this;
              this.urls = [],
              this.link_index = -1,
              this.connect_state = e.EConnectState.none,
              this.reconnect_count = 0,
              this.reconnect_span = [500, 1e3, 3e3, 6e3, 1e4, 15e3],
              this.playerreconnect = !1,
              this.lasterrortime = 0,
              this.load_over = !1,
              this.loaded_player_count = 0,
              this.real_player_count = 0,
              app.NetAgent.AddListener2MJ("NotifyPlayerLoadGameReady", Laya.Handler.create(this,
              function(e) {
                  app.Log.log("NotifyPlayerLoadGameReady: " + JSON.stringify(e)),
                  t.loaded_player_count = e.ready_id_list.length,
                  t.load_over && uiscript.UI_Loading.Inst.enable && uiscript.UI_Loading.Inst.showLoadCount(t.loaded_player_count, t.real_player_count)
              }))
          }
          return Object.defineProperty(t, "Inst", {
              get: function() {
                  return null == this._Inst ? this._Inst = new t: this._Inst
              },
              enumerable: !0,
              configurable: !0
          }),
          t.prototype.OpenConnect = function(t, i, n, a, r) {
              app.Log.log("MJNetMgr OpenConnect: " + t),
              uiscript.UI_Loading.Inst.show("enter_mj"),
              this.Close(),
              this.url = "",
              this.token = i,
              this.game_uuid = n,
              GameMgr.Inst.ingame = !0,
              GameMgr.Inst.mj_server_url = t,
              GameMgr.Inst.mj_game_token = i,
              GameMgr.Inst.mj_game_uuid = n,
              this.playerreconnect = a,
              this._setState(e.EConnectState.tryconnect),
              this.load_over = !1,
              this.loaded_player_count = 0,
              this.real_player_count = 0,
              this._fetch_gateway(),
              view.AudioMgr.StopMusic()
          },
          t.prototype.Close = function() {
              this.load_over = !1,
              app.Log.log("MJNetMgr close"),
              this._setState(e.EConnectState.none),
              app.NetAgent.Close2MJ()
          },
          t.prototype._OnConnent = function(t) {
              app.Log.log("MJNetMgr _OnConnent event:" + t),
              t == Laya.Event.CLOSE || t == Laya.Event.ERROR ? this.connect_state == e.EConnectState.tryconnect ? this._try_to_linknext() : this.connect_state == e.EConnectState.connecting ? Laya.timer.currTimer - this.lasterrortime > 100 && (this.lasterrortime = Laya.timer.currTimer, view.DesktopMgr.Inst.active ? (view.DesktopMgr.Inst.duringReconnect = !0, this._setState(e.EConnectState.reconnecting), this.reconnect_count = 0, this._Reconnect()) : (this._setState(e.EConnectState.disconnect), uiscript.UIMgr.Inst.ShowErrorInfo(e.Tools.strOfLocalization(2008)), e.Scene_MJ.Inst.ForceOut())) : this.connect_state == e.EConnectState.reconnecting && Laya.timer.currTimer - this.lasterrortime > 100 && (this.lasterrortime = Laya.timer.currTimer, this._Reconnect()) : t == Laya.Event.OPEN && (this.connect_state == e.EConnectState.tryconnect ? (this._setState(e.EConnectState.connecting), this._ConnectSuccess()) : this.connect_state == e.EConnectState.reconnecting && (this._setState(e.EConnectState.connecting), this._ConnectSuccess()))
          },
          t.prototype._Reconnect = function() {
              var t = this;
              e.LobbyNetMgr.Inst.connect_state == e.EConnectState.none || e.LobbyNetMgr.Inst.connect_state == e.EConnectState.disconnect ? this._setState(e.EConnectState.disconnect) : e.LobbyNetMgr.Inst.connect_state == e.EConnectState.connecting && GameMgr.Inst.logined ? this.reconnect_count >= this.reconnect_span.length ? this._setState(e.EConnectState.disconnect) : (Laya.timer.once(this.reconnect_span[this.reconnect_count], this,
              function() {
                  t.connect_state == e.EConnectState.reconnecting && (app.Log.log("MJNetMgr reconnect count:" + t.reconnect_count), app.NetAgent.connect2MJ(t.url, Laya.Handler.create(t, t._OnConnent, null, !1)))
              }), this.reconnect_count++) : Laya.timer.once(1e3, this, this._Reconnect)
          },
          t.prototype._try_to_linknext = function() {
              this.link_index++,
              this.url = "",
              this.link_index < 0 || this.link_index >= this.urls.length ? this.connect_state == e.EConnectState.tryconnect ? (this._setState(e.EConnectState.none), uiscript.UIMgr.Inst.ShowErrorInfo(cfg.str.str.find(59).desc), view.DesktopMgr.Inst.active || e.Scene_MJ.Inst.ForceOut()) : this.connect_state == e.EConnectState.reconnecting && this._Reconnect() : (app.NetAgent.connect2MJ(this.urls[this.link_index].url, Laya.Handler.create(this, this._OnConnent, null, !1)), this.url = this.urls[this.link_index].url)
          },
          t.prototype._fetch_gateway = function() {
              var t = this;
              this.urls = [],
              this.link_index = -1; !
              function(i) {
                  var n = new Laya.HttpRequest;
                  n.once(Laya.Event.COMPLETE, t,
                  function(i) { !
                      function(i) {
                          var n = JSON.parse(i);
                          if (n.maintenance) t.connect_state == e.EConnectState.tryconnect ? t._setState(e.EConnectState.none) : t.connect_state == e.EConnectState.reconnecting && t._setState(e.EConnectState.disconnect),
                          uiscript.UIMgr.Inst.ShowErrorInfo(e.Tools.strOfLocalization(2009)),
                          view.DesktopMgr.Inst.active || e.Scene_MJ.Inst.ForceOut();
                          else if (n.servers && n.servers.length > 0) {
                              for (var a = n.servers,
                              r = e.Tools.deal_gateway(a), o = 0; o < r.length; o++) t.urls.push({
                                  name: e.LobbyNetMgr.gateway_name + "_" + o,
                                  url: r[o]
                              });
                              t.link_index = -1,
                              t._try_to_linknext()
                          } else uiscript.UIMgr.Inst.ShowErrorInfo(cfg.str.str.find(60).desc),
                          view.DesktopMgr.Inst.active || e.Scene_MJ.Inst.ForceOut(),
                          t._setState(e.EConnectState.none)
                      } (i)
                  }),
                  n.once(Laya.Event.ERROR, t,
                  function(i) {
                      t.connect_state == e.EConnectState.tryconnect ? (uiscript.UIMgr.Inst.ShowErrorInfo(cfg.str.str.find(58).desc), view.DesktopMgr.Inst.active || e.Scene_MJ.Inst.ForceOut(), t._setState(e.EConnectState.none)) : t.connect_state == e.EConnectState.reconnecting && t._Reconnect()
                  });
                  var a = [];
                  a.push("If-Modified-Since"),
                  a.push("0"),
                  i += "?service=ws-game-gateway",
                  GameMgr.inHttps ? i += "&protocol=ws&ssl=true": i += "&protocol=ws&ssl=false",
                  n.send(i, "", "get", "text", a)
              } (e.LobbyNetMgr.gateway_url)
          },
          t.prototype._setState = function(t) {
              this.connect_state = t,
              GameMgr.inRelease || null != uiscript.UI_Common.Inst && (t == e.EConnectState.none ? uiscript.UI_Common.Inst.label_net_mj.text = "": t == e.EConnectState.tryconnect ? (uiscript.UI_Common.Inst.label_net_mj.text = "尝试连接麻将服务器", uiscript.UI_Common.Inst.label_net_mj.color = "#000000") : t == e.EConnectState.connecting ? (uiscript.UI_Common.Inst.label_net_mj.text = "麻将服务器：正常", uiscript.UI_Common.Inst.label_net_mj.color = "#00ff00") : t == e.EConnectState.disconnect ? (uiscript.UI_Common.Inst.label_net_mj.text = "麻将服务器：断开连接", uiscript.UI_Common.Inst.label_net_mj.color = "#ff0000", uiscript.UI_Disconnect.Inst && uiscript.UI_Disconnect.Inst.show()) : t == e.EConnectState.reconnecting && (uiscript.UI_Common.Inst.label_net_mj.text = "麻将服务器：正在重连", uiscript.UI_Common.Inst.label_net_mj.color = "#ff0000", uiscript.UI_Disconnect.Inst && uiscript.UI_Disconnect.Inst.show()))
          },
          t.prototype._ConnectSuccess = function() {
              var t = this;
              app.Log.log("MJNetMgr _ConnectSuccess "),
              this.load_over = !1,
              app.NetAgent.sendReq2MJ("FastTest", "authGame", {
                  token: this.token,
                  game_uuid: this.game_uuid
              },
              function(i, n) {
                  if (i || n.error) uiscript.UIMgr.Inst.showNetReqError("authGame", i, n),
                  e.Scene_MJ.Inst.GameEnd(),
                  view.AudioMgr.PlayMusic("music/lobby.mp3");
                  else {
                      app.Log.log("麻将桌验证通过：" + JSON.stringify(n)),
                      uiscript.UI_Loading.Inst.setProgressVal(.1);
                      var a = [];
                      view.DesktopMgr.player_link_state = n.state_list;
                      var r = e.Tools.strOfLocalization(2003),
                      o = n.game_config.mode;
                      view.ERuleMode.Liqi4;
                      o.mode < 10 ? (view.ERuleMode.Liqi4, t.real_player_count = 4) : o.mode < 20 && (view.ERuleMode.Liqi3, t.real_player_count = 3);
                      for (l = 0; l < t.real_player_count; l++) a.push(null);
                      o.extendinfo && (r = e.Tools.strOfLocalization(2004)),
                      o.detail_rule && o.detail_rule.ai_level && (1 === o.detail_rule.ai_level && (r = e.Tools.strOfLocalization(2003)), 2 === o.detail_rule.ai_level && (r = e.Tools.strOfLocalization(2004)));
                      for (l = 0; l < n.seat_list.length; l++) {
                          var s = n.seat_list[l];
                          if (0 == s) a[l] = {
                              //修改牌桌上机器人头像及皮肤---fxxk
                              nickname: r,
                              avatar_id: 400101,
                              level: {
                                  id: 10101
                              },
                              character: {
                                  charid: 200001,
                                  level: 0,
                                  exp: 0,
                                  views: [],
                                  skin: 400101,
                                  is_upgraded: !1
                              }
                              //end
                          };
                          else {
                              0;
                              for (var h = 0; h < n.players.length; h++) if (n.players[h].account_id == s) {
                                  a[l] = n.players[h];
                                  //修改牌桌上人物头像及皮肤---fxxk
                                  if(a[l].account_id == GameMgr.Inst.account_id) {
                                      a[l].character = {
                                          charid: GameMgr.Inst.account_data.my_charid,
                                          level: 5,
                                          exp: 0,
                                          skin: GameMgr.Inst.account_data.my_character.skin,
                                          views: GameMgr.Inst.account_data.my_character.views,
                                          is_upgraded: 1
                                      },
                                      a[l].avatar_id = GameMgr.Inst.account_data.my_character.skin;
                                  }
                                  //end
                                  break
                              }
                          }
                      }
                      for (var l = 0; l < t.real_player_count; l++) null == a[l] && (a[l] = {
                          account: 0,
                          nickname: e.Tools.strOfLocalization(2010),
                          avatar_id: 400101,
                          level: {
                              id: 10101
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
                      t.loaded_player_count = n.ready_id_list.length,
                      t._AuthSuccess(a, n.is_game_start, n.game_config.toJSON())
                  }
              })
          },
          t.prototype._AuthSuccess = function(t, i, n) {
              var a = this;
              view.DesktopMgr.Inst && view.DesktopMgr.Inst.active ? (this.load_over = !0, Laya.timer.once(500, this,
              function() {
                  app.Log.log("重连信息1 round_id:" + view.DesktopMgr.Inst.round_id + " step:" + view.DesktopMgr.Inst.current_step),
                  view.DesktopMgr.Inst.Reset(),
                  view.DesktopMgr.Inst.duringReconnect = !0,
                  uiscript.UI_Loading.Inst.setProgressVal(.2),
                  app.NetAgent.sendReq2MJ("FastTest", "syncGame", {
                      round_id: view.DesktopMgr.Inst.round_id,
                      step: view.DesktopMgr.Inst.current_step
                  },
                  function(t, i) {
                      t || i.error ? (uiscript.UIMgr.Inst.showNetReqError("syncGame", t, i), e.Scene_MJ.Inst.ForceOut()) : (app.Log.log("[syncGame] " + JSON.stringify(i)), i.isEnd ? (uiscript.UIMgr.Inst.ShowErrorInfo(e.Tools.strOfLocalization(2011)), e.Scene_MJ.Inst.GameEnd()) : (uiscript.UI_Loading.Inst.setProgressVal(.3), view.DesktopMgr.Inst.fetchLinks(), view.DesktopMgr.Inst.Reset(), view.DesktopMgr.Inst.duringReconnect = !0, view.DesktopMgr.Inst.syncGameByStep(i.game_restore)))
                  })
              })) : e.Scene_MJ.Inst.openMJRoom(t, Laya.Handler.create(this,
              function() {
                  view.DesktopMgr.Inst.initRoom(n, t, GameMgr.Inst.account_id, view.EMJMode.play, Laya.Handler.create(a,
                  function() {
                      i ? Laya.timer.frameOnce(10, a,
                      function() {
                          app.Log.log("重连信息2 round_id:-1 step:" + 1e6),
                          view.DesktopMgr.Inst.Reset(),
                          view.DesktopMgr.Inst.duringReconnect = !0,
                          app.NetAgent.sendReq2MJ("FastTest", "syncGame", {
                              round_id: "-1",
                              step: 1e6
                          },
                          function(t, i) {
                              app.Log.log("syncGame " + JSON.stringify(i)),
                              t || i.error ? (uiscript.UIMgr.Inst.showNetReqError("syncGame", t, i), e.Scene_MJ.Inst.ForceOut()) : (uiscript.UI_Loading.Inst.setProgressVal(1), view.DesktopMgr.Inst.fetchLinks(), a._PlayerReconnectSuccess(i))
                          })
                      }) : Laya.timer.frameOnce(10, a,
                      function() {
                          app.Log.log("send enterGame"),
                          view.DesktopMgr.Inst.Reset(),
                          view.DesktopMgr.Inst.duringReconnect = !0,
                          app.NetAgent.sendReq2MJ("FastTest", "enterGame", {},
                          function(t, i) {
                              t || i.error ? (uiscript.UIMgr.Inst.showNetReqError("enterGame", t, i), e.Scene_MJ.Inst.ForceOut()) : (uiscript.UI_Loading.Inst.setProgressVal(1), app.Log.log("enterGame"), a._EnterGame(i), view.DesktopMgr.Inst.fetchLinks())
                          })
                      })
                  }))
              }), Laya.Handler.create(this,
              function(e) {
                  return uiscript.UI_Loading.Inst.setProgressVal(.1 + .8 * e)
              },
              null, !1))
          },
          t.prototype._EnterGame = function(t) {
              app.Log.log("正常进入游戏: " + JSON.stringify(t)),
              t.is_end ? (uiscript.UIMgr.Inst.ShowErrorInfo(e.Tools.strOfLocalization(2011)), e.Scene_MJ.Inst.GameEnd()) : t.game_restore ? view.DesktopMgr.Inst.syncGameByStep(t.game_restore) : (console.log("正常进入游戏：" + Laya.Stat.currentMemorySize / 1024 / 1024 + " MB"), this.load_over = !0, this.load_over && uiscript.UI_Loading.Inst.enable && uiscript.UI_Loading.Inst.showLoadCount(this.loaded_player_count, this.real_player_count), view.DesktopMgr.Inst.duringReconnect = !1, view.DesktopMgr.Inst.StartChainAction(0))
          },
          t.prototype._PlayerReconnectSuccess = function(t) {
              app.Log.log("_PlayerReconnectSuccess data:" + JSON.stringify(t)),
              t.isEnd ? (uiscript.UIMgr.Inst.ShowErrorInfo(e.Tools.strOfLocalization(2011)), e.Scene_MJ.Inst.GameEnd()) : t.game_restore ? view.DesktopMgr.Inst.syncGameByStep(t.game_restore) : (uiscript.UIMgr.Inst.ShowErrorInfo(e.Tools.strOfLocalization(2012)), e.Scene_MJ.Inst.ForceOut())
          },
          t._Inst = null,
          t
      } ();
      e.MJNetMgr = t
    } (game || (game = {}));
    
    !function(e) {
      var t; !
      function(e) {
          e[e.none = 0] = "none",
          e[e.daoju = 1] = "daoju",
          e[e.gift = 2] = "gift",
          e[e.fudai = 3] = "fudai",
          e[e.character_view = 4] = "character_view",
          e[e.common_view = 5] = "common_view"
      } (t = e.EItemCategory || (e.EItemCategory = {}));
      var i = function(i) {
          function n() {
              var e = i.call(this, new ui.lobby.bagUI) || this;
              return e.container_top = null,
              e.container_content = null,
              e.locking = !1,
              e.tabs = [],
              e.page_item = null,
              e.page_gift = null,
              e.page_desktop = null,
              e.select_index = 0,
              n.Inst = e,
              e
          }
          return __extends(n, i),
          n.init = function() {
              var e = this;
              app.NetAgent.AddListener2Lobby("NotifyAccountUpdate", Laya.Handler.create(this,
              function(t) {
                  var i = t.update;
                  i && i.bag && e.update_data(i.bag.update_items)
              },
              null, !1)),
              this.fetch()
          },
          n.fetch = function() {
              var t = this;
              this._item_map = {},
              app.NetAgent.sendReq2Lobby("Lobby", "fetchBagInfo", {},
              function(i, n) {
                  if (i || n.error) e.UIMgr.Inst.showNetReqError("fetchBagInfo", i, n);
                  else {
                      app.Log.log("背包信息：" + JSON.stringify(n));
                      var a = n.bag;
                      //设置全部道具（立直棒及特效不起效果） ----fxxk
                      // if (a && a.items) for (var r = 0; r < a.items.length; r++) {
                      //     var o = a.items[r].item_id,
                      //     s = a.items[r].stack,
                      //     h = cfg.item_definition.item.get(o);
                      //     h && (t._item_map[o] = {
                      //         item_id: o,
                      //         count: s,
                      //         category: h.category
                      //     })
                      // }
                      var items = cfg.item_definition.item.map_;
                      for (var id in items) {
                          t._item_map[id] = {
                              item_id: id,
                              count: 1,
                              category: items[id].category
                          }
                      }
                      //end
                  }
              })
          },
          n.find_item = function(e) {
              var t = this._item_map[e];
              return t ? {
                  item_id: t.item_id,
                  category: t.category,
                  count: t.count
              }: null
          },
          n.get_item_count = function(e) {
              var t = this.find_item(e);
              if (t) return t.count;
              if (100001 == e) {
                  var i = GameMgr.Inst.account_data.diamond;
                  return GameMgr.inGooglePlay && GameMgr.Inst.account_numerical_resource[101001] && (i += GameMgr.Inst.account_numerical_resource[101001]),
                  GameMgr.inChina && GameMgr.Inst.account_numerical_resource[101002] && (i += GameMgr.Inst.account_numerical_resource[101002]),
                  i
              }
              return 100002 == e ? GameMgr.Inst.access_token.gold: 0
          },
          n.find_items_by_category = function(e) {
              var t = [];
              for (var i in this._item_map) this._item_map[i].category == e && t.push({
                  item_id: this._item_map[i].item_id,
                  category: this._item_map[i].category,
                  count: this._item_map[i].count
              });
              return t
          },
          n.update_data = function(e) {
              for (r = 0; r < e.length; r++) {
                  var t = e[r].item_id,
                  i = e[r].stack;
                  i > 0 ? this._item_map.hasOwnProperty(t.toString()) ? this._item_map[t].count = i: this._item_map[t] = {
                      item_id: t,
                      count: i,
                      category: cfg.item_definition.item.get(t).category
                  }: this._item_map.hasOwnProperty(t.toString()) && (this._item_map[t] = 0, delete this._item_map[t])
              }
              this.Inst && this.Inst.when_data_change();
              for (r = 0; r < e.length; r++) {
                  t = e[r].item_id;
                  if (this._item_listener.hasOwnProperty(t.toString())) for (var n = this._item_listener[t], a = 0; a < n.length; a++) n[a].run()
              }
              for (var r = 0; r < this._all_item_listener.length; r++) this._all_item_listener[r].run()
          },
          n.add_item_listener = function(e, t) {
              this._item_listener.hasOwnProperty(e.toString()) || (this._item_listener[e] = []),
              this._item_listener[e].push(t)
          },
          n.remove_item_listener = function(e, t) {
              var i = this._item_listener[e];
              if (i) for (var n = 0; n < i.length; n++) if (i[n] === t) {
                  i[n] = i[i.length - 1],
                  i.pop();
                  break
              }
          },
          n.add_all_item_listener = function(e) {
              this._all_item_listener.push(e)
          },
          n.remove_all_item_listener = function(e) {
              for (var t = this._all_item_listener,
              i = 0; i < t.length; i++) if (t[i] === e) {
                  t[i] = t[t.length - 1],
                  t.pop();
                  break
              }
          },
          n.prototype.onCreate = function() {
              var t = this;
              this.container_top = this.me.getChildByName("top"),
              this.container_top.getChildByName("btn_back").clickHandler = Laya.Handler.create(this,
              function() {
                  t.locking || t.hide(Laya.Handler.create(t,
                  function() {
                      e.UI_Lobby.Inst.enable = !0
                  }))
              },
              null, !1),
              this.container_content = this.me.getChildByName("content");
              for (var i = function(e) {
                  n.tabs.push(n.container_content.getChildByName("tabs").getChildAt(e)),
                  n.tabs[e].clickHandler = Laya.Handler.create(n,
                  function() {
                      t.select_index != e && t.on_change_tab(e)
                  },
                  null, !1)
              },
              n = this, a = 0; a < 4; a++) i(a);
              this.page_item = new e.UI_Bag_PageItem(this.container_content.getChildByName("page_items")),
              this.page_gift = new e.UI_Bag_PageGift(this.container_content.getChildByName("page_gift")),
              this.page_desktop = new e.UI_Bag_PageDesktop(this.container_content.getChildByName("page_desktop"))
          },
          n.prototype.show = function() {
              var t = this;
              this.enable = !0,
              this.locking = !0,
              e.UIBase.anim_alpha_in(this.container_top, {
                  y: -30
              },
              200),
              e.UIBase.anim_alpha_in(this.container_content, {
                  y: 30
              },
              200),
              Laya.timer.once(300, this,
              function() {
                  t.locking = !1
              }),
              this.on_change_tab(0),
              game.Scene_Lobby.Inst.change_bg("indoor", !1)
          },
          n.prototype.hide = function(t) {
              var i = this;
              this.locking = !0,
              e.UIBase.anim_alpha_out(this.container_top, {
                  y: -30
              },
              200),
              e.UIBase.anim_alpha_out(this.container_content, {
                  y: 30
              },
              200),
              Laya.timer.once(300, this,
              function() {
                  i.locking = !1,
                  i.enable = !1,
                  t && t.run()
              })
          },
          n.prototype.onDisable = function() {
              this.page_desktop.me.visible && this.page_desktop.close()
          },
          n.prototype.on_change_tab = function(e) {
              this.select_index = e;
              for (var i = 0; i < this.tabs.length; i++) this.tabs[i].skin = e == i ? "myres/shop/tab_choose.png": "myres/shop/tab_unchoose.png",
              this.tabs[i].getChildAt(0).color = e == i ? "#d9b263": "#8cb65f";
              switch (this.page_item.close(), this.page_gift.close(), this.page_desktop.close(), e) {
              case 0:
                  this.page_item.show(t.daoju);
                  break;
              case 1:
                  this.page_gift.show();
                  break;
              case 2:
                  this.page_item.show(t.character_view);
                  break;
              case 3:
                  this.page_desktop.show()
              }
          },
          n.prototype.when_data_change = function() {
              this.page_item.me.visible && this.page_item.when_update_data(),
              this.page_gift.me.visible && this.page_gift.when_update_data()
          },
          n._item_map = {},
          n._item_listener = {},
          n._all_item_listener = [],
          n.Inst = null,
          n
      } (e.UIBase);
      e.UI_Bag = i
    } (uiscript || (uiscript = {}));
    
    !function(e) {
      var t = function() {
          function t(t) {
              this.money = null,
              this.rank = null,
              this.me = t,
              this.label_name = t.getChildByName("label_name"),
              this.rank = new e.UI_Level(t.getChildByName("rank")),
              this.money = new e.UI_Money(t, Laya.Handler.create(s.Inst, s.Inst.Hide, null, !1), Laya.Handler.create(this,
              function() {
                  return s.Inst.locking
              },
              null, !1)),
              this.title = new e.UI_PlayerTitle(t.getChildByName("img_title")),
              this.btn_playerinfo = t.getChildByName("btn_playerinfo"),
              this.btn_playerinfo.clickHandler = Laya.Handler.create(this,
              function() {
                  e.UI_PlayerInfo.Inst.show(),
                  GameMgr.Inst.BehavioralStatistics(13)
              },
              null, !1),
              t.getChildByName("btn_activity").clickHandler = Laya.Handler.create(this,
              function() {
                  s.Inst.locking || (e.UI_Activity.Inst.show(), GameMgr.Inst.BehavioralStatistics(18))
              },
              null, !1),
              t.getChildByName("btn_rank").clickHandler = Laya.Handler.create(this,
              function() {
                  s.Inst.locking || (e.UI_Rank.Inst.show(), GameMgr.Inst.BehavioralStatistics(18))
              },
              null, !1),
              t.getChildByName("btn_info").clickHandler = Laya.Handler.create(this,
              function() {
                  s.Inst.locking || e.UI_Info.Inst.show()
              },
              null, !1),
              t.getChildByName("btn_set").clickHandler = Laya.Handler.create(this,
              function() {
                  s.Inst.locking || e.UI_Config.Inst.show()
              },
              null, !1),
              t.getChildByName("btn_help").clickHandler = Laya.Handler.create(this,
              function() {
                  s.Inst.locking || e.UI_Rules.Inst.show()
              },
              null, !1)
          }
          return t.prototype.refresh = function() {
              var e = GameMgr.Inst.account_data;
              this.label_name.text = e.nickname,
              this.title.id = e.title,
              this.rank.id = e.level.id,
              this.money.onEnable(),
              this.refreshRedpoint()
          },
          t.prototype.refreshRedpoint = function() {
              this.me.getChildByName("btn_activity").getChildByName("redpoint").visible = e.UI_Mail.haveRedPoint || e.UI_Activity.haveRedPoint,
              this.me.getChildByName("btn_info").getChildByName("redpoint").visible = e.UI_Info.haveRedPoint
          },
          t
      } (),
      i = function() {
          function t(e) {
              this.me = e,
              this.btn_dajiangsai = e.getChildByName("btn_dajiangsai"),
              this.btn_yibanchang = e.getChildByName("btn_yibanchang"),
              this.btn_yourenfang = e.getChildByName("btn_yourenfang"),
              this.btn_yibanchang.clickHandler = Laya.Handler.create(this,
              function() {
                  s.Inst.setPage(1),
                  GameMgr.Inst.BehavioralStatistics(1)
              },
              null, !1),
              this.btn_yourenfang.clickHandler = Laya.Handler.create(this,
              function() {
                  s.Inst.setPage(2),
                  GameMgr.Inst.BehavioralStatistics(2)
              },
              null, !1),
              this.btn_dajiangsai.clickHandler = Laya.Handler.create(this,
              function() {
                  GameMgr.Inst.BehavioralStatistics(3),
                  s.Inst.setPage(3)
              },
              null, !1)
          }
          return t.prototype.onEnable = function(e) {
              var t = this;
              this.btn_yibanchang.visible = !1,
              this.btn_dajiangsai.visible = !1,
              this.btn_yourenfang.visible = !1,
              this.btn_yibanchang.alpha = 1,
              this.btn_dajiangsai.alpha = 1,
              this.btn_yourenfang.alpha = 1,
              Laya.timer.once(e, this,
              function() {
                  view.AudioMgr.PlayAudio(104),
                  t.btn_yibanchang.x = 700,
                  t.btn_yibanchang.y = 405,
                  t.btn_yibanchang.scaleX = .2,
                  t.btn_yibanchang.scaleY = .2,
                  t.btn_yibanchang.visible = !0,
                  t.btn_yibanchang.alpha = 0,
                  Laya.Tween.to(t.btn_yibanchang, {
                      x: 1183,
                      y: 368,
                      scaleX: 1.2,
                      scaleY: 1.2,
                      alpha: 1
                  },
                  233,
                  function(e, t, i, n) {
                      return Laya.Ease.backOut(e, t, i, n, 1)
                  })
              }),
              Laya.timer.once(e + 100, this,
              function() {
                  view.AudioMgr.PlayAudio(104),
                  t.btn_dajiangsai.x = 700,
                  t.btn_dajiangsai.y = 530,
                  t.btn_dajiangsai.scaleX = .2,
                  t.btn_dajiangsai.scaleY = .2,
                  t.btn_dajiangsai.visible = !0,
                  t.btn_dajiangsai.alpha = 0,
                  Laya.Tween.to(t.btn_dajiangsai, {
                      x: 1110,
                      y: 547,
                      scaleX: 1.2,
                      scaleY: 1.2,
                      alpha: 1
                  },
                  233,
                  function(e, t, i, n) {
                      return Laya.Ease.backOut(e, t, i, n, 1)
                  })
              }),
              Laya.timer.once(e + 200, this,
              function() {
                  view.AudioMgr.PlayAudio(104),
                  t.btn_yourenfang.x = 700,
                  t.btn_yourenfang.y = 634,
                  t.btn_yourenfang.scaleX = .2,
                  t.btn_yourenfang.scaleY = .2,
                  t.btn_yourenfang.visible = !0,
                  t.btn_yourenfang.alpha = 0,
                  Laya.Tween.to(t.btn_yourenfang, {
                      x: 1123,
                      y: 736,
                      scaleX: 1.2,
                      scaleY: 1.2,
                      alpha: 1
                  },
                  233,
                  function(e, t, i, n) {
                      return Laya.Ease.backOut(e, t, i, n, 1)
                  })
              }),
              this.me.visible = !0
          },
          t.prototype.onDisable = function(t) {
              var i = this;
              e.UIBase.anim_alpha_out(this.btn_yibanchang, {
                  x: -500,
                  y: 450,
                  scaleX: -1,
                  scaleY: -1
              },
              200, t, null, Laya.Ease.backIn),
              e.UIBase.anim_alpha_out(this.btn_dajiangsai, {
                  x: -500,
                  y: 150,
                  scaleX: -1,
                  scaleY: -1
              },
              200, t, null, Laya.Ease.backIn),
              e.UIBase.anim_alpha_out(this.btn_yourenfang, {
                  x: -500,
                  y: -150,
                  scaleX: -1,
                  scaleY: -1
              },
              200, t, null, Laya.Ease.backIn),
              Laya.timer.once(200 + t, this,
              function() {
                  i.me.visible = !1
              })
          },
          t
      } (),
      n = function() {
          function t(t) {
              var i = this;
              this.locking = !1,
              this.current_choose_room = -1,
              this.list_room = [],
              this.list_mode = [],
              this.in0 = !0,
              this._last_fetch_time = 0,
              this._last_fetch_success = !1,
              this.me = t,
              this.btn_back = t.getChildByName("container_title").getChildByName("btn_back"),
              this.btn_back.clickHandler = Laya.Handler.create(this,
              function() {
                  i.locking || (i.in0 ? s.Inst.setPage(0) : i.toShow0())
              },
              null, !1),
              this.p0 = t.getChildByName("p0"),
              this.p0.getChildByName("content").vScrollBar.visible = !1,
              this.content0 = this.p0.getChildByName("content");
              for (var n = GameMgr.Inst.account_data,
              a = function(t) {
                  var a = r.p0.getChildByName("content").getChildByName("btn" + t),
                  o = a.getChildByName("container"),
                  s = o.getChildByName("btn"),
                  h = a.getChildByName("stop"),
                  l = 0;
                  l = t < 4 ? 1 + 3 * t: 15;
                  var c = cfg.desktop.matchmode.find(l);
                  c.is_open ? (s.mouseEnabled = !0, o.filters = [], h.visible = !1, s.clickHandler = Laya.Handler.create(r,
                  function() {
                      if (!i.locking) {
                          var a = !0,
                          r = "";
                          a && !c.is_open && (a = !1, r = game.Tools.strOfLocalization(1306)),
                          a && c.glimit_floor && n.gold < c.glimit_floor && (a = !1, r = game.Tools.strOfLocalization(101)),
                          a && -1 !== c.glimit_ceil && n.gold > c.glimit_ceil && (a = !1, r = game.Tools.strOfLocalization(102)),
                          a && c.level_limit && n.level.id < c.level_limit && (a = !1, r = game.Tools.strOfLocalization(103)),
                          a && c.level_limit_ceil && n.level.id > c.level_limit_ceil && (a = !1, r = game.Tools.strOfLocalization(103)),
                          a ? i.toShow1(t) : e.UIMgr.Inst.ShowErrorInfo(r)
                      }
                  },
                  null, !1)) : (s.mouseEnabled = !1, o.filters = [new Laya.ColorFilter(e.GRAY_FILTER)], h.visible = !0),
                  o.getChildByName("btn_tips").clickHandler = Laya.Handler.create(r,
                  function() {
                      i.locking || e.UI_InfoLite.Inst.show(game.Tools.strOfLocalization(t < 4 ? 4 + t: 64))
                  },
                  null, !1)
              },
              r = this, o = 0; o < 5; o++) a(o);
              this.p1 = t.getChildByName("p1"),
              this.p1.getChildByName("content").vScrollBar.visible = !1,
              this.content1 = this.p1.getChildByName("content");
              for (var h = function(t) {
                  l.p1.getChildByName("content").getChildByName("btn" + t).getChildByName("btn").clickHandler = Laya.Handler.create(l,
                  function() {
                      if (!i.locking) {
                          var n = i.p1.getChildByName("content").getChildByName("btn" + t).getChildByName("flag_yuyue");
                          e.UI_PiPeiYuYue.Inst.matchYuYued(i.list_mode[t].id) ? e.UI_PiPeiYuYue.Inst.cancelPiPei(i.list_mode[t].id) : (e.UI_PiPeiYuYue.Inst.addMatch(i.list_mode[t].id), n.visible = !0),
                          GameMgr.Inst.BehavioralStatistics(8 + t)
                      }
                  },
                  null, !1),
                  l.p1.getChildByName("content").getChildByName("btn" + t).getChildByName("btn_tips").clickHandler = Laya.Handler.create(l,
                  function() {
                      i.locking || e.UI_InfoLite.Inst.show(game.Tools.strOfLocalization(2 + t))
                  },
                  null, !1)
              },
              l = this, o = 0; o < 2; o++) h(o);
              this.onShow0(),
              this.title = t.getChildByName("container_title").getChildAt(0),
              e.UI_PiPeiYuYue.Inst.me.on("cancelPiPei", this,
              function(e) {
                  for (var t = 0; t < 2; t++) i.list_mode[t].id == e && (i.p1.getChildByName("content").getChildByName("btn" + t).getChildByName("flag_yuyue").visible = !1)
              }),
              e.UI_PiPeiYuYue.Inst.me.on("pipeiover", this,
              function() {
                  for (var e = 0; e < 2; e++) i.p1.getChildByName("content").getChildByName("btn" + e).getChildByName("flag_yuyue").visible = !1
              })
          }
          return t.prototype.onEnable = function(e) {
              var t = this;
              this.content0.vScrollBar.value = 0,
              this.content1.vScrollBar.value = 0,
              view.AudioMgr.PlayAudio(102),
              Laya.timer.once(e, this,
              function() {
                  t.me.visible = !0,
                  t.p1.visible = !1,
                  t.locking = !0,
                  t.in0 = !0,
                  t.title.text = game.Tools.strOfLocalization(2079),
                  t.p0.alpha = 1,
                  t.p1.alpha = 1,
                  t.title.alpha = 1,
                  s.Inst.me.YBin.play(0, !1),
                  t.p0.visible = !1,
                  Laya.timer.once(100, t,
                  function() {
                      t.p0.visible = !0,
                      s.Inst.me.YB2in.play(0, !1)
                  }),
                  Laya.timer.once(300, t,
                  function() {
                      t.locking = !1,
                      t.reset()
                  })
              });
              for (var i = 0; i < 2; i++) this.p1.getChildByName("content").getChildByName("btn" + i).getChildByName("count").text = "--";
              Laya.timer.loop(1e3, this, this._fetchPlayerCount)
          },
          t.prototype.reset = function() {
              for (e = 0; e < 4; e++) this.p0.getChildByName("content").getChildByName("btn" + e).alpha = 1;
              for (var e = 0; e < 2; e++) this.p1.getChildByName("content").getChildByName("btn" + e).alpha = 1
          },
          t.prototype.onDisable = function(e) {
              var t = this;
              this.locking = !0,
              Laya.timer.once(e, this,
              function() {
                  s.Inst.me.YBout.play(0, !1),
                  s.Inst.me.YB1out.play(0, !1),
                  s.Inst.me.YB2out.play(0, !1)
              }),
              Laya.timer.once(e + 200, this,
              function() {
                  t.me.visible = !1,
                  t.locking = !1,
                  t.reset(),
                  Laya.timer.clearAll(t)
              })
          },
          t.prototype.onShow0 = function() {
              var e = [];
              cfg.desktop.matchmode.forEach(function(t, i) {
                  if (t.can_sumup) {
                      for (var n = !1,
                      a = 0; a < e.length; a++) if (e[a].room == t.room) {
                          n = !0;
                          break
                      }
                      n || e.push({
                          room: t.room,
                          title: t.room_name
                      })
                  }
              }),
              this.list_room = e
          },
          t.prototype.onShow1 = function() {
              var t = this;
              this.content1.vScrollBar.value = 0;
              var i = [];
              cfg.desktop.matchmode.forEach(function(e, n) {
                  0 != e.mode && t.current_choose_room == e.room && i.push({
                      mode: e.mode,
                      id: e.id
                  })
              }),
              this.list_mode = i,
              this._last_fetch_time = 0,
              this._last_fetch_success = !0,
              this._fetchPlayerCount();
              for (var n = 0; n < i.length; n++) this.p1.getChildByName("content").getChildByName("btn" + n).getChildByName("flag_yuyue").visible = e.UI_PiPeiYuYue.Inst.matchYuYued(i[n].id)
          },
          t.prototype.toShow0 = function() {
              var e = this;
              this.locking = !0,
              this.title.text = game.Tools.strOfLocalization(2079),
              this.in0 = !0,
              s.Inst.me.YB1out.play(0, !1),
              Laya.timer.once(100, this,
              function() {
                  view.AudioMgr.PlayAudio(102),
                  e.p0.visible = !0,
                  e.p1.visible = !1,
                  e.p1.alpha = 1,
                  e.p0.alpha = 1,
                  s.Inst.me.YB2in.play(0, !1),
                  e.onShow0(),
                  e.locking = !1,
                  Laya.timer.once(200, e,
                  function() {
                      e.reset()
                  })
              })
          },
          t.prototype.toShow1 = function(e) {
              var t = this;
              this.locking = !0,
              this.current_choose_room = this.list_room[e].room,
              this.title.text = this.list_room[e].title,
              this.in0 = !1,
              s.Inst.me.YB2out.play(0, !1),
              Laya.timer.once(100, this,
              function() {
                  view.AudioMgr.PlayAudio(102),
                  t.p1.visible = !0,
                  t.p0.visible = !1,
                  t.p1.alpha = 1,
                  t.p0.alpha = 1,
                  s.Inst.me.YB1in.play(0, !1),
                  t.onShow1(),
                  t.locking = !1,
                  Laya.timer.once(200, t,
                  function() {
                      t.reset()
                  })
              })
          },
          t.prototype._fetchPlayerCount = function() {
              var t = this;
              if (game.LobbyNetMgr.Inst.isOK && !this.in0 && this._last_fetch_success && !(Laya.timer.currTimer < this._last_fetch_time + 7e3)) {
                  this._last_fetch_time = Laya.timer.currTimer;
                  for (var i = [], n = 0; n < this.list_mode.length; n++) i.push(this.list_mode[n].id);
                  this._last_fetch_success = !1,
                  app.NetAgent.sendReq2Lobby("Lobby", "fetchCurrentMatchInfo", {
                      mode_list: i
                  },
                  function(i, n) {
                      if (i || n.error) {
                          e.UIMgr.Inst.showNetReqError("fetchCurrentMatchInfo", i, n);
                          for (a = 0; a < 2; a++) t.p1.getChildByName("content").getChildByName("btn" + a).getChildByName("count").text = "--";
                          t._last_fetch_success = !1
                      } else try {
                          app.Log.log(JSON.stringify(n));
                          for (var a = 0; a < n.matches.length; a++) {
                              for (var r = n.matches[a].mode_id, o = n.matches[a].playing_count, s = -1, h = 0; h < t.list_mode.length; h++) if (t.list_mode[h].id == r) {
                                  s = h;
                                  break
                              } - 1 != s && (t.p1.getChildByName("content").getChildByName("btn" + s).getChildByName("count").text = o.toString())
                          }
                          t._last_fetch_success = !0
                      } catch(i) {}
                  })
              }
          },
          t
      } (),
      a = function() {
          function t(t) {
              var i = this;
              this.me = t,
              this.btn_back = t.getChildByName("title").getChildByName("btn_back"),
              this.btn_back.clickHandler = Laya.Handler.create(this,
              function() {
                  s.Inst.setPage(0)
              },
              null, !1),
              this.btn_create_room = t.getChildByName("content").getChildByName("btn0").getChildByName("btn"),
              t.getChildByName("content").getChildByName("btn0").getChildByName("btn_tips").clickHandler = Laya.Handler.create(this,
              function() {
                  e.UI_InfoLite.Inst.show(game.Tools.strOfLocalization(8)),
                  GameMgr.Inst.BehavioralStatistics(10)
              },
              null, !1),
              this.btn_add_room = t.getChildByName("content").getChildByName("btn1").getChildByName("btn"),
              t.getChildByName("content").getChildByName("btn1").getChildByName("btn_tips").clickHandler = Laya.Handler.create(this,
              function() {
                  e.UI_InfoLite.Inst.show(game.Tools.strOfLocalization(9))
              },
              null, !1),
              this.btn_create_room.clickHandler = Laya.Handler.create(this,
              function() {
                  s.Inst.locking || (e.UI_PiPeiYuYue.Inst.enable ? e.UI_Popout.PopOutNoTitle(game.Tools.strOfLocalization(204), null) : s.Inst.Hide(Laya.Handler.create(i,
                  function() {
                      e.UI_Create_Room.Show()
                  })))
              },
              null, !1),
              this.btn_add_room.clickHandler = Laya.Handler.create(this,
              function() {
                  e.UI_PiPeiYuYue.Inst.enable ? e.UI_Popout.PopOutNoTitle(game.Tools.strOfLocalization(204), null) : (e.UI_NumberInput.Inst.show(game.Tools.strOfLocalization(2080), Laya.Handler.create(i,
                  function(t) {
                      app.NetAgent.sendReq2Lobby("Lobby", "joinRoom", {
                          room_id: t
                      },
                      function(t, i) {
                          t || i.error ? e.UIMgr.Inst.showNetReqError("joinRoom", t, i) : (s.Inst.enable = !1, e.UI_WaitingRoom.Inst.updateData(i.room), e.UIMgr.Inst.ShowWaitingRoom())
                      })
                  }), null), GameMgr.Inst.BehavioralStatistics(11))
              },
              null, !1)
          }
          return t.prototype.onEnable = function(e) {
              var t = this;
              Laya.timer.once(e, this,
              function() {
                  view.AudioMgr.PlayAudio(102),
                  t.me.visible = !0,
                  s.Inst.me.YRin.play(0, !1),
                  t.btn_create_room.visible = !1,
                  t.btn_add_room.visible = !1,
                  t.reset(),
                  t.btn_create_room.visible = !0,
                  t.btn_add_room.visible = !0,
                  s.Inst.me.YR1in.play(0, !1)
              })
          },
          t.prototype.reset = function() {
              this.btn_add_room.alpha = 1,
              this.btn_create_room.alpha = 1,
              this.me.getChildByName("title").alpha = 1
          },
          t.prototype.onDisable = function(e) {
              var t = this;
              s.Inst.me.YRout.play(0, !1),
              s.Inst.me.YR1out.play(0, !1),
              Laya.timer.once(200, this,
              function() {
                  t.me.visible = !1
              })
          },
          t
      } (),
      r = function() {
          function t(t) {
              var i = this;
              this.btns = [],
              this.me = t,
              this.btn_back = t.getChildByName("title").getChildByName("btn_back"),
              this.btn_back.clickHandler = Laya.Handler.create(this,
              function() {
                  s.Inst.setPage(0)
              },
              null, !1),
              this.content = t.getChildByName("content");
              for (var n = function(t) {
                  var n = a.content.getChildByName("btn" + t);
                  a.btns.push(n),
                  n.getChildByName("container").getChildByName("btn").clickHandler = Laya.Handler.create(a,
                  function() {
                      s.Inst.locking || (e.UI_PiPeiYuYue.Inst.enable ? e.UI_Popout.PopOutNoTitle(game.Tools.strOfLocalization(204), null) : 0 == t && s.Inst.Hide(Laya.Handler.create(i,
                      function() {
                          e.UI_Match_Lobby.Inst.show()
                      })))
                  },
                  null, !1),
                  n.getChildByName("container").getChildByName("btn_tips").clickHandler = Laya.Handler.create(a,
                  function() {
                      s.Inst.locking || e.UI_InfoLite.Inst.show(game.Tools.strOfLocalization(56))
                  },
                  null, !1)
              },
              a = this, r = 0; r < 1; r++) n(r)
          }
          return t.prototype.onEnable = function(e) {
              var t = this;
              Laya.timer.once(e, this,
              function() {
                  view.AudioMgr.PlayAudio(102),
                  t.me.visible = !0,
                  t.reset(),
                  s.Inst.me.BSin.play(0, !1),
                  s.Inst.me.BS1in.play(0, !1)
              })
          },
          t.prototype.reset = function() {
              for (var e = 0; e < this.btns.length; e++) this.btns[e].visible = !0,
              this.btns[e].alpha = 1;
              this.me.getChildByName("title").alpha = 1
          },
          t.prototype.onDisable = function(e) {
              var t = this;
              s.Inst.me.BSout.play(0, !1),
              s.Inst.me.BS1out.play(0, !1),
              Laya.timer.once(200, this,
              function() {
                  t.me.visible = !1
              })
          },
          t
      } (),
      o = function() {
          function t(t) {
              var i = this;
              this.me = t;
              for (var n = function(n) {
                  t.getChildAt(n).clickHandler = Laya.Handler.create(a,
                  function() {
                      s.Inst.locking || (0 == n ? s.Inst.Hide(Laya.Handler.create(i,
                      function() {
                          e.UI_Sushe.Inst.show()
                      })) : 5 == n ? s.Inst.Hide(Laya.Handler.create(i,
                      function() {
                          e.UI_Shop.Inst.show()
                      })) : 3 == n ? s.Inst.Hide(Laya.Handler.create(i,
                      function() {
                          e.UI_PaiPu.Inst.show()
                      })) : 1 == n ? s.Inst.Hide(Laya.Handler.create(i,
                      function() {
                          e.UI_Friend.Inst.show()
                      })) : 2 == n ? s.Inst.Hide(Laya.Handler.create(i,
                      function() {
                          e.UI_Ob.Inst.show()
                      })) : 4 == n ? s.Inst.Hide(Laya.Handler.create(i,
                      function() {
                          e.UI_Bag.Inst.show()
                      })) : 6 == n && s.Inst.Hide(Laya.Handler.create(i,
                      function() {
                          e.UI_Treasure.Inst.show()
                      })))
                  },
                  null, !1)
              },
              a = this, r = 0; r < 7; r++) n(r)
          }
          return t.prototype.onEnable = function() {
              this.me.getChildAt(1).getChildByName("redpoint").visible = game.FriendMgr.friendapply_list && game.FriendMgr.friendapply_list.length > 0
          },
          t
      } (),
      s = function(s) {
          function h() {
              var e = s.call(this, new ui.lobby.lobbyUI) || this;
              return e.top = null,
              e.page0 = null,
              e.page1 = null,
              e.page2 = null,
              e.page3 = null,
              e.btns = null,
              e.chat_id = 0,
              e.container_chat = null,
              e.chat_block = null,
              e.character_skin = null,
              e.nowpage = 0,
              e.locking = !1,
              e.sound_channel = null,
              h.Inst = e,
              e
          }
          return __extends(h, s),
          h.prototype.onCreate = function() {
              var s = this;
              this.top = new t(this.me.getChildByName("container_top")),
              this.page0 = new i(this.me.getChildByName("page0")),
              this.page1 = new n(this.me.getChildByName("page1")),
              this.page2 = new a(this.me.getChildByName("page2")),
              this.page3 = new r(this.me.getChildByName("page3")),
              this.btns = new o(this.me.getChildByName("container_btns")),
              this.character_skin = new e.UI_Character_Skin(this.me.getChildByName("illust").getChildByName("illust")),
              this.container_chat = this.me.getChildByName("illust").getChildByName("chat"),
              this.container_chat.visible = !1,
              this.chat_block = new e.UI_Character_Chat(this.container_chat),
              this.me.getChildByName("illust").getChildByName("btn").clickHandler = Laya.Handler.create(this,
              function() {
                  h.login_helloed && (s.sound_channel ? s.stopsay() : s.say("lobby_normal"))
              },
              null, !1)
          },
          h.prototype.onEnable = function() {
              this.showEnter(),
              e.UI_TanfangRoot.Inst.beginload(),
              e.UI_Invite.Inst.enable = !0
          },
          h.prototype.onDisable = function() {
              this.page0.onDisable(0),
              this.page1.onDisable(0),
              this.page2.onDisable(0),
              this.page3.onDisable(0),
              this.character_skin.clear(),
              this.stopsay()
          },
          h.prototype.showEnter = function() {
              var e = this;
              this.refreshInfo(),
              this.page0.me.visible = !0,
              this.page1.me.visible = !1,
              this.page2.me.visible = !1,
              this.page3.me.visible = !1,
              this.nowpage = 0,
              this.locking = !0,
              this.me. in .play(0, !1),
              this.page0.onEnable(567),
              this.btns.onEnable(),
              Laya.timer.once(700, this,
              function() {
                  e.locking = !1
              }),
              game.Scene_Lobby.Inst.change_bg("yard", !1),
              h.login_helloed || Laya.timer.once(500, this,
              function() {
                  h.login_helloed = !0,
                  e.say("lobby_playerlogin")
              })
          },
          h.prototype.refreshInfo = function() {
              GameMgr.Inst.account_data;
              this.top.refresh(),
              //打完之后刷新用户数据，重新赋值为寮舍选择人物 -----fxxk
              GameMgr.Inst.account_data.avatar_id = GameMgr.Inst.account_data.my_character.skin,
              //end
              this.character_skin.setSkin(GameMgr.Inst.account_data.avatar_id, "full"),
              this.character_skin.me.visible = !0
          },
          h.prototype.getContainer = function(e) {
              switch (e) {
              case 0:
                  return this.page0.me;
              case 1:
                  return this.page1.me;
              case 2:
                  return this.page2.me
              }
              return null
          },
          h.prototype.Hide = function(e) {
              var t = this;
              this.locking = !0;
              this.getContainer(this.nowpage);
              switch (this.nowpage) {
              case 0:
                  this.page0.onDisable(0);
                  break;
              case 1:
                  this.page1.onDisable(0);
                  break;
              case 2:
                  this.page2.onDisable(0);
                  break;
              case 3:
                  this.page3.onDisable(0)
              }
              this.me.out.play(0, !1),
              Laya.timer.once(250, this,
              function() {
                  t.locking = !1,
                  t.enable = !1,
                  e && e.run()
              })
          },
          h.prototype.setPage = function(e) {
              var t = this;
              if (!this.locking && this.nowpage != e) {
                  switch (this.locking = !0, this.nowpage) {
                  case 0:
                      this.page0.onDisable(0);
                      break;
                  case 1:
                      this.page1.onDisable(0);
                      break;
                  case 2:
                      this.page2.onDisable(0);
                      break;
                  case 3:
                      this.page3.onDisable(0)
                  }
                  this.nowpage = e;
                  var i = 750;
                  switch (this.nowpage) {
                  case 0:
                      this.page0.onEnable(200);
                      break;
                  case 1:
                      this.page1.onEnable(200);
                      break;
                  case 2:
                      this.page2.onEnable(200);
                      break;
                  case 3:
                      this.page3.onEnable(200),
                      i = 500
                  }
                  Laya.timer.once(i, this,
                  function() {
                      t.locking = !1
                  })
              }
          },
          h.prototype.say = function(t) {
              var i = this,
              n = e.UI_Sushe.main_chara_info;
              this.chat_id++;
              var a = this.chat_id,
              r = view.AudioMgr.PlayCharactorSound(n, t, Laya.Handler.create(this,
              function() {
                  Laya.timer.once(1e3, i,
                  function() {
                      i.chat_id == a && i.stopsay()
                  })
              }));
              r && (this.chat_block.show(r.words), this.sound_channel = r.sound)
          },
          h.prototype.stopsay = function() {
              this.chat_block.close(!1),
              this.sound_channel && (this.sound_channel.stop(), Laya.SoundManager.removeChannel(this.sound_channel), this.sound_channel = null)
          },
          h.Inst = null,
          h.login_helloed = !1,
          h
      } (e.UIBase);
      e.UI_Lobby = s
    } (uiscript || (uiscript = {}));
    
    !function(e) {
      var t = function(t) {
          function i() {
              var e = t.call(this, new ui.lobby.nicknameUI) || this;
              return e.locking = !1,
              e.btn_cd = 0,
              e
          }
          return __extends(i, t),
          i.show = function() {
              var t = new i;
              e.UIMgr.Inst.AddLobbyUI(t),
              Laya.timer.frameOnce(5, this,
              function() {
                  t.show()
              })
          },
          i.prototype.onCreate = function() {
              var t = this;
              this.root = this.me.getChildByName("root"),
              this.lb = this.root.getChildByName("lb"),
              this.input = this.root.getChildByName("txtinput"),
              this.yes = this.root.getChildByName("yes"),
              this.no = this.root.getChildByName("no"),
              this.btn_confirm = this.root.getChildByName("btn_confirm"),
              this.btn_confirm.clickHandler = Laya.Handler.create(this, this.onBtnConfrim, null, !1),
              this.input.on("focus", this,
              function() {
                  t.lb.visible = !1,
                  t.yes.visible = !1,
                  t.no.visible = !1
              }),
              this.input.on("blur", this,
              function() {
                  t.lb.visible = !t.input.text || "" == t.input.text
              }),
              this.input.on("input", this,
              function() {
                  if (t.input.text && "" != t.input.text) {
                      for (var e = t.input.text,
                      i = 0,
                      n = 0,
                      a = 0; a < e.length; a++) {
                          if (e.charCodeAt(a) > 255) {
                              if (i + 2 > 16) break;
                              i += 2
                          } else {
                              if (i + 1 > 16) break;
                              i += 1
                          }
                          n++
                      }
                      n != e.length && (t.input.text = e.substr(0, n))
                  }
              }),
              this.root_xinshou = this.me.getChildByName("root_xinshou"),
              this.root_xinshou.getChildByName("btn_no").clickHandler = Laya.Handler.create(this,
              function() {
                  t.locking || t.close_course()
              },
              null, !1),
              this.root_xinshou.getChildByName("btn_yes").clickHandler = Laya.Handler.create(this,
              function() {
                  t.locking || (t.enable = !1, e.UI_Rules.Inst.show(1, Laya.Handler.create(t,
                  function() {
                      t.destroy(),
                      game.Scene_Lobby.Inst.pending_enter_event()
                  })))
              },
              null, !1)
          },
          i.prototype.show = function() {
              var t = this;
              this.enable = !0,
              this.locking = !0,
              this.yes.visible = !1,
              this.no.visible = !1,
              this.root_xinshou.visible = !1,
              e.UIBase.anim_pop_out(this.root, Laya.Handler.create(this,
              function() {
                  t.locking = !1
              }))
          },
          i.prototype.close_nickname = function() {
              var t = this;
              this.locking = !0,
              e.UIBase.anim_pop_hide(this.root, Laya.Handler.create(this,
              function() {
                  t.locking = !1,
                  t.root.visible = !1,
                  t.show_course()
              }))
          },
          i.prototype.show_course = function() {
              var t = this;
              this.root_xinshou.visible = !0,
              this.root_xinshou.getChildByName("name").text = this.input.text + " " + game.Tools.strOfLocalization(2150),
              this.locking = !0,
              e.UIBase.anim_pop_out(this.root_xinshou, Laya.Handler.create(this,
              function() {
                  t.locking = !1
              }))
          },
          i.prototype.close_course = function() {
              var t = this;
              this.locking = !0,
              e.UIBase.anim_pop_hide(this.root_xinshou, Laya.Handler.create(this,
              function() {
                  t.locking = !1,
                  t.enable = !1,
                  t.destroy(),
                  game.Scene_Lobby.Inst.pending_enter_event()
              }))
          },
          i.prototype.onBtnConfrim = function() {
              var t = this;
              if (!this.locking && "" != this.input.text) {
                  var i = this.input.text;
                  if (e.UI_Entrance.Accountforbidden(i)) this.no.visible = !0;
                  else if (! (Laya.timer.currTimer < this.btn_cd)) {
                      this.btn_cd = Laya.timer.currTimer + 700,
                      app.NetAgent.sendReq2Lobby("Lobby", "modifyNickname", {
                          nickname: i
                      },
                      function(n, a) {
                          t.btn_cd = 0,
                          n || a.error ? e.UIMgr.Inst.showNetReqError("modifyNickname", n, a) : (GameMgr.Inst.account_data.nickname = i, GameMgr.Inst.fetch_login_info(), GameMgr.Inst.account_setting[game.EAccountSetKey.user_xieyi.toString()] = 1, t.close_nickname())
                      }),
                      app.NetAgent.sendReq2Lobby("Lobby", "updateAccountSettings", {
                          setting: {
                              key: game.EAccountSetKey.user_xieyi,
                              value: 1
                          }
                      },
                      function(e, t) {});
                      var n = e.UI_Sushe.characters,
                      a = Math.floor(Math.random() * n.length);
                      e.UI_Sushe.main_character_id = e.UI_Sushe.characters[a].charid,
                      //屏蔽切换角色的网络请求（不知道这是怎么触发的，反正屏蔽就对了） ----fxxk
                      // app.NetAgent.sendReq2Lobby("Lobby", "changeMainCharacter", {
                      //     character_id: e.UI_Sushe.main_character_id
                      // },
                      // function(e, t) {}),
                      //end
                      GameMgr.Inst.account_data.avatar_id = e.UI_Sushe.characters[a].skin
                  }
              }
          },
          i
      } (e.UIBase);
      e.UI_Nickname = t
    } (uiscript || (uiscript = {}));
    
    !function(e) {
      var t = function(t) {
          function i() {
              var e = t.call(this, new ui.both_ui.otherplayerinfoUI) || this;
              return e.account_id = 0,
              e.origin_x = 0,
              e.origin_y = 0,
              e.root = null,
              e.title = null,
              e.level = null,
              e.btn_addfriend = null,
              e.illust = null,
              e.label_name = null,
              e.detail_data = null,
              e.locking = !1,
              e.tab_info4 = null,
              e.tab_info3 = null,
              e.tab_note = null,
              i.Inst = e,
              e
          }
          return __extends(i, t),
          i.prototype.onCreate = function() {
              var t = this;
              this.root = this.me.getChildByName("root"),
              this.origin_x = this.root.x,
              this.origin_y = this.root.y,
              this.container_info = this.root.getChildByName("container_info"),
              this.title = new e.UI_PlayerTitle(this.container_info.getChildByName("title")),
              this.label_name = this.container_info.getChildByName("ID"),
              this.level = new e.UI_Level(this.container_info.getChildByName("rank")),
              this.detail_data = new e.UI_PlayerData(this.container_info.getChildByName("data")),
              this.illust = new e.UI_Character_Skin(this.root.getChildByName("illust").getChildByName("illust")),
              this.btn_addfriend = this.container_info.getChildByName("btn_add"),
              this.btn_addfriend.clickHandler = Laya.Handler.create(this,
              function() {
                  t.btn_addfriend.visible = !1,
                  app.NetAgent.sendReq2Lobby("Lobby", "applyFriend", {
                      target_id: t.account_id
                  },
                  function(e, t) {})
              },
              null, !1),
              this.root.getChildByName("btn_close").clickHandler = Laya.Handler.create(this,
              function() {
                  t.close()
              },
              null, !1),
              this.note = new e.UI_PlayerNote(this.root.getChildByName("container_note"), null),
              this.tab_info4 = this.root.getChildByName("tab_info4"),
              this.tab_info4.clickHandler = Laya.Handler.create(this,
              function() {
                  t.locking || (t.container_info.visible = !0, t.tab_info4.skin = "myres/bothui/info_tab_chosen.png", t.tab_info3.skin = "myres/bothui/info_tab_dark.png", t.tab_note.skin = "myres/bothui/info_tab_dark.png", t.note.close(), t.detail_data.changeMJCategory(1))
              },
              null, !1),
              this.tab_info3 = this.root.getChildByName("tab_info3"),
              this.tab_info3.clickHandler = Laya.Handler.create(this,
              function() {
                  t.locking || (t.container_info.visible = !0, t.tab_info4.skin = "myres/bothui/info_tab_dark.png", t.tab_info3.skin = "myres/bothui/info_tab_chosen.png", t.tab_note.skin = "myres/bothui/info_tab_dark.png", t.note.close(), t.detail_data.changeMJCategory(2))
              },
              null, !1),
              this.tab_note = this.root.getChildByName("tab_note"),
              this.tab_note.clickHandler = Laya.Handler.create(this,
              function() {
                  t.locking || t.container_info.visible && (t.container_info.visible = !1, t.tab_info4.skin = "myres/bothui/info_tab_dark.png", t.tab_info3.skin = "myres/bothui/info_tab_dark.png", t.tab_note.skin = "myres/bothui/info_tab_chosen.png", t.note.show())
              },
              null, !1),
              this.locking = !1
          },
          i.prototype.show = function(t) {
              var i = this;
              GameMgr.Inst.BehavioralStatistics(14),
              this.account_id = t,
              this.enable = !0,
              this.locking = !0,
              this.root.y = 560,
              e.UIBase.anim_pop_out(this.root, Laya.Handler.create(this,
              function() {
                  i.locking = !1
              })),
              this.detail_data.reset(),
              app.NetAgent.sendReq2Lobby("Lobby", "fetchAccountStatisticInfo", {
                  account_id: t
              },
              function(t, n) {
                  t || n.error ? e.UIMgr.Inst.showNetReqError("fetchAccountStatisticInfo", t, n) : (app.Log.log(JSON.stringify(n)), i.detail_data.setData(n))
              }),
              this.tab_info4.skin = "myres/bothui/info_tab_chosen.png",
              this.tab_info3.skin = "myres/bothui/info_tab_dark.png",
              this.tab_note.skin = "myres/bothui/info_tab_dark.png",
              this.container_info.visible = !0,
              this.note.close(),
              this.note.init_data(t),
              this.refreshBaseInfo()
          },
          i.prototype.refreshBaseInfo = function() {
              var t = this;
              this.level.id = 0,
              this.title.id = 0,
              this.illust.me.visible = !1,
              this.label_name.text = "",
              this.btn_addfriend.visible = !1,
              app.NetAgent.sendReq2Lobby("Lobby", "fetchAccountInfo", {
                  account_id: this.account_id
              },
              function(i, n) {
                  if (i || n.error) e.UIMgr.Inst.showNetReqError("fetchAccountInfo", i, n);
                  else {
                      var a = n.account;
                      //修复读取战绩信息时人物皮肤不一致问题 ----fxxk
                      if(a.account_id == GameMgr.Inst.account_id) {
                          a.avatar_id = GameMgr.Inst.account_data.my_character.skin;
                      }
                      //end
                      t.label_name.text = a.nickname,
                      t.title.id = a.title,
                      t.level.id = a.level.id,
                      t.level.exp = a.level.score,
                      t.illust.me.visible = !0,
                      t.illust.setSkin(a.avatar_id, "waitingroom"),
                      t.account_id == GameMgr.Inst.account_id || null != game.FriendMgr.find(t.account_id) ? t.btn_addfriend.visible = !1 : t.btn_addfriend.visible = !0,
                      t.note.sign.setSign(a.signature)
                  }
              })
          },
          i.prototype.close = function() {
              var t = this;
              this.enable && (this.locking || (this.locking = !0, this.detail_data.close(), e.UIBase.anim_pop_hide(this.root, Laya.Handler.create(this,
              function() {
                  t.locking = !1,
                  t.enable = !1
              }))))
          },
          i.prototype.onDisable = function() {
              this.detail_data.close(),
              this.illust.clear(),
              Laya.loader.clearTextureRes(this.level.icon.skin)
          },
          i.Inst = null,
          i
      } (e.UIBase);
      e.UI_OtherPlayerInfo = t
    } (uiscript || (uiscript = {}));
    
    !function(e) {
      var t = function() {
          function t(e, t) {
              var i = this;
              this.scale = 1,
              this.during_move = !1,
              this.mouse_start_x = 0,
              this.mouse_start_y = 0,
              this.me = e,
              this.container_illust = t,
              this.illust = this.container_illust.getChildByName("illust"),
              this.container_move = e.getChildByName("move"),
              this.container_move.on("mousedown", this,
              function() {
                  i.during_move = !0,
                  i.mouse_start_x = i.container_move.mouseX,
                  i.mouse_start_y = i.container_move.mouseY
              }),
              this.container_move.on("mousemove", this,
              function() {
                  i.during_move && (i.move(i.container_move.mouseX - i.mouse_start_x, i.container_move.mouseY - i.mouse_start_y), i.mouse_start_x = i.container_move.mouseX, i.mouse_start_y = i.container_move.mouseY)
              }),
              this.container_move.on("mouseup", this,
              function() {
                  i.during_move = !1
              }),
              this.container_move.on("mouseout", this,
              function() {
                  i.during_move = !1
              }),
              this.btn_big = e.getChildByName("btn_big"),
              this.btn_big.clickHandler = Laya.Handler.create(this,
              function() {
                  i.locking || i.bigger()
              },
              null, !1),
              this.btn_small = e.getChildByName("btn_small"),
              this.btn_small.clickHandler = Laya.Handler.create(this,
              function() {
                  i.locking || i.smaller()
              },
              null, !1),
              this.btn_close = e.getChildByName("btn_close"),
              this.btn_close.clickHandler = Laya.Handler.create(this,
              function() {
                  i.locking || i.close()
              },
              null, !1)
          }
          return t.prototype.show = function(t) {
              var n = this;
              this.locking = !0,
              this.when_close = t,
              this.illust_start_x = this.illust.x,
              this.illust_start_y = this.illust.y,
              this.illust_center_x = this.illust.x + 984 - 446,
              this.illust_center_y = this.illust.y + 11 - 84,
              this.container_illust.getChildByName("container_name").visible = !1,
              this.container_illust.getChildByName("btn").visible = !1,
              i.Inst.stopsay(),
              this.scale = 1,
              Laya.Tween.to(this.illust, {
                  x: this.illust_center_x,
                  y: this.illust_center_y
              },
              200),
              e.UIBase.anim_pop_out(this.btn_big, null),
              e.UIBase.anim_pop_out(this.btn_small, null),
              e.UIBase.anim_pop_out(this.btn_close, null),
              this.during_move = !1,
              Laya.timer.once(250, this,
              function() {
                  n.locking = !1
              }),
              this.me.visible = !0
          },
          t.prototype.close = function() {
              var t = this;
              this.locking = !0,
              this.container_illust.getChildByName("container_name").visible = !0,
              this.container_illust.getChildByName("btn").visible = !0,
              Laya.Tween.to(this.illust, {
                  x: this.illust_start_x,
                  y: this.illust_start_y,
                  scaleX: 1,
                  scaleY: 1
              },
              200),
              e.UIBase.anim_pop_hide(this.btn_big, null),
              e.UIBase.anim_pop_hide(this.btn_small, null),
              e.UIBase.anim_pop_hide(this.btn_close, null),
              Laya.timer.once(250, this,
              function() {
                  t.locking = !1,
                  t.me.visible = !1,
                  t.when_close.run()
              })
          },
          t.prototype.bigger = function() {
              1.1 * this.scale > 1.5 || (this.scale *= 1.1, Laya.Tween.to(this.illust, {
                  scaleX: this.scale,
                  scaleY: this.scale
              },
              100, null, null, 0, !0, !0))
          },
          t.prototype.smaller = function() {
              this.scale / 1.1 < .5 || (this.scale /= 1.1, Laya.Tween.to(this.illust, {
                  scaleX: this.scale,
                  scaleY: this.scale
              },
              100, null, null, 0, !0, !0))
          },
          t.prototype.move = function(e, t) {
              var i = this.illust.x + e,
              n = this.illust.y + t;
              i < this.illust_center_x - 600 ? i = this.illust_center_x - 600 : i > this.illust_center_x + 600 && (i = this.illust_center_x + 600),
              n < this.illust_center_y - 1200 ? n = this.illust_center_y - 1200 : n > this.illust_center_y + 800 && (n = this.illust_center_y + 800),
              this.illust.x = i,
              this.illust.y = n
          },
          t
      } (),
      i = function(i) {
          function n() {
              var e = i.call(this, new ui.lobby.susheUI) || this;
              return e.contianer_illust = null,
              e.illust = null,
              e.label_name = null,
              e.label_cv = null,
              e.container_page = null,
              e.container_look_illust = null,
              e.page_select_character = null,
              e.page_visit_character = null,
              e.origin_illust_x = 0,
              e.chat_id = 0,
              e.select_index = 0,
              e.container_chat = null,
              e.sound_channel = null,
              e.chat_block = null,
              n.Inst = e,
              e
          }
          return __extends(n, i),
          n.init = function(t) {
              var i = this;
              app.NetAgent.sendReq2Lobby("Lobby", "fetchCharacterInfo", {},
              function(n, a) {
                  if (n || a.error) e.UIMgr.Inst.showNetReqError("fetchCharacterInfo", n, a);
                  else {
                      if (app.Log.log("fetchCharacterInfo: " + JSON.stringify(a)), (a = JSON.parse(JSON.stringify(a))).main_character_id && a.characters) {
                          // if (i.characters = [], a.characters) for (r = 0; r < a.characters.length; r++) i.characters.push(a.characters[r]);
                          // if (i.skin_map = {},
                          // a.skins) for (var r = 0; r < a.skins.length; r++) i.skin_map[a.skins[r]] = 1;
                          // i.main_character_id = a.main_character_id
                          //人物初始化修改寮舍人物（皮肤好感额外表情）----fxxk
                          i.characters = [];
                          for(var j = 1; j <= 8; j++) {
                              var id = 200000 + j;
                              var skin = 400002 + j * 100;
                              i.characters.push({
                                  charid: id,
                                  level: 5,
                                  exp: 0,
                                  views: [{"slot":1, "item_id": 305003}, {"slot":2, "item_id": 305023}, {"slot":3, "item_id": 305022}, {"slot":4, "item_id": 305030}, {"slot":5, "item_id": 305025}],
                                  skin: skin,
                                  is_upgraded: 1,
                                  extra_emoji: ["10", "11", "12"]
                              });
                              i.skin_map[400001 + j * 100] = 1;
                          };
                          i.main_character_id = 200008,
                          GameMgr.Inst.account_data.my_charid = 200008,
                          GameMgr.Inst.account_data.my_character = i.characters[7]
                          //end
                      } else
                      i.characters = [],
                      i.characters.push({
                          charid: 200001,
                          level: 5,
                          exp: 0,
                          views: [{"slot":1, "item_id": 305003}, {"slot":2, "item_id": 305009}, {"slot":3, "item_id": 305010}, {"slot":4, "item_id": 305011}, {"slot":5, "item_id": 305025}],
                          skin: 400102,
                          is_upgraded: 1,
                          extra_emoji: ["10", "11", "12"]
                      }),
                      i.characters.push({
                          charid: 200002,
                          level: 5,
                          exp: 0,
                          views: [{"slot":1, "item_id": 305003}, {"slot":2, "item_id": 305009}, {"slot":3, "item_id": 305010}, {"slot":4, "item_id": 305011}, {"slot":5, "item_id": 305025}],
                          skin: 400202,
                          is_upgraded: 1,
                          extra_emoji: ["10", "11", "12"]
                      }),
                      i.skin_map[400101] = 1,
                      i.skin_map[400201] = 1,
                      i.send_gift_count = 0,
                      i.send_gift_limit = 0;
    
                      a.send_gift_count && (i.send_gift_count = a.send_gift_count),
                      a.send_gift_limit && (i.send_gift_limit = a.send_gift_limit),
                      t.run()
                  }
              })
          },
          n.on_data_updata = function(e) {
              if (e.character) {
                  var t = JSON.parse(JSON.stringify(e.character));
                  if (t.characters) for (var i = t.characters,
                  n = 0; n < i.length; n++) {
                      for (var a = !1,
                      r = 0; r < this.characters.length; r++) if (this.characters[r].charid == i[n].charid) {
                          this.characters[r] = i[n],
                          a = !0;
                          break
                      }
                      a || this.characters.push(i[n])
                  }
                  if (t.skins) for (var o = t.skins,
                  n = 0; n < o.length; n++) this.skin_map[o[n]] = 1
              }
          },
          n.chara_owned = function(e) {
              for (var t = 0; t < this.characters.length; t++) if (this.characters[t].charid == e) return ! 0;
              return ! 1
          },
          n.skin_owned = function(e) {
              return this.skin_map.hasOwnProperty(e.toString())
          },
          Object.defineProperty(n, "main_chara_info", {
              get: function() {
                  for (var e = 0; e < this.characters.length; e++) if (this.characters[e].charid == this.main_character_id) return this.characters[e];
                  return null
              },
              enumerable: !0,
              configurable: !0
          }),
          n.prototype.onCreate = function() {
              var i = this;
              this.contianer_illust = this.me.getChildByName("illust"),
              this.illust = new e.UI_Character_Skin(this.contianer_illust.getChildByName("illust").getChildByName("illust")),
              this.container_chat = this.contianer_illust.getChildByName("chat"),
              this.chat_block = new e.UI_Character_Chat(this.container_chat),
              this.contianer_illust.getChildByName("btn").clickHandler = Laya.Handler.create(this,
              function() {
                  i.page_visit_character.me.visible && i.page_visit_character.cannot_click_say || (i.sound_channel ? i.stopsay() : i.say("lobby_normal"))
              },
              null, !1),
              this.label_name = this.contianer_illust.getChildByName("container_name").getChildByName("label_name"),
              this.label_cv = this.contianer_illust.getChildByName("container_name").getChildByName("label_CV"),
              this.origin_illust_x = this.contianer_illust.x,
              this.container_page = this.me.getChildByName("container_page"),
              this.page_select_character = new e.UI_Sushe_Select,
              this.container_page.addChild(this.page_select_character.me),
              this.page_visit_character = new e.UI_Sushe_Visit,
              this.container_page.addChild(this.page_visit_character.me),
              this.container_look_illust = new t(this.me.getChildByName("look_illust"), this.contianer_illust)
          },
          n.prototype.show = function() {
              GameMgr.Inst.BehavioralStatistics(15),
              game.Scene_Lobby.Inst.change_bg("indoor", !1),
              this.enable = !0,
              this.page_visit_character.me.visible = !1;
              for (var e = 0,
              t = 0; t < n.characters.length; t++) if (n.characters[t].charid == n.main_character_id) {
                  e = t;
                  break
              }
              this.change_select(e),
              this.show_page_select(),
              this.container_look_illust.me.visible = !1
          },
          n.prototype.starup_back = function() {
              this.enable = !0,
              this.change_select(this.select_index),
              this.show_page_visit(!0)
          },
          n.prototype.go2Lobby = function() {
              this.close(Laya.Handler.create(this,
              function() {
                  e.UIMgr.Inst.showLobby()
              }))
          },
          n.prototype.close = function(t) {
              var i = this;
              e.UIBase.anim_alpha_out(this.contianer_illust, {
                  x: -30
              },
              150, 0),
              Laya.timer.once(150, this,
              function() {
                  i.enable = !1,
                  t.run()
              })
          },
          n.prototype.onDisable = function() {
              this.illust.clear(),
              this.stopsay(),
              this.container_look_illust.me.visible && this.container_look_illust.close()
          },
          n.prototype.show_page_select = function() {
              this.page_select_character.show(this.select_index)
          },
          n.prototype.show_page_visit = function(e) {
              this.page_visit_character.show(n.characters[this.select_index], e)
          },
          n.prototype.change_select = function(t) {
              this.select_index = t,
              this.illust.clear();
              var i = n.characters[t];
              this.label_name.text = cfg.item_definition.character.get(i.charid).name,
              this.label_cv.text = "CV" + cfg.item_definition.character.get(i.charid).desc_cv,
              this.illust.setSkin(i.skin, "full"),
              Laya.Tween.clearAll(this.contianer_illust),
              this.contianer_illust.x = this.origin_illust_x,
              this.contianer_illust.alpha = 1,
              e.UIBase.anim_alpha_in(this.contianer_illust, {
                  x: -30
              },
              230),
              this.stopsay()
          },
          n.prototype.onChangeSkin = function(e) {
              n.characters[this.select_index].skin = e,
              this.change_select(this.select_index),
              n.characters[this.select_index].charid == n.main_character_id && (GameMgr.Inst.account_data.avatar_id = e);
              //屏蔽改变头像的网络请求 ----fxxk
              // app.NetAgent.sendReq2Lobby("Lobby", "changeCharacterSkin", {
              //     character_id: n.characters[this.select_index].charid,
              //     skin: e
              // },
              // function(e, t) {})
              //end
          },
          n.prototype.say = function(e) {
              var t = this,
              i = n.characters[this.select_index];
              this.chat_id++;
              var a = this.chat_id,
              r = view.AudioMgr.PlayCharactorSound(i, e, Laya.Handler.create(this,
              function() {
                  Laya.timer.once(1e3, t,
                  function() {
                      a == t.chat_id && t.stopsay()
                  })
              }));
              r && (this.chat_block.show(r.words), this.sound_channel = r.sound)
          },
          n.prototype.stopsay = function() {
              this.chat_block.close(!1),
              this.sound_channel && (this.sound_channel.stop(), Laya.SoundManager.removeChannel(this.sound_channel), this.sound_channel = null)
          },
          n.prototype.to_look_illust = function() {
              var e = this;
              this.container_look_illust.show(Laya.Handler.create(this,
              function() {
                  e.page_select_character.show(e.select_index)
              }))
          },
          n.characters = [],
          n.skin_map = {},
          n.main_character_id = 0,
          n.send_gift_count = 0,
          n.send_gift_limit = 0,
          n.Inst = null,
          n
      } (e.UIBase);
      e.UI_Sushe = i
    } (uiscript || (uiscript = {}));
    
    !function(e) {
      var t = function(t) {
          function i() {
              var e = t.call(this, new ui.lobby.sushe_selectUI) || this;
              return e.container_top = null,
              e.container_heads = null,
              e.scrollview = null,
              e.btn_visit = null,
              e.btn_look = null,
              e.select_index = 0,
              e.locking = !1,
              e
          }
          return __extends(i, t),
          i.prototype.onCreate = function() {
              var t = this;
              this.container_top = this.me.getChildByName("top"),
              this.container_heads = this.me.getChildByName("heads"),
              this.scrollview = this.container_heads.scriptMap["capsui.CScrollView"],
              this.scrollview.init_scrollview(new Laya.Handler(this, this.render_character_cell), -1, 3),
              this.btn_visit = this.me.getChildByName("heads").getChildByName("btn_visit"),
              this.btn_visit.clickHandler = Laya.Handler.create(this,
              function() {
                  t.locking || (t.close(), Laya.timer.once(150, t,
                  function() {
                      e.UI_Sushe.Inst.show_page_visit(!1)
                  }))
              },
              null, !1),
              this.btn_look = this.me.getChildByName("btn_look"),
              this.btn_look.clickHandler = Laya.Handler.create(this,
              function() {
                  t.locking || (t.close(), Laya.timer.once(150, t,
                  function() {
                      e.UI_Sushe.Inst.to_look_illust()
                  }))
              },
              null, !1),
              this.container_top.getChildByName("btn_back").clickHandler = Laya.Handler.create(this,
              function() {
                  t.locking || (t.close(), e.UI_Sushe.Inst.go2Lobby())
              },
              null, !1)
          },
          i.prototype.show = function(t) {
              var i = this;
              this.enable = !0,
              this.locking = !0,
              e.UIBase.anim_alpha_in(this.container_top, {
                  y: -30
              },
              200),
              e.UIBase.anim_alpha_in(this.container_heads, {
                  x: 30
              },
              200),
              e.UIBase.anim_alpha_in(this.btn_look, {
                  x: 30
              },
              200),
              Laya.timer.once(200, this,
              function() {
                  i.locking = !1
              }),
              this.select_index = t,
              this.scrollview.reset(),
              this.scrollview.addItem(e.UI_Sushe.characters.length)
          },
          i.prototype.close = function() {
              var t = this;
              this.locking = !0,
              e.UIBase.anim_alpha_out(this.container_top, {
                  y: -30
              },
              150),
              e.UIBase.anim_alpha_out(this.container_heads, {
                  x: 30
              },
              150, 0),
              e.UIBase.anim_alpha_out(this.btn_look, {
                  x: 30
              },
              150),
              Laya.timer.once(150, this,
              function() {
                  t.locking = !1,
                  t.enable = !1
              })
          },
          i.prototype.onDisable = function() {
              for (var t = 0; t < e.UI_Sushe.characters.length; t++) Laya.loader.clearTextureRes(cfg.item_definition.skin.get(e.UI_Sushe.characters[t].skin) + "/bighead.png")
          },
          i.prototype.render_character_cell = function(t) {
              var i = this,
              n = t.index,
              a = t.container,
              r = t.cache_data;
              r.index = n,
              r.inited || (r.inited = !0, a.getChildByName("btn").clickHandler = new Laya.Handler(this,
              function() {
                  i.onClickAtHead(r.index)
              }), r.skin = new e.UI_Character_Skin(a.getChildByName("btn").getChildByName("head")));
              var o = a.getChildByName("btn");
              o.getChildByName("choose").visible = n == this.select_index,
              r.skin.setSkin(e.UI_Sushe.characters[n].skin, "bighead"),
              o.getChildByName("using").visible = e.UI_Sushe.characters[n].charid == e.UI_Sushe.main_character_id,
              o.getChildByName("label_name").text = cfg.item_definition.character.find(e.UI_Sushe.characters[n].charid).name
          },
          i.prototype.onClickAtHead = function(t) {
              if (this.select_index == t) {
                  if (e.UI_Sushe.characters[t].charid != e.UI_Sushe.main_character_id) {
                      var i = e.UI_Sushe.main_character_id;
                      e.UI_Sushe.main_character_id = e.UI_Sushe.characters[t].charid,
                      //屏蔽改变宿舍角色的网络请求 ----fxxk
                      // app.NetAgent.sendReq2Lobby("Lobby", "changeMainCharacter", {
                      //     character_id: e.UI_Sushe.main_character_id
                      // },
                      // function(e, t) {}),
                      GameMgr.Inst.account_data.my_charid = e.UI_Sushe.main_character_id;
                      GameMgr.Inst.account_data.my_character = e.UI_Sushe.characters[t];
                      //end
                      GameMgr.Inst.account_data.avatar_id = e.UI_Sushe.characters[t].skin;
                      for (var n = 0; n < e.UI_Sushe.characters.length; n++) e.UI_Sushe.characters[n].charid == i && this.scrollview.wantToRefreshItem(n);
                      this.scrollview.wantToRefreshItem(t)
                  }
              } else {
                  var a = this.select_index;
                  this.select_index = t,
                  this.scrollview.wantToRefreshItem(a),
                  this.scrollview.wantToRefreshItem(t),
                  e.UI_Sushe.Inst.change_select(t)
              }
          },
          i
      } (e.UIBase);
      e.UI_Sushe_Select = t
    } (uiscript || (uiscript = {}));
    
    !function(e) {
      var t = function() {
          function e(e) {
              var t = this;
              this.speed = .001,
              this.hearts = [],
              this.heart_masks = [],
              this.exp_limits = [],
              this.preframe_time = 0,
              this.heart_count = 5,
              this.during_change = !1,
              this.btn_heart = null,
              this.label_val = null,
              this.is_upgraded = !1,
              this.val_show_starttime = -1,
              this.me = e,
              this.container_hearts = this.me.getChildByName("hearts");
              for (n = 0; n < 5; n++) {
                  var i = this.container_hearts.getChildByName("h" + n);
                  this.hearts.push(i),
                  this.heart_masks.push(i.getChildByName("v").mask)
              }
              this.bg_hearts = this.me.getChildByName("bg_hearts"),
              this.exp_limits = [];
              for (var n = 0; n < 5; n++) this.exp_limits.push(cfg.level_definition.character.find(n + 1).exp);
              this.btn_heart = this.me.getChildByName("btn_heart"),
              this.label_val = this.container_hearts.getChildByName("heartval"),
              this.btn_heart.clickHandler = Laya.Handler.create(this,
              function() {
                  t.is_upgraded || (t.label_val.visible ? t.label_val.visible = !1 : (t.label_val.visible = !0, t.val_show_starttime = Laya.timer.currTimer))
              },
              null, !1)
          }
          return e.prototype.show = function(e) {
              Laya.timer.clearAll(this),
              e.is_upgraded ? this.bg_hearts.skin = "myres/sushe/heart_full.png": this.bg_hearts.skin = "myres/sushe/heart_normal.png",
              this.current_level = e.level,
              this.current_exp_rate = e.exp / this.exp_limits[this.current_level],
              this.isupgrad = e.is_upgraded,
              this.label_val.visible = !1,
              this.refresh_heart(this.current_level, this.current_exp_rate, e.is_upgraded),
              this.during_change = !1,
              this.preframe_time = Laya.timer.currTimer,
              Laya.timer.frameLoop(1, this, this.update)
          },
          e.prototype.update = function() {
              if (this.label_val.visible) {
                  Laya.timer.currTimer - this.val_show_starttime >= 5e3 && (this.label_val.visible = !1)
              }
              var e = Laya.timer.currTimer - this.preframe_time;
              this.preframe_time = Laya.timer.currTimer,
              this.during_change && (this.target_level != this.current_level ? (this.during_change = !1, this.current_level = this.target_level, this.current_exp_rate = this.target_exp_rate, this.refresh_heart(this.target_level, this.target_exp_rate, this.isupgrad)) : (this.current_exp_rate += e * this.speed, this.target_exp_rate < this.current_exp_rate ? (this.during_change = !1, this.current_level = this.target_level, this.current_exp_rate = this.target_exp_rate, this.refresh_heart(this.target_level, this.target_exp_rate, this.isupgrad)) : this.refresh_heart(this.target_level, this.current_exp_rate, this.isupgrad)))
          },
          e.prototype.refresh_heart = function(e, t, i) {
              this.is_upgraded = i;
              for (var n = 0; n < this.heart_count; n++) {
                  var a = this.heart_masks[n];
                  this.current_level > n ? a.scaleY = 1 : this.current_level == n ? (a.scaleY = .82 * t + .1, this.label_val.x = this.hearts[n].x, this.label_val.text = Math.ceil(t * this.exp_limits[n]).toString() + "/" + this.exp_limits[n].toString()) : a.scaleY = 0,
                  this.hearts[n].getChildByName("v").getChildByName("h").skin = i ? "myres/bothui/heart_gold.png": "myres/bothui/bf_heart.png"
              }
          },
          e.prototype.close = function() {
              Laya.timer.clearAll(this)
          },
          e.prototype.after_give = function(e, t) {
              var i = this,
              n = e.exp / this.exp_limits[e.level],
              a = game.FrontEffect.Inst.create_ui_effect(this.hearts[this.current_level], t ? "scene/effect_heartup_favor.lh": "scene/effect_heartup.lh", new Laya.Point(0, 0), 1);
              if (Laya.timer.once(2e3, null,
              function() {
                  a.destory()
              }), e.level > this.current_level) {
                  this.target_level = this.current_level,
                  this.target_exp_rate = 1,
                  this.during_change = !0;
                  var r = (1 - this.current_exp_rate) / this.speed;
                  Laya.timer.once(r + 200, this,
                  function() {
                      var e = game.FrontEffect.Inst.create_ui_effect(i.hearts[i.current_level], "scene/effect_heartlevelup.lh", new Laya.Point(0, 0), 1);
                      Laya.timer.once(2e3, null,
                      function() {
                          e.destory()
                      }),
                      view.AudioMgr.PlayAudio(111)
                  })
              } else e.level == this.current_level && n > this.current_exp_rate ? (this.target_level = e.level, this.target_exp_rate = n, this.during_change = !0) : Laya.timer.once(500, this,
              function() {
                  i.target_level = e.level,
                  i.target_exp_rate = n,
                  i.during_change = !0
              })
          },
          e
      } (),
      i = function() {
          function t(e, t, i) {
              var n = this;
              this.items = [],
              this.tab_index = 0,
              this.gift_choose_index = -1,
              this.content_inshow = !1,
              this.give_cd = 0,
              this.sound_channel = null,
              this.content = e,
              this.block_exp = i,
              this.container_tabs = t,
              this.btn_gift = this.container_tabs.getChildByName("send"),
              this.btn_gift.clickHandler = Laya.Handler.create(this,
              function() {
                  2 != n.tab_index && n.change_tab(2)
              },
              null, !1),
              this.btn_qiyue = this.container_tabs.getChildByName("sign"),
              this.btn_qiyue.clickHandler = Laya.Handler.create(this,
              function() {
                  1 != n.tab_index && n.change_tab(1)
              },
              null, !1),
              this.scrollview = this.content.scriptMap["capsui.CScrollView"],
              this.scrollview.init_scrollview(Laya.Handler.create(this, this.render_item, null, !1), -1, 4),
              this.container_qiyue = this.content.getChildByName("page_qiyue"),
              this.container_gift = this.content.getChildByName("page_gift"),
              this.content.getChildByName("btn_close").clickHandler = Laya.Handler.create(this,
              function() {
                  n.change_tab(0)
              },
              null, !1)
          }
          return t.prototype.reset = function() {
              this.content.visible = !1,
              this.content_inshow = !1,
              this.tab_index = 0,
              this.gift_choose_index = -1
          },
          t.prototype.show = function(e) {
              this.reset(),
              this.chara_info = e,
              this.btn_gift.visible = e.level < 5;
              var t = cfg.item_definition.character.get(e.charid);
              this.btn_qiyue.visible = !e.is_upgraded && t.can_marry > 0,
              game.Tools.child_align_center(this.container_tabs, [7]),
              this.change_tab(0)
          },
          t.prototype.change_tab = function(t) {
              var i = this;
              if (this.items = [], this.scrollview.reset(), this.container_gift.visible = !1, this.container_qiyue.visible = !1, this.tab_index = t, 1 == t) {
                  this.btn_qiyue.getChildByName("chosen").visible = !0,
                  this.btn_qiyue.getChildByName("label").color = "#000000";
                  for (var n = cfg.item_definition.character.get(this.chara_info.charid).star_5_material.split(","), a = !0, r = 0; r < n.length; r++) {
                      var o = n[r].split("-"),
                      s = parseInt(o[0]),
                      h = parseInt(o[1]),
                      l = e.UI_Bag.get_item_count(s);
                      h > l && (a = !1),
                      this.items.push({
                          id: s,
                          need: h,
                          count: l
                      })
                  }
                  if (this.container_qiyue.visible = !0, this.chara_info.level >= 5) {
                      this.container_qiyue.getChildByName("nomet").visible = !1;
                      var p = this.container_qiyue.getChildByName("container_tupo_btn"),
                      u = p.getChildByName("send");
                      u.clickHandler = Laya.Handler.create(this, this._tupo, null, !1),
                      a ? game.Tools.setGrayDisable(u, !1) : game.Tools.setGrayDisable(u, !0),
                      p.visible = !0
                  } else this.container_qiyue.getChildByName("container_tupo_btn").visible = !1,
                  this.container_qiyue.getChildByName("nomet").visible = !0
              } else this.btn_qiyue.getChildByName("chosen").visible = !1,
              this.btn_qiyue.getChildByName("label").color = "#cfcdcc";
              if (2 == t) {
                  this.btn_gift.getChildByName("chosen").visible = !0,
                  this.btn_gift.getChildByName("label").color = "#000000",
                  this.items = e.UI_Bag.find_items_by_category(e.EItemCategory.gift),
                  this.container_gift.visible = !0;
                  this.container_gift.getChildByName("send").clickHandler = Laya.Handler.create(this, this._send_gift, null, !1),
                  this.gift_choose_index = -1,
                  this.refresh_gift_bottom_btns()
              } else this.btn_gift.getChildByName("chosen").visible = !1,
              this.btn_gift.getChildByName("label").color = "#cfcdcc",
              this.sound_channel && (this.sound_channel.stop(), Laya.SoundManager.removeChannel(this.sound_channel), this.sound_channel = null, c.Inst.closechat(!1));
              this.scrollview.addItem(this.items.length),
              1 == t || 2 == t ? this.content_inshow || (this.content_inshow = !0, this.content.visible = !0, Laya.Tween.clearAll(this.content), e.UIBase.anim_alpha_in(this.content, {
                  y: -50
              },
              150, 0, null, Laya.Ease.strongIn)) : this.content_inshow && (this.content_inshow = !1, Laya.Tween.clearAll(this.content), e.UIBase.anim_alpha_out(this.content, {
                  y: -50
              },
              150, 0, Laya.Handler.create(this,
              function() {
                  i.content.visible = !1
              }), Laya.Ease.strongIn))
          },
          t.prototype.render_item = function(e) {
              var t = e.index,
              i = e.container;
              2 == this.tab_index ? this.render_item_gift(t, i) : 1 == this.tab_index && this.render_item_qiyue(t, i)
          },
          t.prototype.render_item_qiyue = function(t, i) {
              var n = this.items[t],
              a = cfg.item_definition.item.get(n.id);
              i.getChildByName("name").visible = !1;
              var r = i.getChildByName("counts");
              r.visible = !0,
              r.getChildByName("count_need").text = "/" + n.need.toString();
              var o = r.getChildByName("count_have");
              o.text = n.count.toString(),
              o.color = n.count >= n.need ? "#00ff00": "#ff0000",
              game.Tools.child_align_center(r);
              var s = i.getChildByName("btn");
              s.clickHandler = Laya.Handler.create(this,
              function() {
                  e.UI_ItemDetail.Inst.show(n.id)
              },
              null, !1),
              s.getChildByName("choosed").visible = !1,
              game.LoadMgr.setImgSkin(s.getChildByName("icon"), a.icon),
              s.getChildByName("num").visible = !1
          },
          t.prototype.render_item_gift = function(t, i) {
              var n = this,
              a = this.items[t].item_id,
              r = cfg.item_definition.item.get(a),
              o = i.getChildByName("name");
              o.text = r.name,
              o.visible = !0,
              i.getChildByName("counts").visible = !1;
              var s = i.getChildByName("btn"),
              h = s.getChildByName("choosed");
              h.visible = this.gift_choose_index == t,
              s.clickHandler = Laya.Handler.create(this,
              function() {
                  if (n.gift_choose_index != t) {
                      var i = n.gift_choose_index;
                      n.gift_choose_index = t,
                      h.visible = !0,
                      i >= 0 && i < n.items.length && n.scrollview.wantToRefreshItem(i),
                      n.refresh_gift_bottom_btns()
                  } else e.UI_ItemDetail.Inst.show(a)
              },
              null, !1),
              game.LoadMgr.setImgSkin(s.getChildByName("icon"), r.icon);
              var l = s.getChildByName("num");
              this.items[t].count > 1 ? (l.text = this.items[t].count.toString(), l.visible = !0) : l.visible = !1
          },
          t.prototype.refresh_gift_bottom_btns = function() {
              var t = e.UI_Sushe.send_gift_limit - e.UI_Sushe.send_gift_count;
              t < 0 && (t = 0),
              this.container_gift.getChildByName("count").text = t.toString();
              var i = this.container_gift.getChildByName("send");
              game.Tools.setGrayDisable(i, !1)
          },
          t.prototype._tupo = function() {
              var t = this;
              if (e.UI_PiPeiYuYue.Inst.enable) e.UI_Popout.PopOutNoTitle(game.Tools.strOfLocalization(204), null);
              else {
                  var i = this.container_qiyue.getChildByName("container_tupo_btn").getChildByName("send");
                  game.Tools.setGrayDisable(i, !0),
                  app.NetAgent.sendReq2Lobby("Lobby", "upgradeCharacter", {
                      character_id: this.chara_info.charid
                  },
                  function(n, a) {
                      n || a.error ? (e.UIMgr.Inst.showNetReqError("upgradeCharacter", n, a), game.Tools.setGrayDisable(i, !1)) : (c.Inst.close(), Laya.timer.once(150, t,
                      function() {
                          if (t.chara_info.is_upgraded = !0, e.UI_Character_star_up.Inst.show(t.chara_info, Laya.Handler.create(t,
                          function() {
                              e.UI_Sushe.Inst.starup_back()
                          })), a.character) {
                              var i = a.character;
                              if (i.extra_emoji) {
                                  t.chara_info.extra_emoji = [];
                                  for (var n = 0; n < i.extra_emoji.length; n++) t.chara_info.extra_emoji.push(i.extra_emoji[n])
                              }
                          }
                      }))
                  })
              }
          },
          t.prototype.close_audio = function() {
              this.sound_channel && (this.sound_channel.stop(), Laya.SoundManager.removeChannel(this.sound_channel), this.sound_channel = null, c.Inst.closechat(!1))
          },
          t.prototype._send_gift = function() {
              var t = this;
              if (e.UI_PiPeiYuYue.Inst.enable) e.UI_Popout.PopOutNoTitle(game.Tools.strOfLocalization(204), null);
              else if (! (this.gift_choose_index < 0 || this.gift_choose_index >= this.items.length || Laya.timer.currTimer < this.give_cd)) {
                  var i = this.chara_info.charid,
                  n = this.items[this.gift_choose_index].item_id;
                  if (99 != cfg.item_definition.item.get(n).type && e.UI_Sushe.send_gift_limit - e.UI_Sushe.send_gift_count <= 0) e.UI_Popout.PopOutNoTitle(game.Tools.strOfLocalization(2213), null);
                  else {
                      this.give_cd = Laya.timer.currTimer + 1e4;
                      var a = this.container_gift.getChildByName("send");
                      game.Tools.setGrayDisable(a, !0),
                      app.NetAgent.sendReq2Lobby("Lobby", "sendGiftToCharacter", {
                          character_id: i,
                          gifts: [{
                              item_id: n,
                              count: 1
                          }]
                      },
                      function(r, o) {
                          if (r || o.error) game.Tools.setGrayDisable(a, !1),
                          t.give_cd = 0,
                          e.UIMgr.Inst.showNetReqError("sendGiftToCharacter", r, o);
                          else {
                              if (app.Log.log("sendGiftToCharacter: " + JSON.stringify(o)), t.chara_info.charid == i) {
                                  if (2 == t.tab_index) for (_ = 0; _ < t.items.length; _++) if (t.items[_].item_id == n) {
                                      if (t.items[_].count <= 1) {
                                          for (var s = _; s < t.items.length - 1; s++) t.items[s] = t.items[s + 1];
                                          t.items.pop(),
                                          t.gift_choose_index = -1,
                                          t.scrollview.reset(),
                                          t.scrollview.addItem(t.items.length)
                                      } else t.items[_].count--,
                                      t.scrollview.wantToRefreshItem(_);
                                      break
                                  }
                                  var h = cfg.item_definition.item.get(n).type == cfg.item_definition.character.get(i).favorite;
                                  if (o.level > t.block_exp.current_level) {
                                      c.Inst.locking = !0;
                                      var l = (1 - t.block_exp.current_exp_rate) / t.block_exp.speed;
                                      t.block_exp.after_give(o, h),
                                      Laya.timer.once(l + 600, t,
                                      function() {
                                          t.chara_info.level = o.level,
                                          t.chara_info.exp = o.exp,
                                          e.UI_Character_star_up.Inst.show(t.chara_info, Laya.Handler.create(t,
                                          function() {
                                              e.UI_Sushe.Inst.starup_back()
                                          })),
                                          Laya.timer.once(600, t,
                                          function() {
                                              c.Inst.close()
                                          }),
                                          t.give_cd = 0
                                      });
                                      for (_ = 0; _ < 4; _++) {
                                          var p = 50 * (_ + 1);
                                          Laya.timer.once(p + l + 600, t,
                                          function() {
                                              t.sound_channel && (t.sound_channel.volume *= .5)
                                          })
                                      }
                                  } else {
                                      if (t.block_exp.after_give(o, h), t.give_cd = 0, game.Tools.setGrayDisable(a, !1), !t.sound_channel) {
                                          var u = "";
                                          u = cfg.item_definition.character.get(i).favorite == cfg.item_definition.item.get(n).type ? "lobby_gift_favor": "lobby_gift";
                                          var d = view.AudioMgr.PlayCharactorSound(t.chara_info, u, Laya.Handler.create(t,
                                          function() {
                                              t.sound_channel = null,
                                              c.Inst.closechat(!1)
                                          }));
                                          c.Inst.chat(d.words),
                                          t.sound_channel = d.sound,
                                          e.UI_Sushe.Inst.stopsay()
                                      }
                                      t.chara_info.exp = o.exp
                                  }
                              } else {
                                  for (var _ = 0; _ < e.UI_Sushe.characters.length; _++) if (e.UI_Sushe.characters[_].charid == i) {
                                      e.UI_Sushe.characters[_].level = o.level,
                                      e.UI_Sushe.characters[_].exp = o.exp;
                                      break
                                  }
                                  t.give_cd = 0
                              }
                              99 != cfg.item_definition.item.get(n).type && e.UI_Sushe.send_gift_count++,
                              t.refresh_gift_bottom_btns()
                          }
                      })
                  }
              }
          },
          t
      } (),
      n = function() {
          function n(n) {
              var a = this;
              this.head = null,
              this.emos = [],
              this._scrollbar = null,
              this._scrollpoint = null,
              this._drag_scroll = !1,
              this.me = n,
              this.me.visible = !1,
              this.block_exp = new t(n.getChildByName("container_heart")),
              this.block_gift = new i(n.getChildByName("container_gift"), n.getChildByName("tabs"), this.block_exp),
              this.container_intro = n.getChildByName("intro"),
              this.content = this.container_intro.getChildByName("content"),
              this.content.vScrollBarSkin = "",
              this.head = new e.UI_Character_Skin(this.container_intro.getChildByName("content").getChildByName("container_head").getChildByName("head"));
              var r = this.content.getChildByName("container_emj").getChildByName("container").getChildByName("emo_templete");
              r.visible = !1;
              for (var o = 0; o < 20; o++) this.emos.push(new e.UI_Character_Emo(r.scriptMap["capsui.UICopy"].getNodeClone())),
              this.emos[o].me.x = o % 4 * 184,
              this.emos[o].me.y = 184 * Math.floor(o / 4);
              this.content.getChildByName("container_emj").height = 652,
              this.content.getChildByName("container_head").getChildByName("btn_skin").clickHandler = Laya.Handler.create(this,
              function() {
                  c.Inst.open_skin(Laya.Handler.create(a, a.change_skin))
              },
              null, !1),
              this._scrollbar = this.container_intro.getChildByName("scrollbar"),
              this._scrollpoint = this._scrollbar.getChildByName("scrollpoint"),
              this._scrollbar && (this._scrollbar.on("mousedown", this,
              function() {
                  a._drag_scroll = !0;
                  var e = a._scrollbar.mouseY / a._scrollbar.height;
                  a.content.vScrollBar.value = a.content.vScrollBar.max * e
              }), this._scrollbar.on("mousemove", this,
              function() {
                  if (a._drag_scroll) {
                      var e = a._scrollbar.mouseY / a._scrollbar.height;
                      a.content.vScrollBar.value = a.content.vScrollBar.max * e
                  }
              }), this._scrollbar.on("mouseup", this,
              function() {
                  a._drag_scroll = !1
              }), this._scrollbar.on("mouseout", this,
              function() {
                  a._drag_scroll = !1
              }), this.content.vScrollBar.on("change", this,
              function() {
                  var e = a.content.vScrollBar.value / a.content.vScrollBar.max;
                  a._scrollpoint.y = a._scrollbar.height * e
              }))
          }
          return n.prototype.show = function(e) {
              var t = this.content.getChildByName("container_text"),
              i = cfg.item_definition.character.get(e.charid);
              t.getChildByName("height").text = i.desc_stature,
              t.getChildByName("birth").text = i.desc_birth,
              t.getChildByName("age").text = i.desc_age,
              t.getChildByName("bloodtype").text = i.desc_bloodtype,
              t.getChildByName("cv").text = i.desc_cv,
              t.getChildByName("hobby").text = i.desc_hobby,
              t.getChildByName("desc").text = i.desc,
              this.head.setSkin(e.skin, "smallhead");
              this.content.getChildByName("container_emj").y = t.getChildByName("desc").textField.textHeight + 561 - 194;
              for (var n = [], a = {},
              r = 0; r < 9; r++) n.push({
                  sub_id: r,
                  unlock_desc: "",
                  time_limit: !1,
                  after_unlock_desc: ""
              }),
              a[r] = 1;
              if (e.extra_emoji && e.extra_emoji.length > 0) for (r = 0; r < e.extra_emoji.length; r++) a[e.extra_emoji[r]] = 1;
              var o = cfg.character.emoji.getGroup(e.charid);
              if (o) for (r = 0; r < o.length; r++) {
                  var s = o[r];
                  1 == s.unlock_type ? n.push({
                      sub_id: s.sub_id,
                      unlock_desc: s.unlock_desc,
                      time_limit: !1,
                      after_unlock_desc: ""
                  }) : 2 == s.unlock_type && a[s.sub_id] && n.push({
                      sub_id: s.sub_id,
                      unlock_desc: s.unlock_desc,
                      time_limit: !0,
                      after_unlock_desc: s.after_unlock_desc
                  })
              }
              this.content.getChildByName("container_emj").height = 100 + 184 * Math.ceil(n.length / 4);
              for (r = 0; r < this.emos.length; r++) if (r >= n.length) this.emos[r].me.visible = !1;
              else {
                  var h = n[r],
                  l = h.sub_id;
                  this.emos[r].me.visible = !0,
                  this.emos[r].setSkin(e.charid, l),
                  a.hasOwnProperty(l.toString()) ? (this.emos[r].me.getChildByName("lock").visible = !1, this.emos[r].me.getChildByName("time_limit").visible = h.time_limit, h.after_unlock_desc ? (this.emos[r].me.getChildByName("info").visible = !0, this.emos[r].me.getChildByName("info").getChildByName("info").text = h.after_unlock_desc) : this.emos[r].me.getChildByName("info").visible = !1) : (this.emos[r].me.getChildByName("lock").visible = !0, this.emos[r].me.getChildByName("info").visible = !0, this.emos[r].me.getChildByName("info").getChildByName("info").text = h.unlock_desc, this.emos[r].me.getChildByName("time_limit").visible = h.time_limit)
              }
              this.content.refresh(),
              this._drag_scroll = !1,
              this.block_exp.show(e),
              this.block_gift.show(e),
              this.me.visible = !0
          },
          n.prototype.change_skin = function(t) {
              e.UI_Sushe.Inst.onChangeSkin(t),
              this.head.setSkin(t, "smallhead")
          },
          n.prototype.close = function() {
              this.me.visible = !1
          },
          n
      } (),
      a = function() {
          function e(e) {
              var t = this;
              this.solts = [1, 2, 3, 4, 5],
              this.slot_bg = ["myres/sushe/slot_liqibang.jpg", "myres/sushe/slot_hule.jpg", "myres/sushe/slot_liqi.jpg", "myres/sushe/slot_hand.jpg", "myres/sushe/slot_bgm.jpg"],
              this.solt_btns = [],
              this.chara_info = null,
              this.me = e,
              this.me.visible = !1;
              for (var i = function(e) {
                  var i = n.me.getChildByName("slot" + e);
                  n.solt_btns.push(i),
                  i.clickHandler = Laya.Handler.create(n,
                  function() {
                      e < 4 ? c.Inst.pop_effect_choose(1 + e, Laya.Handler.create(t,
                      function(i) {
                          t.on_change_view(1 + e, i)
                      })) : c.Inst.show_pop_bgm(Laya.Handler.create(t,
                      function(e) {
                          t.on_change_view(5, e)
                      }))
                  },
                  null, !1)
              },
              n = this, a = 0; a < 5; a++) i(a)
          }
          return e.prototype.render_item = function(e) {
              var t = this.solts[e],
              i = -1;
              if (this.chara_info.views) for (var n = 0; n < this.chara_info.views.length; n++) if (this.chara_info.views[n].slot == t) {
                  i = this.chara_info.views[n].item_id;
                  break
              }
              var a = this.solt_btns[e]; - 1 == i || 0 == i ? (a.getChildByName("icon").skin = this.slot_bg[e], a.getChildByName("desc").text = game.Tools.strOfLocalization(411 + e)) : (game.LoadMgr.setImgSkin(a.getChildByName("icon"), cfg.item_definition.item.get(i).icon), a.getChildByName("desc").text = cfg.item_definition.item.get(i).desc)
          },
          e.prototype.on_change_view = function(e, t) {
              var i = !1;
              if (this.chara_info.views) for (n = 0; n < this.chara_info.views.length; n++) if (this.chara_info.views[n].slot == e) {
                  i = !0,
                  this.chara_info.views[n].item_id == t ? (this.chara_info.views[n].item_id = 0, t = 0) : this.chara_info.views[n].item_id = t;
                  break
              }
              i || (this.chara_info.views || (this.chara_info.views = []), this.chara_info.views.push({
                  slot: e,
                  item_id: t
              }));
              //屏蔽立直道具变更的网络请求 ----fxxk
              // app.NetAgent.sendReq2Lobby("Lobby", "changeCharacterView", {
              //     character_id: this.chara_info.charid,
              //     slot: e,
              //     item_id: t
              // },
              // function(e, t) {});
              //end
              for (var n = 0; n < this.solts.length; n++) this.render_item(n)
          },
          e.prototype.show = function(e) {
              this.chara_info = e;
              for (var t = 0; t < 5; t++) this.render_item(t);
              this.me.visible = !0
          },
          e.prototype.close = function() {
              this.me.visible = !1
          },
          e
      } (),
      r = function() {
          function t(e) {
              this.sounds = [],
              this.chara_info = null,
              this.current_play_index = -1,
              this.current_soundchannel = null,
              this.volume_fixed = 0,
              this.me = e,
              this.me.visible = !1,
              this.scrollview = this.me.scriptMap["capsui.CScrollView"],
              this.scrollview.init_scrollview(Laya.Handler.create(this, this.render_item, null, !1))
          }
          return t.prototype.show = function(t) {
              this.chara_info = t,
              this.sounds = [];
              for (var i = cfg.voice.sound.getGroup(cfg.item_definition.character.get(t.charid).sound), n = 0; n < i.length; n++) this.sounds.push(i[n]);
              this.volume_fixed = cfg.item_definition.character.get(t.charid).sound_volume,
              this.scrollview.reset(),
              this.scrollview.addItem(this.sounds.length),
              this.me.visible = !0,
              view.AudioMgr.refresh_music_volume(!0),
              this.current_play_index = -1,
              e.UI_Sushe.Inst.stopsay()
          },
          t.prototype.close = function() {
              this.me.visible && (this.me.visible = !1, view.AudioMgr.refresh_music_volume(!1), this.current_soundchannel && (this.current_soundchannel.stop(), Laya.SoundManager.removeChannel(this.current_soundchannel), this.current_soundchannel = null, this.current_play_index = -1, c.Inst.closechat(!1)))
          },
          t.prototype.render_item = function(e) {
              var t = this,
              i = e.index,
              n = e.container,
              a = this.sounds[i];
              n.getChildByName("desc").text = a.name;
              var r = n.getChildByName("btn_play"),
              o = r.getChildByName("img");
              o.skin = this.current_play_index == i ? "myres/sushe/bf_pause.png": "myres/sushe/bf_play.png",
              r.clickHandler = Laya.Handler.create(this,
              function() {
                  if (t.current_play_index == i) t.current_soundchannel && (t.current_soundchannel.stop(), Laya.SoundManager.removeChannel(t.current_soundchannel), t.current_soundchannel = null),
                  c.Inst.closechat(!1),
                  o.skin = "myres/sushe/bf_play.png",
                  t.current_play_index = -1;
                  else {
                      var e = t.current_play_index;
                      t.current_play_index = i,
                      e >= 0 && e < t.sounds.length && t.scrollview.wantToRefreshItem(e),
                      t.current_soundchannel && (Laya.SoundManager.removeChannel(t.current_soundchannel), t.current_soundchannel.stop(), t.current_soundchannel = null),
                      o.skin = "myres/sushe/bf_pause.png",
                      t.current_soundchannel = Laya.SoundManager.playSound(a.path + view.AudioMgr.suffix, 1, new Laya.Handler(t,
                      function() {
                          if (t.current_soundchannel) {
                              t.current_soundchannel = null;
                              var e = t.current_play_index;
                              t.current_play_index = -1,
                              e >= 0 && e < t.sounds.length && t.scrollview.wantToRefreshItem(e),
                              c.Inst.closechat(!1)
                          }
                      })),
                      t.current_soundchannel.volume = view.AudioMgr.soundMuted ? 0 : view.AudioMgr.soundVolume * t.volume_fixed,
                      c.Inst.chat(a.words)
                  }
              },
              null, !1);
              var s = n.getChildByName("lock");
              this.chara_info.level >= a.level_limit ? (s.visible = !1, r.visible = !0) : (s.visible = !0, r.visible = !1, s.getChildByName("info").text = game.Tools.strOfLocalization(2192, [a.level_limit.toString()]))
          },
          t
      } (),
      o = function() {
          function t(e) {
              var t = this;
              this.items = [],
              this.current_using_item_id = -1,
              this.me = e,
              this.root = e.getChildByName("root"),
              this.title = this.root.getChildByName("title"),
              this.root.getChildByName("btn_close").clickHandler = Laya.Handler.create(this,
              function() {
                  t.close()
              },
              null, !1),
              this.scrollview = this.root.scriptMap["capsui.CScrollView"],
              this.scrollview.init_scrollview(Laya.Handler.create(this, this.render_item, null, !1), -1, 3)
          }
          return t.prototype.show = function(t, i, n) {
              this.me.visible = !0,
              this.root.scaleX = this.root.scaleY = 1,
              e.UIBase.anim_pop_out(this.root, null),
              this.chara_info = t,
              this.slot_id = i,
              this.when_change = n,
              this.items = [];
              for (var a = e.UI_Bag.find_items_by_category(e.EItemCategory.character_view), r = 0; r < a.length; r++) {
                  cfg.item_definition.item.get(a[r].item_id).type == i && this.items.push(a[r].item_id)
              }
              if (this.current_using_item_id = -1, t.views) for (r = 0; r < t.views.length; r++) if (t.views[r].slot == this.slot_id) {
                  this.current_using_item_id = t.views[r].item_id;
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
              this.root.getChildByName("no_info").visible = 0 == this.items.length,
              this.scrollview.reset(),
              this.scrollview.addItem(this.items.length)
          },
          t.prototype.close = function() {
              var t = this;
              this.when_change = null,
              e.UIBase.anim_pop_hide(this.root, Laya.Handler.create(this,
              function() {
                  t.me.visible = !1
              }))
          },
          t.prototype.render_item = function(t) {
              var i = this,
              n = t.index,
              a = t.container,
              r = t.cache_data,
              o = a.getChildByName("btn");
              o.clickHandler = Laya.Handler.create(this,
              function() {
                  i.when_change && i.when_change.runWith(i.items[n]),
                  i.close()
              },
              null, !1),
              r.icon || (r.icon = new e.UI_Item_Skin(o.getChildByName("icon"))),
              r.icon.setSkin(cfg.item_definition.item.get(this.items[n]).icon);
              a.getChildByName("using").visible = this.current_using_item_id == this.items[n]
          },
          t
      } (),
      s = function() {
          function t(e) {
              var t = this;
              this.items = [],
              this.current_using_item_id = -1,
              this.current_listening = -1,
              this.me = e,
              this.root = e.getChildByName("root"),
              this.title = this.root.getChildByName("title"),
              this.root.getChildByName("btn_close").clickHandler = Laya.Handler.create(this,
              function() {
                  t.close()
              },
              null, !1),
              this.scrollview = this.root.scriptMap["capsui.CScrollView"],
              this.scrollview.init_scrollview(Laya.Handler.create(this, this.render_item, null, !1), -1, 3)
          }
          return t.prototype.show = function(t, i) {
              this.me.visible = !0,
              this.root.scaleX = this.root.scaleY = 1,
              e.UIBase.anim_pop_out(this.root, null),
              this.chara_info = t,
              this.when_change = i,
              this.items = [];
              for (var n = e.UI_Bag.find_items_by_category(e.EItemCategory.character_view), a = 0; a < n.length; a++) {
                  cfg.item_definition.item.get(n[a].item_id).type == game.EPlayerView.liqi_bgm && this.items.push(n[a].item_id)
              }
              if (this.current_using_item_id = -1, t.views) for (a = 0; a < t.views.length; a++) if (t.views[a].slot == game.EPlayerView.liqi_bgm) {
                  this.current_using_item_id = t.views[a].item_id;
                  break
              }
              this.current_listening = -1,
              this.root.getChildByName("no_info").visible = 0 == this.items.length,
              this.scrollview.reset(),
              this.scrollview.addItem(this.items.length)
          },
          t.prototype.close = function() {
              var t = this;
              this.when_change = null,
              e.UIBase.anim_pop_hide(this.root, Laya.Handler.create(this,
              function() {
                  t.me.visible = !1,
                  view.AudioMgr.PlayMusic("music/lobby.mp3")
              }))
          },
          t.prototype.render_item = function(e) {
              var t = this,
              i = e.index,
              n = e.container,
              a = n.getChildByName("btn");
              a.clickHandler = Laya.Handler.create(this,
              function() {
                  t.when_change && t.when_change.runWith(t.items[i]),
                  t.close()
              },
              null, !1);
              var r = a.getChildByName("icon");
              game.LoadMgr.setImgSkin(r, cfg.item_definition.item.get(this.items[i]).icon);
              a.getChildByName("using").visible = this.current_using_item_id == this.items[i];
              var o = a.getChildByName("img_play");
              i == this.current_listening ? o.skin = "myres/sushe/bf_pause.png": o.skin = "myres/sushe/bf_play.png";
              n.getChildByName("btn_play").clickHandler = Laya.Handler.create(this,
              function() {
                  i == t.current_listening ? (t.current_listening = -1, view.AudioMgr.StopMusic()) : (t.current_listening = i, view.AudioMgr.PlayMusic(cfg.item_definition.item.get(t.items[i]).sargs[0])),
                  t.scrollview.wantToRefreshAll()
              },
              null, !1)
          },
          t
      } (),
      h = function() {
          function t(e) {
              var t = this;
              this.skins = [],
              this.me = e,
              this.root = e.getChildByName("root"),
              this.root.getChildByName("btn_close").clickHandler = Laya.Handler.create(this,
              function() {
                  t.close()
              },
              null, !1),
              this.scrollview = this.root.scriptMap["capsui.CScrollView"],
              this.scrollview.init_scrollview(Laya.Handler.create(this, this.render_item, null, !1), -1, 3)
          }
          return t.prototype.show = function(t, i) {
              this.me.visible = !0,
              e.UIBase.anim_pop_out(this.root, null),
              this.chara_info = t,
              this.when_change = i,
              this.skins = [];
              var n = cfg.item_definition.character.get(t.charid);
              if (this.skins.push(n.init_skin), n.can_marry && this.skins.push(n.full_fetter_skin), n.skin_lib) for (var a = 0; a < n.skin_lib.length; a++) n.skin_lib[a] && this.skins.push(n.skin_lib[a]);
              this.scrollview.reset(),
              this.scrollview.addItem(this.skins.length)
          },
          t.prototype.close = function() {
              var t = this;
              this.when_change = null,
              e.UIBase.anim_pop_hide(this.root, Laya.Handler.create(this,
              function() {
                  t.me.visible = !1
              }))
          },
          t.prototype.render_item = function(t) {
              var i = this,
              n = t.index,
              a = t.container,
              r = t.cache_data,
              o = a.getChildByName("btn");
              r.skin || (r.skin = new e.UI_Character_Skin(o.getChildByName("icon")));
              a.getChildByName("using").visible = this.skins[n] == this.chara_info.skin;
              var s = cfg.item_definition.skin.get(this.skins[n]);
              r.skin.setSkin(this.skins[n], "smallhead");
              var h = o.getChildByName("locked");
              //修复无法更换婚前皮肤的问题 ----fxxk
              // e.UI_Sushe.skin_owned(this.skins[n]) ? (h.visible = !1, o.clickHandler = Laya.Handler.create(this,
              //end
              1 ? (h.visible = !1, o.clickHandler = Laya.Handler.create(this,
              function() {
                  i.skins[n] != i.chara_info.skin && i.when_change && i.when_change.runWith(i.skins[n]),
                  i.close()
              },
              null, !1)) : (h.visible = !0, h.getChildByName("info").text = s.lock_tips, o.clickHandler = null)
          },
          t
      } (),
      l = function() {
          function e(e) {
              var t = this;
              this.locking = !1,
              this.me = e,
              this.info = this.me.getChildByName("info"),
              this.me.on("mousedown", this,
              function() {
                  t.locking || t.close()
              })
          }
          return e.prototype.show = function(e) {
              var t = this;
              this.info.text = e,
              this.me.height = 120 + this.info.textField.textHeight,
              this.me.visible = !0,
              this.locking = !0,
              this.me.scaleY = 0,
              Laya.timer.clearAll(this),
              Laya.Tween.to(this.me, {
                  scaleY: 1
              },
              150, null, Laya.Handler.create(this,
              function() {
                  t.locking = !1
              })),
              Laya.timer.once(3e3, this,
              function() {
                  t.close()
              })
          },
          e.prototype.close = function() {
              var e = this;
              this.locking = !0,
              Laya.timer.clearAll(this),
              Laya.Tween.to(this.me, {
                  scaleY: 0
              },
              150, null, Laya.Handler.create(this,
              function() {
                  e.locking = !1,
                  e.me.visible = !1
              }))
          },
          e
      } (),
      c = function(t) {
          function i() {
              var e = t.call(this, new ui.lobby.visitUI) || this;
              return e.tabs = [],
              e.page_intro = null,
              e.page_effect = null,
              e.page_sound = null,
              e.block_chat = null,
              e.pop_effect = null,
              e.pop_bgm = null,
              e.pop_skin = null,
              e.locking = !1,
              e.current_page = -1,
              e.chara_info = null,
              i.Inst = e,
              e
          }
          return __extends(i, t),
          Object.defineProperty(i.prototype, "cannot_click_say", {
              get: function() {
                  return 1 == this.current_page || null != this.page_intro.block_gift.sound_channel
              },
              enumerable: !0,
              configurable: !0
          }),
          i.prototype.onCreate = function() {
              var t = this;
              this.container_top = this.me.getChildByName("top"),
              this.container_top.getChildByName("btn_back").clickHandler = Laya.Handler.create(this,
              function() {
                  t.locking || t.back2select()
              },
              null, !1),
              this.container_right = this.me.getChildByName("right");
              for (var i = function(e) {
                  c.tabs.push(c.container_right.getChildByName("btn_page" + e)),
                  c.tabs[e].clickHandler = Laya.Handler.create(c,
                  function() {
                      t.locking || t.current_page != e && t.change_page(e)
                  },
                  null, !1)
              },
              c = this, p = 0; p < 3; p++) i(p);
              this.page_intro = new n(this.container_right.getChildByName("page_intro")),
              this.page_effect = new a(this.container_right.getChildByName("effect")),
              this.page_sound = new r(this.container_right.getChildByName("sound")),
              this.block_chat = new e.UI_Character_Chat(this.me.getChildByName("chat")),
              this.block_chat.me.visible = !1,
              this.pop_effect = new o(this.me.getChildByName("pop_effect")),
              this.pop_bgm = new s(this.me.getChildByName("pop_bgm")),
              this.pop_skin = new h(this.me.getChildByName("pop_skin")),
              this.info_levelup = new l(this.me.getChildByName("levelup"))
          },
          i.prototype.show = function(t, i) {
              var n = this;
              this.chara_info = t;
              for (var a = 0; a < this.tabs.length; a++) this.tabs[a].skin = "myres/sushe/bf_unchooesd.png";
              this.page_intro.close(),
              this.page_effect.close(),
              this.page_sound.close(),
              this.current_page = -1,
              this.change_page(0),
              this.block_chat.me.visible = !1,
              this.pop_effect.me.visible = !1,
              this.pop_bgm.me.visible = !1,
              this.pop_skin.me.visible = !1,
              this.info_levelup.me.visible = !1,
              this.me.visible = !0,
              this.locking = !0,
              e.UIBase.anim_alpha_in(this.container_top, {
                  y: -30
              },
              150),
              e.UIBase.anim_alpha_in(this.container_right, {
                  x: 30
              },
              150),
              e.UIBase.anim_alpha_in(this.block_chat.me, {
                  y: 30
              },
              150),
              Laya.timer.once(150, this,
              function() {
                  n.locking = !1
              }),
              i && Laya.timer.once(150, this,
              function() {
                  n.chara_info.is_upgraded ? n.info_levelup.show(game.Tools.strOfLocalization(2196)) : n.info_levelup.show(cfg.level_definition.character.get(n.chara_info.level).unlock_desc)
              })
          },
          i.prototype.close = function() {
              var t = this;
              this.locking = !0,
              e.UIBase.anim_alpha_out(this.container_top, {
                  y: -30
              },
              150),
              e.UIBase.anim_alpha_out(this.container_right, {
                  x: 30
              },
              150),
              e.UIBase.anim_alpha_out(this.block_chat.me, {
                  y: 30
              },
              150),
              Laya.timer.once(150, this,
              function() {
                  t.locking = !1,
                  t.me.visible = !1,
                  t.page_sound.me.visible && t.page_sound.close(),
                  t.pop_bgm.me.visible && t.pop_bgm.close(),
                  t.page_intro.block_gift.close_audio()
              })
          },
          i.prototype.back2select = function() {
              this.close(),
              Laya.timer.once(150, this,
              function() {
                  e.UI_Sushe.Inst.show_page_select()
              })
          },
          i.prototype.change_page = function(e) {
              if (this.current_page >= 0) switch (this.tabs[this.current_page].skin = "myres/sushe/bf_unchooesd.png", this.current_page) {
              case 0:
                  this.page_intro.close();
                  break;
              case 1:
                  this.page_sound.close();
                  break;
              case 2:
                  this.page_effect.close()
              }
              if (this.current_page = e, this.current_page >= 0) switch (this.tabs[this.current_page].skin = "myres/sushe/bf_chosen.png", this.current_page) {
              case 0:
                  this.page_intro.show(this.chara_info);
                  break;
              case 1:
                  this.page_sound.show(this.chara_info);
                  break;
              case 2:
                  this.page_effect.show(this.chara_info)
              }
          },
          i.prototype.open_skin = function(e) {
              this.pop_skin.show(this.chara_info, e)
          },
          i.prototype.pop_effect_choose = function(e, t) {
              this.pop_effect.show(this.chara_info, e, t)
          },
          i.prototype.show_pop_bgm = function(e) {
              this.pop_bgm.show(this.chara_info, e)
          },
          i.prototype.chat = function(e) {
              this.block_chat.show(e)
          },
          i.prototype.closechat = function(e) {
              this.block_chat.close(e)
          },
          i
      } (e.UIBase);
      e.UI_Sushe_Visit = c
    } (uiscript || (uiscript = {}));
    
    !function(e) {
      var t = function() {
          function t(e) {
              var t = this;
              this.friends = [],
              this.sortlist = [],
              this.me = e,
              this.me.visible = !1,
              this.blackbg = e.getChildByName("blackbg"),
              this.blackbg.clickHandler = Laya.Handler.create(this,
              function() {
                  t.locking || t.close()
              },
              null, !1),
              this.root = e.getChildByName("root"),
              this.scrollview = this.root.scriptMap["capsui.CScrollView"],
              this.scrollview.init_scrollview(Laya.Handler.create(this, this.render_item, null, !1)),
              this.noinfo = this.root.getChildByName("noinfo")
          }
          return t.prototype.show = function() {
              var t = this;
              this.locking = !0,
              this.me.visible = !0,
              this.scrollview.reset(),
              this.friends = [],
              this.sortlist = [];
              for (var i = game.FriendMgr.friend_list,
              n = 0; n < i.length; n++) this.sortlist.push(n);
              this.sortlist = this.sortlist.sort(function(e, t) {
                  var n = i[e],
                  a = 0;
                  if (n.state.is_online) {
                      a += "" != (s = game.Tools.playState2Desc(n.state.playing)) ? 3e10: 6e10,
                      a += -n.state.login_time
                  } else a += n.state.logout_time;
                  var r = i[t],
                  o = 0;
                  if (r.state.is_online) {
                      var s = game.Tools.playState2Desc(r.state.playing);
                      o += "" != s ? 3e10: 6e10,
                      o += -r.state.login_time
                  } else o += r.state.logout_time;
                  return o - a
              });
              for (n = 0; n < i.length; n++) this.friends.push({
                  f: i[n],
                  invited: !1
              });
              this.noinfo.visible = 0 == this.friends.length,
              this.scrollview.addItem(this.friends.length),
              e.UIBase.anim_pop_out(this.root, Laya.Handler.create(this,
              function() {
                  t.locking = !1
              }))
          },
          t.prototype.close = function() {
              var t = this;
              this.locking = !0,
              e.UIBase.anim_pop_hide(this.root, Laya.Handler.create(this,
              function() {
                  t.locking = !1,
                  t.me.visible = !1
              }))
          },
          t.prototype.render_item = function(t) {
              var n = t.index,
              a = t.container,
              r = t.cache_data;
              r.head || (r.head = new e.UI_Head(a.getChildByName("head")), r.name = a.getChildByName("label_name"), r.state = a.getChildByName("label_state"), r.btn = a.getChildByName("btn_invite"), r.invited = a.getChildByName("invited"));
              var o = this.friends[this.sortlist[n]];
              r.head.id = o.f.base.avatar_id,
              r.name.text = o.f.base.nickname;
              var s = !1;
              if (o.f.state.is_online) {
                  var h = game.Tools.playState2Desc(o.f.state.playing);
                  "" != h ? (r.state.text = game.Tools.strOfLocalization(2069, [h]), r.state.color = "#a9d94d", r.name.color = "#a9d94d") : (r.state.text = game.Tools.strOfLocalization(2071), r.state.color = "#58c4db", r.name.color = "#58c4db", s = !0)
              } else r.state.text = game.Tools.strOfLocalization(2072),
              r.state.color = "#8c8c8c",
              r.name.color = "#8c8c8c";
              o.invited ? (r.btn.visible = !1, r.invited.visible = !0) : (r.btn.visible = !0, r.invited.visible = !1, game.Tools.setGrayDisable(r.btn, !s), s && (r.btn.clickHandler = Laya.Handler.create(this,
              function() {
                  game.Tools.setGrayDisable(r.btn, !0);
                  var t = {
                      room_id: i.Inst.room_id,
                      mode: i.Inst.room_mode,
                      nickname: GameMgr.Inst.account_data.nickname,
                      account_id: GameMgr.Inst.account_id
                  };
                  app.NetAgent.sendReq2Lobby("Lobby", "sendClientMessage", {
                      target_id: o.f.base.account_id,
                      type: game.EFriendMsgType.room_invite,
                      content: JSON.stringify(t)
                  },
                  function(t, i) {
                      t || i.error ? (game.Tools.setGrayDisable(r.btn, !1), e.UIMgr.Inst.showNetReqError("sendClientMessage", t, i)) : (r.btn.visible = !1, r.invited.visible = !0, o.invited = !0)
                  })
              },
              null, !1)))
          },
          t
      } (),
      i = function(i) {
          function n() {
              var t = i.call(this, new ui.lobby.waitingroomUI) || this;
              return t.skin_ready = "myres/room/btn_ready.png",
              t.skin_cancel = "myres/room/btn_cancel.png",
              t.skin_start = "myres/room/btn_start.png",
              t.skin_start_no = "myres/room/btn_start_no.png",
              t.label_rommid = null,
              t.player_cells = [],
              t.btn_ok = null,
              t.btn_invite_friend = null,
              t.btn_add_robot = null,
              t.beReady = !1,
              t.room_id = -1,
              t.owner_id = -1,
              t.tournament_id = 0,
              t.max_player_count = 0,
              t.players = [],
              t.container_rules = null,
              t.container_top = null,
              t.container_right = null,
              t.locking = !1,
              t.mousein_copy = !1,
              t.popout = null,
              t.room_link = null,
              t.btn_copy_link = null,
              t.last_start_room = 0,
              t.invitefriend = null,
              t.pre_choose = null,
              t.ai_name = game.Tools.strOfLocalization(2003),
              n.Inst = t,
              app.NetAgent.AddListener2Lobby("NotifyRoomPlayerReady", Laya.Handler.create(t,
              function(e) {
                  app.Log.log("NotifyRoomPlayerReady:" + JSON.stringify(e)),
                  t.onReadyChange(e.account_id, e.ready)
              })),
              app.NetAgent.AddListener2Lobby("NotifyRoomPlayerUpdate", Laya.Handler.create(t,
              function(e) {
                  app.Log.log("NotifyRoomPlayerUpdate:" + JSON.stringify(e)),
                  t.onPlayerChange(e)
              })),
              app.NetAgent.AddListener2Lobby("NotifyRoomGameStart", Laya.Handler.create(t,
              function(e) {
                  t.enable && (app.Log.log("NotifyRoomGameStart:" + JSON.stringify(e)), t.onGameStart(e))
              })),
              app.NetAgent.AddListener2Lobby("NotifyRoomKickOut", Laya.Handler.create(t,
              function(e) {
                  app.Log.log("NotifyRoomKickOut:" + JSON.stringify(e)),
                  t.onBeKictOut()
              })),
              game.LobbyNetMgr.Inst.add_connect_listener(Laya.Handler.create(t,
              function() {
                  t.enable && t.hide(Laya.Handler.create(t,
                  function() {
                      e.UI_Lobby.Inst.enable = !0
                  }))
              },
              null, !1)),
              t
          }
          return __extends(n, i),
          Object.defineProperty(n.prototype, "inRoom", {
              get: function() {
                  return - 1 != this.room_id
              },
              enumerable: !0,
              configurable: !0
          }),
          Object.defineProperty(n.prototype, "robot_count", {
              get: function() {
                  for (var e = 0,
                  t = 0; t < this.players.length; t++) 2 == this.players[t].category && e++;
                  return e
              },
              enumerable: !0,
              configurable: !0
          }),
          n.prototype.resetData = function() {
              this.room_id = -1,
              this.owner_id = -1,
              this.room_mode = {},
              this.max_player_count = 0,
              this.players = []
          },
          n.prototype.updateData = function(e) {
              if (e) {
                  this.room_id = e.room_id,
                  this.owner_id = e.owner_id,
                  this.room_mode = e.mode,
                  this.public_live = e.public_live,
                  this.tournament_id = 0,
                  e.tournament_id && (this.tournament_id = e.tournament_id),
                  this.ai_name = game.Tools.strOfLocalization(2003),
                  this.room_mode.detail_rule && (1 === this.room_mode.detail_rule.ai_level && (this.ai_name = game.Tools.strOfLocalization(2003)), 2 === this.room_mode.detail_rule.ai_level && (this.ai_name = game.Tools.strOfLocalization(2004))),
                  this.max_player_count = e.max_player_count,
                  this.players = [];
                  for (i = 0; i < e.persons.length; i++) {
                      var t = e.persons[i];
                      //修改友人房间立绘  -----fxxk
                      if(t.account_id == GameMgr.Inst.account_id)
                          t.avatar_id = GameMgr.Inst.account_data.my_character.skin;
                      //end
                      t.ready = !1,
                      t.cell_index = -1,
                      t.category = 1,
                      this.players.push(t)
                  }
                  for (i = 0; i < e.robot_count; i++) this.players.push({
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
                  for (var i = 0; i < e.ready_list.length; i++) for (var n = 0; n < this.players.length; n++) if (this.players[n].account_id == e.ready_list[i]) {
                      this.players[n].ready = !0;
                      break
                  }
              } else this.resetData()
          },
          n.prototype.onReadyChange = function(e, t) {
              for (var i = 0; i < this.players.length; i++) if (this.players[i].account_id == e) {
                  this.players[i].ready = t,
                  this._onPlayerReadyChange(this.players[i]);
                  break
              }
          },
          n.prototype.onPlayerChange = function(e) {
              e = e.toJSON();
              for (var t = [], i = 0; i < this.players.length; i++) 0 != this.players[i].category && t.push(this.players[i]);
              if (this.players = t, e.update_list) for (i = 0; i < e.update_list.length; i++) {
                  for (var n = e.update_list[i], a = n.account_id, r = !0, o = 0; o < this.players.length; o++) if (this.players[o] && this.players[o].account_id == a) {
                      n.avatar_id && (this.players[o].avatar_id = n.avatar_id),
                      n.title && (this.players[o].avatar_id = n.title),
                      n.nickname && (this.players[o].avatar_id = n.nickname),
                      n.level && (this.players[o].level = n.level),
                      this._refreshPlayerInfo(this.players[o]),
                      r = !1;
                      break
                  }
                  if (r) {
                      var s = -1;
                      if (this.enable) {
                          for (var h = [!1, !1, !1, !1], l = 0; l < this.players.length; l++) h[this.players[l].cell_index] = !0;
                          for (o = 0; o < this.max_player_count; o++) if (!h[o]) {
                              s = o;
                              break
                          }
                      }
                      n.cell_index = s,
                      n.ready = !1,
                      n.category = 1,
                      this.players.push(n),
                      this._refreshPlayerInfo(this.players[this.players.length - 1])
                  }
              }
              if (e.remove_list) for (i = 0; i < e.remove_list.length; i++) for (var a = e.remove_list[i], o = 0; o < this.players.length; o++) if (this.players[o] && this.players[o].account_id == a) {
                  for (var c = this.players[o].cell_index, p = o; p < this.players.length - 1; p++) this.players[p] = this.players[p + 1];
                  this.players.pop(),
                  this._clearCell(c);
                  break
              }
              if (null != e.robot_count && void 0 != e.robot_count) {
                  var u = e.robot_count;
                  u < this.robot_count && this.pre_choose && 2 == this.pre_choose.category && (this.pre_choose.category = 0, this._clearCell(this.pre_choose.cell_index), this.pre_choose = null);
                  for (i = 0; i < this.players.length; i++) {
                      var d = this.players[i];
                      2 == d.category && (0 == u ? (this.players[i].category = 0, this._clearCell(d.cell_index)) : u--)
                  }
                  for (; u > 0;) {
                      for (var _ = -1,
                      i = 0; i < this.players.length; i++) if (0 == this.players[i].category) {
                          _ = i;
                          break
                      }
                      if ( - 1 == _) {
                          if (! (this.players.length < this.max_player_count)) {
                              app.Log.Error("同步机器人数量有问题");
                              break
                          }
                          u--;
                          for (var c = -1,
                          h = [!1, !1, !1, !1], i = 0; i < this.players.length; i++) h[this.players[i].cell_index] = !0;
                          for (o = 0; o < this.max_player_count; o++) if (!h[o]) {
                              c = o;
                              break
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
                          this._refreshPlayerInfo(this.players[this.players.length - 1])
                      } else u--,
                      this.players[_].category = 2,
                      this.players[_].cell_index = _,
                      this.players[_].account_id = 0,
                      this.players[_].level = {
                          id: 10101,
                          score: 0
                      },
                      this.players[_].nickname = this.ai_name,
                      this.players[_].ready = !0,
                      this.players[_].title = 0,
                      this.players[_].avatar_id = 400101,
                      this._refreshPlayerInfo(this.players[_])
                  }
              }
              if (e.owner_id) {
                  if (this.owner_id = e.owner_id, this.enable) if (this.owner_id == GameMgr.Inst.account_id) this.refreshAsOwner();
                  else for (o = 0; o < this.players.length; o++) if (this.players[o] && this.players[o].account_id == this.owner_id) {
                      this._refreshPlayerInfo(this.players[o]);
                      break
                  }
              } else if (this.enable) if (this.owner_id == GameMgr.Inst.account_id) this.refreshAsOwner();
              else for (o = 0; o < this.players.length; o++) if (this.players[o] && this.players[o].account_id == this.owner_id) {
                  this._refreshPlayerInfo(this.players[o]);
                  break
              }
          },
          n.prototype.onBeKictOut = function() {
              this.resetData(),
              this.enable && (this.enable = !1, e.UI_Lobby.Inst.enable = !0, e.UIMgr.Inst.ShowErrorInfo(game.Tools.strOfLocalization(52)))
          },
          n.prototype.onCreate = function() {
              var i = this;
              this.last_start_room = 0;
              var n = this.me.getChildByName("root");
              this.container_top = n.getChildByName("top"),
              this.container_right = n.getChildByName("right"),
              this.label_rommid = this.container_top.getChildByName("label_roomid");
              for (var a = function(t) {
                  var a = n.getChildByName("player_" + t.toString()),
                  o = {};
                  o.index = t,
                  o.container = a,
                  o.container_flag = a.getChildByName("flag"),
                  o.container_name = a.getChildByName("container_name"),
                  o.name = a.getChildByName("container_name").getChildByName("label_name"),
                  o.btn_t = a.getChildByName("btn_t"),
                  o.container_illust = a.getChildByName("container_illust"),
                  o.illust = new e.UI_Character_Skin(a.getChildByName("container_illust").getChildByName("illust")),
                  o.host = a.getChildByName("host"),
                  o.title = new e.UI_PlayerTitle(a.getChildByName("container_name").getChildByName("title")),
                  o.rank = new e.UI_Level(a.getChildByName("container_name").getChildByName("rank")),
                  o.is_robot = !1;
                  var s = 0;
                  o.btn_t.clickHandler = Laya.Handler.create(r,
                  function() {
                      if (! (i.locking || Laya.timer.currTimer < s)) {
                          s = Laya.timer.currTimer + 500;
                          for (var e = 0; e < i.players.length; e++) if (i.players[e].cell_index == t) {
                              i.kickPlayer(e);
                              break
                          }
                      }
                  },
                  null, !1),
                  o.btn_info = a.getChildByName("btn_info"),
                  o.btn_info.clickHandler = Laya.Handler.create(r,
                  function() {
                      if (!i.locking) for (var n = 0; n < i.players.length; n++) if (i.players[n].cell_index == t) {
                          i.players[n].account_id && i.players[n].account_id > 0 && e.UI_OtherPlayerInfo.Inst.show(i.players[n].account_id);
                          break
                      }
                  },
                  null, !1),
                  r.player_cells.push(o)
              },
              r = this, o = 0; o < 4; o++) a(o);
              this.btn_ok = n.getChildByName("btn_ok"),
              this.btn_ok.clickHandler = Laya.Handler.create(this,
              function() {
                  i.owner_id == GameMgr.Inst.account_id ? i.getStart() : i.switchReady()
              },
              null, !1),
              this.container_top.getChildByName("btn_leave").clickHandler = Laya.Handler.create(this,
              function() {
                  i.leaveRoom()
              },
              null, !1),
              this.btn_invite_friend = this.container_right.getChildByName("btn_friend"),
              this.btn_invite_friend.clickHandler = Laya.Handler.create(this,
              function() {
                  i.locking || i.invitefriend.show()
              },
              null, !1),
              this.btn_add_robot = this.container_right.getChildByName("btn_robot");
              var s = 0;
              this.btn_add_robot.clickHandler = Laya.Handler.create(this,
              function() {
                  i.locking || Laya.timer.currTimer < s || (s = Laya.timer.currTimer + 1e3, app.NetAgent.sendReq2Lobby("Lobby", "modifyRoom", {
                      robot_count: i.robot_count + 1
                  },
                  function(t, i) { (t || i.error && 1111 != i.error.code) && e.UIMgr.Inst.showNetReqError("modifyRoom_add", t, i),
                      s = 0
                  }))
              },
              null, !1),
              this.container_right.getChildByName("btn_help").clickHandler = Laya.Handler.create(this,
              function() {
                  i.locking || e.UI_Rules.Inst.show()
              },
              null, !1);
              var h = this.container_right.getChildByName("btn_copy");
              h.on("mouseover", this,
              function() {
                  i.mousein_copy = !0
              }),
              h.on("mouseout", this,
              function() {
                  i.mousein_copy = !1
              }),
              h.clickHandler = Laya.Handler.create(this,
              function() {
                  i.popout.visible || (GameMgr.Inst.BehavioralStatistics(12), i.popout.visible = !0, e.UIBase.anim_pop_out(i.popout, null))
              },
              null, !1),
              this.container_rules = this.container_right.getChildByName("container_rules"),
              this.container_rules.visible = !0,
              this.popout = this.me.getChildByName("pop"),
              this.room_link = this.popout.getChildByName("input").getChildByName("txtinput"),
              this.room_link.editable = !1,
              this.btn_copy_link = this.popout.getChildByName("btn_copy"),
              this.btn_copy_link.visible = !1,
              GameMgr.inConch ? (this.btn_copy_link.visible = !0, this.btn_copy_link.clickHandler = Laya.Handler.create(this,
              function() {
                  Laya.PlatformClass.createClass("layaair.majsoul.mjmgr").call("setSysClipboardText", i.room_link.text),
                  e.UIBase.anim_pop_hide(i.popout, Laya.Handler.create(i,
                  function() {
                      i.popout.visible = !1
                  })),
                  e.UI_FlyTips.ShowTips(game.Tools.strOfLocalization(2125))
              },
              null, !1)) : GameMgr.iniOSWebview && (this.btn_copy_link.visible = !0, this.btn_copy_link.clickHandler = Laya.Handler.create(this,
              function() {
                  Laya.Browser.window.wkbridge.callNative("copy2clip", i.room_link.text,
                  function() {}),
                  e.UIBase.anim_pop_hide(i.popout, Laya.Handler.create(i,
                  function() {
                      i.popout.visible = !1
                  })),
                  e.UI_FlyTips.ShowTips(game.Tools.strOfLocalization(2125))
              },
              null, !1)),
              this.popout.visible = !1,
              this.popout.getChildByName("btn_cancel").clickHandler = Laya.Handler.create(this,
              function() {
                  e.UIBase.anim_pop_hide(i.popout, Laya.Handler.create(i,
                  function() {
                      i.popout.visible = !1
                  }))
              },
              null, !1),
              this.invitefriend = new t(this.me.getChildByName("invite_friend"))
          },
          n.prototype.show = function() {
              var t = this;
              game.Scene_Lobby.Inst.change_bg("indoor", !1),
              this.mousein_copy = !1,
              this.beReady = !1,
              this.invitefriend.me.visible = !1,
              this.btn_add_robot.visible = !1,
              this.btn_invite_friend.visible = !1,
              this.pre_choose = null;
              for (l = 0; l < 4; l++) this.player_cells[l].container.visible = l < this.max_player_count;
              for (l = 0; l < this.max_player_count; l++) this._clearCell(l);
              for (l = 0; l < this.players.length; l++) this.players[l].cell_index = l,
              this._refreshPlayerInfo(this.players[l]);
              this.owner_id == GameMgr.Inst.account_id ? (this.btn_ok.skin = this.skin_start, this.refreshAsOwner()) : (this.btn_ok.skin = this.skin_ready, game.Tools.setGrayDisable(this.btn_ok, !1)),
              this.label_rommid.text = this.room_id.toString(),
              this.container_rules.visible = !0;
              for (l = 0; l < this.container_rules.numChildren; l++) this.container_rules.getChildAt(l).visible = !1;
              var i = [];
              i.push(game.Tools.room_mode_desc(this.room_mode.mode));
              var n = this.room_mode.detail_rule;
              if (n) {
                  var a = 5,
                  r = 20;
                  if (null != n.time_fixed && (a = n.time_fixed), null != n.time_add && (r = n.time_add), i.push(a.toString() + "+" + r.toString() + game.Tools.strOfLocalization(2019)), 0 != this.tournament_id) {
                      var o = cfg.tournament.tournaments.get(this.tournament_id);
                      o && i.push(o.name)
                  }
                  if (null != n.init_point && i.push(game.Tools.strOfLocalization(2199) + n.init_point), null != n.fandian && i.push(game.Tools.strOfLocalization(2094) + ":\n" + n.fandian), null != n.dora_count) switch (n.dora_count) {
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
                      i.push(game.Tools.strOfLocalization(2046))
                  }
                  null != n.shiduan && 1 != n.shiduan && i.push(game.Tools.strOfLocalization(2137)),
                  null != n.bianjietishi && 1 != n.bianjietishi && i.push(game.Tools.strOfLocalization(2200)),
                  this.room_mode.mode >= 10 && this.room_mode.mode <= 14 && (null != n.have_zimosun && 1 != n.have_zimosun ? i.push(game.Tools.strOfLocalization(2202)) : i.push(game.Tools.strOfLocalization(2203)))
              }
              this.public_live && i.push("可观战");
              for (l = 0; l < i.length; l++) {
                  var s = this.container_rules.getChildAt(l);
                  s.visible = !0,
                  s.x = 6,
                  s.y = 334 - 68 * (i.length - 1 - l);
                  var h = s.getChildAt(0);
                  h.fontSize = 40,
                  i[l].length <= 5 ? h.fontSize = 40 : i[l].length <= 9 ? h.fontSize = 52.5 - 2.5 * i[l].length: h.fontSize = 30,
                  h.text = i[l]
              }
              this.enable = !0,
              this.locking = !0,
              e.UIBase.anim_alpha_in(this.container_top, {
                  y: -30
              },
              200);
              for (var l = 0; l < this.player_cells.length; l++) e.UIBase.anim_alpha_in(this.player_cells[l].container, {
                  x: 80
              },
              150, 150 + 50 * l, null, Laya.Ease.backOut);
              e.UIBase.anim_alpha_in(this.btn_ok, {},
              100, 600),
              e.UIBase.anim_alpha_in(this.container_right, {
                  x: 20
              },
              100, 500),
              Laya.timer.once(600, this,
              function() {
                  t.locking = !1
              });
              var c = "";
              switch (this.room_mode.mode) {
              case 0:
                  c = "四人一局";
                  break;
              case 1:
                  c = "四人东风";
                  break;
              case 2:
                  c = "四人半庄";
                  break;
              case 4:
                  c = "四人一局";
                  break;
              case 10:
                  c = "三人一局";
                  break;
              case 11:
                  c = "三人东风";
                  break;
              case 12:
                  c = "三人半庄";
                  break;
              case 14:
                  c = "三人一局"
              }
              this.room_link.text = "雀魂友人房" + this.room_id.toString(),
              "" != c && (this.room_link.text += "(" + c + ")"),
              this.room_link.text += ": https://majsoul.union-game.com/0/?room=" + this.room_id
          },
          n.prototype.leaveRoom = function() {
              var t = this;
              this.locking || app.NetAgent.sendReq2Lobby("Lobby", "leaveRoom", {},
              function(i, n) {
                  i || n.error ? e.UIMgr.Inst.showNetReqError("leaveRoom", i, n) : t.hide(Laya.Handler.create(t,
                  function() {
                      e.UI_Lobby.Inst.enable = !0
                  }))
              })
          },
          n.prototype.tryToClose = function(t) {
              var i = this;
              app.NetAgent.sendReq2Lobby("Lobby", "leaveRoom", {},
              function(n, a) {
                  n || a.error ? (e.UIMgr.Inst.showNetReqError("leaveRoom", n, a), t.runWith(!1)) : (i.enable = !1, t.runWith(!0))
              })
          },
          n.prototype.hide = function(t) {
              var i = this;
              this.locking = !0,
              e.UIBase.anim_alpha_out(this.container_top, {
                  y: -30
              },
              150);
              for (var n = 0; n < this.player_cells.length; n++) e.UIBase.anim_alpha_out(this.player_cells[n].container, {
                  x: 80
              },
              150, 0, null);
              e.UIBase.anim_alpha_out(this.btn_ok, {},
              150),
              e.UIBase.anim_alpha_out(this.container_right, {
                  x: 20
              },
              150),
              Laya.timer.once(200, this,
              function() {
                  i.locking = !1,
                  i.enable = !1,
                  t && t.run()
              }),
              document.getElementById("layaCanvas").onclick = null
          },
          n.prototype.onDisbale = function() {
              Laya.timer.clearAll(this);
              for (var e = 0; e < this.player_cells.length; e++) Laya.loader.clearTextureRes(this.player_cells[e].illust.skin);
              document.getElementById("layaCanvas").onclick = null
          },
          n.prototype.switchReady = function() {
              this.owner_id != GameMgr.Inst.account_id && (this.beReady = !this.beReady, this.btn_ok.skin = this.beReady ? this.skin_cancel: this.skin_ready, app.NetAgent.sendReq2Lobby("Lobby", "readyPlay", {
                  ready: this.beReady
              },
              function(e, t) {}))
          },
          n.prototype.getStart = function() {
              this.owner_id == GameMgr.Inst.account_id && (Laya.timer.currTimer < this.last_start_room + 2e3 || (this.last_start_room = Laya.timer.currTimer, app.NetAgent.sendReq2Lobby("Lobby", "startRoom", {},
              function(t, i) { (t || i.error) && e.UIMgr.Inst.showNetReqError("startRoom", t, i)
              })))
          },
          n.prototype.kickPlayer = function(t) {
              if (this.owner_id == GameMgr.Inst.account_id) {
                  var i = this.players[t];
                  1 == i.category ? app.NetAgent.sendReq2Lobby("Lobby", "kickPlayer", {
                      account_id: this.players[t].account_id
                  },
                  function(e, t) {}) : 2 == i.category && (this.pre_choose = i, app.NetAgent.sendReq2Lobby("Lobby", "modifyRoom", {
                      robot_count: this.robot_count - 1
                  },
                  function(t, i) { (t || i.error) && e.UIMgr.Inst.showNetReqError("modifyRoom_minus", t, i)
                  }))
              }
          },
          n.prototype._clearCell = function(e) {
              if (! (e < 0 || e >= this.player_cells.length)) {
                  var t = this.player_cells[e];
                  t.container_flag.visible = !1,
                  t.container_illust.visible = !1,
                  t.name.visible = !1,
                  t.container_name.visible = !1,
                  t.btn_t.visible = !1,
                  t.host.visible = !1
              }
          },
          n.prototype._refreshPlayerInfo = function(e) {
              var t = e.cell_index;
              if (! (t < 0 || t >= this.player_cells.length)) {
                  var i = this.player_cells[t];
                  i.container_illust.visible = !0,
                  i.container_name.visible = !0,
                  i.name.visible = !0,
                  i.name.text = e.nickname,
                  i.btn_t.visible = this.owner_id == GameMgr.Inst.account_id && e.account_id != GameMgr.Inst.account_id,
                  this.owner_id == e.account_id && (i.container_flag.visible = !0, i.host.visible = !0),
                  i.illust.setSkin(e.avatar_id, "waitingroom"),
                  i.title.id = e.title,
                  i.rank.id = e.level.id,
                  this._onPlayerReadyChange(e)
              }
          },
          n.prototype._onPlayerReadyChange = function(e) {
              var t = e.cell_index;
              if (! (t < 0 || t >= this.player_cells.length)) {
                  var i = this.player_cells[t];
                  this.owner_id == e.account_id ? i.container_flag.visible = !0 : i.container_flag.visible = e.ready,
                  this.refreshStart()
              }
          },
          n.prototype.refreshAsOwner = function() {
              if (this.owner_id == GameMgr.Inst.account_id) {
                  for (var e = 0,
                  t = 0; t < this.players.length; t++) 0 != this.players[t].category && (this._refreshPlayerInfo(this.players[t]), e++);
                  this.btn_add_robot.visible = !0,
                  this.btn_invite_friend.visible = !0,
                  game.Tools.setGrayDisable(this.btn_add_robot, e == this.max_player_count),
                  this.refreshStart()
              }
          },
          n.prototype.refreshStart = function() {
              if (this.owner_id == GameMgr.Inst.account_id) {
                  this.btn_ok.skin = this.skin_start;
                  for (var e = 0,
                  t = 0; t < this.players.length; t++) if (0 != this.players[t].category && (!this.players[t] || this.players[t].account_id != this.owner_id)) {
                      if (!this.players[t] || null == this.players[t].ready || void 0 == this.players[t].ready || !this.players[t].ready) return void game.Tools.setGrayDisable(this.btn_ok, !0);
                      e++
                  }
                  game.Tools.setGrayDisable(this.btn_ok, e + 1 != this.max_player_count)
              }
          },
          n.prototype.onGameStart = function(e) {
              game.Tools.setGrayDisable(this.btn_ok, !0),
              this.enable = !1,
              game.MJNetMgr.Inst.OpenConnect(e.game_url, e.connect_token, e.game_uuid, !1, null)
          },
          n.Inst = null,
          n
      } (e.UIBase);
      e.UI_WaitingRoom = i
    } (uiscript || (uiscript = {}));
    },5000)
    }(), 100 )
    
    
    
    
    
    
    
    
    
    
    
    
    
    