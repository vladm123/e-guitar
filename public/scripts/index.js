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
	var maxSize = Math.min(100, maxInterval * 700 / diff);

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
	$projectContainer = $('<div></div>')
		.attr('id', project._id)
		.prependTo('body > div.all');

	// Populating the project information.
	$projectHours = $('<aside></aside>')
		.html(computeTotalHours(project.tasks))
		.appendTo($projectContainer);
	$projectTitle = $('<h2></h2>').html(project.name)
		.appendTo($projectContainer);
	
	// Handle the click for the project.
	$projectTitle.on('click', function(event) {
		id = $(event.target).parent().attr('id');
		name = $(event.target).parent().find('h2').html();
		description = $(event.target).parent().find('p').html();
		populateEditProject(id, name, description);
	});
	
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
	$newProjectDiv.find('input.id').val('');
	$newProjectDiv.find('input.name').val('');
	$newProjectDiv.find('input.description').val('');

	$newProjectDiv.find('input.add').show();
	$newProjectDiv.find('input.edit').hide();
	$newProjectDiv.find('input.remove').hide();
	$newProjectDiv.find('input.close').hide();
}

function populateEditProject(id, name, description) {
	$newProjectDiv = $('body > div.new');
	$newProjectDiv.find('input.id').val(id);
	$newProjectDiv.find('input.name').val(name);
	$newProjectDiv.find('input.description').val(description);

	$newProjectDiv.find('input.add').hide();
	$newProjectDiv.find('input.edit').show();
	$newProjectDiv.find('input.remove').show();
	$newProjectDiv.find('input.close').show();
}

function depopulateProject(id) {
	$('body > div.all > div#' + id).remove();
}

function addProject(name, description) {
	$.post('http://localhost:3000/projects/insert', {name: name, description: description}, function(project) {
		populateProject(0, project);
		populateNewProject();
	});
}

function editProject(id, name, description) {
	$.post('http://localhost:3000/projects/' + id + '/update', {name: name, description: description}, function(project) {
		depopulateProject(id);
		populateProject(0, project);
		populateNewProject();
	});
}

function removeProject(id) {
	$.post('http://localhost:3000/projects/' + id + '/delete', {}, function(project) {
		depopulateProject(id);
		populateNewProject();
	});
}

$(document).ready(function() {
	populateProjects();
	populateNewProject();
	
	$('body > div.new form.project input.add').on('click', function(event) {
		name = $('body > div.new form.project input.name').val();
		description = $('body > div.new form.project input.description').val();
		addProject(name, description);
	});
	
	$('body > div.new form.project input.edit').on('click', function(event) {
		id = $('body > div.new form.project input.id').val();
		name = $('body > div.new form.project input.name').val();
		description = $('body > div.new form.project input.description').val();
		editProject(id, name, description);
	});

	$('body > div.new form.project input.remove').on('click', function(event) {
	
		// Do you really want to remove the project?
		if (!confirm("This project will be deleted. Click OK to continue and Cancel to keep it.")) {
			return;
		}
		
		id = $('body > div.new form.project input.id').val();
		removeProject(id);
	});

	$('body > div.new form.project input.close').on('click', function(event) {
		populateNewProject();
	});
});