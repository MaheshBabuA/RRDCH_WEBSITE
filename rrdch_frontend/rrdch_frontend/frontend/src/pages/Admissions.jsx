import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../utils/i18n';
import Card from '../components/Card';

const FeeRow = ({ program, tuition, hostel, other, total }) => (
  <tr className="border-b border-border-light hover:bg-light-bg transition-colors">
    <td className="px-6 py-4 font-bold text-secondary-blue">{program}</td>
    <td className="px-6 py-4 text-neutral-gray">{tuition}</td>
    <td className="px-6 py-4 text-neutral-gray">{hostel}</td>
    <td className="px-6 py-4 text-neutral-gray">{other}</td>
    <td className="px-6 py-4 font-bold text-primary-blue">{total}</td>
  </tr>
);

const DateRow = ({ event, date, note }) => (
  <tr className="border-b border-border-light hover:bg-light-bg transition-colors">
    <td className="px-6 py-4 font-medium text-secondary-blue">{event}</td>
    <td className="px-6 py-4 font-bold text-primary-blue">{date}</td>
    <td className="px-6 py-4 text-xs text-neutral-gray">{note}</td>
  </tr>
);

const Admissions = () => {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState(null);
  const [activeElig, setActiveElig] = useState('bds');

  const faqs = t('admissionsPage.faqs');
  const steps = t('admissionsPage.steps');

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative py-24 bg-secondary-blue overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white"
              style={{ width: `${60 + i * 30}px`, height: `${60 + i * 30}px`, top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, opacity: 0.3 }}
            />
          ))}
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-white/80 text-sm font-bold mb-6 border border-white/20">
            🎓 DCI Recognized • NAAC 'A' Grade
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">{t('admissionsPage.title')}</h1>
          <p className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">{t('admissionsPage.subtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link to="/book-appointment" className="px-8 py-4 bg-white text-secondary-blue font-bold rounded-2xl hover:bg-white/90 transition-all shadow-xl">
              {t('navbar.bookAppointment')}
            </Link>
            <Link to="/contact" className="px-8 py-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all border border-white/30">
              {t('admissionsPage.ctaBtn')}
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">

        {/* Eligibility */}
        <section>
          <h2 className="text-3xl font-bold text-secondary-blue text-center mb-12">{t('admissionsPage.eligTitle')}</h2>
          <div className="flex gap-3 mb-8 justify-center">
            {['bds', 'mds'].map(prog => (
              <button key={prog} onClick={() => setActiveElig(prog)}
                className={`px-8 py-3 rounded-2xl font-bold transition-all ${activeElig === prog ? 'bg-primary-blue text-white shadow-lg scale-105' : 'bg-light-bg text-neutral-gray hover:bg-border-light'}`}>
                {prog.toUpperCase()}
              </button>
            ))}
          </div>
          <Card className="max-w-2xl mx-auto p-10 shadow-xl">
            <ul className="space-y-5">
              {t(`admissionsPage.${activeElig}Elig`).map((point, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="w-7 h-7 rounded-full bg-primary-blue/10 flex items-center justify-center text-primary-blue font-black text-sm flex-shrink-0 mt-0.5">{i + 1}</span>
                  <span className="text-neutral-gray leading-relaxed font-medium">{point}</span>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        {/* How to Apply – Timeline */}
        <section className="bg-light-bg rounded-[40px] p-10 md:p-16">
          <h2 className="text-3xl font-bold text-secondary-blue mb-16 text-center">{t('admissionsPage.processTitle')}</h2>
          <div className="relative max-w-3xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border-light hidden md:block"></div>
            <div className="space-y-10">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white border-4 border-primary-blue/20 group-hover:border-primary-blue group-hover:bg-primary-blue transition-all flex items-center justify-center z-10">
                    <span className="font-black text-primary-blue group-hover:text-white transition-colors text-lg">{i + 1}</span>
                  </div>
                  <div className="flex-1 pt-2">
                    <h4 className="font-bold text-secondary-blue text-lg mb-1">{step.t}</h4>
                    <p className="text-neutral-gray leading-relaxed">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fee Structure */}
        <section>
          <h2 className="text-3xl font-bold text-secondary-blue mb-10 text-center">{t('admissionsPage.feesTitle')}</h2>
          <div className="overflow-hidden rounded-3xl border border-border-light shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-secondary-blue text-white">
                  <tr>
                    <th className="px-6 py-4 font-bold">Program</th>
                    <th className="px-6 py-4 font-bold">Tuition Fee (Annual)</th>
                    <th className="px-6 py-4 font-bold">Hostel Fee (Annual)</th>
                    <th className="px-6 py-4 font-bold">Other Charges</th>
                    <th className="px-6 py-4 font-bold text-accent-green">Approx. Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <FeeRow program="BDS (5 Years)" tuition="₹5,50,000" hostel="₹85,000" other="₹15,000" total="₹6,50,000" />
                  <FeeRow program="MDS – Orthodontics" tuition="₹8,00,000" hostel="₹85,000" other="₹20,000" total="₹9,05,000" />
                  <FeeRow program="MDS – Oral Surgery" tuition="₹8,00,000" hostel="₹85,000" other="₹20,000" total="₹9,05,000" />
                  <FeeRow program="Fellowship in Implantology" tuition="₹2,50,000" hostel="₹85,000" other="₹10,000" total="₹3,45,000" />
                </tbody>
              </table>
            </div>
            <div className="text-xs text-neutral-gray p-4 bg-light-bg border-t border-border-light italic">
              * Fee structure is indicative for 2026–27 academic year and subject to revision. Refer to your admission counseling letter for exact amounts.
            </div>
          </div>
        </section>

        {/* Important Dates */}
        <section>
          <h2 className="text-3xl font-bold text-secondary-blue mb-10 text-center">{t('admissionsPage.datesTitle')}</h2>
          <div className="overflow-hidden rounded-3xl border border-border-light shadow-xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-accent-green text-white">
                <tr>
                  <th className="px-6 py-4 font-bold">Event</th>
                  <th className="px-6 py-4 font-bold">Tentative Date</th>
                  <th className="px-6 py-4 font-bold">Note</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <DateRow event="NEET-UG 2026 Exam" date="May 4, 2026" note="Conducted by NTA" />
                <DateRow event="NEET-UG Result Declaration" date="June 2026" note="Approximate" />
                <DateRow event="State Counseling Round 1" date="July 2026" note="Subject to NMC notification" />
                <DateRow event="State Counseling Round 2" date="August 2026" note="Subject to NMC notification" />
                <DateRow event="Commencement of Classes" date="September 1, 2026" note="Final date as per university" />
                <DateRow event="Management Quota Deadline" date="August 31, 2026" note="Contact admissions office" />
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-secondary-blue mb-10 text-center">{t('admissionsPage.faqTitle')}</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-border-light rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-light-bg transition-colors"
                >
                  <span className="font-bold text-secondary-blue pr-4">{faq.q}</span>
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full bg-primary-blue/10 flex items-center justify-center text-primary-blue font-black transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-neutral-gray leading-relaxed border-t border-border-light pt-4 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-gradient-to-r from-primary-blue to-secondary-blue rounded-[40px] p-12 md:p-20 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('admissionsPage.ctaTitle')}</h2>
          <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto mb-10">{t('admissionsPage.ctaText')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="px-10 py-4 bg-white text-secondary-blue font-bold rounded-2xl hover:bg-white/90 transition-all shadow-xl">
              {t('admissionsPage.ctaBtn')}
            </Link>
            <a href="tel:+918028437150" className="px-10 py-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all border border-white/30">
              📞 +91-80-2843 7150
            </a>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Admissions;
