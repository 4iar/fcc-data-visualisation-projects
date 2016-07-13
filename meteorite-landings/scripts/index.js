WORLD_PATH = '../world-110m2.json';
STRIKES_PATH = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json"


$(document).ready (function() {
  // set up the svg
  var width = 950;
  var height = 500;
  var svg = d3.select("body div").append("svg")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("width", width)
    .attr("height", height);

  var projection = d3.geo.mercator()

  var path = d3.geo.path()
    .projection(projection);
  
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .html(function(d) {
      var p = d.properties;
      return '<b>' + p.name + '</b>' +
        '<br>mass: ' + p.mass + 'g' +
        '<br>class: ' + p.recclass +
        '<br>year: ' + new Date(p.year).getFullYear();  // TODO: use less expensive method
    });

  // draw the world
  d3.json(WORLD_PATH, function(error, world) {
    svg.insert("path", ".graticule")
      .datum(topojson.feature(world, world.objects.land))
      .attr("class", "land")
      .attr("d", path);

    svg.insert("path", ".graticule")
      .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
      .attr("class", "boundary")
      .attr("d", path);
  });

  // draw the strikes
  d3.json(STRIKES_PATH, function(error, strikes) {
    var radius = d3.scale.sqrt()
      .domain(d3.extent(strikes.features, function(d) { return +d.properties.mass}))
      .range([0, width/20]);

    svg.append("g")
      .attr("class", "bubble")
      .call(tip)
      .selectAll("circle")
      .data(strikes.features)
      .enter().append("circle")
      .attr("transform", function(d) { if(d.geometry) { return "translate(" + path.centroid(d) + ")"; }})
      .attr("r", function(d) { return radius(d.properties.mass)})
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
  });
}) 
