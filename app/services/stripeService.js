import { confirmPayment } from "@stripe/stripe-react-native";
import { _axios } from "../helpers/axios";

const confirm3DSPayment = async (clientSecret, paymentMethodId, intentId) => {
    try {
        const { error, paymentIntent } = await confirmPayment(clientSecret, {
            paymentMethodType: "Card",
            paymentMethodData: { paymentMethodId },
        });

        // Log & call your backend depending on result
        if (error) {
            if (error.code === "Canceled") {
                return {intentId};
            }
        }

        return { paymentIntent };
    } catch (err) {
        console.error("3DS confirm exception:", err);
        throw err;
    }
};

const cancelPayment = async (paymentIntentId)=>{  
    return await _axios('post', 'v1/tenant/service/cancel-payment', {paymentIntentId});
}

export { cancelPayment, confirm3DSPayment };

