import handler from '../../util/handler'

export default handler().get((req, res) => {
  const user = req.session.get('user')
  return res.status(200).json(user)
})
