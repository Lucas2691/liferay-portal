/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * The contents of this file are subject to the terms of the Liferay Enterprise
 * Subscription License ("License"). You may not use this file except in
 * compliance with the License. You can obtain a copy of the License by
 * contacting Liferay, Inc. See the License for the specific language governing
 * permissions and limitations under the License, including but not limited to
 * distribution rights of the Software.
 */
import DeveloperKeysLayouts from '../../components/DeveloperKeysLayout';
import {useCustomerPortal} from '../../context';

const DXPCloud = () => {
	const [{page, project}] = useCustomerPortal();
	// eslint-disable-next-line no-console
	console.log(page);

	return (
		<>
			<DeveloperKeysLayouts>
				<DeveloperKeysLayouts.Inputs
					accountKey={project.accountKey}
					dxpVersion={project.dxpVersion}
					page="dxp-cloud"
				></DeveloperKeysLayouts.Inputs>
			</DeveloperKeysLayouts>
		</>
	);
};

export default DXPCloud;
