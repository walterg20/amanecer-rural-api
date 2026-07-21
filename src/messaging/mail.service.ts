import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name)
  private transporter: nodemailer.Transporter | null = null

  constructor(private readonly config: ConfigService) {
    const host = this.config.get<string>('SMTP_HOST')
    if (host) {
      this.transporter = nodemailer.createTransport({
        host,
        port: this.config.get<number>('SMTP_PORT', 587),
        secure: this.config.get<string>('SMTP_SECURE', 'false') === 'true',
        auth: {
          user: this.config.get<string>('SMTP_USER', ''),
          pass: this.config.get<string>('SMTP_PASS', ''),
        },
      })
    }
  }

  async sendEmail(to: string, subject: string, text: string, html?: string) {
    if (!this.transporter) {
      this.logger.log(`[MailService] SMTP not configured. Would send email to ${to}: ${subject}`)
      return
    }

    try {
      await this.transporter.sendMail({
        from: this.config.get<string>('SMTP_FROM', 'noreply@amanecerrural.com'),
        to,
        subject,
        text,
        html: html || text,
      })
      this.logger.log(`Email sent to ${to}: ${subject}`)
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error}`)
    }
  }

  async notifyNewMessage(toEmail: string, senderName: string, subject: string) {
    await this.sendEmail(
      toEmail,
      `Nuevo mensaje de ${senderName}: ${subject}`,
      `Has recibido un nuevo mensaje de ${senderName} con asunto: "${subject}".\n\nIngresá a tu panel para leerlo.`,
    )
  }

  async notifyStatusChange(toEmail: string, entityType: string, entityName: string, status: string) {
    await this.sendEmail(
      toEmail,
      `Estado actualizado: ${entityType} - ${entityName}`,
      `Tu ${entityType} "${entityName}" ha cambiado a estado: ${status}.\n\nIngresá a tu panel para más detalles.`,
    )
  }
}
