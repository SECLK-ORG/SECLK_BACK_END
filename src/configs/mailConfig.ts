export const mailConfig = {
    host: 'smtp.gmail.com',
    port: 587,
    debug: false,
    auth: {
      user: process.env.EMAIL||"seconsultantslk@gmail.com",
      pass: process.env.PASSWORD||"czkk qsds vzoh tmvw",
    },
   
  };
  