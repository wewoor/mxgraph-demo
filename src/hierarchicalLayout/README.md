## mxGraph 简介

-   简介 http://jgraph.github.io/mxgraph/
-   上手指南 https://jgraph.github.io/mxgraph/docs/manual.html#1.7.1
-   丰富的使用示例 http://jgraph.github.io/mxgraph/javascript/index.html
-   API 文档 https://jgraph.github.io/mxgraph/docs/js-api/files/index-txt.html

## npm 安装和使用

> \$ npm i mxgraph

```javascript
var Mx = require("mxgraph")({
    mxImageBasePath: "./src/images",
    mxBasePath: "./src"
});
```

## 几个概念

-   mxGraph
    设计用来提供主要的公共 API

-   mxGraphModel

mxGraphModel 是描述一个 graph 的核心模型对象，对 graph 结构的增删改查都是通过 model 对象提供的 API。但是，
所以当我们添加一个 cell 时，则是将 cell 是添加到了某个 model 对象，但为了符合使用上的直觉，我们仍然使用 mxGraph 对象来执行相关
操作，例如：

```javascript
// Adds cells to the model in a single step
graph.getModel().beginUpdate();
try {
    var v1 = graph.insertVertex(parent, null, "Hello,", 20, 20, 80, 30);
    var v2 = graph.insertVertex(parent, null, "World!", 200, 150, 80, 30);
    var e1 = graph.insertEdge(parent, null, "", v1, v2);
} finally {
    // Updates the display
    graph.getModel().endUpdate();
}
```

-   mxGraphModel.beginUpdate() - starts a new transaction or a sub-transaction.
-   mxGraphModel.endUpdate() - completes a transaction or a sub-transaction.
-   mxGraph.addVertex() - Adds a new vertex to the specified parent cell.
-   mxGraph.addEdge() - Adds a new edge to the specified parent cell.

### mxCell

mxCell 是 vertices 或者 edges 单元（cell) 的抽象对象。

-   mxGraph.insertVertex(parent, id, value, x, y, width, height, style) – creates and inserts a new vertex into the model, within a begin/end update call.
-   mxGraph.insertEdge(parent, id, value, source, target, style) – creates and inserts a new edge into the model, within a begin/end update call.

```javascript
// 添加 vertex
var cell = graph.insertVertex(parent, null, "Hello", 20, 20, 80, 30, "ROUNDED");
// 为 v1, v2 添加
var edge = graph.insertEdge(parent, null, "", v1, v2);
```

## Hello World

编写 Hello World

```javascript
const {
    mxGraph,
    mxEvent,
    mxRubberband, //
    mxConstants,
    mxEdgeStyle,
    mxPerimeter,
    mxHierarchicalLayout,
    mxUtils
} = Mx;

// Creates the graph inside the given container
var graph = new mxGraph(container);

// Enables rubberband selection
new mxRubberband(graph);

// Gets the default parent for inserting new cells. This
// is normally the first child of the root (ie. layer 0).
var parent = graph.getDefaultParent();

// Adds cells to the model in a single step
graph.getModel().beginUpdate();
try {
    var v1 = graph.insertVertex(parent, null, "Hello,", 20, 20, 80, 30);
    var v2 = graph.insertVertex(parent, null, "World!", 200, 150, 80, 30);
    var e1 = graph.insertEdge(parent, null, "", v1, v2);
} finally {
    // Updates the display
    graph.getModel().endUpdate();
}
```

## 层级布局（mxHierarchicalLayout）

##

## 自定义 Edge, Cell 的样式

```javascript
const {
    mxConstants,
    mxEdgeStyle,
    mxPerimeter,
    mxHierarchicalLayout,
    mxUtils
} = Mx;

// Edge 默认样式
graph.getStylesheet().putDefaultEdgeStyle(edgeStyle);

// Vertex 默认样式
graph.getStylesheet().putDefaultVertexStyle(vertexStyle);

```
