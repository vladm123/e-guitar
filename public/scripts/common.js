var seconds = 1000;
var minutes = 60 * seconds;
var hours = 60 * minutes;

// TODO split this method, it tends to get large
// Method for each metric
// Method to add the task
// Method to populate the task based on progress
function populateTasks(id, tasks, $container) {
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
		
		var $taskContainer = $('<div></div>')
			.attr('data-start', task.start)
			.attr('data-end', task.end)
			.css('width', diameter + 'px')
			.css('height', diameter + 'px')
			.css('left', positionX + 'px')
			.css('top', positionY + 'px')
			.css('font-size', (diameter * 0.9) + 'px')
			.css('opacity', opacity)
			.appendTo($container);
			
		if (progress) {
			$taskContainer
				.addClass('progress')
				.attr('title', 'Click to finish this task started at [' +
					new Date(parseInt(task.start)).toLocaleString() + ']')
				.css('cursor', 'pointer');
			$taskContainer.on('click', function(event) {
				var start = $(event.target).attr('data-start');
				var end = $(event.target).attr('data-end') ?
					$(event.target).attr('data-end') : new Date().getTime();
				updateTask(id, start, end);
			});
		} else {
			$taskContainer
				.addClass('done')
				.attr('title', 'This task started at [' + 
					new Date(parseInt(task.start)).toLocaleString() +
					'] and finished at [' +
					new Date(parseInt(task.end)).toLocaleString() + ']');
		}
	}
}

function computeTotalHours(tasks) {
	var now = new Date().getTime();
	var sum = 0;
	
	for (var index = 0; index < tasks.length; ++index) {
		var task = tasks[index];
		
		if (!task.start) {
			continue;
		}

		if (task.end && task.start <= task.end) {
			sum += task.end - task.start;
		}
		
		if (!task.end && task.start <= now) {
			sum += now - task.start;
		}
	}
	
	// Return the number of hours.
	return Math.floor(sum / hours) + 'h ' +
		Math.floor(sum % hours / minutes) + '\'';
}