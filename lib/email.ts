import { Resend } from 'resend'

// Lazy initialization of Resend - only when needed
let resend: Resend | null = null

function getResend(): Resend {
    if (!resend) {
        const apiKey = process.env.RESEND_API_KEY
        if (!apiKey) {
            throw new Error('RESEND_API_KEY is not configured')
        }
        resend = new Resend(apiKey)
    }
    return resend
}

interface SendEmailOptions {
    to: string | string[]
    subject: string
    html: string
    text?: string
    from?: string
    replyTo?: string
}

interface SendEmailResult {
    success: boolean
    id?: string
    error?: string
}

/**
 * Send an email using Resend
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
    try {
        const resendClient = getResend()
        const { data, error } = await resendClient.emails.send({
            from: options.from || process.env.EMAIL_FROM || 'StayinUBUD <noreply@stayinubud.com>',
            to: Array.isArray(options.to) ? options.to : [options.to],
            subject: options.subject,
            html: options.html,
            text: options.text,
            replyTo: options.replyTo || process.env.EMAIL_REPLY_TO,
        })

        if (error) {
            console.error('Resend error:', error)
            return { success: false, error: error.message }
        }

        return { success: true, id: data?.id }
    } catch (error: any) {
        console.error('Send email error:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Replace template variables with actual values
 */
export function processTemplate(template: string, variables: Record<string, string>): string {
    let result = template

    for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`{{${key}}}`, 'g')
        result = result.replace(regex, value)
    }

    return result
}

/**
 * Send booking confirmation email
 */
export async function sendBookingConfirmation(data: {
    email: string
    guestName: string
    bookingId: string
    villaName: string
    checkIn: string
    checkOut: string
    guests: number
    totalPrice: string
    bookingUrl?: string
}): Promise<SendEmailResult> {
    const subject = `Booking Confirmed - ${data.villaName} | StayinUBUD`

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Georgia, serif; color: #1a1a1a; background: #f5f3ef; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: #4A5D23; padding: 40px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 28px; font-weight: normal; }
        .content { padding: 40px; }
        .booking-details { background: #f8f7f4; padding: 24px; margin: 24px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e5e5; }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { color: #666; }
        .detail-value { font-weight: 600; color: #1a1a1a; }
        .footer { background: #f5f3ef; padding: 30px; text-align: center; color: #666; font-size: 14px; }
        .btn { display: inline-block; padding: 16px 32px; background: #4A5D23; color: white; text-decoration: none; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Booking Confirmed</h1>
        </div>
        <div class="content">
            <p>Dear ${data.guestName},</p>
            <p>Thank you for choosing StayinUBUD. Your booking has been confirmed!</p>
            
            <div class="booking-details">
                <h3 style="margin-top:0; margin-bottom: 20px;">Booking Details</h3>
                <div class="detail-row">
                    <span class="detail-label">Booking ID</span>
                    <span class="detail-value">${data.bookingId}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Villa</span>
                    <span class="detail-value">${data.villaName}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Check-in</span>
                    <span class="detail-value">${data.checkIn}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Check-out</span>
                    <span class="detail-value">${data.checkOut}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Guests</span>
                    <span class="detail-value">${data.guests} guests</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Total</span>
                    <span class="detail-value">${data.totalPrice}</span>
                </div>
            </div>
            
            <p>If you have any questions, please don't hesitate to contact us.</p>
            
            ${data.bookingUrl ? `<a href="${data.bookingUrl}" class="btn">View Booking Details</a>` : ''}
        </div>
        <div class="footer">
            <p>StayinUBUD - Luxury Villa Rentals in Ubud, Bali</p>
            <p>&copy; ${new Date().getFullYear()} StayinUBUD. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`

    return sendEmail({
        to: data.email,
        subject,
        html,
        text: `Dear ${data.guestName},\n\nThank you for your booking at StayinUBUD!\n\nBooking ID: ${data.bookingId}\nVilla: ${data.villaName}\nCheck-in: ${data.checkIn}\nCheck-out: ${data.checkOut}\nGuests: ${data.guests}\nTotal: ${data.totalPrice}\n\nBest regards,\nStayinUBUD Team`,
    })
}

/**
 * Send booking cancellation email
 */
export async function sendBookingCancellation(data: {
    email: string
    guestName: string
    bookingId: string
    villaName: string
}): Promise<SendEmailResult> {
    const subject = `Booking Cancelled - ${data.bookingId} | StayinUBUD`

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Georgia, serif; color: #1a1a1a; background: #f5f3ef; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: #991b1b; padding: 40px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 28px; font-weight: normal; }
        .content { padding: 40px; }
        .footer { background: #f5f3ef; padding: 30px; text-align: center; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Booking Cancelled</h1>
        </div>
        <div class="content">
            <p>Dear ${data.guestName},</p>
            <p>Your booking (ID: <strong>${data.bookingId}</strong>) for <strong>${data.villaName}</strong> has been cancelled.</p>
            <p>If you did not request this cancellation or have any questions, please contact us immediately.</p>
            <p>We hope to welcome you to StayinUBUD in the future.</p>
        </div>
        <div class="footer">
            <p>StayinUBUD - Luxury Villa Rentals in Ubud, Bali</p>
            <p>&copy; ${new Date().getFullYear()} StayinUBUD. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`

    return sendEmail({
        to: data.email,
        subject,
        html,
        text: `Dear ${data.guestName},\n\nYour booking (ID: ${data.bookingId}) for ${data.villaName} has been cancelled.\n\nIf you did not request this cancellation, please contact us immediately.\n\nBest regards,\nStayinUBUD Team`,
    })
}
