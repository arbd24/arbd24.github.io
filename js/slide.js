$(function() {
			$('.slideshow').square1();

			$('.slideshow_html').square1();

			$('.slideshow_contain').square1({
				fill_mode: 'contain'
			});

			$('.slideshow_formatting').square1({
				width: '200px',
				height: '200px',
				prev_next_nav: 'outside',
				dots_nav: 'outside',
				caption: 'none'
			});


			$('.slideshow_slide').square1({
				animation: 'slide',
				// transition_time: 5000,
			});

			$('.slideshow_scalefrom').square1({
				scale_from: 'bottom right'
			});

			$('.slideshow_light').square1({
				caption: 'none',
				theme: 'light'
			});


			$('.slideshow_events').square1({
				slide_duration: 2000,
				auto_start: false,
				onPlay: function() { $('.status').html('Playing');},
				onStop: function() { console.log('stop event'); $('.status').html('Stopped');},
				onChange: function() { $('.status').html('Changing slides');},
			});

			$('.play').click(function() {
				$('.slideshow_events').square1('play');
			});

			$('.stop').click(function() {
				$('.slideshow_events').square1('stop');
			});

			$('.next_slide').click(function() {
				$('.slideshow_events').square1('next');
			});

			// Jump to Slide 3
			$('.slide3').click(function() {
				$('.slideshow_events').square1(3);
			});
		});
