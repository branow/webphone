import { RequestBuilder, BACKEND_ORIGIN, handleApiError, logRequestResponse } from "./backend";
import { Auth } from "./auth";

export type Photo = {
  id: string;
}

export const QueryKeys = {
  photo: (id: string): string[] => ["photo", id],
}

export async function get(photo: string): Promise<string> {
  const { token } = await Auth().ensureAuthentication();
  const response = await new RequestBuilder()
    .url(u => u.origin(BACKEND_ORIGIN).path(`/api/photos/${photo}`))
    .get().bearer(token).fetch();
  return await response
    .any(logRequestResponse)
    .error(handleApiError)
    .handle((res) => res.blobUrl())
}

export async function upload(photo: File): Promise<Photo> {
  const { token } = await Auth().ensureAuthentication();

  const formData = new FormData();
  formData.append("photo", photo);

  const response = await new RequestBuilder()
    .url(u => u.origin(BACKEND_ORIGIN).path("/api/photos"))
    .post().bearer(token).body(formData).fetch();
  return await response
    .any(logRequestResponse)
    .error(handleApiError)
    .handle((res) => res.json<Photo>())
}

export default {
  QueryKeys,
  get,
  upload,
}
