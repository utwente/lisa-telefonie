'use strict';

angular.module('ictsAppApp')
  .directive('file', function ($http, $parse) {
    return {
      templateUrl: '/app/directives/file/file.html',
      restrict: 'E',
      transclude: true,
      scope: {},
      link: function (scope, element, attrs) {

      	scope.extension = attrs.link.split('.').pop();
      	scope.filename = attrs.filename;

      	scope.download = function() {

      		var filename = scope.filename;
      		var extension = scope.extension;

			var fullFilename = filename + '.' + extension;
			var mimeType = findMimeType(extension);
			var month = scope.month;

			var config = {
				headers: {
					'Content-type': 'application/json',
					'Accept': mimeType
				},
				responseType: 'arraybuffer',
			}

			$http.get(attrs.link, config)
			.success( function(data) {
				var blob = new Blob([data], {type: mimeType});
				saveAs(blob, fullFilename );
			});
      	};

      	function findMimeType(extension) {
			switch (extension) {
				case 'pdf':     return 'application/pdf';
				case 'html':    return 'text/html';
				case 'xlsx':    return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
			}
		}

      }
    };
  });