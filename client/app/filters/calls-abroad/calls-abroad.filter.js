'use strict';

angular.module('ictsAppApp')
	.filter('calls_abroad', function () {
		return function (data) {

			var callsAbroad = [];

			if (data.calls && (data.calls.bellenInHetBuitenland || data.calls.gebeldWordenInHetBuitenland)){

				if (data.calls.bellenInHetBuitenland) {
					for (let i = 0; i < data.calls.bellenInHetBuitenland.length; i++) {
						let index = _.findIndex(callsAbroad, {country: data.calls.bellenInHetBuitenland[i].vanuit});
						if (index !== -1){
							callsAbroad[index].costs.out = callsAbroad[index].costs.out + parseFloat(data.calls.bellenInHetBuitenland[i].kosten);
						} else {
							callsAbroad.push({
								costs: {
									out: parseFloat(data.calls.bellenInHetBuitenland[i].kosten),
									in: 0
								},
								country: data.calls.bellenInHetBuitenland[i].vanuit
							});
						}
					}
				}

				if (data.calls.gebeldWordenInHetBuitenland){
					for (let i = 0; i < data.calls.gebeldWordenInHetBuitenland.length; i++) {

						let index = _.findIndex(callsAbroad, {country: data.calls.gebeldWordenInHetBuitenland[i].vanuit});
						if (index !== -1){
							callsAbroad[index].costs.in = callsAbroad[index].costs.in + parseFloat(data.calls.gebeldWordenInHetBuitenland[i].kosten);
						} else {
							callsAbroad.push({
								costs: {
									in: parseFloat(data.calls.gebeldWordenInHetBuitenland[i].kosten),
									out: 0
								},
								country: data.calls.gebeldWordenInHetBuitenland[i].vanuit
							});
						}
					}
				}

			} else {
				callsAbroad = false;
			}

			return callsAbroad;

		};
	});
