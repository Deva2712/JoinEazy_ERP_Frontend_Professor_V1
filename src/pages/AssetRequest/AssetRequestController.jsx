
import React from "react";
import { AssetRequestProvider } from "./context/AssetRequestContext";
import AssetRequestUI from "./AssetRequestUI";

/**
 * Entry point for the Asset Request module.
 *
 * Responsibilities:
 *  - Wrap the page in AssetRequestProvider (all state + API calls live there).
 *  - Render AssetRequestUI, which reads from context directly.
 *
 * Nothing else belongs here. Keep this file thin.
 */
const AssetRequestController = () => {
	return (
		<AssetRequestProvider>
			<AssetRequestUI />
		</AssetRequestProvider>
	);
};

export default AssetRequestController;