Histogram = function(_data, _parentElement, _selectionBoxElement, _colLabel, _numTicks, _svgWidth, _svgHeight){
    vis = this;

    this.data = _data;
    this.parentElement = _parentElement;
    this.selectionBoxElement = _selectionBoxElement;
    this.colLabel = _colLabel;
    this.numTicks = _numTicks;
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

Histogram.prototype.initVis = function() {
    vis = this;

    vis.wrangleData();
    vis.initSVG();
    vis.initAxesBins();
    vis.updateVis();
};

Histogram.prototype.wrangleData = function() {
    vis = this;

    vis.colData = [];
    vis.data.forEach(function(d) {
        vis.colData[vis.colData.length] = +d[vis.colLabel];
    });
};

Histogram.prototype.initSVG = function() {
    vis = this;

    this.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .attr("id", "histogram")
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.barsGroup = vis.svg.append("g")
        .attr("id", "histogramBars");
};

Histogram.prototype.initAxesBins = function() {
    vis = this;

    vis.x = d3.scaleLinear()
        .domain(d3.extent(vis.colData))
        .nice()
        .rangeRound([0, vis.width]);

    vis.histogram = d3.histogram()
        .domain(vis.x.domain());

    vis.bins = vis.histogram(vis.colData);

    vis.y = d3.scaleLinear()
        .domain([0, d3.max(vis.bins, function(d) { return d.length; })])
        .range([vis.height,0]);

    this.xAxis = d3.axisBottom()
        .scale(vis.x);

    this.yAxis = d3.axisLeft()
        .scale(vis.y);

    this.xAxisGroup = vis.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + (vis.height) + ")");

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

Histogram.prototype.updateAxesBins = function() {
    vis = this;

    vis.x = d3.scaleLinear()
        .domain(d3.extent(vis.colData))
        .nice()
        .rangeRound([0, vis.width]);

    vis.histogram = d3.histogram()
        .domain(vis.x.domain());

    vis.bins = vis.histogram(vis.colData);

    vis.y = d3.scaleLinear()
        .domain([0, d3.max(vis.bins, function(d) { return d.length; })])
        .range([vis.height,0]);
};

Histogram.prototype.updateVis = function() {
    vis = this;

    // Bars
    var rectSVG = vis.svg.selectAll("rect")
        .data(vis.bins);

    var enterRects = rectSVG
        .enter()
        .append("rect")
        .attr("class", "histogramBar bar");

    var mergeRects = enterRects
        .merge(rectSVG)
        .attr("width", function(d) { return vis.x(d.x1) - vis.x(d.x0) - 1; })
        .attr("x", function (d) {
            return vis.x(d.x0);
        })
        .attr("y", vis.height)
        .attr("height", 0)
        .transition()
        .duration(vis.transitionDuration)
        .delay(vis.transitionDelay)
        .attr("y", function (d) {
            return vis.y(d.length);
        })
        .attr("height", function (d) {
            return vis.height - vis.y(d.length);
        });

    rectSVG.exit().remove();

    vis.xAxisGroup.call(d3.axisBottom(vis.x));
    vis.yAxisGroup.call(d3.axisLeft(vis.y));
};

Histogram.prototype.selectionChanged = function(){
    var vis = this;

    vis.colLabel = d3.select("#" + vis.selectionBoxElement).property("value");

    vis.wrangleData();
    vis.updateAxesBins();
    vis.updateVis();
};