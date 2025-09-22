	JS.eval(<<~JS)
				function repeat(action, interval, repetitions) {
			   let count = 0;
			   let intervalId = null;

			   function executeAction() {
				   if (count < repetitions) {
					   action(count);
					   count++;
				   } else {
					   clearInterval(intervalId);
				   }
			   }

			   executeAction(); // execute immediatly
			   intervalId = setInterval(executeAction, interval);
			   return intervalId;
		   }

		   function myAction(counter) {
			   atomeJsToRuby("repeat_callback(#{repeat_id}, "+counter+")")
		   }

		   const intervalId = repeat(myAction, #{delay} * 1000, #{repeat}); 

	  return intervalId;
	JS