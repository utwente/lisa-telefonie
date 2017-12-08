'use strict';

angular.module('ictsAppApp')
	.directive('donut', function ($timeout, morrisDataFormatter, Morris) {
		let donut;

		return {
			template: '<div id="{{id}}" class="{{class}}""></div>',
			restrict: 'EA',
			scope: {data: '=data', number: '=number'},
			link: function (scope, element, attrs) {

				const id = 'donut-' + attrs.type;
				scope.class = attrs.class;
				scope.id = id;

				function plot() {

					// morrisDataFormatter formats the t_mobile data in morris donut format (factories/morrisDataFormatter)
					let data;
					switch(attrs.type) {
						case 'costs':
							data = morrisDataFormatter.getOverviewData(scope.data).costs;
							break;
						case 'data':
							data = morrisDataFormatter.getOverviewData(scope.data).data;
							break;
						case 'time':
							data = morrisDataFormatter.getOverviewData(scope.data).time;
							break;
						case 'sms':
							data = morrisDataFormatter.getOverviewData(scope.data).sms;
							break;
						case 'personal':
							data = morrisDataFormatter.getPersonalData(scope.data);
							break;
						default:
							throw new Error('Type: "' + attrs.type + '" not recognized (should be either: costs, data, time, sms, or personal)');
					}

					return Morris.Donut({element: id, colors: data.colors, data: data.data, formatter: data.formatter});

				}

				function update() {

					// morrisDataFormatter formats the t_mobile data in morris donut format (factories/morrisDataFormatter)
					switch(attrs.type) {
						case 'costs': return morrisDataFormatter.getOverviewData(scope.data).costs.data;
						case 'data': return morrisDataFormatter.getOverviewData(scope.data).data.data;
						case 'time': return morrisDataFormatter.getOverviewData(scope.data).time.data;
						case 'sms': return morrisDataFormatter.getOverviewData(scope.data).sms.data;
						case 'personal': return morrisDataFormatter.getPersonalData(scope.data).data;
						default:
							throw new Error('Type: "' + attrs.type + '" not recognized (should be either: costs, data, time, sms, or personal)');
					}
				}

				scope.$watch('data', function() {
					if (scope.data){
						// wait for next $digest cycle, to make sure the DOM element is present!
						$timeout(() => {
							$timeout(() => {
								if (!donut) {
									donut = plot();
								} else {
									donut.setData(update());
								}
							});
						})
					}
				});

			},
		};
	});
