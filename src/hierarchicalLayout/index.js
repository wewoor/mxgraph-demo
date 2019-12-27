import React from 'react';

var Mx = require("mxgraph")({
    mxImageBasePath: "mxgraph/javascript/src/images",
    mxBasePath: "mxgraph/javascript/src"
})

const {
    mxGraph,
    mxRubberband,
    mxPerimeter,
    mxStyleRegistry,
    mxConstants,
    mxEdgeStyle,
    mxHierarchicalLayout,
} = Mx;

export default class HierarchicalLayout extends React.Component {

    constructor (props) {
        super(props)
    }

    componentDidMount() {
        this.draw();
    }

    draw = () => {
        const graph = new mxGraph(this.Container);
        this._graph = graph;
        // 线框选择器
        new mxRubberband(graph);

        // 默认边界样式
        let edgeStyle = this.getDefaultEdgeStyle();
        graph.getStylesheet().putDefaultEdgeStyle(edgeStyle);

        // 设置 Vertex 样式
        const vertexStyle = this.getDefaultVertexStyle();
        graph.getStylesheet().putDefaultVertexStyle(vertexStyle);

        var root = graph.getDefaultParent();

        graph.getModel().beginUpdate();
        try {
            // value可以是一个对象
            const parent1 = graph.insertVertex(root, null, 'parent1', 20, 20, 80, 30);
            const parent2 = graph.insertVertex(root, null, 'parent2', 20, 70, 80, 30);
            const current = graph.insertVertex(root, null, 'current', 140, 35, 80, 30);
            const child1 = graph.insertVertex(root, null, 'child1', 240, 20, 80, 30);
            const child2 = graph.insertVertex(root, null, 'child2', 240, 70, 80, 30);

            // 用 Edge 连接2个 vertex
            const e1 = graph.insertEdge(root, null, '', parent1, current);
            const e2 = graph.insertEdge(root, null, '', parent2, current);
            const e3 = graph.insertEdge(root, null, '', current, child1);
            const e4 = graph.insertEdge(root, null, '', current, child2);

        } finally {
            graph.getModel().endUpdate();
        }
    }

    layout = (change, post) => {
        const graph = this._graph;
        const model = graph.getModel();

        model.beginUpdate();
        try {
            const layout = new mxHierarchicalLayout(graph, false);
            layout.orientation = 'west';
            layout.disableEdgeStyle = false;
            layout.interRankCellSpacing = 40;
            layout.intraCellSpacing = 10;

            if (change != null) {
                change();
            }
            layout.execute(graph.getDefaultParent());
            graph.center();
        } catch (e) {
            throw e;
        } finally {
            if (post != null) { post(); }
            model.endUpdate();
        }
    }

    getDefaultVertexStyle () {
        let style: any = [];
        style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
        style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
        style[mxConstants.STYLE_STROKECOLOR] = '#90D5FF';
        style[mxConstants.STYLE_FILLCOLOR] = '#FFFFFF';
        style[mxConstants.STYLE_FONTCOLOR] = '#333333';
        style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
        style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
        style[mxConstants.STYLE_FONTSIZE] = '14';
        style[mxConstants.STYLE_FONTSTYLE] = 1;
        style[mxConstants.STYLE_ARCSIZE] = 2;
        style[mxConstants.STYLE_ROUNDED] = true;
        return style;
    }

    getDefaultEdgeStyle () {
        let style: any = [];
        style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_CONNECTOR;
        style[mxConstants.STYLE_STROKECOLOR] = '#999999';
        style[mxConstants.STYLE_STROKEWIDTH] = 1;
        style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
        style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
        style[mxConstants.STYLE_EDGE] = mxEdgeStyle.OrthConnector; // TopToBottom;
        style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_BLOCK;
        style[mxConstants.STYLE_FONTSIZE] = '10';
        style[mxConstants.STYLE_ROUNDED] = false;
        style[mxConstants.STYLE_CURVED] = true;
        return style
    }

    render() {
        return (<div className="graph-container">
            <div className="editor pointer" style={{
                overflow: 'hidden',
                height: 600,
                width: 600,
                background: `url(images/grid.gif)`
            }}
            ref={(e) => { this.Container = e }} />
            <div style={{ position: 'absolute', zIndex: 2, right: '20px', top: '30px' }}>
                <button onClick={() => this.layout()}>布局</button>
            </div>
        </div>)
    }
}
