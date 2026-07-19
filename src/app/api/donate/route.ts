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

    const checkout = await polar.checkouts.create({
      products: [process.env.NEXT_PUBLIC_POLAR_DONATION_PRODUCT_ID],
      successUrl: `${origin}/donate/success?checkout_id={CHECKOUT_ID}`,
      amount: amountInCents,
      customerEmail: email || undefined,
      customerName: name || undefined,
      customFieldData: {
        message: message || undefined
      }
    });

    return NextResponse.json({ url: checkout.url });
  } catch (error) {
    console.error("Donation Checkout Error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
