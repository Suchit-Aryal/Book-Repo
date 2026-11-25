// Jenkins pipeline: checks the code, builds the frontend, deploys to this server
pipeline {
    agent any

    triggers {
        // look at github every 2 minutes, run when there is a new commit
        pollSCM('H/2 * * * *')
    }

    stages {
        stage('Install backend') {
            steps {
                dir('Backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Install frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Lint frontend') {
            steps {
                dir('frontend') {
                    sh 'npm run lint'
                }
            }
        }

        stage('Build frontend') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy frontend') {
            steps {
                // nginx serves this folder (owned by the jenkins user, see DEPLOY.md)
                sh 'rm -rf /usr/share/nginx/bookshelf/*'
                sh 'cp -r frontend/dist/* /usr/share/nginx/bookshelf/'
            }
        }

        stage('Deploy backend') {
            steps {
                dir('Backend') {
                    // restart if it already runs, else start it
                    sh 'pm2 restart bookshelf-api || pm2 start index.js --name bookshelf-api'
                    sh 'pm2 save'
                }
            }
        }
    }

    post {
        success { echo 'Deployed successfully' }
        failure { echo 'Pipeline failed, check the console output' }
    }
}
