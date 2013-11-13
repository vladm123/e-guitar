function populateProjects(projectid) {
	$.get('http://localhost:3000/projects/' + projectid, function(project) {
		populateProject(0, project);
	});
}

function populateProject(index, project) {
	$projectContainer = $('<div></div>')
		.attr('id', project._id)
		.prependTo('body > div.all')
		.show();

	// Populating the project information.
	$projectHours = $('<aside></aside>')
		.html(' « this project took ' + computeTotalHours(project.tasks))
		.appendTo($projectContainer);
	$permalink = $('<a></a>')
		.attr('href', 'http://localhost:3000')
		.attr('title', 'Click to see all projects')
		.html('projects')
		.prependTo($projectHours);
	$projectTitle = $('<h2></h2>').html(project.name)
		.attr('title', 'This is an awesome project')
		.appendTo($projectContainer);
	
	if (project.description) {
		$projectDescription = $('<p></p>')
			.html(project.description)
			.appendTo($projectContainer);
	}

	if (project.tasks) {

		// Adding the tasks container.
		$tasksContainer = $('<div></div>')
			.addClass('tasks')
			.appendTo($projectContainer);
		populateTasks(project._id, project.tasks, $tasksContainer);
	}
}

$(document).ready(function() {
	populateProjects(projectid);
});