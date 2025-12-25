import { Metadata } from 'next'
import LegalPageLayout, {
    LegalSection,
    LegalList,
    LegalContactCard,
    LegalHighlight
} from '@/components/LegalPageLayout'

export const metadata: Metadata = {
    title: 'Booking Policy - StayinUBUD',
    description: 'Understanding our booking, cancellation, and refund policies for a seamless villa rental experience.',
}

export default function BookingPolicyPage() {
    return (
        <LegalPageLayout
            title="Booking Policy"
            subtitle="Everything you need to know about reservations, payments, cancellations, and what to expect during your stay."
            icon="booking"
            lastUpdated="December 2024"
        >
            <div className="space-y-12">
                <LegalSection number="1" title="Reservation Process">
                    <p className="mb-4">
                        Booking your dream villa with StayinUBUD is simple and straightforward:
                    </p>
                    <div className="space-y-4">
                        {[
                            { step: '01', title: 'Browse & Select', desc: 'Choose your preferred villa and dates' },
                            { step: '02', title: 'Complete Details', desc: 'Fill in your booking form with guest information' },
                            { step: '03', title: 'Submit Request', desc: 'Send your reservation request to us' },
                            { step: '04', title: 'Confirmation', desc: 'Receive confirmation within 24 hours' },
                            { step: '05', title: 'Payment', desc: 'Complete payment as per payment terms' },
                        ].map((item) => (
                            <div key={item.step} className="flex items-start gap-4 p-4 bg-gray-50 hover:bg-olive-50 transition-colors">
                                <span className="font-display text-2xl text-olive-600">{item.step}</span>
                                <div>
                                    <p className="font-medium text-gray-900">{item.title}</p>
                                    <p className="text-sm text-gray-600">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </LegalSection>

                <LegalSection number="2" title="Payment Terms">
                    <LegalHighlight variant="success">
                        <p className="font-medium text-lg mb-4">Payment Schedule</p>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-olive-200 last:border-0">
                                <span>Deposit (upon confirmation)</span>
                                <span className="font-display text-xl">50%</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-olive-200 last:border-0">
                                <span>Balance (14 days before check-in)</span>
                                <span className="font-display text-xl">50%</span>
                            </div>
                            <div className="flex justify-between items-center py-2 text-sm opacity-80">
                                <span>Short notice bookings (within 14 days)</span>
                                <span className="font-medium">Full payment required</span>
                            </div>
                        </div>
                    </LegalHighlight>

                    <p className="mt-6 mb-4">
                        We accept multiple payment methods for your convenience:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['BCA', 'Mandiri', 'Visa/MC', 'PayPal'].map((method) => (
                            <div key={method} className="p-4 bg-gray-50 text-center">
                                <p className="font-medium text-gray-900">{method}</p>
                            </div>
                        ))}
                    </div>
                    <p className="mt-4 text-sm text-gray-500">
                        All transactions are processed securely with end-to-end encryption.
                    </p>
                </LegalSection>

                <LegalSection number="3" title="Cancellation Policy">
                    <p className="mb-6">
                        We understand plans can change. Our cancellation policy is designed to be fair
                        to both guests and villa owners:
                    </p>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-900 text-white">
                                    <th className="px-6 py-4 text-left text-sm font-medium">Cancellation Period</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium">Refund Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr className="hover:bg-olive-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-900 font-medium">More than 30 days before check-in</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-2 text-green-600 font-medium">
                                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                            Full refund (minus processing fees)
                                        </span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-olive-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-900 font-medium">15-30 days before check-in</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-2 text-amber-600 font-medium">
                                            <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                                            50% refund
                                        </span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-olive-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-900 font-medium">7-14 days before check-in</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-2 text-orange-600 font-medium">
                                            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                            25% refund
                                        </span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-olive-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-900 font-medium">Less than 7 days before check-in</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-2 text-red-600 font-medium">
                                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                            No refund
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p className="mt-6 text-sm text-gray-500">
                        Cancellations must be submitted in writing via email. The cancellation date is
                        determined by when we receive your written notice.
                    </p>
                </LegalSection>

                <LegalSection number="4" title="Check-in & Check-out">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-8 bg-gradient-to-br from-olive-50 to-olive-100 border border-olive-200">
                            <p className="text-xs tracking-[0.2em] uppercase text-olive-600 mb-2">Check-in</p>
                            <p className="font-display text-5xl text-olive-900 mb-3">2:00 PM</p>
                            <p className="text-sm text-olive-700">
                                Early check-in may be available upon request (subject to availability)
                            </p>
                        </div>
                        <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
                            <p className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-2">Check-out</p>
                            <p className="font-display text-5xl text-gray-900 mb-3">12:00 PM</p>
                            <p className="text-sm text-gray-600">
                                Late check-out may be available upon request (additional charges may apply)
                            </p>
                        </div>
                    </div>
                </LegalSection>

                <LegalSection number="5" title="Security Deposit">
                    <p>
                        A refundable security deposit may be required for certain properties. The deposit
                        amount varies by villa and will be communicated at the time of booking.
                    </p>
                    <LegalHighlight variant="info">
                        <p className="text-sm">
                            <strong>Refund Timeline:</strong> Security deposits are returned within 7 business days
                            after check-out, minus any deductions for damages or additional charges.
                        </p>
                    </LegalHighlight>
                </LegalSection>

                <LegalSection number="6" title="Modification Policy">
                    <p className="mb-4">
                        Booking modifications are subject to availability and may incur additional charges:
                    </p>
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 border-l-4 border-green-500">
                            <p className="font-medium text-gray-900">Date Changes</p>
                            <p className="text-sm text-gray-600">Free if requested 14+ days in advance</p>
                        </div>
                        <div className="p-4 bg-gray-50 border-l-4 border-amber-500">
                            <p className="font-medium text-gray-900">Villa Changes</p>
                            <p className="text-sm text-gray-600">Subject to availability and price difference</p>
                        </div>
                        <div className="p-4 bg-gray-50 border-l-4 border-blue-500">
                            <p className="font-medium text-gray-900">Guest Changes</p>
                            <p className="text-sm text-gray-600">Please notify us of any changes in guest names</p>
                        </div>
                    </div>
                </LegalSection>

                <LegalSection number="7" title="House Rules">
                    <p className="mb-4">All guests must adhere to villa house rules for a pleasant stay:</p>
                    <LegalList items={[
                        'No smoking inside the villa premises',
                        'No parties or events without prior written approval',
                        'Pets are not allowed unless specified in villa description',
                        'Quiet hours observed from 10:00 PM to 7:00 AM',
                        'Respect neighbors and local community customs',
                        'Report any damages or issues immediately to management',
                    ]} />
                </LegalSection>

                <LegalSection number="8" title="What's Included">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-8 bg-olive-50 border border-olive-100">
                            <p className="font-display text-xl text-olive-900 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Included
                            </p>
                            <ul className="space-y-3 text-olive-800">
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-olive-600 rounded-full"></span>
                                    Daily housekeeping
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-olive-600 rounded-full"></span>
                                    Welcome amenities
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-olive-600 rounded-full"></span>
                                    High-speed WiFi access
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-olive-600 rounded-full"></span>
                                    Pool & garden maintenance
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-olive-600 rounded-full"></span>
                                    24/7 concierge support
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-olive-600 rounded-full"></span>
                                    Airport transfer (select villas)
                                </li>
                            </ul>
                        </div>
                        <div className="p-8 bg-gray-50 border border-gray-200">
                            <p className="font-display text-xl text-gray-900 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Additional (Extra Charge)
                            </p>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                                    Private chef services
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                                    In-villa spa treatments
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                                    Extra guest fees
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                                    Special occasion setups
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                                    Curated excursions
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                                    Early check-in / late check-out
                                </li>
                            </ul>
                        </div>
                    </div>
                </LegalSection>

                <LegalSection number="9" title="Contact for Bookings">
                    <p className="mb-6">
                        Ready to book or have questions? Our reservations team is here to help:
                    </p>
                    <LegalContactCard
                        title="Reservations Team"
                        email="reservations@stayinubud.com"
                        phone="+62 812 3456 7890"
                        address="Ubud, Bali, Indonesia"
                        hours="Available: 9:00 AM - 9:00 PM (Bali Time, GMT+8)"
                    />
                </LegalSection>
            </div>
        </LegalPageLayout>
    )
}
