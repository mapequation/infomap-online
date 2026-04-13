import { GridItem, Progress } from "@chakra-ui/react";
import Console from "./Console";
import InputParameters from "./InputParameters";

export default function InfomapRunPanel({
  consoleContent,
  isRunning,
  progress,
  run,
}: {
  consoleContent: string;
  isRunning: boolean;
  progress: number;
  run: () => void;
}) {
  return (
    <GridItem area="console" className="run">
      <InputParameters loading={isRunning} onClick={run} mb="1rem" />

      <Console placeholder="Infomap output will be printed here">
        {consoleContent}
      </Console>
      {isRunning && (
        <Progress
          mx="5px"
          borderBottomRadius="md"
          pos="relative"
          bottom={0}
          size="xs"
          value={progress}
        />
      )}
    </GridItem>
  );
}
