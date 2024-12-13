import admin from "firebase-admin";

// Make sure to replace 'serviceAccount' with the actual path to your Firebase service account JSON key
const serviceAccount = {
    type: "service_account",
    project_id: "fir-app-2e08c",
    private_key_id: "a218375f31e15534be0d142d4dca8ed9e6ef9226",
    private_key:
        "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCsGPnxF73auaii\np4e9Rer0iAVm/ZtcQ7vjX4jTffJY96GbbybVC/Yz0aIHItxFrTZBUqqlDi8znbZI\nMAsGk6voH4UHIia14uYVCjFdQqx1cBM8VFOzf4U0IiWozVb4ntVu+4OtJEciKM4T\nWW51xyQ/J/K/pmiFyvt9yYwe9/MDDUWJX05zIT+osnmOu3bDejCJo9CUK2a1WXdn\nAwHE655k8sBRMZo4zrnBGjwNyYfF5dcFglkOSbUVOD3BfIz3ijGYYQ7Ln3CgJEUu\nfFGL2aVFbNwgleWybC4pfx3+PYvMnPDq98PchXzfdpB2aCxX3fwDuixBbK25py4x\nchYNJSMfAgMBAAECggEAAV9cSZqcM60HYJoKxcJTqApDAMSaWJdcXZPazipS+c1V\nHJ2Q/GH8CgMXUmHqH87Mf/jeI4guwtqfJDQ94kTgj26w65L6JrkzMeJtl7DQb0oA\nMpr5j+o/GwtVVuNMWO9AryySVZnUd2ab6MuYde1V/Kr05Ke5wwIQv2Vmw1h24loA\nDrOqptrf/qjXXSMO9529IRZdl0wAPbXVD+yCjYifHeOs9e0aTemcpNH8Y4J/FAkX\nmB0Sl+vWcbguysx5uzhJTD+TY2WG8GpFaG4qTpKbCrc/brs5mbqPWwOhEQNJybl3\nd7/NiZ7w8RatVQGftUOxL39mGD0USpOHWnyFjKyeAQKBgQDexu+f309GY9cKXe7v\nHRGcoKEvrpeeps9j8R/s66dtYxA189prNUNIrjOPBGZTQRwZ03LCZDrnJ5ag8SsK\nG7AAZichS5RcW04cvfn3ulWmriesrGrAqo4hBIzsSVF/ZphKYq+6K6WNyfUaV3+G\ntjUZctD2DHlywt41zt5bg7imuQKBgQDFwzl3ypUmO04I/0k2qqJVypBWSV507tR5\nIYZwlRlsgyElAjUcjrARME6S1bBODdjw2ZIuVzwDXqFcqNchDH8pwCpuqBWwtJH/\n7sJQ95loZIQiE4UaxIYCk8+K3JXHVMAl79KCdoSOapciB+jzPLqfspV+OJ6505ud\n7b2ByasslwKBgCthneQJ/kv8wTFZnV+ez4EqnnjEjO3uGdCicc8XDKF2ev+mns/l\nrVaH5a5h8vMfaLN2w5ArKHU+9kwc6n6raZiKS/Bl4Vwiw5FBRV4CQQ+WNk+fu6IN\nFGRFmJOiq2YdumYx1XpxaWm0/C/G/iRjcu+jtiFTyIqae98Ki65SdjCxAoGAeGUj\npVQFfSL5nOydy9QRxBzvxjggcxu66ouIZx2+PpuOIBO59crAUZaRHz9MeBhiDC7I\nmcGt3XdM0TZQ0ePjvq0op/lYSx2DDMZ0MgqqsC0RbBVqISOnWgZWgXlNDe8Ak5fv\nFlHE3Vby71rVbM955iM4c4FQ0FyNDpZfmpYFyb0CgYB/PiCEPvPlkzgm33BX3r8V\nJJ1bWjdGmBePpdWOFtA1EgF4TlI/vmn4cPMN+xJAkRQvIxRPZsf7lcDxDkV4wGbV\nSHebLEDKRfclq34moP8Zq4MYYyGlAXx+nJlsOvC3lPxPKVAPySAYjBVnIerGDMOh\n2/6xRxShf/B0LD1TJ5YqKw==\n-----END PRIVATE KEY-----\n",
    client_email:
        "firebase-adminsdk-3y7za@fir-app-2e08c.iam.gserviceaccount.com",
    client_id: "115264796463747427341",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
        "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-3y7za%40fir-app-2e08c.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
};

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
} else {
    admin.app(); // If already initialized, use that app
}

export default admin;
