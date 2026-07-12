"use client";

import { useState, useEffect } from "react";

export interface BranchPublic {
  id: string;
  name: string;
  nameAr: string;
  address: string;
  addressAr: string;
  phone: string[];
  hours: string;
  hoursAr: string;
  pickupAvailable: boolean;
  active: boolean;
}

let cachedBranches: BranchPublic[] | null = null;
let fetchPromise: Promise<BranchPublic[]> | null = null;

export function useBranches(): BranchPublic[] {
  const [branches, setBranches] = useState<BranchPublic[]>(cachedBranches ?? []);

  useEffect(() => {
    if (cachedBranches) {
      setBranches(cachedBranches);
      return;
    }
    if (!fetchPromise) {
      fetchPromise = fetch("/api/branches/public")
        .then((r) => (r.ok ? r.json() : []))
        .then((data: BranchPublic[]) => {
          cachedBranches = data;
          return data;
        })
        .catch(() => {
          return [] as BranchPublic[];
        });
    }
    fetchPromise.then(setBranches);
  }, []);

  return branches;
}
