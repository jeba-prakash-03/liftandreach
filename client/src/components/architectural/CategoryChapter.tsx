import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ArchitecturalImage } from './ArchitecturalImage';

interface CategoryChapterProps {
  number: string;
  name: string;
  slug: string;
  applicationSentence?: string;
  image: string;
  modelCount: number;
  reverse?: boolean;
}

export const CategoryChapter: React.FC<CategoryChapterProps> = ({
  number,
  name,
  slug,
  applicationSentence,
  image,
  modelCount,
  reverse = false
}) => {
  return (
    <div className="w-full py-10 sm:py-14 border-b border-[#D5CFC5]">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Visual Plate: 5 cols, 4:3, max 420px tall, rule 1.2 */}
        <div
          className={`lg:col-span-5 ${
            reverse ? 'lg:order-2' : 'lg:order-1'
          }`}
        >
          <div className="relative aspect-[4/3] max-h-[420px] w-full bg-[#E8E4DD] rounded-none overflow-hidden flex items-center justify-center p-6 sm:p-8">
            <ArchitecturalImage
              src={image}
              alt={name}
              natWidth={250}
              natHeight={250}
            />
          </div>
        </div>

        {/* Editorial Text Block: 5 cols, offset 1, vertically centered */}
        <div
          className={`lg:col-span-6 ${
            reverse ? 'lg:order-1 lg:col-start-1' : 'lg:order-2 lg:col-start-7'
          } space-y-4`}
        >
          <div className="space-y-1.5">
            <span className="font-mono text-xs text-[#7C8794] tracking-widest block font-medium">
              {number}
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-light text-[#15191E] tracking-tight leading-[1.12]">
              {name}
            </h3>
          </div>

          {applicationSentence && (
            <p className="font-body text-base text-[#3A424C] leading-relaxed max-w-xl">
              {applicationSentence}
            </p>
          )}

          <div className="pt-1">
            <Link
              to={`/products/${slug}`}
              className="group inline-flex items-center gap-2 text-sm font-medium text-[#1F4E96] hover:text-[#183E78] transition-colors"
            >
              <span className="hover-underline-expand">
                View range ({modelCount} {modelCount === 1 ? 'model' : 'models'})
              </span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 stroke-[1.25]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
