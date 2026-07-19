import Link from "next/link";
import { Heart } from "lucide-react";

export default function DonateSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center container py-24">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500 mb-8">
          <Heart className="w-10 h-10 fill-current" />
        </div>
        
        <h1 className="text-3xl font-bold">Thank You!</h1>
        <p className="text-muted-foreground text-lg">
          Your support means the world to me. It helps me keep building cool things for the community.
        </p>

        <div className="pt-8">
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            Back to Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
