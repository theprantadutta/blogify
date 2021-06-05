import handler from '../../handler'

export default handler.post((req, res) => {
  req.session.destroy()
  res.status(200).json({
    ok: 'OK',
  })
})
