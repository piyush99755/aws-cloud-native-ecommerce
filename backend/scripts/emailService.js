import AWS from 'aws-sdk';

AWS.config.update({ region: 'us-east-1' }); // SES region
const ses = new AWS.SES({ apiVersion: '2010-12-01' });

export const sendOrderConfirmation = async (toEmail, orderDetails) => {
  const params = {
    Destination: { ToAddresses: [toEmail] },
    Message: {
      Body: {
        Html: {
          Data: `
            <h1>Order Confirmation</h1>
            <p>Thank you for your purchase!</p>
            <p>Order ID: ${orderDetails.id}</p>
            <p>Total: $${orderDetails.total}</p>
          `
        }
      },
      Subject: { Data: "Your Order Confirmation" }
    },
    Source: "piyushtadvi4@gmail.com", // SES verified email
  };

  try {
    await ses.sendEmail(params).promise();
    console.log("Email sent to:", toEmail);
  } catch (err) {
    console.error("Failed to send email:", err);
  }
};
