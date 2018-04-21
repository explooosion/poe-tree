define(["plugins", "PoE/PassiveSkillTree/PassiveSkillTree"], function(e, t, n) {
    var r = function(n) {
        this.init = function() {
            this.$controlsForm = e("#passiveControlsForm"),
            this.$classStartPoint = e("#classStartPoint"),
            this.$ascendancyClass = e("#ascendancyClass"),
            this.$permaLink = e("#permaLink"),
            this.$importSkillTree = e("#importSkillTree"),
            this.$pointsUsedEl = e("#skillTreeInfo .pointsUsed"),
            this.$totalPointsEl = e("#skillTreeInfo .totalPoints"),
            this.$toggleFullScreenEl = e("#toggleFullScreen"),
            this.$treeLinkEl = e(".tree-link"),
            this.$window = e(window),
            this.$controlsContainerEl = e("#passiveSkillTreeControlsContainer"),
            this.$controlsEl = e("#passiveSkillTreeControls"),
            this.$popupContainerEl = e("#poe-popup-container"),
            this.$higlightSimilarEl = e("#highlightSimilarNodes"),
            this.$highlightShortestPathsEl = e("#highlightShortestPaths"),
            this.$searchBoxEl = e("#passiveSearchBox"),
            this.$bbcodePermaLinkEl = e("#bbcodePermaLink"),
            this.$buildNameEl = e("#buildName"),
            this.$buildNameContEl = e("#buildNameContainer"),
            this.$resetEl = e("#resetSkillTree"),
            this.bbcodePermaL = !1,
            this.defaultBuildName = "Passive skill tree build",
            this.curHistoryUrl = "",
            this.skillTree = !1,
            this.height = n.height,
            this.fullScreen = n.fullScreen ? !0 : !1,
            this.ascClasses = n.ascClasses,
            this.startClass = n.startClass,
            this.zoomLevels = n.zoomLevels,
            this.passiveSkillTreeData = n.passiveSkillTreeData;

this.calSkillTree = function() {
	$("#summary").html("");
	var pp = []
		var sdp = {};
	for (var t in this.skillTree.passiveAllocation.allocatedSkills) {
		var n = this.skillTree.passiveAllocation.allocatedSkills[t];
		for(var s = 0, o = n.skill.skillDescription.length; s < o; ++s) {
			var p = n.skill.skillDescription[s];
			if (n.keyStone) {
				if (sdp["Keystone"] == null)
					sdp["Keystone"] = [];
				sdp["Keystone"].push(p);
			} else {
				pp.push(p);
			}
		}
	}
	var sdd = [];
	var sdn = {};
	for (var n in pp) {
		var p = pp[n];
		var reg = /-?(\d+\.?\d*)$|(\d*\.?\d+)/;
		var m = p.match(reg);
        if (m == null) {
			sdd.push(p);
		} else {
			var r = p.replace(m[0], "XXX");
			if (sdn[r] == null) {
				sdn[r] = parseFloat(m[0]);
			} else {
				sdn[r] += parseFloat(m[0]);
			}
		}
	}
	for (var n in sdn) {
		var p = sdn[n];
		var r = n.replace("XXX", p);
		sdd.push(r);
	}
	var cats = {};
	var pcats = [];
	if (window.location.pathname.indexOf("/us/") >= 0) {
		cats = {
            "and Endurance Charges on Hit with Claws": "Weapon",
            "Endurance Charge": "Charges",
            "Frenzy Charge": "Charges",
            "Power Charge": "Charges",
            "Maximum number of Spectres": "Minion",
            "Maximum number of Zombies": "Minion",
            "Maximum number of Skeletons": "Minion",
            "Minions deal": "Minion",
            "Minions have": "Minion",
            "Minions Leech": "Minion",
            "Minions Regenerate": "Minion",
            "Mine Damage": "Trap",
            "Trap Damage": "Trap",
            "Trap Duration": "Trap",
            "Trap Trigger Radius": "Trap",
            "Mine Duration": "Trap",
            "Mine Laying Speed": "Trap",
            "Trap Throwing Speed": "Trap",
            "Can set up to": "Trap",
            "Detonating Mines is Instant": "Trap",
            "Mine Damage Penetrates": "Trap",
            "Mines cannot be Damaged": "Trap",
            "Trap Damage Penetrates": "Trap",
            "Traps cannot be Damaged": "Trap",
            "Totem Duration": "Totem",
            "Casting Speed for Summoning Totems": "Totem",
            "Totem Life": "Totem",
            "Totem Damage": "Totem",
            "Attacks used by Totems": "Totem",
            "Spells Cast by Totems": "Totem",
            "Totems gain": "Totem",
            "Totems have": "Totem",
            "Curse Duration": "Curse",
            "Effect of your Curses": "Curse",
            "Radius of Curses": "Curse",
            "Cast Speed for Curses": "Curse",
            "Enemies can have 1 additional Curse": "Curse",
            "Mana Reserved": "Aura",
            "effect of Auras": "Aura",
            "Radius of Auras": "Aura",
            "Effect of Buffs on You": "Aura",
            "Weapon Critical Strike Chance": "Crit",
            "increased Critical Strike Chance": "Crit",
            "increased Critical Strike Multiplier": "Crit",
            "Global Critical Strike": "Crit",
            "Critical Strikes with Daggers Poison the enemy": "Crit",
            "Knocks Back enemies if you get a Critical Strike": "Crit",
            "increased Melee Critical Strike Multiplier": "Crit",
            "increased Melee Critical Strike Chance": "Crit",
            "Elemental Resistances while holding a Shield": "Shield",
            "Chance to Block Spells with Shields": "Block",
            "Armour from equipped Shield": "Shield",
            "additional Block Chance while Dual Wielding or Holding a shield": "Block",
            "Chance to Block with Shields": "Block",
            "Block and Stun Recovery": "Block",
            "Energy Shield from equipped Shield": "Shield",
            "Block Recovery": "Block",
            "Defences from equipped Shield": "Shield",
            "Damage Penetrates": "General", //needs to be here to pull into the correct tab.
            "reduced Extra Damage from Critical Strikes": "Defense",
            "Armour": "Defense",
            "all Elemental Resistances": "Defense",
            "Chaos Resistance": "Defense",
            "Evasion Rating": "Defense",
            "Cold Resistance": "Defense",
            "Lightning Resistance": "Defense",
            "maximum Mana": "Defense",
            "maximum Energy Shield": "Defense",
            "Fire Resistance": "Defense",
            "maximum Life": "Defense",
            "Light Radius": "Defense",
            "Evasion Rating and Armour": "Defense",
            "Energy Shield Recharge": "Defense",
            "Life Regenerated": "Defense",
            "Melee Physical Damage taken reflected to Attacker": "Defense",
            "Flask Recovery Speed": "Defense",
            "Avoid Elemental Status Ailments": "Defense",
            "Damage taken Gained as Mana when Hit": "Defense",
            "Avoid being Chilled": "Defense",
            "Avoid being Frozen": "Defense",
            "Avoid being Ignited": "Defense",
            "Avoid being Shocked": "Defense",
            "Avoid being Stunned": "Defense",
            "increased Stun Recovery": "Defense",
            "Flasks": "Defense",
            "Flask effect duration": "Defense",
            "Mana Regeneration Rate": "Defense",
            "maximum Mana": "Defense",
            "Armour": "Defense",
            "Avoid interruption from Stuns while Casting": "Defense",
            "Movement Speed": "Defense",
            "Mana Recovery from Flasks": "Defense",
            "Life Recovery from Flasks": "Defense",
            "Enemies Cannot Leech Life From You": "Defense",
            "Enemies Cannot Leech Mana From You": "Defense",
            "Ignore all Movement Penalties": "Defense",
            "Physical Damage Reduction": "Defense",
            "Hits that Stun Enemies have Culling Strike": "General",
            "increased Damage against Frozen, Shocked or Ignited Enemies": "General",
            "Shock Duration on enemies": "General",
            "Radius of Area Skills": "General",
            "chance to Ignite": "General",
            "chance to Shock": "General",
            "Mana Gained on Kill": "General",
            "Life gained on General": "General",
            "Burning Damage": "General",
            "Projectile Damage": "General",
            "Knock enemies Back on hit": "General",
            "chance to Freeze": "General",
            "Projectile Speed": "General",
            "Projectiles Piercing": "General",
            "Ignite Duration on enemies": "General",
            "Knockback Distance": "General",
            "Mana Cost of Skills": "General",
            "Chill Duration on enemies": "General",
            "Freeze Duration on enemies": "General",
            "Damage over Time": "General",
            "Chaos Damage": "General",
            "Enemies Become Chilled as they Unfreeze": "General",
            "Skill Effect Duration": "General",
            "Life Gained on Kill": "General",
            "Area Damage": "General",
            "Enemy Stun Threshold": "General",
            "Stun Duration": "General",
            "increased Damage against Enemies on Low Life": "General",
            "chance to gain Onslaught": "General",
            "Spell Damage": "Spell",
            "Elemental Damage with Spells": "Spell",
            "Accuracy Rating": "Weapon",
            "Mana gained for each enemy hit by your Attacks": "Weapon",
            "Melee Weapon and Unarmed range": "Weapon",
            "Life gained for each enemy hit by your Attacks": "Weapon",
            "chance to cause Bleeding": "Weapon",
            "Wand Physical Damage": "Weapon",
            "Attack Speed": "Weapon",
            "Melee Attack Speed": "Weapon",
            "Melee Damage": "Weapon",
            "Physical Damage with Claws": "Weapon",
            "Block Chance With Staves": "Block",
            "Physical Damage with Daggers": "Weapon",
            "Physical Attack Damage Leeched as Mana": "Weapon",
            "Physical Damage Dealt with Claws Leeched as Mana": "Weapon",
            "Arrow Speed": "Weapon",
            "Cast Speed while Dual Wielding": "Weapon",
            "Physical Damage with Staves": "Weapon",
            "Attack Damage with Main Hand": "Weapon",
            "Attack Damage against Bleeding Enemies": "Weapon",
            "Physical Damage with Axes": "Weapon",
            "Physical Weapon Damage while Dual Wielding": "Weapon",
            "Physical Damage with One Handed Melee Weapons": "Weapon",
            "Physical Damage with Two Handed Melee Weapons": "Weapon",
            "Physical Damage with Maces": "Weapon",
            "Physical Damage with Bows": "Weapon",
            "enemy chance to Block Sword Attacks": "Block",
            "additional Block Chance while Dual Wielding": "Block",
            "mana gained when you Block": "Block",
            "Melee Physical Damage": "Weapon",
            "Physical Damage with Swords": "Weapon",
            "Elemental Damage with Wands": "Weapon",
            "Elemental Damage with Maces": "Weapon",
            "Physical Attack Damage Leeched as Life": "Weapon",
            "Cold Damage with Weapons": "Weapon",
            "Fire Damage with Weapons": "Weapon",
            "Lightning Damage with Weapons": "Weapon",
            "Physical Damage Dealt with Claws Leeched as Life": "Weapon",
            "Elemental Damage with Weapons": "Weapon",
            "Physical Damage with Wands": "Weapon",
            "Damage with Wands": "Weapon",
            "increased Physical Damage": "General",
            "Elemental Damage": "General",
            "Cast Speed": "Spell",
            "Cold Damage": "General",
            "Fire Damage": "General",
            "Lightning Damage": "General",
            "Strength": "BaseStat",
            "Intelligence": "BaseStat",
            "Dexterity": "BaseStat"
		};
		pcats = ["Keystone", "BaseStat", "General", "Defense", "Shield", "Charges", "Weapon", "Aura", "Spell"];
	} else {
		cats = {
		"球": "能量球",
		"武器": "武器",
		"近戰物理": "武器",
		"近戰傷害": "武器",
		"區域": "法術",
		"暴擊": "暴擊",
		"穿透": "武器",
		"投射": "武器",
		"召喚物": "召喚物",
		"移動": "防禦",
		"魔力": "法術",
		"生命": "防禦",
		"護甲": "防禦",
		"閃避": "防禦",
		"防禦": "防禦",
		"增益": "法術",
		"法術": "法術",
		"施法": "法術",
		"陷阱": "陷阱",
		"攻擊": "武器",
		"命中": "武器",
		"智慧": "基本屬性",
		"敏捷": "基本屬性",
		"力量": "基本屬性",
		"盾": "防禦",
		"雙持": "武器",
		"弓": "武器",
		"斧": "武器",
		"錘": "武器",
		"杖類": "武器",
		"長杖": "武器",
		"匕首": "武器",
		"爪": "武器",
		"法杖": "武器",
		"骷髏": "召喚物",
		"僵屍": "召喚物",
		"幽魂": "召喚物",
		"圖騰": "召喚物",
		"全能力": "基本屬性",
		"抗性": "防禦"
		};
		pcats = ["Keystone", "重點", "基本屬性", "法術", "防禦", "能量球", "武器"];
	}
		for (var n in sdd) {
			var p = sdd[n];
			var found = false;
			for (var o in cats) {
				if (p.indexOf(o) > 0) {
					found = true;
					if (sdp[cats[o]] == null) {
						sdp[cats[o]] = [];
					}
					sdp[cats[o]].push(p);
					break;
				}
			}
			if (found == false) {
				if (sdp["Others"] == null)
					sdp["Others"] = [];
				sdp["Others"].push(p);
			}
		}
		for (var p in pcats) {
			n = pcats[p];
			if (sdp[n] != null) {
				$("#summary").append("<div class='attrCat'>"+n+"</div>");
				for(var o in sdp[n]) {
					$("#summary").append("<li>"+sdp[n][o]+"</li>");
				}
				delete sdp[n];
			}
		}
		for (var n in sdp) {
			$("#summary").append("<div class='attrCat'>"+n+"</div>");
			for(var o in sdp[n]) {
				$("#summary").append("<li>"+sdp[n][o]+"</li>");
			}
		}
};



            var r = this;
			
            window.top.location != document.location && (this.$treeLinkEl.show(),
            this.$toggleFullScreenEl.hide());
            var i = function() {
                var t = window.location.origin + window.location.pathname
                  , n = "";
                    n = t;
                r.$permaLink.val(n),
				r.calSkillTree(),
                r.$treeLinkEl.length && r.$treeLinkEl.click(function() {
                    window.open(n)
                })
            }
            ;

            this.skillTree = new t("passiveSkillTree","poe-popup-container",this.$window.width(),this.$window.height() - r.$controlsEl.height(),this.startClass,this.zoomLevels,this.passiveSkillTreeData,{
                events: {
                    classChosen: function(e) {
                        r.$classStartPoint.val(e),
                        r.setAscendancyOptions(e)
                    },
                    historyUrlSet: function(e) {
                        r.curHistoryUrl = e,
                        i()
                    },
                    pointsChanged: function() {
                        r.$pointsUsedEl.text(r.skillTree.passiveAllocation.numAllocatedSkills),
                        r.$totalPointsEl.text(r.skillTree.passiveAllocation.getTotalSkillPoints())
                    },
                    onload: function() {
                        setTimeout(function() {
                            r.$controlsEl.slideDown(500)
                        }, 500)
                    },
                    onFullScreenUpdate: function() {
                        return r.$controlsEl.css("width", r.$window.width()),
                        {
                            top: "0px",
                            left: "0px",
                            width: r.$window.width(),
                            height: r.$window.height() - r.$controlsEl.height()
                        }
                    },
                    onFullScreenBegin: function() {
                        r.$popupContainerEl.append(r.$controlsEl),
                        r.$controlsEl.css("width", r.$window.width()).css("position", "fixed").css("bottom", "0px").css("left", "0px").css("z-index", 1e3),
                        r.$toggleFullScreenEl.val("Exit Full Screen (f)")
                    },
                    onFullScreenEnd: function() {
                        r.$controlsEl.css("width", "auto").css("position", "relative"),
                        r.$controlsContainerEl.append(r.$controlsEl),
                        r.$toggleFullScreenEl.val("Full Screen (f)")
                    }
                },
                ascClasses: r.ascClasses,
                treeControls: this
            }),
			/* default fullscreen */
			this.skillTree.fullScreen = !0,
			this.skillTree.events.onFullScreenBegin(),
			this.skillTree.settings.highlightShortestPaths = true,
            this.setAscendancyOptions = function(t) {
                r.$ascendancyClass.empty(),
                r.$ascendancyClass.append(e("<option></option>").attr("value", 0).text("None"));
                for (var n in r.ascClasses[t].classes) {
                    var i = e("<option></option>").attr("value", n).text(r.ascClasses[t].classes[n].displayName);
                    r.skillTree.ascendancyClass && n == r.skillTree.ascendancyClass && i.attr("selected", !0),
                    r.$ascendancyClass.append(i)
                }
            }
            ,
            this.skillTree.loadStateFromUrl(),
            this.$classStartPoint.change(function(e) {
                r.skillTree.reset({
                    characterClass: e.target.value,
                    ascendancyClass: 0
                })
            }),
            this.$ascendancyClass.change(function(e) {
                r.skillTree.reset({
                    characterClass: r.skillTree.characterClass,
                    ascendancyClass: e.target.value
                })
            }),
            this.$resetEl.click(function(e) {
                r.skillTree.reset()
            }),
            this.$toggleFullScreenEl.click(function(e) {
                r.skillTree.toggleFullScreen()
            }),
            this.$permaLink.click(function() {
                r.$permaLink.select()
            }),
			this.$importSkillTree.click(function() {
				var imp = prompt("Import another SkillTree", "");
				if (imp != null) {
					var ii = imp;
					if (ii.indexOf("?") > 0) {
						ii = ii.substring(0, ii.indexOf("?"));
					}
					var t = ii.split("/"), n = t[t.length - 1], rr = t[t.length - 2];
					if (n == "passive-skill-tree" || n == "" && rr == "passive-skill-tree") {
					} else {
						r.skillTree.loadHistoryUrl(n == "" ? rr : n);
						i();
					}
				}
			}),
            r.skillTree.isHistorySupported() || r.$permaLink.hide(),
            this.$higlightSimilarEl.change(function(e) {
                r.skillTree.settings.highlightSimilarNodes = r.$higlightSimilarEl.is(":checked")
            }),
            this.$highlightShortestPathsEl.change(function(e) {
                r.skillTree.settings.highlightShortestPaths = r.$highlightShortestPathsEl.is(":checked")
            }),
            this.$bbcodePermaLinkEl.change(function(e) {
                r.bbcodePermaL = bbcodePermaLinkEl.is(":checked");
                var t = function() {
                    r.skillTree.updateCanvasSize()
                }
                ;
                r.$bbcodePermaL ? r.$buildNameContEl.fadeIn(200, t) : r.$buildNameContEl.fadeOut(200, t),
                i()
            }),
            this.$searchBoxEl.keypress(function(e) {
                e.stopPropagation()
            }),
            this.$buildNameEl.keypress(function(e) {
                e.stopPropagation()
            }),
            this.$buildNameEl.keyup(function(e) {
                i()
            }),
            this.$searchBoxEl.keyup(function(e) {
                r.skillTree.highlightSearchQuery(r.$searchBoxEl.val())
            });

                e('#sidebar-dock').click(function(e) {
                    //$("#sidebar").toggle();
                    if ($("#sidebar").is(":visible")) {
                        $("#sidebar").hide();
                        $("#sidebar-dock").css("left", "0px");
                    } else {
                        $("#sidebar").show();
                        $("#sidebar-dock").css("left", "400px");
                    }
                });

                e("#sidebar-dock").mouseover(function(){
                    $(this).css("cursor", "hand");
                    $(this).css("background", "#444");
                });

                e("#sidebar-dock").mouseout(function(){
                    $(this).css("cursor", "pointer");
                    $(this).css("background", "#222");
                });
        }
        ,
        this.init()
    }
    ;
    return r
})

