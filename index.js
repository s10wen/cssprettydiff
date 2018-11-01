'use strict';

// Confirmation Dependancies
const inspect  = require('util').inspect;
const Enquirer = require('enquirer');

// gulp Dependancies
const gulp = require('gulp');
require('./gulpfile.js');

// git Dependancies
//const simpleGit = require('simple-git');

//const gitP = require('simple-git/promise');
//const git = gitP(__dirname);




// Confirmation
// TODO: check if repo is clean and only prompt for confirmation if required
let enquirer = new Enquirer ();
enquirer.register ('confirm', require ('prompt-confirm'));

enquirer.question ('agree', 'WARNING: stash / backup / clean your repo if required, continue?', {
  type: 'confirm',
  default: false
})

enquirer.ask()
.then( confirmation => {
  console.log('confirmation: ' + inspect (confirmation, {colors: true}));
  console.log(Object.values(confirmation)[0]);

  const test = Object.values(confirmation).toString();

  console.log('test: ' + test);
  console.log('typeof: ' + typeof test);

  // If repo not clean, quit out
  if (test === 'false') {
	console.log('FALSE');
	process.exit();
  } else {
	console.log('TRUE');
	console.log('running');

	// Ask SHA to use
	enquirer.question('sha', 'SHA?');

	enquirer.prompt('sha')
	  .then(function(shaResult) {
		console.log(shaResult)

		// TODO: avoid nesting / improve code
		console.log('testing');

		// Compile existing CSS
		if (gulp.tasks.styles) {
			console.log('gulpfile contains task!');
			gulp.start('styles');
		}

		// Go to CSS path
		console.log(process.cwd());
		process.chdir('.tmp/styles');
		console.log(process.cwd());

		// Create as a new git repo
		require('simple-git')()
		  .init()
		  .add('./*')
		  .commit('Current CSS!')

		// Go back to route
		console.log(process.cwd());
		process.chdir('../..');
		console.log(process.cwd());


	  });




	//gulp.start('styles');

	/* test */

  }
})


/*if () {
	process.exit()
}*/


