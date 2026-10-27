import { handleApi } from "../../server/router";
import type { Env } from "../../server/env";

// Mọi yêu cầu /api/* do router tài khoản MeAI xử lý (xem server/router.ts)
export const onRequest: PagesFunction<Env> = ({ request, env }) => handleApi(request, env);
