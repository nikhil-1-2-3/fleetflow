pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'singhnikhil212' // TODO: Replace with your actual Docker Hub username
        FRONTEND_IMAGE = 'renthere-frontend'
        BACKEND_IMAGE = 'renthere-backend'
        KUBECONFIG_CREDENTIAL_ID = 'your-kubeconfig-id' // TODO: Set this up in Jenkins credentials
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Images') {
            parallel {
                stage('Build Backend') {
                    steps {
                        script {
                            echo "Building Backend image..."
                            powershell "docker build -t ${env.DOCKER_REGISTRY}/${env.BACKEND_IMAGE}:${env.BUILD_ID} ./backend"
                            powershell "docker tag ${env.DOCKER_REGISTRY}/${env.BACKEND_IMAGE}:${env.BUILD_ID} ${env.DOCKER_REGISTRY}/${env.BACKEND_IMAGE}:latest"
                        }
                    }
                }
                stage('Build Frontend') {
                    steps {
                        script {
                            echo "Building Frontend image..."
                            powershell "docker build -t ${env.DOCKER_REGISTRY}/${env.FRONTEND_IMAGE}:${env.BUILD_ID} ./frontend"
                            powershell "docker tag ${env.DOCKER_REGISTRY}/${env.FRONTEND_IMAGE}:${env.BUILD_ID} ${env.DOCKER_REGISTRY}/${env.FRONTEND_IMAGE}:latest"
                        }
                    }
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    echo "Pushing Docker images..."
                    // TODO: You will need to run 'docker login' on your Windows machine first, or configure Jenkins credentials
                    // powershell "docker push ${env.DOCKER_REGISTRY}/${env.BACKEND_IMAGE}:${env.BUILD_ID}"
                    // powershell "docker push ${env.DOCKER_REGISTRY}/${env.BACKEND_IMAGE}:latest"
                    // powershell "docker push ${env.DOCKER_REGISTRY}/${env.FRONTEND_IMAGE}:${env.BUILD_ID}"
                    // powershell "docker push ${env.DOCKER_REGISTRY}/${env.FRONTEND_IMAGE}:latest"
                    
                    echo "Skipping push for demo. Uncomment lines above to enable."
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    echo "Deploying to Kubernetes cluster..."
                    
                    // Using PowerShell because Jenkins is running natively on Windows
                    powershell """
                        # Update the tags to the new build ID
                        (Get-Content k8s/backend-deployment.yaml) -replace 'image: singhnikhil212/renthere-backend:.*', 'image: singhnikhil212/renthere-backend:${env.BUILD_ID}' | Set-Content k8s/backend-deployment.yaml
                        (Get-Content k8s/frontend-deployment.yaml) -replace 'image: singhnikhil212/renthere-frontend:.*', 'image: singhnikhil212/renthere-frontend:${env.BUILD_ID}' | Set-Content k8s/frontend-deployment.yaml
                        
                        # Apply to the cluster
                        kubectl apply -f k8s/
                    """
                }
            }
        }
    }
}
