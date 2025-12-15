import { MailtrapClient } from "mailtrap";


const mailtrap = new MailtrapClient({
  token: process.env.MAILTRAP_API_TOKEN!,
});