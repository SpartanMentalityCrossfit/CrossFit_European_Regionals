function showWorkout(urlObj, options) {
	var workoutType = urlObj.hash.replace(/.*type=/, "");

	var workout = workouts[workoutType];
	var pageSelector = urlObj.hash.replace(/\?.*$/, "");

	if (workout) {
		var $page = $(pageSelector);

		var $header = $page.children(":jqmData(role=header)");
		var $content = $page.children(":jqmData(role=content)");

		$header.find("h1").html(workout.header);

		var contentMarkup = "<div data-role=\"collapsible-set\">";

		var events = workout.events;

		for (var i = 0; i < events.length; i++) {
			var event = events[i];

			contentMarkup += "<div data-role=\"collapsible\">";

			contentMarkup += "<h4>" + workout.header + " event " + (i + 1) + "</h4>";

			var timecap = event.timecap;

			if (timecap >= 0) {
				contentMarkup += "<p>Time cap: " + timecap + " minutes</p>";
			}

			var team = event.team;

			if (team) {
				var teamTotal = team.men + team.women;

				contentMarkup += "<p>Team " + teamTotal + " (" + team.men + " " + (team.men === 1 ? "man" : "men") + ", " + team.women + " " + (team.women === 1 ? "woman" : "women") + ")</p>";
			}

			contentMarkup += "<p>";

			var exercises = event.exercises;

			for (var j = 0; j < exercises.length; j++) {
				contentMarkup += (j === 0 ? "" : "<br />") + exercises[j];
			}

			contentMarkup += "</p>";

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
