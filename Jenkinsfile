pipeline {
  agent any

  environment {
    NODE_ENV = 'test'
  }

  stages {
    stage('Checkout') {
      steps {
        git url: 'https://github.com/Jaideepp15/interactive-learning-app.git', branch: 'main'
      }
    }

    stage('Install Dependencies') {
      steps {
        bat 'npm install'  // Use 'bat' instead of 'sh' for Windows
      }
    }

    stage('Run Unit Tests') {
      steps {
        bat 'npm test'  // Use 'bat' instead of 'sh' for Windows
      }
      post {
        always {
          junit 'junit.xml'  // Ensure your test framework generates JUnit-compatible reports
        }
      }
    }
  }
}
