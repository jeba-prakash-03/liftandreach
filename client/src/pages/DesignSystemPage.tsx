import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/architectural/Button';
import { SectionHeader } from '../components/architectural/SectionHeader';
import { ProductFigure } from '../components/architectural/ProductFigure';
import { CategoryChapter } from '../components/architectural/CategoryChapter';
import { ArrowRight, Search, FileText, Check, SlidersHorizontal } from 'lucide-react';

export const DesignSystemPage: React.FC = () => {
  return (
    <div className="w-full bg-[#F6F4F0] min-h-screen text-[#15191E] pb-32">
      <Helmet>
        <title>Design System — Premium Architectural | Lift and Reach</title>
      </Helmet>

      {/* 00 / COVER TITLE */}
      <section className="w-full pt-20 pb-16 px-6 sm:px-12 lg:px-24 border-b border-[#D5CFC5]">
        <div className="max-w-5xl space-y-4">
          <span className="text-xs font-mono uppercase tracking-[0.08em] text-[#7C8794]">
            DESIGN SYSTEM / SPECIFICATION 2.0
          </span>
          <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl font-light tracking-[-0.02em] text-[#15191E] leading-[1.02]">
            Premium Architectural
          </h1>
          <p className="font-body text-lg sm:text-xl text-[#3A424C] max-w-2xl pt-2">
            Minimal, full-width, photography-led design system for Lift and Reach Equipments.
            Quiet confidence, precise hairlines, and architectural pacing.
          </p>
        </div>
      </section>

      {/* 01 / COLOR TOKENS */}
      <section className="w-full py-16 px-6 sm:px-12 lg:px-24 border-b border-[#D5CFC5]">
        <SectionHeader
          label="01 / Tokens"
          title="Color Palette"
          subtitle="Warm stone, muted charcoal, and precise hairlines. Brand blue serves as the single primary accent."
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mt-10">
          {[
            { name: '--paper', hex: '#F6F4F0', desc: 'Main Surface' },
            { name: '--stone', hex: '#E8E4DD', desc: 'Alt Surface / Plates' },
            { name: '--stone-deep', hex: '#D5CFC5', desc: 'Hairline Borders' },
            { name: '--charcoal', hex: '#15191E', desc: 'Headings & Dark' },
            { name: '--graphite', hex: '#3A424C', desc: 'Secondary Body' },
            { name: '--steel', hex: '#7C8794', desc: 'Captions / Mono' },
            { name: '--brand-blue', hex: '#1F4E96', desc: 'Primary Action' },
            { name: '--brand-red', hex: '#C8202F', desc: 'Status Marker Only' }
          ].map((token) => (
            <div key={token.name} className="space-y-2">
              <div
                className="h-24 w-full rounded-[2px] border border-[#D5CFC5]"
                style={{ backgroundColor: token.hex }}
              />
              <div>
                <div className="font-mono text-xs font-medium text-[#15191E]">
                  {token.name}
                </div>
                <div className="font-mono text-[11px] text-[#7C8794]">
                  {token.hex}
                </div>
                <div className="text-[11px] text-[#3A424C] pt-0.5">
                  {token.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 02 / TYPOGRAPHY SCALE */}
      <section className="w-full py-16 px-6 sm:px-12 lg:px-24 border-b border-[#D5CFC5]">
        <SectionHeader
          label="02 / Typography"
          title="Type Hierarchy"
          subtitle="Manrope 300/500 for sentence-case headlines, Inter 400/500 for reading body, JetBrains Mono 400 for technical specs."
        />

        <div className="space-y-10 mt-10 divide-y divide-[#D5CFC5]">
          <div className="pt-6">
            <span className="font-mono text-xs text-[#7C8794] block mb-2">
              H1 Display (Manrope 300, clamp(44px, 7.2vw, 112px))
            </span>
            <div className="font-heading text-5xl sm:text-6xl lg:text-7xl font-light text-[#15191E] tracking-tight leading-none">
              A way to reach the goal.
            </div>
          </div>

          <div className="pt-6">
            <span className="font-mono text-xs text-[#7C8794] block mb-2">
              H2 Section (Manrope 300, 48px)
            </span>
            <div className="font-heading text-3xl sm:text-4xl lg:text-5xl font-light text-[#15191E] tracking-tight">
              Hydraulic Scissor Lift Platforms
            </div>
          </div>

          <div className="pt-6">
            <span className="font-mono text-xs text-[#7C8794] block mb-2">
              H3 Figure Title (Manrope 500, 24px)
            </span>
            <div className="font-heading text-xl sm:text-2xl font-medium text-[#15191E]">
              Pit Mounted / Floor Mounted
            </div>
          </div>

          <div className="pt-6">
            <span className="font-mono text-xs text-[#7C8794] block mb-2">
              Body Copy (Inter 400, 18px, Line-height 1.65)
            </span>
            <p className="font-body text-lg text-[#3A424C] max-w-3xl leading-relaxed">
              Lift and Reach Equipments specializes in custom industrial hydraulic lifts, material handling equipment, dock levelers, and aircraft jacks engineered to reach your manufacturing goals safely and reliably.
            </p>
          </div>

          <div className="pt-6">
            <span className="font-mono text-xs text-[#7C8794] block mb-2">
              Technical Model / Spec Code (JetBrains Mono 400, 13px)
            </span>
            <div className="font-mono text-sm text-[#15191E] tracking-tight">
              LRSLT-1.0T-1.5M / LRSLT-2.0T-3M / LRSLT-3.0T-4.5M
            </div>
          </div>
        </div>
      </section>

      {/* 03 / BUTTONS & LINKS */}
      <section className="w-full py-16 px-6 sm:px-12 lg:px-24 border-b border-[#D5CFC5]">
        <SectionHeader
          label="03 / Actions"
          title="Buttons & Text Links"
          subtitle="Quiet 2px radii, brand-blue primary background, sliding arrow indicators, and no uppercase yelling."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
          {/* Light Surface Actions */}
          <div className="p-8 bg-white border border-[#D5CFC5] space-y-6">
            <span className="text-xs font-mono uppercase tracking-wider text-[#7C8794] block">
              Light Surface
            </span>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary">Explore products</Button>
              <Button variant="primary" size="sm">Get a quote</Button>
              <Button variant="secondary">View full specifications</Button>
            </div>
          </div>

          {/* Dark Charcoal Surface Actions */}
          <div className="p-8 bg-[#15191E] border border-[#15191E] space-y-6">
            <span className="text-xs font-mono uppercase tracking-wider text-[#7C8794] block">
              Dark Charcoal Surface
            </span>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="inverse">Explore products</Button>
              <Button variant="inverse" size="sm">Contact us</Button>
              <button className="text-sm font-medium text-[#F6F4F0] border-b border-[#F6F4F0] hover:text-[#D5CFC5] hover:border-[#D5CFC5] py-1 cursor-pointer">
                Read engineering history &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 04 / PRODUCT FIGURE COMPONENT */}
      <section className="w-full py-16 px-6 sm:px-12 lg:px-24 border-b border-[#D5CFC5]">
        <SectionHeader
          label="04 / Component"
          title="Product Figure"
          subtitle="Rectangular 4:3 stone plate with multiply cutout blend, floor shadow, subtle hover lift, and quiet caption line."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          <ProductFigure
            id={1}
            name="Pit Mounted / Floor Mounted"
            code="LRSLT-1.0T-1.5M"
            slug="pit-mounted-floor-mounted"
            categorySlug="scissor-lift"
            image="/images/product/Scissor Lift- Pit Mounted.jpg"
            specs={{
              capacity: "1 - 3 ton",
              maxHeight: "1500 - 4500 mm",
              platform: "2000 x 1500 - 2500 x 2000 mm"
            }}
          />

          <ProductFigure
            id={2}
            name="Towable-Customized"
            code="LRSTW-0.3T-6.0"
            slug="towable-customized"
            categorySlug="scissor-lift"
            image="/images/product/scissor lift.jpg"
            specs={{
              capacity: "300 - 500 Kgs",
              maxHeight: "6000 - 11000 mm",
              platform: "2200 X 1000 mm"
            }}
          />

          <ProductFigure
            id={3}
            name="Scissor Lift - Self Propelled"
            code="LRSSP-0.3T-10M"
            slug="scissor-lift-self-propelled"
            categorySlug="scissor-lift"
            image="/images/product/Scissor Lift- Self Propelled.jpg"
            specs={{
              capacity: "300 - 400 Kgs",
              maxHeight: "8000 - 10000 mm",
              platform: "2250 X 1100 mm"
            }}
          />
        </div>
      </section>

      {/* 06 / CATEGORY CHAPTER COMPONENT */}
      <section className="w-full py-16 px-6 sm:px-12 lg:px-24 border-b border-[#D5CFC5]">
        <SectionHeader
          label="06 / Component"
          title="Category Chapter Section"
          subtitle="Full-bleed alternating narrative band (60% image width on stone plate, large typography, verified original application sentence)."
        />

        <div className="mt-8">
          <CategoryChapter
            number="01"
            name="Scissor Lift Platforms"
            slug="scissor-lift"
            applicationSentence="Designed for robust vertical lifting from ground level up to 4500 mm. Custom built configurations support capacities up to 25000 Kgs."
            image="/images/product/scissor lift.jpg"
            modelCount={12}
            reverse={false}
          />
        </div>
      </section>

      {/* 07 / ENGINEERING SPECIFICATION TABLE */}
      <section className="w-full py-16 px-6 sm:px-12 lg:px-24">
        <SectionHeader
          label="07 / Component"
          title="Engineering Datasheet Table"
          subtitle="Spacious hairlines, sticky header, JetBrains Mono numbers, and subtle row highlight."
        />

        <div className="mt-10 overflow-x-auto border border-[#D5CFC5] bg-white">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#E8E4DD] border-b border-[#D5CFC5] font-mono text-xs text-[#3A424C] uppercase tracking-wider">
                <th className="py-3 px-4 font-medium">Model Code</th>
                <th className="py-3 px-4 font-medium">Equipment Name</th>
                <th className="py-3 px-4 font-medium">Capacity</th>
                <th className="py-3 px-4 font-medium">Max Height</th>
                <th className="py-3 px-4 font-medium">Platform Size</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D5CFC5] font-body text-[#15191E]">
              {[
                {
                  code: 'LRSLT-1.0T-1.5M',
                  name: 'Pit Mounted / Floor Mounted',
                  cap: '1 TON',
                  ht: '1500 mm',
                  plat: '2000 x 1500 mm'
                },
                {
                  code: 'LRSLT-2.0T-3M',
                  name: 'Pit Mounted / Floor Mounted',
                  cap: '2 TONS',
                  ht: '3000 mm',
                  plat: '2500 x 1800 mm'
                },
                {
                  code: 'LRSLT-3.0T-4.5M',
                  name: 'Pit Mounted / Floor Mounted',
                  cap: '3 TONS',
                  ht: '4500 mm',
                  plat: '2500 x 2000 mm'
                },
                {
                  code: 'LRSSP-0.3T-10M',
                  name: 'Scissor Lift - Self Propelled',
                  cap: '300 Kgs',
                  ht: '10000 mm',
                  plat: '2250 x 1100 mm'
                }
              ].map((row, i) => (
                <tr key={i} className="hover:bg-[#F6F4F0] transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-[#1F4E96] font-medium">
                    {row.code}
                  </td>
                  <td className="py-3 px-4 font-medium text-[#15191E]">
                    {row.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-[#3A424C]">
                    {row.cap}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-[#3A424C]">
                    {row.ht}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-[#3A424C]">
                    {row.plat}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
