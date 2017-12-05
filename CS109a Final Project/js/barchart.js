// Constants
var svgWidth = $("#barcharts-area").width();
var svgHeight = svgWidth / 6;
var barWidth = svgWidth / 30;
var textWidth = svgWidth / 4.44;

/*
 * BarChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the bar charts
 * @param _data						-- the dataset 'household characteristics'
 * @param _config					-- variable from the dataset (e.g. 'electricity') and title for each bar chart
 */

BarChart = function(_parentElement, _data, _config){
	this.parentElement = _parentElement;
	this.data = _data;
	this.config = _config;
	this.displayData = _data;

	this.initVis();
}

/*
 * Initialize visualization (static content; e.g. SVG area, axes)
 */

BarChart.prototype.initVis = function(){
	var vis = this;

	// * TO-DO *
    // Referred to Lab 6

    // Initializing SVG
    vis.margin = { top: 10, right: 40, bottom: 0, left: 40 };

    vis.width = svgWidth - vis.margin.left - vis.margin.right;
    vis.height = svgHeight - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom);

    // Scales and axes
    vis.x = d3.scaleLinear()
        .range([textWidth, vis.width]);

    // Bar Graph SVG Groups
    vis.rects = vis.svg.append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.barLabels = vis.svg.append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.barValues = vis.svg.append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    // (Filter, aggregate, modify data)
	vis.wrangleData();
}



/*
 * Data wrangling
 */

BarChart.prototype.wrangleData = function(){
	var vis = this;

	// (1) Group data by key variable (e.g. 'electricity') and count leaves
	// (2) Sort columns descending

	// * TO-DO *
    // Grouping Data
    vis.countByConfig = d3.nest()
        .key(function(d) { return d[vis.config]; })
        .rollup(function(leaves) { return leaves.length; })
        .entries(vis.displayData);

    // Sort Columns
    vis.countByConfig = vis.countByConfig.sort(function(a, b) { return b.value - a.value; });

    // Update the visualization
	vis.updateVis();
}



/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 */

BarChart.prototype.updateVis = function(){
	var vis = this;

	if (vis.countByConfig.length > 0) {
        // (1) Update domains
        // (2) Draw rectangles
        // (3) Draw labels

        // Update Domain
        vis.x.domain([0, d3.max(vis.countByConfig).value]);


        // Bars
        var rectSVG = vis.rects.selectAll("rect")
            .data(vis.countByConfig, function(d) {
                return d.key;
            });

        var enterRects = rectSVG
                .enter()
                .append("rect")
                .attr("class", "bar");

        var mergeRects = enterRects
            .merge(rectSVG)
            .attr("x", textWidth)
            .attr("height", barWidth - 1)
            .attr("y", function (d, i) {
                return i * barWidth;
            })
            .transition()
            .duration(1500)
            .delay(700)
            .attr("width", function (d) {
                return vis.x(d.value) - textWidth;
            });

        rectSVG.exit().remove();

        // Bar Labels
        var barLabelsText = vis.barLabels.selectAll("text")
            .data(vis.countByConfig, function(d) {
                return d.key;
            });

        var enterBarLabelsText = barLabelsText.enter().append("text");

        var mergeBarLabelsText = enterBarLabelsText
            .merge(barLabelsText)
            .style("fill", "black")
            .attr("font-size", 10 + "px")
            .attr("x", 0)
            .transition()
            .duration(1500)
            .delay(700)
            .attr("y", function (d, i) {
                return i * barWidth + barWidth * 0.7;
            })
            .text(function (d) {
                return d.key;
            });

        barLabelsText.exit().remove();

        // Bar Values
        var barValuesText = vis.barValues.selectAll("text")
            .data(vis.countByConfig, function(d) {
                return d.key;
            });

        var enterBarValuesText = barValuesText.enter().append("text");

        var mergeBarValuesText = enterBarValuesText
            .merge(barValuesText)
            .style("fill", "black")
            .attr("font-size", 10 + "px")
            .attr("y", function (d, i) {
                return i * barWidth + barWidth * 0.7;
            })
            .transition()
            .duration(1500)
            .attr("x", function (d) {
                return 5 + vis.x(d.value);
            })
            .text(function (d) {
                return d.value;
            });

        barValuesText.exit().remove();
    };
}

/*
 * Filter data when the user changes the selection
 * Example for brushRegion: 07/16/2016 to 07/28/2016
 */

BarChart.prototype.selectionChanged = function(brushRegion){
	var vis = this;

	// Filter data accordingly without changing the original data
	
	// * TO-DO *aq
    vis.displayData = vis.data.filter(function (a) {
        return new Date(a.survey) >= new Date(brushRegion[0]);
    });

    vis.displayData = vis.displayData.filter(function (a) {
        return new Date(a.survey) <= new Date(brushRegion[1]);
    });


	// Update the visualization
	vis.wrangleData();
}
