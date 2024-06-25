import { Session } from "next-auth";
import LinkItem from "./LinkItem";
import { ComputerDesktopIcon } from "@heroicons/react/24/outline";

type Props = {
   categories: Category[];
};
export default function LinkList({ categories }: Props) {
   return (
      <>
         <div className="flex items-center space-x-[14px]">
            {categories.map((category, index) => (
               <LinkItem activeClass="font-[500]" key={index} href={"/" + category.id}>
                  {category.category_name}
               </LinkItem>
            ))}
         </div>

         {/* <div className="flex ml-[auto]">
            {session?.user.role === "ADMIN" && (
               <LinkItem href={"/dashboard"}>
                  <ComputerDesktopIcon className="w-[22px]" />
                  <span>Dashboard</span>
               </LinkItem>
            )}
         </div> */}
      </>
   );
}
