const crypto = require('crypto');
const { default: axios } = require('axios');
const AppError = require('../../../utils/AppError.util');

const momoPayment = async (order) => {
    try {
        let accessKey = 'F8BBA842ECF85';
        let secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
        let orderInfo = 'pay with MoMo';
        let partnerCode = 'MOMO';
        let redirectUrl = 'http://localhost:5002/api/v1/payment/payment-callback';
        let ipnUrl = `http://localhost:5002/api/v1/payment/payment-callback`;
        let requestType = "payWithMethod";
        let amount = order.total.toString();
        let orderId = order._id.toString();
        let requestId = orderId;
        let extraData = '';
        let orderGroupId = '';
        let autoCapture = true;
        let lang = 'en';

        //before sign HMAC SHA256 with format
        //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
        let rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
        //puts raw signature
        console.log("--------------------RAW SIGNATURE----------------")
        console.log(rawSignature)
        //signature
        let signature = crypto.createHmac('sha256', secretKey) // TODO: watch more about crypto, axios
            .update(rawSignature)
            .digest('hex');
        console.log("--------------------SIGNATURE----------------")
        console.log(signature)

        //json object send to MoMo endpoint
        const requestBody = {
            partnerCode: partnerCode,
            partnerName: "Test",
            storeId: "MomoTestStore",
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            lang: lang,
            requestType: requestType,
            autoCapture: autoCapture,
            extraData: extraData,
            orderGroupId: orderGroupId,
            signature: signature
        };

        //Send the request and get the response
        const options = {
            method: 'POST',
            url: 'https://test-payment.momo.vn/v2/gateway/api/create',
            headers: {
                'Content-Type': 'application/json',
            },
            data: requestBody
        }

        let result = await axios(options);
        // Handle callback whether the transaction is success or not

        return result.data;
    } catch (error) {
        console.log(error);
        throw new AppError(error.message, 500)
    }
}

module.exports = momoPayment;
