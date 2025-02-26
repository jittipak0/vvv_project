import EditContent from "@/components/EditContent";
import React, { Suspense } from "react";

export default function editContent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditContent />
    </Suspense>
  );
}
