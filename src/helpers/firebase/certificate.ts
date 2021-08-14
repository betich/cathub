import * as certSrc from './serviceAccountKey.json';

const cert = {
	projectId: certSrc["project_id"],
	privateKey: certSrc["private_key"]?.replace(/\\n/g, '\n'),
	clientEmail: certSrc["client_email"],
};

export default cert;
