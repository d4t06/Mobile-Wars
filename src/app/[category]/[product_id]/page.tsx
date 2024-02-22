import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { getProductDetail } from "@/libs/getProductDetail";
import { getAllProducts } from "@/libs/getAllProducts";
import { getAllCategories } from "@/libs/getAllCategory";

type Params = {
  params: {
    product_id: string;
    category: string;
  };
};

export async function generateStaticParams({ params: { category } }: Params) {
  const categories = await getAllCategories();

  const targetCategory = categories.find(
    (cat) => cat.category_ascii === category
  );
  if (!targetCategory) return [];
  const data = await getAllProducts(1, targetCategory.id);

  return data.products.map((p) => ({
    product_id: p.product_ascii,
  }));
}

export async function generateMetadata({
  params: { product_id },
}: Params): Promise<Metadata> {
  const productDetail = await getProductDetail(product_id);

  if (!productDetail)
    return {
      title: "Some thing went wrong",
    };

  return {
    title: productDetail.product_name,
  };
}

export default async function ProductDetailPage({
  params: { product_id },
}: Params) {
  const productDetail = await getProductDetail(product_id);

  const attributeOrder =
    productDetail?.category.attributes_order.split("_") || [];

  const classes = {
    backBtn:
      "flex  items-center space-x-[6px] font-[500] text-[16px] text-[#333] hover:text-[#cd1818]",
    proName: "text-[22px] font-[500] text-[#333] leading-[1]",
    detailBody: "flex flex-wrap space-y-[20px] sm:space-y-0 mx-[-8px]",
    detailLeft: "w-full sm:w-1/4 px-[8px] flex-shrink-0",
    detailRight: "flex-grow px-[8px]",
    td: "group-even:bg-[#f1f1f1] px-[10px] py-[12px]",
  };

  if (!productDetail) return <p>Some thing went wrong</p>;

  return (
    <div className="space-y-[20px] pb-[30px]">
      <Link
        className={classes.backBtn}
        href={`/${productDetail.category.category_ascii}`}
      >
        <ChevronLeftIcon className="w-[18px]" />
        All products
      </Link>
      <h1 className={classes.proName}>{productDetail.product_name}</h1>
      <div className={classes.detailBody}>
        <div className={classes.detailLeft}>
          <Image
            src={productDetail.image_url}
            className="max-h-[40vh] w-auto mx-auto"
            width={500}
            height={500}
            alt="asd"
          />
        </div>
        <div className={classes.detailRight}>
          <>
            <table className="w-full">
              <tbody>
                {attributeOrder.map((orderItem, index) => {
                  const categoryAttribute =
                    productDetail.category.attributes.find(
                      (item) => item.attribute_ascii === orderItem
                    );
                  if (categoryAttribute === undefined) return;
                  const foundedValue = productDetail.attributes.find(
                    (attr) => attr.category_attribute_id == categoryAttribute.id
                  );

                  return (
                    <tr className=" group" key={index}>
                      <td
                        className={`${classes.td} w-[30%] text-[#666] font-[500] rounded-[6px_0_0_6px] text-[#666]"`}
                      >
                        {categoryAttribute.attribute_name}
                      </td>
                      <td
                        className={`${classes.td} leading-[2] rounded-[0_6px_6px_0] whitespace-break-spaces`}
                      >
                        {foundedValue?.value || "..."}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        </div>
      </div>
    </div>
  );
}
