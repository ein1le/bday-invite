import Image from "next/image";
import Link from "next/link";
import bannerWishlist from "@/Birthday Assets/banner-wishlist.png";
import { BannerPage } from "@/components/BannerPage";
import { TextCard } from "@/components/TextCard";
import { getProductsWithReservationState } from "@/lib/products";
import { getCurrentGuest } from "@/lib/current-guest";
import matchaSet from "@/Birthday Assets/icons/matcha-set.png";
import diorLipOil from "@/Birthday Assets/icons/dior-lip-oil.png";
import dancePassStudio808 from "@/Birthday Assets/icons/dance-pass-studio808.png";
import dancePassVentures from "@/Birthday Assets/icons/dance-pass-ventures.png";
import dancePassKmdc from "@/Birthday Assets/icons/dance-pass-kmdc.png";
import tennisBracelet from "@/Birthday Assets/icons/tennis-bracelet.png";
import pandoraCharm from "@/Birthday Assets/icons/pandora-charm.png";
import pandoraEarring from "@/Birthday Assets/icons/pandora-earring.png";
import jellycatBunny from "@/Birthday Assets/icons/jellycat-bunny.png";
import jellycatCloud from "@/Birthday Assets/icons/jellycat-cloud.png";
import hairPerfume from "@/Birthday Assets/icons/hair-perfume.png";
import hoops from "@/Birthday Assets/icons/hoops.png";
import amethystRing from "@/Birthday Assets/icons/amethyst-ring.png";
import neckPillow from "@/Birthday Assets/icons/neck-pillow.png";
import pillowcase from "@/Birthday Assets/icons/pillowcase.png";
import giftCard from "@/Birthday Assets/icons/gift-card.png";
import danceTop from "@/Birthday Assets/icons/dance-top.png";
import laneigeLipMask from "@/Birthday Assets/icons/laneige-lip-mask.png";
import magazine from "@/Birthday Assets/icons/magazine.png";
import controller from "@/Birthday Assets/icons/controller.png";
import spyxfamGame from "@/Birthday Assets/icons/spyxfam-game.png";
import type { StaticImageData } from "next/image";

const productImageMap: Record<string, StaticImageData> = {
  "src/Birthday Assets/icons/matcha-set.png": matchaSet,
  "src/Birthday Assets/icons/dior-lip-oil.png": diorLipOil,
  "src/Birthday Assets/icons/dance-pass-studio808.png": dancePassStudio808,
  "src/Birthday Assets/icons/dance-pass-ventures.png": dancePassVentures,
  "src/Birthday Assets/icons/dance-pass-kmdc.png": dancePassKmdc,
  "src/Birthday Assets/icons/tennis-bracelet.png": tennisBracelet,
  "src/Birthday Assets/icons/pandora-charm.png": pandoraCharm,
  "src/Birthday Assets/icons/pandora-earring.png": pandoraEarring,
  "src/Birthday Assets/icons/jellycat-bunny.png": jellycatBunny,
  "src/Birthday Assets/icons/jellycat-cloud.png": jellycatCloud,
  "src/Birthday Assets/icons/hair-perfume.png": hairPerfume,
  "src/Birthday Assets/icons/hoops.png": hoops,
  "src/Birthday Assets/icons/amethyst-ring.png": amethystRing,
  "src/Birthday Assets/icons/neck-pillow.png": neckPillow,
  "src/Birthday Assets/icons/pillowcase.png": pillowcase,
  "src/Birthday Assets/icons/gift-card.png": giftCard,
  "src/Birthday Assets/icons/dance-top.png": danceTop,
  "src/Birthday Assets/icons/laneige-lip-mask.png": laneigeLipMask,
  "src/Birthday Assets/icons/magazine.png": magazine,
  "src/Birthday Assets/icons/controller.png": controller,
  "src/Birthday Assets/icons/spyxfam-game.png": spyxfamGame,
};

export const dynamic = "force-dynamic";

type WishlistPageProps = {
  searchParams?: {
    from?: string;
  };
};

export default async function WishlistPage({ searchParams }: WishlistPageProps) {
  const guest = await getCurrentGuest();
  const products = await getProductsWithReservationState(guest?.id ?? null);

  const from = searchParams?.from === "not-attending" ? "/not-attending" : "/attending";

  return (
    <BannerPage
      banner={bannerWishlist}
      alt="Wishlist banner"
      closeHref={from}
    >
      <div className="mt-4 h-full min-h-0 overflow-y-auto pr-1">
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => {
            const image =
              (product.image_url &&
                productImageMap[product.image_url as string]) ||
              null;

            const hasPrice =
              typeof product.price === "number" && product.price > 0;
            const formattedPrice = hasPrice
              ? `£${product.price!.toFixed(2)}`
              : "NA";

            const href =
              product.link && product.link.trim().length > 0
                ? product.link.trim()
                : null;

            const card = (
              <TextCard className="flex flex-col items-center gap-2 text-center text-sm">
                <div className="font-semibold">{product.name}</div>
                {image ? (
                  <div className="relative w-full">
                    <Image
                      src={image}
                      alt={product.name}
                      className="h-auto w-full object-contain"
                    />
                  </div>
                ) : null}
                <div className="mt-1 text-xs">
                  Price: <span className="font-medium">{formattedPrice}</span>
                </div>
                <div className="mt-2 flex w-full gap-2">
                  <button
                    type="button"
                    className="btn-pink flex-1 text-xs"
                  >
                    Reserve
                  </button>
                  <button
                    type="button"
                    className="btn-pink flex-1 text-xs"
                  >
                    Split
                  </button>
                </div>
              </TextCard>
            );

            if (!href) {
              return (
                <div key={product.id}>
                  {card}
                </div>
              );
            }

            const isExternal = /^https?:\/\//i.test(href);

            return isExternal ? (
              <a
                key={product.id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {card}
              </a>
            ) : (
              <Link
                key={product.id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {card}
              </Link>
            );
          })}
        </div>
      </div>
    </BannerPage>
  );
}
