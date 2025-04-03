const Request = require("./request");


// Classe para operações de transação
class Mpesa {
    api_key = process.env.API_KEY_MPESA;
    public_key = process.env.PUBLIC_KEY_MPESA;
    ssl = process.env.SSL_MPESA;
    agent_id = process.env.AGENT_ID_MPESA;
    
    c2b = async (data) => {
        const url = "https://api.sandbox.vm.co.mz:18352/ipg/v1x/c2bPayment/singleStage/";
        const params = {
            input_Amount: data.value,
            input_TransactionReference: data.transaction_reference,
            input_CustomerMSISDN: data.client_number,
            input_ServiceProviderCode: this.agent_id,
            input_ThirdPartyReference: data.third_party_reference,
        };
        const request = await new Request(this.api_key, this.public_key, this.ssl);
        const respose = await request.post(url, params);
        return respose;
    };

    b2c = async (data) => {
        const url = "https://api.sandbox.vm.co.mz:18345/ipg/v1x/b2cPayment/";
        const params = {
            input_Amount: data.value,
            input_CustomerMSISDN: data.client_number,
            input_ServiceProviderCode: this.agent_id,
            input_TransactionReference: data.transaction_reference,
            input_ThirdPartyReference: data.third_party_reference,
        };
        const request = new Request(this.api_key, this.public_key, this.ssl);
        return await request.post(url, params);
    };

    b2b = async (data) => {
        const url = "https://api.sandbox.vm.co.mz:18349/ipg/v1x/b2bPayment/";
        const params = {
            input_PrimaryPartyCode: this.agent_id,
            input_ReceiverPartyCode: data.agent_receiver_id,
            input_Amount: data.value,
            input_TransactionReference: data.transaction_reference,
            input_ThirdPartyReference: data.third_party_reference,
        };
        const request = new Request(this.api_key, this.public_key, this.ssl);
        return await request.post(url, params);
    };

    reversal = async (data) => {
        const url = "https://api.sandbox.vm.co.mz:18354/ipg/v1x/reversal/";
        const params = {
            input_TransactionID: data.transaction_id,
            input_SecurityCredential: data.security_credential,
            input_InitiatorIdentifier: data.indicator_identifier,
            input_ThirdPartyReference: data.third_party_reference,
            input_ServiceProviderCode: this.agent_id,
            input_ReversalAmount: data.value,
        };
        const request = new Request(this.api_key, this.public_key, this.ssl);
        return await request.put(url, params);
    };

    status = async (data) => {
        const url = "https://api.sandbox.vm.co.mz:18353/ipg/v1x/queryTransactionStatus/";
        const params = {
            input_QueryReference: data.transaction_id,
            input_ThirdPartyReference: data.third_party_reference,
            input_ServiceProviderCode: this.agent_id,
        };
        const request = new Request(this.api_key, this.public_key, this.ssl);
        return await request.get(url, params);
    };

    customer_name = async (data) => {
        const url = "https://api.sandbox.vm.co.mz:19323/ipg/v1x/queryCustomerName/";
        const params = {
            input_CustomerMSISDN: data.client_number,
            input_ThirdPartyReference: data.third_party_reference,
            input_ServiceProviderCode: this.agent_id,
        };
        const request = new Request(this.api_key, this.public_key, this.ssl);
        return await request.get(url, params);
    };
}

module.exports = new Mpesa();
