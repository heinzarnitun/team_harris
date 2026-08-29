import DiscoveryFilters from "@/components/DiscoveryFilters";
import ProductGrid from "@/components/ProductGrid";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
      <section className="rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-800 p-6 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
          EcoLoop neighborhood pulse
        </p>
        <h1 className="mt-2 max-w-2xl text-2xl font-bold leading-snug sm:text-3xl">
          Local Circular Impact: 1,240 kg CO2 saved this week in your area
        </h1>
        <p className="mt-2 max-w-xl break-words text-sm text-emerald-100">
          ဤအပတ် သင့်အနီးအနားတွင် စက်ဝိုင်းစီးပွားရေးမှ ကာဗွန်ဒိုင်အောက်ဆိုဒ် ၁,၂၄၀ ကီလိုဂရမ် သက်သာခဲ့သည်။
        </p>
      </section>

      <DiscoveryFilters />
      <ProductGrid />
    </div>
  );
}
