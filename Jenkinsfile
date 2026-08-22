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
                            backendImage = docker.build("${env.DOCKER_REGISTRY}/${env.BACKEND_IMAGE}:${env.BUILD_ID}", "./backend")
                        }
                    }
                }
                stage('Build Frontend') {
                    steps {
                        script {
                            echo "Building Frontend image..."
                            frontendImage = docker.build("${env.DOCKER_REGISTRY}/${env.FRONTEND_IMAGE}:${env.BUILD_ID}", "./frontend")
                        }
                    }
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    echo "Pushing Docker images..."
                    // TODO: Configure docker registry credentials in Jenkins before uncommenting
                    // docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials-id') {
                    //     backendImage.push()
                    //     backendImage.push('latest')
                    //     frontendImage.push()
                    //     frontendImage.push('latest')
                    // }
                    echo "Skipping push for demo. Read comments to enable actual pushing."
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
