const { exec } = require('child_process');

const publishCommand = 'cd ./dist/ng-common && npm publish --registry https://npm.pkg.github.com';

exec(publishCommand, (error, stdout, stderr) => {
  if (error) {
    console.error('exec error: ', error);
    return;
  }

  console.log('stdout :>> ', stdout);
  console.log('stderr :>> ', stderr);
});
