import React, { memo } from "react";

const SkeletonCartItem = memo(() => (
  <div className="bg-white shadow rounded-lg p-4 animate-pulse h-32 mb-4"></div>
));

export default SkeletonCartItem;
