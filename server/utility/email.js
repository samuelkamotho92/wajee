const nodemailer = require('nodemailer');
const sendEmail = async(options)=>{
  console.log(options.email,options.message,options.subject,options.url)

const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "ba34cc6a3b11a4",
        pass: "85f146e5ac06a7"
    }
});
    const mailOptions = {
        from: 'wajee@gmail.com',
        to: options.email,
        subject: options.subject,
        text: options.message,
        html:
        `<a href=${options.url}>${options.message}</a>`
      };
      await transport.sendMail(mailOptions)
}
module.exports = sendEmail;
