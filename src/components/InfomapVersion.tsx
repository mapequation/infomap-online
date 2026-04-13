import { useEffect, useState } from "react";
import { loadInfomapMetadata } from "../lib/infomap-client";

export default function InfomapVersion() {
  const [version, setVersion] = useState("");

  useEffect(() => {
    void loadInfomapMetadata().then(({ version }) => {
      setVersion(version);
    });
  }, []);

  return version;
}
