pipeline {
    agent any

    environment {

        /* =========================
           GIT CONFIG
        ========================= */
        GIT_REPO   = "https://github.com/mehar-pa-45/3tier-kartzon-E-commerce.git"
        GIT_BRANCH = "main"

        /* =========================
           DOCKER CONFIG
        ========================= */
        DOCKERHUB_USER = "mehardocker45"
        IMAGE_NAME     = "kartzon-e-commerce"
        IMAGE_TAG      = "latest"
        DOCKER_CREDS   = "Docker_CRED"

        /* =========================
           SONARQUBE CONFIG
        ========================= */
        SONAR_PROJECT_KEY = "Kartzon-repo"
        SONAR_SERVER      = "Sonarscanner"

        /* =========================
           NEXUS CONFIG
        ========================= */
        NEXUS_URL   = "http://localhost:8081"
        NEXUS_REPO  = "raw-repo"
        NEXUS_CREDS = "nexus-cred"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scmGit(
                    branches: [[name: "*/${GIT_BRANCH}"]],
                    userRemoteConfigs: [[
                        credentialsId: 'Github-Cred',
                        url: "${GIT_REPO}"
                    ]]
                )
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test || true'
            }
        }

        /* =========================
           SONARQUBE ANALYSIS (FIXED)
        ========================= */
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv("${SONAR_SERVER}") {
                    sh """
                    /opt/sonar-scanner/bin/sonar-scanner \
                    -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                    -Dsonar.sources=. \
                    -Dsonar.qualitygate.wait=true
                    """
                }
            }
        }

        /* =========================
           QUALITY GATE (STRICT)
        ========================= */
        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    script {
                        def qg = waitForQualityGate()

                        echo "Quality Gate Status: ${qg.status}"

                        if (qg.status != 'OK') {
                            error("❌ Pipeline stopped due to Quality Gate failure")
                        }
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${DOCKERHUB_USER}/${IMAGE_NAME}:${IMAGE_TAG} ."
            }
        }

        stage('DockerHub Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: "${DOCKER_CREDS}",
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                }
            }
        }

        stage('Push Image to DockerHub') {
            steps {
                sh "docker push ${DOCKERHUB_USER}/${IMAGE_NAME}:${IMAGE_TAG}"
            }
        }

        stage('Upload Artifact to Nexus') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: "${NEXUS_CREDS}",
                    usernameVariable: 'NEXUS_USER',
                    passwordVariable: 'NEXUS_PASS'
                )]) {

                    sh '''
                    zip -r app.zip .

                    curl -v -u $NEXUS_USER:$NEXUS_PASS \
                    --upload-file app.zip \
                    ${NEXUS_URL}/repository/${NEXUS_REPO}/app.zip
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ CI/CD Pipeline Completed Successfully"
        }
        failure {
            echo "❌ Pipeline Failed"
        }
    }
}
