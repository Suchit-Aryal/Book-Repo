# CI/CD with Jenkins (same EC2 server)

Flow: git push -> Jenkins sees it (polls every 2 min) -> install -> lint -> build -> copy to nginx -> pm2 restart.

## 1. Server size and ports
- Use at least a t3.medium (Jenkins + MongoDB + builds need RAM), or keep t3.small and add 2 GB swap:
  `sudo dd if=/dev/zero of=/swapfile bs=1M count=2048 && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile`
- Security group: add Custom TCP 8080, source = My IP only (Jenkins web page).

## 2. Install Jenkins (Amazon Linux 2023)
```
sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io-2023.key
sudo dnf install -y java-17-amazon-corretto jenkins
sudo systemctl enable --now jenkins
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```
Open http://<PUBLIC_IP>:8080, paste the password, choose "Install suggested plugins", create an admin user.

## 3. Let the jenkins user deploy
```
sudo chown -R jenkins:jenkins /usr/share/nginx/bookshelf
sudo npm install -g pm2          # skip if already installed
pm2 delete bookshelf-api; pm2 save   # run as ec2-user: Jenkins will own the backend process now
sudo su - jenkins -s /bin/bash -c "pm2 startup"   # run the sudo command it prints, if any
```
(Node, npm, git and nginx are already installed from DEPLOY steps.)

## 4. Create the job
1. Jenkins -> New Item -> name `book-shelf` -> **Pipeline** -> OK.
2. Pipeline -> Definition: **Pipeline script from SCM** -> SCM: Git.
3. Repository URL: https://github.com/Suchit-Aryal/Book-Repo.git (public repo needs no credentials).
4. Branch: `*/main`. Script Path: `Jenkinsfile`. Save.
5. Click **Build Now** once. After that, every push to main deploys itself.

## 5. If it fails
- `npm: command not found` -> run `which node npm` as ec2-user; install node system-wide with dnf (not nvm).
- `Permission denied` on /usr/share/nginx/bookshelf -> redo the chown in step 3.
- `pm2: command not found` -> `sudo npm install -g pm2`.
- Lint stage red -> fix the code, the pipeline is doing its job.
