pipeline {
    agent any

    environment {
        // Change these variables as needed
        DOCKER_IMAGE_NAME = 'your-dockerhub-username/ecommerce-app'
        DOCKER_TAG = "${env.BUILD_ID}"
        // The ID of the credential created in Jenkins for Docker Hub
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                checkout scm
            }
        }

        // --- FUTURE ENHANCEMENT: SonarQube ---
        // stage('SonarQube Analysis') {
        //     steps {
        //         echo 'Running SonarQube analysis...'
        //         // Example integration:
        //         // withSonarQubeEnv('SonarQubeServer') {
        //         //     sh 'npm run test:coverage'
        //         // }
        //     }
        // }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker Image: ${DOCKER_IMAGE_NAME}:${DOCKER_TAG}"
                script {
                    appImage = docker.build("${DOCKER_IMAGE_NAME}:${DOCKER_TAG}")
                }
            }
        }

        // --- FUTURE ENHANCEMENT: Nexus Artifact Upload ---
        // stage('Upload to Nexus') {
        //     steps {
        //         echo 'Uploading artifacts/images to Nexus...'
        //         // Integration with Nexus Plugin or using curl/docker tag & push to Nexus repo
        //     }
        // }

        stage('Push Docker Image') {
            steps {
                echo 'Logging into DockerHub and pushing image...'
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS_ID) {
                        appImage.push()
                        appImage.push('latest')
                    }
                }
            }
        }

        // --- FUTURE ENHANCEMENT: Kubernetes ---
        // stage('Deploy to Kubernetes') {
        //     steps {
        //         echo 'Deploying to Kubernetes cluster...'
        //         // Example integration:
        //         // withKubeConfig([credentialsId: 'k8s-credentials', serverUrl: 'https://k8s.example.com']) {
        //         //     sh 'kubectl apply -f k8s/'
        //         //     sh "kubectl set image deployment/ecommerce-app app=${DOCKER_IMAGE_NAME}:${DOCKER_TAG}"
        //         // }
        //     }
        // }
    }

    post {
        always {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check Jenkins logs for details.'
        }
    }
}
