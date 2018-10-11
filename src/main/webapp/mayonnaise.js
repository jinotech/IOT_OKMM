function F_CheckKey(a, b) {
    a = (a) ? a : window.event;
    code = (a.keyCode) ? a.keyCode : a.charCode;
    for (var c = 0; c < b.length; c++) {
        if (b[c] == code) {
            return true
        }
    }
    return false
}
JinoController = function(c) {
    this.map = c;
    this.nodeEditor = null;
    this.enterKeyDown = false;
    document.onkeydown = function(d) {
        d = d || window.event;
        if ((d.metaKey || d.ctrlKey) && d.keyCode == 86) {
            return true
        }
        if (jMap.work.hasFocus()) {
            return false
        }
        return true
    };
    this.setNodeEditor(c.nodeEditorHandle[0]);
    $(this.map.work).on("vmousedown", {
        controller: this
    }, this.mousedown);
    $(this.map.work).on("vmousemove", {
        controller: this
    }, this.mousemove);
    $(this.map.work).on("vmouseup", {
        controller: this
    }, this.mouseup);
    $(this.map.work).on("vclick", {
        controller: this
    }, this.click);
    this.map.work.addEventListener("touchstart", this.touchstart, false);
    this.map.work.onkeydown = this.keyDown;
    this.map.work.onkeyup = this.keyUp;
    this.map.work.ondragenter = function(d) {
        d = d || window.event;
        if (d.preventDefault) {
            d.preventDefault()
        } else {
            d.returnValue = false
        }
    };
    this.map.work.ondragover = function(d) {
        d = d || window.event;
        if (d.preventDefault) {
            d.preventDefault()
        } else {
            d.returnValue = false
        }
    };
    this.map.work.ondrop = function(d) {
        d = d || window.event;
        if (d.preventDefault) {
            d.preventDefault()
        } else {
            d.returnValue = false
        }
    };

    function b(d) {
        if (d < 0) {
            if (jMap.scaleTimes < 0.2) {
                return
            }
            jMap.scale(jMap.scaleTimes - 0.1)
        } else {
            if (jMap.scaleTimes > 2.5) {
                return
            }
            jMap.scale(jMap.scaleTimes + 0.1)
        }
    }

    function a(d) {
        var f = 0;
        if (!d) {
            d = window.event
        }
        if (d.wheelDelta) {
            f = d.wheelDelta / 120;
            if (window.opera) {
                f = -f
            }
        } else {
            if (d.detail) {
                f = -d.detail / 3
            }
        }
        if (f) {
            b(f)
        }
        if (d.preventDefault) {
            d.preventDefault()
        }
        d.returnValue = false
    }
};
JinoController.prototype.type = "JinoController";
JinoController.prototype.keyUp = function(a) {
    var b = a.keyCode;
    switch (b) {
        case 13:
            this.enterKeyDown = false;
            break
    }
};
JinoController.prototype.keyDown = function(k) {
    if (STAT_NODEEDIT) {
        return true
    }
    k = k || window.event;
    var a = null;
    if (k) {
        a = k.ctrlKey
    } else {
        if (k && document.getElementById) {
            a = (Event.META_MASK || Event.CTRL_MASK)
        } else {
            if (k && document.layers) {
                a = (k.metaKey || k.ctrlKey)
            }
        }
    }
    var h = k.altKey;
    var d = k.shiftKey;
    var b = k.keyCode;
    switch (b) {
        case 35:
            if (h) {
                unfoldingAllAction()
            }
            break;
        case 36:
            if (h) {
                foldingAllAction()
            }
            break;
        case 37:
            if (ScaleAnimate.isShowMode()) {
                ScaleAnimate.prevShow(30);
                return false
            }
            var f = jMap.getSelecteds().getLastElement();
            switch (jMap.layoutManager.type) {
                case "jMindMapLayout":
                    if (f.isRootNode()) {
                        var c = f.getChildren();
                        for (var g = 0; g < c.length; g++) {
                            if (c[g].position == "left") {
                                c[g].focus(true);
                                break
                            }
                        }
                    } else {
                        if (f.isLeft()) {
                            jMap.controller.childNodeFocusAction(f)
                        } else {
                            jMap.controller.parentNodeFocusAction(f)
                        }
                    }
                    break;
                case "jTreeLayout":
                    jMap.controller.prevSiblingNodeFocusAction(f);
                    break;
                default:
            }
            break;
        case 38:
            if (a) {
                ScaleAnimate.tempRotate(jMap.getSelecteds().getLastElement());
                return false
            }
            var f = jMap.getSelecteds().getLastElement();
            switch (jMap.layoutManager.type) {
                case "jMindMapLayout":
                    if (f.isRootNode()) {} else {
                        jMap.controller.prevSiblingNodeFocusAction(f)
                    }
                    break;
                case "jTreeLayout":
                    jMap.controller.parentNodeFocusAction(f);
                    break;
                default:
            }
            break;
        case 39:
            if (ScaleAnimate.isShowMode()) {
                ScaleAnimate.nextShow(30);
                return false
            }
            var f = jMap.getSelecteds().getLastElement();
            switch (jMap.layoutManager.type) {
                case "jMindMapLayout":
                    if (f.isRootNode()) {
                        var c = f.getChildren();
                        for (var g = 0; g < c.length; g++) {
                            if (c[g].position == "right") {
                                c[g].focus(true);
                                break
                            }
                        }
                    } else {
                        if (f.isLeft()) {
                            jMap.controller.parentNodeFocusAction(f)
                        } else {
                            jMap.controller.childNodeFocusAction(f)
                        }
                    }
                    break;
                case "jTreeLayout":
                    jMap.controller.nextSiblingNodefocusAction(f);
                    break;
                default:
            }
            break;
        case 40:
            var f = jMap.getSelecteds().getLastElement();
            switch (jMap.layoutManager.type) {
                case "jMindMapLayout":
                    if (f.isRootNode()) {} else {
                        jMap.controller.nextSiblingNodefocusAction(f)
                    }
                    break;
                case "jTreeLayout":
                    jMap.controller.childNodeFocusAction(f);
                    break;
                default:
            }
            break;
        case 48:
            if (a || k.metaKey) {
                jMap.clipboardManager.clipboard = ""
            }
            break;
        case 49:
            if (a) {
                NodeColorMix(jMap.rootNode)
            }
            break;
        case 50:
            if (a) {}
            break;
        case 51:
            if (a) {}
            break;
        case 52:
            if (a) {}
            break;
        case 53:
            if (a) {}
            break;
        case 54:
            if (a) {}
            break;
        case 55:
            if (a) {}
            break;
        case 65:
            if (a) {}
            break;
        case 67:
            if (a) {
                copyAction()
            }
            break;
        case 70:
            if (a) {
                findNodeAction()
            }
            break;
        case 71:
            if (a) {
                if (AL_GOOGLE_SEARCHER == null) {
                    SET_GOOGLE_SEARCHER(true)
                } else {
                    SET_GOOGLE_SEARCHER(false)
                }
            }
            break;
        case 75:
            if (a) {
                insertHyperAction()
            }
            if (h) {
                imageProviderAction()
            }
            break;
        case 77:
            break;
        case 78:
            if (a) {
                location.href = "/mindmap/new.do"
            } else {
                if (d) {
                    jMap.controller.prevFindNodeAction()
                } else {
                    jMap.controller.nextFindNodeAction()
                }
            }
            break;
        case 79:
            if (a) {
                openMap()
            }
            break;
        case 80:
            if (a) {
                if (ScaleAnimate.isShowMode()) {
                    ScaleAnimate.endShowMode()
                } else {
                    ScaleAnimate.startShowMode(30, 20, true)
                }
            }
            break;
        case 81:
            if (a) {
                var l = location.pathname;
                window.open(l.substring(0, l.indexOf("/map", 0)) + "/viewqueue.do?page=" + location.pathname)
            }
            break;
        case 82:
            if (a) {
                resetCoordinateAction()
            }
            break;
        case 114:
            if (a) {
                resetCoordinateAction()
            }
            break;
        case 83:
            if (a) {
                if (!jMap.isSaved()) {
                    saveMap()
                }
            }
            break;
        case 88:
            if (a) {
                cutAction()
            }
            break;
        case 86:
            if (a) {
                pasteAction()
            }
            if (a || k.metaKey) {
                return true
            }
            break;
        case 89:
            if (a) {}
            break;
        case 90:
            if (a) {}
            break;
        case 113:
            editNodeAction();
            break;
        case 13:
            if (!this.enterKeyDown) {
                insertSiblingAction();
                this.enterKeyDown = true
            }
            break;
        case 27:
            if (a) {}
            break;
        case 32:
            foldingAction();
            break;
        case 8:
        case 46:
            deleteAction();
            break;
        case 9:
        case 45:
            insertAction();
            break;
        case 107:
            zoominAction(0.1);
            break;
        case 109:
            zoomoutAction(0.1);
            break;
        case 187:
            if (d) {
                zoominAction(0.1)
            }
            break;
        case 189:
            if (d) {
                zoomoutAction(0.1)
            }
            break;
        case 191:
            if (d) {
                EditorManager.temporarily()
            }
            break
    }
    return false
};
JinoController.prototype.mousemove = function(c) {
    var g;
    var a;
    if (!c) {
        var c = window.event
    }
    a = c.originalEvent.originalEvent || c.originalEvent || c;
    if (a.target) {
        g = a.target
    } else {
        if (a.srcElement) {
            g = a.srcElement
        }
    }
    if (g.nodeType == 3) {
        g = g.parentNode
    }
    if (g.id == "nodeEditor") {
        return true
    }
    if (a.preventDefault) {
        a.preventDefault()
    } else {
        a.returnValue = false
    }
    var k = (c.clientX || c.targetTouches[0].pageX);
    var h = (c.clientY || c.targetTouches[0].pageY);
    var r = k - DRAG_POS.x;
    var p = h - DRAG_POS.y;
    DRAG_POS.x = k;
    DRAG_POS.y = h;
    if (jMap.DragPaper) {
        this.scrollTop -= p;
        this.scrollLeft -= r
    }
    if (jMap.mouseRightClicked) {
        return
    }
    if (jMap.dragEl && jMap.dragEl._drag && !jMap.movingNode && !jMap.mouseRightClicked) {
        if (!jMap.isAllowNodeEdit(jMap.dragEl.node)) {
            jMap.DragPaper = false;
            jMap.positionChangeNodes = false;
            jMap.dragEl._drag = null;
            delete jMap.dragEl._drag;
            jMap.dragEl = null;
            delete jMap.dragEl;
            return
        }
        var m = jMap.getSelecteds();
        jMap.positionChangeNodes = m;
        jMap.movingNode = RAPHAEL.rect();
        var b = jMap.movingNode;
        b.ox = jMap.dragEl.node.body.type == "rect" ? jMap.dragEl.node.body.attr("x") : jMap.dragEl.node.body.attr("cx");
        b.oy = jMap.dragEl.node.body.type == "rect" ? jMap.dragEl.node.body.attr("y") : jMap.dragEl.node.body.attr("cy");
        var d = jMap.dragEl.node.body.attr();
        delete d.scale;
        delete d.translation;
        delete d.gradient;
        d["fill-opacity"] = 0.2;
        d.fill = jMap.dragEl.node.background_color;
        d.stroke = jMap.dragEl.node.edge.color;
        b.attr(d);
        b.toBack()
    }
    if (jMap.dragEl && jMap.dragEl._drag && jMap.movingNode && !jMap.movingNode.removed) {
        var k = c.clientX;
        var h = c.clientY;
        var l = document.documentElement.scrollTop || document.body.scrollTop;
        var n = document.documentElement.scrollLeft || document.body.scrollLeft;
        k += n;
        h += l;
        var r = k - jMap.dragEl._drag.x;
        var p = h - jMap.dragEl._drag.y;
        var b = jMap.movingNode;
        var q = r / jMap.cfg.scale;
        var o = p / jMap.cfg.scale;
        var f = b.type == "rect" ? {
            x: b.ox + q,
            y: b.oy + o
        } : {
            cx: b.ox + q,
            cy: b.oy + o
        };
        b.attr(f)
    }
};
JinoController.prototype.MoveWithChildNode = function(d, b, a) {
    d.translate(b, a);
    for (var c = d.children.length; c--;) {
        MoveWithChildNode(d.children[c], b, a)
    }
};
JinoController.prototype.touchstart = function(b) {
    if (ISMOBILE && supportsTouch && b.touches && b.touches.length == 2) {
        var a = jMap.getSelecteds().getLastElement();
        if (a) {
            a.setFolding(!a.folded);
            jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(node);
            jMap.layoutManager.layout(true)
        }
    }
};
JinoController.prototype.mousedown = function(c) {
    var b;
    var a;
    if (!c) {
        var c = window.event
    }
    a = c.originalEvent.originalEvent || c.originalEvent || c;
    if (a.target) {
        b = a.target
    } else {
        if (a.srcElement) {
            b = a.srcElement
        }
    }
    if (b.nodeType == 3) {
        b = b.parentNode
    }
    if (b.id == "nodeEditor") {
        return true
    }
    if (a.preventDefault) {
        a.preventDefault()
    } else {
        a.returnValue = false
    }
    if (STAT_NODEEDIT) {
        jMap.controller.stopNodeEdit(true)
    }
    if (b.id == "paper_mapview") {
        DRAG_POS.x = c.clientX;
        DRAG_POS.y = c.clientY;
        jMap.DragPaper = true;
        if (!ISMOBILE) {
            jMap.controller.blurAll()
        }
    } else {
        if (b.id == "jinomap") {
            if (b.offsetLeft <= c.clientX && c.clientX < b.clientWidth + b.offsetLeft && b.offsetTop <= c.clientY && c.clientY < b.clientHeight + b.offsetTop) {
                DRAG_POS.x = c.clientX;
                DRAG_POS.y = c.clientY;
                jMap.DragPaper = true
            }
            if (!ISMOBILE) {
                jMap.controller.blurAll()
            }
        }
    }
};
JinoController.prototype.mouseup = function(b) {
    var c;
    var a;
    if (!b) {
        var b = window.event
    }
    a = b.originalEvent.originalEvent || b.originalEvent || b;
    if (a.target) {
        c = a.target
    } else {
        if (a.srcElement) {
            c = a.srcElement
        }
    }
    if (c.nodeType == 3) {
        c = c.parentNode
    }
    if (a.preventDefault) {
        a.preventDefault()
    } else {
        a.returnValue = false
    }
    jMap.DragPaper = false;
    jMap.positionChangeNodes = false;
    if (jMap.movingNode && !jMap.movingNode.removed) {
        var f = b.clientX;
        var d = b.clientY;
        var g = document.documentElement.scrollTop || document.body.scrollTop;
        var h = document.documentElement.scrollLeft || document.body.scrollLeft;
        f += h;
        d += g;
        var p = f - jMap.dragEl._drag.x;
        var m = d - jMap.dragEl._drag.y;
        jMap.movingNode.connection && jMap.movingNode.connection.line.remove();
        jMap.movingNode.remove();
        delete jMap.movingNode;
        jMap.dragEl._drag = null;
        delete jMap.dragEl._drag;
        var o = p / jMap.cfg.scale;
        var l = m / jMap.cfg.scale;
        var n = (o > 0) ? o : -o;
        var k = (l > 0) ? l : -l;
        if (n > NODE_MOVING_IGNORE || k > NODE_MOVING_IGNORE) {
            jMap.dragEl.node.relativeCoordinate(o, l)
        }
        jMap.dragEl = null;
        delete jMap.dragEl
    } else {
        if (jMap.dragEl) {
            jMap.dragEl._drag = null;
            delete jMap.dragEl._drag
        }
        jMap.dragEl = null;
        delete jMap.dragEl
    }
};
JinoController.prototype.click = function(c) {
    var b;
    var a;
    if (!c) {
        var c = window.event
    }
    a = c.originalEvent.originalEvent || c.originalEvent || c;
    if (a.target) {
        b = a.target
    } else {
        if (a.srcElement) {
            b = a.srcElement
        }
    }
    if (b.nodeType == 3) {
        b = b.parentNode
    }
};
JinoController.prototype.nodeEditKeyDown = function(b) {
    b = b || window.event;
    if (F_CheckKey(b, [27])) {
        if (J_NODE_CREATING) {
            var c = null;
            var a = null;
            while (c = jMap.getSelecteds().pop()) {
                a = c.getParent();
                c.remove()
            }
            J_NODE_CREATING.focus(true);
            jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(a);
            jMap.layoutManager.layout(true)
        }
        jMap.controller.stopNodeEdit(false)
    } else {
        if (F_CheckKey(b, [13])) {
            if (BrowserDetect.browser == "Firefox" && jMap.keyEnterHit++ == 0) {
                return false
            }
            if (b.shiftKey) {
                var d = jMap.controller.nodeEditor;
                d.style.height = d.offsetHeight + 9 + "px";
                return true
            }
            jMap.controller.stopNodeEdit(true);
            return false
        }
    }
    return true
};
JinoController.prototype.setNodeEditor = function(a) {
    this.nodeEditor = a;
    if (this.nodeEditor) {
        this.nodeEditor.style.display = "none";
        this.nodeEditor.onkeypress = this.nodeEditKeyDown
    }
};
JinoController.prototype.startNodeEdit = function(d) {
    if (this.nodeEditor == undefined || this.nodeEditor == null || d.removed) {
        return false
    }
    if (!jMap.isAllowNodeEdit(d)) {
        return false
    }
    var h = TEXT_HGAP;
    var a = TEXT_VGAP;
    if (STAT_NODEEDIT) {
        this.stopNodeEdit(true)
    }
    STAT_NODEEDIT = true;
    this.nodeEditor.setAttribute("nodeID", d.id);
    var f = this.nodeEditor;
    var m = [];
    m.x = 0;
    m.y = 0;
    m.width = RAPHAEL.getSize().width;
    m.height = RAPHAEL.getSize().height;
    if (RAPHAEL.canvas.getAttribute("viewBox")) {
        var g = RAPHAEL.canvas.getAttribute("viewBox").split(" ");
        m.x = g[0];
        m.y = g[1];
        m.width = g[2];
        m.height = g[3]
    }
    f.style.fontFamily = d.text.attr()["font-family"];
    f.style.fontSize = d.text.attr()["font-size"] * this.map.cfg.scale + "px";
    if (d.isLeft && d.isLeft()) {
        f.style.textAlign = "right"
    } else {
        f.style.textAlign = "left"
    }
    var b = d.body.getBBox().width * this.map.cfg.scale - h;
    var l = d.body.getBBox().height * this.map.cfg.scale - a;
    var c = (d.body.getBBox().x - m.x) * RAPHAEL.getSize().width / m.width + h / 4;
    var k = (d.body.getBBox().y - m.y) * RAPHAEL.getSize().height / m.height + a / 4;
    f.style.display = "";
    f.style.width = b + "px";
    f.style.height = l + a + "px";
    f.style.left = c + "px";
    f.style.top = k - a / 4 + "px";
    f.style.zIndex = 999;
    f.isleft = d.isLeft();
    f.value = d.getText();
    f.focus();
    return true
};
JinoController.prototype.stopNodeEdit = function(a) {
    STAT_NODEEDIT = false;
    J_NODE_CREATING = false;
    jMap.work.focus();
    if (this.nodeEditor == undefined || this.nodeEditor == null) {
        return null
    }
    if (a == false) {
        this.nodeEditor.style.display = "none";
        return null
    }
    var c = this.nodeEditor.getAttribute("nodeID");
    if (c == undefined || c == null || c == "") {
        this.nodeEditor.style.display = "none";
        return null
    }
    var b = this.map.getNodeById(c);
    if (b == undefined || b == null) {
        this.nodeEditor.style.display = "none";
        return null
    }
    this.nodeEditor.style.display = "none";
    this.nodeEditor.setAttribute("nodeID", "");
    var f = this.nodeEditor;
    var d = JinoUtil.trimStr(f.value);
    if (d == b.getText()) {
        return null
    }
    b.setText(d);
    jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(b);
    jMap.layoutManager.layout(true);
    if (ISMOBILE || supportsTouch) {
        $("html").offset({
            top: 0
        })
    }
    return b
};
JinoController.prototype.blurAll = function() {
    var b = jMap.getSelecteds();
    for (var a = b.length - 1; a >= 0; a--) {
        b[a].blur()
    }
};
JinoController.prototype.copyAction = function() {
    jMap.clipboardManager.toClipboard(jMap.getSelecteds(), true)
};
JinoController.prototype.cutAction = function(c) {
    if (!c) {
        c = jMap.getSelecteds()
    }
    for (var b = 0; b < c.length; b++) {
        if (!jMap.isAllowNodeEdit(c[b])) {
            return false
        }
    }
    jMap.clipboardManager.toClipboard(c);
    for (var b = 0; b < c.length; b++) {
        c[b].remove()
    }
    var a = c[0].parent;
    jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(a);
    jMap.layoutManager.layout(true);
    return a
};
JinoController.prototype.pasteAction = function(c) {
    if (jMap.cfg.realtimeSave) {
        var d = jMap.saveAction.isAlive();
        if (!d) {
            return null
        }
    }
    if (!c) {
        c = jMap.getSelected()
    }
    c.folded && c.setFolding(false);
    var f = jMap.loadManager.pasteNode(c, jMap.clipboardManager.getClipboardText());
    var b = function() {
        for (var l = 0; l < f.length; l++) {
            jMap.saveAction.pasteAction(f[l])
        }
        if (jMap.cfg.lazyLoading) {
            for (var l = 0; l < f.length; l++) {
                var k = f[l].getChildren();
                for (var m = k.length - 1; m >= 0; m--) {
                    k[m].removeExecute()
                }
            }
        }
        var g = "<clipboard>";
        for (var l = 0; l < f.length; l++) {
            var h = f[l].toXML();
            g += h
        }
        g += "</clipboard>";
        jMap.fireActionListener(ACTIONS.ACTION_NODE_PASTE, c, g);
        jMap.initFolding(c);
        jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(c);
        jMap.layoutManager.layout(true)
    };
    if (jMap.loadManager.imageLoading.length == 0) {
        b()
    } else {
        var a = jMap.addActionListener(ACTIONS.ACTION_NODE_IMAGELOADED, function() {
            b();
            jMap.removeActionListener(a)
        })
    }
};
JinoController.prototype.deleteAction = function() {
    var f = jMap.getSelecteds();
    for (var b = 0; b < f.length; b++) {
        if (!jMap.isAllowNodeEdit(f[b])) {
            return false
        }
    }
    var c = null;
    var a = null;
    var d = -1;
    while (c = jMap.getSelecteds().pop()) {
        a = c.getParent();
        d = c.getIndexPos();
        c.remove()
    }
    if (a) {
        jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(a);
        jMap.layoutManager.layout(true);
        if (d != -1) {
            if (a.getChildren().length <= 0) {
                a.focus()
            } else {
                if (a.getChildren().length > d) {
                    a.getChildren()[d].focus()
                } else {
                    a.getChildren()[a.getChildren().length - 1].focus()
                }
            }
        }
    } else {
        jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
        jMap.getRootNode().screenFocus()
    }
};
JinoController.prototype.editNodeAction = function() {
    jMap.getSelecteds().getLastElement() && jMap.controller.startNodeEdit(jMap.getSelecteds().getLastElement())
};
JinoController.prototype.ShiftenterAction = function() {
    var a = jMap.controller.nodeEditor;
    a.focus(true);
    $(a).insertAtCaret("\n");
    a.style.height = a.offsetHeight + 9 + "px"
};
JinoController.prototype.insertAction = function() {
    var b = jMap.getSelecteds().getLastElement();
    if (b) {
        J_NODE_CREATING = b;
        b.folded && b.setFolding(false);
        var c = {
            parent: b
        };
        if (b.children.length > 0) {
            c.sibling = b.children[b.children.length - 1]
        }
        var a = jMap.createNodeWithCtrl(c);
        a.focus(true);
        jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(b);
        jMap.layoutManager.layout(true);
        a.setTextExecute("");
        jMap.controller.startNodeEdit(a)
    }
};
JinoController.prototype.insertSiblingAction = function() {
    if (BrowserDetect.browser == "Firefox") {
        jMap.keyEnterHit = 0
    }
    var f = jMap.getSelecteds().getLastElement();
    var d = f && f.parent;
    if (d) {
        J_NODE_CREATING = f;
        var b = f.getIndexPos() + 1;
        var a = null;
        if (f.position && f.getParent().isRootNode()) {
            a = f.position
        }
        var g = {
            parent: d,
            index: b,
            position: a,
            sibling: f
        };
        var c = jMap.createNodeWithCtrl(g);
        c.focus(true);
        jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(c.parent);
        jMap.layoutManager.layout(true);
        c.setTextExecute("");
        jMap.controller.startNodeEdit(c)
    }
};
JinoController.prototype.insertTextOnBranch = function() {
    var d = jMap.getSelected();
    if (!jMap.isAllowNodeEdit(d)) {
        return false
    }
    var b = d.attributes && d.attributes.branchText;
    b = b || "";
    var a = '<form id="abcd"><div class="dialog_content " style="display:block;"><br />Text: <input type="text" id="jino_input_branch_text"name="jino_input_branch_text" onfocus= "this.select()" value="' + b + '" /></div></form>';

    function c(g, h) {
        if (g) {
            d.attributes.branchText = h.jino_input_branch_text;
            jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(d);
            jMap.layoutManager.layout(true)
        } else {
            d.attributes.branchText = undefined;
            jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(d);
            jMap.layoutManager.layout(true);
            document.getElementById("jino_input_branch_text").value = ""
        }
        jMap.saveAction.editAction(d)
    }
    $("#dialog").append(a);
    $("#dialog").dialog({
        autoOpen: false,
        closeOnEscape: true,
        modal: true,
        resizable: false,
        close: function(f, g) {
            $("#dialog .dialog_content").remove();
            $("#dialog").dialog("destroy");
            jMap.work.focus()
        }
    });
    $("#dialog").dialog("option", "width", "none");
    $("#dialog").dialog("option", "buttons", [{
        text: i18n.msgStore.button_apply,
        click: function(g) {
            var f = parseCallbackParam($("#dialog form").serializeArray());
            c(true, f)
        }
    }, {
        text: i18n.msgStore.hyperlink_delete,
        click: function() {
            var f = parseCallbackParam($("#dialog form").serializeArray());
            c(false, f)
        }
    }]);
    $("#dialog").dialog("option", "dialogClass", "insertHyperAction");
    $("#dialog").dialog("option", "title", i18n.msgStore.menu_edit_text_on_branch);
    $("#dialog").dialog("option", "open", function() {
        $("#abcd input[type='text']").keypress(function(g) {
            if (g.keyCode == 13) {
                var f = parseCallbackParam($("#dialog form").serializeArray());
                c(true, f);
                $("#dialog").dialog("close");
                return false
            }
        })
    });
    $("#dialog").dialog("open")
};
JinoController.prototype.insertHyperAction = function() {
    var d = jMap.getSelected();
    if (!jMap.isAllowNodeEdit(d)) {
        return false
    }
    var c = d.hyperlink && d.hyperlink.attr().href;
    c = c || "http://";
    var a = '<form id="abcd"><div class="dialog_content " style="display:block;"><br />URL: <input type="text" id="jino_input_url"name="jino_input_url" onfocus= "this.select()" value="' + c + '" /></div></form>';

    function b(g, h) {
        if (g) {
            d.setHyperlink(h.jino_input_url);
            jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(d);
            jMap.layoutManager.layout(true)
        } else {
            d.setHyperlink(null);
            jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(d);
            jMap.layoutManager.layout(true);
            document.getElementById("jino_input_url").value = "http://"
        }
        jMap.work.focus()
    }
    $("#dialog").append(a);
    $("#dialog").dialog({
        autoOpen: false,
        closeOnEscape: true,
        modal: true,
        resizable: false,
        close: function(f, g) {
            $("#dialog .dialog_content").remove();
            $("#dialog").dialog("destroy");
            jMap.work.focus()
        }
    });
    $("#dialog").dialog("option", "width", "none");
    $("#dialog").dialog("option", "buttons", [{
        text: i18n.msgStore.button_apply,
        click: function(g) {
            var f = parseCallbackParam($("#dialog form").serializeArray());
            b(true, f)
        }
    }, {
        text: i18n.msgStore.hyperlink_delete,
        click: function() {
            var f = parseCallbackParam($("#dialog form").serializeArray());
            b(false, f)
        }
    }]);
    $("#dialog").dialog("option", "dialogClass", "insertHyperAction");
    $("#dialog").dialog("option", "title", i18n.msgStore.menu_edit_hyperlink);
    $("#dialog").dialog("option", "open", function() {
        $("#abcd input[type='text']").keypress(function(g) {
            if (g.keyCode == 13) {
                var f = parseCallbackParam($("#dialog form").serializeArray());
                b(true, f);
                $("#dialog").dialog("close");
                return false
            }
        })
    });
    $("#dialog").dialog("open")
};
JinoController.prototype.insertImageAction = function() {
    var c = jMap.getSelected();
    if (!jMap.isAllowNodeEdit(c)) {
        return false
    }
    var b = c.imgInfo.href && c.imgInfo.href;
    b = b || "http://";
    var a = '<form><div class="dialog_content"><br />URL:<br /><input type="text" id="jino_input_img_url"name="jino_input_img_url" value=' + b + " /></div></form>";

    function d(g, h) {
        if (g) {
            c.setImage(h.jino_input_img_url);
            jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(c);
            jMap.layoutManager.layout(true)
        }
        $("#dialog").dialog("close");
        jMap.work.focus()
    }
    $("#dialog").append(a);
    $("#dialog").dialog({
        autoOpen: false,
        closeOnEscape: true,
        width: 350,
        modal: true,
        resizable: false,
        close: function(f, g) {
            $("#dialog .dialog_content").remove();
            $("#dialog").dialog("destroy");
            jMap.work.focus()
        },
    });
    $("#dialog").dialog("option", "width", "none");
    $("#dialog").dialog("option", "buttons", [{
        text: "<spring:message code='button.apply'/>",
        click: function() {
            var f = parseCallbackParam($("#dialog form").serializeArray());
            d(true, f)
        }
    }]);
    $("#dialog").dialog("option", "title", "<spring:message code='message.saveas'/>");
    $("#dialog").dialog("open")
};
JinoController.prototype.imageRemoveAction = function(b) {
    var a = jMap.getSelected();
    a.setImage();
    jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(a);
    jMap.layoutManager.layout(true)
};
JinoController.prototype.imageResizerAction = function(a) {
    if (!a) {
        a = jMap.getSelected()
    }
    JinoUtil.imgResizer(a)
};
JinoController.prototype.videoResizerAction = function(a) {
    if (!a) {
        a = jMap.getSelected()
    }
    JinoUtil.videoResizer(a)
};
JinoController.prototype.findNodeAction = function() {
    var a = '<form><div class="dialog_content"><br />' + i18n.msgStore.find + ' :<input type="text" id="jino_input_search_text"name="jino_input_search_text" value="" /><br /><br /><input type="checkbox" id="jino_check_search_ignorecase"name="jino_check_search_ignorecase" value="" checked>' + i18n.msgStore.ignore_case + '<br /><input type="checkbox" id="jino_check_search_wholeword"name="jino_check_search_wholeword" value=""> Whole word';
    i18n.msgStore.whole_word + "</div></form>";

    function b(g, k) {
        if (g) {
            var h = k.jino_input_search_text;
            var d = k.jino_check_search_ignorecase;
            var c = k.jino_check_search_wholeword;
            jMap.foundNodes = jMap.findNode(h, c, d, jMap.getSelecteds().getLastElement());
            jMap.findIndex = -1;
            if (jMap.foundNodes.length == 0) {} else {
                jMap.controller.nextFindNodeAction()
            }
        }
        $("#dialog").dialog("close");
        jMap.work.focus()
    }
    $("#dialog").append(a);
    $("#dialog").dialog({
        autoOpen: false,
        closeOnEscape: true,
        width: 350,
        modal: true,
        resizable: false,
        close: function(c, d) {
            $("#dialog .dialog_content").remove();
            $("#dialog").dialog("destroy");
            jMap.work.focus()
        },
    });
    $("#dialog").dialog("option", "width", "none");
    $("#dialog").dialog("option", "buttons", [{
        text: i18n.msgStore.button_apply,
        click: function() {
            var c = parseCallbackParam($("#dialog form").serializeArray());
            b(true, c)
        }
    }]);
    $("#dialog").dialog("option", "title", i18n.msgStore.find);
    $("#dialog").dialog("open")
};
JinoController.prototype.nextFindNodeAction = function() {
    jMap.findIndex++;
    if (jMap.findIndex < 0) {
        jMap.findIndex = 0;
        return
    }
    if (jMap.findIndex >= jMap.foundNodes.length) {
        jMap.findIndex = jMap.foundNodes.length - 1;
        return
    }
    var b = jMap.foundNodes[jMap.findIndex].node;
    var a = b;
    while (!a.isRootNode()) {
        a = a.getParent();
        a.folded && a.setFoldingExecute(false)
    }
    b.focus(true);
    jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(b);
    jMap.layoutManager.layout(true);
    screenFocusAction(b)
};
JinoController.prototype.prevFindNodeAction = function() {
    jMap.findIndex--;
    if (jMap.findIndex < 0) {
        jMap.findIndex = 0;
        return
    }
    if (jMap.findIndex >= jMap.foundNodes.length) {
        jMap.findIndex = jMap.foundNodes.length - 1;
        return
    }
    var b = jMap.foundNodes[jMap.findIndex].node;
    var a = b;
    while (!a.isRootNode()) {
        a = a.getParent();
        a.folded && a.setFoldingExecute(false)
    }
    b.focus(true);
    jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(b);
    jMap.layoutManager.layout(true);
    screenFocusAction(b)
};
JinoController.prototype.foldingAction = function(a) {
    if (!a) {
        a = jMap.getSelecteds().getLastElement()
    }
    a.setFolding(!a.folded);
    jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(a);
    jMap.layoutManager.layout(true)
};
JinoController.prototype.foldingAllAction = function() {
    if (this.map.cfg.lazyLoading) {
        alert("this is not supported by lazyloading.");
        return
    }
    var a = jMap.getSelecteds().getLastElement();
    if (a) {
        a.screenFocus()
    } else {
        jMap.getRootNode().screenFocus()
    }
    if (!a) {
        a = this.map.getRootNode()
    }
    a.setFoldingAll(true);
    jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
    jMap.layoutManager.layout(true)
};
JinoController.prototype.unfoldingAllAction = function() {
    if (this.map.cfg.lazyLoading) {
        alert("this is not supported by lazyloading.");
        return
    }
    var a = jMap.getSelecteds().getLastElement();
    if (!a) {
        a = this.map.getRootNode()
    }
    a.setFoldingAll(false);
    jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
    jMap.layoutManager.layout(true)
};
JinoController.prototype.parentNodeFocusAction = function(a) {
    a.getParent().focus(true)
};
JinoController.prototype.childNodeFocusAction = function(b) {
    if (b.folded) {
        b.setFolding(false);
        jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(b);
        jMap.layoutManager.layout(true);
        return false
    }
    var a = b.getChildren();
    if (a.length > 0) {
        a[0].focus(true)
    }
};
JinoController.prototype.prevSiblingNodeFocusAction = function(c) {
    var b = c.prevSibling(true);
    if (b) {
        var a = b.getParent();
        if (a.folded) {
            a.setFolding(false);
            jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(a);
            jMap.layoutManager.layout(true)
        }
        b.focus(true)
    }
};
JinoController.prototype.nextSiblingNodefocusAction = function(c) {
    var b = c.nextSibling(true);
    if (b) {
        var a = b.getParent();
        if (a.folded) {
            a.setFolding(false);
            jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(a);
            jMap.layoutManager.layout(true)
        }
        b.focus(true)
    }
};
var insertAtCursor = function(d, c) {
    if (document.selection) {
        d.focus();
        sel = document.selection.createRange();
        sel.text = c
    } else {
        if (d.selectionStart || d.selectionStart == "0") {
            var b = d.selectionStart;
            var a = d.selectionEnd;
            restoreTop = d.scrollTop;
            d.value = d.value.substring(0, b) + c + d.value.substring(a, d.value.length);
            d.selectionStart = b + c.length;
            d.selectionEnd = b + c.length;
            if (restoreTop > 0) {
                d.scrollTop = restoreTop
            }
        } else {
            d.value += c
        }
    }
};
var interceptTabs = function(a, b) {
    key = a.keyCode ? a.keyCode : a.which ? a.which : a.charCode;
    if (key == 9) {
        insertAtCursor(b, "\t");
        return false
    } else {
        return key
    }
};
JinoController.prototype.nodeStructureFromText = function(b) {
    if (!b) {
        b = jMap.getSelecteds().getLastElement()
    }
    var a = '<form><div class="dialog_content_nod"><br />' + i18n.msgStore.create_node_text + '<br /><br /><center><textarea id="okm_node_structure_textarea" name="okm_node_structure_textarea" onkeydown="return interceptTabs(event, this);" cols="50" rows="10"></textarea></center></div></form>';

    function c(d, h) {
        if (d) {
            var g = h.okm_node_structure_textarea;
            b.folded && b.setFoldingExecute(false);
            jMap.createNodeFromText(b, g);
            jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(b);
            jMap.layoutManager.layout(true)
        }
        $("#dialog_c").dialog("close");
        jMap.work.focus()
    }
    $("#dialog_c").append(a);
    $("#dialog_c").dialog({
        autoOpen: false,
        closeOnEscape: true,
        modal: true,
        resizable: false,
        close: function(d, f) {
            $("#dialog_c .dialog_content_nod").remove();
            $("#dialog_c").dialog("destroy");
            jMap.work.focus()
        },
    });
    $("#dialog_c").dialog("option", "width", "none");
    $("#dialog_c").dialog("option", "buttons", [{
        text: i18n.msgStore.button_apply,
        click: function() {
            var d = parseCallbackParam($("#dialog_c form").serializeArray());
            c(true, d)
        }
    }]);
    $("#dialog_c").dialog("option", "dialogClass", "nodeStructureFromText");
    $("#dialog_c").dialog("option", "title", i18n.msgStore.import_text);
    $("#dialog_c").dialog("open")
};
JinoController.prototype.nodeStructureToText = function(b) {
    if (!b) {
        b = jMap.getSelecteds().getLastElement()
    }
    var c = jMap.createTextFromNode(b, "\t");
    var a = '<div class="dialog_content_xml"><br />' + i18n.msgStore.node_structure + '<br /><br /><center><textarea id="okm_node_structure_textarea"  onfocus= "this.select()" name="okm_node_structure_textarea" onkeydown="return interceptTabs(event, this);" cols="50" rows="10">' + c + "</textarea></center></div>";
    $("#dialog_c").append(a);
    $("#dialog_c").dialog({
        autoOpen: false,
        closeOnEscape: true,
        modal: true,
        resizable: false,
        close: function(d, f) {
            $("#dialog_c .dialog_content_xml").remove();
            $("#dialog_c").dialog("destroy");
            jMap.work.focus()
        },
    });
    $("#dialog_c").dialog("option", "width", "none");
    $("#dialog_c").dialog("option", "dialogClass", "nodeStructureToText");
    $("#dialog_c").dialog("option", "title", i18n.msgStore.export_text);
    $("#dialog_c").dialog("open")
};
JinoController.prototype.nodeStructureFromXml = function(b) {
    if (!b) {
        b = jMap.getSelecteds().getLastElement()
    }
    var a = '<form><div class="dialog_content_nod"><br />' + i18n.msgStore.create_node_xml + '<br /><center><textarea id="okm_node_structure_textarea" name="okm_node_structure_textarea" onkeydown="return interceptTabs(event, this);" cols="50" rows="10"></textarea></center></div></from>';

    function c(d, m) {
        if (d) {
            if (jMap.cfg.realtimeSave) {
                var l = jMap.saveAction.isAlive();
                if (!l) {
                    return null
                }
            }
            var n = m.okm_node_structure_textarea;
            n = n.replace(/&/g, "&amp;");
            var k = /(TEXT=")(.*)(" FOLDED=)/ig;
            n = n.replace(k, function() {
                var p = arguments[1];
                var f = convertCharStr2XML(arguments[2]);
                var q = arguments[3];
                return p + f + q
            });
            k = /(LINK=")([^"]*)/ig;
            n = n.replace(k, function() {
                var p = arguments[1];
                var f = convertCharStr2XML(arguments[2]);
                return p + f
            });
            n = n.replace(/ POSITION="[^"]*"/ig, "");
            var o = jMap.loadManager.pasteNode(b, n);
            var h = function() {
                for (var f = 0; f < o.length; f++) {
                    jMap.saveAction.pasteAction(o[f])
                }
                jMap.fireActionListener(ACTIONS.ACTION_NODE_PASTE, b, n);
                jMap.initFolding(b);
                jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(b);
                jMap.layoutManager.layout(true)
            };
            if (jMap.loadManager.imageLoading.length == 0) {
                h()
            } else {
                var g = jMap.addActionListener(ACTIONS.ACTION_NODE_IMAGELOADED, function() {
                    h();
                    jMap.removeActionListener(g)
                })
            }
        }
        jMap.work.focus()
    }
    $("#dialog_c").append(a);
    $("#dialog_c").dialog({
        autoOpen: false,
        closeOnEscape: true,
        modal: true,
        resizable: false,
        close: function(d, f) {
            $("#dialog_c .dialog_content_nod").remove();
            $("#dialog_c").dialog("destroy");
            jMap.work.focus()
        },
    });
    $("#dialog_c").dialog("option", "width", "none");
    $("#dialog_c").dialog("option", "buttons", [{
        text: i18n.msgStore.button_apply,
        click: function() {
            var d = parseCallbackParam($("#dialog_c form").serializeArray());
            c(true, d)
        }
    }]);
    $("#dialog_c").dialog("option", "dialogClass", "nodeStructureFromXml");
    $("#dialog_c").dialog("option", "title", i18n.msgStore.import_xml);
    $("#dialog_c").dialog("open")
};
JinoController.prototype.nodeStructureToXml = function(b) {
    if (!b) {
        b = jMap.getSelecteds().getLastElement()
    }
    var c = "<okm>" + b.toXML() + "</okm>";
    var a = '<div class="dialog_content_xml"><br />' + i18n.msgStore.node_structure + '<br /><br /><center><textarea id="okm_node_structure_textarea" onfocus= "this.select()" name="okm_node_structure_textarea" onkeydown="return interceptTabs(event, this);" cols="50" rows="10">' + c + "</textarea></center></div>";
    $("#dialog_c").append(a);
    $("#dialog_c").dialog({
        autoOpen: false,
        closeOnEscape: true,
        modal: true,
        resizable: false,
        close: function(d, f) {
            $("#dialog_c .dialog_content_xml").remove();
            $("#dialog_c").dialog("destroy");
            jMap.work.focus()
        },
    });
    $("#dialog_c").dialog("option", "width", "none");
    $("#dialog_c").dialog("option", "dialogClass", "nodeStructureToXml");
    $("#dialog_c").dialog("option", "title", i18n.msgStore.export_xml);
    $("#dialog_c").dialog("open")
};
JinoController.prototype.nodeTextColorAction = function(d) {
    if (!d) {
        d = jMap.getSelecteds().getLastElement()
    }
    if (!jMap.isAllowNodeEdit(d)) {
        return false
    }
    var f = jMap.getSelecteds();
    for (var b = 0; b < f.length; b++) {
        if (!jMap.isAllowNodeEdit(f[b])) {
            return false
        }
    }
    var a = '<div class="dialog_content"><form><input type="text" id="color" name="color" value="' + d.getTextColor() + '" /></form><div id="colorpicker"></div><script type="text/javascript">var picker = $("#color").spectrum({allowEmpty:true,color: "' + d.getTextColor() + '",showInput: true,containerClassName: "full-spectrum",showInitial: true,showAlpha: true,maxPaletteSize: 10,preferredFormat: "hex",showPalette: true,showSelectionPalette: true,showButtons: false,flat: true,localStorageKey: "spectrum.mindmap",move: function (color) {	$("#color").val(color);},show: function () {},beforeShow: function () {},hide: function (color) {},palette: [["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)", /*"rgb(153, 153, 153)","rgb(183, 183, 183)",*/"rgb(204, 204, 204)", "rgb(217, 217, 217)", /*"rgb(239, 239, 239)", "rgb(243, 243, 243)",*/ "rgb(255, 255, 255)"],["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)","rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"],["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)","rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)","rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)","rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)","rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)","rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)","rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)","rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",/*"rgb(133, 32, 12)", "rgb(153, 0, 0)", "rgb(180, 95, 6)", "rgb(191, 144, 0)", "rgb(56, 118, 29)","rgb(19, 79, 92)", "rgb(17, 85, 204)", "rgb(11, 83, 148)", "rgb(53, 28, 117)", "rgb(116, 27, 71)",*/"rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)","rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]]});<\/script></div>';

    function c(g, k) {
        if (g) {
            for (var h = 0; h < f.length; h++) {
                f[h].setTextColor(k.color)
            }
        }
        $("#dialog").dialog("close");
        jMap.work.focus()
    }
    $("#dialog").append(a);
    $("#dialog").dialog({
        autoOpen: false,
        closeOnEscape: true,
        modal: true,
        resizable: false,
        close: function(g, h) {
            $("#dialog .dialog_content").remove();
            $("#dialog").dialog("destroy");
            jMap.work.focus()
        },
    });
    $("#dialog").dialog("option", "width", "470");
    $("#dialog").dialog("option", "buttons", [{
        text: i18n.msgStore.button_apply,
        click: function() {
            var g = parseCallbackParam($("#dialog form").serializeArray());
            c(true, g)
        }
    }]);
    $("#dialog").dialog("option", "dialogClass", "nodeTextColorAction");
    $("#dialog").dialog("option", "title", i18n.msgStore.text_color);
    $("#dialog").dialog("open")
};
JinoController.prototype.nodeBackgroundColorAction = function(d) {
    if (!d) {
        d = jMap.getSelecteds().getLastElement()
    }
    if (!jMap.isAllowNodeEdit(d)) {
        return false
    }
    var f = jMap.getSelecteds();
    for (var b = 0; b < f.length; b++) {
        if (!jMap.isAllowNodeEdit(f[b])) {
            return false
        }
    }
    var a = '<div class="dialog_content"><form><input type="text" id="color" name="color" value="' + d.getBackgroundColor() + '" /></form><div id="colorpicker"></div><script type="text/javascript">var picker = $("#color").spectrum({allowEmpty:true,color: "' + d.getBackgroundColor() + '",showInput: true,containerClassName: "full-spectrum",showInitial: true,showAlpha: true,maxPaletteSize: 10,preferredFormat: "hex",showPalette: true,showSelectionPalette: true,showButtons: false,flat: true,localStorageKey: "spectrum.mindmap",move: function (color) {	$("#color").val(color);},show: function () {},beforeShow: function () {},hide: function (color) {},palette: [["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)", /*"rgb(153, 153, 153)","rgb(183, 183, 183)",*/"rgb(204, 204, 204)", "rgb(217, 217, 217)", /*"rgb(239, 239, 239)", "rgb(243, 243, 243)",*/ "rgb(255, 255, 255)"],["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)","rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"],["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)","rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)","rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)","rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)","rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)","rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)","rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)","rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",/*"rgb(133, 32, 12)", "rgb(153, 0, 0)", "rgb(180, 95, 6)", "rgb(191, 144, 0)", "rgb(56, 118, 29)","rgb(19, 79, 92)", "rgb(17, 85, 204)", "rgb(11, 83, 148)", "rgb(53, 28, 117)", "rgb(116, 27, 71)",*/"rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)","rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]]});<\/script></div>';

    function c(g, k) {
        if (g) {
            for (var h = 0; h < f.length; h++) {
                f[h].setBackgroundColor(k.color)
            }
        }
        $("#dialog").dialog("close");
        jMap.work.focus()
    }
    $("#dialog").append(a);
    $("#dialog").dialog({
        autoOpen: false,
        closeOnEscape: true,
        modal: true,
        resizable: false,
        close: function(g, h) {
            $("#dialog .dialog_content").remove();
            $("#dialog").dialog("destroy");
            jMap.work.focus()
        },
    });
    $("#dialog").dialog("option", "width", "470");
    $("#dialog").dialog("option", "buttons", [{
        text: i18n.msgStore.button_apply,
        click: function() {
            var g = parseCallbackParam($("#dialog form").serializeArray());
            c(true, g)
        }
    }]);
    $("#dialog").dialog("option", "dialogClass", "nodeBackgroundColorAction");
    $("#dialog").dialog("option", "title", i18n.msgStore.bg_color);
    $("#dialog").dialog("open")
};
JinoController.prototype.changeMapBackground = function() {
    var a = '<div class="dialog_content"><form><input type="text" id="color" name="color" value="' + jMap.cfg.mapBackgroundColor + '" /><div style="text-align:left;">Image: <input style="width:320px;" type="text" name="url" id="url" value="' + (jMap.cfg.mapBackgroundImage || "") + '"/></div></form><form id="upload_form" method="post" action="' + jMap.cfg.contextPath + '/media/fileupload.do" enctype="multipart/form-data"><input type="hidden" name="confirm" value="1"/><input type="hidden" name="url_only" value="true"/><input type="hidden" name="mapid" value="' + jMap.cfg.mapId + '"/><div style="text-align:left"><input id="file" name="file" type="file" capture="camera" accept="image/*"/><input type="submit" id="btn_upload" value="Upload"/><div></form><script type="text/javascript">$("#color").spectrum({allowEmpty:true,color: "' + jMap.cfg.mapBackgroundColor + '",showInput: true,containerClassName: "full-spectrum",showInitial: true,showAlpha: true,maxPaletteSize: 10,preferredFormat: "hex",showPalette: true,showSelectionPalette: true,showButtons: false,flat: true,localStorageKey: "spectrum.mindmap",clickoutFiresChange: true,move: function (color) {	$("#color").val(color);},show: function () {},beforeShow: function () {},hide: function (color) {},palette: [["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)", /*"rgb(153, 153, 153)","rgb(183, 183, 183)",*/"rgb(204, 204, 204)", "rgb(217, 217, 217)", /*"rgb(239, 239, 239)", "rgb(243, 243, 243)",*/ "rgb(255, 255, 255)"],["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)","rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"],["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)","rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)","rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)","rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)","rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)","rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)","rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)","rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",/*"rgb(133, 32, 12)", "rgb(153, 0, 0)", "rgb(180, 95, 6)", "rgb(191, 144, 0)", "rgb(56, 118, 29)","rgb(19, 79, 92)", "rgb(17, 85, 204)", "rgb(11, 83, 148)", "rgb(53, 28, 117)", "rgb(116, 27, 71)",*/"rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)","rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]]});<\/script></div>';

    function b(d, h) {
        if (d) {
            var g = h.color;
            jMap.cfg.mapBackgroundColor = g;
            $(jMap.work).css("background-color", g);
            jMap.cfg.mapBackgroundImage = h.url;
            $(jMap.work).css("background-image", 'url("' + h.url + '")');
            var c = jMap.getRootNode();
            if (c.attributes == undefined) {
                c.attributes = {}
            }
            c.attributes.mapBackgroundColor = g;
            c.attributes.mapBackgroundImage = h.url;
            jMap.saveAction.editAction(c)
        }
        $("#dialog").dialog("close")
    }
    $("#dialog").append(a);
    $("#upload_form").ajaxForm(function(c) {
        $("#url").val(jMap.cfg.contextPath + "/map" + c)
    });
    $("#dialog").dialog({
        autoOpen: false,
        closeOnEscape: true,
        modal: true,
        resizable: false,
        close: function(c, d) {
            $("#dialog .dialog_content").remove();
            $("#dialog").dialog("destroy");
            jMap.work.focus()
        },
    });
    $("#dialog").dialog("option", "width", "470");
    $("#dialog").dialog("option", "buttons", [{
        text: i18n.msgStore.button_apply,
        click: function() {
            var c = parseCallbackParam($("#dialog form").serializeArray());
            b(true, c)
        }
    }]);
    $("#dialog").dialog("option", "dialogClass", "insertImageAction");
    $("#dialog").dialog("option", "title", "Map Background");
    $("#dialog").dialog("open")
};
JinoController.prototype.deleteArrowlinkAction = function(b) {
    if (!b) {
        b = jMap.getSelecteds().getLastElement()
    }
    if (!jMap.isAllowNodeEdit(b)) {
        return false
    }
    for (var a = 0; a < b.arrowlinks.length; a++) {
        b.removeArrowLink(b.arrowlinks[a])
    }
};
JinoController.prototype.screenFocusAction = function(a) {
    if (!a) {
        a = jMap.getSelecteds().getLastElement()
    }
    if (!a) {
        a = jMap.getRootNode()
    }
    a.screenFocus()
};
JinoController.prototype.resetCoordinateAction = function(a) {
    if (!a) {
        a = jMap.getSelecteds().getLastElement()
    }
    if (!a) {
        a = jMap.getRootNode()
    }
    if (!jMap.isAllowNodeEdit(a)) {
        return false
    }
    jMap.resetCoordinate(a);
    jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap()
};
JinoController.prototype.qrCodeAction = function() {
    if (typeof jMap.cfg.QRCode == "undefined") {
        alert("Service Unavailable");
        return false
    }
    var a = '<from><div class="dialog_content_nod" align="center"><img src="' + jMap.cfg.QRCode + '"></div></from>';

    function b(c, d) {
        if (c) {}
        $("#dialog").dialog("close");
        jMap.work.focus()
    }
    $("#dialog").append(a);
    $("#dialog").dialog({
        autoOpen: false,
        closeOnEscape: true,
        width: "400px",
        modal: true,
        resizable: false,
        close: function(c, d) {
            $("#dialog .dialog_content").remove();
            $("#dialog").dialog("destroy");
            jMap.work.focus()
        },
    });
    $("#dialog").dialog("option", "width", "none");
    $("#dialog").dialog("option", "buttons", [{
        text: i18n.msgStore.button_apply,
        click: function() {
            var c = parseCallbackParam($("#dialog form").serializeArray());
            b(true, c)
        }
    }]);
    $("#dialog").dialog("option", "title", i18n.msgStore.qr_code);
    $("#dialog").dialog("open")
};
JinoController.prototype.foreignObjRemoveAction = function(a) {
    if (!a) {
        a = jMap.getSelecteds().getLastElement()
    }
    a.setForeignObject("");
    a.setHyperlink("");
    jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(a);
    jMap.layoutManager.layout(true)
};
JinoController.prototype.insertIFrameAction = function(d) {
    if (!d) {
        d = jMap.getSelecteds().getLastElement()
    }
    if (!jMap.isAllowNodeEdit(d)) {
        return false
    }
    var h = h || "http://";
    var o = "";
    var n = "";
    var k = 0;
    var b = 0;
    var m = "no";
    var f = " checked";
    var c = "";
    var a = 100;
    if (d.foreignObjEl) {
        var l = d.foreignObjEl.getElementsByTagName("iframe")[0]
    }
    if (l != undefined) {
        var h = l.getAttribute("src");
        var o = d.foreignObjEl.getAttribute("width");
        var n = d.foreignObjEl.getAttribute("height");
        var m = l.getAttribute("scrolling");
        var a = l.getAttribute("zoom");
        var k = Math.abs(l.style.marginLeft.replace("px", ""));
        var b = Math.abs(l.style.marginTop.replace("px", ""));
        if (!a) {
            a = 100
        }
    } else {
        var o = parent.jMap.cfg.default_img_size;
        var n = parent.jMap.cfg.default_img_size
    }
    if (m == "Yes") {
        var f = " ";
        var c = " checked"
    }
    var g = '<form><div class="dialog_content_nod"><br />' + i18n.msgStore.address + ' : <input type="text" id="url" name="url" onfocus= "this.select()" value="' + h + '" style="width: 300px" /><br><br><table cellspacing="0" style="margin:0px;"><tr><td><div id="zoom_title">' + i18n.msgStore.zoom + ': </div></td><td><div id="zoomSlider"></div></td><td><input type="text" id="zoom" name="zoom" value="' + a + '" style="width:50px" />%</td></tr><tr><td><div id="width_title">' + i18n.msgStore.width + ': </div></td><td><div id="widthSlider"></div></td><td><input type="text" id="width" name="width" value="' + o + '" style="width:70px" /></td></tr><tr><td><div id="height_title">' + i18n.msgStore.height + ': </div></td><td><div id="heightSlider"></div></td><td><input type="text" id="height" name="height" value="' + n + '" style="width:70px" /></td></tr><tr><td><div id="margin_left_title">' + i18n.msgStore.margin_left + ': </div></td><td><div id="slider_margin_left"></div></td><td><input type="text" id="margin_left" name="margin_left" value="' + k + '" style="width:70px" /></td></tr><tr><td><div id="margin_top_title">' + i18n.msgStore.margin_top + ': </div></td><td><div id="slider_margin_top"></div></td><td><input type="text" id="margin_top" name="margin_top" value="' + b + '" style="width:70px" /></td></tr><tr><td><div id=scroll>' + i18n.msgStore.scrolling + ": </div></td><td>" + i18n.msgStore.yes + '<input type="radio" id="scrollYes" name="radioScroll" ' + c + ' value="Yes" style="width:10px" />&nbsp;&nbsp;&nbsp;' + i18n.msgStore.no + '<input type="radio" id="scrollNo" name="radioScroll" ' + f + ' value="No" style="width:10px" /></td></tr></table></div></form>';

    function q(A, w) {
        if (A) {
            var s = w.url;
            var z = parseInt(Math.abs(w.margin_left), 10);
            var x = parseInt(Math.abs(w.margin_top), 10);
            var C = parseInt(w.zoom, 10) / 100;
            var t = parseInt(w.width, 10) / C + z;
            var B = parseInt(w.height, 10) / C + x;
            var u = "";
            if (s != "") {
                var r = "-moz-transform: scale(" + C + ");-moz-transform-origin: 0 0;-o-transform: scale(" + C + ");-o-transform-origin: 0 0;-webkit-transform: scale(" + C + ");-webkit-transform-origin: 0 0;";
                d.setForeignObject('<iframe style="' + r + "border: none;margin-left:" + (-z) + "px;margin-top:" + (-x) + 'px;" src="' + s + '" width="' + t + '" height="' + B + '" scrolling="' + w.radioScroll + '" zoom="' + w.zoom + '"></iframe>', w.width, w.height);
                d.setHyperlink(s);
                jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(d);
                jMap.layoutManager.layout(true)
            } else {
                if (h == "http://") {}
            }
        } else {
            d = parent.jMap.getSelecteds().getLastElement();
            d.setForeignObject("");
            d.setHyperlink("");
            document.getElementById("url").value = "";
            parent.jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(d);
            parent.jMap.layoutManager.layout(true)
        }
    }
    $("#dialog").append(g);
    var p = $("#dialog").dialog({
        autoOpen: false,
        closeOnEscape: true,
        modal: true,
        resizable: false,
        close: function(s, t) {
            var r = parseCallbackParam($("#dialog form").serializeArray());
            $("#dialog .dialog_content_nod").remove();
            $("#dialog").dialog("destroy");
            jMap.work.focus()
        },
    });
    $("#dialog").dialog("option", "width", "none");
    $("#dialog").dialog("option", "buttons", [{
        text: i18n.msgStore.button_apply,
        click: function() {
            var r = parseCallbackParam($("#dialog form").serializeArray());
            q(true, r)
        }
    }, {
        text: i18n.msgStore.iframe_delete,
        click: function() {
            var r = parseCallbackParam($("#dialog form").serializeArray());
            q(false, r)
        }
    }]);
    $("#dialog").dialog("option", "dialogClass", "insertIFrameAction");
    $("#dialog").dialog("option", "title", i18n.msgStore.iframe);
    $("#dialog").dialog("open");
    $(p).ready(function() {
        $("#zoomSlider").slider({
            min: 10,
            max: 200,
            value: a,
            change: function(s, w) {
                var B = parseCallbackParam($("#dialog form").serializeArray());
                var t = B.url;
                var x = parseInt(Math.abs(B.margin_left), 10);
                var v = parseInt(Math.abs(B.margin_top), 10);
                document.getElementById("zoom").value = w.value;
                var A = parseInt(w.value, 10);
                if (A != "") {
                    A = A / 100;
                    var u = parseInt(d.foreignObjEl.getAttribute("width"), 10);
                    var z = parseInt(d.foreignObjEl.getAttribute("height"), 10);
                    scrollAction = B.radioScroll;
                    w.value = parseInt(w.value);
                    var r = "-moz-transform: scale(" + A + ");-moz-transform-origin: 0 0;-o-transform: scale(" + A + ");-o-transform-origin: 0 0;-webkit-transform: scale(" + A + ");-webkit-transform-origin: 0 0;";
                    d.setForeignObjectExecute('<iframe style="' + r + "border: none;margin-left:" + (-x) + "px;margin-top:" + (-v) + 'px;" src="' + t + '" width="' + (u / A + x) + '" height="' + (z / A + v) + '" scrolling="' + scrollAction + '" zoom="' + w.value + '"></iframe>', u, z)
                }
            }
        });
        $("#slider_margin_left").slider({
            min: 0,
            max: 1000,
            value: k,
            change: function(s, x) {
                var C = parseCallbackParam($("#dialog form").serializeArray());
                var t = C.url;
                var z = parseInt(Math.abs(C.margin_left), 10);
                var w = parseInt(Math.abs(C.margin_top), 10);
                document.getElementById("margin_left").value = x.value;
                if (z != "") {
                    var v = parseInt(d.foreignObjEl.getAttribute("width"), 10);
                    var B = parseInt(d.foreignObjEl.getAttribute("height"), 10);
                    if ($("#scrollno").attr("checked") == null) {
                        var u = "Yes"
                    } else {
                        var u = "No"
                    }
                    x.value = parseInt(x.value);
                    u = C.radioScroll;
                    var A = parseInt(C.zoom, 10);
                    if (A == "") {
                        A = 1
                    } else {
                        A = A / 100
                    }
                    var r = "-moz-transform: scale(" + A + ");-moz-transform-origin: 0 0;-o-transform: scale(" + A + ");-o-transform-origin: 0 0;-webkit-transform: scale(" + A + ");-webkit-transform-origin: 0 0;";
                    d.setForeignObjectExecute('<iframe style="' + r + "border: none;margin-left:" + (-x.value) + "px;margin-top:" + (-w) + 'px;" src="' + t + '" width="' + (v / A + x.value) + '" height="' + (B / A + w) + '" scrolling="' + u + '" zoom="' + C.zoom + '"></iframe>', v, B)
                }
            }
        });
        $("#slider_margin_top").slider({
            min: 0,
            max: 1000,
            value: b,
            change: function(s, x) {
                var C = parseCallbackParam($("#dialog form").serializeArray());
                var t = C.url;
                var z = parseInt(Math.abs(C.margin_left), 10);
                var w = parseInt(Math.abs(C.margin_top), 10);
                document.getElementById("margin_top").value = x.value;
                if (w != "") {
                    var v = parseInt(d.foreignObjEl.getAttribute("width"), 10);
                    var B = parseInt(d.foreignObjEl.getAttribute("height"), 10);
                    if ($("#scrollno").attr("checked") == null) {
                        var u = "yes"
                    } else {
                        var u = "no"
                    }
                    x.value = parseInt(x.value);
                    u = C.radioScroll;
                    var A = parseInt(C.zoom, 10);
                    if (A == "") {
                        A = 1
                    } else {
                        A = A / 100
                    }
                    var r = "-moz-transform: scale(" + A + ");-moz-transform-origin: 0 0;-o-transform: scale(" + A + ");-o-transform-origin: 0 0;-webkit-transform: scale(" + A + ");-webkit-transform-origin: 0 0;";
                    d.setForeignObjectExecute('<iframe style="' + r + "border: none;margin-left:" + (-z) + "px;margin-top:" + (-x.value) + 'px;" src="' + t + '" width="' + (v / A + z) + '" height="' + (B / A + x.value) + '" scrolling="' + u + '" zoom="' + C.zoom + '"></iframe>', v, B)
                }
            }
        });
        $("#widthSlider").slider({
            min: 20,
            max: 1000,
            value: o,
            change: function(s, x) {
                var C = parseCallbackParam($("#dialog form").serializeArray());
                var t = C.url;
                var z = parseInt(Math.abs(C.margin_left), 10);
                var w = parseInt(Math.abs(C.margin_top), 10);
                var u = parseInt(C.width, 10) + z;
                var A = parseInt(C.height, 10);
                document.getElementById("width").value = x.value;
                if ($("#scrollno").attr("checked") == null) {
                    var v = "yes"
                } else {
                    var v = "no"
                }
                v = C.radioScroll;
                var B = parseInt(C.zoom, 10);
                if (B == "") {
                    B = 1
                } else {
                    B = B / 100
                }
                var r = "-moz-transform: scale(" + B + ");-moz-transform-origin: 0 0;-o-transform: scale(" + B + ");-o-transform-origin: 0 0;-webkit-transform: scale(" + B + ");-webkit-transform-origin: 0 0;";
                if (d.foreignObjEl != undefined) {
                    d.setForeignObjectExecute('<iframe style="' + r + "border: none;margin-left:" + (-z) + "px;margin-top:" + (-w) + 'px;" src="' + t + '" width="' + (x.value / B + z) + '" height="' + (A / B + x.value + (w - x.value)) + '" scrolling="' + v + '" zoom="' + C.zoom + '"></iframe>', x.value, A)
                }
            }
        });
        $("#heightSlider").slider({
            min: 20,
            max: 1000,
            value: n,
            change: function(s, x) {
                var C = parseCallbackParam($("#dialog form").serializeArray());
                var t = C.url;
                var z = parseInt(Math.abs(C.margin_left), 10);
                var w = parseInt(Math.abs(C.margin_top), 10);
                var u = parseInt(C.width, 10);
                var A = parseInt(C.height, 10) + w;
                document.getElementById("height").value = x.value;
                if ($("#scrollno").attr("checked") == null) {
                    var v = "yes"
                } else {
                    var v = "no"
                }
                v = C.radioScroll;
                var B = parseInt(C.zoom, 10);
                if (B == "") {
                    B = 1
                } else {
                    B = B / 100
                }
                var r = "-moz-transform: scale(" + B + ");-moz-transform-origin: 0 0;-o-transform: scale(" + B + ");-o-transform-origin: 0 0;-webkit-transform: scale(" + B + ");-webkit-transform-origin: 0 0;";
                if (d.foreignObjEl != undefined) {
                    d.setForeignObjectExecute('<iframe style="' + r + "border: none;margin-left:" + (-z) + "px;margin-top:" + (-w) + 'px;" src="' + t + '" width="' + (u / B + x.value + (z - x.value)) + '" height="' + (x.value / B + w) + '" scrolling="' + v + '" zoom="' + C.zoom + '"></iframe>', u, x.value)
                }
            }
        })
    })
};
JinoController.prototype.insertWebPageAction = function(f) {
    if (!f) {
        f = jMap.getSelecteds().getLastElement()
    }
    if (!jMap.isAllowNodeEdit(f)) {
        return false
    }
    $(document).on("focusin", function(r) {
        if ($(r.target).closest(".mce-window, .moxman-window").length) {
            r.stopImmediatePropagation()
        }
    });
    if (!f.attributes) {
        f.attributes = {}
    }
    var k = f.attributes.web_page || "Your Webpage goes here";
    var o = "";
    var n = "";
    var l = 0;
    var c = 0;
    var m = "no";
    var g = " checked";
    var d = "";
    var a = 100;
    if (f.foreignObjEl) {
        var b = f.foreignObjEl.getElementsByTagName("div")[0]
    }
    if (b != undefined) {
        var k = b.innerHTML;
        var o = f.foreignObjEl.getAttribute("width");
        var n = f.foreignObjEl.getAttribute("height");
        var m = b.style.overflow ? "Yes" : "No";
        a = b.getAttribute("zoom");
        if (!a) {
            a = 100
        }
    } else {
        var o = parent.jMap.cfg.default_img_size;
        var n = parent.jMap.cfg.default_img_size
    }
    if (m == "Yes") {
        var g = " ";
        var d = " checked"
    }
    var h = '<form><div class="dialog_content_nod"><div id="webpage_editor">' + k + '</div><table cellspacing="0" style="margin:0;"><tr><td><div id="width_title" style="white-space:nowrap">' + i18n.msgStore.width + ':</div></td><td><div id="widthSlider"></div></td><td><input type="text" id="width" name="width" value="' + o + '" style="width: 70px" /></td><td style="width:99%;"></td></tr><tr><td><div id="height_title">' + i18n.msgStore.height + ':</div></td><td><div id="heightSlider"></div></td><td><input type="text" id="height" name="height" value="' + n + '" style="width: 70px" /></td></tr><tr><td><div id="zoom_title">' + i18n.msgStore.zoom + ': </div></td><td><div id="zoomSlider"></div></td><td><input type="text" id="zoom" name="zoom" value="' + a + '" style="width:50px" />%</td></tr><tr><td><div id=scroll style="clear:left;padding-top:5px">' + i18n.msgStore.scrolling + ":</div></td><td>" + i18n.msgStore.yes + '<input type="radio" id="scrollYes" name="radioScroll" ' + d + ' value="Yes" style="width:10px" />&nbsp;&nbsp;&nbsp;' + i18n.msgStore.no + '<input type="radio" id="scrollNo" name="radioScroll" ' + g + ' value="No" style="width:10px" /></td></tr></table></div></form>';

    function q(z, u) {
        if (z) {
            var x = tinyMCE.get("webpage_editor").getContent();
            var s = parseInt(u.width, 10);
            var A = parseInt(u.height, 10);
            var t = "";
            if (x != "") {
                var B = parseInt(u.zoom, 10);
                if (B == "") {
                    B = 1
                } else {
                    B = B / 100
                }
                var r = "-moz-transform: scale(" + B + ");-moz-transform-origin: 0 0;-o-transform: scale(" + B + ");-o-transform-origin: 0 0;-webkit-transform: scale(" + B + ");-webkit-transform-origin: 0 0;";
                var w = u.radioScroll != "Yes" ? "" : "overflow:auto;";
                f.setForeignObject('<div style="' + w + r + "margin:0;border: none;width:" + s / B + "px; height:" + A / B + 'px;" zoom="' + u.zoom + '">' + x + "</div>", u.width, u.height);
                jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(f);
                jMap.layoutManager.layout(true)
            } else {
                var B = parseInt(u.zoom, 10);
                if (B == "") {
                    B = 1
                } else {
                    B = B / 100
                }
                var r = "-moz-transform: scale(" + B + ");-moz-transform-origin: 0 0;-o-transform: scale(" + B + ");-o-transform-origin: 0 0;-webkit-transform: scale(" + B + ");-webkit-transform-origin: 0 0;";
                var w = u.radioScroll != "Yes" ? "" : "overflow:auto;";
                f.setForeignObject('<div style="' + w + r + "margin:0;border: none;width:" + s / B + "px; height:" + A / B + 'px;" zoom="' + u.zoom + '">' + x + "</div>", u.width, u.height);
                jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(f);
                jMap.layoutManager.layout(true)
            }
        } else {
            f = parent.jMap.getSelecteds().getLastElement();
            f.setForeignObject("");
            f.setHyperlink("");
            parent.jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(f);
            parent.jMap.layoutManager.layout(true)
        }
    }
    $("#dialog").append(h);
    var p = $("#dialog").dialog({
        autoOpen: false,
        closeOnEscape: true,
        modal: true,
        resizable: true,
        close: function(s, t) {
            var r = parseCallbackParam($("#dialog form").serializeArray());
            $("#dialog .dialog_content_nod").remove();
            $("#dialog").dialog("destroy");
            jMap.work.focus()
        },
    });
    $("#dialog").dialog("option", "width", "640");
    $("#dialog").dialog("option", "height", "480");
    $("#dialog").dialog("option", "buttons", [{
        text: i18n.msgStore.button_apply,
        click: function() {
            var r = parseCallbackParam($("#dialog form").serializeArray());
            q(true, r)
        }
    }, {
        text: i18n.msgStore.webpage_delete,
        click: function() {
            var r = parseCallbackParam($("#dialog form").serializeArray());
            q(false, r)
        }
    }]);
    $("#dialog").dialog("option", "dialogClass", "insertWebpageAction");
    $("#dialog").dialog("option", "title", i18n.msgStore.webpage);
    $("#dialog").dialog("open");
    $(p).ready(function() {
        var r = tinymce.get("webpage_editor");
        r && r.remove();
        tinymce.init({
            selector: "#webpage_editor",
            entity_encoding: "raw",
            menubar: false,
            plugins: ["advlist autolink link image lists charmap print preview hr anchor pagebreak", "searchreplace wordcount visualblocks visualchars fullscreen insertdatetime media nonbreaking", "formula table contextmenu directionality emoticons code template textcolor paste textcolor colorpicker textpattern"],
            toolbar1: "toolbar_toggle,formatselect,wrap,bold,italic,wrap,bullist,numlist,wrap,link,unlink,wrap,image",
            toolbar2: "undo,redo,wrap,underline,strikethrough,subscript,superscript,wrap,justifyleft,justifycenter,justifyright,wrap,outdent,indent,wrap,forecolor,backcolor,wrap,ltr,rtl",
            toolbar3: "fontselect,fontsizeselect,wrap,formula,searchreplace,code,wrap,nonbreaking,charmap,table,wrap,cleanup,removeformat,pastetext,pasteword,wrap,codesample fullscreen",
            setup: function(s) {
                s.addButton("toolbar_toggle", {
                    tooltip: i18n.msgStore.toolbar_toggle,
                    image: tinymce.baseURL + "/img/toolbars.png",
                    onclick: function() {
                        var u = s.theme.panel.find("toolbar");
                        for (var t = 1; t < u.length; t++) {
                            $(u[t].getEl()).toggle()
                        }
                    }
                });
                s.on("init", function(v) {
                    var u = s.theme.panel.find("toolbar");
                    for (var t = 1; t < u.length; t++) {
                        $(u[t].getEl()).toggle()
                    }
                })
            }
        });
        $("#zoomSlider").slider({
            min: 10,
            max: 200,
            value: a,
            change: function(t, x) {
                var B = parseCallbackParam($("#dialog form").serializeArray());
                var w = tinyMCE.get("webpage_editor").getContent();
                var u = parseInt(B.width, 10);
                var z = parseInt(B.height, 10);
                document.getElementById("zoom").value = x.value;
                if ($("#scrollno").attr("checked") == null) {
                    var v = "overflow:auto;"
                } else {
                    var v = ""
                }
                var A = parseInt(x.value, 10);
                if (A == "") {
                    A = 1
                } else {
                    A = A / 100
                }
                var s = "-moz-transform: scale(" + A + ");-moz-transform-origin: 0 0;-o-transform: scale(" + A + ");-o-transform-origin: 0 0;-webkit-transform: scale(" + A + ");-webkit-transform-origin: 0 0;";
                if (f.foreignObjEl != undefined) {
                    f.setForeignObjectExecute('<div style="' + v + s + "margin:0;border: none;width:" + u / A + "px; height:" + z / A + 'px;" zoom="' + A * 100 + '">' + w + "</div>", u, z);
                    jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(f);
                    jMap.layoutManager.layout(true)
                }
            }
        });
        $("#widthSlider").slider({
            min: 20,
            max: 1000,
            value: o,
            change: function(t, x) {
                var B = parseCallbackParam($("#dialog form").serializeArray());
                var w = tinyMCE.get("webpage_editor").getContent();
                var u = x.value;
                var z = parseInt(B.height, 10);
                document.getElementById("width").value = x.value;
                if ($("#scrollno").attr("checked") == null) {
                    var v = "overflow:auto;"
                } else {
                    var v = ""
                }
                var A = parseInt(B.zoom, 10);
                if (A == "") {
                    A = 1
                } else {
                    A = A / 100
                }
                var s = "-moz-transform: scale(" + A + ");-moz-transform-origin: 0 0;-o-transform: scale(" + A + ");-o-transform-origin: 0 0;-webkit-transform: scale(" + A + ");-webkit-transform-origin: 0 0;";
                if (f.foreignObjEl != undefined) {
                    f.setForeignObjectExecute('<div style="' + v + s + "margin:0;border: none;width:" + u / A + "px; height:" + z / A + 'px;" zoom="' + A * 100 + '">' + w + "</div>", u, z);
                    jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(f);
                    jMap.layoutManager.layout(true)
                }
            }
        });
        $("#heightSlider").slider({
            min: 20,
            max: 1000,
            value: n,
            change: function(t, x) {
                var B = parseCallbackParam($("#dialog form").serializeArray());
                var w = tinyMCE.get("webpage_editor").getContent();
                var u = parseInt(B.width, 10);
                var z = x.value;
                document.getElementById("height").value = x.value;
                if ($("#scrollno").attr("checked") == null) {
                    var v = "overflow:auto;"
                } else {
                    var v = ""
                }
                var A = parseInt(B.zoom, 10);
                if (A == "") {
                    A = 1
                } else {
                    A = A / 100
                }
                var s = "-moz-transform: scale(" + A + ");-moz-transform-origin: 0 0;-o-transform: scale(" + A + ");-o-transform-origin: 0 0;-webkit-transform: scale(" + A + ");-webkit-transform-origin: 0 0;";
                if (f.foreignObjEl != undefined) {
                    f.setForeignObjectExecute('<div style="' + v + s + "margin:0;border: none;width:" + u / A + "px; height:" + z / A + 'px;" zoom="' + A * 100 + '">' + w + "</div>", u, z);
                    jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(f);
                    jMap.layoutManager.layout(true)
                }
            }
        })
    })
};
JinoController.prototype.insertLTIAction = function(d) {
    if (!d) {
        d = jMap.getSelecteds().getLastElement()
    }
    if (!jMap.isAllowNodeEdit(d)) {
        return false
    }
    if (!d.attributes) {
        d.attributes = {}
    }
    var a = d.attributes.url || "http://";
    var f = d.attributes.secret || "";
    var o = d.attributes.key || "";
    var n = "";
    var m = "";
    var k = 0;
    var b = 0;
    var l = "no";
    var g = " checked";
    var c = "";
    var h = '<form><div class="dialog_content_nod"><br /><table cellspacing="0" style="margin:0;"><tr><td><div id="url_title" style="white-space:nowrap">' + i18n.msgStore.launch_url + ':</div></td><td style="width:100%"><input style="width:100%" type="text" id="url" name="url" value="' + a + '"></td></tr><tr><td><div id="secret_title" style="white-space:nowrap">' + i18n.msgStore.secret_value + ':</div></td><td style="width:100%"><input style="width:100%" type="text" id="secret" name="secret" value="' + f + '"></td></tr><tr><td><div id="key_title" style="white-space:nowrap">' + i18n.msgStore.key_value + ':</div></td><td><input type="text" id="key" name="key" value="' + o + '"></td></td></tr></table></div></form>';

    function q(s, w) {
        if (s) {
            var t = w.url;
            var r = w.secret;
            var u = w.key;
            if (t != "") {
                d.attributes.url = t;
                d.attributes.secret = r;
                d.attributes.key = u;
                d.setHyperlink(jMap.cfg.contextPath + "/mindmap/launch.do?map=" + mapId + "&node=" + d.getID());
                jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(d);
                jMap.layoutManager.layout(true)
            }
        }
        $("#dialog").dialog("close");
        jMap.work.focus()
    }
    $("#dialog").append(h);
    var p = $("#dialog").dialog({
        autoOpen: false,
        closeOnEscape: true,
        modal: true,
        resizable: false,
        close: function(s, t) {
            var r = parseCallbackParam($("#dialog form").serializeArray());
            $("#dialog .dialog_content_nod").remove();
            $("#dialog").dialog("destroy");
            jMap.work.focus()
        },
    });
    $("#dialog").dialog("option", "width", "none");
    $("#dialog").dialog("option", "buttons", [{
        text: i18n.msgStore.button_apply,
        click: function() {
            var r = parseCallbackParam($("#dialog form").serializeArray());
            q(true, r)
        }
    }]);
    $("#dialog").dialog("option", "dialogClass", "insertIFrameAction");
    $("#dialog").dialog("option", "title", i18n.msgStore.lti);
    $("#dialog").dialog("open")
};
JinoController.prototype.undoAction = function() {
    jMap.historyManager && jMap.historyManager.undo()
};
JinoController.prototype.redoAction = function() {
    jMap.historyManager && jMap.historyManager.redo()
};
JinoControllerGuest = function(a) {
    this.map = a;
    this.nodeEditor = null;
    document.onkeydown = function(b) {
        b = b || window.event;
        if (jMap.work.hasFocus()) {
            return false
        }
        return true
    };
    $(this.map.work).on("vmousedown", {
        controller: this
    }, this.mousedown);
    $(this.map.work).on("vmousemove", {
        controller: this
    }, this.mousemove);
    $(this.map.work).on("vmouseup", {
        controller: this
    }, this.mouseup);
    this.map.work.addEventListener("touchstart", this.touchstart, false);
    this.map.work.onkeydown = this.keyPress;
    this.map.work.ondragenter = function(b) {
        b = b || window.event;
        if (b.preventDefault) {
            b.preventDefault()
        } else {
            b.returnValue = false
        }
    };
    this.map.work.ondragover = function(b) {
        b = b || window.event;
        if (b.preventDefault) {
            b.preventDefault()
        } else {
            b.returnValue = false
        }
    };
    this.map.work.ondrop = function(b) {
        b = b || window.event;
        if (b.preventDefault) {
            b.preventDefault()
        } else {
            b.returnValue = false
        }
    }
};
JinoControllerGuest.prototype.type = "JinoControllerGuest";
JinoControllerGuest.prototype.keyPress = function(a) {
    if (STAT_NODEEDIT) {
        return true
    }
    a = a || window.event;
    var g = null;
    if (a) {
        g = a.ctrlKey
    } else {
        if (a && document.getElementById) {
            g = (Event.META_MASK || Event.CTRL_MASK)
        } else {
            if (a && document.layers) {
                g = (a.metaKey || a.ctrlKey)
            }
        }
    }
    var h = a.altKey;
    var f = a.keyCode;
    switch (f) {
        case 37:
            var d = jMap.getSelecteds().getLastElement();
            if (d.isRootNode()) {
                var c = d.getChildren();
                for (var b = 0; b < c.length; b++) {
                    if (c[b].position == "left") {
                        c[b].focus(true);
                        break
                    }
                }
            } else {
                if (d.isLeft && d.isLeft()) {
                    if (d.folded) {
                        d.setFoldingExecute(false);
                        jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendants(d);
                        jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(d);
                        jMap.layoutManager.layout(true);
                        return false
                    }
                    var c = d.getChildren();
                    if (c.length > 0) {
                        c[0].focus(true)
                    }
                } else {
                    d.getParent().focus(true)
                }
            }
            break;
        case 38:
            var d = jMap.getSelecteds().getLastElement();
            if (d.isRootNode()) {} else {
                var c = d.getParent().getChildren();
                if (d.getIndexPos() > 0) {
                    c[d.getIndexPos() - 1].focus(true)
                }
            }
            break;
        case 39:
            var d = jMap.getSelecteds().getLastElement();
            if (d.isRootNode()) {
                var c = d.getChildren();
                for (var b = 0; b < c.length; b++) {
                    if (c[b].position == "right") {
                        c[b].focus(true);
                        break
                    }
                }
            } else {
                if (d.isLeft && d.isLeft()) {
                    d.getParent().focus(true)
                } else {
                    if (d.folded) {
                        d.setFoldingExecute(false);
                        jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendants(d);
                        jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(d);
                        jMap.layoutManager.layout(true);
                        return false
                    }
                    var c = d.getChildren();
                    if (c.length > 0) {
                        c[0].focus(true)
                    }
                }
            }
            break;
        case 40:
            var d = jMap.getSelecteds().getLastElement();
            if (d.isRootNode()) {} else {
                var c = d.getParent().getChildren();
                if (c.length > d.getIndexPos() + 1) {
                    c[d.getIndexPos() + 1].focus(true)
                }
            }
            break;
        case 70:
            if (g) {
                jMap.controller.findNodeAction()
            }
            break;
        case 71:
            if (g) {
                if (AL_GOOGLE_SEARCHER == null) {
                    SET_GOOGLE_SEARCHER(true)
                } else {
                    SET_GOOGLE_SEARCHER(false)
                }
            } else {
                if (a.shiftKey) {} else {}
            }
            break;
        case 78:
            if (a.ctrlKey) {
                location.href = "/mindmap/new.do"
            }
            break;
        case 79:
            if (a.ctrlKey) {
                openMap()
            }
            break;
        case 32:
            var d = jMap.getSelecteds().getLastElement();
            d.setFoldingExecute(!d.folded);
            jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendants(d);
            jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(d);
            jMap.layoutManager.layout(true);
            break
    }
    return false
};
JinoControllerGuest.prototype.mousemove = function(d) {
    var c;
    if (!d) {
        var d = window.event
    }
    if (d.target) {
        c = d.target
    } else {
        if (d.srcElement) {
            c = d.srcElement
        }
    }
    if (c.nodeType == 3) {
        c = c.parentNode
    }
    if (c.id == "nodeEditor") {
        return true
    }
    var b = d.clientX - DRAG_POS.x;
    var a = d.clientY - DRAG_POS.y;
    DRAG_POS.x = d.clientX;
    DRAG_POS.y = d.clientY;
    if (jMap.DragPaper) {
        this.scrollTop -= a;
        this.scrollLeft -= b
    }
    return false
};
JinoControllerGuest.prototype.touchstart = function(b) {
    if (ISMOBILE && supportsTouch && b.touches && b.touches.length == 2) {
        var a = jMap.getSelecteds().getLastElement();
        if (a) {
            a.setFoldingExecute(!a.folded);
            jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(node);
            jMap.layoutManager.layout(true)
        }
    }
};
JinoControllerGuest.prototype.mousedown = function(b) {
    var a;
    if (!b) {
        var b = window.event
    }
    if (b.target) {
        a = b.target
    } else {
        if (b.srcElement) {
            a = b.srcElement
        }
    }
    if (a.nodeType == 3) {
        a = a.parentNode
    }
    if (a.id == "nodeEditor") {
        return true
    }
    if (STAT_NODEEDIT) {
        jMap.controller.stopNodeEdit(true)
    }
    DRAG_POS.x = b.clientX;
    DRAG_POS.y = b.clientY;
    if (a.id == "paper_mapview") {
        jMap.DragPaper = true
    } else {
        if (a.id == "jinomap") {
            if (a.offsetLeft <= b.clientX && b.clientX < a.clientWidth + a.offsetLeft && a.offsetTop <= b.clientY && b.clientY < a.clientHeight + a.offsetTop) {
                jMap.DragPaper = true
            }
        }
    }
};
JinoControllerGuest.prototype.mouseup = function(a) {
    a = a || window.event;
    jMap.DragPaper = false;
    jMap.positionChangeNodes = false
};
var interceptTabs = function(a, b) {
    key = a.keyCode ? a.keyCode : a.which ? a.which : a.charCode;
    if (key == 9) {
        insertAtCursor(b, "\t");
        return false
    } else {
        return key
    }
};
JinoControllerGuest.prototype.nodeStructureFromText = function(b) {
    if (!b) {
        b = jMap.getSelecteds().getLastElement()
    }
    var a = '<form><div class="dialog_content_nod"><br />' + i18n.msgStore.create_node_text + '<br /><br /><center><textarea id="okm_node_structure_textarea" name="okm_node_structure_textarea" onkeydown="return interceptTabs(event, this);" cols="50" rows="10"></textarea></center></div></form>';

    function c(d, h) {
        if (d) {
            var g = h.okm_node_structure_textarea;
            b.folded && b.setFoldingExecute(false);
            jMap.createNodeFromText(b, g);
            jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(b);
            jMap.layoutManager.layout(true)
        }
        $("#dialog_c").dialog("close");
        jMap.work.focus()
    }
    $("#dialog_c").append(a);
    $("#dialog_c").dialog({
        autoOpen: false,
        width: "auto",
        closeOnEscape: true,
        modal: true,
        resizable: false,
        close: function(d, f) {
            $("#dialog_c .dialog_content_nod").remove();
            $("#dialog_c").dialog("destroy");
            jMap.work.focus()
        },
    });
    $("#dialog_c").dialog("option", "buttons", [{
        text: i18n.msgStore.button_apply,
        click: function() {
            var d = parseCallbackParam($("#dialog_c form").serializeArray());
            c(true, d)
        }
    }]);
    $("#dialog_c").dialog("option", "dialogClass", "nodeStructureFromText");
    $("#dialog_c").dialog("option", "title", i18n.msgStore.import_text);
    $("#dialog_c").dialog("open")
};
JinoControllerGuest.prototype.nodeStructureToText = function(b) {
    if (!b) {
        b = jMap.getSelecteds().getLastElement()
    }
    var c = jMap.createTextFromNode(b, "\t");
    var a = '<div class="dialog_content_xml"><br />' + i18n.msgStore.node_structure + '<br /><br /><center><textarea id="okm_node_structure_textarea"  onfocus= "this.select()" name="okm_node_structure_textarea" onkeydown="return interceptTabs(event, this);" cols="50" rows="10">' + c + "</textarea></center></div>";
    $("#dialog_c").append(a);
    $("#dialog_c").dialog({
        autoOpen: false,
        width: "auto",
        closeOnEscape: true,
        modal: true,
        resizable: false,
        close: function(d, f) {
            $("#dialog_c .dialog_content_xml").remove();
            $("#dialog_c").dialog("destroy");
            jMap.work.focus()
        },
    });
    $("#dialog_c").dialog("option", "dialogClass", "nodeStructureToText");
    $("#dialog_c").dialog("option", "title", i18n.msgStore.export_text);
    $("#dialog_c").dialog("open")
};
JinoControllerGuest.prototype.nodeStructureFromXml = function(b) {
    if (!b) {
        b = jMap.getSelecteds().getLastElement()
    }
    var a = '<form><div class="dialog_content_nod"><br />' + i18n.msgStore.create_node_xml + '<br /><center><textarea id="okm_node_structure_textarea" name="okm_node_structure_textarea" onkeydown="return interceptTabs(event, this);" cols="50" rows="10"></textarea></center></div></from>';

    function c(d, m) {
        if (d) {
            if (jMap.cfg.realtimeSave) {
                var l = jMap.saveAction.isAlive();
                if (!l) {
                    return null
                }
            }
            var n = m.okm_node_structure_textarea;
            n = n.replace(/&/g, "&amp;");
            var k = /(TEXT=")(.*)(" FOLDED=)/ig;
            n = n.replace(k, function() {
                var p = arguments[1];
                var f = convertCharStr2XML(arguments[2]);
                var q = arguments[3];
                return p + f + q
            });
            k = /(LINK=")([^"]*)/ig;
            n = n.replace(k, function() {
                var p = arguments[1];
                var f = convertCharStr2XML(arguments[2]);
                return p + f
            });
            n = n.replace(/ POSITION="[^"]*"/ig, "");
            var o = jMap.loadManager.pasteNode(b, n);
            var h = function() {
                for (var f = 0; f < o.length; f++) {
                    jMap.saveAction.pasteAction(o[f])
                }
                jMap.fireActionListener(ACTIONS.ACTION_NODE_PASTE, b, n);
                jMap.initFolding(b);
                jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(b);
                jMap.layoutManager.layout(true)
            };
            if (jMap.loadManager.imageLoading.length == 0) {
                h()
            } else {
                var g = jMap.addActionListener(ACTIONS.ACTION_NODE_IMAGELOADED, function() {
                    h();
                    jMap.removeActionListener(g)
                })
            }
        }
        jMap.work.focus()
    }
    $("#dialog_c").append(a);
    $("#dialog_c").dialog({
        autoOpen: false,
        width: "auto",
        closeOnEscape: true,
        modal: true,
        resizable: false,
        close: function(d, f) {
            $("#dialog_c .dialog_content_nod").remove();
            $("#dialog_c").dialog("destroy");
            jMap.work.focus()
        },
    });
    $("#dialog_c").dialog("option", "buttons", [{
        text: i18n.msgStore.button_apply,
        click: function() {
            var d = parseCallbackParam($("#dialog_c form").serializeArray());
            c(true, d)
        }
    }]);
    $("#dialog_c").dialog("option", "dialogClass", "nodeStructureFromXml");
    $("#dialog_c").dialog("option", "title", i18n.msgStore.import_xml);
    $("#dialog_c").dialog("open")
};
JinoControllerGuest.prototype.nodeStructureToXml = function(b) {
    if (!b) {
        b = jMap.getSelecteds().getLastElement()
    }
    var c = "<okm>" + b.toXML() + "</okm>";
    var a = '<div class="dialog_content_xml"><br />' + i18n.msgStore.node_structure + '<br /><br /><center><textarea id="okm_node_structure_textarea" onfocus= "this.select()" name="okm_node_structure_textarea" onkeydown="return interceptTabs(event, this);" cols="50" rows="10">' + c + "</textarea></center></div>";
    $("#dialog_c").append(a);
    $("#dialog_c").dialog({
        autoOpen: false,
        width: "auto",
        closeOnEscape: true,
        modal: true,
        resizable: false,
        close: function(d, f) {
            $("#dialog_c .dialog_content_xml").remove();
            $("#dialog_c").dialog("destroy");
            jMap.work.focus()
        },
    });
    $("#dialog_c").dialog("option", "dialogClass", "nodeStructureToXml");
    $("#dialog_c").dialog("option", "title", i18n.msgStore.export_xml);
    $("#dialog_c").dialog("open")
};
JinoControllerGuest.prototype.foldingAction = function(a) {
    if (!a) {
        a = jMap.getSelecteds().getLastElement()
    }
    a.setFoldingExecute(!a.folded);
    jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(a);
    jMap.layoutManager.layout(true)
};
var HGAP = 20;
var VGAP = 5;
var TEXT_HGAP = 10;
var TEXT_VGAP = 10;
var FOLDER_RADIUS = 4;
var PERCEIVE_WIDTH = 30;
var NODE_CORNER_ROUND = 5;
var NODE_MOVING_IGNORE = 5;
if (window.console === undefined || console.log === undefined) {
    console = {
        log: function() {},
        info: function() {},
        warn: function() {},
        error: function() {}
    }
}
HTMLElement.prototype.click = function() {
    var a = this.ownerDocument.createEvent("MouseEvents");
    a.initMouseEvent("click", true, true, this.ownerDocument.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    this.dispatchEvent(a)
};
var supportsTouch = "createTouch" in document;
var RAPHAEL = null;
var STAT_NODEEDIT = false;
var CLIPBOARD_DATA = "";
var DRAG_POS = {
    x: 0,
    y: 0
};
var J_NODE_CREATING = false;
var ACTIONS = {
    ACTION_NEW_NODE: "action_NewNode",
    ACTION_NODE_REMOVE: "action_NodeRemove",
    ACTION_NODE_EDITED: "action_NodeEdited",
    ACTION_NODE_SELECTED: "action_NodeSelected",
    ACTION_NODE_UNSELECTED: "action_NodeUnSelected",
    ACTION_NODE_FOLDING: "action_NodeFolding",
    ACTION_NODE_MOVED: "action_NodeMoved",
    ACTION_NODE_COORDMOVED: "action_NodeCoordMoved",
    ACTION_NODE_HYPER: "action_NodeHyper",
    ACTION_NODE_IMAGE: "action_NodeImage",
    ACTION_NODE_IMAGELOADED: "action_ImageLoaded",
    ACTION_NODE_PASTE: "action_NodePaste",
    ACTION_NODE_UNDO: "action_NodeUndo",
    ACTION_NODE_REDO: "action_NodeRedo",
    ACTION_NODE_FOREIGNOBJECT: "action_NodeForeignObject",
    ACTION_NODE_ATTRS: "action_NodeAttrs"
};
var ISMOBILE = ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/Android/i)));
if (window.console === undefined) {
    console = {
        log: function() {}
    }
}
JinoMap = function(b, a, c, d) {
    RAPHAEL = Raphael(b, a, c);
    RAPHAEL.canvas.id = "paper_mapview";
    this.selectedNodes = new Array();
    this.DragPaper = false;
    this.positionChangeNodes = false;
    this.movingNode = false;
    this.isSavedFlag = true;
    this.indexColor = 0;
    this.mouseRightClicked = false;
    this.scaleTimes = 1;
    this._enableDragPaper = true;
    this.mode = d || 0;
    this.Listeners = new Array();
    this.statusBar = null;
    this.tootipHandle = $('<div style="position:absolute" id="jinomap_tooltip"></div>').appendTo($("#" + b)).hide();
    this.nodeEditorHandle = $('<textarea id="nodeEditor" value="" style="position:absolute;top:0px;left:0px;width:100px;height:0px;overflow:hidden;display:none" />').appendTo($("#" + b));
    this.nodes = new Array();
    this.arrowlinks = new Array();
    this.work = $("#" + b)[0];
    $("#" + b).css("background-color", this.cfg.mapBackgroundColor);
    this.controller = this.mode ? new JinoController(this) : new JinoControllerGuest(this);
    this.loadManager = new jLoadManager(this);
    this.layoutManager = null;
    this.saveAction = new jSaveAction(this);
    this.clipboardManager = new jClipboardManager(this);
    this.nodeEditorHandle.textGrow({
        pad: 25,
        min_limit: 70,
        max_limit: 1000
    });
    this.work.focused = false;
    this.work.hasFocus = function() {
        return this.focused
    };
    this.work.onfocus = function() {
        this.focused = true
    };
    this.work.onblur = function() {
        this.focused = false
    };
    if (Raphael.svg) {
        this.groupEl = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.groupEl.style.webkitTapHighlightColor = "rgba(0,0,0,0)";
        RAPHAEL.canvas && RAPHAEL.canvas.appendChild(this.groupEl)
    }
};
JinoMap.prototype.type = "JinoMap";
JinoMap.instance = null;
JinoMap.prototype.deleteNodeById = function(a) {
    delete this.nodes[a]
};
JinoMap.prototype.getNodeById = function(a) {
    return this.nodes[a]
};
JinoMap.prototype.checkID = function(b) {
    if (!b) {
        return false
    }
    for (var a in this.nodes) {
        if (a == b) {
            return false
        }
    }
    return true
};
JinoMap.prototype.getRootNode = function() {
    return this.rootNode
};
JinoMap.prototype.setRootNode = function(a) {
    this.rootNode = a
};
JinoMap.prototype.addActionListener = function(a, b) {
    var c = {
        name: a,
        f: b
    };
    this.Listeners.push(c);
    return c
};
JinoMap.prototype.removeActionListener = function(a) {
    this.Listeners.remove(a)
};
JinoMap.prototype.fireActionListener = function() {
    if (arguments.length < 1) {
        return
    }
    var c = Array.prototype.slice.call(arguments, 0, 1)[0];
    var a = Array.prototype.slice.call(arguments, 1);
    var d = this.Listeners,
        b = d.length;
    while (b--) {
        if (!d[b]) {
            continue
        }
        if (d[b].name == c) {
            d[b].f.apply(this, a)
        }
    }
};
JinoMap.prototype.findNode = function(o, h, c, b, n) {
    if (!n) {
        n = new Array()
    }
    var d = b || this.rootNode;
    var l = "g";
    var p = /\\/g;
    var f = o.replace(p, "");
    p = /([\*\+\$\|\?\(\)\{\}\^\[\]])/g;
    f = f.replace(p, "\\$1");
    if (h) {
        if (f.substr(0, 1) != "^") {
            f = "^" + f
        }
        if (f.substr(f.length - 1, 1) != "$") {
            f = f + "$"
        }
    }
    if (c) {
        l = l + "i"
    }
    var m = new RegExp(f, l);
    var k = m.exec(d.getText());
    k && n.push({
        node: d,
        match: k
    });
    if (d.getChildren().length > 0) {
        var a = d.getChildren();
        for (var g = 0; g < a.length; g++) {
            this.findNode(o, h, c, a[g], n)
        }
    }
    return n
};
JinoMap.prototype.loadMap = function(a, b, c) {
    this.clearMap();
    this.loadManager.loadMap(a, b, c)
};
JinoMap.prototype.loadMapFromXml = function(a) {
    this.clearMap();
    var b = false;
    if (window.DOMParser) {
        var c = new DOMParser();
        b = c.parseFromString(a, "text/xml")
    } else {
        b = new ActiveXObject("Microsoft.XMLDOM");
        b.async = "false";
        b.loadXML(a)
    }
    if (b) {
        this.loadManager.parseMM(b)
    }
};
JinoMap.prototype.clearMap = function() {
    if (this.rootNode) {
        RAPHAEL.clear()
    }
    if (this.groupEl) {
        this.groupEl.remove;
        this.groupEl = null
    }
};
JinoMap.prototype.newMap = function(title) {
    this.clearMap();
    if (!title) {
        title = "newMap"
    }
    var layout = this.cfg.mapLayout;
    var jsCode = "this.layoutManager =  new " + layout + "(this);";
    eval(jsCode);
    var param = {
        text: title
    };
    this.rootNode = this.createNodeWithCtrlExecute(param);
    this.rootNode.focus(true);
    this.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
    return this.rootNode;
    JinoUtil.waitingDialogClose()
};
JinoMap.prototype.getSelecteds = function() {
    return this.selectedNodes
};
JinoMap.prototype.getSelected = function() {
    if (this.getSelecteds().length < 1) {
        return null
    }
    return this.getSelecteds().getLastElement()
};
JinoMap.prototype.isSaved = function() {
    return this.isSavedFlag
};
JinoMap.prototype.setSaved = function(a) {
    this.isSavedFlag = a
};
JinoMap.prototype.setLayoutManager = function(a) {
    this.layoutManager = a;
    if (a.type == "jTableLayout") {
        this.fixTextWidth(this.getRootNode())
    }
    $.ajax({
        type: "post",
        async: false,
        url: this.cfg.contextPath + "/mindmap/changeMap.do",
        data: {
            mapId: mapId,
            style: a.type
        },
        success: function(c, d, b) {
            window.location.reload(true)
        },
        error: function(d, b, c) {
            alert("setLayoutManager : " + b)
        }
    })
};
JinoMap.prototype.fixTextWidth = function(c) {
    var l = c.getText();
    var k = l.length;
    var g = l.split("\n");
    if (k > 20 && g.length < 2) {
        var a = function(p, m) {
            var o = p.slice(0, 20);
            m.push(o);
            var n = p.substring(20);
            if (n.length > 20) {
                a(n, m)
            } else {
                m.push(n)
            }
        };
        var h = new Array();
        a(l, h);
        var f = h.join("\n");
        c.setText(f)
    }
    if (c.getChildren().length > 0) {
        var b = c.getChildren();
        for (var d = 0; d < b.length; d++) {
            this.fixTextWidth(b[d])
        }
    }
};
JinoMap.prototype.changeOfWholeMap = function(d) {
    if (d.connection) {
        d.connection.remove()
    }
    switch (this.layoutManager.type) {
        case "jMindMapLayout":
            d.connection = d.parent && new jLineBezier(d.parent, d);
            break;
        case "jTreeLayout":
            d.connection = d.parent && new jLinePolygonal(d.parent, d);
            break;
        case "jTableLayout":
            break;
        case "jFishboneLayout":
            d.connection = d.parent && new jLineBezier(d.parent, d);
            break;
        default:
            d.connection = d.parent && new jLineBezier(d.parent, d);
            break
    }
    if (d.connection && d.hided) {
        d.connection.hide()
    }
    var c = new Array();
    for (var b = 0; b < d.arrowlinks.length; b++) {
        c.push(d.arrowlinks[b].destinationNode);
        d.removeArrowLink(d.arrowlinks[b])
    }
    for (var b = 0; b < c.length; b++) {
        var f = null;
        switch (jMap.layoutManager.type) {
            case "jMindMapLayout":
                f = new CurveArrowLink(c[b]);
                break;
            case "jTreeLayout":
                f = new RightAngleArrowLink(c[b]);
                break;
            default:
                f = new CurveArrowLink(c[b])
        }
        d.addArrowLink(f)
    }
    if (d.isRootNode()) {
        d.fontSize = this.cfg.nodeFontSizes[0]
    } else {
        if (d.getParent().isRootNode()) {
            d.fontSize = this.cfg.nodeFontSizes[1]
        } else {
            d.fontSize = this.cfg.nodeFontSizes[2]
        }
    }
    d.text.attr({
        "font-size": d.fontSize
    });
    d.CalcBodySize();
    if (d.hided) {
        d.hide()
    }
    if (d.getChildren().length > 0) {
        var a = d.getChildren();
        for (var b = 0; b < a.length; b++) {
            this.changeOfWholeMap(a[b])
        }
    }
};
JinoMap.prototype.getLayoutManager = function() {
    return this.layoutManager
};
JinoMap.prototype.showAdminNotice = function(c) {
    var a = '<from><div class="dialog_content_nod" align="center"><div>' + c + "</div></div></from>";

    function b(d, g) {
        if (d) {}
        $("#dialog").dialog("close");
        jMap.work.focus()
    }
    $("#dialog").append(a);
    $("#dialog").dialog({
        autoOpen: false,
        closeOnEscape: true,
        width: 350,
        modal: true,
        resizable: false,
        close: function(d, f) {
            $("#dialog .dialog_content_nod").remove();
            $("#dialog").dialog("destroy")
        },
    });
    $("#dialog").dialog("option", "width", "none");
    $("#dialog").dialog("option", "buttons", [{
        text: i18n.msgStore.notice_button_ok,
        click: function() {
            var d = parseCallbackParam($("#dialog form").serializeArray());
            b(true, d)
        }
    }]);
    $("#dialog").dialog("option", "title", i18n.msgStore.notice_title);
    $("#dialog").dialog("open")
};
JinoMap.prototype.showBlinkStatusBar = function(a) {
    if (!this.statusBar || this.statusBar.removed) {
        this.statusBar = this.body = RAPHAEL.text();
        this.statusBar.attr({
            "font-size": 12,
            "text-anchor": "start",
            fill: "#000",
            opacity: 0
        })
    }
    this.statusBar.attr({
        text: a,
        x: this.work.scrollLeft + 15,
        y: this.work.scrollTop + this.work.offsetHeight - 30
    });
    this.statusBar.animate({
        opacity: 1
    }, 500, function() {
        this.animate({
            opacity: 0
        }, 500)
    });
    this.aaa = $('<div style="position:absolute" id="aaa">aaaa</div>').appendTo($("#jinomap"))
};
JinoMap.prototype.createNodeWithCtrl = function(k, f, d) {
    if (this.cfg.realtimeSave) {
        var g = this.saveAction.isAlive();
        if (!g) {
            return null
        }
    }
    var h = this.historyManager;
    var a = null;
    var c = this.createNodeWithCtrlExecute(k, f);
    var b = h && h.extractNode(c);
    h && h.addToHistory(a, b);
    this.saveAction.newAction(c, d);
    this.fireActionListener(ACTIONS.ACTION_NEW_NODE, c, k, f);
    this.setSaved(false);
    return c
};
JinoMap.prototype.createNodeWithCtrlExecute = function(param, style) {
    if (!style) {
        style = this.cfg.nodeStyle
    }
    var jsCode = "var newNode = new " + style + "(param);";
    eval(jsCode);
    var controller = this.mode ? new jNodeController() : new jNodeControllerGuest();
    newNode.addEventController(controller);
    return newNode
};
JinoMap.prototype.changePosition = function(g, c, a, b) {
    if (this.cfg.realtimeSave) {
        var h = this.saveAction.isAlive();
        if (!h) {
            return null
        }
    }
    var k = this.changePositionExecute(g, c, a, b);
    var f = function() {
        for (var l = 0; l < k.length; l++) {
            jMap.saveAction.moveAction(k[l], g, b)
        }
        for (var l = 0; l < k.length; l++) {
            jMap.saveAction.editAction(k[l])
        }
        jMap.fireActionListener(ACTIONS.ACTION_NODE_MOVED, g, k, a, b);
        jMap.setSaved(false)
    };
    if (this.loadManager.imageLoading.length == 0) {
        f()
    } else {
        var d = this.addActionListener(ACTIONS.ACTION_NODE_IMAGELOADED, function() {
            f();
            this.removeActionListener(d)
        })
    }
    return k
};
JinoMap.prototype.changePositionExecute = function(h, c, a, b) {
    var f = "<paste>";
    for (var g = 0; g < c.length; g++) {
        f += c[g].toXML();
        c[g].removeExecute()
    }
    f += "</paste>";
    var d = (b) ? b.getIndexPos() : null;
    var k = this.loadManager.pasteNode(h, f, d, a);
    return k
};
JinoMap.prototype.initFolding = function(c) {
    if (this.cfg.lazyLoading) {
        if (c.lazycomplete) {
            if (c.folded) {
                c.setFoldingExecute(c.folded)
            }
        } else {
            if (c.numofchildren > 0) {
                c.folderShape && c.folderShape.show();
                c.folded = true
            } else {
                c.lazycomplete = new Date().valueOf()
            }
        }
    } else {
        if (c.folded) {
            c.setFoldingExecute(c.folded)
        }
    }
    if (c.getChildren().length > 0) {
        var b = c.getChildren();
        for (var a = 0; a < b.length; a++) {
            this.initFolding(b[a])
        }
    }
};
JinoMap.prototype.initFoldingAll = function() {
    this.initFolding(this.getRootNode())
};
JinoMap.prototype.toXML = function() {
    var a = '<map version="0.9.0">\n';
    a += "<!-- To view this file, download free mind mapping software FreeMind from http://freemind.sourceforge.net -->\n";
    a += this.rootNode.toXML() + "\n";
    a += "</map>";
    return a
};
JinoMap.prototype.resetCoordinate = function(c) {
    c.hgap = 0;
    c.vshift = 0;
    this.saveAction.editAction(c, false);
    if (c.getChildren().length > 0) {
        var b = c.getChildren();
        for (var a = 0; a < b.length; a++) {
            this.resetCoordinate(b[a])
        }
    }
};
JinoMap.prototype.createNodeFromText = function(d, n, k) {
    var p = n.split("\n");
    var a = d;
    var h = d;
    var b = 0;
    var o = k;
    for (var f = 0; f < p.length; f++) {
        if (!k) {
            o = (p[f].charAt(0) == "\t") ? "\t" : "    "
        }
        var l = p[f].split(o);
        var m = l.length;
        var g = l[m - 1];
        while (true) {
            if (b == m - 1) {
                var c = {
                    parent: h,
                    text: g
                };
                h = this.createNodeWithCtrl(c);
                b = m;
                break
            }
            if (!h.getParent()) {
                break
            }
            h = h.getParent();
            b = b - 1
        }
    }
};
JinoMap.prototype.createTextFromNode = function(d, c, g, f) {
    f = f ? f : 0;
    g = g ? g : "";
    var h = "";
    for (var b = 0; b < f; b++) {
        h = h + c
    }
    g = g + h + d.getText() + "\n";
    if (d.getChildren().length > 0) {
        var a = d.getChildren();
        f++;
        for (var b = 0; b < a.length; b++) {
            g = this.createTextFromNode(a[b], c, g, f)
        }
    }
    return g
};
JinoMap.prototype.setWaterMark = function() {
    this.watermark = $('<div id="okm_wartermark" style="position:absolute;top:0px;left:0px;text-decoration:underline;"><a href="http://www.okmindmap.com" target="_blank">OKMindmap</a></div>');
    $(this.work).after(this.watermark);
    var a = function() {
        var c = $("#okm_wartermark");
        var d = $(window).width() - parseInt(c.css("width")) - 15;
        var b = $(window).height() - parseInt(c.css("height")) - 15;
        c.css("top", b);
        c.css("left", d)
    };
    a();
    $(window).resize(a)
};
JinoMap.prototype.setSessionTimeout = function() {
    if (!this.mode) {
        return null
    }
    this.sessionTimeout = setTimeout(function() {
        if (ISMOBILE) {
            alert("���� �̿��� ���� �ڵ� �α׾ƿ� �Ǿ����ϴ�.\n�ٽ� �α��� �Ͻñ� �ٶ��ϴ�.");
            location.replace(jMap.cfg.contextPath + "/user/logout.do")
        }
        var b = function(c, g) {
            if (c == "logout") {
                location.replace(jMap.cfg.contextPath + "/user/logout.do")
            } else {
                if (c == "extension") {
                    var d = false;
                    if (window.XMLHttpRequest && !(window.ActiveXObject)) {
                        try {
                            d = new XMLHttpRequest()
                        } catch (h) {
                            d = false
                        }
                    } else {
                        if (window.ActiveXObject) {
                            try {
                                d = new ActiveXObject("Msxml2.XMLHTTP")
                            } catch (h) {
                                try {
                                    d = new ActiveXObject("Microsoft.XMLHTTP")
                                } catch (h) {
                                    d = false
                                }
                            }
                        }
                    }
                    if (d) {
                        d.onreadystatechange = function() {
                            if (d.readyState == 4) {
                                var f = false;
                                if (d.status == 200) {
                                    console.log(d.responseText)
                                } else {}
                            }
                        };
                        d.open("GET", "/okmindmap/", true);
                        d.send(null)
                    }
                    $("#dialog").dialog("close");
                    jMap.resetSessionTimeout()
                }
            }
        };
        var a = '<center><font color="#ff0000">Timeout</font></center><br />���� �̿��� ���� �ڵ� �α׾ƿ� �Ǿ����ϴ�.<br />OK��ư�� ���� �ٽ� �α��� �Ͻñ� �ٶ��ϴ�.<br />';
        $("#dialog").append(a);
        $("#dialog").dialog({
            autoOpen: false,
            closeOnEscape: true,
            width: 350,
            modal: true,
            resizable: false,
            close: function(c, d) {
                $("#dialog .dialog_content").remove();
                $("#dialog").dialog("destroy")
            },
        });
        $("#dialog").dialog("option", "width", "none");
        $("#dialog").dialog("option", "buttons", [{
            text: i18n.msgStore.notice_button_ok,
            click: function() {
                var c = parseCallbackParam($("#dialog form").serializeArray());
                b("logout", c)
            }
        }]);
        $("#dialog").dialog("option", "title", "");
        $("#dialog").dialog("open")
    }, 1500000)
};
JinoMap.prototype.resetSessionTimeout = function() {
    if (!this.mode) {
        return null
    }
    clearTimeout(this.sessionTimeout);
    this.setSessionTimeout()
};
JinoMap.prototype.scale = function(a, l) {
    if (a < 0.2 || a > 2.5) {
        return
    }
    if (Raphael.svg) {
        if (!l) {
            l = 1
        }
        var h = this.getSelected();
        var c = this.getViewScale(this.scaleTimes);
        var f = this.getViewScale(a);
        var g = (f - c) / l;
        var d = c;
        var k = this;
        var b = new TimeLine(30, l);
        b.onframe = function() {
            d = d + g;
            var n = RAPHAEL.getSize();
            var m = (1 - d) * (n.width / 2);
            var r = (1 - d) * (n.height / 2);
            var o = n.width * d;
            var q = n.height * d;
            var p = m + " " + r + " " + o + " " + q;
            RAPHAEL.canvas.setAttribute("viewBox", p);
            k.cfg.scale = n.width / o
        };
        b.onstart = function() {};
        b.onstop = function() {};
        b.start();
        this.scaleTimes = a
    }
};
JinoMap.prototype.getViewScale = function(c) {
    var b = Math.floor(c);
    var g = Math.floor((c * 10) % 10);
    var a = 0;
    if (1 < c) {
        a = 1 / Math.pow(10, b - 1) - (b + g - 1) / Math.pow(10, b)
    } else {
        var f = function(h) {
            var l = 0;
            while (h < 1) {
                h = h * 10;
                l = l + 1
            }
            var k = Math.round(11 - h - l) / 10;
            return l + k
        };
        a = f(parseFloat(c))
    }
    return a
};
JinoMap.prototype.scaleFromTransform = function(g, f) {
    if (Raphael.svg) {
        if (!f) {
            f = 1
        }
        var b = this.scaleTimes;
        var h = g;
        var d = (h - b) / f;
        var a = b;
        var c = new TimeLine(30, f);
        c.onframe = function() {
            a = a + d;
            jMap.scaleApply(a, jMap.getSelecteds().getLastElement())
        };
        c.onstart = function() {};
        c.onstop = function() {};
        c.start();
        this.scaleTimes = h
    }
};
JinoMap.prototype.scaleApply = function(d, c) {
    c.groupEl.setAttribute("transform", "scale(" + d + ")");
    c.connection && c.connection.line.node.setAttribute("transform", "scale(" + d + ")");
    if (c.getChildren().length > 0) {
        var b = c.getChildren();
        for (var a = 0; a < b.length; a++) {
            this.scaleApply(d, b[a])
        }
    }
};
JinoMap.prototype.enableDragPaper = function(a) {
    this._enableDragPaper = a
};
JinoMap.prototype.setUserConfig = function(a) {
    var b = this;
    $.ajax({
        type: "post",
        dataType: "json",
        async: false,
        url: b.cfg.contextPath + "/user/userconfig.do",
        data: {
            userid: a,
            returntype: "json"
        },
        success: function(c) {
            var d = c[0];
            for (config in d) {
                if (d[config].data != null && d[config].data != "") {
                    b.cfg[config] = d[config].data
                }
            }
        },
        error: function(f, c, d) {
            alert("userConfig : " + c)
        }
    })
};
JinoMap.prototype.travelNodes = function(c) {
    if (c.getChildren().length > 0) {
        var b = c.getChildren();
        for (var a = 0; a < b.length; a++) {
            this.travelNodes(b[a])
        }
    }
};
JinoMap.prototype.getArrowLinks = function(c) {
    var b = new Array();
    var d = c.id;
    for (var a = 0; a < this.arrowlinks.length; a++) {
        if (this.arrowlinks[a].destination == d) {
            b.push(this.arrowlinks[a])
        }
    }
    return b
};
JinoMap.prototype.addArrowLink = function(a) {
    this.arrowlinks.push(a)
};
JinoMap.prototype.removeArrowLink = function(a) {
    this.arrowlinks.remove(a)
};
JinoMap.prototype.resolveRendering = function() {
    setTimeout(function() {
        var b = "block";
        var a = $("svg").css("display");
        if (a == "block") {
            b = "inline"
        }
        $("svg").css("display", b)
    }, 100)
};
JinoMap.prototype.getClientId = function() {
    return $.cookie("CLIENT_ID")
};
JinoMap.prototype.isAllowNodeEdit = function(a) {
    if (!this.cfg.restrictEditing) {
        return true
    }
    if (this.cfg.mapOwner) {
        return true
    }
    if (a.creator == 0) {
        var b = this.getClientId();
        if (a.client_id == "" || a.client_id == b) {
            return true
        }
    } else {
        if (a.creator == this.cfg.userId) {
            return true
        }
    }
    alert(i18n.msgStore.restrict_editing);
    return false
};
jClipboardManager = function(a) {
    this.clipboard = "";
    this.map = a
};
jClipboardManager.prototype.type = "jClipboardManager";
jClipboardManager.prototype.toClipboard = function(b, a) {
    this.clipboard = "<clipboard>";
    if (this.map.cfg.lazyLoading) {
        for (var d = 0; d < b.length; d++) {
            var g = b[d].getID();
            var f = this;
            $.ajax({
                type: "post",
                async: false,
                url: jMap.cfg.contextPath + "/mindmap/childnodes.do",
                data: {
                    map: mapId,
                    node: g,
                    alldescendant: true
                },
                beforeSend: function() {},
                success: function(k, m, h) {
                    var l = h.responseText;
                    if (a) {
                        l = l.replace(/ID_[^"]*/g, "")
                    }
                    f.clipboard += l
                },
                error: function(l, h, k) {
                    alert("editAction : " + h)
                },
                complete: function() {}
            })
        }
    } else {
        for (var d = 0; d < b.length; d++) {
            var c = b[d].toXML();
            this.clipboard += c
        }
    }
    this.clipboard += "</clipboard>"
};
jClipboardManager.prototype.getClipboardText = function() {
    return this.clipboard
};
JinoMap.prototype.cfg = {
    contextPath: "",
    mapId: 0,
    mapKey: "",
    mapName: "",
    userId: 0,
    lazyLoading: false,
    realtimeSave: true,
    scale: 1,
    nodeFontSizes: ["30", "18", "12"],
    mapBackgroundColor: "#ffffff",
    nodeSelectedColor: "#E02405",
    nodeDropFocusColor: "#808080",
    nodeDefalutColor: "#F4F4F4",
    textDefalutColor: "#000000",
    edgeDefalutColor: "#CCCCCC",
    branchDefalutColor: "#CCCCCC",
    edgeDefalutWidth: "1",
    branchDefalutWidth: "2",
    nodeStyle: "jRect",
    mapLayout: "jMindMapLayout",
    default_img_size: 200,
    default_video_size: 200,
    default_menu_opacity: false,
    restrictEditing: false,
    mapOwner: false
};
JinoUtil = (function() {
    function a() {}
    a.trimStr = function(f, c) {
        if (!f) {
            return ""
        }
        var c = c || " \n\r\t\f";
        for (var d = 0; d < f.length; d++) {
            if (c.indexOf(f.charAt(d)) < 0) {
                break
            }
        }
        for (var b = f.length - 1; b >= d; b--) {
            if (c.indexOf(f.charAt(b)) < 0) {
                break
            }
        }
        return f.substring(d, b + 1)
    };
    a.waitingDialog = function(c) {
        if (ISMOBILE) {
            jQuery("#jinomap").showLoading()
        } else {
            var b = '<table border="0"><tr><td class="nobody" rowspan="2" style="vertical-align: top; padding-top: 2px;padding-right: 10px;"><img src="' + jMap.cfg.contextPath + '/images/wait16trans.gif"></td><td class="nobody">' + c + '</td><tr><td class="nobody">Please wait...</td></tr></table>';
            $("#waitingDialog").append(b);
            $("#waitingDialog").dialog({
                autoOpen: false,
                modal: true,
                resizable: false,
                close: function(d, f) {
                    $("#waitingDialog table").remove();
                    $("#waitingDialog").dialog("destroy")
                },
            });
            $("#waitingDialog").dialog("option", "width", "none");
            $("#waitingDialog").dialog("open")
        }
    };
    a.waitingDialogClose = function() {
        if (ISMOBILE) {
            jQuery("#jinomap").hideLoading()
        } else {
            $("#waitingDialog").dialog("close")
        }
    };
    a.xml2Str = function(b) {
        try {
            return (new XMLSerializer()).serializeToString(b)
        } catch (c) {
            try {
                return b.xml
            } catch (c) {
                alert("Xmlserializer not supported")
            }
        }
        return false
    };
    a.importJS = function(c) {
        var b = document.createElement("script");
        b.setAttribute("src", c);
        b.setAttribute("type", "text/javascript");
        document.getElementsByTagName("head")[0].appendChild(b)
    };
    a.importJSNoCache = function(d) {
        var c = new Date().getTime().toString();
        var b = "?" + c;
        a.importJS(d + b)
    };
    a.importCSS = function(c) {
        var b = document.createElement("link");
        b.setAttribute("href", c);
        b.setAttribute("rel", "stylesheet");
        document.getElementsByTagName("head")[0].appendChild(b)
    };
    a.importCSSNoCache = function(d) {
        var c = new Date().getTime().toString();
        var b = "?" + c;
        a.importCSS(d + b)
    };
    a.imgResizer = function(g) {
        var f = parseFloat(g.img.attr().width);
        f = f.toFixed(0);
        var c = parseFloat(g.img.attr().height);
        c = c.toFixed(0);
        var b = '<form><div class="dialog_content"><br />width:<br /><input type="text" id="resizer_input_width"name="resizer_input_width" value=' + f + ' /><br />height:<br /><input type="text" id="resizer_input_height"name="resizer_input_height" value=' + c + " /></div></form>";

        function d(l, n) {
            if (l) {
                var k = n.resizer_input_width;
                var m = n.resizer_input_height;
                g.imageResize(k, m)
            }
            $("#dialog").dialog("close");
            jMap.work.focus()
        }
        $("#dialog").append(b);
        $("#dialog").dialog({
            autoOpen: false,
            closeOnEscape: true,
            width: 350,
            modal: true,
            resizable: false,
            close: function(h, k) {
                $("#dialog .dialog_content").remove();
                $("#dialog").dialog("destroy")
            },
        });
        $("#dialog").dialog("option", "width", "none");
        $("#dialog").dialog("option", "buttons", [{
            text: i18n.msgStore.button_apply,
            click: function() {
                var h = parseCallbackParam($("#dialog form").serializeArray());
                d(true, h)
            }
        }]);
        $("#dialog").dialog("option", "title", "Image Resize");
        $("#dialog").dialog("open")
    };
    a.videoResizer = function(f) {
        var d = parseFloat(f.foreignObjEl.getAttribute("width"));
        d = d.toFixed(0);
        var c = parseFloat(f.foreignObjEl.getAttribute("height"));
        c = c.toFixed(0);
        var b = '<form><div class="dialog_content"><br />width:<br /><input type="text" id="resizer_input_width"name="resizer_input_width" value=' + d + ' /><br />height:<br /><input type="text" id="resizer_input_height"name="resizer_input_height" value=' + c + " /></div></form>";

        function g(l, n) {
            if (l) {
                var k = n.resizer_input_width;
                var m = n.resizer_input_height;
                f.foreignObjectResize(k, m)
            }
            $("#dialog").dialog("close");
            jMap.work.focus()
        }
        $("#dialog").append(b);
        $("#dialog").dialog({
            autoOpen: false,
            closeOnEscape: true,
            width: 350,
            modal: true,
            resizable: false,
            close: function(h, k) {
                $("#dialog .dialog_content").remove();
                $("#dialog").dialog("destroy")
            },
        });
        $("#dialog").dialog("option", "width", "none");
        $("#dialog").dialog("option", "buttons", [{
            text: i18n.msgStore.button_apply,
            click: function() {
                var h = parseCallbackParam($("#dialog form").serializeArray());
                g(true, h)
            }
        }]);
        $("#dialog").dialog("option", "title", "Video Resize");
        $("#dialog").dialog("open")
    };
    a.BookmarkCallback = function(b) {
        var d = function(k, n) {
            for (var h = 0; h < n.length; h++) {
                if (n[h].location) {
                    var m = {
                        parent: k,
                        text: convertHexNCR2Char(n[h].name)
                    };
                    var g = jMap.createNodeWithCtrl(m, null, false);
                    g.setHyperlink(convertHexNCR2Char(n[h].location))
                }
                if (n[h].children && n[h].children.length > 0) {
                    var m = {
                        parent: k,
                        text: convertHexNCR2Char(n[h].name)
                    };
                    var l = jMap.createNodeWithCtrl(m);
                    d(l, n[h].children)
                }
            }
        };
        var f = JSON.parse(b);
        var c = jMap.selectedNodes.getLastElement();
        if (!c) {
            c = jMap.getRootNode()
        }
        d(c, f.children);
        jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(c);
        jMap.layoutManager.layout(true);
        $("#dialog_c").dialog("close")
    };
    a.connectionShadow = function(B, z, m, h) {
        if (B.line && B.from && B.to) {
            m = B;
            B = m.from;
            z = m.to
        }
        var u = z.edge_width ? z.edge_width : 1;
        u = u * 2;
        var q = B.getBBox();
        var o = z.getBBox();
        var E = B.rotate();
        var C = z.rotate();
        var t = 0;
        if (isFinite(B.getBBox().width)) {
            t = q.width
        }
        var b = 0;
        if (isFinite(z.getBBox().width)) {
            b = o.width
        }
        var s = [{
            x: q.x + t / 2,
            y: q.y - 1
        }, {
            x: q.x + t / 2,
            y: q.y + q.height + 1
        }, {
            x: q.x - 1,
            y: q.y + q.height / 2
        }, {
            x: q.x + t + 1,
            y: q.y + q.height / 2
        }, {
            x: o.x + b / 2,
            y: o.y - 1
        }, {
            x: o.x + b / 2,
            y: o.y + o.height + 1
        }, {
            x: o.x - 1,
            y: o.y + o.height / 2
        }, {
            x: o.x + b + 1,
            y: o.y + o.height / 2
        }];
        if (h) {
            var H = [2, 7]
        } else {
            var H = [3, 6]
        }
        var D = s[H[0]].x,
            g = s[H[0]].y - u / 2,
            w = s[H[1]].x,
            c = s[H[1]].y,
            n = Math.max(Math.abs(D - w) / 2, 10),
            l = Math.max(Math.abs(g - c) / 2, 10),
            A = [D, D, D - n, D + n][H[0]].toFixed(3),
            f = [g - l, g + l, g, g][H[0]].toFixed(3),
            x = [0, 0, 0, 0, w, w, w - n, w + n][H[1]].toFixed(3),
            d = [0, 0, 0, 0, g + l, g - l, c, c][H[1]].toFixed(3),
            k = g + u,
            F = [0, 0, 0, 0, w, w, w - n, w + n][H[1]],
            G = [D, D, D - n, D + n][H[0]];
        if (h) {
            if (g > c) {
                F = F - u;
                G = G - u
            } else {
                F = F + u;
                G = G + u
            }
        } else {
            if (g > c) {
                F = F + u;
                G = G + u
            } else {
                F = F - u;
                G = G - u
            }
        }
        F = F.toFixed(3);
        G = G.toFixed(3);
        var r = ["M", D.toFixed(3), g.toFixed(3), "C", A, f, x, d, w.toFixed(3), c.toFixed(3), "C", x, d, G, f, D.toFixed(3), k.toFixed(3)].join(",");
        if (m && m.line) {
            m.line.attr({
                path: r
            })
        } else {
            var v = typeof m == "string" ? m : "#000";
            return {
                line: RAPHAEL.path(r).attr({
                    stroke: v,
                    fill: "none"
                }),
                from: B,
                to: z
            }
        }
    };
    a.detectIframeOpener = function(b) {
        var c = (parent !== window);
        var d = (document.referrer === "");
        if (c || d) {
            window.open(b)
        } else {
            javascript: location.href = b
        }
    };
    return a
})();
StringBuffer = function() {
    this.buffer = []
};
StringBuffer.prototype.add = function(a) {
    this.buffer[this.buffer.length] = a
};
StringBuffer.prototype.flush = function() {
    this.buffer.length = 0
};
StringBuffer.prototype.getLength = function() {
    return this.buffer.join("").length
};
StringBuffer.prototype.toString = function(a) {
    return this.buffer.join(a || "")
};

function copyPrototype(d, c) {
    var f = c.toString();
    var b = f.match(/\s*function (.*)\(/);
    if (b != null) {
        d.prototype[b[1]] = c
    }
    for (var a in c.prototype) {
        d.prototype[a] = c.prototype[a]
    }
}

function extend(a, c) {
    function b() {}
    b.prototype = c.prototype;
    a.prototype = new b();
    a.prototype.constructor = a;
    a.superclass = c;
    a.superproto = c.prototype
}
var MAX_HISTORY_LENGTH = 0;
UndoRedoManager = function() {
    this.undoList = new Array();
    this.redoList = new Array()
};
UndoRedoManager.prototype.type = "UndoRedoManager";
UndoRedoManager.prototype.addToHistory = function(a, b) {
    this.undoList.push({
        undo: a,
        redo: b
    });
    if (this.undoList.length > MAX_HISTORY_LENGTH) {
        this.undoList.splice(0, 1)
    }
};
UndoRedoManager.prototype.undo = function() {
    if (this.undoList.length == 0) {
        return false
    }
    var c = this.undoList.pop();
    var d = c.undo && c.undo.id || c.redo.id;
    var a = jMap.getNodeById(d);
    this.redoList.push(c);
    var b = null;
    if (c.undo) {
        b = this.recoveryNode(a, c.undo);
        b.setFoldingExecute(b.folded)
    } else {
        a.removeExecute()
    }
    jMap.fireActionListener(ACTIONS.ACTION_NODE_UNDO, d, c.undo);
    jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
    return true
};
UndoRedoManager.prototype.redo = function() {
    if (this.redoList.length == 0) {
        return false
    }
    var c = this.redoList.pop();
    var d = c.redo && c.redo.id || c.undo.id;
    var a = jMap.getNodeById(d);
    this.undoList.push(c);
    var b = null;
    if (c.redo) {
        b = this.recoveryNode(a, c.redo);
        b.setFoldingExecute(b.folded)
    } else {
        a.removeExecute()
    }
    jMap.fireActionListener(ACTIONS.ACTION_NODE_REDO, d, c.redo);
    jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
    return true
};
UndoRedoManager.prototype.extractNode = function(g, a) {
    var h = {};
    var k = g.body.attr();
    delete k.gradient;
    k.fill = g.background_color;
    k.stroke = g.edge.color;
    k["stroke-width"] = g.edge.width;
    h.body = k;
    var b = g.text.attr();
    h.text = b;
    var f = g.folderShape.attr();
    h.folderShape = f;
    h.hyperlink = g.hyperlink && g.hyperlink.attr().href;
    h.img = g.imgInfo.href && g.imgInfo.href;
    h.note = g.note;
    h.background_color = g.background_color;
    h.color = g.color;
    h.folded = g.folded;
    h.id = g.id;
    h.plainText = g.plainText;
    h.link = g.link;
    h.position = g.position;
    h.style = g.style;
    h.created = g.created;
    h.modified = g.modified;
    h.hgap = g.hgap;
    h.vgap = g.vgap;
    h.vshift = g.vshift;
    h.SHIFT = g.SHIFT;
    h.relYPos = g.relYPos;
    h.treeWidth = g.treeWidth;
    h.treeHeight = g.treeHeight;
    h.leftTreeWidth = g.leftTreeWidth;
    h.rightTreeWidth = g.rightTreeWidth;
    h.upperChildShift = g.upperChildShift;
    h.edge = g.edge;
    h.branch = g.branch;
    h.fontSize = g.fontSize;
    if (g.foreignObjEl) {
        h.foreignObject_plainHtml = g.foreignObjEl.plainHtml;
        h.foreignObject_width = g.foreignObjEl.getAttribute("width");
        h.foreignObject_height = g.foreignObjEl.getAttribute("height")
    }
    h.parentid = g.getParent() && g.getParent().id;
    h.childPosition = g.getIndexPos();
    if (a) {
        h.child = new Array;
        if (g.getChildren().length > 0) {
            var d = g.getChildren();
            for (var c = 0; c < d.length; c++) {
                h.child.push(this.extractNode(d[c], a))
            }
        }
    }
    return h
};
UndoRedoManager.prototype.recoveryNode = function(d, f) {
    if (f.body.removed) {
        return
    }
    if (!d) {
        var a = jMap.getNodeById(f.parentid);
        var h = null;
        var b = null;
        if (f.id) {
            h = f.id
        }
        b = f.childPosition;
        var g = {
            parent: a,
            text: "",
            id: h,
            index: b
        };
        d = jMap.createNodeWithCtrlExecute(g);
        a.folded && a.setFoldingExecute(a.folded);
        f.hyperlink && d.setHyperlinkExecute(f.hyperlink);
        f.img && d.setImageExecute(f.img)
    }
    d.body.attr(f.body);
    d.text.attr(f.text);
    d.folderShape.attr(f.folderShape);
    d.note = f.note;
    d.background_color = f.background_color;
    d.color = f.color;
    d.folded = f.folded;
    d.plainText = f.plainText;
    d.link = f.link;
    d.position = f.position;
    d.style = f.style;
    d.created = f.created;
    d.modified = f.modified;
    d.hgap = f.hgap;
    d.vgap = f.vgap;
    d.vshift = f.vshift;
    d.SHIFT = f.SHIFT;
    d.relYPos = f.relYPos;
    d.treeWidth = f.treeWidth;
    d.treeHeight = f.treeHeight;
    d.leftTreeWidth = f.leftTreeWidth;
    d.rightTreeWidth = f.rightTreeWidth;
    d.upperChildShift = f.upperChildShift;
    d.edge = f.edge;
    d.branch = f.branch;
    d.fontSize = f.fontSize;
    if (f.foreignObject_plainHtml) {
        d.setForeignObjectExecute(f.foreignObject_plainHtml, f.foreignObject_width, f.foreignObject_height)
    }
    if (f.child && f.child.length > 0) {
        for (var c = 0; c < f.child.length; c++) {
            this.recoveryNode(null, f.child[c])
        }
    }
    return d
};
var Utf8 = {
    encode: function(b) {
        b = b.replace(/\r\n/g, "\n");
        var a = "";
        for (var f = 0; f < b.length; f++) {
            var d = b.charCodeAt(f);
            if (d < 128) {
                a += String.fromCharCode(d)
            } else {
                if ((d > 127) && (d < 2048)) {
                    a += String.fromCharCode((d >> 6) | 192);
                    a += String.fromCharCode((d & 63) | 128)
                } else {
                    a += String.fromCharCode((d >> 12) | 224);
                    a += String.fromCharCode(((d >> 6) & 63) | 128);
                    a += String.fromCharCode((d & 63) | 128)
                }
            }
        }
        return a
    },
    decode: function(a) {
        var b = "";
        var d = 0;
        var f = c1 = c2 = 0;
        while (d < a.length) {
            f = a.charCodeAt(d);
            if (f < 128) {
                b += String.fromCharCode(f);
                d++
            } else {
                if ((f > 191) && (f < 224)) {
                    c2 = a.charCodeAt(d + 1);
                    b += String.fromCharCode(((f & 31) << 6) | (c2 & 63));
                    d += 2
                } else {
                    c2 = a.charCodeAt(d + 1);
                    c3 = a.charCodeAt(d + 2);
                    b += String.fromCharCode(((f & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    d += 3
                }
            }
        }
        return b
    }
};
jLoadManager = function(a) {
    this.map = a;
    this.loading = false;
    this.imageLoading = new Array()
};
jLoadManager.prototype.type = "jLoadManager";
jLoadManager.prototype.cfg = {
    contextPath: "",
    mapId: -1,
    mapName: ""
};
jLoadManager.prototype.loadMap = function(b, c, d) {
    this.loading = true;
    this.cfg.contextPath = b;
    this.cfg.mapId = c;
    this.cfg.mapName = d;
    var a = "";
    if (this.map.cfg.lazyLoading) {
        a = b + "/map/lazy/" + c + "/" + d;
        this.lazyConfig()
    } else {
        a = b + "/map/" + c + "/" + d
    }
    var f = false;
    if (window.XMLHttpRequest && !(window.ActiveXObject)) {
        try {
            f = new XMLHttpRequest()
        } catch (g) {
            f = false
        }
    } else {
        if (window.ActiveXObject) {
            try {
                f = new ActiveXObject("Msxml2.XMLHTTP")
            } catch (g) {
                try {
                    f = new ActiveXObject("Microsoft.XMLHTTP")
                } catch (g) {
                    f = false
                }
            }
        }
    }
    if (f) {
        f.onreadystatechange = function() {
            if (f.readyState == 4) {
                var h = false;
                if (f.status == 200) {
                    var k = Utf8.encode(f.responseText);
                    if (window.DOMParser) {
                        var l = new DOMParser();
                        h = l.parseFromString(k, "text/xml")
                    } else {
                        h = new ActiveXObject("Microsoft.XMLDOM");
                        h.async = "false";
                        h.loadXML(k)
                    }
                }
                if (h) {
                    jMap.loadManager.parseMM(h)
                }
                jMap.setSaved(true)
            }
        };
        f.open("GET", a, true);
        f.send(null)
    }
};
jLoadManager.prototype.loadMapLocal = function(b) {
    var a = false;
    a = this.loadMM(b);
    if (a) {
        this.parseMM(a)
    }
    jMap.setSaved(true)
};
jLoadManager.prototype.loadMM = function(c) {
    var a = null;
    if (BrowserDetect.browser == "Explorer") {
        a = new ActiveXObject("Microsoft.XMLDOM");
        a.async = "false";
        a.load(c)
    } else {
        var b = new XMLHttpRequest();
        b.open("GET", c, false);
        b.send("");
        a = b.responseXML
    }
    return a
};
jLoadManager.prototype.parseMM = function(xml) {
    var map = xml.childNodes.item(0);
    var childNodes = map.childNodes;
    var layout = "";
    layout = map.getAttribute("mapstyle");
    if (layout == null || layout == "null" || layout == "") {
        layout = this.map.cfg.mapLayout
    }
    var jsCode = "this.map.layoutManager =  new " + layout + "(this.map);";
    eval(jsCode);
    for (var i = 0; i < childNodes.length; i++) {
        if (childNodes.item(i).nodeType == 1) {
            var element = childNodes.item(i);
            var text = element.getAttribute("TEXT");
            var id = element.getAttribute("ID");
            var param = {
                text: text,
                id: id
            };
            jMap.rootNode = jMap.createNodeWithCtrlExecute(param);
            jMap.rootNode.lazycomplete = new Date().valueOf();
            this.initNodeAttrs(jMap.rootNode, element);
            this.initChildNodes(jMap.rootNode, element)
        }
    }
    jMap.initFoldingAll();
    jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
    JinoUtil.waitingDialogClose();
    this.loading = false;
    jMap.loaded && jMap.loaded()
};
jLoadManager.prototype.initChildNodes = function(o, f) {
    if (f.childNodes.length > 0) {
        var g = f.childNodes;
        for (var x = 0; x < g.length; x++) {
            var h = g.item(x);
            if (h.nodeType == 1) {
                if (h.nodeName == "node") {
                    var q = h.getAttribute("TEXT");
                    var s = h.getAttribute("ID");
                    var lc = h.getAttribute("LINE_COLOR");
                    var l = {
                        parent: o,
                        text: q,
                        id: s,
                        line_color :lc 
                    };
                    var d = jMap.createNodeWithCtrlExecute(l);
                    this.initNodeAttrs(d, h);
                    this.initChildNodes(d, h)
                } else {
                    if (h.nodeName == "edge") {
                        this.initEdgeAttrs(o, h)
                    } else {
                        if (h.nodeName == "richcontent") {
                            var q = "";
                            this.parserRichContent(o, h, q)
                        } else {
                            if (h.nodeName == "foreignObject") {
                                var w = "";
                                var t = h.getAttribute("WIDTH");
                                var r = h.getAttribute("HEIGHT");
                                var n = h.childNodes;
                                for (var C = 0; C < n.length; C++) {
                                    w += JinoUtil.xml2Str(n.item(C))
                                }
                                w = w.replace("<![CDATA[", "");
                                w = w.replace("]]>", "");
                                var A = $(w);
                                if (A && A.prop("tagName") == "IFRAME") {
                                    t = A.attr("width");
                                    r = A.attr("height");
                                    var b = A.attr("zoom");
                                    if (!b) {
                                        b = 1
                                    } else {
                                        b = parseInt(b, 10) / 100
                                    }
                                    if ((A.css("margin-left") != "") || (A.css("margin-top") != "")) {
                                        t = parseInt(t, 10) * b + parseInt(A.css("margin-left"), 10);
                                        r = parseInt(r, 10) * b + parseInt(A.css("margin-top"), 10)
                                    }
                                    o.setForeignObjectExecute(w, Math.round(t), Math.round(r));
                                    var p = w.indexOf("src=") + 5;
                                    var m = w.indexOf('"', p);
                                    var k = w.substring(p, m);
                                    o.setHyperlinkExecute(k)
                                } else {
                                    w = w.replace(/&amp;amp;/g, "&amp;");
                                    w = w.replace(/&amp;nbsp;/g, "&nbsp;");
                                    w = w.replace(/&amp;lt;/g, "&lt;");
                                    w = w.replace(/&amp;gt;/g, "&gt;");
                                    w = w.replace(/&amp;quot;/g, "&quot;");
                                    w = w.replace(/&amp;(.)acute;/g, "&$1acute;");
                                    w = w.replace(/&amp;(.)grave;/g, "&$1grave;");
                                    w = w.replace(/&amp;(.)tilde;/g, "&$1tilde;");
                                    o.setForeignObjectExecute(w, t, r)
                                }
                            } else {
                                if (h.nodeName == "arrowlink") {
                                    var c = this.createArrowLink(o, h);
                                    o.addArrowLink(c)
                                } else {
                                    if (h.nodeName == "info") {
                                        var v = h.attributes;
                                        for (var B = 0; B < v.length; B++) {
                                            if (v[B].nodeName) {
                                                o[v[B].nodeName.toLowerCase()] = v[B].nodeValue
                                            }
                                        }
                                    } else {
                                        if (h.nodeName == "attribute") {
                                            if (!o.attributes) {
                                                o.attributes = {}
                                            }
                                            var u = h.getAttribute("NAME");
                                            var z = h.getAttribute("VALUE");
                                            o.attributes[u] = z
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
jLoadManager.prototype.createArrowLink = function(b, a) {
    var c = null;
    switch (jMap.layoutManager.type) {
        case "jMindMapLayout":
            c = new CurveArrowLink();
            break;
        case "jTreeLayout":
            c = new RightAngleArrowLink();
            break;
        default:
            c = new CurveArrowLink()
    }
    c.destination = a.getAttribute("DESTINATION");
    c.color = a.getAttribute("COLOR");
    c.endArrow = a.getAttribute("ENDARROW");
    c.endInclination = a.getAttribute("ENDINCLINATION");
    c.id = a.getAttribute("ID");
    c.startArrow = a.getAttribute("STARTARROW");
    c.startInclination = a.getAttribute("STARTINCLINATION");
    return c
};
jLoadManager.prototype.parserRichContent = function(d, g, l) {
    if (g.childNodes.length > 0) {
        var c = g.childNodes;
        for (var h = 0; h < c.length; h++) {
            var b = c.item(h);
            if (b.nodeType == 1) {
                if (b.nodeName == "img") {
                    var k = (b.getAttribute("width") == "undefined") ? null : b.getAttribute("width");
                    var a = (b.getAttribute("height") == "undefined") ? null : b.getAttribute("height");
                    d.setImageExecute(b.getAttribute("src"), k, a)
                } else {
                    if (b.nodeName == "p") {
                        var f = JinoUtil.trimStr(d.getText());
                        if (b.childNodes.length > 0) {
                            if (f != null && f != "") {
                                f = f + "\n" + JinoUtil.trimStr(b.childNodes.item(0).nodeValue)
                            } else {
                                f = JinoUtil.trimStr(b.childNodes.item(0).nodeValue)
                            }
                        }
                        f = convertXML2Char(f);
                        d.setTextExecute(f)
                    } else {
                        var f = JinoUtil.trimStr(d.getText());
                        if (b.childNodes.length > 0) {
                            if (f != null && f != "") {
                                f = f + "\n" + JinoUtil.trimStr(b.childNodes.item(0).nodeValue)
                            } else {
                                f = JinoUtil.trimStr(b.childNodes.item(0).nodeValue)
                            }
                        }
                        d.setTextExecute(f)
                    }
                }
            }
            this.parserRichContent(d, b, l)
        }
    }
};
jLoadManager.prototype.initEdgeAttrs = function(d, c) {
    var a = c.attributes;
    for (var b = 0; b < a.length; b++) {
        if (a[b].nodeName) {
            if (a[b].nodeName.toLowerCase() == "color") {
                d.setEdgeColorExecute(a[b].nodeValue);
                continue
            }
            if (a[b].nodeName.toLowerCase() == "width") {
                d.setBranchColorExecute(null, a[b].nodeValue);
                continue
            }
            d.edge[a[b].nodeName.toLowerCase()] = a[b].nodeValue
        }
    }
};
jLoadManager.prototype.initNodeAttrs = function(d, c) {
    var a = c.attributes;
    for (var b = 0; b < a.length; b++) {
        if (a[b].nodeName) {
            if (a[b].nodeName.toLowerCase() == "text") {
                continue
            }
            if (a[b].nodeName.toLowerCase() == "id") {
                continue
            }
            if (a[b].nodeName.toLowerCase() == "background_color") {
                d.setBackgroundColorExecute(a[b].nodeValue);
                continue
            }
            if (a[b].nodeName.toLowerCase() == "color") {
                d.setTextColorExecute(a[b].nodeValue);
                continue
            }
            if (a[b].nodeName.toLowerCase() == "link") {
                d.setHyperlinkExecute(a[b].nodeValue);
                continue
            }
            if (a[b].nodeName.toLowerCase() == "folded") {
                d.folded = (a[b].nodeValue == "true") ? true : false;
                continue
            }
            if (a[b].nodeName.toLowerCase() == "line_color") {
                d.setLineColor(a[b].nodeValue);
                continue
            }
            d[a[b].nodeName.toLowerCase()] = a[b].nodeValue
        }
    }
};
jLoadManager.prototype.pasteNode = function(g, n, p, o, h) {
    if (!n) {
        return false
    }
    n = n.replace(/<foreignObject([^>]*)\">/ig, '<foreignObject$1">\n<![CDATA[\n');
    n = n.replace(/<\/foreignObject>/ig, "\n]]>\n</foreignObject>");
    if (window.DOMParser) {
        var b = new DOMParser();
        xmlDoc = b.parseFromString(n, "text/xml")
    } else {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(n)
    }
    var d = xmlDoc.firstChild;
    while (d.nodeType != 1 && (d.tagName != "clipboard" || d.tagName != "paste" || d.tagName != "okm" || d.tagName != "node")) {
        d = d.nextSibling;
        if (d == null) {
            return false
        }
    }
    var r = d.childNodes;
    var k = [];
    for (var m = 0; m < r.length; m++) {
        if (r.item(m).nodeType == 1) {
            var l = r.item(m);
            if (l.nodeName != "node") {
                continue
            }
            if (!h) {
                l.removeAttribute("POSITION")
            }
            var q = l.getAttribute("TEXT");
            var c = l.getAttribute("ID");
            var f = {
                parent: g,
                text: q,
                id: c,
                index: p,
                position: o
            };
            var a = jMap.createNodeWithCtrlExecute(f);
            this.initNodeAttrs(a, l);
            this.initChildNodes(a, l);
            if (g.folded || g.hided) {
                g.hideChildren(g)
            }
            k.push(a)
        }
    }
    return k
};
jLoadManager.prototype.updateImageLoading = function(a) {
    if (this.imageLoading.contains(a)) {
        this.imageLoading.remove(a)
    } else {
        this.imageLoading.push(a)
    }
    if (this.imageLoading.length == 0) {
        jMap.fireActionListener(ACTIONS.ACTION_NODE_IMAGELOADED)
    }
};
jLoadManager.prototype.lazyLoading = function(a) {
    if (a.lazycomplete) {
        return
    }
    $.ajax({
        type: "post",
        async: false,
        url: jMap.cfg.contextPath + "/mindmap/childnodes.do",
        data: {
            map: this.cfg.mapId,
            node: a.getID()
        },
        beforeSend: function() {},
        success: function(f, g, d) {
            var b = jMap.loadManager.pasteNode(a, d.responseText, null, null, true);
            a.lazycomplete = new Date().valueOf();
            a.numofchildren = b.length;
            if (b.length > 0) {
                for (var c = 0; c < b.length; c++) {
                    if (b[c].numofchildren > 0) {
                        b[c].folderShape && b[c].folderShape.show();
                        b[c].folded = true
                    } else {
                        b[c].lazycomplete = new Date().valueOf()
                    }
                }
            }
        },
        error: function(d, b, c) {
            alert("editAction : " + b)
        },
        complete: function() {}
    })
};
jLoadManager.prototype.lazyConfig = function() {
    this.lazyListeners = [];
    this.lazyListeners.push(jMap.addActionListener(ACTIONS.ACTION_NODE_FOLDING, function() {
        var a = arguments[0];
        jMap.loadManager.lazyLoading(a);
        jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(a);
        jMap.layoutManager.layout(true)
    }));
    this.lazyListeners.push(jMap.addActionListener(ACTIONS.ACTION_NODE_MOVED, function() {
        var a = arguments[0];
        var b = arguments[1]
    }));
    this.lazyListeners.push(jMap.addActionListener(ACTIONS.ACTION_NEW_NODE, function() {
        var a = arguments[0];
        a.lazycomplete = new Date().valueOf()
    }));
    this.lazyListeners.push(jMap.addActionListener("DWR_InsertNode", function() {
        var a = arguments[0];
        a.lazycomplete = new Date().valueOf()
    }))
};
jLoadManager.prototype.removelazyListener = function() {
    var a = null;
    while (a = this.lazyListeners.pop()) {
        jMap.removeActionListener(a)
    }
    this.lazyListeners = []
};
var removeGradient = function(a) {
    bodyAttr = a.body.attr();
    delete bodyAttr.gradient;
    a.body.attr({
        fill: a.background_color,
        stroke: a.edge.color
    })
};
jNodeController = function() {};
jNodeController.prototype.type = "jNodeController";
jNodeController.prototype.contextmenu = function(a) {
    this.node.focus(true);
    $(jMap.work).trigger("jinocontextmenu", [a]);
    jMap.mouseRightClicked = false;
    return false
};
jNodeController.prototype.mousedown = function(d) {
    var b;
    var a;
    if (!d) {
        var d = window.event
    }
    a = d.originalEvent.originalEvent || d.originalEvent || d;
    if (a.target) {
        b = a.target
    } else {
        if (a.srcElement) {
            b = a.srcElement
        }
    }
    if (b.nodeType == 3) {
        b = b.parentNode
    }
    if (a.preventDefault) {
        a.preventDefault()
    } else {
        a.returnValue = false
    }
    var g = jMap.getSelecteds();
    if (d.button == 2) {
        jMap.mouseRightClicked = true;
        jMap.mouseRightSelectedNode = this.node;
        return
    }
    if (d.shiftKey || d.ctrlKey) {
        if (g.contains(this.node)) {
            this.node.blur()
        } else {
            this.node.focus(false)
        }
    } else {
        if (!g.contains(this.node)) {
            this.node.focus(true)
        }
    }
    var c = document.documentElement.scrollTop || document.body.scrollTop;
    var f = document.documentElement.scrollLeft || document.body.scrollLeft;
    this._drag = {};
    this._drag.x = d.clientX + f;
    this._drag.y = d.clientY + c;
    this._drag.id = d.identifier;
    jMap.dragEl = this
};
jNodeController.prototype.mouseup = function(z) {
    var l;
    var C;
    if (!z) {
        var z = window.event
    }
    C = z.originalEvent.originalEvent || z.originalEvent || z;
    if (C.target) {
        l = C.target
    } else {
        if (C.srcElement) {
            l = C.srcElement
        }
    }
    if (l.nodeType == 3) {
        l = l.parentNode
    }
    if (C.preventDefault) {
        C.preventDefault()
    } else {
        C.returnValue = false
    }
    if (jMap.mouseRightClicked) {
        var m = jMap.mouseRightSelectedNode;
        jMap.mouseRightClicked = false;
        return;
        if (m == this.node) {}
    }
    if (jMap.movingNode && !jMap.movingNode.removed) {
        var p = jMap.positionChangeNodes;
        var d = this.node;
        if (p && !p.contains(d)) {
            jMap.movingNode.connection && jMap.movingNode.connection.line.remove();
            jMap.movingNode.remove();
            delete jMap.movingNode;
            for (var v = 0; v < p.length; v++) {
                if (p[v].hadChildren(d)) {
                    removeGradient(d);
                    jMap.positionChangeNodes = false;
                    return
                }
            }
            var b = l.getBoundingClientRect();
            z.offsetX = z.clientX - b.left;
            var A = (z.offsetX) ? z.offsetX : z.layerX - this.node.getLocation().x;
            var r = this.node.body.getBBox().width / 2;
            var q = (A < r);
            var n = d;
            var s = function() {
                d.folded && d.setFolding(false);
                var x = null;
                if (d.isRootNode()) {
                    x = q ? "left" : "right"
                }
                n = d;
                jMap.changePosition(d, p, x)
            };
            var o = function() {
                var x = null;
                if (d.getParent().isRootNode()) {
                    x = d.position
                }
                var D = d.nextSibling();
                n = d.getParent();
                jMap.changePosition(d.getParent(), p, x, d)
            };
            if (p) {
                if (d.isRootNode()) {
                    s()
                } else {
                    switch (jMap.layoutManager.type) {
                        case "jMindMapLayout":
                            if (this.node.isLeft()) {
                                q ? s() : o()
                            } else {
                                q ? o() : s()
                            }
                            break;
                        case "jTreeLayout":
                            q ? o() : s();
                            break;
                        case "jFishboneLayout":
                            if (this.node.isLeft()) {
                                q ? s() : o()
                            } else {
                                q ? o() : s()
                            }
                            break;
                        default:
                    }
                }
            }
            removeGradient(d);
            jMap.initFolding(n);
            jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
            jMap.layoutManager.layout(true);
            d.focus(true)
        }
        jMap.positionChangeNodes = false
    }
    if (jMap.movingNode && !jMap.movingNode.removed) {
        var g = z.clientX;
        var f = z.clientY;
        var t = document.documentElement.scrollTop || document.body.scrollTop;
        var u = document.documentElement.scrollLeft || document.body.scrollLeft;
        g += u;
        f += t;
        var k = g - jMap.dragEl._drag.x;
        var h = f - jMap.dragEl._drag.y;
        jMap.movingNode.connection && jMap.movingNode.connection.line.remove();
        jMap.movingNode.remove();
        delete jMap.movingNode;
        jMap.dragEl._drag = null;
        delete jMap.dragEl._drag;
        var c = k / jMap.cfg.scale;
        var a = h / jMap.cfg.scale;
        var B = (c > 0) ? c : -c;
        var w = (a > 0) ? a : -a;
        if (B > NODE_MOVING_IGNORE || w > NODE_MOVING_IGNORE) {
            jMap.dragEl.node.relativeCoordinate(c, a)
        }
        jMap.dragEl = null;
        delete jMap.dragEl
    } else {
        if (jMap.dragEl) {
            jMap.dragEl._drag = null;
            delete jMap.dragEl._drag
        }
        jMap.dragEl = null;
        delete jMap.dragEl
    }
};
jNodeController.prototype.mousemove = function(f) {
    var b;
    var a;
    if (!f) {
        var f = window.event
    }
    a = f.originalEvent.originalEvent || f.originalEvent || f;
    if (a.target) {
        b = a.target
    } else {
        if (a.srcElement) {
            b = a.srcElement
        }
    }
    if (b.nodeType == 3) {
        b = b.parentNode
    }
    if (a.preventDefault) {
        a.preventDefault()
    } else {
        a.returnValue = false
    }
    var c = b.getBoundingClientRect();
    f.offsetX = f.clientX - c.left;
    f.offsetY = f.clientY - c.top;
    if (!jMap.positionChangeNodes && this.node.isFoldingHit(f) && !this.node.isRootNode() && !this.node.getChildren().isEmpty()) {
        var d = "";
        if (this.node.isLeft()) {
            d = " 10 7"
        } else {
            d = " 0 7"
        }
        document.body.style.cursor = "url('" + jMap.cfg.contextPath + "/images/folding_blue.png')" + d + ",default"
    } else {
        document.body.style.cursor = "auto"
    }
};
jNodeController.prototype.mouseover = function(k) {
    var d;
    var b;
    if (!k) {
        var k = window.event
    }
    b = k.originalEvent.originalEvent || k.originalEvent || k;
    if (b.target) {
        d = b.target
    } else {
        if (b.srcElement) {
            d = b.srcElement
        }
    }
    if (d.nodeType == 3) {
        d = d.parentNode
    }
    if (b.preventDefault) {
        b.preventDefault()
    } else {
        b.returnValue = false
    }
    if (jMap.positionChangeNodes && !jMap.getSelecteds().contains(this.node)) {
        if (jMap.movingNode && !jMap.movingNode.removed) {
            jMap.movingNode.hide();
            jMap.movingNode.connection && jMap.movingNode.connection.line.hide()
        }
        var h = d.getBoundingClientRect();
        k.offsetX = k.clientX - h.left;
        var a = (k.offsetX) ? k.offsetX : k.layerX - this.node.getLocation().x;
        var c = this.node.body.getBBox().width / 2;
        if (jMap.positionChangeNodes) {
            var g = 0;
            var f = 0;
            switch (jMap.layoutManager.type) {
                case "jMindMapLayout":
                    if (this.node.isRootNode()) {
                        g = 0;
                        f = 180
                    } else {
                        g = (this.node.isLeft()) ? 0 : 270;
                        f = (this.node.isLeft()) ? 270 : 180
                    }
                    break;
                case "jTreeLayout":
                    if (this.node.isRootNode()) {
                        g = 180;
                        f = 180
                    } else {
                        g = 0;
                        f = 90
                    }
                    break;
                case "jFishboneLayout":
                    if (this.node.isRootNode()) {
                        g = 0;
                        f = 180
                    } else {
                        g = (this.node.isLeft()) ? 0 : 270;
                        f = (this.node.isLeft()) ? 270 : 180
                    }
                    break;
                default:
            }
            if (a < c) {
                this.node.body.attr({
                    gradient: g + "-" + jMap.cfg.nodeDropFocusColor + "-#ffffff",
                    stroke: jMap.cfg.nodeDropFocusColor
                })
            } else {
                this.node.body.attr({
                    gradient: f + "-" + jMap.cfg.nodeDropFocusColor + "-#ffffff",
                    stroke: jMap.cfg.nodeDropFocusColor
                })
            }
        }
    }
    if (jMap.mouseRightClicked) {}
};
jNodeController.prototype.mouseout = function(c) {
    var b;
    var a;
    if (!c) {
        var c = window.event
    }
    a = c.originalEvent.originalEvent || c.originalEvent || c;
    if (a.target) {
        b = a.target
    } else {
        if (a.srcElement) {
            b = a.srcElement
        }
    }
    if (b.nodeType == 3) {
        b = b.parentNode
    }
    if (a.preventDefault) {
        a.preventDefault()
    } else {
        a.returnValue = false
    }
    document.body.style.cursor = "auto";
    if (jMap.movingNode && !jMap.movingNode.removed) {
        jMap.movingNode.show();
        jMap.movingNode.connection && jMap.movingNode.connection.line.show()
    }
    if (jMap.positionChangeNodes && !jMap.getSelecteds().contains(this.node)) {
        removeGradient(this.node)
    }
    if (jMap.mouseRightClicked) {
        if (jMap.mouseRightSelectedNode == this.node) {
            return
        }
        this.node.blur()
    }
};
jNodeController.prototype.taphold = function(a) {
    if (ISMOBILE && supportsTouch && this.node.hyperlink) {
        window.open(this.node.hyperlink.attr().href)
    }
};
jNodeController.prototype.click = function(d) {
    var b;
    var a;
    if (!d) {
        var d = window.event
    }
    a = d.originalEvent.originalEvent || d.originalEvent || d;
    if (a.target) {
        b = a.target
    } else {
        if (a.srcElement) {
            b = a.srcElement
        }
    }
    if (b.nodeType == 3) {
        b = b.parentNode
    }
    var c = b.getBoundingClientRect();
    d.offsetX = d.clientX - c.left;
    d.offsetY = d.clientY - c.top;
    if (this.node.isFoldingHit(d) && b.nodeName != "image") {
        jMap.controller.foldingAction(this.node)
    }
};
jNodeController.prototype.dblclick = function(c) {
    var b;
    var a;
    if (!c) {
        var c = window.event
    }
    a = c.originalEvent.originalEvent || c.originalEvent || c;
    if (a.target) {
        b = a.target
    } else {
        if (a.srcElement) {
            b = a.srcElement
        }
    }
    if (b.nodeType == 3) {
        b = b.parentNode
    }
    if (a.preventDefault) {
        a.preventDefault()
    } else {
        a.returnValue = false
    }
    jMap.controller.startNodeEdit(this.node)
};
jNodeController.prototype.dragstart = function(c) {
    var b;
    var a;
    if (!c) {
        var c = window.event
    }
    a = c.originalEvent.originalEvent || c.originalEvent || c;
    if (a.target) {
        b = a.target
    } else {
        if (a.srcElement) {
            b = a.srcElement
        }
    }
    if (b.nodeType == 3) {
        b = b.parentNode
    }
    if (a.preventDefault) {
        a.preventDefault()
    } else {
        a.returnValue = false
    }
};
jNodeController.prototype.dragenter = function(c) {
    var b;
    var a;
    if (!c) {
        var c = window.event
    }
    a = c.originalEvent.originalEvent || c.originalEvent || c;
    if (a.target) {
        b = a.target
    } else {
        if (a.srcElement) {
            b = a.srcElement
        }
    }
    if (b.nodeType == 3) {
        b = b.parentNode
    }
    if (a.preventDefault) {
        a.preventDefault()
    } else {
        a.returnValue = false
    }
    this.node.focus(true)
};
jNodeController.prototype.dragexit = function(c) {
    var b;
    var a;
    if (!c) {
        var c = window.event
    }
    a = c.originalEvent.originalEvent || c.originalEvent || c;
    if (a.target) {
        b = a.target
    } else {
        if (a.srcElement) {
            b = a.srcElement
        }
    }
    if (b.nodeType == 3) {
        b = b.parentNode
    }
    if (a.preventDefault) {
        a.preventDefault()
    } else {
        a.returnValue = false
    }
    this.node.blur()
};
jNodeController.prototype.drop = function(g) {
    var f;
    var a;
    if (!g) {
        var g = window.event
    }
    a = g.originalEvent.originalEvent || g.originalEvent || g;
    if (a.target) {
        f = a.target
    } else {
        if (a.srcElement) {
            f = a.srcElement
        }
    }
    if (f.nodeType == 3) {
        f = f.parentNode
    }
    if (a.preventDefault) {
        a.preventDefault()
    } else {
        a.returnValue = false
    }
    var k = g.originalEvent.dataTransfer.getData("TEXT") || g.originalEvent.dataTransfer.getData("text/plain");
    var b = g.originalEvent.dataTransfer.getData("URL");
    var d = false;
    if (k.substr(0, 7) == "http://") {
        b = b || k;
        if (b) {
            this.node.setFoldingExecute(false);
            var h = {
                parent: this.node,
                text: b
            };
            var c = jMap.createNodeWithCtrl(h, null, false);
            c.setHyperlink(b);
            d = true
        }
    } else {
        jMap.createNodeFromText(this.node, k);
        d = true
    }
    if (d) {
        jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(this.node);
        jMap.layoutManager.layout(true)
    }
};
jNodeControllerGuest = function() {};
jNodeControllerGuest.prototype.type = "jNodeControllerGuest";
jNodeControllerGuest.prototype.mousedown = function(a) {
    var b = jMap.getSelecteds();
    if (a.ctrlKey) {
        this.node.focus(false)
    } else {
        if (!b.contains(this.node)) {
            this.node.focus(true)
        }
    }
};
jNodeControllerGuest.prototype.mouseup = function(a) {
    a = a || window.event
};
jNodeControllerGuest.prototype.mousemove = function(f) {
    var b;
    var a;
    if (!f) {
        var f = window.event
    }
    a = f.originalEvent.originalEvent || f.originalEvent || f;
    if (a.target) {
        b = a.target
    } else {
        if (a.srcElement) {
            b = a.srcElement
        }
    }
    if (b.nodeType == 3) {
        b = b.parentNode
    }
    if (a.preventDefault) {
        a.preventDefault()
    } else {
        a.returnValue = false
    }
    var c = b.getBoundingClientRect();
    f.offsetX = f.clientX - c.left;
    f.offsetY = f.clientY - c.top;
    if (!jMap.positionChangeNodes && this.node.isFoldingHit(f) && !this.node.isRootNode() && !this.node.getChildren().isEmpty()) {
        var d = "";
        if (this.node.isLeft()) {
            d = " 10 7"
        } else {
            d = " 0 7"
        }
        document.body.style.cursor = "url('" + jMap.cfg.contextPath + "/images/folding_blue.png')" + d + ",default"
    } else {
        document.body.style.cursor = "auto"
    }
};
jNodeControllerGuest.prototype.mouseover = function(a) {
    a = a || window.event
};
jNodeControllerGuest.prototype.mouseout = function(a) {
    document.body.style.cursor = "auto"
};
jNodeControllerGuest.prototype.taphold = function(a) {
    if (ISMOBILE && supportsTouch && this.node.hyperlink) {
        window.open(this.node.hyperlink.attr().href)
    }
};
jNodeControllerGuest.prototype.click = function(d) {
    var b;
    var a;
    if (!d) {
        var d = window.event
    }
    a = d.originalEvent.originalEvent || d.originalEvent || d;
    if (a.target) {
        b = a.target
    } else {
        if (a.srcElement) {
            b = a.srcElement
        }
    }
    if (b.nodeType == 3) {
        b = b.parentNode
    }
    var c = b.getBoundingClientRect();
    d.offsetX = d.clientX - c.left;
    d.offsetY = d.clientY - c.top;
    if (this.node.isFoldingHit(d)) {
        this.node.setFoldingExecute(!this.node.folded);
        jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendants(this.node);
        jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(this.node);
        jMap.layoutManager.layout(true)
    }
};
jNodeControllerGuest.prototype.dblclick = function(a) {};
jNodeControllerGuest.prototype.dragstart = function(a) {
    a = a || window.event;
    if (a.preventDefault) {
        a.preventDefault()
    } else {
        a.returnValue = false
    }
};
jNodeControllerGuest.prototype.dragenter = function(a) {
    a = a || window.event;
    if (a.preventDefault) {
        a.preventDefault()
    } else {
        a.returnValue = false
    }
};
jNodeControllerGuest.prototype.dragexit = function(a) {
    a = a || window.event;
    if (a.preventDefault) {
        a.preventDefault()
    } else {
        a.returnValue = false
    }
};
jNodeControllerGuest.prototype.drop = function(a) {
    a = a || window.event;
    if (a.preventDefault) {
        a.preventDefault()
    } else {
        a.returnValue = false
    }
};
jNodeControllerGuest.prototype.dragger = function() {};
jNodeControllerGuest.prototype.move = function(c, b, a, d) {};
jNodeControllerGuest.prototype.up = function(c, b, a, d) {};
jSaveAction = function(a) {
    this.map = a
};
jSaveAction.prototype.type = "jSaveAction";
jSaveAction.prototype.cfg = {
    async: true,
    type: "post"
};
jSaveAction.prototype.newAction = function(g, d) {
    if (this.map.cfg.realtimeSave) {
        var c = g.toXML();
        var a = ' mapid="' + mapId + '"';
        var k = "";
        if (g.getParent()) {
            k = ' parent="' + g.getParent().getID() + '"'
        }
        var b = "";
        if (g.nextSibling()) {
            b = ' next="' + g.nextSibling().getID() + '"'
        }
        var h = "<new" + a + k + b + ">" + c + "</new>";
        if (d == null || d == undefined) {
            d = this.cfg.async
        }
        var f = this;
        $.ajax({
            type: this.cfg.type,
            async: d,
            url: this.map.cfg.contextPath + "/mindmap/save.do",
            data: {
                action: h
            },
            beforeSend: function() {},
            success: function(o, p, n) {
                if (n.responseText == -1) {
                    if (J_NODE_CREATING) {
                        var m = null;
                        var l = null;
                        while (m = f.map.getSelecteds().pop()) {
                            l = m.getParent();
                            m.remove()
                        }
                        J_NODE_CREATING.focus(true);
                        f.map.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(l);
                        f.map.layoutManager.layout(true)
                    }
                    f.map.controller.stopNodeEdit(false)
                }
            },
            error: function(n, l, m) {
                alert("newAction : " + l)
            },
            complete: function() {}
        })
    }
};
jSaveAction.prototype.editAction = function(d, c) {
    if (this.map.cfg.realtimeSave) {
        if (d.removed) {
            return
        }
        var b = d.toXML(true);
        var a = ' mapid="' + mapId + '"';
        var f = "<edit" + a + ">" + b + "</edit>";
        if (c == null || c == undefined) {
            c = this.cfg.async
        }
        $.ajax({
            type: this.cfg.type,
            async: c,
            url: this.map.cfg.contextPath + "/mindmap/save.do",
            data: {
                action: f
            },
            error: function(k, g, h) {
                alert("editAction : " + g)
            }
        })
    }
};
jSaveAction.prototype.deleteAction = function(d, c) {
    if (this.map.cfg.realtimeSave) {
        if (d.removed) {
            return
        }
        var b = d.toXML();
        var a = ' mapid="' + mapId + '"';
        var f = "<delete" + a + ">" + b + "</delete>";
        if (c == null || c == undefined) {
            c = this.cfg.async
        }
        $.ajax({
            type: this.cfg.type,
            async: c,
            url: this.map.cfg.contextPath + "/mindmap/save.do",
            data: {
                action: f
            },
            error: function(k, g, h) {
                alert("deleteAction : " + g)
            }
        })
    }
};
jSaveAction.prototype.moveAction = function(a, k, f, b) {
    if (this.map.cfg.realtimeSave) {
        var g = a.toXML(true);
        var h = ' mapid="' + mapId + '"';
        var d = ' parent="' + k.getID() + '"';
        var l = (f) ? ' next="' + f.getID() + '"' : "";
        var c = "<move" + h + d + l + ">" + g + "</move>";
        if (b == null || b == undefined) {
            b = this.cfg.async
        }
        $.ajax({
            type: this.cfg.type,
            async: b,
            url: this.map.cfg.contextPath + "/mindmap/save.do",
            data: {
                action: c
            },
            error: function(o, m, n) {
                alert("moveAction : " + m)
            }
        })
    }
};
jSaveAction.prototype.pasteAction = function(f, d) {
    if (this.map.cfg.realtimeSave) {
        var c = f.toXML();
        var a = ' mapid="' + mapId + '"';
        var h = "";
        if (f.getParent()) {
            h = ' parent="' + f.getParent().getID() + '"'
        }
        var b = "";
        var g = "<new" + a + h + b + ">" + c + "</new>";
        if (d == null || d == undefined) {
            d = this.cfg.async
        }
        $.ajax({
            type: this.cfg.type,
            async: d,
            url: this.map.cfg.contextPath + "/mindmap/save.do",
            data: {
                action: g
            },
            error: function(m, k, l) {
                alert("pasteAction : " + k)
            }
        })
    }
};
jSaveAction.prototype.isAlive = function() {
    return true;
    var a = false;
    if (this.map.cfg.realtimeSave) {
        $.ajax({
            type: this.cfg.type,
            async: false,
            url: this.map.cfg.contextPath + "/ping",
            success: function(b) {
                a = true
            },
            error: function(d, b, c) {
                a = false
            }
        })
    }
    return a
};
jBrainLayout = function(b) {
    this.map = b;
    this.HGAP = 30;
    this.VGAP = 10;
    this.xSize = 0;
    this.ySize = 0;
    var a = this.map.work;
    a.scrollLeft = Math.round((a.scrollWidth - a.offsetWidth) / 2);
    a.scrollTop = Math.round((a.scrollHeight - a.offsetHeight) / 2);
    this.map.cfg.nodeFontSizes = ["10", "10", "10"];
    this.map.cfg.nodeStyle = "jBrainNode"
};
jBrainLayout.prototype.type = "jBrainLayout";
jBrainLayout.prototype.layoutNode = function(d) {
    var a = 0;
    var f = 0;
    if (d.getDepth() == 0) {
        this.placeNode(d, a, f)
    } else {
        if (d.getDepth() == 1) {
            if (d.getIndexPos() == 0) {
                this.placeNode(d, a + 39, f - 43.5)
            } else {
                if (d.getIndexPos() == 1) {
                    this.placeNode(d, a + 135, f + 57.5)
                } else {
                    if (d.getIndexPos() == 2) {
                        this.placeNode(d, a + 193.5, f - 66)
                    } else {
                        if (d.getIndexPos() == 3) {
                            this.placeNode(d, a + 90, f - 163.5)
                        } else {
                            if (d.getIndexPos() == 4) {
                                this.placeNode(d, a - 75, f - 75 - 62.5)
                            } else {
                                if (d.getIndexPos() == 5) {
                                    this.placeNode(d, a + 195, f - 145)
                                } else {
                                    if (d.getIndexPos() == 6) {
                                        this.placeNode(d, a - 20, f - 210)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else {
            if (d.getDepth() == 2) {} else {
                this.placeNode(d, a, f)
            }
        }
    }
    var c = d.getChildren();
    if (c != null && c.length > 0) {
        for (var b = 0; b < c.length; b++) {
            this.layoutNode(c[b])
        }
    }
};
jBrainLayout.prototype.layout = function(f) {
    var d = this.map.selectedNodes.getLastElement();
    f = f && (d != null && d != undefined && !d.removed && d.getLocation().x != null && d.getLocation().x != undefined && d.getLocation().x != 0 && d.getLocation().y != 0);
    var c = this.getRoot();
    var b = c.getLocation().x;
    var a = c.getLocation().y;
    if (f) {
        a = d.getLocation().y
    }
    this.resizeMap(c.treeWidth, c.treeHeight);
    this.layoutNode(this.getRoot())
};
jBrainLayout.prototype.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors = function(a) {
    this.layout(false)
};
jBrainLayout.prototype.updateTreeHeightsAndRelativeYOfAncestors = function(a) {
    this.layout(false)
};
jBrainLayout.prototype.updateTreeHeightsAndRelativeYOfWholeMap = function() {
    this.layout(false)
};
jBrainLayout.prototype.updateTreeHeightsAndRelativeYOfDescendants = function(a) {
    this.layout(false)
};
jBrainLayout.prototype.updateRelativeYOfChildren = function(g, c) {
    if (c == null || c.length == 0) {
        return
    }
    var m = g.vgap;
    var b = c[0];
    var a = 0;
    var f = 0;
    for (var h = 0; h < c.length; h++) {
        b = c[h];
        var d = this.getShiftUp(b);
        var k = this.getShiftDown(b);
        var l = b.getUpperChildShift();
        b.relYPos = parseInt(a) + parseInt(l) + parseInt(k);
        f += parseInt(l) + parseInt(d);
        a += parseInt(b.getTreeHeight()) + parseInt(d) + parseInt(k) + parseInt(m) + this.VGAP
    }
    f += parseInt(this.calcStandardTreeShift(g, c));
    for (var h = 0; h < c.length; h++) {
        b = c[h];
        b.relYPos -= f
    }
};
jBrainLayout.prototype.getShiftUp = function(b) {
    var a = b.getShift();
    if (a < 0) {
        return -a
    } else {
        return 0
    }
};
jBrainLayout.prototype.getShiftDown = function(b) {
    var a = b.getShift();
    if (a > 0) {
        return a
    } else {
        return 0
    }
};
jBrainLayout.prototype.updateTreeGeometry = function(c) {
    if (c == null || c == undefined || c.removed) {
        return false
    }
    if (c.isRootNode()) {
        var d = this.getRoot().getLeftChildren();
        var k = this.getRoot().getRightChildren();
        var f = this.calcTreeWidth(c, d);
        var l = this.calcTreeWidth(c, k);
        this.getRoot().setRootTreeWidths(f, l);
        this.updateRelativeYOfChildren(c, d);
        this.updateRelativeYOfChildren(c, k);
        var n = this.calcUpperChildShift(c, d);
        var p = this.calcUpperChildShift(c, k);
        this.getRoot().setRootUpperChildShift(n, p);
        var o = this.calcTreeHeight(c, n, d);
        var b = this.calcTreeHeight(c, p, k);
        this.getRoot().setRootTreeHeights(o, b)
    } else {
        var a = c.getUnChildren();
        var g = this.calcTreeWidth(c, a);
        c.setTreeWidth(g);
        this.updateRelativeYOfChildren(c, a);
        var h = this.calcUpperChildShift(c, a);
        c.setUpperChildShift(h);
        var m = this.calcTreeHeight(c, h, a);
        c.setTreeHeight(m)
    }
};
jBrainLayout.prototype.calcTreeWidth = function(f, d) {
    var g = 0;
    if (d != null && d.length > 0) {
        for (var c = 0; c < d.length; c++) {
            var b = d[c];
            if (b != null) {
                var a = parseInt(b.getTreeWidth()) + parseInt(b.hgap) + this.HGAP;
                if (a > g) {
                    g = a
                }
            }
        }
    }
    return f.getSize().width + g
};
jBrainLayout.prototype.calcTreeHeight = function(l, g, c) {
    var h = l.getSize().height;
    try {
        var k = c[0];
        var b = c[c.length - 1];
        var d = Math.min(k.relYPos - k.getUpperChildShift(), 0);
        var a = Math.max(b.relYPos - b.getUpperChildShift() + b.getTreeHeight(), h);
        return a - d
    } catch (f) {
        return h
    }
};
jBrainLayout.prototype.calcUpperChildShift = function(c, a) {
    try {
        var f = a[0];
        var d = -f.relYPos + parseInt(f.getUpperChildShift());
        if (d > 0) {
            return d
        } else {
            return 0
        }
    } catch (b) {
        return 0
    }
};
jBrainLayout.prototype.calcStandardTreeShift = function(f, d) {
    var c = f.getSize().height;
    if (d.length == 0) {
        return 0
    }
    var a = 0;
    var h = f.vgap;
    for (var b = 0; b < d.length; b++) {
        var g = d[b];
        if (g != null) {
            a += parseInt(g.getSize().height) + parseInt(h)
        }
    }
    return Math.max(parseInt(a) - parseInt(h) - parseInt(c), 0) / 2
};
jBrainLayout.prototype.placeNode = function(d, c, b) {
    if (d.isRootNode()) {
        d.setLocation(this.getRootX(), this.getRootY())
    } else {
        var a = parseFloat(d.parent.getLocation().x) + parseFloat(c);
        var f = parseFloat(d.parent.getLocation().y) + parseFloat(b);
        d.setLocation(a, f)
    }
};
jBrainLayout.prototype.resizeMap = function(d, a) {
    var f = false;
    var c = RAPHAEL.getSize().width;
    var k = RAPHAEL.getSize().height;
    var g = 0;
    var b = 0;
    var h = this.getRoot().getLocation();
    if (c < d * 2) {
        g = d * 2;
        b = k;
        f = true
    }
    if (k < a * 2) {
        g = c;
        b = a * 2;
        f = true;
        this.placeNode(this.getRoot())
    }
    if (f) {
        RAPHAEL.setSize(g, b);
        this.placeNode(this.getRoot(), this.getRootX(), this.getRootY());
        this.map.work.scrollLeft += (g - c) / 2;
        this.map.work.scrollTop += (b - k) / 2
    }
};
jBrainLayout.prototype.getRootY = function() {
    var a = RAPHAEL.getSize();
    return Math.round(parseInt(a.height) * 0.5) - parseInt(this.getRoot().body.getBBox().height) / 2
};
jBrainLayout.prototype.getRootX = function() {
    var a = RAPHAEL.getSize();
    return Math.round(parseInt(a.width) * 0.5) - parseInt(this.getRoot().body.getBBox().width) / 2
};
jBrainLayout.prototype.getRoot = function() {
    return this.map.rootNode
};
jFishboneLayout = function(b) {
    this.map = b;
    this.HGAP = 10;
    this.VGAP = 10;
    this.xSize = 0;
    this.ySize = 0;
    this.angle = 90;
    var a = this.map.work;
    a.scrollLeft = Math.round((a.scrollWidth - a.offsetWidth) / 2);
    a.scrollTop = Math.round((a.scrollHeight - a.offsetHeight) / 2);
    this.map.cfg.nodeFontSizes = ["16", "14", "12"];
    this.map.cfg.nodeStyle = "jFishNode"
};
jFishboneLayout.prototype.type = "jFishboneLayout";
jFishboneLayout.prototype.layoutNode = function(d) {
    var t = 0;
    if (d.isRootNode()) {
        t = 0
    } else {
        var s = Math.tan(Math.PI * (90 - this.angle) / 180);
        if (d.isVertical()) {
            var k = d.getIndexPos();
            var a = d.getParent().getUnChildren();
            if (d.getDepth() == 1) {
                t = this.getRoot().body.getBBox().width + parseInt(this.HGAP) + d.getSize().width + 30;
                for (var o = k % 2; o < k; o += 2) {
                    t += parseFloat(a[o].getTreeWidth()) + parseInt(this.HGAP)
                }
                var g = d.prevSibling();
                if (g != null) {
                    var b = g.getParent();
                    var q = g.getLocation().x - (b.getLocation().x + this.HGAP);
                    if (t - q < 30) {
                        t = q + 30
                    }
                }
                if (!d.isTopSide()) {
                    t += d.body.getBBox().width * Math.sin(Math.PI * (90 - this.angle) / 180)
                }
            } else {
                var k = d.getIndexPos();
                var u = d.getParent();
                var a = u.getUnChildren();
                if (d.isTopSide()) {
                    t = u.getSize().width + d.getSize().width + this.HGAP;
                    for (var o = 0; o < k; o++) {
                        t += parseFloat(a[o].getTreeWidth()) + parseInt(this.HGAP)
                    }
                } else {
                    t = d.getSize().width + this.HGAP;
                    t += d.body.getBBox().width * Math.sin(Math.PI * (90 - this.angle) / 180);
                    for (var o = 0; o < k; o++) {
                        t += parseFloat(a[o].getTreeWidth()) + parseInt(this.HGAP)
                    }
                }
            }
        } else {
            t = parseInt(this.HGAP);
            var k = d.getIndexPos();
            var u = d.getParent();
            var a = u.getUnChildren();
            if (d.isTopSide()) {
                var p = -a[0].body.getBBox().height + this.VGAP;
                for (var o = 0; o <= k; o++) {
                    p += a[o].getTreeHeight() + this.VGAP
                }
                t += (u.getTreeHeight() - p) * s + 5
            } else {
                t += (d.relYPos) * s
            }
        }
    }
    this.placeNode(d, t, d.relYPos);
    d.connectArrowLink();
    var r = jMap.getArrowLinks(d);
    for (var o = 0; o < r.length; o++) {
        r[o].draw()
    }
    var n = d.getDepth();
    if (!d.isRootNode() && n % 2 == 1) {
        var c = (d.isTopSide()) ? d.getInputPort() : d.getOutputPort();
        var m = c.x;
        var f = c.y;
        if (n == 1) {
            if (d.getIndexPos() % 2 == 0) {
                this.rotate(d, -this.angle, m, f)
            } else {
                this.rotate(d, 180 + this.angle, m, f)
            }
        } else {
            this.rotate(d, this.getParentAngle(d), m, f)
        }
    }
    if (d.folded == "false" || d.folded == false) {
        var a = d.getChildren();
        if (a != null && a.length > 0) {
            for (var o = 0; o < a.length; o++) {
                this.layoutNode(a[o])
            }
        }
    }
};
jFishboneLayout.prototype.layout = function(f) {
    var d = this.map.selectedNodes.getLastElement();
    f = f && (d != null && d != undefined && !d.removed && d.getLocation().x != null && d.getLocation().x != undefined && d.getLocation().x != 0 && d.getLocation().y != 0);
    var c = this.getRoot();
    var b = c.getLocation().x;
    var a = c.getLocation().y;
    if (f) {
        a = d.getLocation().y
    }
    this.resizeMap(c.treeWidth, c.treeHeight);
    this.layoutNode(this.getRoot())
};
jFishboneLayout.prototype.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors = function(a) {
    this.updateTreeHeightsAndRelativeYOfDescendants(a);
    if (!a.isRootNode()) {
        this.updateTreeHeightsAndRelativeYOfAncestors(a.getParent())
    }
};
jFishboneLayout.prototype.updateTreeHeightsAndRelativeYOfAncestors = function(a) {
    this.updateTreeGeometry(a);
    if (!a.isRootNode()) {
        this.updateTreeHeightsAndRelativeYOfAncestors(a.getParent())
    }
};
jFishboneLayout.prototype.updateTreeHeightsAndRelativeYOfWholeMap = function() {
    this.updateTreeHeightsAndRelativeYOfDescendants(this.getRoot());
    this.layout(false)
};
jFishboneLayout.prototype.updateTreeHeightsAndRelativeYOfDescendants = function(c) {
    var b = c.getUnChildren();
    if (b != null && b.length > 0) {
        for (var a = 0; a < b.length; a++) {
            this.updateTreeHeightsAndRelativeYOfDescendants(b[a])
        }
    }
    this.updateTreeGeometry(c)
};
jFishboneLayout.prototype.updateRelativeYOfChildren = function(f, c) {
    if (c == null || c.length == 0) {
        return
    }
    if (f.isRootNode()) {
        for (var b = 0; b < c.length; b++) {
            if (c[b].isTopSide()) {
                c[b].relYPos = -this.VGAP + f.getSize().height / 2 - c[b].body.getBBox().height
            } else {
                c[b].relYPos = this.VGAP - c[b].body.getBBox().height + c[b].body.getBBox().width * Math.cos(Math.PI * (90 - this.angle) / 180) + f.body.getBBox().height / 2
            }
        }
    } else {
        if (f.isVertical()) {
            if (f.isTopSide()) {
                var g = -f.getSize().height;
                var a = 0;
                var d = 0;
                if (c.length > 1) {
                    c[0].relYPos = parseInt(g) - c[0].getSize().height + 2 * parseInt(this.VGAP);
                    for (var b = 1; b < c.length; b++) {
                        d = parseInt(c[b].getTreeHeight()) + parseInt(this.VGAP);
                        g += d;
                        c[b].relYPos = parseInt(g);
                        a += d
                    }
                    a = a - (f.getSize().height - 2 * this.VGAP);
                    if (a > 0) {
                        for (var b = 0; b < c.length; b++) {
                            c[b].relYPos -= a
                        }
                    }
                }
            } else {
                var g = -f.getSize().height + c[0].body.getBBox().height + 2 * this.VGAP;
                for (var b = 0; b < c.length; b++) {
                    c[b].relYPos = (g);
                    g += parseInt(c[b].getTreeHeight()) + this.VGAP
                }
                var a = g - (parseInt(c[c.length - 1].getTreeHeight()) + this.VGAP);
                if (a < 0) {
                    for (var b = 0; b < c.length; b++) {
                        c[b].relYPos -= a
                    }
                }
            }
        } else {
            if (f.isTopSide()) {
                for (var b = 0; b < c.length; b++) {
                    c[b].relYPos = -this.VGAP
                }
            } else {
                for (var b = 0; b < c.length; b++) {
                    c[b].relYPos = c[b].getSize().height
                }
            }
        }
    }
};
jFishboneLayout.prototype.getShiftUp = function(b) {
    var a = b.getShift();
    if (a < 0) {
        return -a
    } else {
        return 0
    }
};
jFishboneLayout.prototype.getShiftDown = function(b) {
    var a = b.getShift();
    if (a > 0) {
        return a
    } else {
        return 0
    }
};
jFishboneLayout.prototype.updateTreeGeometry = function(b) {
    if (b == null || b == undefined || b.removed) {
        return false
    }
    var a = b.getUnChildren();
    var d = this.calcTreeWidth(b, a);
    b.setTreeWidth(d);
    var c = this.calcTreeHeight(b, a);
    b.setTreeHeight(c);
    this.updateRelativeYOfChildren(b, a)
};
jFishboneLayout.prototype.calcTreeWidth = function(d, c) {
    if (c != null && c.length > 0) {
        if (d.isRootNode()) {
            var g = d.getSize().width;
            var f = c[c.length - 1];
            if (f.getLocation().x == 0) {
                this.layout(true)
            }
            g = Math.max(g, f.getLocation().x + f.getTreeWidth() - d.getLocation().x);
            f = f.prevSibling();
            if (f != null) {
                g = Math.max(g, f.getLocation().x + f.getTreeWidth() - d.getLocation().x)
            }
            return g
        } else {
            if (d.isVertical()) {
                var g = 0;
                for (var b = 0; b < c.length; b++) {
                    var a = c[b];
                    if (a != null) {
                        g = Math.max(parseInt(a.getTreeWidth()), g)
                    }
                }
                return d.getSize().width + g + this.HGAP
            } else {
                var g = 0;
                for (var b = 0; b < c.length; b++) {
                    var a = c[b];
                    if (a != null) {
                        g += parseInt(a.getTreeWidth()) + this.HGAP
                    }
                }
                if (d.isTopSide()) {
                    return d.getSize().width + g
                } else {
                    return Math.max(d.getSize().width, g)
                }
            }
        }
    }
    return d.getSize().width
};
jFishboneLayout.prototype.calcTreeHeight = function(d, c) {
    if (c != null && c.length > 0) {
        if (d.isVertical()) {
            if (d.isTopSide()) {
                var f = 2 * this.VGAP;
                for (var b = 1; b < c.length; b++) {
                    var a = c[b];
                    if (a != null) {
                        f += (parseInt(a.getTreeHeight()) + parseInt(this.VGAP))
                    }
                }
                return Math.max(d.getSize().height, f) + parseInt(c[0].getTreeHeight())
            } else {
                var f = this.VGAP;
                for (var b = 0; b < c.length; b++) {
                    var a = c[b];
                    if (a != null) {
                        f += (parseInt(a.getTreeHeight()) + parseInt(this.VGAP))
                    }
                }
                return Math.max(d.getSize().height, f)
            }
        } else {
            if (d.isTopSide()) {
                var f = d.getSize().height;
                for (var b = 0; b < c.length; b++) {
                    var a = c[b];
                    if (a != null) {
                        f = Math.max(parseInt(a.getTreeHeight()) + this.VGAP, f)
                    }
                }
                return f
            } else {
                var f = 0;
                for (var b = 0; b < c.length; b++) {
                    var a = c[b];
                    if (a != null) {
                        f = Math.max(parseInt(a.getTreeHeight()) + this.VGAP, f)
                    }
                }
                return f + d.getSize().height
            }
        }
    }
    return d.getSize().height
};
jFishboneLayout.prototype.calcUpperChildShift = function(b, a) {};
jFishboneLayout.prototype.calcStandardTreeShift = function(b, a) {};
jFishboneLayout.prototype.placeNode = function(d, c, b) {
    if (d.isRootNode()) {
        d.setLocation(this.getRootX(), this.getRootY())
    } else {
        var a = parseFloat(d.parent.getLocation().x) + parseFloat(c);
        var f = parseFloat(d.parent.getLocation().y) + parseFloat(b);
        d.setLocation(a, f)
    }
};
jFishboneLayout.prototype.resizeMap = function(d, a) {
    var f = false;
    var c = RAPHAEL.getSize().width;
    var k = RAPHAEL.getSize().height;
    var g = 0;
    var b = 0;
    var h = this.getRoot().getLocation();
    if (c < d * 2) {
        g = d * 2;
        b = k;
        f = true
    }
    if (k < a * 2) {
        g = c;
        b = a * 2;
        f = true;
        this.placeNode(this.getRoot())
    }
    if (f) {
        RAPHAEL.setSize(g, b);
        this.placeNode(this.getRoot(), this.getRootX(), this.getRootY());
        this.map.work.scrollLeft += (g - c) / 2;
        this.map.work.scrollTop += (b - k) / 2
    }
};
jFishboneLayout.prototype.getRootY = function() {
    var a = RAPHAEL.getSize();
    return parseInt(a.height * 0.5) - parseInt(this.getRoot().body.getBBox().height) / 2
};
jFishboneLayout.prototype.getRootX = function() {
    var a = RAPHAEL.getSize();
    return Math.round(parseInt(a.width) * 0.5) - parseInt(this.getRoot().body.getBBox().width) / 2
};
jFishboneLayout.prototype.getRoot = function() {
    return this.map.rootNode
};
jFishboneLayout.prototype.getTransformations = function(f) {
    var c = {};
    var b = "rotate matrix translate scale skewX skewY".split(" ");
    for (var d = 0; d < b.length; d++) {
        var g = new RegExp(b[d] + "[(]([^)]*)[)]", "ig");
        var a = g.exec(f);
        c[b[d]] = a ? a[1] : null
    }
    return c
};
jFishboneLayout.prototype.rotate = function(b, d, f, c) {
    var a = d + "," + f + "," + c;
    var g = null;
    var l = [];
    var k = b.groupEl.getAttribute("transform");
    g = this.getTransformations(k);
    g.rotate = a;
    l = [];
    for (var h in g) {
        if (g[h]) {
            l.push(h + "(" + g[h] + ")")
        }
    }
    b.groupEl.setAttribute("transform", l.join(" "))
};
jFishboneLayout.prototype.getParentAngle = function(d) {
    var c = d;
    while (c.getDepth() != 1) {
        c = c.getParent()
    }
    var b = this.getTransformations(c.groupEl.getAttribute("transform"));
    var a = b.rotate.split(",");
    return a[0]
};
jMindMapLayout = function(b) {
    this.map = b;
    this.HGAP = 30;
    this.VGAP = 10;
    this.xSize = 0;
    this.ySize = 0;
    var a = this.map.work;
    a.scrollLeft = Math.round((a.scrollWidth - a.offsetWidth) / 2);
    a.scrollTop = Math.round((a.scrollHeight - a.offsetHeight) / 2);
    this.map.cfg.nodeFontSizes = ["30", "18", "12"];
    this.map.cfg.nodeStyle = "jRect"
};
jMindMapLayout.prototype.type = "jMindMapLayout";
jMindMapLayout.prototype.layoutNode = function(g) {
    var a = 0;
    var f = g.hgap;
    if (isNaN(f)) {
        f = 0
    }
    if (g.isRootNode()) {
        a = 0
    } else {
        if (g.isLeft()) {
            a = -f - parseInt(g.body.getBBox().width) - parseInt(this.HGAP)
        } else {
            a = parseFloat(g.parent.body.getBBox().width) + parseFloat(f) + parseInt(this.HGAP)
        }
    }
    this.placeNode(g, a, g.relYPos);
    g.connectArrowLink();
    var d = jMap.getArrowLinks(g);
    for (var c = 0; c < d.length; c++) {
        d[c].draw()
    }
    if (g.folded == "false" || g.folded == false) {
        var b = g.getChildren();
        if (b != null && b.length > 0) {
            for (var c = 0; c < b.length; c++) {
                this.layoutNode(b[c])
            }
        }
    }
};
jMindMapLayout.prototype.layout = function(f) {
    var d = this.map.selectedNodes.getLastElement();
    f = f && (d != null && d != undefined && !d.removed && d.getLocation().x != null && d.getLocation().x != undefined && d.getLocation().x != 0 && d.getLocation().y != 0);
    var c = this.getRoot();
    var b = c.getLocation().x;
    var a = c.getLocation().y;
    if (f) {
        a = d.getLocation().y
    }
    this.resizeMap(c.treeWidth, c.treeHeight);
    this.layoutNode(this.getRoot())
};
jMindMapLayout.prototype.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors = function(a) {
    this.updateTreeHeightsAndRelativeYOfDescendants(a);
    if (!a.isRootNode()) {
        this.updateTreeHeightsAndRelativeYOfAncestors(a.getParent())
    }
};
jMindMapLayout.prototype.updateTreeHeightsAndRelativeYOfAncestors = function(a) {
    this.updateTreeGeometry(a);
    if (!a.isRootNode()) {
        this.updateTreeHeightsAndRelativeYOfAncestors(a.getParent())
    }
};
jMindMapLayout.prototype.updateTreeHeightsAndRelativeYOfWholeMap = function() {
    this.updateTreeHeightsAndRelativeYOfDescendants(this.getRoot());
    this.layout(false)
};
jMindMapLayout.prototype.updateTreeHeightsAndRelativeYOfDescendants = function(c) {
    var b = c.getUnChildren();
    if (b != null && b.length > 0) {
        for (var a = 0; a < b.length; a++) {
            this.updateTreeHeightsAndRelativeYOfDescendants(b[a])
        }
    }
    this.updateTreeGeometry(c)
};
jMindMapLayout.prototype.updateRelativeYOfChildren = function(g, c) {
    if (c == null || c.length == 0) {
        return
    }
    var m = g.vgap;
    var b = c[0];
    var a = 0;
    var f = 0;
    for (var h = 0; h < c.length; h++) {
        b = c[h];
        var d = this.getShiftUp(b);
        var k = this.getShiftDown(b);
        var l = b.getUpperChildShift();
        b.relYPos = parseInt(a) + parseInt(l) + parseInt(k);
        f += parseInt(l) + parseInt(d);
        a += parseInt(b.getTreeHeight()) + parseInt(d) + parseInt(k) + parseInt(m) + this.VGAP
    }
    f += parseInt(this.calcStandardTreeShift(g, c));
    for (var h = 0; h < c.length; h++) {
        b = c[h];
        b.relYPos -= f
    }
};
jMindMapLayout.prototype.getShiftUp = function(b) {
    var a = b.getShift();
    if (a < 0) {
        return -a
    } else {
        return 0
    }
};
jMindMapLayout.prototype.getShiftDown = function(b) {
    var a = b.getShift();
    if (a > 0) {
        return a
    } else {
        return 0
    }
};
jMindMapLayout.prototype.updateTreeGeometry = function(c) {
    if (c == null || c == undefined || c.removed) {
        return false
    }
    if (c.isRootNode()) {
        var d = this.getRoot().getLeftChildren();
        var k = this.getRoot().getRightChildren();
        var f = this.calcTreeWidth(c, d);
        var l = this.calcTreeWidth(c, k);
        this.getRoot().setRootTreeWidths(f, l);
        this.updateRelativeYOfChildren(c, d);
        this.updateRelativeYOfChildren(c, k);
        var n = this.calcUpperChildShift(c, d);
        var p = this.calcUpperChildShift(c, k);
        this.getRoot().setRootUpperChildShift(n, p);
        var o = this.calcTreeHeight(c, n, d);
        var b = this.calcTreeHeight(c, p, k);
        this.getRoot().setRootTreeHeights(o, b)
    } else {
        var a = c.getUnChildren();
        var g = this.calcTreeWidth(c, a);
        c.setTreeWidth(g);
        this.updateRelativeYOfChildren(c, a);
        var h = this.calcUpperChildShift(c, a);
        c.setUpperChildShift(h);
        var m = this.calcTreeHeight(c, h, a);
        c.setTreeHeight(m)
    }
};
jMindMapLayout.prototype.calcTreeWidth = function(f, d) {
    var g = 0;
    if (d != null && d.length > 0) {
        for (var c = 0; c < d.length; c++) {
            var b = d[c];
            if (b != null) {
                var a = parseInt(b.getTreeWidth()) + parseInt(b.hgap) + this.HGAP;
                if (a > g) {
                    g = a
                }
            }
        }
    }
    return f.getSize().width + g
};
jMindMapLayout.prototype.calcTreeHeight = function(l, g, c) {
    var h = l.getSize().height;
    try {
        var k = c[0];
        var b = c[c.length - 1];
        var d = Math.min(k.relYPos - k.getUpperChildShift(), 0);
        var a = Math.max(b.relYPos - b.getUpperChildShift() + b.getTreeHeight(), h);
        return a - d
    } catch (f) {
        return h
    }
};
jMindMapLayout.prototype.calcUpperChildShift = function(c, a) {
    try {
        var f = a[0];
        var d = -f.relYPos + parseInt(f.getUpperChildShift());
        if (d > 0) {
            return d
        } else {
            return 0
        }
    } catch (b) {
        return 0
    }
};
jMindMapLayout.prototype.calcStandardTreeShift = function(f, d) {
    var c = f.getSize().height;
    if (d.length == 0) {
        return 0
    }
    var a = 0;
    var h = f.vgap;
    for (var b = 0; b < d.length; b++) {
        var g = d[b];
        if (g != null) {
            a += parseInt(g.getSize().height) + parseInt(h)
        }
    }
    return Math.max(parseInt(a) - parseInt(h) - parseInt(c), 0) / 2
};
jMindMapLayout.prototype.placeNode = function(d, c, b) {
    if (d.isRootNode()) {
        d.setLocation(this.getRootX(), this.getRootY())
    } else {
        var a = parseFloat(d.parent.getLocation().x) + parseFloat(c);
        var f = parseFloat(d.parent.getLocation().y) + parseFloat(b);
        d.setLocation(a, f)
    }
};
jMindMapLayout.prototype.resizeMap = function(d, a) {
    var f = false;
    var c = RAPHAEL.getSize().width;
    var k = RAPHAEL.getSize().height;
    var g = 0;
    var b = 0;
    var h = this.getRoot().getLocation();
    if (c < d * 2) {
        g = d * 2;
        b = k;
        f = true
    }
    if (k < a * 2) {
        g = c;
        b = a * 2;
        f = true;
        this.placeNode(this.getRoot())
    }
    if (f) {
        RAPHAEL.setSize(g, b);
        this.placeNode(this.getRoot(), this.getRootX(), this.getRootY());
        this.map.work.scrollLeft += (g - c) / 2;
        this.map.work.scrollTop += (b - k) / 2
    }
};
jMindMapLayout.prototype.getRootY = function() {
    var a = RAPHAEL.getSize();
    return Math.round(parseInt(a.height) * 0.5) - parseInt(this.getRoot().body.getBBox().height) / 2
};
jMindMapLayout.prototype.getRootX = function() {
    var a = RAPHAEL.getSize();
    return Math.round(parseInt(a.width) * 0.5) - parseInt(this.getRoot().body.getBBox().width) / 2
};
jMindMapLayout.prototype.getRoot = function() {
    return this.map.rootNode
};
jPadletLayout = function(b) {
    this.map = b;
    this.HGAP = 30;
    this.VGAP = 10;
    this.xSize = 0;
    this.ySize = 0;
    var a = this.map.work;
    a.scrollLeft = Math.round((a.scrollWidth - a.offsetWidth) / 2);
    a.scrollTop = Math.round((a.scrollHeight - a.offsetHeight) / 2);
    this.map.cfg.nodeFontSizes = ["30", "18", "12"];
    this.map.cfg.nodeStyle = "jPadletNode"
};
jPadletLayout.prototype.type = "jPadletLayout";
jPadletLayout.prototype.layoutNode = function(c) {
    this.placeNode(c, parseFloat(c.attributes.padlet_x), parseFloat(c.attributes.padlet_y));
    if (c.folded == "false" || c.folded == false) {
        var b = c.getChildren();
        if (b != null && b.length > 0) {
            for (var a = 0; a < b.length; a++) {
                this.layoutNode(b[a])
            }
        }
    }
};
jPadletLayout.prototype.layout = function(f) {
    var d = this.map.selectedNodes.getLastElement();
    f = f && (d != null && d != undefined && !d.removed && d.getLocation().x != null && d.getLocation().x != undefined && d.getLocation().x != 0 && d.getLocation().y != 0);
    var c = this.getRoot();
    var b = c.getLocation().x;
    var a = c.getLocation().y;
    if (f) {
        a = d.getLocation().y
    }
    this.layoutNode(this.getRoot())
};
jPadletLayout.prototype.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors = function(a) {
    this.updateTreeHeightsAndRelativeYOfDescendants(a);
    if (!a.isRootNode()) {
        this.updateTreeHeightsAndRelativeYOfAncestors(a.getParent())
    }
};
jPadletLayout.prototype.updateTreeHeightsAndRelativeYOfAncestors = function(a) {
    this.updateTreeGeometry(a);
    if (!a.isRootNode()) {
        this.updateTreeHeightsAndRelativeYOfAncestors(a.getParent())
    }
};
jPadletLayout.prototype.checkLocation = function(c) {
    if (c.attributes.padlet_x == undefined) {
        c.attributes.padlet_x = this.getRootX()
    }
    if (c.attributes.padlet_y == undefined) {
        c.attributes.padlet_y = this.getRootY()
    }
    if (c.folded == "false" || c.folded == false) {
        var b = c.getChildren();
        if (b != null && b.length > 0) {
            for (var a = 0; a < b.length; a++) {
                this.checkLocation(b[a])
            }
        }
    }
};
jPadletLayout.prototype.updateTreeHeightsAndRelativeYOfWholeMap = function() {
    var a = this.getRoot();
    a.setFoldingAll(false);
    this.checkLocation(a);
    this.layoutNode(a)
};
jPadletLayout.prototype.updateTreeHeightsAndRelativeYOfDescendants = function(a) {
    this.layoutNode(a)
};
jPadletLayout.prototype.updateRelativeYOfChildren = function(b, a) {
    this.layoutNode(b)
};
jPadletLayout.prototype.getShiftUp = function(b) {
    var a = b.getShift();
    if (a < 0) {
        return -a
    } else {
        return 0
    }
};
jPadletLayout.prototype.getShiftDown = function(b) {
    var a = b.getShift();
    if (a > 0) {
        return a
    } else {
        return 0
    }
};
jPadletLayout.prototype.updateTreeGeometry = function(a) {};
jPadletLayout.prototype.calcTreeWidth = function(f, d) {
    var g = 0;
    if (d != null && d.length > 0) {
        for (var c = 0; c < d.length; c++) {
            var b = d[c];
            if (b != null) {
                var a = parseInt(b.getTreeWidth()) + parseInt(b.hgap) + this.HGAP;
                if (a > g) {
                    g = a
                }
            }
        }
    }
    return f.getSize().width + g
};
jPadletLayout.prototype.calcTreeHeight = function(l, g, c) {
    var h = l.getSize().height;
    try {
        var k = c[0];
        var b = c[c.length - 1];
        var d = Math.min(k.relYPos - k.getUpperChildShift(), 0);
        var a = Math.max(b.relYPos - b.getUpperChildShift() + b.getTreeHeight(), h);
        return a - d
    } catch (f) {
        return h
    }
};
jPadletLayout.prototype.calcUpperChildShift = function(c, a) {
    try {
        var f = a[0];
        var d = -f.relYPos + parseInt(f.getUpperChildShift());
        if (d > 0) {
            return d
        } else {
            return 0
        }
    } catch (b) {
        return 0
    }
};
jPadletLayout.prototype.calcStandardTreeShift = function(f, d) {
    var c = f.getSize().height;
    if (d.length == 0) {
        return 0
    }
    var a = 0;
    var h = f.vgap;
    for (var b = 0; b < d.length; b++) {
        var g = d[b];
        if (g != null) {
            a += parseInt(g.getSize().height) + parseInt(h)
        }
    }
    return Math.max(parseInt(a) - parseInt(h) - parseInt(c), 0) / 2
};
jPadletLayout.prototype.placeNode = function(d, c, b) {
    if (d.isRootNode()) {
        d.setLocation(this.getRootX(), this.getRootY())
    } else {
        var a = parseFloat(d.parent.getLocation().x) + parseFloat(c);
        var f = parseFloat(d.parent.getLocation().y) + parseFloat(b);
        d.setLocation(c, b)
    }
};
jPadletLayout.prototype.resizeMap = function(d, a) {
    var f = false;
    var c = RAPHAEL.getSize().width;
    var k = RAPHAEL.getSize().height;
    var g = 0;
    var b = 0;
    var h = this.getRoot().getLocation();
    if (c < d * 2) {
        g = d * 2;
        b = k;
        f = true
    }
    if (k < a * 2) {
        g = c;
        b = a * 2;
        f = true;
        this.placeNode(this.getRoot())
    }
    if (f) {
        RAPHAEL.setSize(g, b);
        this.placeNode(this.getRoot(), this.getRootX(), this.getRootY());
        this.map.work.scrollLeft += (g - c) / 2;
        this.map.work.scrollTop += (b - k) / 2
    }
};
jPadletLayout.prototype.getRootY = function() {
    var a = RAPHAEL.getSize();
    return Math.round(parseInt(a.height) * 0.5) - parseInt(this.getRoot().body.getBBox().height) / 2
};
jPadletLayout.prototype.getRootX = function() {
    var a = RAPHAEL.getSize();
    return Math.round(parseInt(a.width) * 0.5) - parseInt(this.getRoot().body.getBBox().width) / 2
};
jPadletLayout.prototype.getRoot = function() {
    return this.map.rootNode
};
jRotateLayout = function(b) {
    this.map = b;
    this.HGAP = 10;
    this.VGAP = 120;
    this.xSize = 0;
    this.ySize = 0;
    var a = this.map.work;
    a.scrollLeft = Math.round((a.scrollWidth - a.offsetWidth) / 2);
    a.scrollTop = Math.round((a.scrollHeight - a.offsetHeight) / 2);
    this.map.cfg.nodeFontSizes = ["30", "18", "12"]
};
jRotateLayout.prototype.type = "jRotateLayout";
jRotateLayout.prototype.layoutNode = function(f) {
    var g = 0;
    var d = f.hgap;
    if (isNaN(d)) {
        d = 0
    }
    if (f.isRootNode()) {
        g = 0
    } else {
        g = parseFloat(f.parent.body.getBBox().height) + parseFloat(d) + parseInt(this.HGAP)
    }
    this.placeNode(f, f.vshift, g);
    f.connectArrowLink();
    var c = jMap.getArrowLinks(f);
    for (var b = 0; b < c.length; b++) {
        c[b].draw()
    }
    if (f.folded == "false" || f.folded == false) {
        var a = f.getChildren();
        if (a != null && a.length > 0) {
            for (var b = 0; b < a.length; b++) {
                this.layoutNode(a[b])
            }
        }
    }
};
jRotateLayout.prototype.layout = function(f) {
    var d = this.map.selectedNodes.getLastElement();
    f = f && (d != null && d != undefined && !d.removed && d.getLocation().x != null && d.getLocation().x != undefined && d.getLocation().x != 0 && d.getLocation().y != 0);
    var c = this.getRoot();
    var b = c.getLocation().x;
    var a = c.getLocation().y;
    if (f) {
        a = d.getLocation().y
    }
    this.resizeMap(c.treeWidth, c.treeHeight);
    this.layoutNode(this.getRoot())
};
jRotateLayout.prototype.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors = function(a) {
    this.updateTreeHeightsAndRelativeYOfDescendants(a);
    if (!a.isRootNode()) {
        this.updateTreeHeightsAndRelativeYOfAncestors(a.getParent())
    }
};
jRotateLayout.prototype.updateTreeHeightsAndRelativeYOfAncestors = function(a) {
    this.updateTreeGeometry(a);
    if (!a.isRootNode()) {
        this.updateTreeHeightsAndRelativeYOfAncestors(a.getParent())
    }
};
jRotateLayout.prototype.updateTreeHeightsAndRelativeYOfWholeMap = function() {
    this.updateTreeHeightsAndRelativeYOfDescendants(this.getRoot());
    this.layout(false)
};
jRotateLayout.prototype.updateTreeHeightsAndRelativeYOfDescendants = function(c) {
    var b = c.getUnChildren();
    if (b != null && b.length > 0) {
        for (var a = 0; a < b.length; a++) {
            this.updateTreeHeightsAndRelativeYOfDescendants(b[a])
        }
    }
    this.updateTreeGeometry(c)
};
jRotateLayout.prototype.updateTreeGeometry = function(d) {
    if (d == null || d == undefined || d.removed) {
        return false
    }
    var a = d.getUnChildren();
    var h = this.calcTreeWidth(d, a);
    d.setTreeWidth(h);
    var g = this.calcTreeHeight(d, a);
    d.setTreeHeight(g);
    var b = function(p, o, k) {
        var n = p.body.getBBox().width;
        if (!o[k]) {
            o[k] = 0
        }
        o[k] = (n > o[k]) ? n : o[k];
        if (p.getChildren().length > 0) {
            var m = p.getChildren();
            k++;
            for (var l = 0; l < m.length; l++) {
                b(m[l], o, k)
            }
        }
    };
    var c = [];
    b(jMap.getRootNode(), c, 0);
    if (d.isRootNode()) {
        d.setSize(this.getRoot().getSize().width, this.getRoot().getSize().height)
    } else {
        var f = d.getDepth();
        d.setSize(c[f], d.getSize().height)
    }
};
jRotateLayout.prototype.calcTreeHeight = function(d, c) {
    var b = d.getSize().height;
    if (c == null || c.length == 0) {
        return b
    }
    var g = null;
    var f = 0;
    for (var a = 0; a < c.length; a++) {
        g = c[a];
        f += parseInt(g.getTreeHeight())
    }
    return Math.max(b, f)
};
jRotateLayout.prototype.calcTreeWidth = function(c, b) {
    if (b == null || b.length == 0) {
        return c.getSize().width
    }
    var d = 0;
    for (var a = 0; a < b.length; a++) {
        d = Math.max(d, this.calcTreeWidth(b[a], b[a].getUnChildren()))
    }
    return d
};
jRotateLayout.prototype.wholePrevNode = function(g) {
    var a = g.getIndexPos();
    var f = 0;
    for (var c = 0; c < a; c++) {
        var d = g.getParent().getChildren();
        var b = d[c].getChildren();
        f += this.calcTreeHeight(d[c], b)
    }
    return f
};
jRotateLayout.prototype.placeNode = function(b, m, l) {
    var k = this.getRootX() + this.getRoot().getSize().width / 2;
    var f = this.getRootY() + this.getRoot().getSize().height / 2;
    var r = this.calcTreeHeight(this.getRoot(), this.getRoot().getChildren());
    var g = this.calcTreeHeight(b, b.getChildren());
    var h = function(w) {
        var u = {};
        var t = "matrix translate scale skewX skewY".split(" ");
        for (var v = 0; v < t.length; v++) {
            var x = new RegExp(t[v] + "[(]([^)]*)[)]", "ig");
            var s = x.exec(w);
            u[t[v]] = s ? s[1] : null
        }
        return u
    };
    var q = function(u, w, x, v) {
        var s = w + "," + x + "," + v;
        var B = null;
        var E = [];
        var D = u.groupEl.getAttribute("transform");
        B = h(D);
        B.rotate = s;
        E = [];
        for (var C in B) {
            if (B[C]) {
                E.push(C + "(" + B[C] + ")")
            }
        }
        u.groupEl.setAttribute("transform", E.join(" "));
        if (u.connection) {
            var A = u.connection.line.node.getAttribute("transform");
            B = h(A);
            B.rotate = s;
            E = [];
            for (var C in B) {
                if (B[C]) {
                    E.push(C + "(" + B[C] + ")")
                }
            }
            u.connection.line.node.setAttribute("transform", E.join(" "))
        }
        if (u.getChildren().length > 0) {
            var t = u.getChildren();
            for (var z = 0; z < t.length; z++) {
                q(t[z], w, x, v)
            }
        }
    };
    if (b.isRootNode()) {
        b.setLocation(this.getRootX(), this.getRootY())
    } else {
        if (b.getParent().isRootNode()) {
            var o = this.getRoot().getSize().width + this.getRootX() + this.VGAP;
            var n = this.getRoot().getSize().height / 2 + this.getRootY() - b.getSize().height / 2;
            b.setLocation(o, n);
            var d = this.wholePrevNode(b);
            var c = (d / r) * 360 - (g / r) * 180;
            q(b, c, k, f)
        } else {
            var o = 0;
            var n = 0;
            var a = this.getPrevSibling(b);
            if (a == null) {
                var p = b.getParent();
                n = parseInt(p.getLocation().y) - parseInt(p.getTreeHeight() / 2) - parseInt(p.getSize().height / 2) - parseInt(this.HGAP) + parseInt(b.getTreeHeight() / 2) - parseInt(b.getSize().height / 2) + parseInt(l)
            } else {
                n = parseInt(a.getLocation().y) + parseInt(a.getTreeHeight() / 2) + a.getSize().height / 2 + b.getTreeHeight() / 2 - b.getSize().height / 2 + parseInt(m) + parseInt(this.HGAP)
            }
            o = parseFloat(b.parent.getLocation().x) + parseFloat(m) + parseFloat(this.VGAP) + parseFloat(b.parent.getSize().width);
            b.setLocation(o, n)
        }
    }
};
jRotateLayout.prototype.resizeMap = function(d, a) {
    var f = false;
    var c = RAPHAEL.getSize().width;
    var k = RAPHAEL.getSize().height;
    var g = 0;
    var b = 0;
    var h = this.getRoot().getLocation();
    if (c < d * 2) {
        g = d * 2;
        b = k;
        f = true
    }
    if (k < a * 2) {
        g = c;
        b = a * 2;
        f = true;
        this.placeNode(this.getRoot())
    }
    if (f) {
        RAPHAEL.setSize(g, b);
        this.placeNode(this.getRoot(), this.getRootX(), this.getRootY());
        this.map.work.scrollLeft += (g - c) / 2;
        this.map.work.scrollTop += (b - k) / 2
    }
};
jRotateLayout.prototype.getRootY = function() {
    var a = RAPHAEL.getSize();
    return Math.round(parseInt(a.height) * 0.5) - parseInt(this.getRoot().body.getBBox().height) / 2
};
jRotateLayout.prototype.getRootX = function() {
    var a = RAPHAEL.getSize();
    return Math.round(parseInt(a.width) * 0.5) - parseInt(this.getRoot().body.getBBox().width) / 2
};
jRotateLayout.prototype.getRoot = function() {
    return this.map.rootNode
};
jRotateLayout.prototype.getPrevSibling = function(b) {
    if (b.isRootNode()) {
        return null
    }
    var a = b.parent.children.indexOf(b);
    if (a < 1) {
        return null
    }
    return b.parent.children[a - 1]
};
jSunburstController = function(a) {
    jSunburstController.superclass.call(this, a)
};
extend(jSunburstController, JinoController);
jSunburstController.prototype.startNodeEdit = function(d) {
    if (this.nodeEditor == undefined || this.nodeEditor == null || d.removed) {
        return false
    }
    if (!jMap.isAllowNodeEdit(d)) {
        return false
    }
    if (STAT_NODEEDIT) {
        this.stopNodeEdit(true)
    }
    STAT_NODEEDIT = true;
    this.nodeEditor.setAttribute("nodeID", d.id);
    var h = this.nodeEditor;
    h.style.fontFamily = d.text.attr()["font-family"];
    h.style.fontSize = jMap.cfg.nodeFontSizes[2] * this.map.cfg.scale + "px";
    h.style.textAlign = "left";
    var b = (d.outerRadius - d.innerRadius) * jMap.cfg.scale;
    var l = 30 * jMap.cfg.scale;
    var c = RAPHAEL.getSize().width / 2;
    var k = (RAPHAEL.getSize().height / 2) + (90 * jMap.cfg.scale);
    b = Math.max(b, 150);
    var a = 0;
    if (!d.isRootNode()) {
        a = (d.outerRadius - d.innerRadius) / 2
    }
    var g = (d.innerRadius + a) * jMap.cfg.scale;
    var f = d.angle;
    k += (g * Math.sin(Math.PI * (f / 180)));
    c += (g * Math.cos(Math.PI * (f / 180)));
    h.style.display = "";
    h.style.width = b + "px";
    h.style.height = l + "px";
    h.style.left = c + "px";
    h.style.top = k + "px";
    h.style.zIndex = 999;
    h.value = d.getText();
    h.focus();
    return true
};
jSunburstController.prototype.foldingAction = function(a) {
    if (jMap.jDebug) {
        console.log("foldingAction")
    }
};
jSunburstController.prototype.resetCoordinateAction = function(a) {
    if (jMap.jDebug) {
        console.log("resetCoordinateAction")
    }
};
jSunburstController.prototype.foldingAllAction = function() {
    if (jMap.jDebug) {
        console.log("foldingAllAction")
    }
};
jSunburstController.prototype.unfoldingAllAction = function() {
    if (jMap.jDebug) {
        console.log("unfoldingAllAction")
    }
};
jSunburstController.prototype.pasteAction = function(c) {
    if (jMap.cfg.realtimeSave) {
        var d = jMap.saveAction.isAlive();
        if (!d) {
            return null
        }
    }
    if (!c) {
        c = jMap.getSelected()
    }
    var f = jMap.loadManager.pasteNode(c, jMap.clipboardManager.getClipboardText());
    var b = function() {
        for (var l = 0; l < f.length; l++) {
            jMap.saveAction.pasteAction(f[l])
        }
        if (jMap.cfg.lazyLoading) {
            for (var l = 0; l < f.length; l++) {
                var k = f[l].getChildren();
                for (var m = k.length - 1; m >= 0; m--) {
                    k[m].removeExecute()
                }
            }
        }
        var g = "<clipboard>";
        for (var l = 0; l < f.length; l++) {
            var h = f[l].toXML();
            g += h
        }
        g += "</clipboard>";
        jMap.fireActionListener(ACTIONS.ACTION_NODE_PASTE, c, g);
        jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(c);
        jMap.layoutManager.layout(true);
        jMap.arcTweenNode.zoomExecute()
    };
    if (jMap.loadManager.imageLoading.length == 0) {
        b()
    } else {
        var a = jMap.addActionListener(ACTIONS.ACTION_NODE_IMAGELOADED, function() {
            b();
            jMap.removeActionListener(a)
        })
    }
};
jSunburstController.prototype.deleteAction = function() {
    var f = jMap.getSelecteds();
    for (var b = 0; b < f.length; b++) {
        if (!jMap.isAllowNodeEdit(f[b])) {
            return false
        }
    }
    var c = null;
    var a = null;
    var d = -1;
    while (c = f.pop()) {
        a = c.getParent();
        d = c.getIndexPos();
        c.popover.container.remove();
        c.remove()
    }
    if (a) {
        jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(a);
        jMap.layoutManager.layout(true);
        if (d != -1) {
            if (a.getChildren().length <= 0) {
                a.focus()
            } else {
                if (a.getChildren().length > d) {
                    a.getChildren()[d].focus()
                } else {
                    a.getChildren()[a.getChildren().length - 1].focus()
                }
            }
        }
        if (jMap.nodes[jMap.arcTweenNode.id]) {
            jMap.arcTweenNode.zoomExecute()
        } else {
            jMap.getRootNode().screenFocus()
        }
    } else {
        jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
        jMap.getRootNode().screenFocus()
    }
};
jSunburstController.prototype.insertAction = function() {
    var b = jMap.getSelecteds().getLastElement();
    if (b) {
        J_NODE_CREATING = b;
        var c = {
            parent: b
        };
        var a = jMap.createNodeWithCtrl(c);
        jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(b);
        jMap.layoutManager.layout(true);
        jMap.arcTweenNode.zoomExecute(0).end(function() {
            a.focus(true);
            jMap.controller.startNodeEdit(a)
        })
    }
};
jSunburstController.prototype.insertSiblingAction = function() {
    if (BrowserDetect.browser == "Firefox") {
        jMap.keyEnterHit = 0
    }
    var f = jMap.getSelecteds().getLastElement();
    var d = f && f.parent;
    if (d) {
        J_NODE_CREATING = f;
        var b = f.getIndexPos() + 1;
        var a = null;
        if (f.position && f.getParent().isRootNode()) {
            a = f.position
        }
        var g = {
            parent: d,
            index: b,
            position: a
        };
        var c = jMap.createNodeWithCtrl(g);
        jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(c.parent);
        jMap.layoutManager.layout(true);
        jMap.arcTweenNode.zoomExecute(0).end(function() {
            c.focus(true);
            jMap.controller.startNodeEdit(c)
        })
    }
};
jSunburstControllerGuest = function(a) {
    jSunburstControllerGuest.superclass.call(this, a)
};
extend(jSunburstControllerGuest, JinoControllerGuest);
jSunburstControllerGuest.prototype.foldingAction = function(a) {
    if (jMap.jDebug) {
        console.log("foldingAction")
    }
};
jSunburstControllerGuest.prototype.resetCoordinateAction = function(a) {
    if (jMap.jDebug) {
        console.log("resetCoordinateAction")
    }
};
jSunburstControllerGuest.prototype.foldingAllAction = function() {
    if (jMap.jDebug) {
        console.log("foldingAllAction")
    }
};
jSunburstControllerGuest.prototype.unfoldingAllAction = function() {
    if (jMap.jDebug) {
        console.log("unfoldingAllAction")
    }
};
jSunburstLayout = function(c) {
    var b = this;
    c.controller = c.mode ? new jSunburstController(c) : new jSunburstControllerGuest(c);
    b.map = c;
    b.HGAP = 10;
    b.VGAP = 20;
    b.xSize = 0;
    b.ySize = 0;
    var a = b.map.work;
    a.scrollLeft = Math.round((a.scrollWidth - a.offsetWidth) / 2);
    a.scrollTop = Math.round((a.scrollHeight - a.offsetHeight) / 2);
    b.map.cfg.nodeFontSizes = ["30", "18", "12", "9"];
    b.map.cfg.nodeStyle = "jSunburstNode";
    b.map.jDebug = false;
    b.map.cfg.edgeDefalutColor = "#8a7066";
    b.map.cfg.edgeDefalutWidth = 0.5;
    b.map.arcTweenNode = null;
    b.map.popoverContainer = $('<div class="jpopover-container" id="jsunburstlayout-popover-container"></div>').appendTo(document.body);
    b.radius = (Math.min(a.offsetWidth / 2, a.offsetHeight / 2)) - 100;
    b.x = d3.scale.linear().range([0, 2 * Math.PI]);
    b.y = d3.scale.pow().exponent(1.3).domain([0, 1]).range([0, b.radius]);
    b.padding = 5;
    b.duration = 800;
    b.partition = d3.layout.partition().sort(null).value(function(f) {
        return 5.8 - f.depth
    });
    b.arc = d3.svg.arc().startAngle(function(g) {
        var f = Math.max(0, Math.min(2 * Math.PI, b.x(g.x)));
        if (jMap.nodes[g.id]) {
            jMap.nodes[g.id].startAngle = f
        }
        return f
    }).endAngle(function(g) {
        var f = Math.max(0, Math.min(2 * Math.PI, b.x(g.x + g.dx)));
        if (jMap.nodes[g.id]) {
            jMap.nodes[g.id].endAngle = f
        }
        return f
    }).innerRadius(function(g) {
        var f = Math.max(0, g.y ? b.y(g.y) : g.y);
        if (jMap.nodes[g.id]) {
            jMap.nodes[g.id].innerRadius = f
        }
        return f
    }).outerRadius(function(g) {
        var f = Math.max(0, b.y(g.y + g.dy));
        if (jMap.nodes[g.id]) {
            jMap.nodes[g.id].outerRadius = f
        }
        return f
    })
};
jSunburstLayout.prototype.type = "jSunburstLayout";
jSunburstLayout.prototype.updateTreeHeightsAndRelativeYOfWholeMap = function() {
    jMap.arcTweenNode = this.getRoot();
    this.layoutPartition(jMap.arcTweenNode)
};
jSunburstLayout.prototype.updateTreeHeightsAndRelativeYOfAncestors = function(a) {
    this.layoutPartition(this.getRoot())
};
jSunburstLayout.prototype.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors = function(a) {
    this.layoutPartition(this.getRoot())
};
jSunburstLayout.prototype.layout = function(a) {};
jSunburstLayout.prototype.layoutPartition = function(b) {
    var a = this;
    var c = a.partition.nodes(b.getPartitionTreeData());
    c.forEach(function(d) {
        jMap.nodes[d.id].depth = d.depth;
        jMap.nodes[d.id].dx = d.dx;
        jMap.nodes[d.id].dy = d.dy;
        jMap.nodes[d.id].x = d.x;
        jMap.nodes[d.id].y = d.y;
        jMap.nodes[d.id].value = d.value;
        d3.select('g[data-node-id="' + d.id + '"] path').data([d]).attr("d", a.arc).attr("fill-rule", "evenodd").attr("stroke-linejoin", "round").attr("stroke-linecap", "round");
        d3.select('g[data-node-id="' + d.id + '"] text').data([d]).attr("transform", function(k) {
            var f = (jMap.nodes[k.id].plainText || "").split(" ").length > 1,
                h = a.x(k.x + k.dx / 2) * 180 / Math.PI - 90,
                g = h + (f ? -0.5 : 0);
            if (jMap.nodes[k.id]) {
                jMap.nodes[k.id].angle = h;
                if (jMap.nodes[k.id].isRootNode()) {
                    return ""
                }
            }
            return "rotate(" + g + ")translate(" + (a.y(k.y) + a.padding) + ")rotate(" + (h > 90 ? -180 : 0) + ")"
        }).attr("text-anchor", function(g) {
            var f = "middle";
            if (jMap.nodes[g.id]) {
                if (!jMap.nodes[g.id].isRootNode()) {
                    f = a.x(g.x + g.dx / 2) > Math.PI ? "end" : "start"
                }
                jMap.nodes[g.id].computedTextExecute();
                d3.select(jMap.nodes[g.id].text.node).style({
                    "text-anchor": f
                })
            }
            return f
        })
    })
};
jSunburstLayout.prototype.getRoot = function() {
    return this.map.rootNode
};
jSunburstLayout.prototype.arcTween = function(h) {
    var a = jMap.layoutManager;
    var f = a.maxY(h),
        c = d3.interpolate(a.x.domain(), [h.x, h.x + h.dx]),
        g = d3.interpolate(a.y.domain(), [h.y, f]),
        b = d3.interpolate(a.y.range(), [h.y ? 20 : 0, a.radius]);
    return function(k) {
        return function(d) {
            a.x.domain(c(d));
            a.y.domain(g(d)).range(b(d));
            return a.arc(k)
        }
    }
};
jSunburstLayout.prototype.maxY = function(b) {
    var a = jMap.layoutManager;
    return b.children ? Math.max.apply(Math, b.children.map(a.maxY)) : b.y + b.dy
};
jSunburstLayout.prototype.getCenterLocation = function() {
    return {
        x: RAPHAEL.getSize().width / 2,
        y: (RAPHAEL.getSize().height / 2) + 90
    }
};
jTableLayout = function(b) {
    this.map = b;
    this.HGAP = 0;
    this.VGAP = 0;
    this.xSize = 0;
    this.ySize = 0;
    var a = this.map.work;
    a.scrollLeft = Math.round((a.scrollWidth - a.offsetWidth) / 2);
    a.scrollTop = Math.round((a.scrollHeight - a.offsetHeight) / 2);
    this.map.cfg.nodeFontSizes = ["14", "14", "14"]
};
jTableLayout.prototype.type = "jTableLayout";
jTableLayout.prototype.layoutNode = function(g) {
    var a = 0;
    var d = g.wgap;
    if (isNaN(d)) {
        d = 0
    }
    if (g.isRootNode()) {
        y = 0
    } else {
        y = parseFloat(g.parent.body.getBBox().width)
    }
    this.placeNode(g, a, g.vshift);
    g.connectArrowLink();
    var f = jMap.getArrowLinks(g);
    for (var c = 0; c < f.length; c++) {
        f[c].draw()
    }
    if (g.folded == "false" || g.folded == false) {
        var b = g.getChildren();
        if (b != null && b.length > 0) {
            for (var c = 0; c < b.length; c++) {
                this.layoutNode(b[c])
            }
        }
    }
};
jTableLayout.prototype.layout = function(f) {
    var d = this.map.selectedNodes.getLastElement();
    f = f && (d != null && d != undefined && !d.removed && d.getLocation().x != null && d.getLocation().x != undefined && d.getLocation().x != 0 && d.getLocation().y != 0);
    var c = this.getRoot();
    var b = c.getLocation().x;
    var a = c.getLocation().y;
    if (f) {
        b = d.getLocation().x
    }
    this.resizeMap(c.treeWidth, c.treeHeight);
    this.layoutNode(this.getRoot())
};
jTableLayout.prototype.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors = function(a) {
    this.updateTreeHeightsAndRelativeYOfDescendants(this.getRoot());
    this.layout(false)
};
jTableLayout.prototype.updateTreeHeightsAndRelativeYOfAncestors = function(a) {
    this.updateTreeHeightsAndRelativeYOfDescendants(this.getRoot());
    this.layout(false)
};
jTableLayout.prototype.updateTreeHeightsAndRelativeYOfWholeMap = function() {
    this.updateTreeHeightsAndRelativeYOfDescendants(this.getRoot());
    this.layout(false)
};
jTableLayout.prototype.updateTreeHeightsAndRelativeYOfDescendants = function(c) {
    var b = c.getUnChildren();
    if (b != null && b.length > 0) {
        for (var a = 0; a < b.length; a++) {
            this.updateTreeHeightsAndRelativeYOfDescendants(b[a])
        }
    }
    this.updateTreeGeometry(c)
};
jTableLayout.prototype.maxDepth = function(c) {
    var b = c.getUnChildren();
    if (b == null || b.length == 0) {
        return c.getDepth()
    }
    var d = 0;
    for (var a = 0; a < b.length; a++) {
        d = Math.max(d, this.maxDepth(b[a]))
    }
    return d
};
jTableLayout.prototype.makeNode = function(c, f) {
    var b = c.getUnChildren();
    if (b == null || b.length == 0) {
        if (c.getDepth() < f) {
            var d = {
                parent: c,
                text: ""
            };
            this.map.createNodeWithCtrl(d)
        }
    }
    for (var a = 0; a < b.length; a++) {
        this.makeNode(b[a], f)
    }
};
jTableLayout.prototype.updateTreeGeometry = function(f) {
    if (f == null || f == undefined || f.removed) {
        return false
    }
    var b = f.getUnChildren();
    var g = f.getDepth();
    var k = this.calcTreeWidth(f, b);
    f.setTreeWidth(k);
    var h = this.calcTreeHeight(f, b);
    f.setTreeHeight(h);
    var c = function(q, p, l) {
        var o = q.body.getBBox().width;
        if (!p[l]) {
            p[l] = 0
        }
        p[l] = (o > p[l]) ? o : p[l];
        if (q.getChildren().length > 0) {
            var n = q.getChildren();
            l++;
            for (var m = 0; m < n.length; m++) {
                c(n[m], p, l)
            }
        }
    };
    var d = [];
    c(jMap.getRootNode(), d, 0);
    if (g == 0) {
        wholeTreeWidth = 0;
        for (var a = 1; a < d.length; a++) {
            wholeTreeWidth += d[a]
        }
        f.setSize(wholeTreeWidth, this.getRoot().getSize().height)
    } else {
        f.setSize(d[g], h)
    }
};
jTableLayout.prototype.calcTreeHeight = function(d, c) {
    var b = d.getSize().height;
    if (c == null || c.length == 0) {
        return b
    }
    var g = null;
    var f = 0;
    for (var a = 0; a < c.length; a++) {
        g = c[a];
        f += parseInt(g.getTreeHeight())
    }
    f -= parseInt(c.length - 1) * 0.2;
    return Math.max(b, f)
};
jTableLayout.prototype.calcTreeWidth = function(c, b) {
    if (b == null || b.length == 0) {
        return c.getSize().width
    }
    var d = 0;
    for (var a = 0; a < b.length; a++) {
        d = Math.max(d, this.calcTreeWidth(b[a], b[a].getUnChildren()))
    }
    return d
};
jTableLayout.prototype.placeNode = function(g, f, c) {
    if (g.isRootNode()) {
        g.setLocation(this.getRootX(), this.getRootY())
    } else {
        var a = 0;
        var h = 0;
        var b = this.getPrevSibling(g);
        var d = g.getParent();
        if (d.isRootNode()) {
            if (b == null) {
                h = parseInt(d.getLocation().y) + this.getRoot().getSize().height
            } else {
                h = parseInt(b.getLocation().y) + parseInt(b.getSize().height)
            }
            a = parseFloat(g.parent.getLocation().x)
        } else {
            if (b == null) {
                h = parseInt(d.getLocation().y)
            } else {
                h = parseInt(b.getLocation().y) + parseInt(b.getSize().height)
            }
            a = parseFloat(g.parent.getLocation().x) + parseFloat(g.parent.getSize().width)
        }
        g.setLocation(a, h)
    }
};
jTableLayout.prototype.resizeMap = function(d, a) {
    var f = false;
    var c = RAPHAEL.getSize().width;
    var k = RAPHAEL.getSize().height;
    var g = 0;
    var b = 0;
    var h = this.getRoot().getLocation();
    if (c < d * 2) {
        g = d * 2;
        b = k;
        f = true
    }
    if (k < a * 2) {
        g = c;
        b = a * 2;
        f = true;
        this.placeNode(this.getRoot())
    }
    if (f) {
        RAPHAEL.setSize(g, b);
        this.placeNode(this.getRoot(), this.getRootX(), this.getRootY());
        this.map.work.scrollLeft += (g - c) / 2;
        this.map.work.scrollTop += (b - k) / 2
    }
};
jTableLayout.prototype.getRootY = function() {
    var a = RAPHAEL.getSize();
    return Math.round(parseInt(a.height) * 0.5) - parseInt(this.getRoot().body.getBBox().height) / 2
};
jTableLayout.prototype.getRootX = function() {
    var a = RAPHAEL.getSize();
    return Math.round(parseInt(a.width) * 0.5) - parseInt(this.getRoot().body.getBBox().width) / 2
};
jTableLayout.prototype.getRoot = function() {
    return this.map.rootNode
};
jTableLayout.prototype.getPrevSibling = function(b) {
    if (b.isRootNode()) {
        return null
    }
    var a = b.parent.children.indexOf(b);
    if (a < 1) {
        return null
    }
    return b.parent.children[a - 1]
};
jTreeLayout = function(b) {
    this.map = b;
    this.HGAP = 10;
    this.VGAP = 20;
    this.xSize = 0;
    this.ySize = 0;
    var a = this.map.work;
    a.scrollLeft = Math.round((a.scrollWidth - a.offsetWidth) / 2);
    a.scrollTop = Math.round((a.scrollHeight - a.offsetHeight) / 2);
    this.map.cfg.nodeFontSizes = ["30", "18", "12"];
    this.map.cfg.nodeStyle = "jRect"
};
jTreeLayout.prototype.type = "jTreeLayout";
jTreeLayout.prototype.layoutNode = function(f) {
    var g = 0;
    var d = f.hgap;
    if (isNaN(d)) {
        d = 0
    }
    if (f.isRootNode()) {
        g = 0
    } else {
        g = parseFloat(f.parent.body.getBBox().height) + parseFloat(d) + parseInt(this.HGAP)
    }
    this.placeNode(f, f.vshift, g);
    f.connectArrowLink();
    var c = jMap.getArrowLinks(f);
    for (var b = 0; b < c.length; b++) {
        c[b].draw()
    }
    if (f.folded == "false" || f.folded == false) {
        var a = f.getChildren();
        if (a != null && a.length > 0) {
            for (var b = 0; b < a.length; b++) {
                this.layoutNode(a[b])
            }
        }
    }
};
jTreeLayout.prototype.layout = function(f) {
    var d = this.map.selectedNodes.getLastElement();
    f = f && (d != null && d != undefined && !d.removed && d.getLocation().x != null && d.getLocation().x != undefined && d.getLocation().x != 0 && d.getLocation().y != 0);
    var c = this.getRoot();
    var b = c.getLocation().x;
    var a = c.getLocation().y;
    if (f) {
        a = d.getLocation().y
    }
    this.resizeMap(c.treeWidth, c.treeHeight);
    this.layoutNode(this.getRoot())
};
jTreeLayout.prototype.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors = function(a) {
    this.updateTreeHeightsAndRelativeYOfDescendants(a);
    if (!a.isRootNode()) {
        this.updateTreeHeightsAndRelativeYOfAncestors(a.getParent())
    }
};
jTreeLayout.prototype.updateTreeHeightsAndRelativeYOfAncestors = function(a) {
    this.updateTreeGeometry(a);
    if (!a.isRootNode()) {
        this.updateTreeHeightsAndRelativeYOfAncestors(a.getParent())
    }
};
jTreeLayout.prototype.updateTreeHeightsAndRelativeYOfWholeMap = function() {
    this.updateTreeHeightsAndRelativeYOfDescendants(this.getRoot());
    this.layout(false)
};
jTreeLayout.prototype.updateTreeHeightsAndRelativeYOfDescendants = function(c) {
    var b = c.getUnChildren();
    if (b != null && b.length > 0) {
        for (var a = 0; a < b.length; a++) {
            this.updateTreeHeightsAndRelativeYOfDescendants(b[a])
        }
    }
    this.updateTreeGeometry(c)
};
jTreeLayout.prototype.updateTreeGeometry = function(b) {
    if (b == null || b == undefined || b.removed) {
        return false
    }
    var a = b.getUnChildren();
    var d = this.calcTreeWidth(b, a);
    b.setTreeWidth(d);
    var c = this.calcTreeHeight(b, a);
    b.setTreeHeight(c)
};
jTreeLayout.prototype.calcTreeWidth = function(d, b) {
    var c = d.getSize().width;
    if (b == null || b.length == 0) {
        return c
    }
    var g = null;
    var f = 0;
    for (var a = 0; a < b.length; a++) {
        g = b[a];
        f += parseInt(g.getTreeWidth()) + parseInt(g.vshift)
    }
    f += parseInt(this.HGAP) * parseInt(b.length - 1);
    return Math.max(c, f)
};
jTreeLayout.prototype.calcTreeHeight = function(c, b) {
    if (b == null || b.length == 0) {
        return c.getSize().height
    }
    var d = 0;
    for (var a = 0; a < b.length; a++) {
        d = Math.max(d, this.calcTreeHeight(b[a], b[a].getUnChildren()) + b[a].vshift)
    }
    return d
};
jTreeLayout.prototype.placeNode = function(g, f, c) {
    if (g.isRootNode()) {
        g.setLocation(this.getRootX(), this.getRootY())
    } else {
        var a = 0;
        var h = 0;
        var b = this.getPrevSibling(g);
        if (b == null) {
            var d = g.getParent();
            a = parseInt(d.getLocation().x) - parseInt(d.getTreeWidth() / 2) + parseInt(d.getSize().width / 2) + parseInt(g.getTreeWidth() / 2) - parseInt(g.getSize().width / 2) + parseInt(f)
        } else {
            a = parseInt(b.getLocation().x) + parseInt(b.getTreeWidth() / 2) + b.getSize().width / 2 + g.getTreeWidth() / 2 - g.getSize().width / 2 + parseInt(f) + parseInt(this.HGAP)
        }
        h = parseFloat(g.parent.getLocation().y) + parseFloat(c) + parseFloat(this.VGAP);
        g.setLocation(a, h)
    }
};
jTreeLayout.prototype.resizeMap = function(d, a) {
    var f = false;
    var c = RAPHAEL.getSize().width;
    var k = RAPHAEL.getSize().height;
    var g = 0;
    var b = 0;
    var h = this.getRoot().getLocation();
    if (c < d * 2) {
        g = d * 2;
        b = k;
        f = true
    }
    if (k < a * 2) {
        g = c;
        b = a * 2;
        f = true;
        this.placeNode(this.getRoot())
    }
    if (f) {
        RAPHAEL.setSize(g, b);
        this.placeNode(this.getRoot(), this.getRootX(), this.getRootY());
        this.map.work.scrollLeft += (g - c) / 2;
        this.map.work.scrollTop += (b - k) / 2
    }
};
jTreeLayout.prototype.getRootY = function() {
    var a = RAPHAEL.getSize();
    return Math.round(parseInt(a.height) * 0.5) - parseInt(this.getRoot().body.getBBox().height) / 2
};
jTreeLayout.prototype.getRootX = function() {
    var a = RAPHAEL.getSize();
    return Math.round(parseInt(a.width) * 0.5) - parseInt(this.getRoot().body.getBBox().width) / 2
};
jTreeLayout.prototype.getRoot = function() {
    return this.map.rootNode
};
jTreeLayout.prototype.getPrevSibling = function(b) {
    if (b.isRootNode()) {
        return null
    }
    var a = b.parent.children.indexOf(b);
    if (a < 1) {
        return null
    }
    return b.parent.children[a - 1]
};
jZoomableTreemapController = function(a) {
    jZoomableTreemapController.superclass.call(this, a)
};
extend(jZoomableTreemapController, JinoController);
jZoomableTreemapController.prototype.type = "jZoomableTreemapController";
jZoomableTreemapController.prototype.startNodeEdit = function(d) {
    if (this.nodeEditor == undefined || this.nodeEditor == null || d.removed) {
        return false
    }
    if (!jMap.isAllowNodeEdit(d)) {
        return false
    }
    if (STAT_NODEEDIT) {
        this.stopNodeEdit(true)
    }
    STAT_NODEEDIT = true;
    this.nodeEditor.setAttribute("nodeID", d.id);
    var h = this.nodeEditor;
    var c = jMap.layoutManager.getCenterLocation();
    h.style.fontFamily = d.text.attr()["font-family"];
    h.style.fontSize = jMap.cfg.nodeFontSizes[2] * this.map.cfg.scale + "px";
    h.style.textAlign = "left";
    var b = d.groupEl.getBBox().width * jMap.cfg.scale;
    var a = d.groupEl.getBBox().height * jMap.cfg.scale;
    var g = c.x + (jMap.layoutManager.x(d.x) * jMap.cfg.scale) + (jMap.layoutManager.width - jMap.layoutManager.width * jMap.cfg.scale) / 2;
    var f = c.y + (jMap.layoutManager.y(d.y) * jMap.cfg.scale) - (jMap.layoutManager.marginTop - jMap.layoutManager.marginTop * jMap.cfg.scale) + (jMap.layoutManager.height - jMap.layoutManager.height * jMap.cfg.scale) / 2;
    h.style.display = "";
    h.style.minWidth = b + "px";
    h.style.height = a + "px";
    h.style.left = g + "px";
    h.style.top = f + "px";
    h.style.zIndex = 999;
    h.value = d.getText();
    h.focus();
    return true
};
jZoomableTreemapController.prototype.foldingAction = function(a) {
    if (jMap.jDebug) {
        console.log("foldingAction")
    }
};
jZoomableTreemapController.prototype.resetCoordinateAction = function(a) {
    if (jMap.jDebug) {
        console.log("resetCoordinateAction")
    }
};
jZoomableTreemapController.prototype.foldingAllAction = function() {
    if (jMap.jDebug) {
        console.log("foldingAllAction")
    }
};
jZoomableTreemapController.prototype.unfoldingAllAction = function() {
    if (jMap.jDebug) {
        console.log("unfoldingAllAction")
    }
};
jZoomableTreemapController.prototype.pasteAction = function(c) {
    if (jMap.cfg.realtimeSave) {
        var d = jMap.saveAction.isAlive();
        if (!d) {
            return null
        }
    }
    if (!c) {
        c = jMap.getSelected()
    }
    var f = jMap.loadManager.pasteNode(c, jMap.clipboardManager.getClipboardText());
    var b = function() {
        for (var l = 0; l < f.length; l++) {
            jMap.saveAction.pasteAction(f[l])
        }
        if (jMap.cfg.lazyLoading) {
            for (var l = 0; l < f.length; l++) {
                var k = f[l].getChildren();
                for (var m = k.length - 1; m >= 0; m--) {
                    k[m].removeExecute()
                }
            }
        }
        var g = "<clipboard>";
        for (var l = 0; l < f.length; l++) {
            var h = f[l].toXML();
            g += h
        }
        g += "</clipboard>";
        jMap.fireActionListener(ACTIONS.ACTION_NODE_PASTE, c, g);
        jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(c);
        jMap.layoutManager.layout(true);
        jMap.arcTweenNode.zoomExecute(0)
    };
    if (jMap.loadManager.imageLoading.length == 0) {
        b()
    } else {
        var a = jMap.addActionListener(ACTIONS.ACTION_NODE_IMAGELOADED, function() {
            b();
            jMap.removeActionListener(a)
        })
    }
};
jZoomableTreemapController.prototype.deleteAction = function() {
    var f = jMap.getSelecteds();
    for (var b = 0; b < f.length; b++) {
        if (!jMap.isAllowNodeEdit(f[b])) {
            return false
        }
    }
    var c = null;
    var a = null;
    var d = -1;
    while (c = f.pop()) {
        a = c.getParent();
        d = c.getIndexPos();
        c.popover.container.remove();
        c.remove()
    }
    if (a) {
        jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(a);
        jMap.layoutManager.layout(true);
        if (d != -1) {
            if (a.getChildren().length <= 0) {
                a.focus()
            } else {
                if (a.getChildren().length > d) {
                    a.getChildren()[d].focus()
                } else {
                    a.getChildren()[a.getChildren().length - 1].focus()
                }
            }
        }
        if (jMap.nodes[jMap.arcTweenNode.id]) {
            jMap.arcTweenNode.zoomExecute()
        } else {
            jMap.getRootNode().screenFocus()
        }
    } else {
        jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
        jMap.getRootNode().screenFocus()
    }
};
jZoomableTreemapController.prototype.insertAction = function() {
    var b = jMap.getSelecteds().getLastElement();
    if (b) {
        J_NODE_CREATING = b;
        var c = {
            parent: b
        };
        var a = jMap.createNodeWithCtrl(c);
        jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(b);
        jMap.layoutManager.layout(true);
        jMap.arcTweenNode.zoomExecute(0).end(function() {
            a.focus(true);
            jMap.controller.startNodeEdit(a)
        })
    }
};
jZoomableTreemapController.prototype.insertSiblingAction = function() {
    if (BrowserDetect.browser == "Firefox") {
        jMap.keyEnterHit = 0
    }
    var f = jMap.getSelecteds().getLastElement();
    var d = f && f.parent;
    if (d) {
        J_NODE_CREATING = f;
        var b = f.getIndexPos() + 1;
        var a = null;
        if (f.position && f.getParent().isRootNode()) {
            a = f.position
        }
        var g = {
            parent: d,
            index: b,
            position: a
        };
        var c = jMap.createNodeWithCtrl(g);
        jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(c.parent);
        jMap.layoutManager.layout(true);
        jMap.arcTweenNode.zoomExecute(0).end(function() {
            c.focus(true);
            jMap.controller.startNodeEdit(c)
        })
    }
};
jZoomableTreemapControllerGuest = function(a) {
    jZoomableTreemapControllerGuest.superclass.call(this, a)
};
extend(jZoomableTreemapControllerGuest, JinoControllerGuest);
jZoomableTreemapControllerGuest.prototype.type = "jZoomableTreemapControllerGuest";
jZoomableTreemapControllerGuest.prototype.foldingAction = function(a) {
    if (jMap.jDebug) {
        console.log("foldingAction")
    }
};
jZoomableTreemapControllerGuest.prototype.resetCoordinateAction = function(a) {
    if (jMap.jDebug) {
        console.log("resetCoordinateAction")
    }
};
jZoomableTreemapControllerGuest.prototype.foldingAllAction = function() {
    if (jMap.jDebug) {
        console.log("foldingAllAction")
    }
};
jZoomableTreemapControllerGuest.prototype.unfoldingAllAction = function() {
    if (jMap.jDebug) {
        console.log("unfoldingAllAction")
    }
};
jZoomableTreemapLayout = function(c) {
    var b = this;
    c.controller = c.mode ? new jZoomableTreemapController(c) : new jZoomableTreemapControllerGuest(c);
    b.map = c;
    b.HGAP = 10;
    b.VGAP = 20;
    b.xSize = 0;
    b.ySize = 0;
    var a = b.map.work;
    a.scrollLeft = Math.round((a.scrollWidth - a.offsetWidth) / 2);
    a.scrollTop = Math.round((a.scrollHeight - a.offsetHeight) / 2);
    b.map.cfg.nodeFontSizes = ["30", "18", "12", "9"];
    b.map.cfg.nodeStyle = "jZoomableTreemapNode";
    b.map.jDebug = false;
    this.map.cfg.edgeDefalutColor = "#ffffff";
    b.map.arcTweenNode = null;
    b.map.popoverContainer = $('<div class="jpopover-container" id="jsunburstlayout-popover-container"></div>').appendTo(document.body);
    b.marginTop = 90;
    b.width = a.offsetWidth - 60;
    b.height = a.offsetHeight - 200;
    b.x = d3.scale.linear().range([0, b.width]);
    b.y = d3.scale.linear().range([0, b.height]);
    b.duration = 800;
    b.partition = d3.layout.treemap().round(false).size([b.width, b.height]).value(function(f) {
        return 1
    })
};
jZoomableTreemapLayout.prototype.type = "jZoomableTreemapLayout";
jZoomableTreemapLayout.prototype.updateTreeHeightsAndRelativeYOfWholeMap = function() {
    this.layoutPartition(this.getRoot());
    this.getRoot().zoomExecute()
};
jZoomableTreemapLayout.prototype.updateTreeHeightsAndRelativeYOfAncestors = function(a) {
    this.layoutPartition(this.getRoot());
    jMap.arcTweenNode.zoomExecute(0)
};
jZoomableTreemapLayout.prototype.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors = function(a) {
    this.layoutPartition(this.getRoot())
};
jZoomableTreemapLayout.prototype.layout = function(a) {
    if (jMap.jDebug) {
        console.log("layout")
    }
};
jZoomableTreemapLayout.prototype.getRoot = function() {
    return this.map.rootNode
};
jZoomableTreemapLayout.prototype.layoutPartition = function(c) {
    var b = this;
    var a = jMap.layoutManager.getCenterLocation();
    var d = b.partition.nodes(c.getPartitionTreeData());
    d.forEach(function(g) {
        jMap.nodes[g.id].area = g.area;
        jMap.nodes[g.id].depth = g.depth;
        jMap.nodes[g.id].dx = g.dx;
        jMap.nodes[g.id].dy = g.dy;
        jMap.nodes[g.id].x = g.x;
        jMap.nodes[g.id].y = g.y;
        jMap.nodes[g.id].z = g.z;
        jMap.nodes[g.id].value = g.value;
        var f = d3.select('g[data-node-id="' + g.id + '"]').data([g]);
        f.attr("visibility", "hidden").attr("data-node-leaf", false).attr("pointer-events", "none");
        f.select("rect").attr("visibility", "hidden").attr("pointer-events", "none");
        f.select("text").attr("visibility", "hidden");
        if (!g.children) {
            f.attr("visibility", "visible").attr("data-node-leaf", true).attr("pointer-events", "all").attr("transform", "translate(" + [a.x + g.x, a.y + g.y] + ")");
            f.select("rect").attr("visibility", "visible").attr("pointer-events", "all").attr("width", g.dx - 1).attr("height", g.dy - 1).attr("fill-rule", "evenodd");
            f.select("text").attr("visibility", "visible").attr("x", g.dx / 2).attr("y", g.dy / 2).attr("text-anchor", "middle").style("opacity", function(k) {
                var h = this.getComputedTextLength();
                jMap.nodes[k.id].w = h;
                return k.dx > h ? 1 : 0
            })
        }
    })
};
jZoomableTreemapLayout.prototype.getCenterLocation = function() {
    return {
        x: (RAPHAEL.getSize().width / 2) - (this.width / 2),
        y: (RAPHAEL.getSize().height / 2) - (this.height / 2) + this.marginTop
    }
};
jZoomableTreemapLayout.prototype.hideAllPopover = function() {
    jMap.popoverContainer.children('div[data-popover-type="' + jMap.cfg.nodeStyle + '"]').removeClass("active")
};
jNode = function(a, b, c) {
    this.groupEl = null;
    this.body = null;
    this.text = null;
    this.folderShape = null;
    this.img = null;
    this.hyperlink = null;
    this.arrowlinks = new Array();
    this.note = "";
    if (c && c != null && c != "" && c != "null" && jMap.checkID(c)) {
        this.id = c
    } else {
        this.id = this.CreateID()
    }
    this.plainText = b || "";
    this.folded = false;
    this.background_color = "";
    this.color = "";
    this.controller = null;
    this.layoutHeight = 0;
    this.connection = null;
    this.children = new Array();
    this.parent = null;
    this.edge = {};
    this.branch = {};
    this.fontSize = 10;
    this.hided = false;
    this.imgInfo = {};
    this.numofchildren = 0;
    this.client_id = jMap.getClientId();
    this.creator = jMap.cfg.userId;
    this.createAbstract(a);
    this.line_color = null;
    
};
jNode.prototype.type = "jNode";
if (Raphael.vml) {
    var createNode;
    document.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
    try {
        !document.namespaces.rvml && document.namespaces.add("rvml", "urn:schemas-microsoft-com:vml");
        createNode = function(a) {
            return document.createElement("<rvml:" + a + ' class="rvml">')
        }
    } catch (e) {
        createNode = function(a) {
            return document.createElement("<" + a + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">')
        }
    }
}
jNode.prototype.connectArrowLink = function() {
    for (var a = 0; a < this.arrowlinks.length; a++) {
        this.arrowlinks[a].draw()
    }
};
jNode.prototype.addArrowLink = function(a) {
    a.startNode = this;
    this.arrowlinks.push(a);
    jMap.addArrowLink(a);
    jMap.setSaved(false)
};
jNode.prototype.removeArrowLink = function(a) {
    a.remove();
    this.arrowlinks.remove(a);
    jMap.removeArrowLink(a);
    jMap.setSaved(false)
};
jNode.prototype.CreateID = function() {
    var a = "";
    while (!jMap.checkID(a)) {
        a = "ID_" + parseInt(Math.random() * 2000000000)
    }
    return a
};
jNode.prototype.createAbstract = function(a) {
    this.initElements();
    this.parent = a;
    jMap.nodes[this.id] = this;
    if (this.getParent()) {
        if (this.index != null) {
            this.getParent().insertChild(this, this.index)
        } else {
            this.getParent().appendChild(this)
        }
        this.getParent().numofchildren = this.getParent().getChildren().length
    }
    this.initCreate();
    this.create()
};
jNode.prototype.wrapElements = function() {
    this.groupEl = null;
    if (Raphael.svg) {
        this.groupEl = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.groupEl.style.webkitTapHighlightColor = "rgba(0,0,0,0)";
        if (jMap.groupEl) {
            jMap.groupEl.appendChild(this.groupEl)
        } else {
            RAPHAEL.canvas && RAPHAEL.canvas.appendChild(this.groupEl)
        }
        for (var a = 0; a < arguments.length; a++) {
            this.groupEl.appendChild(arguments[a].node)
        }
    }
    if (Raphael.vml) {
        this.groupEl = createNode("group");
        if (jMap.groupEl) {
            jMap.groupEl.appendChild(this.groupEl)
        } else {
            RAPHAEL.canvas.appendChild(this.groupEl)
        }
        for (var a = 0; a < arguments.length; a++) {
            this.groupEl.appendChild(arguments[a].Group)
        }
    }
    this.groupEl.node = this
};
jNode.prototype.getID = function() {
    return this.id
};
jNode.prototype.appendChild = function(a) {
    this.children.push(a)
};
jNode.prototype.insertChild = function(b, a) {
    this.index = a;
    this.children.insert(a, b)
};
jNode.prototype.getIndexPos = function() {
    if (!this.parent) {
        return -1
    }
    return this.parent.children.indexOf(this)
};
jNode.prototype.getParent = function() {
    return this.parent
};
jNode.prototype.setParent = function(a) {
    this.parent = a
};
jNode.prototype.getChildren = function() {
    return this.children
};
jNode.prototype.getUnChildren = function() {
    if (this.folded == true || this.folded == "true") {
        return null
    } else {
        return this.getChildren()
    }
};
jNode.prototype.isRootNode = function() {
    return this.parent == null
};
jNode.prototype.getText = function() {
    return this.text.attr().text
};
jNode.prototype.setText = function(f) {
    if (jMap.cfg.realtimeSave) {
        var c = jMap.saveAction.isAlive();
        if (!c) {
            return null
        }
    }
    var d = jMap.historyManager;
    var a = d && d.extractNode(this);
    this.setTextExecute(f);
    var b = d && d.extractNode(this);
    d && d.addToHistory(a, b);
    jMap.saveAction.editAction(this);
    jMap.fireActionListener(ACTIONS.ACTION_NODE_EDITED, this);
    jMap.setSaved(false)
};
jNode.prototype.setTextExecute = function(a) {
    this.plainText = a;
    this.text.attr({
        text: a
    });
    this.CalcBodySize()
};
jNode.prototype.getFontSize = function() {
    return this.fontSize
};
jNode.prototype.setFontSize = function(c) {
    if (jMap.cfg.realtimeSave) {
        var d = jMap.saveAction.isAlive();
        if (!d) {
            return null
        }
    }
    var f = jMap.historyManager;
    var a = f && f.extractNode(this);
    this.setFontSizeExecute(c);
    var b = f && f.extractNode(this);
    f && f.addToHistory(a, b);
    jMap.saveAction.editAction(this);
    jMap.setSaved(false)
};
jNode.prototype.setFontSizeExecute = function(a) {
    this.fontSize = a;
    this.text.attr({
        "font-size": a
    });
    this.CalcBodySize()
};
jNode.prototype.setTextColor = function(c) {
    if (jMap.cfg.realtimeSave) {
        var d = jMap.saveAction.isAlive();
        if (!d) {
            return null
        }
    }
    var f = jMap.historyManager;
    var a = f && f.extractNode(this);
    this.setTextColorExecute(c);
    var b = f && f.extractNode(this);
    f && f.addToHistory(a, b);
    jMap.saveAction.editAction(this);
    jMap.fireActionListener(ACTIONS.ACTION_NODE_ATTRS, this);
    jMap.setSaved(false)
};
jNode.prototype.setTextColorExecute = function(a) {
    this.color = a;
    this.text.attr({
        fill: a
    })
};
jNode.prototype.getTextColor = function() {
    return this.color
};
jNode.prototype.setLineColor = function(a) {
    this.line_color = a;
};
jNode.prototype.getLineColor = function() {
    return this.line_color;
};
jNode.prototype.setBackgroundColor = function(c) {
    if (jMap.cfg.realtimeSave) {
        var d = jMap.saveAction.isAlive();
        if (!d) {
            return null
        }
    }
    var f = jMap.historyManager;
    var a = f && f.extractNode(this);
    this.setBackgroundColorExecute(c);
    var b = f && f.extractNode(this);
    f && f.addToHistory(a, b);
    jMap.saveAction.editAction(this);
    jMap.fireActionListener(ACTIONS.ACTION_NODE_ATTRS, this);
    jMap.setSaved(false)
};
jNode.prototype.setBackgroundColorExecute = function(a) {
    if (a) {
        this.background_color = a;
        this.body.attr({
            fill: a
        });
        this.folderShape && this.folderShape.attr({
            fill: a
        })
    }
};
jNode.prototype.getBackgroundColor = function() {
    return this.background_color
};
jNode.prototype.setEdgeColor = function(c, d) {
    if (jMap.cfg.realtimeSave) {
        var f = jMap.saveAction.isAlive();
        if (!f) {
            return null
        }
    }
    var g = jMap.historyManager;
    var a = g && g.extractNode(this);
    this.setEdgeColorExecute(c, d);
    var b = g && g.extractNode(this);
    g && g.addToHistory(a, b);
    jMap.saveAction.editAction(this);
    jMap.setSaved(false)
};
jNode.prototype.setEdgeColorExecute = function(a, b) {
    if (a) {
        this.edge.color = a;
        this.body.attr({
            stroke: a
        });
        this.folderShape && this.folderShape.attr({
            stroke: a
        })
    }
    if (b) {
        this.edge.width = b;
        this.body.attr({
            "stroke-width": b
        })
    }
};
jNode.prototype.getEdgeColor = function() {
    return this.edge.color
};
jNode.prototype.setBranchColor = function(c, d) {
    if (jMap.cfg.realtimeSave) {
        var f = jMap.saveAction.isAlive();
        if (!f) {
            return null
        }
    }
    var g = jMap.historyManager;
    var a = g && g.extractNode(this);
    this.setBranchColorExecute(c, d);
    var b = g && g.extractNode(this);
    g && g.addToHistory(a, b);
    jMap.saveAction.editAction(this);
    jMap.setSaved(false)
};
jNode.prototype.setBranchColorExecute = function(a, b, c) {
    console.log("a : " + a);
    console.log("c : " + c);
	//20180709 라인색 변경 추가
	if(c != undefined && c != ""){
        this.branch.color = c;
        this.connection && this.connection.line.attr({
            stroke: c,		//라인색
            fill: c			//라인안 배경색
        });
        if (jMap.layoutManager.type == "jTreeLayout") {
            this.connection && this.connection.line.attr({
                stroke: c,
                fill: "none"
            })
        }
	}else{
		if (a) {
	        this.branch.color = a;
	        this.connection && this.connection.line.attr({
	            stroke: a,		//라인색
	            fill: a			//라인안 배경색
	        });
	        if (jMap.layoutManager.type == "jTreeLayout") {
	            this.connection && this.connection.line.attr({
	                stroke: a,
	                fill: "none"
	            })
	        }
	    }
	}
	
    if (b) {
        this.branch.width = b
    }
};
jNode.prototype.getBranchColor = function() {
    return this.branch.color
};
jNode.prototype.getPathToRoot = function(c) {
    var a = new Array();
    var b = this;
    a.push(b.getText());
    while (b = b.parent) {
        if (c != null && c-- == 0) {
            break
        }
        a.push(b.getText())
    }
    return a
};
jNode.prototype.getPathToRootText = function(c, b) {
    var a = this.getPathToRoot(c);
    return a.join(b)
};
jNode.prototype.getDepth = function() {
    var b = 0;
    var a = this;
    while (a = a.parent) {
        b++
    }
    return b
};
jNode.prototype.focus = function(a) {
    var c = jMap.getSelecteds();
    if (a) {
        for (var b = c.length - 1; b >= 0; b--) {
            c[b].blur()
        }
    }
    if (!c.contains(this)) {
        c.push(this);
        this.body.animate({
            stroke: jMap.cfg.nodeSelectedColor,
            "stroke-width": 3
        }, 300)
    }
    jMap.fireActionListener(ACTIONS.ACTION_NODE_SELECTED, this);
    jMap.work.focus()
};
jNode.prototype.blur = function() {
    var a = jMap.getSelecteds();
    if (a.contains(this)) {
        a.remove(this);
        this.body.animate({
            fill: this.background_color,
            stroke: this.edge.color,
            "stroke-width": this.edge.width
        }, 300)
    }
    jMap.fireActionListener(ACTIONS.ACTION_NODE_UNSELECTED, this)
};
jNode.prototype.screenFocus = function() {
    var a = jMap.work;
    a.scrollLeft = Math.round(this.getLocation().x - a.offsetWidth / 2 + this.getSize().width / 2);
    a.scrollTop = Math.round(this.getLocation().y - a.offsetHeight / 2 + this.getSize().height / 2)
};
jNode.prototype.setNote = function(a) {
    this.note = a
};
jNode.prototype.setFolding = function(g) {
    if (jMap.cfg.realtimeSave) {
        var d = jMap.saveAction.isAlive();
        if (!d) {
            return null
        }
    }
    var b = (this.numofchildren > 0 || this.getChildren().length > 0);
    if (!b || this.isRootNode()) {
        return
    }
    var f = jMap.historyManager;
    var a = f && f.extractNode(this);
    this.setFoldingExecute(g);
    var c = f && f.extractNode(this);
    f && f.addToHistory(a, c);
    jMap.saveAction.editAction(this);
    jMap.setSaved(false)
};
jNode.prototype.setFoldingExecute = function(b) {
    var a = (this.numofchildren > 0 || this.getChildren().length > 0);
    if (!a || this.isRootNode()) {
        return
    }
    jMap.fireActionListener(ACTIONS.ACTION_NODE_FOLDING, this);
    this.numofchildren = this.getChildren().length;
    if (this.numofchildren > 0) {
        if (b) {
            this.hideChildren(this);
            this.folderShape && this.folderShape.show();
            this.folded = true
        } else {
            this.showChildren(this);
            this.folderShape && this.folderShape.hide();
            this.folded = false
        }
    }
    jMap.resolveRendering()
};
jNode.prototype.setFoldingAll = function(c) {
    this.__FoldingAll(c, this);
    if (this.isRootNode()) {
        var b = this.getChildren();
        for (var a = 0; a < b.length; a++) {
            b[a].setFoldingExecute(c)
        }
    } else {
        this.setFoldingExecute(c)
    }
};
jNode.prototype.__FoldingAll = function(d, c) {
    if (!c.getChildren().isEmpty() && !c.isRootNode()) {
        c.folded = d
    }
    if (c.getChildren().length > 0) {
        var b = c.getChildren();
        for (var a = 0; a < b.length; a++) {
            this.__FoldingAll(d, b[a])
        }
    }
};
jNode.prototype.isFoldingHit = function(b) {
    var d = false;
    switch (jMap.layoutManager.type) {
        case "jMindMapLayout":
            var a = (b.offsetX) ? b.offsetX : b.layerX - this.getLocation().x;
            d = (this.isLeft()) ? (a < PERCEIVE_WIDTH) : (a > this.body.getBBox().width - PERCEIVE_WIDTH);
            break;
        case "jTreeLayout":
            var c = (b.offsetY) ? b.offsetY : b.layerY - this.getLocation().y;
            d = (c > this.body.getBBox().height - PERCEIVE_WIDTH);
            break;
        case "jFishboneLayout":
            var a = (b.offsetX) ? b.offsetX : b.layerX - this.getLocation().x;
            d = (this.isLeft()) ? (a < PERCEIVE_WIDTH) : (a > this.body.getBBox().width - PERCEIVE_WIDTH);
            break;
        default:
    }
    return d
};
jNode.prototype.hideChildren = function(c) {
    if (c.getChildren().length > 0) {
        var b = c.getChildren();
        for (var a = 0; a < b.length; a++) {
            this.hideChildren(b[a]);
            b[a].hide()
        }
    }
};
jNode.prototype.hide = function() {
    this.body.hide();
    this.text.hide();
    this.folderShape && this.folderShape.hide();
    this.img && this.img.hide();
    this.hyperlink && this.hyperlink.hide();
    this.connection && this.connection.hide();
    if (this.foreignObjEl) {
        this.foreignObjEl.style.display = "none"
    }
    for (var a = 0; a < this.arrowlinks.length; a++) {
        this.arrowlinks[a].hide()
    }
    var b = jMap.getArrowLinks(this);
    for (var a = 0; a < b.length; a++) {
        b[a].hide()
    }
    this.hided = true
};
jNode.prototype.showChildren = function(c) {
    if (c.numofchildren > 0) {
        var b = c.getChildren();
        for (var a = 0; a < b.length; a++) {
            b[a].show();
            if (!b[a].folded) {
                this.showChildren(b[a])
            }
        }
    }
};
jNode.prototype.show = function() {
    this.body.show();
    this.text.show();
    this.folded && this.folderShape.show();
    this.img && this.img.show();
    this.hyperlink && this.hyperlink.show();
    this.connection && this.connection.show();
    if (this.foreignObjEl) {
        this.foreignObjEl.style.display = "block"
    }
    for (var a = 0; a < this.arrowlinks.length; a++) {
        this.arrowlinks[a].show()
    }
    var b = jMap.getArrowLinks(this);
    for (var a = 0; a < b.length; a++) {
        b[a].show()
    }
    this.hided = false
};
jNode.prototype.hadChildren = function(c) {
    if (this.getChildren().length > 0) {
        var b = this.getChildren();
        for (var a = 0; a < b.length; a++) {
            if (c == b[a]) {
                return true
            }
            if (b[a].hadChildren(c)) {
                return true
            }
        }
    }
    return false
};
jNode.prototype.remove = function(d) {
    if (jMap.cfg.realtimeSave) {
        var c = jMap.saveAction.isAlive();
        if (!c) {
            return null
        }
    }
    if (this.removed) {
        return false
    }
    if (!d && this.isRootNode()) {
        return false
    }
    saveMap(true, true);
    jMap.saveAction.deleteAction(this);
    var f = jMap.historyManager;
    var a = f && f.extractNode(this, true);
    this.removeExecute(d);
    var b = null;
    f && f.addToHistory(a, b);
    jMap.fireActionListener(ACTIONS.ACTION_NODE_REMOVE, this);
    jMap.setSaved(false)
};
jNode.prototype.removeExecute = function(d) {
    if (this.removed) {
        return false
    }
    if (!d && this.isRootNode()) {
        return false
    }
    if (!this.getChildren().isEmpty()) {
        var b = this.getChildren();
        for (var a = b.length - 1; a >= 0; a--) {
            b[a].removeExecute()
        }
    }
    jMap.deleteNodeById(this.id);
    this.connection && this.connection.remove();
    while (this.arrowlinks.length != 0) {
        this.removeArrowLink(this.arrowlinks[0])
    }
    var c = jMap.getArrowLinks(this);
    for (var a = 0; a < c.length; a++) {
        this.removeArrowLink(c[a])
    }
    for (e in this) {
        if (this[e] && this[e].toString) {
            if (this[e].toString() == "Rapha\xebl\u2019s object") {
                this[e].remove()
            }
        }
    }
    this.groupEl.parentNode.removeChild(this.groupEl);
    this.parent && this.parent.getChildren().remove(this);
    this.removed = true;
    this.parent.numofchildren = this.parent.getChildren().length;
    return true
};
jNode.prototype.nextSibling = function(f) {
    if (this.isRootNode()) {
        return null
    }
    var b = this.getIndexPos();
    var d = this.getParent().getChildren();
    var h = d.length - 1;
    if (jMap.layoutManager.type == "jMindMapLayout") {
        if (this.getParent().isRootNode()) {
            var a = this.position;
            for (var c = b; c < h; c++) {
                if (d[c + 1].position == a) {
                    return d[c + 1]
                }
            }
            return null
        }
    }
    if (f && b == h && this.getParent().nextSibling(f)) {
        var g = this.getParent().nextSibling(f).getChildren();
        if (g.length > 0) {
            return g[0]
        }
    }
    if (b < h) {
        return d[b + 1]
    }
    return null
};
jNode.prototype.prevSibling = function(f) {
    if (this.isRootNode()) {
        return null
    }
    var b = this.getIndexPos();
    var d = this.getParent().getChildren();
    if (jMap.layoutManager.type == "jMindMapLayout") {
        if (this.getParent().isRootNode()) {
            var a = this.position;
            for (var c = b; c > 0; c--) {
                if (d[c - 1].position == a) {
                    return d[c - 1]
                }
            }
            return null
        }
    }
    if (f && b == 0 && this.getParent().prevSibling(f)) {
        var g = this.getParent().prevSibling(f).getChildren();
        if (g.length > 0) {
            return g[g.length - 1]
        }
    }
    if (b > 0) {
        return d[b - 1]
    }
    return null
};
jNode.prototype.addEventController = function(a) {
    this.controller = a;
    $(this.groupEl).on("vmousedown", a.mousedown);
    $(this.groupEl).on("vmousemove", a.mousemove);
    $(this.groupEl).on("vmouseup", a.mouseup);
    $(this.groupEl).on("vmouseover", a.mouseover);
    $(this.groupEl).on("vmouseout", a.mouseout);
    $(this.groupEl).on("taphold", a.taphold);
    $(this.groupEl).on("vclick", a.click);
    $(this.groupEl).on("dblclick", a.dblclick);
    $(this.groupEl).on("dragenter", a.dragenter);
    $(this.groupEl).on("dragleave", a.dragexit);
    $(this.groupEl).on("drop", a.drop);
    $(this.groupEl).on("contextmenu", a.contextmenu)
};
jNode.prototype.removeEventController = function(a) {
    this.controller = null
};
jNode.prototype.toString = function() {
    return "jNode"
};
jNode.prototype.initCreate = function() {};
jNode.prototype.initElements = function() {};
jNode.prototype.create = function() {};
jNode.prototype.translate = function(a, b) {};
jNode.prototype.getSize = function() {};
jNode.prototype.setSize = function(b, a) {};
jNode.prototype.getLocation = function() {};
jNode.prototype.setLocation = function(a, b) {};
jNode.prototype.CalcBodySize = function() {};
jNode.prototype.updateNodeShapesPos = function() {};
jNode.prototype.getInputPort = function() {};
jNode.prototype.getOutputPort = function() {};
jNode.prototype.toXML = function(a) {};
jMindMapNode = function(b, d, f, c, a) {
    this.index = c;
    this.position = (a) ? a : "";
    this.link = "";
    this.style = "";
    this.created = 0;
    this.modified = 0;
    this.hgap = 0;
    this.vgap = 0;
    this.vshift = 0;
    this.SHIFT = -2;
    this.relYPos = 0;
    this.treeWidth = 0;
    this.treeHeight = 0;
    this.leftTreeWidth = 0;
    this.rightTreeWidth = 0;
    this.upperChildShift = 0;
    this.attributes = {};
    jMindMapNode.superclass.call(this, b, d, f);
    this.folderShape && this.folderShape.hide()
};
extend(jMindMapNode, jNode);
jMindMapNode.prototype.type = "jMindMapNode";
jMindMapNode.prototype.initCreate = function() {
    if (this.getParent()) {
        if (this.getParent().isRootNode() && this.position) {
            this.position = this.position
        } else {
            if (this.getParent().isRootNode()) {
                var b = this.getParent().getChildren();
                var c = 0;
                var d = 0;
                for (var a = 0; a < b.length; a++) {
                    (b[a].position == "left") && c++;
                    (b[a].position == "right") && d++
                }
                if (c < d) {
                    this.position = "left"
                } else {
                    this.position = "right"
                }
            } else {
                this.position = ""
            }
        }
    }
};
jMindMapNode.prototype.translate = function(a, b) {
    this.body.translate(a, b);
    this.text.translate(a, b);
    this.folderShape && this.folderShape.translate(a, b);
    this.img && this.img.translate(a, b);
    this.hyperlink && this.hyperlink.translate(a, b);
    this.connection && this.connection.updateLine()
};
jMindMapNode.prototype.relativeCoordinate = function(d, b) {
    if (jMap.cfg.realtimeSave) {
        var f = jMap.saveAction.isAlive();
        if (!f) {
            return null
        }
    }
    var g = jMap.historyManager;
    var a = g && g.extractNode(this);
    this.relativeCoordinateExecute(d, b);
    var c = g && g.extractNode(this);
    g && g.addToHistory(a, c);
    jMap.saveAction.editAction(this);
    jMap.fireActionListener(ACTIONS.ACTION_NODE_COORDMOVED, this, d, b);
    jMap.setSaved(false)
};
jMindMapNode.prototype.relativeCoordinateExecute = function(b, a) {
    switch (jMap.layoutManager.type) {
        case "jMindMapLayout":
            if (this.isLeft()) {
                b = -b
            }
            this.hgap = parseInt(this.hgap) + b;
            this.vshift = parseInt(this.vshift) + a;
            break;
        case "jTreeLayout":
            this.hgap = parseInt(this.hgap) + a;
            this.vshift = parseInt(this.vshift) + b;
            break;
        case "jFishboneLayout":
            if (this.isLeft()) {
                b = -b
            }
            this.hgap = parseInt(this.hgap) + b;
            this.vshift = parseInt(this.vshift) + a;
            break;
        default:
            this.hgap = parseInt(this.hgap) + a;
            this.vshift = parseInt(this.vshift) + b;
            break
    }
    if (isNaN(this.hgap)) {
        this.hgap = 0
    }
    if (isNaN(this.vshift)) {
        this.vshift = 0
    }
    jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(this);
    jMap.layoutManager.layout(true)
};
jMindMapNode.prototype.isLeft = function() {
    if (jMap.layoutManager.type == "jTableLayout") {
        return false
    }
    if (this.position && this.position != "") {
        return (this.position == "left") ? true : false
    } else {
        if ((this.position == null || this.position == "") && this.parent != null) {
            return this.parent.isLeft()
        } else {
            return false
        }
    }
};
jMindMapNode.prototype.setHyperlink = function(c) {
    if (jMap.cfg.realtimeSave) {
        var d = jMap.saveAction.isAlive();
        if (!d) {
            return null
        }
    }
    var f = jMap.historyManager;
    var a = f && f.extractNode(this);
    this.setHyperlinkExecute(c);
    var b = f && f.extractNode(this);
    f && f.addToHistory(a, b);
    jMap.saveAction.editAction(this);
    jMap.fireActionListener(ACTIONS.ACTION_NODE_HYPER, this);
    jMap.setSaved(false)
};
jMindMapNode.prototype.setHyperlinkExecute = function(b) {
    if (b == null || b == "") {
        if (this.hyperlink) {
            var a = this.hyperlink.node.parentNode;
            var c = this.hyperlink.node.parentNode.parentNode;
            c.removeChild(a);
            this.hyperlink = null;
            this.CalcBodySize()
        }
        return
    }
    if (!this.hyperlink) {
        this.hyperlink = RAPHAEL.image(jMap.cfg.contextPath + "/images/hyperlink.png", 0, 0, 11, 11);
        if (Raphael.svg) {
            this.groupEl.appendChild(this.hyperlink.node)
        }
        if (Raphael.vml) {
            this.groupEl.appendChild(this.hyperlink.Group)
        }
        this.hyperlink.attr({
            cursor: "pointer"
        })
    }
    this.hyperlink.attr({
        href: b,
        target: "blank"
    });
    
    this.CalcBodySize();
    jMap.resolveRendering()
};
jMindMapNode.prototype.setImage = function(c, d, a) {
    if (jMap.cfg.realtimeSave) {
        var f = jMap.saveAction.isAlive();
        if (!f) {
            return null
        }
    }
    var g = jMap.historyManager;
    var b = g && g.extractNode(this);
    this.setImageExecute(c, d, a, function() {
        var h = g && g.extractNode(this);
        g && g.addToHistory(b, h);
        jMap.saveAction.editAction(this);
        jMap.fireActionListener(ACTIONS.ACTION_NODE_IMAGE, this.id, c, d, a);
        jMap.setSaved(false)
    })
};
jMindMapNode.prototype.setImageExecute = function(c, f, b, a) {
    if (c == null || c == "") {
        if (this.img) {
            this.img.remove();
            this.img = null;
            this.imgInfo = {};
            this.CalcBodySize();
            a && a.call(this)
        }
        return false
    }
    var g = this;
    var d = $("<img />").attr("src", c).load(function() {
        var k = jMap.cfg.default_img_size;
        var h = {
            width: 0,
            height: 0
        };
        if (this.width > k) {
            h.width = k;
            h.height = (this.height * k) / this.width
        } else {
            h.width = this.width;
            h.height = this.height
        }
        if (f) {
            h.width = f
        }
        if (b) {
            h.height = b
        }
        h.width = parseInt(h.width);
        h.height = parseInt(h.height);
        if (g.img) {
            g.img.attr({
                src: this.src,
                width: h.width,
                height: h.height
            });
            g.imgInfo.href = this.src;
            g.imgInfo.width = h.width;
            g.imgInfo.height = h.height
        } else {
            g.img = RAPHAEL.image(this.src, 0, 0, h.width, h.height);
            g.imgInfo.href = this.src;
            g.imgInfo.width = h.width;
            g.imgInfo.height = h.height;
            if (Raphael.svg) {
                g.groupEl.appendChild(g.img.node)
            }
            if (Raphael.vml) {
                g.groupEl.appendChild(g.img.Group)
            }
        }
        g.getParent() && g.getParent().folded && g.img.hide();
        g.CalcBodySize();
        jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
        jMap.loadManager.updateImageLoading(this);
        a && a.call(g);
        return true
    }).error(function() {
        if (g.img) {
            g.img.attr({
                src: jMap.cfg.contextPath + "/images/image_broken.png",
                width: 64,
                height: 64
            });
            g.imgInfo.href = c;
            g.imgInfo.width = f && f;
            g.imgInfo.height = b && b
        } else {
            g.img = RAPHAEL.image(jMap.cfg.contextPath + "/images/image_broken.png", 0, 0, 64, 64);
            g.imgInfo.href = c;
            g.imgInfo.width = f && f;
            g.imgInfo.height = b && b;
            if (Raphael.svg) {
                g.groupEl.appendChild(g.img.node)
            }
            if (Raphael.vml) {
                g.groupEl.appendChild(g.img.Group)
            }
        }
        g.getParent() && g.getParent().folded && g.img.hide();
        g.CalcBodySize();
        jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
        jMap.loadManager.updateImageLoading(this);
        a && a.call(g)
    });
    jMap.loadManager.updateImageLoading(d[0])
};
jMindMapNode.prototype.imageResize = function(d, a) {
    if (jMap.cfg.realtimeSave) {
        var f = jMap.saveAction.isAlive();
        if (!f) {
            return null
        }
    }
    var g = jMap.historyManager;
    var b = g && g.extractNode(this);
    this.imageResizeExecute(d, a);
    var c = g && g.extractNode(this);
    g && g.addToHistory(b, c);
    jMap.saveAction.editAction(this);
    jMap.fireActionListener(ACTIONS.ACTION_NODE_IMAGE, this.id, null, d, a);
    jMap.setSaved(false)
};
jMindMapNode.prototype.imageResizeExecute = function(b, a) {
    this.img && this.img.attr({
        width: b,
        height: a
    });
    this.imgInfo.width = b;
    this.imgInfo.height = a;
    this.CalcBodySize();
    jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(this);
    jMap.layoutManager.layout(true)
};
jMindMapNode.prototype.setForeignObject = function(d, f, a) {
    if (jMap.cfg.realtimeSave) {
        var g = jMap.saveAction.isAlive();
        if (!g) {
            return null
        }
    }
    var h = jMap.historyManager;
    var b = h && h.extractNode(this);
    this.setForeignObjectExecute(d, f, a);
    var c = h && h.extractNode(this);
    h && h.addToHistory(b, c);
    jMap.saveAction.editAction(this);
    jMap.fireActionListener(ACTIONS.ACTION_NODE_FOREIGNOBJECT, this, d, f, a);
    jMap.setSaved(false)
};
jMindMapNode.prototype.setForeignObjectExecute = function(b, c, a) {
    if (!Raphael.svg) {
        return false
    }
    if (b == null || b == "") {
        this.groupEl.removeChild(this.foreignObjEl);
        this.foreignObjEl = null;
        this.CalcBodySize();
        return false
    }
    if (!this.foreignObjEl) {
        this.foreignObjEl = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        this.foreignObjEl.bodyEl = document.createElementNS("http://www.w3.org/1999/xhtml", "body");
        this.foreignObjEl.appendChild(this.foreignObjEl.bodyEl);
        this.groupEl.appendChild(this.foreignObjEl);
        this.foreignObjEl.setAttribute("x", this.body.getBBox().x);
        this.foreignObjEl.setAttribute("y", this.body.getBBox().y)
    }
    c && this.foreignObjEl.setAttribute("width", c);
    a && this.foreignObjEl.setAttribute("height", a);
    this.foreignObjEl.bodyEl.innerHTML = b;
    this.foreignObjEl.plainHtml = b;
    if (BrowserDetect.browser == "MSIE") {
        var d = b.search(/youtube\.com/);
        if (d != -1) {
            this.foreignObjEl.bodyEl.innerHTML = '<img src="' + jMap.cfg.contextPath + '/images/video_not_support.png" width="300" height="300"/>'
        }
    }
    this.CalcBodySize()
};
jMindMapNode.prototype.foreignObjectResize = function(d, a) {
    if (jMap.cfg.realtimeSave) {
        var f = jMap.saveAction.isAlive();
        if (!f) {
            return null
        }
    }
    var g = jMap.historyManager;
    var b = g && g.extractNode(this);
    this.foreignObjectResizeExecute(d, a);
    var c = g && g.extractNode(this);
    g && g.addToHistory(b, c);
    jMap.saveAction.editAction(this);
    jMap.fireActionListener(ACTIONS.ACTION_NODE_FOREIGNOBJECT, this, null, d, a);
    jMap.setSaved(false)
};
jMindMapNode.prototype.foreignObjectResizeExecute = function(c, a) {
    c && this.foreignObjEl.setAttribute("width", c);
    a && this.foreignObjEl.setAttribute("height", a);
    var b = this.foreignObjEl.plainHtml;
    b = b.replace(/(width=")([^"]*)/ig, "$1" + c);
    b = b.replace(/(height=")([^"]*)/ig, "$1" + a);
    this.foreignObjEl.bodyEl.innerHTML = b;
    this.foreignObjEl.plainHtml = b;
    this.CalcBodySize();
    jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(this);
    jMap.layoutManager.layout(true)
};
jMindMapNode.prototype.fix_flash = function(b) {
    var a = b.getElementsByTagName("embed");
    for (i = 0; i < a.length; i++) {
        embed = a[i];
        var k;
        if (embed.outerHTML) {
            var g = embed.outerHTML;
            if (g.match(/wmode\s*=\s*('|")[a-zA-Z]+('|")/i)) {
                k = g.replace(/wmode\s*=\s*('|")window('|")/i, "wmode='transparent'")
            } else {
                k = g.replace(/<embed\s/i, "<embed wmode='transparent' ")
            }
            embed.insertAdjacentHTML("beforeBegin", k);
            embed.parentNode.removeChild(embed)
        } else {
            k = embed.cloneNode(true);
            if (!k.getAttribute("wmode") || k.getAttribute("wmode").toLowerCase() == "window") {
                k.setAttribute("wmode", "transparent")
            }
            embed.parentNode.replaceChild(k, embed)
        }
    }
    var l = b.getElementsByTagName("object");
    for (i = 0; i < l.length; i++) {
        object = l[i];
        var f;
        if (object.outerHTML) {
            var g = object.outerHTML;
            if (g.match(/<param\s+name\s*=\s*('|")wmode('|")\s+value\s*=\s*('|")[a-zA-Z]+('|")\s*\/?\>/i)) {
                f = g.replace(/<param\s+name\s*=\s*('|")wmode('|")\s+value\s*=\s*('|")window('|")\s*\/?\>/i, "<param name='wmode' value='transparent' />")
            } else {
                f = g.replace(/<\/object\>/i, "<param name='wmode' value='transparent' />\n</object>")
            }
            var c = object.childNodes;
            for (j = 0; j < c.length; j++) {
                try {
                    if (c[j] != null) {
                        var h = c[j].getAttribute("name");
                        if (h != null && h.match(/flashvars/i)) {
                            f = f.replace(/<param\s+name\s*=\s*('|")flashvars('|")\s+value\s*=\s*('|")[^'"]*('|")\s*\/?\>/i, "<param name='flashvars' value='" + c[j].getAttribute("value") + "' />")
                        }
                    }
                } catch (d) {}
            }
            object.insertAdjacentHTML("beforeBegin", f);
            object.parentNode.removeChild(object)
        }
    }
};
jMindMapNode.prototype.setEmbedVideo = function(d) {
    var f = /width?=?["']([^"']*)/gi;
    var c = f.exec(d)[1];
    var b = /height?=?["']([^"']*)/gi;
    var a = b.exec(d)[1];
    this.setForeignObject(d, c, a)
};
jMindMapNode.prototype.setVideo = function(f, c, a) {
    var d = jMap.cfg.default_video_size;
    var b = '<embed src="' + f + '" width="' + c + '"  height="' + a + '"></embed>';
    this.setHyperlink(f);
    this.setForeignObject(b, c, a)
};
jMindMapNode.prototype.setYoutubeVideo = function(k, g, a) {
    var h = jMap.cfg.default_video_size;
    if (g == null) {
        g = h
    }
    if (a == null) {
        a = h
    }
    var f = /v[=\/]([^&]*)/ig;
    var c = f.exec(k);
    if (c) {
        var b = "https://www.youtube.com/embed/" + c[1];
        var d = '<iframe src="' + b + '" frameborder="0" allowtransparency="true" width="' + g + '"  height="' + a + '" scrolling="no"></iframe>';
        this.setHyperlink(k);
        this.setForeignObject(d, g, a)
    }
};
jMindMapNode.prototype.getShift = function() {
    try {
        if (this.getParent().getChildren().length == 0) {
            var a = parseInt(this.vshift) + parseInt(this.SHIFT);
            if (isNaN(a)) {
                a = 0
            }
            return a
        } else {
            return this.vshift
        }
    } catch (b) {
        return 0
    }
};
jMindMapNode.prototype.getLeftChildren = function() {
    var b = this.getChildren();
    var d = new Array();
    for (var a = 0; a < b.length; a++) {
        var c = b[a];
        if (c == null) {
            continue
        }
        if (c.isLeft()) {
            d.push(c)
        }
    }
    return d
};
jMindMapNode.prototype.getRightChildren = function() {
    var c = this.getChildren();
    var b = new Array();
    for (var a = 0; a < c.length; a++) {
        var d = c[a];
        if (d == null) {
            continue
        }
        if (!d.isLeft()) {
            b.push(d)
        }
    }
    return b
};
jMindMapNode.prototype.setRootTreeWidths = function(b, a) {
    this.leftTreeWidth = b - this.getSize().width;
    this.rightTreeWidth = a;
    this.setTreeWidth(this.leftTreeWidth + this.rightTreeWidth)
};
jMindMapNode.prototype.setTreeWidth = function(a) {
    this.treeWidth = a
};
jMindMapNode.prototype.getTreeWidth = function() {
    return this.treeWidth
};
jMindMapNode.prototype.setRootTreeHeights = function(b, a) {
    if (b > a) {
        this.setTreeHeight(b)
    } else {
        this.setTreeHeight(a)
    }
};
jMindMapNode.prototype.setTreeHeight = function(a) {
    this.treeHeight = a
};
jMindMapNode.prototype.getTreeHeight = function() {
    return this.treeHeight
};
jMindMapNode.prototype.getUpperChildShift = function() {
    return this.upperChildShift
};
jMindMapNode.prototype.setRootUpperChildShift = function(b, a) {
    this.setUpperChildShift(Math.max(b, a))
};
jMindMapNode.prototype.setUpperChildShift = function(a) {
    this.upperChildShift = a
};
jMindMapNode.prototype.toXML = function(m) {
    var g = new StringBuffer();
    var h = false;
    if (this.img != null || (this.text.attrs.text != null && this.text.attrs.text.indexOf("\n") != -1)) {
        h = true
    }
    var f = new StringBuffer();
    f.add("<node");
    f.add('CREATED="' + this.created + '"');
    f.add('ID="' + this.id + '"');
    f.add('MODIFIED="' + this.modified + '"');
    f.add('CREATOR="' + this.creator + '"');
    f.add('CLIENT_ID="' + this.client_id + '"');
    if (!h) {
        f.add('TEXT="' + convertCharStr2SelectiveCPs(convertCharStr2XML(this.text.attrs.text, true, true), "ascii", true, "&#x", ";", "hex") + '"')
    }
    f.add('FOLDED="' + this.folded + '"');
    if (this.background_color != "") {
        f.add('BACKGROUND_COLOR="' + this.background_color + '"')
    }
    if (this.color != "") {
        f.add('COLOR="' + this.color + '"')
    }
    if (this.hyperlink != null) {
        f.add('LINK="' + convertCharStr2XML(this.hyperlink.attr().href) + '"')
    }
    if (this.position != "" && this.position != "undefined") {
        f.add('POSITION="' + this.position + '"')
    }
    if (this.style != "") {
        f.add('STYLE="' + this.style + '"')
    }
    if (this.hgap != 0) {
        f.add('HGAP="' + this.hgap + '"')
    }
    if (this.vgap != 0) {
        f.add('VGAP="' + this.vgap + '"')
    }
    if (this.vshift != 0) {
        f.add('VSHIFT="' + this.vshift + '"')
    }
    if (this.numofchildren != null) {
        f.add('NUMOFCHILDREN="' + this.numofchildren + '"')
    }
    f.add(">");
    g.add(f.toString(" "));
    if (h) {
        var a = new StringBuffer();
        a.add('<richcontent TYPE="NODE"><html>\n');
        a.add("  <head>\n");
        a.add("\n");
        a.add("  </head>\n");
        a.add("  <body>\n");
        if (this.img != null) {
            a.add("    <p>\n");
            a.add('      <img src="' + this.imgInfo.href + '" width="' + this.imgInfo.width + '" height="' + this.imgInfo.height + '" />\n');
            a.add("    </p>\n")
        }
        if (this.text.attrs.text != null) {
            var l = JinoUtil.trimStr(this.text.attrs.text).split("\n");
            for (var k = 0; k < l.length; k++) {
                a.add("<p>" + convertCharStr2SelectiveCPs(convertCharStr2XML(l[k], true, true), "ascii", true, "&#x", ";", "hex") + "</p>\n")
            }
        }
        a.add("  </body>\n");
        a.add("</html>\n");
        a.add("</richcontent>");
        g.add(a.toString(" "))
    }
    if (this.arrowlinks.length > 0) {
        for (var k = 0; k < this.arrowlinks.length; k++) {
            g.add(this.arrowlinks[k].toXML())
        }
    }
    if (this.foreignObjEl) {
        var b = new StringBuffer();
        b.add('<foreignObject WIDTH="' + this.foreignObjEl.getAttribute("width") + '" HEIGHT="' + this.foreignObjEl.getAttribute("height") + '">');
        b.add(convertCharStr2SelectiveCPs(this.foreignObjEl.plainHtml, "ascii", true, "&#x", ";", "hex"));
        b.add("</foreignObject>");
        g.add(b.toString(" "))
    }
    for (var n in this.attributes) {
        g.add("<attribute NAME='" + n + "' VALUE='" + convertCharStr2SelectiveCPs(convertCharStr2XML("" + this.attributes[n], true, true), "ascii", true, "&#x", ";", "hex") + "'/>")
    }
    var c = new StringBuffer();
    c.add("<info");
    if (this.lazycomplete) {
        c.add('LAZYCOMPLETE="' + this.lazycomplete + '"')
    }
    c.add("/>");
    g.add(c.toString(" "));
    var d = this.getChildren();
    if (d.length > 0 && m == null) {
        for (var k = 0; k < d.length; k++) {
            g.add(d[k].toXML())
        }
    }
    g.add("</node>");
    return g.toString("\n")
};
jMindMapNode.prototype.toString = function() {
    return "jMindMapNode"
};
jMindMapNode.prototype.initElements = function() {};
jMindMapNode.prototype.create = function() {};
jMindMapNode.prototype.getSize = function() {};
jMindMapNode.prototype.setSize = function(b, a) {};
jMindMapNode.prototype.getLocation = function() {};
jMindMapNode.prototype.setLocation = function(a, b) {};
jMindMapNode.prototype.CalcBodySize = function() {};
jMindMapNode.prototype.updateNodeShapesPos = function() {};
jMindMapNode.prototype.getInputPort = function() {};
jMindMapNode.prototype.getOutputPort = function() {};
jRect = function(f) {
    var b = f.parent;
    var d = f.text;
    var g = f.id;
    var c = f.index;
    var a = f.position;
    var l = f.line_color;
    jRect.superclass.call(this, b, d, g, c, a, l)
};
extend(jRect, jMindMapNode);
jRect.prototype.type = "jRect";
jRect.prototype.initElements = function() {
    this.body = RAPHAEL.rect();
    this.text = RAPHAEL.text();
    this.folderShape = RAPHAEL.circle(0, 0, FOLDER_RADIUS);
    this.wrapElements(this.body, this.text, this.folderShape)
};
jRect.prototype.create = function() {
    this.connection = null;
    switch (jMap.layoutManager.type) {
        case "jMindMapLayout":
            this.connection = this.parent && new jLineBezier(this.parent, this);
            break;
        case "jTreeLayout":
            this.connection = this.parent && new jLinePolygonal(this.parent, this);
            break;
        case "jTableLayout":
            break;
        case "jFishboneLayout":
            break;
        default:
            this.connection = this.parent && new jLineBezier(this.parent, this);
            break
    }
    var b = this.body;
    var h = this.text;
    var g = this.folderShape;
    b.attr({
        r: NODE_CORNER_ROUND,
        rx: NODE_CORNER_ROUND,
        ry: NODE_CORNER_ROUND
    });
    if (this.getParent()) {
        var f = this.getParent().getLocation();
        this.setLocation(f.x, f.y)
    }
    this.setBackgroundColorExecute(jMap.cfg.nodeDefalutColor);
    this.setTextColorExecute(jMap.cfg.textDefalutColor);
    this.setEdgeColorExecute(jMap.cfg.edgeDefalutColor, jMap.cfg.edgeDefalutWidth);
    var d = jMap.cfg.branchDefalutWidth;
    if (this.getDepth() == 1) {
        d = 8
    }
    //라인색
    this.setBranchColorExecute(jMap.cfg.branchDefalutColor, d, jMap.cfg.branchUserColor);
    if (typeof NodeColorMix !== "undefined") {
        NodeColorMix.rawDressColor(this)
    }
    var c = 400;
    var a = "Malgun Gothic, �������, Gulim, ����, Arial, sans-serif";
    if (!this.getParent()) {
        this.fontSize = jMap.cfg.nodeFontSizes[0];
        c = "700"
    } else {
        if (this.getParent() && this.getParent().isRootNode()) {
            this.fontSize = jMap.cfg.nodeFontSizes[1];
            c = "700"
        } else {
            this.fontSize = jMap.cfg.nodeFontSizes[2];
            c = "400"
        }
    }
    if (this.isRootNode()) {
        h.attr({
            "font-family": a,
            "font-size": this.fontSize,
            "font-weight": c
        })
    } else {
        h.attr({
            "font-family": a,
            "font-size": this.fontSize,
            "font-weight": c,
            "text-anchor": "start"
        })
    }
    this.setTextExecute(this.plainText)
};
jRect.prototype.getSize = function() {
    return {
        width: this.body.getBBox().width,
        height: this.body.getBBox().height
    }
};
jRect.prototype.setSize = function(b, a) {
    this.body.attr({
        width: b,
        height: a
    })
};
jRect.prototype.getLocation = function() {
    return {
        x: this.body.getBBox().x,
        y: this.body.getBBox().y
    }
};
jRect.prototype.setLocation = function(b, c) {
    var a = this.body;
    if (b && !c) {
        a.attr({
            x: b
        })
    } else {
        if (!b && c) {
            a.attr({
                y: c
            })
        } else {
            a.attr({
                x: b,
                y: c
            })
        }
    }
    this.updateNodeShapesPos()
};
jRect.prototype.CalcBodySize = function() {
    var f = 0;
    var a = 0;
    var b = TEXT_HGAP;
    var d = TEXT_VGAP;
    if (this.getText() != "") {
        f += this.text.getBBox().width;
        a += this.text.getBBox().height
    }
    if (this.img) {
        f = (f < this.img.getBBox().width) ? this.img.getBBox().width : f;
        a += this.img.getBBox().height
    }
    if (this.foreignObjEl) {
        var c = parseInt(this.foreignObjEl.getAttribute("width"));
        var g = parseInt(this.foreignObjEl.getAttribute("height"));
        f = (f < c) ? c : f;
        a += g
    }
    if (this.hyperlink) {
        f += this.hyperlink.getBBox().width + b / 2
    }
    if (f == 0 || a == 0) {
        this.text.attr({
            text: "_"
        });
        f += this.text.getBBox().width;
        a += this.text.getBBox().height;
        this.text.attr({
            text: ""
        })
    }
    this.setSize(f + b, a + d)
};
jRect.prototype.updateNodeShapesPos = function() {
    var k = TEXT_HGAP;
    var p = TEXT_VGAP;
    var l = 0;
    var o = this.body;
    var r = this.text;
    var d = this.folderShape;
    var z = this.img;
    var f = this.hyperlink;
    var c = this.foreignObjEl;
    var n = o.getBBox().x;
    var m = o.getBBox().y;
    var b = 0;
    var a = 0;
    switch (jMap.layoutManager.type) {
        case "jMindMapLayout":
            b = this.isLeft() ? n : n + this.body.getBBox().width;
            a = m + this.body.getBBox().height / 2;
            break;
        case "jTreeLayout":
            b = n + this.body.getBBox().width / 2;
            a = m + this.body.getBBox().height;
            break;
        case "jFishboneLayout":
            b = this.isLeft() ? n : n + this.body.getBBox().width;
            a = m + this.body.getBBox().height / 2;
            break;
        default:
            b = n;
            a = m;
            break
    }
    this.folderShape.attr({
        cx: b,
        cy: a
    });
    if (z) {
        var w = n + k / 2;
        var v = m + p / 2;
        if (this.isRootNode()) {
            w += (o.getBBox().width / 2) - (z.getBBox().width / 2) - k / 2
        }
        z.attr({
            x: w,
            y: v
        });
        l += z.getBBox().height
    }
    if (c) {
        var s = n + k / 2;
        var q = m + l + p / 2;
        l += parseInt(c.getAttribute("height"));
        c.setAttribute("x", s);
        c.setAttribute("y", q)
    }
    if (r) {
        var h = n + k / 2;
        var g = m + (p + r.getBBox().height) / 2;
        if (this.isRootNode()) {
            h += o.getBBox().width / 2 - k / 2
        }
        g += l;
        r.attr({
            x: h,
            y: g
        })
    }
    if (f) {
        var u = this.getLocation().x + this.getSize().width - f.getBBox().width - 3;
        var t = this.getLocation().y + (this.getSize().height - f.getBBox().height) / 2;
        f && f.attr({
            x: u,
            y: t
        })
    }
    this.connection && this.connection.updateLine()
};
jRect.prototype.getInputPort = function() {
    var a = this.body.getBBox();
    var b = 0;
    var c = 0;
    if (isFinite(a.width) && !isNaN(a.width)) {
        b = a.width
    }
    if (isFinite(a.height) && !isNaN(a.height)) {
        c = a.height
    }
    switch (jMap.layoutManager.type) {
        case "jMindMapLayout":
            if (this.isRootNode()) {
                return {
                    x: a.x + b / 2,
                    y: a.y + c / 2
                }
            }
            if (this.isLeft && this.isLeft()) {
                return {
                    x: a.x + b + 1,
                    y: a.y + c / 2
                }
            } else {
                return {
                    x: a.x - 1,
                    y: a.y + c / 2
                }
            }
            break;
        case "jTreeLayout":
            if (this.isRootNode()) {
                return {
                    x: a.x + b / 2,
                    y: a.y + c
                }
            }
            return {
                x: a.x + b / 2,
                y: a.y
            };
            break;
        case "jRotateLayout":
            if (this.isRootNode()) {
                return {
                    x: a.x + b / 2,
                    y: a.y + c / 2
                }
            }
            if (this.isLeft && this.isLeft()) {
                return {
                    x: a.x - 1,
                    y: a.y + c / 2
                }
            } else {
                return {
                    x: a.x - 1,
                    y: a.y + c / 2
                }
            }
            break;
        case "jTableLayout":
            if (this.isRootNode()) {
                return {
                    x: a.x + b / 2,
                    y: a.y + c
                }
            }
            return {
                x: a.x + b / 2,
                y: a.y
            };
            break;
        case "jFishboneLayout":
            if (this.isRootNode()) {
                return {
                    x: a.x + b / 2,
                    y: a.y + c / 2
                }
            }
            if (this.isLeft && this.isLeft()) {
                return {
                    x: a.x + b + 1,
                    y: a.y + c / 2
                }
            } else {
                return {
                    x: a.x - 1,
                    y: a.y + c / 2
                }
            }
            break;
        default:
            return {
                x: a.x,
                y: a.y
            };
            break
    }
};
jRect.prototype.getOutputPort = function() {
    var a = this.body.getBBox();
    var b = 0;
    var c = 0;
    if (isFinite(a.width) && !isNaN(a.width)) {
        b = a.width
    }
    if (isFinite(a.height) && !isNaN(a.height)) {
        c = a.height
    }
    switch (jMap.layoutManager.type) {
        case "jMindMapLayout":
            if (this.isRootNode()) {
                return {
                    x: a.x + b / 2,
                    y: a.y + c / 2
                }
            }
            if (this.isLeft()) {
                return {
                    x: a.x - 1,
                    y: a.y + c / 2
                }
            } else {
                return {
                    x: a.x + b + 1,
                    y: a.y + c / 2
                }
            }
            break;
        case "jTreeLayout":
            return {
                x: a.x + b / 2,
                y: a.y + c
            };
            break;
        case "jRotateLayout":
            if (this.isRootNode()) {
                return {
                    x: a.x + b / 2,
                    y: a.y + c / 2
                }
            }
            if (this.isLeft && this.isLeft()) {
                return {
                    x: a.x + b + 1,
                    y: a.y + c / 2
                }
            } else {
                return {
                    x: a.x + b + 1,
                    y: a.y + c / 2
                }
            }
            break;
        case "jTableLayout":
            return {
                x: a.x + b / 2,
                y: a.y + c
            };
            break;
        case "jFishboneLayout":
            if (this.isRootNode()) {
                return {
                    x: a.x + b / 2,
                    y: a.y + c / 2
                }
            }
            if (this.isLeft()) {
                return {
                    x: a.x - 1,
                    y: a.y + c / 2
                }
            } else {
                return {
                    x: a.x + b + 1,
                    y: a.y + c / 2
                }
            }
            break;
        default:
            return {
                x: a.x,
                y: a.y
            };
            break
    }
};
jRect.prototype.toString = function() {
    return "jRect"
};
jEllipse = function(b, d, f, c, a) {
    jEllipse.superclass.call(this, b, d, f, c, a)
};
extend(jEllipse, jMindMapNode);
jEllipse.prototype.type = "jEllipse";
jEllipse.prototype.initElements = function() {
    this.body = RAPHAEL.ellipse();
    this.text = RAPHAEL.text();
    this.folderShape = RAPHAEL.circle(0, 0, FOLDER_RADIUS);
    this.wrapElements(this.body, this.text, this.folderShape)
};
jEllipse.prototype.create = function() {
    this.connection = this.parent && new jLineBezier(this.parent, this);
    var b = this.body;
    var g = this.text;
    var f = this.folderShape;
    this.setBackgroundColorExecute(jMap.cfg.nodeDefalutColor);
    this.setEdgeColorExecute(jMap.cfg.edgeDefalutColor, 1);
    var c = 400;
    var a = "Malgun Gothic, �������, Gulim, ����, Arial, sans-serif";
    var d = "#000";
    if (!this.getParent()) {
        this.fontSize = jMap.cfg.nodeFontSizes[0];
        c = "bold"
    } else {
        if (this.getParent() && this.getParent().isRootNode()) {
            this.fontSize = jMap.cfg.nodeFontSizes[1];
            c = "bold"
        } else {
            this.fontSize = jMap.cfg.nodeFontSizes[2];
            c = "normal"
        }
    }
    if (this.isRootNode()) {
        g.attr({
            "font-family": a,
            "font-size": this.fontSize,
            "font-weight": c,
            fill: d
        })
    } else {
        g.attr({
            "font-family": a,
            "font-size": this.fontSize,
            "font-weight": c,
            "text-anchor": "start",
            fill: d
        })
    }
    this.setTextExecute(this.plainText)
};
jEllipse.prototype.getSize = function() {
    return {
        width: this.body.getBBox().width,
        height: this.body.getBBox().height
    }
};
jEllipse.prototype.setSize = function(b, a) {
    this.body.attr({
        rx: b / 2,
        ry: a / 2
    })
};
jEllipse.prototype.getLocation = function() {
    return {
        x: this.body.getBBox().x,
        y: this.body.getBBox().y
    }
};
jEllipse.prototype.setLocation = function(b, c) {
    var a = this.body;
    a.attr({
        cx: b + this.body.getBBox().width / 2,
        cy: c + this.body.getBBox().height / 2
    });
    this.updateNodeShapesPos()
};
jEllipse.prototype.CalcBodySize = function() {
    var b = 0;
    var a = 0;
    var c = false;
    if (this.getText() == "") {
        this.text.attr({
            text: "_"
        });
        var c = true
    }
    b += this.text.getBBox().width;
    a += this.text.getBBox().height;
    if (c) {
        this.text.attr({
            text: ""
        })
    }
    if (this.img) {
        b = (b < this.img.getBBox().width) ? this.img.getBBox().width : b;
        a += this.img.getBBox().height
    }
    if (this.hyperlink) {
        b += this.hyperlink.getBBox().width + TEXT_HGAP / 2
    }
    this.setSize(b + TEXT_HGAP, a + TEXT_VGAP)
};
jEllipse.prototype.updateNodeShapesPos = function() {
    var f = this.body;
    var o = this.text;
    var r = this.folderShape;
    var c = this.img;
    var l = this.hyperlink;
    var k = f.getBBox().x;
    var h = f.getBBox().y;
    var q = this.isLeft() ? k : k + this.body.getBBox().width;
    var n = h + this.body.getBBox().height / 2;
    this.folderShape.attr({
        cx: q,
        cy: n
    });
    var g = k + TEXT_HGAP / 2;
    var d = h + TEXT_VGAP / 2;
    c && c.attr({
        x: g,
        y: d
    });
    var b = k + TEXT_HGAP / 2;
    if (this.isRootNode()) {
        b += o.getBBox().width / 2
    }
    var a = h + (o.getBBox().height + TEXT_VGAP) / 2;
    a += c && c.getBBox().height;
    o.attr({
        x: b,
        y: a
    });
    var p = k + TEXT_HGAP;
    if (c) {
        p += (o.getBBox().width > c.getBBox().width) ? o.getBBox().width : c.getBBox().width
    } else {
        p += o.getBBox().width
    }
    var m = h + o.getBBox().height / 2;
    m += c && c.getBBox().height / 2;
    l && l.attr({
        x: p,
        y: m
    });
    this.connection && this.connection.updateLine()
};
jEllipse.prototype.getInputPort = function() {
    var a = this.body.getBBox();
    var b = 0;
    var c = 0;
    if (isFinite(a.width) && !isNaN(a.width)) {
        b = a.width
    }
    if (isFinite(a.height) && !isNaN(a.height)) {
        c = a.width
    }
    if (this.isLeft && this.isLeft()) {
        return {
            x: a.x + b + 1,
            y: a.y + c / 2
        }
    } else {
        return {
            x: a.x - 1,
            y: a.y + c / 2
        }
    }
};
jEllipse.prototype.getOutputPort = function() {
    var a = this.body.getBBox();
    var b = 0;
    var c = 0;
    if (isFinite(a.width) && !isNaN(a.width)) {
        b = a.width
    }
    if (isFinite(a.height) && !isNaN(a.height)) {
        c = a.width
    }
    if (this.isLeft && this.isLeft()) {
        return {
            x: a.x - 1,
            y: a.y + c / 2
        }
    } else {
        return {
            x: a.x + b + 1,
            y: a.y + c / 2
        }
    }
};
jEllipse.prototype.toString = function() {
    return "jEllipse"
};
jCustom = function(b, d, f, c, a) {
    jCustom.superclass.call(this, b, d, f, c, a)
};
extend(jCustom, jNode);
jCustom.prototype.type = "jCustom";
jCustom.prototype.initElements = function() {
    this.body = RAPHAEL.path();
    this.text = RAPHAEL.text();
    this.folderShape = RAPHAEL.circle(0, 0, FOLDER_RADIUS);
    this.wrapElements(this.body, this.text, this.folderShape)
};
jCustom.prototype.create = function() {
    this.connection = null;
    switch (jMap.layoutManager.type) {
        case "jMindMapLayout":
            break;
        case "jTreeLayout":
            break;
        case "jTableLayout":
            break;
        default:
            break
    }
    var b = this.body;
    var h = this.text;
    var g = this.folderShape;
    this.width = 0;
    this.height = 0;
    this.x = 0;
    this.y = 0;
    if (this.getParent()) {
        var d = this.getParent().getLocation();
        this.setLocation(d.x, d.y)
    }
    this.setBackgroundColorExecute(jMap.cfg.nodeDefalutColor);
    this.setEdgeColorExecute(jMap.cfg.edgeDefalutColor, 1);
    var c = 400;
    var a = "Malgun Gothic, �������, Gulim, ����, Arial, sans-serif";
    var f = "#000";
    if (!this.getParent()) {
        this.fontSize = jMap.cfg.nodeFontSizes[0];
        c = "700"
    } else {
        if (this.getParent() && this.getParent().isRootNode()) {
            this.fontSize = jMap.cfg.nodeFontSizes[1];
            c = "700"
        } else {
            this.fontSize = jMap.cfg.nodeFontSizes[2];
            c = "400"
        }
    }
    if (this.isRootNode()) {
        h.attr({
            "font-family": a,
            "font-size": this.fontSize,
            "font-weight": c,
            fill: f
        })
    } else {
        h.attr({
            "font-family": a,
            "font-size": this.fontSize,
            "font-weight": c,
            "text-anchor": "start",
            fill: f
        })
    }
    this.setTextExecute(this.plainText)
};
jCustom.prototype.getSize = function() {
    return {
        width: this.width,
        height: this.height
    }
};
jCustom.prototype.setSize = function(b, a) {
    this.width = b;
    this.height = a
};
jCustom.prototype.getLocation = function() {
    return {
        x: this.x,
        y: this.y
    }
};
jCustom.prototype.setLocation = function(a, b) {
    if (a && !b) {
        this.x = a
    } else {
        if (!a && b) {
            this.y = b
        } else {
            this.x = a;
            this.y = b
        }
    }
    this.updateNodeShapesPos()
};
jCustom.prototype.CalcBodySize = function() {
    var f = 0;
    var a = 0;
    var b = TEXT_HGAP;
    var d = TEXT_VGAP;
    var h = false;
    if (this.getText() == "") {
        this.text.attr({
            text: "_"
        });
        var h = true
    }
    f += this.text.getBBox().width;
    a += this.text.getBBox().height;
    if (h) {
        this.text.attr({
            text: ""
        })
    }
    if (this.img) {
        f = (f < this.img.getBBox().width) ? this.img.getBBox().width : f;
        a += this.img.getBBox().height
    }
    if (this.foreignObjEl) {
        var c = parseInt(this.foreignObjEl.getAttribute("width"));
        var g = parseInt(this.foreignObjEl.getAttribute("height"));
        f = (f < c) ? c : f;
        a += g
    }
    if (this.hyperlink) {
        f += this.hyperlink.getBBox().width + b / 2
    }
    this.setSize(f + b, a + d)
};
jCustom.prototype.updateNodeShapesPos = function() {
    var l = TEXT_HGAP;
    var q = TEXT_VGAP;
    var m = 0;
    var p = this.body;
    var t = this.text;
    var f = this.folderShape;
    var C = this.img;
    var g = this.hyperlink;
    var c = this.foreignObjEl;
    var o = this.x;
    var n = this.y;
    var w = this.width;
    var u = this.height;
    var b = 0;
    var a = 0;
    switch (jMap.layoutManager.type) {
        case "jMindMapLayout":
            b = this.isLeft() ? o : o + w;
            a = n + u / 2;
            break;
        case "jTreeLayout":
            b = o + w / 2;
            a = n + u;
            break;
        default:
    }
    this.folderShape.attr({
        cx: b,
        cy: a
    });
    if (C) {
        var B = o + l / 2;
        var A = n + q / 2;
        if (this.isRootNode()) {
            B += (w / 2) - (C.getBBox().width / 2) - l / 2
        }
        C.attr({
            x: B,
            y: A
        });
        m += C.getBBox().height
    }
    if (c) {
        var s = o + l / 2;
        var r = n + m + q / 2;
        m += parseInt(c.getAttribute("height"));
        c.setAttribute("x", s);
        c.setAttribute("y", r)
    }
    if (t) {
        var k = o + l / 2;
        var h = n + (q + t.getBBox().height) / 2;
        if (this.isRootNode()) {
            k += w / 2 - l / 2
        }
        h += m;
        t.attr({
            x: k,
            y: h
        })
    }
    if (g) {
        var z = o + l;
        var d = t.getBBox().width;
        if (C) {
            z += (d > C.getBBox().width) ? d : C.getBBox().width
        } else {
            z += d
        }
        var v = n + t.getBBox().height / 2;
        v += C && C.getBBox().height / 2;
        g && g.attr({
            x: z,
            y: v
        })
    }
    this.connection && this.connection.updateLine();
    this.updateBody()
};
jCustom.prototype.getInputPort = function() {
    var a = this.body.getBBox();
    var b = 0;
    var c = 0;
    if (isFinite(a.width) && !isNaN(a.width)) {
        b = a.width
    }
    if (isFinite(a.height) && !isNaN(a.height)) {
        c = a.height
    }
    switch (jMap.layoutManager.type) {
        case "jMindMapLayout":
            if (this.isRootNode()) {
                return {
                    x: a.x + b / 2,
                    y: a.y + c / 2
                }
            }
            if (this.isLeft()) {
                return {
                    x: a.x + b + 1,
                    y: a.y + c / 2
                }
            } else {
                return {
                    x: a.x - 1,
                    y: a.y + c / 2
                }
            }
            break;
        case "jTreeLayout":
            if (this.isRootNode()) {
                return {
                    x: a.x + b / 2,
                    y: a.y + c
                }
            }
            return {
                x: a.x + b / 2,
                y: a.y
            };
            break;
        case "jRotateLayout":
            if (this.isRootNode()) {
                return {
                    x: a.x + b / 2,
                    y: a.y + c / 2
                }
            }
            if (this.isLeft()) {
                return {
                    x: a.x - 1,
                    y: a.y + c / 2
                }
            } else {
                return {
                    x: a.x - 1,
                    y: a.y + c / 2
                }
            }
            break;
        case "jTableLayout":
            if (this.isRootNode()) {
                return {
                    x: a.x + b / 2,
                    y: a.y + c
                }
            }
            return {
                x: a.x + b / 2,
                y: a.y
            };
            break;
        default:
    }
};
jCustom.prototype.getOutputPort = function() {
    var a = this.body.getBBox();
    var b = 0;
    var c = 0;
    if (isFinite(a.width) && !isNaN(a.width)) {
        b = a.width
    }
    if (isFinite(a.height) && !isNaN(a.height)) {
        c = a.height
    }
    switch (jMap.layoutManager.type) {
        case "jMindMapLayout":
            if (this.isRootNode()) {
                return {
                    x: a.x + b / 2,
                    y: a.y + c / 2
                }
            }
            if (this.isLeft()) {
                return {
                    x: a.x - 1,
                    y: a.y + c / 2
                }
            } else {
                return {
                    x: a.x + b + 1,
                    y: a.y + c / 2
                }
            }
            break;
        case "jTreeLayout":
            return {
                x: a.x + b / 2,
                y: a.y + c
            };
            break;
        case "jRotateLayout":
            if (this.isRootNode()) {
                return {
                    x: a.x + b / 2,
                    y: a.y + c / 2
                }
            }
            if (this.isLeft()) {
                return {
                    x: a.x + b + 1,
                    y: a.y + c / 2
                }
            } else {
                return {
                    x: a.x + b + 1,
                    y: a.y + c / 2
                }
            }
            break;
        case "jTableLayout":
            return {
                x: a.x + b / 2,
                y: a.y + c
            };
            break;
        default:
    }
};
jCustom.prototype.toString = function() {
    return "jCustom"
};
jCustom.prototype.updateBody = function() {};
jFishNode = function(f) {
    var b = f.parent;
    var d = f.text;
    var g = f.id;
    var c = f.index;
    var a = f.position;
    jFishNode.superclass.call(this, b, d, g, c, a)
};
extend(jFishNode, jMindMapNode);
jFishNode.prototype.type = "jFishNode";
jFishNode.prototype.initElements = function() {
    this.body = RAPHAEL.rect();
    this.text = RAPHAEL.text();
    this.folderShape = RAPHAEL.circle(0, 0, FOLDER_RADIUS);
    this.head = RAPHAEL.path();
    this.vertebra = RAPHAEL.path();
    this.tail = RAPHAEL.path();
    this.angle = 90;
    this.wrapElements(this.body, this.text, this.folderShape, this.head, this.vertebra, this.tail)
};
jFishNode.prototype.create = function() {
    this.connection = this.parent && new jLineFish(this.parent, this);
    var b = this.body;
    var g = this.text;
    var f = this.folderShape;
    if (this.getParent()) {
        var d = this.getParent().getLocation();
        this.setLocation(d.x, d.y)
    }
    b.attr({
        opacity: 0
    });
    this.setEdgeColorExecute(jMap.cfg.edgeDefalutColor, 1);
    this.head.attr({
        stroke: jMap.cfg.edgeDefalutColor
    });
    this.vertebra.attr({
        stroke: jMap.cfg.edgeDefalutColor
    });
    this.tail.attr({
        stroke: jMap.cfg.edgeDefalutColor
    });
    var c = 400;
    var a = "Arial, Gulim, ����";
    if (!this.getParent()) {
        this.fontSize = jMap.cfg.nodeFontSizes[0];
        c = "700"
    } else {
        if (this.getParent() && this.getParent().isRootNode()) {
            this.fontSize = jMap.cfg.nodeFontSizes[1];
            c = "700"
        } else {
            this.fontSize = jMap.cfg.nodeFontSizes[2];
            c = "400"
        }
    }
    if (this.isRootNode()) {
        g.attr({
            "font-family": a,
            "font-size": this.fontSize,
            "font-weight": c
        })
    } else {
        g.attr({
            "font-family": a,
            "font-size": this.fontSize,
            "font-weight": c,
            "text-anchor": "start"
        })
    }
    this.setTextExecute(this.plainText)
};
jFishNode.prototype.getSize = function() {
    var b = this.body.getBBox().height;
    var a = this.body.getBBox().width;
    if (this.isVertical()) {
        return {
            width: b * Math.abs(Math.sin(Math.PI * this.angle / 180)) + a * Math.abs(Math.cos(Math.PI * this.angle / 180)),
            height: a * Math.abs(Math.sin(Math.PI * this.angle / 180)) + b * Math.abs(Math.cos(Math.PI * this.angle / 180))
        }
    } else {
        return {
            width: this.body.getBBox().width,
            height: this.body.getBBox().height
        }
    }
};
jFishNode.prototype.setSize = function(b, a) {
    this.body.attr({
        width: b,
        height: a
    })
};
jFishNode.prototype.getLocation = function() {
    return {
        x: this.body.getBBox().x,
        y: this.body.getBBox().y
    }
};
jFishNode.prototype.setLocation = function(b, c) {
    var a = this.body;
    if (b && !c) {
        a.attr({
            x: b
        })
    } else {
        if (!b && c) {
            a.attr({
                y: c
            })
        } else {
            a.attr({
                x: b,
                y: c
            })
        }
    }
    this.updateNodeShapesPos()
};
jFishNode.prototype.CalcBodySize = function() {
    var f = 0;
    var a = 0;
    var b = TEXT_HGAP;
    var d = TEXT_VGAP;
    var h = false;
    if (this.getText() == "") {
        this.text.attr({
            text: "_"
        });
        var h = true
    }
    f += this.text.getBBox().width;
    a += this.text.getBBox().height;
    if (h) {
        this.text.attr({
            text: ""
        })
    }
    if (this.img) {
        f = (f < this.img.getBBox().width) ? this.img.getBBox().width : f;
        a += this.img.getBBox().height
    }
    if (this.foreignObjEl) {
        var c = parseInt(this.foreignObjEl.getAttribute("width"));
        var g = parseInt(this.foreignObjEl.getAttribute("height"));
        f = (f < c) ? c : f;
        a += g
    }
    if (this.hyperlink) {
        f += this.hyperlink.getBBox().width + b / 2
    }
    this.setSize(f + b, a + d);
    this.updateNodeShapesPos()
};
jFishNode.prototype.updateNodeShapesPos = function() {
    var p = TEXT_HGAP;
    var z = TEXT_VGAP;
    var q = 0;
    var v = this.body;
    var B = this.text;
    var l = this.folderShape;
    var K = this.img;
    var m = this.hyperlink;
    var g = this.foreignObjEl;
    var t = v.getBBox().x;
    var s = v.getBBox().y;
    var d = this.getOutputPort();
    var f = d.x;
    var c = d.y;
    this.folderShape.attr({
        cx: f,
        cy: c
    });
    if (K) {
        var I = t + p / 2;
        var G = s + z / 2;
        if (this.isRootNode()) {
            I += (v.getBBox().width / 2) - (K.getBBox().width / 2) - p / 2
        }
        K.attr({
            x: I,
            y: G
        });
        q += K.getBBox().height
    }
    if (g) {
        var C = t + p / 2;
        var A = s + q + z / 2;
        q += parseInt(g.getAttribute("height"));
        g.setAttribute("x", C);
        g.setAttribute("y", A)
    }
    if (B) {
        var o = t + p / 2;
        var n = s + (z + B.getBBox().height) / 2;
        if (this.isRootNode()) {
            o += v.getBBox().width / 2 - p / 2
        }
        n += q;
        B.attr({
            x: o,
            y: n
        })
    }
    if (m) {
        var F = t + p;
        var k = B.getBBox().width;
        if (K) {
            F += (k > K.getBBox().width) ? k : K.getBBox().width
        } else {
            F += k
        }
        var E = s + B.getBBox().height / 2;
        E += K && K.getBBox().height / 2;
        m && m.attr({
            x: F,
            y: E
        })
    }
    if (this.isRootNode()) {
        var r = this.getOutputPort();
        var u = this.getSize().width;
        var H = this.getSize().height;
        var D = ["M", r.x, r.y, "L", r.x, r.y - H, "A", u * 1.25, H * 1.5, 0, 0, 0, r.x - u - u / 4, r.y, "A", u * 1.25, H * 1.5, 0, 0, 0, r.x, r.y + H, "Z"].join(",");
        this.head.attr({
            path: D
        });
        var J = r.x + this.getTreeWidth() - this.getSize().width + 30;
        var b = ["M", r.x, r.y, "L", J, r.y, "Z"].join(",");
        this.vertebra.attr({
            path: b
        });
        var a = ["M", J, r.y, "L", J + H, r.y - H * 1.5, "A", H * 2, H * 3, 0, 0, 0, J + H, r.y + H * 1.5, "Z"].join(",");
        this.tail.attr({
            path: a
        });
        this.tail.attr({
            "stroke-width": 1
        })
    }
    this.connection && this.connection.updateLine()
};
jFishNode.prototype.getInputPort = function() {
    var a = this.body.getBBox();
    var b = 0;
    var c = 0;
    if (isFinite(a.width) && !isNaN(a.width)) {
        b = a.width
    }
    if (isFinite(a.height) && !isNaN(a.height)) {
        c = a.height
    }
    if (this.isRootNode()) {
        return {
            x: a.x + b,
            y: a.y + c / 2
        }
    } else {
        if (this.isVertical() && !this.isTopSide()) {
            return {
                x: a.x + b + 1,
                y: a.y + c
            }
        } else {
            return {
                x: a.x - 1,
                y: a.y + c
            }
        }
    }
};
jFishNode.prototype.getOutputPort = function() {
    var a = this.body.getBBox();
    var b = 0;
    var c = 0;
    if (isFinite(a.width) && !isNaN(a.width)) {
        b = a.width
    }
    if (isFinite(a.height) && !isNaN(a.height)) {
        c = a.height
    }
    if (this.isRootNode()) {
        return {
            x: a.x + b,
            y: a.y + c / 2
        }
    } else {
        if (this.isVertical() && !this.isTopSide()) {
            return {
                x: a.x,
                y: a.y + c
            }
        } else {
            return {
                x: a.x + b,
                y: a.y + c
            }
        }
    }
};
jFishNode.prototype.isTopSide = function() {
    if (this.isRootNode()) {
        return false
    }
    var a = this.getDepth();
    if (a == 1) {
        return this.getIndexPos() % 2 == 0
    } else {
        return this.getParent().isTopSide()
    }
};
jFishNode.prototype.isVertical = function() {
    var a = this.getDepth();
    return a % 2 == 1
};
jFishNode.prototype.focus = function(a) {
    var c = jMap.getSelecteds();
    if (a) {
        for (var b = c.length - 1; b >= 0; b--) {
            c[b].blur()
        }
    }
    if (!c.contains(this)) {
        c.push(this);
        this.connection && this.connection.line.animate({
            stroke: jMap.cfg.nodeSelectedColor,
            "stroke-width": 3
        }, 300)
    }
    jMap.fireActionListener(ACTIONS.ACTION_NODE_SELECTED, this);
    jMap.work.focus()
};
jFishNode.prototype.blur = function() {
    var a = jMap.getSelecteds();
    if (a.contains(this)) {
        a.remove(this);
        this.connection && this.connection.line.animate({
            fill: this.background_color,
            stroke: this.branch.color,
            "stroke-width": this.branch.width
        }, 300)
    }
};
jFishNode.prototype.toString = function() {
    return "jFishNode"
};
jBrainNode = function(f) {
    var b = f.parent;
    var d = f.text;
    var g = f.id;
    var c = f.index;
    var a = f.position;
    jBrainNode.superclass.call(this, b, d, g, c, a)
};
extend(jBrainNode, jCustom);
jBrainNode.prototype.type = "jBrainNode";
jBrainNode.prototype.updateBody = function() {
    var b = this.x;
    var h = this.y;
    var c = this.width;
    var a = this.height;
    var g = "";
    if (this.getDepth() == 0) {
        g = ["M", b - 38, h + 220, "Q", b - 35, h + 131, b - 130, h + 158, "Q", b - 155, h + 160, b - 160, h + 135, "Q", b - 150, h + 90, b - 175, h + 93, "Q", b - 188, h + 84, b - 178, h + 70, "Q", b - 188, h + 60, b - 180, h + 48, "Q", b - 170, h + 35, b - 190, h + 29, "Q", b - 220, h + 15, b - 190, h - 1, "Q", b - 150, h - 25, b - 149, h - 110, "Q", b - 150, h - 120, b - 140, h - 135, "Q", b - 133, h - 149, b - 120, h - 160, "Q", b - 29, h - 247, b + 80, h - 220, "Q", b + 130, h - 210, b + 150, h - 195, "Q", b + 205, h - 165, b + 225, h - 125, "Q", b + 290, h, b + 150, h + 100, "Q", b + 100, h + 135, b + 150, h + 180, ].join(",")
    } else {
        if (this.getDepth() == 1) {
            if (this.getIndexPos() == 0) {
                var f = b - 39;
                var d = h + 43.5;
                g = ["M", f, d, "C", f - 5, d + 10, f + 17, d + 10, f + 15, d + 2, "C", f + 10, d + 12, f + 33, d + 13, f + 30, d + 3, "C", f + 28, d + 13, f + 48, d + 15, f + 45, d + 5, "C", f + 41, d + 15, f + 75, d + 17, f + 70, d + 7, "C", f + 70, d + 17, f + 100, d + 7, f + 95, d - 3, "C", f + 95, d + 7, f + 115, d, f + 110, d - 10, "C", f + 110, d, f + 123, d - 9, f + 115, d - 15, "C", f + 123, d - 5, f + 125, d - 37, f + 118, d - 30, "C", f + 123, d - 30, f + 120, d - 65, f + 112, d - 60, "C", f + 122, d - 58, f + 118, d - 82, f + 108, d - 70, "C", f + 115, d - 72, f + 113, d - 85, f + 105, d - 78, "C", f + 115, d - 88, f + 80, d - 93, f + 82, d - 83, "C", f + 87, d - 93, f + 64, d - 93, f + 68, d - 86, "C", f + 70, d - 96, f + 54, d - 97, f + 56, d - 90, "C", f + 60, d - 97, f + 37, d - 99, f + 40, d - 93, "C", f + 43, d - 99, f + 33, d - 100, f + 34, d - 94, "C", f + 31, d - 102, f - 3, d - 103, f + 4, d - 90, "C", f + 3, d - 100, f - 24, d - 90, f - 20, d - 85, "C", f - 18, d - 92, f - 35, d - 88, f - 30, d - 80, "C", f - 40, d - 95, f - 63, d - 55, f - 50, d - 55, "C", f - 60, d - 60, f - 60, d - 30, f - 48, d - 35, "C", f - 60, d - 36, f - 50, d - 15, f - 40, d - 20, "C", f - 45, d - 5, f + 2, d + 15, f, d, ].join(",")
            } else {
                if (this.getIndexPos() == 1) {
                    var f = b - 135;
                    var d = h - 57.5;
                    g = ["M", f + 135, d + 100, "C", f + 140, d + 108, f + 165, d + 88, f + 155, d + 85, "C", f + 161, d + 90, f + 167, d + 80, f + 162, d + 78, "C", f + 167, d + 82, f + 172, d + 72, f + 167, d + 72, "C", f + 178, d + 82, f + 190, d + 60, f + 182, d + 58, "C", f + 189, d + 62, f + 190, d + 35, f + 185, d + 35, "C", f + 188, d + 26, f + 175, d + 20, f + 174, d + 23, "C", f + 180, d + 16, f + 160, d + 7, f + 160, d + 13, "C", f + 163, d + 8, f + 150, d + 3, f + 150, d + 8, "C", f + 155, d + 3, f + 138, d - 3, f + 135, d + 6, "C", f + 140, d, f + 116, d - 4, f + 118, d + 5, "C", f + 120, d - 1, f + 105, d - 1, f + 110, d + 8, "C", f + 100, d + 3, f + 85, d + 25, f + 95, d + 22, "C", f + 85, d + 20, f + 75, d + 45, f + 86, d + 45, "C", f + 79, d + 40, f + 75, d + 55, f + 85, d + 55, "C", f + 80, d + 52, f + 77, d + 72, f + 86, d + 70, "C", f + 80, d + 65, f + 85, d + 90, f + 92, d + 85, "C", f + 90, d + 93, f + 103, d + 101, f + 105, d + 95, "C", f + 100, d + 100, f + 145, d + 105, f + 135, d + 100].join(",")
                } else {
                    if (this.getIndexPos() == 2) {
                        var f = b - 193.5;
                        var d = h + 66;
                        g = ["M", f + 130, d - 10, "C", f + 125, d, f + 152, d, f + 150, d - 6, "C", f + 145, d + 2, f + 171, d + 13, f + 170, d + 5, "C", f + 165, d + 13, f + 181, d + 18, f + 180, d + 12, "C", f + 175, d + 18, f + 190, d + 28, f + 190, d + 18, "C", f + 185, d + 28, f + 225, d + 22, f + 215, d + 12, "C", f + 225, d + 17, f + 235, d - 2, f + 225, d - 2, "C", f + 235, d + 2, f + 235, d - 10, f + 227, d - 7, "C", f + 240, d - 7, f + 240, d - 22, f + 233, d - 20, "C", f + 242, d - 15, f + 244, d - 55, f + 233, d - 50, "C", f + 243, d - 45, f + 240, d - 95, f + 228, d - 90, "C", f + 235, d - 90, f + 233, d - 100, f + 226, d - 95, "C", f + 233, d - 95, f + 230, d - 115, f + 221, d - 110, "C", f + 226, d - 108, f + 220, d - 123, f + 216, d - 120, "C", f + 222, d - 120, f + 214, d - 136, f + 211, d - 135, "C", f + 215, d - 140, f + 192, d - 140, f + 197, d - 132, "C", f + 200, d - 135, f + 178, d - 135, f + 180, d - 127, "C", f + 183, d - 132, f + 150, d - 130, f + 155, d - 117, "C", f + 158, d - 126, f + 102, d - 120, f + 110, d - 100, "C", f + 105, d - 103, f + 96, d - 87, f + 106, d - 90, "C", f + 108, d - 93, f + 113, d - 76, f + 120, d - 80, "C", f + 118, d - 82, f + 120, d - 56, f + 130, d - 60, "C", f + 125, d - 65, f + 130, d - 35, f + 135, d - 40, "C", f + 125, d - 43, f + 125, d - 7, f + 130, d - 10].join(",")
                    } else {
                        if (this.getIndexPos() == 3) {
                            var f = b - 90;
                            var d = h + 163.5;
                            g = ["M", f + 90, d - 110, "C", f + 87, d - 100, f + 112, d - 100, f + 105, d - 115, "C", f + 100, d - 105, f + 145, d - 120, f + 135, d - 135, "C", f + 135, d - 125, f + 170, d - 130, f + 160, d - 140, "C", f + 158, d - 130, f + 190, d - 135, f + 180, d - 145, "C", f + 188, d - 140, f + 190, d - 165, f + 182, d - 160, "C", f + 188, d - 170, f + 155, d - 180, f + 160, d - 170, "C", f + 165, d - 180, f + 128, d - 205, f + 130, d - 192, "C", f + 135, d - 200, f + 105, d - 210, f + 110, d - 202, "C", f + 115, d - 210, f + 98, d - 213, f + 100, d - 206, "C", f + 105, d - 213, f + 80, d - 215, f + 85, d - 210, "C", f + 90, d - 223, f + 43, d - 223, f + 50, d - 215, "C", f + 55, d - 225, f + 35, d - 225, f + 40, d - 217, "C", f + 45, d - 225, f + 20, d - 220, f + 25, d - 215, "C", f + 30, d - 222, f - 5, d - 217, f, d - 210, "C", f - 9, d - 215, f - 20, d - 198, f - 10, d - 200, "C", f - 20, d - 205, f - 13, d - 175, f - 8, d - 180, "C", f - 15, d - 185, f - 10, d - 145, f - 2, d - 150, "C", f - 12, d - 155, f - 8, d - 130, f + 2, d - 135, "C", f - 8, d - 137, f - 5, d - 105, f + 5, d - 110, "C", f, d - 105, f + 23, d - 108, f + 20, d - 112, "C", f + 15, d - 102, f + 50, d - 104, f + 45, d - 114, "C", f + 40, d - 104, f + 95, d - 100, f + 90, d - 110, ].join(",")
                        } else {
                            if (this.getIndexPos() == 4) {
                                var f = b + 75;
                                var d = h + 75 + 62.5;
                                g = ["M", f - 30, d - 110, "C", f - 23, d - 105, f - 16, d - 130, f - 25, d - 125, "C", f - 20, d - 120, f - 6, d - 150, f - 15, d - 145, "C", f - 9, d - 142, f - 10, d - 164, f - 17, d - 160, "C", f - 11, d - 155, f - 14, d - 195, f - 22, d - 190, "C", f - 17, d - 200, f - 45, d - 205, f - 40, d - 200, "C", f - 40, d - 205, f - 55, d - 202, f - 50, d - 197, "C", f - 50, d - 200, f - 73, d - 198, f - 70, d - 190, "C", f - 68, d - 195, f - 88, d - 187, f - 85, d - 180, "C", f - 82, d - 187, f - 115, d - 168, f - 110, d - 160, "C", f - 110, d - 165, f - 130, d - 145, f - 125, d - 140, "C", f - 130, d - 145, f - 138, d - 120, f - 132, d - 125, "C", f - 138, d - 123, f - 138, d - 112, f - 132, d - 115, "C", f - 138, d - 118, f - 140, d - 97, f - 135, d - 100, "C", f - 140, d - 103, f - 142, d - 72, f - 130, d - 75, "C", f - 132, d - 68, f - 102, d - 73, f - 105, d - 78, "C", f - 108, d - 73, f - 92, d - 75, f - 95, d - 80, "C", f - 98, d - 75, f - 76, d - 80, f - 80, d - 85, "C", f - 85, d - 80, f - 55, d - 85, f - 60, d - 93, "C", f - 65, d - 85, f - 25, d - 105, f - 30, d - 110, ].join(",")
                            } else {
                                if (this.getIndexPos() == 5) {
                                    g = ["M", b, h, "A", 1, 1, 0, 1, 1, b + 0.5, h + 0.5, "Z", "M", b + 4, h - 2, "L", b + 6, h - 10, "L", b + 13, h + 2, "Z", "M", b + 10, h - 4, "Q", b + 15, h - 45, b + 45, h - 30, "T", b + 70, h - 50, ].join(",")
                                } else {
                                    if (this.getIndexPos() == 6) {
                                        g = ["M", b, h, "A", 1, 1, 0, 1, 1, b + 0.5, h + 0.5, "Z", "M", b - 2, h - 4, "L", b - 5, h - 15, "L", b - 15, h - 2, "Z", "M", b - 10, h - 10, "Q", b - 30, h, b - 40, h - 30, "T", b - 70, h - 60, ].join(",")
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else {
            if (this.getDepth() == 2) {
                if (this.getIndexPos() == 0) {
                    g = ["M", b, h, "A", 8, 8, 0, 1, 1, b - 10.5, h - 79, "Z", "M", b - 20, h - 140, "A", 11, 11, 0, 1, 1, b - 20.5, h - 139, "Z", "M", b - 30, h - 220, "A", 16, 16, 0, 1, 1, b - 30.5, h - 219, "Z", "M", b - 40, h - 300, "A", c + 5 + (a / c), a + (c / a), 0, 1, 1, b - 40.5, h - 299, "Z", ].join(",")
                } else {
                    if (this.getIndexPos() == 1) {
                        g = ["M", b + 40, h - 78, "A", 8, 8, 0, 1, 1, b + 40.5, h - 77.9, "Z", "M", b + 50, h - 140, "A", 11, 11, 0, 1, 1, b + 50.5, h - 139, "Z", "M", b + 65, h - 218, "A", 16, 16, 0, 1, 1, b + 65.5, h - 217, "Z", "M", b + 80, h - 300, "A", c + 5 + (a / c), a + (c / a), 0, 1, 1, b + 80.5, h - 299, "Z", ].join(",")
                    }
                }
            }
        }
    }
    this.branch.width = 2;
    this.body.attr({
        path: g
    })
};
jSunburstNodeController = function() {
    jSunburstNodeController.superclass.call(this)
};
extend(jSunburstNodeController, jNodeController);
jSunburstNodeController.prototype.type = "jSunburstNodeController";
jSunburstNodeController.prototype.dblclick = function(b) {
    var a;
    if (!b) {
        var b = window.event
    }
    a = b.originalEvent.originalEvent || b.originalEvent || b;
    if (a.preventDefault) {
        a.preventDefault()
    } else {
        a.returnValue = false
    }
    this.node.zoomExecute()
};
jSunburstNodeController.prototype.mouseenter = function(a) {
    this.node.showPopover()
};
jSunburstNodeController.prototype.mouseleave = function(b) {
    var c = "data-popover-id";
    var a = b.toElement || b.relatedTarget;
    if ($(a).closest(".jpopover").parent().attr(c) != this.node.popover.container.attr(c)) {
        this.node.hidePopover()
    }
};
jSunburstNodeController.prototype.popoverMouseleave = function(a) {
    var b = $(this).parent().attr("data-popover-id");
    if (jMap.nodes[b]) {
        jMap.nodes[b].hidePopover()
    }
};
jSunburstNodeControllerGuest = function() {
    jSunburstNodeControllerGuest.superclass.call(this)
};
extend(jSunburstNodeControllerGuest, jNodeControllerGuest);
jSunburstNodeControllerGuest.prototype.type = "jSunburstNodeControllerGuest";
jSunburstNodeControllerGuest.prototype.dblclick = function(b) {
    var a;
    if (!b) {
        var b = window.event
    }
    a = b.originalEvent.originalEvent || b.originalEvent || b;
    if (a.preventDefault) {
        a.preventDefault()
    } else {
        a.returnValue = false
    }
    this.node.zoomExecute()
};
jSunburstNodeControllerGuest.prototype.mouseenter = function(a) {
    this.node.showPopover()
};
jSunburstNodeControllerGuest.prototype.mouseleave = function(b) {
    var c = "data-popover-id";
    var a = b.toElement || b.relatedTarget;
    if ($(a).closest(".jpopover").parent().attr(c) != this.node.popover.container.attr(c)) {
        this.node.hidePopover()
    }
};
jSunburstNodeControllerGuest.prototype.popoverMouseleave = function(a) {
    var b = $(this).parent().attr("data-popover-id");
    if (jMap.nodes[b]) {
        jMap.nodes[b].hidePopover()
    }
};
jSunburstNode = function(f) {
    var b = f.parent;
    var d = f.text;
    var g = f.id;
    var c = f.index;
    var a = f.position;
    this.popover = {
        container: null,
        body: null,
        text: null,
        img: null,
        hyperlink: null,
        foreignObjEl: null
    };
    jSunburstNode.superclass.call(this, b, d, g, c, a)
};
extend(jSunburstNode, jNode);
jSunburstNode.prototype.type = "jSunburstNode";
jSunburstNode.prototype.initElements = function() {
    this.body = RAPHAEL.path();
    this.text = RAPHAEL.text();
    this.wrapElements(this.body, this.text);
    this.popover.container = $('<div data-popover-type="' + this.type + '" data-popover-id="' + this.id + '"><div class="jpopover"></div></div>').appendTo(jMap.popoverContainer);
    this.popover.body = $('<div class="jpopover-body"></div>').appendTo(this.popover.container.children(".jpopover"));
    this.popover.text = $('<div class="jpopover-text"></div>').appendTo(this.popover.container.children(".jpopover"))
};
jSunburstNode.prototype.addEventController = function(a) {
    a = jMap.mode ? new jSunburstNodeController() : new jSunburstNodeControllerGuest();
    this.controller = a;
    $(this.groupEl).on("vmousedown", a.mousedown);
    $(this.groupEl).on("vmousemove", a.mousemove);
    $(this.groupEl).on("vmouseup", a.mouseup);
    $(this.groupEl).on("mouseover", a.mouseenter);
    $(this.groupEl).on("mouseout", a.mouseleave);
    this.popover.container.children(".jpopover").on("mouseleave", a.popoverMouseleave);
    $(this.groupEl).on("taphold", a.taphold);
    $(this.groupEl).on("vclick", a.click);
    $(this.groupEl).on("dblclick", a.dblclick);
    $(this.groupEl).on("contextmenu", a.contextmenu)
};
jSunburstNode.prototype.create = function() {
    var c = jMap.layoutManager.getCenterLocation();
    this.position = this.position || ((this.parent && this.parent.position) ? this.parent.position : "left");
    this.groupEl.setAttribute("data-node-type", this.type);
    this.groupEl.setAttribute("data-node-id", this.id);
    this.groupEl.setAttribute("transform", "translate(" + [c.x, c.y] + ")");
    this.groupEl.setAttribute("pointer-events", "all");
    this.body.node.setAttribute("pointer-events", "all");
    this.setBackgroundColorExecute(jMap.cfg.nodeDefalutColor);
    this.setTextColorExecute(jMap.cfg.textDefalutColor);
    this.setEdgeColorExecute(jMap.cfg.edgeDefalutColor, jMap.cfg.edgeDefalutWidth);
    if (typeof NodeColorMix !== "undefined") {
        NodeColorMix.rawDressColor(this)
    }
    var b = 400;
    var a = "Malgun Gothic, �������, Gulim, ����, Arial, sans-serif";
    this.fontSize = jMap.cfg.nodeFontSizes[3];
    if (!this.getParent()) {
        b = "700"
    } else {
        if (this.getParent() && this.getParent().isRootNode()) {
            b = "700"
        } else {
            b = "400"
        }
    }
    this.text.attr({
        "font-family": a,
        "font-size": this.fontSize,
        "font-weight": b,
        "text-anchor": null
    });
    $(this.text.node).css("pointer-events", "none");
    this.setTextExecute(this.plainText)
};
jSunburstNode.prototype.setTextExecute = function(a) {
    this.plainText = a;
    this.text.attr({
        text: a
    });
    this.CalcBodySize();
    if (a.indexOf("\n")) {
        a = a.split("\n").join("<br>")
    }
    this.popover.text.html(a)
};
jSunburstNode.prototype.setHyperlink = function(c) {
    if (jMap.cfg.realtimeSave) {
        var d = jMap.saveAction.isAlive();
        if (!d) {
            return null
        }
    }
    var f = jMap.historyManager;
    var a = f && f.extractNode(this);
    this.setHyperlinkExecute(c);
    var b = f && f.extractNode(this);
    f && f.addToHistory(a, b);
    jMap.saveAction.editAction(this);
    jMap.fireActionListener(ACTIONS.ACTION_NODE_HYPER, this);
    jMap.setSaved(false)
};
jSunburstNode.prototype.setHyperlinkExecute = function(a) {
    if (a == null || a == "") {
        if (this.hyperlink) {
            this.hyperlink = null;
            this.popover.hyperlink.remove();
            this.popover.hyperlink = null;
            this.popover.container.removeAttr("data-has-hyperlink");
            this.CalcBodySize()
        }
        return
    }
    if (!this.hyperlink) {
        this.hyperlink = RAPHAEL.image(jMap.cfg.contextPath + "/images/hyperlink.png", 0, 0, 11, 11);
        this.hyperlink.attr({
            cursor: "pointer"
        });
        this.popover.hyperlink = $("<a></a>").attr("class", "jpopover-hyperlink").appendTo(this.popover.body);
        $("<img />").attr("src", jMap.cfg.contextPath + "/images/hyperlink.png").width(11).height(11).appendTo(this.popover.hyperlink);
        this.popover.container.attr("data-has-hyperlink", true)
    }
    this.hyperlink.attr({
        href: a,
        target: "blank"
    });
    this.popover.hyperlink.attr("href", a).attr("target", "_blank");
    this.CalcBodySize();
    jMap.resolveRendering()
};
jSunburstNode.prototype.setImage = function(c, d, a) {
    if (jMap.cfg.realtimeSave) {
        var f = jMap.saveAction.isAlive();
        if (!f) {
            return null
        }
    }
    var g = jMap.historyManager;
    var b = g && g.extractNode(this);
    this.setImageExecute(c, d, a, function() {
        var h = g && g.extractNode(this);
        g && g.addToHistory(b, h);
        jMap.saveAction.editAction(this);
        jMap.fireActionListener(ACTIONS.ACTION_NODE_IMAGE, this.id, c, d, a);
        jMap.setSaved(false)
    })
};
jSunburstNode.prototype.setImageExecute = function(c, f, b, a) {
    if (c == null || c == "") {
        if (this.img) {
            this.img = null;
            this.imgInfo = {};
            this.popover.img.remove();
            this.popover.img = null;
            this.CalcBodySize();
            a && a.call(this)
        }
        return false
    }
    var g = this;
    var d = $("<img />").attr("src", c).load(function() {
        var k = jMap.cfg.default_img_size;
        var h = {
            width: 0,
            height: 0
        };
        if (this.width > k) {
            h.width = k;
            h.height = (this.height * k) / this.width
        } else {
            h.width = this.width;
            h.height = this.height
        }
        if (f) {
            h.width = f
        }
        if (b) {
            h.height = b
        }
        h.width = parseInt(h.width);
        h.height = parseInt(h.height);
        if (g.img) {
            g.img.attr({
                src: this.src,
                width: h.width,
                height: h.height
            });
            g.imgInfo.href = this.src;
            g.imgInfo.width = h.width;
            g.imgInfo.height = h.height;
            g.popover.img.attr("src", this.src).width(h.width).height(h.height)
        } else {
            g.img = RAPHAEL.image(this.src, 0, 0, h.width, h.height);
            g.imgInfo.href = this.src;
            g.imgInfo.width = h.width;
            g.imgInfo.height = h.height;
            g.popover.img = $("<img />").attr("class", "jpopover-img").attr("src", this.src).width(h.width).height(h.height).appendTo(g.popover.body)
        }
        jMap.loadManager.updateImageLoading(this);
        a && a.call(g);
        return true
    }).error(function() {
        var h = jMap.cfg.contextPath + "/images/image_broken.png";
        if (g.img) {
            g.img.attr({
                src: h,
                width: 64,
                height: 64
            });
            g.imgInfo.href = c;
            g.imgInfo.width = f && f;
            g.imgInfo.height = b && b;
            g.popover.img.attr("src", h).width(64).height(64)
        } else {
            g.img = RAPHAEL.image(jMap.cfg.contextPath + "/images/image_broken.png", 0, 0, 64, 64);
            g.imgInfo.href = c;
            g.imgInfo.width = f && f;
            g.imgInfo.height = b && b;
            g.popover.img = $("<img />").attr("class", "jpopover-img").attr("src", h).width(64).height(64).appendTo(g.popover.body)
        }
        jMap.loadManager.updateImageLoading(this);
        a && a.call(g)
    });
    jMap.loadManager.updateImageLoading(d[0])
};
jSunburstNode.prototype.imageResize = function(d, a) {
    if (jMap.cfg.realtimeSave) {
        var f = jMap.saveAction.isAlive();
        if (!f) {
            return null
        }
    }
    var g = jMap.historyManager;
    var b = g && g.extractNode(this);
    this.imageResizeExecute(d, a);
    var c = g && g.extractNode(this);
    g && g.addToHistory(b, c);
    jMap.saveAction.editAction(this);
    jMap.fireActionListener(ACTIONS.ACTION_NODE_IMAGE, this.id, null, d, a);
    jMap.setSaved(false)
};
jSunburstNode.prototype.imageResizeExecute = function(b, a) {
    this.img && this.img.attr({
        width: b,
        height: a
    });
    this.imgInfo.width = b;
    this.imgInfo.height = a;
    this.popover.img.width(b).height(a)
};
jSunburstNode.prototype.setForeignObject = function(d, f, a) {
    if (jMap.cfg.realtimeSave) {
        var g = jMap.saveAction.isAlive();
        if (!g) {
            return null
        }
    }
    var h = jMap.historyManager;
    var b = h && h.extractNode(this);
    this.setForeignObjectExecute(d, f, a);
    var c = h && h.extractNode(this);
    h && h.addToHistory(b, c);
    jMap.saveAction.editAction(this);
    jMap.fireActionListener(ACTIONS.ACTION_NODE_FOREIGNOBJECT, this, d, f, a);
    jMap.setSaved(false)
};
jSunburstNode.prototype.setForeignObjectExecute = function(c, d, a) {
    if (!Raphael.svg) {
        return false
    }
    if (c == null || c == "") {
        this.foreignObjEl = null;
        this.popover.foreignObjEl.remove();
        this.popover.foreignObjEl = null;
        this.CalcBodySize();
        return false
    }
    if (!this.foreignObjEl) {
        this.foreignObjEl = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        this.foreignObjEl.bodyEl = document.createElementNS("http://www.w3.org/1999/xhtml", "body");
        this.foreignObjEl.appendChild(this.foreignObjEl.bodyEl);
        this.popover.foreignObjEl = $("<div></div>").attr("class", "jpopover-foreignObjEl").appendTo(this.popover.body)
    }
    d && this.foreignObjEl.setAttribute("width", d);
    a && this.foreignObjEl.setAttribute("height", a);
    d && this.popover.foreignObjEl.width(d);
    a && this.popover.foreignObjEl.height(a);
    this.foreignObjEl.bodyEl.innerHTML = c;
    this.foreignObjEl.plainHtml = c;
    this.popover.foreignObjEl.html(c);
    if (BrowserDetect.browser == "MSIE") {
        var f = c.search(/youtube\.com/);
        if (f != -1) {
            var b = '<img src="' + jMap.cfg.contextPath + '/images/video_not_support.png" width="300" height="300"/>';
            this.foreignObjEl.bodyEl.innerHTML = b;
            this.popover.foreignObjEl.html(b)
        }
    }
    this.CalcBodySize()
};
jSunburstNode.prototype.foreignObjectResize = function(d, a) {
    if (jMap.cfg.realtimeSave) {
        var f = jMap.saveAction.isAlive();
        if (!f) {
            return null
        }
    }
    var g = jMap.historyManager;
    var b = g && g.extractNode(this);
    this.foreignObjectResizeExecute(d, a);
    var c = g && g.extractNode(this);
    g && g.addToHistory(b, c);
    jMap.saveAction.editAction(this);
    jMap.fireActionListener(ACTIONS.ACTION_NODE_FOREIGNOBJECT, this, null, d, a);
    jMap.setSaved(false)
};
jSunburstNode.prototype.foreignObjectResizeExecute = function(c, a) {
    c && this.foreignObjEl.setAttribute("width", c);
    a && this.foreignObjEl.setAttribute("height", a);
    c && this.popover.foreignObjEl.width(c);
    a && this.popover.foreignObjEl.height(a);
    var b = this.foreignObjEl.plainHtml;
    b = b.replace(/(width=")([^"]*)/ig, "$1" + c);
    b = b.replace(/(height=")([^"]*)/ig, "$1" + a);
    this.foreignObjEl.bodyEl.innerHTML = b;
    this.foreignObjEl.plainHtml = b;
    this.popover.foreignObjEl.html(b);
    this.CalcBodySize();
    jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(this);
    jMap.layoutManager.layout(true)
};
jSunburstNode.prototype.setEmbedVideo = function(d) {
    var f = /width?=?["']([^"']*)/gi;
    var c = f.exec(d)[1];
    var b = /height?=?["']([^"']*)/gi;
    var a = b.exec(d)[1];
    this.setForeignObject(d, c, a)
};
jSunburstNode.prototype.setVideo = function(f, c, a) {
    var d = jMap.cfg.default_video_size;
    var b = '<embed src="' + f + '" width="' + c + '"  height="' + a + '"></embed>';
    this.setHyperlink(f);
    this.setForeignObject(b, c, a)
};
jSunburstNode.prototype.setYoutubeVideo = function(k, g, a) {
    var h = jMap.cfg.default_video_size;
    if (g == null) {
        g = h
    }
    if (a == null) {
        a = h
    }
    var f = /v[=\/]([^&]*)/ig;
    var c = f.exec(k);
    if (c) {
        var b = "http://www.youtube.com/embed/" + c[1];
        var d = '<iframe src="' + b + '" frameborder="0" allowtransparency="true" width="' + g + '"  height="' + a + '" scrolling="no"></iframe>';
        this.setHyperlink(k);
        this.setForeignObject(d, g, a)
    }
};
jSunburstNode.prototype.zoomExecute = function(c) {
    var b = jMap.layoutManager;
    var a = this;
    c = (c == undefined ? b.duration : c);
    a.hidePopover();
    jMap.arcTweenNode = a;
    d3.selectAll('g[data-node-type="' + jMap.cfg.nodeStyle + '"] path').transition().duration(c).attrTween("d", b.arcTween(a.getPartitionTreeData()));
    d3.selectAll('g[data-node-type="' + jMap.cfg.nodeStyle + '"] text').style("visibility", function(d) {
        return a.isParentOf(d) ? null : d3.select(this).style("visibility")
    }).transition().duration(c).attrTween("text-anchor", function(f) {
        return function() {
            var d = "middle";
            if (jMap.nodes[f.id]) {
                if (!jMap.nodes[f.id].isRootNode()) {
                    d = b.x(f.x + f.dx / 2) > Math.PI ? "end" : "start"
                }
                d3.select(jMap.nodes[f.id].text.node).style({
                    "text-anchor": d
                })
            }
            return d
        }
    }).attrTween("transform", function(g) {
        var f = (jMap.nodes[g.id].plainText || "").split(" ").length > 1;
        return function() {
            var h = b.x(g.x + g.dx / 2) * 180 / Math.PI - 90,
                d = h + (f ? -0.5 : 0);
            if (jMap.nodes[g.id]) {
                jMap.nodes[g.id].angle = h;
                if (jMap.nodes[g.id].isRootNode()) {
                    return ""
                }
            }
            return "rotate(" + d + ")translate(" + (b.y(g.y) + b.padding) + ")rotate(" + (h > 90 ? -180 : 0) + ")"
        }
    }).style("fill-opacity", function(d) {
        return a.isParentOf(d) ? 1 : 0.000001
    }).each("end", function(d) {
        d3.select(this).style("visibility", function() {
            if (a.isParentOf(d)) {
                if (jMap.nodes[d.id]) {
                    jMap.nodes[d.id].computedTextExecute()
                }
                return null
            }
            return "hidden"
        })
    });
    return {
        end: function(d) {
            setTimeout(function() {
                d()
            }, c)
        }
    }
};
jSunburstNode.prototype.isParentOf = function(a) {
    if (this.id === a.id) {
        return true
    }
    if (this.children) {
        return this.children.some(function(b) {
            return b.isParentOf(a)
        })
    }
    return false
};
jSunburstNode.prototype.getChildren = function() {
    return this.children || []
};
jSunburstNode.prototype.screenFocus = function() {
    this.zoomExecute()
};
jSunburstNode.prototype.showPopover = function() {
    var a = this.getPopoverLocation();
    this.popover.container.attr("style", "top: " + (a.top) + "px; left: " + (a.left) + "px;");
    this.popover.container.addClass("active");
    this.popover.container.attr("data-placement", this.angle > 90 ? "left" : "right")
};
jSunburstNode.prototype.getPopoverLocation = function() {
    var h = jMap.arcTweenNode.groupEl.getBBox();
    h.offset = $(jMap.arcTweenNode.groupEl).offset();
    var f = {
        top: h.offset.top + ((h.height * jMap.cfg.scale) / 2),
        left: h.offset.left + ((h.width * jMap.cfg.scale) / 2)
    };
    var a = 0;
    if (!this.isRootNode()) {
        a = (this.outerRadius - this.innerRadius) / 2
    }
    var k = (this.innerRadius + a) * jMap.cfg.scale;
    var c = this.angle;
    f.top += (k * Math.sin(Math.PI * (c / 180)));
    f.left += (k * Math.cos(Math.PI * (c / 180)));
    var g = $("#ribbon").height() + 10;
    var b = this.popover.container.width();
    var m = this.popover.container.height();
    var d = $(window).width();
    var n = $(window).height();
    var l = 5;
    if (f.top < g + l) {
        f.top = g + l
    } else {
        if (f.top + m > n - l) {
            f.top = n - m - l
        }
    }
    if (this.angle > 90) {
        if (f.left - b < l) {
            f.left = l + b
        }
    } else {
        if (f.left < l) {
            f.left = l
        } else {
            if (f.left + b > d - l) {
                f.left = d - l - b
            }
        }
    }
    return f
};
jSunburstNode.prototype.hidePopover = function() {
    this.popover.container.removeClass("active")
};
jSunburstNode.prototype.toXML = function(m) {
    var g = new StringBuffer();
    var h = false;
    if (this.img != null || (this.text.attrs.text != null && this.text.attrs.text.indexOf("\n") != -1)) {
        h = true
    }
    var f = new StringBuffer();
    f.add("<node");
    f.add('CREATED="' + this.created + '"');
    f.add('ID="' + this.id + '"');
    f.add('MODIFIED="' + this.modified + '"');
    f.add('CREATOR="' + this.creator + '"');
    f.add('CLIENT_ID="' + this.client_id + '"');
    if (!h) {
        f.add('TEXT="' + convertCharStr2SelectiveCPs(convertCharStr2XML(this.plainText, true, true), "ascii", true, "&#x", ";", "hex") + '"')
    }
    f.add('FOLDED="' + this.folded + '"');
    if (this.background_color != "") {
        f.add('BACKGROUND_COLOR="' + this.background_color + '"')
    }
    if (this.color != "") {
        f.add('COLOR="' + this.color + '"')
    }
    if (this.hyperlink != null) {
        f.add('LINK="' + convertCharStr2XML(this.hyperlink.attr().href) + '"')
    }
    if (this.position != "" && this.position != "undefined") {
        f.add('POSITION="' + this.position + '"')
    }
    if (this.style != "") {
        f.add('STYLE="' + this.style + '"')
    }
    if (this.hgap) {
        f.add('HGAP="' + this.hgap + '"')
    }
    if (this.vgap) {
        f.add('VGAP="' + this.vgap + '"')
    }
    if (this.vshift) {
        f.add('VSHIFT="' + this.vshift + '"')
    }
    if (this.numofchildren != null) {
        f.add('NUMOFCHILDREN="' + this.numofchildren + '"')
    }
    f.add(">");
    g.add(f.toString(" "));
    if (h) {
        var a = new StringBuffer();
        a.add('<richcontent TYPE="NODE"><html>\n');
        a.add("  <head>\n");
        a.add("\n");
        a.add("  </head>\n");
        a.add("  <body>\n");
        if (this.img != null) {
            a.add("    <p>\n");
            a.add('      <img src="' + this.imgInfo.href + '" width="' + this.imgInfo.width + '" height="' + this.imgInfo.height + '" />\n');
            a.add("    </p>\n")
        }
        if (this.text.attrs.text != null) {
            var l = JinoUtil.trimStr(this.text.attrs.text).split("\n");
            for (var k = 0; k < l.length; k++) {
                a.add("<p>" + convertCharStr2SelectiveCPs(convertCharStr2XML(l[k], true, true), "ascii", true, "&#x", ";", "hex") + "</p>\n")
            }
        }
        a.add("  </body>\n");
        a.add("</html>\n");
        a.add("</richcontent>");
        g.add(a.toString(" "))
    }
    if (this.arrowlinks.length > 0) {
        for (var k = 0; k < this.arrowlinks.length; k++) {
            g.add(this.arrowlinks[k].toXML())
        }
    }
    if (this.foreignObjEl) {
        var b = new StringBuffer();
        b.add('<foreignObject WIDTH="' + this.foreignObjEl.getAttribute("width") + '" HEIGHT="' + this.foreignObjEl.getAttribute("height") + '">');
        b.add(convertCharStr2SelectiveCPs(this.foreignObjEl.plainHtml, "ascii", true, "&#x", ";", "hex"));
        b.add("</foreignObject>");
        g.add(b.toString(" "))
    }
    for (var n in this.attributes) {
        g.add("<attribute NAME='" + n + "' VALUE='" + convertCharStr2SelectiveCPs(convertCharStr2XML(this.attributes[n], true, true), "ascii", true, "&#x", ";", "hex") + "'/>")
    }
    var c = new StringBuffer();
    c.add("<info");
    if (this.lazycomplete) {
        c.add('LAZYCOMPLETE="' + this.lazycomplete + '"')
    }
    c.add("/>");
    g.add(c.toString(" "));
    var d = this.getChildren();
    if (d.length > 0 && m == null) {
        for (var k = 0; k < d.length; k++) {
            g.add(d[k].toXML())
        }
    }
    g.add("</node>");
    return g.toString("\n")
};
jSunburstNode.prototype.getPartitionTreeData = function() {
    var a = {};
    a.id = this.id;
    a.dx = this.dx;
    a.dy = this.dy;
    a.x = this.x;
    a.y = this.y;
    if (this.children.length) {
        a.children = [];
        this.children.forEach(function(b) {
            a.children.push(b.getPartitionTreeData())
        })
    }
    return a
};
jSunburstNode.prototype.getText = function() {
    return this.plainText
};
jSunburstNode.prototype.computedTextExecute = function() {
    var c = this;
    var b = c.outerRadius * 2;
    if (!c.isRootNode()) {
        b = c.outerRadius - c.innerRadius
    }
    var a = Math.floor((b - 2 * jMap.layoutManager.padding) / (parseFloat(jMap.cfg.nodeFontSizes[3]) / 2)) - 4;
    if (c.plainText.length > a) {
        var d = c.plainText.slice(0, a);
        this.text.attr({
            text: d + "..."
        })
    } else {
        this.text.attr({
            text: this.plainText
        })
    }
};
jSunburstNode.prototype.setFolding = function(a) {
    if (jMap.jDebug) {
        console.log("setFolding")
    }
};
jSunburstNode.prototype.hideChildren = function(a) {
    if (jMap.jDebug) {
        console.log("hideChildren")
    }
};
jSunburstNode.prototype.relativeCoordinate = function(b, a) {
    if (jMap.jDebug) {
        console.log("relativeCoordinate")
    }
};
jSunburstNode.prototype.relativeCoordinateExecute = function(b, a) {
    if (jMap.jDebug) {
        console.log("relativeCoordinateExecute")
    }
};
jZoomableTreemapNodeController = function() {
    jZoomableTreemapNodeController.superclass.call(this)
};
extend(jZoomableTreemapNodeController, jNodeController);
jZoomableTreemapNodeController.prototype.type = "jZoomableTreemapNodeController";
jZoomableTreemapNodeController.prototype.dblclick = function(b) {
    var a;
    if (!b) {
        var b = window.event
    }
    a = b.originalEvent.originalEvent || b.originalEvent || b;
    if (a.preventDefault) {
        a.preventDefault()
    } else {
        a.returnValue = false
    }
    if (jMap.arcTweenNode.id == this.node.parent.id) {
        jMap.getRootNode().zoomExecute()
    } else {
        this.node.parent.zoomExecute()
    }
};
jZoomableTreemapNodeController.prototype.mouseenter = function(a) {
    this.node.showPopover()
};
jZoomableTreemapNodeController.prototype.mouseleave = function(b) {
    var c = "data-popover-id";
    var a = b.toElement || b.relatedTarget;
    if ($(a).closest(".jpopover").parent().attr(c) != this.node.popover.container.attr(c)) {
        this.node.hidePopover()
    }
};
jZoomableTreemapNodeController.prototype.popoverMouseleave = function(a) {
    var b = $(this).parent().attr("data-popover-id");
    if (jMap.nodes[b]) {
        jMap.nodes[b].hidePopover()
    }
};
jZoomableTreemapNodeControllerGuest = function() {
    jZoomableTreemapNodeControllerGuest.superclass.call(this)
};
extend(jZoomableTreemapNodeControllerGuest, jNodeControllerGuest);
jZoomableTreemapNodeControllerGuest.prototype.type = "jZoomableTreemapNodeControllerGuest";
jZoomableTreemapNodeControllerGuest.prototype.dblclick = function(b) {
    var a;
    if (!b) {
        var b = window.event
    }
    a = b.originalEvent.originalEvent || b.originalEvent || b;
    if (a.preventDefault) {
        a.preventDefault()
    } else {
        a.returnValue = false
    }
    if (jMap.arcTweenNode.id == this.node.parent.id) {
        jMap.getRootNode().zoomExecute()
    } else {
        this.node.parent.zoomExecute()
    }
};
jZoomableTreemapNodeControllerGuest.prototype.mouseenter = function(a) {
    this.node.showPopover()
};
jZoomableTreemapNodeControllerGuest.prototype.mouseleave = function(b) {
    var c = "data-popover-id";
    var a = b.toElement || b.relatedTarget;
    if ($(a).closest(".jpopover").parent().attr(c) != this.node.popover.container.attr(c)) {
        this.node.hidePopover()
    }
};
jZoomableTreemapNodeControllerGuest.prototype.popoverMouseleave = function(a) {
    var b = $(this).parent().attr("data-popover-id");
    if (jMap.nodes[b]) {
        jMap.nodes[b].hidePopover()
    }
};
jZoomableTreemapNode = function(f) {
    var b = f.parent;
    var d = f.text;
    var g = f.id;
    var c = f.index;
    var a = f.position;
    this.popover = {
        container: null,
        body: null,
        text: null,
        img: null,
        hyperlink: null,
        foreignObjEl: null
    };
    jZoomableTreemapNode.superclass.call(this, b, d, g, c, a)
};
extend(jZoomableTreemapNode, jNode);
jZoomableTreemapNode.prototype.type = "jZoomableTreemapNode";
jZoomableTreemapNode.prototype.initElements = function() {
    this.body = RAPHAEL.rect();
    this.text = RAPHAEL.text();
    this.wrapElements(this.body, this.text);
    this.popover.container = $('<div data-popover-type="' + this.type + '" data-popover-id="' + this.id + '"><div class="jpopover"></div></div>').appendTo(jMap.popoverContainer);
    this.popover.body = $('<div class="jpopover-body"></div>').appendTo(this.popover.container.children(".jpopover"));
    this.popover.text = $('<div class="jpopover-text"></div>').appendTo(this.popover.container.children(".jpopover"))
};
jZoomableTreemapNode.prototype.create = function() {
    var c = jMap.layoutManager.getCenterLocation();
    this.position = this.position || ((this.parent && this.parent.position) ? this.parent.position : "left");
    this.groupEl.setAttribute("data-node-type", this.type);
    this.groupEl.setAttribute("data-node-id", this.id);
    this.groupEl.setAttribute("pointer-events", "all");
    this.body.node.setAttribute("pointer-events", "all");
    this.setBackgroundColorExecute(jMap.cfg.nodeDefalutColor);
    this.setTextColorExecute(jMap.cfg.textDefalutColor);
    if (typeof NodeColorMix !== "undefined") {
        NodeColorMix.rawDressColor(this)
    }
    this.setEdgeColorExecute(jMap.cfg.edgeDefalutColor, jMap.cfg.edgeDefalutWidth);
    var b = 400;
    var a = "Malgun Gothic, �������, Gulim, ����, Arial, sans-serif";
    this.fontSize = jMap.cfg.nodeFontSizes[2];
    if (!this.getParent()) {
        b = "700"
    } else {
        if (this.getParent() && this.getParent().isRootNode()) {
            b = "700"
        } else {
            b = "400"
        }
    }
    this.text.attr({
        "font-family": a,
        "font-size": this.fontSize,
        "font-weight": b,
        "text-anchor": null
    });
    $(this.text.node).css("pointer-events", "none");
    this.setTextExecute(this.plainText)
};
jZoomableTreemapNode.prototype.addEventController = function(a) {
    a = jMap.mode ? new jZoomableTreemapNodeController() : new jZoomableTreemapNodeControllerGuest();
    this.controller = a;
    $(this.groupEl).on("vmousedown", a.mousedown);
    $(this.groupEl).on("vmousemove", a.mousemove);
    $(this.groupEl).on("vmouseup", a.mouseup);
    $(this.groupEl).on("mouseover", a.mouseenter);
    $(this.groupEl).on("mouseout", a.mouseleave);
    this.popover.container.children(".jpopover").on("mouseleave", a.popoverMouseleave);
    $(this.groupEl).on("taphold", a.taphold);
    $(this.groupEl).on("vclick", a.click);
    $(this.groupEl).on("dblclick", a.dblclick);
    $(this.groupEl).on("contextmenu", a.contextmenu)
};
jZoomableTreemapNode.prototype.setTextExecute = function(a) {
    this.plainText = a;
    this.text.attr({
        text: a.split("\n")[0]
    });
    this.CalcBodySize();
    if (a.indexOf("\n")) {
        a = a.split("\n").join("<br>")
    }
    this.popover.text.html(a)
};
jZoomableTreemapNode.prototype.setHyperlink = function(c) {
    if (jMap.cfg.realtimeSave) {
        var d = jMap.saveAction.isAlive();
        if (!d) {
            return null
        }
    }
    var f = jMap.historyManager;
    var a = f && f.extractNode(this);
    this.setHyperlinkExecute(c);
    var b = f && f.extractNode(this);
    f && f.addToHistory(a, b);
    jMap.saveAction.editAction(this);
    jMap.fireActionListener(ACTIONS.ACTION_NODE_HYPER, this);
    jMap.setSaved(false)
};
jZoomableTreemapNode.prototype.setHyperlinkExecute = function(a) {
    if (a == null || a == "") {
        if (this.hyperlink) {
            this.hyperlink = null;
            this.popover.hyperlink.remove();
            this.popover.hyperlink = null;
            this.popover.container.removeAttr("data-has-hyperlink");
            this.CalcBodySize()
        }
        return
    }
    if (!this.hyperlink) {
        this.hyperlink = RAPHAEL.image(jMap.cfg.contextPath + "/images/hyperlink.png", 0, 0, 11, 11);
        this.hyperlink.attr({
            cursor: "pointer"
        });
        this.popover.hyperlink = $("<a></a>").attr("class", "jpopover-hyperlink").appendTo(this.popover.body);
        $("<img />").attr("src", jMap.cfg.contextPath + "/images/hyperlink.png").width(11).height(11).appendTo(this.popover.hyperlink);
        this.popover.container.attr("data-has-hyperlink", true)
    }
    this.hyperlink.attr({
        href: a,
        target: "blank"
    });
    this.popover.hyperlink.attr("href", a).attr("target", "_blank");
    this.CalcBodySize();
    jMap.resolveRendering()
};
jZoomableTreemapNode.prototype.setImage = function(c, d, a) {
    if (jMap.cfg.realtimeSave) {
        var f = jMap.saveAction.isAlive();
        if (!f) {
            return null
        }
    }
    var g = jMap.historyManager;
    var b = g && g.extractNode(this);
    this.setImageExecute(c, d, a, function() {
        var h = g && g.extractNode(this);
        g && g.addToHistory(b, h);
        jMap.saveAction.editAction(this);
        jMap.fireActionListener(ACTIONS.ACTION_NODE_IMAGE, this.id, c, d, a);
        jMap.setSaved(false)
    })
};
jZoomableTreemapNode.prototype.setImageExecute = function(c, f, b, a) {
    if (c == null || c == "") {
        if (this.img) {
            this.img = null;
            this.imgInfo = {};
            this.popover.img.remove();
            this.popover.img = null;
            this.CalcBodySize();
            a && a.call(this)
        }
        return false
    }
    var g = this;
    var d = $("<img />").attr("src", c).load(function() {
        var k = jMap.cfg.default_img_size;
        var h = {
            width: 0,
            height: 0
        };
        if (this.width > k) {
            h.width = k;
            h.height = (this.height * k) / this.width
        } else {
            h.width = this.width;
            h.height = this.height
        }
        if (f) {
            h.width = f
        }
        if (b) {
            h.height = b
        }
        h.width = parseInt(h.width);
        h.height = parseInt(h.height);
        if (g.img) {
            g.img.attr({
                src: this.src,
                width: h.width,
                height: h.height
            });
            g.imgInfo.href = this.src;
            g.imgInfo.width = h.width;
            g.imgInfo.height = h.height;
            g.popover.img.attr("src", this.src).width(h.width).height(h.height)
        } else {
            g.img = RAPHAEL.image(this.src, 0, 0, h.width, h.height);
            g.imgInfo.href = this.src;
            g.imgInfo.width = h.width;
            g.imgInfo.height = h.height;
            g.popover.img = $("<img />").attr("class", "jpopover-img").attr("src", this.src).width(h.width).height(h.height).appendTo(g.popover.body)
        }
        jMap.loadManager.updateImageLoading(this);
        a && a.call(g);
        return true
    }).error(function() {
        var h = jMap.cfg.contextPath + "/images/image_broken.png";
        if (g.img) {
            g.img.attr({
                src: h,
                width: 64,
                height: 64
            });
            g.imgInfo.href = c;
            g.imgInfo.width = f && f;
            g.imgInfo.height = b && b;
            g.popover.img.attr("src", h).width(64).height(64)
        } else {
            g.img = RAPHAEL.image(jMap.cfg.contextPath + "/images/image_broken.png", 0, 0, 64, 64);
            g.imgInfo.href = c;
            g.imgInfo.width = f && f;
            g.imgInfo.height = b && b;
            g.popover.img = $("<img />").attr("class", "jpopover-img").attr("src", h).width(64).height(64).appendTo(g.popover.body)
        }
        jMap.loadManager.updateImageLoading(this);
        a && a.call(g)
    });
    jMap.loadManager.updateImageLoading(d[0])
};
jZoomableTreemapNode.prototype.imageResize = function(d, a) {
    if (jMap.cfg.realtimeSave) {
        var f = jMap.saveAction.isAlive();
        if (!f) {
            return null
        }
    }
    var g = jMap.historyManager;
    var b = g && g.extractNode(this);
    this.imageResizeExecute(d, a);
    var c = g && g.extractNode(this);
    g && g.addToHistory(b, c);
    jMap.saveAction.editAction(this);
    jMap.fireActionListener(ACTIONS.ACTION_NODE_IMAGE, this.id, null, d, a);
    jMap.setSaved(false)
};
jZoomableTreemapNode.prototype.imageResizeExecute = function(b, a) {
    this.img && this.img.attr({
        width: b,
        height: a
    });
    this.imgInfo.width = b;
    this.imgInfo.height = a;
    this.popover.img.width(b).height(a)
};
jZoomableTreemapNode.prototype.setForeignObject = function(d, f, a) {
    if (jMap.cfg.realtimeSave) {
        var g = jMap.saveAction.isAlive();
        if (!g) {
            return null
        }
    }
    var h = jMap.historyManager;
    var b = h && h.extractNode(this);
    this.setForeignObjectExecute(d, f, a);
    var c = h && h.extractNode(this);
    h && h.addToHistory(b, c);
    jMap.saveAction.editAction(this);
    jMap.fireActionListener(ACTIONS.ACTION_NODE_FOREIGNOBJECT, this, d, f, a);
    jMap.setSaved(false)
};
jZoomableTreemapNode.prototype.setForeignObjectExecute = function(c, d, a) {
    if (!Raphael.svg) {
        return false
    }
    if (c == null || c == "") {
        this.foreignObjEl = null;
        this.popover.foreignObjEl.remove();
        this.popover.foreignObjEl = null;
        this.CalcBodySize();
        return false
    }
    if (!this.foreignObjEl) {
        this.foreignObjEl = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        this.foreignObjEl.bodyEl = document.createElementNS("http://www.w3.org/1999/xhtml", "body");
        this.foreignObjEl.appendChild(this.foreignObjEl.bodyEl);
        this.popover.foreignObjEl = $("<div></div>").attr("class", "jpopover-foreignObjEl").appendTo(this.popover.body)
    }
    d && this.foreignObjEl.setAttribute("width", d);
    a && this.foreignObjEl.setAttribute("height", a);
    d && this.popover.foreignObjEl.width(d);
    a && this.popover.foreignObjEl.height(a);
    this.foreignObjEl.bodyEl.innerHTML = c;
    this.foreignObjEl.plainHtml = c;
    this.popover.foreignObjEl.html(c);
    if (BrowserDetect.browser == "MSIE") {
        var f = c.search(/youtube\.com/);
        if (f != -1) {
            var b = '<img src="' + jMap.cfg.contextPath + '/images/video_not_support.png" width="300" height="300"/>';
            this.foreignObjEl.bodyEl.innerHTML = b;
            this.popover.foreignObjEl.html(b)
        }
    }
    this.CalcBodySize()
};
jZoomableTreemapNode.prototype.foreignObjectResize = function(d, a) {
    if (jMap.cfg.realtimeSave) {
        var f = jMap.saveAction.isAlive();
        if (!f) {
            return null
        }
    }
    var g = jMap.historyManager;
    var b = g && g.extractNode(this);
    this.foreignObjectResizeExecute(d, a);
    var c = g && g.extractNode(this);
    g && g.addToHistory(b, c);
    jMap.saveAction.editAction(this);
    jMap.fireActionListener(ACTIONS.ACTION_NODE_FOREIGNOBJECT, this, null, d, a);
    jMap.setSaved(false)
};
jZoomableTreemapNode.prototype.foreignObjectResizeExecute = function(c, a) {
    c && this.foreignObjEl.setAttribute("width", c);
    a && this.foreignObjEl.setAttribute("height", a);
    c && this.popover.foreignObjEl.width(c);
    a && this.popover.foreignObjEl.height(a);
    var b = this.foreignObjEl.plainHtml;
    b = b.replace(/(width=")([^"]*)/ig, "$1" + c);
    b = b.replace(/(height=")([^"]*)/ig, "$1" + a);
    this.foreignObjEl.bodyEl.innerHTML = b;
    this.foreignObjEl.plainHtml = b;
    this.popover.foreignObjEl.html(b);
    this.CalcBodySize();
    jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(this);
    jMap.layoutManager.layout(true)
};
jZoomableTreemapNode.prototype.setEmbedVideo = function(d) {
    var f = /width?=?["']([^"']*)/gi;
    var c = f.exec(d)[1];
    var b = /height?=?["']([^"']*)/gi;
    var a = b.exec(d)[1];
    this.setForeignObject(d, c, a)
};
jZoomableTreemapNode.prototype.setVideo = function(f, c, a) {
    var d = jMap.cfg.default_video_size;
    var b = '<embed src="' + f + '" width="' + c + '"  height="' + a + '"></embed>';
    this.setHyperlink(f);
    this.setForeignObject(b, c, a)
};
jZoomableTreemapNode.prototype.setYoutubeVideo = function(k, g, a) {
    var h = jMap.cfg.default_video_size;
    if (g == null) {
        g = h
    }
    if (a == null) {
        a = h
    }
    var f = /v[=\/]([^&]*)/ig;
    var c = f.exec(k);
    if (c) {
        var b = "http://www.youtube.com/embed/" + c[1];
        var d = '<iframe src="' + b + '" frameborder="0" allowtransparency="true" width="' + g + '"  height="' + a + '" scrolling="no"></iframe>';
        this.setHyperlink(k);
        this.setForeignObject(d, g, a)
    }
};
jZoomableTreemapNode.prototype.zoomExecute = function(h) {
    var g = jMap.layoutManager;
    var f = g.getCenterLocation();
    var d = this;
    h = (h == undefined ? g.duration : h);
    g.hideAllPopover();
    jMap.arcTweenNode = d;
    var c = g.width / d.dx,
        b = g.height / d.dy;
    g.x.domain([d.x, d.x + d.dx]);
    g.y.domain([d.y, d.y + d.dy]);
    var a = d3.selectAll('g[data-node-type="' + jMap.cfg.nodeStyle + '"][data-node-leaf="true"]').transition().duration(h).attr("transform", function(k) {
        return "translate(" + [f.x + g.x(k.x), f.y + g.y(k.y)] + ")"
    });
    a.select("rect").attr("width", function(k) {
        return c * k.dx - 1
    }).attr("height", function(k) {
        return b * k.dy - 1
    });
    a.select("text").attr("x", function(k) {
        return c * k.dx / 2
    }).attr("y", function(k) {
        return b * k.dy / 2
    }).style("opacity", function(k) {
        return c * k.dx > jMap.nodes[k.id].w ? 1 : 0
    });
    return {
        end: function(k) {
            setTimeout(function() {
                k()
            }, h)
        }
    }
};
jZoomableTreemapNode.prototype.getChildren = function() {
    return this.children || []
};
jZoomableTreemapNode.prototype.screenFocus = function() {
    this.zoomExecute()
};
jZoomableTreemapNode.prototype.showPopover = function() {
    var a = this.getPopoverLocation();
    this.popover.container.attr("style", "top: " + (a.top) + "px; left: " + (a.left) + "px;");
    this.popover.container.addClass("active");
    this.popover.container.attr("data-placement", "right")
};
jZoomableTreemapNode.prototype.hidePopover = function() {
    this.popover.container.removeClass("active")
};
jZoomableTreemapNode.prototype.getPopoverLocation = function() {
    var k = this.groupEl.getBBox();
    var h = $(this.groupEl).offset();
    h.top += (k.height / 2) * jMap.cfg.scale;
    h.left += (k.width / 2) * jMap.cfg.scale;
    var b = $("#ribbon").height() + 10;
    var g = this.popover.container.width();
    var a = this.popover.container.height();
    var c = $(window).width();
    var f = $(window).height();
    var d = 5;
    if (h.top < b + d) {
        h.top = b + d
    } else {
        if (h.top + a > f - d) {
            h.top = f - a - d
        }
    }
    if (this.angle > 90) {
        if (h.left - g < d) {
            h.left = d + g
        }
    } else {
        if (h.left < d) {
            h.left = d
        } else {
            if (h.left + g > c - d) {
                h.left = c - d - g
            }
        }
    }
    return h
};
jSunburstNode.prototype.hidePopover = function() {
    this.popover.container.removeClass("active")
};
jZoomableTreemapNode.prototype.getPartitionTreeData = function() {
    var a = {};
    a.id = this.id;
    if (this.children.length) {
        a.children = [];
        this.children.forEach(function(b) {
            a.children.push(b.getPartitionTreeData())
        })
    }
    return a
};
jZoomableTreemapNode.prototype.getText = function() {
    return this.plainText
};
jZoomableTreemapNode.prototype.toXML = function(m) {
    var g = new StringBuffer();
    var h = false;
    if (this.img != null || (this.text.attrs.text != null && this.text.attrs.text.indexOf("\n") != -1)) {
        h = true
    }
    var f = new StringBuffer();
    f.add("<node");
    f.add('CREATED="' + this.created + '"');
    f.add('ID="' + this.id + '"');
    f.add('MODIFIED="' + this.modified + '"');
    f.add('CREATOR="' + this.creator + '"');
    f.add('CLIENT_ID="' + this.client_id + '"');
    if (!h) {
        f.add('TEXT="' + convertCharStr2SelectiveCPs(convertCharStr2XML(this.plainText, true, true), "ascii", true, "&#x", ";", "hex") + '"')
    }
    f.add('FOLDED="' + this.folded + '"');
    if (this.background_color != "") {
        f.add('BACKGROUND_COLOR="' + this.background_color + '"')
    }
    if (this.color != "") {
        f.add('COLOR="' + this.color + '"')
    }
    if (this.hyperlink != null) {
        f.add('LINK="' + convertCharStr2XML(this.hyperlink.attr().href) + '"')
    }
    if (this.position != "" && this.position != "undefined") {
        f.add('POSITION="' + this.position + '"')
    }
    if (this.style != "") {
        f.add('STYLE="' + this.style + '"')
    }
    if (this.hgap) {
        f.add('HGAP="' + this.hgap + '"')
    }
    if (this.vgap) {
        f.add('VGAP="' + this.vgap + '"')
    }
    if (this.vshift) {
        f.add('VSHIFT="' + this.vshift + '"')
    }
    if (this.numofchildren != null) {
        f.add('NUMOFCHILDREN="' + this.numofchildren + '"')
    }
    f.add(">");
    g.add(f.toString(" "));
    if (h) {
        var a = new StringBuffer();
        a.add('<richcontent TYPE="NODE"><html>\n');
        a.add("  <head>\n");
        a.add("\n");
        a.add("  </head>\n");
        a.add("  <body>\n");
        if (this.img != null) {
            a.add("    <p>\n");
            a.add('      <img src="' + this.imgInfo.href + '" width="' + this.imgInfo.width + '" height="' + this.imgInfo.height + '" />\n');
            a.add("    </p>\n")
        }
        if (this.text.attrs.text != null) {
            var l = JinoUtil.trimStr(this.text.attrs.text).split("\n");
            for (var k = 0; k < l.length; k++) {
                a.add("<p>" + convertCharStr2SelectiveCPs(convertCharStr2XML(l[k], true, true), "ascii", true, "&#x", ";", "hex") + "</p>\n")
            }
        }
        a.add("  </body>\n");
        a.add("</html>\n");
        a.add("</richcontent>");
        g.add(a.toString(" "))
    }
    if (this.arrowlinks.length > 0) {
        for (var k = 0; k < this.arrowlinks.length; k++) {
            g.add(this.arrowlinks[k].toXML())
        }
    }
    if (this.foreignObjEl) {
        var b = new StringBuffer();
        b.add('<foreignObject WIDTH="' + this.foreignObjEl.getAttribute("width") + '" HEIGHT="' + this.foreignObjEl.getAttribute("height") + '">');
        b.add(convertCharStr2SelectiveCPs(this.foreignObjEl.plainHtml, "ascii", true, "&#x", ";", "hex"));
        b.add("</foreignObject>");
        g.add(b.toString(" "))
    }
    for (var n in this.attributes) {
        g.add("<attribute NAME='" + n + "' VALUE='" + convertCharStr2SelectiveCPs(convertCharStr2XML(this.attributes[n], true, true), "ascii", true, "&#x", ";", "hex") + "'/>")
    }
    var c = new StringBuffer();
    c.add("<info");
    if (this.lazycomplete) {
        c.add('LAZYCOMPLETE="' + this.lazycomplete + '"')
    }
    c.add("/>");
    g.add(c.toString(" "));
    var d = this.getChildren();
    if (d.length > 0 && m == null) {
        for (var k = 0; k < d.length; k++) {
            g.add(d[k].toXML())
        }
    }
    g.add("</node>");
    return g.toString("\n")
};
jZoomableTreemapNode.prototype.setFolding = function(a) {
    if (jMap.jDebug) {
        console.log("setFolding")
    }
};
jZoomableTreemapNode.prototype.hideChildren = function(a) {
    if (jMap.jDebug) {
        console.log("hideChildren")
    }
};
jZoomableTreemapNode.prototype.relativeCoordinate = function(b, a) {
    if (jMap.jDebug) {
        console.log("relativeCoordinate")
    }
};
jZoomableTreemapNode.prototype.relativeCoordinateExecute = function(b, a) {
    if (jMap.jDebug) {
        console.log("relativeCoordinateExecute")
    }
};
jPadletNode = function(f) {
    var b = f.parent;
    var d = f.text;
    var g = f.id;
    var c = f.index;
    var a = f.position;
    this.sibling = f.sibling;
    jPadletNode.superclass.call(this, b, d, g, c, a);
    if (!this.attributes) {
        this.attributes = {}
    }
};
extend(jPadletNode, jMindMapNode);
jPadletNode.prototype.type = "jPadletNode";
jPadletNode.prototype.initElements = function() {
    this.body = RAPHAEL.rect();
    this.text = RAPHAEL.text();
    this.folderShape = RAPHAEL.circle(0, 0, FOLDER_RADIUS);
    this.wrapElements(this.body, this.text, this.folderShape)
};
jPadletNode.prototype.create = function() {
    this.connection = null;
    var b = this.body;
    var k = this.text;
    var g = this.folderShape;
    b.attr({
        r: NODE_CORNER_ROUND,
        rx: NODE_CORNER_ROUND,
        ry: NODE_CORNER_ROUND
    });
    if (this.sibling) {
        var f = this.sibling.getLocation();
        var h = this.sibling.getSize();
        this.attributes.padlet_x = "" + (parseFloat(f.x) + 0);
        this.attributes.padlet_y = "" + (parseFloat(f.y) + parseFloat(h.height) + 20);
        this.setLocation(this.attributes.padlet_x, this.attributes.padlet_y)
    } else {
        if (this.getParent()) {
            var f = this.getParent().getLocation();
            var h = this.getParent().getSize();
            this.attributes.padlet_x = "" + (parseFloat(f.x) + parseFloat(h.width) + 20);
            this.attributes.padlet_y = "" + (parseFloat(f.y) + 0);
            this.setLocation(this.attributes.padlet_x, this.attributes.padlet_y)
        }
    }
    this.setBackgroundColorExecute(jMap.cfg.nodeDefalutColor);
    this.setTextColorExecute(jMap.cfg.textDefalutColor);
    this.setEdgeColorExecute(jMap.cfg.edgeDefalutColor, jMap.cfg.edgeDefalutWidth);
    var d = jMap.cfg.branchDefalutWidth;
    if (this.getDepth() == 1) {
        d = 8
    }
    this.setBranchColorExecute(jMap.cfg.branchDefalutColor, d);
    if (typeof NodeColorMix !== "undefined") {
        NodeColorMix.rawDressColor(this)
    }
    var c = 400;
    var a = "Malgun Gothic, �������, Gulim, ����, Arial, sans-serif";
    if (!this.getParent()) {
        this.fontSize = jMap.cfg.nodeFontSizes[0];
        c = "700"
    } else {
        if (this.getParent() && this.getParent().isRootNode()) {
            this.fontSize = jMap.cfg.nodeFontSizes[1];
            c = "700"
        } else {
            this.fontSize = jMap.cfg.nodeFontSizes[2];
            c = "400"
        }
    }
    if (this.isRootNode()) {
        k.attr({
            "font-family": a,
            "font-size": this.fontSize,
            "font-weight": c
        })
    } else {
        k.attr({
            "font-family": a,
            "font-size": this.fontSize,
            "font-weight": c,
            "text-anchor": "start"
        })
    }
    this.setTextExecute(this.plainText)
};
jPadletNode.prototype.getSize = function() {
    return {
        width: this.body.getBBox().width,
        height: this.body.getBBox().height
    }
};
jPadletNode.prototype.setSize = function(b, a) {
    this.body.attr({
        width: b,
        height: a
    })
};
jPadletNode.prototype.getLocation = function() {
    return {
        x: this.body.getBBox().x,
        y: this.body.getBBox().y
    }
};
jPadletNode.prototype.setLocation = function(b, c) {
    var a = this.body;
    if (b && !c) {
        a.attr({
            x: b
        })
    } else {
        if (!b && c) {
            a.attr({
                y: c
            })
        } else {
            a.attr({
                x: b,
                y: c
            })
        }
    }
    this.updateNodeShapesPos()
};
jPadletNode.prototype.CalcBodySize = function() {
    var f = 0;
    var a = 0;
    var b = TEXT_HGAP;
    var d = TEXT_VGAP;
    if (this.getText() != "") {
        f += this.text.getBBox().width;
        a += this.text.getBBox().height
    }
    if (this.img) {
        f = (f < this.img.getBBox().width) ? this.img.getBBox().width : f;
        a += this.img.getBBox().height
    }
    if (this.foreignObjEl) {
        var c = parseInt(this.foreignObjEl.getAttribute("width"));
        var g = parseInt(this.foreignObjEl.getAttribute("height"));
        f = (f < c) ? c : f;
        a += g
    }
    if (this.hyperlink) {
        f += this.hyperlink.getBBox().width + b / 2
    }
    if (f == 0 || a == 0) {
        this.text.attr({
            text: "_"
        });
        f += this.text.getBBox().width;
        a += this.text.getBBox().height;
        this.text.attr({
            text: ""
        })
    }
    this.setSize(f + b, a + d)
};
jPadletNode.prototype.updateNodeShapesPos = function() {
    var k = TEXT_HGAP;
    var p = TEXT_VGAP;
    var l = 0;
    var o = this.body;
    var r = this.text;
    var d = this.folderShape;
    var z = this.img;
    var f = this.hyperlink;
    var c = this.foreignObjEl;
    var n = o.getBBox().x;
    var m = o.getBBox().y;
    var b = 0;
    var a = 0;
    switch (jMap.layoutManager.type) {
        case "jMindMapLayout":
            b = this.isLeft() ? n : n + this.body.getBBox().width;
            a = m + this.body.getBBox().height / 2;
            break;
        case "jTreeLayout":
            b = n + this.body.getBBox().width / 2;
            a = m + this.body.getBBox().height;
            break;
        case "jFishboneLayout":
            b = this.isLeft() ? n : n + this.body.getBBox().width;
            a = m + this.body.getBBox().height / 2;
            break;
        default:
            b = n;
            a = m;
            break
    }
    this.folderShape.attr({
        cx: b,
        cy: a
    });
    if (z) {
        var w = n + k / 2;
        var v = m + p / 2;
        if (this.isRootNode()) {
            w += (o.getBBox().width / 2) - (z.getBBox().width / 2) - k / 2
        }
        z.attr({
            x: w,
            y: v
        });
        l += z.getBBox().height
    }
    if (c) {
        var s = n + k / 2;
        var q = m + l + p / 2;
        l += parseInt(c.getAttribute("height"));
        c.setAttribute("x", s);
        c.setAttribute("y", q)
    }
    if (r) {
        var h = n + k / 2;
        var g = m + (p + r.getBBox().height) / 2;
        if (this.isRootNode()) {
            h += o.getBBox().width / 2 - k / 2
        }
        g += l;
        r.attr({
            x: h,
            y: g
        })
    }
    if (f) {
        var u = this.getLocation().x + this.getSize().width - f.getBBox().width - 3;
        var t = this.getLocation().y + (this.getSize().height - f.getBBox().height) / 2;
        f && f.attr({
            x: u,
            y: t
        })
    }
    this.connection && this.connection.updateLine()
};
jPadletNode.prototype.getInputPort = function() {
    var a = this.body.getBBox();
    var b = 0;
    var c = 0;
    if (isFinite(a.width) && !isNaN(a.width)) {
        b = a.width
    }
    if (isFinite(a.height) && !isNaN(a.height)) {
        c = a.height
    }
    switch (jMap.layoutManager.type) {
        case "jMindMapLayout":
            if (this.isRootNode()) {
                return {
                    x: a.x + b / 2,
                    y: a.y + c / 2
                }
            }
            if (this.isLeft && this.isLeft()) {
                return {
                    x: a.x + b + 1,
                    y: a.y + c / 2
                }
            } else {
                return {
                    x: a.x - 1,
                    y: a.y + c / 2
                }
            }
            break;
        case "jTreeLayout":
            if (this.isRootNode()) {
                return {
                    x: a.x + b / 2,
                    y: a.y + c
                }
            }
            return {
                x: a.x + b / 2,
                y: a.y
            };
            break;
        case "jRotateLayout":
            if (this.isRootNode()) {
                return {
                    x: a.x + b / 2,
                    y: a.y + c / 2
                }
            }
            if (this.isLeft && this.isLeft()) {
                return {
                    x: a.x - 1,
                    y: a.y + c / 2
                }
            } else {
                return {
                    x: a.x - 1,
                    y: a.y + c / 2
                }
            }
            break;
        case "jTableLayout":
            if (this.isRootNode()) {
                return {
                    x: a.x + b / 2,
                    y: a.y + c
                }
            }
            return {
                x: a.x + b / 2,
                y: a.y
            };
            break;
        case "jFishboneLayout":
            if (this.isRootNode()) {
                return {
                    x: a.x + b / 2,
                    y: a.y + c / 2
                }
            }
            if (this.isLeft && this.isLeft()) {
                return {
                    x: a.x + b + 1,
                    y: a.y + c / 2
                }
            } else {
                return {
                    x: a.x - 1,
                    y: a.y + c / 2
                }
            }
            break;
        default:
            return {
                x: a.x,
                y: a.y
            };
            break
    }
};
jPadletNode.prototype.getOutputPort = function() {
    var a = this.body.getBBox();
    var b = 0;
    var c = 0;
    if (isFinite(a.width) && !isNaN(a.width)) {
        b = a.width
    }
    if (isFinite(a.height) && !isNaN(a.height)) {
        c = a.height
    }
    switch (jMap.layoutManager.type) {
        case "jMindMapLayout":
            if (this.isRootNode()) {
                return {
                    x: a.x + b / 2,
                    y: a.y + c / 2
                }
            }
            if (this.isLeft()) {
                return {
                    x: a.x - 1,
                    y: a.y + c / 2
                }
            } else {
                return {
                    x: a.x + b + 1,
                    y: a.y + c / 2
                }
            }
            break;
        case "jTreeLayout":
            return {
                x: a.x + b / 2,
                y: a.y + c
            };
            break;
        case "jRotateLayout":
            if (this.isRootNode()) {
                return {
                    x: a.x + b / 2,
                    y: a.y + c / 2
                }
            }
            if (this.isLeft && this.isLeft()) {
                return {
                    x: a.x + b + 1,
                    y: a.y + c / 2
                }
            } else {
                return {
                    x: a.x + b + 1,
                    y: a.y + c / 2
                }
            }
            break;
        case "jTableLayout":
            return {
                x: a.x + b / 2,
                y: a.y + c
            };
            break;
        case "jFishboneLayout":
            if (this.isRootNode()) {
                return {
                    x: a.x + b / 2,
                    y: a.y + c / 2
                }
            }
            if (this.isLeft()) {
                return {
                    x: a.x - 1,
                    y: a.y + c / 2
                }
            } else {
                return {
                    x: a.x + b + 1,
                    y: a.y + c / 2
                }
            }
            break;
        default:
            return {
                x: a.x,
                y: a.y
            };
            break
    }
};
jPadletNode.prototype.toString = function() {
    return "jPadletNode"
};
jPadletNode.prototype.relativeCoordinateExecute = function(b, a) {
    this.attributes.padlet_x = parseFloat("" + this.attributes.padlet_x) + b;
    this.attributes.padlet_y = parseFloat("" + this.attributes.padlet_y) + a;
    jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(this);
    jMap.layoutManager.layout(true)
};
jLine = function(c, a) {
    this.node1 = c;
    this.node2 = a;
    var b = "#000";
    this.line = RAPHAEL.path().attr({
        stroke: b,
        fill: b
    });
    this.text_line = RAPHAEL.path().attr({
        stroke: "transparent",
        fill: "transparent"
    });
    this.text_line.node.id = "line_" + a.id;
    this.text = RAPHAEL.text();
    if (jMap.groupEl) {
        jMap.groupEl.appendChild(this.line.node)
    }
    this.line.toBack();
    this.draw()
};
jLine.prototype.type = "jLine";
jLine.prototype.updateLine = function() {
    this.draw()
};
jLine.prototype.getWidth = function() {
    var a = parseInt(this.node2.branch.width);
    if (isNaN(a)) {
        a = 0
    }
    return a
};
jLine.prototype.getColor = function() {
    return this.node2.edge.color
};
jLine.prototype.setColor = function(a) {
    this.line.attr({
        stroke: a,
        fill: a
    })
};
jLine.prototype.show = function() {
    this.line.show();
    this.text_line.show();
    this.text.show()
};
jLine.prototype.hide = function() {
    this.line.hide();
    this.text_line.hide();
    this.text.hide()
};
jLine.prototype.remove = function() {
    this.line.remove();
    this.text_line.remove();
    this.text.remove()
};
jLine.prototype.draw = function() {};
jLineBezier = function(b, a) {
    jLineBezier.superclass.call(this, b, a)
};
extend(jLineBezier, jLine);
jLineBezier.prototype.type = "jLineBezier";
jLineBezier.prototype.draw = function() {
    var v = this.getWidth();
    if (!v) {
        v = 1
    }
    var h = this.node2.isLeft();
    var s = this.node1.body.getBBox();
    var r = this.node2.body.getBBox();
    var u = 0;
    if (isFinite(s.width)) {
        u = s.width
    }
    var a = 0;
    if (isFinite(r.width)) {
        a = r.width
    }
    var B = this.node2.getInputPort();
    var q = this.node1.getOutputPort();
    if (h) {
        var E = [2, 7];
        if (this.node1.isRootNode()) {
            q = this.node1.getInputPort()
        }
    } else {
        var E = [3, 6]
    }
    var A = q.x,
        g = q.y - v / 2,
        w = B.x,
        b = B.y,
        p = Math.max(Math.abs(A - w) / 2, 10),
        o = Math.max(Math.abs(g - b) / 2, 10),
        z = [A, A, A - p, A + p][E[0]].toFixed(3),
        f = [g - o, g + o, g, g][E[0]].toFixed(3),
        x = [0, 0, 0, 0, w, w, w - p, w + p][E[1]].toFixed(3),
        c = [0, 0, 0, 0, g + o, g - o, b, b][E[1]].toFixed(3),
        m = g + v,
        C = [0, 0, 0, 0, w, w, w - p, w + p][E[1]],
        D = [A, A, A - p, A + p][E[0]];
    if (h) {
        if (g > b) {
            C = C - v;
            D = D - v
        } else {
            C = C + v;
            D = D + v
        }
    } else {
        if (g > b) {
            C = C + v;
            D = D + v
        } else {
            C = C - v;
            D = D - v
        }
    }
    C = C.toFixed(3);
    D = D.toFixed(3);
    var t = ["M", A.toFixed(3), g.toFixed(3), "C", z, f, x, c, w.toFixed(3), b.toFixed(3), "C", x, c, D, f, A.toFixed(3), m.toFixed(3)].join(",");
    this.line.attr({
        path: t
    });
    if (this.node2.attributes && this.node2.attributes.branchText) {
        this.text.show();
        this.text.attr({
            "text-anchor": "middle"
        });
        var d = this.node2.attributes.branchText;
        var n;
        var l = 50;
        var p = (b - g);
        var o = -(w - A);
        var k = Math.sqrt(p * p + o * o);
        if (k === 0) {
            k = 1
        }
        p *= 5 / k;
        o *= 5 / k;
        if (h) {
            n = ["M", w.toFixed(3), b.toFixed(3), "C", x, c, z, f, A.toFixed(3), g.toFixed(3)].join(",");
            p = -p;
            o = -o;
            if (this.node1.isRootNode()) {
                l -= 20
            }
        } else {
            n = ["M", A.toFixed(3), g.toFixed(3), "C", z, f, x, c, w.toFixed(3), b.toFixed(3)].join(",");
            if (this.node1.isRootNode()) {
                l += 20
            }
        }
        this.text_line.attr({
            path: n,
            transform: "t" + p.toFixed(3) + "," + o.toFixed(3)
        });
        this.text.node.innerHTML = '<textPath startOffset="' + l + '%" xlink:href="#' + this.text_line.node.id + '">' + d + "</textPath>"
    } else {
        this.text.hide()
    }
};
jLineStraight = function(b, a) {
    jLineStraight.superclass.call(this, b, a)
};
extend(jLineStraight, jLine);
jLineStraight.prototype.type = "jLineStraight";
jLineStraight.prototype.draw = function() {
    var d = this.getWidth();
    if (!d) {
        d = 1
    }
    var c = this.node1.body.getBBox();
    var a = this.node2.body.getBBox();
    var k = 0;
    if (isFinite(c.width)) {
        k = c.width
    }
    var g = 0;
    if (isFinite(a.width)) {
        g = a.width
    }
    var m = this.node2.getInputPort();
    var h = this.node1.getOutputPort();
    var f = h.x.toFixed(3),
        b = m.x.toFixed(3),
        n = h.y.toFixed(3),
        l = m.y.toFixed(3);
    var o = ["M", f, n, "L", b, l].join(",");
    this.line.attr({
        path: o
    })
};
jLinePolygonal = function(b, a) {
    jLinePolygonal.superclass.call(this, b, a)
};
extend(jLinePolygonal, jLine);
jLinePolygonal.prototype.type = "jLinePolygonal";
jLinePolygonal.prototype.draw = function() {
    var d = this.getWidth();
    if (!d) {
        d = 1
    }
    var c = this.node1.body.getBBox();
    var a = this.node2.body.getBBox();
    var k = 0;
    if (isFinite(c.width)) {
        k = c.width
    }
    var g = 0;
    if (isFinite(a.width)) {
        g = a.width
    }
    var n = this.node2.getInputPort();
    var h = this.node1.getOutputPort();
    var f = h.x.toFixed(0),
        b = n.x.toFixed(0),
        o = h.y.toFixed(0),
        m = n.y.toFixed(0);
    var l = parseInt(o) + 10;
    var p = ["M", f, o, "L", f, l, "L", b, l, "L", b, m, ].join(",");
    this.line.attr({
        path: p
    })
};
jLineFish = function(b, a) {
    this.HGAP = 10;
    this.VGAP = 10;
    this.angle = 90;
    jLineFish.superclass.call(this, b, a)
};
extend(jLineFish, jLine);
jLineFish.prototype.type = "jLineFish";
jLineFish.prototype.draw = function() {
    var d = this.getWidth();
    if (!d) {
        d = 1
    }
    var b = this.node1.getSize();
    var a = this.node2.getSize();
    var n = 0;
    if (isFinite(b.width)) {
        n = b.width
    }
    var l = 0;
    if (isFinite(a.width)) {
        l = a.width
    }
    var f = 0,
        c = 0,
        r = 0,
        q = 0;
    var k = this.node2.getUnChildren();
    var p = Math.sin(Math.PI * (90 - this.angle) / 180);
    var s = Math.cos(Math.PI * (90 - this.angle) / 180);
    var o = Math.tan(Math.PI * (90 - this.angle) / 180);
    if (this.node2.isVertical()) {
        if (this.node2.isTopSide()) {
            f = this.node2.getInputPort().x;
            r = this.node2.getInputPort().y;
            var m = this.node2.getTreeHeight();
            if (k != null && k.length > 0) {
                m -= k[0].getTreeHeight()
            }
            q = r - parseFloat(this.node2.getTreeHeight()) + 7;
            if (k != null && k.length > 0) {
                m += this.VGAP;
                q += k[0].getTreeHeight() - this.VGAP - 4;
                c += 4 * o
            }
            c += f + (m - 7) * o;
            f -= this.VGAP * o;
            r += this.VGAP
        } else {
            f = this.node2.getOutputPort().x - this.node2.body.getBBox().width * p;
            if (this.node2.getDepth() > 1) {
                f += 4
            }
            r = this.node1.getOutputPort().y + this.VGAP;
            c = f + (this.node2.body.getBBox().width - 3) * p;
            q = r + (this.node2.body.getBBox().width - 3) * s;
            if (k != null && k.length > 0) {
                var g = k[k.length - 1];
                var m = this.node2.getTreeHeight() - g.getTreeHeight() + g.body.getBBox().height;
                c = Math.max(c, f + m * o);
                q = Math.max(q, r + m)
            }
            f -= this.VGAP * o;
            r -= this.VGAP
        }
    } else {
        f = this.node2.getLocation().x - this.HGAP - 2;
        r = this.node2.getLocation().y + this.node2.getSize().height;
        c = f + this.node2.getTreeWidth() + this.HGAP - 2;
        q = r;
        var k = this.node2.getUnChildren();
        if (k != null && k.length > 0) {
            var g = k[k.length - 1];
            c -= g.getTreeWidth() - g.getSize().width - this.HGAP;
            if (this.node2.isTopSide()) {
                c -= 5
            } else {
                c += 1
            }
        }
        if (this.node2.isTopSide()) {
            f -= 6
        } else {
            f += 2
        }
    }
    var t = ["M", f, r, "L", c, q].join(",");
    this.line.attr({
        path: t
    })
};
ArrowLink = function(a) {
    this.startNode = null;
    this.color = null;
    this.destination = a ? a.id : null;
    this.destinationNode = a ? a : null;
    this.endArrow = "Default";
    this.endInclination = "129;0;";
    this.id = this.createID();
    this.startArrow = "None";
    this.startInclination = "129;0;";
    this.arrowWidth = 10;
    this.arrowHeight = 5;
    this.defaultColor = "#cc9";
    this.line = RAPHAEL.path().attr({
        stroke: this.color,
        fill: "none"
    });
    this.arrowEnd = RAPHAEL.path().attr({
        stroke: this.color,
        fill: this.defaultColor
    });
    this.arrowStart = RAPHAEL.path().attr({
        stroke: this.color,
        fill: this.defaultColor
    });
    this.hided = false
};
ArrowLink.prototype.type = "ArrowLink";
ArrowLink.prototype.remove = function() {
    if (this.removed) {
        return false
    }
    this.line.remove();
    this.arrowEnd.remove();
    this.arrowStart.remove();
    this.removed = true;
    return true
};
ArrowLink.prototype.hide = function() {
    this.line.hide();
    this.arrowEnd.hide();
    this.arrowStart.hide();
    this.hided = true
};
ArrowLink.prototype.show = function() {
    this.line.show();
    this.arrowEnd.show();
    this.arrowStart.show();
    this.hided = false
};
ArrowLink.prototype.getColor = function() {
    if (this.color != null) {
        return this.color
    } else {
        return this.defaultColor
    }
};
ArrowLink.prototype.createID = function() {
    var a = "";
    while (!jMap.checkID(a)) {
        a = "Arrow_ID_" + parseInt(Math.random() * 2000000000)
    }
    return a
};
ArrowLink.prototype.toXML = function() {
    var a = new StringBuffer();
    a.add("<arrowlink");
    a.add(' DESTINATION="' + this.destination + '"');
    if (this.color != null) {
        a.add('COLOR="' + this.color + '"')
    }
    if (this.endArrow != null) {
        a.add(' ENDARROW="' + this.endArrow + '"')
    }
    if (this.endInclination != null) {
        a.add(' ENDINCLINATION="' + this.endInclination + '"')
    }
    if (this.id != null) {
        a.add(' ID="' + this.id + '"')
    }
    if (this.startArrow != null) {
        a.add(' STARTARROW="' + this.startArrow + '"')
    }
    if (this.startInclination != null) {
        a.add(' STARTINCLINATION="' + this.startInclination + '"')
    }
    a.add("/>");
    return a.toString("\n")
};
ArrowLink.prototype.draw = function() {};
CurveArrowLink = function(a) {
    CurveArrowLink.superclass.call(this, a)
};
extend(CurveArrowLink, ArrowLink);
CurveArrowLink.prototype.type = "CurveArrowLink";
CurveArrowLink.prototype.draw = function() {
    if (this.removed) {
        return false
    }
    var n = jMap.getNodeById(this.destination);
    if (n == null || n.hided) {
        return false
    }
    var h = this.getColor();
    var b = this.startNode.getOutputPort();
    var k = n.getOutputPort();
    var d = this.startInclination.split(";");
    var q = this.endInclination.split(";");
    var c = b.x,
        p = b.y,
        a = k.x,
        o = k.y,
        m = parseFloat(b.x) + parseFloat(d[0]),
        g = parseFloat(b.y) + parseFloat(d[1]),
        l = parseFloat(k.x) + parseFloat(q[0]),
        f = parseFloat(k.y) + parseFloat(q[1]);
    if (this.startNode.isLeft && this.startNode.isLeft()) {
        m = parseFloat(b.x) - parseFloat(d[0])
    }
    if (n.isLeft && n.isLeft()) {
        l = parseFloat(k.x) - parseFloat(q[0])
    }
    var t = ["M", c.toFixed(3), p.toFixed(3), "C", m, g, l, f, a.toFixed(3), o.toFixed(3)].join(",");
    this.line && this.line.attr({
        path: t,
        stroke: h
    });
    this.line && (this.line.node.id = this.id);
    if (this.endArrow != "None") {
        var r = ["M", a.toFixed(3), o.toFixed(3), "L", a + this.arrowWidth, o + this.arrowHeight, "L", a + this.arrowWidth, o - this.arrowHeight, "L", a, o].join(",");
        if (n.isLeft && n.isLeft()) {
            r = ["M", a.toFixed(3), o.toFixed(3), "L", a - this.arrowWidth, o + this.arrowHeight, "L", a - this.arrowWidth, o - this.arrowHeight, "L", a, o].join(",")
        }
        this.arrowEnd && this.arrowEnd.attr({
            path: r,
            stroke: h,
            fill: h
        })
    }
    if (this.startArrow != "None") {
        var s = ["M", c.toFixed(3), p.toFixed(3), "L", c + this.arrowWidth, p + this.arrowHeight, "L", c + this.arrowWidth, p - this.arrowHeight, "L", c, p].join(",");
        if (n.isLeft && n.isLeft()) {
            s = ["M", c.toFixed(3), p.toFixed(3), "L", c - this.arrowWidth, p + this.arrowHeight, "L", c - this.arrowWidth, p - this.arrowHeight, "L", c, p].join(",")
        }
        this.arrowStart && this.arrowStart.attr({
            path: s,
            stroke: h,
            fill: h
        })
    }
};
RightAngleArrowLink = function(a) {
    RightAngleArrowLink.superclass.call(this, a);
    this.defaultColor = "#aaa"
};
extend(RightAngleArrowLink, ArrowLink);
RightAngleArrowLink.prototype.type = "RightAngleArrowLink";
RightAngleArrowLink.prototype.draw = function() {
    if (this.removed) {
        return false
    }
    var k = jMap.getNodeById(this.destination);
    if (k == null || k.hided) {
        return false
    }
    var d = this.getColor();
    var b = this.startNode.getOutputPort();
    var h = k.getInputPort();
    var c = b.x,
        m = b.y,
        a = h.x,
        l = h.y;
    var g = this.startNode.getSize().width;
    var f = k.getSize().width;
    var n = ["M", c.toFixed(3), m.toFixed(3), "L", c.toFixed(3), parseInt(m) + 10];
    if (parseInt(m) > parseInt(l) - 20) {
        n = n.concat(["L", parseInt(c) + parseInt((parseInt(a) + parseInt(g) / 2 - parseInt(c) - parseInt(f) / 2) / 2), parseInt(m) + 10]);
        n = n.concat(["L", parseInt(c) + parseInt((parseInt(a) + parseInt(g) / 2 - parseInt(c) - parseInt(f) / 2) / 2), parseInt(l) - 10]);
        n = n.concat(["L", a.toFixed(3), parseInt(l) - 10])
    } else {
        n = n.concat(["L", a.toFixed(3), parseInt(m) + 10])
    }
    n = n.concat(["L", a.toFixed(3), l.toFixed(3)]);
    this.line && this.line.attr({
        path: n.join(","),
        stroke: d
    })
};