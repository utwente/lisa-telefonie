'use strict';

angular.module('ictsAppApp')
	.filter('month', [function () {
		return function (records, monthDate) {
			var r = [];
			var d = new Date(monthDate);
			var m = d.getUTCFullYear()+'-'+d.getUTCMonth();
			$.each(records, function(key, record) {
				d = new Date(record.month);
				if (m === d.getUTCFullYear()+'-'+d.getUTCMonth()){
					r.push(record);
				}
			});
			return r;
		};
	}]);
