"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "./store";

export function useBranchFilter() {
  const { selectedBranch } = useCartStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return {
    branchId: selectedBranch || null,
    ready,
    isPickupMode: !!selectedBranch, // If a branch is selected, we're in pickup mode
  };
}
