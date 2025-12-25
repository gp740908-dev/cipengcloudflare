import { Metadata } from 'next'
import LegalPageLayout, {
    LegalSection,
    LegalList,
    LegalContactCard,
    LegalHighlight
} from '@/components/LegalPageLayout'

export const metadata: Metadata = {
    title: 'Terms of Service - StayinUBUD',
    description: 'Terms and conditions for using StayinUBUD villa rental services. Read our service agreement carefully.',
}

export default function TermsPage() {
    return (
        <LegalPageLayout
            title="Terms of Service"
            subtitle="These terms govern your use of our services. Please read them carefully before making a booking."
            icon="terms"
            lastUpdated="December 2024"
        >
            <div className="space-y-12">
                <LegalSection number="1" title="Acceptance of Terms">
                    <p>
                        By accessing and using the StayinUBUD website and services, you accept and agree
                        to be bound by these Terms of Service. If you do not agree to these terms,
                        please do not use our services.
                    </p>
                    <LegalHighlight variant="info">
                        <p className="text-sm">
                            <strong>Important:</strong> These terms constitute a legally binding agreement
                            between you and StayinUBUD. We recommend reading this document in its entirety.
                        </p>
                    </LegalHighlight>
                </LegalSection>

                <LegalSection number="2" title="Description of Services">
                    <p>
                        StayinUBUD provides an online platform for booking luxury villa accommodations
                        in Ubud, Bali. We act as an intermediary between guests and villa owners,
                        facilitating reservations and providing premium concierge services.
                    </p>
                    <div className="mt-6 grid sm:grid-cols-2 gap-4">
                        <div className="p-5 bg-olive-50 border border-olive-100">
                            <p className="font-medium text-olive-900 mb-2">What We Provide</p>
                            <LegalList items={[
                                'Villa booking platform',
                                'Concierge services',
                                'Guest support',
                            ]} />
                        </div>
                        <div className="p-5 bg-gray-50 border border-gray-200">
                            <p className="font-medium text-gray-900 mb-2">Villa Services</p>
                            <LegalList items={[
                                'Accommodation',
                                'Amenities',
                                'Local experiences',
                            ]} />
                        </div>
                    </div>
                </LegalSection>

                <LegalSection number="3" title="User Responsibilities">
                    <p className="mb-4">As a user of our services, you agree to:</p>
                    <LegalList items={[
                        'Provide accurate and complete information when making bookings',
                        'Use our services only for lawful purposes',
                        'Respect the property and follow all villa rules and guidelines',
                        'Not engage in any fraudulent or deceptive activities',
                        'Be responsible for all activities under your account',
                        'Maintain the confidentiality of your account credentials',
                    ]} />
                </LegalSection>

                <LegalSection number="4" title="Booking and Reservations">
                    <p className="mb-4">
                        All bookings are subject to availability and confirmation. By making a reservation,
                        you agree to the following terms:
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 bg-gray-50">
                            <span className="w-8 h-8 bg-olive-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-medium">1</span>
                            <div>
                                <p className="font-medium text-gray-900">Payment</p>
                                <p className="text-sm text-gray-600">Pay all applicable fees and charges as per our payment terms</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-gray-50">
                            <span className="w-8 h-8 bg-olive-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-medium">2</span>
                            <div>
                                <p className="font-medium text-gray-900">Check-in/Check-out</p>
                                <p className="text-sm text-gray-600">Adhere to designated check-in and check-out times</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-gray-50">
                            <span className="w-8 h-8 bg-olive-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-medium">3</span>
                            <div>
                                <p className="font-medium text-gray-900">Guest Limits</p>
                                <p className="text-sm text-gray-600">Comply with the maximum guest occupancy for your villa</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-gray-50">
                            <span className="w-8 h-8 bg-olive-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-medium">4</span>
                            <div>
                                <p className="font-medium text-gray-900">Policies</p>
                                <p className="text-sm text-gray-600">Follow our cancellation and booking policies</p>
                            </div>
                        </div>
                    </div>
                </LegalSection>

                <LegalSection number="5" title="Pricing and Payment">
                    <LegalHighlight variant="success">
                        <div className="flex items-center gap-4">
                            <span className="font-display text-3xl text-olive-600">IDR</span>
                            <div>
                                <p className="font-medium">Indonesian Rupiah</p>
                                <p className="text-sm opacity-80">All prices are listed in IDR</p>
                            </div>
                        </div>
                    </LegalHighlight>
                    <p className="mt-4">
                        Prices may be subject to change without prior notice. Payment must be made in full
                        according to the payment terms specified at the time of booking. Additional fees
                        may apply for extra services, amenities, or special requests.
                    </p>
                </LegalSection>

                <LegalSection number="6" title="Intellectual Property">
                    <p>
                        All content on the StayinUBUD website, including but not limited to text, graphics,
                        logos, images, photographs, video content, and software, is the property of StayinUBUD
                        or its content suppliers and is protected by international intellectual property laws.
                    </p>
                    <p className="mt-4 text-sm text-gray-500">
                        You may not reproduce, distribute, modify, or create derivative works without our
                        express written permission.
                    </p>
                </LegalSection>

                <LegalSection number="7" title="Limitation of Liability">
                    <LegalHighlight variant="warning">
                        <p className="text-sm">
                            StayinUBUD shall not be liable for any indirect, incidental, special, consequential,
                            or punitive damages resulting from your use of our services. Our total liability
                            is limited to the amount paid for the booking in question.
                        </p>
                    </LegalHighlight>
                </LegalSection>

                <LegalSection number="8" title="Force Majeure">
                    <p>
                        We shall not be liable for any failure or delay in performing our obligations due
                        to circumstances beyond our reasonable control, including but not limited to:
                    </p>
                    <LegalList items={[
                        'Natural disasters, earthquakes, volcanic activity, or severe weather',
                        'Pandemics, epidemics, or public health emergencies',
                        'Government actions, travel restrictions, or regulatory changes',
                        'Civil unrest, terrorism, or acts of war',
                        'Infrastructure failures or utility outages',
                    ]} />
                </LegalSection>

                <LegalSection number="9" title="Governing Law">
                    <p>
                        These Terms of Service shall be governed by and construed in accordance with the
                        laws of the Republic of Indonesia. Any disputes arising from these terms shall be
                        subject to the exclusive jurisdiction of the courts of Bali, Indonesia.
                    </p>
                </LegalSection>

                <LegalSection number="10" title="Changes to Terms">
                    <p>
                        We reserve the right to modify these terms at any time. Changes will be effective
                        immediately upon posting on our website. Your continued use of our services after
                        any modifications constitutes your acceptance of the updated terms.
                    </p>
                    <p className="mt-4 text-sm text-gray-500">
                        We recommend reviewing these terms periodically to stay informed of any changes.
                    </p>
                </LegalSection>

                <LegalSection number="11" title="Contact Information">
                    <p className="mb-6">
                        For questions about these Terms of Service, please contact our legal team:
                    </p>
                    <LegalContactCard
                        title="Legal Department"
                        email="legal@stayinubud.com"
                        phone="+62 812 3456 7890"
                        address="Ubud, Bali, Indonesia"
                    />
                </LegalSection>
            </div>
        </LegalPageLayout>
    )
}
