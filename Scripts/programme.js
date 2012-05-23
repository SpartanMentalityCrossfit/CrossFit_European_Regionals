function showProgramme(urlObj, options) {
	var dayName = urlObj.hash.replace(/.*day=/, "");

	var dayProgramme = programme[dayName];
	var pageSelector = urlObj.hash.replace(/\?.*$/, "");

	if (dayProgramme) {
		var $page = $(pageSelector);

		var $header = $page.children(":jqmData(role=header)");
		var $content = $page.children(":jqmData(role=content)");

		$header.find("h1").html(dayProgramme.header);

		var contentMarkup = "<h3>" + dayProgramme.subtitle + "</h3><div data-role=\"collapsible-set\">";

		var workouts = dayProgramme.workouts;

		for (var i = 0; i < workouts.length; i++) {
			var workout = workouts[i];

			var workoutStart = workout.starttime;

			var workoutEnd = new Date(workoutStart);
			workoutEnd.setMinutes(workout.heatcount * workout.heattimelimit);

			var currentDate = new Date();

			var isCurrentWorkout = workoutStart <= currentDate && currentDate <= workoutEnd;

			contentMarkup += "<div data-role=\"collapsible\"" + (isCurrentWorkout ? "data-collapsed=\"false\"" : "") + ">";

			var minutes = workout.starttime.getMinutes() < 10 ? "0" + workout.starttime.getMinutes() : workout.starttime.getMinutes();

			contentMarkup += "<h4>" + workout.name + " (" + workout.starttime.getHours() + ":" + minutes + ")</h4>";

			if (workout.heats) {
				for (var k = 0; k < workout.heats.length; k++) {
					var heat = workout.heats[k];

					var isSpartan = $.inArray("Spartans Warriors", heat) != -1 || $.inArray("Anders Galaly", heat) != -1;

					contentMarkup += "<div data-role=\"collapsible\"" + (isSpartan ? "data-theme=\"b\"" : "") + ">";

					contentMarkup += "<h3>Heat " + (k + 1) + " (" + findTime(workout.starttime, workout.heattimelimit, k) + " - " + findTime(workout.starttime, workout.heattimelimit, k + 1) + ")</h3>";

					contentMarkup += "<table><tbody>";

					for (var l = 0; l < heat.length; l++) {
						contentMarkup += "<tr><td>" + heat[l] + "</td></tr>";
					}

					contentMarkup += "</tbody></table>";

					contentMarkup += "</div>";
				}
			} else {
				contentMarkup += "<table><tbody>";
				
				for (var j = 0; j < workout.heatcount; j++) {
					contentMarkup += "<tr><td>Heat " + (j + 1) + "</td><td>" + findTime(workout.starttime, workout.heattimelimit, j) + " - " + findTime(workout.starttime, workout.heattimelimit, j + 1) + "</td></tr>";
				}

				contentMarkup += "</tbody></table>";
			}
			
			contentMarkup += "</div>";
		}

		contentMarkup += "</div>";

		$content.html(contentMarkup);

		$page.page();

		$header.trigger("refresh");
		$content.trigger("create");

		options.dataUrl = urlObj.href;

		$.mobile.changePage($page, options);
	}
}

function findTime(inputDate, heattimelimit, round) {
	var outputDate = new Date(inputDate);

	outputDate.setMinutes(outputDate.getMinutes() + heattimelimit * round);

	var minutes = outputDate.getMinutes() < 10 ? "0" + outputDate.getMinutes() : outputDate.getMinutes();

	return "" + outputDate.getHours() + ":" + minutes;
}
