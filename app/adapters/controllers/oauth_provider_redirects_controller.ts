import { HttpContext } from '@adonisjs/core/http'

export default class OAuthProviderRedirectsController {
  /**
   * redirect to the oauth provider
   * @param params
   * @return
   */
  async init({ ally, params, response }: HttpContext) {
    const url = await ally
      .use(params.provider)
      .stateless()
      .redirectUrl((request: any) => {
        request.scopes(['identify'])
      })
    return response.status(200).json({ url })
  }
}
