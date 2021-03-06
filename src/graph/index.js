import React, { Component } from 'react'

import './style.css'

var Mx = require("mxgraph")({
    mxImageBasePath: "mxgraph/javascript/src/images",
    mxBasePath: "mxgraph/javascript/src"
})

const {
    // mxClient,
    mxGraph,
    mxShape,
    mxConnectionConstraint,
    mxPoint,
    mxPolyline,
    mxEvent,
    mxRubberband,
    mxCellState,
    mxConstants,
    mxEdgeStyle,
    mxPopupMenu,
    // mxEdgeHandler,
    // mxCellRenderer,
    mxPerimeter,
    mxUndoManager,
    // mxCylinder,
} = Mx

const KEY = {
    COMMAND: 91, // Command键
    CTRL: 17, // Control键
    BACKUP: 8, // Backup回车
    A: 65, // Button A
}

const VertexSize = { // vertex大小
    width: 120,
    height: 60,
}

export default class Editor extends Component {

    componentDidMount() {
        const editor = this.Container
        this.initEditor()
        this.loadEditor(editor)
        this.listenKeyboard()
        this.listenDoubleClick()
        this.listenConnection()
        this.undoManager()
    }

    /* eslint-disable */
    initEditor() {
        // Overridden to define per-shape connection points
        mxGraph.prototype.getAllConnectionConstraints = function (terminal, source) {
            if (terminal != null && terminal.shape != null) {
                if (terminal.shape.stencil != null) {
                    if (terminal.shape.stencil != null) {
                        return terminal.shape.stencil.constraints;
                    }
                }
                else if (terminal.shape.constraints != null) {
                    return terminal.shape.constraints;
                }
            }
            return null;
        };
        // Defines the default constraints for all shapes
        mxShape.prototype.constraints = [new mxConnectionConstraint(new mxPoint(0.25, 0), true),
        new mxConnectionConstraint(new mxPoint(0.5, 0), true),
        new mxConnectionConstraint(new mxPoint(0.75, 0), true),
        new mxConnectionConstraint(new mxPoint(0, 0.25), true),
        new mxConnectionConstraint(new mxPoint(0, 0.5), true),
        new mxConnectionConstraint(new mxPoint(0, 0.75), true),
        new mxConnectionConstraint(new mxPoint(1, 0.25), true),
        new mxConnectionConstraint(new mxPoint(1, 0.5), true),
        new mxConnectionConstraint(new mxPoint(1, 0.75), true),
        new mxConnectionConstraint(new mxPoint(0.25, 1), true),
        new mxConnectionConstraint(new mxPoint(0.5, 1), true),
        new mxConnectionConstraint(new mxPoint(0.75, 1), true)];
        // Edges have no connection points
        mxPolyline.prototype.constraints = null;
    }

    loadEditor(container) {
        // Disable context menu
        mxEvent.disableContextMenu(container)
        const graph = new mxGraph(container)
        this.graph = graph
        graph.setConnectable(true)
        graph.setTooltips(true)
        graph.view.setScale(1);

        // 禁止Edge对象移动
        graph.isCellsMovable = function(cell) {
            var cell = graph.getSelectionCell()
            console.log('isCellsMovable movable:', cell)
            return !(cell && cell.edge)
        }
        // 设置Vertex样式
        const vertexStyle = this.getDefaultVertexStyle()
        graph.getStylesheet().putDefaultVertexStyle(vertexStyle);

        // 默认边界样式
        let edgeStyle = this.getDefaultEdgeStyle();
        graph.getStylesheet().putDefaultEdgeStyle(edgeStyle);

        // enables rubberband
        new mxRubberband(graph)
        // First root
        const parent = graph.getDefaultParent()
        const model = graph.getModel()
        // Adds cells to the model in a single step
        model.beginUpdate();
        try {
            const v1 = graph.insertVertex(parent, null, 'block1', 20, 20,
            VertexSize.width, VertexSize.height)

            const v2 = graph.insertVertex(parent, null, 'block2', 200, 150, 
            VertexSize.width, VertexSize.height)

            const v3 = graph.insertVertex(parent, null, 'block3', 300, 150, 
            VertexSize.width, VertexSize.height)

            const e1 = graph.insertEdge(parent, null, '', v1, v3)
            const e2 = graph.insertEdge(parent, null, '', v2, v3)
        } finally {
            model.endUpdate()
        }
        this.initContextMenu(graph)
        
    }

    getDefaultVertexStyle() {
        let style = [];
        style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
        style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
        style[mxConstants.STYLE_STROKECOLOR] = '#fff';
        style[mxConstants.STYLE_ROUNDED] = true;
        style[mxConstants.STYLE_FILLCOLOR] = '#18a689';
        // style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
        style[mxConstants.STYLE_FONTCOLOR] = '#ffffff';
        style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
        style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
        style[mxConstants.STYLE_FONTSIZE] = '12';
        style[mxConstants.STYLE_FONTSTYLE] = 1;
        return style;
    }

    getDefaultEdgeStyle() {
        let style = [];
        style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_CONNECTOR;
        style[mxConstants.STYLE_STROKECOLOR] = '#18a689';
        style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
        style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
        style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
        style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_CLASSIC;
        style[mxConstants.STYLE_FONTSIZE] = '10';
        return style
    }

    initContextMenu(graph) {
        // let mxCellRendererInstallCellOverlayListeners = mxCellRenderer.prototype.installCellOverlayListeners
        // mxCellRenderer.prototype.installCellOverlayListeners = function(state, overlay, shape) {
        //     let gh = state.view.graph
        //     console.log('context menu', shape.node)
        //     mxEvent.addGestureListeners(shape.node,
        //         evt => { graph.fireMouseEvent(mxEvent.MOUSE_DOWN, new mxMouseEvent(evt, state)) },
        //         evt => { graph.fireMouseEvent(mxEvent.MOUSE_MOVE, new mxMouseEvent(evt, state)) },
        //         evt => {
        //             if (mxClient.IS_QUIRKS) {
        //                 graph.fireMouseEvent(mxEvent.MOUSE_UP, new mxMouseEvent(evt, state)) 
        //             }
        //         },
        //     )
        // }
        var mxPopupMenuShowMenu = mxPopupMenu.prototype.showMenu;
        mxPopupMenu.prototype.showMenu = function() {
            var cells = this.graph.getSelectionCells()
            if (cells.length > 0 && cells[0].vertex) {
                mxPopupMenuShowMenu.apply(this, arguments);
            } else return false
        };
        graph.popupMenuHandler.autoExpand = true
        graph.popupMenuHandler.factoryMethod = function(menu, cell, evt) {
            menu.addItem('Item1', null, function() {
                alert('item 1')
            })
            menu.addItem('移除', null, function() {
                console.log(graph, cell)
                graph.removeCells([cell])
            })
            menu.addSeparator()
            let subMenu = menu.addItem('SubMen', null, null)
            menu.addItem('Item2', null, function() {
                alert('item 1')
            }, subMenu)
        }
    }

    zoomIn() {
        this.graph.zoomIn()
    }

    zoomOut() {
        this.graph.zoomOut()
    }

    removeCell(cells) {
        // 获取选中的Cell
        const cell = cells || this.graph.getSelectionCells() // getSelectionCell
        if (cell && cell.length > 0) {
            console.log('state:', this.graph.getSelectionCell())
            this.graph.removeCells(cell)
        }
    }

    insert() {
        const parent = this.graph.getDefaultParent()
        this.graph.insertVertex(parent, null, new Date().getTime(), null, 150, 80, 30)
    }

    outputRoot() {
        const parent = this.graph.getDefaultParent()
        console.log('aaa', this.graph.getChildCells(parent))
    }

    disableConnection() {
        this.graph.setConnectable(false)
    }

    resetView() {
        this.graph.view.scaleAndTranslate(1, 0, 0);
    }

    listenDoubleClick() {
        this.graph.addListener(mxEvent.DOUBLE_CLICK, function(sender, evt) {
            const cell = evt.getProperty('cell')
            if (cell) {
                window.open("http://www.google.com")
            }
        })
    }

    listenConnection() { // 仅仅限制有效的链接
        const graph = this.graph

        graph.connectionHandler.createEdgeState = me => {
            let edge = graph.createEdge(null, null, null, null, null)
            return new mxCellState(graph.view, edge, graph.getCellStyle(edge));
        }

        // graph.connectionHandler.isValidTarget = cell => {
        //     const currentCell = this.graph.getSelectionCell()
        //     const a = currentCell.id !== cell.id
        //     console.log('is valide:', currentCell.id !== cell.id)
        //     return a
        // }

        graph.connectionHandler.addListener(mxEvent.CONNECT, function(sender, evt) {
            var edge = evt.getProperty('cell');
            var source = graph.getModel().getTerminal(edge, true);
            var target = graph.getModel().getTerminal(edge, false);
            console.log('connect:', source, target)
            if (!source || !target) {
                graph.removeCells([edge])
            }
        })

        graph.connectionHandler.addListener(mxEvent.RESET, function(sender, evt) {
            var edge = evt.getProperty('cell');
            var source = graph.getModel().getTerminal(edge, true);
            var target = graph.getModel().getTerminal(edge, false);
            console.log('RESET connect:', source, target)
            if (!source || !target) {
                graph.removeCells([edge])
            }
        })
    }

    listenKeyboard() {
        const ctx = this
        let keypress = {
            [KEY.COMMAND]: false,
            [KEY.A]: false,
            [KEY.CTRL]: false,
        }
        document.addEventListener('keydown', (e) => {
            console.log('keycode:', e, e.keyCode)
            switch(e.keyCode) {
                case KEY.BACKUP:
                    ctx.removeCell()
                    break;
                case KEY.COMMAND:
                    keypress[KEY.COMMAND] = true
                    break;
                case KEY.A:
                    keypress[KEY.A] = true
                    break;
                case KEY.CTRL:
                    keypress[KEY.CTRL] = true
                    break;
                default:
                    // keypress = {}
            }
            console.log('keypress', keypress)
            // 全选
            if ((keypress[KEY.COMMAND] && keypress[KEY.A]) 
            || (keypress[KEY.A] && keypress[KEY.CTRL])) { // ctrl + a, command + a
                ctx.graph.selectAll()
                keypress[KEY.COMMAND] = false
                keypress[KEY.A] = false
                keypress[KEY.CTRL] = false
            }
        })
    }

    graphEnable() {
        const status = this.graph.isEnabled()
        this.graph.setEnabled(!status)
    }

    undoManager() {
        const undoManager = new mxUndoManager()
        const graph = this.graph
        this.undoMana = undoManager
        const listener = function(sender, evt) {
            undoManager.undoableEditHappened(evt.getProperty('edit'));
        }
        graph.getModel().addListener(mxEvent.UNDO, listener);
        graph.getView().addListener(mxEvent.UNDO, listener);
    }

    undo() { // 撤销上一步
        console.log('undo!!')
        this.undoMana.undo()
    }

    /* eslint-enable */
    render() {
        return (
            <div>
                <div className="editor" ref={(e) => { this.Container = e }} />
                <div style={{ position: 'absolute', zIndex: '2', right: '20px', top: '30px' }}>
                    <button onClick={() => this.zoomIn()}>放大</button>
                    <button onClick={() => this.zoomOut()}>缩小</button>
                    <button onClick={() => this.resetView()}>重置</button>
                    <button onClick={() => this.insert()}>添加</button>
                    <button onClick={() => this.outputRoot()}>Root节点</button>
                    <button onClick={() => this.disableConnection()}>禁止链接</button>
                    <button onClick={() => this.currentState()}>状态</button>
                    <button onClick={() => this.graphEnable()}>禁止编辑</button>
                    <button onClick={() => this.undo()}>撤销</button>
                </div>
            </div>
        )
    }
}