pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = "my_project"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git 'https://github.com/SSUHAS4U/Docker.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                echo 'Building Docker Images for frontend and backend...'
                bat 'docker-compose build'
            }
        }

        stage('Run Docker Containers') {
            steps {
                echo 'Stopping existing containers (if any)...'
                bat 'docker-compose down --volumes --remove-orphans'

                echo 'Running Docker containers using docker-compose...'
                bat 'docker-compose up -d'
            }
        }

        stage('Check Running Services') {
            steps {
                echo 'Checking running containers...'
                bat 'docker ps'
            }
        }
    }

    post {
        success {
            echo 'Deployment completed successfully!'
        }
        failure {
            echo 'Deployment failed. Please check logs.'
        }
    }
}
