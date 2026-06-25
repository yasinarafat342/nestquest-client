import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import { FiLock } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../api/axios.js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ bookingInfo }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const { data: paymentData } = useQuery({
    queryKey: ["payment-intent", bookingInfo.amount],
    queryFn: () => api.post("/payments/create-payment-intent", { amount: bookingInfo.amount }).then((r) => r.data),
    enabled: !!bookingInfo.amount,
  });

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !paymentData?.clientSecret) return;
    setProcessing(true);

    try {
      const { paymentIntent, error } = await stripe.confirmCardPayment(paymentData.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (error) {
        toast.error(error.message);
      } else if (paymentIntent.status === "succeeded") {
        // Create booking record
        await api.post("/bookings", {
          propertyId: bookingInfo.propertyId,
          moveInDate: bookingInfo.moveInDate,
          contactNumber: bookingInfo.contactNumber,
          additionalNotes: bookingInfo.additionalNotes,
          transactionId: paymentIntent.id,
        });
        toast.success("Payment successful! Booking confirmed.");
        navigate("/booking-success", { state: { transactionId: paymentIntent.id, amount: bookingInfo.amount } });
      }
    } catch (err) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
        <div className="border border-gray-200 rounded-lg p-4 focus-within:ring-2 focus-within:ring-primary-500 transition-all">
          <CardElement options={{
            style: { base: { fontSize: "16px", color: "#1e293b", "::placeholder": { color: "#94a3b8" } } }
          }} />
        </div>
        <p className="text-xs text-gray-400 mt-2">Test card: 4242 4242 4242 4242 | Any future date | Any CVC</p>
      </div>

      <button type="submit" disabled={!stripe || processing} className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60">
        <FiLock />
        {processing ? "Processing..." : `Pay ৳${bookingInfo.amount?.toLocaleString()}`}
      </button>
    </form>
  );
}

export default function PaymentPage() {
  const { bookingData } = useParams();
  const navigate = useNavigate();

  let bookingInfo = {};
  try {
    bookingInfo = JSON.parse(decodeURIComponent(bookingData));
  } catch {
    return <div className="text-center py-20">Invalid booking data</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-dark-900 mb-2">Secure Payment</h1>
          <p className="text-gray-500">Complete your booking for {bookingInfo.propertyTitle}</p>
        </div>

        <div className="card p-8">
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">Booking Summary</p>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Property</span>
                <span className="font-medium text-dark-900">{bookingInfo.propertyTitle}</span>
              </div>
              <div className="flex justify-between">
                <span>Move-in Date</span>
                <span className="font-medium">{bookingInfo.moveInDate}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                <span className="font-semibold">Total Amount</span>
                <span className="font-bold text-primary-600 text-lg">৳{bookingInfo.amount?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <Elements stripe={stripePromise}>
            <CheckoutForm bookingInfo={bookingInfo} />
          </Elements>

          <button onClick={() => navigate(-1)} className="w-full text-center text-sm text-gray-400 hover:text-gray-600 mt-4 transition-colors">
            ← Go back
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mt-4 text-gray-400 text-xs">
          <FiLock /> Secured by Stripe
        </div>
      </div>
    </div>
  );
}
