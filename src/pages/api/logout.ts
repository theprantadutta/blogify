import handler from '../../util/handler'

export default handler().post(async (req, res) => {
  req.session.destroy()
  return res.status(200).json({ ok: 'OK' })
})
