import React from "react";

const LoaderPage = () => {
  return (
    <div className="fixed inset-0 bg-[#241f1f] z-[99999] flex items-center justify-center opacity-70">
      <div className=" w-10 h-10 border-4 border-dashed --tw-ring-color: rgb(243 244 246); border-[#5fd61f] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default LoaderPage;
