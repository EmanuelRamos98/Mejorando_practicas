const postPingController = (req, res) => {
    console.log(
        'consulta recibida en /ping de tipo post: ', req.body
    )
    res.json({
        status: 200,
        ok: true,
        message: 'pong',
    })
}
export default postPingController