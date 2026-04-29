import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


export default function ReturnPolicy() {
    const triggerClass = "text-xl cursor-pointer transition-colors no-underline hover:no-underline hover:text-[rgb(221,141,35)] data-[state=open]:text-[rgb(221,141,35)]";
    const contentClass = "text-[16px] text-[#2D3436] h-auto"
  return (
    <div>
        <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Delivery & Return</h2>

              <div className="space-y-2">
                <Accordion
                  type="single"
                  collapsible
                  defaultValue="shipping"
                  className="max-w-lg"
                >
                  <AccordionItem value="shipping">
                    <AccordionTrigger className={triggerClass}>
                      My order hasn&apos;t arrived yet. Where is it?
                    </AccordionTrigger>
                    <AccordionContent className={contentClass}>
                     How can you evaluate content without design? No typography, no colors, no layout, no styles, all those things that convey the important signals that go beyond the mere textual, hierarchies of information, weight.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="returns">
                    <AccordionTrigger className={triggerClass}>
                      Do you deliver on public holidays?
                    </AccordionTrigger>
                    <AccordionContent className={contentClass}>
                      To short sentences, to many headings, images too large for the proposed design, or too small, or they fit in but it looks iffy for reasons the folks in the meeting can’t quite tell right now, but they’re unhappy, somehow.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="postcode">
                    <AccordionTrigger className={triggerClass}>
                     Do you deliver to my postcode?
                    </AccordionTrigger>
                    <AccordionContent className={contentClass}>
                      How can you evaluate content without design? No typography, no colors, no layout, no styles, all those things that convey the important signals that go beyond the mere textual, hierarchies of information, weight.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="nextday">
                    <AccordionTrigger className={triggerClass}>
                     Is next-day delivery available on all orders?
                    </AccordionTrigger>
                    <AccordionContent className={contentClass}>
                      To short sentences, to many headings, images too large for the proposed design, or too small, or they fit in but it looks iffy for reasons the folks in the meeting can’t quite tell right now, but they’re unhappy, somehow.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="signature">
                    <AccordionTrigger className={triggerClass}>
                     Do I need to be there to sign for delivery?
                    </AccordionTrigger>
                    <AccordionContent className={contentClass}>
                     How can you evaluate content without design? No typography, no colors, no layout, no styles, all those things that convey the important signals that go beyond the mere textual, hierarchies of information, weight.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
    </div>
  )
}
