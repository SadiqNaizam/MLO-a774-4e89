import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Card, CardContent } from "@/components/ui/card"; // Example, content might be MediaCards

// Define props if the carousel content is dynamic
// For example, if it takes an array of MediaCard props or fully rendered MediaCards
interface CarouselProps {
  items: React.ReactNode[]; // Array of items to display in the carousel
  title?: string; // Optional title for the carousel section
}

const Carousel: React.FC<CarouselProps> = ({ items, title }) => {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: 'start' },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  console.log("Rendering Carousel with title:", title, "and items:", items.length);

  return (
    <div className="py-4">
      {title && <h2 className="text-2xl font-semibold mb-4 px-4 md:px-0">{title}</h2>}
      <div className="embla overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex">
          {items.map((item, index) => (
            <div
              className="embla__slide flex-[0_0_80%] sm:flex-[0_0_40%] md:flex-[0_0_25%] lg:flex-[0_0_20%] min-w-0 pl-4"
              key={index}
            >
              {/* Each item in the carousel. This could be a MediaCard or any other component */}
              {/* Example of wrapping with a generic card for consistent spacing, but MediaCard itself would be better */}
              {item}
            </div>
          ))}
        </div>
      </div>
      {/* TODO: Add Prev/Next buttons if desired, styled with Doraemon theme */}
    </div>
  );
};
export default Carousel;