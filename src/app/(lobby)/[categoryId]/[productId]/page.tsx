import { Metadata } from "next";
import { getProductDetail } from "@/libs/getProductDetail";
import { getAllCategories } from "@/libs/getAllCategory";
import SpecificationSection from "./_components/SpecificationSection";
import NoProduct from "@/components/NoProduct";
import { getAllProducts } from "@/libs/getAllProducts";
import DescriptionSection from "./_components/DesctiptionSection";
import CommentSection from "./_components/CommentSection";

export const revalidate = 86400;

type Params = {
  params: {
    productId: string;
    categoryId: string;
  };
};

export async function generateStaticParams() {
  const categories = await getAllCategories();

  if (!categories?.length) return [];
  const params: Params["params"][] = [];

  for await (const c of categories) {
    const data = await getAllProducts({ category_id: c.id });

    if (data) {
      const payload = data.products.map((p) => ({
        productId: p.id + "",
        // categoryId: c.id + "",
      })) as Params["params"][];

      params.push(...payload);
    }
  }

  return params;
}

export async function generateMetadata({
  params: { productId },
}: Params): Promise<Metadata> {
  const productDetail = await getProductDetail(productId);

  if (!productDetail)
    return {
      title: "Not found",
    };

  return {
    title: productDetail.product_name,
  };
}

export default async function ProductDetailPage({ params: { productId } }: Params) {
  const product = await getProductDetail(productId);
  const categories = await getAllCategories();

  const productCategory = categories?.find((c) => c.id === product?.category_id);

  const classes = {
    detailBody: "sm:flex items-start mx-[-10px]",
    detailLeft: "sm:w-1/3 px-[10px] flex-shrink-0 sm:sticky top-[10px]",
    detailRight: "mt-[30px] sm:mt-0 sm:flex-grow px-[10px]",
  };

  if (!product || !productCategory) return NoProduct({});

  return (
    <>
      <div className={classes.detailBody}>
        <div className={classes.detailLeft}>
          <SpecificationSection product={product} productCategory={productCategory} />
        </div>

        <div className={classes.detailRight}>
          <DescriptionSection product={product} />
        </div>
      </div>

      <CommentSection product={product} />
    </>
  );
}
