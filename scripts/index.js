$(document).ready(function () {
  // TODO: use d3.json instead of jquery
  $.getJSON("./GDP-data.json", function (data) {
    drawGraph(data.data);
  })
})

function drawGraph(data) {
  var w = 500;
  var h = 100;

  var xScale = d3.scaleTime()
    .domain(d3.extent(data, function(d) { return new Date(d[0])}))
    .range([0, w]);
  
  var yScale = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return d[1] })])
    .range([0, h]);

  console.log(xScale);

  var svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  var g = svg.append("g");
  var yAxisG = g.append("g")
  var xAxisG = g.append("g")
  
  var	yAxis = d3.axisRight(yScale);
  var	xAxis = d3.axisBottom(xScale);
  
  svg.selectAll("rect")
    .data(data)
    .enter().append("rect")
    .attr("x", function(d) {
      return xScale(new Date(d[0]));
    })
    .attr("y", function(d) {
      return h - yScale(d[1]);
    })
    .attr("width", 20)
    .attr("height", function(d, i) {
      return i;
    });
  
  yAxisG.call(yAxis);
  xAxisG.call(xAxis);
  
}