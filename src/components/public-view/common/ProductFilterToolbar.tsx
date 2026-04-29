'use client';

import Link from "next/link";
import { useGetAllCategoriesQuery } from "@/redux/features/category/category.api";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {cn} from "@/lib/utils";
import {usePathname} from "next/navigation";

const ProductFilterToolbar = () => {
    const pathname = usePathname();
    const { data: category } = useGetAllCategoriesQuery({});

    const categoryData = category?.data || [];

    const linkStyle =
        "flex items-center justify-between px-3 py-2 rounded-md text-sm transition-all duration-200 cursor-pointer " +
        "hover:bg-blue-50 hover:text-blue-600 no-underline hover:no-underline";

    return (
        <div className="w-full p-4 border rounded-xl bg-white shadow-sm">

            <p className="text-lg font-semibold mb-3">Filter Products</p>


            <Accordion type="single" collapsible className="w-full space-y-2">

                {/* CATEGORY */}
                <AccordionItem value="category">
                    <AccordionTrigger className="text-sm font-medium hover:no-underline cursor-pointer">
                        Category Filters
                    </AccordionTrigger>

                    <AccordionContent className="pt-2">
                        <div className="flex flex-col gap-1">

                            {categoryData.map((c: any) => {
                                const href = `/shop/category/${c?.slug}`;
                                const isActive = pathname === href;
                                return(
                                    <Link
                                        key={c._id}
                                        href={href}
                                        className={cn(linkStyle,
                                            isActive && "bg-blue-100 text-blue-600 font-medium"
                                        )}
                                        style={{ textDecoration: "none" }}
                                    >
                                        {c.title}
                                    </Link>
                                )
                            })}

                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default ProductFilterToolbar;