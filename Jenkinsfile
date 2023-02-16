/* groovylint-disable-next-line CompileStatic */
pipeline {
    agent any
    tools {
        nodejs 'nodejs-14.17.0'
    }
    triggers {
        cron('0 6 * * *')
    }
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
                sh 'npm run IDPTesting'
            }
        }
        stage('Publish Report') {
            steps {
                publishHTML([
                    target: [
                        reportDir: 'Reporting/IDPTestingReport',
                        reportFiles: 'index.html',
                        reportName: 'HTML Report'
                    ]
                ])
            }
        }
    }
    post {
        unstable 'Test failed but continuing the pipeline'
    }
}
