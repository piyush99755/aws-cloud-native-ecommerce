import React, { useState } from "react";
import Stepper from "react-stepper-horizontal";
import CartStep from "./steps/CartStep";
import ShippingStep from "./steps/ShippingStep";
import PaymentStep from "./steps/PaymentStep";
import ConfirmationStep from "./steps/ConfirmationStep";

function Checkout({ guestMode }) {
  const [step, setStep] = useState(0);
  const [shippingData, setShippingData] = useState({
    name: "",
    address: "",
    city: "",
    zip: "",
  });
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const steps = [
    { title: "Cart" },
    { title: "Shipping" },
    { title: "Payment" },
    { title: "Confirmation" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Stepper steps={steps} activeStep={step} />

      <div className="mt-6">
        {step === 0 && <CartStep nextStep={nextStep} />}
        {step === 1 && (
          <ShippingStep
            nextStep={nextStep}
            prevStep={prevStep}
            shippingData={shippingData}
            setShippingData={setShippingData}
          />
        )}
        {step === 2 && (
          <PaymentStep
            nextStep={nextStep}
            prevStep={prevStep}
            guestMode={guestMode}
            shippingData={shippingData}
            setPaymentSuccess={setPaymentSuccess}
          />
        )}
        {step === 3 && <ConfirmationStep paymentSuccess={paymentSuccess} />}
      </div>
    </div>
  );
}

export default Checkout;
