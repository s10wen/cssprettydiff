'use strict';

// Confirmation Dependancies
const inspect  = require ('util').inspect;
const Enquirer = require ('enquirer');

// testv2
// Thanks to Chris Matheson for showing me this:
// https://nodejs.org/dist/latest-v9.x/docs/api/child_process.html#child_process_child_process_execsync_command_options
const execSync = require('child_process').execSync;


// Confirmation
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

        // Store shaResult
        const shaResultValue = Object.values(shaResult)[1].toString();
        console.log('shaResultValue: ' + shaResultValue)

        console.log('START: gulp styles 1');
        execSync('gulp styles');
        console.log('END: gulp styles 1');

        // Go to CSS path
        console.log(process.cwd());
        process.chdir('.tmp/styles');
        console.log(process.cwd());

        // Create a new git repo and add current CSS
        console.log('START: git repo create and add');
        execSync('git init');
        execSync('git add .');
        execSync('git commit -m "Current CSS"');
        console.log('FINISH: git repo create and add');

        // Go back to route
        console.log(process.cwd());
        process.chdir('../..');
        console.log(process.cwd());

        // Go back to specific SHA
        console.log('START: git revert');
        console.log('shaResultValue: ' + shaResultValue);
        execSync('git checkout ' + shaResultValue);
        console.log('shaResultValue: ' + shaResultValue);
        console.log('END: git revert');

        // TODO: go back x amounts of commits
        // require('simple-git')()
        //  .revert('HEAD~2')

        // Compile new CSS
        console.log('START: gulp styles 2');
        execSync('gulp styles');
        console.log('END: gulp styles 2');

        // Go to CSS path
        console.log(process.cwd());
        process.chdir('.tmp/styles');
        console.log(process.cwd());

        // Add new CSS to git
        console.log('START: New CSS');
        execSync('git add .');
        console.log('END: New CSS');
      });

  }
})
