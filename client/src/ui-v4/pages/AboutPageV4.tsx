import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useApp } from '../../context/AppContext';
import { PageBand } from '../components/PageBand';
import { ArrowRight, Wrench } from 'lucide-react';

export const AboutPageV4: React.FC = () => {
  const { openQuoteModal } = useApp();

  const paragraphs = [
    'Hydrelex Lift Systems is Hydraulic equipment Manufacturing Company, located in Sriperumbudur, Chennai, in the state of Tamil Nadu registered under the laws of "The Republic of India".',
    'Hydrelex Lift Systems has wide product expertise in design, development and manufacturing with more than 25 years of broad industrial experience in the field of manufacturing Hydraulics material handling equipments and Aerial access platforms.',
    'Hydrelex Lift Systems takes a product from the concept stage, all the way to the final product with superior quality. We understand various product development challenges that are typical to an industry. This helps us to address the entire product lifecycle, starting from feasibility study, through conceptual design, detailed design, analysis & simulation, manufacturing and testing.',
    'By extensive industrial best engineering practices, Hydrelex Lift Systems supports customers by analyzing their actual requirement to improve their productivity with our specially designed material handling hydraulic equipments.',
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
    <div className="w-full bg-[#F3F5F8] min-h-screen text-[#0B1220] selection:bg-[#2A62C9]/20 selection:text-[#0B1220]">
      <Helmet>
        <title>About Us | Hydrelex Lift Systems Chennai</title>
        <meta
          name="description"
          content="Learn about Hydrelex Lift Systems, custom hydraulic lift and material handling machinery manufacturer in Chennai with over 25 years of experience."
        />
      </Helmet>

      {/* -------------------------------------------------------------
          PAGEBAND
      ------------------------------------------------------------- */}
      <PageBand
        pill="ABOUT OUR COMPANY"
        title="Over 25 Years of"
        accentWord="Industrial Experience"
        subtitle="Hydraulic material handling equipment and aerial access platforms designed and manufactured in Chennai."
        heightClass="min-h-[220px]"
      />

      {/* -------------------------------------------------------------
          MAIN EDITORIAL & BENTO OVERVIEW
      ------------------------------------------------------------- */}
      <div className="w-full mx-auto px-[var(--pad-x)] py-12 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Narrative (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-[28px] p-8 sm:p-10 shadow-sm border border-[#E3E8F0] space-y-5">
            <div className="v4-pill-label mb-1">FOUNDATION & EXPERTISE</div>
            <h2 className="v4-mixed-heading text-[28px] sm:text-[34px] font-medium text-[#0B1220]">
              Manufacturing with <em className="accent">Rigorous Engineering Standards</em>
            </h2>

            <div className="space-y-4 text-[14px] text-[#6B7685] leading-relaxed pt-2">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            <div className="pt-4 border-t border-[#E3E8F0]">
              <button
                onClick={() => openQuoteModal()}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#0E1A33] text-white font-semibold text-[13px] hover:bg-black transition-colors"
              >
                <span>Discuss Your Requirement</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Bento Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Visual Plate Card */}
            <div className="bg-gradient-to-br from-[#123164] to-[#0A162B] rounded-[28px] p-6 text-white shadow-sm flex flex-col justify-between h-[360px] relative overflow-hidden group">
              <span className="text-white text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider self-start bg-white/10 backdrop-blur-md border border-white/20">
                Sriperumpudur, Chennai
              </span>

              <div className="relative w-full h-[200px] flex items-center justify-center my-auto">
                <picture>
                  <source srcSet="/images/cutout/aerial-800.webp" type="image/webp" />
                  <img
                    src="/images/cutout/aerial.webp"
                    alt="Aerial Access Platform"
                    className="max-h-[90%] max-w-[90%] object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                  />
                </picture>
                <div className="v4-floor-shadow" />
              </div>

              <div className="rounded-[18px] p-3 text-white text-[12px] flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/20">
                <span>Hydraulic Equipment Manufacturing</span>
                <span className="text-white/70">Chennai, Tamil Nadu</span>
              </div>
            </div>

            {/* Service Support Card */}
            <div className="bg-white rounded-[28px] p-7 shadow-sm border border-[#E3E8F0] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#2A62C9]/10 text-[#2A62C9] flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="text-[17px] font-semibold text-[#0B1220] tracking-tight">
                Dedicated After-Sales Service Team
              </h3>
              <p className="text-[13px] text-[#6B7685] leading-relaxed">
                {serviceText}
              </p>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------
            PROCESS STEPS (Bento Grid)
        ------------------------------------------------------------- */}
        <div className="bg-white rounded-[28px] p-8 sm:p-12 shadow-sm border border-[#E3E8F0] space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="v4-pill-label mb-2">ENGINEERING LIFECYCLE</div>
            <h2 className="v4-mixed-heading text-[28px] sm:text-[38px] font-medium text-[#0B1220]">
              From Concept to <em className="accent">Commissioning</em>
            </h2>
            <p className="mt-2 text-[14px] text-[#6B7685]">
              Every machine follows rigorous validation to ensure operational reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processSteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-[#F3F5F8] rounded-[22px] p-6 border border-[#E3E8F0] hover:border-[#2A62C9]/30 transition-colors"
              >
                <div className="text-[26px] font-semibold text-[#2A62C9] mb-2">{step.num}</div>
                <h3 className="text-[16px] font-semibold text-[#0B1220] mb-1">{step.title}</h3>
                <p className="text-[13px] text-[#6B7685] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
