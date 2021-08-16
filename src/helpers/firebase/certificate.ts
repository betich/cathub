// import * as certSrc from './serviceAccountKey.json';

/*
const cert = {
	projectId: certSrc["project_id"],
	privateKey: certSrc["private_key"]?.replace(/\\n/g, '\n'),
	clientEmail: certSrc["client_email"],
};
*/

const cert = {
	projectId: process.env.PROJECT_ID,
	privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
	clientEmail: process.env.CLIENT_EMAIL,
};

export default cert;
