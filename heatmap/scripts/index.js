var DATA_PATH = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';

d3.json(DATA_PATH, render);

function cleanup(data) {
  return data.map(function(obs) {
    return {
      date: new Date(obs.year, obs.month),
      month: obs.month,
      year: obs.year,
      variance: obs.variance
    };
  });
}

function render(data) {
  var baseTemperature = data.baseTemperature;
  var data = cleanup(data.monthlyVariance);
  var yearsRange = 2015 - 1753

  console.log(data);

  var margin = {
    left: 50,
    right: 50,
    top: 50,
    bottom: 50
  };
  var width = 1400 - margin.left - margin.right;
  var height = 700 - margin.bottom - margin.top;
  var cellWidth = width / yearsRange;
  var cellHeight = height / 13;
  

  var xScale = d3.scale.linear()
    .domain(d3.extent(data, function(d) { return d.year }))
    .range([margin.left, width])

  var yScale = d3.scale.linear()
    .domain([1, 12])
    .range([height, margin.bottom]);

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
  

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");
  
  var cValue = function(d) { return d.dopingAccused },
    color = d3.scale.category10();
  
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .html(function(d) {
      return "Year: " + d.year + "<br>Month: " + d.month;
    });

  var svg =  d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .call(tip);

  svg.append('g')
    .attr('class', 'x axis')
    .attr("transform", "translate(0," + (height) + ")")
    .call(xAxis);

  svg.append('g')
    .attr('class', 'y axis')
    .attr("transform", "translate(" + (margin.left) + ",0)")
    .call(yAxis);

  svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return xScale(d.year); })
    .attr("width", function(d) { return cellWidth})
    .attr("y", function(d) { return height - (cellHeight * d.month); })
    .attr("height", function(d) { return cellHeight })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)
}
