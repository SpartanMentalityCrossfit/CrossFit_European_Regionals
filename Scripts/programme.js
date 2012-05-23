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
			contentMarkup += "<table><tbody>";

			for (var j = 0; j < workout.heatcount; j++) {
				var starttime = new Date(workout.starttime);
				starttime.setMinutes(starttime.getMinutes() + workout.heattimelimit * j);

				var endtime = new Date(workout.starttime);
				endtime.setMinutes(workout.starttime.getMinutes() + workout.heattimelimit * (j + 1));

				var starttimeminutes = starttime.getMinutes() < 10 ? "0" + starttime.getMinutes() : starttime.getMinutes();
				var endtimeminutes = endtime.getMinutes() < 10 ? "0" + endtime.getMinutes() : endtime.getMinutes();

				contentMarkup += "<tr><td>" + starttime.getHours() + ":" + starttimeminutes + " - " + endtime.getHours() + ":" + endtimeminutes + "</td><td>Heat " + (j + 1) + "</td></tr>";
			}

			contentMarkup += "</tbody></table></div>";
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
