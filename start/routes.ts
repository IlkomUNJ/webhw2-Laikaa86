/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import router from '@adonisjs/core/services/router'
import type { HttpContext } from '@adonisjs/core/http'
import { middleware } from './kernel'

/**
 * Middleware to check if user is logged in
 */
async function requireLogin(ctx: HttpContext, next: () => Promise<void>) {
  const { session, response } = ctx

  if (!session.get('isLoggedIn')) {
    return response.redirect('/login')
  }

  await next()
}

// Public routes
router.get('/', async ({ view }: HttpContext) => {
  return view.render('pages/home')
})

router.get('/login', async ({ view }: HttpContext) => {
  return view.render('pages/login') 
})

router.post('/login', async ({ request, response, session }: HttpContext) => {
  const { email, password } = request.body()

  // TODO: Add proper validation and user lookup
  if (email === 'admin@example.com' && password === 'password') {
    session.put('isLoggedIn', true)
    return response.redirect('/cars')
  }

  return response.redirect('/login')
})

router.post('/logout', async ({ response, session }: HttpContext) => {
  session.forget('isLoggedIn')
  return response.redirect('/')
})

// Protected routes 
router.get('/cars', async ({ view }: HttpContext) => {
  return view.render('pages/cars')
}).use(requireLogin)

router.get('/infobuy', async ({ view }: HttpContext) => {
  return view.render('pages/infobuy')
}).use(requireLogin)

// 🏠 Route publik (login page)
router.on('/').render('pages/login')

// 🔐 Route login (cek username/password)
router.post('/login', async ({ request, response, session }: HttpContext) => {
  const { username, password } = request.only(['username', 'password'])

  if (username === 'admin' && password === '12345') {
    session.put('isLoggedIn', true)
    return response.redirect('/home')
  } else {
    session.flash({ error: 'Invalid credentials' })
    return response.redirect('/')
  }
})

// 🚪 Route logout
router.get('/logout', async ({ session, response }: HttpContext) => {
  session.forget('isLoggedIn')
  return response.redirect('/')
})

// 🚧 Group route yang butuh login
router
  .group(() => {
    router.on('/home').render('pages/home')
    router.on('/cars').render('pages/cars')
    router.on('/cart').render('pages/cart')
    router.on('/checkout').render('pages/checkout')
    router.on('/infobuy').render('pages/infobuy')
  })
  // 👇 Nah ini fix-nya: daftarkan middleware manual, bukan string “auth”
  .use(async (ctx, next) => {
    if (!ctx.session.get('isLoggedIn')) {
      return ctx.response.redirect('/')
    }
    await next()
  })
