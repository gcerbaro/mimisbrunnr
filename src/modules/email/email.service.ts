import { Injectable } from "@nestjs/common";
import nodemailer from "nodemailer";

//mockup
    const mailOptions = {
        from: process.env.MAIL_DOMAIN,
        to: process.env.MAIL_DOMAIN,
        subject: "Testing",
        text: "Lorem ipsum"
    };

@Injectable()
export class EmailService{
    constructor(){}
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            type: 'OAuth2',
            user: process.env.MAIL_USERNAME,
            pass:process.env.MAIL_PASSWORD,
            clientId: process.env.CLIENTID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            refreshToken: process.env.OAUTH_REFRESH_TOKEN
        }
    });

    async send(mailOptions){
        this.transporter.sendMail(mailOptions, function(err, data){
            if(err){
                console.log(`Err: ${err}`);
            } else{
                console.log("Email sent succesfully");
            }
        });
    }
}