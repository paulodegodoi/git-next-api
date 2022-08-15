import type { NextApiRequest, NextApiResponse } from 'next'
import { gitHubApi } from '../../lib/connect'

type Data = {
  list: []
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const response = await fetch(gitHubApi)
  const data = await response.json()

  res.status(200).json({
    list: data
  })
}
