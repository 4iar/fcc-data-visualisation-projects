var DATA_PATH = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

d3.json(DATA_PATH, render);

function cleanup(data) {
  return data.map(function(obs) {
    return {
      time: new Date( (obs.Seconds - 2210) * 1000 ),
      name: obs.Name,
      year: obs.Year,
      nationality: obs.Nationality,
      dopingInfo: obs.Doping,
      dopingAccused: !!obs.Doping,
      rank: obs.Place
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
    .domain(d3.extent(data, function(d) { return d.time }).reverse())
    .range([margin.left, width])
  

  var yScale = d3.scale.linear()
    .domain([d3.max(data, function(d) { return d.rank }), 0])
    .range([height, margin.bottom]);

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .tickFormat(d3.time.format("%M:%S"));

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");
  
  var cValue = function(d) { return d.dopingAccused },
    color = d3.scale.category10();
  
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .html(function(d) {
      return d.name + "<br>Year: " + d.year + "<br>" + d.dopingInfo;
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

  svg.selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("r", 9)
    .attr("cx", function(d) { return xScale(d.time); })
    .attr("cy", function(d) { return yScale(d.rank); })
    .style("fill", function(d) { return color(cValue(d));}) 
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);
}
