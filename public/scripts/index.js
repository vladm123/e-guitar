function populateTasks(tasks, $container) {
	var now = new Date().getTime();

	var minInterval = Number.MAX_VALUE;
	var maxInterval = 0;
	
	var minStart = Number.MAX_VALUE;
	var maxEnd = now;
	
	// Cannot trust the task order.
	for (var index = 0; index < tasks.length; ++index) {
		var task = tasks[index];
		
		// Skip the bad tasks.
		if (task.start && task.end && task.start > task.end) {
			continue;
		}

		if (task.start && task.start < minStart) {
			minStart = task.start;
		}
		
		if (task.end && task.end > maxEnd) {
			maxEnd = task.end;
		}
		
		if (task.start && task.end &&
				task.end - task.start > maxInterval) {
			maxInterval = task.end - task.start;
		}
		
		if (task.start && !(task.end) && task.start <= now &&
				now - task.start > maxInterval) {
			maxInterval = now - task.start;
		}
	}
	
	var diff = maxEnd - minStart;
	
	// Normalize the sizes for circles of radius at most 50 (magic).
	var maxSize = Math.min(100, );
}

function computeTotalHours(tasks) {
	var sum = 0;
	
	for (var index = 0; index < tasks.length; ++index) {
		var task = tasks[index];

		if (task.start && task.end &&
				task.start <= task.end) {
			sum += task.end - task.start;
		}
	}
	
	// Return the number of hours.
	var seconds = 1000;
	var minutes = 60 * seconds;
	var hours = 60 * minutes;
	return Math.floor(sum / hours) + 'h ' +
		(sum % hours / minutes) + '\'';
}

function populateProject(index, project) {
	$projectContainer = $('<div></div>').appendTo('body > div');

	// Populating the project information.
	$projectHours = $('<aside></aside>')
		.html(computeTotalHours(project.tasks))
		.appendTo($projectContainer);
	$projectTitle = $('<h2></h2>').html(project.name)
		.appendTo($projectContainer);
	
	if (project.description) {
		$projectDescription = $('<p></p>')
			.html(project.description)
			.appendTo($projectContainer);
	}

	if (project.tasks) {
		// Adding the tasks container
		$tasksContainer = $('<div></div>')
			.appendTo($projectContainer);
		populateTasks(project.tasks, $tasksContainer);
	}
}

function populateProjects() {
	$.get('http://localhost:3000/projects', function(data) {
		$('body > div').empty();
		$.each(data, populateProject);
	});
}

$(document).ready(function() {
	populateProjects();
});