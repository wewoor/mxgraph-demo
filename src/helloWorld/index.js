import React from 'react';

var Mx = require("mxgraph")({
    mxImageBasePath: "mxgraph/javascript/src/images",
    mxBasePath: "mxgraph/javascript/src"
})

const {
    mxGraph,
    mxRubberband
} = Mx;

export default class HelloWorld extends React.Component {

    constructor (props) {
        super(props)
    }

    componentDidMount() {
        this.draw();
    }

    draw = () => {
        const graph = new mxGraph(this.Container);
        // 线框选择器
        new mxRubberband(graph);

        var root = graph.getDefaultParent();

        graph.getModel().beginUpdate();
        try {
            // value可以是一个对象
            const hello = graph.insertVertex(root, null, 'Hello', 20, 20, 80, 30);
            const world = graph.insertVertex(root, null, 'World!', 200, 150, 80, 30);
            // 用 Edge 连接2个 vertex
            const e1 = graph.insertEdge(root,null, '', hello, world);
        } finally {
            graph.getModel().endUpdate();
        }
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
        </div>)
    }
}
