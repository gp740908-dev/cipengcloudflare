import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail, processTemplate } from '@/lib/email'

// Initialize Supabase admin client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { templateName, recipientEmail, recipientName, variables } = body

        if (!templateName || !recipientEmail) {
            return NextResponse.json(
                { error: 'Template name and recipient email are required' },
                { status: 400 }
            )
        }

        // Fetch template from database
        const { data: template, error: templateError } = await supabase
            .from('email_templates')
            .select('*')
            .eq('name', templateName)
            .eq('is_active', true)
            .single()

        if (templateError || !template) {
            return NextResponse.json(
                { error: 'Email template not found or inactive' },
                { status: 404 }
            )
        }

        // Process template with variables
        const processedHtml = processTemplate(template.html_content, variables || {})
        const processedSubject = processTemplate(template.subject, variables || {})
        const processedText = template.text_content
            ? processTemplate(template.text_content, variables || {})
            : undefined

        // Send email
        const result = await sendEmail({
            to: recipientEmail,
            subject: processedSubject,
            html: processedHtml,
            text: processedText,
        })

        // Log the email
        await supabase.from('email_logs').insert({
            template_id: template.id,
            template_name: template.name,
            recipient_email: recipientEmail,
            recipient_name: recipientName,
            subject: processedSubject,
            status: result.success ? 'sent' : 'failed',
            resend_id: result.id,
            error_message: result.error,
            metadata: { variables },
            sent_at: result.success ? new Date().toISOString() : null,
        })

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || 'Failed to send email' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'Email sent successfully',
            id: result.id,
        })
    } catch (error: any) {
        console.error('Send email API error:', error)
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        )
    }
}
