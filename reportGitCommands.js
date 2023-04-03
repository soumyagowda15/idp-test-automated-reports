const gulp = require('gulp');
const {exec} = require('child_process');

module.exports = {
    copyReportToGithub: async () => {
        return gulp.series(
            function copyFiles() {
                console.log('Copying IDPTestingReport files to gitHub Repository...');
                return gulp.src('./Reporting/IDPTestingReport/**/*')
                    .pipe(gulp.dest('./gitHub/idp-test-automated-reports/'));
            },
            
            function pushToGithub() {
                console.log('Pushing changes to GitHub...');
                return new Promise((resolve, reject) => {
                    exec('cd gitHub/idp-test-automated-reports && git add . && git commit -m "Added IDPTestingReport" && git push https://github.com/soumyagowda15/idp-test-automated-reports.git main', (error, stdout, stderr) => {
                        console.log(stdout);
                        console.log(stderr);
                        if (error) {
                            reject(error);
                        } else {
                            resolve();
                        }
                    });
                });
            }
        )();
    }
}
