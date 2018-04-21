define(["plugins", "PoE/Geom/Bounds", "PoE/Geom/Point", "./ObjectList", "./EventContainer", "./PassiveAllocation", "./JewelAllocation", "./Stats", "./Node", "./Group", "./Tile", "./Clickable", "./PathHighlighterGroup", "./Popup", "./BFS/NodeData", "./ByteDecoder", "./ByteEncoder", "./NodeHighlighter/NodeHighlighter", "./NodeHighlighter/AnimationType", "./NodeHighlighter/NodeHighlighterGroup", "./RGBA", "PoE/Helpers", "PoE/Item/Item", "PoE/Backbone/Model/Item/Item", "jquery.mousewheel"], function(e, t, n, r, i, s, o, u, a, f, l, c, h, p, d, v, m, g, y, b, w, E, S, x) {
    var T = function(m, y, w, S, x, N, C, k) {
        this.init = function() {
            this.containerEl = e("#" + m);
            if (!this.isCanvasSupported()) {
                this.containerEl.append('<h1 class="error">The Passive Skill Tree requires a browser that supports canvas.</h1><p class="error m-pad">If you are running Internet Explorer you need at least version 9. If you are running Internet Explorer 9 and get this message, please make sure compatibility view is disabled.<br /><br />You may need to upgrade your browser. Some other browsers that work with the passive skill tree are: <a href="https://www.google.com/chrome/">Chrome</a>, <a href="http://www.mozilla.org/firefox/">Firefox</a>, <a href="http://www.apple.com/safari/">Safari</a> and <a href="http://www.opera.com/download/">Opera</a>.</p>');
                return
            }
            var a = this;
            this.fullscreenContainerEl = e("#" + y);
            if (!k || !k.events || !k.events.fullscreen)
                this.containerEl.width(w),
                this.containerEl.height(S);
            this.totW = 1e3,
            this.totH = 1e3,
            this.xshift = Math.ceil(this.totW / 2),
            this.yshift = Math.ceil(this.totH / 2),
            this.accountName = !1,
            this.characterName = !1,
            this.characterClass = !1,
            this.ascendancyClass = !1,
            this.ascendancyClasses = k.ascClasses,
            this.ascendancyClassPopupHidden = !0,
            this.ascendancyStartNode = !1,
            this.ascendancyButton = {
                state: "PassiveSkillScreenAscendancyButton",
                clickable: !1
            },
            this.initialWidth = w,
            this.initialHeight = S,
            this.canvas = document.createElement("canvas"),
            this.lastQuery = "",
            !k || !k.events || !k.events.fullscreen ? (this.canvas.width = w,
            this.canvas.height = S) : (this.canvas.width = window.innerWidth,
            this.canvas.height = window.innerHeight),
            this.containerEl.append(this.canvas),
            this.$window = e(window),
            this.$bodyEl = e("body"),
            this.$canvas = e(this.canvas),
            this.$canvas.attr("id", "skillTreeMainCanvas"),
            this.ctx = this.canvas.getContext("2d"),
            this.midCanvas = document.createElement("canvas"),
            this.containerEl.append(this.midCanvas),
            this.$midCanvas = e(this.midCanvas),
            this.$midCanvas.attr("id", "skillTreeMidCanvas"),
            this.midCanvas.width = this.canvas.width,
            this.midCanvas.height = this.canvas.height,
            this.midCtx = this.midCanvas.getContext("2d"),
            this.topCanvas = document.createElement("canvas"),
            this.$topCanvas = e(this.topCanvas),
            this.$topCanvas.attr("id", "skillTreeTopCanvas"),
            this.containerEl.append(this.topCanvas),
            this.topCanvas.width = this.canvas.width,
            this.topCanvas.height = this.canvas.height,
            this.topCtx = this.topCanvas.getContext("2d"),
            this.scaleFactor = this.canvas.height / 1600,
            this.fps = 30,
            this.skillsPerOrbit = [1, 6, 12, 12, 40],
            this.orbitRadii = [0, 82, 162, 335, 493],
            this.nodeRadius = 51,
            this.nodeRadiusKeystone = 109,
            this.nodeRadiusNotable = 70,
            this.nodeRadiusJewel = 70,
            this.nodeRadiusMastery = 107,
            this.nodeRadiusClassStart = 200,
            this.groups = {},
            this.nodes = {},
            this.extent = new t,
            this.tileSize = 512,
            this.tiles = [],
            this.finalDrawFuncs = [],
            this.popupId = 0,
            this.popups = {},
            this.assets = {},
            this.characterData = C.characterData,
            this.constants = C.constants,
            this.imageZoomLevels = C.imageZoomLevels,
            this.skillSprites = C.skillSprites,
            this.characterClassToStartNode = {},
            this.ascendancyClassToStartNode = {},
            this.readonly = !1,
            this.fullScreen = !0,
            this.errorMessage = null ,
            this.settings = {
                highlightSimilarNodes: !1,
                highlightShortestPaths: !0,
                enableSound: !1
            },
            this.mousePos = new n(-1,-1),
            this.midDrawObjects = new r,
            this.events = {
                classChosen: function() {},
                historyUrlSet: function(e) {},
                pointsChanged: new i,
                onload: function() {},
                onFullScreenUpdate: function() {},
                onFullScreenBegin: function() {},
                onFullScreenEnd: function() {}
            },
            this.characterAttributes = [0, 0, 0],
            this.searchHighlighter = null ,
            this.initializationComplete = e.Deferred(),
            this.loadCounter = 0,
            k && (k.events && (k.events.classChosen && (this.events.classChosen = k.events.classChosen),
            k.events.historyUrlSet && (this.events.historyUrlSet = k.events.historyUrlSet),
            k.events.pointsChanged && this.events.pointsChanged.add(k.events.pointsChanged),
            k.events.onload && (this.events.onload = k.events.onload),
            k.events.onFullScreenUpdate && (this.events.onFullScreenUpdate = k.events.onFullScreenUpdate),
            k.events.onFullScreenBegin && (this.events.onFullScreenBegin = k.events.onFullScreenBegin),
            k.events.onFullScreenEnd && (this.events.onFullScreenEnd = k.events.onFullScreenEnd)),
            k.readonly && (this.readonly = !0)),
            this.passiveAllocation = new s(this),
            this.passiveAllocation.passiveAllocated = function(e) {
                a.drawState.dirty = !0,
                a.drawState.topDirty = !0,
                a.stats.addAttribute(a.constants.characterAttributes.Strength, e.sa),
                a.stats.addAttribute(a.constants.characterAttributes.Dexterity, e.da),
                a.stats.addAttribute(a.constants.characterAttributes.Intelligence, e.ia)
            }
            ,
            this.passiveAllocation.passiveUnallocated = function(e) {
                a.drawState.dirty = !0,
                a.drawState.topDirty = !0,
                a.stats.subAttribute(a.constants.characterAttributes.Strength, e.sa),
                a.stats.subAttribute(a.constants.characterAttributes.Dexterity, e.da),
                a.stats.subAttribute(a.constants.characterAttributes.Intelligence, e.ia)
            }
            ,
            this.jewelAllocation = new o(this),
            this.jewelAllocation.jewelAllocated = function(e) {
                a.drawState.dirty = !0,
                a.drawState.topDirty = !0
            }
            ,
            this.jewelAllocation.jewelUnallocated = function(e) {
                a.drawState.dirty = !0,
                a.drawState.topDirty = !0
            }
            ,
            this.stats = new u,
            this.stats.statsChanged = function() {}
            ,
            this.drawState = {
                dirty: !0,
                topDirty: !0,
                dirtyFullRedraw: !0,
                cancelInProgress: !1,
                active: !1,
                idle: !0,
                lastFrame: null 
            },
            this.worldToView = function(e) {}
            ;
            var f = this.initAssets();
            a.initLoadingRenderLoop(),
            f.done(function() {
                a.initGraph(),
                a.initViewPort(),
                a.initListeners(),
                a.initKeyListeners(),
                a.initMouseListeners(),
                a.initTileGrid(),
                a.setCharacterClass(x),
                a.loadBaseCharacterAttributes(),
                a.endLoadingRenderLoop(),
                a.events.pointsChanged.trigger(),
                a.events.onload(),
                a.initRenderLoop(),
                a.initializationComplete.resolve()
            }),
            window.onpopstate = function(e) {
                if (e.state === null )
                    return;
                a.loadStateFromUrl()
            }
        }
        ,
        this.toggleFullScreen = function(e) {
            if (window.top.location != document.location) {
                if (this.fullScreen)
                    return;
                this.fullScreen = !0
            } else
                this.fullScreen = !this.fullScreen;
            this.$bodyEl.css("overflow", this.fullScreen ? "hidden" : "visible"),
            this.updateCanvasSize(),
            this.fullScreen ? (this.fullscreenContainerEl.append(this.canvas).append(this.midCanvas).append(this.topCanvas),
            this.events.onFullScreenBegin()) : (this.containerEl.append(this.canvas).append(this.midCanvas).append(this.topCanvas),
            this.events.onFullScreenEnd()),
            e || this.pushHistoryState()
        }
        ,
        this.updateCanvasSize = function() {
            if (this.fullScreen) {
                var e = this.events.onFullScreenUpdate() || {
                    top: "0px",
                    left: "0px",
                    width: this.$window.width(),
                    height: this.$window.height()
                };
                this.$canvas.css("position", "fixed").css("top", e.top).css("left", e.left),
                this.$midCanvas.css("position", "fixed").css("top", e.top).css("left", e.left),
                this.$topCanvas.css("position", "fixed").css("top", e.top).css("left", e.left),
                this.canvas.width = e.width,
                this.canvas.height = e.height,
                this.midCanvas.width = e.width,
                this.midCanvas.height = e.height,
                this.topCanvas.width = e.width,
                this.topCanvas.height = e.height
            } else
                this.$canvas.css("position", "absolute"),
                this.$midCanvas.css("position", "absolute"),
                this.$topCanvas.css("position", "absolute"),
                this.canvas.width = this.initialWidth,
                this.canvas.height = this.initialHeight,
                this.midCanvas.width = this.initialWidth,
                this.midCanvas.height = this.initialHeight,
                this.topCanvas.width = this.initialWidth,
                this.topCanvas.height = this.initialHeight;
            this.forceMouseOut(),
            this.initTileGrid(),
            this.viewPort.recalcBounds(),
            this.drawState.dirtyFullRedraw = !0,
            this.drawState.dirty = !0,
            this.drawState.topDirty = !0
        }
        ,
        this.isCanvasSupported = function() {
            var e = document.createElement("canvas");
            return !!e.getContext && !!e.getContext("2d")
        }
        ,
        this.isAudioSupported = function() {
            var e = document.createElement("audio");
            return e.canPlayType && e.canPlayType('audio/ogg; codecs="vorbis"')
        }
        ,
        this.isHistorySupported = function() {
            return !!window.history && !!history.pushState
        }
        ,
        this.loadStateFromUrl = function() {
            var e = window.location.href
              , t = this;
            this.initializationComplete.done(function() {
                if (window.location.search != "") {
                    var n = E.getUrlParameter("accountName")
                      , r = E.getUrlParameter("characterName");
                    n && r && (t.accountName = n,
                    t.characterName = r),
                    e = e.substring(0, e.indexOf(window.location.search))
                }
                var i = e.split("/")
                  , s = i[i.length - 1]
                  , o = i[i.length - 2];
                if (s == "passive-skill-tree" || s == "" && o == "passive-skill-tree")
                    return;
                t.loadHistoryUrl(s == "" ? o : s)
            })
        }
        ,
        this.loadBaseCharacterAttributes = function() {
            this.stats.setAttribute(this.constants.characterAttributes.Strength, this.characterData[this.characterClass].base_str),
            this.stats.setAttribute(this.constants.characterAttributes.Dexterity, this.characterData[this.characterClass].base_dex),
            this.stats.setAttribute(this.constants.characterAttributes.Intelligence, this.characterData[this.characterClass].base_int)
        }
        ,
        this.pushHistoryState = function() {
            if (!this.isHistorySupported())
                return;
            var e = this.getHistoryUrl();
            window.history.pushState({}, "", e),
            this.events.historyUrlSet(e)
        }
        ,
        this.fullRedraw = function() {
            this.drawState.dirty = !0,
            this.drawState.dirtyFullRedraw = !0
        }
        ,
        this.reset = function(e) {
            this.passiveAllocation.reset(),
            e && e.characterClass >= 0 && this.setCharacterClass(e.characterClass, e.ascendancyClass),
            this.lastQuery && this.lastQuery != "" && this.highlightSearchQuery(this.lastQuery),
            this.pushHistoryState(),
            this.fullRedraw()
        }
        ,
        this.setCharacterClass = function(e, t) {
            this.characterClass = e,
            t || (t = 0),
            this.setAscendancyClass(t),
            this.startNode && (this.startNode.active = !1),
            this.ascendancyStartNode && (this.ascendancyStartNode.active = !1),
            this.startNode = this.characterClassToStartNode[e],
            this.startNode.active = !0,
            this.ascendancyClass && this.ascendancyClass > 0 && (this.ascendancyStartNode = this.ascendancyClassToStartNode[this.ascendancyClassName()],
            this.ascendancyStartNode.active = !0),
            this.viewPort.setPosition(this.getNodePositionInfo(this.startNode).position),
            this.loadBaseCharacterAttributes(),
            this.events.classChosen(e)
        }
        ,
        this.setAscendancyClass = function(e) {
            this.ascendancyClass = e,
            e <= 0 && (this.ascendancyClassPopupHidden = !0)
        }
        ,
        this.loadCharacterData = function(e, t, n) {
            this.passiveAllocation.reset(),
            this.setCharacterClass(e, t),
            this.passiveAllocation.loadHashArray(n),
            this.jewelAllocation.loadJewels(this),
            this.events.historyUrlSet(this.getHistoryUrl()),
            this.fullRedraw()
        }
        ,
		this.drawArc2 = function(e, t, s, n, r, i) {
			e.beginPath();
			e.lineWidth = this.viewPort.zoom*10;
			if (s == "Active") {
				e.strokeStyle="#7d7c03";
				e.lineWidth = e.lineWidth * 2;
			} else {
				e.strokeStyle="#3D3C1B";
			}
			e.arc(n.x, n.y, t, r, i);
			e.stroke();
		},
        this.drawArc = function(e, t, n, r, i, s) {
            var o = i - r
              , u = o / (Math.PI / 2)
              , a = o;
            e.save(),
            e.translate(Math.round(n.x), Math.round(n.y)),
            e.scale(s, s),
            e.rotate(-Math.PI),
            e.rotate(r);
            for (var f = 0, l = Math.ceil(u); f < l; ++f) {
                if (a < Math.PI / 2) {
                    e.beginPath(),
                    e.lineWidth = 4,
                    e.fillStyle = "rgba(200,0,0,.5)",
                    e.strokeStyle = "rgba(150,150,0,.8)",
                    e.moveTo(0, 0),
                    e.arc(0, 0, t.width, Math.PI, a + Math.PI, !1),
                    e.clip(),
                    e.drawImage(t, 0, 0, t.width, t.height, -t.width, -t.height, t.width, t.height);
                    continue
                }
                e.drawImage(t, 0, 0, t.width, t.height, -t.width, -t.height, t.width, t.height),
                e.rotate(Math.PI / 2),
                a -= Math.PI / 2
            }
            e.restore()
        }
        ,
        this.drawStraightPath2 = function(e, t, n, r) {
			e.beginPath();
			e.lineWidth=this.viewPort.zoom*10;
			if (t == "Active") {
				e.strokeStyle="#7d7c03";
				e.lineWidth = e.lineWidth * 2;
			} else {
				e.strokeStyle="#3D3C1B";
			}
			e.moveTo(n.x, n.y);
			e.lineTo(r.x, r.y);
			e.stroke();
		}
		,
        this.drawStraightPath = function(e, t, n, r, i, s, o) {
            var u = function(e, t, n) {
                return (1 - e) * t.x + e * n.x
            }
              , a = function(e, t, n) {
                return (1 - e) * t.y + e * n.y
            }
              , f = n.distTo(r)
              , l = t.width * i
              , c = f
              , h = f / l
              , p = 1 / h
              , d = n.angleTo(r)
              , v = 0;
            for (var m = 0, g = Math.ceil(h); m < g; ++m) {
                var y = t.width;
                c < l && (y *= c / l),
                e.save(),
                e.translate(Math.round(u(v, n, r)), Math.round(a(v, n, r))),
                e.scale(i, i),
                e.rotate(d),
                e.drawImage(t, 0, Math.round(-(t.height / 2)), Math.round(y), t.height),
                e.restore(),
                v += p,
                c -= l
            }
            if (false && s !== undefined) {
                var b = s.height * i
                  , w = Math.round(s.width * i)
                  , E = Math.round(b / 2);
                b = Math.round(b),
                e.save(),
                e.translate(Math.round(n.x), Math.round(n.y)),
                e.rotate(d),
                e.drawImage(s, o, -E, w, b),
                e.restore(),
                e.save(),
                e.translate(Math.round(r.x), Math.round(r.y)),
                e.rotate(d + Math.PI),
                e.drawImage(s, o, -E, w, b),
                e.restore()
            }
        }
        ,
        this.initAssets = function() {
            var t = []
              , n = this
              , r = function(e, r) {
                var i = n.loadWaitAsset(e, r);
                ++n.loadCounter,
                i.done(function() {
                    --n.loadCounter
                }),
                t.push(i)
            }
            ;
            r(C.assets.PSSkillFrame, "PSSkillFrame"),
            r(C.assets.PSSkillFrameHighlighted, "PSSkillFrameHighlighted"),
            r(C.assets.PSSkillFrameActive, "PSSkillFrameActive"),
            r(C.assets.PSGroupBackground1, "PSGroupBackground1"),
            r(C.assets.PSGroupBackground2, "PSGroupBackground2"),
            r(C.assets.PSGroupBackground3, "PSGroupBackground3"),
            r(C.assets.KeystoneFrameUnallocated, "KeystoneFrameUnallocated"),
            r(C.assets.KeystoneFrameCanAllocate, "KeystoneFrameCanAllocate"),
            r(C.assets.KeystoneFrameAllocated, "KeystoneFrameAllocated"),
            //r(C.assets.Orbit1Normal, "Orbit1Normal"),
            //r(C.assets.Orbit1Intermediate, "Orbit1Intermediate"),
            //r(C.assets.Orbit1Active, "Orbit1Active"),
            //r(C.assets.Orbit2Normal, "Orbit2Normal"),
            //r(C.assets.Orbit2Intermediate, "Orbit2Intermediate"),
            //r(C.assets.Orbit2Active, "Orbit2Active"),
            //r(C.assets.Orbit3Normal, "Orbit3Normal"),
            //r(C.assets.Orbit3Intermediate, "Orbit3Intermediate"),
            //r(C.assets.Orbit3Active, "Orbit3Active"),
            //r(C.assets.Orbit4Normal, "Orbit4Normal"),
            //r(C.assets.Orbit4Intermediate, "Orbit4Intermediate"),
            //r(C.assets.Orbit4Active, "Orbit4Active"),
            //r(C.assets.LineConnectorNormal, "LineConnectorNormal"),
            //r(C.assets.LineConnectorIntermediate, "LineConnectorIntermediate"),
            //r(C.assets.LineConnectorActive, "LineConnectorActive"),
            //r(C.assets.PSLineDeco, "PSLineDeco"),
            //r(C.assets.PSLineDecoHighlighted, "PSLineDecoHighlighted"),
            r(C.assets.PSStartNodeBackgroundInactive, "PSStartNodeBackgroundInactive"),
            r(C.assets.centerduelist, "centerduelist"),
            r(C.assets.centermarauder, "centermarauder"),
            r(C.assets.centerranger, "centerranger"),
            r(C.assets.centershadow, "centershadow"),
            r(C.assets.centertemplar, "centertemplar"),
            r(C.assets.centerwitch, "centerwitch"),
            r(C.assets.centerscion, "centerscion"),
            r(C.assets.Background1, "Background1"),
            r(C.assets.NotableFrameUnallocated, "NotableFrameUnallocated"),
            r(C.assets.NotableFrameCanAllocate, "NotableFrameCanAllocate"),
            r(C.assets.NotableFrameAllocated, "NotableFrameAllocated"),
            r(C.assets.JewelFrameUnallocated, "JewelFrameUnallocated"),
            r(C.assets.JewelFrameCanAllocate, "JewelFrameCanAllocate"),
            r(C.assets.JewelFrameAllocated, "JewelFrameAllocated");
            //r(C.assets.JewelSocketActiveBlue, "JewelSocketActiveBlue"),
            //r(C.assets.JewelSocketActiveGreen, "JewelSocketActiveGreen"),
            //r(C.assets.JewelSocketActiveRed, "JewelSocketActiveRed");
            var i = ["PassiveSkillScreenAscendancyButton", "PassiveSkillScreenAscendancyButtonHighlight", "PassiveSkillScreenAscendancyButtonPressed", "PassiveSkillScreenAscendancyFrameLargeAllocated", "PassiveSkillScreenAscendancyFrameLargeCanAllocate", "PassiveSkillScreenAscendancyFrameLargeNormal", "PassiveSkillScreenAscendancyFrameSmallAllocated", "PassiveSkillScreenAscendancyFrameSmallCanAllocate", "PassiveSkillScreenAscendancyFrameSmallNormal", "PassiveSkillScreenAscendancyMiddle"];
            for (var s in this.ascendancyClasses)
                for (var o in this.ascendancyClasses[s].classes)
                    i.push("Classes" + this.ascendancyClasses[s].classes[o].name);
            for (var u in i)
                i.hasOwnProperty(u) && r(C.assets[i[u]], i[u]);
            r(C.assets.PSPointsFrame, "PSPointsFrame"),
            r(C.assets.imgPSFadeCorner, "imgPSFadeCorner"),
            r(C.assets.imgPSFadeSide, "imgPSFadeSide");
            for (var a in this.skillSprites) {
                C.assets[a] = {};
                //for (var s = 0, f = this.skillSprites[a].length; s < f; ++s)
                //    C.assets[a][this.imageZoomLevels[s]] = C.imageRoot + "/build-gen/passive-skill-sprite/" + this.skillSprites[a][s].filename;
				for (var s = 0; s < this.imageZoomLevels.length; ++s)
					C.assets[a][this.imageZoomLevels[s]] = C.imageRoot + "/build-gen/passive-skill-sprite/" + this.skillSprites[a][this.skillSprites[a].length-1].filename;
                r(C.assets[a], a)
            }
            return e.when.apply(null , t)
        }
        ,
        this.loadWaitAsset = function(t, n) {
            var r = this
              , i = function(t, n, i) {
                var s = new Image
                  , o = e.Deferred();
                return s.onload = function() {
                    i === undefined ? r.assets[n] = s : (r.assets[n] === undefined && (r.assets[n] = {}),
                    r.assets[n][i] = s),
                    o.resolve()
                }
                ,
                s.src = t,
                o.promise()
            }
            ;
            if (typeof t == "object") {
                var s = [];
                for (var o in t) {
					if (o == 0.1246 || o == 0.2109 || o == 0.2972)
						continue;
                    s.push(i(t[o], n, o));
				}
                return e.when.apply(null , s)
            }
            return i(t, n)
        }
        ,
        this.endLoadingRenderLoop = function() {
            clearInterval(this.loadingRenderLoopIntervalId)
        }
        ,
        this.initLoadingRenderLoop = function() {
            var e = this
              , t = this.loadCounter;
            this.loadingRenderLoopIntervalId = setInterval(function() {
                var n = t == 0 ? 1 : (t - e.loadCounter) / t;
                e.drawLoading(n)
            }, 1e3 / this.fps)
        }
        ,
        this.initRenderLoop = function() {
            var e = this;
            setInterval(function() {
                e.draw()
            }, 1e3 / this.fps)
        }
        ,
        this.initGraph = function() {
            this.rootNode = new a(C.root);
            for (var e = 0, t = C.nodes.length; e < t; ++e) {
                var r = C.nodes[e]
                  , i = new a(r);
                this.addNode(i);
                if (this.startNode === undefined)
                    for (var s = 0, o = i.startPositionClasses.length; s < o; ++s) {
                        var u = i.startPositionClasses[s];
                        this.characterClassToStartNode[u] = i,
                        u === this.characterClass && (this.startNode = i,
                        i.active = !0)
                    }
                i.isAscendancyStartNode && (this.ascendancyClassToStartNode[i.ascendancyName] = i,
                this.ascendancyClassName() && this.ascendancyClassName() == i.ascendancyName && (this.ascendancyStartNode = i))
            }
            for (var s = 0, o = C.root.out.length; s < o; ++s)
                this.rootNode.addOutNode(this.getNode(C.root.out[s]));
            for (var e = 0, t = C.nodes.length; e < t; ++e) {
                var r = C.nodes[e]
                  , i = this.getNode(r.id);
                for (var s = 0, o = r.out.length; s < o; ++s)
                    i.addOutNode(this.getNode(r.out[s]))
            }
            for (var l in C.groups) {
                var c = C.groups[l]
                  , h = new f(l,new n(c.x,c.y),c.oo);
                for (var e = 0, t = c.n.length; e < t; ++e) {
                    var i = this.getNode(c.n[e]);
                    i.isAscendancy && (h.isAscendancy = !0,
                    h.ascendancyName = i.ascendancyName),
                    h.addNode(i)
                }
                this.addGroup(h)
            }
            this.extent.tl.x = C.min_x,
            this.extent.tl.y = C.min_y,
            this.extent.br.x = C.max_x,
            this.extent.br.y = C.max_y,
            this.extent.grow(this.getOrbitRadius(4) * 3),
            this.defaultExtent = this.extent.clone()
        },
		this.in_array = function(needle, haystack) {
			var found = 0;
			for (var i=0, len=haystack.length;i<len;i++) {
				if (haystack[i] == needle) return i;
					found++;
			}
			return -1;
		},
        this.FindOrphanedNodes = function(e) {
			var ss = [];
			var ss2 = [this.startNode.id];
			while(id = ss2.pop()) {
				var n = this.nodes[id];
				for (var t in n.inNodes) {
					if (t == "null")
						continue;
					if (t == e.id)
						continue;
					if (this.in_array(t, ss) != -1)
						continue;
					if (this.passiveAllocation.allocatedSkills[t]) {
						ss.push(t);
						ss2.push(t);
					}
				}
				for (var t in n.outNodes) {
					if (t == "null")
						continue;
					if (t == e.id)
						continue;
					if (this.in_array(t, ss) != -1)
						continue;
					if (this.passiveAllocation.allocatedSkills[t]) {
						ss.push(t);
						ss2.push(t);
					}
				}
			}
			var ss3 = [];
			for (var t in this.passiveAllocation.allocatedSkills) {
				if (this.in_array(t, ss) == -1) {
					ss3.push(t);
				}
			}
			return ss3;
		},
        this.getShortestPathsFromActiveNodes = function(e) {
            var t = this.characterClassToStartNode[this.characterClass]
              , n = this
              , r = -1
              , i = []
              , s = function(t) {
                n.visitBFS(t, function(t) {
                    return t === e
                }, function(e) {
                    return !n.passiveAllocation.isAllocated(e) && !e.isClassStartNode
                }, function(e, t) {
                    i.push({
                        goalNodeData: e,
                        nodeRelationshipData: t
                    });
                    if (r == -1 || e.depth < r)
                        r = e.depth;
                    for (var n = i.length - 1; n >= 0; --n)
                        i[n].goalNodeData.depth > r && i.splice(n, 1)
                })
            };
            return s(this.startNode),
            this.passiveAllocation.foreachAllocatedSkill(s),
            i
        }
        ,
        this.recalculateExtent = function() {
            this.extent = this.defaultExtent.clone();
            var e = this.canvas.width / this.viewPort.zoom
              , t = this.canvas.height / this.viewPort.zoom;
            this.extent.width() < e && this.extent.width(e),
            this.extent.height() < t && this.extent.height(t),
            this.extent.centerAt(new n)
        }
        ,
        this.initTileGrid = function() {
            this.grid = {},
            this.grid.xTiles = Math.ceil(this.extent.width() * this.viewPort.zoom / this.tileSize) + 1,
            this.grid.yTiles = Math.ceil(this.extent.height() * this.viewPort.zoom / this.tileSize) + 1,
            this.grid.tiles = [];
            for (var e = 0; e < this.grid.yTiles; ++e) {
                this.grid.tiles[e] = [];
                for (var t = 0; t < this.grid.xTiles; ++t)
                    this.grid.tiles[e][t] = new l
            }
        }
        ,
        this.calcTileGrid = function() {
            this.grid.lExtentToLVisGridOffsetPx = (this.viewPort.bounds.tl.x - this.extent.tl.x) * this.viewPort.zoom,
            this.grid.tExtentToTVisGridOffsetPx = (this.viewPort.bounds.tl.y - this.extent.tl.y) * this.viewPort.zoom,
            this.grid.lExtentToRVisGridOffsetPx = (this.viewPort.bounds.br.x - this.extent.tl.x) * this.viewPort.zoom,
            this.grid.tExtentToBVisGridOffsetPx = (this.viewPort.bounds.br.y - this.extent.tl.y) * this.viewPort.zoom,
            this.grid.lExtentToLVisGridOffsetTiles = this.grid.lExtentToLVisGridOffsetPx / this.tileSize,
            this.grid.tExtentToTVisGridOffsetTiles = this.grid.tExtentToTVisGridOffsetPx / this.tileSize,
            this.grid.lExtentToRVisGridOffsetTiles = this.grid.lExtentToRVisGridOffsetPx / this.tileSize,
            this.grid.tExtentToBVisGridOffsetTiles = this.grid.tExtentToBVisGridOffsetPx / this.tileSize,
            this.grid.visGridWidthTiles = this.grid.lExtentToRVisGridOffsetTiles - this.grid.lExtentToLVisGridOffsetTiles,
            this.grid.visGridHeightTiles = this.grid.tExtentToBVisGridOffsetTiles - this.grid.tExtentToTVisGridOffsetTiles,
            this.grid.visGridStartXTilePos = Math.floor(this.grid.lExtentToLVisGridOffsetTiles),
            this.grid.visGridStartYTilePos = Math.floor(this.grid.tExtentToTVisGridOffsetTiles),
            this.grid.visGridXTileviewPortShift = this.grid.lExtentToLVisGridOffsetTiles - this.grid.visGridStartXTilePos,
            this.grid.visGridYTileviewPortShift = this.grid.tExtentToTVisGridOffsetTiles - this.grid.visGridStartYTilePos,
            this.grid.drawTileW = Math.ceil(this.grid.visGridWidthTiles) + Math.ceil(this.grid.visGridXTileviewPortShift),
            this.grid.drawTileH = Math.ceil(this.grid.visGridHeightTiles) + Math.ceil(this.grid.visGridYTileviewPortShift),
            this.grid.visGridXviewPortShift = this.grid.visGridXTileviewPortShift * this.tileSize,
            this.grid.visGridYviewPortShift = this.grid.visGridYTileviewPortShift * this.tileSize
        }
        ,
        this.initViewPort = function() {
			var zoomDefaultIndex = N.length -1;
            this.viewPort = {
                skillTree: this,
                position: new n,
                bounds: new t,
                moveStartView: null ,
                moveStartWorld: null ,
                zoomLevels: N,
                zoomIndex: 0,
                zoom: N[0],
				zoomDefaultIndex: zoomDefaultIndex,
				zoomDefault: N[zoomDefaultIndex]
            };
            var e = this;
            this.viewPort.zoomIn = function() {
                if (this.zoomIndex == this.zoomLevels.length - 1)
                    return;
                ++this.zoomIndex,
                this.zoom = this.zoomLevels[this.zoomIndex],
                this.recalcBounds()
            }
            ,
            this.viewPort.zoomOut = function() {
                if (this.zoomIndex <= 0)
                    return;
                --this.zoomIndex,
                this.zoom = this.zoomLevels[this.zoomIndex],
                this.recalcBounds()
            }
            ,
            this.viewPort.recalcBounds = function() {
                var t = !1;
                this.skillTree.recalculateExtent(),
                this.bounds.width(this.skillTree.canvas.width / this.zoom),
                this.bounds.height(this.skillTree.canvas.height / this.zoom),
                this.bounds.centerAt(this.position),
                this.bounds.br.x > e.extent.br.x && (this.position.x = e.extent.br.x - this.bounds.width() / 2,
                t = !0),
                this.bounds.br.y > e.extent.br.y && (this.position.y = e.extent.br.y - this.bounds.height() / 2,
                t = !0),
                this.bounds.tl.x < e.extent.tl.x && (this.position.x = e.extent.tl.x + this.bounds.width() / 2,
                t = !0),
                this.bounds.tl.y < e.extent.tl.y && (this.position.y = e.extent.tl.y + this.bounds.height() / 2,
                t = !0),
                t && this.bounds.centerAt(this.position)
            }
            ,
            this.viewPort.beginMove = function(e, t) {
                this.moveStartView = new n(e,t),
                this.moveStartWorld = this.position.clone()
            }
            ,
            this.viewPort.endMove = function() {
                this.moveStartView = null ,
                this.moveStartWorld = null 
            }
            ,
            this.viewPort.updateMove = function(e, t) {
                return this.moveStartView === null  || this.moveStartView.x == e && this.moveStartView.y == t ? !1 : (this.position = this.moveStartWorld.clone(),
                this.position.translateX((this.moveStartView.x - e) / this.zoom),
                this.position.translateY((this.moveStartView.y - t) / this.zoom),
                this.recalcBounds(),
                !0)
            }
            ,
            this.viewPort.setPosition = function(e) {
                this.position = e,
                this.recalcBounds()
            }
            ,
            this.viewPort.recalcBounds()
        }
        ,
        this.initListeners = function() {
            var e = this;
            this.$window.resize(function() {
                e.fullScreen && e.updateCanvasSize()
            })
        }
        ,
        this.initKeyListeners = function() {
            var e = this;
            this.$window.keypress(function(t) {
                switch (t.which) {
                case 61:
                    e.viewPort.zoomIn(),
                    e.initTileGrid(),
                    e.drawState.dirty = !0,
                    e.trigMouseMoveHandler();
                    break;
                case 45:
                    e.viewPort.zoomOut(),
                    e.initTileGrid(),
                    e.drawState.dirty = !0,
                    e.trigMouseMoveHandler();
                    break;
                case 102:
                    e.toggleFullScreen()
                }
            })
        }
        ,
        this.clickHandler = function(e, t) {
            var n = {
                x: e,
                y: t,
                worldPosition: this.getScreenWorldPosition(e, t)
            };
            this.foreachClickable(function(e) {
                return e.onclickTest(n)
            })
        }
        ,
        this.trigMouseMoveHandler = function() {
            this.mouseMoveHandler(this.mousePos.x, this.mousePos.y)
        }
        ,
        this.mouseLeaveHander = function() {
            this.mouseUpHandler()
        }
        ,
        this.mouseUpHandler = function() {
            this.viewPort.endMove(),
            this.drawState.dirty = !0
        }
        ,
        this.mouseMoveHandler = function(e, t) {
            var n = {
                x: e,
                y: t,
                worldPosition: this.getScreenWorldPosition(e, t)
            };
            this.foreachClickable(function(e) {
                e.onmousemoveTest(n),
                e.onmouseoutTest(n)
            })
        }
        ,
        this.forceMouseOut = function() {
            this.foreachClickable(function(e) {
                return e.forceMouseOut()
            })
        }
        ,
        this.foreachVisibleGridTile = function(e) {
            for (var t = 0; t < this.grid.drawTileW; ++t)
                for (var n = 0; n < this.grid.drawTileH; ++n) {
                    var r = t + this.grid.visGridStartXTilePos
                      , i = n + this.grid.visGridStartYTilePos;
                    if (e.call(this, this.grid.tiles[i][r], r, i, t, n) === !0)
                        return
                }
        }
        ,
        this.initMouseListeners = function() {
            var t = this;
            this.$topCanvas.on("mouseout", function() {
                t.mouseLeaveHander()
            }),
            this.$topCanvas.mousedown(function(e) {
                var n = t.$topCanvas.offset();
                e.preventDefault(),
                t.viewPort.beginMove(e.pageX, e.pageY),
                t.clickHandler(e.pageX - n.left, e.pageY - n.top)
            }),
            this.$topCanvas.mouseup(function() {
                t.mouseUpHandler()
            }),
            this.$topCanvas.mousemove(function(e) {
                var n = t.$topCanvas.offset();
                t.mousePos.x = e.pageX - n.left,
                t.mousePos.y = e.pageY - n.top,
                t.trigMouseMoveHandler(),
                t.viewPort.updateMove(e.pageX, e.pageY) && (t.drawState.dirty = !0)
            }),
            this.$topCanvas.mouseout(function(e) {
                t.forceMouseOut()
            }),
            e(this.$topCanvas).bind("mousewheel", function(e, n) {
                for (var r = 0; r < n; ++r)
                    t.viewPort.zoomIn();
                for (var r = 0; r > n; --r)
                    t.viewPort.zoomOut();
                return t.initTileGrid(),
                t.trigMouseMoveHandler(),
                t.drawState.dirty = !0,
                !1
            })
        }
        ,
        this.drawDebug = function() {
            this.ctx.fillStyle = "rgb(20,200,20)",
            this.ctx.font = "10pt Arial",
            this.ctx.fillText("Zoom: " + this.viewPort.zoom, 10, 60)
        }
        ,
        this.drawDebugGridInfo = function() {
            this.ctx.fillStyle = "rgb(20,200,20)",
            this.ctx.font = "10pt Arial";
            var e = 60
              , t = 30;
            this.ctx.fillText("Visible grid | Tile W: " + this.grid.visGridWidthTiles + ", Tile H: " + this.grid.visGridWidthTiles + ", XS: " + this.grid.visGridXviewPortShift + ", YS: " + this.grid.visGridYviewPortShift, 10, e += t),
            this.ctx.fillText("Visible grid | Start X Tile: " + this.grid.visGridStartXTilePos + ", Start Y Tile: " + this.grid.visGridStartYTilePos, 10, e += t),
            this.ctx.fillText("Draw grid | W: " + this.grid.drawTileW + ", H: " + this.grid.drawTileH, 10, e += t),
            this.ctx.fillText("Grid | W: " + this.grid.tiles[0].length + ", H: " + this.grid.tiles.length, 10, e += t)
        }
        ,
        this.getCurrentImageZoomLevel = function() {
            var e = this.imageZoomLevels.length;
            for (var t = 0; t < e; ++t)
                if (this.viewPort.zoom <= this.imageZoomLevels[t])
                    return this.imageZoomLevels[t];
            return this.imageZoomLevels[e - 1]
        }
        ,
        this.loadImage = function(e, t) {
            var n = this
              , r = null ;
            if (n.assets[e] !== undefined) {
                t(n.assets[e]);
                return
            }
            r = new Image,
            r.onload = function() {
                t(r),
                n.assets[e] = r
            }
            ,
            r.src = e
        }
        ,
        this.drawTile = function(e, r, i) {
            if (!e.dirty && !this.drawState.dirtyFullRedraw)
                return !1;
            e.canvas === null  && (e.canvas = document.createElement("canvas"),
            e.canvas.width = this.tileSize,
            e.canvas.height = this.tileSize);
            var s = e.canvas
              , o = s.getContext("2d")
              , u = s.width
              , a = s.height
              , f = this.getCurrentImageZoomLevel()
              , l = i / f
              , c = this
              , h = new t;
            h.tl.x = r.x,
            h.tl.y = r.y,
            h.width(s.width / i),
            h.height(s.height / i);
            var p = h.clone();
            p.grow(this.getOrbitRadius(4) * 2 + 480),
            this.drawBackgroundTile(o, r, f, l),
            this.foreachGroup(function(e) {
                if (!p.contains(e.position))
                    return;
                var t = e.position.clone();
                t.inverseTranslate(h.tl),
                t.scale(i),
                e.isAscendancy || this.drawGroupBackground(o, e, t, f, l);
                var n = this;
                e.foreachNode(function(e) {
                    var t = n.getNodePositionInfo(e)
                      , r = t.position;
                    r.inverseTranslate(h.tl),
                    r.scale(i);
                    for (var s = 0, u = e.startPositionClasses.length; s < u; ++s)
                        n.drawStartNodeBackground(o, r, f, l, e.startPositionClasses[s]);
                    if (u > 0)
                        return
                })
            });
            var d = this.ascendancyStartNode.group;
            if (d && this.isAscendancyGroupEnabled(d)) {
                var v = c.getAscendancyPositionInfo();
                d.oldPos || (d.oldPos = d.position.clone()),
                d.position = new n(v.classArtImgPoint.x,v.classArtImgPoint.y)
            }
            return this.foreachGroup(function(e) {
                if (c.isAscendancyGroupEnabled(e) && e.id != d.id && !e.oldPos) {
                    e.oldPos = e.position.clone();
                    var t = new n(d.position.x - d.oldPos.x,d.position.y - d.oldPos.y);
                    e.position = new n(e.oldPos.x + t.x,e.oldPos.y + t.y)
                } else
                    e.isAscendancy || this.drawGroupNodePaths(e, o, h, p)
            }),
            this.foreachGroup(function(e) {
                if (!p.contains(e.position))
                    return;
                this.drawGroupNodes(e, o, i, f, l, h, function(e) {
                    return !e.isAscendancy
                })
            }),
            this.drawAscendancyClassBackground(o, h),
            this.drawAscendancyClassText(o, h),
            this.drawStartNodeAscendancyButton(o, h),
            this.foreachGroup(function(e) {
                c.isAscendancyGroupEnabled(e) && this.drawGroupNodePaths(e, o, h, p)
            }),
            this.foreachGroup(function(e) {
                c.isAscendancyGroupEnabled(e) && this.drawGroupNodes(e, o, i, f, l, h, function(t) {
                    return c.isAscendancyGroupEnabled(e)
                })
            }),
            e.dirty = !1,
            !0
        }
        ,
        this.drawGroupNodes = function(e, n, r, i, s, o, u) {
            var a = this;
            e.foreachNode(function(f) {
                if (!u(f))
                    return;
                var l = a.getNodePositionInfo(f, e)
                  , p = l.position.clone()
                  , d = l.position;
                d.inverseTranslate(o.tl),
                d.scale(r);
                if (f.startPositionClasses.length > 0)
                    return;
                var v = null ;
                f.isMastery() ? v = "mastery" : f.notable ? v = "notable" + (f.active ? "Active" : "Inactive") : f.keyStone ? v = "keystone" + (f.active ? "Active" : "Inactive") : v = "normal" + (f.active ? "Active" : "Inactive");
				var mn = a.viewPort.zoomDefault;
                var m = a.skillSprites[v][a.skillSprites[v].length-1].coords[f.skill.icon];
                f.isAscendancyStartNode && (m = !1);
                if (m) {
                    var g = a.assets[v][mn]
                      , y = m.w * s * (i / mn)
                      , b = y / 2;
                    y = Math.round(y),
                    n.drawImage(g, m.x, m.y, m.w, m.h, Math.round(d.x - b), Math.round(d.y - b), y, y)
                }
                if (!f.isMastery()) {
                    var w = null ;
                    f.isKeyStone() ? w = a.assets["KeystoneFrame" + (f.active ? "Allocated" : f.canAllocate ? "CanAllocate" : "Unallocated")][mn] : f.notable ? f.isAscendancy ? w = a.assets["PassiveSkillScreenAscendancyFrameLarge" + (f.active ? "Allocated" : f.canAllocate ? "CanAllocate" : "Normal")][mn] : w = a.assets["NotableFrame" + (f.active ? "Allocated" : f.canAllocate ? "CanAllocate" : "Unallocated")][mn] : f.isAscendancyStartNode ? w = a.assets.PassiveSkillScreenAscendancyMiddle[mn] : f.isAscendancy ? w = a.assets["PassiveSkillScreenAscendancyFrameSmall" + (f.active ? "Allocated" : f.canAllocate ? "CanAllocate" : "Normal")][mn] : f.isJewel ? w = a.assets["JewelFrame" + (f.active ? "Allocated" : f.canAllocate ? "CanAllocate" : "Unallocated")][mn] : f.active ? w = a.assets.PSSkillFrameActive[mn] : f.canAllocate ? w = a.assets.PSSkillFrameHighlighted[mn] : w = a.assets["PSSkillFrame" + (f.active ? "Active" : "")][mn];
                    var E = w.width * s * (i / mn)
                      , S = E / 2;
                    E = Math.round(E),
                    n.drawImage(w, 0, 0, w.width, w.height, Math.round(d.x - S), Math.round(d.y - S), E, E)
                }
                if (f.isJewel && f.isSocketedJewel()) {
                    var x = "JewelSocketActive";
                    //f.skill.jewel.type == "JewelInt" ? x += "Blue" : f.skill.jewel.type == "JewelDex" ? x += "Green" : x += "Red";
                    var T = a.assets[x][mn]
                      , E = T.width * s * (i / mn)
                      , S = E / 2;
                    E = Math.round(E),
                    n.drawImage(T, 0, 0, T.width, T.height, Math.round(d.x - S), Math.round(d.y - S), E, E)
                }
                if (f.clickable === null  && !f.isMastery()) {
                    var N = new t, C;
                    f.isKeyStone() ? C = a.nodeRadiusKeystone : f.isMastery() ? C = a.nodeRadiusMastery : C = a.nodeRadius,
                    N.tl.x = p.x - C,
                    N.tl.y = p.y - C,
                    N.br.x = p.x + C,
                    N.br.y = p.y + C;
                    var k = new c(N);
                    f.clickable = k,
                    k.onclick = function(e) {
                        a.drawState.dirty = !0,
                        a.drawState.dirtyFullRedraw = !0;
                        var t = !1;
                        f.active ? a.passiveAllocation.unallocate(f.skill.getHash()) && (t = !0) : a.passiveAllocation.allocate(f.skill.getHash(), !0) && (t = !0);
                        if (t && a.settings.highlightShortestPaths && f.pathHighlighterGroup !== null ) {
                            f.pathHighlighterGroup.end();
							if (f.active) {
                                // FindOrphanedNodes
                                a.settings.skillArray = a.FindOrphanedNodes(f);
								f.pathHighlighterGroup = new h(a,f),
								f.pathHighlighterGroup.begin()
							} else {
								var n = a.getShortestPathsFromActiveNodes(f);
								f.pathHighlighterGroup = new h(a,n),
								f.pathHighlighterGroup.begin()
							}
                        }
                    }
                    ,
                    k.onmousemove = function(ee) {
                        var t = ee.x
                          , n = ee.y;
                        a.drawState.dirty = !0,
                        f.renderState.hover = !0,
                        f.isSocketedJewel() ? f.skill.item.handleItemMouseover(e) : f.popup = a.createPopup(a.midCanvas, Math.round(t + 10), Math.round(n - 10), 300, 200, function(e, t, n) {
                            var r = 0
                              , i = 0
                              , s = Math.round(21 * a.scaleFactor)
                              , o = Math.round(19 * a.scaleFactor)
                              , u = s * 3
                              , l = o * 2;
                            n.fillStyle = "rgb(200,200,200)",
                            n.font = s + "pt FontinBold",
                            t ? (i = n.measureText(f.skill.displayName).width,
                            i > r && (r = i)) : n.fillText(f.skill.displayName, 5, Math.round(s * 2));
                            var c = function(e, n, s) {
                                if (!e)
                                    return !1;
                                s && (u += l);
                                for (var o = 0, a = e.length; o < a; ++o) {
                                    u += l;
                                    if (t) {
                                        i = n.measureText(e[o]).width,
                                        i > r && (r = i);
                                        var f = e[o].split("\n");
                                        for (var c in f)
                                            c > 0 && (u += l)
                                    } else {
                                        var f = e[o].split("\n");
                                        for (var c in f)
                                            c > 0 && (u += l),
                                            n.fillText(f[c], 5, Math.round(u))
                                    }
                                }
                            }
                            ;
                            n.save(),
                            n.font = o + "pt FontinBold",
                            c(f.skill.skillDescription, n),
                            n.font = "italic " + o + "pt FontinBold",
                            n.fillStyle = "#AF6025",
                            c(f.skill.flavourText, n, !0),
                            n.fillStyle = "#808080",
                            c(f.skill.reminderText, n, !0),
                            n.restore(),
                            t && e.resize(r + 10, Math.round(u + l / 2))
                        }),
                        a.settings.highlightSimilarNodes && a.highlightSimilarNodes(f);
                        if (a.settings.highlightShortestPaths && f.pathHighlighterGroup === null ) {
							if (f.active) {
								// FindOrphanedNodes
								a.settings.skillArray = a.FindOrphanedNodes(f);
								f.pathHighlighterGroup = new h(a,f),
								f.pathHighlighterGroup.begin()
							} else {
								// getShortestPaths
								var r = a.getShortestPathsFromActiveNodes(f);
								f.pathHighlighterGroup = new h(a,r),
								f.pathHighlighterGroup.begin()
								var skillArray = [r[0].goalNodeData.node.skill.hash];
								if (r[0].goalNodeData.depth > 1) {
									var nodeParent = r[0].goalNodeData.parents[0].skill.hash;
									skillArray.unshift(nodeParent);
									for(var depth=r[0].goalNodeData.depth-2; depth>0; depth--) {
										nodeParent = r[0].nodeRelationshipData[nodeParent].parents[0].skill.hash;
										skillArray.unshift(nodeParent);
									}
								}
								a.settings.skillArray = skillArray;
							}
                        }
                        if (f.isJewel) {
                            var p = a.worldToScreen(a.getNodePositionInfo(f).position);
							[800, 1200, 1500].forEach(function(radius) {
								a.ctx.beginPath();
								a.ctx.arc(p.x, p.y, radius*a.viewPort.zoom, 0, 2 * Math.PI, false);
								a.ctx.lineWidth = 1*a.viewPort.zoom;
								a.ctx.strokeStyle = '#FFFFFF';
								a.ctx.stroke();
							});
                        }
                    }
                    ,
                    k.onmouseout = function(e) {
                        a.drawState.dirty = !0,
                        f.renderState.hover = !1,
                        f.isSocketedJewel() ? f.skill.item.handleItemMouseout() : a.removePopup(f.popup),
                        f.similarNodeHighlighter !== null  && f.similarNodeHighlighter.end().done(function(e, t) {
                            return function() {
                                e.similarNodeHighlighter === t && (e.similarNodeHighlighter = null )
                            }
                        }(f, f.similarNodeHighlighter)),
                        f.pathHighlighterGroup !== null  && (f.pathHighlighterGroup.end(),
                        f.pathHighlighterGroup = null )
                    }
                }
            })
        }
        ,
        this.drawNode = function(e, t) {
            t(e, this.getNodePositionInfo(e))
        }
        ,
        this.drawPathBetweenNodes = function(e, t, n, r) {
            var i = this.getNodePositionInfo(e)
              , s = this.getNodePositionInfo(t);
            if (e.group.id != t.group.id || e.orbit != t.orbit)
                n(i, s);
            else {
                var o = e.group.position.clone()
                  , u = i.angle
                  , a = s.angle
                  , f = u < a;
                u = f ? i.angle : s.angle,
                a = f ? s.angle : i.angle;
                var l = a - u;
                if (l > Math.PI) {
                    var c = 2 * Math.PI - l;
                    u = a,
                    a = u + c
                }
                var h = this.orbitRadii[e.orbit];
                r(o, u, a, h)
            }
        }
        ,
        this.drawLoading = function(e) {
            var t = E.translate("Loading") + "... " + (Math.round(e * 100) + "%")
              , n = 20
              , r = this.canvas.width / 2
              , i = this.canvas.height / 2
              , s = this.ctx.measureText(t);
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height),
            this.ctx.fillStyle = "rgb(251,243,241)",
            this.ctx.font = n + "pt FontinBold",
            this.ctx.fillText(t, Math.round(r - s.width / 2), Math.round(i - n / 2))
        }
        ,
        this.draw = function() {
            this.drawState.active = !0,
            this.calcTileGrid();
            if (this.drawState.dirtyFullRedraw || !this.lastDrawBounds || this.lastDrawBounds.neq(this.viewPort.bounds))
                this.lastDrawBounds = this.viewPort.bounds.clone(),
                this.foreachVisibleGridTile(function(e, t, n, r, i) {
                    this.drawTilePos(t, n),
                    this.ctx.drawImage(e.canvas, 0, 0, this.tileSize, this.tileSize, Math.round(r * this.tileSize - this.grid.visGridXviewPortShift), Math.round(i * this.tileSize - this.grid.visGridYviewPortShift), this.tileSize, this.tileSize)
                });
            this.drawMidCanvas(),
            this.drawTopCanvas();
            for (var e = 0, t = this.finalDrawFuncs.length; e < t; ++e)
                this.finalDrawFuncs[e]();
            this.finalDrawFuncs = [];
            for (var n in this.popups)
                this.popups[n].draw();
            this.errorMessage !== null  && (this.ctx.fillStyle = "rgb(251,30,30)",
            this.ctx.font = "10pt FontinBold",
            this.ctx.fillText(this.errorMessage, 10, this.canvas.height - 20)),
            this.drawState.lastFrame = new Date,
            this.beginIdle(),
            this.drawState.dirty = !1,
            this.drawState.dirtyFullRedraw = !1,
            this.drawState.active = !1
        }
        ,
        this.drawImageTiled = function(e, t, n, r, i, s, o, u) {
            var a = e.width * n
              , f = e.height * r
              , l = o - i
              , c = u - s;
            for (var h = 0, p = Math.ceil(l / a); h < p; ++h) {
                var d = h * a + i;
                for (var v = 0, m = Math.ceil(c / f); v < m; ++v) {
                    t.save(),
                    t.translate(d, v * f + s);
                    var g = e.width
                      , y = a
                      , b = e.height
                      , w = f;
                    if (h == p - 1) {
                        var E = l % a
                          , S = a - E;
                        E !== 0 && (y -= S,
                        g *= E / a)
                    }
                    if (v == m - 1) {
                        var E = Math.round(c) % Math.round(f)
                          , x = f - E;
                        E !== 0 && (w -= x,
                        b *= E / f)
                    }
                    t.drawImage(e, 0, 0, g, b, 0, 0, y, w),
                    t.restore()
                }
            }
        }
        ,
        this.createRotatedCanvasImage = function(e, t, n, r) {
            var i = document.createElement("canvas");
            i.width = n,
            i.height = r;
            var s = i.getContext("2d");
            return s.save(),
            s.translate(n / 2, r / 2),
            s.rotate(t),
            s.drawImage(e, -e.width / 2, -e.height / 2),
            s.restore(),
            i
        }
        ,
        this.drawTopCanvas = function() {
            if (!this.drawState.topDirty)
                return;
            this.topCtx.clearRect(0, 0, this.topCanvas.width, this.topCanvas.height),
            this.drawBorder(),
            this.drawHeader(),
            this.drawState.topDirty = !1
        }
        ,
        this.drawMidCanvas = function() {
            this.midCtx.clearRect(0, 0, this.midCanvas.width, this.midCanvas.height),
            this.midDrawObjects.foreachObject(function(e) {
                e.draw()
            })
        }
        ,
        this.drawBorder = function() {
            var e = this.assets.imgPSFadeCorner[1]
              , t = this.assets.imgPSFadeSide[1]
              , n = this.scaleFactor
              , r = e.width * n
              , i = e.height * n
              , s = t.height * n
              , o = this.createRotatedCanvasImage(e, Math.PI / 2, e.width, e.height)
              , u = this.createRotatedCanvasImage(e, Math.PI, e.width, e.height)
              , a = this.createRotatedCanvasImage(e, -Math.PI / 2, e.width, e.height)
              , f = this.createRotatedCanvasImage(t, 0, t.width, t.height)
              , l = this.createRotatedCanvasImage(t, Math.PI, t.width, t.height)
              , c = this.createRotatedCanvasImage(t, -Math.PI / 2, t.height, t.width)
              , h = this.createRotatedCanvasImage(t, Math.PI / 2, t.height, t.width);
            this.topCtx.drawImage(e, 0, 0, e.width, e.height, 0, 0, r, i),
            this.topCtx.drawImage(o, 0, 0, o.width, o.height, this.topCanvas.width - r, 0, r, i),
            this.topCtx.drawImage(u, 0, 0, u.width, u.height, this.topCanvas.width - r, this.topCanvas.height - i, r, i),
            this.topCtx.drawImage(a, 0, 0, a.width, a.height, 0, this.topCanvas.height - i, r, i),
            this.drawImageTiled(l, this.topCtx, n, n, r, this.topCanvas.height - s, this.topCanvas.width - r, this.canvas.height, "rgb(200,200,0)"),
            this.drawImageTiled(f, this.topCtx, n, n, r, 0, this.topCanvas.width - r, s, "rgb(200,20,200)"),
            this.drawImageTiled(c, this.topCtx, n, n, 0, i, c.width * n, this.topCanvas.height - i, "rgb(0,20,200)"),
            this.drawImageTiled(h, this.topCtx, n, n, this.topCanvas.width - h.width * n, i, this.topCanvas.width, this.canvas.height - i)
        }
        ,
        this.drawHeader = function() {
            if (this.readonly)
                return;
            var e = this.passiveAllocation.getPassiveSkillPointsAvailable()
              , t = this.passiveAllocation.getAscendancyPassiveSkillPointsAvailable();
            if (e > 0 || t > 0) {
                var n = this.assets.PSPointsFrame[1]
                  , r = this.scaleFactor
                  , i = n.width * r
                  , s = n.height * r
                  , o = i / 2
                  , u = Math.round(s / 2)
                  , a = this.topCanvas.width / 2;
                this.topCtx.drawImage(n, 0, 0, n.width, n.height, Math.round(a - i), 20 - u, Math.round(i), Math.round(s)),
                this.topCtx.drawImage(n, 0, 0, n.width, n.height, Math.round(a), 20 - u, Math.round(i), Math.round(s)),
                this.topCtx.fillStyle = "rgb(251,243,241)",
                this.topCtx.font = "10pt FontinBold";
                var f = "Point" + (e == 1 ? "" : "s") + " Left"
                  , l = e + " " + E.translate(f)
                  , c = this.topCtx.measureText(l)
                  , h = t + " " + E.translate("Ascendancy") + " " + E.translate(f)
                  , p = this.topCtx.measureText(h);
                this.topCtx.fillText(l, Math.round(a - o - c.width / 2), 20 - u + 16),
                this.topCtx.fillText(h, Math.round(a + o - p.width / 2), 20 - u + 16)
            }
        }
        ,
        this.drawIdle = function() {
            this.calcTileGrid();
            for (var e = 0; e < this.grid.visGridWidthTiles + 2; ++e)
                for (var t = 0; t < this.grid.visGridHeightTiles + 2; ++t) {
                    var n = e + this.grid.visGridStartXTilePos - 1
                      , r = t + this.grid.visGridStartYTilePos - 1;
                    if (this.grid.tiles[r] === undefined || this.grid.tiles[r][n] === undefined)
                        continue;if (this.drawTilePos(n, r)) {
                        this.drawState.lastFrame = new Date,
                        this.beginIdle();
                        return
                    }
                }
        }
        ,
        this.getNodeRadius = function(e) {
            return e.notable ? this.nodeRadiusNotable : e.isKeyStone() ? this.nodeRadiusKeystone : e.isMastery() ? this.nodeRadiusMastery : e.isJewel ? this.nodeRadiusJewel : e.isClassStartNode ? this.nodeRadiusClassStart : this.nodeRadius
        }
        ,
        this.beginIdle = function() {
            var e = this;
            setTimeout(function() {
                var t = new Date;
                t.getTime() - e.drawState.lastFrame.getTime() >= 200 && e.drawIdle()
            }, 250)
        }
        ,
        this.getScreenWorldPosition = function(e, t) {
            return new n(this.viewPort.bounds.tl.x + e / this.viewPort.zoom,this.viewPort.bounds.tl.y + t / this.viewPort.zoom)
        }
        ,
        this.worldToScreen = function(e) {
            return new n((e.x - this.viewPort.bounds.tl.x) * this.viewPort.zoom,(e.y - this.viewPort.bounds.tl.y) * this.viewPort.zoom)
        }
        ,
        this.getTileWorldPosition = function(e, t) {
            var r = new n;
            return r.x = e * this.tileSize / this.viewPort.zoom + this.extent.tl.x,
            r.y = t * this.tileSize / this.viewPort.zoom + this.extent.tl.y,
            r
        }
        ,
        this.drawTilePos = function(e, t) {
            var n = this.getTileWorldPosition(e, t);
            return this.drawTile(this.grid.tiles[t][e], n, this.viewPort.zoom)
        }
        ,
        this.getAscendancyPositionInfo = function(e) {
            var r = this.getNodePositionInfo(this.startNode).position
              , i = 270
              , s = 0
              , o = 1
              , u = Math.sqrt(r.x * r.x + r.y * r.y)
              , a = Math.abs(r.x) < 10 && Math.abs(r.y) < 10;
            a || (s = r.x / u,
            o = -r.y / u);
			var mn = this.viewPort.zoomDefault;
            var f = this.viewPort.zoom
              , l = Math.atan2(s, o)
              , c = this.assets[this.ascendancyButton.state][mn]
              , h = r.x + i * Math.cos(l + Math.PI / 2)
              , p = r.y + i * Math.sin(l + Math.PI / 2)
              , d = new n(h,p)
              , v = this.assets["Classes" + this.ascendancyClassName()][mn]
              , m = r.x + (i + v.height / mn / 2) * Math.cos(l + Math.PI / 2)
              , g = r.y + (i + v.height / mn / 2) * Math.sin(l + Math.PI / 2)
              , y = new n(m,g)
              , b = new n(y.x - v.width / mn / 2,y.y - v.height / mn / 2)
              , w = new n(y.x + v.width / mn / 2,y.y + v.height / mn / 2)
              , E = new t;
            E.tl = new n(y.x - v.width / mn / 2,y.y - v.height / mn / 2),
            E.br = new n(y.x + v.width / mn / 2,y.y + v.height / mn / 2),
            e && (r.inverseTranslate(e.tl),
            d.inverseTranslate(e.tl),
            y.inverseTranslate(e.tl));
            var S = {
                distanceFromStartNodeCenter: i,
                distToCenter: u,
                dirX: s,
                dirY: o,
                isCentered: a,
                worldPos: r,
                ascButtonRot: l,
                img: c,
                buttonPoint: d,
                classArtImg: v,
                classArtImgPoint: y,
                classArtImgBounds: E
            };
            if (this.ascendancyStartNode) {
                var x = this.getNodePositionInfo(this.ascendancyStartNode).position
                  , T = m - x.x
                  , N = g - x.y;
                S.startNodeDX = T,
                S.startNodeDY = N
            }
            return S
        }
        ,
        this.drawStartNodeAscendancyButton = function(e, r) {
			var mn = this.viewPort.zoomDefault;
            var i = this.viewPort.zoom
              , s = this.assets[this.ascendancyButton.state][mn];
            if (this.ascendancyClass && this.ascendancyClass > 0) {
                var o = this.getAscendancyPositionInfo(r)
                  , u = o.buttonPoint.clone();
                u.scale(i);
                var a = o.worldPos;
                a.scale(i),
                e.save(),
                e.translate(a.x, a.y),
                e.rotate(o.ascButtonRot),
                e.drawImage(s, 0, 0, s.width, s.height, -s.width * (i / mn) / 2, (o.distanceFromStartNodeCenter - s.height / mn / 2) * i, s.width * (i / mn), s.height * (i / mn)),
                e.restore();
                var f = new t
                  , l = this.getAscendancyPositionInfo();
                f.tl = new n(l.buttonPoint.x - s.height / mn / 2,l.buttonPoint.y - s.height / mn / 2),
                f.br = new n(l.buttonPoint.x + s.height / mn / 2,l.buttonPoint.y + s.height / mn / 2);
                var h = this;
                this.ascendancyButton.clickable = new c(f),
                this.ascendancyButton.clickable.onmousemove = function() {
                    h.ascendancyButton.state != "PassiveSkillScreenAscendancyButtonHighlight" && (h.ascendancyButton.state = "PassiveSkillScreenAscendancyButtonHighlight",
                    h.drawState.dirty = !0,
                    h.drawState.dirtyFullRedraw = !0)
                }
                ,
                this.ascendancyButton.clickable.onmouseout = function() {
                    h.ascendancyButton.state = "PassiveSkillScreenAscendancyButton",
                    h.drawState.dirty = !0,
                    h.drawState.dirtyFullRedraw = !0
                }
                ,
                this.ascendancyButton.clickable.onclick = function(e) {
                    h.ascendancyButton.state = "PassiveSkillScreenAscendancyButtonPressed",
                    h.ascendancyClassPopupHidden = !h.ascendancyClassPopupHidden,
                    h.drawState.dirty = !0,
                    h.drawState.dirtyFullRedraw = !0,
                    h.lastQuery && h.lastQuery != "" && h.highlightSearchQuery(h.lastQuery),
                    h.drawState.topDirty = !0
                }
            }
        }
        ,
        this.isAscendancyGroupEnabled = function(e) {
            return e && e.isAscendancy && e.ascendancyName == this.ascendancyClassName() && !this.ascendancyClassPopupHidden
        }
        ,
        this.ascendancyClassName = function() {
            return this.characterClass >= 0 && this.ascendancyClass && this.ascendancyClass != 0 && this.ascendancyClasses[this.characterClass].classes[this.ascendancyClass] ? this.ascendancyClasses[this.characterClass].classes[this.ascendancyClass].name : !1
        }
        ,
        this.drawAscendancyClassBackground = function(e, t) {
            if (this.ascendancyClassPopupHidden || !this.ascendancyClass)
                return !1;
			var mn = this.viewPort.zoomDefault;
            var n = this.getAscendancyPositionInfo(t)
              , r = n.classArtImg
              , i = n.classArtImgPoint;
            i.scale(this.viewPort.zoom),
            e.drawImage(r, 0, 0, r.width, r.height, i.x - r.width * (this.viewPort.zoom / mn) / 2, i.y - r.height * (this.viewPort.zoom / mn) / 2, r.width * (this.viewPort.zoom / mn), r.height * (this.viewPort.zoom / mn))
        }
        ,
        this.drawAscendancyClassText = function(e, t) {
            if (this.ascendancyClassPopupHidden || !this.ascendancyClass)
                return !1;
			var mn = this.viewPort.zoomDefault;
            var r = this.getAscendancyPositionInfo(t)
              , i = this.ascendancyClasses[this.characterClass].classes[this.ascendancyClass]
              , s = i.flavourTextRect.split(",")
              , o = new n(s[0],s[1])
              , u = r.classArtImg
              , a = r.classArtImgPoint
              , f = i.flavourText.split("\n");
            a.scale(this.viewPort.zoom),
            o.scale(this.viewPort.zoom),
            e.save(),
            e.translate(a.x - u.width * (this.viewPort.zoom / mn) / 2, a.y - u.height * (this.viewPort.zoom / mn) / 2);
            var l = 0
              , c = 4
              , h = 48
              , p = h * this.viewPort.zoom;
            e.font = "" + Math.round(p) + "px FontinItalic";
            for (var d in f)
                l += Math.round(p + c * this.viewPort.zoom),
                e.fillStyle = "black",
                e.strokeText(f[d], o.x, o.y + l),
                e.fillStyle = "rgb(" + i.flavourTextColour + ")",
                e.fillText(f[d], o.x, o.y + l);
            e.restore()
        }
        ,
        this.drawStartNodeBackground = function(e, t, n, r, i) {
			var mn = this.viewPort.zoomDefault;
            var s = i == this.characterClass
              , o = this.assets[s ? "centerduelist" : "PSStartNodeBackgroundInactive"][mn]
              , u = o.width * r * (n / mn)
              , a = o.height * r * (n / mn)
              , f = u / 2
              , l = a / 2
              , c = "PSStartNodeBackgroundInactive";
            if (s)
                switch (i) {
                case this.constants.classes.StrClass:
                    c = "centermarauder";
                    break;
                case this.constants.classes.DexClass:
                    c = "centerranger";
                    break;
                case this.constants.classes.IntClass:
                    c = "centerwitch";
                    break;
                case this.constants.classes.StrDexClass:
                    c = "centerduelist";
                    break;
                case this.constants.classes.StrIntClass:
                    c = "centertemplar";
                    break;
                case this.constants.classes.DexIntClass:
                    c = "centershadow";
                    break;
                case this.constants.classes.StrDexIntClass:
                    c = "centerscion"
                }
            o = this.assets[c][mn],
            e.drawImage(o, 0, 0, o.width, o.height, Math.round(t.x - f), Math.round(t.y - l), Math.round(u), Math.round(a));
            if (s) {
                var h = Math.ceil(25 * this.viewPort.zoom);
                e.font = h + "pt FontinRegular";
                var p = 300 * (Math.PI / 180)
                  , d = t.x + this.constants.PSSCentreInnerRadius * this.viewPort.zoom * Math.sin(p)
                  , v = t.y + this.constants.PSSCentreInnerRadius * this.viewPort.zoom * Math.cos(p);
                e.fillStyle = "rgb(235,46,16)";
                var m = e.measureText(this.stats.getAttribute(this.constants.characterAttributes.Strength));
                e.fillText(this.stats.getAttribute(this.constants.characterAttributes.Strength), d - m.width / 2, v + h / 2);
                var p = 60 * (Math.PI / 180)
                  , d = t.x + this.constants.PSSCentreInnerRadius * this.viewPort.zoom * Math.sin(p)
                  , v = t.y + this.constants.PSSCentreInnerRadius * this.viewPort.zoom * Math.cos(p);
                e.beginPath(),
                e.fillStyle = "rgb(1,217,1)";
                var m = e.measureText(this.stats.getAttribute(this.constants.characterAttributes.Dexterity));
                e.fillText(this.stats.getAttribute(this.constants.characterAttributes.Dexterity), d - m.width / 2, v + h / 2);
                var p = 180 * (Math.PI / 180)
                  , d = t.x + this.constants.PSSCentreInnerRadius * this.viewPort.zoom * Math.sin(p)
                  , v = t.y + this.constants.PSSCentreInnerRadius * this.viewPort.zoom * Math.cos(p);
                e.beginPath(),
                e.fillStyle = "rgb(88,130,255)";
                var m = e.measureText(this.stats.getAttribute(this.constants.characterAttributes.Intelligence));
                e.fillText(this.stats.getAttribute(this.constants.characterAttributes.Intelligence), d - m.width / 2, v + h / 2)
            }
        }
        ,
        this.drawGroupBackground = function(e, t, n, r, i) {
			var mn = this.viewPort.zoomDefault;
            if (t.isOccupiedOrbit(3)) {
                var s = this.assets.PSGroupBackground3[mn]
                  , o = s.width * i * (r / mn)
                  , u = o / 2;
                e.drawImage(s, 0, 0, s.width, s.height, Math.round(n.x - u), Math.round(n.y - u), Math.round(o), Math.round(u)),
                e.save(),
                e.translate(Math.round(n.x), Math.round(n.y)),
                e.rotate(Math.PI),
                u = Math.round(u),
                e.translate(0, -u),
                e.drawImage(this.assets.PSGroupBackground3[mn], 0, 0, this.assets.PSGroupBackground3[mn].width, this.assets.PSGroupBackground3[mn].height, -u, 0, o, u),
                e.restore()
            }
            if (t.isOccupiedOrbit(2)) {
                var s = this.assets.PSGroupBackground2[mn]
                  , o = Math.round(s.width * i) * (r / mn)
                  , u = o / 2;
                e.drawImage(s, 0, 0, s.width, s.height, Math.round(n.x - u), Math.round(n.y - u), o, o)
            }
            if (t.isOccupiedOrbit(1)) {
                var s = this.assets.PSGroupBackground1[mn]
                  , o = Math.round(s.width * i) * (r / mn)
                  , u = o / 2;
                e.drawImage(s, 0, 0, s.width, s.height, Math.round(n.x - u), Math.round(n.y - u), o, o)
            }
        }
        ,
        this.drawBackgroundTile = function(e, t, n, r) {
			var mn = this.viewPort.zoomDefault;
            var i = this.assets.Background1[mn]
              , s = t.x - this.extent.tl.x
              , o = t.y - this.extent.tl.y
              , u = i.width * r * (n / mn)
              , a = i.height * r * (n / mn)
              , f = s % u
              , l = o % a;
            for (var c = 0, h = Math.ceil((this.tileSize + f) / u); c < h; ++c)
                for (var p = 0, d = Math.ceil((this.tileSize + l) / a); p < d; ++p)
                    e.drawImage(i, 0, 0, i.width, i.height, Math.round(-f + c * u), Math.round(-l + p * a), Math.round(u), Math.round(a))
        }
        ,
        this.drawGroupNodePaths = function(e, t, n, r) {
            if (!r.contains(e.position))
                return;
            var i = this.viewPort.zoom
              , s = this.getCurrentImageZoomLevel()
              , o = i / s
              , u = this;
            e.foreachNode(function(r) {
                var a = u.getNodePositionInfo(r, e)
                  , f = a.position;
                f.inverseTranslate(n.tl),
                f.scale(i);
                if (r.startPositionClasses.length > 0)
                    return;
                r.foreachOutNode(function(e) {
                    var a = u.getNodePositionInfo(e)
                      , f = a.position
                      , l = null ;
                    f.inverseTranslate(n.tl),
                    f.scale(i);
                    if (r.isAscendancy && !e.isAscendancy)
                        return;
                    if (e.startPositionClasses.length > 0)
                        return;
                    if (e.isAscendancyStartNode)
                        return;
                    u.drawPathBetweenNodes(r, e, function(a, f) {
                        var l = a.position
                          , c = f.position;
                        l.inverseTranslate(n.tl),
                        l.scale(i),
                        c.inverseTranslate(n.tl),
                        c.scale(i);
                        var h = "Normal";
                        if (r.active && e.active)
                            h = "Active";
                        else if (r.active || e.active)
                            h = "Normal";//"Intermediate";
						u.drawStraightPath2(t, h, l, c);
                        //u.drawStraightPath(t, u.assets["LineConnector" + h][s], l, c, o, u.assets["PSLineDeco" + (r.active || e.active ? "Highlighted" : "")][s], (u.nodeRadius - 22) * i)
                    }, function(a, f, l, c) {
                        a.inverseTranslate(n.tl),
                        a.scale(i);
                        var h = "Normal";
                        if (r.active && e.active)
                            h = "Active";
                        else if (r.active || e.active)
                            h = "Normal";//"Intermediate";
                        u.drawArc2(t, u.getOrbitRadius(e.orbit)*u.viewPort.zoom, h, a, f - Math.PI / 2, l - Math.PI / 2)
                        //var p = u.assets["Orbit" + e.orbit + h][s];
                        //u.drawArc(t, p, a, f - Math.PI / 2, l - Math.PI / 2, o)
                    })
                })
            })
        }
        ,
        this.drawImageCentered = function(e, t, n, r, i) {
            var s = t.width * i
              , o = s / 2
              , u = t.height * i
              , a = u / 2;
            e.drawImage(t, 0, 0, t.width, t.height, Math.round(n.x - o), Math.round(n.y - a), Math.round(s), Math.round(u))
        }
        ,
        this.foreachGroup = function(e) {
            for (var t in this.groups)
                e.call(this, this.groups[t])
        }
        ,
        this.foreachNode = function(e) {
            for (var t in this.nodes)
                if (e.call(this, this.nodes[t]) === !0)
                    return
        }
        ,
        this.foreachClickable = function(e) {
            var t = this
              , n = this.ascendancyClassPopupHidden ? !1 : t.getAscendancyPositionInfo();
            this.foreachNode(function(r) {
                if (r.clickable === null )
                    return !1;
                if (n && !r.isAscendancy) {
                    if (r.isAscendancyStartNode)
                        return !1;
                    if (n.classArtImgBounds.contains(r.clickable.bounds.tl))
                        return !1;
                    if (n.classArtImgBounds.contains(r.clickable.bounds.br))
                        return !1
                }
                if (r.isAscendancy && !t.isAscendancyGroupEnabled(r.group))
                    return !1;
                if (e.call(t, r.clickable) === !0)
                    return
            });
            if (this.ascendancyButton && this.ascendancyButton.clickable && e.call(t, this.ascendancyButton.clickable) === !0)
                return
        }
        ,
        this.findNodes = function(e) {
            var t = [];
            for (var n in this.nodes) {
                var r = this.nodes[n];
                e.call(this, r) && t.push(r)
            }
            return t
        }
        ,
        this.getNode = function(e) {
            return this.nodes[e]
        }
        ,
        this.getGroup = function(e) {
            return this.groups[e]
        }
        ,
        this.addNode = function(e) {
            this.nodes[e.skill.getHash()] = e
        }
        ,
        this.addGroup = function(e) {
            this.groups[e.getId()] = e
        }
        ,
        this.getOrbitSkillCount = function(e) {
            return this.skillsPerOrbit[e]
        }
        ,
        this.getOrbitAngle = function(e, t) {
            var n = .017453293;
            if (t == 40)
                switch (e) {
                case 0:
                    return this.getOrbitAngle(0, 12);
                case 1:
                    return this.getOrbitAngle(0, 12) + 10 * n;
                case 2:
                    return this.getOrbitAngle(0, 12) + 20 * n;
                case 3:
                    return this.getOrbitAngle(1, 12);
                case 4:
                    return this.getOrbitAngle(1, 12) + 10 * n;
                case 5:
                    return this.getOrbitAngle(1, 12) + 15 * n;
                case 6:
                    return this.getOrbitAngle(1, 12) + 20 * n;
                case 7:
                    return this.getOrbitAngle(2, 12);
                case 8:
                    return this.getOrbitAngle(2, 12) + 10 * n;
                case 9:
                    return this.getOrbitAngle(2, 12) + 20 * n;
                case 10:
                    return this.getOrbitAngle(3, 12);
                case 11:
                    return this.getOrbitAngle(3, 12) + 10 * n;
                case 12:
                    return this.getOrbitAngle(3, 12) + 20 * n;
                case 13:
                    return this.getOrbitAngle(4, 12);
                case 14:
                    return this.getOrbitAngle(4, 12) + 10 * n;
                case 15:
                    return this.getOrbitAngle(4, 12) + 15 * n;
                case 16:
                    return this.getOrbitAngle(4, 12) + 20 * n;
                case 17:
                    return this.getOrbitAngle(5, 12);
                case 18:
                    return this.getOrbitAngle(5, 12) + 10 * n;
                case 19:
                    return this.getOrbitAngle(5, 12) + 20 * n;
                case 20:
                    return this.getOrbitAngle(6, 12);
                case 21:
                    return this.getOrbitAngle(6, 12) + 10 * n;
                case 22:
                    return this.getOrbitAngle(6, 12) + 20 * n;
                case 23:
                    return this.getOrbitAngle(7, 12);
                case 24:
                    return this.getOrbitAngle(7, 12) + 10 * n;
                case 25:
                    return this.getOrbitAngle(7, 12) + 15 * n;
                case 26:
                    return this.getOrbitAngle(7, 12) + 20 * n;
                case 27:
                    return this.getOrbitAngle(8, 12);
                case 28:
                    return this.getOrbitAngle(8, 12) + 10 * n;
                case 29:
                    return this.getOrbitAngle(8, 12) + 20 * n;
                case 30:
                    return this.getOrbitAngle(9, 12);
                case 31:
                    return this.getOrbitAngle(9, 12) + 10 * n;
                case 32:
                    return this.getOrbitAngle(9, 12) + 20 * n;
                case 33:
                    return this.getOrbitAngle(10, 12);
                case 34:
                    return this.getOrbitAngle(10, 12) + 10 * n;
                case 35:
                    return this.getOrbitAngle(10, 12) + 15 * n;
                case 36:
                    return this.getOrbitAngle(10, 12) + 20 * n;
                case 37:
                    return this.getOrbitAngle(11, 12);
                case 38:
                    return this.getOrbitAngle(11, 12) + 10 * n;
                case 39:
                    return this.getOrbitAngle(11, 12) + 20 * n
                }
            return 2 * Math.PI * e / t
        }
        ,
        this.getOrbitRadius = function(e) {
            return this.orbitRadii[e]
        }
        ,
        this.getNodePositionInfo = function(e, t) {
            var n = this.getOrbitRadius(e.orbit)
              , r = this.getOrbitAngle(e.orbitIndex, this.getOrbitSkillCount(e.orbit))
              , i = t ? t.position.clone() : e.group.position.clone();
            return i.x -= n * Math.sin(-r),
            i.y -= n * Math.cos(-r),
            {
                position: i,
                angle: r
            }
        }
        ,
        this.createPopup = function(e, t, n, r, i, s) {
            var o = new p(m,e,t,n,r,i,s);
            return this.popups[o.id] = o,
            ++this.popupId,
            o
        }
        ,
        this.removePopup = function(e) {
            delete this.popups[e.id]
        }
        ,
        this.calculateFlipPosition = function(e, t, n) {
            var r = t - e
              , i = r / n
              , s = parseInt(i) % 2
              , o = i % 1;
            return s == 0 ? o : 1 - o
        }
        ,
        this.calculateLerpPosition = function(e, t, n) {
            var r = t - e
              , i = r / n;
            return i
        }
        ,
        this.createDefaultHighlighterGroup = function(e) {
            var t = this;
            return new b({
                highlighters: [new g(this,{
                    nodes: e.filter(function(e) {
                        return !e.isMastery() && (!e.isAscendancy || t.isAscendancyGroupEnabled(e.group))
                    })
                })]
            })
        }
        ,
        this.highlightSearchQuery = function(e) {
            var t, n = !0, r = !0, i = this;
            this.lastQuery = e,
            window.PoELocale === "zh_TW" && e.length >= 1 ? r = !1 : e.length > 2 && (r = !1);
            if (!r) {
                e = e.toLowerCase();
                var s = this.ascendancyClassPopupHidden ? !1 : i.getAscendancyPositionInfo()
                  , o = this.findNodes(function(t) {
                    if (t.isMastery())
                        return !1;
                    if (t.isAscendancy && !i.isAscendancyGroupEnabled(t.group))
                        return !1;
                    if (s && !t.isAscendancy && !i.ascendancyClassPopupHidden && t.clickable && t.clickable.bounds) {
                        if (s.classArtImgBounds.contains(t.clickable.bounds.tl))
                            return !1;
                        if (s.classArtImgBounds.contains(t.clickable.bounds.br))
                            return !1
                    }
                    if (t.skill.displayName.toLowerCase().indexOf(e) != -1)
                        return !0;
                    for (var n = 0, r = t.skill.skillDescription.length; n < r; ++n)
                        if (t.skill.skillDescription[n].toLowerCase().indexOf(e) != -1)
                            return !0;
                    return !1
                });
                t = this.createDefaultHighlighterGroup(o),
                this.searchHighlighter !== null  && t.copyStateFrom(this.searchHighlighter)
            }
            this.searchHighlighter !== null  && (this.searchHighlighter.endImmediately(),
            this.searchHighlighter = null ,
            n = !1);
            if (r)
                return;
            this.searchHighlighter = t,
            n ? this.searchHighlighter.begin() : this.searchHighlighter.beginDefault(t.start)
        }
        ,
        this.highlightSimilarNodes = function(e) {
            if (e.similarNodeHighlighter !== null )
                return;
            var t = this
              , n = this.findNodes(function(n) {
                var r = this.ascendancyClassPopupHidden ? !1 : t.getAscendancyPositionInfo();
                if (r && !n.isAscendancy && !t.ascendancyClassPopupHidden && n.clickable && n.clickable.bounds) {
                    if (r.classArtImgBounds.contains(n.clickable.bounds.tl))
                        return !1;
                    if (r.classArtImgBounds.contains(n.clickable.bounds.br))
                        return !1
                }
                return e.skill.displayName == n.skill.displayName && (t.isAscendancyGroupEnabled(n.group) || !n.isAscendancy)
            })
              , r = this.createDefaultHighlighterGroup(n);
            e.similarNodeHighlighter = r,
            r.begin()
        }
        ,
        this.visitNodes = function(e, t, n, r) {
            var i = [];
            i.push(e),
            this.ascendancyClass && i.push(this.ascendancyStartNode);
            while (i.length > 0) {
                var s = i.pop()
                  , o = s.skill.getHash();
                n[o] === undefined && r(s) && (t.push(s),
                n[o] = !0,
                s.foreachNeighbourNode(function(e) {
                    var t = e.skill.getHash();
                    n[t] === undefined && r(e) && i.push(e)
                }))
            }
        }
        ,
        this.visitBFS = function(e, t, n, r) {
            var i = []
              , s = {}
              , o = {};
            i.push(e),
            s[e.skill.getHash()] = !0;
            var u = function(e, t) {
                o[t.skill.getHash()] === undefined && (o[t.skill.getHash()] = new d(t,e))
            }
              , a = function(e) {
                return o[e.skill.getHash()]
            }
            ;
            u(0, e);
            while (i.length > 0) {
                var f = i.shift()
                  , l = f.skill.getHash()
                  , c = o[f.skill.getHash()];
                if (t(f)) {
                    r(c, o);
                    return
                }
                f.foreachNeighbourNode(function(e) {
                    if (e.skill.getHash() === null  || !n(e))
                        return;
                    u(c.depth + 1, e);
                    if (s[e.skill.getHash()] === undefined)
                        o[e.skill.getHash()].parents.push(f);
                    else {
                        var t = a(e);
                        t.depth - 1 == c.depth && o[e.skill.getHash()].parents.push(f)
                    }
                    if (s[e.skill.getHash()] !== undefined)
                        return;
                    s[e.skill.getHash()] = !0,
                    i.push(e)
                })
            }
        }
        ,
        this.getHistoryUrl = function() {
            if (!this.isHistorySupported())
                return "";
            var e = [];
            for (var t in this.passiveAllocation.allocatedSkills)
                e.push(t);
            var n = "";
            return this.accountName && this.characterName && (n += "?accountName=" + this.accountName + "&characterName=" + this.characterName),
            T.generatePermaLink(this.characterClass, this.ascendancyClass, e, this.fullScreen) + n
        }
        ,
        this.loadHistoryUrl = function(t) {
            t = t.replace(/-/g, "+").replace(/_/g, "/");
            try {
                t = e.base64.decode(t)
            } catch (n) {
                this.errorMessage = "Failed to load build from URL. Please make sure it was copied correctly.";
                var r = this
                  , i = function() {
                    r.events.pointsChanged.remove(i),
                    r.errorMessage = null 
                }
                ;
                this.events.pointsChanged.add(i);
                return
            }
            var s = new v;
            s.setDataString(t);
            var o = s.readInt()
              , u = s.readInt8()
              , a = s.readInt8()
              , f = 0;
            o > 0 && (f = s.readInt8());
            if (o != T.CurrentVersion) {
                alert("The build you are trying to load is using an old version of the passive tree and will not work.");
                return
            }
            var l = [];
            while (s.hasData())
                l.push(s.readInt16());
            this.loadCharacterData(u, a, l),
            f == 1 && this.toggleFullScreen(!0)
        }
        ,
        this.drawViewportIntersectionPoint = function(e, t) {
            var n = this.viewPort.bounds.intersectionPoint(e, this.viewPort.position, 20)
              , r = 5
              , i = 2;
            !1 !== n && (n = this.worldToScreen(n),
            n.x < r ? n.x += i - 1 : n.x > this.canvas.width - r && (n.x -= i),
            n.y < r ? n.y += i - 1 : n.y > this.canvas.height - r && (n.y -= i),
            this.finalDrawFuncs.push(function() {
                t(n)
            }))
        }
        ,
        this.init()
    }
    ;
    return T.CurrentVersion = 4,
    T.generatePermaLink = function(t, n, r, i) {
        var s = new m;
        s.appendInt(T.CurrentVersion),
        s.appendInt8(t),
        s.appendInt8(n),
        s.appendInt8(i ? 1 : 0);
        for (var o = 0, u = r.length; o < u; ++o)
            s.appendInt16(r[o]);
        var a = e.base64.encode(s.getDataString());
        return a = a.replace(/\+/g, "-").replace(/\//g, "_"),
        (window.location.pathname.indexOf("/us/") >= 0 ? "/us" : "" ) + 
        (window.location.pathname.indexOf("/pt/") >= 0 ? "/pt" : "" ) + 
        (window.location.pathname.indexOf("/ru/") >= 0 ? "/ru" : "" ) + 
		"/passive-skill-tree/" + a
    }
    ,
    T
})

