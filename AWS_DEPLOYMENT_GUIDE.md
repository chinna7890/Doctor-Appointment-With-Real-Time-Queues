# AWS Deployment Guide - Healthcare Appointment Management System

## Prerequisites

1. **AWS Account**: Create an AWS account if you don't have one
2. **AWS CLI**: Install and configure AWS CLI
3. **EB CLI**: Install Elastic Beanstalk CLI
4. **Node.js**: Ensure you have Node.js 18+ installed locally

## Method 1: AWS Elastic Beanstalk (Recommended)

### Step 1: Install EB CLI
```bash
pip install awsebcli --upgrade --user
```

### Step 2: Initialize Elastic Beanstalk
```bash
# Navigate to your project directory
cd your-healthcare-app

# Initialize EB application
eb init

# Follow the prompts:
# - Select region (e.g., us-east-1)
# - Choose "Create new application"
# - Application name: healthcare-appointment-system
# - Platform: Node.js
# - Platform version: Node.js 18 running on 64bit Amazon Linux 2
# - Do not use CodeCommit: No
# - Setup SSH: Yes (recommended)
```

### Step 3: Create Environment
```bash
# Create production environment
eb create production

# This will:
# - Create an EC2 instance
# - Set up load balancer
# - Configure auto-scaling
# - Deploy your application
```

### Step 4: Configure Environment Variables
```bash
# Set production environment variables
eb setenv NODE_ENV=production
eb setenv JWT_SECRET=your-super-secure-jwt-secret-key
eb setenv PORT=8080
```

### Step 5: Deploy Updates
```bash
# Deploy any future updates
eb deploy
```

### Step 6: Open Your Application
```bash
# Open the deployed application in browser
eb open
```

## Method 2: AWS EC2 with Manual Setup

### Step 1: Launch EC2 Instance
1. Go to AWS EC2 Console
2. Click "Launch Instance"
3. Choose "Amazon Linux 2 AMI"
4. Select t3.micro (free tier eligible)
5. Configure Security Group:
   - SSH (port 22) - Your IP
   - HTTP (port 80) - Anywhere
   - HTTPS (port 443) - Anywhere
   - Custom TCP (port 8080) - Anywhere
6. Launch with your key pair

### Step 2: Connect to EC2
```bash
ssh -i your-key.pem ec2-user@your-ec2-public-ip
```

### Step 3: Install Dependencies
```bash
# Update system
sudo yum update -y

# Install Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Git
sudo yum install -y git
```

### Step 4: Deploy Application
```bash
# Clone your repository (or upload files)
git clone your-repository-url
cd healthcare-appointment-system

# Install dependencies
npm install

# Set environment variables
echo "NODE_ENV=production" > .env
echo "JWT_SECRET=your-super-secure-jwt-secret" >> .env
echo "PORT=8080" >> .env

# Start application with PM2
pm2 start server.js --name healthcare-app
pm2 startup
pm2 save
```

### Step 5: Setup Nginx (Optional)
```bash
# Install Nginx
sudo yum install -y nginx

# Configure Nginx
sudo nano /etc/nginx/nginx.conf
```

Add this server block:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Method 3: AWS App Runner

### Step 1: Create apprunner.yaml
```yaml
version: 1.0
runtime: nodejs18
build:
  commands:
    build:
      - npm install
run:
  runtime-version: 18
  command: npm start
  network:
    port: 8080
    env: PORT
  env:
    - name: NODE_ENV
      value: production
```

### Step 2: Deploy via Console
1. Go to AWS App Runner Console
2. Create service
3. Connect to your GitHub repository
4. Configure build settings
5. Deploy

## Database Considerations

### For Production (Recommended):
Replace SQLite with AWS RDS:

1. **Create RDS Instance**:
   - Engine: PostgreSQL or MySQL
   - Instance class: db.t3.micro (free tier)
   - Enable public access for development

2. **Update Database Connection**:
```javascript
// Replace SQLite with PostgreSQL/MySQL
const { Pool } = require('pg'); // or mysql2

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});
```

## Security Best Practices

1. **Environment Variables**: Never commit .env files
2. **JWT Secret**: Use a strong, unique secret key
3. **HTTPS**: Enable SSL/TLS certificates
4. **Database**: Use RDS with proper security groups
5. **IAM**: Use least privilege access policies

## Monitoring and Logging

1. **CloudWatch**: Monitor application logs and metrics
2. **Health Checks**: Configure health check endpoints
3. **Alerts**: Set up CloudWatch alarms for errors

## Cost Optimization

1. **Free Tier**: Use t3.micro instances
2. **Auto Scaling**: Configure based on demand
3. **Reserved Instances**: For long-term deployments
4. **Spot Instances**: For development environments

## Troubleshooting

### Common Issues:
1. **Port Issues**: Ensure PORT environment variable is set to 8080
2. **Database Path**: SQLite file permissions in production
3. **Memory**: Monitor memory usage on t3.micro instances
4. **Logs**: Check application logs in CloudWatch

### Useful Commands:
```bash
# Check EB logs
eb logs

# SSH into EB instance
eb ssh

# Check application status
eb status

# View environment info
eb config
```

## Domain and SSL

### Custom Domain:
1. Purchase domain in Route 53
2. Create hosted zone
3. Configure CNAME record pointing to EB environment
4. Request SSL certificate in Certificate Manager
5. Configure HTTPS listener in load balancer

Your healthcare appointment management system is now ready for AWS deployment! 🏥