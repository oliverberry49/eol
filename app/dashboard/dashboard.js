'use strict';

angular.module('myApp')

.controller('DashboardCtrl', ['$scope', '$window', '$state', function($scope, $window, $state) {

  function colourLuminance(hex, lum) {
    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
      hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i*2,2), 16);
      c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
      rgb += ("00"+c).substr(c.length);
    }

    return rgb;
  }

  var d3 = $window.d3;
  var overview = {
    overdue: 0,
    six: 0,
    twelve: 0,
    eighteen: 0,
    twentyfour: 0
  };
  var now = Date.now();
  var sixMonths = new Date(now);
  sixMonths.setMonth(sixMonths.getMonth() + 6);
  var twelveMonths = new Date(now);
  twelveMonths.setMonth(twelveMonths.getMonth() + 12);
  var eighteenMonths = new Date(now);
  eighteenMonths.setMonth(eighteenMonths.getMonth() + 18);
  var twentyfourMonths = new Date(now);
  twentyfourMonths.setMonth(twentyfourMonths.getMonth() + 24);

  d3.csv('os_eol.csv', function(d) {
    var dateString = d['EoL or EoS  Date'];
    var split = dateString.split('/');
    var date = new Date(split[2], split[1], split[0]);

    if (date < now) {
      overview.overdue++;
    } else if (date < sixMonths) {
      overview.six++;
    } else if (date < twelveMonths) {
      overview.twelve++;
    } else if (date < eighteenMonths) {
      overview.eighteen++;
    } else if (date < twentyfourMonths) {
      overview.twentyfour++;
    }

    return {
      os: d.OS,
      date: date
    };
  }, function(error, rows) {
    var categories = ['Overdue', '6 months', '12 months', '18 months', '24 months'];

    var dollars = [
      overview.overdue,
      overview.six,
      overview.twelve,
      overview.eighteen,
      overview.twentyfour
    ];

    var max = Math.max(...dollars);
    max = Math.ceil(max / 10) * 10;

    var rect = angular.element(document.getElementById('eol-dashboard'))[0].getBoundingClientRect();
    var canvasWidth = rect.right - rect.left - 50;
    var canvasHeight = rect.bottom - rect.top;
    canvasHeight = (canvasHeight > 550) ? 550 : canvasHeight;

    var canvas = d3.select('#eol-graph')
        .append('svg')
        .attr({'width': canvasWidth,'height': canvasHeight});

    var margin = {top: 20, right: 20, bottom: 70, left: 100};
    var width = canvasWidth - margin.left - margin.right;
    var height = canvasHeight - margin.top - margin.bottom;

    var colors = ['#dc3912','#ff9900','#fdae6b','#ebcd30','#98df8a'];

    var grid = d3.range(5).map(function() {
      return {'x1': 0, 'y1': height - 10, 'x2': 0, 'y2': height};
    });

    var tickVals = grid.map(function(d, i) {
      return i * 5;
    });

    var xscale = d3.scale.linear()
        .domain([0, max])
        .range([0, width]);

    var yscale = d3.scale.linear()
        .domain([0, categories.length])
        .range([0, height]);

    var colorScale = d3.scale.quantize()
        .domain([0, categories.length])
        .range(colors);

    var xAxis = d3.svg.axis()
        .orient('bottom')
        .scale(xscale)
        .tickValues(tickVals);

    var yAxis = d3.svg.axis()
        .orient('left')
        .scale(yscale)
        .tickValues(d3.range(categories.length))
        .tickFormat(function(d, i) {
          return categories[i];
        });

    canvas.append('g')
        .attr("transform", "translate(" + margin.left + ", " + (height + margin.top) + ")")
        .attr('id', 'xaxis')
        .call(xAxis);

    canvas.append('g')
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
        .attr('id', 'yaxis')
        .call(yAxis)
      .selectAll(".tick text")
        .attr("y", 45);

    canvas.append('g')
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
        .attr('id','bars')
        .selectAll('rect')
        .data(dollars)
        .enter()
        .append('rect')
        .attr('height', 70)
        .attr({
          'x': 0,
          'y': function(d, i) { return yscale(i) + 10; }
        })
        .style('fill', function(d, i) { return colorScale(i); })
        .attr('width', function() { return 0; })
        .on("click", function() {
          $state.go('home.table');
        })
        .on('mouseover', function(d, i) {
          d3.select(this).style("fill", colourLuminance(colorScale(i), 0.2));
        })
        .on('mouseout', function(d, i) {
          d3.select(this).style("fill", colorScale(i));
        });

    d3.select("svg").selectAll("rect")
        .data(dollars)
        .transition()
        .duration(1000)
        .attr("width", function(d) {
          return xscale(d);
        });
  });

}]);
