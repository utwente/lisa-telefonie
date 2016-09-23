angular.module('ictsAppApp')
	.filter('data_abroad', function () {
		return function (data) {
			if (!data) { return undefined }

			if (data.data && data.data.internetInHetBuitenland){
				var dataAbroad = [];
				for (var i = 0; i < data.data.internetInHetBuitenland.length; i++) {

					var index = _.findIndex(dataAbroad, {country: data.data.internetInHetBuitenland[i].vanuit});
					if (index !== -1){
						dataAbroad[index].costs = dataAbroad[index].costs + parseFloat(data.data.internetInHetBuitenland[i].kosten);
					} else {
						dataAbroad.push({
							costs: parseFloat(data.data.internetInHetBuitenland[i].kosten),
							country: data.data.internetInHetBuitenland[i].vanuit
						})
					}
				}

			} else {
				dataAbroad = false;
			}

			return dataAbroad;

		};
	});