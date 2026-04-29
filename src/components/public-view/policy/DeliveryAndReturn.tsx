"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import {Mail, MessageCircle, Phone, Send} from "lucide-react";
import Link from "next/link";

const faqList = [ { title : "My order hasn't arrived yet. Where is it?", description: ( <> <p>A client that's unhappy for a reason is a problem, a client that's unhappy though he or her can't quite put a finger on it is worse. Chances are there wasn't collaboration, communication, and checkpoints, there wasn't a process agreed upon or specified with the granularity required.</p> <p>It's content strategy gone awry right from the start. Forswearing the use of Lorem Ipsum wouldn't have helped, won't help now. It's like saying you're a bad designer, use less bold text, don't use italics in every other paragraph. True enough, but that's not all that it takes to get things back on track.</p> </> ) }, { title: "Do you deliver on public holidays?", description: "If that's what you think how bout the other way around? How can you evaluate content without design? No typography, no colors, no layout, no styles, all those things that convey the important signals that go beyond the mere textual, hierarchies of information, weight, emphasis, oblique stresses, priorities, all those subtle cues that also have visual and emotional appeal to the reader. Rigid proponents of content strategy may shun the use of dummy copy but then designers might want to ask them to provide style sheets with the copy decks they supply that are in tune with the design direction they require." }, { title: "Do you deliver to my postcode?", description: ( <> <p>A client that's unhappy for a reason is a problem, a client that's unhappy though he or her can't quite put a finger on it is worse. Chances are there wasn't collaboration, communication, and checkpoints, there wasn't a process agreed upon or specified with the granularity required.</p> <p>It's content strategy gone awry right from the start. Forswearing the use of Lorem Ipsum wouldn't have helped, won't help now. It's like saying you're a bad designer, use less bold text, don't use italics in every other paragraph. True enough, but that's not all that it takes to get things back on track.</p> </> ) }, { title: "Is next-day delivery available on all orders", description: "If that's what you think how bout the other way around? How can you evaluate content without design? No typography, no colors, no layout, no styles, all those things that convey the important signals that go beyond the mere textual, hierarchies of information, weight, emphasis, oblique stresses, priorities, all those subtle cues that also have visual and emotional appeal to the reader. Rigid proponents of content strategy may shun the use of dummy copy but then designers might want to ask them to provide style sheets with the copy decks they supply that are in tune with the design direction they require." }, { title : "Do I need to be there to sign for delivery?", description: ( <> <p>A client that's unhappy for a reason is a problem, a client that's unhappy though he or her can't quite put a finger on it is worse. Chances are there wasn't collaboration, communication, and checkpoints, there wasn't a process agreed upon or specified with the granularity required.</p> <p>It's content strategy gone awry right from the start. Forswearing the use of Lorem Ipsum wouldn't have helped, won't help now. It's like saying you're a bad designer, use less bold text, don't use italics in every other paragraph. True enough, but that's not all that it takes to get things back on track.</p> </> ) } ]

const DeliveryAndReturnPage = () => {
    return (
        <main className="bg-gray-100 min-h-screen p-4 md:p-6">
            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* LEFT CONTENT */}
                <div className="lg:col-span-3 space-y-6">

                    {/* HERO */}
                    <div className="bg-blue-600 text-white rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold mb-2">
                                Delivery & Return
                            </h1>
                            <p className="text-sm opacity-90 max-w-md">
                                Free delivery available on 1000s of products over $100.
                            </p>
                        </div>
                        <div className="hidden md:block text-3xl">📦📦📦</div>
                    </div>

                    {/* DELIVERY OVERVIEW */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Delivery Options Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 text-sm text-gray-600">

                            <p>
                                WoodMart offers ideal shipping methods for any requirement.
                            </p>

                            {/* STEPS */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                {[
                                    "Order Product",
                                    "Confirmation",
                                    "Wait Delivery",
                                    "Receive Order",
                                ].map((step, i) => (
                                    <div
                                        key={i}
                                        className="p-4 bg-gray-50 rounded-lg border"
                                    >
                                        <div className="text-2xl mb-2">📦</div>
                                        <p>{step}</p>
                                    </div>
                                ))}
                            </div>

                            {/* SMALL ITEMS */}
                            <div>
                                <h3 className="font-semibold mb-3 text-black">
                                    Small items
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card className={"pt-0"}>
                                        <CardHeader className={"p-0"}>
                                            <CardTitle className="text-white font-semibold bg-blue-700 px-5 py-3 rounded-t-2xl">
                                                Standard delivery Get it in 3-5 working days
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className={"space-y-5 text-[16px] text-gray-600"}>
                                            <div className={"flex justify-between"}>
                                                <p>Orders over $100: All day delivery. Order anytime:</p>
                                                <p>FREE</p>
                                            </div>
                                            <div className={"flex justify-between"}>
                                                <p>Orders under $100: All day delivery. Order anytime:</p>
                                                <p>From $5</p>
                                            </div>
                                            <div className={"flex justify-between"}>
                                                <p>Weekday time slot from 12noon - 5pm. Order by 9pm.</p>
                                                <p>$10</p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className={"pt-0"}>
                                        <CardHeader className={"p-0"}>
                                            <CardTitle className="text-white font-semibold bg-blue-700 px-5 py-3 rounded-t-2xl">
                                                Next day delivery Get it next day, 7 days a week
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className={"space-y-5 text-[16px] text-gray-600"}>
                                            <div className={"flex justify-between"}>
                                                <p>All day delivery. Order by 9pm.</p>
                                                <p>From $5</p>
                                            </div>
                                            <div className={"flex justify-between"}>
                                                <p>Weekday time slot from 12noon - 5pm. Order by 9pm.</p>
                                                <p>$10</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            {/* LARGE ITEMS */}
                            <div>
                                <h3 className="font-semibold mb-3 text-black">
                                    Large items
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card className={"pt-0"}>
                                        <CardHeader className={"p-0"}>
                                            <CardTitle className="text-white font-semibold bg-blue-700 px-5 py-3 rounded-t-2xl">
                                                Standard delivery Get it in 2 working days
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className={"space-y-5 text-[16px] text-gray-600"}>
                                            <div className={"flex justify-between"}>
                                                <p>All day Delivery from 7am - 8pm. Order anytime:</p>
                                                <p>From $20</p>
                                            </div>
                                            <div className={"flex justify-between"}>
                                                <p>Choose a time slot 7am - 11am, 9am - 1pm, 11am - 3pm, 1pm - 5pm. Order anytime:</p>
                                                <p>From $35</p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className={"pt-0"}>
                                        <CardHeader className={"p-0"}>
                                            <CardTitle className="text-white font-semibold bg-blue-700 px-5 py-3 rounded-t-2xl">
                                                Next day delivery it next day on weekdays
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className={"space-y-5 text-[16px] text-gray-600"}>
                                            <div className={"flex justify-between"}>
                                                <p>All day delivery from 7am - 8pm. Order by 7pm:</p>
                                                <p>From $30</p>
                                            </div>
                                            <div className={"flex justify-between"}>
                                                <p>Choose a time slot 7am - 11am, 9am - 1pm, 11am - 3pm, 1pm - 5pm. Order by 7pm:</p>
                                                <p>From $45</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                        </CardContent>
                    </Card>

                    {/* RETURNS */}
                    <Card>
                        <CardHeader>
                            <CardTitle className={"text-[20px] font-semibold"}>Exchange or Return of Goods</CardTitle>
                        </CardHeader>
                        <CardContent className="text-[16px] leading-7 text-gray-600 space-y-3">
                            <p>
                                f the product is of good quality, the buyer has the right to terminate the contract concluded at a distance within 14 days after its execution.
                            </p>
                            <p>
                                In order for the right to terminate the agreement to be preserved, the consumer needs to monitor the preservation of the products in their original state. If the device is destroyed, damaged or damaged through no fault of the customer, the customer is not deprived of the opportunity to terminate the contract. If the value has decreased due to unpacking the product or checking its functionality, this does not mean that the consumer cannot write a request for a refund.
                            </p>
                            <h3 className={"text-[20px] font-semibold"}>
                                The product is not accepted back if at least one of the components is missing:
                            </h3>
                            <ul className="list-disc pl-5">
                                <li>fully equipped equipment;</li>
                                <li>a receipt proving the fact of purchase in the WoodMart online store;</li>
                                <li>warranty card;</li>
                                <li>an act with a description of the defect drawn up by the service department.</li>
                            </ul>
                            <p>an act with a description of the defect drawn up by the service department.</p>
                        </CardContent>
                    </Card>

                    {/* FAQ */}
                    <Card>
                        <CardHeader>
                            <CardTitle>FAQs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible>
                                {faqList.map((item, index) => (
                                    <AccordionItem key={index} value={`item-${index}`}>
                                        <AccordionTrigger className="cursor-pointer text-lg font-medium data-[state=open]:text-yellow-500 hover:no-underline">
                                            {item.title}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-md text-gray-600 space-y-2 h-full leading-7">
                                            {typeof item.description === "string" ? (
                                                <p>{item.description}</p>
                                            ) : (
                                                item.description
                                            )}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT SIDEBAR (STICKY) */}
                <div className="lg:col-span-1">
                    <div className="space-y-6 lg:sticky lg:top-30">
                        <Card className="rounded-2xl bg-white border-none shadow-sm">
                            <CardContent className="p-6 space-y-6">

                                {/* Need Help */}
                                <div>
                                    <h2 className="text-xl font-semibold mb-5">Need a Help?</h2>

                                    <div className="space-y-4">

                                        {/* Phone */}
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white">
                                                <Phone size={18} />
                                            </div>
                                            <p className="text-base">(208) 555-0112</p>
                                        </div>

                                        {/* Messenger */}
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white">
                                                <MessageCircle size={18} />
                                            </div>
                                            <p className="text-base">Messenger</p>
                                        </div>

                                        {/* Telegram */}
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-sky-400 text-white">
                                                <Send size={18} />
                                            </div>
                                            <p className="text-base">Telegram</p>
                                        </div>

                                        {/* Email */}
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-500 text-white">
                                                <Mail size={18} />
                                            </div>
                                            <p className="text-base">Email: info@mail.com</p>
                                        </div>

                                    </div>
                                </div>

                                {/* Subscribe */}
                                <div>
                                    <h2 className="text-xl font-semibold mb-4">Subscribe us</h2>

                                    <div className="flex gap-3">

                                        <Link href={"#"}>
                                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-700 text-white font-bold">
                                                f
                                            </div>
                                        </Link>

                                        <Link href={"#"}>
                                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white font-bold">
                                                X
                                            </div>
                                        </Link>
                                        <Link href={"#"}>
                                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-600 text-white font-bold">
                                                p
                                            </div>
                                        </Link> <Link href={"#"}>
                                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                                                in
                                            </div>
                                        </Link>
                                    </div>
                                </div>

                            </CardContent>
                        </Card>


                    </div>
                </div>

                {/* FOOTER */}
                <Card className="col-span-1 lg:col-span-4">
                    <CardContent className="p-6 text-sm text-gray-600">
                        <h3 className="font-semibold mb-2 text-black">
                            Online store of electronics
                        </h3>
                        <p>
                            This is a demo footer content for your delivery page UI.
                        </p>
                    </CardContent>
                </Card>

            </div>
        </main>
    );
};

export default DeliveryAndReturnPage;