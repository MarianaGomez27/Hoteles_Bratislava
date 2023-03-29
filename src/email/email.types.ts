export class Email {
  to: string;
  from: string;
  templateId: string;
  subject: string;
  templateData: Record<string, any>;
}
