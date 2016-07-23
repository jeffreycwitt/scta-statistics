var alphabeticalSort = function(a,b){
			return -b.title.localeCompare(a.title)
		}
	
	var numericalSort = function(a,b){
			return  b.count - a.count;
		}


function chartDisplay(query, chart, sort){
	//d3.json(data, function(data){	

	var jsonarray = [];
	
console.log(query);
	//
	$.get("http://sparql-staging.scta.info/ds/query", {"query" : query}, function( resp ) {
	//$.get("http://localhost:3030/ds/query", {"query" : query}, function( resp ) {

		var items = resp.results.bindings
		console.log(items)
		for (x in items) {
			jsonarray.push({"item" : items[x].ref.value, "title" : items[x].reftitle.value, "count" : items[x].count.value});
		};
		data = jsonarray;
			

		data.sort(sort)	
		//this filter is required to make sure count is recognized as integers not strings 
		// see: http://stackoverflow.com/questions/10709950/get-the-real-max-of-an-array-in-d3
		data.filter(function(d,i) {
  	  d.count = +d.count;
		});

		var countArray = [];
		var titleArray = [];
		for (x in data){
			countArray.push(data[x].count);
			
		};
		for (x in data){
			titleArray.push(data[x].title);
		};
			
		var margin = {top: 30, right: 30, bottom: 40, left: 50}
		var height = 500 - margin.top - margin.bottom,
		width = 1200 - margin.left - margin.right;
		//barWidth = 50,
		//barOffset = 5;

		var colors = d3.scale.linear()
			.domain([0, data.length*.80,  data.length])
			.range(['#FFB832', '#C61C6F']);


		//var xScale = d3.scale.linear()
			//.domain([0, d3.max(countArray)]) 
			//.range([0, height]);

		//var yScale = d3.scale.ordinal()
			//.domain(d3.range(0, data.length))
			//.rangeBands([0, height])

		var yScale = d3.scale.linear()
			.domain([0, d3.max(countArray)]) 
			.range([0, height]);

		var xScale = d3.scale.ordinal()
			.domain(d3.range(0, data.length))
			.rangeBands([0, width], .5)

			

		
		var tooltip = d3.select('body').append('div')
			.attr('class', 'tooltip')
			.style('position', 'absolute')
			.style('padding', '0 10px')
			.style('background', 'white')
			.style('opacity', 0)
			
		var canvas = d3.select("div#" + chart).append("svg")
			.attr("id", chart)
			.style('background', '#E7E0CB')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append("g")
			.attr('transform', 'translate(' + margin.left + ', ' + margin.top +')')
			.selectAll("rect")
				.data(data)
				.enter()
				.append("g")
					.append("rect")
						.style('fill', function(d,i){
							return colors(i);
						})
						.attr('height', 0)
						.attr('y', height)
						.attr("width", xScale.rangeBand())
						.attr("x", function (d,i) {return xScale(i);})
						
						
						.on('mouseover', function(d) {
							tooltip.transition()
								.style('opacity', .9)

							tooltip.html("<a href='" + d.item + "'>" + d.title + "</a>. Quoted " + d.count + " times")
								.style('left', (d3.event.pageX + 0) + 'px')
								.style('top', (d3.event.pageY + 0) + 'px')
								//.style('left', d3.select("svg#" + chart).left + 150 + 'px')
								//.style('top', d3.select("svg#" + chart).top + 125 + 'px')
							
								d3.select(this)
									.style('opacity', .5);
						})
						.on('mouseout', function(d) {
							//tooltip.transition().style('opacity', 0)
							d3.select(this)
								.transition()
								.style('opacity', 1);
						})
						
			canvas.transition()
				.attr("height", function (d) { return yScale(d.count)})
				.attr("y", function(d) { return height - yScale(d.count) })
				.delay(function(d,i){return i * 10})
				.duration(1000)
				.ease('elastic')

				var vGuideScale = d3.scale.linear()
					.domain([0, d3.max(countArray)])
					.range([height, 0])

				var vAxis = d3.svg.axis()
					.scale(vGuideScale)
					.orient('left')
					.ticks(10)
				var vGuide = d3.select('svg#' + chart).append('g')
					vAxis(vGuide) 
					vGuide.attr('transform', 'translate('+ margin.left+', '+margin.top + ')')
					vGuide.selectAll('path')
						.style({fill: 'none', stroke: "#000"})
					vGuide.selectAll('line')
						.style({ stroke: "#000"})

				//var horizontalGuideScale = d3.scale.ordinal()
					//.domain([0, d3.max(countArray)])
					//.range([height, 0])

				var hAxis = d3.svg.axis()
					.scale(xScale)
					.orient('bottom')
					.tickValues(xScale.domain().filter(function(d, i){
						return i % 50 === 0
					}
					));

							

				var hGuide = d3.select('svg#' + chart).append('g')
					hAxis(hGuide)
					hGuide.attr('transform', 'translate('+ margin.left+', '+ (height + margin.top) + ')')	
					hGuide.selectAll('path')
						.style({fill: 'none', stroke: "#000"})
					hGuide.selectAll('line')
						.style({ stroke: "#000"})

		});
}