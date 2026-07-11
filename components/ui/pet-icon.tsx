import { Cat, Dog, Bird, Fish, Rabbit, Squirrel, Bug, PawPrint } from "lucide-react";
import type { PetType } from "@/types";

const iconMap: Record<PetType, React.ElementType> = {
  cats: Cat,
  dogs: Dog,
  birds: Bird,
  fish: Fish,
  rabbits: Rabbit,
  hamsters: Squirrel,
  reptiles: Bug,
  general: PawPrint,
};

interface PetIconProps {
  petType: PetType;
  size?: number;
  className?: string;
}

export function PetIcon({ petType, size = 24, className }: PetIconProps) {
  const Icon = iconMap[petType] ?? PawPrint;
  return <Icon size={size} className={className} />;
}
