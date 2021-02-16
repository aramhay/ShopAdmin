const subject = `Reset password`;

const html = `<p>Hi <%= user.firstname %>2222</p>
<p>Sorry you lost your password. You can click here to reset it: <%= url %>44444</p>`;

const text = `Hi <%= user.firstname %>
Sorry you lost your password. You can click here to reset it: <%= url %>`;

module.exports = {
  subject,
  text,
  html,
};