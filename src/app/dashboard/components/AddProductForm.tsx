"use client";

import { useRef, useState } from "react";
import MyInput, { inputClasses } from "./MyInput";
import { generateId } from "@/utils/appHelper";
// import Modal from "@/components/modal";
import Frame from "@/components/ui/Frame";
import AttributeItem from "./AttributeItem";

type Props = {
   categories: Category[];
   product?: Product;
   type: "Add" | "Edit";
};

const getInitialProduct = (product?: Product) => {
   const initProduct: ProductSchema = {
      category_id: 0,
      image_url: "",
      product_ascii: "",
      product_name: "",
   };

   if (product) Object.assign(initProduct, product);

   return initProduct;
};

export default function AddProductForm({ categories, product, type }: Props) {
   const [productData, setProductData] = useState<ProductSchema>(() => getInitialProduct(product));
   const [curCategory, setCurCategory] = useState<Category>();
   // const [isOpenModal, setIsOpenModal] = useState(false);
   // const [isChange, setIsChange] = useState(false);

   const nameRef = useRef(null);

   const handleInput = (field: keyof typeof productData, value: any) => {
      // also set product_name_ascii
      if (field === "product_name") {
         return setProductData({
            ...productData,
            [field]: value,
            product_ascii: generateId(value),
         });
      }

      if (field === "category_id") {
         if (!value) return;
         const category = categories.find((c) => c.id === value);
         setCurCategory(category);

         if (!category) return;
      }

      setProductData({ ...productData, [field]: value });
   };

   const classes = {
      label: "text-[18px] mb-[4px]",
   };

   return (
      <>
         <div className="flex">
            <div className="w-1/3">
               <button>Chon anh</button>
            </div>

            <div className="flex-1 space-y-[14px]">
               <div className="flex flex-col">
                  <label className={classes.label} htmlFor="">
                     Tên sản phẩm
                  </label>
                  <MyInput
                     ref={nameRef}
                     name="name"
                     type="text"
                     value={productData.product_name}
                     cb={(value) => handleInput("product_name", value)}
                  />
               </div>

               <div className="flex flex-col mt-[14px]">
                  <label className={classes.label} htmlFor="">
                     Danh mục
                  </label>
                  <select
                     name="category"
                     value={productData.category_id}
                     onChange={(e) => handleInput("category_id", +e.target.value)}
                     className={inputClasses.input}
                  >
                     <option value={undefined}>- - -</option>
                     {!!categories.length &&
                        categories.map((category, index) => (
                           <option key={index} value={category.id}>
                              {category.category_name}
                           </option>
                        ))}
                  </select>
               </div>

               <div className="">
                  <label className={classes.label} htmlFor="">
                     Cấu hình
                  </label>
                  <Frame>
                     <div className="space-y-[10px]">
                        {curCategory &&
                           curCategory.attributes.map((attr, index) => (
                              <AttributeItem key={index} type={"Add"} categoryAttribute={attr} product={productData} />
                           ))}
                     </div>
                  </Frame>
               </div>

               <div className="text-center">
                  <button className="bg-[#cd1818]">Save</button>
               </div>
            </div>
         </div>

         {/* {isOpenModal && (
            <Modal setShowModal={setIsOpenModal}>
               <h1>Test</h1>
            </Modal>
         )} */}
      </>
   );
}