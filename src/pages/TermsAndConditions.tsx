import { CommonLink } from "@agensy/components";
import { ICONS, ROUTES } from "@agensy/constants";

export const TermsAndConditions = () => {
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
          Terms of Use Agreement
        </h1>

        <div className="text-gray-500 mb-8">
          <p>
            Effective Date: <span className="font-bold">08/25/2025</span>
          </p>
          <p>
            Last Updated: <span className="font-bold">08/25/2025</span>
          </p>
        </div>

        {/* Terms Content */}
        <div className="prose prose-lg max-w-none">
          {/* Section 1 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. ACCEPTANCE OF TERMS
            </h2>
            <p className="text-gray-700 mb-4">
              The Agensy platform and related services. These Terms of Use
              ("Terms") constitute a legally binding agreement between you
              ("User") and Agensy LLC, a Delaware limited liability company.
            </p>
            <p className="text-gray-700 mb-4 font-bold">
              BY CLICKING "I AGREE," CREATING AN ACCOUNT, OR ACCESSING OR USING
              THE PLATFORM, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND
              AGREE TO BE BOUND BY THESE TERMS. If you do not agree to these
              Terms, you may not access or use the Platform.
            </p>
            <p className="text-gray-700">
              If you are accepting these Terms on behalf of an organization, you
              represent and warrant that you have the authority to bind that
              organization to these Terms.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. DEFINITIONS
            </h2>
            <ul className="list-disc list-inside space-y-3 ml-4">
              <li className="text-gray-700">
                <span className="font-bold text-gray-900">
                  "Authorized Users"
                </span>{" "}
                means individuals authorized by Customer to access the Platform
                under Customer's subscription.
              </li>
              <li className="text-gray-700">
                <span className="font-bold text-gray-900">
                  "Business Associate Agreement" or "BAA"
                </span>{" "}
                means the HIPAA-compliant agreement incorporated herein.
              </li>
              <li className="text-gray-700">
                <span className="font-bold text-gray-900">
                  "Confidential Information"
                </span>{" "}
                means all non-public information disclosed by either party,
                including Platform features, workflows, and methodologies.
              </li>
              <li className="text-gray-700">
                <span className="font-bold text-gray-900">"Customer"</span>{" "}
                means the legal entity subscribing to the Platform.
              </li>
              <li className="text-gray-700">
                <span className="font-bold text-gray-900">"Customer Data"</span>{" "}
                means all data, including PHI, submitted to the Platform by or
                on behalf of Customer.
              </li>
              <li className="text-gray-700">
                <span className="font-bold text-gray-900">"Legal Entity"</span>{" "}
                means each separate corporation, LLC, partnership, or other
                business organization with its own tax identification number.
              </li>
              <li className="text-gray-700">
                <span className="font-bold text-gray-900">"PHI"</span> means
                Protected Health Information as defined under HIPAA.
              </li>
              <li className="text-gray-700">
                <span className="font-bold text-gray-900">"Platform"</span>{" "}
                means Agensy's web-based senior care management software and all
                related services.
              </li>
              <li className="text-gray-700">
                <span className="font-bold text-gray-900">
                  "Proprietary Methods"
                </span>{" "}
                means Agensy's confidential and proprietary care management
                workflows, clinical protocols, assessment tools, documentation
                templates, and business processes.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. PLATFORM ACCESS AND SUBSCRIPTIONS
            </h2>

            {/* Subsection 3.1 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                3.1 Subscription Requirements
              </h3>
              <p className="text-gray-700 mb-3 font-bold">
                EACH SEPARATE LEGAL ENTITY REQUIRES ITS OWN SUBSCRIPTION. This
                includes, without limitation:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>Parent companies and their subsidiaries</li>
                <li>Affiliated companies under common ownership</li>
                <li>Franchisees and franchisors</li>
                <li>Management companies and the facilities they manage</li>
                <li>
                  Separate locations operating under different legal entities
                </li>
              </ul>
              <p className="text-gray-700 mt-3">
                Sharing Platform access across multiple Legal Entities violates
                these Terms and constitutes copyright infringement and breach of
                contract.
              </p>
            </div>

            {/* Subsection 3.2 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                3.2 Account Registration
              </h3>
              <p className="text-gray-700 mb-3">
                To access the Platform, you must:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>
                  Provide accurate, current, and complete registration
                  information
                </li>
                <li>
                  Maintain and update your information to keep it accurate
                </li>
                <li>Maintain the security of your account credentials</li>
                <li>
                  Accept responsibility for all activities under your account
                </li>
                <li>Immediately notify us of any unauthorized use</li>
              </ul>
            </div>

            {/* Subsection 3.3 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                3.3 User Roles and Access
              </h3>
              <p className="text-gray-700">
                Customer may designate Authorized Users with specific roles
                (Administrator, Family Member, Caregiver). Each Authorized User
                must accept these Terms and may only access features appropriate
                to their assigned role.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. FEES AND PAYMENT
            </h2>

            {/* Subsection 4.1 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                4.1 Subscription Fees
              </h3>
              <p className="text-gray-700">
                The Platform is offered at $9.99 per month per Legal Entity
                ("Subscription Fee"). Fees are non-refundable except as required
                by law.
              </p>
            </div>

            {/* Subsection 4.2 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                4.2 Payment Terms
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>Payment is due monthly in advance</li>
                <li>All fees are exclusive of taxes</li>
                <li>Failure to pay may result in suspension or termination</li>
                <li>
                  We reserve the right to modify fees with 30 days' notice
                </li>
              </ul>
            </div>

            {/* Subsection 4.3 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                4.3 Audit Rights
              </h3>
              <p className="text-gray-700">
                We reserve the right to audit Customer's use of the Platform{" "}
                <em>annually</em>. If unauthorized use is revealed, Customer{" "}
                <strong>shall</strong> pay retroactive fees plus 1.5% interest
                per month.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. INTELLECTUAL PROPERTY AND PROPRIETARY RIGHTS
            </h2>

            {/* Subsection 5.1 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                5.1 Agensy's Proprietary Rights
              </h3>
              <p className="text-gray-700 mb-3 font-bold">
                THE PLATFORM CONTAINS VALUABLE TRADE SECRETS AND PROPRIETARY
                INFORMATION.
              </p>
              <p className="text-gray-700 mb-3">The Platform incorporates:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>
                  Proprietary care management <strong>algorithms</strong> for
                  patient assessment and care optimization
                </li>
                <li>
                  Clinical decision support <strong>tools</strong> for
                  medication management and care coordination
                </li>
                <li>
                  Risk stratification <strong>models</strong> for identifying
                  patient needs
                </li>
                <li>
                  Workflow automation <strong>sequences</strong> for care
                  documentation and regulatory compliance
                </li>
                <li>
                  Care planning <strong>methodologies</strong> developed through
                  substantial research and investment
                </li>
                <li>
                  Assessment protocols and documentation{" "}
                  <strong>templates</strong> specifically designed for senior
                  care
                </li>
              </ul>
              <p className="text-gray-700">
                These "Proprietary Methods" constitute trade secrets under the
                Defend Trade Secrets Act and Delaware law, deriving independent
                economic value and subject to reasonable efforts to maintain
                secrecy, not being <em>generally</em> known.
              </p>
            </div>

            {/* Subsection 5.2 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                5.2 Restrictions on Use
              </h3>
              <p className="text-gray-700 mb-3">
                Customer <strong>SHALL NOT</strong> and shall not permit any
                third party to:
              </p>
              <ol className="list-[lower-alpha] list-inside space-y-2 ml-4 text-gray-700">
                <li>
                  <strong>
                    Reverse engineer, decompile, disassemble, or attempt to
                    discover
                  </strong>{" "}
                  the source code, algorithms, or underlying structure of the
                  Platform
                </li>
                <li>
                  <strong>Copy, reproduce, or replicate</strong> any feature,
                  function, workflow, or user interface of the Platform
                </li>
                <li>
                  <strong>
                    Build or participate in building competing software
                  </strong>{" "}
                  that incorporates or is derived from Platform concepts,
                  workflows, or methodologies
                </li>
                <li>
                  <strong>Use Platform insights, data, or knowledge</strong>{" "}
                  gained from Platform access to develop, market, or support any
                  competing senior care management software
                </li>
                <li>
                  <strong>Benchmark, analyze, or publish</strong> performance
                  characteristics of the Platform
                </li>
                <li>Remove or alter any proprietary notices or labels</li>
              </ol>
            </div>

            {/* Subsection 5.3 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                5.3 Forfeiture for Competition
              </h3>
              <p className="text-gray-700 mb-3 font-bold">
                CUSTOMER ACKNOWLEDGES AND AGREES THAT:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>
                  Any competitive activities will result in immediate
                  termination of access
                </li>
                <li>All fees paid will be forfeited without refund</li>
                <li>
                  Customer will be liable for damages and injunctive relief
                </li>
                <li>
                  Agensy may pursue legal action for trade secret
                  misappropriation
                </li>
              </ul>
              <p className="text-gray-700 mt-3">
                Customer acknowledges that breach of these provisions would
                cause irreparable harm to Agensy.
              </p>
            </div>

            {/* Subsection 5.4 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                5.4 Trade Secret Notice
              </h3>
              <p className="text-gray-700 font-bold">
                NOTICE OF IMMUNITY UNDER THE DEFEND TRADE SECRETS ACT:
              </p>
              <p className="text-gray-700">
                An individual shall not be held criminally or civilly liable
                under any Federal or State trade secret law for the disclosure
                of a trade secret that (i) is made solely for the purpose of
                reporting or investigating a suspected violation of law, or (ii)
                is made in a complaint or other document filed in a lawsuit or
                other proceeding, if such filing is made under seal.
              </p>
            </div>

            {/* Subsection 5.5 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                5.5 Customer Data License
              </h3>
              <p className="text-gray-700 mb-3">
                Customer grants Agensy a limited license to use Customer Data
                for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>Providing and improving Platform services</li>
                <li>Ensuring Platform security and compliance</li>
                <li>Generating aggregated, de-identified analytics</li>
                <li>Fulfilling legal and regulatory obligations</li>
              </ul>
            </div>

            {/* Subsection 5.6 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                5.6 Feedback and Improvements
              </h3>
              <p className="text-gray-700">
                Customer assigns to Agensy all rights to any feedback,
                suggestions, or improvements related to the Platform. Agensy may
                use such feedback to enhance Platform functionality and
                services.
              </p>
            </div>

            {/* Subsection 5.7 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                5.7 Aggregated Data
              </h3>
              <p className="text-gray-700">
                Agensy owns <strong>all</strong> rights to aggregated,
                de-identified data that cannot reasonably identify any
                individual. Such data may be used for any{" "}
                <strong>lawful</strong> purpose, including Platform improvement
                and industry research.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. PROHIBITED USES AND COMPETITIVE RESTRICTIONS
            </h2>

            {/* Subsection 6.1 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                6.1 Prohibited Activities
              </h3>
              <p className="text-gray-700 mb-3">Customer shall not:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>
                  Use the Platform for any <strong>unlawful</strong> purpose
                </li>
                <li>
                  Violate any <strong>applicable healthcare regulations</strong>
                </li>
                <li>Attempt to gain unauthorized access to any systems</li>
                <li>Interfere with Platform operation or security</li>
                <li>
                  Upload malicious code or <strong>harmful</strong> content
                </li>
                <li>
                  Scrape, data mine, or use automated systems to access the
                  Platform
                </li>
                <li>
                  Share login credentials or <strong>allow</strong> unauthorized
                  access
                </li>
              </ul>
            </div>

            {/* Subsection 6.2 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                6.2 Non-Competition Covenant
              </h3>
              <p className="text-gray-700 mb-3">
                During the term of this Agreement and for two (2) years
                thereafter, Customer agrees NOT to:
              </p>
              <ol className="list-[lower-alpha] list-inside space-y-2 ml-4 text-gray-700">
                <li>
                  Develop, market, <strong>sell</strong>, or{" "}
                  <strong>distribute</strong> any software that competes with
                  the Platform's senior care management functionality
                </li>
                <li>
                  Use any knowledge, <strong>workflows</strong>, or{" "}
                  <strong>methodologies</strong> learned from the Platform to
                  create competing products
                </li>
                <li>
                  Assist others in developing competing senior care management
                  software
                </li>
                <li>
                  Invest in or <strong>advise</strong> companies developing
                  competing platforms (passive investments in publicly traded
                  companies excepted)
                </li>
              </ol>
            </div>

            {/* Subsection 6.3 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                6.3 Non-Solicitation
              </h3>
              <p className="text-gray-700">
                Customer shall not, during the term and for one year after,{" "}
                <strong>directly</strong> or <strong>indirectly</strong>
                solicit for employment any Agensy employee or contractor.
              </p>
            </div>

            {/* Subsection 6.4 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                6.4 Liquidated Damages for Breach
              </h3>
              <p className="text-gray-700">
                Customer acknowledges that breach of Sections 5 or 6 would cause{" "}
                <strong>irreparable harm difficult to quantify</strong>.
                Therefore, in addition to injunctive relief, breach shall{" "}
                <strong>result</strong> in liquidated damages of $100,000 per
                violation, representing a reasonable estimate of Agensy's losses
                including development costs, lost competitive advantage, and
                diminished trade secret value.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. HIPAA COMPLIANCE AND BUSINESS ASSOCIATE AGREEMENT
            </h2>

            {/* Subsection 7.1 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                7.1 HIPAA Compliance
              </h3>
              <p className="text-gray-700">
                Both parties shall comply with all applicable provisions of the
                Health Insurance Portability and Accountability Act ("HIPAA"),
                including the Privacy, Security, and Breach Notification Rules.
              </p>
            </div>

            {/* Subsection 7.2 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                7.2 Business Associate Agreement
              </h3>
              <p className="text-gray-700">
                The HIPAA Business Associate Agreement (BAA) is attached as{" "}
                <strong>Exhibit A</strong> and incorporated by reference. In
                case of conflict between these Terms and the BAA regarding PHI
                handling, the BAA controls.
              </p>
            </div>

            {/* Subsection 7.3 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                7.3 Security Safeguards
              </h3>
              <p className="text-gray-700 mb-3">
                Agensy implements the following administrative, physical, and
                technical safeguards:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>Encryption of PHI in transit and at rest</li>
                <li>Access controls and audit logging</li>
                <li>Regular security assessments</li>
                <li>Incident response procedures</li>
                <li>Business continuity planning</li>
              </ul>
            </div>
          </section>

          {/* Section 8 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. DATA RIGHTS AND PORTABILITY
            </h2>

            {/* Subsection 8.1 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                8.1 Customer Data Ownership
              </h3>
              <p className="text-gray-700">
                Customer retains <strong>all</strong> rights to Customer Data,
                subject to the licenses granted within the document. Agensy
                claims no ownership of Customer Data except as specified for
                aggregated, de-identified information.
              </p>
            </div>

            {/* Subsection 8.2 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                8.2 Data Export
              </h3>
              <p className="text-gray-700">
                Customer may export Customer Data at any time during the
                subscription term through Platform functionality at no
                additional charge.
              </p>
            </div>

            {/* Subsection 8.3 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                8.3 Post-Termination Access
              </h3>
              <p className="text-gray-700 mb-3">
                Upon termination, Agensy will maintain Customer Data for{" "}
                <strong>thirty (30) days</strong>. During this period:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>
                  Customer may export data in industry-standard formats (CSV,
                  JSON, XML/C-CDA)
                </li>
                <li>
                  Export functionality remains <strong>available</strong>{" "}
                  regardless of payment status
                </li>
                <li>
                  Maximum fee for electronic copies is{" "}
                  <strong>$6.50 per request</strong>
                </li>
                <li>
                  After 30 days, Agensy may delete Customer Data unless longer
                  retention is required by law
                </li>
              </ul>
            </div>

            {/* Subsection 8.4 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                8.4 Legal Requests
              </h3>
              <p className="text-gray-700">
                Agensy may disclose Customer Data if required by law, subpoena,
                or court order, with notice to Customer unless prohibited.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. PRIVACY AND SECURITY
            </h2>

            {/* Subsection 9.1 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                9.1 Privacy Policy
              </h3>
              <p className="text-gray-700">
                Our Privacy Policy, available at [URL], describes how we
                collect, use, and protect information. By using the Platform,
                you consent to these practices.
              </p>
            </div>

            {/* Subsection 9.2 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                9.2 Security Measures
              </h3>
              <p className="text-gray-700">
                While we implement industry-standard security measures, no
                system is completely secure. Customer acknowledges the inherent
                risks of electronic data transmission and storage.
              </p>
            </div>

            {/* Subsection 9.3 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                9.3 Breach Notification
              </h3>
              <p className="text-gray-700">
                We will notify Customer of any security breach affecting
                Customer Data as required by applicable law and the BAA.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. WARRANTIES AND DISCLAIMERS
            </h2>

            {/* Subsection 10.1 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                10.1 Mutual Warranties
              </h3>
              <p className="text-gray-700 mb-3">Each party warrants that it:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>Has full authority to enter into these Terms</li>
                <li>Will comply with all applicable laws</li>
                <li>Will perform its obligations in a professional manner</li>
              </ul>
            </div>

            {/* Subsection 10.2 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                10.2 Platform Warranty
              </h3>
              <p className="text-gray-700">
                Agensy warrants that the Platform will perform substantially in
                accordance with documentation under normal use.
              </p>
            </div>

            {/* Subsection 10.3 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                10.3 DISCLAIMER
              </h3>
              <p className="text-gray-700 font-bold">
                EXCEPT AS EXPRESSLY PROVIDED, THE PLATFORM IS PROVIDED "AS IS"
                WITHOUT WARRANTIES OF ANY KIND. AGENSY DISCLAIMS ALL IMPLIED
                WARRANTIES INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR
                PURPOSE, AND NON-INFRINGEMENT.
              </p>
            </div>

            {/* Subsection 10.4 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                10.4 No Medical Advice
              </h3>
              <p className="text-gray-700">
                THE PLATFORM DOES NOT PROVIDE <strong>MEDICAL ADVICE</strong>.
                All clinical decisions remain the responsibility of qualified
                healthcare providers. <strong>Agensy</strong> is not responsible
                for clinical outcomes.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. INDEMNIFICATION
            </h2>

            {/* Subsection 11.1 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                11.1 Customer Indemnification
              </h3>
              <p className="text-gray-700 mb-3">
                Customer shall defend, indemnify, and hold harmless Agensy from
                any claims arising from:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>Customer's use of the Platform</li>
                <li>Breach of these Terms</li>
                <li>Violation of any laws or third-party rights</li>
                <li>Customer Data or its use</li>
                <li>Clinical decisions or patient care</li>
              </ul>
            </div>

            {/* Subsection 11.2 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                11.2 Agensy Indemnification
              </h3>
              <p className="text-gray-700">
                Agensy shall defend, indemnify, and hold harmless Customer from
                claims that the Platform infringes third-party intellectual
                property rights, except to the extent caused by Customer's
                unauthorized use.
              </p>
            </div>
          </section>

          {/* Section 12 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              12. LIMITATION OF LIABILITY
            </h2>

            {/* Subsection 12.1 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                12.1 Exclusion of Damages
              </h3>
              <p className="text-gray-700 font-bold">
                NEITHER PARTY SHALL BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
                SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST
                PROFITS, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
              </p>
            </div>

            {/* Subsection 12.2 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                12.2 Cap on Liability
              </h3>
              <p className="text-gray-700 font-bold">
                EXCEPT FOR BREACHES OF SECTIONS 5 OR 6, EACH PARTY'S TOTAL
                LIABILITY SHALL NOT EXCEED THE FEES PAID IN THE TWELVE MONTHS
                PRECEDING THE CLAIM.
              </p>
            </div>

            {/* Subsection 12.3 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                12.3 Exceptions
              </h3>
              <p className="text-gray-700 mb-3">
                These limitations do not apply to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>
                  Breaches of confidentiality or intellectual property
                  provisions
                </li>
                <li>Indemnification obligations</li>
                <li>Gross negligence or willful misconduct</li>
                <li>Violations of HIPAA</li>
              </ul>
            </div>
          </section>

          {/* Section 13 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              13. TERM AND TERMINATION
            </h2>

            {/* Subsection 13.1 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                13.1 Term
              </h3>
              <p className="text-gray-700">
                These Terms commence upon acceptance and continue month-to-month
                until terminated.
              </p>
            </div>

            {/* Subsection 13.2 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                13.2 Termination for Convenience
              </h3>
              <p className="text-gray-700">
                Either party may terminate upon 30 days' written notice.
              </p>
            </div>

            {/* Subsection 13.3 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                13.3 Termination for Cause
              </h3>
              <p className="text-gray-700 mb-3">
                Either party may terminate <strong>immediately</strong> upon:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>Material breach not cured within 10 days of notice</li>
                <li>Insolvency or bankruptcy</li>
                <li>Violation of applicable law</li>
              </ul>
            </div>

            {/* Subsection 13.4 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                13.4 Immediate Termination
              </h3>
              <p className="text-gray-700 mb-3">
                Agensy may terminate <strong>immediately</strong> if Customer:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>Breaches Sections 5 or 6</li>
                <li>Violates HIPAA</li>
                <li>Engages in competitive activities</li>
                <li>
                  Shares access across <strong>Legal Entities</strong>
                </li>
              </ul>
            </div>

            {/* Subsection 13.5 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                13.5 Effect of Termination
              </h3>
              <p className="text-gray-700 mb-3">Upon termination:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>
                  Access to the Platform ceases <strong>immediately</strong>
                </li>
                <li>
                  Customer must cease <strong>all</strong> use of{" "}
                  <strong>Confidential Information</strong>
                </li>
                <li>Data export rights continue for 30 days</li>
                <li>Sections 5, 6, 11, 12, 14, and 15 survive termination</li>
              </ul>
            </div>
          </section>

          {/* Section 14 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              14. CONFIDENTIALITY
            </h2>

            {/* Subsection 14.1 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                14.1 Confidential Information
              </h3>
              <p className="text-gray-700 mb-3">Each party shall:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>
                  Maintain the confidentiality of the other's{" "}
                  <strong>Confidential Information</strong>
                </li>
                <li>
                  Use <strong>Confidential Information solely</strong> for
                  performing under these Terms
                </li>
                <li>Protect Confidential Information with reasonable care</li>
                <li>Limit access to those with a need to know</li>
              </ul>
            </div>

            {/* Subsection 14.2 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                14.2 Exceptions
              </h3>
              <p className="text-gray-700 mb-3">
                Obligations do not apply to information that:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>Is or becomes publicly available through no breach</li>
                <li>Was rightfully known before disclosure</li>
                <li>
                  Is independently developed without use of Confidential
                  Information
                </li>
                <li>Must be disclosed by law</li>
              </ul>
            </div>

            {/* Subsection 14.3 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                14.3 Duration
              </h3>
              <p className="text-gray-700">
                Confidentiality obligations survive termination for five (5)
                years, except for trade secrets which remain confidential
                indefinitely.
              </p>
            </div>
          </section>

          {/* Section 15 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              15. DISPUTE RESOLUTION
            </h2>

            {/* Subsection 15.1 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                15.1 Governing Law
              </h3>
              <p className="text-gray-700">
                These Terms are governed by Delaware law, excluding conflict of
                laws principles.
              </p>
            </div>

            {/* Subsection 15.2 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                15.2 Jurisdiction and Venue
              </h3>
              <p className="text-gray-700">
                Any dispute arising out of or relating to these Terms{" "}
                <strong>
                  shall be brought exclusively in the state or federal courts
                  located in Travis County, Texas
                </strong>
                . Each party irrevocably consents to the exclusive jurisdiction
                and venue of such courts and waives any objection to such
                jurisdiction or venue, including claims of inconvenient forum.
              </p>
            </div>

            {/* Subsection 15.3 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                15.3 Jury Trial Waiver
              </h3>
              <p className="text-gray-700">
                <strong>
                  EACH PARTY HEREBY WAIVES ITS RIGHT TO A JURY TRIAL
                </strong>{" "}
                in any proceeding arising out of or related to these Terms. This
                waiver applies to any action whether sounding in contract, tort,
                or otherwise.
              </p>
            </div>

            {/* Subsection 15.4 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                15.4 Injunctive Relief
              </h3>
              <p className="text-gray-700 mb-3">
                Either party may seek immediate injunctive relief in any court
                of competent jurisdiction for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>Intellectual property violations</li>
                <li>Breach of confidentiality</li>
                <li>Violations of competitive restrictions</li>
              </ul>
            </div>

            {/* Subsection 15.5 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                15.5 Legal Fees
              </h3>
              <p className="text-gray-700">
                The prevailing party in any dispute <strong>shall</strong> be
                entitled to recover its <strong>reasonable</strong> attorneys'
                fees, expert witness fees, and costs of suit, including on
                appeal.
              </p>
            </div>
          </section>

          {/* Section 16 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              16. GENERAL PROVISIONS
            </h2>

            {/* Subsection 16.1 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                16.1 Entire Agreement
              </h3>
              <p className="text-gray-700">
                These Terms, including <strong>all</strong> exhibits and the
                BAA, constitute the entire agreement between the parties.
              </p>
            </div>

            {/* Subsection 16.2 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                16.2 Amendment
              </h3>
              <p className="text-gray-700">
                Agensy may modify these Terms with 30 days' notice. Continued
                use constitutes acceptance of modifications.
              </p>
            </div>

            {/* Subsection 16.3 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                16.3 Assignment
              </h3>
              <p className="text-gray-700">
                Customer may not assign these Terms without written consent.
                Agensy may assign to a successor or acquirer.
              </p>
            </div>

            {/* Subsection 16.4 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                16.4 Severability
              </h3>
              <p className="text-gray-700">
                If any provision is unenforceable, it <strong>shall</strong> be
                modified to the minimum extent necessary for enforceability.
              </p>
            </div>

            {/* Subsection 16.5 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                16.5 Waiver
              </h3>
              <p className="text-gray-700">
                No waiver is effective <strong>unless</strong> in writing and
                signed by the waiving party.
              </p>
            </div>

            {/* Subsection 16.6 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                16.6 Force Majeure
              </h3>
              <p className="text-gray-700">
                Neither party is <strong>liable</strong> for delays due to
                circumstances beyond <strong>reasonable</strong> control.
              </p>
            </div>

            {/* Subsection 16.7 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                16.7 Notices
              </h3>
              <p className="text-gray-700 mb-3">
                Notices must be in writing to:
              </p>
              <div className="ml-4 text-gray-700">
                <p>Agensy LLC</p>
                <p>[Address]</p>
                <p>
                  Email: <span className="underline">legal@agensy.com</span>
                </p>
              </div>
            </div>

            {/* Subsection 16.8 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                16.8 Relationship
              </h3>
              <p className="text-gray-700">
                The parties are independent contractors. Nothing creates a
                partnership, joint venture, or agency relationship.
              </p>
            </div>

            {/* Subsection 16.9 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                16.9 Survival
              </h3>
              <p className="text-gray-700">
                All provisions that by their nature should survive termination
                shall survive.
              </p>
            </div>

            {/* Subsection 16.10 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                16.10 Compliance with Laws
              </h3>
              <p className="text-gray-700">
                Each party shall comply with all applicable laws, including
                healthcare and data protection regulations.
              </p>
            </div>
          </section>

          {/* Section 17 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              17. CALIFORNIA RESIDENTS - CCPA RIGHTS
            </h2>
            <p className="text-gray-700">
              California residents have specific rights under the California
              Consumer Privacy Act. Please see our Privacy Policy for details.
            </p>
          </section>

          {/* Section 18 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              18. CONTACT INFORMATION
            </h2>
            <p className="text-gray-700 mb-3">
              For questions about these Terms, contact:
            </p>
            <div className="ml-4 text-gray-700">
              <p>Agensy LLC</p>
              <p>
                Email: <span className="underline">support@agensy.com</span>
              </p>
              <p>Phone: [Phone Number]</p>
            </div>
          </section>

          {/* Horizontal Line */}
          <hr className="my-8 border-gray-300" />

          {/* Exhibit A */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              EXHIBIT A: BUSINESS ASSOCIATE AGREEMENT
            </h2>
            <p className="text-gray-700">
              [To be attached - comprehensive HIPAA BAA covering all required
              elements under 45 CFR 164.504(e)]
            </p>
          </section>

          {/* Horizontal Line */}
          <hr className="my-8 border-gray-300" />

          {/* Final Acknowledgment */}
          <section className="mb-8">
            <p className="text-gray-900 font-bold text-center text-lg">
              BY USING THE PLATFORM, YOU ACKNOWLEDGE THAT YOU HAVE READ,
              UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS OF USE.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};
