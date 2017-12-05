CatBarGraph = function(_data, _parentElement, _selectionBoxElement, _colLabel, _xLabel, _svgWidth, _svgHeight){
    vis = this;

    this.data = _data;
    this.parentElement = _parentElement;
    this.selectionBoxElement = _selectionBoxElement;
    this.colLabel = _colLabel;
    this.xLabel = _xLabel;
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
    this.axisLabelFont = vis.svgWidth / 1000 * 15;
    this.barWidth = 100;
    this.barSpace = 10;
    this.transitionDuration = 1500;
    this.transitionDelay = 700;

    this.initVis();
};

CatBarGraph.prototype.initVis = function() {
    vis = this;

    vis.wrangleData();
    vis.initSVG();
    vis.initAxes();
    vis.updateVis();
};

CatBarGraph.prototype.wrangleData = function() {
    vis = this;

    vis.countKeys = d3.map(vis.data, function(d){return d[vis.colLabel];}).keys();
    vis.countKeys.sort();

    vis.countValues = [];
    vis.countKeys.forEach(function(key){
        vis.countValues[vis.countValues.length] = vis.data.filter(function(d){ return d[vis.colLabel] === key; }).length;
    });

    totalWidth = this.svgWidth - this.margin.left - this.margin.right;
    widthPerBar = totalWidth / vis.countValues.length;
    this.barWidth = widthPerBar * 0.8;
    this.barSpace = widthPerBar * 0.2;
};

CatBarGraph.prototype.initSVG = function() {
    vis = this;

    this.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .attr("id", "catBarGraph")
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.rects = vis.svg.append("g")
        .attr("id", "catBarGraphRects");
};

CatBarGraph.prototype.initAxes = function() {
    vis = this;

    // Scales and axes
    this.x = d3.scaleLinear()
        .range([0, vis.width])
        .domain([0,vis.countValues.length]);

    this.y = d3.scaleLinear()
        .range([vis.height,0])
        .domain([0,d3.max(vis.countValues)]);

    this.xAxis = d3.axisBottom()
        .scale(vis.x);

    this.yAxis = d3.axisLeft()
        .scale(vis.y);

    this.xAxisGroup = vis.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + (vis.height + 20) + ")");

    this.yAxisGroup = vis.svg.append("g")
        .attr("class", "y-axis axis");

    this.yAxisGroup.append("text")
        .attr("font-size", vis.axisLabelFont + "px")
        .attr("fill", "black")
        .text("Count")
        .attr("x", - vis.height / 2)
        .attr("y", - vis.margin.left * 3 / 4)
        .attr("transform", "rotate(270)");
};

CatBarGraph.prototype.updateAxes = function() {
    this.x = d3.scaleLinear()
        .range([0, vis.width])
        .domain([0,vis.countValues.length]);

    this.y = d3.scaleLinear()
        .range([vis.height,0])
        .domain([0,d3.max(vis.countValues)]);
};

CatBarGraph.prototype.updateVis = function() {
    vis = this;

    // Bars
    var rectSVG = vis.rects.selectAll("rect")
        .data(vis.countValues);

    var enterRects = rectSVG
        .enter()
        .append("rect")
        .attr("class", "bar");

    var mergeRects = enterRects
        .merge(rectSVG)
        .attr("width", vis.barWidth)
        .attr("x", function (d, i) {
            return vis.barSpace + i * (vis.barWidth + vis.barSpace);
        })
        .attr("y", vis.height)
        .attr("height", 0)
        .transition()
        .duration(vis.transitionDuration)
        .delay(vis.transitionDelay)
        .attr("y", function (d) {
            return vis.y(d);
        })
        .attr("height", function (d) {
            return vis.height - vis.y(d);
        });

    rectSVG.exit().remove();

    // Bar Labels
    var rectLabelsSVG = vis.rects.selectAll("text")
        .data(vis.countKeys);

    var enterRectLabels = rectLabelsSVG
        .enter()
        .append("text")
        .attr("class", "barLabel");

    var mergeRectLabels = enterRectLabels
        .merge(rectLabelsSVG)
        .attr("y", vis.height + 30)
        .attr("font-size", vis.axisLabelFont + "px")
        .attr("fill", "black")
        .transition()
        .duration(vis.transitionDuration)
        .text(function(d) {
            if(d === "")
                return "Unknown";
            return d;
        })
        .attr("x", function (d, i) {
            textLength = 0;
            if(d === "")
                textLength = 7 / 2 * vis.axisLabelFont/2; // 7 for "Unknown"
            else
                textLength = d.length / 2 * vis.axisLabelFont/2;
            return vis.barSpace + i * (vis.barWidth + vis.barSpace) + vis.barWidth / 2 - textLength;
        });

    rectLabelsSVG.exit().remove();

    // Call axis functions with the new domain
    vis.svg.select(".y-axis").call(vis.yAxis);
};

CatBarGraph.prototype.selectionChanged = function(){
    var vis = this;

    vis.colLabel = d3.select("#" + vis.selectionBoxElement).property("value");

    vis.wrangleData();
    vis.updateAxes();
    vis.updateVis();
};