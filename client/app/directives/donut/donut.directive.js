'use strict';

angular.module('ictsAppApp')
	.directive('donut', function ($timeout, morrisDataFormatter, Morris) {

		return {
			template: '<div id="{{id}}" class="{{cl}}""></div>',
			restrict: 'EA',
			scope: {data: '=data', number: '=number'},
			link: function (scope, element, attrs) {

				var id = 'donut-' + attrs.type; 

				scope.cl = attrs.class;

				scope.id = id;

				// remember the donut object to update the data
				var donut;

				scope.$watch('data', function() {
					if (scope.data){ 

						// wait for next $digest cycle, to make sure the DOM element is present!
						$timeout(function(){ 
							if (!donut) {
								donut = plot(); 
							} else {
								donut.setData(update());
							}
						}); 
					}
				})

				function plot() {

					// morrisDataFormatter formats the t_mobile data in morris donut format (factories/morrisDataFormatter)
					var donut;

					switch(attrs.type) {

						case 'costs':
							var plotData = morrisDataFormatter.getOverviewData(scope.data);
							donut = Morris.Donut({element: id, colors: plotData.costs.colors, data: plotData.costs.data, formatter: plotData.costs.formatter});
							break;

						case 'data':
							var plotData = morrisDataFormatter.getOverviewData(scope.data);
							donut = Morris.Donut({element: id, colors: plotData.data.colors, data: plotData.data.data, formatter: plotData.data.formatter});
							break;

						case 'time':
							var plotData = morrisDataFormatter.getOverviewData(scope.data);
							donut = Morris.Donut({element: id, colors: plotData.time.colors, data: plotData.time.data, formatter: plotData.time.formatter});
							break;

						case 'sms':
							var plotData = morrisDataFormatter.getOverviewData(scope.data);
							donut = Morris.Donut({element: id, colors: plotData.sms.colors, data: plotData.sms.data, formatter: plotData.sms.formatter});
							break;

						case 'personal':
							var plotData = morrisDataFormatter.getPersonalData(scope.data);
							donut = Morris.Donut({element: id, data: plotData.data, formatter: plotData.formatter});
							break;

						default:
							throw new Error('Type: "' + attrs.type + '" not recognized (should be either: costs, data, time, sms, or personal)');
							break;

					}

					return donut;

				}

				function update() {

					// morrisDataFormatter formats the t_mobile data in morris donut format (factories/morrisDataFormatter)
					switch(attrs.type) {

						case 'costs':
							return morrisDataFormatter.getOverviewData(scope.data).data;

						case 'data':
							return morrisDataFormatter.getOverviewData(scope.data).data;

						case 'time':
							return morrisDataFormatter.getOverviewData(scope.data).data;

						case 'sms':
							return morrisDataFormatter.getOverviewData(scope.data).data;

						case 'personal':
							return morrisDataFormatter.getPersonalData(scope.data).data;

						default:
							throw new Error('Type: "' + attrs.type + '" not recognized (should be either: costs, data, time, sms, or personal)');

					}
				}

			},
		};
	});