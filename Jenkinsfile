pipeline {
  agent any

  environment {
    NODE_ENV = 'test'
    JEST_JUNIT_OUTPUT_DIR = './'
    JEST_JUNIT_OUTPUT_NAME = 'junit.xml'
  }

  stages {
    stage('Checkout') {
      steps {
        git url: 'https://github.com/Jaideepp15/interactive-learning-app.git', branch: 'main'
      }
    }

    stage('Install Dependencies') {
      steps {
        bat 'npm install'
        bat 'npm install --save-dev jest-junit'
      }
    }

    stage('Run Unit Tests') {
      steps {
        bat 'npm test -- --ci --reporters=default --reporters=jest-junit'
      }
      post {
        always {
          junit testResults: 'junit.xml', allowEmptyResults: true
        }
      }
    }
  }
}
