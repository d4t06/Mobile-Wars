import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ProductItem from "./_components/ProductItem";
import { getAllCategories } from "@/libs/getAllCategory";
import AddProductButton from "./_components/AddProductButton";
import Search from "@/layout/_components/Search";
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/authOption";

export const revalidate = 0;

const getProducts = async () => {
   const res = await fetch(
      `${
         process.env.NEXT_PUBLIC_API_ENDPOINT || "https://nest-mobile.vercel.app/api"
      }/products?page=${1}`
   );
   if (!res.ok) return undefined;

   return (await res.json()) as { products: Product[] };
};

export default async function ProductManage() {
   const session = await getServerSession(nextAuthOptions);
   const categories = await getAllCategories();

   if (!session) return redirect("/signin");
   if (session.user.role !== "ADMIN") return redirect("/unauthorized");

   const data = await getProducts();

   if (!data || !categories) return <p className="text-center">Some thing went wrong</p>;

   return (
      <>
         <div className="flex justify-between">
            <h1 className="text-2xl">All products</h1>
            <AddProductButton categories={categories} />
         </div>
         <div className="mt-[20px] inline-block">
            <Search variant="dashboard" />
         </div>

         {!!data.products.length && (
            <div className="mt-[30px]">
               {data.products.map((p, index) => (
                  <div
                     key={index}
                     className="border-b mb-[10px] pb-[10px] last:border-none"
                  >
                     <ProductItem categories={categories} product={p} />
                  </div>
               ))}
            </div>
         )}
         {!data.products.length && <p className="text-center">...</p>}
      </>
   );
}
