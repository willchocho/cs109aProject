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

    console.log(vis.x.domain());
    console.log(vis.x.ticks(vis.numTicks));

    vis.histogram = d3.histogram()
        .domain(vis.x.domain())
        .thresholds(vis.x.ticks(vis.numTicks));

    vis.bins = vis.histogram(vis.colData);

    console.log(vis.bins);

    console.log(vis.bins[0].x0);

    vis.y = d3.scaleLinear()
        .domain([0, d3.max(vis.bins, function(d) { return d.length; })])
        .range([vis.height,0]);

    /*
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
    */
};

Histogram.prototype.updateVis = function() {
    vis = this;

    vis.bar = vis.barsGroup.selectAll(".histogramBar")
        .data(vis.bins)
        .enter().append("g")
        .attr("class", "histogramBar bar")
        .attr("transform", function(d) { return "translate(" + vis.x(d.x0) + "," + vis.y(d.length) + ")"; });

    vis.bar.append("rect")
        .attr("x", 0)
        .attr("width", vis.x(vis.bins[1].x1) - vis.x(vis.bins[1].x0) - 1)
        .attr("height", function(d) { return vis.height - vis.y(d.length); });

    vis.barsGroup.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + vis.height + ")")
        .call(d3.axisBottom(vis.x));
};