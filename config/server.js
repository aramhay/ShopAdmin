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
      from: 'shop@dasparfum-beauty.de',
      replyTo: 'shop@dasparfum-beauty.de',
      emailTemplate: forgotPasswordTemplate,
    },
  },
});

