var DATA_PATH = '../GDP-data.json';

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

  var xScale = d3.scaleTime()
    .domain(d3.extent(data, function(d) { return d.date }))
    .range([margin.left, width]);
  
  var yScale = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return d.gdp })])
    .range([height, margin.bottom]);
  
  var xAxis = d3.axisBottom()
    .scale(xScale)
  
  var yAxis = d3.axisLeft()
    .scale(yScale)

  var svg =  d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

  svg.append('g')            
    .attr('class', 'x axis') 
    .attr("transform", "translate(0," + (height) + ")")
    .call(xAxis);           

  svg.append('g')          
    .attr('class', 'y axis')
    .attr("transform", "translate(" + (margin.left) + ",0)")
    .call(yAxis);          

  
  
  
  
}
