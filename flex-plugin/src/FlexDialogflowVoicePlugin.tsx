import React from "react";
import * as Flex from "@twilio/flex-ui";
import { FlexPlugin } from "@twilio/flex-plugin";
import { CustomizationProvider } from "@twilio-paste/core/customization";
import VirtualAgentView from "./views/VirtualAgentView";
import { ContentFragmentConditionFunction, Tab } from "@twilio/flex-ui";

import { createI18n, I18nProvider, useI18n } from "react-simple-i18n";
import translation_en_us from "./languages/en-US/common.json";
import translation_ja_jp from "./languages/ja-JP/common.json";
import VirtualAgentData from "./views/VirtualAgentData";

const PLUGIN_NAME = "FlexDialogflowVoicePlugin";

export default class FlexDialogflowVoicePlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof Flex }
   */
  async init(flex: typeof Flex, manager: Flex.Manager): Promise<void> {
    // Add Paste
    flex.setProviders({
      PasteThemeProvider: CustomizationProvider,
    });

    /***********************
     *  Add localisation
     ***********************/
    const langData = {
      "en-US": translation_en_us,
      "ja-JP": translation_ja_jp,
      ja: translation_ja_jp,
    };

    const userLocale =
      navigator.languages && navigator.languages.length
        ? navigator.languages[0]
        : navigator.language;

    // Get the app locale by checking if a language has been configured or use default
    const appLocale = Object.hasOwn(langData, userLocale)
      ? userLocale
      : "en-US";

    // Add Localisation
    Flex.setProviders({
      CustomProvider: (RootComponent) => (props) => {
        return (
          <I18nProvider i18n={createI18n(langData, { lang: appLocale })}>
            <RootComponent {...props} />
          </I18nProvider>
        );
      },
    });

    /**********************
     *  TAB Attached data
     **********************/
    const shouldDisplayTab: ContentFragmentConditionFunction = (props) => {
      const t = props.task;
      if (t && t.attributes?.call_sid) return true;
      return false;
    };

    flex.TaskCanvasTabs.Content.add(
      <Tab
        uniqueName="virtual-agent-data"
        key="virtual-agent-data"
        label="Virtual Agent Data"
      >
        <VirtualAgentData />
      </Tab>,
      {
        sortOrder: -1,
        if: shouldDisplayTab,
      }
    );
    /**********************
     *  PANEL2 Transcript
     **********************/
    // Add the right hand panel if we see a call SID
    const shouldDisplayPanel: ContentFragmentConditionFunction = (props) => {
      const t = props.tasks.get(props.selectedTaskSid);
      if (t && t.attributes?.call_sid) return true;
      return false;
    };

    flex.AgentDesktopView.Panel2.Content.replace(
      <VirtualAgentView key="panel-replacement" />,
      {
        sortOrder: -1,
        if: shouldDisplayPanel,
      }
    );
  }
}
