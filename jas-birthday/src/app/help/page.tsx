import Image from "next/image";
import bannerGuide from "@/Birthday Assets/banner-guide.png";
import pageGuide from "@/Birthday Assets/page-guide.png";
import { BannerPage } from "@/components/BannerPage";

export const dynamic = "force-dynamic";

type HelpPageProps = {
  searchParams?: {
    from?: string;
  };
};

export default function HelpPage({ searchParams }: HelpPageProps) {
  const from = searchParams?.from === "not-attending" ? "/not-attending" : "/attending";

  return (
    <BannerPage
      banner={bannerGuide}
      alt="Guide banner"
      closeHref={from}
    >
      <a
        href="/guide.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full w-full"
      >
        <div className="relative h-full w-full">
          <Image
            src={pageGuide}
            alt="Open guide"
            className="h-full w-full rounded-3xl object-contain"
            priority
          />
        </div>
      </a>
    </BannerPage>
  );
}
