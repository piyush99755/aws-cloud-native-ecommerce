# 🛒 E-Commerce App

A full-stack e-commerce application built with **React**, **Node.js**, **PostgreSQL**, and **Stripe**, designed for cloud-native deployment on **AWS**.  
This project is part of my AWS portfolio to demonstrate cloud-native application design and deployment for cloud/software engineering roles.

---

## 🚀 Badges

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)  
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)  
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)  
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=flat&logo=stripe&logoColor=white)  
![AWS](https://img.shields.io/badge/AWS-232F3E?style=flat&logo=amazon-aws&logoColor=white)  

---

## 📑 Table of Contents

- [Features](#-features)  
- [Tech Stack](#-tech-stack)  
- [Architecture](#-architecture)  
- [Setup & Installation](#-setup--installation)  
- [Usage](#-usage)  
- [Roadmap](#-roadmap)  
- [Screenshots](#-screenshots)  
- [License](#-license)  

---

## ✅ Features

- Product listing with images, descriptions, and pricing  
- Shopping cart with add/remove items functionality  
- Secure user authentication & registration (AWS Cognito)  
- Checkout flow integrated with Stripe (sandbox/test mode)  
- Order management and history for users  
- Responsive design and polished UI with React Context for state management  
- Cloud-native deployment with AWS S3, CloudFront, and Elastic Beanstalk  
- Monitoring & notifications using AWS CloudWatch and SES  

---

## 🛠 Tech Stack

- **Frontend:** React, React Context, React Router  
- **Backend:** Node.js, Express.js REST APIs  
- **Database:** PostgreSQL (hosted on EC2)  
- **Authentication:** AWS Cognito, JWT  
- **Payments:** Stripe API (sandbox/test mode)  
- **Deployment:** AWS S3, CloudFront, Elastic Beanstalk, CodePipeline  
- **Monitoring & Notifications:** AWS CloudWatch, SES  

---

## 🏗 Architecture

**Frontend:** React app hosted on S3 + CloudFront  
**Backend:** Node.js + Express APIs deployed on Elastic Beanstalk  
**Database:** PostgreSQL hosted on EC2  
**Authentication:** AWS Cognito  
**Payments:** Stripe integration  
**Monitoring:** CloudWatch for logs, alarms for failures  
**Notifications:** Email via AWS SES  

```
Frontend (S3 + CloudFront)  →  Backend APIs (Elastic Beanstalk)  →  PostgreSQL (EC2)
```

---

## ⚙ Setup & Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ecommerce-app.git
cd ecommerce-app
```

2. Install dependencies:

```bash
npm install
```

3. Set environment variables in `.env`:

```env
REACT_APP_API_URL=<your-backend-api-url>
STRIPE_PUBLIC_KEY=<your-stripe-public-key>
COGNITO_USER_POOL_ID=<your-cognito-user-pool-id>
COGNITO_CLIENT_ID=<your-cognito-client-id>
```

4. Start the development server:

```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏃 Usage

- Browse products and add items to the cart  
- Register or sign in via Cognito (Google OAuth enabled)  
- Complete checkout using Stripe test cards  
- View order history in the Orders page  

---

## 🛣 Roadmap

- Enhance search, filter, and sorting for products  
- Add serverless endpoints using AWS Lambda + API Gateway  
- Implement MFA for Cognito authentication  
- Expand catalog & categories  
- Improve CI/CD pipeline with automated tests  

---

## 🖼 Screenshots

*(Add screenshots of your app here)*

---

## 📄 License

This project is licensed under the MIT License.

