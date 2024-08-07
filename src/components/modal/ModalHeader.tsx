import { XMarkIcon } from "@heroicons/react/16/solid";
import Button from "../ui/Button";

export default function ModalHeader({
   closeModal,
   title,
}: {
   title: string;
   closeModal: () => void;
}) {
   return (
      <div className="flex justify-between mb-[15px]">
         <h1 className="text-[22px] text-[#333] font-[500] mr-[10px] line-clamp-1">
            {title}
         </h1>
         <Button
            size={"clear"}
            className="p-[4px]"
            colors={"second"}
            onClick={closeModal}
         >
            <XMarkIcon className="w-[22px]" />
         </Button>
      </div>
   );
}
