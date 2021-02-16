const forgotPasswordTemplate = require('./email-templates/forgot-password');

module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  cron :{
    enabled: true
  },
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'a42d044f11ce707cd7faf6bad1f38e00'),
    },
    provider: 'sendgrid',
    providerOptions: {
      apiKey: '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',
    },
    forgotPassword: {
      from: 'mankuyanars@gmail.com',
      replyTo: 'mankuyanars@gmail.com',
      emailTemplate: forgotPasswordTemplate,
    },
  },
});

