import * as env from 'env-var';

export type AWSConfig = {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
};

export type HubSpotConfig = {
  accessToken: string;
  emailIds: {
    confirmSignup: number;
    signupConfirmation: number;
  };
};

export type SlackConfig = {
  botToken: string;
  channels: {
    productOperations: string;
  };
};

export type SendgridConfig = {
  apiKey: string;
  emails: {
    emailQuery: {
      // templateId is the sendgrid template ID for this email
      templateId: string;

      // to is the email address to send the email to
      to: string;
    };
  };
};

export interface ConfigVariables {
  port: number;
  environment: string;
  clientUrl: string;
  aws: AWSConfig;
  cognito: {
    userPoolId: string;
    clientId: string;
  };
  segment: {
    environment: string;
    writeKey: string;
  };
  sendgrid: SendgridConfig;
  hubspot: HubSpotConfig;
  slack: SlackConfig;
}

export default (): ConfigVariables => {
  return {
    port: parseInt(process.env.PORT, 10) || 8080,
    environment: process.env.DD_ENV,
    clientUrl: process.env.CLIENT_URL,
    cognito: {
      userPoolId: process.env.COGNITO_USER_POOL_ID,
      clientId: process.env.COGNITO_CLIENT_ID,
    },
    segment: {
      environment: process.env.SEGMENT_ENV,
      writeKey: process.env.SEGMENT_WRITE_KEY,
    },
    sendgrid: {
      apiKey: 'DELETEME',
      emails: {
        emailQuery: {
          templateId: env
            .get('SENDGRID_QUERY_TEMPLATE_ID')
            .default('d-bba9ac6e38e2480095ae827b8d8b4844')
            .required()
            .asString(),
          to: env
            .get('SENDGRID_QUERY_TO_EMAIL')
            .default('support@triptech.com')
            .required()
            .asString(),
        },
      },
    },
    aws: {
      region: 'DELETEME',
      accessKeyId: 'DELTEME',
      secretAccessKey: 'DELETEME',
    },
    hubspot: {
      accessToken: 'DELETEME',
      emailIds: {
        confirmSignup: env
          .get('HUBSPOT_EMAIL_ID_CONFIRM_SIGNUP')
          .default(48941045981)
          .required()
          .asIntPositive(),
        signupConfirmation: env
          .get('HUBSPOT_EMAIL_ID_SIGNUP_CONFIRMATION')
          .default(48502931398)
          .required()
          .asIntPositive(),
      },
    },
    slack: {
      botToken: 'DELETEME',
      channels: {
        productOperations: 'DELETEME',
      },
    },
  };
};
