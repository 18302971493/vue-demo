module.exports={
  //全局设置
    db_prefix: 'sparrow_admin_', //本地存储的key
    resCode:{// 响应code
        success: 200,
        faild: 400,
        faild_warning: 300,
        login_faild: 401,
        unauthorized: 403,
        server_error:500
    },

    oauth: {
      grant_type: 'password',
      client_id: 'sparrow-admin',
      client_secret: 'sparrow-admin'
    },
    //微服务ID
    SERVICE: {
        sys: '/sys',
        bus: '/bus',
        base: '/base',
        sparrow: '/sparrow'
    }
}
