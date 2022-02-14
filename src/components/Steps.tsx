import { Grid, GridItem } from "@chakra-ui/react";
import { motion } from "framer-motion";
import React, { PropsWithChildren } from "react";

export function Steps({
  activeStep,
  children,
  ...props
}: PropsWithChildren<any>) {
  const numChildren = React.Children.count(children);

  return (
    <Grid
      templateColumns={`repeat(${numChildren}, 1fr)`}
      alignItems="center"
      justifyItems="center"
      borderWidth={1}
      borderRadius="md"
      borderColor="blackAlpha.300"
      boxShadow="sm"
      overflow="hidden"
      {...props}
    >
      {React.Children.map(children, (child, i) =>
        React.cloneElement(child, {
          key: i,
          index: i,
          numChildren,
          active: i === activeStep,
          completed: i < activeStep,
          ...child.props,
        })
      )}
    </Grid>
  );
}

export function Step({
  index,
  numChildren,
  active,
  completed,
  children,
  ...props
}: PropsWithChildren<any>) {
  const bg = {
    backgroundColor: completed
      ? "hsl(0, 0%, 100%)"
      : active
      ? "hsl(0, 0%, 95%)"
      : "hsl(0, 0%, 90%)",
  };
  const isLast = index === numChildren - 1;

  return (
    <GridItem
      pos="relative"
      w="100%"
      h="100%"
      borderRightWidth={isLast ? 0 : 1}
      borderColor="blackAlpha.300"
      {...props}
    >
      <motion.div
        initial={false}
        style={{
          height: "100%",
          padding: "0.5rem 1rem",
        }}
        animate={bg}
        transition={{ duration: 0.2, bounce: 0 }}
      >
        {!isLast && (
          <motion.div
            style={{
              zIndex: 2,
              position: "absolute",
              top: "calc(50% - 9px)",
              right: "-9.5px",
              width: "18px",
              height: "18px",
              transform: "rotate(45deg)",
              borderTopWidth: "1.4px",
              borderRightWidth: "1.4px",
            }}
            initial={false}
            animate={{
              ...bg,
              opacity: completed ? 1 : 0,
              right: completed ? "-9.5px" : "5px",
              borderColor: completed
                ? "var(--chakra-colors-blackAlpha-300)"
                : "hsla(0, 0%, 80%, 0)",
            }}
            transition={{ duration: 0.2, bounce: 0 }}
          />
        )}
        {children}
      </motion.div>
    </GridItem>
  );
}
