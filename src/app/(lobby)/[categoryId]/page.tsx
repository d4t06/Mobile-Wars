import NoProduct from "@/components/NoProduct";
import Button from "@/components/ui/Button";
import { getAllCategories } from "@/libs/getAllCategory";
import { getAllProducts } from "@/libs/getAllProducts";
import Link from "next/link";
import { Suspense } from "react";
import Loading from "./loading";
import ProductItem from "@/components/ProductItem";
import CategoryLabel from "./_components/CategoryLabel";
import { TagIcon } from "@heroicons/react/24/outline";
import Pagination from "@/components/Pagination";

export const revalidate = 86400;

type Params = {
  params: {
    categoryId: string;
  };
  searchParams: { page?: string; brand_id?: string[]; tag_id?: string[] };
};

export async function generateStaticParams() {
  const categories = await getAllCategories();

  if (!categories) return [];

  return categories.map((c) => ({ categoryId: c.id + "" }) as Params["params"]);
}

async function ProductList({
  category_id,
  page,
  ...rest
}: {
  category_id: string;
} & Params["searchParams"] & { page: string }) {
  const categories = await getAllCategories();

  const data = await getAllProducts({
    page,
    category_id,
    ...rest,
  });

  if (!data) return <NoProduct />;

  const isRemaining = data.page_size * data.page < data.count;

  const curCategory = categories?.find((c) => c.id === +category_id);
  const brandObj: Record<number, string> = {};
  curCategory?.brands.forEach((b) => {
    brandObj[b.id] = b.image_url;
  });

  return (
    <>
      {!!data.products.length && (
        <div className="mt-5 space-y-3">
          {data.products.map((p, index) => (
            <ProductItem
              href={`/product/${p.id}`}
              image_url={p.image_url || brandObj[p.brand_id]}
              key={index}
              product={p}
            />
          ))}
        </div>
      )}
      {!data.products.length && <NoProduct />}

      {!!data.products.length && (
        <Pagination
          href={`/${category_id}`}
          page={+page}
          isHasNextPage={isRemaining}
          query={rest}
        />
      )}
    </>
  );
}

async function BrandListServerSide({
  category_id,
  ...rest
}: {
  category_id: string;
} & Params["searchParams"]) {
  const categories = await getAllCategories();

  const curCategory = categories?.find((c) => c.id === +category_id);

  return (
    <div className="mt-3">
      <p className="faded-text">Brands:</p>

      <div className="flex flex-wrap gap-2 mt-1 text-sm">
        <Link
          href={{
            pathname: `/${category_id}`,
            query: { ...rest, brand_id: [], page: 1 },
          }}
        >
          <Button
            colors={"second"}
            size={"clear"}
            active={!rest.brand_id}
            className="py-2 px-3"
          >
            All
          </Button>
        </Link>

        {curCategory?.brands.map((b, index) => {
          let brandIds = [...(rest.brand_id || [])];

          if (brandIds.includes(b.id + ""))
            brandIds = brandIds.filter((id) => id !== b.id + "");
          else brandIds.push(b.id + "");

          return (
            <Link
              href={{
                pathname: `/${category_id}`,
                query: { ...rest, brand_id: brandIds, page: 1 },
              }}
              key={index}
            >
              <Button
                colors={"second"}
                size={"clear"}
                active={rest.brand_id?.includes(b.id + "")}
                className="py-2 px-3"
              >
                {b.brand_name}
              </Button>
            </Link>
          );
        })}
      </div>

      <p className="faded-text mt-3">Tags:</p>

      <div className="flex flex-wrap gap-2 mt-1 text-sm">
        <Link
          href={{
            pathname: `/${category_id}`,
            query: { ...rest, tag_id: [], page: 1 },
          }}
        >
          <Button
            colors={"second"}
            size={"clear"}
            active={!rest.tag_id}
            className="py-2 px-3"
          >
            All
          </Button>
        </Link>

        {curCategory?.tags.map((t, i) => {
          let tagIds = [...(rest.tag_id || [])];

          if (tagIds.includes(t.id + ""))
            tagIds = tagIds.filter((id) => id !== t.id + "");
          else tagIds.push(t.id + "");

          return (
            <Link
              key={i}
              href={{
                pathname: `/${category_id}`,
                query: { ...rest, tag_id: tagIds, page: 1 },
              }}
            >
              <Button
                active={rest.tag_id?.includes(t.id + "")}
                colors={"second"}
                size={"clear"}
                className="py-2 px-3"
              >
                <TagIcon className="w-5" />
                <span>{t.name}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default async function ProductPage({
  params: { categoryId },
  searchParams,
}: Params) {
  const page =
    typeof searchParams.page === "string" && +searchParams.page >= 1
      ? searchParams.page
      : "1";

  return (
    <>
      <CategoryLabel categoryId={categoryId} />

      <BrandListServerSide category_id={categoryId} {...searchParams} />

      <Suspense fallback={<Loading />}>
        <ProductList
          category_id={categoryId}
          brand_id={searchParams.brand_id}
          tag_id={searchParams.tag_id}
          page={page}
        />
      </Suspense>
    </>
  );
}
