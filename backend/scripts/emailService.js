import AWS from "aws-sdk";

AWS.config.update({ region: "us-east-1" }); // SES region
const ses = new AWS.SES({ apiVersion: "2010-12-01" });

/**
 * Sends order confirmation email via AWS SES.
 * Throws an error if sending fails.
 */
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
          `,
        },
      },
      Subject: { Data: "Your Order Confirmation" },
    },
    Source: "orders@piyushkumartadvi.link", // Must be verified in SES sandbox
  };

  try {
    const result = await ses.sendEmail(params).promise();

    // Debug: log full SES response
    console.log("SES response:", JSON.stringify(result, null, 2));

    return { success: true, messageId: result.MessageId };
  } catch (err) {
    console.error("Failed to send email:", err);
    throw new Error(`Email sending failed: ${err.message}`);
  }
};
