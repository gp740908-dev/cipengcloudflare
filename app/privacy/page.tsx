import { Metadata } from 'next'
import LegalPageLayout, {
    LegalSection,
    LegalList,
    LegalContactCard,
    LegalHighlight
} from '@/components/LegalPageLayout'

export const metadata: Metadata = {
    title: 'Privacy Policy - StayinUBUD',
    description: 'Our commitment to protecting your privacy and personal data. Learn how we collect, use, and safeguard your information.',
}

export default function PrivacyPolicyPage() {
    return (
        <LegalPageLayout
            title="Privacy Policy"
            subtitle="Your privacy matters to us. This policy explains how we handle your personal information with care and transparency."
            icon="privacy"
            lastUpdated="December 2024"
        >
            <div className="space-y-12">
                <LegalSection number="1" title="Introduction">
                    <p>
                        StayinUBUD ("we," "our," or "us") is committed to protecting your privacy.
                        This Privacy Policy explains how we collect, use, disclose, and safeguard
                        your information when you visit our website or use our villa rental services.
                    </p>
                    <p>
                        We believe in complete transparency about how we handle your data, and we
                        encourage you to read this policy carefully. By using our services, you
                        consent to the practices described in this document.
                    </p>
                </LegalSection>

                <LegalSection number="2" title="Information We Collect">
                    <p className="mb-4">We may collect information about you in various ways:</p>

                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 border-l-4 border-olive-600">
                            <p className="font-medium text-gray-900 mb-1">Personal Data</p>
                            <p className="text-sm">Name, email address, phone number, and billing information when you make a booking.</p>
                        </div>
                        <div className="p-4 bg-gray-50 border-l-4 border-olive-600">
                            <p className="font-medium text-gray-900 mb-1">Booking Information</p>
                            <p className="text-sm">Check-in/check-out dates, number of guests, special requests, and preferences.</p>
                        </div>
                        <div className="p-4 bg-gray-50 border-l-4 border-olive-600">
                            <p className="font-medium text-gray-900 mb-1">Usage Data</p>
                            <p className="text-sm">IP address, browser type, pages visited, and time spent on our site.</p>
                        </div>
                        <div className="p-4 bg-gray-50 border-l-4 border-olive-600">
                            <p className="font-medium text-gray-900 mb-1">Cookies & Tracking</p>
                            <p className="text-sm">We use cookies to enhance your browsing experience and analyze site traffic.</p>
                        </div>
                    </div>
                </LegalSection>

                <LegalSection number="3" title="How We Use Your Information">
                    <p className="mb-4">We use the information we collect to:</p>
                    <LegalList items={[
                        'Process and manage your villa bookings efficiently',
                        'Communicate with you about your reservation and stay',
                        'Send promotional offers and newsletters (with your consent)',
                        'Improve our website, services, and customer experience',
                        'Provide personalized recommendations based on your preferences',
                        'Comply with legal obligations and resolve disputes',
                    ]} />
                </LegalSection>

                <LegalSection number="4" title="Information Sharing">
                    <LegalHighlight variant="success">
                        <p className="font-medium mb-2">We Never Sell Your Data</p>
                        <p className="text-sm">
                            We do not sell, trade, or rent your personal information to third parties under any circumstances.
                        </p>
                    </LegalHighlight>

                    <p className="mt-4">
                        We may share your information only with trusted service providers who assist us
                        in operating our website, conducting our business, or servicing you, as long as
                        those parties agree to keep this information confidential.
                    </p>
                </LegalSection>

                <LegalSection number="5" title="Data Security">
                    <p>
                        We implement appropriate technical and organizational security measures to protect
                        your personal data against unauthorized access, alteration, disclosure, or destruction.
                    </p>
                    <div className="mt-6 grid sm:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-gray-50">
                            <p className="font-display text-2xl text-olive-600 mb-1">256-bit</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">SSL Encryption</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50">
                            <p className="font-display text-2xl text-olive-600 mb-1">PCI</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Compliant</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50">
                            <p className="font-display text-2xl text-olive-600 mb-1">24/7</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Monitoring</p>
                        </div>
                    </div>
                </LegalSection>

                <LegalSection number="6" title="Your Rights">
                    <p className="mb-4">As a data subject, you have the following rights:</p>
                    <LegalList items={[
                        'Access the personal data we hold about you',
                        'Request correction of inaccurate or incomplete data',
                        'Request deletion of your personal data',
                        'Opt-out of marketing communications at any time',
                        'Withdraw consent where processing is based on consent',
                        'Data portability - receive your data in a structured format',
                    ]} />
                </LegalSection>

                <LegalSection number="7" title="Cookies Policy">
                    <p>
                        We use cookies and similar tracking technologies to improve your experience on our website.
                        Cookies are small text files stored on your device that help us:
                    </p>
                    <LegalList items={[
                        'Remember your preferences and settings',
                        'Analyze how you use our website',
                        'Personalize content and advertisements',
                        'Improve website functionality and performance',
                    ]} />
                    <p className="mt-4 text-sm">
                        You can choose to disable cookies through your browser settings, but this may affect
                        some functionality of our site.
                    </p>
                </LegalSection>

                <LegalSection number="8" title="Contact Us">
                    <p className="mb-6">
                        If you have any questions about this Privacy Policy or our data practices,
                        please don't hesitate to contact us:
                    </p>
                    <LegalContactCard
                        title="Privacy Inquiries"
                        email="privacy@stayinubud.com"
                        phone="+62 812 3456 7890"
                        address="Ubud, Bali, Indonesia"
                    />
                </LegalSection>
            </div>
        </LegalPageLayout>
    )
}
