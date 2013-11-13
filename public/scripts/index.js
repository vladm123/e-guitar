function populateTasks(tasks, $container) {
	var now = new Date().getTime();

	var minInterval = Number.MAX_VALUE;
	var maxInterval = 0;
	
	var minStart = Number.MAX_VALUE;
	var maxEnd = 0;
	
	// Cannot trust the task order.
	for (var index = 0; index < tasks.length; ++index) {
		var task = tasks[index];
			
		// Skip the bad tasks.
		if (!task.start || (task.start && task.end && task.start > task.end)) {
			continue;
		}

		if (task.start < minStart) {
			minStart = task.start;
		}
		
		if (task.end && task.end > maxEnd) {
			maxEnd = task.end;
		}
		
		if (!task.end && now > maxEnd) {
			maxEnd = now;
		}
		
		if (task.end && task.end - task.start > maxInterval) {
			maxInterval = task.end - task.start;
		}
		
		if (!(task.end) && now - task.start > maxInterval) {
			maxInterval = now - task.start;
		}
	}

	var diff = maxEnd - minStart;
	
	// Normalize the sizes for circles of radius at most 50 (magic).
	var maxSize = Math.min(100, maxInterval * 780 / diff);

	// Create the circles
	$container.empty();
	
	for (var index = 0; index < tasks.length; ++index) {
		var task = tasks[index];
	
		// Skip the bad tasks.
		if (!(task.start) || (task.start && task.end && task.start > task.end)) {
			continue;
		}

		var diameter; 
		var opacity;
		var progress;
		
		if (task.end) {
			var interval = task.end - task.start;
			diameter = Math.floor(interval * maxSize / maxInterval);
			opacity = 0.3;
			progress = false;
		} else {
			var interval = now - task.start;
			diameter = Math.floor(interval * maxSize / maxInterval);
			opacity = 0.9;
			progress = true;
		}
		
		diameter = Math.max(10, diameter);
		
		var positionX = Math.floor((task.start - minStart) * maxSize / maxInterval);
		var positionY = Math.floor(50 - diameter / 2);
		
		$taskContainer = $('<div></div>')
			.css('width', diameter + 'px')
			.css('height', diameter + 'px')
			.css('left', positionX + 'px')
			.css('top', positionY + 'px')
			.css('font-size', (diameter * 0.9) + 'px')
			.css('opacity', opacity)
			.appendTo($container);
			
		$taskContainer.on('click', function() {
			alert(1);
		});
			
		if (progress) {
			$taskContainer.addClass('progress');
		} else {
			$taskContainer.addClass('done');
		}
	}
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
		Math.floor(sum % hours / minutes) + '\'';
}

function populateProject(index, project) {
	$projectContainer = $('<div></div>').appendTo('body > div.all');

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
		$('body > div.all').empty();
		$.each(data, populateProject);
	});
}

function populateNewProject() {
	$newProjectDiv = $('body > div.new');
	$newProjectDiv.find('input.name').val('');
	$newProjectDiv.find('input.name').val('');

	$newProjectDiv.find('input.add').show();
	$newProjectDiv.find('input.edit').hide();
	$newProjectDiv.find('input.remove').hide();
	$newProjectDiv.find('input.close').hide();
}

function addProject(name, description) {
	
}

$(document).ready(function() {
	populateProjects();
	populateNewProject();
});