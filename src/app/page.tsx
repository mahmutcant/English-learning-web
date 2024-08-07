import Image from "next/image";

export default function Home() {
  return (
    <div className="h-screen">
      <div className="h-1/3 bg-[#FAFAFC]">
        <div className="flex items-center"><span className="font-bold text-[50px] ml-20 text-black max-w-[300px]">Take Online Exam.</span></div>
      </div>
      <div className="h-1/3 bg-[#4A3AFF]">
        <div className="flex items-center"><span className="font-bold text-[50px] ml-20 text-black max-w-[300px]">Take Online Exam.</span></div>
      </div>
    </div>
  );
}
