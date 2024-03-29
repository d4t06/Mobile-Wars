import Skeleton from "@/components/Skeleton";

export default function Loading() {
  console.log("run category page loading");

  return (
    <div className="space-y-[10px]">
      {[...Array(5).keys()].map((item) => (
        <Skeleton key={item} className="h-[20px] w-[200px]" />
      ))}
    </div>
  );
}
