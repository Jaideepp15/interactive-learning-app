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
        sh 'npm install' // or 'pip install -r requirements.txt' for Python
      }
    }

    stage('Run Unit Tests') {
      steps {
        sh 'npm test' // or 'python -m unittest discover' for Python
      }
      post {
        always {
          junit 'junit.xml' // Ensure your test framework generates JUnit-compatible reports
        }
      }
    }
  }
}