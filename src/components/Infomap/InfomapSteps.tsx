import { Box, HStack, Image, Text } from "@chakra-ui/react";
import { Step, Steps } from "../Steps";

export default function InfomapSteps({ activeStep }: { activeStep: number }) {
  return (
    <Steps activeStep={activeStep}>
      <Step>
        <HStack mx="auto" spacing={2} maxW="max-content" h="100%">
          <Image src="/infomap/images/step1.png" alt="" boxSize="48px" />
          <Box textAlign="center">
            <Text fontWeight={700} my={0}>
              Load network
            </Text>
            <Text fontSize="xs" my={0}>
              Edit network or load file
            </Text>
          </Box>
        </HStack>
      </Step>
      <Step>
        <HStack mx="auto" spacing={2} maxW="max-content" h="100%">
          <Image src="/infomap/images/step2.png" alt="" boxSize="48px" />
          <Box textAlign="center">
            <Text fontWeight={700} my={0}>
              Run Infomap
            </Text>
            <Text fontSize="xs" my={0}>
              Toggle parameters or add arguments
            </Text>
          </Box>
        </HStack>
      </Step>
      <Step>
        <HStack mx="auto" spacing={2} maxW="max-content" h="100%">
          <Image src="/infomap/images/step3.png" alt="" boxSize="48px" />
          <Box textAlign="center">
            <Text fontWeight={700} my={0}>
              Explore map!
            </Text>
            <Text fontSize="xs" my={0}>
              Save result or open in Network Navigator
            </Text>
          </Box>
        </HStack>
      </Step>
    </Steps>
  );
}
