import { Container, Grid, GridItem } from "@chakra-ui/react";
import { observer } from "mobx-react";
import useStore from "../../store";
import InfomapInputPanel from "./InfomapInputPanel";
import InfomapOutputPanel from "./InfomapOutputPanel";
import InfomapRunPanel from "./InfomapRunPanel";
import InfomapSteps from "./InfomapSteps";
import useInfomapController from "./useInfomapController";

export default observer(function InfomapOnline({
  toast,
}: {
  toast: (options: {
    title: string;
    description: string;
    status: "error";
  }) => void;
}) {
  const store = useStore();
  const controller = useInfomapController(store, toast);

  return (
    <Grid
      as={Container}
      maxW="96em"
      ref={store.mainView}
      templateAreas={{
        base: "'steps' 'input' 'inputMenu' 'console' 'output' 'outputMenu'",
        lg: "'steps steps steps' 'input console output' 'inputMenu empty outputMenu'",
        xl: "'start steps steps steps end' 'inputMenu input console output outputMenu'",
      }}
      templateColumns={{
        base: "1fr",
        lg: "1fr 2fr 1fr",
        xl: "1fr 2fr 4fr 2fr 1fr",
      }}
      mx="auto"
      gap="2rem"
    >
      <GridItem area="steps">
        <InfomapSteps activeStep={controller.activeStep} />
      </GridItem>

      <InfomapInputPanel
        activeInput={controller.activeInput}
        inputAccept={controller.inputAccept}
        inputValue={controller.inputValue}
        isRunning={
          controller.isRunning || controller.isLoading || !controller.isReady
        }
        onLoad={controller.onLoad}
        onSelectInput={store.setActiveInput}
        onTextChange={(value) =>
          controller.onInputChange(controller.activeInput)({
            name: store[controller.activeInput === "network"
              ? "network"
              : controller.activeInput === "cluster data"
              ? "clusterData"
              : "metaData"].name,
            value,
          })
        }
      />

      <InfomapRunPanel
        consoleContent={controller.consoleContent}
        isRunning={controller.isRunning || !controller.isReady}
        progress={controller.progress}
        run={controller.run}
      />

      <InfomapOutputPanel
        hasInfomapError={controller.hasInfomapError}
        isCompleted={controller.isCompleted}
        isRunning={controller.isRunning || !controller.isReady}
        onCopyClusters={controller.onCopyClusters}
        store={store}
      />
    </Grid>
  );
});
