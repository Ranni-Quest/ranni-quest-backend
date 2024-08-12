import GetSetting from '#usecases/get_setting'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class LoginController {
  constructor(private getSetting: GetSetting) {}

  async init({ auth, session, response }: HttpContext) {
    if (!(await auth.check())) {
      if (!(await auth.check())) {
        return response.status(401).json({ authenticated: false })
      }
    }
    session.regenerate()

    return response
      .status(200)
      .json({ ...auth.user?.$attributes, setting: await this.getSetting.execute() })
  }
}
