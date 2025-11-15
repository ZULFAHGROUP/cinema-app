"use client";
import { Skeleton } from "antd";

const Loader = ({ rows = 4 }: { rows?: number }) => {
  return (
    <div className="w-full p-4">
      <Skeleton
        active
        paragraph={{ rows }}
        title={{ width: "40%" }}
        className="rounded-lg"
      />
    </div>
  );
};

export default Loader;
