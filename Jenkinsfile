pipeline {
    agent {
    label 'node'
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
       stage("Publish Report") {
      steps {
        publishHTML(target: [
          reportDir: 'Reporting\IDPTestingReport', 
          reportFiles: 'index.html', 
          reportName: 'HTML Report'
        ])
      }
        }
    }
}