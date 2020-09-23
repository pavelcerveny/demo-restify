import {Next, Response, Request} from "restify";
import {User} from "../modules/user/user.entity";
import App from "./server";


export const apiKeyAuthMiddleware = async (req: Request, res: Response, next: Next) => {
  
	const apiToken = req.header('x-api-key') || req.header('x-token');

	if (apiToken) {
		const user = await App.database.getRepository(User).findOne({
			access_token: apiToken
		});

		if (user) {
			return next();
		}
	}
	res.send(401, {message: 'Unauthorized'});
	return next(false);
}