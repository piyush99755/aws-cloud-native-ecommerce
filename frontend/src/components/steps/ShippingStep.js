import React from "react";

function ShippingStep({ nextStep, prevStep, shippingData, setShippingData }) {
  const handleChange = (e) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (!shippingData.name || !shippingData.address || !shippingData.city || !shippingData.zip) {
      alert("Please fill in all fields");
      return;
    }
    nextStep();
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>

      <input
        name="name"
        placeholder="Full Name"
        value={shippingData.name}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
      />
      <input
        name="address"
        placeholder="Address"
        value={shippingData.address}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
      />
      <input
        name="city"
        placeholder="City"
        value={shippingData.city}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
      />
      <input
        name="zip"
        placeholder="ZIP / Postal Code"
        value={shippingData.zip}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
      />

      <div className="flex justify-between mt-4">
        <button
          onClick={prevStep}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Next: Payment
        </button>
      </div>
    </div>
  );
}

export default ShippingStep;
