var DATA_PATH = 'GDP-data.json';

d3.json(DATA_PATH, render);

function cleanup(data) {
  return data.data.map(function(obs) {
    return {
      date: new Date(obs[0]),
      gdp: obs[1]
    };
  });
}

function render(data) {
  var data = cleanup(data);

  var margin = {
    left: 50,
    right: 50,
    top: 50,
    bottom: 50
  };
  var width = 900 - margin.left - margin.right;
  var height = 700 - margin.bottom - margin.top;

  var xScale = d3.time.scale()
    .domain(d3.extent(data, function(d) { return d.date }))
    .range([margin.left, width]);
  
  var yScale = d3.scale.linear()
    .domain([0, d3.max(data, function(d) { return d.gdp })])
    .range([height, margin.bottom]);
  
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");
  
  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .html(function(d) {
      return "GDP: $" + d.gdp+ "B<br>"+d.date.getFullYear() + ": " + monthNames[d.date.getMonth()];
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
    .attr("x", function(d) { return xScale(d.date); })
    .attr("width", width/data.length)
    .attr("y", function(d) { return yScale(d.gdp); })
    .attr("height", function(d) { return height - yScale(d.gdp); })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)
}
