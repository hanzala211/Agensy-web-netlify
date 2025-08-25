import { CommonLink } from "@agensy/components";
import { ICONS, ROUTES } from "@agensy/constants";

export const PrivacyAndPolicy = () => {
  return (
    <div className="h-screen bg-gray-50 overflow-y-auto">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <div className="mb-6">
          <CommonLink
            to={`${ROUTES.auth}/${ROUTES.register}`}
            className="text-blue-600 flex items-center gap-2 text-sm"
          >
            <ICONS.leftArrow className="w-4 h-4" /> Back
          </CommonLink>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          PRIVACY POLICY
        </h1>

        {/* Dates */}
        <div className="text-gray-500 mb-8">
          <p>
            Effective Date: <span className="font-bold">08/25/2025</span>
          </p>
          <p>
            Last Updated: <span className="font-bold">08/25/2025</span>
          </p>
        </div>

        {/* Privacy Policy Content */}
        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <section className="mb-8">
            <p className="text-gray-700">
              Agensy LLC ("Agensy," "we," "us," or "our") is committed to
              protecting the privacy and security of your personal information
              and health information. This Privacy Policy describes how we
              collect, use, disclose, and safeguard information through our
              senior care management platform and related services
              (collectively, the "Services").
            </p>
          </section>

          {/* Section 1 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. SCOPE AND CONSENT
            </h2>
            <p className="text-gray-700 mb-4">
              This Privacy Policy applies to all users of our Services,
              including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
              <li>Primary account holders (family members managing care)</li>
              <li>Care recipients (seniors receiving care)</li>
              <li>Authorized family members and caregivers</li>
              <li>Healthcare providers accessing the platform</li>
              <li>Visitors to our website</li>
            </ul>
            <p className="text-gray-700 mt-4">
              By accessing or using our Services, you acknowledge that you have
              read, understood, and agree to be bound by this Privacy Policy and
              our Terms of Use. If you do not agree, you must not access or use
              our Services.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. INFORMATION WE COLLECT
            </h2>

            {/* Subsection 2.1 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                2.1 Information You Provide Directly
              </h3>

              <div className="mb-4">
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  Account Information:
                </h4>
                <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                  <li>Name, email address, phone number</li>
                  <li>Username and password</li>
                  <li>Billing and payment information</li>
                  <li>Subscription details</li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  Care Recipient Information:
                </h4>
                <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                  <li>Full name, date of birth, gender</li>
                  <li>
                    Social Security Number (when required for healthcare
                    services)
                  </li>
                  <li>Contact information and residential address</li>
                  <li>Emergency contact information</li>
                  <li>
                    Insurance information (Medicare, Medicaid, supplemental
                    insurance)
                  </li>
                  <li>Power of attorney and healthcare proxy documentation</li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  Health Information (Protected Health Information under HIPAA):
                </h4>
                <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                  <li>Medical history and diagnoses</li>
                  <li>Medications and treatment plans</li>
                  <li>Laboratory results and imaging reports</li>
                  <li>Physician notes and care plans</li>
                  <li>Allergies and dietary restrictions</li>
                  <li>Cognitive assessments and mental health information</li>
                  <li>Activities of daily living (ADL) assessments</li>
                  <li>Care provider information</li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  Care Management Information:
                </h4>
                <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                  <li>Appointment schedules and notes</li>
                  <li>Care plans and assessments</li>
                  <li>Caregiver notes and observations</li>
                  <li>Family communications about care</li>
                  <li>
                    Document uploads (medical records, legal documents,
                    insurance cards)
                  </li>
                </ul>
              </div>
            </div>

            {/* Subsection 2.2 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                2.2 Information Collected Automatically
              </h3>

              <div className="mb-4">
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  Usage Information:
                </h4>
                <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                  <li>Log data (IP address, browser type, operating system)</li>
                  <li>Device information (device ID, model, manufacturer)</li>
                  <li>Pages viewed and features used</li>
                  <li>Date and time stamps of activities</li>
                  <li>Referring and exit pages</li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  Cookies and Tracking Technologies:
                </h4>
                <p className="text-gray-700 mb-2">
                  We use cookies, web beacons, and similar technologies to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                  <li>Maintain your session and authentication</li>
                  <li>Remember your preferences</li>
                  <li>Analyze platform usage and performance</li>
                  <li>Ensure security and prevent fraud</li>
                </ul>
              </div>
            </div>

            {/* Subsection 2.3 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                2.3 Information from Third Parties
              </h3>
              <p className="text-gray-700 mb-3">
                We may receive information from:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>Healthcare providers (with appropriate authorization)</li>
                <li>Insurance companies (for coverage verification)</li>
                <li>Pharmacies (for medication management)</li>
                <li>
                  Other healthcare platforms (when you authorize data sharing)
                </li>
                <li>Payment processors (transaction confirmations)</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. HOW WE USE YOUR INFORMATION
            </h2>

            {/* Subsection 3.1 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                3.1 Providing and Improving Services
              </h3>
              <p className="text-gray-700 mb-3">We use your information to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>Create and manage user accounts</li>
                <li>Facilitate care coordination among authorized users</li>
                <li>Schedule and manage appointments</li>
                <li>Store and organize healthcare documents</li>
                <li>Enable secure messaging between authorized parties</li>
                <li>Process payments and manage subscriptions</li>
                <li>Provide customer support</li>
                <li>Improve and develop new features</li>
              </ul>
            </div>

            {/* Subsection 3.2 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                3.2 Healthcare Operations
              </h3>
              <p className="text-gray-700 mb-3">
                Consistent with HIPAA, we use health information for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>Treatment activities and care coordination</li>
                <li>Quality assessment and improvement activities</li>
                <li>Case management and care planning</li>
                <li>
                  Reviewing competence and qualifications of healthcare
                  professionals
                </li>
                <li>Conducting training programs</li>
                <li>Accreditation, certification, and licensing activities</li>
              </ul>
            </div>

            {/* Subsection 3.3 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                3.3 Communications
              </h3>
              <p className="text-gray-700">
                [Content for this section will be added as you provide more
                images]
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. HOW WE SHARE YOUR INFORMATION
            </h2>

            {/* Subsection 4.1 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                4.1 With Your Consent
              </h3>
              <p className="text-gray-700 mb-3">
                We share information with your explicit consent, including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>
                  Authorized <strong>family</strong> members and caregivers you
                  designate
                </li>
                <li>
                  <strong>Healthcare</strong> providers you authorize
                </li>
                <li>Third-party services you choose to connect</li>
              </ul>
            </div>

            {/* Subsection 4.2 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                4.2 For Treatment and Healthcare Operations
              </h3>
              <p className="text-gray-700 mb-3">
                We may share health information without{" "}
                <strong>additional</strong> consent for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>
                  Coordinating care with <strong>healthcare</strong> providers{" "}
                  <strong>involved</strong> in treatment
                </li>
                <li>
                  Emergency <strong>medical</strong> situations
                </li>
                <li>
                  <strong>Healthcare</strong> operations as permitted by HIPAA
                </li>
                <li>
                  Public health activities required by <strong>law</strong>
                </li>
              </ul>
            </div>

            {/* Subsection 4.3 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                4.3 Service Providers
              </h3>
              <p className="text-gray-700 mb-3">
                We work with trusted third-party service providers who assist us
                in operating our <strong>platform</strong>:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>
                  <strong>Cloud</strong> hosting providers (AWS)
                </li>
                <li>Payment processors (Stripe)</li>
                <li>Email service providers</li>
                <li>Analytics providers</li>
                <li>Customer support tools</li>
              </ul>
              <p className="text-gray-700 mt-3">
                All service providers are required to sign Business Associate
                Agreements (BAAs) when handling Protected Health Information and
                are contractually obligated to protect your information.
              </p>
            </div>

            {/* Subsection 4.4 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                4.4 Legal Requirements
              </h3>
              <p className="text-gray-700 mb-3">
                We may disclose information as required by <strong>law</strong>:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>
                  To comply with <strong>legal</strong> processes and government
                  requests
                </li>
                <li>
                  To report suspected abuse, <strong>neglect</strong>, or{" "}
                  <strong>exploitation</strong> of <strong>vulnerable</strong>{" "}
                  adults
                </li>
                <li>
                  For public <strong>health</strong> activities and{" "}
                  <strong>health</strong> oversight activities
                </li>
                <li>
                  To avert serious threats to <strong>health</strong> or safety
                </li>
                <li>
                  For workers' compensation <strong>claims</strong>
                </li>
              </ul>
            </div>

            {/* Subsection 4.5 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                4.5 Business Transfers
              </h3>
              <p className="text-gray-700">
                If Agensy is involved in a merger, acquisition, or asset sale,
                your information may be transferred. We will provide notice
                before your information is transferred and becomes subject to a
                different privacy policy.
              </p>
            </div>

            {/* Subsection 4.6 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                4.6 Aggregated and De-identified Information
              </h3>
              <p className="text-gray-700">
                We may share aggregated or de-identified information that cannot
                reasonably be used to identify you for research, analysis, and
                business purposes.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. DATA RETENTION
            </h2>
            <p className="text-gray-700 mb-3">
              We retain your information for as <strong>long</strong> as
              necessary to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
              <li>Provide our Services to you</li>
              <li>
                Comply with <strong>legal</strong> obligations
              </li>
              <li>Resolve disputes and enforce agreements</li>
              <li>Maintain business records</li>
            </ul>
            <p className="text-gray-700 mt-3">
              Upon account termination, you have 30 days to export your data.
              After this period, we will securely delete or de-identify your
              information, except as required for legal compliance.
            </p>
          </section>

          {/* Section 6 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. DATA SECURITY
            </h2>

            {/* Subsection 6.1 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                6.1 Security Measures
              </h3>
              <p className="text-gray-700 mb-3">
                We implement administrative, physical, and technical safeguards
                to protect your information:
              </p>

              <div className="mb-4">
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  Technical Safeguards:
                </h4>
                <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                  <li>
                    Encryption of data in transit (TLS 1.2 or higher) and at
                    rest (AES-256)
                  </li>
                  <li>Multi-factor authentication options</li>
                  <li>Regular security assessments and penetration testing</li>
                  <li>Access controls and audit logging</li>
                  <li>Automatic session timeouts</li>
                  <li>Regular security updates and patches</li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  Administrative Safeguards:
                </h4>
                <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                  <li>Background checks for employees with data access</li>
                  <li>Regular security training for staff</li>
                  <li>
                    Business Associate Agreements with all vendors handling PHI
                  </li>
                  <li>Incident response procedures</li>
                  <li>Minimum necessary access policies</li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  Physical Safeguards:
                </h4>
                <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                  <li>Secure data center facilities</li>
                  <li>Restricted facility access</li>
                  <li>Environmental controls and monitoring</li>
                </ul>
              </div>
            </div>

            {/* Subsection 6.2 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                6.2 Data Breach Notification
              </h3>
              <p className="text-gray-700">
                In the event of a breach affecting your information, we will:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>Notify you as required by applicable law</li>
                <li>Report to relevant authorities as required</li>
                <li>
                  Take immediate steps to contain and remediate the breach
                </li>
                <li>Provide guidance on protective measures you can take</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. YOUR RIGHTS AND CHOICES
            </h2>

            {/* Subsection 7.1 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                7.1 HIPAA Rights
              </h3>
              <p className="text-gray-700 mb-3">
                Under HIPAA, you have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>
                  <strong>Access</strong>: Request copies of your health
                  information
                </li>
                <li>
                  <strong>Amendment</strong>: Request corrections to your health
                  information
                </li>
                <li>
                  <strong>Accounting</strong>: Receive a list of certain
                  disclosures of your health information
                </li>
                <li>
                  <strong>Restriction</strong>: Request limitations on uses and
                  disclosures
                </li>
                <li>
                  <strong>Confidential Communications</strong>: Request
                  communications by alternative means
                </li>
                <li>
                  <strong>Notice</strong>: Receive a copy of our Notice of
                  Privacy Practices
                </li>
              </ul>
            </div>

            {/* Subsection 7.2 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                7.2 California Privacy Rights (CCPA)
              </h3>
              <p className="text-gray-700 mb-3">
                California residents have additional rights:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>
                  <strong>Know</strong>: What personal information we collect,
                  use, and share
                </li>
                <li>
                  <strong>Access</strong>: Receive copies of your personal
                  information
                </li>
                <li>
                  <strong>Delete</strong>: Request deletion of your personal
                  information (with exceptions)
                </li>
                <li>
                  <strong>Opt-Out</strong>: Opt-out of the sale of personal
                  information (we do not <strong>sell</strong> personal
                  information)
                </li>
                <li>
                  <strong>Non-Discrimination</strong>: Equal service{" "}
                  <strong>regardless</strong> of exercising privacy rights
                </li>
              </ul>
              <p className="text-gray-700 mt-3">
                To exercise these rights, contact us at{" "}
                <span className="underline">privacy@agensy.com</span> or call{" "}
                <span className="underline">1-800-XXX-XXXX</span>.
              </p>
            </div>

            {/* Subsection 7.3 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                7.3 Data Portability
              </h3>
              <p className="text-gray-700 mb-3">
                You may export your information at any time through your account
                settings in the <strong>following</strong> formats:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>
                  <strong>Medical records</strong>: C-CDA (XML) or PDF
                </li>
                <li>
                  <strong>Structured data</strong>: CSV or JSON
                </li>
                <li>
                  <strong>Documents</strong>: Original <strong>uploaded</strong>{" "}
                  formats
                </li>
              </ul>
            </div>

            {/* Subsection 7.4 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                7.4 Marketing Communications
              </h3>
              <p className="text-gray-700 mb-3">
                You may opt-out of marketing communications by:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>Clicking "unsubscribe" in any marketing email</li>
                <li>Updating your account preferences</li>
                <li>
                  Contacting us at{" "}
                  <span className="underline">support@agensy.com</span>
                </li>
              </ul>
              <p className="text-gray-700 mt-3">
                Note: You cannot opt-out of transactional communications
                necessary for your care or account.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. CHILDREN'S PRIVACY
            </h2>
            <p className="text-gray-700">
              Our Services are not intended for individuals under 18 years of
              age unless they are care recipients with authorized adult account
              management. We do not knowingly collect information from children
              under 13. If we learn we have collected information from a child
              under 13 without parental consent, we will delete that
              information.
            </p>
          </section>

          {/* Section 9 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. INTERNATIONAL DATA TRANSFERS
            </h2>
            <p className="text-gray-700">
              Our Services are operated in the United States. If you access our
              Services from outside the United States, your information will be
              transferred to and processed in the United States. By using our
              Services, you consent to this transfer.
            </p>
          </section>

          {/* Section 10 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. DO NOT TRACK SIGNALS
            </h2>
            <p className="text-gray-700">
              Our platform does not currently respond to "Do Not Track" browser
              signals. However, you can control cookies through your browser
              settings.
            </p>
          </section>

          {/* Section 11 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. THIRD-PARTY LINKS
            </h2>
            <p className="text-gray-700">
              Our Services may contain links to third-party websites. We are not
              responsible for the privacy practices of these third parties. We
              encourage you to review their privacy policies.
            </p>
          </section>

          {/* Section 12 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              12. CHANGES TO THIS PRIVACY POLICY
            </h2>
            <p className="text-gray-700 mb-3">
              We may update this Privacy Policy to reflect changes in our
              practices or legal requirements. We will notify you of material
              changes by:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
              <li>Posting a notice on our platform</li>
              <li>Sending an email to registered users</li>
              <li>Updating the "Last Updated" date</li>
            </ul>
            <p className="text-gray-700 mt-3">
              Your continued use of our Services after changes constitutes
              acceptance of the updated Privacy Policy.
            </p>
          </section>

          {/* Section 13 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              13. CONTACT INFORMATION
            </h2>
            <p className="text-gray-700 mb-4">
              For questions regarding this Privacy Policy or to exercise your
              rights:
            </p>

            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Agensy LLC:
              </h3>
              <div className="ml-4 text-gray-700">
                <p>Privacy Officer</p>
                <p>[Address]</p>
                <p>
                  Email: <span className="underline">privacy@agensy.com</span>
                </p>
                <p>
                  Phone: <span className="underline">1-800-XXX-XXXX</span>
                </p>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                HIPAA Privacy Officer:
              </h3>
              <p className="text-gray-700 mb-2">
                For health information privacy concerns.
              </p>
              <div className="ml-4 text-gray-700">
                <p>
                  Email: <span className="underline">hipaa@agensy.com</span>
                </p>
                <p>
                  Phone: <span className="underline">1-800-XXX-XXXX</span>
                </p>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Filing a Complaint:
              </h3>
              <p className="text-gray-700 mb-2">
                You may file a complaint with:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>Agensy Privacy Officer (contact information above)</li>
                <li>U.S. Department of Health and Human Services</li>
              </ul>
              <div className="ml-8 text-gray-700">
                <p>Office for Civil Rights</p>
                <p>200 Independence Avenue, S.W.</p>
                <p>Washington, D.C. 20201</p>
                <p>1-877-696-6775</p>
                <p>
                  <a
                    href="https://www.hhs.gov/ocr/privacy/hipaa/complaints/"
                    className="underline text-primaryColor"
                    target="_blank"
                  >
                    www.hhs.gov/ocr/privacy/hipaa/complaints
                  </a>
                </p>
              </div>
            </div>
          </section>

          {/* Section 14 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              14. NOTICE OF PRIVACY PRACTICES FOR PROTECTED HEALTH INFORMATION
            </h2>
            <p className="text-gray-700 mb-4">
              As required by HIPAA, this serves as the Notice of Privacy
              Practices.
            </p>

            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Our Responsibilities:
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>
                  We are required by law to maintain the privacy and security of
                  your protected health information.
                </li>
                <li>
                  We will notify you promptly of any breach that may compromise
                  your information.
                </li>
                <li>
                  We must follow the duties and privacy practices described in
                  this notice.
                </li>
                <li>
                  We will not use or share your information other than as
                  described here unless you tell us we can in writing.
                </li>
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Your Choices:
              </h3>
              <p className="text-gray-700 mb-3">
                For certain health information, you can tell us your choices
                about what we share:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>Information to family members involved in your care</li>
                <li>Information in a disaster relief situation</li>
                <li>
                  Information for fundraising efforts (we do not engage in
                  fundraising)
                </li>
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Our Uses and Disclosures:
              </h3>
              <p className="text-gray-700 mb-3">
                We typically use or share your health information for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>
                  <strong>Treatment</strong>: Coordinating care with healthcare
                  providers
                </li>
                <li>
                  <strong>Payment</strong>: Processing insurance claims and
                  billing
                </li>
                <li>
                  <strong>Healthcare Operations</strong>: Improving our services
                  and ensuring quality care
                </li>
              </ul>
              <p className="text-gray-700 mt-3">
                We are allowed or required to share your information in other
                ways that contribute to the public good, such as public health
                and research, when legal conditions are met.
              </p>
            </div>
          </section>

          {/* Section 15 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              15. STATE-SPECIFIC PRIVACY RIGHTS
            </h2>
            <p className="text-gray-700 mb-3">
              Certain states provide additional privacy rights. If you are a
              resident of these states, the following applies:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
              <li>
                <strong>Nevada</strong>: Nevada residents may opt-out of the
                sale of covered information by contacting privacy@agensy.com.
              </li>
              <li>
                <strong>Virginia, Colorado, Connecticut, Utah</strong>:
                Residents of these states have rights similar to those provided
                under CCPA, including rights to access, delete, and correct
                personal information, and to opt-out of certain processing
                activities.
              </li>
            </ul>
          </section>

          {/* Section 16 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              16. ACCESSIBILITY
            </h2>
            <p className="text-gray-700">
              This Privacy Policy is available in alternative formats upon
              request. Please contact us if you need this policy in a different
              format due to a disability.
            </p>
          </section>

          {/* Horizontal Line */}
          <hr className="my-8 border-gray-300" />

          {/* Final Acknowledgment */}
          <section className="mb-8">
            <p className="text-gray-900 font-bold text-center text-lg">
              By using Agensy's Services, you acknowledge that you have read and
              understood this Privacy Policy and agree to the collection, use,
              and disclosure of your information as described herein.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};
