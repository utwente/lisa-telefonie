'use strict';

angular.module('ictsAppApp')
	.filter('data_abroad', function () {
		return function (data) {
			if (!data) { return undefined; }
			if (!data.data || !data.data.internetInHetBuitenland) { return undefined; }

			var dataAbroad = [];
			for (var i = 0; i < data.data.internetInHetBuitenland.length; i++) {
				if (data.data.internetInHetBuitenland[i].kosten === 0) { continue; }
				var index = _.findIndex(dataAbroad, {country: data.data.internetInHetBuitenland[i].vanuit});
				if (index !== -1){
					dataAbroad[index].costs = dataAbroad[index].costs + parseFloat(data.data.internetInHetBuitenland[i].kosten);
				} else {
					dataAbroad.push({
						costs: parseFloat(data.data.internetInHetBuitenland[i].kosten),
						country: data.data.internetInHetBuitenland[i].vanuit
					});
				}
			}

			if (dataAbroad.length === 0) { return undefined; }

			return dataAbroad;

		};
	});
