import React from 'react';
import { useApp } from '../context/AppContext';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/architectural/Button';
import { Wrench } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { openQuoteModal } = useApp();

  const paragraphs = [
    'Lift and Reach Equipments is Hydraulic equipment Manufacturing Company, located in Sriperumpudur, Chennai, in the state of Tamil Nadu registered under the laws of “The Republic of India”.',
    'Lift and Reach Equipments has wide product expertise in design, development and manufacturing with more than 25 years of broad industrial experience in the field of manufacturing Hydraulics material handling equipments and Aerial access platforms.',
    'Lift and Reach Equipments takes a product from the concept stage, all the way to the final product with superior quality. We understand various product development challenges that are typical to an industry. This helps us to address the entire product lifecycle, starting from feasibility study, through conceptual design, detailed design, analysis & simulation, manufacturing and testing.',
    'By extensive industrial best engineering practices, Lift and Reach Equipments supports customers by analyzing their actual requirement to improve their productivity with our specially designed material handling hydraulic equipments.',
    'Custom built Truck mounted/Towable Aerial access platforms up to 25 Meters height, Hydraulic Scissor lifting tables with different height and capacity (Height up to 12 Meters capacity up to 25 Tons), aircraft jacks, special purpose machines are our special products among our variety of products.',
    'Standard products in the array are Pallet truck, Stacker, Dock Leveler, Floor cranes, Drum lifter cum tilter and so on.'
  ];

  const serviceText =
    'After sales service support is an integral part of our industry, We have a separate team of service technicians who visit the customer sites to give a best service experience to the customer. After sales, services and spares are assured with this team.';

  const processSteps = [
    { num: '01', title: 'Feasibility Study', desc: 'Evaluating load weights, travel clearances, and site structural conditions.' },
    { num: '02', title: 'Conceptual Design', desc: 'Formulating mechanism geometry, kinematics, and safety factors.' },
    { num: '03', title: 'Detailed Design', desc: 'Full 3D modeling, stress calculations, and fabrication drawings.' },
    { num: '04', title: 'Analysis & Simulation', desc: 'FEA stress distribution analysis, pressure ratings, and deflection limits.' },
    { num: '05', title: 'Manufacturing', desc: 'Plate cutting, structural welding, cylinder machining, and assembly in Chennai.' },
    { num: '06', title: 'Testing & Commissioning', desc: 'Proof load validation, relief calibration, and on-site handover.' }
  ];

  return (
    <div className="w-full bg-[#F6F4F0] text-[#15191E] pb-24">
      <Helmet>
        <title>About Us | Lift and Reach Equipments — Chennai</title>
        <meta
          name="description"
          content="Learn about Lift and Reach Equipments, custom hydraulic lift and material handling machinery manufacturer in Chennai with over 25 years of experience."
        />
      </Helmet>

      {/* 7.1 HERO SECTION */}
      <section
        className="w-full bg-[#E8E4DD] border-b border-[#D5CFC5]"
        style={{ padding: '48px var(--pad-x) 40px var(--pad-x)' }}
      >
        <div className="w-full max-w-[1360px] mx-auto space-y-3">
          <p className="text-[12px] font-mono text-[#7C8794] m-0">
            About Lift and Reach Equipments
          </p>
          <h1
            className="font-heading text-[#15191E] m-0 font-semibold leading-[1.15] tracking-[-0.01em]"
            style={{ fontSize: 'var(--fs-h1)', maxWidth: '28ch' }}
          >
            Engineering material handling solutions with 25+ years of hydraulic mastery.
          </h1>
        </div>
      </section>

      {/* 7.2 TWO-COLUMN EDITORIAL WITH VERBATIM TEXT */}
      <section
        className="w-full bg-[#F6F4F0] border-b border-[#D5CFC5]"
        style={{ padding: 'var(--section-y) var(--pad-x)' }}
      >
        <div className="w-full max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left: Original Verbatim Narrative (Cols 1-7) */}
          <div className="lg:col-span-7 space-y-4 font-body text-[15px] text-[#3A424C] leading-[1.6]">
            {paragraphs.map((p, idx) => (
              <p key={idx} className="m-0">{p}</p>
            ))}

            <div className="pt-2">
              <Button variant="primary" onClick={() => openQuoteModal()}>
                Discuss your lifting requirements
              </Button>
            </div>
          </div>

          {/* Right: Plate Frame with Authentic Visual (Cols 8-12) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-[4/3] w-full max-h-[360px] bg-[#E8E4DD] border border-[#D5CFC5] rounded-none overflow-hidden flex items-center justify-center p-6">
              <img
                src="/images/product/scissor lift.jpg"
                alt="Lift and Reach Hydraulic Engineering"
                width={320}
                height={240}
                className="max-w-[85%] max-h-[85%] object-contain mix-blend-multiply"
              />
            </div>

            <div className="p-4 bg-white border border-[#D5CFC5] space-y-1.5">
              <span className="text-[12px] font-mono text-[#7C8794] block font-semibold">
                Works Location
              </span>
              <p className="font-body text-[13px] text-[#3A424C] leading-snug m-0">
                Registered manufacturing facility situated at No.419/9-1, Pillaiyar Koil Street, Kuthambakkam, Chennai - 600124, Tamil Nadu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7.3 PROVEN NUMERALS */}
      <section
        className="w-full bg-[#E8E4DD] border-b border-[#D5CFC5]"
        style={{ padding: 'var(--section-y) var(--pad-x)' }}
      >
        <div className="w-full max-w-[1360px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-1">
            <div className="font-heading text-[36px] font-semibold text-[#15191E] leading-none">
              25+
            </div>
            <div className="text-[12px] font-mono text-[#7C8794] uppercase tracking-wider">
              Years Experience
            </div>
            <p className="font-body text-[13px] text-[#3A424C] m-0 pt-1 leading-snug">
              Deep expertise in hydraulic material handling machinery.
            </p>
          </div>

          <div className="space-y-1">
            <div className="font-heading text-[36px] font-semibold text-[#15191E] leading-none">
              25 m
            </div>
            <div className="text-[12px] font-mono text-[#7C8794] uppercase tracking-wider">
              Aerial Platform Height
            </div>
            <p className="font-body text-[13px] text-[#3A424C] m-0 pt-1 leading-snug">
              Custom-built truck-mounted and towable boom platforms.
            </p>
          </div>

          <div className="space-y-1">
            <div className="font-heading text-[36px] font-semibold text-[#15191E] leading-none">
              25 t / 12 m
            </div>
            <div className="text-[12px] font-mono text-[#7C8794] uppercase tracking-wider">
              Scissor Lift Range
            </div>
            <p className="font-body text-[13px] text-[#3A424C] m-0 pt-1 leading-snug">
              Hydraulic tables supporting up to 25 tons and 12 meters height.
            </p>
          </div>
        </div>
      </section>

      {/* 7.4 PROCESS TIMELINE */}
      <section
        className="w-full bg-[#F6F4F0] border-b border-[#D5CFC5]"
        style={{ padding: 'var(--section-y) var(--pad-x)' }}
      >
        <div className="w-full max-w-[1360px] mx-auto space-y-6">
          <h2
            className="font-heading text-[#15191E] m-0 font-semibold leading-[1.25]"
            style={{ fontSize: 'var(--fs-h2)' }}
          >
            Concept to Commissioning
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {processSteps.map((step) => (
              <div
                key={step.num}
                className="bg-white p-4 border border-[#D5CFC5] space-y-2 flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-[12px] text-[#7C8794] font-medium block">
                    {step.num}
                  </span>
                  <h4 className="font-heading text-[15px] font-semibold text-[#15191E] m-0 pt-1">
                    {step.title}
                  </h4>
                </div>
                <p className="font-body text-[12px] text-[#3A424C] leading-snug m-0 pt-2 border-t border-[#D5CFC5]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7.5 AFTER-SALES SERVICE BLOCK */}
      <section
        className="w-full bg-[#E8E4DD] border-b border-[#D5CFC5]"
        style={{ padding: 'var(--section-y) var(--pad-x)' }}
      >
        <div className="w-full max-w-[1360px] mx-auto space-y-4">
          <div className="flex items-center gap-2 text-[12px] font-mono text-[#7C8794] uppercase tracking-wider">
            <Wrench className="w-4 h-4 stroke-[1.5]" />
            <span>After-Sales Service Support</span>
          </div>

          <h3
            className="font-heading font-semibold text-[#15191E] m-0 leading-snug"
            style={{ fontSize: 'var(--fs-h3)' }}
          >
            {serviceText}
          </h3>

          <p className="font-mono text-[12px] text-[#3A424C] m-0">
            Dedicated Field Service Technicians &bull; Spares &bull; On-Site Maintenance
          </p>
        </div>
      </section>

      {/* 7.6 QUALITY POLICY QUOTE ON CHARCOAL */}
      <section
        className="w-full bg-[#15191E] text-[#F6F4F0]"
        style={{ padding: '56px var(--pad-x)' }}
      >
        <div className="w-full max-w-[1000px] mx-auto space-y-3">
          <p className="text-[12px] font-mono text-[#7C8794] m-0 uppercase tracking-wider">
            Quality Policy
          </p>

          <blockquote
            className="font-heading font-semibold text-[#F6F4F0] m-0 leading-[1.35]"
            style={{ fontSize: 'var(--fs-lead)' }}
          >
            &ldquo;We are committed to achieve total customer satisfaction by providing quality hydraulic material handling equipments on time through continual improvement in our processes.&rdquo;
          </blockquote>

          <p className="text-[12px] font-mono text-[#7C8794] m-0 pt-1">
            &mdash; Lift and Reach Equipments Charter, Chennai Works
          </p>
        </div>
      </section>
    </div>
  );
};
