import React from "react";
import { Link } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

export default function ExternalLink({
  children,
  ...props
}: React.PropsWithChildren<any>) {
  return (
    <Link isExternal {...props}>
      {children} <ExternalLinkIcon mx="2px" />
    </Link>
  );
}
