import {
  Truck,
  Package,
  Clock,
  Shield,
  MapPinned,
} from "lucide-react";

export const COURIER_PROVIDERS = [
  {
    value: "STEADFAST",
    name: "Steadfast",
    description: "Reliable nationwide courier service",
    badge: "Popular",
    features: [
      {
        icon: Truck,
        title: "Express Delivery",
      },
      {
        icon: Package,
        title: "Live Tracking",
      },
      {
        icon: Clock,
        title: "Quick Pickup",
      },
      {
        icon: Shield,
        title: "Secure Delivery",
      },
    ],
  },

  {
    value: "PATHAO",
    name: "Pathao Courier",
    description: "Fast urban & nationwide delivery",
    badge: "Fast",
    features: [
      {
        icon: Truck,
        title: "Same Day Coverage",
      },
      {
        icon: Package,
        title: "Tracking Support",
      },
      {
        icon: Clock,
        title: "Fast Pickup",
      },
      {
        icon: MapPinned,
        title: "Wide Network",
      },
    ],
  },
];