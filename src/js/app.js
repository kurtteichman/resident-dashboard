angular.module('app',['ngRoute','ngSanitize'])

.config(['$routeProvider','$httpProvider',function($routeProvider,$httpProvider) {
	$routeProvider
	.when('/dash', {
		templateUrl: 'views/dashboard.html',
		controller: 'dashController'
	})
	.when('/', {
		templateUrl: 'views/datatool.html',
		controller: 'mainController'
	});

	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
	$httpProvider.defaults.timeout = 30000;
 
  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data)
  {
    /**
     * The workhorse; converts an object to x-www-form-urlencoded serialization.
     * @param {Object} obj
     * @return {String}
     */ 
    var param = function(obj)
    {
      var query = '';
      var name, value, fullSubName, subName, subValue, innerObj, i;
      
      for(name in obj)
      {
        value = obj[name];
        
        if(value instanceof Array)
        {
          for(i=0; i<value.length; ++i)
          {
            subValue = value[i];
            fullSubName = name + '[' + i + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        }
        else if(value instanceof Object)
        {
          for(subName in value)
          {
            subValue = value[subName];
            fullSubName = name + '[' + subName + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        }
        else if(value !== undefined && value !== null)
        {
          query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }
      }
      
      return query.length ? query.substr(0, query.length - 1) : query;
    };
    
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
}])
.directive('navBar', ['$rootScope',function($rootScope) {
	return {
		templateUrl: 'templates/navbar.tpl.html',
		restrict: 'E',
		replace:true,
		scope:{},
		controller: function($scope, $element, $attrs, $location) {
			/*
			$scope.loadingclass = "";

			$rootScope.$on("$routeChangeStart", function (event, next, current) {
				$scope.loadingclass = "";
			});

			$rootScope.$on("$routeChangeSuccess", function (event, current, previous) {
				$scope.loadingclass = "";
			});

			$rootScope.$on("$routeChangeError", function (event, current, previous, rejection) {
				$scope.loadingclass = "";
			});	
			*/
		}
	}
}])
.directive('dashBarChart', function() {
	return { 
		templateUrl:'templates/barchart.tpl.html',
		restrict: 'E',
		replace: true,
		scope: true,
		link : function(scope, element, attrs) {

			/*
			var margin = {top: 20, right: 20, bottom: 30, left: 40},
			width = 600 - margin.left - margin.right,
			height = 300 - margin.top - margin.bottom;
			*/

			var BarChart = {
				draw: function(id,d,options) {

					var cfg = {
						margin :{top: 20, right: 20, bottom: 30, left: 40},
						width : 600 - margin.left - margin.right,
						height :300 - margin.top - margin.bottom
					};

					var ymax = d3.max(data, function(d) { return +d.frequency});

					d3.select(id).select("svg").remove();

					if('undefined' !== typeof options) {
						for(var i in options){
							if('undefined' !== typeof options[i]) {
								cfg[i] = options[i];
							}
						}

						function type(d) {
							d.frequency = +d.frequency;
							return d;
						};

						var x = d3.scale.ordinal()
			    		.rangeRoundBands([0, cfg.width], .1);

						var y = d3.scale.linear()
						.domain([0,ymax])
						.range([cfg.height,0]);
						/*.range([height, 0]);*/

						x.domain(data.map(function(d) { return d.modality; }));
						//y.domain(data.map(function(d) { return d.frequency; }));

						var xAxis = d3.svg.axis()
						.scale(x)
						.orient("bottom");

						var yAxis = d3.svg.axis()
						.scale(y)
						.ticks(10)
						.orient("left");

						var svg = d3.select(id).append("svg")
						.attr("width", cfg.width + cfg.margin.left + cfg.margin.right)
						.attr("height", cfg.height + cfg.margin.top + cfg.margin.bottom)
						.append("g")
						.attr("transform", "translate(" + cfg.margin.left + "," + cfg.margin.top + ")");

						svg.append("g")
							.attr("class", "x axis")
							.attr("transform","translate(0," + cfg.height + ")")
							.call(xAxis);

						svg.append("g")
							.attr("class", "y axis")
							.call(yAxis)
							.append("text")
							.attr("transform","rotate(-90)")
							.attr("y", 3)
							.attr("dy", "-3.71em")
							.style("text-anchor","end")
							.text("Frequency");

						svg.selectAll(".bar")
							.data(d)
							.enter().append("rect")
							.attr("class","bar")
							.attr("x", function(d) { return x(d.modality); })
							.attr("y", function(d) { return y(d.frequency); })
							.attr("width", x.rangeBand())
							.attr("height", function(d) { return cfg.height - y(d.frequency); });
					}
				}
			}

			var data = [
				{modality:'CT', frequency:5},
				{modality:'MR', frequency:5},
				{modality:'CR', frequency:7},
				{modality:'Nucs', frequency:8},
				{modality:'Sono', frequency:9},
				{modality:'DEXA', frequency:100}
			];

			var margin = {top: 20, right: 20, bottom: 30, left: 60};

			var options = {
				margin : margin,
				width  : 600 - margin.left - margin.right,
				height : 300 - margin.top - margin.bottom
			}

			BarChart.draw(element[0].children[1],data,options);

			scope.drawBarChart= function() {
				var output = [];
				//var output = [user_data];

				for (var i = 0; i < data.length; i++) {
					output.push({modality:data[i].modality,frequency:Math.floor(Math.random() * 100 + 1)});
				}

				console.log(output);
				console.log('in draw bar chart');

				scope.data = output;
				BarChart.draw(element[0].children[1],scope.data,options);
			}
		}
	};
})
.directive('dashRadarChart', function() {
	return {
		templateUrl: 'templates/radarchart.tpl.html',
		restrict: 'E',
		replace: true,
		scope: true,
		link : function(scope, element, attrs) {
			var mycfg = {
				w: 400,
				h: 400,
				maxValue: 0.6,
				levels: 6,
				ExtraWidthX: 300
			}


			var RadarChart = {
		  		draw: function(id, d, options){
					var cfg = {
						radius: 5,
						w: 600,
						h: 600,
						factor: 1,
						factorLegend: .85,
						levels: 3,
						maxValue: 0,
						radians: 2 * Math.PI,
						opacityArea: 0.5,
						ToRight: 5,
						TranslateX: 80,
						TranslateY: 30,
						ExtraWidthX: 100,
						ExtraWidthY: 100,
						color: d3.scale.category10()
					};

				
					if('undefined' !== typeof options){
						for(var i in options){
							if('undefined' !== typeof options[i]){
								cfg[i] = options[i];
								}
							}
						}

						cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function(i){return d3.max(i.map(function(o){return o.value;}))}));
						var allAxis = (d[0].map(function(i, j){return i.axis}));
						var total = allAxis.length;
						var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
						var Format = d3.format('%');
						d3.select(id).select("svg").remove();

						//var g = d3.select(id)
						var g = d3.select(id)
						.append("svg")
						.attr("width", cfg.w+cfg.ExtraWidthX)
						.attr("height", cfg.h+cfg.ExtraWidthY)
						.append("g")
						.attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");
						;

						var tooltip;

						//Circular segments
						for(var j=0; j<cfg.levels-1; j++){
							var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
							g.selectAll(".levels")
							.data(allAxis)
							.enter()
							.append("svg:line")
							.attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
							.attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
							.attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
							.attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
							.attr("class", "line")
							.style("stroke", "grey")
							.style("stroke-opacity", "0.75")
							.style("stroke-width", "0.3px")
							.attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
						}

						//Text indicating at what % each level is
						for(var j=0; j<cfg.levels; j++){
							var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
							g.selectAll(".levels")
							.data([1]) //dummy data
							.enter()
							.append("svg:text")
							.attr("x", function(d){return levelFactor*(1-cfg.factor*Math.sin(0));})
							.attr("y", function(d){return levelFactor*(1-cfg.factor*Math.cos(0));})
							.attr("class", "legend")
							.style("font-family", "sans-serif")
							.style("font-size", "10px")
							.attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
							.attr("fill", "#737373")
							.text(Format((j+1)*cfg.maxValue/cfg.levels));
						}

						series = 0;

						var axis = g.selectAll(".axis")
						.data(allAxis)
						.enter()
						.append("g")
						.attr("class", "axis");

						axis.append("line")
						.attr("x1", cfg.w/2)
						.attr("y1", cfg.h/2)
						.attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
						.attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
						.attr("class", "line")
						.style("stroke", "grey")
						.style("stroke-width", "1px");

						axis.append("text")
						.attr("class", "legend")
						.text(function(d){return d})
						.style("font-family", "sans-serif")
						.style("font-size", "11px")
						.attr("text-anchor", "middle")
						.attr("dy", "1.5em")
						.attr("transform", function(d, i){return "translate(0, -10)"})
						.attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
						.attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});


						d.forEach(function(y, x){
							dataValues = [];
							g.selectAll(".nodes")
							.data(y, function(j, i){
								dataValues.push([
									cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
									cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
								]);
							});

							dataValues.push(dataValues[0]);
							g.selectAll(".area")
							.data([dataValues])
							.enter()
							.append("polygon")
							.attr("class", "radar-chart-serie"+series)
							.style("stroke-width", "2px")
							.style("stroke", cfg.color(series))
							.attr("points",function(d) {
								var str="";
								for(var pti=0;pti<d.length;pti++){
									str=str+d[pti][0]+","+d[pti][1]+" ";
								}
								return str;
							})
							.style("fill", function(j, i){return cfg.color(series)})
							.style("fill-opacity", cfg.opacityArea)
							.on('mouseover', function (d){
								z = "polygon."+d3.select(this).attr("class");
								g.selectAll("polygon")
								 .transition(200)
								 .style("fill-opacity", 0.1); 
								g.selectAll(z)
								 .transition(200)
								 .style("fill-opacity", .7);
							})
							.on('mouseout', function(){
								g.selectAll("polygon")
								 .transition(200)
								 .style("fill-opacity", cfg.opacityArea);
							});
							series++;
						});

						series=0;

						d.forEach(function(y, x){
							g.selectAll(".nodes")
							.data(y).enter()
							.append("svg:circle")
							.attr("class", "radar-chart-serie"+series)
							.attr('r', cfg.radius)
							.attr("alt", function(j){return Math.max(j.value, 0)})
							.attr("cx", function(j, i){
								dataValues.push([
									cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
									cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
								]);
								return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
							})
							.attr("cy", function(j, i){
								return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
							})
							.attr("data-id", function(j){return j.axis})
							.style("fill", cfg.color(series)).style("fill-opacity", .9)
							.on('mouseover', function (d){
								newX =  parseFloat(d3.select(this).attr('cx')) - 10;
								newY =  parseFloat(d3.select(this).attr('cy')) - 5;

								tooltip
								.attr('x', newX)
								.attr('y', newY)
								.text(Format(d.value))
								.transition(200)
								.style('opacity', 1);

								z = "polygon."+d3.select(this).attr("class");
								g.selectAll("polygon")
								.transition(200)
								.style("fill-opacity", 0.1); 
								g.selectAll(z)
								.transition(200)
								.style("fill-opacity", .7);
							})
							.on('mouseout', function(){
								tooltip
								.transition(200)
								.style('opacity', 0);
								g.selectAll("polygon")
								.transition(200)
								.style("fill-opacity", cfg.opacityArea);
							})
							.append("svg:title")
							.text(function(j){return Math.max(j.value, 0)});
							series++;
						});
							//Tooltip
						tooltip = g.append('text')
						.style('opacity', 0)
						.style('font-family', 'sans-serif')
						.style('font-size', '13px');

						var w = 500,h = 500;
						var colorscale = d3.scale.category10();

						var LegendOptions = ['Resident1','Resident2'];

						var svg = d3.select(element[0].children[1])
						.selectAll('svg')
						.append('svg')
						.attr("width", w+300)
						.attr("height",h);

						var text = svg.append("text")
						.attr("class", "title")
						.attr('transform', 'translate(90,0)') 
						.attr("x", w - 70)
						.attr("y", 10)
						.attr("font-size", "12px")
						.attr("fill", "#404040")
						.text("% of disease seen");

						//Initiate Legend	
						var legend = svg.append("g")
						.attr("class", "legend")
						.attr("height", 100)
						.attr("width", 200)
						.attr('transform', 'translate(90,20)');
						//Create colour squares
						legend.selectAll('rect')
						.data(LegendOptions)
						.enter()
						.append("rect")
						.attr("x", w - 65)
						.attr("y", function(d, i){ return i * 20;})
						.attr("width", 10)
						.attr("height", 10)
						.style("fill", function(d, i){ return colorscale(i);});
						//Create text next to squares
						legend.selectAll('text')
						.data(LegendOptions)
						.enter()
						.append("text")
						.attr("x", w - 52)
						.attr("y", function(d, i){ return i * 20 + 9;})
						.attr("font-size", "11px")
						.attr("fill", "#737373")
						.text(function(d) { return d; });	

					}
				}

				
				var labels = [
				[
					{axis:"Chest",value:0.59},
					{axis:"GI",value:0.56},
					{axis:"Neuro",value:0.42},
					{axis:"Sono",value:0.34},
					{axis:"Vascular", value:0.70},
					{axis:"Respiratory", value:0.50}
					/*
					{axis:"Search Engine",value:0.48},
					{axis:"View Shopping sites",value:0.14},
					{axis:"Paying Online",value:0.11},
					{axis:"Buy Online",value:0.05},
					{axis:"Stream Music",value:0.07},
					{axis:"Online Gaming",value:0.12},
					{axis:"Navigation",value:0.27},
					{axis:"App connected to TV program",value:0.03},
					{axis:"Offline Gaming",value:0.12},
					{axis:"Photo Video",value:0.4},
					{axis:"Reading",value:0.03},
					{axis:"Listen Music",value:0.22},
					{axis:"Watch TV",value:0.03},
					{axis:"TV Movies Streaming",value:0.03},
					{axis:"Listen Radio",value:0.07},
					{axis:"Sending Money",value:0.18},
					{axis:"Other",value:0.07},
					{axis:"Use less Once week",value:0.08}
					*/
				  ],[
					{axis:"Chest",value:0.48},
					{axis:"GI",value:0.41},
					{axis:"Neuro",value:0.27},
					{axis:"Sono",value:0.28},
					{axis:"Vascular", value:0.33},
					{axis:"Respiratory", value:0.50}
				]
				];
				/*
				var labels = [
					{axis:"Chest"      ,value:null},
					{axis:"GI"         ,value:null},
					{axis:"Respiratory",value:null},
					{axis:"Vascular"   ,value:null},
					{axis:"Sono"       ,value:null},
					{axis:"Neuro"      ,value:null}
				];
				*/

				console.log(element);
				console.log(element[0])

				

				RadarChart.draw(element[0].children[1].children[0],labels,mycfg);

				scope.drawRadarChart = function() {
					var user_data = [];
					var standard_data = [];
					var output = [user_data,standard_data];
					//var output = [user_data];

					for (var i = 0; i < output.length; i++) {
						for (var x = 0; x < labels[0].length; x++) {
							output[i].push({axis:labels[0][x].axis,value:Math.random().toFixed(2)})
						}
					}

					scope.data = output;
					RadarChart.draw(element[0].children[1],scope.data,mycfg);
				}
			}
		}
})
.controller('dashController', ['$scope','$http', function($scope,$http) {

}])
.controller('dashController2', ['$scope','$http', function($scope,$http) {

}])
.controller('mainController', ['$scope','$http','$sce','$timeout', function($scope,$http,$sce,$timeout) {
	$scope.radiologists = [];
	$scope.current_page = 0;
	$scope.page_indices = [];
	$scope.radiologist_pages = [];
	$scope.selected_radiologist = {fields:{fname:"",lname:""}} ;

	$scope.to_date   = "2014-02-01";
	$scope.from_date = "2013-12-01";

	$scope.reports = [];
	$scope.reports_loading = false;

	$scope.to_trusted_html = function(html_code) {
		return $sce.trustAsHtml(html_code);
	}

	$scope.changePage = function (page_number) {
		$scope.current_page = page_number;
	}

	$scope.getSelectedRadiologist = function() {
		return $scope.selected_radiologist.fields.fname + " " + $scope.selected_radiologist.fields.lname;
	}

	$scope.selectRadiologist = function(radiologist) {
		$scope.selected_radiologist = radiologist;
		$scope.reports_loading = true;
		$scope.reports = [];

		 $http({method: 'POST', timeout: 30000, url: 'http://10.177.152.33/num_ext/resident_dash/getOrders',
		 	data:{
		 		from_date:$scope.from_date,
		 		to_date:$scope.to_date,
		 		radiologist_pk:radiologist.pk
		 	}
		 })
		 .success(function(data) {
		 	$scope.reports_loading = false;
		 	$scope.reports = data;
		 	$scope.reports = $scope.reports.map(function(report) {
		 		// adding in some html for display purposes
		 		// raw data will have '|' instead of the line break, '<br/>'
		 		return report.substring(1).replace(/\|/gi,'<br/>');
		 	});

		 })
		 .error(function(data) {
		 	$scope.reports_loading = false;
		 	console.log(data);
		 });

		 // hack to make dropped request retry themselves
		 /*
		 $timeout(function() {
		 	if ($scope.reports.length == 0) {
			 	$scope.selectRadiologist(radiologist);
			}
		 },7000);
*/
	}

	var paginate = function(radiologists) {
		var page_count = Math.ceil(radiologists.length / 10);
		var counter = -1;   
		$scope.radiologist_pages = [];
		$scope.page_indices      = [];
		$scope.current_page      = 0;

		var current_radiologist = null;

		for (var i = 0; i < radiologists.length; i++) {
			current_radiologist = radiologists[i];
			if (i % 10 == 0) {
				counter++;
				$scope.radiologist_pages.push([]);
				$scope.page_indices.push(counter);
			}
			$scope.radiologist_pages[counter].push(current_radiologist);
		}
	}

	$scope.$watch('radiologyText', function(data) {
		var current_radiologist = null;
		var fname = null;
		var lname = null;
		var current_data = (data) ? data.toLowerCase() : "";

		var filtered_radiologists = [];

		for (var i = 0; i < $scope.radiologists.length; i++) {
			current_radiologist = $scope.radiologists[i];
			try {
				fname = current_radiologist.fields.fname.toLowerCase();
				lname = current_radiologist.fields.lname.toLowerCase();
			} catch (err) {
				// NOOP
			}

			if (current_data == "" || fname.indexOf(current_data) > -1 || lname.indexOf(current_data) > -1) {
				filtered_radiologists.push(current_radiologist);
			}
		}

		paginate(filtered_radiologists);
	});

	$http({method: 'GET', timeout: 30000, url: 'http://10.177.152.33/num_ext/resident_dash/getRadiologists'}).
	success(function(data, status, headers, config) {
		$scope.radiologists = data;
		paginate($scope.radiologists);
	}).
	error(function(data, status, headers, config) {
		// NOOP
	});

}]);
