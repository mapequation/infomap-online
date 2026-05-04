import type { NextPage } from "next";
import dynamic from "next/dynamic";

const Infomap = dynamic(() => import("../features/infomap-runner"), {
  ssr: false,
});

const OnlinePage: NextPage = () => {
  return <Infomap />;
};

(OnlinePage as NextPage & { fillViewport?: boolean }).fillViewport = true;

export default OnlinePage;
