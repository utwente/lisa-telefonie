/*jshint camelcase: false*/

'use strict';

angular.module('ictsAppApp')
  .controller('EmailCtrl', function ($scope, $http, socket, message) {


    // clear all messageg etc.
    function resetAll() {
      $scope.files = false;
      $scope.PDFmessages = [];
      $scope.mail = {
        done: 0,
        message: 'Nog geen specificaties verzonden.'
      };
      $scope.ll_excel = {
        done: 0,
        message: 'Nog geen vaste specificaties gegenereerd.'
      };
      $scope.mob = {
        message: 'Nog geen mobiele specificaties gegenereerd.'
      };
      $scope.mob_pdf = {
        done: 0,
      };
      $scope.mob_excel = {
        done: 0,
      };
      $scope.mob_html = {
        done: 0,
      };
    }


	var progress;
	resetAll();

	var now = new Date();
	$scope.month = new Date(now.getFullYear(), now.getMonth() - 1, 1);

	$scope.changeMonth = function() {
		$scope.month = false;
		$scope.step = false;
		resetAll();
	};

	// check if month is changed.
	$scope.$watch('month', function() {
		// don't do anyting if month is false.
		if ($scope.month) {
			$http.get('/api/month_status/' + $scope.month)
				.then(function (prog) {
					progress = prog.data;
					$scope.step = progress.steps[progress.counter].name;
					$scope.next = progress.steps[progress.counter].done;
				})
				.catch(function () {
          message.error('Het ophalen van deze maand is niet gelukt. Is deze maand al ingevoerd?');
				});
		}
	});

	// this is what happens when next/previous step is clicked.
	$scope.changeStep = function(next) {
		resetAll();
		if (next) { progress.counter++; }     // next step
		else { progress.counter--; }          // previous step
		$http.put('/api/month_status/' + progress._id, progress)
		.then(function (prog) {
			progress = prog.data;
			$scope.step = progress.steps[progress.counter].name;
			$scope.next = progress.steps[progress.counter].done;
		})
		.catch(function () {
			if (next) { progress.counter--; } // don't go to next step
			else { progress.counter++; }      // previous step
			console.log('error saving progress');
		});
	};

	// this is what happens when a step is completed and you can move on to the next step.
	$scope.saveProgress = function() {
		$http.put('/api/month_status/' + progress._id, progress)
		.then(function (prog) {
			progress = prog.data;
			$scope.step = progress.steps[progress.counter].name;
			$scope.next = progress.steps[progress.counter].done;
		})
		.catch(function () {
			console.log('error saving progress');
		});
	};


	// below functions with actions per step.
	$scope.checkData = function() {
		progress.steps[progress.counter].done = true;
		$scope.next = progress.steps[progress.counter].done;
		$scope.saveProgress();
	};

	$scope.createMobileSpec = function() {
		resetAll();
		$scope.mob.message = 'Mobiele specificaties worden gegenereerd...';
		$http.get('/api/mobile_spec/' + $scope.month)
			.then(function () {
				progress.steps[progress.counter].done = true;
				$scope.next = progress.steps[progress.counter].done;
				$scope.saveProgress();
			})
			.catch(function () {
				// this is temporary!!!!!
				progress.steps[progress.counter].done = true;
				$scope.next = progress.steps[progress.counter].done;
				$scope.saveProgress();
				// end
        message.error('Aanmaken mobiele specificaties niet gelukt..');
				$scope.mob_pdf.message = 'Er zijn fouten. Los deze op en probeer het daarna opnieuw.';

			});
	};

	$scope.createLandlineSpec = function() {
		$scope.ll_excel.message = 'Vaste specificaties worden gegenereerd...';
		$http.get('/api/landline_spec/' + $scope.month)
			.then(function () {
				progress.steps[progress.counter].done = true;
				$scope.next = progress.steps[progress.counter].done;
				$scope.saveProgress();
			})
			.catch(function () {
        message.error('Aanmaken vaste specificaties is niet gelukt');
			});
	};

	$scope.checkFiles = function() {
		progress.steps[progress.counter].done = true;
		$scope.next = progress.steps[progress.counter].done;
		$scope.saveProgress();
	};

	$scope.sendSpec = function() {
		$scope.mail.message = 'Specificaties worden verzonden...';
		$http.get('api/mail_spec/' + $scope.month)
			.then(function () {
				// tijdelijk dit niet gedaan. Maar dat moet wel weer natuurlijk!
				progress.steps[progress.counter].done = true;
				$scope.next = progress.steps[progress.counter].done;
				$scope.saveProgress();
			})
			.catch(function () {
        message.error('Verzenden emails is niet gelukt..');
			});
	};

	$scope.reopenMonth = function() {
		$http.delete('api/month_status/' + progress._id)
			.then(function(prog){
				progress = prog.data;
				$scope.step = progress.steps[progress.counter].name;
				$scope.next = progress.steps[progress.counter].done;
			})
			.catch(function(err) {
        console.log(err);
        message.error('Ophalen van de voorgang van deze maand is niet gelukt');
			});
	};


	$scope.$watch('step', function() {
		if ($scope.step === 'check_spec') {

			$http.get('api/documents/' + $scope.month)
			.then(function (files) {
				$scope.files = files.data;
			})
			.catch(function (err) {
        console.log(err);
        message.error('Ophalen bestanden is niet gelukt..');
			});

		}
	});

  function updateMobileMsg() {
		if ($scope.mob_html.total + $scope.mob_excel.total + $scope.mob_pdf.total >= $scope.mob_html.done + $scope.mob_excel.done + $scope.mob_pdf.done) {
			$scope.mob.message = 'Alle mobiele specificaties zijn gegenereerd!';
		}
	}

	socket.socket.on('mob_pdf', function(data){
		$scope.mob_pdf.total = data.total;
		$scope.mob_pdf.done++;
		updateMobileMsg(data);
	});

	socket.socket.on('mob_excel', function(data){
		$scope.mob_excel.total = data.total;
		$scope.mob_excel.done++;
		updateMobileMsg(data);
	});

	socket.socket.on('mob_html', function(data){
		$scope.mob_html.total = data.total;
		$scope.mob_html.done++;
		updateMobileMsg(data);
	});

	socket.socket.on('ll_excel', function(data) {
		$scope.ll_excel.errors = data.err;
		if (data.err) {
      message.error('Er ging iets mis bij het aanmaken van de vaste specificaties');
		} else {
			$scope.ll_excel.total = data.total;
			$scope.ll_excel.done++;
		}
		if ($scope.ll_excel.done >= $scope.ll_excel.total) {
			$scope.ll_excel.message = 'Alle vaste specificaties zijn gegenereerd!';
		}
	});




	socket.socket.on('mail_send', function(data) {
		if (data.err) {
			$scope.mail.errors = data.err;
      message.error('Er ging iets mis bij het versturen van de emails');
		} else {
			$scope.mail.total = data.total;
			$scope.mail.done++;
		}
		if ($scope.mail.done >= $scope.mail.total) {
			$scope.mail.message = 'Alle specificaties zijn verzonden!';
		} else {
			$scope.mail.message = 'Versturen specificaties...';
		}
	});



	socket.socket.on('customer', function(data) {
		var message;
		switch (data.code) {
			case 'NO_CUSTOMER_DATA':    message = {message: 'Er zijn geen klantgegevens, deze graag aanleveren.', type: 'danger'}; break;
			case 'NO_DEPARTMENT_DATA':  message = {message: 'Er zijn geen afdelingen gespecificeerd, deze graag aanleveren', type: 'danger'}; break;
			case 'UNKNOWN_NUMBER':      message = {message: 'Nummer ' + data.number + ' is niet bekend, deze graag toevoegen aan de klantgegevens.', type: 'danger'}; break;
			case 'NO_NAME':             message = {message: 'Van nummer ' + data.number + ' is geen naam bekend.', type: 'warning'}; break;
			case 'NO_DEPARTMENT':       message = {message: data.name + ' (' + data.number + ') heeft geen afdeling gespecificeerd.', type: 'warning'}; break;
			case 'UNKNOWN_DEPARTMENT':  message = {message: data.name + ' (' + data.number + ') zit in een onbekende afdeling (' + data.department + ').', type: 'warning'}; break;
			default:                    message = {message: 'Onbekende fout in de klantgegevens... :(', type: 'danger'}; break;
		}
		var messages = $scope.PDFmessages;
		messages.push(message);
		$scope.PDFmessages = _.sortBy(messages, function(o) { return (o.type === 'danger'? 0: 1); });
	});


	// log error if error on server..
	socket.socket.on('server_error', function(msg) {
    console.log(msg);
    message.error('Er ging iets mis op de server..');
	});

});
