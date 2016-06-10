	$scope.addMarker = function($event){
		console.log('WOW YOU CLICKED IT!')
		console.log($event);
		var xClick = $event.offsetX;
		var yClick = $event.offsetY;
		$scope.newMarker = '<div class="marker" style="position: absolute; top: '+xClick+'; left: '+yClick+';">1</div>';
	}
