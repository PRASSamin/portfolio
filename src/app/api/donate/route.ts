import { NextResponse } from "next/server";
import { polar } from "@/lib/polar";

export async function POST(req: Request) {
  try {
    const { amount, email, name, message } = await req.json();
    
    if (!process.env.NEXT_PUBLIC_POLAR_DONATION_PRODUCT_ID) {
      return NextResponse.json({ error: "Donation product ID not configured" }, { status: 500 });
    }

    // Convert dollars to cents for Polar API
    const amountInCents = Math.round(parseFloat(amount) * 100);
    const origin = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const checkoutPayload: any = {
      products: [process.env.NEXT_PUBLIC_POLAR_DONATION_PRODUCT_ID],
      successUrl: `${origin}/donate/success?checkout_id={CHECKOUT_ID}`,
      amount: amountInCents,
    };

    if (email) checkoutPayload.customerEmail = email;
    if (name) checkoutPayload.customerName = name;
    if (message) checkoutPayload.customFieldData = { message };

    const checkout = await polar.checkouts.create(checkoutPayload);

    return NextResponse.json({ url: checkout.url });
  } catch (error) {
    console.error("Donation Checkout Error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
