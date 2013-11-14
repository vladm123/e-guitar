/* Population of projects */

// Populates a project by creating a HTML container and filling it.
function populateProject(index, project) {
	$projectContainer = $('<div></div>')
		.attr('id', project._id)
		.prependTo('body > div.all')
		.show();

	// Populating the project information.
	$projectHours = $('<aside></aside>')
		.html('this project took ' + computeTotalHours(project.tasks) + ' » ')
		.appendTo($projectContainer);
	$permalink = $('<a></a>')
		// TODO fetch the host and port
		.attr('href', 'http://localhost:3000/' + project._id)
		.attr('title', 'Click to see this project only')
		.html('permalink')
		.appendTo($projectHours);
	$projectTitle = $('<h2></h2>').html(project.name)
		.attr('title', 'Click to see project details')
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

		// Adding the tasks container.
		$tasksContainer = $('<div></div>')
			.addClass('tasks')
			.appendTo($projectContainer);
		populateTasks(project._id, project.tasks, $tasksContainer);
	}
	
	var $newTaskContainer = $('<div></div>')
		.attr('title', 'Click to add a new task')
		.addClass('task')
		.html('+')
		.appendTo($projectContainer);
			
		$newTaskContainer.on('click', function(event) {
			$(event.target).hide();
			addTask(project._id);
		});
}

/* Project manager container */

// Populates the project manager to enter the add project state.
function populateNewProject() {
	$newProjectDiv = $('body > div.project');
	$newProjectDiv.find('input.id').val('');
	$newProjectDiv.find('input.name').val('');
	$newProjectDiv.find('input.description').val('');

	$newProjectDiv.find('input.add').show();
	$newProjectDiv.find('input.edit').hide();
	$newProjectDiv.find('input.remove').hide();
	$newProjectDiv.find('input.close').hide();
}

// Populates the project manager to enter the project details state.
function populateEditProject(id, name, description) {
	$newProjectDiv = $('body > div.project');
	$newProjectDiv.find('input.id').val(id);
	$newProjectDiv.find('input.name').val(name);
	$newProjectDiv.find('input.description').val(description);

	$newProjectDiv.find('input.add').hide();
	$newProjectDiv.find('input.edit').show();
	$newProjectDiv.find('input.remove').show();
	$newProjectDiv.find('input.close').show();
}

// Project manager add button click handler.
function addButtonClick() {
	name = $('body > div.project form.project input.name').val();
	description = $('body > div.project form.project input.description').val();
	addProject(name, description);
}

// Project manager edit button click handler.
function editButtonClick() {
	id = $('body > div.project form.project input.id').val();
	name = $('body > div.project form.project input.name').val();
	description = $('body > div.project form.project input.description').val();
	editProject(id, name, description);
}

// Project manager remove button click handler.
function removeButtonClick() {
	// Do you really want to remove the project?
	if (!confirm("This project will be deleted. " +
			"Click OK to continue and Cancel to keep it.")) {
		return;
	}

	id = $('body > div.project form.project input.id').val();
	removeProject(id);
}

/* Task CRUD operations */

// Adds a task
function addTask(id) {
	$.post('http://localhost:3000/projects/' + id + 
		'/tasks/insert', {}, 
		function(project) {
			$('body > div.all > div#' + id).remove();
			populateProject(0, project);
		});
}

// Updates a task
function updateTask(id, start, end) {
	$.post('http://localhost:3000/projects/' + id + 
		'/tasks/update', {start: start, end: end}, 
		function(project) {
			$('body > div.all > div#' + id).remove();
			populateProject(0, project);
		});
}

/* Project CRUD operations */

// Gets the projects.
function getProjects() {
	$.get('http://localhost:3000/projects', function(projects) {
		$('body > div.all').empty();
		$.each(projects, populateProject);
	});
}

// Adds a project
function addProject(name, description) {
	$.post('http://localhost:3000/projects/insert', 
		{name: name, description: description}, 
		function(project) {
			populateProject(0, project);
			populateNewProject();
		});
}

// Edits a project
function editProject(id, name, description) {
	$.post('http://localhost:3000/projects/' + id + '/update', {name: name, description: description}, function(project) {
		$('body > div.all > div#' + id).remove();
		populateProject(0, project);
		populateNewProject();
	});
}

// Removes a project
function removeProject(id) {
	$.post('http://localhost:3000/projects/' + id + '/delete', {}, function(project) {
		$('body > div.all > div#' + id).remove();
		populateNewProject();
	});
}

/* Ready logic */

$(document).ready(function() {
	GetProjects();
	populateNewProject();
	
	$('body > div.project form.project input.add').on('click', addButtonClick);
	$('body > div.project form.project input.edit').on('click', editButtonClick);
	$('body > div.project form.project input.remove').on('click', removeButtonClick);
	$('body > div.project form.project input.close').on('click', populateNewProject);
});