function showProgramme(urlObj, options) {
	var dayName = urlObj.hash.replace(/.*day=/, "");

	var dayProgramme = programme[dayName];
	var pageSelector = urlObj.hash.replace(/\?.*$/, "");

	if (dayProgramme) {
		var $page = $(pageSelector);

		var $header = $page.children(":jqmData(role=header)");
		var $content = $page.children(":jqmData(role=content)");

		$header.find("h1").html(dayProgramme.header);

		var contentMarkup = "<p>Spartan participation will mark the heat with a blue color</p>";
		
		contentMarkup += "<h3>" + dayProgramme.subtitle + "</h3><div data-role=\"collapsible-set\">";

		var workouts = dayProgramme.workouts;

		for (var i = 0; i < workouts.length; i++) {
			var workout = workouts[i];

			var workoutStart = workout.starttime;

			//var workoutEnd = new Date(workoutStart);
			//workoutEnd.setMinutes(workout.heatcount * workout.heattimelimit);

			//var currentDate = new Date();

			//var isCurrentWorkout = workoutStart <= currentDate && currentDate <= workoutEnd;

			contentMarkup += "<div data-role=\"collapsible\"" + /*(isCurrentWorkout ? "data-collapsed=\"false\"" : "") +*/ ">";

			var minutes = workout.starttime.getMinutes() < 10 ? "0" + workout.starttime.getMinutes() : workout.starttime.getMinutes();

			contentMarkup += "<h4>" + workout.name + " (" + workout.starttime.getHours() + ":" + minutes + ")</h4>";

			for (var k = 0; k < workout.heatcount; k++) {
				var isSpartan = workout.spartanHeat === (k + 1);

				contentMarkup += "<div data-role=\"collapsible\" " + (isSpartan ? "data-theme=\"b\"" : "") + ">";

				if (workout.heattimelimit) {
					contentMarkup += "<h3>Heat " + (k + 1) + " (" + findTime(workout.starttime, workout.heattimelimit, k) + " - " + findTime(workout.starttime, workout.heattimelimit, k + 1) + ")</h3>";
				} else {
					var heatData = workout.heats[k];

					var heatStartTime = heatData.heatStartTime;
					var workoutLength = heatData.workoutLength;

					var startTime = findTime(heatStartTime, workoutLength, 0);
					var endTime = findTime(heatStartTime, workoutLength, 1);

					contentMarkup += "<h3>Heat " + (k + 1) + " (" + startTime + " - " + endTime + ")</h3>";
				}

				contentMarkup += "</div>";
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
