// import type { HttpContext } from '@adonisjs/core/http'

import User from '../../infrastructure/models/user.model.js'
import env from '#start/env'
import { HttpContext } from '@adonisjs/core/http'

export default class OAuthProviderCallbacksController {
  async init({ ally, params, auth, response }: HttpContext) {
    const driverInstance = ally.use(params.provider).stateless()

    if (driverInstance.accessDenied()) {
      return 'You have cancelled the login process'
    }

    if (driverInstance.stateMisMatch()) {
      return 'We are unable to verify the request. Please try again'
    }

    if (driverInstance.hasError()) {
      return driverInstance.getError()
    }

    const providerUser = await driverInstance.user()

    const user = await User.firstOrCreate(
      { discordId: providerUser.id },
      {
        discordId: providerUser.id,
        pseudo: providerUser.nickName,
      }
    )

    await auth.use('web').login(user)

    response.redirect(env.get('URL_REDIRECT')!)
  }
}
