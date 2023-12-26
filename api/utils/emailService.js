import nodemailer from 'nodemailer';

/*
1. Make new project in https://console.cloud.google.com/
2. Navigate to the new project
3. Go to the APIs and Services section
4. Go to the credentials section in the sidebar
5. Click Create Credentials
6. Select OAuth client ID from the drop down options
7. Configure Consent Screen
8. Select external for the user type and click create
9. Fill out the required fields for each step of the multi step form that appears
10. Once on the last step, click back to dashboard.
11. Do step 4,5,6 again. If the consent screen has been configured successfully, an application type dropdown should appear. Select Web application and fill in the required field(s). In the Authorized redirect URIs section, make sure to add https://developers.google.com/oauthplayground. Finally click Create.
12. Copy the client ID and client secret shown on the screen and save it for later
13. Go to  https://developers.google.com/oauthplayground. Once on the page, click the gear icon and check the Use your own OAuth credentials box. Then paste in the client id and secret from before.
14. On the left, under the Select & authorize APIs section, find Gmail API v1 and select https://mail.google.com/. Alternately, you can also type https://mail.google.com/ into the Input your own scopes field. Now click Authorize APIs.
15. Click allow so that Google OAuth 2.0 Playground has access to your Google account. You will get an error here, so go back to https://console.cloud.google.com/ > your project > api and services > OAuth consent screen > add test (because your app is in testing and not published) user (add your own email here) . After this you should not get the error after clicking Authorize APIs in https://console.cloud.google.com/
16. After being redirected back to the OAuth 2.0 Playground, click the Exchange authorization code for tokens button under the Exchange authorization code for tokens section.
17. Once the refresh and access token is generated, copy the refresh token and save it for later.
*/
import { google } from 'googleapis';

import dotenv from 'dotenv';
dotenv.config({
  path: '../.env'
});

const getTransporter = async () => {
  try {
    const OAuth2 = google.auth.OAuth2;

    const oauth2Client = new OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN
    });

    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject("Failed to create access token :(");
        }
        resolve(token);
      });
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL,
        accessToken,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN
      }
    });

    const mailOptions = {
      from: process.env.EMAIL,
    };

    return { transporter, mailOptions };

  } catch (error) {
    next(error);
  }
};

export default getTransporter;