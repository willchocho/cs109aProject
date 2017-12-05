CorrGraph = function(_data, _parentElement, _svgWidth, _svgHeight){
    vis = this;

    this.data = _data;
    this.parentElement = _parentElement;
    if (_svgWidth)
        this.svgWidth = _svgWidth;
    else
        this.svgWidth = $("#"+vis.parentElement).width();
    if (_svgHeight)
        this.svgHeight = _svgHeight;
    else
        this.svgHeight = vis.svgWidth / 1.5;
    this.margin = { top: 50, right: 50, bottom: 50, left: 50 };
    this.width = vis.svgWidth - vis.margin.left - vis.margin.right;
    this.height = vis.svgHeight - vis.margin.top - vis.margin.bottom;
    this.axisLabelFont = vis.svgWidth / 1000 * 10;
    this.labelMarginLeft = this.axisLabelFont * 15;
    this.labelMarginTop = this.axisLabelFont * 15;
    this.rectWidth = (this.width - vis.labelMarginLeft) / this.data.length;
    this.rectSpace = this.rectWidth * 0.1;
    this.transitionDuration = 1500;
    this.transitionDelay = 700;

    this.initVis();
};

CorrGraph.prototype.initVis = function() {
    vis = this;

    vis.initSVG();
    vis.initScales();
    vis.updateVis();
};

CorrGraph.prototype.initSVG = function() {
    vis = this;

    this.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .attr("id", "corrGraph")
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.rects = vis.svg.append("g")
        .attr("id", "corrGraphRects")
        .attr("transform", "translate(" + vis.labelMarginLeft + "," + vis.labelMarginTop + ")");
};

CorrGraph.prototype.initScales = function() {
    vis = this;

    // Scales and axes
    this.x = d3.scaleLinear()
        .range([0, vis.width])
        .domain([0,vis.data.length]);

    this.y = d3.scaleLinear()
        .range([vis.height,0])
        .domain([0,vis.data.length]);

    this.colorScale = d3.scaleLinear()
        .domain([0,1])
        .range(["#ffeda0","#f03b20"]);
};

CorrGraph.prototype.updateVis = function() {
    vis = this;

    for (i = 0; i < vis.data.length; i++) {
        row = vis.data[i];
        rowLabels = Object.keys(row);
        rowLabels.splice(rowLabels.indexOf("Label"), 1);

        vis.svg.append("text")
            .attr("x", 0)
            .attr("y", vis.labelMarginTop + (i+1) * (vis.rectWidth + vis.rectSpace))
            .text(rowLabels[i])
            .attr("font-size", vis.axisLabelFont + "px");

        vis.svg.append("text")
            .attr("x", 0)
            .attr("y", -vis.labelMarginLeft - i * (vis.rectWidth + vis.rectSpace))
            .text(rowLabels[i])
            .attr("font-size", vis.axisLabelFont + "px")
            .attr("transform", "rotate(" + 90 + ")");

        for (j = 0; j < rowLabels.length; j++) {
            vis.rects.append("rect")
                .attr("id", rowLabels[i] + " " + rowLabels[j])
                .attr("width", vis.rectWidth)
                .attr("height", vis.rectWidth)
                .attr("x", j * (vis.rectWidth + vis.rectSpace))
                .attr("y", i * (vis.rectWidth + vis.rectSpace))
                .style("fill", vis.colorScale(row[rowLabels[j]]));
        }
    }
};

