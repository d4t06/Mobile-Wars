"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import MyInput, { inputClasses } from "./ui/MyInput";
import { generateId } from "@/utils/appHelper";
import Frame from "@/components/ui/Frame";
import AttributeGroup, { AttributeRef } from "./AttributeGroup";
import Button from "@/components/ui/Button";
import Box from "@/components/ui/Box";
import { publicRequest } from "@/utils/request";
import Modal from "@/components/modal";
import { ArrowPathIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useToast } from "@/stores/ToastContext";
import Gallery from "./Gallery";
import Image from "next/image";
import OverlayCTA from "./ui/OverlayCta";
import { runRevalidateTag } from "@/app/actions";

type Props = {
  categories: Category[];
};

type Modal = "gallery";

const initProduct = {
  category_id: 0,
  image_url: "",
  product_ascii: "",
  product_name: "",
} as ProductSchema;

const PRODUCT_URL = "/products";

export default function AddProductForm({ categories }: Props) {
  const [productData, setProductData] = useState<ProductSchema>(initProduct);
  const [curCategory, setCurCategory] = useState<Category>();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const openModalTarget = useRef<Modal | "">("");
  const nameRef = useRef(null);
  const attributeRefs = useRef<(AttributeRef | undefined)[]>([]);

  // use hooks
  const router = useRouter();
  const { setSuccessToast, setErrorToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const isLoading = isFetching || isPending;
  const ableToSubmit =
    isChange && productData.category_id && productData.product_name;

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
      const curCategory = categories.find((cat) => cat.id === value);

      if (!curCategory) return;
      setCurCategory(curCategory);
    }

    setIsChange(true);
    setProductData({ ...productData, [field]: value });
  };

  const handleOpenModal = (modal: Modal) => {
    openModalTarget.current = modal;
    setIsOpenModal(true);
  };

  const submitAttributes = async (
    type: "Add" | "Edit",
    product_id?: number
  ) => {
    const newAttributes: ProductAttributeSchema[] = [];
    for await (const attributeItem of attributeRefs.current) {
      const newData = await attributeItem?.submit();

      if (newData) {
        switch (type) {
          case "Add":
            // if no longer have product
            if (product_id === undefined)
              return setErrorToast("Product id is undefine");
            newData["product_id"] = product_id;
        }

        newAttributes.push(newData);
      }
    }

    await publicRequest.post(`${PRODUCT_URL}/attributes`, newAttributes);
  };

  const handleSubmit = async () => {
    if (
      !ableToSubmit ||
      productData.category_id === undefined ||
      !productData.product_name.trim()
    )
      return;

    try {
      setIsFetching(true);

      if (!curCategory) return setErrorToast();

      const data: ProductSchema = {
        category_id: curCategory.id,
        image_url: productData.image_url,
        product_ascii: generateId(productData.product_name),
        product_name: productData.product_name,
      };

      await publicRequest.post(PRODUCT_URL, data);
      await submitAttributes("Add");

      startTransition(() => {
        router.refresh();

        runRevalidateTag(`products-${curCategory.id}`);

        setSuccessToast("Add product successful");
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  const renderModal = useMemo(() => {
    if (!isOpenModal) return;
    if (!openModalTarget.current) return <p>Not thing to show</p>;

    switch (openModalTarget.current) {
      case "gallery":
        return (
          <Gallery
            setIsOpenModal={setIsOpenModal}
            setImageUrl={(value) => handleInput("image_url", value)}
          />
        );
    }
  }, [isOpenModal]);

  const classes = {
    label: "text-[18px] mb-[4px]",
  };

  return (
    <>
      <div className="flex items-center space-x-[8px]">
        <PencilSquareIcon className="w-[24px]" />
        <h1 className="text-[22px] font-[500]">Add new product</h1>
      </div>
      <div className="flex mx-[-8px] mt-[14px]">
        <div className="w-1/3 px-[8px]">
          {!productData.image_url ? (
            <Box onClick={() => handleOpenModal("gallery")} />
          ) : (
            <Box>
              <Image
                src={productData.image_url}
                width={500}
                height={500}
                alt="asd"
              />

              <OverlayCTA
                data={[
                  {
                    cb: () => handleOpenModal("gallery"),
                    icon: <ArrowPathIcon className="w-[22px]" />,
                    className: "bg-[#f1f1f1] p-[5px] rounded-[99px]",
                  },
                ]}
              />
            </Box>
          )}
        </div>

        <div className="flex-1">
          <div className="space-y-[14px] px-[8px]">
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
          </div>
        </div>
      </div>

      <div className="text-center">
        <Button
          onClick={handleSubmit}
          className="mt-[10px]"
          variant={"push"}
          isLoading={isLoading}
          disabled={!ableToSubmit}
        >
          Save
        </Button>
      </div>

      {isOpenModal && (
        <Modal setShowModal={setIsOpenModal}>{renderModal}</Modal>
      )}
    </>
  );
}
